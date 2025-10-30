import { WorkoutPlan, Exercise } from "../types";

/**
 * Flattens a section of a workout plan (with sets, supersets, group rounds) into a linear
 * array of exercises suitable for the live session player.
 * @param exercises The array of exercises for a specific section (e.g., warmUp, rounds).
 * @returns A new array of exercises with a flattened structure and original index metadata.
 */
const flattenSection = (exercises: Exercise[]): (Exercise & { originalIndex?: number })[] => {
    if (!exercises || exercises.length === 0) {
        return [];
    }
    const flattenedExercises: (Exercise & { originalIndex?: number })[] = [];
    
    // Build groups while preserving original index
    const groups: { exercises: Exercise[], startIndex: number }[] = [];
    let currentGroup: Exercise[] = [];
    let startIndex = 0;

    exercises.forEach((ex, index) => {
        if (currentGroup.length === 0) {
            startIndex = index;
        }
        currentGroup.push(ex);
        if (!ex.linkedToNext) {
            groups.push({ exercises: currentGroup, startIndex });
            currentGroup = [];
        }
    });
    if (currentGroup.length > 0) {
        groups.push({ exercises: currentGroup, startIndex });
    }

    groups.forEach(groupData => {
        const { exercises: group, startIndex } = groupData;
        const workDuration = (ex: Exercise) => ex.unit === 'seconds' ? ex.duration : 30; // 30s estimate for rep-based

        if (group.length > 1) { // It's a Superset/Circuit
            const lastExInGroup = group[group.length - 1];
            const rounds = lastExInGroup.groupRounds || 1;
            const restAfterRound = lastExInGroup.restAfterGroup ?? 60;

            for (let i = 0; i < rounds; i++) {
                group.forEach((ex, exIndex) => {
                    const isLastInRound = exIndex === group.length - 1;
                    const isLastOverallRound = i === rounds - 1;
                    
                    let restForThisItem = 0;
                    if (isLastInRound) {
                        restForThisItem = isLastOverallRound ? (ex.rest ?? 0) : restAfterRound;
                    }

                    flattenedExercises.push({ ...ex, duration: workDuration(ex), rest: restForThisItem, originalIndex: startIndex + exIndex });
                });
            }
        } else { // It's a Standalone exercise
            const ex = group[0];
            const sets = ex.sets || 1;
            for (let i = 0; i < sets; i++) {
                // For standalone exercises, the rest period applies after each set.
                flattenedExercises.push({ ...ex, duration: workDuration(ex), rest: ex.rest ?? 0, originalIndex: startIndex });
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