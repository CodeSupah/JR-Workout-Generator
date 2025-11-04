import { GoogleGenAI, Type } from '@google/genai';
import { WorkoutPreferences, WorkoutPlan, Exercise, WorkoutEnvironment, ExerciseDifficulty, WorkoutGoal, SkillLevel, ExerciseEquipment } from '../types';
import { EXERCISE_DATABASE } from '../data/exerciseDatabase';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const exerciseSchema = {
    type: Type.OBJECT,
    properties: {
      exercise: { type: Type.STRING, description: 'Name of the exercise.' },
      duration: { type: Type.INTEGER, description: 'Duration of the exercise in seconds.' },
      rest: { type: Type.INTEGER, description: 'Duration of the rest period in seconds. For warm-up and cool-down exercises, this MUST be 0.' },
      difficulty: { type: Type.STRING, description: "Difficulty of this specific exercise: 'Easy', 'Medium', or 'Hard'."},
      equipment: { type: Type.STRING, description: "Equipment needed for the exercise, must be one of: 'bodyweight', 'rope', 'weighted-rope', 'dumbbell', 'resistance-band', 'kettlebell', 'barbell', 'cable-machine', 'leg-press-machine'. For warm-ups and cool-downs, this is typically 'bodyweight'."}
    },
    required: ['exercise', 'duration', 'rest', 'difficulty', 'equipment'],
};

const workoutSchema = {
  type: Type.OBJECT,
  properties: {
    warmUp: {
      type: Type.ARRAY,
      items: exerciseSchema,
      description: 'A list of warm-up exercises. The total duration of all exercises in this array MUST equal the warmUpDuration in minutes * 60. This array MUST be empty if the user preference "includeWarmUp" is false.',
    },
    rounds: {
      type: Type.ARRAY,
      items: exerciseSchema,
      description: 'An array of workout rounds representing a single circuit.',
    },
    coolDown: {
      type: Type.ARRAY,
      items: exerciseSchema,
      description: 'A list of cool-down exercises. The total duration of all exercises in this array MUST equal the coolDownDuration in minutes * 60. This array MUST be empty if the user preference "includeCoolDown" is false.',
    },
    estimatedCalories: {
      type: Type.INTEGER,
      description: 'An estimated number of calories burned during the workout.',
    },
    difficultyScore: {
      type: Type.INTEGER,
      description: 'A difficulty score from 1 (easiest) to 10 (hardest).',
    },
    motivationalQuote: {
      type: Type.STRING,
      description: 'A short, fun, and motivating quote for the user.',
    },
  },
  required: ['warmUp', 'rounds', 'coolDown', 'estimatedCalories', 'difficultyScore', 'motivationalQuote'],
};


