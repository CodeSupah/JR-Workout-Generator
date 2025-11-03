import React from 'react';
import { Achievement, UserAchievementProgress, UnlockedAchievementInfo, AchievementTier } from '../types';
import { getWorkoutStats } from './workoutService';
import { DumbbellIcon, ClockIcon, FlameIcon, SaveIcon, MedalIcon } from '../components/icons/Icons';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'workout-volume',
    category: 'Volume',
    title: 'Workout Volume',
    icon: DumbbellIcon,
    tiers: [
      { tier: 1, name: 'Workout Starter', description: 'Complete your first workout.', goal: 1 },
      { tier: 2, name: 'Five Finisher', description: 'Complete 5 workouts.', goal: 5 },
      { tier: 3, name: 'Ten Timer', description: 'Complete 10 workouts.', goal: 10 },
      { tier: 4, name: 'Reps Specialist', description: 'Complete 25 workouts.', goal: 25 },
      { tier: 5, name: 'Half-Century Hitter', description: 'Complete 50 workouts.', goal: 50 },
      { tier: 6, name: 'The Centurion', description: 'Complete 100 workouts.', goal: 100 },
      { tier: 7, name: 'Silver Centurion', description: 'Complete 250 workouts.', goal: 250 },
      { tier: 8, name: 'Workout Titan', description: 'Complete 500 workouts.', goal: 500 },
    ]
  },
  {
    id: 'workout-duration',
    category: 'Duration',
    title: 'Total Time',
    icon: ClockIcon,
    tiers: [
        { tier: 1, name: 'Minute Mover', description: 'Log 15 total minutes of training.', goal: 15 },
        { tier: 2, name: 'Half-Hour Hustler', description: 'Log 30 total minutes of training.', goal: 30 },
        { tier: 3, name: 'Hour Hoarder', description: 'Log 1 hour (60 minutes) of training time.', goal: 60 },
        { tier: 4, name: 'Endurance Builder', description: 'Log 5 hours (300 minutes) of training.', goal: 300 },
        { tier: 5, name: 'Time Titan', description: 'Log 10 hours (600 minutes) of training.', goal: 600 },
        { tier: 6, name: 'Endurance Engine', description: 'Log 25 hours (1500 minutes) of training.', goal: 1500 },
        { tier: 7, name: 'Marathoner', description: 'Log 50 hours (3000 minutes) of training.', goal: 3000 },
    ]
  },
  {
    id: 'workout-streak',
    category: 'Streak',
    title: 'Workout Streak',
    icon: FlameIcon,
    tiers: [
        { tier: 1, name: 'Streak Starter', description: 'Complete a workout for 3 consecutive days.', goal: 3 },
        { tier: 2, name: 'Weekly Warrior', description: 'Complete a workout for 7 consecutive days.', goal: 7 },
        { tier: 3, name: 'Two Week Triumph', description: 'Complete a workout for 14 consecutive days.', goal: 14 },
        { tier: 4, name: 'Monthly Milestone', description: 'Complete a workout for 30 consecutive days.', goal: 30 },
        { tier: 5, name: 'Sixty Day Soldier', description: 'Complete a workout for 60 consecutive days.', goal: 60 },
        { tier: 6, name: 'The 90 Day Club', description: 'Complete a workout for 90 consecutive days.', goal: 90 },
    ]
  },
  {
    id: 'custom-routines',
    category: 'Customization',
    title: 'Custom Routines',
    icon: SaveIcon,
    tiers: [
      { tier: 1, name: 'Routine Crafter', description: 'Create your first custom routine.', goal: 1 },
      { tier: 2, name: 'Workout Architect', description: 'Create 3 custom routines.', goal: 3 },
      { tier: 3, name: 'Personal Planner', description: 'Create 5 custom routines.', goal: 5 },
    ]
  },
];

const ACHIEVEMENT_PROGRESS_KEY = 'jump-achievements';

export const getAchievements = (): Achievement[] => {
    return ACHIEVEMENTS;
}

export const getUserAchievementProgress = (): Promise<UserAchievementProgress> => {
  return new Promise((resolve) => {
    try {
      const stored = localStorage.getItem(ACHIEVEMENT_PROGRESS_KEY);
      resolve(stored ? JSON.parse(stored) : {});
    } catch (e) {
      console.error("Failed to parse achievement progress from localStorage", e);
      resolve({});
    }
  });
};

const saveUserAchievementProgress = (progress: UserAchievementProgress): Promise<void> => {
  return new Promise((resolve) => {
    localStorage.setItem(ACHIEVEMENT_PROGRESS_KEY, JSON.stringify(progress));
    resolve();
  });
};

export const checkAndUnlockAchievements = async (): Promise<UnlockedAchievementInfo[]> => {
  const stats = await getWorkoutStats();
  const progress = await getUserAchievementProgress();
  const newlyUnlocked: UnlockedAchievementInfo[] = [];
  const now = new Date().toISOString();

  for (const achievement of ACHIEVEMENTS) {
    // Initialize progress if it doesn't exist
    if (!progress[achievement.id]) {
      progress[achievement.id] = { currentProgress: 0, unlockedTiers: [] };
    }
    
    const userAchievement = progress[achievement.id];
    let statValue = 0;

    switch(achievement.category) {
        case 'Volume': statValue = stats.totalWorkouts; break;
        case 'Duration': statValue = stats.totalMinutes; break;
        case 'Streak': statValue = stats.currentStreak; break;
        case 'Customization': statValue = stats.customWorkouts; break;
    }
    
    userAchievement.currentProgress = statValue;

    for (const tier of achievement.tiers) {
        const isUnlocked = statValue >= tier.goal;
        const isAlreadyRecorded = userAchievement.unlockedTiers.some(ut => ut.tier === tier.tier);

        if (isUnlocked && !isAlreadyRecorded) {
            userAchievement.unlockedTiers.push({ tier: tier.tier, unlockedAt: now });
            newlyUnlocked.push({ ...tier, icon: achievement.icon });
        }
    }
  }

  await saveUserAchievementProgress(progress);
  return newlyUnlocked;
};

export const getNextChallenge = async (): Promise<{ achievement: Achievement, tier: AchievementTier } | null> => {
    const progress = await getUserAchievementProgress();
    const stats = await getWorkoutStats();
    let nextChallenge = null;
    let maxProgressRatio = -1;

    for (const achievement of ACHIEVEMENTS) {
        const userAchievement = progress[achievement.id] || { currentProgress: 0, unlockedTiers: [] };
        let statValue = 0;
        switch(achievement.category) {
            case 'Volume': statValue = stats.totalWorkouts; break;
            case 'Duration': statValue = stats.totalMinutes; break;
            case 'Streak': statValue = stats.currentStreak; break;
            case 'Customization': statValue = stats.customWorkouts; break;
        }

        for (const tier of achievement.tiers) {
            const isUnlocked = userAchievement.unlockedTiers.some(ut => ut.tier === tier.tier);
            if (!isUnlocked) {
                if (tier.goal > 0) {
                    const progressRatio = statValue / tier.goal;
                    if (progressRatio > maxProgressRatio) {
                        maxProgressRatio = progressRatio;
                        nextChallenge = { achievement, tier };
                    }
                }
                break; // only consider the next uncompleted tier for each achievement
            }
        }
    }
    return nextChallenge;
};