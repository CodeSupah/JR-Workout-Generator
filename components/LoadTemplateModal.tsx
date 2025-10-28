import React, { useState, useEffect } from 'react';
import { WorkoutPlan } from '../types';
import { useWorkoutEditor } from '../hooks/useWorkoutEditor';
import { loadCustomWorkouts, deleteCustomWorkout } from '../services/workoutService';
import { TrashIcon, ClockIcon } from './icons/Icons';

type LoadTemplateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editor: ReturnType<typeof useWorkoutEditor>;
};

const LoadTemplateModal: React.FC<LoadTemplateModalProps> = ({ isOpen, onClose, editor }) => {
  const [templates, setTemplates] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      loadCustomWorkouts()
        .then(setTemplates)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  const handleLoad = (template: WorkoutPlan) => {
    editor.loadPlan(template);
    onClose();
  }
  
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
        await deleteCustomWorkout(id);
        setTemplates(prev => prev.filter(t => t.id !== id));
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Load a Saved Routine</h2>
            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                {loading && <p>Loading templates...</p>}
                {!loading && templates.length === 0 && <p className="text-gray-400 text-center p-4">You haven't saved any custom routines yet.</p>}
                {!loading && templates.map(template => (
                    <div key={template.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-white">{template.name}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                <ClockIcon className="w-3 h-3"/>
                                {template.rounds.length} exercises
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleDelete(template.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-md"><TrashIcon className="w-5 h-5"/></button>
                            <button onClick={() => handleLoad(template)} className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm">Load</button>
                        </div>
                    </div>
                ))}
            </div>
          </div>
          <div className="bg-gray-700/50 px-6 py-3 flex justify-end">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-white hover:bg-gray-600">Close</button>
          </div>
      </div>
    </div>
  );
};

export default LoadTemplateModal;