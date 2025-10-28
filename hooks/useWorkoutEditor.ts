import { useState, useCallback } from 'react';
import { WorkoutPlan, Exercise } from '../types';
import { toastStore } from '../store/toastStore';

type WorkoutEditor = {
  plan: WorkoutPlan | null;
  setExercises: (plan: WorkoutPlan) => void;
  addExercise: (exercise: Omit<Exercise, 'id'>, index?: number) => void;
  removeExercise: (id: string) => void;
  updateExercise: (id: string, updatedExercise: Partial<Exercise>) => void;
  reorderExercises: (startIndex: number, endIndex: number) => void;
  deleteExercises: (ids: string[]) => void;
  duplicateExercises: (ids: string[]) => void;
  updateExercises: (ids: string[], updates: Partial<Pick<Exercise, 'duration' | 'rest'>>) => void;
  setGlobalRest: (rest: number) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  loadPlan: (newPlan: WorkoutPlan) => void;
};

export const useWorkoutEditor = (): WorkoutEditor => {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [history, setHistory] = useState<WorkoutPlan[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const updateStateAndHistory = useCallback((newPlan: WorkoutPlan | null) => {
    if(!newPlan) {
        setHistory([]);
        setHistoryIndex(-1);
        setPlan(null);
        return;
    }
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newPlan);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setPlan(newPlan);
  }, [history, historyIndex]);

  const setExercises = useCallback((initialPlan: WorkoutPlan) => {
    updateStateAndHistory(initialPlan);
  }, [updateStateAndHistory]);

  const loadPlan = useCallback((newPlan: WorkoutPlan) => {
    toastStore.addToast(`Loaded "${newPlan.name}"`);
    updateStateAndHistory(newPlan);
  }, [updateStateAndHistory]);
  
  const reset = useCallback(() => {
    updateStateAndHistory(null);
  }, [updateStateAndHistory]);

  const addExercise = useCallback((exercise: Omit<Exercise, 'id'>, index?: number) => {
    if (!plan) return;
    const newExercise: Exercise = { ...exercise, id: crypto.randomUUID(), equipment: exercise.equipment || 'bodyweight' };
    const newRounds = [...plan.rounds];
    if(index !== undefined){
        newRounds.splice(index, 0, newExercise);
    } else {
        newRounds.push(newExercise);
    }
    const newPlan = { ...plan, rounds: newRounds };
    updateStateAndHistory(newPlan);
    toastStore.addToast('Exercise added');
  }, [plan, updateStateAndHistory]);

  const removeExercise = useCallback((id: string) => {
    if (!plan) return;
    const newPlan = { ...plan, rounds: plan.rounds.filter(ex => ex.id !== id) };
    updateStateAndHistory(newPlan);
    toastStore.addToast('Exercise removed', 'error');
  }, [plan, updateStateAndHistory]);
  
  const deleteExercises = useCallback((ids: string[]) => {
    if (!plan) return;
    const newPlan = { ...plan, rounds: plan.rounds.filter(ex => !ids.includes(ex.id)) };
    updateStateAndHistory(newPlan);
    toastStore.addToast(`${ids.length} exercise(s) removed`, 'error');
  }, [plan, updateStateAndHistory]);

  const duplicateExercises = useCallback((ids: string[]) => {
    if (!plan) return;
    const exercisesToDuplicate = plan.rounds.filter(ex => ids.includes(ex.id));
    const newExercises = exercisesToDuplicate.map(ex => ({...ex, id: crypto.randomUUID()}));
    
    // Find the index of the last selected item to insert after it
    const lastIndex = plan.rounds.map(r => r.id).lastIndexOf(ids[ids.length - 1]);
    const newRounds = [...plan.rounds];
    newRounds.splice(lastIndex + 1, 0, ...newExercises);

    const newPlan = {...plan, rounds: newRounds };
    updateStateAndHistory(newPlan);
    toastStore.addToast(`${ids.length} exercise(s) duplicated`);
  }, [plan, updateStateAndHistory]);

  const updateExercise = useCallback((id: string, updatedExercise: Partial<Exercise>) => {
    if (!plan) return;
    const newPlan = { ...plan, rounds: plan.rounds.map(ex => (ex.id === id ? { ...ex, ...updatedExercise } : ex)) };
    updateStateAndHistory(newPlan);
  }, [plan, updateStateAndHistory]);

  const updateExercises = useCallback((ids: string[], updates: Partial<Pick<Exercise, 'duration' | 'rest'>>) => {
    if (!plan) return;
    const newPlan = {
        ...plan,
        rounds: plan.rounds.map(ex => ids.includes(ex.id) ? {...ex, ...updates} : ex)
    };
    updateStateAndHistory(newPlan);
    toastStore.addToast(`${ids.length} exercise(s) updated`);
  }, [plan, updateStateAndHistory]);

  const setGlobalRest = useCallback((rest: number) => {
    if (!plan) return;
    const newPlan = {
        ...plan,
        rounds: plan.rounds.map(ex => ({...ex, rest}))
    };
    updateStateAndHistory(newPlan);
    toastStore.addToast(`All rest periods set to ${rest}s`);
  }, [plan, updateStateAndHistory]);


  const reorderExercises = useCallback((startIndex: number, endIndex: number) => {
    if (!plan) return;
    const newRounds = Array.from(plan.rounds);
    const [removed] = newRounds.splice(startIndex, 1);
    newRounds.splice(endIndex, 0, removed);
    const newPlan = { ...plan, rounds: newRounds };
    updateStateAndHistory(newPlan);
    toastStore.addToast('Workout reordered');
  }, [plan, updateStateAndHistory]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPlan(history[newIndex]);
      toastStore.addToast('Undo successful');
    }
  }, [canUndo, history, historyIndex]);

  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPlan(history[newIndex]);
      toastStore.addToast('Redo successful');
    }
  }, [canRedo, history, historyIndex]);

  return {
    plan,
    setExercises,
    addExercise,
    removeExercise,
    updateExercise,
    reorderExercises,
    deleteExercises,
    duplicateExercises,
    updateExercises,
    setGlobalRest,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    loadPlan,
  };
};