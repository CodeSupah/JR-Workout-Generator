export enum SkillLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export enum WorkoutGoal {
  FatBurn = 'Fat Burn',
  Stamina = 'Stamina',
  Footwork = 'Footwork',
  Strength = 'Strength',
  Freestyle = 'Freestyle',
}

export enum Equipment {
  Regular = 'Regular Rope',
  Weighted = 'Weighted Rope',
  Speed = 'Speed Rope',
}

export interface WorkoutPreferences {
  duration: number;
  skillLevel: SkillLevel;
  goal: WorkoutGoal;
  equipment: Equipment[]; // Can select multiple ropes
  mode: WorkoutMode;
  includeJumpRopeIntervals: boolean;
  rounds: number;
  availableEquipment: string[];
  includeWarmUp: boolean;
  warmUpDuration: number;
}

export type ExerciseDifficulty = 'Easy' | 'Medium' | 'Hard';

export type ExerciseEquipment = 'bodyweight' | 'rope' | 'weighted-rope' | 'dumbbell' | 'resistance-band' | 'kettlebell' | 'barbell' | 'cable-machine' | 'leg-press-machine';

export type WorkoutMode = 'jump-rope' | 'equipment' | 'no-equipment';


export interface Exercise {
  id: string;
  exercise: string;
  duration: number; // in seconds
  rest: number; // in seconds
  difficulty: ExerciseDifficulty;
  equipment: ExerciseEquipment;
  notes?: string;
  status?: 'pending' | 'completed' | 'skipped';
}

export interface WorkoutPlan {
  id: string;
  name?: string;
  mode: WorkoutMode;
  warmUp: string[];
  warmUpDuration: number;
  rounds: Exercise[];
  coolDown: string[];
  estimatedCalories: number;
  difficultyScore: number;
  motivationalQuote: string;
  exercisesPerRound: number;
  numberOfRounds: number;
}

export interface SessionSummary {
  id: string;
  date: string; // ISO string
  workoutName: string;
  totalTime: number; // actual time spent in seconds
  completedRounds: number;
  skippedRounds: number;
  totalCalories: number;
  planId: string;
  workoutPlan: WorkoutPlan;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  currentStreak: number;
  customWorkouts: number;
  personalBests: {
    quickest1MinCount: number;
    longestCombo: string;
  };
  weeklySummary: {
    name: string; // Changed from day to name
    minutes: number;
  }[];
}