import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutEditor } from '../hooks/useWorkoutEditor';
import { Exercise, WorkoutPlan, WorkoutPreferences } from '../types';
import { PlusIcon, ArrowPathIcon, TrashIcon, DragHandleIcon, UndoIcon, RedoIcon, SaveIcon, ZapIcon, FolderOpenIcon, CogIcon, ChevronDownIcon, FlameIcon, SparklesIcon, LinkOffIcon } from './icons/Icons';
import ExerciseModal from './ExerciseModal';
import ConfirmModal from './ConfirmModal';
import BulkActionToolbar from './BulkActionToolbar';
import WorkoutPreferencesModal from './WorkoutPreferencesModal';
import LoadTemplateModal from './LoadTemplateModal';
import SaveRoutineModal from './SaveRoutineModal';
import { toastStore } from '../store/toastStore';
import { saveCustomWorkout } from '../services/workoutService';
import { getSuggestedMainExercise } from '../services/exerciseService';
import { flattenWorkoutForSession } from '../utils/workoutUtils';
import ExerciseCard from './ExerciseCard';
import StepperInput from './StepperInput';

type EditableWorkoutPlanProps = {
  editor: ReturnType<typeof useWorkoutEditor>;
  originalPreferences: WorkoutPreferences | null;
};

type WorkoutSection = 'warmUp' | 'rounds' | 'coolDown';

