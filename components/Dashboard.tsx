import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { WorkoutStats, WorkoutPlan, Achievement, UserAchievementProgress, UserAchievement, AchievementTier, ExerciseDetails, UnlockedAchievementInfoWithId } from '../types';
import { getWorkoutStats, loadCustomWorkouts, deleteCustomWorkout, getWorkoutHistory, getRecentExercises } from '../services/workoutService';
import { getAchievements, getUserAchievementProgress } from '../services/achievementService';
import { EXERCISE_DATABASE } from '../data/exerciseDatabase';
import ActivityOverview from './ActivityOverview';
import SavedRoutineCard from './SavedRoutineCard';
import AchievementBadge from './AchievementBadge';
import AchievementPreviewCard from './AchievementPreviewCard';
import { BookOpenIcon, CogIcon, PlusIcon, UserIcon } from './icons/Icons';

const CircularProgressBar: React.FC<{ progress: number; goal: number; }> = ({ progress, goal }) => {
    const clampedProgress = Math.min(progress, goal);
    const percentage = goal > 0 ? (clampedProgress / goal) * 100 : 0;
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <circle
                    className="text-gray-700"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                />
                <circle
                    className="text-orange-500"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold text-white">{`${progress}/${goal}`}</span>
                <span className="text-xs text-gray-400 max-w-[80px] leading-tight mt-1">
                    Workouts to complete this week
                </span>
            </div>
        </div>
    );
};

