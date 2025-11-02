import { useState, useCallback } from 'react';
import { WorkoutPlan, Exercise, EditorWorkoutPreferences } from '../types';
import { toastStore } from '../store/toastStore';
import { getSingleSuggestedExercise } from '../services/exerciseService';

type WorkoutSection = 'warmUp' | 'rounds' | 'coolDown';

type WorkoutEditor = {
  plan: WorkoutPlan | null;
  preferences: EditorWorkoutPreferences;
  setExercises: (plan: WorkoutPlan) => void;
  addExercise: (exercise: Omit<Exercise, 'id'>, section: WorkoutSection, options?: { index?: number; intoGroup?: boolean }) => void;
  removeExercise: (id: string) => void;
  updateExercise: (id: string, updatedExercise: Partial<Exercise>) => void;
  reorderExercises: (startIndex: number, endIndex: number, section: WorkoutSection) => void;
  moveExercise: (source: { index: number; section: WorkoutSection }, destination: { index: number; section: WorkoutSection }) => void;
  deleteExercises: (ids: string[]) => void;
  duplicateExercises: (ids: string[]) => void;
  updateExercises: (ids: string[], updates: Partial<Pick<Exercise, 'duration' | 'rest'>>) => void;
  groupExercises: (ids: string[], section: WorkoutSection) => void;
  ungroupExercises: (ids: string[], section: WorkoutSection) => void;
  unlinkExercise: (id: string, section: WorkoutSection) => void;
  setGlobalRest: (rest: number) => void;
  addSection: (section: 'warmUp' | 'coolDown') => void;
  removeSection: (section: 'warmUp' | 'coolDown') => void;
  updatePreferences: (newPrefs: Partial<EditorWorkoutPreferences>) => void;
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
  const [preferences, setPreferences] = useState<EditorWorkoutPreferences>({
    universalRestDuration: 30,
    defaultSetCount: 3,
    defaultRestAfterGroup: 60,
    keepScreenAwake: false,
  });

  const updatePreferences = useCallback((newPrefs: Partial<EditorWorkoutPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
    toastStore.addToast('Preferences updated');
  }, []);

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

  const addExercise = useCallback((exercise: Omit<Exercise, 'id'>, section: WorkoutSection, options?: { index?: number; intoGroup?: boolean }) => {
    if (!plan) return;
    
    const newExercise: Exercise = { 
        ...exercise, 
        id: crypto.randomUUID(), 
        equipment: exercise.equipment || 'bodyweight',
        linkedToNext: false, // Default to standalone.
    };
    
    const newSection = [...plan[section]];
    const insertIndex = options?.index !== undefined ? options.index : newSection.length;

    // This logic now ONLY runs for explicit group insertion.
    // The UI for `intoGroup: true` is only available inside a group, so `prevExercise.linkedToNext` should be true.
    if (options?.intoGroup && insertIndex > 0 && section === 'rounds') {
        const prevExercise = newSection[insertIndex - 1];
        if (prevExercise.linkedToNext) {
            newExercise.linkedToNext = true;
        }
    }

    newSection.splice(insertIndex, 0, newExercise);

    const newPlan = { ...plan, [section]: newSection };
    updateStateAndHistory(newPlan);
    toastStore.addToast('Exercise added');
  }, [plan, updateStateAndHistory]);

  const removeExercise = useCallback((id: string) => {
    if (!plan) return;

    let section: WorkoutSection | null = null;
    let index = -1;

    (['warmUp', 'rounds', 'coolDown'] as WorkoutSection[]).forEach(sec => {
        const foundIndex = plan[sec].findIndex(ex => ex.id === id);
        if (foundIndex !== -1) {
            section = sec;
            index = foundIndex;
        }
    });

    if (!section || index === -1) return;

    const newPlan = JSON.parse(JSON.stringify(plan));
    const sectionArr = newPlan[section as WorkoutSection];
    const removedItem = { ...sectionArr[index] }; // Copy before splicing

    // Remove the item
    sectionArr.splice(index, 1);
    
    // If the removed item was the END of a group, the new last item needs the group properties.
    if (index > 0 && !removedItem.linkedToNext) {
        const itemBefore = sectionArr[index - 1];
        // Check if the item before was actually linked to the removed one.
        if (itemBefore && plan[section as WorkoutSection][index - 1].linkedToNext) {
            itemBefore.linkedToNext = false;
            itemBefore.groupRounds = removedItem.groupRounds;
            itemBefore.restAfterGroup = removedItem.restAfterGroup;
        }
    }
    
    // If removed from the middle (A->B->C, remove B), A's link now correctly points to C. No action needed.

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
    const newPlan = { 
        ...plan, 
        warmUp: plan.warmUp.map(ex => (ex.id === id ? { ...ex, ...updatedExercise } : ex)),
        rounds: plan.rounds.map(ex => (ex.id === id ? { ...ex, ...updatedExercise } : ex)),
        coolDown: plan.coolDown.map(ex => (ex.id === id ? { ...ex, ...updatedExercise } : ex)),
    };
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
  
  const groupExercises = useCallback((ids: string[], section: WorkoutSection) => {
    if (!plan || ids.length < 2) return;
    const newPlan = { ...plan };
    const sectionArr = [...newPlan[section]];

    const selectedItems = ids.map(id => {
        const index = sectionArr.findIndex(ex => ex.id === id);
        return { exercise: sectionArr[index], index };
    }).filter(item => item.index !== -1).sort((a,b) => a.index - b.index);

    if (selectedItems.length < 2) return;

    const firstItemIndex = selectedItems[0].index;
    const selectedExercises = selectedItems.map(item => item.exercise);

    // Remove selected exercises from their original positions
    const remainingExercises = sectionArr.filter(ex => !ids.includes(ex.id));

    // Link the selected exercises and apply group settings
    for (let i = 0; i < selectedExercises.length -1; i++) {
        selectedExercises[i].linkedToNext = true;
        delete selectedExercises[i].groupRounds;
        delete selectedExercises[i].restAfterGroup;
    }
    const lastEx = selectedExercises[selectedExercises.length - 1];
    lastEx.linkedToNext = false;
    lastEx.groupRounds = preferences.defaultSetCount;
    lastEx.restAfterGroup = preferences.defaultRestAfterGroup;


    // Insert the grouped exercises back at the first item's original position
    remainingExercises.splice(firstItemIndex, 0, ...selectedExercises);
    
    newPlan[section] = remainingExercises;
    updateStateAndHistory(newPlan);
    toastStore.addToast('Exercises grouped');
  }, [plan, updateStateAndHistory, preferences.defaultSetCount, preferences.defaultRestAfterGroup]);

  const ungroupExercises = useCallback((ids: string[], section: WorkoutSection) => {
      if (!plan || ids.length === 0) return;
      const newPlan = {...plan};
      const sectionArr = [...newPlan[section]];

      sectionArr.forEach(ex => {
          if (ids.includes(ex.id)) {
              ex.linkedToNext = false;
          }
      });
      
      newPlan[section] = sectionArr;
      updateStateAndHistory(newPlan);
      toastStore.addToast('Exercises ungrouped');
  }, [plan, updateStateAndHistory]);

  const unlinkExercise = useCallback((id: string, section: WorkoutSection) => {
    if (!plan) return;

    // Find the full group this exercise belongs to
    const sectionArr = plan[section];
    const exerciseIndex = sectionArr.findIndex(ex => ex.id === id);
    if (exerciseIndex === -1 || !sectionArr[exerciseIndex].linkedToNext) return;

    let groupEndIndex = exerciseIndex;
    while(groupEndIndex < sectionArr.length - 1 && sectionArr[groupEndIndex].linkedToNext) {
        groupEndIndex++;
    }
    const groupEndExercise = sectionArr[groupEndIndex];
    
    const newSectionArr = sectionArr.map((ex, index) => {
        if (ex.id === id) {
            // Unlink this exercise, making it the new end of the first part of the group.
            return { 
                ...ex, 
                linkedToNext: false,
                // Give it the group properties from the original group end.
                groupRounds: groupEndExercise.groupRounds,
                restAfterGroup: groupEndExercise.restAfterGroup,
            };
        }
        return ex;
    });

    updateStateAndHistory({ ...plan, [section]: newSectionArr });
    toastStore.addToast('Group split');
  }, [plan, updateStateAndHistory]);


  const setGlobalRest = useCallback((rest: number) => {
    if (!plan) return;
    const newPlan = {
        ...plan,
        warmUp: plan.warmUp.map(ex => ({...ex, rest})),
        rounds: plan.rounds.map(ex => ({...ex, rest})),
        coolDown: plan.coolDown.map(ex => ({...ex, rest})),
    };
    updateStateAndHistory(newPlan);
    toastStore.addToast(`All rest periods set to ${rest}s`);
  }, [plan, updateStateAndHistory]);


  const reorderExercises = useCallback((startIndex: number, endIndex: number, section: WorkoutSection) => {
    if (!plan) return;
    const newSection = Array.from(plan[section]);
    const [removed] = newSection.splice(startIndex, 1);
    newSection.splice(endIndex, 0, removed);
    const newPlan = { ...plan, [section]: newSection };
    updateStateAndHistory(newPlan);
  }, [plan, updateStateAndHistory]);

  const moveExercise = useCallback((
    source: { index: number; section: WorkoutSection },
    destination: { index: number; section: WorkoutSection }
  ) => {
    if (!plan) return;
    
    const newPlan = JSON.parse(JSON.stringify(plan));
    const sourceArr = newPlan[source.section];
    
    // 1. Remove item from source
    const [movedItem] = sourceArr.splice(source.index, 1);
    const originalItemState = plan[source.section][source.index];

    // 2. Repair source group
    if (source.index > 0) {
        const itemBefore = sourceArr[source.index - 1];
        // If the item before was linked to the moved item...
        if (itemBefore && plan[source.section][source.index - 1].linkedToNext) {
            if (!originalItemState.linkedToNext) {
                // ...and the moved item was the group end, make the item before the new end.
                itemBefore.linkedToNext = false;
                itemBefore.groupRounds = originalItemState.groupRounds;
                itemBefore.restAfterGroup = originalItemState.restAfterGroup;
            }
        }
    }

    // 3. Insert into destination
    const destArr = newPlan[destination.section];
    destArr.splice(destination.index, 0, movedItem);

    // 4. Integrate into destination group
    const itemBeforeDest = destArr[destination.index - 1];
    if (itemBeforeDest) {
        if (itemBeforeDest.linkedToNext) {
            // Case A: Dropped into the middle of a group.
            movedItem.linkedToNext = true;
        } else if (itemBeforeDest.groupRounds || (itemBeforeDest.sets && itemBeforeDest.sets > 1)) {
            // Case B: Dropped at the end of a group (extending it).
            itemBeforeDest.linkedToNext = true;
            movedItem.linkedToNext = false; // It's the new end.
            // Transfer group properties
            movedItem.groupRounds = itemBeforeDest.groupRounds || itemBeforeDest.sets;
            movedItem.restAfterGroup = itemBeforeDest.restAfterGroup;
            // Clean up old group-end item
            delete itemBeforeDest.groupRounds;
            delete itemBeforeDest.restAfterGroup;
            delete itemBeforeDest.sets;
        } else {
            // Case C: Dropped as a standalone item.
            movedItem.linkedToNext = false;
        }
    } else {
        // Dropped at the beginning of a section.
        movedItem.linkedToNext = false;
    }

    // 5. Cleanup properties on the moved item itself
    if (movedItem.linkedToNext) {
        delete movedItem.groupRounds;
        delete movedItem.restAfterGroup;
        delete movedItem.sets;
    }

    updateStateAndHistory(newPlan);
    toastStore.addToast('Exercise moved');

  }, [plan, updateStateAndHistory]);
  
  const addSection = useCallback((section: 'warmUp' | 'coolDown') => {
    if (!plan) return;
    const suggestedExercise = getSingleSuggestedExercise(section === 'warmUp' ? 'warmup' : 'cooldown');
    if (!suggestedExercise) {
      toastStore.addToast(`Could not find a suggested exercise for ${section}.`, 'error');
      return;
    }
    const newExercise: Exercise = { ...suggestedExercise, id: crypto.randomUUID() };
    const newPlan = { ...plan, [section]: [newExercise] };
    updateStateAndHistory(newPlan);
    toastStore.addToast(`${section === 'warmUp' ? 'Warm-up' : 'Cool-down'} section added.`);
  }, [plan, updateStateAndHistory]);

  const removeSection = useCallback((section: 'warmUp' | 'coolDown') => {
    if (!plan) return;
    const newPlan = { ...plan, [section]: [] };
    updateStateAndHistory(newPlan);
    toastStore.addToast(`${section === 'warmUp' ? 'Warm-up' : 'Cool-down'} section removed.`, 'error');
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
    preferences,
    setExercises,
    addExercise,
    removeExercise,
    updateExercise,
    reorderExercises,
    moveExercise,
    deleteExercises,
    duplicateExercises,
    updateExercises,
    groupExercises,
    ungroupExercises,
    unlinkExercise,
    setGlobalRest,
    addSection,
    removeSection,
    updatePreferences,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    loadPlan,
  };
};