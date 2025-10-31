import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkoutEditor } from '../hooks/useWorkoutEditor';
import { EXERCISE_DATABASE } from '../data/exerciseDatabase';
import { Exercise, WorkoutPlan, ExerciseDetails, ExerciseDifficulty } from '../types';
import { toastStore } from '../store/toastStore';
import { saveCustomWorkout } from '../services/workoutService';
import { getSuggestedMainExercise, getSingleSuggestedExercise } from '../services/exerciseService';
import { PlusIcon, SaveIcon, ZapIcon, ChevronDownIcon, FlameIcon, SparklesIcon, CogIcon } from './icons/Icons';
import { flattenWorkoutForSession } from '../utils/workoutUtils';
import ExerciseCard from './ExerciseCard';
import ExerciseModal from './ExerciseModal';

type WorkoutSectionType = 'warmUp' | 'rounds' | 'coolDown';

const FilterButton: React.FC<{ label: string; isSelected: boolean; onClick: () => void; }> = ({ label, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            isSelected
            ? 'bg-orange-500 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        }`}
    >
        {label}
    </button>
  );

// --- ExerciseSearchOverlay Component ---
const ExerciseSearchOverlay: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exercise: ExerciseDetails) => void;
}> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All Muscles');
  
  const availableDifficulties = useMemo(() => ['Beginner', 'Intermediate', 'Advanced'], []);
  
  const equipmentCategories = useMemo(() => ['Barbell', 'Bodyweight', 'Dumbbell', 'Jump Rope', 'Kettlebell', 'Machine', 'Resistance Band'], []);
  
  const muscleGroupCategories = useMemo(() => {
    const muscleSet = new Set<string>();
    EXERCISE_DATABASE.forEach(ex => {
        if (ex.purpose === 'main' && ex.category !== 'Flexibility & Mobility') {
            ex.muscleGroups.forEach(m => muscleSet.add(m));
        }
    });
    return ['All Muscles', ...Array.from(muscleSet).sort()];
  }, []);

  const handleToggleFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
      setter(prev => 
          prev.includes(value) 
          ? prev.filter(item => item !== value) 
          : [...prev, value]
      );
  };

  const filteredExercises = useMemo(() => {
    return EXERCISE_DATABASE.filter(ex => {
        if (ex.purpose !== 'main') return false;

        // Text Search Match
        const searchTermLower = searchTerm.toLowerCase();
        const searchMatch = searchTermLower === '' || 
            ex.name.toLowerCase().includes(searchTermLower) ||
            (ex.keywords && ex.keywords.some(k => k.toLowerCase().includes(searchTermLower)));

        // Difficulty Match
        const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(ex.difficulty);
        
        // Equipment Match
        const equipmentMatch = selectedEquipment.length === 0 || selectedEquipment.some(selected => {
            const selectedFormatted = selected.toLowerCase().replace(/ /g, '-');
            if (selected === 'Jump Rope') return ['rope', 'weighted-rope'].includes(ex.equipment);
            if (selected === 'Machine') return ['cable-machine', 'leg-press-machine'].includes(ex.equipment);
            return ex.equipment === selectedFormatted;
        });
        
        // Muscle Group Match
        const muscleGroupMatch = selectedMuscleGroup === 'All Muscles' || ex.muscleGroups.includes(selectedMuscleGroup);

        return searchMatch && difficultyMatch && equipmentMatch && muscleGroupMatch;
    });
  }, [searchTerm, selectedDifficulties, selectedEquipment, selectedMuscleGroup]);

  const categorizedResults = useMemo(() => {
    const grouped: { [key: string]: ExerciseDetails[] } = {};

    filteredExercises.forEach(ex => {
        let key = ex.equipment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        if (['Rope', 'Weighted Rope'].includes(key)) key = 'Jump Rope';
        if (['Cable Machine', 'Leg Press Machine'].includes(key)) key = 'Machine';
        
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(ex);
    });
    
    const sortedEntries = Object.entries(grouped).sort(([categoryA], [categoryB]) => categoryA.localeCompare(categoryB));
    for (const [, exercises] of sortedEntries) {
        exercises.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sortedEntries;
  }, [filteredExercises]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 p-4 flex justify-center" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg h-full flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-700 flex-shrink-0 space-y-4">
            <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
                className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg py-2 px-4 focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
             <div className="space-y-4">
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-400 text-xs">Filter by Difficulty</h4>
                    <div className="flex flex-wrap gap-2">
                        {availableDifficulties.map(diff => (
                            <FilterButton key={diff} label={diff} isSelected={selectedDifficulties.includes(diff)} onClick={() => handleToggleFilter(setSelectedDifficulties, diff)} />
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-400 text-xs">Filter by Equipment</h4>
                    <div className="flex flex-wrap gap-2">
                        {equipmentCategories.map(equip => (
                            <FilterButton key={equip} label={equip} isSelected={selectedEquipment.includes(equip)} onClick={() => handleToggleFilter(setSelectedEquipment, equip)} />
                        ))}
                    </div>
                </div>
                 <div className="space-y-2">
                    <h4 className="font-semibold text-gray-400 text-xs">Filter by Muscle Group</h4>
                    <div className="flex flex-wrap gap-2">
                        {muscleGroupCategories.map(group => (
                            <FilterButton key={group} label={group} isSelected={selectedMuscleGroup === group} onClick={() => setSelectedMuscleGroup(group)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <div className="overflow-y-auto flex-1">
          {categorizedResults.length > 0 ? (
            categorizedResults.map(([category, exercises]) => (
                 <div key={category}>
                    <h3 className="font-bold text-orange-400 p-4 pb-2 sticky top-0 bg-gray-800">{category}</h3>
                    {exercises.map(ex => (
                        <button
                          key={ex.id}
                          onClick={() => onSelect(ex)}
                          className="w-full text-left p-4 hover:bg-orange-500/20 transition-colors"
                        >
                          <p className="font-semibold text-white">{ex.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{ex.equipment.replace(/-/g, ' ')}</p>
                        </button>
                    ))}
                 </div>
            ))
          ) : (
             <p className="text-center text-gray-400 p-4">No exercises match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Builder Component ---
const ManualBuilder: React.FC = () => {
  const editor = useWorkoutEditor();
  const navigate = useNavigate();
  const [workoutName, setWorkoutName] = useState('My Custom Routine');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [modalState, setModalState] = useState<{ mode: 'replace'; section: WorkoutSectionType, exerciseToEdit: Exercise } | null>(null);
  const [universalRest, setUniversalRest] = useState(60);
  
  const dragItem = useRef<{index: number, section: WorkoutSectionType} | null>(null);
  const [dragOverInfo, setDragOverInfo] = useState<{index: number; section: WorkoutSectionType} | null>(null);


  useEffect(() => {
    // Only initialize if the plan is empty, to avoid resetting on re-renders
    if (!editor.plan) {
        editor.setExercises({
          id: crypto.randomUUID(),
          name: workoutName,
          mode: 'equipment',
          warmUp: [],
          warmUpDuration: 0,
          rounds: [],
          mainWorkout: [],
          coolDown: [],
          coolDownDuration: 0,
          estimatedCalories: 0,
          difficultyScore: 5,
          motivationalQuote: 'Built by hand, finished by heart.',
          exercisesPerRound: 0,
          numberOfRounds: 1,
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSuggestedExercise = (type: 'warmup' | 'cooldown') => {
    const exercise = getSingleSuggestedExercise(type);
    if (exercise) {
        const section = type === 'warmup' ? 'warmUp' : 'coolDown';
        editor.addExercise(exercise, section);
    }
  };

  const handleAddSuggestedMainExercise = () => {
    const suggested = getSuggestedMainExercise(editor.plan?.rounds || []);
    if (suggested) {
        const exerciseWithUniversalRest = { ...suggested, rest: universalRest };
        editor.addExercise(exerciseWithUniversalRest, 'rounds');
        toastStore.addToast(`Added "${suggested.exercise}" to your workout!`);
    } else {
        toastStore.addToast("Couldn't find a unique exercise to suggest!", 'error');
    }
  };


  const handleAddExercise = useCallback((exerciseDetails: ExerciseDetails) => {
    const newExercise: Omit<Exercise, 'id' | 'status'> = {
      exercise: exerciseDetails.name,
      unit: 'reps',
      duration: 45,
      reps: 10,
      sets: 3,
      rest: universalRest,
      difficulty: (exerciseDetails.difficulty as ExerciseDifficulty) || 'Medium',
      equipment: exerciseDetails.equipment,
    };
    editor.addExercise(newExercise, 'rounds');
    setIsSearchOpen(false);
  }, [editor, universalRest]);

  const handleSwapRequest = (exerciseToSwap: Exercise, section: WorkoutSectionType) => {
    setModalState({ mode: 'replace', exerciseToEdit: exerciseToSwap, section });
  };

  const handleExerciseReplaced = (exerciseData: Omit<Exercise, 'id' | 'status'>) => {
    if (modalState?.exerciseToEdit) {
      // Preserve key settings from the original exercise during a swap
      const updatedData = {
          ...exerciseData,
          sets: modalState.exerciseToEdit.sets,
          reps: modalState.exerciseToEdit.reps,
          duration: modalState.exerciseToEdit.duration,
          rest: modalState.exerciseToEdit.rest,
          unit: modalState.exerciseToEdit.unit,
      };
      editor.updateExercise(modalState.exerciseToEdit.id, updatedData);
    }
    setModalState(null);
  };
  
  const handleDuplicateExercise = useCallback((exercise: Exercise, section: WorkoutSectionType, index: number) => {
    const { id, status, ...exerciseData } = exercise;
    const newExercise = { ...exerciseData, rest: universalRest };
    editor.addExercise(newExercise, section, index + 1);
  }, [editor, universalRest]);

  const handleDragStart = (e: React.DragEvent, index: number, section: WorkoutSectionType) => {
    dragItem.current = { index, section };
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDrop = (e: React.DragEvent, dropIndex: number, dropSection: WorkoutSectionType) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverInfo(null);
    if (!dragItem.current) return;
    
    // Prevent dropping on itself
    if (dragItem.current.section === dropSection && dragItem.current.index === dropIndex) {
        dragItem.current = null;
        return;
    }
    
    editor.moveExercise(dragItem.current, { index: dropIndex, section: dropSection });
    dragItem.current = null;
  };

    const summary = useMemo(() => {
        if (!editor.plan) return { count: 0, time: 0 };
    
        const totalExercises = (editor.plan.warmUp?.length || 0) + (editor.plan.rounds?.length || 0) + (editor.plan.coolDown?.length || 0);
    
        // FIX: Correctly calculate total time from the flattened session items array.
        // The flattenWorkoutForSession function returns a `sessionItems` array that includes
        // all work and rest periods as individual items, so we just need to sum their durations.
        const { sessionItems } = flattenWorkoutForSession(editor.plan);
        const totalSeconds = sessionItems.reduce((acc, item) => acc + item.duration, 0);

        const totalMinutes = Math.floor(totalSeconds / 60);
    
        return { count: totalExercises, time: totalMinutes };
    }, [editor.plan]);

  const handleStart = () => {
    if (!editor.plan || (editor.plan.warmUp.length === 0 && editor.plan.rounds.length === 0 && editor.plan.coolDown.length === 0)) {
        toastStore.addToast('Add some exercises to start a session!', 'error');
        return;
    }
    navigate('/session', { state: { workout: { ...editor.plan, name: workoutName } } });
  };
  
  const handleSave = async () => {
    if (!editor.plan || (editor.plan.warmUp.length === 0 && editor.plan.rounds.length === 0 && editor.plan.coolDown.length === 0)) {
      toastStore.addToast('Add some exercises before saving!', 'error');
      return;
    }
    await saveCustomWorkout({ ...editor.plan, name: workoutName });
    toastStore.addToast('Routine saved successfully!');
    navigate('/workout');
  };
  
  const purpose = useMemo(() => {
    if (!modalState) return 'main';

    if (modalState.mode === 'replace') {
        return undefined; // Allow replacing with ANY exercise from the full library.
    }

    // Determine purpose for adding an exercise (if this modal were used for it)
    if (modalState.section === 'warmUp') return 'warmup';
    if (modalState.section === 'coolDown') return 'cooldown';
    
    return 'main';
  }, [modalState]);


  const renderGroupableSection = (title: string, icon: React.ReactNode, section: WorkoutSectionType, exercises: Exercise[], onAddSuggested?: () => void) => {
    const itemsToRender: (Exercise | { type: 'group'; exercises: Exercise[] })[] = [];
    let currentGroup: Exercise[] = [];

    exercises.forEach(ex => {
        currentGroup.push(ex);
        if (!ex.linkedToNext) {
            if (currentGroup.length > 1) {
                itemsToRender.push({ type: 'group', exercises: currentGroup });
            } else {
                itemsToRender.push(currentGroup[0]);
            }
            currentGroup = [];
        }
    });
    if (currentGroup.length > 0) {
        itemsToRender.push(currentGroup.length > 1 ? { type: 'group', exercises: currentGroup } : currentGroup[0]);
    }
    
    return (
        <details open className="bg-gray-800/30 rounded-xl overflow-hidden transition-colors"
            onDragEnter={() => setDragOverInfo({ index: exercises.length, section })}
            onDragLeave={() => setDragOverInfo(null)}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverInfo({ index: exercises.length, section }); }}
            onDrop={(e) => handleDrop(e, exercises.length, section)}
        >
            <summary className="p-4 cursor-pointer flex justify-between items-center text-xl font-bold">
                <div className="flex items-center gap-3">
                    {icon} {title}
                </div>
                <div className="flex items-center gap-2">
                    {section !== 'rounds' && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                editor.removeSection(section);
                            }}
                            className="text-xs font-semibold text-red-400 hover:bg-red-500/20 px-2 py-1 rounded-md"
                        >
                            Remove
                        </button>
                    )}
                    <ChevronDownIcon className="w-6 h-6 transform transition-transform details-arrow" />
                </div>
            </summary>
            <div className="p-4 pt-0 space-y-3">
                {itemsToRender.map((item, groupIndex) => {
                    if ('type' in item && item.type === 'group') {
                        const { exercises: groupExercises } = item;
                        const lastInGroup = groupExercises[groupExercises.length - 1];
                        const firstInGroup = groupExercises[0];
                        const originalIndex = exercises.indexOf(firstInGroup);
                        
                        return (
                            <div key={`group-${section}-${groupIndex}`}>
                                {dragOverInfo?.section === section && dragOverInfo?.index === originalIndex && <div className="h-1.5 my-1 rounded-full bg-orange-500 animate-pulse" />}
                                <div className="bg-gray-700/50 rounded-xl space-y-0 border-l-4 border-orange-500">
                                    {groupExercises.map((ex, exerciseIndex) => (
                                        <div key={ex.id} draggable onDragStart={(e) => handleDragStart(e, originalIndex + exerciseIndex, section)} onDrop={(e) => handleDrop(e, originalIndex + exerciseIndex, section)} onDragEnter={() => setDragOverInfo({index: originalIndex + exerciseIndex, section: section})} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverInfo({ index: originalIndex + exerciseIndex, section: section });}}>
                                            <ExerciseCard
                                                exercise={ex}
                                                onUpdate={editor.updateExercise}
                                                onDelete={editor.removeExercise}
                                                onDuplicate={() => handleDuplicateExercise(ex, section, originalIndex + exerciseIndex)}
                                                onSwapRequest={() => handleSwapRequest(ex, section)}
                                                isLast={exerciseIndex === groupExercises.length - 1}
                                                universalRest={universalRest}
                                                allowLinking={true}
                                                isInGroup={true}
                                                isFirstInGroup={exerciseIndex === 0}
                                                isLastInGroup={exerciseIndex === groupExercises.length - 1}
                                                groupRounds={lastInGroup.groupRounds}
                                                onUpdateGroupRounds={(val) => editor.updateExercise(lastInGroup.id, { groupRounds: val })}
                                                groupRest={lastInGroup.restAfterGroup}
                                                onUpdateGroupRest={(val) => editor.updateExercise(lastInGroup.id, { restAfterGroup: val })}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    } else {
                        const exercise = item as Exercise;
                        const originalIndex = exercises.indexOf(exercise);
                        return (
                            <div key={exercise.id}>
                                {dragOverInfo?.section === section && dragOverInfo?.index === originalIndex && <div className="h-1.5 my-1 rounded-full bg-orange-500 animate-pulse" />}
                                <div draggable onDragStart={(e) => handleDragStart(e, originalIndex, section)} onDrop={(e) => handleDrop(e, originalIndex, section)} onDragEnter={() => setDragOverInfo({ index: originalIndex, section: section })} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverInfo({ index: originalIndex, section: section });}}>
                                    <ExerciseCard
                                        exercise={exercise}
                                        onUpdate={editor.updateExercise}
                                        onDelete={editor.removeExercise}
                                        onDuplicate={() => handleDuplicateExercise(exercise, section, originalIndex)}
                                        onSwapRequest={() => handleSwapRequest(exercise, section)}
                                        isLast={originalIndex === exercises.length - 1}
                                        universalRest={universalRest}
                                        allowLinking={true}
                                        isInGroup={false}
                                    />
                                </div>
                            </div>
                        );
                    }
                })}
                 {dragOverInfo?.section === section && dragOverInfo?.index === exercises.length && exercises.length > 0 && <div className="h-1.5 my-1 rounded-full bg-orange-500 animate-pulse" />}
                 {exercises.length === 0 && (
                     <div className={`text-center p-6 border-2 border-dashed rounded-xl transition-colors ${dragOverInfo?.section === section ? 'border-orange-500 bg-orange-500/10' : 'border-gray-700'}`}>
                        {section === 'rounds' ? 
                            <p className="text-gray-400 text-sm">Add exercises from the '+' button below to build your workout.</p> :
                            <p className="text-gray-400 text-sm">Drop exercises here or add a suggestion.</p>
                        }
                    </div>
                )}
                {onAddSuggested && (
                    <button 
                        onClick={onAddSuggested} 
                        className="w-full mt-2 text-sm text-center py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg">
                        Add Suggested {title === 'Main Workout' ? 'Exercise' : title + ' Exercise'}
                    </button>
                )}
            </div>
        </details>
      );
  };
  
  return (
    <>
      <ExerciseSearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onSelect={handleAddExercise} />
      {modalState && <ExerciseModal 
            isOpen={!!modalState} 
            onClose={() => setModalState(null)} 
            onSelectExercise={handleExerciseReplaced}
            mode={modalState.mode}
            exerciseToEdit={modalState.exerciseToEdit}
            purposeFilter={purpose}
      />}
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-40">
        <div>
          <Link to="/workout" className="text-sm text-orange-400 hover:underline mb-2 inline-block">
            &larr; Back to Workout Hub
          </Link>
          <input
            type="text"
            value={workoutName}
            onChange={e => setWorkoutName(e.target.value)}
            className="text-3xl font-bold text-white bg-transparent border-none focus:ring-0 w-full p-0"
            placeholder="My Custom Routine"
          />
        </div>

        <div className="bg-gray-800/50 p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <CogIcon className="w-6 h-6 text-gray-400"/>
                <div>
                    <label htmlFor="universal-rest" className="font-semibold text-white">Universal Rest</label>
                    <p className="text-xs text-gray-400">Default rest for new exercises.</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <input 
                    id="universal-rest"
                    type="number" 
                    value={universalRest} 
                    onChange={e => setUniversalRest(parseInt(e.target.value) || 0)}
                    className="w-20 bg-gray-900 text-center rounded-md p-2"
                    aria-label="Universal rest duration"
                />
                <span className="text-gray-400">s</span>
            </div>
        </div>
        
        {editor.plan?.warmUp && editor.plan.warmUp.length > 0 ? (
            renderGroupableSection('Warm-Up', <FlameIcon className="w-6 h-6 text-orange-400"/>, 'warmUp', editor.plan.warmUp, () => handleAddSuggestedExercise('warmup'))
        ) : (
            <div className="bg-gray-800/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FlameIcon className="w-6 h-6 text-gray-500"/>
                    <h3 className="text-xl font-bold text-gray-500">Warm-Up</h3>
                </div>
                <button
                    onClick={() => editor.addSection('warmUp')}
                    className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
                >
                    <PlusIcon className="w-4 h-4" /> Add Warm-up
                </button>
            </div>
        )}
        
        {renderGroupableSection('Main Workout', <ZapIcon className="w-6 h-6 text-yellow-400"/>, 'rounds', editor.plan?.rounds || [], handleAddSuggestedMainExercise)}
        
        {editor.plan?.coolDown && editor.plan.coolDown.length > 0 ? (
            renderGroupableSection('Cool-Down', <SparklesIcon className="w-6 h-6 text-blue-400"/>, 'coolDown', editor.plan.coolDown, () => handleAddSuggestedExercise('cooldown'))
        ) : (
            <div className="bg-gray-800/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <SparklesIcon className="w-6 h-6 text-gray-500"/>
                    <h3 className="text-xl font-bold text-gray-500">Cool-Down</h3>
                </div>
                <button
                    onClick={() => editor.addSection('coolDown')}
                    className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
                >
                    <PlusIcon className="w-4 h-4" /> Add Cool-down
                </button>
            </div>
        )}

      </div>

      <button onClick={() => setIsSearchOpen(true)} className="fixed bottom-36 right-6 bg-orange-500 text-white rounded-full p-4 shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-110 z-40" aria-label="Add Exercise">
        <PlusIcon className="w-8 h-8" />
      </button>

       <div className="fixed bottom-[60px] left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-700 z-30">
            <div className="container mx-auto flex items-center justify-between gap-4">
                <div className="flex gap-6 text-center">
                    <div>
                        <p className="font-bold text-white text-lg">{summary.count}</p>
                        <p className="text-xs text-gray-400">Exercises</p>
                    </div>
                    <div>
                        <p className="font-bold text-white text-lg">~{summary.time}</p>
                        <p className="text-xs text-gray-400">Minutes</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleSave} className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
                        <SaveIcon className="w-5 h-5"/> <span className="hidden sm:inline">Save Routine</span>
                    </button>
                    <button onClick={handleStart} className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-green-500/20">
                        <ZapIcon className="w-5 h-5"/> <span className="hidden sm:inline">Start Session</span>
                    </button>
                </div>
            </div>
      </div>
       <style>{`
          details > summary::-webkit-details-marker { display: none; }
          details[open] .details-arrow { transform: rotate(180deg); }
          .animate-fade-in-fast { animation: fadeIn 0.2s ease-in-out; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
};

export default ManualBuilder;
