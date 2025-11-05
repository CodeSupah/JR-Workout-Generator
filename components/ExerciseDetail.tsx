import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ExerciseDetails, SessionSummary } from '../types';
import { getExerciseById, invalidateExerciseCache } from '../services/exerciseService';
import { getWorkoutHistory } from '../services/workoutService';
import { deleteCustomExercise } from '../services/customExerciseService';
import { toastStore } from '../store/toastStore';
import { DumbbellIcon, ClockIcon, EditIcon, TrashIcon } from './icons/Icons';
import CreateExerciseModal from './CreateExerciseModal';
import ConfirmModal from './ConfirmModal';


const ExerciseDetail: React.FC = () => {
    const { exerciseId } = useParams<{ exerciseId: string }>();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState<ExerciseDetails | null>(null);
    const [history, setHistory] = useState<SessionSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const fetchData = async () => {
        if (!exerciseId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const exerciseData = await getExerciseById(exerciseId);

            if (exerciseData) {
                setExercise(exerciseData);
                const allHistory = getWorkoutHistory();
                
                const relevantHistory = allHistory.filter(session => 
                    session.workoutPlan.rounds.some(exInPlan => exInPlan.exercise === exerciseData.name) ||
                    session.workoutPlan.warmUp.some(exInPlan => exInPlan.exercise === exerciseData.name) ||
                    session.workoutPlan.coolDown.some(exInPlan => exInPlan.exercise === exerciseData.name)
                ).reverse();
                setHistory(relevantHistory);
            } else {
                setExercise(null);
                setHistory([]);
            }

        } catch (error) {
            console.error("Failed to fetch exercise details", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [exerciseId]);

    const handleExerciseUpdated = () => {
        invalidateExerciseCache();
        fetchData(); // Refetch the data for this page to show updates
    };

    const handleDelete = async () => {
        if (exercise && exercise.category === 'Custom') {
            await deleteCustomExercise(exercise.id);
            invalidateExerciseCache();
            toastStore.addToast('Exercise deleted successfully.', 'error');
            navigate('/exercises');
        }
    };


    if (loading) {
        return <div className="text-center p-10">Loading exercise details...</div>;
    }

    if (!exercise) {
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold text-red-400">Exercise not found</h1>
                <Link to="/exercises" className="text-orange-400 hover:underline mt-4 inline-block">
                    &larr; Back to Exercise Library
                </Link>
            </div>
        );
    }

    const skillLevelColors: Record<string, string> = {
        Beginner: 'bg-green-500/20 text-green-300',
        Intermediate: 'bg-yellow-500/20 text-yellow-300',
        Advanced: 'bg-red-500/20 text-red-300',
    };

    return (
        <>
            {exercise && exercise.category === 'Custom' && (
                <CreateExerciseModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onExerciseCreated={handleExerciseUpdated}
                    exerciseToEdit={exercise}
                />
            )}
            <ConfirmModal
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Delete Exercise?"
                message={`Are you sure you want to permanently delete "${exercise?.name}"? This action cannot be undone.`}
            />
            <div className="space-y-8 animate-fade-in pb-24">
                <div>
                    <Link to="/exercises" className="text-sm text-orange-400 hover:underline mb-2 inline-block">
                        &larr; Back to Library
                    </Link>
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-white">{exercise.name}</h1>
                            <p className="text-gray-400 mt-2">{exercise.category}</p>
                        </div>
                         {exercise.category === 'Custom' && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button onClick={() => setIsEditModalOpen(true)} className="p-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg" title="Edit Exercise">
                                    <EditIcon className="w-5 h-5"/>
                                </button>
                                <button onClick={() => setIsDeleteConfirmOpen(true)} className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg" title="Delete Exercise">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {exercise.videoUrl && (
                            <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={exercise.videoUrl.replace("watch?v=", "embed/")}
                                    title={`YouTube video player for ${exercise.name}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                        <div className="bg-gray-800/50 p-6 rounded-2xl">
                            <h2 className="text-xl font-bold mb-3">Description</h2>
                            <p className="text-gray-300 whitespace-pre-line">{exercise.description}</p>
                        </div>
                        <div className="bg-gray-800/50 p-6 rounded-2xl">
                            <h2 className="text-xl font-bold mb-3">Instructions</h2>
                            <ol className="list-decimal list-inside space-y-2 text-gray-300">
                                {exercise.instructions.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-800/50 p-6 rounded-2xl space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-300 mb-2">Skill Level</h3>
                                <div className="flex flex-wrap gap-2">
                                    {exercise.skillLevels.map(level => (
                                        <span key={level} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${skillLevelColors[level]}`}>
                                            {level}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-300 mb-2">Equipment</h3>
                                <div className="flex flex-wrap gap-2">
                                    {exercise.equipment.map(item => (
                                        <span key={item} className="bg-gray-700 text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
                                            {item.replace(/-/g, ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-300 mb-2">Primary Goals</h3>
                                <div className="flex flex-wrap gap-2">
                                    {exercise.goals.map(goal => (
                                        <span key={goal} className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                                            {goal}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-800/50 p-6 rounded-2xl">
                            <h2 className="text-xl font-bold mb-3">Muscle Groups</h2>
                            <div className="flex flex-wrap gap-2">
                                {exercise.muscleGroups.map(group => (
                                    <span key={group} className="bg-blue-500/20 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        {group}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-800/50 p-6 rounded-2xl">
                            <h2 className="text-xl font-bold mb-3">Workout History</h2>
                            {history.length > 0 ? (
                                <p className="text-gray-300">You have performed this exercise in <strong className="text-white">{history.length}</strong> workout(s).</p>
                            ) : (
                                <p className="text-gray-400 text-sm">You haven't performed this exercise yet. Add it to a workout!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExerciseDetail;
