import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutEditor } from '../hooks/useWorkoutEditor';
import { Exercise, WorkoutPlan, WorkoutPreferences } from '../types';
import { PlusIcon, ArrowPathIcon, UndoIcon, RedoIcon, SaveIcon, ZapIcon, FolderOpenIcon, CogIcon, ChevronDownIcon, FlameIcon, SparklesIcon } from './icons/Icons';
import ExerciseModal from './ExerciseModal';
import ConfirmModal from './ConfirmModal';
import BulkActionToolbar from './BulkActionToolbar';
import WorkoutPreferencesModal from './WorkoutPreferencesModal';
import LoadTemplateModal from './LoadTemplateModal';
import SaveRoutineModal from './SaveRoutineModal';
import ExerciseDetailModal from './ExerciseDetailModal'; // New Import
import AddExerciseChoiceModal from './AddExerciseChoiceModal'; // New Import
import { toastStore } from '../store/toastStore';
import { saveCustomWorkout } from '../services/workoutService';
import { getSuggestedMainExercise, getSingleSuggestedExercise } from '../services/exerciseService';
import { flattenWorkoutForSession } from '../utils/workoutUtils';
import ExerciseCard from './ExerciseCard';
import { EXERCISE_DATABASE } from '../data/exerciseDatabase';

type EditableWorkoutPlanProps = {
  editor: ReturnType<typeof useWorkoutEditor>;
  originalPreferences: WorkoutPreferences | null;
  onRegenerate: () => void;
};

type WorkoutSection = 'warmUp' | 'rounds' | 'coolDown';

// Create a map for efficient exercise ID lookups
const exerciseIdMap = new Map<string, string>();
EXERCISE_DATABASE.forEach(ex => {
  exerciseIdMap.set(ex.name, ex.id);
});

