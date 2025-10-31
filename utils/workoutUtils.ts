import { WorkoutPlan, Exercise } from "../types";

export interface SessionItem extends Exercise {
    isRest?: boolean;
    purpose: 'warmup' | 'main' | 'cooldown';
    originalIndex?: number;
}


/**
 * Flattens a section of a workout plan (with sets, supersets, group rounds) into a linear
 * array of exercises and explicit rest periods suitable for the live session player.
 * @param exercises The array of exercises for a specific section (e.g., warmUp, rounds).
 * @param purpose The purpose of this section.
 * @returns A new array of SessionItems with a flattened structure.
 */
const flattenSection = (exercises: Exercise[], purpose: SessionItem['purpose']): SessionItem[] => {
    if (!exercises || exercises.length === 0) {
        return [];
    }
    const flattenedExercises: SessionItem[] = [];
    
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

        const lastExInGroup = group[group.length - 1];
        const rounds = lastExInGroup.groupRounds || group[0].sets || 1;
        const restAfterRound = lastExInGroup.restAfterGroup ?? 0;

        for (let i = 0; i < rounds; i++) {
            group.forEach((ex, exIndex) => {
                const isLastInRound = exIndex === group.length - 1;

                // 1. Add the work item itself
                flattenedExercises.push({ 
                    ...ex, 
                    duration: workDuration(ex), 
                    purpose,
                    originalIndex: startIndex + exIndex 
                });
                
                // 2. Add the exercise's individual rest, unless it's the last exercise of a round that has a specific round rest.
                if (ex.rest > 0 && !(isLastInRound && restAfterRound > 0)) {
                    flattenedExercises.push({
                        ...ex,
                        id: `${ex.id}-rest-${i}-${exIndex}`,
                        exercise: 'Rest',
                        duration: ex.rest,
                        isRest: true,
                        purpose,
                        originalIndex: startIndex + exIndex
                    });
                }
            });

            // 3. Add the rest between rounds/sets, if applicable
            const isLastOverallRound = i === rounds - 1;
            if (!isLastOverallRound && restAfterRound > 0) {
                flattenedExercises.push({
                    ...lastExInGroup,
                    id: `${lastExInGroup.id}-group-rest-${i}`,
                    exercise: 'Rest Between Rounds',
                    duration: restAfterRound,
                    isRest: true,
                    purpose,
                    originalIndex: startIndex + group.length -1
                });
            } else if (!isLastOverallRound && group.length === 1 && group[0].rest > 0) {
                // Handle rest for simple multi-set single exercises
                 flattenedExercises.push({
                    ...group[0],
                    id: `${group[0].id}-set-rest-${i}`,
                    exercise: 'Rest',
                    duration: group[0].rest,
                    isRest: true,
                    purpose,
                    originalIndex: startIndex
                });
            }
        }
    });

    return flattenedExercises;
};


/**
 * Flattens a structured workout plan into a single, linear array of SessionItems
 * (exercises and explicit rest periods) for the live session player.
 * @param plan The structured WorkoutPlan.
 * @returns A new WorkoutPlan with a single flattened `rounds` array containing all session items.
 */
export const flattenWorkoutForSession = (plan: WorkoutPlan): {
    workoutPlan: WorkoutPlan,
    sessionItems: SessionItem[]
} => {
    // We create a deep copy to avoid mutating the original plan state in the editor
    const planCopy = JSON.parse(JSON.stringify(plan));

    const flatWarmUp = flattenSection(planCopy.warmUp, 'warmup');
    const flatRounds = flattenSection(planCopy.rounds, 'main');
    const flatCoolDown = flattenSection(planCopy.coolDown, 'cooldown');

    let allItems: SessionItem[] = [...flatWarmUp, ...flatRounds, ...flatCoolDown];

    // Remove any trailing rest period from the very end of the workout
    if (allItems.length > 0 && allItems[allItems.length - 1].isRest) {
        allItems.pop();
    }
    
    return {
        workoutPlan: plan, // Return original for display info
        sessionItems: allItems
    };
};