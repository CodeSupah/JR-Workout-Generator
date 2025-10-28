import { WorkoutStats, WorkoutPlan, SessionSummary } from '../types';

const CUSTOM_WORKOUTS_KEY = 'ropeflow-custom-workouts';
const WORKOUT_HISTORY_KEY = 'ropeflow-workout-history';

// --- Custom Workout Management ---

const getCustomWorkouts = (): WorkoutPlan[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_WORKOUTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse custom workouts from localStorage", e);
    return [];
  }
};

export const saveCustomWorkout = (workout: WorkoutPlan): Promise<WorkoutPlan> => {
  return new Promise((resolve) => {
    const workouts = getCustomWorkouts();
    const existingIndex = workouts.findIndex(w => w.id === workout.id);
    if (existingIndex > -1) {
      workouts[existingIndex] = workout;
    } else {
      workouts.push(workout);
    }
    localStorage.setItem(CUSTOM_WORKOUTS_KEY, JSON.stringify(workouts));
    resolve(workout);
  });
};

export const loadCustomWorkouts = (): Promise<WorkoutPlan[]> => {
  return new Promise((resolve) => {
    resolve(getCustomWorkouts());
  });
};

export const deleteCustomWorkout = (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    let workouts = getCustomWorkouts();
    workouts = workouts.filter(w => w.id !== id);
    localStorage.setItem(CUSTOM_WORKOUTS_KEY, JSON.stringify(workouts));
    resolve(true);
  });
}

// --- Workout History & Stats ---

const getWorkoutHistory = (): SessionSummary[] => {
  try {
    const stored = localStorage.getItem(WORKOUT_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse workout history from localStorage", e);
    return [];
  }
};

export const saveWorkoutSummary = (summary: SessionSummary): Promise<SessionSummary> => {
  return new Promise((resolve) => {
    const history = getWorkoutHistory();
    history.push(summary);
    localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(history));
    resolve(summary);
  });
};

const calculateStreak = (history: SessionSummary[]): number => {
    if (history.length === 0) return 0;

    const workoutDates = [...new Set(history.map(s => new Date(s.date).toDateString()))]
        .map(d => new Date(d))
        .sort((a, b) => b.getTime() - a.getTime());
    
    if (workoutDates.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // Check if the most recent workout was today or yesterday
    if (workoutDates[0].toDateString() === today.toDateString() || workoutDates[0].toDateString() === yesterday.toDateString()) {
        streak = 1;
        for (let i = 0; i < workoutDates.length - 1; i++) {
            const current = workoutDates[i];
            const next = workoutDates[i+1];
            const diffDays = (current.getTime() - next.getTime()) / (1000 * 3600 * 24);
            if (diffDays <= 1) {
                streak++;
            } else {
                break;
            }
        }
    }
    
    return streak;
}


export const getWorkoutStats = (): Promise<WorkoutStats> => {
  return new Promise((resolve) => {
    const history = getWorkoutHistory();
    const customWorkouts = getCustomWorkouts();

    const totalWorkouts = history.length;
    const totalMinutes = Math.floor(history.reduce((sum, s) => sum + s.totalTime, 0) / 60);
    const totalCalories = history.reduce((sum, s) => sum + s.totalCalories, 0);
    const currentStreak = calculateStreak(history);

    const today = new Date();
    const weeklySummary: WorkoutStats['weeklySummary'] = Array(7).fill(0).map((_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        return { name: dayName, minutes: 0 };
    });

    history.forEach(session => {
        const sessionDate = new Date(session.date);
        const diffDays = (today.getTime() - sessionDate.getTime()) / (1000 * 3600 * 24);
        if (diffDays >= 0 && diffDays < 7) {
            const dayIndex = (sessionDate.getDay() + 6) % 7; // Find position in our Mon-Sun array
            const weekArrayIndex = weeklySummary.findIndex(d => d.name === sessionDate.toLocaleDateString('en-US', { weekday: 'short' }));
            if(weekArrayIndex > -1){
                weeklySummary[weekArrayIndex].minutes += Math.floor(session.totalTime / 60);
            }
        }
    });

    const stats: WorkoutStats = {
      totalWorkouts,
      totalMinutes,
      totalCalories,
      currentStreak,
      customWorkouts: customWorkouts.length,
      personalBests: { // This would need more detailed tracking, placeholder for now
        quickest1MinCount: 165,
        longestCombo: 'Double Under x 50',
      },
      weeklySummary,
    };

    resolve(stats);
  });
};
