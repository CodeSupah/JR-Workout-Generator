import type { FC } from 'react';

export enum SkillLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export enum WorkoutEnvironment {
  Gym = 'Full Gym / Weights',
  HomeBodyweight = 'Home Bodyweight Only',
  HomeLimited = 'Home Limited Equipment',
}

export enum WorkoutGoal {
    MuscleGain = 'Muscle Gain / Hypertrophy',
    StrengthPower = 'Strength / Power',
    FatLoss = 'Fat Loss / Conditioning',
    GeneralFitness = 'General Fitness / Maintenance',
    RecoveryMobility = 'Recovery / Mobility',
}

export type WorkoutMode = 'jump-rope' | 'equipment' | 'no-equipment';

export interface WorkoutPreferences {
  duration: number;
  skillLevel: SkillLevel;
  goal: WorkoutGoal;
  environment: WorkoutEnvironment;
  homeEquipment: string[];
  rounds: number;
  includeWarmUp: boolean;
  warmUpDuration: number;
  includeCoolDown: boolean;
  coolDownDuration: number;
  defaultRestDuration: number;
  restBetweenRounds: number;
}

export interface EditorWorkoutPreferences {
  universalRestDuration: number;
  keepScreenAwake: boolean;
  defaultSupersetRounds: number;
}

export type ExerciseDifficulty = 'Easy' | 'Medium' | 'Hard';

export type ExerciseEquipment = 'bodyweight' | 'rope' | 'weighted-rope' | 'dumbbell' | 'resistance-band' | 'kettlebell' | 'barbell' | 'cable-machine' | 'leg-press-machine' | 'pull-up-bar';


export interface Exercise {
  id: string;
  exercise: string;
  duration: number; // in seconds. For rep-based, this is a time guideline.
  reps?: number;
  unit?: 'seconds' | 'reps';
  rest: number; // in seconds
  difficulty: ExerciseDifficulty;
  equipment: ExerciseEquipment;
  notes?: string;
  status?: 'pending' | 'completed' | 'skipped';
  // --- Fields for Manual Builder ---
  sets?: number;
  linkedToNext?: boolean;
  groupRounds?: number;
  restAfterGroup?: number;
  // --- Fields for Live Session ---
  currentSet?: number;
  totalSets?: number;
}

export interface WorkoutPlan {
  id: string;
  name?: string;
  mode: WorkoutMode; // Retained for compatibility with old saved workouts
  warmUp: Exercise[];
  warmUpDuration: number;
  rounds: Exercise[]; // For AI generator and flattened manual plans
  coolDown: Exercise[];
  coolDownDuration: number;
  estimatedCalories: number;
  difficultyScore: number;
  motivationalQuote: string;
  exercisesPerRound: number;
  numberOfRounds: number;
  mainWorkout?: Exercise[]; // For structured manual plans
}

export interface PersonalBestRecord<T> {
  value: T;
  date: string | null; // ISO string
  workoutName: string | null;
}

export interface SessionSummary {
  id: string;
  date: string; // ISO string
  workoutName: string;
  totalTime: number; // actual time spent in seconds
  completedExercises: number;
  totalExercises: number;
  skippedRounds: number;
  totalCalories: number;
  planId: string;
  workoutPlan: WorkoutPlan;
  jumpMetrics?: {
    peakJumpsPerMinute: number;
    longestCombo: string;
    longestContinuousJump: number; // in seconds
  };
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  currentStreak: number;
  customWorkouts: number;
  personalBests: {
    quickest1MinCount: PersonalBestRecord<number>;
    longestCombo: PersonalBestRecord<string>;
    longestContinuousJump: PersonalBestRecord<number>;
  };
  weeklySummary: {
    name: string; // Changed from day to name
    minutes: number;
  }[];
}


// --- Achievement System Types ---

export interface AchievementTier {
  tier: number;
  name: string;
  description: string;
  goal: number; // The value to reach (e.g., 10 workouts, 60 minutes)
}

export interface Achievement {
  id: string;
  category: 'Volume' | 'Duration' | 'Streak' | 'Customization';
  title: string;
  icon: FC<{className?: string}>;
  tiers: AchievementTier[];
}

// Represents a user's progress towards a specific achievement
export interface UserAchievement {
  currentProgress: number;
  unlockedTiers: {
    tier: number;
    unlockedAt: string; // ISO date string
  }[];
}

// Represents the entire achievement progress object for a user, stored in localStorage
export interface UserAchievementProgress {
  [achievementId: string]: UserAchievement;
}

// Used for notifications when a new achievement is unlocked
export type UnlockedAchievementInfo = AchievementTier & {
    icon: FC<{className?: string}>;
};

// Used for the dashboard achievement preview
export type UnlockedAchievementInfoWithId = UnlockedAchievementInfo & {
    id: string; // a unique id for react keys, e.g., `${achievementId}-${tier}`
    unlockedAt: string; // ISO date string from UserAchievement
    achievementTitle: string; // The title of the parent achievement, e.g., 'Workout Volume'
};

// --- User Profile Types ---

export type Units = 'Metric' | 'Imperial';

export interface UserProfile {
  name: string;
  email: string;
  joinDate: string; // ISO string
  avatar: string | null; // base64 string
  gender: 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';
  dob: string | null; // YYYY-MM-DD format
  height: number; // Always stored in cm
  weight: number; // Always stored in kg
  primaryGoal: WorkoutGoal;
  preferences: {
    units: Units;
    sound: {
      voiceCues: boolean;
      voiceVolume: number; // 0 to 1
      effects: boolean;
      effectsVolume: number; // 0 to 1
    };
    notifications: {
      reminders: boolean;
      achievements: boolean;
      challenges: boolean;
    };
    adaptiveDifficulty: boolean;
  };
}

// --- Exercise Database Types ---
export type WorkoutType = 'Compound' | 'Isolation' | 'Cardio/HIIT' | 'Mobility/Stretch' | 'Core/Accessory';

export interface ExerciseDetails {
  id: string;
  name: string;
  category: 'Jump Rope' | 'Upper Body' | 'Lower Body' | 'Core' | 'Full Body' | 'Cardio' | 'Flexibility & Mobility';
  purpose: 'warmup' | 'cooldown' | 'main';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: ExerciseEquipment;
  workoutType: WorkoutType;
  description: string;
  instructions: string[];
  muscleGroups: string[];
  videoUrl?: string;
  keywords?: string[];
}