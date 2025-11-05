import React, { useState, useEffect, useMemo } from 'react';
import { ExerciseDetails, WorkoutGoal, SkillLevel, ExerciseEquipment, WorkoutType } from '../types';
import { generateExerciseInstructions } from '../services/geminiService';
import { addCustomExercise, updateCustomExercise } from '../services/customExerciseService';
import { getAllExercises } from '../services/exerciseService';
import { toastStore } from '../store/toastStore';
import { SparklesIcon } from './icons/Icons';

type CreateExerciseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onExerciseCreated: () => void;
  exerciseToEdit?: ExerciseDetails | null;
};

const initialExerciseState: Partial<ExerciseDetails> = {
    name: '',
    goals: [],
    skillLevels: ['Beginner'],
    equipment: ['bodyweight'],
    muscleGroups: [],
    videoUrl: '',
    description: '',
    instructions: [],
};

const CreateExerciseModal: React.FC<CreateExerciseModalProps> = ({ isOpen, onClose, onExerciseCreated, exerciseToEdit }) => {
    const isEditMode = !!exerciseToEdit;
    const [newExercise, setNewExercise] = useState<Partial<ExerciseDetails>>(initialExerciseState);
    const [isGenerating, setIsGenerating] = useState(false);
    const [allMuscleGroups, setAllMuscleGroups] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            const fetchMuscleGroups = async () => {
                const exercises = await getAllExercises();
                const muscleSet = new Set<string>();
                exercises.forEach(ex => ex.muscleGroups.forEach(m => muscleSet.add(m)));
                setAllMuscleGroups(Array.from(muscleSet).sort());
            };
            fetchMuscleGroups();
            if (isEditMode && exerciseToEdit) {
                setNewExercise(exerciseToEdit);
            } else {
                setNewExercise(initialExerciseState);
            }
        } else {
            setNewExercise(initialExerciseState);
        }
    }, [isOpen, isEditMode, exerciseToEdit]);

    const handleInputChange = (field: keyof ExerciseDetails, value: any) => {
        setNewExercise(prev => ({ ...prev, [field]: value }));
    };

    const handleMultiSelectChange = (field: 'goals' | 'equipment' | 'muscleGroups' | 'skillLevels', value: string) => {
        const currentValues = newExercise[field] as string[] || [];
        
        // For skillLevels, it's a single select replacement
        if (field === 'skillLevels') {
            handleInputChange(field, [value]);
            return;
        }

        const newValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];
        handleInputChange(field, newValues);
    };

    const handleGenerateInstructions = async () => {
        if (!newExercise.name) {
            toastStore.addToast('Please enter an exercise name first.', 'error');
            return;
        }
        setIsGenerating(true);
        try {
            const result = await generateExerciseInstructions(
                newExercise.name,
                newExercise.skillLevels?.[0] as SkillLevel || SkillLevel.Beginner,
                newExercise.equipment as ExerciseEquipment[] || ['bodyweight']
            );
            setNewExercise(prev => ({ ...prev, description: result.description, instructions: result.instructions }));
            toastStore.addToast('Instructions generated!');
        } catch (error) {
            console.error(error);
            toastStore.addToast('Failed to generate instructions.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const determineWorkoutType = (): WorkoutType => {
        const goals = newExercise.goals || [];
        if (goals.includes(WorkoutGoal.Cardio)) return 'Cardio/HIIT';
        if (goals.includes(WorkoutGoal.Mobility)) return 'Mobility/Stretch';
        if (goals.includes(WorkoutGoal.Core)) return 'Core/Accessory';
        return 'Compound';
    }

    const handleSave = async () => {
        const { name, goals, skillLevels, equipment, muscleGroups, instructions } = newExercise;
        if (!name || !goals?.length || !skillLevels?.length || !equipment?.length || !muscleGroups?.length || !instructions?.length) {
            toastStore.addToast('Please fill all required fields and generate instructions.', 'error');
            return;
        }

        if (isEditMode && exerciseToEdit) {
            // Construct the updated exercise by spreading the original and the changes.
            // This is cleaner and avoids redundant assignments.
            const finalExercise: ExerciseDetails = {
                ...exerciseToEdit,
                ...newExercise,
                workoutType: determineWorkoutType(),
            };
            await updateCustomExercise(finalExercise);
            toastStore.addToast('Exercise updated successfully!');
        } else {
            // Construct a new exercise for create mode.
            const finalExercise: ExerciseDetails = {
                id: `custom-${crypto.randomUUID()}`,
                name: name,
                category: 'Custom',
                purpose: 'main',
                skillLevels: skillLevels as ('Beginner' | 'Intermediate' | 'Advanced')[],
                equipment: equipment as ExerciseEquipment[],
                goals: goals as WorkoutGoal[],
                workoutType: determineWorkoutType(),
                description: newExercise.description || '',
                instructions: instructions,
                muscleGroups: muscleGroups,
                videoUrl: newExercise.videoUrl,
                keywords: name.toLowerCase().split(' '),
            };
            await addCustomExercise(finalExercise);
            toastStore.addToast('Custom exercise saved successfully!');
        }
        
        onExerciseCreated();
        onClose();
    };
    
    const isSaveDisabled = !newExercise.name || !newExercise.goals?.length || !newExercise.equipment?.length || !newExercise.muscleGroups?.length || !newExercise.instructions?.length;

    if (!isOpen) return null;
    
    const MultiSelectPill: React.FC<{ label: string; field: 'goals' | 'equipment' | 'muscleGroups'; }> = ({ label, field }) => {
        const isSelected = (newExercise[field] as string[] || []).includes(label);
        return (
             <button
                onClick={() => handleMultiSelectChange(field, label)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${ isSelected ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
            >
                {label}
            </button>
        );
    };


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={onClose}>
            <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold">{isEditMode ? 'Edit Custom Exercise' : 'Create Custom Exercise'}</h2>
                </div>

                <div className="overflow-y-auto p-6 space-y-6">
                    <div className="form-group">
                        <label>Exercise Name*</label>
                        <input type="text" value={newExercise.name} onChange={e => handleInputChange('name', e.target.value)} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="form-group">
                            <label>Skill Level*</label>
                            <div className="flex bg-gray-900/50 p-1 rounded-lg">
                                {Object.values(SkillLevel).map(level => (
                                    <button key={level} onClick={() => handleMultiSelectChange('skillLevels', level)} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${(newExercise.skillLevels || []).includes(level) ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                             <label>Equipment*</label>
                            <div className="flex flex-wrap gap-2">
                                {['bodyweight', 'dumbbell', 'gym-equipment'].map(e => <MultiSelectPill key={e} label={e} field="equipment" />)}
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Primary Goals*</label>
                        <div className="flex flex-wrap gap-2">
                            {Object.values(WorkoutGoal).map(goal => <MultiSelectPill key={goal} label={goal} field="goals" />)}
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label>Muscle Groups*</label>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto bg-gray-900/50 p-2 rounded-md">
                            {allMuscleGroups.map(group => <MultiSelectPill key={group} label={group} field="muscleGroups" />)}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>YouTube Video URL (Optional)</label>
                        <input type="text" placeholder="e.g., https://www.youtube.com/embed/..." value={newExercise.videoUrl} onChange={e => handleInputChange('videoUrl', e.target.value)} />
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                             <label className="form-group-label">Description & Instructions*</label>
                             <button
                                onClick={handleGenerateInstructions}
                                disabled={isGenerating || !newExercise.name}
                                className="flex items-center gap-2 text-sm bg-teal-500/20 text-teal-300 hover:bg-teal-500/40 px-3 py-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                                ) : (
                                    <SparklesIcon className="w-4 h-4" />
                                )}
                                {isGenerating ? 'Generating...' : 'Generate with AI'}
                            </button>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-lg space-y-3 min-h-[150px] text-sm text-gray-300">
                            {newExercise.description && <p className="italic">{newExercise.description}</p>}
                            {(newExercise.instructions || []).length > 0 && (
                                <ol className="list-decimal list-inside space-y-1">
                                    {newExercise.instructions?.map((step, i) => <li key={i}>{step}</li>)}
                                </ol>
                            )}
                            {!newExercise.description && !newExercise.instructions?.length && !isGenerating && (
                                <p className="text-gray-500 text-center pt-8">Generated content will appear here.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-700/50 px-6 py-3 flex justify-end gap-3 border-t border-gray-700 flex-shrink-0">
                    <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-white hover:bg-gray-600">Cancel</button>
                    <button type="button" onClick={handleSave} disabled={isSaveDisabled} className="py-2 px-4 rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-800/50 disabled:cursor-not-allowed">{isEditMode ? 'Save Changes' : 'Save Exercise'}</button>
                </div>
            </div>
             <style>{`
                .form-group label, .form-group-label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #D1D5DB; }
                .form-group input { width: 100%; background-color: #1F2937; color: white; border: 1px solid #4B5563; border-radius: 0.5rem; padding: 0.75rem; outline: none; }
                .form-group input:focus { border-color: #F97316; box-shadow: 0 0 0 2px #F9731640; }
            `}</style>
        </div>
    );
};

export default CreateExerciseModal;