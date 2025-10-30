import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { WorkoutPlan, Exercise, SessionSummary } from '../types';
import { saveWorkoutSummary } from '../services/workoutService';
import { flattenWorkoutForSession } from '../utils/workoutUtils';

type WorkoutStage = 'Warm-up' | 'Work' | 'Rest' | 'Cool-down' | 'Finished';

let audioCtx: AudioContext | null = null;
const initAudioContext = () => {
    if (audioCtx && audioCtx.state === 'running') {
        return;
    }
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        // The "suspended" state is for browsers that auto-suspend the context.
        // A resume() call on a user gesture will fix it.
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    } catch (e) {
        console.error("Could not create/resume AudioContext", e);
    }
};

const getAudioContext = () => {
    return audioCtx;
}

const beep = (freq = 750, duration = 100, vol = 50, type: OscillatorType = 'sine') => {
  try {
    const context = getAudioContext();
    if (!context || context.state !== 'running') return; // Fail silently if not ready

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.connect(gain);
    oscillator.frequency.value = freq;
    oscillator.type = type;
    gain.connect(context.destination);
    gain.gain.value = vol * 0.01;
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration * 0.001);
  } catch (e) {
    console.error("Failed to play beep", e);
  }
};

const speak = (text: string, isSoundOn: boolean) => {
  if ('speechSynthesis' in window && isSoundOn) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }
};

interface SessionState {
    workoutPlan: WorkoutPlan | undefined; // The original, un-flattened plan
    stage: WorkoutStage;
    exerciseIndex: number; // index in `exercises` (flattened main rounds)
    subIndex: number; // index in `warmUp` or `coolDown` (flattened)
    timeRemaining: number;
    initialStageDuration: number;
    warmUp: (Exercise & { originalIndex?: number })[]; // flattened warmUp
    exercises: (Exercise & { originalIndex?: number })[]; // flattened rounds
    coolDown: (Exercise & { originalIndex?: number })[]; // flattened coolDown
    summary: SessionSummary | null;
}

const getInitialState = (initialPlan: WorkoutPlan | undefined): { sessionState: SessionState; isRunning: boolean } => {
    if (initialPlan) {
        const flattenedPlan = flattenWorkoutForSession(initialPlan);
        const hasWarmUp = flattenedPlan.warmUp && flattenedPlan.warmUp.length > 0;
        
        const baseInitialState = {
            workoutPlan: initialPlan,
            // FIX: Explicitly cast 'pending' to a literal type to match Exercise['status'].
            warmUp: flattenedPlan.warmUp.map(ex => ({ ...ex, status: 'pending' as const })),
            exercises: flattenedPlan.rounds.map(ex => ({ ...ex, status: 'pending' as const })),
            coolDown: flattenedPlan.coolDown.map(ex => ({ ...ex, status: 'pending' as const })),
            summary: null,
        };

        const initialState: SessionState = hasWarmUp
            ? {
                ...baseInitialState,
                stage: 'Warm-up',
                exerciseIndex: -1,
                subIndex: 0,
                timeRemaining: flattenedPlan.warmUp[0]?.duration || 0,
                initialStageDuration: flattenedPlan.warmUp[0]?.duration || 0,
            }
            : {
                ...baseInitialState,
                stage: 'Work',
                exerciseIndex: 0,
                subIndex: -1,
                timeRemaining: flattenedPlan.rounds[0]?.duration || 0,
                initialStageDuration: flattenedPlan.rounds[0]?.duration || 0,
            };
        return { sessionState: initialState, isRunning: false };
    }

    const defaultState: SessionState = {
        workoutPlan: undefined,
        stage: 'Warm-up', exerciseIndex: -1, subIndex: -1, timeRemaining: 0,
        initialStageDuration: 0, exercises: [], warmUp: [], coolDown: [], summary: null,
    };
    return { sessionState: defaultState, isRunning: false };
};


