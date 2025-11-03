import { ExerciseDifficulty, WorkoutGoal, ExerciseEquipment } from '../types';

interface ExerciseSuggestion {
  name: string;
  difficulty: ExerciseDifficulty;
  goals: WorkoutGoal[];
  equipment: ExerciseEquipment;
  purpose: 'warmup' | 'cooldown' | 'main';
}

export const EXERCISE_SUGGESTIONS: ExerciseSuggestion[] = [
  // JUMP ROPE
  // FIX: Replaced deprecated WorkoutGoal enums with current values.
  { name: 'Basic Bounce', difficulty: 'Easy', goals: [WorkoutGoal.FatLoss, WorkoutGoal.GeneralFitness], equipment: 'rope', purpose: 'main' },
  { name: 'Boxer Step', difficulty: 'Easy', goals: [WorkoutGoal.FatLoss, WorkoutGoal.GeneralFitness], equipment: 'rope', purpose: 'main' },
  { name: 'Alternate Foot Step', difficulty: 'Easy', goals: [WorkoutGoal.FatLoss, WorkoutGoal.GeneralFitness], equipment: 'rope', purpose: 'main' },
  { name: 'High Knees', difficulty: 'Medium', goals: [WorkoutGoal.FatLoss, WorkoutGoal.StrengthPower], equipment: 'rope', purpose: 'main' },
  { name: 'Criss-Cross', difficulty: 'Medium', goals: [WorkoutGoal.GeneralFitness, WorkoutGoal.GeneralFitness], equipment: 'rope', purpose: 'main' },
  { name: 'Side Swing', difficulty: 'Medium', goals: [WorkoutGoal.GeneralFitness, WorkoutGoal.StrengthPower], equipment: 'rope', purpose: 'main' },
  { name: 'Double Under', difficulty: 'Hard', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.FatLoss, WorkoutGoal.GeneralFitness], equipment: 'rope', purpose: 'main' },
  { name: 'Weighted Rope Basic Bounce', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.FatLoss, WorkoutGoal.GeneralFitness], equipment: 'weighted-rope', purpose: 'main'},

  // NO-EQUIPMENT (BODYWEIGHT)
  { name: 'Jumping Jacks', difficulty: 'Easy', goals: [WorkoutGoal.FatLoss, WorkoutGoal.GeneralFitness], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Bodyweight Squats', difficulty: 'Easy', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Lunges', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Push-ups', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Plank', difficulty: 'Easy', goals: [WorkoutGoal.StrengthPower], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Burpees', difficulty: 'Hard', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.FatLoss, WorkoutGoal.GeneralFitness], equipment: 'bodyweight', purpose: 'main' },
  
  // DUMBBELL
  { name: 'Dumbbell Rows', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'dumbbell', purpose: 'main' },
  { name: 'Goblet Squats', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'dumbbell', purpose: 'main' },
  { name: 'Bicep Curls', difficulty: 'Easy', goals: [WorkoutGoal.StrengthPower], equipment: 'dumbbell', purpose: 'main' },
  { name: 'Shoulder Press', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'dumbbell', purpose: 'main' },

  // RESISTANCE BAND
  { name: 'Banded Row', difficulty: 'Easy', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'resistance-band', purpose: 'main' },
  { name: 'Banded Squat', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'resistance-band', purpose: 'main' },
  { name: 'Band Pull-Apart', difficulty: 'Easy', goals: [WorkoutGoal.StrengthPower], equipment: 'resistance-band', purpose: 'main' },
  { name: 'Banded Glute Bridge', difficulty: 'Easy', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'resistance-band', purpose: 'main' },
  { name: 'Banded Bicep Curl', difficulty: 'Easy', goals: [WorkoutGoal.StrengthPower], equipment: 'resistance-band', purpose: 'main' },
  { name: 'Banded Tricep Extension', difficulty: 'Easy', goals: [WorkoutGoal.StrengthPower], equipment: 'resistance-band', purpose: 'main' },
  { name: 'Banded Lateral Walk', difficulty: 'Medium', goals: [WorkoutGoal.GeneralFitness, WorkoutGoal.StrengthPower], equipment: 'resistance-band', purpose: 'main' },
  { name: 'Banded Chest Press', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'resistance-band', purpose: 'main' },
  { name: 'Banded Overhead Press', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'resistance-band', purpose: 'main' },
  { name: 'Pallof Press', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower], equipment: 'resistance-band', purpose: 'main' },

  // KETTLEBELL
  { name: 'Kettlebell Swings', difficulty: 'Hard', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.FatLoss, WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'kettlebell', purpose: 'main' },
  { name: 'Kettlebell Goblet Squat', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'kettlebell', purpose: 'main' },
  
  // BARBELL (GYM)
  { name: 'Barbell Squats', difficulty: 'Hard', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'barbell', purpose: 'main' },
  { name: 'Barbell Deadlifts', difficulty: 'Hard', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'barbell', purpose: 'main' },
  { name: 'Barbell Bench Press', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower], equipment: 'barbell', purpose: 'main' },

  // CABLE MACHINE (GYM)
  { name: 'Cable Rows', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'cable-machine', purpose: 'main' },
  { name: 'Tricep Pushdowns', difficulty: 'Easy', goals: [WorkoutGoal.StrengthPower], equipment: 'cable-machine', purpose: 'main' },
  
  // OTHER MACHINES (GYM)
  { name: 'Leg Press', difficulty: 'Medium', goals: [WorkoutGoal.StrengthPower, WorkoutGoal.GeneralFitness], equipment: 'leg-press-machine', purpose: 'main' },

  // WARM-UP
  { name: 'Arm Circles (Forward & Backward)', difficulty: 'Easy', goals: [], equipment: 'bodyweight', purpose: 'warmup' },
  { name: 'Torso Twists', difficulty: 'Easy', goals: [], equipment: 'bodyweight', purpose: 'warmup' },
  { name: 'Leg Swings (Forward & Side)', difficulty: 'Easy', goals: [], equipment: 'bodyweight', purpose: 'warmup' },
  { name: 'Butt Kicks', difficulty: 'Easy', goals: [], equipment: 'bodyweight', purpose: 'warmup' },
  { name: 'Light Jog in Place', difficulty: 'Easy', goals: [], equipment: 'bodyweight', purpose: 'warmup' },
  
  // COOL-DOWN
  { name: 'Quad Stretch', difficulty: 'Easy', goals: [], equipment: 'bodyweight', purpose: 'cooldown' },
  { name: 'Hamstring Stretch', difficulty: 'Easy', goals: [], equipment: 'bodyweight', purpose: 'cooldown' },
  { name: 'Calf Stretch', difficulty: 'Easy', goals: [], equipment: 'bodyweight', purpose: 'cooldown' },
  { name: 'Chest Stretch', difficulty: 'Easy', goals: [], equipment: 'bodyweight', purpose: 'cooldown' },
  { name: 'Triceps Stretch', difficulty: 'Easy', goals: [], equipment: 'bodyweight', purpose: 'cooldown' },
];