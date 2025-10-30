import { EXERCISE_DATABASE } from '../data/exerciseDatabase';
import { ExerciseDetails } from '../types';

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