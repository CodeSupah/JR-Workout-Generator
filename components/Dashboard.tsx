import React, { useState, useEffect } from 'react';
import { WorkoutStats } from '../types';
import { getWorkoutStats } from '../services/workoutService';
import StatsChart from './StatsChart';
import { FlameIcon, ChartBarIcon, ClockIcon, TrophyIcon, SparklesIcon } from './icons/Icons';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getWorkoutStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="text-center p-10">No workout data found. Complete a session to see your stats!</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard icon={<ChartBarIcon className="w-6 h-6 text-white"/>} title="Total Workouts" value={stats.totalWorkouts} color="bg-blue-500" />
          <StatCard icon={<ClockIcon className="w-6 h-6 text-white"/>} title="Total Minutes" value={stats.totalMinutes} color="bg-green-500" />
          <StatCard icon={<FlameIcon className="w-6 h-6 text-white"/>} title="Calories Burned" value={stats.totalCalories.toLocaleString()} color="bg-red-500" />
          <StatCard icon={<FlameIcon className="w-6 h-6 text-white"/>} title="Current Streak" value={`${stats.currentStreak} days`} color="bg-orange-500" />
          <StatCard icon={<SparklesIcon className="w-6 h-6 text-white"/>} title="Custom Workouts" value={stats.customWorkouts} color="bg-purple-500" />
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
    </div>
  );
};

export default Dashboard;
