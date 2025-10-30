import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { WorkoutPlan, Exercise, SessionSummary } from '../types';
import { saveWorkoutSummary } from '../services/workoutService';

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
    workoutPlan: WorkoutPlan | undefined;
    stage: WorkoutStage;
    exerciseIndex: number; // for main rounds
    subIndex: number; // for warm-up/cool-down
    timeRemaining: number;
    initialStageDuration: number;
    exercises: Exercise[];
    summary: SessionSummary | null;
}

const getInitialState = (initialPlan: WorkoutPlan | undefined): { sessionState: SessionState; isRunning: boolean } => {
    // A workout can only be started if a plan is passed from navigation.
    if (initialPlan) {
        const hasWarmUp = initialPlan.warmUp && initialPlan.warmUp.length > 0;
        
        const initialState: SessionState = hasWarmUp
            ? {
                workoutPlan: initialPlan,
                stage: 'Warm-up',
                exerciseIndex: -1,
                subIndex: 0,
                timeRemaining: initialPlan.warmUp[0]?.duration || 0,
                initialStageDuration: initialPlan.warmUp[0]?.duration || 0,
                exercises: initialPlan.rounds.map(ex => ({ ...ex, status: 'pending' })),
                summary: null,
            }
            : {
                workoutPlan: initialPlan,
                stage: 'Work',
                exerciseIndex: 0,
                subIndex: -1,
                timeRemaining: initialPlan.rounds[0]?.duration || 0,
                initialStageDuration: initialPlan.rounds[0]?.duration || 0,
                exercises: initialPlan.rounds.map(ex => ({ ...ex, status: 'pending' })),
                summary: null,
            };
        // The user must now press play to start, which ensures the audio context is initialized by a user gesture.
        return { sessionState: initialState, isRunning: false };
    }

    // No workout plan, return a default empty state.
    const defaultState: SessionState = {
        workoutPlan: undefined,
        stage: 'Warm-up', exerciseIndex: -1, subIndex: -1, timeRemaining: 0,
        initialStageDuration: 0, exercises: [], summary: null,
    };
    return { sessionState: defaultState, isRunning: false };
};


