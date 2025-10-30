import { WorkoutPlan, Exercise } from "../types";

/**
 * Flattens a section of a workout plan (with sets, supersets, group rounds) into a linear
 * array of exercises suitable for the live session player.
 * @param exercises The array of exercises for a specific section (e.g., warmUp, rounds).
 * @returns A new array of exercises with a flattened structure.
 */
const flattenSection = (exercises: Exercise[]): Exercise[] => {
    if (!exercises || exercises.length === 0) {
        return [];
    }
    const flattenedExercises: Exercise[] = [];
    
    const groups: Exercise[][] = [];
    let currentGroup: Exercise[] = [];

    exercises.forEach(ex => {
        currentGroup.push(ex);
        if (!ex.linkedToNext) {
            groups.push(currentGroup);
            currentGroup = [];
        }
    });
    if (currentGroup.length > 0) groups.push(currentGroup);

    groups.forEach(group => {
        if (group.length > 1) { // It's a Superset/Circuit
            const lastExInGroup = group[group.length - 1];
            const rounds = lastExInGroup.groupRounds || 1;
            const restAfterRound = lastExInGroup.restAfterGroup ?? 60;
            for (let i = 0; i < rounds; i++) {
                group.forEach((ex, exIndex) => {
                    const isLastInRound = exIndex === group.length - 1;
                    const isLastOverallRound = i === rounds - 1;
                    const workDuration = ex.unit === 'seconds' ? ex.duration : 30; // 30s estimate for rep-based
                    // In a superset, only the last exercise of a round has rest.
                    // The very last exercise of the very last round uses its own `rest` value to transition to the next block.
                    const rest = isLastInRound ? (isLastOverallRound ? ex.rest : restAfterRound) : 0;
                    flattenedExercises.push({ ...ex, duration: workDuration, rest: rest || 0 });
                });
            }
        } else { // It's a Standalone exercise
            const ex = group[0];
            const sets = ex.sets || 1;
            const workDuration = ex.unit === 'seconds' ? ex.duration : 30; // 30s estimate for rep-based
            for (let i = 0; i < sets; i++) {
                // For standalone exercises, the rest period applies after each set.
                flattenedExercises.push({ ...ex, duration: workDuration, rest: ex.rest || 0 });
            }
        }
    });

    return flattenedExercises;
};


/**
 * Flattens a structured workout plan (with sets, supersets, group rounds) into a linear
 * array of exercises suitable for the live session player.
 * @param plan The structured WorkoutPlan.
 * @returns A new WorkoutPlan with a flattened `warmUp`, `rounds`, and `coolDown` array.
 */
export const flattenWorkoutForSession = (plan: WorkoutPlan): WorkoutPlan => {
    // We create a deep copy to avoid mutating the original plan state in the editor
    const planCopy = JSON.parse(JSON.stringify(plan));
    return {
        ...planCopy,
        warmUp: flattenSection(planCopy.warmUp),
        rounds: flattenSection(planCopy.rounds),
        coolDown: flattenSection(planCopy.coolDown),
    };
};
