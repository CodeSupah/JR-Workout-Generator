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
  { name: 'Basic Bounce', difficulty: 'Easy', goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody], equipment: 'jump-rope', purpose: 'main' },
  { name: 'Boxer Step', difficulty: 'Easy', goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody], equipment: 'jump-rope', purpose: 'main' },
  { name: 'Alternate Foot Step', difficulty: 'Easy', goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody], equipment: 'jump-rope', purpose: 'main' },
  { name: 'High Knees', difficulty: 'Medium', goals: [WorkoutGoal.Cardio, WorkoutGoal.Strength], equipment: 'jump-rope', purpose: 'main' },
  { name: 'Criss-Cross', difficulty: 'Medium', goals: [WorkoutGoal.FullBody], equipment: 'jump-rope', purpose: 'main' },
  { name: 'Side Swing', difficulty: 'Medium', goals: [WorkoutGoal.FullBody, WorkoutGoal.Core], equipment: 'jump-rope', purpose: 'main' },
  { name: 'Double Under', difficulty: 'Hard', goals: [WorkoutGoal.Strength, WorkoutGoal.Cardio, WorkoutGoal.FullBody], equipment: 'jump-rope', purpose: 'main' },
  { name: 'Weighted Rope Basic Bounce', difficulty: 'Medium', goals: [WorkoutGoal.Strength, WorkoutGoal.Cardio, WorkoutGoal.FullBody], equipment: 'jump-rope', purpose: 'main'},

  // NO-EQUIPMENT (BODYWEIGHT)
  { name: 'Jumping Jacks', difficulty: 'Easy', goals: [WorkoutGoal.Cardio, WorkoutGoal.FullBody], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Bodyweight Squats', difficulty: 'Easy', goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Lunges', difficulty: 'Medium', goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Push-ups', difficulty: 'Medium', goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Plank', difficulty: 'Easy', goals: [WorkoutGoal.Core, WorkoutGoal.Strength], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Burpees', difficulty: 'Hard', goals: [WorkoutGoal.Strength, WorkoutGoal.Cardio, WorkoutGoal.FullBody], equipment: 'bodyweight', purpose: 'main' },
  
  // DUMBBELL
  { name: 'Dumbbell Rows', difficulty: 'Medium', goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody], equipment: 'dumbbell', purpose: 'main' },
  { name: 'Goblet Squats', difficulty: 'Medium', goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody], equipment: 'dumbbell', purpose: 'main' },
  { name: 'Bicep Curls', difficulty: 'Easy', goals: [WorkoutGoal.Strength], equipment: 'dumbbell', purpose: 'main' },
  { name: 'Shoulder Press', difficulty: 'Medium', goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody], equipment: 'dumbbell', purpose: 'main' },

  // RESISTANCE BAND
  { name: 'Banded Row', difficulty: 'Easy', goals: [WorkoutGoal.Strength], equipment: 'gym-equipment', purpose: 'main' },
  { name: 'Banded Squat', difficulty: 'Medium', goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody], equipment: 'gym-equipment', purpose: 'main' },
  { name: 'Band Pull-Apart', difficulty: 'Easy', goals: [WorkoutGoal.Strength, WorkoutGoal.Mobility], equipment: 'gym-equipment', purpose: 'main' },
  { name: 'Banded Glute Bridge', difficulty: 'Easy', goals: [WorkoutGoal.Strength, WorkoutGoal.Core], equipment: 'gym-equipment', purpose: 'main' },
  { name: 'Banded Bicep Curl', difficulty: 'Easy', goals: [WorkoutGoal.Strength], equipment: 'gym-equipment', purpose: 'main' },
  { name: 'Banded Tricep Extension', difficulty: 'Easy', goals: [WorkoutGoal.Strength], equipment: 'gym-equipment', purpose: 'main' },
  { name: 'Banded Lateral Walk', difficulty: 'Medium', goals: [WorkoutGoal.FullBody, WorkoutGoal.Strength], equipment: 'gym-equipment', purpose: 'main' },
  { name: 'Banded Chest Press', difficulty: 'Medium', goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody], equipment: 'gym-equipment', purpose: 'main' },
  { name: 'Banded Overhead Press', difficulty: 'Medium', goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody], equipment: 'gym-equipment', purpose: 'main' },
  { name: 'Pallof Press', difficulty: 'Medium', goals: [WorkoutGoal.Core, WorkoutGoal.Strength], equipment: 'gym-equipment', purpose: 'main' },

  // KETTLEBELL
  { name: 'Kettlebell Swings', difficulty: 'Hard', goals: [WorkoutGoal.Strength, WorkoutGoal.Cardio, WorkoutGoal.FullBody], equipment: 'gym-equipment', purpose: 'main' },
  { name: 'Kettlebell Goblet Squat', difficulty: 'Medium', goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody], equipment: 'gym-equipment', purpose: 'main' },
  
  // BARBELL (GYM)
  { name: 'Barbell Squats', difficulty: 'Hard', goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody], equipment: 'gym-equipment', purpose: 'main' },
  { name: 'Barbell Deadlifts', difficulty: 'Hard', goals: [WorkoutGoal.Strength, WorkoutGoal.FullBody], equipment: 'gym-equipment', purpose: 'main' },
  { name: 'Barbell Bench Press', difficulty: 'Medium', goals: [WorkoutGoal.Strength], equipment: 'gym-equipment', purpose: 'main' },

  // CABLE MACHINE (GYM)
  { name: 'Cable Rows', difficulty: 'Medium', goals: [WorkoutGoal.Strength], equipment: 'gym-equipment', purpose: 'main' },
  { name: 'Tricep Pushdowns', difficulty: 'Easy', goals: [WorkoutGoal.Strength], equipment: 'gym-equipment', purpose: 'main' },
  
  // OTHER MACHINES (GYM)
  { name: 'Leg Press', difficulty: 'Medium', goals: [WorkoutGoal.Strength], equipment: 'gym-equipment', purpose: 'main' },

  // WARM-UP
  { name: 'Arm Circles (Forward & Backward)', difficulty: 'Easy', goals: [WorkoutGoal.Mobility], equipment: 'bodyweight', purpose: 'warmup' },
  { name: 'Torso Twists', difficulty: 'Easy', goals: [WorkoutGoal.Mobility], equipment: 'bodyweight', purpose: 'warmup' },
  { name: 'Leg Swings (Forward & Side)', difficulty: 'Easy', goals: [WorkoutGoal.Mobility], equipment: 'bodyweight', purpose: 'warmup' },
  { name: 'Butt Kicks', difficulty: 'Easy', goals: [WorkoutGoal.Mobility], equipment: 'bodyweight', purpose: 'warmup' },
  { name: 'Light Jog in Place', difficulty: 'Easy', goals: [WorkoutGoal.Mobility], equipment: 'bodyweight', purpose: 'warmup' },
  
  // COOL-DOWN
  { name: 'Quad Stretch', difficulty: 'Easy', goals: [WorkoutGoal.Mobility], equipment: 'bodyweight', purpose: 'cooldown' },
  { name: 'Hamstring Stretch', difficulty: 'Easy', goals: [WorkoutGoal.Mobility], equipment: 'bodyweight', purpose: 'cooldown' },
  { name: 'Calf Stretch', difficulty: 'Easy', goals: [WorkoutGoal.Mobility], equipment: 'bodyweight', purpose: 'cooldown' },
  { name: 'Chest Stretch', difficulty: 'Easy', goals: [WorkoutGoal.Mobility], equipment: 'bodyweight', purpose: 'cooldown' },
  { name: 'Triceps Stretch', difficulty: 'Easy', goals: [WorkoutGoal.Mobility], equipment: 'bodyweight', purpose: 'cooldown' },
];