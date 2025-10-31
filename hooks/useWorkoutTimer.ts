import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { WorkoutPlan, Exercise, SessionSummary } from '../types';
import { saveWorkoutSummary } from '../services/workoutService';
import { flattenWorkoutForSession, SessionItem } from '../utils/workoutUtils';

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
    if (!context || context.state !== 'running') return;

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
    sessionItems: SessionItem[];
    currentIndex: number;
    timeRemaining: number;
    summary: SessionSummary | null;
    completedIndices: Set<number>;
}

const getInitialState = (initialPlan: WorkoutPlan | undefined): { sessionState: SessionState; isRunning: boolean } => {
    if (initialPlan) {
        const { workoutPlan, sessionItems } = flattenWorkoutForSession(initialPlan);
        const firstItem = sessionItems[0];

        const initialState: SessionState = {
            workoutPlan: workoutPlan,
            sessionItems: sessionItems,
            currentIndex: 0,
            timeRemaining: firstItem?.duration || 0,
            summary: null,
            completedIndices: new Set(),
        };
        // Auto-start is disabled to ensure AudioContext is initialized by a user gesture, which is required on iOS.
        const shouldRun = false;
        return { sessionState: initialState, isRunning: shouldRun };
    }

    const defaultState: SessionState = {
        workoutPlan: undefined,
        sessionItems: [],
        currentIndex: -1,
        timeRemaining: 0,
        summary: null,
        completedIndices: new Set(),
    };
    return { sessionState: defaultState, isRunning: false };
};


