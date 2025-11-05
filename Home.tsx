import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { WorkoutStats, WorkoutPlan, WorkoutGoal, SkillLevel, Achievement, AchievementTier, WorkoutPreferences } from '../types';
import { getWorkoutStats, loadCustomWorkouts } from '../services/workoutService';
import { getNextChallenge } from '../services/achievementService';
import { generateWorkoutPlan } from '../services/geminiService';
import { toastStore } from '../store/toastStore';
import { profileStore } from '../store/profileStore';
import SavedRoutineCard from './SavedRoutineCard';
import { JumpLogoIcon, BellIcon, CogIcon, FlameIcon, ChartBarIcon, ClockIcon, TrophyIcon, SparklesIcon, ZapIcon } from './icons/Icons';

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string | number, color: string, onClick?: () => void }> = ({ icon, title, value, color, onClick }) => (
  <div onClick={onClick} className={`bg-gray-800 p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center gap-2 ${onClick ? 'cursor-pointer hover:bg-gray-700/80' : ''}`}>
    <div className={`p-2 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400">{title}</p>
    </div>
  </div>
);

const Home: React.FC = () => {
    const [stats, setStats] = useState<WorkoutStats | null>(null);
    const [recentRoutines, setRecentRoutines] = useState<WorkoutPlan[]>([]);
    const [nextChallenge, setNextChallenge] = useState<{ achievement: Achievement, tier: AchievementTier } | null>(null);
    const [greeting, setGreeting] = useState('');
    const [suggestedWorkout, setSuggestedWorkout] = useState({ title: '', duration: 0, preferences: {} as Partial<WorkoutPreferences> });
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [userName, setUserName] = useState('Jumper');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = profileStore.subscribe((profile) => {
            if (profile) {
                setUserName(profile.name);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchHomeScreenData = async () => {
            try {
                setIsLoading(true);
                const [statsData, routinesData, challengeData] = await Promise.all([
                    getWorkoutStats(),
                    loadCustomWorkouts(),
                    getNextChallenge()
                ]);
                
                setStats(statsData);
                setRecentRoutines(routinesData.slice(-3).reverse());
                setNextChallenge(challengeData);
            } catch (error) {
                console.error("Failed to load home screen data", error);
                toastStore.addToast('Could not load your data.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        const hours = new Date().getHours();
        if (hours < 12) setGreeting('Good Morning');
        else if (hours < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        // Mock a suggested workout
        const goals = Object.values(WorkoutGoal);
        const randomGoal = goals[Math.floor(Math.random() * goals.length)];
        const duration = [15, 20, 25][Math.floor(Math.random() * 3)];
        setSuggestedWorkout({
            title: `Your Daily ${randomGoal} Session`,
            duration,
            // FIX: Updated preferences to match the current WorkoutPreferences interface.
            preferences: {
                duration,
                skillLevel: SkillLevel.Intermediate,
                goal: randomGoal,
                availableEquipment: ['jump-rope'],
                rounds: 3,
                includeWarmUp: true,
                warmUpDuration: 3,
                includeCoolDown: true,
                coolDownDuration: 2,
                defaultRestDuration: 60,
                restBetweenRounds: 120,
            }
        });

        fetchHomeScreenData();
    }, []);
    
    const handleStartSuggestedWorkout = async () => {
        setIsGenerating(true);
        try {
            const plan = await generateWorkoutPlan(suggestedWorkout.preferences as WorkoutPreferences);
            
            // Data Validation: Check for object and array integrity.
            if (!plan || !Array.isArray(plan.warmUp) || !Array.isArray(plan.rounds) || !Array.isArray(plan.coolDown)) {
                throw new Error("AI returned an invalid workout structure.");
            }
            
            // Store plan and the preferences used to generate it.
            const storageObject = {
                plan,
                preferences: suggestedWorkout.preferences,
                date: new Date().toISOString().split('T')[0],
            };
            sessionStorage.setItem('suggestedWorkoutPlan', JSON.stringify(storageObject));

            navigate('/workout', { state: { autoShowGenerator: true } });
        } catch (error: any) {
            // Error Handling: Log for debugging and show user-friendly message.
            console.error("Failed to generate suggested workout:", error);
            toastStore.addToast('Could not generate a workout. Please try again or build one manually.', 'error');
        } finally {
            // Loading State Management: Always reset the loading state.
            setIsGenerating(false);
        }
    }

    if (isLoading) {
        return <div className="text-center p-10">Loading your space...</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in pb-24">
            {/* Header */}
            <header className="flex justify-between items-center">
                <JumpLogoIcon className="h-10 w-auto" />
                <div className="flex items-center gap-2">
                    <button className="p-2 bg-white/10 rounded-full hover:bg-white/20"><BellIcon className="w-5 h-5"/></button>
                    <Link to="/preferences" className="p-2 bg-white/10 rounded-full hover:bg-white/20" title="Settings & Preferences">
                        <CogIcon className="w-5 h-5"/>
                    </Link>
                </div>
            </header>

            {/* Greeting */}
            <section>
                <h1 className="text-3xl font-bold">{greeting}, {userName}!</h1>
                <p className="text-gray-400">Ready to keep that streak alive?</p>
            </section>

            {/* Primary Action */}
            <section className="bg-gray-800/50 p-6 rounded-2xl shadow-lg text-center space-y-4">
                <button 
                    onClick={handleStartSuggestedWorkout}
                    disabled={isGenerating}
                    className="w-full flex flex-col items-center justify-center gap-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 text-white font-bold py-4 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-orange-500/30">
                    {isGenerating ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Generating...</span>
                        </div>
                    ) : (
                        <>
                            <span>{suggestedWorkout.title}</span>
                            <span className="text-sm font-normal text-orange-200">{suggestedWorkout.duration} min • Suggested</span>
                        </>
                    )}
                </button>
                 <button onClick={() => navigate('/workout')} className="text-sm text-gray-300 hover:text-white">Or Build a Custom Workout</button>
            </section>

            {/* Mini Dashboard */}
            {stats && (
                 <section>
                    <div className="grid grid-cols-3 gap-3">
                        <StatCard icon={<ChartBarIcon className="w-5 h-5 text-white"/>} title="Workouts" value={stats.totalWorkouts} color="bg-blue-500" onClick={() => navigate('/profile')} />
                        <StatCard icon={<FlameIcon className="w-5 h-5 text-white"/>} title="Day Streak" value={stats.currentStreak} color="bg-orange-500" onClick={() => navigate('/profile')} />
                        <StatCard icon={<ClockIcon className="w-5 h-5 text-white"/>} title="Mins This Week" value={stats.weeklySummary.reduce((a, b) => a + b.minutes, 0)} color="bg-green-500" onClick={() => navigate('/profile')} />
                    </div>
                </section>
            )}

            {/* Next Challenge */}
            {nextChallenge && (
                <section>
                    <h2 className="text-xl font-bold mb-3">Your Next Challenge</h2>
                    <div className="bg-purple-500/20 border border-purple-400/50 p-5 rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-purple-500 rounded-full">
                                <TrophyIcon className="w-6 h-6 text-white"/>
                            </div>
                            <div>
                                <p className="font-bold text-white">{nextChallenge.tier.name}</p>
                                <p className="text-sm text-purple-200">{nextChallenge.tier.description}</p>
                            </div>
                        </div>
                        <button onClick={() => navigate('/profile')} className="px-4 py-2 bg-purple-500 text-white rounded-md text-sm font-semibold hover:bg-purple-600">
                            View
                        </button>
                    </div>
                </section>
            )}

            {/* Quick Routines */}
            <section>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-bold">Quick Routines</h2>
                    <button onClick={() => navigate('/profile')} className="text-sm text-orange-400 hover:text-orange-300 font-semibold">View All</button>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentRoutines.length > 0 ? (
                        recentRoutines.map(routine => (
                            <SavedRoutineCard
                                key={routine.id}
                                routine={routine}
                                onStart={() => navigate('/session', { state: { workout: routine } })}
                                onDelete={() => { /* Not implemented on home screen */ }}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center p-8 bg-gray-800/50 rounded-lg">
                            <p className="text-gray-400">Save a custom workout to see it here!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Home;