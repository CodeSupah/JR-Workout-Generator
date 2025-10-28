import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkoutEditor } from '../hooks/useWorkoutEditor';
import { Exercise, WorkoutPlan } from '../types';
import { PlusIcon, ArrowPathIcon, TrashIcon, DragHandleIcon, UndoIcon, RedoIcon, SaveIcon, ZapIcon, FolderOpenIcon, CogIcon } from './icons/Icons';
import ExerciseModal from './ExerciseModal';
import ConfirmModal from './ConfirmModal';
import BulkActionToolbar from './BulkActionToolbar';
import RestSettingsPanel from './RestSettingsPanel';
import LoadTemplateModal from './LoadTemplateModal';
import SaveRoutineModal from './SaveRoutineModal';
import { toastStore } from '../store/toastStore';
import { saveCustomWorkout } from '../services/workoutService';

type EditableWorkoutPlanProps = {
  editor: ReturnType<typeof useWorkoutEditor>;
};

const EditableWorkoutPlan: React.FC<EditableWorkoutPlanProps> = ({ editor }) => {
  const navigate = useNavigate();
  const { plan, reorderExercises, undo, redo, canUndo, canRedo, updateExercise } = editor;

  const [modalState, setModalState] = useState<{ mode: 'add' | 'replace'; exerciseToEdit?: Exercise, index?: number } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Exercise | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showRestSettings, setShowRestSettings] = useState(false);
  const [showLoadTemplate, setShowLoadTemplate] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  
  const totalTime = useMemo(() => {
    if (!plan) return 0;
    const warmUpTime = plan.warmUpDuration * 60;
    const roundsTime = plan.rounds.reduce((acc, round) => acc + round.duration + round.rest, 0);
    const coolDownTime = plan.coolDownDuration * 60;
    return Math.floor((warmUpTime + roundsTime + coolDownTime) / 60);
  }, [plan]);

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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };
  
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      reorderExercises(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

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
      editor.addExercise(exerciseData, modalState.index);
    } else if (modalState.mode === 'replace' && modalState.exerciseToEdit) {
      editor.updateExercise(modalState.exerciseToEdit.id, { ...modalState.exerciseToEdit, ...exerciseData });
    }
  };

  const startWorkout = () => {
    navigate('/session', { state: { workout: plan } });
  };
  
  const difficultyColors: Record<Exercise['difficulty'], string> = {
    Easy: 'bg-green-500',
    Medium: 'bg-yellow-500',
    Hard: 'bg-red-500',
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg animate-fade-in space-y-4 pb-28">
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

      {/* Warm-up Section */}
      {plan.warmUp && plan.warmUp.length > 0 && (
        <div className="bg-gray-700/50 p-4 rounded-lg my-4">
            <h3 className="font-bold text-lg text-orange-300 mb-2">Warm-up ({plan.warmUpDuration} min)</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
                {plan.warmUp.map((ex, i) => <li key={`warmup-${i}`}>{ex}</li>)}
            </ul>
        </div>
      )}

      {/* Exercise List */}
      <div className="space-y-2">
        {plan.rounds.map((round, index) => {
            const isRoundBased = (plan.numberOfRounds || 1) > 1 && (plan.exercisesPerRound || 0) > 0;
            const roundNumber = isRoundBased ? Math.floor(index / plan.exercisesPerRound) + 1 : 1;
            const isFirstOfRound = isRoundBased ? index % plan.exercisesPerRound === 0 : false;
            
            return (
                <React.Fragment key={round.id}>
                    {isFirstOfRound && (
                         <div className="text-center font-bold text-orange-400 py-2 my-2 border-t border-b border-gray-700/80 bg-gray-900/30">
                            Round {roundNumber} / {plan.numberOfRounds}
                        </div>
                    )}
                     <div
                        className={`p-2 rounded-lg flex items-center gap-2 shadow-sm transition-all duration-200 ${selectedIds.includes(round.id) ? 'bg-orange-500/20 ring-2 ring-orange-400' : 'bg-gray-700/80'}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <div className="cursor-move text-gray-400 p-2"><DragHandleIcon className="w-5 h-5" /></div>
                        <input type="checkbox" checked={selectedIds.includes(round.id)} onChange={() => handleSelection(round.id)} className="w-5 h-5 rounded bg-gray-600 border-gray-500 text-orange-500 focus:ring-orange-500/50" />
                        
                        <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ml-2">
                        <div className="flex items-center gap-3">
                            <span className={`w-3 h-3 rounded-full ${difficultyColors[round.difficulty]}`}></span>
                            <span className="font-semibold text-white text-sm sm:text-base">{round.exercise}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div>
                            <label htmlFor={`duration-${round.id}`} className="text-xs text-gray-400">Duration</label>
                            <div className="flex items-center gap-1">
                                <input id={`duration-${round.id}`} type="number" min="0" value={round.duration} onChange={e => updateExercise(round.id, {duration: Math.max(0, parseInt(e.target.value) || 0)})} className="w-16 bg-gray-900/50 text-center rounded-md p-1" aria-label="Work duration"/>
                                <span className="text-xs text-gray-400">s</span>
                            </div>
                            </div>
                            <div>
                            <label htmlFor={`rest-${round.id}`} className="text-xs text-gray-400">Rest</label>
                            <div className="flex items-center gap-1">
                                <input id={`rest-${round.id}`} type="number" min="0" value={round.rest} onChange={e => updateExercise(round.id, {rest: Math.max(0, parseInt(e.target.value) || 0)})} className="w-16 bg-gray-900/50 text-center rounded-md p-1" aria-label="Rest duration"/>
                                <span className="text-xs text-gray-400">s</span>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => setModalState({mode: 'replace', exerciseToEdit: round})} className="p-2 hover:bg-gray-600 rounded-md" title="Replace Exercise"><ArrowPathIcon className="w-5 h-5"/></button>
                            <button onClick={() => setConfirmDelete(round)} className="p-2 hover:bg-gray-600 rounded-md text-red-400" title="Delete Exercise"><TrashIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                </React.Fragment>
            )
        })}
      </div>
      
      <button 
        onClick={() => setModalState({mode: 'add', index: plan.rounds.length})}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-600 hover:border-orange-400 hover:bg-gray-700/50 text-gray-300 font-bold py-3 px-6 rounded-lg transition-colors">
            <PlusIcon className="w-5 h-5" />
            Add Exercise
      </button>

        {/* Cool-down Section */}
        {plan.coolDown && plan.coolDown.length > 0 && (
            <div className="bg-gray-700/50 p-4 rounded-lg my-4">
                <h3 className="font-bold text-lg text-indigo-400 mb-2">Cool-down ({plan.coolDownDuration} min)</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {plan.coolDown.map((ex, i) => <li key={`cooldown-${i}`}>{ex}</li>)}
                </ul>
            </div>
        )}
      
      {/* Modals and Panels */}
      {modalState && <ExerciseModal 
          isOpen={!!modalState} 
          onClose={() => setModalState(null)} 
          onSelectExercise={handleExerciseSelect}
          mode={modalState.mode}
          exerciseToEdit={modalState.exerciseToEdit}
      />}
      {confirmDelete && <ConfirmModal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} onConfirm={() => { editor.removeExercise(confirmDelete.id); setConfirmDelete(null);}} title="Delete Exercise?" message={`Are you sure you want to remove "${confirmDelete.exercise}"?`} />}
      {showRestSettings && <RestSettingsPanel isOpen={showRestSettings} onClose={() => setShowRestSettings(false)} editor={editor} />}
      {showLoadTemplate && <LoadTemplateModal isOpen={showLoadTemplate} onClose={() => setShowLoadTemplate(false)} editor={editor} />}
      <SaveRoutineModal 
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSave}
        defaultName={plan.name || `Custom Workout - ${new Date().toLocaleDateString()}`}
      />

    {/* Floating Action Bar */}
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-700">
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
    </div>
  );
};

export default EditableWorkoutPlan;