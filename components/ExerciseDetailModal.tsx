import React, { useState, useEffect } from 'react';
import { ExerciseDetails } from '../types';
import { getExerciseById } from '../services/exerciseService';
import { XCircleIcon } from './icons/Icons';

type ExerciseDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  exerciseId: string | null;
};

const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ isOpen, onClose, exerciseId }) => {
  const [exercise, setExercise] = useState<ExerciseDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch data only when the modal is open and we have an ID
    if (isOpen && exerciseId) {
      setLoading(true);
      getExerciseById(exerciseId)
        .then(data => {
          setExercise(data || null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Reset when closed
      setExercise(null);
    }
  }, [isOpen, exerciseId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-orange-400">{exercise?.name || 'Loading...'}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4">
          {loading && <div className="text-center p-8">Loading exercise details...</div>}
          
          {!loading && !exercise && <div className="text-center p-8 text-red-400">Could not find exercise details.</div>}

          {exercise && (
            <>
              {exercise.videoUrl && (
                <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    width="100%"
                    height="100%"
                    src={exercise.videoUrl}
                    title={`YouTube video player for ${exercise.name}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-300 text-sm whitespace-pre-line">{exercise.description}</p>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
                  {exercise.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailModal;