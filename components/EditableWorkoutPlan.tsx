import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutEditor } from '../hooks/useWorkoutEditor';
import { Exercise, WorkoutPlan, WorkoutPreferences } from '../types';
import { PlusIcon, ArrowPathIcon, TrashIcon, DragHandleIcon, UndoIcon, RedoIcon, SaveIcon, ZapIcon, FolderOpenIcon, CogIcon, ChevronDownIcon, FlameIcon, SparklesIcon } from './icons/Icons';
import ExerciseModal from './ExerciseModal';
import ConfirmModal from './ConfirmModal';
import BulkActionToolbar from './BulkActionToolbar';
import RestSettingsPanel from './RestSettingsPanel';
import LoadTemplateModal from './LoadTemplateModal';
import SaveRoutineModal from './SaveRoutineModal';
import { toastStore } from '../store/toastStore';
import { saveCustomWorkout } from '../services/workoutService';
import { getSuggestedMainExercise } from '../services/exerciseService';
import { flattenWorkoutForSession } from '../utils/workoutUtils';
import ExerciseCard from './ExerciseCard';

type EditableWorkoutPlanProps = {
  editor: ReturnType<typeof useWorkoutEditor>;
  originalPreferences: WorkoutPreferences | null;
};

type WorkoutSection = 'warmUp' | 'rounds' | 'coolDown';

