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
    currentIndex: number;
    timeRemaining: number;
    initialStageDuration: number;
    exercises: Exercise[];
    summary: SessionSummary | null;
}

export const useWorkoutTimer = (workoutPlan: WorkoutPlan | undefined, isSoundOn: boolean) => {
  const [sessionState, setSessionState] = useState<SessionState>({
      stage: 'Warm-up',
      currentIndex: -1,
      timeRemaining: 0,
      initialStageDuration: 0,
      exercises: [],
      summary: null,
  });
  const [isRunning, setIsRunning] = useState(true);
  
  const intervalRef = useRef<number | null>(null);
  
  const { stage, currentIndex, timeRemaining, initialStageDuration, exercises, summary } = sessionState;
  const currentExercise: Exercise | undefined = exercises[currentIndex];

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
      const { stage, currentIndex, exercises } = prev;
      const totalRounds = exercises.length;
      const currentRound = exercises[currentIndex];

      if (stage === 'Warm-up') {
        speak(`Starting Exercise 1: ${exercises[0]?.exercise}`, isSoundOn);
        const newDuration = exercises[0]?.duration || 0;
        return { ...prev, stage: 'Work', currentIndex: 0, timeRemaining: newDuration, initialStageDuration: newDuration };
      }
      if (stage === 'Work') {
        const updatedExercises = [...exercises];
        if (updatedExercises[currentIndex]) updatedExercises[currentIndex].status = 'completed';
        
        if (currentIndex < totalRounds - 1) {
          speak('Rest', isSoundOn);
          const newDuration = currentRound?.rest || 0;
          return { ...prev, stage: 'Rest', exercises: updatedExercises, timeRemaining: newDuration, initialStageDuration: newDuration };
        } else {
          speak('Beginning cool down', isSoundOn);
          return { ...prev, stage: 'Cool-down', exercises: updatedExercises, timeRemaining: COOLDOWN_DURATION, initialStageDuration: COOLDOWN_DURATION };
        }
      }
      if (stage === 'Rest') {
        const nextIndex = currentIndex + 1;
        const nextRound = exercises[nextIndex];
        speak(`Next exercise: ${nextRound?.exercise}`, isSoundOn);
        const newDuration = nextRound?.duration || 0;
        return { ...prev, stage: 'Work', currentIndex: nextIndex, timeRemaining: newDuration, initialStageDuration: newDuration };
      }
      if (stage === 'Cool-down') {
        finishWorkout();
        return prev; // finishWorkout will update the state
      }
      return prev;
    });
  }, [finishWorkout, isSoundOn]);

  useEffect(() => {
      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if(savedSession) {
          setSessionState(JSON.parse(savedSession));
      } else if (workoutPlan) {
          const hasWarmUp = workoutPlan.warmUp && workoutPlan.warmUp.length > 0;
          const warmUpDurationSecs = (workoutPlan.warmUpDuration || 0) * 60;
          
          if(hasWarmUp) {
            setSessionState({
                stage: 'Warm-up',
                currentIndex: -1,
                timeRemaining: warmUpDurationSecs,
                initialStageDuration: warmUpDurationSecs,
                exercises: workoutPlan.rounds.map(ex => ({...ex, status: 'pending'})),
                summary: null,
            });
            speak('Starting warm up', isSoundOn);
          } else {
            // No warm-up, go straight to first exercise
             setSessionState({
                stage: 'Work',
                currentIndex: 0,
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
          // The state update in nextStage will provide the new time, so we just return prev here
          return prev;
        }

        // Handle Next Up transition at 10 seconds
        if (prev.timeRemaining === 11) {
            const currentEx = prev.exercises[prev.currentIndex];
            const nextExercise = prev.exercises[prev.currentIndex + 1];

            if (prev.stage === 'Work' && currentEx && currentEx.rest > 0) {
                speak('Next up: Rest', isSoundOn);
            } else if (nextExercise) {
                speak(`Next up: ${nextExercise.exercise}`, isSoundOn);
            } else if (prev.stage === 'Work') {
                speak('Next up: Cool-down', isSoundOn);
            }
        }
        
        // Handle 3-2-1 countdown with beeps
        if (isSoundOn && [4, 3, 2].includes(prev.timeRemaining)) {
           beep(prev.timeRemaining === 4 ? 880 : 750, 100, 50); // Higher beep for the first one
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
      if (currentIndex >= exercises.length - 1) {
          stopWorkout();
          return;
      }
      setSessionState(prev => {
          const updatedExercises = [...prev.exercises];
          if(prev.currentIndex >= 0 && updatedExercises[prev.currentIndex]) {
              updatedExercises[prev.currentIndex].status = 'skipped';
          }
          const nextIndex = prev.currentIndex + 1;
          const nextRound = updatedExercises[nextIndex];
          speak(`Skipping to: ${nextRound?.exercise}`, isSoundOn);
          return { ...prev, stage: 'Work', exercises: updatedExercises, currentIndex: nextIndex, timeRemaining: nextRound.duration, initialStageDuration: nextRound.duration };
      });
  };

  const previousExercise = () => {
      if(currentIndex <= 0) return;
      setSessionState(prev => {
        const prevIndex = prev.currentIndex - 1;
        const prevRound = prev.exercises[prevIndex];
        speak(`Going back to: ${prevRound.exercise}`, isSoundOn);
        const updatedExercises = [...prev.exercises];
        if(updatedExercises[prevIndex]) updatedExercises[prevIndex].status = 'pending';
        return {...prev, stage: 'Work', exercises: updatedExercises, currentIndex: prevIndex, timeRemaining: prevRound.duration, initialStageDuration: prevRound.duration };
      });
  };
  
  const calculateStageProgress = () => {
    if (stage === 'Finished' || !initialStageDuration) return 1;
    if (timeRemaining <= 0) return 1;
    return (initialStageDuration - timeRemaining) / initialStageDuration;
  };
  
  const getDisplayInfo = () => {
      let currentExerciseName = '';
      let nextExerciseName = '';
      let totalRounds = exercises.length;
      let currentRoundNum = currentIndex + 1;

      if(stage === 'Warm-up') currentExerciseName = 'Dynamic Stretches';
      else if (stage === 'Cool-down') currentExerciseName = 'Static Stretches';
      else if (stage === 'Rest') currentExerciseName = 'Rest';
      else if (currentExercise) currentExerciseName = currentExercise.exercise;

      if(timeRemaining <= 10 && (stage === 'Work' || stage === 'Rest' || stage === 'Warm-up')) {
          if (stage === 'Warm-up') {
              nextExerciseName = exercises[0]?.exercise || 'First Exercise';
          } else {
            const currentEx = exercises[currentIndex];
            if (stage === 'Work' && currentEx && currentEx.rest > 0) {
                nextExerciseName = 'Rest';
            } else if(currentIndex < totalRounds - 1) {
                nextExerciseName = exercises[currentIndex + 1]?.exercise || 'Cool-down';
            } else {
                nextExerciseName = 'Cool-down';
            }
          }
      }

      return {
          currentExerciseName,
          nextExerciseName,
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