import { EXERCISE_DATABASE } from '../data/exerciseDatabase';
import { Exercise, ExerciseDetails, ExerciseDifficulty } from '../types';

export const getAllExercises = (): Promise<ExerciseDetails[]> => {
  return new Promise(resolve => {
    // Sort exercises alphabetically within each category for consistent display
    const sorted = [...EXERCISE_DATABASE].sort((a, b) => {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
    resolve(sorted);
  });
};

export const getExerciseById = (id: string): Promise<ExerciseDetails | undefined> => {
  return new Promise(resolve => resolve(EXERCISE_DATABASE.find(ex => ex.id === id)));
};

const skillToDifficulty: Record<string, ExerciseDifficulty> = {
    'Beginner': 'Easy',
    'Intermediate': 'Medium',
    'Advanced': 'Hard',
};

export const getSuggestedMainExercise = (currentExercises: Exercise[]): Omit<Exercise, 'id' | 'status'> | null => {
    const mainExercisesFromDB = EXERCISE_DATABASE.filter(ex => ex.purpose === 'main');
    const currentExerciseNames = new Set(currentExercises.map(ex => ex.exercise));

    // 1. Tally muscle groups from the current workout
    const muscleGroupCounts = new Map<string, number>();
    currentExercises.forEach(ex => {
        const dbEntry = EXERCISE_DATABASE.find(dbEx => dbEx.name === ex.exercise);
        if (dbEntry) {
            dbEntry.muscleGroups.forEach(group => {
                muscleGroupCounts.set(group, (muscleGroupCounts.get(group) || 0) + 1);
            });
        }
    });

    // 2. Find the least worked muscle groups
    let minCount = Infinity;
    const allMuscleGroups = new Set<string>();
    mainExercisesFromDB.forEach(ex => ex.muscleGroups.forEach(g => allMuscleGroups.add(g)));

    allMuscleGroups.forEach(group => {
        const count = muscleGroupCounts.get(group) || 0;
        if (count < minCount) {
            minCount = count;
        }
    });

    const leastWorkedGroups = Array.from(allMuscleGroups).filter(group => (muscleGroupCounts.get(group) || 0) === minCount);

    // 3. Find candidate exercises
    let candidates = mainExercisesFromDB.filter(ex => 
        !currentExerciseNames.has(ex.name) &&
        ex.muscleGroups.some(group => leastWorkedGroups.includes(group))
    );

    // 4. Fallback if no candidates found
    if (candidates.length === 0) {
        candidates = mainExercisesFromDB.filter(ex => !currentExerciseNames.has(ex.name));
    }

    if (candidates.length === 0) return null; // No more unique exercises to suggest

    // 5. Select a random exercise and format it
    const selectedEx = candidates[Math.floor(Math.random() * candidates.length)];
    
    const newExercise: Omit<Exercise, 'id' | 'status'> = {
        exercise: selectedEx.name,
        unit: 'reps',
        duration: 45, // Default for time-based view
        reps: 10,
        sets: 3,
        rest: 60, // A sensible default, can be overridden by universal rest
        difficulty: skillToDifficulty[selectedEx.skillLevels[0]] || 'Medium',
        equipment: selectedEx.equipment[0] || 'bodyweight',
    };

    return newExercise;
};

export const getSingleSuggestedExercise = (type: 'warmup' | 'cooldown'): Omit<Exercise, 'id'> | null => {
    const suggestions = EXERCISE_DATABASE.filter(ex => ex.purpose === type);
    if (suggestions.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * suggestions.length);
    const selectedEx = suggestions[randomIndex];

    if (selectedEx) {
        const newExercise: Omit<Exercise, 'id'> = {
            exercise: selectedEx.name,
            duration: 60,
            rest: 0,
            difficulty: skillToDifficulty[selectedEx.skillLevels[0]] || 'Easy',
            equipment: selectedEx.equipment[0] || 'bodyweight',
            unit: 'seconds',
            reps: 10,
            sets: 1,
        };
        return newExercise;
    }
    return null;
};