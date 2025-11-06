import { GoogleGenAI, Type } from '@google/genai';
import { WorkoutPreferences, WorkoutPlan, Exercise, ExerciseDifficulty, WorkoutGoal, SkillLevel, ExerciseEquipment, UserProfile, FitnessObjective, fitnessObjectiveToWorkoutGoals } from '../types';
import { getAllExercises } from './exerciseService';

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
      equipment: { type: Type.STRING, description: "Equipment needed for the exercise, must be one of: 'bodyweight', 'dumbbell', 'gym-equipment'. For warm-ups and cool-downs, this is typically 'bodyweight'."}
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

const instructionsSchema = {
    type: Type.OBJECT,
    properties: {
        description: { type: Type.STRING, description: 'A concise, 1-2 sentence description of the exercise and its primary benefit.' },
        instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A numbered list of 3-5 clear, step-by-step instructions on how to perform the exercise correctly.'
        }
    },
    required: ['description', 'instructions']
};


export const generateExerciseInstructions = async (name: string, skillLevel: SkillLevel, equipment: ExerciseEquipment[]): Promise<{ description: string, instructions: string[] }> => {
    const prompt = `
        Generate a concise description and step-by-step instructions for the following fitness exercise.
        The response must be a valid JSON object.
        
        Exercise Name: "${name}"
        Target Skill Level: ${skillLevel}
        Equipment Used: ${equipment.join(', ') || 'bodyweight'}

        The "description" field should be a single, engaging paragraph. 
        The "instructions" field should be an array of short, clear, actionable strings. Provide 3 to 5 instruction steps.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: instructionsSchema,
            },
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText) as { description: string, instructions: string[] };

        if (!parsed.description || !Array.isArray(parsed.instructions) || parsed.instructions.length === 0) {
            throw new Error("AI returned invalid data structure.");
        }
        return parsed;

    } catch (error) {
        console.error("Error generating exercise instructions from Gemini:", error);
        throw new Error("Failed to generate instructions. The AI may be experiencing issues. Please try again.");
    }
};


export const generateWorkoutPlan = async (prefs: WorkoutPreferences, profile: UserProfile | null): Promise<WorkoutPlan> => {
  const ALL_EXERCISES = await getAllExercises();

  const warmUpMinutes = prefs.includeWarmUp ? prefs.warmUpDuration : 0;
  const coolDownMinutes = prefs.includeCoolDown ? prefs.coolDownDuration : 0;
  const targetExerciseMinutes = prefs.duration - warmUpMinutes - coolDownMinutes;
  
  if (targetExerciseMinutes <= 0) {
      throw new Error(`The selected duration (${prefs.duration} min) is too short for the warm-up (${warmUpMinutes} min) and cool-down (${coolDownMinutes} min). Please increase the total duration.`);
  }
  
  const targetExerciseSeconds = targetExerciseMinutes * 60;
  const targetSecondsPerCircuit = Math.round(targetExerciseSeconds / prefs.rounds);
  
  // --- Filter Exercise Database based on Preferences ---
  const warmUpExercises = ALL_EXERCISES
    .filter(ex => ex.purpose === 'warmup')
    .map(ex => `'${ex.name}'`)
    .join(', ');

  const coolDownExercises = ALL_EXERCISES
    .filter(ex => ex.purpose === 'cooldown')
    .map(ex => `'${ex.name}'`)
    .join(', ');

  // --- Expanded Goal Filtering for Variety ---
  const allowedGoals: WorkoutGoal[] = [prefs.goal];
  if ([WorkoutGoal.Cardio, WorkoutGoal.Strength, WorkoutGoal.Endurance].includes(prefs.goal)) {
      allowedGoals.push(WorkoutGoal.FullBody);
  }
  if (prefs.goal === WorkoutGoal.FullBody) {
      allowedGoals.push(WorkoutGoal.Cardio, WorkoutGoal.Strength, WorkoutGoal.Core);
  }

  const mainExercises = ALL_EXERCISES
      .filter(ex => 
          ex.purpose === 'main' &&
          ex.skillLevels.includes(prefs.skillLevel) &&
          // Use the expanded list of allowed goals for more variety
          ex.goals.some(g => allowedGoals.includes(g)) &&
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
  
  let userProfileText = "The user has not provided detailed personal details, so create a general but effective workout.";
  if (profile) {
    const age = profile.dob ? new Date().getFullYear() - new Date(profile.dob).getFullYear() : 'not specified';
    const relevantWorkoutGoals = fitnessObjectiveToWorkoutGoals[profile.primaryGoal].join(', ');
    userProfileText = `
      **--- USER PROFILE ---**
      - **Age:** ${age}
      - **Gender:** ${profile.gender}
      - **Height:** ${profile.height > 0 ? profile.height.toFixed(0) + ' cm' : 'not specified'}
      - **Weight:** ${profile.weight > 0 ? profile.weight.toFixed(0) + ' kg' : 'not specified'}
      - **User's Stated Primary Goal:** ${profile.primaryGoal}. This means the user is interested in workout styles like: ${relevantWorkoutGoals}.

      **CRITICAL PERSONALIZATION RULE:** You MUST use this profile information to create a more personalized and appropriate workout plan. For example, consider the user's age and weight when determining intensity. The user's stated primary goal should heavily influence the exercise selection and structure, favoring exercises that align with their goal (${relevantWorkoutGoals}).
    `;
  }


  const prompt = `
    You are an expert fitness AI. Your primary goal is to create a safe, effective, and highly personalized workout plan based on the user's preferences and profile.

    ${userProfileText}

    **--- CRITICAL WORKOUT GENERATION RULES ---**

    1.  **STANDARD DURATIONS (MOST IMPORTANT):** Exercise 'duration' values MUST be standard, user-friendly intervals. Use multiples of 5, preferably 30, 45, or 60 seconds. **Avoid strange, specific numbers like 53s or 66s.** To meet the total time goal, you MUST adjust the NUMBER of exercises, NOT the duration of each one.

    2.  **HIGH VARIETY & NO REPETITION:** All sections (warmUp, rounds, coolDown) MUST be composed of **varied** exercises. Do not use the same set of exercises for every generated plan. The main workout circuit ('rounds' array) MUST NOT contain the same exercise twice. A good plan mixes movement patterns (e.g., upper body, lower body, core, cardio bursts) to be engaging and effective. For today's '${prefs.goal}' session, ensure a dynamic and balanced selection.

    3.  **APPROVED EXERCISE LIST:** You MUST select exercises for the main workout ('rounds' array) EXCLUSIVELY from this pre-filtered list of valid exercises: ${availableMainExercises}. For warm-ups, you MUST use exercises from this list: ${warmUpExercises}. For cool-downs, you MUST use exercises from this list: ${coolDownExercises}. Do not invent exercises or choose exercises not on these lists.

    4.  **EQUIPMENT & SKILL ADHERENCE:** The workout must be appropriate for a '${prefs.skillLevel}' user with only the following equipment: **${availableEquipmentText}**.

    **--- WORKOUT STRUCTURE GUIDANCE ---**

    - **CRITICAL DURATION RANGE:** Individual 'work' durations for exercises in the main workout circuit MUST be reasonable, between 30 and 75 seconds.
    - **Main Circuit:** Create a single circuit of varied exercises. The user will perform this circuit for **${prefs.rounds} rounds**. The number of exercises in the circuit should be chosen to meet the timing goal below, while respecting all duration rules above.
    - **Timing:** The total time for ONE circuit (sum of all exercise 'duration' + 'rest') should be approximately **${targetSecondsPerCircuit} seconds**.
    - **Rest:** If the user specified a global rest duration of '${prefs.defaultRestDuration}' seconds (and it's not 0), use that as the rest time for each main exercise. Otherwise, you can determine an appropriate rest period that aligns with a '${prefs.goal}' goal (e.g., shorter rests for cardio).
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
            // FIX: Simplified logic for single-exercise rounds to prevent type issues.
            // The rest between sets is simply the 'rest' property for a single exercise group.
            newEx.rest = prefs.restBetweenRounds;
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