import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkoutPlan, Exercise, SessionSummary } from '../types';
import { saveWorkoutSummary } from '../services/workoutService';

type WorkoutStage = 'Warm-up' | 'Work' | 'Rest' | 'Cool-down' | 'Finished';

const SESSION_STORAGE_KEY = 'ropeflow-live-session';

let audioCtx: AudioContext | null = null;
const getAudioContext = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
}

const beep = (freq = 750, duration = 100, vol = 50, type: OscillatorType = 'sine') => {
  try {
    const context = getAudioContext();
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
    stage: WorkoutStage;
    exerciseIndex: number; // for main rounds
    subIndex: number; // for warm-up/cool-down
    timeRemaining: number;
    initialStageDuration: number;
    exercises: Exercise[];
    summary: SessionSummary | null;
}

const getInitialState = (plan: WorkoutPlan | undefined) => {
    const savedSessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSessionRaw) {
        try {
            const savedData = JSON.parse(savedSessionRaw);
            // Check if the saved plan matches the one passed in.
            if (savedData.workoutPlan?.id === plan?.id) {
                return {
                    sessionState: savedData.sessionState as SessionState,
                    isRunning: false, // Always start paused when restoring.
                };
            }
        } catch (e) {
            localStorage.removeItem(SESSION_STORAGE_KEY);
        }
    }

    if (plan) {
        const hasWarmUp = plan.warmUp && plan.warmUp.length > 0;
        const initialState: SessionState = hasWarmUp
            ? {
                stage: 'Warm-up',
                exerciseIndex: -1,
                subIndex: 0,
                timeRemaining: (plan.warmUpDuration * 60) / plan.warmUp.length,
                initialStageDuration: (plan.warmUpDuration * 60) / plan.warmUp.length,
                exercises: plan.rounds.map(ex => ({ ...ex, status: 'pending' })),
                summary: null,
            }
            : {
                stage: 'Work',
                exerciseIndex: 0,
                subIndex: -1,
                timeRemaining: plan.rounds[0]?.duration || 0,
                initialStageDuration: plan.rounds[0]?.duration || 0,
                exercises: plan.rounds.map(ex => ({ ...ex, status: 'pending' })),
                summary: null,
            };
        return { sessionState: initialState, isRunning: true };
    }

    const defaultState: SessionState = {
        stage: 'Warm-up', exerciseIndex: -1, subIndex: -1, timeRemaining: 0,
        initialStageDuration: 0, exercises: [], summary: null,
    };
    return { sessionState: defaultState, isRunning: false };
};


