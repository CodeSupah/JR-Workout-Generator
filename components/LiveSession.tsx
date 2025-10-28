import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkoutPlan } from '../types';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';
import { PlayIcon, PauseIcon, StopIcon, VolumeUpIcon, VolumeOffIcon, SkipNextIcon, SkipPreviousIcon, TrophyIcon } from './icons/Icons';

const LiveSession: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const workout: WorkoutPlan | undefined = location.state?.workout;

  const [isSoundOn, setIsSoundOn] = useState(true);

  const timer = useWorkoutTimer(workout, isSoundOn);

  useEffect(() => {
    if (!workout) {
      navigate('/');
    }
  }, [workout, navigate]);

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
  } = timer;

  const { currentExerciseName, nextExerciseName, totalRounds, currentRoundNum } = displayInfo;

  const renderTimerDisplay = () => {
    const minutes = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const seconds = (timeRemaining % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const equipmentColors: { [key: string]: string } = {
    'rope': 'from-red-500 to-orange-500', // Work
    'weighted-rope': 'from-red-500 to-orange-500', // Work
    'bodyweight': 'from-sky-500 to-blue-500', // Work - Bodyweight
    'dumbbell': 'from-teal-500 to-cyan-500', // Work - Equipment
    'resistance-band': 'from-teal-500 to-cyan-500', // Work - Equipment
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
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const displayStage = stage === 'Work' ? 'Time' : stage;

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center transition-all duration-500 bg-gradient-to-br ${stageColors[stage] || 'from-gray-800 to-gray-900'}`}>
        <div className="absolute top-5 right-5 z-20">
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
            <p className="text-xl font-semibold uppercase tracking-widest text-white/80">{displayStage}</p>
            <p className="text-7xl font-bold tabular-nums text-white my-2">{renderTimerDisplay()}</p>
            {totalRounds > 0 && <p className="text-lg text-white/80">
              Exercise {currentRoundNum} / {totalRounds}
            </p>}
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

      <div className="absolute bottom-10 inset-x-0 px-4">
        <div className="bg-black/20 p-2 rounded-full max-w-xs mx-auto flex justify-around items-center backdrop-blur-sm">
            <button
                onClick={previousExercise}
                className="p-3 text-white transition-transform transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentRoundNum <= 1}
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
                onClick={stopWorkout}
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