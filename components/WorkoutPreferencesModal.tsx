import React, { useState } from 'react';
import { useWorkoutEditor } from '../hooks/useWorkoutEditor';
import StepperInput from './StepperInput';
import ToggleSwitch from './ToggleSwitch';
import { toastStore } from '../store/toastStore';

type WorkoutPreferencesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  editor: ReturnType<typeof useWorkoutEditor>;
};

const WorkoutPreferencesModal: React.FC<WorkoutPreferencesModalProps> = ({ isOpen, onClose, editor }) => {
  const { preferences, updatePreferences, setGlobalRest } = editor;
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [bulkRest, setBulkRest] = useState(30);

  if (!isOpen) return null;

  const handlePrefChange = (key: keyof typeof localPrefs, value: any) => {
    setLocalPrefs(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updatePreferences(localPrefs);
    onClose();
  };

  const handleApplyBulkRest = () => {
    setGlobalRest(bulkRest);
    toastStore.addToast(`All existing exercises updated to ${bulkRest}s rest.`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4 z-50 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-t-2xl md:rounded-2xl shadow-xl w-full max-w-lg flex flex-col h-auto max-h-[90dvh]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700 flex-shrink-0">
            <h2 className="text-xl font-bold">Workout Settings</h2>
            <p className="text-sm text-gray-400">Manage defaults and bulk actions for this workout.</p>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
            {/* Defaults for New Items */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-orange-400">Defaults for New Items</h3>
                <div className="form-group">
                    <label>Universal Rest Timer</label>
                    <p className="text-xs text-gray-400 mb-2">Default rest duration (in seconds) for all newly added exercises.</p>
                    <StepperInput value={localPrefs.universalRestDuration} onChange={v => handlePrefChange('universalRestDuration', v)} min={0} step={5} />
                </div>
                 <div className="form-group">
                    <label>Default Set/Round Count</label>
                    <p className="text-xs text-gray-400 mb-2">Default number of sets for a single exercise or rounds for a new superset.</p>
                    <StepperInput value={localPrefs.defaultSetCount} onChange={v => handlePrefChange('defaultSetCount', v)} min={1} />
                </div>
                 <div className="form-group">
                    <label>Default Rest After Group</label>
                    <p className="text-xs text-gray-400 mb-2">Default rest time (in seconds) after a completed superset or circuit.</p>
                    <StepperInput value={localPrefs.defaultRestAfterGroup} onChange={v => handlePrefChange('defaultRestAfterGroup', v)} min={0} step={15} />
                </div>
            </div>

            {/* Bulk Actions */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-orange-400">Bulk Actions</h3>
                <div className="form-group">
                    <label>Apply Rest to All Existing Exercises</label>
                    <p className="text-xs text-gray-400 mb-2">Override the rest period for every exercise currently in your plan.</p>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <StepperInput value={bulkRest} onChange={setBulkRest} min={0} step={5} />
                        </div>
                        <button onClick={handleApplyBulkRest} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 text-sm font-semibold">Apply</button>
                    </div>
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
            Save Preferences
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
