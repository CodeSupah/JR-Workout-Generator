import React from 'react';
import { Exercise } from '../types';
import { TrashIcon, DuplicateIcon, DragHandleIcon, LinkIcon, LinkOffIcon, EditIcon, ArrowPathIcon, PlusIcon, InformationCircleIcon } from './icons/Icons';
import StepperInput from './StepperInput';

const ExerciseCard: React.FC<{
  exercise: Exercise;
  exerciseDbId?: string;
  groupRounds?: number;
  onUpdate: (id: string, updates: Partial<Exercise>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (exercise: Exercise) => void;
  onShowDetails: (exerciseId: string) => void; // New prop for info modal
  onSwapRequest: (exercise: Exercise) => void;
  onAddToGroup: () => void;
  onUnlink: () => void;
  isLastInGroup: boolean;
  allowLinking?: boolean;
  isInGroup?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  isDragging?: boolean;
}> = ({
  exercise,
  exerciseDbId,
  groupRounds,
  onUpdate,
  onDelete,
  onDuplicate,
  onShowDetails,
  onSwapRequest,
  onAddToGroup,
  onUnlink,
  isLastInGroup,
  allowLinking = true,
  isInGroup = false,
  isSelected = false,
  onSelect,
  isExpanded,
  onToggleExpand,
  isDragging = false,
}) => {
  
  const handleUnitToggle = () => onUpdate(exercise.id, { unit: exercise.unit === 'reps' ? 'seconds' : 'reps' });
  const handleLinkToggle = () => onUpdate(exercise.id, { linkedToNext: !exercise.linkedToNext });

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input[type="checkbox"], [data-drag-handle], a')) return;
    onToggleExpand(exercise.id);
  };

  const ghostStyles = 'opacity-50 bg-gray-900 border-2 border-dashed border-orange-500 scale-95';

  // POLISH: New details renderer for better scannability
  const Details = () => {
    const sets = groupRounds && groupRounds > 1 ? groupRounds : (exercise.sets || 1);
    const setsText = sets > 1 ? `${sets} ${sets === 1 ? 'Set' : 'Sets'} | ` : '';
    const workText = exercise.unit === 'reps' ? `${exercise.reps || 10} Reps` : `${exercise.duration}s`;
    const restText = `${exercise.rest}s Rest`;

    return (
        <p className="text-xs text-gray-500">
            {setsText}
            <strong className="font-semibold text-gray-300">{workText}</strong>
            <span className="mx-1">|</span>
            {restText}
        </p>
    );
  };


  return (
    <div data-exercise-card="true" data-exercise-id={exercise.id} className={`relative group transition-all duration-300 ${isExpanded ? 'bg-gray-700' : 'bg-gray-800/50 hover:bg-gray-700/70'} ${isDragging ? ghostStyles : ''}`}>
      {!isLastInGroup && exercise.linkedToNext && (
        <div className="absolute left-[34px] -bottom-3 w-0.5 h-3 bg-orange-400 z-10" aria-hidden></div>
      )}

      <div className={`p-3 flex items-center gap-2 cursor-pointer ${isSelected ? 'bg-orange-500/10' : ''}`} onClick={handleCardClick}>
        {onSelect && (
            <input 
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(exercise.id)}
                className="w-4 h-4 rounded bg-gray-600 border-gray-500 text-orange-600 focus:ring-orange-500/50 shrink-0"
                aria-label={`Select ${exercise.exercise}`}
            />
        )}
        <div className="cursor-grab text-gray-500 p-2 touch-none" data-drag-handle>
          <DragHandleIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            {/* POLISH: Bolding exercise name */}
            <p className="font-bold text-white">{exercise.exercise}</p>
            {/* POLISH: Info button now triggers a modal via callback */}
            {exerciseDbId && (
              <button onClick={(e) => { e.stopPropagation(); onShowDetails(exerciseDbId); }} className="text-gray-400 hover:text-orange-400 transition-colors p-1">
                <InformationCircleIcon className="w-5 h-5" />
              </button>
            )}
            {exercise.linkedToNext && allowLinking && (
              <button onClick={(e) => { e.stopPropagation(); onUnlink();}} title="Unlink from next exercise" className="p-1 text-orange-400/70 hover:text-orange-400 hover:bg-orange-500/10 rounded-full">
                <LinkOffIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <Details />
        </div>
        {!isExpanded && (
           <div className="flex items-center">
            {/* POLISH: Added consistent delete button to collapsed view */}
            <button onClick={(e) => { e.stopPropagation(); onDelete(exercise.id); }} className="p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Delete ${exercise.exercise}`}>
                <TrashIcon className="w-5 h-5"/>
            </button>
            <button onClick={(e) => { e.stopPropagation(); onToggleExpand(exercise.id); }} className="p-2 text-gray-400 hover:text-white" aria-label={`Edit ${exercise.exercise}`}>
              <EditIcon className="w-5 h-5"/>
            </button>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 animate-fade-in-fast">
          <div className="w-full h-px bg-gray-900/50 my-1"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {!isInGroup && (
                <div className="form-group">
                    <label>Sets</label>
                    <StepperInput value={exercise.sets || 1} onChange={val => onUpdate(exercise.id, { sets: val })} min={1} aria-label="Sets" />
                </div>
            )}
            <div className="form-group">
                <label>Unit</label>
                <button onClick={handleUnitToggle} className="w-full h-10 bg-gray-900 rounded-md text-center font-semibold capitalize flex items-center justify-center">
                    {exercise.unit === 'reps' ? 'Reps' : 'Time'}
                </button>
            </div>
             <div className="form-group">
                {exercise.unit === 'reps' ? (
                    <><label>Reps</label><StepperInput value={exercise.reps || 10} onChange={val => onUpdate(exercise.id, { reps: val })} min={1} aria-label="Repetitions" /></>
                ) : (
                    <><label>Time (s)</label><StepperInput value={exercise.duration || 45} onChange={val => onUpdate(exercise.id, { duration: val })} step={5} min={0} aria-label="Time in seconds"/></>
                )}
            </div>
             <div className="form-group">
                <label className="flex items-center gap-1">Rest (s)</label>
                <StepperInput value={exercise.rest} onChange={val => onUpdate(exercise.id, { rest: val })} step={5} min={0} aria-label="Rest in seconds" />
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <button onClick={() => onSwapRequest(exercise)} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-600"><ArrowPathIcon className="w-4 h-4"/> Swap Exercise</button>
           {allowLinking && !isLastInGroup && (<button onClick={handleLinkToggle} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${exercise.linkedToNext ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-600'}`}>{exercise.linkedToNext ? <LinkOffIcon className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}{exercise.linkedToNext ? 'Ungroup' : 'Group with Next'}</button>)}
            <button onClick={() => onDuplicate(exercise)} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-600"><DuplicateIcon className="w-4 h-4"/> Duplicate</button>
            <button onClick={() => onDelete(exercise.id)} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/40"><TrashIcon className="w-4 h-4"/> Delete</button>
          </div>
        </div>
      )}
       {isInGroup && !isLastInGroup && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onAddToGroup(); }} className="w-7 h-7 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-110" aria-label="Add exercise after this one" title="Add exercise after this one">
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;