export const generateWorkoutPlan = async (prefs: WorkoutPreferences): Promise<WorkoutPlan> => {
  const warmUpMinutes = prefs.includeWarmUp ? prefs.warmUpDuration : 0;
  const coolDownMinutes = prefs.includeCoolDown ? prefs.coolDownDuration : 0;
  const targetExerciseMinutes = prefs.duration - warmUpMinutes - coolDownMinutes;
  
  if (targetExerciseMinutes <= 0) {
      throw new Error(`The selected duration (${prefs.duration} min) is too short for the warm-up (${warmUpMinutes} min) and cool-down (${coolDownMinutes} min). Please increase the total duration.`);
  }
  
  const targetExerciseSeconds = targetExerciseMinutes * 60;
  const targetSecondsPerCircuit = Math.round(targetExerciseSeconds / prefs.rounds);
  
  // --- Filter Exercise Database based on Preferences ---
  const flexibilityExercises = EXERCISE_DATABASE
    .filter(ex => ex.category === 'Flexibility & Mobility')
    .map(ex => `'${ex.name}'`)
    .join(', ');

  const homeEquipmentMap: { [key: string]: ExerciseEquipment[] } = {
    'Dumbbells': ['dumbbell'],
    'Kettlebell': ['kettlebell'],
    'Resistance Bands': ['resistance-band'],
    'Jump Rope': ['rope', 'weighted-rope'],
    'Pull-up Bar': ['pull-up-bar']
  };

  const getAvailableEquipmentForEnv = (): ExerciseEquipment[] => {
      switch (prefs.environment) {
          case WorkoutEnvironment.Gym:
              return ['dumbbell', 'resistance-band', 'kettlebell', 'barbell', 'cable-machine', 'leg-press-machine', 'pull-up-bar', 'rope', 'weighted-rope', 'bodyweight'];
          case WorkoutEnvironment.HomeLimited:
              return ['bodyweight', ...prefs.homeEquipment.flatMap(item => homeEquipmentMap[item] || [])];
          case WorkoutEnvironment.HomeBodyweight:
              return ['bodyweight'];
          default:
              return ['bodyweight'];
      }
  }

  const availableEquipment = getAvailableEquipmentForEnv();

  const mainExercises = EXERCISE_DATABASE
      .filter(ex => 
          ex.purpose === 'main' &&
          ex.skillLevels.includes(prefs.skillLevel) &&
          ex.goals.includes(prefs.goal) &&
          // Exercise is valid if all its required equipment is available to the user
          ex.equipment.every(req => availableEquipment.includes(req))
      )
      .map(ex => ex.name);


  const availableMainExercises = [...new Set(mainExercises)].map(name => `'${name}'`).join(', ');
  
  if (!availableMainExercises || availableMainExercises.trim() === '') {
    throw new Error("No exercises match your specific criteria. Please broaden your selections (e.g., add more equipment, change your goal) and try again.");
  }

  let availableEquipmentText: string;
  if (prefs.environment === WorkoutEnvironment.HomeLimited && prefs.homeEquipment.length > 0) {
      availableEquipmentText = prefs.homeEquipment.join(', ');
  } else if (prefs.environment === WorkoutEnvironment.Gym) {
      availableEquipmentText = 'a full gym with various weights and machines';
  } else {
      availableEquipmentText = 'bodyweight only. You MUST NOT use any equipment.';
  }

  const prompt = `
    You are an expert fitness AI.

    **--- URGENT PRIORITY FIX: The generated workout MUST strictly adhere to the user's selected equipment and should NOT default to bodyweight exercises when equipment is available. ---**

    The user has provided the following available equipment: **${availableEquipmentText}**.

    You MUST prioritize the creation of a diverse workout plan that utilizes the explicitly provided equipment. Do not include bodyweight-only exercises unless no equipment-specific exercises are available, or they are essential for transitions/warm-ups.

    **Rule of Adherence (Non-Negotiable):**

    1.  **Equipment:** The majority of the exercises must require and use the items listed in the available equipment.
    2.  **Goal & Skill:** The workout plan must align with the user's primary_goal ('${prefs.goal}') and skill_level ('${prefs.skillLevel}').
    3.  **Approved Exercise List:** You MUST select exercises for the main workout ('rounds' array) EXCLUSIVELY from this pre-filtered list: ${availableMainExercises}. Do not invent exercises. For warm-ups and cool-downs, you MUST use exercises from this list: ${flexibilityExercises}.

    **Secondary Goal (Guideline Only):**

    - The target workout duration is **${prefs.duration} minutes**. Treat this as a strong guideline, not a rigid constraint. Adherence to equipment priority is more important than hitting the exact duration.

    **Workout Structure Guidance:**

    - **Main Circuit:** Create a single circuit of 4-6 varied exercises. The user will perform this for **${prefs.rounds} rounds**. The total time for ONE circuit (sum of all exercise 'duration' + 'rest') should be about **${targetSecondsPerCircuit} seconds**.
    - **Rest:** Aim for around **${prefs.defaultRestDuration} seconds** of rest for each main exercise.
    - **Warm-up:** If 'includeWarmUp' is true, the total 'duration' of warm-up exercises must sum to exactly **${warmUpMinutes * 60} seconds** (with 0 rest between exercises).
    - **Cool-down:** If 'includeCoolDown' is true, the total 'duration' of cool-down exercises must sum to exactly **${coolDownMinutes * 60} seconds** (with 0 rest between exercises).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: workoutSchema,
        temperature: 0.7,
      },
    });
    
    const jsonText = response.text.trim();
    const parsedPlan = JSON.parse(jsonText) as Partial<Omit<WorkoutPlan, 'id' | 'mode' | 'warmUpDuration' | 'coolDownDuration' | 'exercisesPerRound' | 'numberOfRounds'>>;
    
    parsedPlan.warmUp = parsedPlan.warmUp || [];
    parsedPlan.rounds = parsedPlan.rounds || [];
    parsedPlan.coolDown = parsedPlan.coolDown || [];

    const safeCapitalize = (difficulty: string | undefined): ExerciseDifficulty => {
        if (!difficulty) return 'Easy';
        return (difficulty.charAt(0).toUpperCase() + difficulty.slice(1)) as ExerciseDifficulty;
    };
    
    parsedPlan.warmUp = parsedPlan.warmUp.map(ex => ({ ...ex, rest: ex.rest ?? 0, id: crypto.randomUUID(), unit: 'seconds' as const, difficulty: safeCapitalize(ex.difficulty) }));
    parsedPlan.coolDown = parsedPlan.coolDown.map(ex => ({ ...ex, rest: ex.rest ?? 0, id: crypto.randomUUID(), unit: 'seconds' as const, difficulty: safeCapitalize(ex.difficulty) }));
    
    const exercisesPerRound = parsedPlan.rounds.length;

    let structuredRounds: Exercise[] = parsedPlan.rounds.map((ex, index) => {
        const isLastInCircuit = index === (parsedPlan.rounds || []).length - 1;
        const newEx: Exercise = {
            ...ex,
            rest: ex.rest ?? prefs.defaultRestDuration,
            id: crypto.randomUUID(),
            unit: 'seconds',
            sets: 1,
            reps: 10,
            linkedToNext: false,
            difficulty: safeCapitalize(ex.difficulty),
        };

        if ((parsedPlan.rounds || []).length > 1) { // It's a circuit/superset
            newEx.linkedToNext = !isLastInCircuit;
            if (isLastInCircuit) {
                newEx.groupRounds = prefs.rounds;
                newEx.restAfterGroup = prefs.restBetweenRounds;
            }
        } else if ((parsedPlan.rounds || []).length === 1) { // Single exercise repeated for N rounds/sets
            newEx.sets = prefs.rounds;
            
            const geminiDuration = newEx.duration;
            const geminiRest = newEx.rest;
            const newRest = prefs.restBetweenRounds;
            
            let newDuration = geminiDuration + geminiRest - newRest;

            if (newDuration < 5) {
                newDuration = 5;
            }
            
            newEx.duration = newDuration;
            newEx.rest = newRest;
        }

        return newEx;
    });
    
    const workoutPlan: WorkoutPlan = {
      id: crypto.randomUUID(),
      mode: 'equipment', // Deprecated, but kept for compatibility
      warmUp: parsedPlan.warmUp,
      rounds: structuredRounds,
      coolDown: parsedPlan.coolDown,
      estimatedCalories: parsedPlan.estimatedCalories ?? 0,
      difficultyScore: parsedPlan.difficultyScore ?? 3,
      motivationalQuote: parsedPlan.motivationalQuote ?? "Let's get moving!",
      warmUpDuration: prefs.includeWarmUp ? prefs.warmUpDuration : 0,
      coolDownDuration: prefs.includeCoolDown ? prefs.coolDownDuration : 0,
      exercisesPerRound: exercisesPerRound,
      numberOfRounds: prefs.rounds,
    };

    if (workoutPlan.rounds.length === 0 && workoutPlan.warmUp.length === 0 && workoutPlan.coolDown.length === 0) {
        throw new Error("Generated plan has no exercises. Try relaxing your preferences.");
    }

    return workoutPlan;

  } catch (error) {
    console.error("Error generating workout plan from Gemini:", error);
    if (error instanceof Error && error.message.includes("No exercises match")) {
        throw error;
    }
    throw new Error("Failed to generate a valid workout plan. The AI may have struggled with the constraints. Please try adjusting your preferences.");
  }
};