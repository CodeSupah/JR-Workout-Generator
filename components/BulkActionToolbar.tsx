import React, { useState } from 'react';
import { useWorkoutEditor } from '../hooks/useWorkoutEditor';
import { TrashIcon, DuplicateIcon, EditIcon, XCircleIcon } from './icons/Icons';

type BulkActionToolbarProps = {
  editor: ReturnType<typeof useWorkoutEditor>;
  selectedIds: string[];
  clearSelection: () => void;
};

const BulkActionToolbar: React.FC<BulkActionToolbarProps> = ({ editor, selectedIds, clearSelection }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [bulkDuration, setBulkDuration] = useState(45);
  const [bulkRest, setBulkRest] = useState(15);
  
  const handleDelete = () => {
    if(window.confirm(`Are you sure you want to delete ${selectedIds.length} exercise(s)?`)){
      editor.deleteExercises(selectedIds);
      clearSelection();
    }
  }

  const handleDuplicate = () => {
    editor.duplicateExercises(selectedIds);
    clearSelection();
  }

  const handleApplyEdit = () => {
    editor.updateExercises(selectedIds, { duration: bulkDuration, rest: bulkRest });
    setShowEdit(false);
  }

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-3 rounded-lg flex flex-wrap items-center justify-between gap-4 animate-fade-in-down sticky top-2 z-10">
      <div className="flex items-center gap-4">
        <p className="font-semibold text-orange-400">{selectedIds.length} selected</p>
        <div className="flex items-center gap-2">
          <button onClick={handleDelete} title="Delete Selected" className="p-2 hover:bg-red-500/20 text-red-400 rounded-md"><TrashIcon className="w-5 h-5" /></button>
          <button onClick={handleDuplicate} title="Duplicate Selected" className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-md"><DuplicateIcon className="w-5 h-5" /></button>
          <button onClick={() => setShowEdit(!showEdit)} title="Edit Selected" className={`p-2 rounded-md ${showEdit ? 'bg-green-500/20 text-green-300' : 'hover:bg-green-500/20 text-green-400'}`}><EditIcon className="w-5 h-5" /></button>
        </div>
      </div>

      {showEdit && (
        <div className="flex items-center gap-2 animate-fade-in">
          <input type="number" value={bulkDuration} onChange={e => setBulkDuration(parseInt(e.target.value))} className="w-20 bg-gray-700 text-center rounded-md p-1" aria-label="Bulk work duration"/>s
          <span className="text-gray-400">/</span>
          <input type="number" value={bulkRest} onChange={e => setBulkRest(parseInt(e.target.value))} className="w-20 bg-gray-700 text-center rounded-md p-1" aria-label="Bulk rest duration"/>s
          <button onClick={handleApplyEdit} className="px-3 py-1 bg-green-500 text-white rounded-md text-sm">Apply</button>
        </div>
      )}
      
      <button onClick={clearSelection} title="Clear Selection" className="p-1 hover:bg-gray-600 rounded-full"><XCircleIcon className="w-6 h-6"/></button>
    </div>
  );
};

export default BulkActionToolbar;