const findNextTier = (achievement: Achievement, userProgress?: UserAchievement): AchievementTier | null => {
    if (!userProgress) {
        return achievement.tiers[0] || null;
    }
    for (const tier of achievement.tiers) {
        const isUnlocked = userProgress.unlockedTiers.some(ut => ut.tier === tier.tier);
        if (!isUnlocked) {
            return tier;
        }
    }
    return null; // All tiers completed
};

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [routines, setRoutines] = useState<WorkoutPlan[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementProgress, setAchievementProgress] = useState<UserAchievementProgress>({});
  const [loading, setLoading] = useState(true);
  const [workoutsThisWeek, setWorkoutsThisWeek] = useState(0);
  const [recentExercises, setRecentExercises] = useState<ExerciseDetails[]>([]);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [previewAchievements, setPreviewAchievements] = useState<{
    recent: UnlockedAchievementInfoWithId[];
    closest: { achievement: Achievement; tier: AchievementTier; progress: number } | null;
  }>({ recent: [], closest: null });
  const navigate = useNavigate();

  const fetchRoutines = useCallback(async () => {
    const data = await loadCustomWorkouts();
    setRoutines(data);
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, achievementsData, progressData, historyData, recentExerciseNames] = await Promise.all([
          getWorkoutStats(),
          getAchievements(),
          getUserAchievementProgress(),
          getWorkoutHistory(),
          getRecentExercises(3),
      ]);
      setStats(statsData);
      setAchievements(achievementsData);
      setAchievementProgress(progressData);

      const today = new Date();
      const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      firstDayOfWeek.setHours(0, 0, 0, 0);
      
      const uniqueWorkoutDaysThisWeek = new Set(
        historyData
          .filter(session => new Date(session.date) >= firstDayOfWeek)
          .map(session => new Date(session.date).toDateString())
      );
      setWorkoutsThisWeek(uniqueWorkoutDaysThisWeek.size);

      const recentExDetails = recentExerciseNames
        .map(name => EXERCISE_DATABASE.find(ex => ex.name === name))
        .filter((ex): ex is ExerciseDetails => ex !== undefined);
      setRecentExercises(recentExDetails);

      // --- Achievement Preview Logic ---
      const allUnlockedTiers: UnlockedAchievementInfoWithId[] = [];
      Object.entries(progressData).forEach(([achievementId, userAchievement]) => {
          const achievement = achievementsData.find(a => a.id === achievementId);
          if (achievement) {
              userAchievement.unlockedTiers.forEach(unlockedTier => {
                  const tierDetails = achievement.tiers.find(t => t.tier === unlockedTier.tier);
                  if (tierDetails) {
                      allUnlockedTiers.push({
                          ...tierDetails,
                          id: `${achievementId}-${tierDetails.tier}`,
                          unlockedAt: unlockedTier.unlockedAt,
                          icon: achievement.icon,
                          achievementTitle: achievement.title,
                      });
                  }
              });
          }
      });
      allUnlockedTiers.sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime());
      const recent = allUnlockedTiers.slice(0, 3);

      let closest: { achievement: Achievement; tier: AchievementTier; progress: number } | null = null;
      let maxProgressRatio = -1;

      achievementsData.forEach(achievement => {
          const userProgress = progressData[achievement.id];
          const nextTier = findNextTier(achievement, userProgress);
          
          if (nextTier && nextTier.goal > 0) {
              const currentProgressValue = userProgress?.currentProgress || 0;
              const progressRatio = currentProgressValue / nextTier.goal;
              
              if (progressRatio > maxProgressRatio && progressRatio < 1) {
                  maxProgressRatio = progressRatio;
                  closest = {
                      achievement,
                      tier: nextTier,
                      progress: currentProgressValue
                  };
              }
          }
      });
      setPreviewAchievements({ recent, closest });

      await fetchRoutines();
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, [fetchRoutines]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleDeleteRoutine = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this routine? This cannot be undone.")) {
      await deleteCustomWorkout(id);
      fetchRoutines();
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-12 animate-fade-in pb-24">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Link to="/preferences" className="p-3 bg-gray-700/50 rounded-full hover:bg-gray-600 transition-colors" title="Settings & Preferences">
            <CogIcon className="w-6 h-6" />
        </Link>
      </div>

      {stats ? (
        <>
          {/* SECTION 1: The Glance */}
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg">
              <div className="flex flex-col items-center justify-center">
                  <CircularProgressBar progress={workoutsThisWeek} goal={3} />
                  <p className="mt-4 text-center text-gray-300 max-w-xs">
                      {workoutsThisWeek < 3 ? "Keep the streak alive!" : "Great job!"}
                  </p>
              </div>
          </div>
          
          {/* SECTION 2: The Check-In */}
          <div className="space-y-12">
            <ActivityOverview />

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-3xl font-bold">Achievements</h2>
                    <button onClick={() => setShowAllAchievements(!showAllAchievements)} className="text-sm font-semibold text-orange-400 hover:text-orange-300">
                        {showAllAchievements ? '← Back to Summary' : 'View All Achievements →'}
                    </button>
                </div>
                {showAllAchievements ? (
                    <div className="space-y-6 animate-fade-in">
                        {achievements.map(achievement => (
                            <div key={achievement.id} className="bg-gray-800/50 rounded-xl p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <achievement.icon className="w-8 h-8 text-orange-400" />
                                    <h3 className="text-xl font-bold">{achievement.title}</h3>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-6 border-t border-gray-700 pt-4">
                                    {achievement.tiers.map(tier => (
                                        <AchievementBadge key={tier.tier} achievement={achievement} tier={tier} userProgress={achievementProgress[achievement.id]} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-semibold text-gray-400 text-sm mb-2">Closest to Unlocking</h4>
                                {previewAchievements.closest ? (
                                    <AchievementPreviewCard 
                                        icon={previewAchievements.closest.achievement.icon}
                                        title={previewAchievements.closest.tier.name}
                                        description={previewAchievements.closest.tier.description}
                                        progress={previewAchievements.closest.progress}
                                        goal={previewAchievements.closest.tier.goal}
                                    />
                                ) : (
                                    <div className="text-center py-4 px-2 bg-gray-700/30 rounded-lg h-full flex items-center justify-center">
                                        <p className="text-sm text-gray-400">Keep working out to find your next challenge!</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-400 text-sm mb-2">Recently Unlocked</h4>
                                <div className="space-y-3">
                                    {previewAchievements.recent.length > 0 ? (
                                        previewAchievements.recent.map(ach => 
                                            <AchievementPreviewCard 
                                                key={ach.id}
                                                icon={ach.icon}
                                                title={ach.name}
                                                description={ach.achievementTitle}
                                            />)
                                    ) : (
                                        <div className="text-center py-4 px-2 bg-gray-700/30 rounded-lg">
                                            <p className="text-sm text-gray-400">Your first achievement is waiting!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>
          
          {/* SECTION 3: The Utility Drawer */}
          <div className="space-y-12">
            <div>
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-3xl font-bold">My Saved Routines</h2>
                  <Link to="/manual-builder" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-transform transform hover:scale-105">
                      <PlusIcon className="w-5 h-5"/> Create New Routine
                  </Link>
              </div>
              {routines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {routines.slice(-3).reverse().map(routine => (
                    <SavedRoutineCard
                      key={routine.id}
                      routine={routine}
                      onStart={() => navigate('/session', { state: { workout: routine } })}
                      onDelete={() => handleDeleteRoutine(routine.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center p-10 bg-gray-800/50 rounded-lg">
                  <p className="font-semibold text-white">No Saved Routines Yet</p>
                  <p className="text-gray-400 mt-1">Create one from scratch or save a generated workout.</p>
                </div>
              )}
            </div>

            <div>
                <Link to="/exercises" className="block bg-gray-800 hover:bg-gray-700/80 p-6 rounded-2xl shadow-lg transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500 rounded-full">
                            <BookOpenIcon className="w-6 h-6 text-white"/>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Exercise Library</h3>
                            <p className="text-gray-400">Browse Over {EXERCISE_DATABASE.length} Exercises</p>
                        </div>
                        <span className="ml-auto text-indigo-400 group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </div>
                </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center p-10 bg-gray-800/50 rounded-lg">
          <UserIcon className="w-12 h-12 mx-auto text-gray-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
          <p>Complete a workout session to see your dashboard here.</p>
        </div>
      )}

      <style>{`
        details > summary::-webkit-details-marker { display: none; }
      `}</style>
    </div>
  );
};

export default Dashboard;
