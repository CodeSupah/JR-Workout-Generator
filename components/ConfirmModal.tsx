import React from 'react';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-gray-300">{message}</p>
        </div>
        <div className="bg-gray-700/50 px-6 py-3 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-white hover:bg-gray-600">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2 px-4 rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
