import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkoutPlan, Exercise, UnlockedAchievementInfo, WorkoutPreferences } from '../types';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';
import { PlayIcon, PauseIcon, StopIcon, VolumeUpIcon, VolumeOffIcon, SkipNextIcon, SkipPreviousIcon, TrophyIcon, TrashIcon, ChevronDoubleRightIcon, SaveIcon, ArrowPathIcon, CheckCircleIcon } from './icons/Icons';
import { saveCustomWorkout } from '../services/workoutService';
import { checkAndUnlockAchievements } from '../services/achievementService';
import { toastStore } from '../store/toastStore';
import ExerciseModal from './ExerciseModal';
import SaveRoutineModal from './SaveRoutineModal';
import AchievementUnlockedToast from './AchievementUnlockedToast';

const LiveSession: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preferences = location.state?.preferences as WorkoutPreferences | undefined;

  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievementInfo[]>([]);

  const timer = useWorkoutTimer(location.state?.workout as WorkoutPlan | undefined, isSoundOn);
  const { workoutPlan: workout } = timer;
  
  useEffect(() => {
    // If the hook initializes and finds no workout (neither new nor saved), navigate away.
    if (!workout) {
      navigate('/');
    }
  }, [workout, navigate]);

  const {
    stage,
    timeRemaining,
    isRunning,
    stageProgress,
    summary,
    displayInfo,
    currentExercise,
    exercises,
    exerciseIndex,
    togglePause,
    stopWorkout,
    skipExercise,
    previousExercise,
    skipStage,
    replaceCurrentExercise,
    completeSet,
  } = timer;

  useEffect(() => {
    if (stage === 'Finished' && summary) {
        // Run achievement check only once when summary is available
        const checkAchievements = async () => {
            const newlyUnlocked = await checkAndUnlockAchievements();
            setUnlockedAchievements(newlyUnlocked);
        };
        checkAchievements();
    }
  }, [stage, summary]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // If the workout is running and not finished, show the prompt.
      if (isRunning && stage !== 'Finished') {
        event.preventDefault();
        // Standard way to show the browser's native confirmation dialog.
        event.returnValue = 'Are you sure you want to leave? Your workout progress will be lost.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRunning, stage]); // Dependencies ensure we have the latest state

  const exercisePurpose = useMemo(() => {
    if (stage === 'Warm-up') return 'warmup';
    if (stage === 'Cool-down') return 'cooldown';
    return 'main';
  }, [stage]);
  
  const isRepBasedWork = stage === 'Work' && currentExercise?.unit === 'reps';

  const setInfo = useMemo(() => {
    if (!currentExercise || !exercises || exerciseIndex < 0 || stage === 'Warm-up' || stage === 'Cool-down') {
        return { currentSetNum: 0, totalSets: 0, show: false };
    }
    
    // Find all occurrences of the current exercise by name
    const allInstances = exercises.filter(ex => ex.exercise === currentExercise.exercise);
    if (allInstances.length <= 1) {
        // Not a multi-set exercise, don't show set info
        return { currentSetNum: 0, totalSets: 0, show: false };
    }

    // Find the index of the current instance among all its occurrences
    let count = 0;
    for(let i = 0; i <= exerciseIndex; i++) {
        if(exercises[i].exercise === currentExercise.exercise) {
            count++;
        }
    }

    return {
        currentSetNum: count,
        totalSets: allInstances.length,
        show: true,
    };
  }, [currentExercise, exercises, exerciseIndex, stage]);

  if (!workout) {
    return <div className="flex items-center justify-center min-h-screen">Loading Session...</div>;
  }

  const { currentStageDisplay, currentExerciseName, nextExerciseName, totalRounds, currentRoundNum, totalUniqueExercises, currentUniqueExerciseIndex } = displayInfo;

  const renderTimerDisplay = () => {
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleStop = () => {
    stopWorkout();
  };

  const handleOpenReplaceModal = () => {
    if (isRunning) {
      togglePause();
    }
    setIsReplaceModalOpen(true);
  };

  const handleExerciseReplaced = (exerciseData: Omit<Exercise, 'id' | 'status'>) => {
    replaceCurrentExercise(exerciseData);
    setIsReplaceModalOpen(false);
  };

  const handleSaveRoutine = async (workoutName: string) => {
    if (!summary?.workoutPlan) return;

    try {
        const routineToSave: WorkoutPlan = {
            ...summary.workoutPlan,
            id: crypto.randomUUID(),
            name: workoutName
        };
        await saveCustomWorkout(routineToSave);
        toastStore.addToast('Custom workout saved!');
    } catch (e) {
        toastStore.addToast('Failed to save workout', 'error');
    }
  }

  const equipmentColors: { [key: string]: string } = {
    'rope': 'from-red-500 to-orange-500',
    'weighted-rope': 'from-red-500 to-orange-500',
    'bodyweight': 'from-sky-500 to-blue-500',
    'dumbbell': 'from-teal-500 to-cyan-500',
    'resistance-band': 'from-teal-500 to-cyan-500',
    'kettlebell': 'from-purple-500 to-indigo-500',
    'barbell': 'from-rose-500 to-pink-500',
    'cable-machine': 'from-amber-500 to-yellow-500',
    'leg-press-machine': 'from-lime-500 to-green-500',
  };

  const stageColors: { [key: string]: string } = {
    'Warm-up': 'from-blue-500 to-cyan-500',
    'Work': equipmentColors[currentExercise?.equipment || 'rope'],
    'Rest': 'from-green-500 to-emerald-500',
    'Cool-down': 'from-indigo-500 to-purple-500',
    'Finished': 'from-gray-700 to-gray-800',
  };

  if (stage === 'Finished' && summary) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center p-4 animate-fade-in">
        {/* Achievement Toasts Container */}
        <div className="fixed top-5 right-5 z-[100] space-y-3">
            {unlockedAchievements.map((achievement, index) => (
                <AchievementUnlockedToast
                    key={`${achievement.tier}-${index}`}
                    tier={achievement}
                    onDismiss={() => setUnlockedAchievements(prev => prev.filter(a => a.name !== achievement.name))}
                />
            ))}
        </div>

        <div className="bg-gray-800/50 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
          <TrophyIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-orange-400 mb-4">Workout Complete!</h2>
          <p className="text-gray-300 mb-6">Great job! Here's your summary:</p>
          <div className="my-6 space-y-3 text-left bg-gray-900/50 p-4 rounded-lg">
              <p className="flex justify-between text-lg"><span className="text-gray-400">Completed:</span> <strong className="text-white">{summary.completedRounds} / {totalRounds} Exercises</strong></p>
              <p className="flex justify-between text-lg"><span className="text-gray-400">Time:</span> <strong className="text-white">{Math.floor(summary.totalTime / 60)}m {summary.totalTime % 60}s</strong></p>
              <p className="flex justify-between text-lg"><span className="text-gray-400">Calories Burned:</span><strong className="text-white">~{summary.totalCalories} kcal</strong></p>
          </div>
          <div className="flex flex-col gap-3">
            <button
                onClick={() => setIsSaveModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
            >
                <SaveIcon className="w-5 h-5"/> Save as Routine
            </button>
            <button
                onClick={() => navigate('/profile')}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
            >
                Back to Dashboard
            </button>
          </div>
        </div>
        <SaveRoutineModal
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            onSave={handleSaveRoutine}
            defaultName={summary.workoutPlan.name || `Custom Workout - ${new Date().toLocaleDateString()}`}
        />
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center transition-all duration-500 bg-gradient-to-br ${stageColors[stage] || 'from-gray-800 to-gray-900'}`}>
        {isReplaceModalOpen && <ExerciseModal
            isOpen={isReplaceModalOpen}
            onClose={() => setIsReplaceModalOpen(false)}
            onSelectExercise={handleExerciseReplaced}
            mode='replace'
            exerciseToEdit={currentExercise}
            purposeFilter={exercisePurpose}
            originalPreferences={preferences}
        />}
        <div className="absolute top-5 right-5 z-10">
            <button onClick={() => setIsSoundOn(!isSoundOn)} className="p-3 bg-black/20 rounded-full text-white">
                {isSoundOn ? <VolumeUpIcon className="w-6 h-6"/> : <VolumeOffIcon className="w-6 h-6"/>}
            </button>
        </div>
      <div className="relative w-full max-w-lg p-4 text-center">
        {/* Progress Rings */}
        <div className="relative flex items-center justify-center w-72 h-72 sm:w-80 sm:h-80 mx-auto mb-4">
          <svg className="absolute w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-black/20"
              strokeWidth="5"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            {/* Progress circle for time-based */}
            {!isRepBasedWork && (
              <circle
                className="text-white"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={(2 * Math.PI * 45) * (stageProgress)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="45"
                cx="50"
                cy="50"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s linear' }}
              />
            )}
          </svg>
          <div className="z-10">
            <div className="flex items-center justify-center gap-2">
                <p className="text-xl font-semibold uppercase tracking-widest text-white/80">{currentStageDisplay}</p>
                {stage !== 'Finished' && <button onClick={skipStage} title="Skip to Next Stage" className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"><ChevronDoubleRightIcon className="w-5 h-5"/></button>}
            </div>
            {isRepBasedWork ? (
                 <p className="text-7xl font-bold tabular-nums text-white my-2">{currentExercise.reps} <span className="text-5xl">Reps</span></p>
            ) : (
                <p className="text-7xl font-bold tabular-nums text-white my-2">{renderTimerDisplay()}</p>
            )}

            <div className="h-12">
                {stage !== 'Finished' && (
                    <>
                        <p className="text-xl text-white/80 font-semibold">Exercise {currentUniqueExerciseIndex} / {totalUniqueExercises}</p>
                        {setInfo.show && (
                            <p className="text-lg text-white/80">Set {setInfo.currentSetNum} / {setInfo.totalSets}</p>
                        )}
                    </>
                )}
            </div>
          </div>
        </div>
        
        <div className="h-24">
            <h2 className="text-4xl font-bold text-white capitalize transition-opacity duration-300">{currentExerciseName}</h2>
            {nextExerciseName && (
                 <p className="text-xl text-white/70 mt-2 animate-pulse">
                    Next Up: {nextExerciseName}
                 </p>
            )}
        </div>
      </div>

      <div className="absolute bottom-10 inset-x-0 px-4 z-10">
        <div className="bg-black/20 p-2 rounded-full max-w-md mx-auto flex justify-around items-center backdrop-blur-sm">
            <button
                onClick={previousExercise}
                className="p-3 text-white transition-transform transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentUniqueExerciseIndex <= 1}
                title="Previous Exercise"
            >
                <SkipPreviousIcon className="w-6 h-6" />
            </button>
            {isRepBasedWork ? (
              <button
                onClick={completeSet}
                className="p-5 bg-green-500 text-white rounded-full shadow-2xl transition-transform transform hover:scale-110"
                title="Set Complete"
              >
                <CheckCircleIcon className="w-8 h-8" />
              </button>
            ) : (
              <button
                  onClick={togglePause}
                  className="p-5 bg-white text-gray-900 rounded-full shadow-2xl transition-transform transform hover:scale-110"
                  title={isRunning ? 'Pause' : 'Play'}
              >
                  {isRunning ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
              </button>
            )}
            <button
                onClick={skipExercise}
                className="p-3 text-white transition-transform transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Skip Exercise"
            >
                <SkipNextIcon className="w-6 h-6" />
            </button>
             <div className="w-px h-8 bg-white/20 mx-2"></div>
            <button
                onClick={handleOpenReplaceModal}
                disabled={stage === 'Finished'}
                className="p-3 text-white transition-transform transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Replace Exercise"
            >
                <ArrowPathIcon className="w-6 h-6" />
            </button>
            <button
                onClick={handleStop}
                className="p-3 text-red-400 transition-transform transform hover:scale-110"
                title="Stop Workout"
            >
                <StopIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default LiveSession;