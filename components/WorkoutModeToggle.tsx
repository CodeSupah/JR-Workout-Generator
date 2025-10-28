import React from 'react';
import { WorkoutMode } from '../types';
import { RopeIcon, DumbbellIcon, RunIcon } from './icons/Icons';

type WorkoutModeToggleProps = {
  selectedMode: WorkoutMode;
  onModeChange: (mode: WorkoutMode) => void;
};

const modes: { id: WorkoutMode; label: string; icon: React.ReactNode }[] = [
  { id: 'jump-rope', label: 'Jump Rope Only', icon: <RopeIcon className="w-5 h-5" /> },
  { id: 'equipment', label: 'Equipment', icon: <DumbbellIcon className="w-5 h-5" /> },
  { id: 'no-equipment', label: 'No Equipment', icon: <RunIcon className="w-5 h-5" /> },
];

const WorkoutModeToggle: React.FC<WorkoutModeToggleProps> = ({ selectedMode, onModeChange }) => {
  return (
    <div>
      <label className="text-lg font-semibold mb-2 block">Workout Mode</label>
      <div className="grid grid-cols-3 gap-2 bg-gray-900/50 p-1 rounded-xl">
        {modes.map(mode => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex items-center justify-center gap-2 py-3 px-2 rounded-lg text-sm font-medium transition-all ${
              selectedMode === mode.id
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
          >
            {mode.icon}
            <span className="hidden sm:inline">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WorkoutModeToggle;