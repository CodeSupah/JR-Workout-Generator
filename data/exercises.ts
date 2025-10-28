import { ExerciseDifficulty, WorkoutGoal, ExerciseEquipment } from '../types';

interface ExerciseSuggestion {
  name: string;
  difficulty: ExerciseDifficulty;
  goals: WorkoutGoal[];
  equipment: ExerciseEquipment;
}

export const EXERCISE_SUGGESTIONS: ExerciseSuggestion[] = [
  // JUMP ROPE
  { name: 'Basic Bounce', difficulty: 'Easy', goals: [WorkoutGoal.FatBurn, WorkoutGoal.Stamina], equipment: 'rope' },
  { name: 'Boxer Step', difficulty: 'Easy', goals: [WorkoutGoal.Stamina, WorkoutGoal.Footwork], equipment: 'rope' },
  { name: 'Alternate Foot Step', difficulty: 'Easy', goals: [WorkoutGoal.Stamina, WorkoutGoal.Footwork], equipment: 'rope' },
  { name: 'High Knees', difficulty: 'Medium', goals: [WorkoutGoal.FatBurn, WorkoutGoal.Stamina], equipment: 'rope' },
  { name: 'Criss-Cross', difficulty: 'Medium', goals: [WorkoutGoal.Footwork, WorkoutGoal.Freestyle], equipment: 'rope' },
  { name: 'Side Swing', difficulty: 'Medium', goals: [WorkoutGoal.Freestyle, WorkoutGoal.Footwork], equipment: 'rope' },
  { name: 'Double Under', difficulty: 'Hard', goals: [WorkoutGoal.FatBurn, WorkoutGoal.Stamina, WorkoutGoal.Freestyle], equipment: 'rope' },
  { name: 'Weighted Rope Basic Bounce', difficulty: 'Medium', goals: [WorkoutGoal.Strength, WorkoutGoal.FatBurn], equipment: 'weighted-rope'},

  // NO-EQUIPMENT (BODYWEIGHT)
  { name: 'Jumping Jacks', difficulty: 'Easy', goals: [WorkoutGoal.FatBurn, WorkoutGoal.Stamina], equipment: 'bodyweight' },
  { name: 'Bodyweight Squats', difficulty: 'Easy', goals: [WorkoutGoal.Strength], equipment: 'bodyweight' },
  { name: 'Lunges', difficulty: 'Medium', goals: [WorkoutGoal.Strength], equipment: 'bodyweight' },
  { name: 'Push-ups', difficulty: 'Medium', goals: [WorkoutGoal.Strength], equipment: 'bodyweight' },
  { name: 'Plank', difficulty: 'Easy', goals: [WorkoutGoal.Strength], equipment: 'bodyweight' },
  { name: 'Burpees', difficulty: 'Hard', goals: [WorkoutGoal.FatBurn, WorkoutGoal.Strength], equipment: 'bodyweight' },
  
  // DUMBBELL
  { name: 'Dumbbell Rows', difficulty: 'Medium', goals: [WorkoutGoal.Strength], equipment: 'dumbbell' },
  { name: 'Goblet Squats', difficulty: 'Medium', goals: [WorkoutGoal.Strength], equipment: 'dumbbell' },
  { name: 'Bicep Curls', difficulty: 'Easy', goals: [WorkoutGoal.Strength], equipment: 'dumbbell' },
  { name: 'Shoulder Press', difficulty: 'Medium', goals: [WorkoutGoal.Strength], equipment: 'dumbbell' },

  // RESISTANCE BAND
  { name: 'Resistance Band Rows', difficulty: 'Easy', goals: [WorkoutGoal.Strength], equipment: 'resistance-band' },
  { name: 'Resistance Band Squats', difficulty: 'Medium', goals: [WorkoutGoal.Strength], equipment: 'resistance-band' },
  { name: 'Band Pull-Aparts', difficulty: 'Easy', goals: [WorkoutGoal.Strength], equipment: 'resistance-band' },

  // KETTLEBELL
  { name: 'Kettlebell Swings', difficulty: 'Hard', goals: [WorkoutGoal.Strength, WorkoutGoal.FatBurn], equipment: 'kettlebell' },
  { name: 'Kettlebell Goblet Squat', difficulty: 'Medium', goals: [WorkoutGoal.Strength], equipment: 'kettlebell' },
  
  // BARBELL (GYM)
  { name: 'Barbell Squats', difficulty: 'Hard', goals: [WorkoutGoal.Strength], equipment: 'barbell' },
  { name: 'Barbell Deadlifts', difficulty: 'Hard', goals: [WorkoutGoal.Strength], equipment: 'barbell' },
  { name: 'Barbell Bench Press', difficulty: 'Medium', goals: [WorkoutGoal.Strength], equipment: 'barbell' },

  // CABLE MACHINE (GYM)
  { name: 'Cable Rows', difficulty: 'Medium', goals: [WorkoutGoal.Strength], equipment: 'cable-machine' },
  { name: 'Tricep Pushdowns', difficulty: 'Easy', goals: [WorkoutGoal.Strength], equipment: 'cable-machine' },
  
  // OTHER MACHINES (GYM)
  { name: 'Leg Press', difficulty: 'Medium', goals: [WorkoutGoal.Strength], equipment: 'leg-press-machine' },

];