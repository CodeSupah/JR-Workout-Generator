import { ExerciseDetails } from '../types';

const CUSTOM_EXERCISES_KEY = 'jump-custom-exercises';

export const getCustomExercises = (): ExerciseDetails[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_EXERCISES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse custom exercises from localStorage", e);
    return [];
  }
};

export const addCustomExercise = async (exercise: ExerciseDetails): Promise<void> => {
  const exercises = getCustomExercises();
  // Avoid duplicates
  if (!exercises.some(ex => ex.id === exercise.id)) {
    exercises.push(exercise);
    localStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(exercises));
  }
};

export const updateCustomExercise = async (updatedExercise: ExerciseDetails): Promise<void> => {
  let exercises = getCustomExercises();
  const index = exercises.findIndex(ex => ex.id === updatedExercise.id);
  if (index !== -1) {
    exercises[index] = updatedExercise;
    localStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(exercises));
  }
};

export const deleteCustomExercise = async (id: string): Promise<void> => {
  let exercises = getCustomExercises();
  exercises = exercises.filter(ex => ex.id !== id);
  localStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(exercises));
};
