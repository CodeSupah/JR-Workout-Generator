import React, { useState } from 'react';
import { Exercise } from '../types';
import { TrashIcon, DuplicateIcon, DragHandleIcon, LinkIcon, LinkOffIcon, EditIcon, ArrowPathIcon, PlusIcon } from './icons/Icons';
import StepperInput from './StepperInput';

const ExerciseCard: React.FC<{
  exercise: Exercise;
  onUpdate: (id: string, updates: Partial<Exercise>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (exercise: Exercise) => void;
  onSwapRequest: (exercise: Exercise) => void;
  onAddToGroup: () => void;
  onUnlink: () => void;
  isLastInGroup: boolean;
  allowLinking?: boolean;
  isInGroup?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  isDragging?: boolean;
}> = ({
  exercise,
  onUpdate,
  onDelete,
  onDuplicate,
  onSwapRequest,
  onAddToGroup,
  onUnlink,
  isLastInGroup,
  allowLinking = true,
  isInGroup = false,
  isSelected = false,
  onSelect,
  isDragging = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleUnitToggle = () => onUpdate(exercise.id, { unit: exercise.unit === 'reps' ? 'seconds' : 'reps' });
  const handleLinkToggle = () => onUpdate(exercise.id, { linkedToNext: !exercise.linkedToNext });

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card from toggling when a button inside it is clicked
    if ((e.target as HTMLElement).closest('button, input[type="checkbox"], [data-drag-handle]')) return;
    setIsExpanded(!isExpanded);
  };

  const ghostStyles = 'opacity-50 bg-gray-900 border-2 border-dashed border-orange-500 scale-95';

  return (
    <div className={`relative group transition-all duration-300 ${isExpanded ? 'bg-gray-700' : 'bg-gray-800/50 hover:bg-gray-700/70'} ${isDragging ? ghostStyles : ''}`}>
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
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white">{exercise.exercise}</p>
            {exercise.linkedToNext && allowLinking && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUnlink();
                }}
                title="Unlink from next exercise"
                className="p-1 text-orange-400/70 hover:text-orange-400 hover:bg-orange-500/10 rounded-full"
              >
                <LinkOffIcon className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400">
             {isInGroup ? (
                <>
                    {exercise.unit === 'reps' ? `${exercise.reps || 10} reps` : `${exercise.duration}s`}
                </>
             ) : (
                <>
                    {exercise.sets || 1} x {exercise.unit === 'reps' ? `${exercise.reps || 10} reps` : `${exercise.duration}s`}
                </>
             )}
            <span className="mx-2">&bull;</span>
            {exercise.rest}s Rest
          </p>
        </div>
        {!isExpanded && (
          <button onClick={() => setIsExpanded(true)} className="p-2 text-gray-400 hover:text-white" aria-label="Edit exercise">
              <EditIcon className="w-5 h-5"/>
          </button>
        )}
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 animate-fade-in-fast">
          <div className="w-full h-px bg-gray-900/50 my-1"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {!isInGroup && (
                <div className="form-group">
                    <label>Sets</label>
                    <StepperInput
                        value={exercise.sets || 1}
                        onChange={val => onUpdate(exercise.id, { sets: val })}
                        min={1}
                        aria-label="Sets"
                    />
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
                    <>
                        <label>Reps</label>
                        <StepperInput
                            value={exercise.reps || 10}
                            onChange={val => onUpdate(exercise.id, { reps: val })}
                            min={1}
                            aria-label="Repetitions"
                        />
                    </>
                ) : (
                    <>
                        <label>Time (s)</label>
                         <StepperInput
                            value={exercise.duration || 45}
                            onChange={val => onUpdate(exercise.id, { duration: val })}
                            step={5}
                            min={0}
                            aria-label="Time in seconds"
                        />
                    </>
                )}
            </div>
             <div className="form-group">
                <label className="flex items-center gap-1">Rest (s)</label>
                <StepperInput
                    value={exercise.rest}
                    onChange={val => onUpdate(exercise.id, { rest: val })}
                    step={5}
                    min={0}
                    aria-label="Rest in seconds"
                />
            </div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <button onClick={() => onSwapRequest(exercise)} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-600">
                <ArrowPathIcon className="w-4 h-4"/> Swap Exercise
            </button>
           {allowLinking && !isLastInGroup && (
              <button onClick={handleLinkToggle} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${exercise.linkedToNext ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-600'}`}>
                  {exercise.linkedToNext ? <LinkOffIcon className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                  {exercise.linkedToNext ? 'Ungroup' : 'Group with Next'}
              </button>
            )}
            <button onClick={() => onDuplicate(exercise)} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-800 text-gray-300 hover:bg-gray-600">
                <DuplicateIcon className="w-4 h-4"/> Duplicate
            </button>
            <button onClick={() => onDelete(exercise.id)} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/40">
                <TrashIcon className="w-4 h-4"/> Delete
            </button>
          </div>
        </div>
      )}
       {isInGroup && !isLastInGroup && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToGroup(); }}
            className="w-7 h-7 flex items-center justify-center bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-110"
            aria-label="Add exercise after this one"
            title="Add exercise after this one"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
