import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkoutPlan, Exercise, SessionSummary } from '../types';
import { saveWorkoutSummary } from '../services/workoutService';

type WorkoutStage = 'Warm-up' | 'Work' | 'Rest' | 'Next Up' | 'Cool-down' | 'Finished';

const WARMUP_DURATION = 10; // 3 minutes -> 10s for testing
const COOLDOWN_DURATION = 10; // 2 minutes -> 10s for testing
const NEXT_UP_DURATION = 5;

const SESSION_STORAGE_KEY = 'ropeflow-live-session';

const speak = (text: string, isSoundOn: boolean) => {
  if ('speechSynthesis' in window && isSoundOn) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
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
      timeRemaining: WARMUP_DURATION,
      initialStageDuration: WARMUP_DURATION,
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
      
      const finalSummary: SessionSummary = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          workoutName: workoutPlan?.name || 'Generated Workout',
          totalTime: WARMUP_DURATION + COOLDOWN_DURATION + exercises.reduce((sum, e) => (e.status === 'completed' ? sum + e.duration + e.rest : e.status === 'skipped' ? sum : sum), 0),
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
        speak(`Starting round 1: ${exercises[0]?.exercise}`, isSoundOn);
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
        speak(`Next round: ${nextRound?.exercise}`, isSoundOn);
        const newDuration = nextRound?.duration || 0;
        return { ...prev, stage: 'Work', currentIndex: nextIndex, timeRemaining: newDuration, initialStageDuration: newDuration };
      }
      if (stage === 'Next Up') {
        const nextIndex = currentIndex + 1;
        const nextRound = exercises[nextIndex];
        speak(`Begin: ${nextRound?.exercise}`, isSoundOn);
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
          setSessionState({
              stage: 'Warm-up',
              currentIndex: -1,
              timeRemaining: WARMUP_DURATION,
              initialStageDuration: WARMUP_DURATION,
              exercises: workoutPlan.rounds.map(ex => ({...ex, status: 'pending'})),
              summary: null,
          });
          speak('Starting warm up', isSoundOn);
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

        // Handle Next Up transition
        if ((prev.stage === 'Work' || prev.stage === 'Rest') && prev.timeRemaining === NEXT_UP_DURATION + 1) {
            const nextIndex = prev.stage === 'Rest' ? prev.currentIndex + 1 : prev.currentIndex;
            const nextExercise = prev.exercises[nextIndex+1];
            if(nextExercise) {
                speak(`Next up: ${nextExercise.exercise}`, isSoundOn);
            }
        }
        
        // Handle 3-2-1 countdown
        if (isSoundOn && [4, 3, 2].includes(prev.timeRemaining)) {
           speak(`${prev.timeRemaining - 1}`, isSoundOn);
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

      if(timeRemaining <= NEXT_UP_DURATION && (stage === 'Work' || stage === 'Rest')) {
          if (stage === 'Work' && currentIndex < totalRounds -1) nextExerciseName = 'Rest';
          else if(currentIndex < totalRounds - 1) nextExerciseName = exercises[currentIndex + 1]?.exercise || 'Cool-down';
          else nextExerciseName = 'Cool-down';
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