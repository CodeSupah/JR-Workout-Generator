import React, { useState, useEffect } from 'react';

type SaveRoutineModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  defaultName?: string;
};

const SaveRoutineModal: React.FC<SaveRoutineModalProps> = ({ isOpen, onClose, onSave, defaultName = '' }) => {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
      if (isOpen) {
          setName(defaultName);
      }
  }, [isOpen, defaultName]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Save Routine</h2>
          <label htmlFor="routine-name" className="block text-sm font-medium text-gray-300 mb-2">Routine Name</label>
          <input
            id="routine-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-900/50 text-white rounded-md p-2 border border-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., Morning Cardio Blast"
          />
        </div>
        <div className="bg-gray-700/50 px-6 py-3 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-white hover:bg-gray-600">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="py-2 px-4 rounded-md text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveRoutineModal;