const EditableWorkoutPlan: React.FC<EditableWorkoutPlanProps> = ({ editor, originalPreferences }) => {
  const navigate = useNavigate();
  const { plan, undo, redo, canUndo, canRedo, updateExercise, removeExercise } = editor;

  const [modalState, setModalState] = useState<{ mode: 'add' | 'replace'; section: WorkoutSection, exerciseToEdit?: Exercise, index?: number } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Exercise | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showRestSettings, setShowRestSettings] = useState(false);
  const [showLoadTemplate, setShowLoadTemplate] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [universalRest, setUniversalRest] = useState(30);
  
  const dragItem = useRef<{index: number, section: WorkoutSection} | null>(null);
  const [dragOverInfo, setDragOverInfo] = useState<{index: number; section: WorkoutSection} | null>(null);
  
  const totalTime = useMemo(() => {
    if (!plan) return 0;
    const planForSession = flattenWorkoutForSession(plan);
    const totalSeconds = (planForSession.warmUp?.reduce((acc, ex) => acc + ex.duration + ex.rest, 0) || 0) +
        (planForSession.rounds?.reduce((acc, ex) => acc + ex.duration + ex.rest, 0) || 0) +
        (planForSession.coolDown?.reduce((acc, ex) => acc + ex.duration + ex.rest, 0) || 0);
    return Math.floor(totalSeconds / 60);
  }, [plan]);

  const purpose = useMemo(() => {
    if (!modalState) return 'main';

    if (modalState.section === 'warmUp' || modalState.section === 'coolDown') {
      return modalState.section === 'warmUp' ? 'warmup' : 'cooldown';
    }
    // For swapping or adding to the main workout, allow any exercise type.
    return undefined; 
  }, [modalState]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

        if (ctrlKey && e.key === 'z') {
            e.preventDefault();
            undo();
        } else if (ctrlKey && e.key === 'y') {
            e.preventDefault();
            redo();
        } else if (ctrlKey && e.key === 'a') {
            e.preventDefault();
            if (plan && plan.rounds.length > 0) {
                if(selectedIds.length === plan.rounds.length){
                    setSelectedIds([]);
                } else {
                    setSelectedIds(plan.rounds.map(r => r.id));
                }
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, plan, selectedIds.length]);

  if (!plan) return null;

  const handleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }

  const handleSave = async (workoutName: string) => {
    if (!plan) return;
    setIsSaving(true);
    try {
        const routineToSave: WorkoutPlan = {
            ...plan,
            id: crypto.randomUUID(), // Assign a new ID to make it a distinct saved entity
            name: workoutName
        };
        await saveCustomWorkout(routineToSave);
        toastStore.addToast('Custom workout saved!');
    } catch (e) {
        toastStore.addToast('Failed to save workout', 'error');
    } finally {
        setIsSaving(false);
    }
  }

  const handleExerciseSelect = (exerciseData: Omit<Exercise, 'id' | 'status'>) => {
    if (!modalState) return;
    if (modalState.mode === 'add') {
      editor.addExercise(exerciseData, modalState.section, modalState.index);
    } else if (modalState.mode === 'replace' && modalState.exerciseToEdit) {
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
  };
  
  const findExerciseSection = (exerciseId: string): WorkoutSection | null => {
    if (!plan) return null;
    if (plan.warmUp.some(ex => ex.id === exerciseId)) return 'warmUp';
    if (plan.rounds.some(ex => ex.id === exerciseId)) return 'rounds';
    if (plan.coolDown.some(ex => ex.id === exerciseId)) return 'coolDown';
    return null;
  }
  
  const handleSwapRequest = (exerciseToSwap: Exercise) => {
    const section = findExerciseSection(exerciseToSwap.id);
    if (section) {
        setModalState({ mode: 'replace', section, exerciseToEdit: exerciseToSwap });
    }
  };

  const startWorkout = () => {
    sessionStorage.removeItem('suggestedWorkoutPlan');
    navigate('/session', { state: { workout: plan, preferences: originalPreferences } });
  };
  
   const handleDuplicateExercise = (exercise: Exercise, section: WorkoutSection, index: number) => {
    const { id, status, ...exerciseData } = exercise;
    const newExercise = { ...exerciseData, rest: universalRest };
    editor.addExercise(newExercise, section, index + 1);
  };
  
  const handleDragStart = (e: React.DragEvent, index: number, section: WorkoutSection) => {
    dragItem.current = { index, section };
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDrop = (e: React.DragEvent, dropIndex: number, dropSection: WorkoutSection) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverInfo(null);
    if (!dragItem.current) return;
    
    if (dragItem.current.section === dropSection && dragItem.current.index === dropIndex) {
        dragItem.current = null;
        return;
    }
    
    editor.moveExercise(dragItem.current, { index: dropIndex, section: dropSection });
    dragItem.current = null;
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

  const renderGroupableSection = (title: string, icon: React.ReactNode, section: WorkoutSection, exercises: Exercise[]) => {
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
                <ChevronDownIcon className="w-6 h-6 transform transition-transform details-arrow" />
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
                                                onUpdate={updateExercise}
                                                onDelete={removeExercise}
                                                onDuplicate={() => handleDuplicateExercise(ex, section, originalIndex + exerciseIndex)}
                                                onSwapRequest={handleSwapRequest}
                                                isLast={exerciseIndex === groupExercises.length - 1}
                                                universalRest={universalRest}
                                                allowLinking={true}
                                                isInGroup={true}
                                                isFirstInGroup={exerciseIndex === 0}
                                                isLastInGroup={exerciseIndex === groupExercises.length - 1}
                                                groupRounds={lastInGroup.groupRounds}
                                                onUpdateGroupRounds={(val) => updateExercise(lastInGroup.id, { groupRounds: val })}
                                                groupRest={lastInGroup.restAfterGroup}
                                                onUpdateGroupRest={(val) => updateExercise(lastInGroup.id, { restAfterGroup: val })}
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
                                        onUpdate={updateExercise}
                                        onDelete={removeExercise}
                                        onDuplicate={() => handleDuplicateExercise(exercise, section, originalIndex)}
                                        onSwapRequest={handleSwapRequest}
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
                <div className={`w-full mt-3 grid grid-cols-1 ${section === 'rounds' ? 'sm:grid-cols-2' : ''} gap-3`}>
                    <button 
                        onClick={() => setModalState({mode: 'add', section, index: exercises.length})}
                        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-600 hover:border-orange-400 hover:bg-gray-700/50 text-gray-300 font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                        <PlusIcon className="w-4 h-4" />
                        {section === 'rounds' ? 'Add From Library' : 'Add Exercise'}
                    </button>
                     {section === 'rounds' && (
                        <button 
                            onClick={handleAddSuggestedMainExercise}
                            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-600 hover:border-teal-400 hover:bg-gray-700/50 text-gray-300 font-bold py-2 px-4 rounded-lg transition-colors text-sm">
                            <SparklesIcon className="w-4 h-4 text-teal-400" />
                            Add Suggestion
                        </button>
                    )}
                </div>
            </div>
        </details>
      );
  };


  return (
    <>
      <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg animate-fade-in space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-700 pb-4">
          <div>
              <h2 className="text-2xl font-bold text-orange-400">Customize Your Workout</h2>
              <p className="text-sm text-gray-400">Total time: ~{totalTime} minutes</p>
          </div>
          <div className="flex items-center gap-2">
              <button onClick={undo} disabled={!canUndo} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"><UndoIcon className="w-5 h-5"/></button>
              <button onClick={redo} disabled={!canRedo} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"><RedoIcon className="w-5 h-5"/></button>
              <button onClick={() => setShowLoadTemplate(true)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md"><FolderOpenIcon className="w-5 h-5"/></button>
              <button onClick={() => setShowRestSettings(true)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md"><CogIcon className="w-5 h-5"/></button>
          </div>
        </div>
        
        {selectedIds.length > 0 && <BulkActionToolbar editor={editor} selectedIds={selectedIds} clearSelection={() => setSelectedIds([])}/>}
        
        {plan.warmUp && plan.warmUp.length > 0 && renderGroupableSection('Warm-up', <FlameIcon className="w-6 h-6 text-orange-400"/>, 'warmUp', plan.warmUp)}

        {renderGroupableSection('Main Workout', <ZapIcon className="w-6 h-6 text-yellow-400"/>, 'rounds', plan.rounds)}

        {plan.coolDown && plan.coolDown.length > 0 && renderGroupableSection('Cool-down', <SparklesIcon className="w-6 h-6 text-blue-400"/>, 'coolDown', plan.coolDown)}
        
        {/* Modals and Panels */}
        {modalState && <ExerciseModal 
            isOpen={!!modalState} 
            onClose={() => setModalState(null)} 
            onSelectExercise={handleExerciseSelect}
            mode={modalState.mode}
            exerciseToEdit={modalState.exerciseToEdit}
            purposeFilter={purpose}
            originalPreferences={originalPreferences}
        />}
        {confirmDelete && <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { removeExercise(confirmDelete.id); setConfirmDelete(null);}} title="Delete Exercise?" message={`Are you sure you want to remove "${confirmDelete.exercise}"?`} />}
        {showRestSettings && <RestSettingsPanel isOpen={showRestSettings} onClose={() => setShowRestSettings(false)} editor={editor} setUniversalRest={setUniversalRest} />}
        {showLoadTemplate && <LoadTemplateModal isOpen={showLoadTemplate} onClose={() => setShowLoadTemplate(false)} editor={editor} />}
        <SaveRoutineModal 
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          onSave={handleSave}
          defaultName={plan.name || `Custom Workout - ${new Date().toLocaleDateString()}`}
        />
         <style>{`
          details > summary::-webkit-details-marker { display: none; }
          details[open] .details-arrow { transform: rotate(180deg); }
          .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.75rem; font-weight: 500; color: #9CA3AF; }
          .form-group input { width: 100%; background-color: #111827; color: white; border: 1px solid #4B5563; border-radius: 0.5rem; padding: 0.5rem; text-align: center; outline: none; }
          .form-group input:focus { border-color: #F97316; box-shadow: 0 0 0 2px #F9731640; }
          input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
          input[type=number] { -moz-appearance: textfield; }
      `}</style>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-[60px] left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-700 z-30">
          <div className="container mx-auto flex gap-4">
              <button onClick={() => setIsSaveModalOpen(true)} disabled={isSaving} className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
                  {isSaving ? 'Saving...' : <><SaveIcon className="w-5 h-5"/> Save as Routine</>}
              </button>
              <button onClick={startWorkout} className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-green-500/20">
                  <ZapIcon className="w-5 h-5"/>
                  Start Live Session
              </button>
          </div>
      </div>
    </>
  );
};

export default EditableWorkoutPlan;