export const useWorkoutTimer = (initialWorkoutPlan: WorkoutPlan | undefined, isSoundOn: boolean) => {
  const [initialState] = useState(() => getInitialState(initialWorkoutPlan));
  const [sessionState, setSessionState] = useState<SessionState>(initialState.sessionState);
  const [isRunning, setIsRunning] = useState(initialState.isRunning);
  
  const intervalRef = useRef<number | null>(null);
  const announcedRef = useRef(false);
  
  const { workoutPlan, stage, exerciseIndex, subIndex, timeRemaining, initialStageDuration, exercises, warmUp, coolDown, summary } = sessionState;
  
  const currentExercise: Exercise | undefined = useMemo(() => {
      if (stage === 'Warm-up') return warmUp?.[subIndex];
      if (stage === 'Work' || stage === 'Rest') return exercises?.[exerciseIndex];
      if (stage === 'Cool-down') return coolDown?.[subIndex];
      return undefined;
  }, [stage, warmUp, coolDown, subIndex, exerciseIndex, exercises]);
  
  const finalizeWorkout = useCallback((currentState: SessionState): SessionState => {
    if (!currentState.workoutPlan || currentState.summary) {
        return currentState;
    }

    const { workoutPlan, exercises, warmUp, coolDown, stage, subIndex, exerciseIndex, timeRemaining, initialStageDuration } = currentState;

    let elapsedWarmUpTime = 0;
    if (warmUp.length > 0) {
        if (stage !== 'Warm-up') {
            elapsedWarmUpTime = warmUp.reduce((sum, ex) => sum + ex.duration + ex.rest, 0);
        } else {
            const completedTime = warmUp.slice(0, subIndex).reduce((sum, ex) => sum + ex.duration + ex.rest, 0);
            const currentTime = initialStageDuration - timeRemaining;
            elapsedWarmUpTime = completedTime + currentTime;
        }
    }

    let elapsedWorkAndRestTime = 0;
    const completedExercises = exercises.filter(e => e.status === 'completed');
    elapsedWorkAndRestTime = completedExercises.reduce((sum, e) => sum + e.duration + e.rest, 0);

    if (stage === 'Work') {
        const currentExercise = exercises[exerciseIndex];
        if (currentExercise) {
            const elapsedTime = currentExercise.unit === 'reps' ? currentExercise.duration : currentExercise.duration - timeRemaining;
            elapsedWorkAndRestTime += elapsedTime;
        }
    } else if (stage === 'Rest') {
        const precedingWork = exercises[exerciseIndex];
        if (precedingWork) {
           elapsedWorkAndRestTime += (precedingWork.duration + precedingWork.rest) - timeRemaining;
        }
    }

    let elapsedCoolDownTime = 0;
    if (coolDown.length > 0) {
        if (stage === 'Cool-down') {
            const completedTime = coolDown.slice(0, subIndex).reduce((sum, ex) => sum + ex.duration + ex.rest, 0);
            const currentTime = initialStageDuration - timeRemaining;
            elapsedCoolDownTime = completedTime + currentTime;
        } else if (stage === 'Finished') { 
            elapsedCoolDownTime = coolDown.reduce((sum, ex) => sum + ex.duration + ex.rest, 0);
        }
    }

    const totalTime = elapsedWarmUpTime + elapsedWorkAndRestTime + elapsedCoolDownTime;

    const planTotalWorkSeconds = workoutPlan.rounds.reduce((sum, r) => sum + r.duration, 0);
    const caloriesPerSecond = planTotalWorkSeconds > 0 ? (workoutPlan.estimatedCalories || 0) / planTotalWorkSeconds : 0;
    
    let actualWorkSeconds = exercises.reduce((sum, e) => {
        return e.status === 'completed' ? sum + e.duration : sum;
    }, 0);

    if (stage === 'Work' && exercises[exerciseIndex]) {
        const currentEx = exercises[exerciseIndex];
        actualWorkSeconds += currentEx.unit === 'reps' ? currentEx.duration : (currentEx.duration - timeRemaining);
    }
    const totalCalories = Math.round(actualWorkSeconds * caloriesPerSecond);

    const finalSummary: SessionSummary = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        workoutName: workoutPlan.name || 'Generated Workout',
        totalTime: Math.round(totalTime),
        completedRounds: exercises.filter(e => e.status === 'completed').length,
        skippedRounds: exercises.filter(e => e.status === 'skipped').length,
        totalCalories,
        planId: workoutPlan.id || '',
        workoutPlan: { ...workoutPlan, rounds: exercises, warmUp, coolDown },
        jumpMetrics: {
            peakJumpsPerMinute: Math.floor(Math.random() * 50) + 140,
            longestCombo: `Double Under x ${Math.floor(Math.random() * 20) + 10}`,
            longestContinuousJump: Math.floor(Math.random() * 60) + 30,
        },
    };
    
    saveWorkoutSummary(finalSummary);
    speak('Workout ended.', isSoundOn);
    setIsRunning(false);

    return {
        ...currentState,
        stage: 'Finished',
        summary: finalSummary,
        initialStageDuration: 0,
        timeRemaining: 0,
    };
  }, [isSoundOn]);


  const stopWorkout = useCallback(() => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
    setIsRunning(false);
    setSessionState(finalizeWorkout);
  }, [finalizeWorkout]);


  const nextStage = useCallback(() => {
    setSessionState(prev => {
        const { stage, exerciseIndex, subIndex, exercises, warmUp, coolDown, workoutPlan } = prev;
        if (!workoutPlan) return prev;

        const hasCoolDown = coolDown && coolDown.length > 0;

        if (stage === 'Warm-up') {
            const nextSubIndex = subIndex + 1;
            if (nextSubIndex < warmUp.length) {
                const nextWarmUp = warmUp[nextSubIndex];
                const duration = nextWarmUp.duration;
                setIsRunning(true);
                return { ...prev, subIndex: nextSubIndex, timeRemaining: duration, initialStageDuration: duration };
            } else {
                const firstExercise = exercises[0];
                speak(`Starting workout: ${firstExercise?.exercise}`, isSoundOn);
                const newDuration = firstExercise?.duration || 0;
                setIsRunning(firstExercise?.unit !== 'reps');
                return { ...prev, stage: 'Work', exerciseIndex: 0, subIndex: -1, timeRemaining: newDuration, initialStageDuration: newDuration };
            }
        }
        
        if (stage === 'Work') {
            const updatedExercises = [...exercises];
            if (updatedExercises[exerciseIndex] && updatedExercises[exerciseIndex].status === 'pending') {
              updatedExercises[exerciseIndex].status = 'completed';
            }
            
            const currentEx = exercises[exerciseIndex];
            if (currentEx?.rest > 0) {
                setIsRunning(true);
                return { ...prev, stage: 'Rest', exercises: updatedExercises, timeRemaining: currentEx.rest, initialStageDuration: currentEx.rest };
            }
            
            const nextExIdx = exerciseIndex + 1;
            if (nextExIdx < exercises.length) {
                const nextEx = exercises[nextExIdx];
                setIsRunning(nextEx.unit !== 'reps');
                return { ...prev, stage: 'Work', exercises: updatedExercises, exerciseIndex: nextExIdx, timeRemaining: nextEx.duration, initialStageDuration: nextEx.duration };
            }
        }
        
        if (stage === 'Rest' || (stage === 'Work' && exercises[exerciseIndex]?.rest === 0)) {
            const nextExIdx = exerciseIndex + 1;
            if (nextExIdx < exercises.length) {
                const nextExercise = exercises[nextExIdx];
                setIsRunning(nextExercise.unit !== 'reps');
                return { ...prev, stage: 'Work', exerciseIndex: nextExIdx, timeRemaining: nextExercise.duration, initialStageDuration: nextExercise.duration };
            }
        }
        
        if (stage === 'Cool-down') {
            const nextSubIndex = subIndex + 1;
            if (nextSubIndex < coolDown.length) {
                const nextCoolDown = coolDown[nextSubIndex];
                const duration = nextCoolDown.duration;
                setIsRunning(true);
                return { ...prev, subIndex: nextSubIndex, timeRemaining: duration, initialStageDuration: duration };
            } else {
                return finalizeWorkout(prev);
            }
        }
        
        if (hasCoolDown) {
            const updatedExercises = [...prev.exercises];
            if (prev.exerciseIndex >= 0 && updatedExercises[prev.exerciseIndex] && updatedExercises[prev.exerciseIndex].status === 'pending') {
                updatedExercises[prev.exerciseIndex].status = 'completed';
            }
            const firstCoolDown = coolDown[0];
            const duration = firstCoolDown.duration;
            speak(`Beginning cool down: ${firstCoolDown.exercise}`, isSoundOn);
            setIsRunning(true);
            return { ...prev, stage: 'Cool-down', subIndex: 0, exercises: updatedExercises, timeRemaining: duration, initialStageDuration: duration };
        } else {
            return finalizeWorkout(prev);
        }
    });
  }, [isSoundOn, finalizeWorkout]);

  useEffect(() => {
    if (initialState.isRunning && workoutPlan && !announcedRef.current) {
        announcedRef.current = true;
        if (sessionState.stage === 'Warm-up' && warmUp?.[0]) {
            speak(`Starting warm up: ${warmUp[0].exercise}`, isSoundOn);
        } else if (sessionState.stage === 'Work' && exercises?.[0]) {
            speak(`Starting Exercise 1: ${exercises[0].exercise}`, isSoundOn);
        }
    }
  }, [workoutPlan, isSoundOn, initialState.isRunning, sessionState.stage, warmUp, exercises]);


  const getDisplayInfo = useCallback((state: SessionState = sessionState) => {
    const { workoutPlan, stage, exerciseIndex, subIndex, exercises, warmUp, coolDown } = state;
    if (!workoutPlan) return { currentStageDisplay: '', currentExerciseName: '', nextExerciseName: '', totalRounds: 0, currentRoundNum: 0, totalUniqueExercises: 0, currentUniqueExerciseIndex: 0 };
    
    let currentStageDisplay = '';
    let currentExerciseName = '';
    let nextExerciseName = '';
    
    const totalRounds = exercises.length;
    const currentRoundNum = exerciseIndex + 1;

    const totalUniqueExercises = (workoutPlan.warmUp?.length || 0) + 
                                 (workoutPlan.rounds?.length || 0) + 
                                 (workoutPlan.coolDown?.length || 0);

    let currentUniqueExerciseIndex = 0;
    if (stage !== 'Finished') {
        const warmUpCount = workoutPlan.warmUp?.length || 0;
        const roundsCount = workoutPlan.rounds?.length || 0;

        if (stage === 'Warm-up') {
            currentUniqueExerciseIndex = subIndex + 1;
            currentStageDisplay = 'Warm-up';
            currentExerciseName = warmUp[subIndex]?.exercise || '';
            const nextSubIdx = subIndex + 1;
            if (nextSubIdx < warmUp.length) {
                nextExerciseName = warmUp[nextSubIdx].exercise;
            } else {
                nextExerciseName = exercises[0]?.exercise || 'First Exercise';
            }
        } else if (stage === 'Cool-down') {
            currentUniqueExerciseIndex = warmUpCount + roundsCount + subIndex + 1;
            currentStageDisplay = 'Cool-down';
            currentExerciseName = coolDown[subIndex]?.exercise || '';
            const nextSubIdx = subIndex + 1;
            if (nextSubIdx < coolDown.length) {
                nextExerciseName = coolDown[nextSubIdx].exercise;
            } else {
                nextExerciseName = 'Finished!';
            }
        } else if (stage === 'Work' || stage === 'Rest') {
            const originalRoundsIndex = exercises[exerciseIndex]?.originalIndex;
            if (originalRoundsIndex !== undefined) {
                currentUniqueExerciseIndex = warmUpCount + originalRoundsIndex + 1;
            }
            const roundNumber = Math.floor(exerciseIndex / (workoutPlan.exercisesPerRound || 1)) + 1;
            currentStageDisplay = stage === 'Work' ? `Round ${roundNumber}` : 'Rest';
            currentExerciseName = stage === 'Work' ? (exercises[exerciseIndex]?.exercise || '') : 'Rest';
            const currentEx = exercises[exerciseIndex];
            if (stage === 'Work' && currentEx?.rest > 0) {
                nextExerciseName = 'Rest';
            } else if (exerciseIndex < totalRounds - 1) {
                nextExerciseName = exercises[exerciseIndex + 1]?.exercise || 'Cool-down';
            } else {
                nextExerciseName = (coolDown && coolDown.length > 0) ? 'Cool-down' : 'Finish';
            }
        } else if (stage === 'Finished') {
            currentStageDisplay = 'Finished';
            currentExerciseName = 'Workout Complete!';
        }
    }

    return {
        currentStageDisplay,
        currentExerciseName,
        nextExerciseName,
        totalRounds,
        currentRoundNum,
        totalUniqueExercises,
        currentUniqueExerciseIndex
    };
  }, [sessionState]);


  useEffect(() => {
    if (!isRunning || stage === 'Finished') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    
    intervalRef.current = window.setInterval(() => {
      setSessionState(prev => {
        if(prev.stage === 'Finished') return prev;

        if (prev.timeRemaining <= 1) {
          nextStage();
          return prev;
        }

        if (prev.timeRemaining === 6) {
            const { nextExerciseName } = getDisplayInfo(prev);
            if (nextExerciseName && nextExerciseName !== 'Finished!' && nextExerciseName !== 'Finish' && nextExerciseName !== 'Cool-down') {
                speak(`Next up: ${nextExerciseName}`, isSoundOn);
            }
        }
        
        if (isSoundOn && [4, 3, 2].includes(prev.timeRemaining)) {
           beep(prev.timeRemaining === 2 ? 880 : 750, 100, 50);
        }

        const newTime = prev.timeRemaining - 1;
        const newState = {...prev, timeRemaining: newTime};
        return newState;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, stage, nextStage, isSoundOn, getDisplayInfo]);

  const togglePause = useCallback(() => {
    initAudioContext();
    setIsRunning(prev => !prev)
  }, []);
  
  const completeSet = useCallback(() => {
    initAudioContext();
    if (stage === 'Work' && currentExercise?.unit === 'reps') {
        nextStage();
    }
  }, [stage, currentExercise, nextStage]);

  const skipExercise = () => {
      initAudioContext();
      if (stage === 'Warm-up') {
          if (subIndex < warmUp.length - 1) {
            setSessionState(prev => {
                const nextSubIndex = prev.subIndex + 1;
                const duration = warmUp[nextSubIndex].duration;
                return { ...prev, subIndex: nextSubIndex, timeRemaining: duration, initialStageDuration: duration };
            });
          } else {
            skipStage();
          }
      } else if (stage === 'Cool-down') {
          if (subIndex < coolDown.length - 1) {
            setSessionState(prev => {
                const nextSubIndex = prev.subIndex + 1;
                const duration = coolDown[nextSubIndex].duration;
                return { ...prev, subIndex: nextSubIndex, timeRemaining: duration, initialStageDuration: duration };
            });
          } else {
             stopWorkout();
          }
      } else if (stage === 'Work' || stage === 'Rest') {
          if (exerciseIndex >= exercises.length - 1) {
              nextStage();
              return;
          }
          setSessionState(prev => {
              const updatedExercises = [...prev.exercises];
              if(prev.exerciseIndex >= 0 && updatedExercises[prev.exerciseIndex]) {
                  updatedExercises[prev.exerciseIndex].status = 'skipped';
              }
              const nextIndex = prev.exerciseIndex + 1;
              const nextRound = updatedExercises[nextIndex];
              setIsRunning(nextRound.unit !== 'reps');
              return { ...prev, stage: 'Work', exercises: updatedExercises, exerciseIndex: nextIndex, timeRemaining: nextRound.duration, initialStageDuration: nextRound.duration };
          });
      }
  };

  const previousExercise = () => {
      initAudioContext();
      if (stage === 'Warm-up' && subIndex > 0) {
        setSessionState(prev => {
            const prevSubIndex = prev.subIndex - 1;
            const duration = warmUp[prevSubIndex].duration;
            return { ...prev, subIndex: prevSubIndex, timeRemaining: duration, initialStageDuration: duration };
        });
      } else if (stage === 'Cool-down' && subIndex > 0) {
          setSessionState(prev => {
            const prevSubIndex = prev.subIndex - 1;
            const duration = coolDown[prevSubIndex].duration;
            return { ...prev, subIndex: prevSubIndex, timeRemaining: duration, initialStageDuration: duration };
        });
      } else if ((stage === 'Work' || stage === 'Rest') && exerciseIndex > 0) {
          setSessionState(prev => {
            const prevIndex = prev.exerciseIndex - 1;
            const prevRound = prev.exercises[prevIndex];
            const updatedExercises = [...prev.exercises];
            if(updatedExercises[prevIndex]) updatedExercises[prevIndex].status = 'pending';
            setIsRunning(prevRound.unit !== 'reps');
            return {...prev, stage: 'Work', exercises: updatedExercises, exerciseIndex: prevIndex, timeRemaining: prevRound.duration, initialStageDuration: prevRound.duration };
          });
      }
  };

  const skipStage = () => {
      initAudioContext();
      if (stage === 'Warm-up') {
          const firstExercise = exercises[0];
          speak(`Skipping to workout. Starting with: ${firstExercise?.exercise}`, isSoundOn);
          setIsRunning(firstExercise?.unit !== 'reps');
          setSessionState(prev => ({ ...prev, stage: 'Work', exerciseIndex: 0, subIndex: -1, timeRemaining: firstExercise.duration, initialStageDuration: firstExercise.duration }));
      } else if (stage === 'Work' || stage === 'Rest') {
          nextStage();
      }
  };

  const replaceCurrentExercise = useCallback((newExerciseDetails: Omit<Exercise, 'id' | 'status'>) => {
    setSessionState(prev => {
        const { stage, exerciseIndex, subIndex } = prev;
        
        const newDuration = newExerciseDetails.duration;
        let wasReplaced = false;

        let newWarmUp = [...prev.warmUp];
        let newExercises = [...prev.exercises];
        let newCoolDown = [...prev.coolDown];

        if (stage === 'Warm-up' && newWarmUp?.[subIndex]) {
            const current = newWarmUp[subIndex];
            newWarmUp[subIndex] = { ...current, ...newExerciseDetails };
            wasReplaced = true;
        } else if ((stage === 'Work' || stage === 'Rest') && newExercises?.[exerciseIndex]) {
            const current = newExercises[exerciseIndex];
            newExercises[exerciseIndex] = { ...current, ...newExerciseDetails };
            if(newExercises[exerciseIndex].unit === 'reps') {
                setIsRunning(false);
            } else {
                setIsRunning(true);
            }
            wasReplaced = true;
        } else if (stage === 'Cool-down' && newCoolDown?.[subIndex]) {
            const current = newCoolDown[subIndex];
            newCoolDown[subIndex] = { ...current, ...newExerciseDetails };
            wasReplaced = true;
        }

        if (wasReplaced) {
            return {
                ...prev,
                warmUp: newWarmUp,
                exercises: newExercises,
                coolDown: newCoolDown,
                timeRemaining: newDuration,
                initialStageDuration: newDuration,
            };
        }

        return prev;
    });
  }, []);
  
  const calculateStageProgress = () => {
    if (stage === 'Finished' || !initialStageDuration) return 1;
    if (timeRemaining <= 0) return 1;
    return (initialStageDuration - timeRemaining) / initialStageDuration;
  };
  
  
  return {
    workoutPlan,
    stage,
    timeRemaining,
    isRunning,
    summary,
    stageProgress: calculateStageProgress(),
    displayInfo: getDisplayInfo(),
    currentExercise,
    exercises,
    exerciseIndex,
    togglePause,
    stopWorkout,
    skipExercise,
    previousExercise,
    skipStage,
    replaceCurrentExercise,
    completeSet,
  };
};
