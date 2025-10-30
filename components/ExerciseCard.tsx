import React, { useState } from 'react';
import { Exercise } from '../types';
import { TrashIcon, DuplicateIcon, DragHandleIcon, LinkIcon, LinkOffIcon, EditIcon, ArrowPathIcon } from './icons/Icons';
import StepperInput from './StepperInput';

const ExerciseCard: React.FC<{
  exercise: Exercise;
  onUpdate: (id: string, updates: Partial<Exercise>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (exercise: Exercise) => void;
  onSwapRequest: (exercise: Exercise) => void;
  isLast: boolean;
  universalRest: number;
  isSimple?: boolean;
  allowLinking?: boolean;
  isInGroup?: boolean;
  isFirstInGroup?: boolean;
  isLastInGroup?: boolean;
  groupRounds?: number;
  onUpdateGroupRounds?: (newValue: number) => void;
  groupRest?: number;
  onUpdateGroupRest?: (newValue: number) => void;
}> = ({
  exercise,
  onUpdate,
  onDelete,
  onDuplicate,
  onSwapRequest,
  isLast,
  universalRest,
  isSimple = false,
  allowLinking = true,
  isInGroup = false,
  isFirstInGroup = false,
  isLastInGroup = false,
  groupRounds,
  onUpdateGroupRounds,
  groupRest,
  onUpdateGroupRest
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleUnitToggle = () => onUpdate(exercise.id, { unit: exercise.unit === 'reps' ? 'seconds' : 'reps' });
  const handleLinkToggle = () => onUpdate(exercise.id, { linkedToNext: !exercise.linkedToNext });
  
  const isRestOverridden = exercise.rest !== universalRest;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card from toggling when a button inside it is clicked
    if ((e.target as HTMLElement).closest('button')) return;
    setIsExpanded(!isExpanded);
  };

  if (isSimple) {
     return (
        <div className="bg-gray-800/50 p-3 rounded-xl flex items-center gap-2">
             <div className="cursor-grab text-gray-500 p-2 touch-none">
                <DragHandleIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <p className="font-semibold text-white">{exercise.exercise}</p>
            </div>
            <div className="flex items-center gap-2">
                 <div className="form-group w-32">
                    <label>Time (s)</label>
                    <StepperInput
                        value={exercise.duration || 60}
                        onChange={val => onUpdate(exercise.id, { duration: val })}
                        step={5}
                        min={0}
                        aria-label="Time in seconds"
                    />
                </div>
                <button onClick={() => onSwapRequest(exercise)} className="p-2 text-gray-400 hover:text-white" title="Swap Exercise"><ArrowPathIcon className="w-5 h-5"/></button>
                <button onClick={() => onDelete(exercise.id)} className="p-2 text-gray-400 hover:text-red-400" title="Delete Exercise"><TrashIcon className="w-5 h-5"/></button>
            </div>
        </div>
     );
  }

  return (
    <div className={`relative transition-all duration-300 ${isExpanded ? 'bg-gray-700' : 'bg-gray-800/50 hover:bg-gray-700/70'} ${isFirstInGroup ? 'rounded-t-xl' : ''} ${isLastInGroup ? 'rounded-b-xl' : ''} ${!isInGroup ? 'rounded-xl' : ''}`}>
      {exercise.linkedToNext && (
        <div className="absolute left-[22px] -bottom-3 w-0.5 h-3 bg-orange-400 z-10" aria-hidden></div>
      )}

      {isFirstInGroup && (
        <div className="p-3 border-b border-gray-900/50 flex flex-col sm:flex-row gap-4 items-center bg-gray-900/30 rounded-t-xl">
          <div className="form-group flex-1 w-full sm:w-auto">
            <label className="text-sm font-bold text-orange-400">ROUNDS</label>
            <StepperInput
              value={groupRounds || 1}
              onChange={onUpdateGroupRounds!}
              min={1}
              aria-label="Number of rounds for this superset"
            />
          </div>
          <div className="form-group flex-1 w-full sm:w-auto">
             <label className="text-sm font-bold text-gray-300">REST AFTER ROUND</label>
             <StepperInput
                value={groupRest ?? 60}
                onChange={onUpdateGroupRest!}
                step={15}
                min={0}
                aria-label="Rest after round in seconds"
            />
          </div>
        </div>
      )}

      <div className="p-3 flex items-center gap-2 cursor-pointer" onClick={handleCardClick}>
        <div className="cursor-grab text-gray-500 p-2 touch-none">
          <DragHandleIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-white">{exercise.exercise}</p>
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
            {exercise.rest}s Rest {isRestOverridden && <span className="text-orange-400 font-bold">*</span>}
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
                <label className="flex items-center gap-1">
                    Rest (s)
                    {isRestOverridden && <span className="text-orange-400 font-bold" title="Individually set rest">*</span>}
                </label>
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
           {allowLinking && !isLast && (
              <button onClick={handleLinkToggle} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${exercise.linkedToNext ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-600'}`}>
                  {exercise.linkedToNext ? <LinkOffIcon className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                  {exercise.linkedToNext ? 'Unlink Exercise' : 'Group with Next'}
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
    </div>
  );
};

export default ExerciseCard;
