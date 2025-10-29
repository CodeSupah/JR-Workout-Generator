import React, { useMemo } from 'react';
import { Exercise } from '../types';
import { EXERCISE_SUGGESTIONS } from '../data/exercises';
import { SparklesIcon } from './icons/Icons';

type ExerciseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exerciseData: Omit<Exercise, 'id' | 'status'>) => void;
  mode: 'add' | 'replace';
  exerciseToEdit?: Exercise;
};

const ExerciseModal: React.FC<ExerciseModalProps> = ({ isOpen, onClose, onSelectExercise, mode, exerciseToEdit }) => {

  const categorizedSuggestions = useMemo(() => {
    const gymEquipmentTypes = ['barbell', 'kettlebell', 'cable-machine', 'leg-press-machine'];

    const categories = EXERCISE_SUGGESTIONS.reduce((acc, ex) => {
        let categoryName: string;

        if (ex.purpose === 'warmup' || ex.purpose === 'cooldown') {
            categoryName = 'Warm Up / Cooldown';
        } else if (ex.equipment === 'rope' || ex.equipment === 'weighted-rope') {
            categoryName = 'Jump Rope';
        } else if (ex.equipment === 'bodyweight') {
            categoryName = 'Bodyweight';
        } else if (ex.equipment === 'dumbbell') {
            categoryName = 'Dumbbell';
        } else if (ex.equipment === 'resistance-band') {
            categoryName = 'Resistance Band';
        } else if (gymEquipmentTypes.includes(ex.equipment)) {
            categoryName = 'Gym Equipment';
        } else {
            categoryName = 'Other';
        }
        
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(ex);
        return acc;
    }, {} as { [key: string]: (typeof EXERCISE_SUGGESTIONS) });

    const categoryOrder = ['Warm Up / Cooldown', 'Bodyweight', 'Jump Rope', 'Dumbbell', 'Resistance Band', 'Gym Equipment', 'Other'];

    return Object.entries(categories).sort(([categoryA], [categoryB]) => {
        const indexA = categoryOrder.indexOf(categoryA);
        const indexB = categoryOrder.indexOf(categoryB);
        if (indexA === -1) return 1; // Put unknown categories at the end
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
  }, []);

  if (!isOpen) return null;

  const handleSelect = (exerciseName: string) => {
    const selectedExercise = EXERCISE_SUGGESTIONS.find(ex => ex.name === exerciseName);
    if (!selectedExercise) return;

    const fullExerciseData = {
        exercise: selectedExercise.name,
        duration: 45,
        rest: 15,
        equipment: selectedExercise.equipment,
        difficulty: selectedExercise.difficulty,
    };
    onSelectExercise(fullExerciseData);
    onClose();
  };
  
  const handleSurpriseMe = () => {
    const allSuggestions = categorizedSuggestions.flatMap(cat => cat[1]);
    if (allSuggestions.length === 0) return;
    
    const randomExercise = allSuggestions[Math.floor(Math.random() * allSuggestions.length)];
    handleSelect(randomExercise.name);
  }

  const title = mode === 'add' ? 'Add Exercise' : `Replace "${exerciseToEdit?.exercise}"`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg flex flex-col" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{title}</h2>
                <button type="button" onClick={handleSurpriseMe} className="flex items-center gap-2 text-sm bg-orange-500/20 text-orange-300 hover:bg-orange-500/40 px-3 py-1.5 rounded-md">
                    <SparklesIcon className="w-4 h-4" />
                    Surprise Me
                </button>
            </div>
          </div>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {categorizedSuggestions.map(([category, exercises]) => (
                <div key={category}>
                    <h3 className="font-bold text-orange-400 mb-2">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {exercises.map(ex => (
                            <button
                                key={ex.name}
                                type="button"
                                onClick={() => handleSelect(ex.name)}
                                className="p-3 bg-gray-700 hover:bg-orange-500 text-left rounded-lg text-sm transition-colors"
                            >
                                {ex.name}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
          </div>
          <div className="bg-gray-700/50 px-6 py-3 flex justify-end gap-3 border-t border-gray-700">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-white hover:bg-gray-600">Cancel</button>
          </div>
      </div>
    </div>
  );
};

export default ExerciseModal;