export const useWorkoutTimer = (initialWorkoutPlan: WorkoutPlan | undefined, isSoundOn: boolean) => {
  const [initialState] = useState(() => getInitialState(initialWorkoutPlan));
  const [sessionState, setSessionState] = useState<SessionState>(initialState.sessionState);
  const [isRunning, setIsRunning] = useState(initialState.isRunning);
  
  const intervalRef = useRef<number | null>(null);
  
  const { workoutPlan, sessionItems, currentIndex, timeRemaining, summary, completedIndices } = sessionState;
  
  const currentItem: SessionItem | undefined = useMemo(() => {
      return sessionItems?.[currentIndex];
  }, [sessionItems, currentIndex]);

  const stage: WorkoutStage = useMemo(() => {
    if (summary) return 'Finished';
    if (!currentItem) return 'Finished';
    if (currentItem.isRest) return 'Rest';
    if (currentItem.purpose === 'warmup') return 'Warm-up';
    if (currentItem.purpose === 'cooldown') return 'Cool-down';
    return 'Work';
  }, [currentItem, summary]);

  const initialStageDuration = currentItem?.duration || 0;
  
  const finalizeWorkout = useCallback((currentState: SessionState): SessionState => {
    if (!currentState.workoutPlan || currentState.summary) {
        return currentState;
    }
    const { workoutPlan, sessionItems, completedIndices } = currentState;

    const completedExercises = sessionItems.filter((item, index) => !item.isRest && completedIndices.has(index));
    const totalTime = completedExercises.reduce((sum, item) => sum + item.duration, 0) +
                      sessionItems.filter((item, index) => item.isRest && completedIndices.has(index)).reduce((sum, item) => sum + item.duration, 0);

    const planTotalWorkSeconds = workoutPlan.rounds.reduce((sum, r) => sum + r.duration, 0);
    const caloriesPerSecond = planTotalWorkSeconds > 0 ? (workoutPlan.estimatedCalories || 0) / planTotalWorkSeconds : 0;
    
    const actualWorkSeconds = completedExercises.reduce((sum, e) => sum + e.duration, 0);
    const totalCalories = Math.round(actualWorkSeconds * caloriesPerSecond);

    const finalSummary: SessionSummary = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        workoutName: workoutPlan.name || 'Generated Workout',
        totalTime: Math.round(totalTime / 60) * 60 + (totalTime % 60),
        completedRounds: completedExercises.length,
        skippedRounds: 0, // This simplified model doesn't track skips easily, can be enhanced later
        totalCalories,
        planId: workoutPlan.id || '',
        workoutPlan,
        jumpMetrics: {
            peakJumpsPerMinute: Math.floor(Math.random() * 50) + 140,
            longestCombo: `Double Under x ${Math.floor(Math.random() * 20) + 10}`,
            longestContinuousJump: Math.floor(Math.random() * 60) + 30,
        },
    };
    
    saveWorkoutSummary(finalSummary);
    speak('Workout ended.', isSoundOn);
    setIsRunning(false);

    return { ...currentState, summary: finalSummary, timeRemaining: 0 };
  }, [isSoundOn]);


  const stopWorkout = useCallback(() => {
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
    setIsRunning(false);
    setSessionState(finalizeWorkout);
  }, [finalizeWorkout]);


  const moveToItem = useCallback((index: number, andRun: boolean = true) => {
    if (index >= sessionItems.length) {
        setSessionState(prev => finalizeWorkout(prev));
        return;
    }
    const nextItem = sessionItems[index];
    // The timer should only stop running for rep-based sets or if the user pauses.
    const newIsRunning = andRun && nextItem.unit !== 'reps';
    
    setIsRunning(newIsRunning);

    setSessionState(prev => {
        const newCompleted = new Set(prev.completedIndices);
        if (prev.currentIndex !== -1) {
            newCompleted.add(prev.currentIndex);
        }
        return {
            ...prev,
            currentIndex: index,
            timeRemaining: nextItem.duration,
            completedIndices: newCompleted,
        }
    });

  }, [sessionItems, finalizeWorkout]);

  const getDisplayInfo = useCallback(() => {
    if (!workoutPlan || !currentItem) return { currentStageDisplay: '', currentExerciseName: '', nextExerciseName: '', totalRounds: 0, currentRoundNum: 0, totalUniqueExercises: 0, currentUniqueExerciseIndex: 0 };
    
    const nextItem = sessionItems[currentIndex + 1];
    let currentStageDisplay: string = stage;
    if(stage === 'Work' && currentItem.purpose === 'main') {
        const roundNumber = Math.floor((currentItem.originalIndex || 0) / (workoutPlan.exercisesPerRound || 1)) + 1;
        if(workoutPlan.numberOfRounds > 1) currentStageDisplay = `Round ${roundNumber}`;
    }

    return {
        currentStageDisplay,
        currentExerciseName: currentItem.exercise,
        nextExerciseName: nextItem?.exercise || 'Finished!',
        totalRounds: workoutPlan.rounds.length,
        currentRoundNum: (currentItem.originalIndex || 0) + 1,
        totalUniqueExercises: workoutPlan.warmUp.length + workoutPlan.rounds.length + workoutPlan.coolDown.length,
        currentUniqueExerciseIndex: (currentItem.originalIndex || 0) + 1,
    };
  }, [sessionItems, currentIndex, currentItem, stage, workoutPlan]);


  useEffect(() => {
    if (!isRunning || stage === 'Finished') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    
    intervalRef.current = window.setInterval(() => {
      setSessionState(prev => {
        const nextItem = prev.sessionItems[prev.currentIndex + 1];
        
        // Announce next exercise with enough time before the 4-second countdown begins.
        if (prev.timeRemaining === 7 && nextItem) {
            speak(nextItem.isRest ? 'Next up: Rest' : `Next up: ${nextItem.exercise}`, isSoundOn);
        }

        // 4-second countdown beeps. The final beep is a higher pitch.
        if (isSoundOn) {
            if (prev.timeRemaining === 5) beep(750, 100, 50); // 4s left
            if (prev.timeRemaining === 4) beep(750, 100, 50); // 3s left
            if (prev.timeRemaining === 3) beep(750, 100, 50); // 2s left
            if (prev.timeRemaining === 2) beep(950, 120, 60); // 1s left - higher pitch for final cue
        }

        if (prev.timeRemaining <= 1) {
          if (nextItem) {
              if (nextItem.isRest) {
                  speak('Rest', isSoundOn);
              } else {
                  speak(nextItem.exercise, isSoundOn);
              }
              if (isSoundOn) {
                  beep(1200, 150, 60, 'triangle'); // Distinct, high-pitched start tone
              }
          }
          moveToItem(prev.currentIndex + 1, true);
          return prev; // Return previous state to avoid flicker; moveToItem will trigger a re-render
        }
        
        return {...prev, timeRemaining: prev.timeRemaining - 1};
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, stage, moveToItem, isSoundOn]);

  const togglePause = useCallback(() => {
    initAudioContext();
    if (currentItem?.unit !== 'reps') {
      // If this is the very first play action of the session, announce the start.
      if (currentIndex === 0 && !isRunning && timeRemaining === (sessionItems[0]?.duration || 0)) {
        const firstItem = sessionItems[0];
        if (firstItem) {
            speak(`Starting with ${firstItem.exercise}`, isSoundOn);
        }
      }
      setIsRunning(prev => !prev);
    }
  }, [currentItem, currentIndex, isRunning, timeRemaining, sessionItems, isSoundOn]);
  
  const completeSet = useCallback(() => {
    initAudioContext();
    if (currentItem?.unit === 'reps') {
        moveToItem(currentIndex + 1, true);
    }
  }, [currentItem, currentIndex, moveToItem]);

  const skipExercise = () => {
      initAudioContext();
      if (currentIndex < sessionItems.length - 1) {
          moveToItem(currentIndex + 1);
      } else {
          stopWorkout();
      }
  };

  const previousExercise = () => {
      initAudioContext();
      let prevIndex = currentIndex - 1;
      // Go back to the previous non-rest item
      while(prevIndex >= 0 && sessionItems[prevIndex].isRest) {
          prevIndex--;
      }
      if (prevIndex >= 0) {
          moveToItem(prevIndex);
      }
  };

  const skipStage = () => {
      initAudioContext();
      if (stage === 'Rest') {
          moveToItem(currentIndex + 1);
          return;
      }
      let nextIndex = currentIndex + 1;
      while(nextIndex < sessionItems.length && sessionItems[nextIndex].purpose === currentItem?.purpose) {
          nextIndex++;
      }
      if (nextIndex < sessionItems.length) {
          moveToItem(nextIndex);
      } else {
          stopWorkout();
      }
  };

  const replaceCurrentExercise = useCallback((newExerciseDetails: Omit<Exercise, 'id' | 'status'>) => {
    setSessionState(prev => {
        if (!prev.sessionItems[prev.currentIndex]) return prev;
        
        const newItems = [...prev.sessionItems];
        const current = newItems[prev.currentIndex];
        newItems[prev.currentIndex] = { ...current, ...newExerciseDetails };
        
        const wasRepBased = current.unit === 'reps';
        const isNowRepBased = newItems[prev.currentIndex].unit === 'reps';
        
        // Adjust running state based on whether the unit type changed
        if (!wasRepBased && isNowRepBased) {
            setIsRunning(false);
        } else if (wasRepBased && !isNowRepBased) {
            setIsRunning(true);
        }

        return {
            ...prev,
            sessionItems: newItems,
            timeRemaining: newItems[prev.currentIndex].duration,
        };
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
    currentExercise: currentItem,
    sessionItems,
    currentIndex,
    togglePause,
    stopWorkout,
    skipExercise,
    previousExercise,
    skipStage,
    replaceCurrentExercise,
    completeSet,
  };
};
