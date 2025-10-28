import { GoogleGenAI, Type } from '@google/genai';
import { WorkoutPreferences, WorkoutPlan, Exercise, WorkoutMode } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const workoutSchema = {
  type: Type.OBJECT,
  properties: {
    warmUp: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of 2-3 warm-up exercises. This array MUST be empty if the user preference "includeWarmUp" is false.',
    },
    rounds: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          exercise: { type: Type.STRING, description: 'Name of the exercise.' },
          duration: { type: Type.INTEGER, description: 'Duration of the exercise in seconds.' },
          rest: { type: Type.INTEGER, description: 'Duration of the rest period in seconds.' },
          difficulty: { type: Type.STRING, description: "Difficulty of this specific exercise: 'Easy', 'Medium', or 'Hard'."},
          equipment: { type: Type.STRING, description: "Equipment needed for the exercise, must be one of: 'bodyweight', 'rope', 'weighted-rope', 'dumbbell', 'resistance-band', 'kettlebell', 'barbell', 'cable-machine', 'leg-press-machine'."}
        },
        required: ['exercise', 'duration', 'rest', 'difficulty', 'equipment'],
      },
      description: 'An array of workout rounds representing a single circuit.',
    },
    coolDown: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of 2-3 cool-down exercises.',
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
  const coolDownMinutes = 2;
  const warmUpMinutes = prefs.includeWarmUp ? prefs.warmUpDuration : 0;
  const targetExerciseMinutes = prefs.duration - warmUpMinutes - coolDownMinutes;
  
  if (targetExerciseMinutes <= 0) {
      throw new Error(`The selected duration (${prefs.duration} min) is too short for the warm-up (${warmUpMinutes} min) and cool-down (${coolDownMinutes} min). Please increase the total duration.`);
  }
  
  const targetExerciseSeconds = targetExerciseMinutes * 60;
  const targetSecondsPerCircuit = Math.round(targetExerciseSeconds / prefs.rounds);

  const prompt = `
    You are an expert fitness AI. Your MOST IMPORTANT task is to create a workout plan that precisely matches a specific duration.

    **PRIMARY GOAL: HIT THE TARGET TIME (NON-NEGOTIABLE)**
    - The user wants a total workout of **${prefs.duration} minutes**.
    - We have allocated **${warmUpMinutes} minutes for warm-up** and **${coolDownMinutes} minutes for cool-down**.
    - This leaves **${targetExerciseMinutes} minutes** for the main workout (all rounds combined).
    - The user will perform **${prefs.rounds} rounds** of the circuit you create.
    - Therefore, the SINGLE circuit of exercises you generate in the 'rounds' array **MUST** have a total duration (sum of all exercise \`duration\` + \`rest\` fields) of **EXACTLY ${targetSecondsPerCircuit} seconds**.
    - **THIS IS NOT A GUIDELINE, IT IS A STRICT REQUIREMENT.** All other preferences (skill, goal) must be met *within* this exact time constraint. If you cannot create a plan that fits this time, the response is invalid. Adjust exercise durations, rest periods, and the number of exercises in the circuit to hit the target.

    **SECONDARY GOAL: USER PREFERENCES**
    *Now, considering the strict time constraint above, apply these user preferences:*
    - Skill Level: ${prefs.skillLevel}
    - Goal: ${prefs.goal}
    - Workout Mode: ${prefs.mode}
    - User's Jump Rope(s): ${prefs.equipment.join(', ')}
    - User's Available Equipment: ${prefs.availableEquipment.join(', ')}
    - Include Jump Rope Intervals: ${prefs.includeJumpRopeIntervals}
    - Include Warm-up: ${prefs.includeWarmUp}

    ---

    **RULE 2: WARM-UP & COOL-DOWN**
    - If 'Include Warm-up' is 'true', provide 3-5 dynamic stretches for the 'warmUp' array, suitable for a ${warmUpMinutes}-minute warm-up. The 'warmUp' array MUST be empty if 'false'.
    - ALWAYS provide 2-3 static stretches for the 'coolDown' array, suitable for a ${coolDownMinutes}-minute cool-down.

    **RULE 3: EXERCISE SELECTION & STRUCTURE**
    - **Mode Logic:** ${getModeInstructions(prefs)}
    - **Goal-Specific Exercises:**
        - **Fat Burn:** Prioritize High-Intensity Interval Training (HIIT). Use shorter, more intense work periods (e.g. 30s work, 15s rest) to maximize calorie burn.
        - **Stamina:** Emphasize longer work periods (e.g., 45-60 seconds) with moderate rest to build cardiovascular endurance.
        - **Footwork (for Jump Rope mode):** Focus on agile movements like Boxer Step, Side Swings, and other coordination-based drills.
        - **Strength:** Focus on resistance exercises using the user's available equipment or challenging bodyweight movements.
        - **Freestyle (for Jump Rope mode):** Provide a creative mix of skills, including Criss-Cross, Side Swings, and other tricks to encourage creativity.
    - **Skill Level Adherence:**
        - **Beginner:** All exercises must be 'Easy'. Work durations should be around 30s. Use simple movements.
        - **Intermediate:** Exercises can be 'Easy' or 'Medium'. Work durations around 40s.
        - **Advanced:** Exercises can be 'Easy', 'Medium', or 'Hard'. Work durations 45-60s. Can include complex movements like Double Unders.
    - **Prevent Repetition:** Do not use the exact same exercise back-to-back within the generated circuit.

    **FINAL CHECK:** Before outputting the JSON, double-check that the sum of 'duration' and 'rest' for all exercises in the generated 'rounds' circuit array equals exactly ${targetSecondsPerCircuit} seconds.
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
    const parsedPlan = JSON.parse(jsonText) as Omit<WorkoutPlan, 'id' | 'mode' | 'warmUpDuration' | 'exercisesPerRound' | 'numberOfRounds'>;
    
    const exercisesPerRound = parsedPlan.rounds.length;

    // The AI generates one circuit. We duplicate it here to build the full workout list
    // for the live session based on the user's requested number of rounds.
    let finalRounds: Exercise[] = [];
    if (prefs.rounds > 1 && parsedPlan.rounds.length > 0) {
        for (let i = 0; i < prefs.rounds; i++) {
            finalRounds.push(...parsedPlan.rounds.map(r => ({...r, id: crypto.randomUUID()})));
        }
    } else {
        finalRounds = parsedPlan.rounds.map(r => ({...r, id: crypto.randomUUID()}));
    }
    
    const workoutPlan: WorkoutPlan = {
      ...parsedPlan,
      id: crypto.randomUUID(),
      mode: prefs.mode,
      warmUpDuration: prefs.includeWarmUp ? prefs.warmUpDuration : 0,
      rounds: finalRounds,
      exercisesPerRound: exercisesPerRound,
      numberOfRounds: prefs.rounds,
    };

    if (!workoutPlan.rounds || workoutPlan.rounds.length === 0) {
        throw new Error("Generated plan has no rounds.");
    }
    
    workoutPlan.rounds = workoutPlan.rounds.map(r => ({...r, difficulty: (r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1)) as Exercise['difficulty']}))

    return workoutPlan;

  } catch (error) {
    console.error("Error generating workout plan from Gemini:", error);
    throw new Error("Failed to generate a valid workout plan. The AI may have struggled with the constraints. Please try adjusting your preferences.");
  }
};