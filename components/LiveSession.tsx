import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkoutPlan, Exercise } from '../types';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';
import { PlayIcon, PauseIcon, StopIcon, VolumeUpIcon, VolumeOffIcon, SkipNextIcon, SkipPreviousIcon, TrophyIcon, TrashIcon, ChevronDoubleRightIcon, SaveIcon, ArrowPathIcon } from './icons/Icons';
import { saveCustomWorkout } from '../services/workoutService';
import { toastStore } from '../store/toastStore';
import ExerciseModal from './ExerciseModal';
import SaveRoutineModal from './SaveRoutineModal';

const SESSION_STORAGE_KEY = 'ropeflow-live-session';

const LiveSession: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [workout, setWorkout] = useState<WorkoutPlan | undefined>(() => {
    const newWorkout = location.state?.workout as WorkoutPlan | undefined;
    if (newWorkout) {
      return newWorkout;
    }
    const savedSessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (savedSessionRaw) {
      try {
        const savedData = JSON.parse(savedSessionRaw);
        return savedData.workoutPlan;
      } catch (e) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
    return undefined;
  });
  
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isReplaceModalOpen, setReplaceModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // This effect handles clearing old session data when a new workout is started.
  useEffect(() => {
    if (location.state?.workout) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [location.state?.workout]);


  const timer = useWorkoutTimer(workout, isSoundOn);

  useEffect(() => {
    if (!workout && !timer) {
      navigate('/');
    }
  }, [workout, timer, navigate]);

  if (!workout || !timer) {
    return <div className="flex items-center justify-center min-h-screen">Loading Session...</div>;
  }

  const {
    stage,
    timeRemaining,
    isRunning,
    stageProgress,
    summary,
    displayInfo,
    currentExercise,
    togglePause,
    stopWorkout,
    skipExercise,
    previousExercise,
    skipStage,
    replaceCurrentExercise,
  } = timer;

  const { currentStageDisplay, currentExerciseName, nextExerciseName, totalRounds, currentRoundNum } = displayInfo;

  const renderTimerDisplay = () => {
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleStop = () => {
      if (window.confirm("Are you sure you want to end the workout? Your progress will be saved.")) {
          stopWorkout();
      }
  };

  const handleExerciseReplaced = (exerciseData: Omit<Exercise, 'id' | 'status'>) => {
    replaceCurrentExercise(exerciseData);
    setReplaceModalOpen(false);
    togglePause(); // Automatically resume after replacing
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
                onClick={() => navigate('/dashboard')}
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
        {!isRunning && stage !== 'Finished' && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-6 animate-fade-in p-4">
                <h2 className="text-5xl font-bold text-white/80 tracking-widest uppercase">Paused</h2>
                <div className="bg-gray-800/50 rounded-2xl p-6 w-full max-w-sm space-y-3">
                    <button 
                        onClick={togglePause} 
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold text-lg transition-colors"
                    >
                        <PlayIcon className="w-6 h-6" /> Resume Workout
                    </button>
                    <button 
                        onClick={() => setReplaceModalOpen(true)} 
                        disabled={stage !== 'Work'}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        <ArrowPathIcon className="w-5 h-5" /> Replace
                    </button>
                    <button 
                        onClick={handleStop} 
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-bold transition-colors"
                    >
                        <StopIcon className="w-5 h-5" /> End Workout
                    </button>
                </div>
            </div>
        )}
        {isReplaceModalOpen && <ExerciseModal
            isOpen={isReplaceModalOpen}
            onClose={() => setReplaceModalOpen(false)}
            onSelectExercise={handleExerciseReplaced}
            mode='replace'
            exerciseToEdit={currentExercise}
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
            {/* Progress circle */}
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
          </svg>
          <div className="z-10">
            <div className="flex items-center justify-center gap-2">
                <p className="text-xl font-semibold uppercase tracking-widest text-white/80">{currentStageDisplay}</p>
                {stage !== 'Finished' && <button onClick={skipStage} title="Skip to Next Stage" className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"><ChevronDoubleRightIcon className="w-5 h-5"/></button>}
            </div>
            <p className="text-7xl font-bold tabular-nums text-white my-2">{renderTimerDisplay()}</p>
            {stage === 'Work' || stage === 'Rest' ? <p className="text-lg text-white/80">
              Exercise {currentRoundNum} / {totalRounds}
            </p> : <p className="text-lg text-white/80">&nbsp;</p>}
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
        <div className="bg-black/20 p-2 rounded-full max-w-xs mx-auto flex justify-around items-center backdrop-blur-sm">
            <button
                onClick={previousExercise}
                className="p-3 text-white transition-transform transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentRoundNum <= 1 && stage !== 'Work'}
                title="Previous Exercise"
            >
                <SkipPreviousIcon className="w-6 h-6" />
            </button>
            <button
                onClick={togglePause}
                className="p-5 bg-white text-gray-900 rounded-full shadow-2xl transition-transform transform hover:scale-110"
                title={isRunning ? 'Pause' : 'Play'}
            >
                {isRunning ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
            </button>
            <button
                onClick={skipExercise}
                className="p-3 text-white transition-transform transform hover:scale-110"
                title="Skip Exercise"
            >
                <SkipNextIcon className="w-6 h-6" />
            </button>
             <div className="w-px h-8 bg-white/20 mx-2"></div>
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