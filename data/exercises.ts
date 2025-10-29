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
  { name: 'Basic Bounce', difficulty: 'Easy', goals: [WorkoutGoal.CardioEndurance, WorkoutGoal.FullBody], equipment: 'rope', purpose: 'main' },
  { name: 'Boxer Step', difficulty: 'Easy', goals: [WorkoutGoal.CardioEndurance, WorkoutGoal.FullBody], equipment: 'rope', purpose: 'main' },
  { name: 'Alternate Foot Step', difficulty: 'Easy', goals: [WorkoutGoal.CardioEndurance, WorkoutGoal.FullBody], equipment: 'rope', purpose: 'main' },
  { name: 'High Knees', difficulty: 'Medium', goals: [WorkoutGoal.CardioEndurance, WorkoutGoal.CoreStrength], equipment: 'rope', purpose: 'main' },
  { name: 'Criss-Cross', difficulty: 'Medium', goals: [WorkoutGoal.Freestyle, WorkoutGoal.FullBody], equipment: 'rope', purpose: 'main' },
  { name: 'Side Swing', difficulty: 'Medium', goals: [WorkoutGoal.Freestyle, WorkoutGoal.CoreStrength], equipment: 'rope', purpose: 'main' },
  { name: 'Double Under', difficulty: 'Hard', goals: [WorkoutGoal.Power, WorkoutGoal.CardioEndurance, WorkoutGoal.Freestyle], equipment: 'rope', purpose: 'main' },
  { name: 'Weighted Rope Basic Bounce', difficulty: 'Medium', goals: [WorkoutGoal.Power, WorkoutGoal.CardioEndurance, WorkoutGoal.FullBody], equipment: 'weighted-rope', purpose: 'main'},

  // NO-EQUIPMENT (BODYWEIGHT)
  { name: 'Jumping Jacks', difficulty: 'Easy', goals: [WorkoutGoal.CardioEndurance, WorkoutGoal.FullBody], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Bodyweight Squats', difficulty: 'Easy', goals: [WorkoutGoal.Power, WorkoutGoal.FullBody], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Lunges', difficulty: 'Medium', goals: [WorkoutGoal.Power, WorkoutGoal.FullBody], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Push-ups', difficulty: 'Medium', goals: [WorkoutGoal.Power, WorkoutGoal.CoreStrength, WorkoutGoal.FullBody], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Plank', difficulty: 'Easy', goals: [WorkoutGoal.CoreStrength], equipment: 'bodyweight', purpose: 'main' },
  { name: 'Burpees', difficulty: 'Hard', goals: [WorkoutGoal.Power, WorkoutGoal.CardioEndurance, WorkoutGoal.FullBody], equipment: 'bodyweight', purpose: 'main' },
  
  // DUMBBELL
  { name: 'Dumbbell Rows', difficulty: 'Medium', goals: [WorkoutGoal.Power, WorkoutGoal.FullBody], equipment: 'dumbbell', purpose: 'main' },
  { name: 'Goblet Squats', difficulty: 'Medium', goals: [WorkoutGoal.Power, WorkoutGoal.FullBody], equipment: 'dumbbell', purpose: 'main' },
  { name: 'Bicep Curls', difficulty: 'Easy', goals: [WorkoutGoal.Power], equipment: 'dumbbell', purpose: 'main' },
  { name: 'Shoulder Press', difficulty: 'Medium', goals: [WorkoutGoal.Power, WorkoutGoal.FullBody], equipment: 'dumbbell', purpose: 'main' },

  // RESISTANCE BAND
  { name: 'Resistance Band Rows', difficulty: 'Easy', goals: [WorkoutGoal.Power, WorkoutGoal.FullBody], equipment: 'resistance-band', purpose: 'main' },
  { name: 'Resistance Band Squats', difficulty: 'Medium', goals: [WorkoutGoal.Power, WorkoutGoal.FullBody], equipment: 'resistance-band', purpose: 'main' },
  { name: 'Band Pull-Aparts', difficulty: 'Easy', goals: [WorkoutGoal.Power], equipment: 'resistance-band', purpose: 'main' },

  // KETTLEBELL
  { name: 'Kettlebell Swings', difficulty: 'Hard', goals: [WorkoutGoal.Power, WorkoutGoal.CardioEndurance, WorkoutGoal.CoreStrength, WorkoutGoal.FullBody], equipment: 'kettlebell', purpose: 'main' },
  { name: 'Kettlebell Goblet Squat', difficulty: 'Medium', goals: [WorkoutGoal.Power, WorkoutGoal.FullBody], equipment: 'kettlebell', purpose: 'main' },
  
  // BARBELL (GYM)
  { name: 'Barbell Squats', difficulty: 'Hard', goals: [WorkoutGoal.Power, WorkoutGoal.FullBody], equipment: 'barbell', purpose: 'main' },
  { name: 'Barbell Deadlifts', difficulty: 'Hard', goals: [WorkoutGoal.Power, WorkoutGoal.FullBody], equipment: 'barbell', purpose: 'main' },
  { name: 'Barbell Bench Press', difficulty: 'Medium', goals: [WorkoutGoal.Power], equipment: 'barbell', purpose: 'main' },

  // CABLE MACHINE (GYM)
  { name: 'Cable Rows', difficulty: 'Medium', goals: [WorkoutGoal.Power, WorkoutGoal.FullBody], equipment: 'cable-machine', purpose: 'main' },
  { name: 'Tricep Pushdowns', difficulty: 'Easy', goals: [WorkoutGoal.Power], equipment: 'cable-machine', purpose: 'main' },
  
  // OTHER MACHINES (GYM)
  { name: 'Leg Press', difficulty: 'Medium', goals: [WorkoutGoal.Power, WorkoutGoal.FullBody], equipment: 'leg-press-machine', purpose: 'main' },

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