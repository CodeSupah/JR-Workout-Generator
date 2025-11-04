import { GoogleGenAI, Type } from '@google/genai';
import { WorkoutPreferences, WorkoutPlan, Exercise, ExerciseDifficulty, WorkoutGoal, SkillLevel, ExerciseEquipment } from '../types';
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
      equipment: { type: Type.STRING, description: "Equipment needed for the exercise, must be one of: 'bodyweight', 'jump-rope', 'dumbbell', 'gym-equipment'. For warm-ups and cool-downs, this is typically 'bodyweight'."}
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

  const mainExercises = EXERCISE_DATABASE
      .filter(ex => 
          ex.purpose === 'main' &&
          ex.skillLevels.includes(prefs.skillLevel) &&
          ex.goals.includes(prefs.goal) &&
          // Exercise is valid if all its required equipment is available to the user
          ex.equipment.every(req => prefs.availableEquipment.includes(req))
      )
      .map(ex => ex.name);


  const availableMainExercises = [...new Set(mainExercises)].map(name => `'${name}'`).join(', ');
  
  if (!availableMainExercises || availableMainExercises.trim() === '') {
    throw new Error("No exercises match your specific criteria. Please broaden your selections (e.g., add more equipment, change your goal) and try again.");
  }

  let availableEquipmentText = prefs.availableEquipment.map(e => e.replace(/-/g, ' ')).join(', ');
  if (!availableEquipmentText) {
    availableEquipmentText = 'bodyweight only';
  }


  const prompt = `
    You are an expert fitness AI. Your primary goal is to create a safe, effective, and varied workout plan based on the user's preferences.

    **--- CRITICAL RULE: EQUIPMENT ADHERENCE ---**
    The user has specified the following equipment is available: **${availableEquipmentText}**.
    - You MUST ONLY select exercises that can be performed with this equipment.
    - If multiple equipment types are listed (e.g., 'bodyweight, dumbbell'), you MUST create a workout that includes a mix of exercises from these categories. Do not default to using only one type.
    - An exercise requiring 'gym-equipment' is only allowed if 'gym-equipment' is in the available list.
    
    **--- WORKOUT GENERATION RULES ---**

    1.  **Goal & Skill Alignment:** The workout plan MUST align with the user's primary_goal ('${prefs.goal}') and skill_level ('${prefs.skillLevel}').
    
    2.  **Approved Exercise List:** You MUST select exercises for the main workout ('rounds' array) EXCLUSIVELY from this pre-filtered list of valid exercises: ${availableMainExercises}. Do not invent exercises or choose exercises not on this list. For warm-ups and cool-downs, you MUST use exercises from this list: ${flexibilityExercises}.

    **--- WORKOUT STRUCTURE GUIDANCE ---**

    - **Main Circuit:** Create a single circuit of 4-6 varied exercises. The user will perform this circuit for **${prefs.rounds} rounds**.
    - **Timing:** The total time for ONE circuit (sum of all exercise 'duration' + 'rest') should be approximately **${targetSecondsPerCircuit} seconds**.
    - **Rest:** If the user specified a global rest duration of '${prefs.defaultRestDuration}' seconds (and it's not 0), use that as the rest time for each main exercise. Otherwise, you can determine an appropriate rest period.
    - **Warm-up:** If 'includeWarmUp' is true, the total 'duration' of warm-up exercises must sum to exactly **${warmUpMinutes * 60} seconds**. Rest between warm-up exercises MUST be 0.
    - **Cool-down:** If 'includeCoolDown' is true, the total 'duration' of cool-down exercises must sum to exactly **${coolDownMinutes * 60} seconds**. Rest between cool-down exercises MUST be 0.
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