const EditableWorkoutPlan: React.FC<EditableWorkoutPlanProps> = ({ editor, originalPreferences, onRegenerate }) => {
  const navigate = useNavigate();
  const { plan, preferences, addExercise, moveExercise, undo, redo, canUndo, canRedo, updateExercise, removeExercise, addSection, removeSection, unlinkExercise } = editor;

  const [modalState, setModalState] = useState<{ mode: 'add' | 'replace'; section: WorkoutSection, exerciseToEdit?: Exercise, index?: number, intoGroup?: boolean } | null>(null);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Exercise | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [showLoadTemplate, setShowLoadTemplate] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  
  const [detailModalExerciseId, setDetailModalExerciseId] = useState<string | null>(null);
  const [addChoiceSection, setAddChoiceSection] = useState<WorkoutSection | null>(null);
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null);


  const dragItem = useRef<{index: number, section: WorkoutSection} | null>(null);
  const [dragOverInfo, setDragOverInfo] = useState<{index: number; section: WorkoutSection} | null>(null);
  
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
    if (modalState.mode === 'replace') return undefined;
    if (modalState.section === 'warmUp') return 'warmup';
    if (modalState.section === 'coolDown') return 'cooldown';
    return 'main';
  }, [modalState]);


  // --- Auto-collapse logic ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('[data-exercise-card]')) {
        return;
      }
      setExpandedExerciseId(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlKey = isMac ? e.metaKey : e.ctrlKey;
        if (ctrlKey && (e.key === 'z' || e.key === 'y')) setExpandedExerciseId(null);
        if (ctrlKey && e.key === 'z') { e.preventDefault(); undo(); } 
        else if (ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
        else if (ctrlKey && e.key === 'a') {
            e.preventDefault();
            if (plan && plan.rounds.length > 0) {
                setSelectedIds(selectedIds.length === plan.rounds.length ? [] : plan.rounds.map(r => r.id));
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
    setExpandedExerciseId(null); 
    if (!plan) return;
    setIsSaving(true);
    try {
        const routineToSave: WorkoutPlan = { ...plan, id: crypto.randomUUID(), name: workoutName };
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
      const updatedData = { ...exerciseData, sets: modalState.exerciseToEdit.sets, reps: modalState.exerciseToEdit.reps, duration: modalState.exerciseToEdit.duration, rest: modalState.exerciseToEdit.rest, unit: modalState.exerciseToEdit.unit };
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
    setExpandedExerciseId(null); 
    sessionStorage.removeItem('suggestedWorkoutPlan');
    navigate('/session', { state: { workout: plan, preferences: originalPreferences, editorPreferences: preferences } });
  };
  
   const handleDuplicateExercise = (exercise: Exercise, section: WorkoutSection, index: number) => {
    const { id, status, ...exerciseData } = exercise;
    addExercise(exerciseData, section, { index: index + 1 });
  };

  const handleToggleExpand = (id: string) => {
    setExpandedExerciseId(currentId => (currentId === id ? null : id));
  };

  const handleRegenerate = () => {
    setExpandedExerciseId(null);
    onRegenerate();
  }

  const handleDragStart = (e: React.DragEvent, index: number, section: WorkoutSection) => { dragItem.current = { index, section }; setDraggingId(plan[section][index].id); e.dataTransfer.effectAllowed = 'move'; };
  const handleDragEnd = () => { setDraggingId(null); dragItem.current = null; setDragOverGroupId(null); }
  const handleDrop = (e: React.DragEvent, dropIndex: number, dropSection: WorkoutSection) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverInfo(null);
    if (!dragItem.current || (dragItem.current.section === dropSection && dragItem.current.index === dropIndex)) {
      dragItem.current = null;
      setDraggingId(null); // Explicitly reset dragging state
      setDragOverGroupId(null);
      return;
    }
    moveExercise(dragItem.current, { index: dropIndex, section: dropSection });
    dragItem.current = null;
    setDraggingId(null); // Explicitly reset dragging state
    setDragOverGroupId(null);
  };
  const handleTouchStart = useCallback((e: React.TouchEvent, index: number, section: WorkoutSection) => { const handle = (e.target as HTMLElement).closest('[data-drag-handle]'); if (handle && plan) { isDragging.current = true; dragItem.current = { index, section }; setDraggingId(plan[section][index].id); touchStartY.current = e.touches[0].clientY; } }, [plan]);
  const handleTouchMove = useCallback((e: React.TouchEvent) => { if (!isDragging.current) return; if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) { e.preventDefault(); const dropTarget = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY); if (dropTarget) { const dropNodeContainer = dropTarget.closest('[data-draggable-item]') as HTMLElement; if (dropNodeContainer) { const dropIndex = parseInt(dropNodeContainer.dataset.index || '0', 10); const dropSection = dropNodeContainer.dataset.section as WorkoutSection; const rect = dropNodeContainer.getBoundingClientRect(); const isAfter = (e.touches[0].clientY - rect.top) > (rect.height / 2); const targetIndex = isAfter ? dropIndex + 1 : dropIndex; if (dragOverInfo?.index !== targetIndex || dragOverInfo?.section !== dropSection) { setDragOverInfo({ index: targetIndex, section: dropSection }); } } } } }, [dragOverInfo]);
  const handleTouchEnd = useCallback(() => { if (isDragging.current && dragItem.current && dragOverInfo) { moveExercise(dragItem.current, dragOverInfo); } isDragging.current = false; dragItem.current = null; setDragOverInfo(null); setDraggingId(null); }, [dragOverInfo, moveExercise]);

  const handleAddChoice = async (options: { type: 'suggestion' | 'library'; groupEndIndex?: number }) => {
    const { type, groupEndIndex } = options;
    if (!addChoiceSection) return;

    const isIntoGroup = groupEndIndex !== undefined;
    const targetIndex = isIntoGroup ? groupEndIndex + 1 : (plan?.[addChoiceSection]?.length || 0);

    if (type === 'suggestion') {
        // FIX: Awaited the async call to ensure suggestion is an object, not a Promise.
        const suggestion = await (addChoiceSection === 'rounds'
            ? getSuggestedMainExercise(plan?.rounds || [])
            : getSingleSuggestedExercise(addChoiceSection === 'warmUp' ? 'warmup' : 'cooldown'));
        
        if (suggestion) {
            const exerciseWithRest = { ...suggestion, rest: preferences.universalRestDuration };
            addExercise(exerciseWithRest, addChoiceSection, { index: targetIndex, intoGroup: isIntoGroup });
            toastStore.addToast(`Added "${suggestion.exercise}"`);
        } else {
            toastStore.addToast("Couldn't find a unique exercise to suggest!", 'error');
        }
    } else { // library
        setModalState({ mode: 'add', section: addChoiceSection, index: targetIndex, intoGroup: isIntoGroup });
    }
    setAddChoiceSection(null);
  };


  const renderGroupableSection = (title: string, icon: React.ReactNode, section: WorkoutSection, exercises: Exercise[]) => {
    const itemsToRender: (Exercise | { type: 'group'; exercises: Exercise[] })[] = [];
    let currentGroup: Exercise[] = [];

    exercises.forEach(ex => {
        currentGroup.push(ex);
        if (!ex.linkedToNext) {
            itemsToRender.push(currentGroup.length > 1 ? { type: 'group', exercises: currentGroup } : currentGroup[0]);
            currentGroup = [];
        }
    });
    if (currentGroup.length > 0) itemsToRender.push(currentGroup.length > 1 ? { type: 'group', exercises: currentGroup } : currentGroup[0]);

    return (
        <details open className="bg-gray-800/30 rounded-xl overflow-hidden transition-colors" onDragEnter={() => setDragOverInfo({ index: exercises.length, section })} onDragLeave={() => setDragOverInfo(null)} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverInfo({ index: exercises.length, section }); }} onDrop={(e) => handleDrop(e, exercises.length, section)}>
            <summary className="p-4 cursor-pointer flex justify-between items-center text-xl font-bold">
                <div className="flex items-center gap-3">{icon} {title}</div>
                <div className="flex items-center gap-2">
                    {section !== 'rounds' && (<button onClick={(e) => { e.preventDefault(); removeSection(section);}} className="text-xs font-semibold text-red-400 hover:bg-red-500/20 px-2 py-1 rounded-md">Remove</button>)}
                    <ChevronDownIcon className="w-6 h-6 transform transition-transform details-arrow" />
                </div>
            </summary>
            <div className="p-4 pt-0 space-y-3">
                {itemsToRender.map((item, groupIndex) => {
                    if ('type' in item && item.type === 'group') {
                        const { exercises: groupExercises } = item;
                        const firstInGroup = groupExercises[0];
                        const lastInGroup = groupExercises[groupExercises.length - 1];
                        const originalIndex = exercises.indexOf(firstInGroup);
                        const groupRoundsCount = lastInGroup.groupRounds || 1;
                        const groupId = firstInGroup.id;
                        const isDropZone = dragOverGroupId === groupId;
                        
                        const isDraggedItemInThisGroup = dragItem.current && groupExercises.some(ex => ex.id === plan[dragItem.current!.section][dragItem.current!.index].id);

                        const handleGroupDrop = (e: React.DragEvent) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDragOverGroupId(null);
                            if (!dragItem.current) {
                                setDraggingId(null);
                                return;
                            }
                            const lastExerciseInGroupIndex = exercises.indexOf(lastInGroup);
                            moveExercise(dragItem.current, { index: lastExerciseInGroupIndex + 1, section: section });
                            // Explicitly reset all drag-related states to fix visual bug
                            dragItem.current = null;
                            setDraggingId(null);
                            setDragOverInfo(null);
                        }
                        
                        return (
                            <div key={`group-${section}-${groupIndex}`}>
                                {dragOverInfo?.section === section && dragOverInfo?.index === originalIndex && <div className="h-1.5 my-1 rounded-full bg-orange-500 animate-pulse" />}
                                <div 
                                    className={`relative bg-gray-700/50 rounded-xl border transition-all ${isDropZone ? 'border-2 border-blue-500' : 'border-gray-600/50'}`}
                                    onDragEnter={(e) => { e.stopPropagation(); if (!isDraggedItemInThisGroup) setDragOverGroupId(groupId); }}
                                    onDragLeave={(e) => { e.stopPropagation(); setDragOverGroupId(null); }}
                                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    onDrop={handleGroupDrop}
                                >
                                     {isDropZone && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 rounded-xl pointer-events-none">
                                            <p className="text-blue-300 font-bold">Drop to add to Superset</p>
                                        </div>
                                     )}
                                     <div className="p-3 border-b border-gray-600/50 flex items-center bg-gray-900/30 rounded-t-xl gap-4">
                                        <h4 className="text-sm font-bold text-orange-400">SUPERSET ({groupRoundsCount} Rounds)</h4>
                                    </div>
                                    {groupExercises.map((ex, exerciseIndex) => {
                                        const currentIndex = originalIndex + exerciseIndex;
                                        return (
                                            <div key={ex.id} draggable onDragStart={(e) => handleDragStart(e, currentIndex, section)} onDragEnd={handleDragEnd} onDrop={(e) => handleDrop(e, currentIndex, section)} onDragEnter={() => setDragOverInfo({index: currentIndex, section: section})} onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOverInfo({ index: currentIndex, section: section });}} onTouchStart={(e) => handleTouchStart(e, currentIndex, section)} data-draggable-item data-index={currentIndex} data-section={section}>
                                                <ExerciseCard exercise={ex} exerciseDbId={exerciseIdMap.get(ex.exercise)} groupRounds={groupRoundsCount} onUpdate={updateExercise} onDelete={removeExercise} onDuplicate={() => handleDuplicateExercise(ex, section, currentIndex)} onShowDetails={setDetailModalExerciseId} onSwapRequest={handleSwapRequest} onAddToGroup={() => setModalState({ mode: 'add', section, index: currentIndex + 1, intoGroup: true })} onUnlink={() => unlinkExercise(ex.id, section)} isLastInGroup={exerciseIndex === groupExercises.length - 1} allowLinking={true} isInGroup={true} isSelected={selectedIds.includes(ex.id)} onSelect={handleSelection} isDragging={draggingId === ex.id} isExpanded={ex.id === expandedExerciseId} onToggleExpand={handleToggleExpand} />
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
                                    <ExerciseCard exercise={exercise} exerciseDbId={exerciseIdMap.get(exercise.exercise)} onUpdate={updateExercise} onDelete={removeExercise} onDuplicate={() => handleDuplicateExercise(exercise, section, originalIndex)} onShowDetails={setDetailModalExerciseId} onSwapRequest={handleSwapRequest} onAddToGroup={() => setModalState({ mode: 'add', section, index: originalIndex + 1, intoGroup: true })} onUnlink={() => unlinkExercise(exercise.id, section)} isLastInGroup={true} allowLinking={section === 'rounds'} isInGroup={!!(exercise.sets && exercise.sets > 1)} isSelected={selectedIds.includes(exercise.id)} onSelect={handleSelection} isDragging={draggingId === exercise.id} isExpanded={exercise.id === expandedExerciseId} onToggleExpand={handleToggleExpand} />
                                </div>
                            </div>
                        );
                    }
                })}
                {dragOverInfo?.section === section && dragOverInfo?.index === exercises.length && exercises.length > 0 && <div className="h-1.5 my-1 rounded-full bg-orange-500 animate-pulse" />}
                <div className="w-full mt-3">
                    <button 
                        onClick={() => setAddChoiceSection(section)}
                        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-600 hover:border-orange-400 hover:bg-gray-700/50 text-gray-300 font-bold py-3 px-4 rounded-lg transition-colors text-sm">
                        <PlusIcon className="w-5 h-5" />
                        Add Exercise
                    </button>
                </div>
            </div>
        </details>
      );
  };

  return (
    <>
      <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg animate-fade-in space-y-4" onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-700 pb-4">
          <div className="flex-1">
              <h2 className="text-2xl font-bold text-orange-400">Customize Your Workout</h2>
              <p className="text-sm text-gray-400">Total time: ~{totalTime} minutes</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
              <button onClick={undo} disabled={!canUndo} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"><UndoIcon className="w-5 h-5"/></button>
              <button onClick={redo} disabled={!canRedo} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"><RedoIcon className="w-5 h-5"/></button>
              <button onClick={handleRegenerate} title="Regenerate Workout" className="px-3 py-2 text-sm font-semibold bg-gray-600 hover:bg-gray-500 rounded-md flex items-center gap-2"><ArrowPathIcon className="w-4 h-4"/> Regenerate</button>
              <button onClick={() => { setExpandedExerciseId(null); setShowLoadTemplate(true); }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md"><FolderOpenIcon className="w-5 h-5"/></button>
              <button onClick={() => { setExpandedExerciseId(null); setIsPreferencesOpen(true); }} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md"><CogIcon className="w-5 h-5"/></button>
          </div>
        </div>
        
        {selectedIds.length > 0 && <BulkActionToolbar editor={editor} selectedIds={selectedIds} clearSelection={() => setSelectedIds([])}/>}
        
        {plan.warmUp?.length > 0 ? renderGroupableSection('Warm-up', <FlameIcon className="w-6 h-6 text-orange-400"/>, 'warmUp', plan.warmUp) : (<div className="bg-gray-800/30 rounded-xl p-4 flex items-center justify-between"><div className="flex items-center gap-3"><FlameIcon className="w-6 h-6 text-gray-500"/><h3 className="text-xl font-bold text-gray-500">Warm-Up</h3></div><button onClick={() => addSection('warmUp')} className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"><PlusIcon className="w-4 h-4" /> Add Warm-up</button></div>)}

        {renderGroupableSection('Main Workout', <ZapIcon className="w-6 h-6 text-yellow-400"/>, 'rounds', plan.rounds)}

        {plan.coolDown?.length > 0 ? renderGroupableSection('Cool-down', <SparklesIcon className="w-6 h-6 text-blue-400"/>, 'coolDown', plan.coolDown) : (<div className="bg-gray-800/30 rounded-xl p-4 flex items-center justify-between"><div className="flex items-center gap-3"><SparklesIcon className="w-6 h-6 text-gray-500"/><h3 className="text-xl font-bold text-gray-500">Cool-Down</h3></div><button onClick={() => addSection('coolDown')} className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"><PlusIcon className="w-4 h-4" /> Add Cool-down</button></div>)}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-[60px] left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-700 z-30">
          <div className="container mx-auto flex gap-4">
              <button onClick={() => { setExpandedExerciseId(null); setIsSaveModalOpen(true); }} disabled={isSaving} className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">{isSaving ? 'Saving...' : <><SaveIcon className="w-5 h-5"/> Save as Routine</>}</button>
              <button onClick={startWorkout} className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg shadow-green-500/20"><ZapIcon className="w-5 h-5"/>Start Live Session</button>
          </div>
      </div>
      
      {/* MODALS */}
      {modalState && <ExerciseModal isOpen={!!modalState} onClose={() => setModalState(null)} onSelectExercise={handleExerciseSelect} mode={modalState.mode} exerciseToEdit={modalState.exerciseToEdit} purposeFilter={purpose} originalPreferences={originalPreferences} defaultRest={preferences.universalRestDuration} />}
      {confirmDelete && <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { removeExercise(confirmDelete.id); setConfirmDelete(null);}} title="Delete Exercise?" message={`Are you sure you want to remove "${confirmDelete.exercise}"?`} />}
      <WorkoutPreferencesModal isOpen={isPreferencesOpen} onClose={() => setIsPreferencesOpen(false)} editor={editor} />
      {showLoadTemplate && <LoadTemplateModal isOpen={showLoadTemplate} onClose={() => setShowLoadTemplate(false)} editor={editor} />}
      <SaveRoutineModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} onSave={handleSave} defaultName={plan.name || `Custom Workout - ${new Date().toLocaleDateString()}`} />
      
      <ExerciseDetailModal isOpen={!!detailModalExerciseId} exerciseId={detailModalExerciseId} onClose={() => setDetailModalExerciseId(null)} />
      <AddExerciseChoiceModal isOpen={!!addChoiceSection} onClose={() => setAddChoiceSection(null)} onSelect={handleAddChoice} plan={plan} section={addChoiceSection} />

      <style>{` details > summary::-webkit-details-marker { display: none; } details[open] .details-arrow { transform: rotate(180deg); } .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.75rem; font-weight: 500; color: #9CA3AF; } .form-group input { width: 100%; background-color: #111827; color: white; border: 1px solid #4B5563; border-radius: 0.5rem; padding: 0.5rem; text-align: center; outline: none; } .form-group input:focus { border-color: #F97316; box-shadow: 0 0 0 2px #F9731640; } input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } input[type=number] { -moz-appearance: textfield; } `}</style>
    </>
  );
};

export default EditableWorkoutPlan;