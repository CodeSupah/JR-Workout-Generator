import React from 'react';
import { WorkoutPlan } from '../types';
import { ClockIcon, TrashIcon, ZapIcon } from './icons/Icons';

type SavedRoutineCardProps = {
  routine: Partial<WorkoutPlan>;
  onStart: () => void;
  onDelete: () => void;
  isPlaceholder?: boolean;
};

const SavedRoutineCard: React.FC<SavedRoutineCardProps> = ({ routine, onStart, onDelete, isPlaceholder = false }) => {
  const totalTime = Math.floor(
    (routine.rounds || []).reduce((acc, round) => acc + (round.duration || 0) + (round.rest || 0), 0) / 60
  );

  return (
    <div className={`bg-gray-800 p-5 rounded-xl shadow-lg flex flex-col justify-between animate-fade-in ${isPlaceholder ? 'opacity-60 border-2 border-dashed border-gray-600 pointer-events-none' : ''}`}>
      <div>
        <h3 className="text-lg font-bold text-white truncate">{routine.name}</h3>
        <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
          <ClockIcon className="w-4 h-4" />
          {(routine.rounds || []).length} exercises / ~{totalTime} min
        </p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={onStart}
          disabled={isPlaceholder}
          className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <ZapIcon className="w-4 h-4" />
          Start
        </button>
        {!isPlaceholder && (
            <button
            onClick={onDelete}
            className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors"
            title="Delete Routine"
            >
            <TrashIcon className="w-5 h-5" />
            </button>
        )}
      </div>
    </div>
  );
};

export default SavedRoutineCard;