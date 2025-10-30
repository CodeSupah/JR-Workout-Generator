import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WorkoutGenerator from './WorkoutGenerator';
import SavedRoutineCard from './SavedRoutineCard';
import { loadCustomWorkouts, deleteCustomWorkout } from '../services/workoutService';
import { generateWorkoutPlan } from '../services/geminiService';
import { toastStore } from '../store/toastStore';
import { profileStore } from '../store/profileStore';
import { WorkoutPlan, WorkoutPreferences, SkillLevel, WorkoutGoal, Equipment, UserProfile } from '../types';
import { PROGRAM_CATEGORIES } from '../data/programs';
import { PlusIcon, FolderOpenIcon, CogIcon, SparklesIcon } from './icons/Icons';

const goalToTitleMap: Record<WorkoutGoal, string> = {
    [WorkoutGoal.FullBody]: "Full Body Strength Builder",
    [WorkoutGoal.CardioEndurance]: "Fat Burner HIIT Blast",
    [WorkoutGoal.Power]: "Explosive Power Session",
    [WorkoutGoal.CoreStrength]: "Quick Core & Cardio",
    [WorkoutGoal.Freestyle]: "Freestyle Skills Flow",
};

const WorkoutHub: React.FC = () => {
    const [routines, setRoutines] = useState<WorkoutPlan[]>([]);
    const navigate = useNavigate();
    
    // State for view management and suggested workout
    const [view, setView] = useState<'hub' | 'generator'>('hub');
    const [isGeneratingSuggested, setIsGeneratingSuggested] = useState(false);
    const [suggestedWorkout, setSuggestedWorkout] = useState({ title: '', preferences: {} as Partial<WorkoutPreferences> });

    // State for user profile and goal-based workouts
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [primaryGoalWorkout, setPrimaryGoalWorkout] = useState<{ title: string; preferences: Partial<WorkoutPreferences> } | null>(null);
    const [secondaryGoalWorkout, setSecondaryGoalWorkout] = useState<{ title: string; preferences: Partial<WorkoutPreferences> } | null>(null);
    const [isGeneratingPrimary, setIsGeneratingPrimary] = useState(false);
    const [isGeneratingSecondary, setIsGeneratingSecondary] = useState(false);

    useEffect(() => {
        // This will run once to set up the random suggested workout title and preferences
        const goals = Object.values(WorkoutGoal);
        const randomGoal = goals[Math.floor(Math.random() * goals.length)];
        const duration = [15, 20, 25][Math.floor(Math.random() * 3)];
        setSuggestedWorkout({
            title: `Your Daily ${randomGoal} Jump`,
            preferences: {
                duration,
                skillLevel: SkillLevel.Intermediate,
                goal: randomGoal,
                equipment: [Equipment.Regular],
                mode: 'jump-rope',
                includeJumpRopeIntervals: false,
                rounds: 3,
                availableEquipment: [],
                includeWarmUp: true,
                warmUpDuration: 3,
                includeCoolDown: true,
                coolDownDuration: 2,
            }
        });
    }, []);

    useEffect(() => {
        // Subscribe to profile changes
        const unsubscribe = profileStore.subscribe(setProfile);
        return () => unsubscribe();
    }, []);


    const getComplementaryGoal = (primary: WorkoutGoal): WorkoutGoal => {
        const map: Record<WorkoutGoal, WorkoutGoal> = {
            [WorkoutGoal.FullBody]: WorkoutGoal.CardioEndurance,
            [WorkoutGoal.CardioEndurance]: WorkoutGoal.CoreStrength,
            [WorkoutGoal.Power]: WorkoutGoal.FullBody,
            [WorkoutGoal.CoreStrength]: WorkoutGoal.CardioEndurance,
            [WorkoutGoal.Freestyle]: WorkoutGoal.FullBody,
        };
        return map[primary];
    };

    useEffect(() => {
        if (profile) {
            const primaryGoal = profile.primaryGoal;
            const primaryTitle = goalToTitleMap[primaryGoal] || `Primary: ${primaryGoal}`;

            setPrimaryGoalWorkout({
                title: primaryTitle,
                preferences: {
                    duration: 20,
                    skillLevel: SkillLevel.Intermediate,
                    goal: primaryGoal,
                    equipment: [Equipment.Regular],
                    mode: primaryGoal === WorkoutGoal.FullBody || primaryGoal === WorkoutGoal.Power ? 'equipment' : 'jump-rope',
                    includeJumpRopeIntervals: true,
                    rounds: 3,
                    availableEquipment: ['Dumbbell'],
                    includeWarmUp: true,
                    warmUpDuration: 3,
                    includeCoolDown: true,
                    coolDownDuration: 2,
                }
            });

            const secondaryGoal = getComplementaryGoal(primaryGoal);
            const secondaryTitle = goalToTitleMap[secondaryGoal] || `Complementary: ${secondaryGoal}`;

            setSecondaryGoalWorkout({
                title: secondaryTitle,
                preferences: {
                    duration: 20,
                    skillLevel: SkillLevel.Intermediate,
                    goal: secondaryGoal,
                    equipment: [Equipment.Regular],
                    mode: 'no-equipment',
                    includeJumpRopeIntervals: true,
                    rounds: 4,
                    availableEquipment: [],
                    includeWarmUp: true,
                    warmUpDuration: 3,
                    includeCoolDown: true,
                    coolDownDuration: 2,
                }
            });
        }
    }, [profile]);


    const fetchRoutines = async () => {
        const data = await loadCustomWorkouts();
        setRoutines(data);
    };

    useEffect(() => {
        // Fetch routines when in hub view
        if (view === 'hub') {
            fetchRoutines();
        }
    }, [view]);

    const handleStartRoutine = (routine: WorkoutPlan) => {
        navigate('/session', { state: { workout: routine } });
    };

    const handleDeleteRoutine = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this routine?")) {
            await deleteCustomWorkout(id);
            fetchRoutines(); // Refresh list
        }
    };
    
    const handleStartSuggestedWorkout = async (
        workoutPrefs: Partial<WorkoutPreferences> | undefined,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        if (!workoutPrefs) return;
        setLoading(true);
        try {
            const plan = await generateWorkoutPlan(workoutPrefs as WorkoutPreferences);
            const storageObject = {
                plan,
                preferences: workoutPrefs,
                date: new Date().toISOString().split('T')[0],
            };
            sessionStorage.setItem('suggestedWorkoutPlan', JSON.stringify(storageObject));
            setView('generator');
        } catch (error: any) {
            toastStore.addToast(error.message || 'Failed to generate suggested workout', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    // Placeholder function
    const handleCreateFolder = () => {
        alert("Folder creation coming soon!");
    };
    
    const SuggestedWorkoutButton: React.FC<{
        onClick: () => void;
        disabled: boolean;
        title: string;
        duration: number;
    }> = ({ onClick, disabled, title, duration }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full flex flex-col items-center justify-center gap-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg text-md transition-transform transform hover:scale-105 min-h-[72px]"
        >
            {disabled ? (
                <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                </div>
            ) : (
                <>
                    <span className="font-bold text-center">{title}</span>
                    <span className="text-sm font-normal text-gray-300">{duration} min • Suggested</span>
                </>
            )}
        </button>
    );
    
    if (view === 'generator') {
        return (
            <div className="animate-fade-in">
                <button onClick={() => setView('hub')} className="text-sm text-orange-400 hover:underline mb-4 inline-block">
                    &larr; Back to Workout Hub
                </button>
                <WorkoutGenerator />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in pb-24">
             {/* Section 1: Quick Actions */}
            <section>
                <h1 className="text-4xl font-bold text-white mb-6">Quick Start</h1>
                <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg space-y-4">
                    <button 
                        onClick={() => setView('generator')}
                        className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-orange-500/30">
                        <CogIcon className="w-6 h-6" />
                        Generate a New Workout
                    </button>
                    {suggestedWorkout.preferences.duration && (
                        <SuggestedWorkoutButton
                            onClick={() => handleStartSuggestedWorkout(suggestedWorkout.preferences, setIsGeneratingSuggested)}
                            disabled={isGeneratingSuggested}
                            title={suggestedWorkout.title}
                            duration={suggestedWorkout.preferences.duration}
                        />
                    )}
                    {primaryGoalWorkout && primaryGoalWorkout.preferences.duration && (
                        <SuggestedWorkoutButton
                            onClick={() => handleStartSuggestedWorkout(primaryGoalWorkout.preferences, setIsGeneratingPrimary)}
                            disabled={isGeneratingPrimary}
                            title={primaryGoalWorkout.title}
                            duration={primaryGoalWorkout.preferences.duration}
                        />
                    )}
                     {secondaryGoalWorkout && secondaryGoalWorkout.preferences.duration && (
                        <SuggestedWorkoutButton
                            onClick={() => handleStartSuggestedWorkout(secondaryGoalWorkout.preferences, setIsGeneratingSecondary)}
                            disabled={isGeneratingSecondary}
                            title={secondaryGoalWorkout.title}
                            duration={secondaryGoalWorkout.preferences.duration}
                        />
                    )}
                </div>
            </section>
            
            <div className="relative my-12">
                <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-700" /></div>
                <div className="relative flex justify-center"><span className="bg-gray-900 px-4 text-lg font-medium text-gray-400">Or</span></div>
            </div>

            {/* Section 2: Manual Builder */}
            <section>
                <h2 className="text-3xl font-bold mb-4">Manual Builder</h2>
                <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                    <Link to="/manual-builder" className="block bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg text-lg text-center transition-transform transform hover:scale-105">
                        Manual Workout Builder
                    </Link>
                    <p className="text-center text-gray-400 mt-3 text-sm">Build a workout from scratch, exercise by exercise.</p>
                </div>
            </section>
            
            {/* Section 3: My Routines */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold">My Routines</h2>
                    <div className="flex gap-2">
                        <button onClick={handleCreateFolder} className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg">
                            <FolderOpenIcon className="w-4 h-4" /> Create Folder
                        </button>
                         <Link to="/manual-builder" className="flex items-center gap-2 text-sm bg-orange-500 hover:bg-orange-600 px-3 py-2 rounded-lg">
                            <PlusIcon className="w-4 h-4" /> New Routine
                        </Link>
                    </div>
                </div>
                 <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                    {routines.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {routines.map(routine => (
                                <SavedRoutineCard
                                    key={routine.id}
                                    routine={routine}
                                    onStart={() => handleStartRoutine(routine)}
                                    onDelete={() => handleDeleteRoutine(routine.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-6">
                            <p className="text-gray-400">You haven't saved any routines yet.</p>
                            <p className="text-gray-400 mt-1">Generate a workout, customize it, and save it to find it here!</p>
                        </div>
                    )}
                 </div>
            </section>

            {/* Section 4: Explore Programs */}
            <section>
                <h2 className="text-3xl font-bold mb-4">Explore Programs</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {PROGRAM_CATEGORIES.map(category => (
                        <div key={category.name} className="bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center gap-3 hover:bg-gray-700/80 cursor-pointer transition-colors">
                            <category.icon className={`w-8 h-8 ${category.color}`} />
                            <p className="font-semibold text-white text-sm">{category.name}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default WorkoutHub;
