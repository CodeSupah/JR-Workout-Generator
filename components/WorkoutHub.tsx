import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import WorkoutGenerator from './WorkoutGenerator';
import SavedRoutineCard from './SavedRoutineCard';
import { loadCustomWorkouts, deleteCustomWorkout } from '../services/workoutService';
import { generateWorkoutPlan } from '../services/geminiService';
import { toastStore } from '../store/toastStore';
import { profileStore } from '../store/profileStore';
import { WorkoutPlan, WorkoutPreferences, SkillLevel, WorkoutGoal, UserProfile, WorkoutEnvironment } from '../types';
import { PROGRAM_CATEGORIES } from '../data/programs';
import { PlusIcon, FolderOpenIcon, CogIcon, SparklesIcon } from './icons/Icons';

const goalToTitleMap: Record<WorkoutGoal, string> = {
    [WorkoutGoal.MuscleGain]: "Muscle Gain Focus",
    [WorkoutGoal.StrengthPower]: "Strength & Power",
    [WorkoutGoal.FatLoss]: "Fat Loss & Conditioning",
    [WorkoutGoal.GeneralFitness]: "General Fitness",
    [WorkoutGoal.RecoveryMobility]: "Recovery & Mobility",
};

const WorkoutHub: React.FC = () => {
    const [routines, setRoutines] = useState<WorkoutPlan[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    
    const [view, setView] = useState<'hub' | 'generator'>(
        location.state?.autoShowGenerator ? 'generator' : 'hub'
    );
    const [isGeneratingSuggested, setIsGeneratingSuggested] = useState(false);
    const [suggestedWorkout, setSuggestedWorkout] = useState({ title: '', preferences: {} as Partial<WorkoutPreferences> });

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [primaryGoalWorkout, setPrimaryGoalWorkout] = useState<{ title: string; preferences: Partial<WorkoutPreferences> } | null>(null);
    const [secondaryGoalWorkout, setSecondaryGoalWorkout] = useState<{ title: string; preferences: Partial<WorkoutPreferences> } | null>(null);
    const [isGeneratingPrimary, setIsGeneratingPrimary] = useState(false);
    const [isGeneratingSecondary, setIsGeneratingSecondary] = useState(false);

    useEffect(() => {
        if (location.state?.autoShowGenerator) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, location.pathname, navigate]);

    useEffect(() => {
        const goals = Object.values(WorkoutGoal);
        const randomGoal = goals[Math.floor(Math.random() * goals.length)];
        const duration = [15, 20, 25][Math.floor(Math.random() * 3)];
        setSuggestedWorkout({
            title: `Your Daily ${randomGoal} Focus`,
            preferences: {
                duration,
                skillLevel: SkillLevel.Intermediate,
                goal: randomGoal,
                environment: WorkoutEnvironment.HomeLimited,
                homeEquipment: ['Dumbbells', 'Jump Rope'],
                rounds: 3,
                includeWarmUp: true,
                warmUpDuration: 3,
                includeCoolDown: true,
                coolDownDuration: 2,
                defaultRestDuration: 60,
                restBetweenRounds: 120,
            }
        });
    }, []);

    useEffect(() => {
        const unsubscribe = profileStore.subscribe(setProfile);
        return () => unsubscribe();
    }, []);


    const getComplementaryGoal = (primary: WorkoutGoal): WorkoutGoal => {
        const map: Record<string, WorkoutGoal> = {
            [WorkoutGoal.MuscleGain]: WorkoutGoal.FatLoss,
            [WorkoutGoal.StrengthPower]: WorkoutGoal.GeneralFitness,
            [WorkoutGoal.FatLoss]: WorkoutGoal.MuscleGain,
            [WorkoutGoal.GeneralFitness]: WorkoutGoal.RecoveryMobility,
            [WorkoutGoal.RecoveryMobility]: WorkoutGoal.GeneralFitness,
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
                    environment: WorkoutEnvironment.Gym,
                    homeEquipment: [],
                    rounds: 3,
                    includeWarmUp: true,
                    warmUpDuration: 3,
                    includeCoolDown: true,
                    coolDownDuration: 2,
                    defaultRestDuration: 60,
                    restBetweenRounds: 120,
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
                    environment: WorkoutEnvironment.HomeBodyweight,
                    homeEquipment: [],
                    rounds: 4,
                    includeWarmUp: true,
                    warmUpDuration: 3,
                    includeCoolDown: true,
                    coolDownDuration: 2,
                    defaultRestDuration: 60,
                    restBetweenRounds: 120,
                }
            });
        }
    }, [profile]);


    const fetchRoutines = async () => {
        const data = await loadCustomWorkouts();
        setRoutines(data);
    };

    useEffect(() => {
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

    const placeholderRoutines: Partial<WorkoutPlan>[] = [
        { id: 'p1', name: 'Full-Body Strength', rounds: Array(8).fill({ duration: 45, rest: 15 }) },
        { id: 'p2', name: 'Morning Cardio', rounds: Array(10).fill({ duration: 50, rest: 10 }) },
        { id: 'p3', name: 'Jump Rope HIIT', rounds: Array(12).fill({ duration: 30, rest: 30 }) },
    ];
    
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
            
            {/* Section 2: Workout Builder */}
            <section>
                <h2 className="text-3xl font-bold mb-4">Workout Builder</h2>
                <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm max-w-md text-center sm:text-left">Build a workout from scratch, exercise by exercise, with full control over sets, reps, and supersets.</p>
                    <Link to="/manual-builder" className="flex-shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-md transition-transform transform hover:scale-105">
                        <PlusIcon className="w-5 h-5"/> Build Custom Workout
                    </Link>
                </div>
            </section>

             {/* Section 3: Discover Workout Plans */}
            <section>
                <h2 className="text-3xl font-bold mb-4">Discover Workout Plans</h2>
                <div className="flex overflow-x-auto space-x-3 py-2 -mx-6 px-6 scrollbar-hide">
                    {PROGRAM_CATEGORIES.map(category => (
                         <div key={category.name} className="flex-shrink-0 bg-gray-800 p-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-700/80 cursor-pointer transition-colors">
                            <category.icon className={`w-5 h-5 ${category.color}`} />
                            <span className="font-semibold text-white text-sm whitespace-nowrap">{category.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 4: My Routines */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold">My Routines</h2>
                    <Link to="/manual-builder" className="flex items-center gap-2 text-sm bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-semibold text-white transition-colors transform hover:scale-105">
                        <PlusIcon className="w-5 h-5" /> Build Custom Workout
                    </Link>
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
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {placeholderRoutines.map(routine => (
                                    <SavedRoutineCard
                                        key={routine.id}
                                        routine={routine}
                                        onStart={() => {}}
                                        onDelete={() => {}}
                                        isPlaceholder={true}
                                    />
                                ))}
                            </div>
                             <div className="text-center p-6 mt-4">
                                <p className="text-gray-400">Your library is empty! Generate a workout, perfect it, and save it here to build your personalized collection.</p>
                            </div>
                        </>
                    )}
                 </div>
            </section>
            
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
    );
};

export default WorkoutHub;