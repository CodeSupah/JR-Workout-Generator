import React, { useState } from 'react';
import { useWorkoutEditor } from '../hooks/useWorkoutEditor';

type RestSettingsPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  editor: ReturnType<typeof useWorkoutEditor>;
};

const RestSettingsPanel: React.FC<RestSettingsPanelProps> = ({ isOpen, onClose, editor }) => {
  const [globalRest, setGlobalRest] = useState(20);
  
  if (!isOpen) return null;

  const handleApply = () => {
    editor.setGlobalRest(globalRest);
    onClose();
  };

  const handleNoRest = () => {
    editor.setGlobalRest(0);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Rest Interval Settings</h2>
            <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-300">Global Rest Duration (seconds)</label>
                    <p className="text-xs text-gray-400 mb-2">Apply this rest time to all exercises.</p>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="0"
                            max="60"
                            step="5"
                            value={globalRest}
                            onChange={(e) => setGlobalRest(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <span className="font-bold text-orange-400 w-8 text-center">{globalRest}s</span>
                    </div>
                </div>
                <button onClick={handleApply} className="w-full py-2 px-4 rounded-md text-white bg-orange-500 hover:bg-orange-600">Apply Global Rest</button>
                <button onClick={handleNoRest} className="w-full py-2 px-4 rounded-md text-white bg-red-600 hover:bg-red-700">Set No Rest</button>
            </div>
          </div>
          <div className="bg-gray-700/50 px-6 py-3 flex justify-end">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-white hover:bg-gray-600">Close</button>
          </div>
      </div>
    </div>
  );
};

export default RestSettingsPanel;