export const useWorkoutTimer = (workoutPlan: WorkoutPlan | undefined, isSoundOn: boolean) => {
  const [initialState] = useState(() => getInitialState(workoutPlan));
  const [sessionState, setSessionState] = useState<SessionState>(initialState.sessionState);
  const [isRunning, setIsRunning] = useState(initialState.isRunning);
  
  const intervalRef = useRef<number | null>(null);
  const announcedRef = useRef(false);
  
  const { stage, exerciseIndex, subIndex, timeRemaining, initialStageDuration, exercises, summary } = sessionState;
  const currentExercise: Exercise | undefined = exercises[exerciseIndex];
  
  const finalizeWorkout = useCallback((currentState: SessionState): SessionState => {
    if (!workoutPlan || currentState.summary) {
        return currentState;
    }

    const { exercises } = currentState;
    const workTime = exercises
        .filter(e => e.status === 'completed')
        .reduce((sum, e) => sum + e.duration + e.rest, 0);

    const warmUpTime = (workoutPlan.warmUp?.length || 0) > 0 && currentState.stage !== 'Warm-up' ? workoutPlan.warmUpDuration * 60 : 0;
    
    let coolDownTime = 0;
    if (currentState.stage === 'Cool-down' && workoutPlan.coolDown && workoutPlan.coolDown.length > 0) {
        const totalCoolDownDuration = workoutPlan.coolDownDuration * 60;
        coolDownTime = totalCoolDownDuration - currentState.timeRemaining;
    }

    const totalTime = warmUpTime + workTime + coolDownTime;

    const planWorkDuration = workoutPlan.rounds.reduce((s, r) => s + r.duration, 1) || 1;
    const caloriesPerSecond = (workoutPlan.estimatedCalories || 0) / planWorkDuration;
    const totalCalories = Math.round(exercises.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.duration, 0) * caloriesPerSecond);
    
    const finalSummary: SessionSummary = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        workoutName: workoutPlan.name || 'Generated Workout',
        totalTime: Math.round(totalTime),
        completedRounds: exercises.filter(e => e.status === 'completed').length,
        skippedRounds: exercises.filter(e => e.status === 'skipped').length,
        totalCalories,
        planId: workoutPlan.id || '',
        workoutPlan: { ...workoutPlan, rounds: currentState.exercises },
    };

    saveWorkoutSummary(finalSummary);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    speak('Workout ended.', isSoundOn);

    return {
        ...currentState,
        stage: 'Finished',
        summary: finalSummary,
        initialStageDuration: 0,
        timeRemaining: 0,
    };
  }, [workoutPlan, isSoundOn]);


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
        if (!workoutPlan) return prev;
        const { stage, exerciseIndex, subIndex, exercises } = prev;
        const { warmUp, coolDown } = workoutPlan;
        const hasCoolDown = coolDown && coolDown.length > 0;

        if (stage === 'Warm-up' && warmUp && warmUp.length > 0) {
            const nextSubIndex = subIndex + 1;
            if (nextSubIndex < warmUp.length) {
                const duration = (workoutPlan.warmUpDuration * 60) / warmUp.length;
                return { ...prev, subIndex: nextSubIndex, timeRemaining: duration, initialStageDuration: duration };
            } else {
                const firstExercise = exercises[0];
                speak(`Starting workout: ${firstExercise?.exercise}`, isSoundOn);
                const newDuration = firstExercise?.duration || 0;
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
                return { ...prev, stage: 'Rest', exercises: updatedExercises, timeRemaining: currentEx.rest, initialStageDuration: currentEx.rest };
            }
            
            const nextExIdx = exerciseIndex + 1;
            if (nextExIdx < exercises.length) {
                const nextEx = exercises[nextExIdx];
                return { ...prev, stage: 'Work', exercises: updatedExercises, exerciseIndex: nextExIdx, timeRemaining: nextEx.duration, initialStageDuration: nextEx.duration };
            }
        }
        
        if (stage === 'Rest' || (stage === 'Work' && exercises[exerciseIndex]?.rest === 0)) {
            const nextExIdx = exerciseIndex + 1;
            if (nextExIdx < exercises.length) {
                const nextExercise = exercises[nextExIdx];
                return { ...prev, stage: 'Work', exerciseIndex: nextExIdx, timeRemaining: nextExercise.duration, initialStageDuration: nextExercise.duration };
            }
        }
        
        if (stage === 'Cool-down' && hasCoolDown) {
            const nextSubIndex = subIndex + 1;
            if (nextSubIndex < coolDown.length) {
                const duration = (workoutPlan.coolDownDuration * 60) / coolDown.length;
                return { ...prev, subIndex: nextSubIndex, timeRemaining: duration, initialStageDuration: duration };
            } else {
                return finalizeWorkout(prev);
            }
        }
        
        // Transition to Cool-down or Finish
        if (hasCoolDown) {
            const updatedExercises = [...prev.exercises];
            // Mark final exercise as complete if it wasn't already (e.g., from a skip)
            if (prev.exerciseIndex >= 0 && updatedExercises[prev.exerciseIndex] && updatedExercises[prev.exerciseIndex].status === 'pending') {
                updatedExercises[prev.exerciseIndex].status = 'completed';
            }
            const duration = (workoutPlan.coolDownDuration * 60) / coolDown.length;
            speak(`Beginning cool down: ${coolDown[0]}`, isSoundOn);
            return { ...prev, stage: 'Cool-down', subIndex: 0, exercises: updatedExercises, timeRemaining: duration, initialStageDuration: duration };
        } else {
            return finalizeWorkout(prev);
        }
    });
  }, [isSoundOn, workoutPlan, finalizeWorkout]);

  // Effect for initial announcement on new workouts
  useEffect(() => {
    if (initialState.isRunning && workoutPlan && !announcedRef.current) {
        announcedRef.current = true;
        if (sessionState.stage === 'Warm-up' && workoutPlan.warmUp?.[0]) {
            speak(`Starting warm up: ${workoutPlan.warmUp[0]}`, isSoundOn);
        } else if (sessionState.stage === 'Work' && workoutPlan.rounds?.[0]) {
            speak(`Starting Exercise 1: ${workoutPlan.rounds[0].exercise}`, isSoundOn);
        }
    }
  }, [workoutPlan, isSoundOn, initialState.isRunning, sessionState.stage]);


  const getDisplayInfo = useCallback((state: SessionState = sessionState) => {
    if (!workoutPlan) return { currentStageDisplay: '', currentExerciseName: '', nextExerciseName: '', totalRounds: 0, currentRoundNum: 0 };

    const { stage, exerciseIndex, subIndex, exercises } = state;
    const { warmUp, coolDown, exercisesPerRound } = workoutPlan;
    
    let currentStageDisplay = '';
    let currentExerciseName = '';
    let nextExerciseName = '';
    const totalRounds = exercises.length;
    const currentRoundNum = exerciseIndex + 1;

    if (stage === 'Warm-up') {
        currentStageDisplay = 'Warm-up';
        currentExerciseName = warmUp[subIndex];
        const nextSubIdx = subIndex + 1;
        if (nextSubIdx < warmUp.length) {
            nextExerciseName = warmUp[nextSubIdx];
        } else {
            nextExerciseName = exercises[0]?.exercise || 'First Exercise';
        }
    } else if (stage === 'Cool-down') {
        currentStageDisplay = 'Cool-down';
        currentExerciseName = coolDown[subIndex];
        const nextSubIdx = subIndex + 1;
        if (nextSubIdx < coolDown.length) {
            nextExerciseName = coolDown[nextSubIdx];
        } else {
            nextExerciseName = 'Finished!';
        }
    } else if (stage === 'Work' || stage === 'Rest') {
        const roundNumber = Math.floor(exerciseIndex / (exercisesPerRound || 1)) + 1;
        currentStageDisplay = stage === 'Work' ? `Round ${roundNumber}`: 'Rest';
        currentExerciseName = stage === 'Work' ? (exercises[exerciseIndex]?.exercise || '') : 'Rest';

        const currentEx = exercises[exerciseIndex];
        if (stage === 'Work' && currentEx?.rest > 0) {
            nextExerciseName = 'Rest';
        } else if (exerciseIndex < totalRounds - 1) {
            nextExerciseName = exercises[exerciseIndex + 1]?.exercise || 'Cool-down';
        } else {
            nextExerciseName = (workoutPlan.coolDown && workoutPlan.coolDown.length > 0) ? 'Cool-down' : 'Finish';
        }
    } else if (stage === 'Finished') {
        currentStageDisplay = 'Finished';
        currentExerciseName = 'Workout Complete!';
    }

    return {
        currentStageDisplay,
        currentExerciseName,
        nextExerciseName,
        totalRounds,
        currentRoundNum
    };
  }, [sessionState, workoutPlan]);


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
          return prev; // Return prev here because nextStage will trigger a new state update
        }

        if (prev.timeRemaining === 6) { // Announce next exercise at 5 seconds left
            const { nextExerciseName } = getDisplayInfo(prev);
            if (nextExerciseName && nextExerciseName !== 'Finished!' && nextExerciseName !== 'Finish') {
                speak(`Next up: ${nextExerciseName}`, isSoundOn);
            }
        }
        
        if (isSoundOn && [4, 3, 2].includes(prev.timeRemaining)) {
           beep(prev.timeRemaining === 2 ? 880 : 750, 100, 50); // High beep for '1'
        }

        const newTime = prev.timeRemaining - 1;
        const newState = {...prev, timeRemaining: newTime};
        const dataToSave = { sessionState: newState, workoutPlan };
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(dataToSave));
        return newState;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, stage, nextStage, isSoundOn, getDisplayInfo, workoutPlan]);

  const togglePause = () => setIsRunning(!isRunning);
  
  const skipExercise = () => {
      if (stage === 'Warm-up' && workoutPlan?.warmUp) {
          if (subIndex < workoutPlan.warmUp.length - 1) {
            setSessionState(prev => {
                const nextSubIndex = prev.subIndex + 1;
                const duration = (workoutPlan.warmUpDuration * 60) / workoutPlan.warmUp.length;
                return { ...prev, subIndex: nextSubIndex, timeRemaining: duration, initialStageDuration: duration };
            });
          } else {
            skipStage(); // Skip to work
          }
      } else if (stage === 'Cool-down' && workoutPlan?.coolDown) {
          if (subIndex < workoutPlan.coolDown.length - 1) {
            setSessionState(prev => {
                const nextSubIndex = prev.subIndex + 1;
                const duration = (workoutPlan.coolDownDuration * 60) / workoutPlan.coolDown.length;
                return { ...prev, subIndex: nextSubIndex, timeRemaining: duration, initialStageDuration: duration };
            });
          } else {
             stopWorkout();
          }
      } else if (stage === 'Work' || stage === 'Rest') {
          if (exerciseIndex >= exercises.length - 1) {
              nextStage(); // Go to cooldown or finish
              return;
          }
          setSessionState(prev => {
              const updatedExercises = [...prev.exercises];
              if(prev.exerciseIndex >= 0 && updatedExercises[prev.exerciseIndex]) {
                  updatedExercises[prev.exerciseIndex].status = 'skipped';
              }
              const nextIndex = prev.exerciseIndex + 1;
              const nextRound = updatedExercises[nextIndex];
              return { ...prev, stage: 'Work', exercises: updatedExercises, exerciseIndex: nextIndex, timeRemaining: nextRound.duration, initialStageDuration: nextRound.duration };
          });
      }
  };

  const previousExercise = () => {
      if (stage === 'Warm-up' && workoutPlan?.warmUp && subIndex > 0) {
        setSessionState(prev => {
            const prevSubIndex = prev.subIndex - 1;
            const duration = (workoutPlan.warmUpDuration * 60) / workoutPlan.warmUp.length;
            return { ...prev, subIndex: prevSubIndex, timeRemaining: duration, initialStageDuration: duration };
        });
      } else if (stage === 'Cool-down' && workoutPlan?.coolDown && subIndex > 0) {
          setSessionState(prev => {
            const prevSubIndex = prev.subIndex - 1;
            const duration = (workoutPlan.coolDownDuration * 60) / workoutPlan.coolDown.length;
            return { ...prev, subIndex: prevSubIndex, timeRemaining: duration, initialStageDuration: duration };
        });
      } else if ((stage === 'Work' || stage === 'Rest') && exerciseIndex > 0) {
          setSessionState(prev => {
            const prevIndex = prev.exerciseIndex - 1;
            const prevRound = prev.exercises[prevIndex];
            const updatedExercises = [...prev.exercises];
            if(updatedExercises[prevIndex]) updatedExercises[prevIndex].status = 'pending';
            return {...prev, stage: 'Work', exercises: updatedExercises, exerciseIndex: prevIndex, timeRemaining: prevRound.duration, initialStageDuration: prevRound.duration };
          });
      }
  };

  const skipStage = () => {
      if (stage === 'Warm-up') {
          const firstExercise = exercises[0];
          speak(`Skipping to workout. Starting with: ${firstExercise?.exercise}`, isSoundOn);
          setSessionState(prev => ({ ...prev, stage: 'Work', exerciseIndex: 0, subIndex: -1, timeRemaining: firstExercise.duration, initialStageDuration: firstExercise.duration }));
      } else if (stage === 'Work' || stage === 'Rest') {
          nextStage();
      }
  };

  const removeCurrentExercise = useCallback(() => {
    // This function now uses the functional update form of `setSessionState` to ensure it always has the latest state,
    // which prevents bugs when the workout is paused.
    let shouldTransition = false;
    setSessionState(prev => {
        if (prev.stage !== 'Work' || prev.exerciseIndex < 0) {
            return prev;
        }
        
        const updatedExercises = prev.exercises.filter((_, idx) => idx !== prev.exerciseIndex);

        // If this was the last exercise, flag that we need to transition to the next stage.
        if (prev.exerciseIndex >= updatedExercises.length) {
            shouldTransition = true;
            return { ...prev, exercises: updatedExercises };
        }

        // If it's not the last exercise, just remove it and continue with the next one at the same index.
        const nextExercise = updatedExercises[prev.exerciseIndex]; 
        return {
            ...prev,
            exercises: updatedExercises,
            stage: 'Work',
            timeRemaining: nextExercise.duration,
            initialStageDuration: nextExercise.duration,
        };
    });

    // If we flagged that it was the last exercise, call `nextStage` outside the state updater.
    // `nextStage` will correctly handle moving to cool-down or finishing the workout.
    if (shouldTransition) {
        nextStage();
    }
  }, [nextStage]);

  const replaceCurrentExercise = useCallback((newExerciseDetails: Omit<Exercise, 'id' | 'status'>) => {
    if (sessionState.stage !== 'Work' || sessionState.exerciseIndex < 0) return;
    
    setSessionState(prev => {
        const updatedExercises = [...prev.exercises];
        const current = updatedExercises[prev.exerciseIndex];
        
        updatedExercises[prev.exerciseIndex] = {
            ...current, // keep id and status
            exercise: newExerciseDetails.exercise,
            duration: newExerciseDetails.duration,
            rest: newExerciseDetails.rest,
            difficulty: newExerciseDetails.difficulty,
            equipment: newExerciseDetails.equipment,
        };

        return {
            ...prev,
            exercises: updatedExercises,
            timeRemaining: newExerciseDetails.duration,
            initialStageDuration: newExerciseDetails.duration,
        };
    });
  }, [sessionState.stage, sessionState.exerciseIndex]);
  
  const calculateStageProgress = () => {
    if (stage === 'Finished' || !initialStageDuration) return 1;
    if (timeRemaining <= 0) return 1;
    return (initialStageDuration - timeRemaining) / initialStageDuration;
  };
  
  
  return {
    stage,
    timeRemaining,
    isRunning,
    summary,
    stageProgress: calculateStageProgress(),
    displayInfo: getDisplayInfo(),
    currentExercise,
    togglePause,
    stopWorkout,
    skipExercise,
    previousExercise,
    skipStage,
    removeCurrentExercise,
    replaceCurrentExercise,
  };
};