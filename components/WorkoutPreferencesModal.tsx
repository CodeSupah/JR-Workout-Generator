import React, { useState, useEffect } from 'react';
import { useWorkoutEditor } from '../hooks/useWorkoutEditor';
import { EditorWorkoutPreferences } from '../types';
import StepperInput from './StepperInput';
import ToggleSwitch from './ToggleSwitch';

type WorkoutPreferencesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editor: ReturnType<typeof useWorkoutEditor>;
};

const WorkoutPreferencesModal: React.FC<WorkoutPreferencesModalProps> = ({ isOpen, onClose, editor }) => {
  const { preferences, updatePreferences } = editor;
  // Initialize local state from the editor's preferences when the modal opens
  const [localPrefs, setLocalPrefs] = useState<EditorWorkoutPreferences>(preferences);
  
  // Resync local state if the modal is reopened and editor prefs have changed
  useEffect(() => {
    if (isOpen) {
      setLocalPrefs(preferences);
    }
  }, [isOpen, preferences]);

  if (!isOpen) return null;

  const handlePrefChange = (key: keyof typeof localPrefs, value: any) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // This single call now handles saving defaults and applying all bulk actions to the current plan.
    updatePreferences(localPrefs);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4 z-50 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-t-2xl md:rounded-2xl shadow-xl w-full max-w-lg flex flex-col h-auto max-h-[90dvh]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700 flex-shrink-0">
            <h2 className="text-xl font-bold">Workout Settings</h2>
            <p className="text-sm text-gray-400">Manage defaults and apply changes to this workout.</p>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
            {/* Defaults for New Items */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-orange-400">Defaults &amp; Bulk Actions</h3>
                <div className="form-group">
                    <label>Default Rest Between Exercises</label>
                    <p className="text-xs text-gray-400 mb-2">Applies to new exercises AND updates all existing exercises on save.</p>
                    <StepperInput value={localPrefs.universalRestDuration} onChange={v => handlePrefChange('universalRestDuration', v)} min={0} step={5} />
                </div>
                <div className="form-group">
                    <label>Default Superset Rounds</label>
                    <p className="text-xs text-gray-400 mb-2">Applies to new groups AND updates all existing supersets/circuits on save.</p>
                    <StepperInput value={localPrefs.defaultSupersetRounds} onChange={v => handlePrefChange('defaultSupersetRounds', v)} min={1} step={1} />
                </div>
            </div>

            {/* Device Settings */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-orange-400">Device Settings</h3>
                 <ToggleSwitch 
                    label="Keep Screen Awake"
                    description="Prevents the screen from turning off during a live workout session."
                    checked={localPrefs.keepScreenAwake}
                    onChange={v => handlePrefChange('keepScreenAwake', v)}
                />
            </div>

        </div>

        <div className="bg-gray-700/50 px-6 py-4 flex justify-end gap-3 border-t border-gray-700 flex-shrink-0">
          <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-white hover:bg-gray-600 font-semibold">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="py-2 px-4 rounded-md text-white bg-orange-600 hover:bg-orange-700 font-semibold"
          >
            Apply Settings
          </button>
        </div>
      </div>
      <style>{`
        .form-group label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500; color: #D1D5DB; }
      `}</style>
    </div>
  );
};

export default WorkoutPreferencesModal;