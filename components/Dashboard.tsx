import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkoutStats, WorkoutPlan, Achievement, UserAchievementProgress } from '../types';
import { getWorkoutStats, loadCustomWorkouts, deleteCustomWorkout } from '../services/workoutService';
import { getAchievements, getUserAchievementProgress } from '../services/achievementService';
import StatsChart from './StatsChart';
import SavedRoutineCard from './SavedRoutineCard';
import AchievementBadge from './AchievementBadge';
import { FlameIcon, ChartBarIcon, ClockIcon, TrophyIcon, SparklesIcon, MedalIcon } from './icons/Icons';

const StatCard: React.FC<{ icon: React.ReactNode, title: string, value: string | number, color: string }> = ({ icon, title, value, color }) => (
  <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [routines, setRoutines] = useState<WorkoutPlan[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementProgress, setAchievementProgress] = useState<UserAchievementProgress>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRoutines = async () => {
    const data = await loadCustomWorkouts();
    setRoutines(data);
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [statsData, achievementsData, progressData] = await Promise.all([
            getWorkoutStats(),
            getAchievements(),
            getUserAchievementProgress()
        ]);
        setStats(statsData);
        setAchievements(achievementsData);
        setAchievementProgress(progressData);
        await fetchRoutines();
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleStartRoutine = (routine: WorkoutPlan) => {
    navigate('/session', { state: { workout: routine } });
  };

  const handleDeleteRoutine = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this routine? This cannot be undone.")) {
      await deleteCustomWorkout(id);
      fetchRoutines(); // Refresh the list
    }
  };


  if (loading) {
    return <div className="text-center p-10">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-24">
      {stats ? (
        <>
          <div>
            <h2 className="text-3xl font-bold mb-4">Your Progress</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              <StatCard icon={<ChartBarIcon className="w-6 h-6 text-white"/>} title="Total Workouts" value={stats.totalWorkouts} color="bg-blue-500" />
              <StatCard icon={<ClockIcon className="w-6 h-6 text-white"/>} title="Total Minutes" value={stats.totalMinutes} color="bg-green-500" />
              <StatCard icon={<FlameIcon className="w-6 h-6 text-white"/>} title="Calories Burned" value={stats.totalCalories.toLocaleString()} color="bg-red-500" />
              <StatCard icon={<FlameIcon className="w-6 h-6 text-white"/>} title="Current Streak" value={`${stats.currentStreak} days`} color="bg-orange-500" />
              <StatCard icon={<SparklesIcon className="w-6 h-6 text-white"/>} title="Custom Routines" value={stats.customWorkouts} color="bg-purple-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-white">Weekly Summary</h3>
              <p className="text-gray-400 mb-6">Minutes of activity this week</p>
              <div className="h-72">
                <StatsChart data={stats.weeklySummary} />
              </div>
            </div>
            
            <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-white">Personal Bests</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500 rounded-full">
                    <TrophyIcon className="w-6 h-6 text-white"/>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Quickest 1-min Count</p>
                    <p className="text-gray-400">{stats.personalBests.quickest1MinCount} jumps</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-indigo-500 rounded-full">
                    <TrophyIcon className="w-6 h-6 text-white"/>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Longest Combo</p>
                    <p className="text-gray-400">{stats.personalBests.longestCombo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center p-10 bg-gray-800/50 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Welcome to Jump!</h2>
          <p>Complete a workout session to see your stats here.</p>
        </div>
      )}

       {/* Achievements Section */}
        <div>
            <h2 className="text-3xl font-bold mb-4">Your Achievements</h2>
            <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                {achievements.map(achievement => (
                    <div key={achievement.id} className="mb-6 last:mb-0">
                        <h3 className="flex items-center gap-2 text-xl font-bold mb-3">
                            <achievement.icon className="w-6 h-6 text-orange-400" />
                            {achievement.title}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {achievement.tiers.map(tier => (
                                <AchievementBadge 
                                    key={tier.tier}
                                    achievement={achievement}
                                    tier={tier}
                                    userProgress={achievementProgress[achievement.id]}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

      {/* Saved Routines Section */}
      <div>
        <h2 className="text-3xl font-bold mb-4">My Saved Routines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.length > 0 ? (
            routines.map(routine => (
              <SavedRoutineCard
                key={routine.id}
                routine={routine}
                onStart={() => handleStartRoutine(routine)}
                onDelete={() => handleDeleteRoutine(routine.id)}
              />
            ))
          ) : (
            <div className="md:col-span-2 lg:col-span-3 text-center p-10 bg-gray-800/50 rounded-lg">
              <p className="text-gray-400">You haven't saved any custom routines yet.</p>
              <p className="text-gray-400 mt-1">Generate a workout, customize it, and hit "Save as Routine" to find it here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;