import { GoogleGenAI, Type } from '@google/genai';
import { WorkoutPreferences, WorkoutPlan, Exercise, WorkoutMode, Equipment, ExerciseDifficulty } from '../types';
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

const getModeInstructions = (prefs: WorkoutPreferences): string => {
    let baseInstruction = '';
    switch (prefs.mode) {
        case 'jump-rope':
            baseInstruction = `Focus exclusively on jump rope exercises using the user's available ropes: '${prefs.equipment.join(', ')}'. Vary the types of jumps based on the skill level. If multiple ropes are available, create a mix of exercises using them. The 'equipment' for all exercises must be 'rope' or 'weighted-rope'.`;
            break;
        case 'equipment':
             if (prefs.availableEquipment.includes('gym')) {
                baseInstruction = `The user has access to a full gym. Create a varied workout using common gym equipment like barbells, dumbbells, kettlebells, cable machines, leg press, etc. The 'equipment' for these exercises must be one of the valid equipment types.`;
             } else {
                baseInstruction = `Create a workout using ONLY the following equipment: ${prefs.availableEquipment.join(', ')}. The 'equipment' for these exercises should be one of the user's available items.`;
             }
            break;
        case 'no-equipment':
            baseInstruction = "Design a workout using only bodyweight exercises. The 'equipment' for all exercises must be 'bodyweight'.";
            break;
    }
    if (prefs.includeJumpRopeIntervals && (prefs.mode === 'equipment' || prefs.mode === 'no-equipment')) {
        baseInstruction += " **Crucial Instruction:** Intersperse short (30-60 second) jump rope exercises (using 'rope' as equipment) between every 1-2 main exercises. These act as cardio bursts."
    }
    return baseInstruction;
}


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

  let mainExercises: string[];

  const ropeTypeToEquipmentMap: { [key in Equipment]: 'rope' | 'weighted-rope' } = {
      [Equipment.Regular]: 'rope',
      [Equipment.Speed]: 'rope',
      [Equipment.Weighted]: 'weighted-rope',
  };
  const availableRopeEquipment = [...new Set(prefs.equipment.map(r => ropeTypeToEquipmentMap[r]))];
  const userEquipmentLower = prefs.availableEquipment.map(e => e.toLowerCase().replace(/ /g, '-'));

  switch (prefs.mode) {
      case 'jump-rope':
          mainExercises = EXERCISE_DATABASE
              .filter(ex => ex.purpose === 'main' && availableRopeEquipment.includes(ex.equipment as any))
              .map(ex => ex.name);
          break;
      case 'equipment':
          const gymEquipmentTypes = ['dumbbell', 'resistance-band', 'kettlebell', 'barbell', 'cable-machine', 'leg-press-machine'];
          if (userEquipmentLower.includes('gym')) {
              mainExercises = EXERCISE_DATABASE
                  .filter(ex => ex.purpose === 'main' && (gymEquipmentTypes.includes(ex.equipment) || ex.equipment === 'bodyweight'))
                  .map(ex => ex.name);
          } else {
              mainExercises = EXERCISE_DATABASE
                  .filter(ex => ex.purpose === 'main' && (userEquipmentLower.includes(ex.equipment) || ex.equipment === 'bodyweight'))
                  .map(ex => ex.name);
          }
          break;
      case 'no-equipment':
      default:
          mainExercises = EXERCISE_DATABASE
              .filter(ex => ex.purpose === 'main' && ex.equipment === 'bodyweight')
              .map(ex => ex.name);
          break;
  }
  
  if (prefs.includeJumpRopeIntervals && (prefs.mode === 'equipment' || prefs.mode === 'no-equipment')) {
      const ropeIntervalExercises = EXERCISE_DATABASE
          .filter(ex => ex.purpose === 'main' && ex.equipment === 'rope')
          .map(ex => ex.name);
      mainExercises.push(...ropeIntervalExercises);
  }

  const availableMainExercises = [...new Set(mainExercises)].map(name => `'${name}'`).join(', ');


  const prompt = `
    You are an expert fitness AI. Your MOST IMPORTANT task is to create a workout plan that precisely matches a specific duration.

    **PRIMARY GOAL: HIT THE TARGET TIME (NON-NEGOTIABLE)**
    - The user wants a total workout of **${prefs.duration} minutes**.
    - We have allocated **${warmUpMinutes} minutes for warm-up** and **${coolDownMinutes} minutes for cool-down**.
    - This leaves **${targetExerciseMinutes} minutes** for the main workout (all rounds combined).
    - The user will perform **${prefs.rounds} rounds** of the circuit you create.
    - Therefore, the SINGLE circuit of exercises you generate in the 'rounds' array **MUST** have a total duration (sum of all exercise \`duration\` + \`rest\` fields) of **EXACTLY ${targetSecondsPerCircuit} seconds**.
    - **THIS IS NOT A GUIDELINE, IT IS A STRICT REQUIREMENT.** You MUST use **${prefs.defaultRestDuration} seconds** as the 'rest' value for every exercise in the 'rounds' array. You must adjust exercise 'duration' values and the number of exercises in the circuit to hit the target time. **DO NOT change the 'rest' value.** All other preferences (skill, goal) must be met *within* this exact time constraint.

    **SECONDARY GOAL: USER PREFERENCES**
    *Now, considering the strict time and rest constraints above, apply these user preferences:*
    - Skill Level: ${prefs.skillLevel}
    - Goal: ${prefs.goal}
    - Workout Mode: ${prefs.mode}
    - User's Jump Rope(s): ${prefs.equipment.join(', ')}
    - User's Available Equipment: ${prefs.availableEquipment.join(', ')}
    - Include Jump Rope Intervals: ${prefs.includeJumpRopeIntervals}
    - Include Warm-up: ${prefs.includeWarmUp}
    - Include Cool-down: ${prefs.includeCoolDown}
    - Rest Between Exercises: ${prefs.defaultRestDuration} seconds (This is the value you MUST use for the 'rest' field in the 'rounds' array)
    - Rest Between Rounds: ${prefs.restBetweenRounds} seconds (This is for user info; you do not need to include it in your calculation for the single circuit's duration)

    ---

    **RULE 2: WARM-UP & COOL-DOWN**
    - If 'Include Warm-up' is 'true', provide a list of dynamic stretch exercises for the 'warmUp' array. The sum of the 'duration' property for all exercises in this array MUST EXACTLY equal ${warmUpMinutes * 60} seconds. The 'rest' property for all warm-up exercises MUST be 0. The 'warmUp' array MUST be empty if 'false'.
    - If 'Include Cool-down' is 'true', provide a list of static stretch exercises for the 'coolDown' array. The sum of the 'duration' property for all exercises in this array MUST EXACTLY equal ${coolDownMinutes * 60} seconds. The 'rest' property for all cool-down exercises MUST be 0. The 'coolDown' array MUST be empty if 'false'.

    **RULE 3: EXERCISE SELECTION & STRUCTURE**
    - **Mode Logic:** ${getModeInstructions(prefs)}
    - **Goal-Specific Exercises:**
        - **Full Body:** Create a balanced, varied workout targeting all major muscle groups. This is the default, well-rounded option.
        - **Cardio Endurance:** Prioritize High-Intensity Interval Training (HIIT). Emphasize longer work periods with shorter rest to build cardiovascular endurance and maximize calorie burn.
        - **Power:** Focus on explosive movements. For jump rope, this means Double Unders or high-intensity bursts. For equipment/bodyweight, include exercises like Kettlebell Swings or Burpees.
        - **Core Strength:** Integrate jump rope variations that engage the core (e.g., high knees, twists) and add core-focused bodyweight exercises like planks or leg raises.
        - **Freestyle (for Jump Rope mode):** Provide a creative mix of skills, including Criss-Cross, Side Swings, and other tricks to encourage creativity and rhythm.
    - **Skill Level Adherence:**
        - **Beginner:** All exercises must be 'Easy'.
        - **Intermediate:** Exercises can be 'Easy' or 'Medium'.
        - **Advanced:** Exercises can be 'Easy', 'Medium', or 'Hard'. Can include complex movements like Double Unders.
    - **Prevent Repetition:** Do not use the exact same exercise back-to-back within the generated circuit.

    **RULE 4: AVAILABLE EXERCISES (MANDATORY)**
    You MUST select exercises for the plan exclusively from the lists provided below. Do not invent any exercises or use exercises not on these lists. The 'exercise' field in the JSON response MUST be an exact string match from these lists.
    - Available Main Workout Exercises for the 'rounds' array: ${availableMainExercises}
    - Available Warm-up Exercises for the 'warmUp' array: ${flexibilityExercises}
    - Available Cool-down Exercises for the 'coolDown' array: ${flexibilityExercises}


    **FINAL CHECK:** Before outputting the JSON, double-check that the sum of 'duration' and 'rest' for all exercises in the generated 'rounds' circuit array equals exactly ${targetSecondsPerCircuit} seconds, and that each 'rest' value is exactly ${prefs.defaultRestDuration}.
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
    
    // FIX: Ensure required arrays exist to prevent crashes on .map or .length.
    parsedPlan.warmUp = parsedPlan.warmUp || [];
    parsedPlan.rounds = parsedPlan.rounds || [];
    parsedPlan.coolDown = parsedPlan.coolDown || [];

    // FIX: Helper to safely capitalize difficulty and provide a default.
    const safeCapitalize = (difficulty: string | undefined): ExerciseDifficulty => {
        if (!difficulty) return 'Easy';
        return (difficulty.charAt(0).toUpperCase() + difficulty.slice(1)) as ExerciseDifficulty;
    };
    
    parsedPlan.warmUp = parsedPlan.warmUp.map(ex => ({ ...ex, id: crypto.randomUUID(), unit: 'seconds' as const, difficulty: safeCapitalize(ex.difficulty) }));
    parsedPlan.coolDown = parsedPlan.coolDown.map(ex => ({ ...ex, id: crypto.randomUUID(), unit: 'seconds' as const, difficulty: safeCapitalize(ex.difficulty) }));
    
    const exercisesPerRound = parsedPlan.rounds.length;

    let structuredRounds: Exercise[] = parsedPlan.rounds.map((ex, index) => {
        const isLastInCircuit = index === (parsedPlan.rounds || []).length - 1;
        const newEx: Exercise = {
            ...ex,
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
      mode: prefs.mode,
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
        throw new Error("Generated plan has no exercises.");
    }

    return workoutPlan;

  } catch (error) {
    console.error("Error generating workout plan from Gemini:", error);
    throw new Error("Failed to generate a valid workout plan. The AI may have struggled with the constraints. Please try adjusting your preferences.");
  }
};
