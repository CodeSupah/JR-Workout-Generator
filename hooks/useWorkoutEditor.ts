import { useState, useCallback, useEffect } from 'react';
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
  updatePreferences: (newPrefs: EditorWorkoutPreferences) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  loadPlan: (newPlan: WorkoutPlan) => void;
};

const EDITOR_PREFERENCES_KEY = 'jump-editor-preferences';

const defaultEditorPrefs: EditorWorkoutPreferences = {
    universalRestDuration: 30,
    keepScreenAwake: false,
    defaultSupersetRounds: 3,
};

const getInitialEditorPrefs = (): EditorWorkoutPreferences => {
    try {
        const stored = localStorage.getItem(EDITOR_PREFERENCES_KEY);
        if (stored) {
            return { ...defaultEditorPrefs, ...JSON.parse(stored) };
        }
    } catch (e) {
        console.error("Failed to parse editor preferences from localStorage, returning default.", e);
    }
    return defaultEditorPrefs;
};


export const useWorkoutEditor = (): WorkoutEditor => {
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [history, setHistory] = useState<WorkoutPlan[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [preferences, setPreferences] = useState<EditorWorkoutPreferences>(getInitialEditorPrefs);

  useEffect(() => {
    localStorage.setItem(EDITOR_PREFERENCES_KEY, JSON.stringify(preferences));
  }, [preferences]);

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
  
  const updatePreferences = useCallback((newPrefs: EditorWorkoutPreferences) => {
    // 1. Save the new preferences to state, which triggers localStorage persistence
    setPreferences(newPrefs);

    // 2. If no plan is loaded, we're done.
    if (!plan) {
        toastStore.addToast('Preferences saved');
        return;
    }
    
    // 3. Apply bulk updates to the current workout plan
    const newPlan = JSON.parse(JSON.stringify(plan));
    const newUniversalRest = newPrefs.universalRestDuration;
    const newSupersetRounds = newPrefs.defaultSupersetRounds;

    // Apply universal rest to all individual exercises
    const applyUniversalRest = (ex: Exercise): Exercise => ({ ...ex, rest: newUniversalRest });

    newPlan.warmUp = newPlan.warmUp.map(applyUniversalRest);
    newPlan.coolDown = newPlan.coolDown.map(applyUniversalRest);
    newPlan.rounds = newPlan.rounds.map((ex: Exercise) => {
        let updatedEx = { ...ex, rest: newUniversalRest };

        // A group ends if it's not linked to the next
        if (!updatedEx.linkedToNext) {
            // It's the end of a superset, update its rounds
            if (updatedEx.groupRounds) {
                updatedEx.groupRounds = newSupersetRounds;
            }
            // It's a single exercise group, update its sets
            if (updatedEx.sets) {
                updatedEx.sets = newSupersetRounds;
            }
        }
        
        return updatedEx;
    });


    // 4. Update the plan state and commit it to history
    updateStateAndHistory(newPlan);
    toastStore.addToast('Settings applied and workout updated!');
  }, [plan, updateStateAndHistory]);

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
        linkedToNext: false,
    };
    
    const newPlan = JSON.parse(JSON.stringify(plan));
    const newSection = newPlan[section];
    const insertIndex = options?.index !== undefined ? options.index : newSection.length;

    if (options?.intoGroup && insertIndex > 0 && section === 'rounds') {
        const prevExercise = newSection[insertIndex - 1];
        // Check if the previous exercise is part of a group (either linked or is a group end)
        if (prevExercise && (prevExercise.linkedToNext || prevExercise.groupRounds)) {
            // Link the previous exercise to the new one
            prevExercise.linkedToNext = true;
            // The new exercise is now the end of the group
            newExercise.linkedToNext = false;

            // If the previous exercise was the end of a group, transfer properties
            if (prevExercise.groupRounds) {
                newExercise.groupRounds = prevExercise.groupRounds;
                newExercise.restAfterGroup = prevExercise.restAfterGroup;
                delete prevExercise.groupRounds;
                delete prevExercise.restAfterGroup;
            }
        }
    }

    newSection.splice(insertIndex, 0, newExercise);

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

    sectionArr.splice(index, 1);
    
    if (index > 0 && !removedItem.linkedToNext) {
        const itemBefore = sectionArr[index - 1];
        if (itemBefore && plan[section as WorkoutSection][index - 1].linkedToNext) {
            itemBefore.linkedToNext = false;
            itemBefore.groupRounds = removedItem.groupRounds;
            itemBefore.restAfterGroup = removedItem.restAfterGroup;
        }
    }
    
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

    const remainingExercises = sectionArr.filter(ex => !ids.includes(ex.id));

    for (let i = 0; i < selectedExercises.length -1; i++) {
        selectedExercises[i].linkedToNext = true;
        delete selectedExercises[i].groupRounds;
        delete selectedExercises[i].restAfterGroup;
    }
    const lastEx = selectedExercises[selectedExercises.length - 1];
    lastEx.linkedToNext = false;
    lastEx.groupRounds = 3; 
    lastEx.restAfterGroup = 60;


    remainingExercises.splice(firstItemIndex, 0, ...selectedExercises);
    
    newPlan[section] = remainingExercises;
    updateStateAndHistory(newPlan);
    toastStore.addToast('Exercises grouped');
  }, [plan, updateStateAndHistory, preferences.defaultSupersetRounds]);

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
            return { 
                ...ex, 
                linkedToNext: false,
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
    
    const [movedItem] = sourceArr.splice(source.index, 1);
    const originalItemState = plan[source.section][source.index];

    if (source.index > 0) {
        const itemBefore = sourceArr[source.index - 1];
        if (itemBefore && plan[source.section][source.index - 1].linkedToNext) {
            if (!originalItemState.linkedToNext) {
                itemBefore.linkedToNext = false;
                itemBefore.groupRounds = originalItemState.groupRounds;
                itemBefore.restAfterGroup = originalItemState.restAfterGroup;
            }
        }
    }

    const destArr = newPlan[destination.section];
    destArr.splice(destination.index, 0, movedItem);

    const itemBeforeDest = destArr[destination.index - 1];
    if (itemBeforeDest) {
        if (itemBeforeDest.linkedToNext) {
            movedItem.linkedToNext = true;
        } else if (itemBeforeDest.groupRounds || (itemBeforeDest.sets && itemBeforeDest.sets > 1)) {
            itemBeforeDest.linkedToNext = true;
            movedItem.linkedToNext = false;
            movedItem.groupRounds = itemBeforeDest.groupRounds || itemBeforeDest.sets;
            movedItem.restAfterGroup = itemBeforeDest.restAfterGroup;
            delete itemBeforeDest.groupRounds;
            delete itemBeforeDest.restAfterGroup;
            delete itemBeforeDest.sets;
        } else {
            movedItem.linkedToNext = false;
        }
    } else {
        movedItem.linkedToNext = false;
    }

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
