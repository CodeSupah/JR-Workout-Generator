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
      description: 'A list of 2-3 warm-up exercises.',
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
          equipment: { type: Type.STRING, description: "Equipment needed for the exercise: 'bodyweight', 'rope', 'weighted-rope', 'dumbbell', or 'resistance-band'."}
        },
        required: ['exercise', 'duration', 'rest', 'difficulty', 'equipment'],
      },
      description: 'An array of workout rounds.',
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

const getModeInstructions = (mode: WorkoutMode, includeJumpRope: boolean): string => {
    let baseInstruction = '';
    switch (mode) {
        case 'jump-rope':
            baseInstruction = "Focus exclusively on jump rope exercises. Vary the types of jumps (e.g., basic bounce, boxer step, criss-cross, double unders) based on the skill level. The 'equipment' for all exercises must be 'rope' or 'weighted-rope'.";
            break;
        case 'equipment':
            baseInstruction = "Create a workout that primarily uses equipment like dumbbells and resistance bands. The 'equipment' for these exercises should be 'dumbbell' or 'resistance-band'.";
            break;
        case 'no-equipment':
            baseInstruction = "Design a workout using only bodyweight exercises. This can include calisthenics, plyometrics, and cardio movements that don't require any equipment. The 'equipment' for all exercises must be 'bodyweight'.";
            break;
    }
    if (includeJumpRope && (mode === 'equipment' || mode === 'no-equipment')) {
        baseInstruction += " **Important:** Weave in short (30-45 second) jump rope exercises (labeled with 'rope' equipment) between every 1-2 main exercises to act as active recovery and boost cardio."
    }
    return baseInstruction;
}


export const generateWorkoutPlan = async (prefs: WorkoutPreferences): Promise<WorkoutPlan> => {
  const prompt = `
    Create a workout plan based on these user preferences:
    - Total Duration: ${prefs.duration} minutes
    - Skill Level: ${prefs.skillLevel}
    - Goal: ${prefs.goal}
    - Workout Mode: ${prefs.mode}
    - Include Jump Rope Intervals: ${prefs.includeJumpRopeIntervals}

    **Workout Instructions:** ${getModeInstructions(prefs.mode, prefs.includeJumpRopeIntervals)}

    General Instructions:
    1. The total time of all work and rest rounds should approximate the user's desired duration, leaving about 5 minutes for warm-up and cool-down.
    2. For Beginners, use basic movements. Keep work durations shorter (e.g., 20-40 seconds) and rest periods longer (e.g., 20-30 seconds).
    3. For Intermediate, introduce more complex skills. Work durations can be longer (45-60s) with shorter rests (15-20s).
    4. For Advanced, include difficult, high-intensity moves. Use high-intensity intervals (e.g., 60s work, 10s rest).
    5. Tailor exercise selection to the goal. 'Fat Burn' should be high intensity. 'Stamina' should have longer work periods. 'Strength' should include resistance movements.
    6. For each exercise in the rounds, assign a difficulty: 'Easy', 'Medium', or 'Hard'.
    7. Generate a warm-up of 2-3 dynamic stretches and a cool-down of 2-3 static stretches.
    8. Provide an estimated calorie burn and a difficulty score from 1-10.
    9. Include a short, punchy motivational quote.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: workoutSchema,
        temperature: 0.8,
      },
    });
    
    const jsonText = response.text.trim();
    // A temporary type assertion to parse the JSON
    const parsedPlan = JSON.parse(jsonText) as Omit<WorkoutPlan, 'id' | 'mode'>;
    
    const workoutPlan: WorkoutPlan = {
      ...parsedPlan,
      id: crypto.randomUUID(),
      mode: prefs.mode,
    };


    // Basic validation
    if (!workoutPlan.rounds || workoutPlan.rounds.length === 0) {
        throw new Error("Generated plan has no rounds.");
    }
    
    // Ensure difficulty is correctly formatted
    workoutPlan.rounds = workoutPlan.rounds.map(r => ({...r, id: crypto.randomUUID(), difficulty: (r.difficulty.charAt(0).toUpperCase() + r.difficulty.slice(1)) as Exercise['difficulty']}))

    return workoutPlan;

  } catch (error) {
    console.error("Error generating workout plan from Gemini:", error);
    throw new Error("Failed to generate a valid workout plan.");
  }
};
