import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkillLevel, WorkoutGoal, Equipment, WorkoutPreferences, WorkoutPlan, Exercise, WorkoutMode } from '../types';
import { generateWorkoutPlan } from '../services/geminiService';
import { DumbbellIcon, FlameIcon, RunIcon, StarIcon, TargetIcon, ZapIcon, EditIcon, RopeIcon } from './icons/Icons';
import { useWorkoutEditor } from '../hooks/useWorkoutEditor';
import EditableWorkoutPlan from './EditableWorkoutPlan';
import WorkoutModeToggle from './WorkoutModeToggle';
import { toastStore } from '../store/toastStore';

const WorkoutGenerator: React.FC = () => {
  const [preferences, setPreferences] = useState<Omit<WorkoutPreferences, 'mode' | 'includeJumpRopeIntervals'>>({
    duration: 15,
    skillLevel: SkillLevel.Beginner,
    goal: WorkoutGoal.FatBurn,
    equipment: Equipment.Regular,
  });
  const [mode, setMode] = useState<WorkoutMode>('jump-rope');
  const [includeIntervals, setIncludeIntervals] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const editor = useWorkoutEditor();

  useEffect(() => {
    const savedPrefs = localStorage.getItem('workoutPreferences');
    if (savedPrefs) {
      const parsedPrefs = JSON.parse(savedPrefs);
      setPreferences({
          duration: parsedPrefs.duration || 15,
          skillLevel: parsedPrefs.skillLevel || SkillLevel.Beginner,
          goal: parsedPrefs.goal || WorkoutGoal.FatBurn,
          equipment: parsedPrefs.equipment || Equipment.Regular,
      });
      setMode(parsedPrefs.mode || 'jump-rope');
      setIncludeIntervals(parsedPrefs.includeJumpRopeIntervals || false);
    }
  }, []);

  const handlePreferenceChange = <K extends keyof Omit<WorkoutPreferences, 'mode' | 'includeJumpRopeIntervals'>>(
    key: K,
    value: Omit<WorkoutPreferences, 'mode' | 'includeJumpRopeIntervals'>[K]
  ) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    localStorage.setItem('workoutPreferences', JSON.stringify({...newPreferences, mode, includeJumpRopeIntervals: includeIntervals}));
  };
  
  const handleIncludeIntervalsChange = (checked: boolean) => {
    setIncludeIntervals(checked);
    localStorage.setItem('workoutPreferences', JSON.stringify({...preferences, mode, includeJumpRopeIntervals: checked}));
  }

  const handleModeChange = (newMode: WorkoutMode) => {
    setMode(newMode);
    localStorage.setItem('workoutPreferences', JSON.stringify({...preferences, mode: newMode, includeJumpRopeIntervals: includeIntervals}));
    toastStore.addToast(`Mode changed to ${newMode.replace('-', ' ')}`);
  }

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setIsEditing(false);
    editor.reset();

    try {
      const fullPreferences: WorkoutPreferences = { ...preferences, mode, includeJumpRopeIntervals: includeIntervals };
      const plan = await generateWorkoutPlan(fullPreferences);
      editor.setExercises(plan);
      setIsEditing(true);
    } catch (err) {
      setError('Failed to generate workout. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 ${isEditing ? 'mb-8' : ''}`}>
        <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-1">Let's build your workout</h2>
              <p className="text-gray-400 mb-6">Customize your session and let AI do the rest.</p>
            </div>
            {isEditing && (
              <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg">
                <EditIcon className="w-4 h-4" />
                Edit Prefs
              </button>
            )}
        </div>

        {/* Hide form when editing to focus on the plan */}
        <div className={`${isEditing ? 'hidden' : 'animate-fade-in'}`}>
            <div className="space-y-6">
                <WorkoutModeToggle selectedMode={mode} onModeChange={handleModeChange} />

                {(mode === 'equipment' || mode === 'no-equipment') && (
                     <div className="bg-gray-900/50 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <RopeIcon className="w-6 h-6 text-orange-400" />
                            <div>
                                <label htmlFor="include-intervals" className="font-semibold text-white">Include Jump Rope Intervals</label>
                                <p className="text-xs text-gray-400">Add cardio bursts between sets.</p>
                            </div>
                        </div>
                        <label htmlFor="include-intervals" className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="include-intervals" className="sr-only peer" checked={includeIntervals} onChange={(e) => handleIncludeIntervalsChange(e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                )}
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Duration Slider */}
                <div className="space-y-2">
                    <label className="text-lg font-semibold">Duration: <span className="text-orange-400">{preferences.duration} mins</span></label>
                    <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={preferences.duration}
                    onChange={(e) => handlePreferenceChange('duration', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-orange-500"
                    />
                </div>

                {/* Skill Level */}
                <div className="space-y-2">
                    <label className="text-lg font-semibold">Skill Level</label>
                    <div className="grid grid-cols-3 gap-2">
                    {(Object.values(SkillLevel)).map(level => (
                        <button
                        key={level}
                        onClick={() => handlePreferenceChange('skillLevel', level)}
                        className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${preferences.skillLevel === level ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}
                        >
                        {level}
                        </button>
                    ))}
                    </div>
                </div>
                
                {/* Goal */}
                <div className="md:col-span-2 space-y-2">
                    <label className="text-lg font-semibold">Primary Goal</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {(Object.values(WorkoutGoal)).map(goal => {
                        const icons: {[key in WorkoutGoal]: React.ReactNode} = {
                            [WorkoutGoal.FatBurn]: <FlameIcon className="w-5 h-5"/>,
                            [WorkoutGoal.Stamina]: <RunIcon className="w-5 h-5"/>,
                            [WorkoutGoal.Footwork]: <StarIcon className="w-5 h-5"/>,
                            [WorkoutGoal.Strength]: <DumbbellIcon className="w-5 h-5"/>,
                            [WorkoutGoal.Freestyle]: <ZapIcon className="w-5 h-5"/>,
                        }
                        return (
                            <button
                            key={goal}
                            onClick={() => handlePreferenceChange('goal', goal)}
                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all ${preferences.goal === goal ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                            {icons[goal]}
                            <span className="text-xs font-semibold">{goal}</span>
                            </button>
                        )
                    })}
                    </div>
                </div>
                </div>
            </div>

            <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="mt-10 w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-orange-500/30"
            >
            {isLoading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Your Workout...
                </>
            ) : (
                <>
                <TargetIcon className="w-6 h-6" />
                Generate Workout
                </>
            )}
            </button>
        </div>
        }

        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </div>

      {isEditing && <EditableWorkoutPlan editor={editor} />}
    </div>
  );
};

export default WorkoutGenerator;
