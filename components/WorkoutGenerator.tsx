import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkillLevel, WorkoutGoal, Equipment, WorkoutPreferences, WorkoutPlan, Exercise, WorkoutMode } from '../types';
import { generateWorkoutPlan } from '../services/geminiService';
import { DumbbellIcon, FlameIcon, RunIcon, StarIcon, TargetIcon, ZapIcon, EditIcon, RopeIcon, SparklesIcon, CogIcon } from './icons/Icons';
import { useWorkoutEditor } from '../hooks/useWorkoutEditor';
import EditableWorkoutPlan from './EditableWorkoutPlan';
import WorkoutModeToggle from './WorkoutModeToggle';
import EquipmentSelector from './EquipmentSelector';
import { toastStore } from '../store/toastStore';

const WorkoutGenerator: React.FC = () => {
  const [preferences, setPreferences] = useState<Omit<WorkoutPreferences, 'mode' | 'includeJumpRopeIntervals' | 'rounds' | 'availableEquipment' | 'includeWarmUp' | 'warmUpDuration'>>({
    duration: 15,
    skillLevel: SkillLevel.Beginner,
    goal: WorkoutGoal.FatBurn,
    equipment: [Equipment.Regular],
  });
  const [mode, setMode] = useState<WorkoutMode>('jump-rope');
  const [includeIntervals, setIncludeIntervals] = useState(false);
  const [rounds, setRounds] = useState(3);
  const [availableEquipment, setAvailableEquipment] = useState<string[]>(['Dumbbell']);
  const [includeWarmUp, setIncludeWarmUp] = useState(true);
  const [warmUpDuration, setWarmUpDuration] = useState(3);
  
  const [originalPreferences, setOriginalPreferences] = useState<WorkoutPreferences | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const editor = useWorkoutEditor();
  
  const savePreferencesToLocalStorage = (prefsToSave: any) => {
    localStorage.setItem('workoutPreferences', JSON.stringify(prefsToSave));
  }

  useEffect(() => {
    const savedPrefs = localStorage.getItem('workoutPreferences');
    if (savedPrefs) {
      const parsedPrefs = JSON.parse(savedPrefs);
      setPreferences({
          duration: parsedPrefs.duration || 15,
          skillLevel: parsedPrefs.skillLevel || SkillLevel.Beginner,
          goal: parsedPrefs.goal || WorkoutGoal.FatBurn,
          equipment: parsedPrefs.equipment || [Equipment.Regular],
      });
      setMode(parsedPrefs.mode || 'jump-rope');
      setIncludeIntervals(parsedPrefs.includeJumpRopeIntervals || false);
      setRounds(parsedPrefs.rounds || 3);
      setAvailableEquipment(parsedPrefs.availableEquipment || ['Dumbbell']);
      setIncludeWarmUp(parsedPrefs.includeWarmUp !== undefined ? parsedPrefs.includeWarmUp : true);
      setWarmUpDuration(parsedPrefs.warmUpDuration || 3);
    }
  }, []);

  const getFullPreferences = (): WorkoutPreferences => ({
      ...preferences,
      mode,
      includeJumpRopeIntervals: includeIntervals,
      rounds,
      availableEquipment,
      includeWarmUp,
      warmUpDuration,
  });
  
  const hasChanges = useMemo(() => {
    if (!originalPreferences) return false;
    return JSON.stringify(getFullPreferences()) !== JSON.stringify(originalPreferences);
  }, [preferences, mode, includeIntervals, rounds, availableEquipment, includeWarmUp, warmUpDuration, originalPreferences]);


  const handlePreferenceChange = <K extends keyof Omit<WorkoutPreferences, 'mode' | 'includeJumpRopeIntervals' | 'rounds' | 'availableEquipment' | 'includeWarmUp' | 'warmUpDuration'>>(
    key: K,
    value: Omit<WorkoutPreferences, 'mode' | 'includeJumpRopeIntervals' | 'rounds' | 'availableEquipment' | 'includeWarmUp' | 'warmUpDuration'>[K]
  ) => {
    setPreferences(prev => {
        const newPreferences = { ...prev, [key]: value };
        savePreferencesToLocalStorage({ ...getFullPreferences(), ...newPreferences });
        return newPreferences;
    });
  };
  
  const handleRopeTypeChange = (rope: Equipment) => {
      setPreferences(prev => {
          const newEquipment = prev.equipment.includes(rope)
            ? prev.equipment.filter(r => r !== rope)
            : [...prev.equipment, rope];
          // Ensure at least one rope is selected
          if (newEquipment.length === 0) newEquipment.push(rope);
          const newPrefs = { ...prev, equipment: newEquipment };
          savePreferencesToLocalStorage({ ...getFullPreferences(), ...newPrefs });
          return newPrefs;
      })
  }
  
  const handleStateChange = (setter: React.Dispatch<React.SetStateAction<any>>, value: any) => {
      setter(value);
      // This is a bit tricky due to state closure, so we pass the new value directly
      const currentPrefs = getFullPreferences();
      // A bit of a hacky way to get the key name from the setter function name
      const key = (setter.toString().match(/set(\w+)/) || [])[1];
      if (key) {
        const stateKey = key.charAt(0).toLowerCase() + key.slice(1);
        savePreferencesToLocalStorage({ ...currentPrefs, [stateKey]: value });
      }
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setIsEditing(false);
    editor.reset();

    try {
      const fullPreferences: WorkoutPreferences = getFullPreferences();
      const plan = await generateWorkoutPlan(fullPreferences);
      editor.setExercises(plan);
      setOriginalPreferences(fullPreferences);
      setIsEditing(true);
    } catch (err: any) {
      setError(err.message || 'Failed to generate workout. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isUpdating = editor.plan && !isEditing;
  
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
                Edit Preferences
              </button>
            )}
        </div>

        {/* Hide form when editing to focus on the plan */}
        <div className={`${isEditing ? 'hidden' : 'animate-fade-in'}`}>
            <div className="space-y-6">
                <WorkoutModeToggle selectedMode={mode} onModeChange={(v) => handleStateChange(setMode, v)} />
                
                {mode === 'jump-rope' && (
                    <div className="space-y-2 animate-fade-in">
                        <label className="text-lg font-semibold">Rope Type (select multiple)</label>
                        <div className="grid grid-cols-3 gap-2">
                        {(Object.values(Equipment)).map(equip => (
                            <button
                            key={equip}
                            onClick={() => handleRopeTypeChange(equip)}
                            className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${preferences.equipment.includes(equip) ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                            {equip}
                            </button>
                        ))}
                        </div>
                    </div>
                )}
                
                {mode === 'equipment' && (
                    <div className="animate-fade-in">
                        <EquipmentSelector selectedEquipment={availableEquipment} onChange={(v) => handleStateChange(setAvailableEquipment, v)} />
                    </div>
                )}
                
                {(mode === 'equipment' || mode === 'no-equipment') && (
                     <div className="bg-gray-900/50 p-4 rounded-lg flex items-center justify-between animate-fade-in">
                        <div className="flex items-center gap-3">
                            <RopeIcon className="w-6 h-6 text-orange-400" />
                            <div>
                                <label htmlFor="include-intervals" className="font-semibold text-white">Include Jump Rope Intervals</label>
                                <p className="text-xs text-gray-400">Add cardio bursts between sets.</p>
                            </div>
                        </div>
                        <label htmlFor="include-intervals" className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="include-intervals" className="sr-only peer" checked={includeIntervals} onChange={(e) => handleStateChange(setIncludeIntervals, e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                )}

                {/* Warm-up Settings */}
                <div className="bg-gray-900/50 p-4 rounded-lg animate-fade-in space-y-3">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <FlameIcon className="w-6 h-6 text-orange-400" />
                            <div>
                                <label htmlFor="include-warmup" className="font-semibold text-white">Include Warm-up</label>
                                <p className="text-xs text-gray-400">Recommended to prevent injury.</p>
                            </div>
                        </div>
                        <label htmlFor="include-warmup" className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="include-warmup" className="sr-only peer" checked={includeWarmUp} onChange={(e) => handleStateChange(setIncludeWarmUp, e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                    {includeWarmUp && (
                        <div className="space-y-2 animate-fade-in">
                            <label className="text-sm font-medium">Warm-up Duration: <span className="text-orange-400">{warmUpDuration} mins</span></label>
                            <input
                                type="range" min="1" max="10" step="1"
                                value={warmUpDuration}
                                onChange={(e) => handleStateChange(setWarmUpDuration, parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-orange-500"
                            />
                        </div>
                    )}
                </div>
               
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

                {/* Rounds Slider */}
                <div className="space-y-2">
                    <label className="text-lg font-semibold">Rounds / Sets: <span className="text-orange-400">{rounds}</span></label>
                    <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={rounds}
                    onChange={(e) => handleStateChange(setRounds, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-orange-500"
                    />
                </div>

                {/* Skill Level */}
                <div className="md:col-span-2 space-y-2">
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
            
            <div className="mt-10 flex gap-4">
                {isUpdating && (
                     <button
                        onClick={() => setIsEditing(true)}
                        className="w-1/3 bg-gray-600 hover:bg-gray-500 text-white font-bold py-4 px-6 rounded-lg text-lg transition-transform transform hover:scale-105"
                     >
                        Cancel
                     </button>
                )}
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-800 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg shadow-orange-500/30"
                >
                    {isLoading ? (
                        <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                        </>
                    ) : (
                        <>
                        <CogIcon className="w-6 h-6" />
                        {isUpdating && hasChanges ? 'Update Workout' : 'Generate Workout'}
                        </>
                    )}
                </button>
            </div>
        </div>
        
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </div>

      {isEditing && <EditableWorkoutPlan editor={editor} />}
    </div>
  );
};

export default WorkoutGenerator;