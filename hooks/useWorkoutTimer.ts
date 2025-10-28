import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkoutPlan, Exercise, SessionSummary } from '../types';
import { saveWorkoutSummary } from '../services/workoutService';

type WorkoutStage = 'Warm-up' | 'Work' | 'Rest' | 'Cool-down' | 'Finished';

const COOLDOWN_DURATION = 120; // 2 minutes

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

export const useWorkoutTimer = (workoutPlan: WorkoutPlan | undefined, isSoundOn: boolean) => {
  const [sessionState, setSessionState] = useState<SessionState>({
      stage: 'Warm-up',
      exerciseIndex: -1,
      subIndex: -1,
      timeRemaining: 0,
      initialStageDuration: 0,
      exercises: [],
      summary: null,
  });
  const [isRunning, setIsRunning] = useState(true);
  
  const intervalRef = useRef<number | null>(null);
  
  const { stage, exerciseIndex, subIndex, timeRemaining, initialStageDuration, exercises, summary } = sessionState;
  const currentExercise: Exercise | undefined = exercises[exerciseIndex];

  const finishWorkout = useCallback(() => {
      const completedRounds = exercises.filter(e => e.status === 'completed').length;
      const skippedRounds = exercises.filter(e => e.status === 'skipped').length;
      const workTime = exercises
        .filter(e => e.status === 'completed')
        .reduce((sum, e) => sum + e.duration, 0);
      
      const caloriesPerSecond = (workoutPlan?.estimatedCalories || 0) / (workoutPlan?.rounds.reduce((s, r) => s + r.duration, 1) || 1);
      const totalCalories = Math.round(workTime * caloriesPerSecond);
      const warmUpTime = (workoutPlan?.warmUp.length || 0) > 0 ? (workoutPlan?.warmUpDuration || 0) * 60 : 0;
      
      const finalSummary: SessionSummary = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          workoutName: workoutPlan?.name || 'Generated Workout',
          totalTime: warmUpTime + COOLDOWN_DURATION + exercises.reduce((sum, e) => (e.status === 'completed' ? sum + e.duration + e.rest : e.status === 'skipped' ? sum : sum), 0),
          completedRounds,
          skippedRounds,
          totalCalories,
          planId: workoutPlan?.id || '',
          workoutPlan: workoutPlan!,
      };

      saveWorkoutSummary(finalSummary);
      localStorage.removeItem(SESSION_STORAGE_KEY);
      setSessionState(prev => ({...prev, stage: 'Finished', summary: finalSummary, initialStageDuration: 0, timeRemaining: 0}));
      setIsRunning(false);
      speak('Workout complete. Great job!', isSoundOn);

  }, [exercises, workoutPlan, isSoundOn]);


  const nextStage = useCallback(() => {
    setSessionState(prev => {
        if (!workoutPlan) return prev;
        const { stage, exerciseIndex, subIndex, exercises } = prev;
        const { warmUp, coolDown } = workoutPlan;

        if (stage === 'Warm-up' && warmUp && warmUp.length > 0) {
            const nextSubIndex = subIndex + 1;
            if (nextSubIndex < warmUp.length) {
                const duration = (workoutPlan.warmUpDuration * 60) / warmUp.length;
                speak(warmUp[nextSubIndex], isSoundOn);
                return { ...prev, subIndex: nextSubIndex, timeRemaining: duration, initialStageDuration: duration };
            } else {
                const firstExercise = exercises[0];
                speak(`Starting Exercise 1: ${firstExercise?.exercise}`, isSoundOn);
                const newDuration = firstExercise?.duration || 0;
                return { ...prev, stage: 'Work', exerciseIndex: 0, subIndex: -1, timeRemaining: newDuration, initialStageDuration: newDuration };
            }
        }
        
        if (stage === 'Work') {
            const updatedExercises = [...exercises];
            if (updatedExercises[exerciseIndex]) updatedExercises[exerciseIndex].status = 'completed';
            
            const currentEx = exercises[exerciseIndex];
            if (currentEx?.rest > 0) {
                speak('Rest', isSoundOn);
                return { ...prev, stage: 'Rest', exercises: updatedExercises, timeRemaining: currentEx.rest, initialStageDuration: currentEx.rest };
            }
            
            const nextExIdx = exerciseIndex + 1;
            if (nextExIdx < exercises.length) {
                const nextEx = exercises[nextExIdx];
                speak(`Next up: ${nextEx.exercise}`, isSoundOn);
                return { ...prev, stage: 'Work', exercises: updatedExercises, exerciseIndex: nextExIdx, timeRemaining: nextEx.duration, initialStageDuration: nextEx.duration };
            }
        }
        
        if (stage === 'Rest' || (stage === 'Work' && exercises[exerciseIndex]?.rest === 0)) {
            const nextExIdx = exerciseIndex + 1;
            if (nextExIdx < exercises.length) {
                const nextExercise = exercises[nextExIdx];
                speak(`Next exercise: ${nextExercise?.exercise}`, isSoundOn);
                return { ...prev, stage: 'Work', exerciseIndex: nextExIdx, timeRemaining: nextExercise.duration, initialStageDuration: nextExercise.duration };
            }
        }
        
        if (stage === 'Cool-down' && coolDown && coolDown.length > 0) {
            const nextSubIndex = subIndex + 1;
            if (nextSubIndex < coolDown.length) {
                const duration = COOLDOWN_DURATION / coolDown.length;
                speak(coolDown[nextSubIndex], isSoundOn);
                return { ...prev, subIndex: nextSubIndex, timeRemaining: duration, initialStageDuration: duration };
            } else {
                finishWorkout();
                return prev;
            }
        }
        
        // Transition to Cool-down or Finish
        if (coolDown && coolDown.length > 0) {
            const duration = COOLDOWN_DURATION / coolDown.length;
            speak(`Beginning cool down: ${coolDown[0]}`, isSoundOn);
            return { ...prev, stage: 'Cool-down', subIndex: 0, timeRemaining: duration, initialStageDuration: duration };
        } else {
            finishWorkout();
            return prev;
        }
    });
}, [finishWorkout, isSoundOn, workoutPlan]);

  useEffect(() => {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if(savedSession) {
          setSessionState(JSON.parse(savedSession));
      } else if (workoutPlan) {
          const hasWarmUp = workoutPlan.warmUp && workoutPlan.warmUp.length > 0;
          const warmUpDurationSecs = (workoutPlan.warmUpDuration || 0) * 60;
          
          if(hasWarmUp) {
            const durationPerExercise = warmUpDurationSecs / workoutPlan.warmUp.length;
            setSessionState({
                stage: 'Warm-up',
                exerciseIndex: -1,
                subIndex: 0,
                timeRemaining: durationPerExercise,
                initialStageDuration: durationPerExercise,
                exercises: workoutPlan.rounds.map(ex => ({...ex, status: 'pending'})),
                summary: null,
            });
            speak(`Starting warm up: ${workoutPlan.warmUp[0]}`, isSoundOn);
          } else {
            // No warm-up, go straight to first exercise
             setSessionState({
                stage: 'Work',
                exerciseIndex: 0,
                subIndex: -1,
                timeRemaining: workoutPlan.rounds[0].duration,
                initialStageDuration: workoutPlan.rounds[0].duration,
                exercises: workoutPlan.rounds.map(ex => ({...ex, status: 'pending'})),
                summary: null,
            });
            speak(`Starting Exercise 1: ${workoutPlan.rounds[0].exercise}`, isSoundOn);
          }
      }
  }, [workoutPlan]);


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
        
        if (prev.timeRemaining === 11) {
            const { nextExerciseName } = getDisplayInfo(prev);
            if (nextExerciseName) {
                speak(`Next up: ${nextExerciseName}`, isSoundOn);
            }
        }
        
        if (isSoundOn && [4, 3, 2].includes(prev.timeRemaining)) {
           beep(prev.timeRemaining === 4 ? 880 : 750, 100, 50);
        }

        const newTime = prev.timeRemaining - 1;
        const newState = {...prev, timeRemaining: newTime};
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newState));
        return newState;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, stage, nextStage, isSoundOn]);

  const togglePause = () => setIsRunning(!isRunning);
  
  const stopWorkout = () => {
    setIsRunning(false);
    finishWorkout();
  };

  const skipExercise = () => {
      if (exerciseIndex >= exercises.length - 1) {
          stopWorkout();
          return;
      }
      setSessionState(prev => {
          const updatedExercises = [...prev.exercises];
          if(prev.exerciseIndex >= 0 && updatedExercises[prev.exerciseIndex]) {
              updatedExercises[prev.exerciseIndex].status = 'skipped';
          }
          const nextIndex = prev.exerciseIndex + 1;
          const nextRound = updatedExercises[nextIndex];
          speak(`Skipping to: ${nextRound?.exercise}`, isSoundOn);
          return { ...prev, stage: 'Work', exercises: updatedExercises, exerciseIndex: nextIndex, timeRemaining: nextRound.duration, initialStageDuration: nextRound.duration };
      });
  };

  const previousExercise = () => {
      if(exerciseIndex <= 0) return;
      setSessionState(prev => {
        const prevIndex = prev.exerciseIndex - 1;
        const prevRound = prev.exercises[prevIndex];
        speak(`Going back to: ${prevRound.exercise}`, isSoundOn);
        const updatedExercises = [...prev.exercises];
        if(updatedExercises[prevIndex]) updatedExercises[prevIndex].status = 'pending';
        return {...prev, stage: 'Work', exercises: updatedExercises, exerciseIndex: prevIndex, timeRemaining: prevRound.duration, initialStageDuration: prevRound.duration };
      });
  };
  
  const calculateStageProgress = () => {
    if (stage === 'Finished' || !initialStageDuration) return 1;
    if (timeRemaining <= 0) return 1;
    return (initialStageDuration - timeRemaining) / initialStageDuration;
  };
  
  const getDisplayInfo = (state: SessionState = sessionState) => {
      if (!workoutPlan) return { currentStageDisplay: '', currentExerciseName: '', nextExerciseName: '', totalRounds: 0, currentRoundNum: 0 };

      const { stage, exerciseIndex, subIndex, exercises, timeRemaining } = state;
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
          currentStageDisplay = `Round ${roundNumber}`;
          currentExerciseName = stage === 'Work' ? (exercises[exerciseIndex]?.exercise || '') : 'Rest';

          const currentEx = exercises[exerciseIndex];
          if (stage === 'Work' && currentEx?.rest > 0) {
              nextExerciseName = 'Rest';
          } else if (exerciseIndex < totalRounds - 1) {
              nextExerciseName = exercises[exerciseIndex + 1]?.exercise || 'Cool-down';
          } else {
              nextExerciseName = 'Cool-down';
          }
      } else if (stage === 'Finished') {
          currentStageDisplay = 'Finished';
          currentExerciseName = 'Workout Complete!';
      }

      return {
          currentStageDisplay,
          currentExerciseName,
          nextExerciseName: timeRemaining <= 10 ? nextExerciseName : '',
          totalRounds,
          currentRoundNum
      };
  }
  
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
  };
};