export const useWorkoutTimer = (initialWorkoutPlan: WorkoutPlan | undefined, isSoundOn: boolean) => {
  const [initialState] = useState(() => getInitialState(initialWorkoutPlan));
  const [sessionState, setSessionState] = useState<SessionState>(initialState.sessionState);
  const [isRunning, setIsRunning] = useState(initialState.isRunning);
  
  const intervalRef = useRef<number | null>(null);
  const announcedRef = useRef(false);
  
  const { workoutPlan, stage, exerciseIndex, subIndex, timeRemaining, initialStageDuration, exercises, summary } = sessionState;
  
  const currentExercise: Exercise | undefined = useMemo(() => {
      if (!workoutPlan) return undefined;
      if (stage === 'Warm-up') return workoutPlan.warmUp?.[subIndex];
      if (stage === 'Work' || stage === 'Rest') return exercises?.[exerciseIndex];
      if (stage === 'Cool-down') return workoutPlan.coolDown?.[subIndex];
      return undefined;
  }, [stage, workoutPlan, subIndex, exerciseIndex, exercises]);
  
  const finalizeWorkout = useCallback((currentState: SessionState): SessionState => {
    // If there's no plan or we've already generated a summary, do nothing.
    if (!currentState.workoutPlan || currentState.summary) {
        return currentState;
    }

    const { workoutPlan, exercises, stage, subIndex, exerciseIndex, timeRemaining, initialStageDuration } = currentState;

    // 1. Calculate Warm-up Time
    let elapsedWarmUpTime = 0;
    if (workoutPlan.warmUp && workoutPlan.warmUp.length > 0) {
        if (stage !== 'Warm-up') {
            elapsedWarmUpTime = workoutPlan.warmUp.reduce((sum, ex) => sum + ex.duration + ex.rest, 0);
        } else {
            const completedTime = workoutPlan.warmUp.slice(0, subIndex).reduce((sum, ex) => sum + ex.duration + ex.rest, 0);
            const currentTime = initialStageDuration - timeRemaining;
            elapsedWarmUpTime = completedTime + currentTime;
        }
    }

    // 2. Calculate Main Workout Time (Work + Rest periods)
    let elapsedWorkAndRestTime = 0;
    // Add time for all fully completed exercises
    const completedExercises = exercises.filter(e => e.status === 'completed');
    elapsedWorkAndRestTime = completedExercises.reduce((sum, e) => sum + e.duration + e.rest, 0);

    // Now, adjust based on the stage where the user stopped.
    if (stage === 'Work') {
        const currentExercise = exercises[exerciseIndex];
        if (currentExercise) {
            // For time-based, add elapsed time. For rep-based, assume full duration for calorie calc.
            const elapsedTime = currentExercise.unit === 'reps' ? currentExercise.duration : currentExercise.duration - timeRemaining;
            elapsedWorkAndRestTime += elapsedTime;
        }
    } else if (stage === 'Rest') {
        // We add the full duration of the preceding work + rest, then subtract remaining rest time.
        const precedingWork = exercises[exerciseIndex];
        if (precedingWork) {
           elapsedWorkAndRestTime += (precedingWork.duration + precedingWork.rest) - timeRemaining;
        }
    }

    // 3. Calculate Cool-down Time
    let elapsedCoolDownTime = 0;
    if (workoutPlan.coolDown && workoutPlan.coolDown.length > 0) {
        if (stage === 'Cool-down') {
            const completedTime = workoutPlan.coolDown.slice(0, subIndex).reduce((sum, ex) => sum + ex.duration + ex.rest, 0);
            const currentTime = initialStageDuration - timeRemaining;
            elapsedCoolDownTime = completedTime + currentTime;
        } else if (stage === 'Finished') { // If we finished cool-down, add full duration
            elapsedCoolDownTime = workoutPlan.coolDown.reduce((sum, ex) => sum + ex.duration + ex.rest, 0);
        }
    }


    // 4. Calculate Total Time
    const totalTime = elapsedWarmUpTime + elapsedWorkAndRestTime + elapsedCoolDownTime;

    // 5. Calculate Calories Burned (based on *work* seconds only)
    const planTotalWorkSeconds = workoutPlan.rounds.reduce((sum, r) => sum + r.duration, 0);
    const caloriesPerSecond = planTotalWorkSeconds > 0 ? (workoutPlan.estimatedCalories || 0) / planTotalWorkSeconds : 0;
    
    let actualWorkSeconds = exercises.reduce((sum, e) => {
        return e.status === 'completed' ? sum + e.duration : sum;
    }, 0);

    if (stage === 'Work' && exercises[exerciseIndex]) {
        const currentEx = exercises[exerciseIndex];
        // For time-based, add time elapsed. For reps, add the full estimated duration.
        actualWorkSeconds += currentEx.unit === 'reps' ? currentEx.duration : (currentEx.duration - timeRemaining);
    }
    const totalCalories = Math.round(actualWorkSeconds * caloriesPerSecond);

    // 6. Construct Final Summary
    const finalSummary: SessionSummary = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        workoutName: workoutPlan.name || 'Generated Workout',
        totalTime: Math.round(totalTime),
        completedRounds: exercises.filter(e => e.status === 'completed').length,
        skippedRounds: exercises.filter(e => e.status === 'skipped').length,
        totalCalories,
        planId: workoutPlan.id || '',
        // Store the final state of the exercises (completed, skipped, pending)
        workoutPlan: { ...workoutPlan, rounds: exercises },
        // Simulate jump tracking metrics for demonstration purposes
        jumpMetrics: {
            peakJumpsPerMinute: Math.floor(Math.random() * 50) + 140, // Random value between 140-190
            longestCombo: `Double Under x ${Math.floor(Math.random() * 20) + 10}`, // Random DU combo
            longestContinuousJump: Math.floor(Math.random() * 60) + 30, // Random 30-90 seconds
        },
    };
    
    // 7. Persist summary and set final state
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
        const { workoutPlan } = prev;
        if (!workoutPlan) return prev;

        const { stage, exerciseIndex, subIndex, exercises } = prev;
        const { warmUp, coolDown } = workoutPlan;
        const hasCoolDown = coolDown && coolDown.length > 0;

        if (stage === 'Warm-up' && warmUp && warmUp.length > 0) {
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
                setIsRunning(true); // Always run the rest timer
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
        
        if (stage === 'Cool-down' && hasCoolDown) {
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
        
        // Transition to Cool-down or Finish
        if (hasCoolDown) {
            const updatedExercises = [...prev.exercises];
            // Mark final exercise as complete if it wasn't already (e.g., from a skip)
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

  // Effect for initial announcement on new workouts
  useEffect(() => {
    if (initialState.isRunning && workoutPlan && !announcedRef.current) {
        announcedRef.current = true;
        if (sessionState.stage === 'Warm-up' && workoutPlan.warmUp?.[0]) {
            speak(`Starting warm up: ${workoutPlan.warmUp[0].exercise}`, isSoundOn);
        } else if (sessionState.stage === 'Work' && workoutPlan.rounds?.[0]) {
            speak(`Starting Exercise 1: ${workoutPlan.rounds[0].exercise}`, isSoundOn);
        }
    }
  }, [workoutPlan, isSoundOn, initialState.isRunning, sessionState.stage]);


  const getDisplayInfo = useCallback((state: SessionState = sessionState) => {
    const { workoutPlan } = state;
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
        currentExerciseName = warmUp[subIndex]?.exercise || '';
        const nextSubIdx = subIndex + 1;
        if (nextSubIdx < warmUp.length) {
            nextExerciseName = warmUp[nextSubIdx].exercise;
        } else {
            nextExerciseName = exercises[0]?.exercise || 'First Exercise';
        }
    } else if (stage === 'Cool-down') {
        currentStageDisplay = 'Cool-down';
        currentExerciseName = coolDown[subIndex]?.exercise || '';
        const nextSubIdx = subIndex + 1;
        if (nextSubIdx < coolDown.length) {
            nextExerciseName = coolDown[nextSubIdx].exercise;
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
          return prev; // Return prev here because nextStage will trigger a new state update
        }

        if (prev.timeRemaining === 6) { // Announce next exercise at 5 seconds left
            const { nextExerciseName } = getDisplayInfo(prev);
            if (nextExerciseName && nextExerciseName !== 'Finished!' && nextExerciseName !== 'Finish' && nextExerciseName !== 'Cool-down') {
                speak(`Next up: ${nextExerciseName}`, isSoundOn);
            }
        }
        
        if (isSoundOn && [4, 3, 2].includes(prev.timeRemaining)) {
           beep(prev.timeRemaining === 2 ? 880 : 750, 100, 50); // High beep for '1'
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
        // nextStage marks exercise as complete and transitions to rest/next.
        nextStage();
    }
  }, [stage, currentExercise, nextStage]);

  const skipExercise = () => {
      initAudioContext();
      if (stage === 'Warm-up' && workoutPlan?.warmUp) {
          if (subIndex < workoutPlan.warmUp.length - 1) {
            setSessionState(prev => {
                const nextSubIndex = prev.subIndex + 1;
                const duration = workoutPlan.warmUp[nextSubIndex].duration;
                return { ...prev, subIndex: nextSubIndex, timeRemaining: duration, initialStageDuration: duration };
            });
          } else {
            skipStage(); // Skip to work
          }
      } else if (stage === 'Cool-down' && workoutPlan?.coolDown) {
          if (subIndex < workoutPlan.coolDown.length - 1) {
            setSessionState(prev => {
                const nextSubIndex = prev.subIndex + 1;
                const duration = workoutPlan.coolDown[nextSubIndex].duration;
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
              setIsRunning(nextRound.unit !== 'reps');
              return { ...prev, stage: 'Work', exercises: updatedExercises, exerciseIndex: nextIndex, timeRemaining: nextRound.duration, initialStageDuration: nextRound.duration };
          });
      }
  };

  const previousExercise = () => {
      initAudioContext();
      if (stage === 'Warm-up' && workoutPlan?.warmUp && subIndex > 0) {
        setSessionState(prev => {
            const prevSubIndex = prev.subIndex - 1;
            const duration = workoutPlan.warmUp[prevSubIndex].duration;
            return { ...prev, subIndex: prevSubIndex, timeRemaining: duration, initialStageDuration: duration };
        });
      } else if (stage === 'Cool-down' && workoutPlan?.coolDown && subIndex > 0) {
          setSessionState(prev => {
            const prevSubIndex = prev.subIndex - 1;
            const duration = workoutPlan.coolDown[prevSubIndex].duration;
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
        setIsRunning(nextExercise.unit !== 'reps');
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
    setSessionState(prev => {
        const { stage, workoutPlan, exerciseIndex, subIndex } = prev;
        if (!workoutPlan) return prev;
    
        const newPlan = JSON.parse(JSON.stringify(workoutPlan));
        const newDuration = newExerciseDetails.duration;
        let wasReplaced = false;

        if (stage === 'Warm-up' && newPlan.warmUp?.[subIndex]) {
            const current = newPlan.warmUp[subIndex];
            newPlan.warmUp[subIndex] = { ...current, ...newExerciseDetails };
            wasReplaced = true;
        } else if ((stage === 'Work' || stage === 'Rest') && newPlan.rounds?.[exerciseIndex]) {
            const current = newPlan.rounds[exerciseIndex];
            newPlan.rounds[exerciseIndex] = { ...current, ...newExerciseDetails };
            // For replaced exercises, we assume they are time-based as per modal flow
            if(newPlan.rounds[exerciseIndex].unit === 'reps') {
                setIsRunning(false);
            } else {
                setIsRunning(true);
            }
            wasReplaced = true;
        } else if (stage === 'Cool-down' && newPlan.coolDown?.[subIndex]) {
            const current = newPlan.coolDown[subIndex];
            newPlan.coolDown[subIndex] = { ...current, ...newExerciseDetails };
            wasReplaced = true;
        }

        if (wasReplaced) {
            return {
                ...prev,
                workoutPlan: newPlan,
                exercises: [...newPlan.rounds], // Resync exercises from the updated plan
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
    removeCurrentExercise,
    replaceCurrentExercise,
    completeSet,
  };
};