const EditableWorkoutPlan: React.FC<EditableWorkoutPlanProps> = ({ editor, originalPreferences }) => {
  const navigate = useNavigate();
  const { plan, preferences, addExercise, moveExercise, undo, redo, canUndo, canRedo, updateExercise, removeExercise, addSection, removeSection, unlinkExercise } = editor;

  const [modalState, setModalState] = useState<{ mode: 'add' | 'replace'; section: WorkoutSection, exerciseToEdit?: Exercise, index?: number, intoGroup?: boolean } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Exercise | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [showLoadTemplate, setShowLoadTemplate] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  
  const dragItem = useRef<{index: number, section: WorkoutSection} | null>(null);
  const [dragOverInfo, setDragOverInfo] = useState<{index: number; section: WorkoutSection} | null>(null);
  
  // --- Refs for Touch Drag & Drop ---
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  
  const totalTime = useMemo(() => {
    if (!plan) return 0;
    const { sessionItems } = flattenWorkoutForSession(plan);
    const totalSeconds = sessionItems.reduce((acc, item) => acc + item.duration, 0);
    return Math.floor(totalSeconds / 60);
  }, [plan]);

  const purpose = useMemo(() => {
    if (!modalState) return 'main';

    if (modalState.mode === 'replace') {
        return undefined; // Allow replacing with any exercise type from the full library
    }

    if (modalState.section === 'warmUp') return 'warmup';
    if (modalState.section === 'coolDown') return 'cooldown';
    
    // For adding to the main workout
    return 'main';
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
      addExercise(exerciseData, modalState.section, { index: modalState.index, intoGroup: modalState.intoGroup });
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
      updateExercise(modalState.exerciseToEdit.id, updatedData);
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
    navigate('/session', { state: { workout: plan, preferences: originalPreferences, editorPreferences: preferences } });
  };
  
   const handleDuplicateExercise = (exercise: Exercise, section: WorkoutSection, index: number) => {
    const { id, status, ...exerciseData } = exercise;
    addExercise(exerciseData, section, { index: index + 1 });
  };
  
  const handleDragStart = (e: React.DragEvent, index: number, section: WorkoutSection) => {
    dragItem.current = { index, section };
    setDraggingId(plan[section][index].id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    dragItem.current = null;
  }
  
  const handleDrop = (e: React.DragEvent, dropIndex: number, dropSection: WorkoutSection) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverInfo(null);
    if (!dragItem.current) return;
    
    if (dragItem.current.section === dropSection && dragItem.current.index === dropIndex) {
        dragItem.current = null;
        return;
    }
    
    moveExercise(dragItem.current, { index: dropIndex, section: dropSection });
    dragItem.current = null;
  };

  // --- Touch Handlers ---
  const handleTouchStart = useCallback((e: React.TouchEvent, index: number, section: WorkoutSection) => {
    const handle = (e.target as HTMLElement).closest('[data-drag-handle]');
    if (handle && plan) {
        isDragging.current = true;
        dragItem.current = { index, section };
        setDraggingId(plan[section][index].id);
        touchStartY.current = e.touches[0].clientY;
    }
  }, [plan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;

    const currentY = e.touches[0].clientY;
    // Only prevent scroll if user has moved more than a small threshold vertically
    if (Math.abs(currentY - touchStartY.current) > 10) {
        e.preventDefault();

        const dropTarget = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        if (dropTarget) {
            const dropNodeContainer = dropTarget.closest('[data-draggable-item]') as HTMLElement;
            if (dropNodeContainer) {
                const dropIndex = parseInt(dropNodeContainer.dataset.index || '0', 10);
                const dropSection = dropNodeContainer.dataset.section as WorkoutSection;
                
                const rect = dropNodeContainer.getBoundingClientRect();
                const isAfter = (e.touches[0].clientY - rect.top) > (rect.height / 2);
                const targetIndex = isAfter ? dropIndex + 1 : dropIndex;

                if (dragOverInfo?.index !== targetIndex || dragOverInfo?.section !== dropSection) {
                    setDragOverInfo({ index: targetIndex, section: dropSection });
                }
            }
        }
    }
  }, [dragOverInfo]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging.current && dragItem.current && dragOverInfo) {
        moveExercise(dragItem.current, dragOverInfo);
    }
    // Cleanup
    isDragging.current = false;
    dragItem.current = null;
    setDragOverInfo(null);
    setDraggingId(null);
  }, [dragOverInfo, moveExercise]);


  const handleAddSuggestedMainExercise = () => {
    const suggested = getSuggestedMainExercise(plan?.rounds || []);
    if (suggested) {
        const exerciseWithUniversalRest = { ...suggested, rest: preferences.universalRestDuration };
        addExercise(exerciseWithUniversalRest, 'rounds', { index: plan?.rounds.length });
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
                <div className="flex items-center gap-2">
                    {section !== 'rounds' && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                removeSection(section);
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
                                <div className="bg-gray-700/50 rounded-xl border border-gray-900/50">
                                     <div className="p-3 border-b border-gray-900/50 flex flex-col sm:flex-row gap-4 items-center bg-gray-900/30 rounded-t-xl">
                                        <h4 className="text-sm font-bold text-orange-400">SUPERSET</h4>
                                        <div className="flex-1 w-full sm:w-auto form-group">
                                            <label className="text-xs">ROUNDS</label>
                                            <StepperInput
                                            value={lastInGroup.groupRounds || 1}
                                            onChange={(val) => updateExercise(lastInGroup.id, { groupRounds: val })}
                                            min={1}
                                            aria-label="Number of rounds for this superset"
                                            />
                                        </div>
                                        <div className="flex-1 w-full sm:w-auto form-group">
                                            <label className="text-xs">REST AFTER</label>
                                            <StepperInput
                                                value={lastInGroup.restAfterGroup ?? 60}
                                                onChange={(val) => updateExercise(lastInGroup.id, { restAfterGroup: val })}
                                                step={15}
                                                min={0}
                                                aria-label="Rest after round in seconds"
                                            />
                                        </div>
                                    </div>
                                    {groupExercises.map((ex, exerciseIndex) => {
                                        const currentIndex = originalIndex + exerciseIndex;
                                        return (
                                            <div key={ex.id} draggable onDragStart={(e) => handleDragStart(e, currentIndex, section)} onDragEnd={handleDragEnd} onDrop={(e) => handleDrop(e, currentIndex, section)} onDragEnter={() => setDragOverInfo({index: currentIndex, section: section})} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverInfo({ index: currentIndex, section: section });}} onTouchStart={(e) => handleTouchStart(e, currentIndex, section)} data-draggable-item data-index={currentIndex} data-section={section}>
                                                <ExerciseCard
                                                    exercise={ex}
                                                    onUpdate={updateExercise}
                                                    onDelete={removeExercise}
                                                    onDuplicate={() => handleDuplicateExercise(ex, section, currentIndex)}
                                                    onSwapRequest={handleSwapRequest}
                                                    onAddToGroup={() => setModalState({ mode: 'add', section, index: currentIndex + 1, intoGroup: true })}
                                                    onUnlink={() => unlinkExercise(ex.id, section)}
                                                    isLastInGroup={exerciseIndex === groupExercises.length - 1}
                                                    allowLinking={true}
                                                    isInGroup={true}
                                                    isSelected={selectedIds.includes(ex.id)}
                                                    onSelect={handleSelection}
                                                    isDragging={draggingId === ex.id}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    } else {
                        const exercise = item as Exercise;
                        const originalIndex = exercises.indexOf(exercise);
                        return (
                            <div key={exercise.id}>
                                {dragOverInfo?.section === section && dragOverInfo?.index === originalIndex && <div className="h-1.5 my-1 rounded-full bg-orange-500 animate-pulse" />}
                                <div draggable onDragStart={(e) => handleDragStart(e, originalIndex, section)} onDragEnd={handleDragEnd} onDrop={(e) => handleDrop(e, originalIndex, section)} onDragEnter={() => setDragOverInfo({ index: originalIndex, section: section })} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverInfo({ index: originalIndex, section: section });}} onTouchStart={(e) => handleTouchStart(e, originalIndex, section)} data-draggable-item data-index={originalIndex} data-section={section}>
                                    <ExerciseCard
                                        exercise={exercise}
                                        onUpdate={updateExercise}
                                        onDelete={removeExercise}
                                        onDuplicate={() => handleDuplicateExercise(exercise, section, originalIndex)}
                                        onSwapRequest={handleSwapRequest}
                                        onAddToGroup={() => setModalState({ mode: 'add', section, index: originalIndex + 1, intoGroup: true })}
                                        onUnlink={() => unlinkExercise(exercise.id, section)}
                                        isLastInGroup={true}
                                        allowLinking={section === 'rounds'}
                                        isInGroup={!!(exercise.sets && exercise.sets > 1)}
                                        isSelected={selectedIds.includes(exercise.id)}
                                        onSelect={handleSelection}
                                        isDragging={draggingId === exercise.id}
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
      <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg animate-fade-in space-y-4" onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
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
              <button onClick={() => setIsPreferencesOpen(true)} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md"><CogIcon className="w-5 h-5"/></button>
          </div>
        </div>
        
        {selectedIds.length > 0 && <BulkActionToolbar editor={editor} selectedIds={selectedIds} clearSelection={() => setSelectedIds([])}/>}
        
        {plan.warmUp && plan.warmUp.length > 0 ? (
            renderGroupableSection('Warm-up', <FlameIcon className="w-6 h-6 text-orange-400"/>, 'warmUp', plan.warmUp)
        ) : (
            <div className="bg-gray-800/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FlameIcon className="w-6 h-6 text-gray-500"/>
                    <h3 className="text-xl font-bold text-gray-500">Warm-Up</h3>
                </div>
                <button
                    onClick={() => addSection('warmUp')}
                    className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
                >
                    <PlusIcon className="w-4 h-4" /> Add Warm-up
                </button>
            </div>
        )}

        {renderGroupableSection('Main Workout', <ZapIcon className="w-6 h-6 text-yellow-400"/>, 'rounds', plan.rounds)}

        {plan.coolDown && plan.coolDown.length > 0 ? (
            renderGroupableSection('Cool-down', <SparklesIcon className="w-6 h-6 text-blue-400"/>, 'coolDown', plan.coolDown)
        ) : (
            <div className="bg-gray-800/30 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <SparklesIcon className="w-6 h-6 text-gray-500"/>
                    <h3 className="text-xl font-bold text-gray-500">Cool-Down</h3>
                </div>
                <button
                    onClick={() => addSection('coolDown')}
                    className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
                >
                    <PlusIcon className="w-4 h-4" /> Add Cool-down
                </button>
            </div>
        )}
        
        {/* Modals and Panels */}
        {modalState && <ExerciseModal 
            isOpen={!!modalState} 
            onClose={() => setModalState(null)} 
            onSelectExercise={handleExerciseSelect}
            mode={modalState.mode}
            exerciseToEdit={modalState.exerciseToEdit}
            purposeFilter={purpose}
            originalPreferences={originalPreferences}
            defaultRest={preferences.universalRestDuration}
        />}
        {confirmDelete && <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { removeExercise(confirmDelete.id); setConfirmDelete(null);}} title="Delete Exercise?" message={`Are you sure you want to remove "${confirmDelete.exercise}"?`} />}
        <WorkoutPreferencesModal isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)} editor={editor} />
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