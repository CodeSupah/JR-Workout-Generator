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
import StepperInput from './StepperInput';
import ToggleSwitch from './ToggleSwitch';

const formatTime = (totalSeconds: number): string => {
  if (totalSeconds < 0) return '0s';
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (seconds === 0) {
    return `${minutes}m`;
  }
  return `${minutes}m ${seconds}s`;
};


const WorkoutGenerator: React.FC = () => {
  const [preferences, setPreferences] = useState<Omit<WorkoutPreferences, 'mode' | 'includeJumpRopeIntervals' | 'rounds' | 'availableEquipment' | 'includeWarmUp' | 'warmUpDuration' | 'includeCoolDown' | 'coolDownDuration' | 'defaultRestDuration' | 'restBetweenRounds'>>({
    duration: 15,
    skillLevel: SkillLevel.Beginner,
    goal: WorkoutGoal.FullBody,
    equipment: [Equipment.Regular],
  });
  const [mode, setMode] = useState<WorkoutMode>('jump-rope');
  const [includeIntervals, setIncludeIntervals] = useState(false);
  const [rounds, setRounds] = useState(3);
  const [availableEquipment, setAvailableEquipment] = useState<string[]>(['Dumbbell']);
  const [includeWarmUp, setIncludeWarmUp] = useState(true);
  const [warmUpDuration, setWarmUpDuration] = useState(3);
  const [includeCoolDown, setIncludeCoolDown] = useState(true);
  const [coolDownDuration, setCoolDownDuration] = useState(2);
  const [defaultRestDuration, setDefaultRestDuration] = useState(60);
  const [restBetweenRounds, setRestBetweenRounds] = useState(120);
  const [useGlobalExerciseRest, setUseGlobalExerciseRest] = useState(true);
  const [useGlobalRoundRest, setUseGlobalRoundRest] = useState(true);
  
  const [originalPreferences, setOriginalPreferences] = useState<WorkoutPreferences | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const editor = useWorkoutEditor();
  
  const getFullPreferencesForSaving = () => ({
      ...preferences,
      mode,
      includeJumpRopeIntervals: includeIntervals,
      rounds,
      availableEquipment,
      includeWarmUp,
      warmUpDuration,
      includeCoolDown,
      coolDownDuration,
      defaultRestDuration,
      restBetweenRounds,
      useGlobalExerciseRest,
      useGlobalRoundRest,
  });

  useEffect(() => {
    const savedPrefs = localStorage.getItem('workoutPreferences');
    if (savedPrefs) {
      const parsedPrefs = JSON.parse(savedPrefs);
      setPreferences({
          duration: parsedPrefs.duration || 15,
          skillLevel: parsedPrefs.skillLevel || SkillLevel.Beginner,
          goal: parsedPrefs.goal || WorkoutGoal.FullBody,
          equipment: parsedPrefs.equipment || [Equipment.Regular],
      });
      setMode(parsedPrefs.mode || 'jump-rope');
      setIncludeIntervals(parsedPrefs.includeJumpRopeIntervals || false);
      setRounds(parsedPrefs.rounds || 3);
      setAvailableEquipment(parsedPrefs.availableEquipment || ['Dumbbell']);
      setIncludeWarmUp(parsedPrefs.includeWarmUp !== undefined ? parsedPrefs.includeWarmUp : true);
      setWarmUpDuration(parsedPrefs.warmUpDuration || 3);
      setIncludeCoolDown(parsedPrefs.includeCoolDown !== undefined ? parsedPrefs.includeCoolDown : true);
      setCoolDownDuration(parsedPrefs.coolDownDuration || 2);
      setDefaultRestDuration(parsedPrefs.defaultRestDuration || 60);
      setRestBetweenRounds(parsedPrefs.restBetweenRounds || 120);
      setUseGlobalExerciseRest(parsedPrefs.useGlobalExerciseRest !== undefined ? parsedPrefs.useGlobalExerciseRest : true);
      setUseGlobalRoundRest(parsedPrefs.useGlobalRoundRest !== undefined ? parsedPrefs.useGlobalRoundRest : true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('workoutPreferences', JSON.stringify(getFullPreferencesForSaving()));
  }, [preferences, mode, includeIntervals, rounds, availableEquipment, includeWarmUp, warmUpDuration, includeCoolDown, coolDownDuration, defaultRestDuration, restBetweenRounds, useGlobalExerciseRest, useGlobalRoundRest]);


  useEffect(() => {
    // Only run if no workout is currently being edited.
    if (!editor.plan) {
      const savedSuggestedPlan = sessionStorage.getItem('suggestedWorkoutPlan');
      if (savedSuggestedPlan) {
        try {
          const { plan, preferences: savedPrefs, date } = JSON.parse(savedSuggestedPlan);
          const today = new Date().toISOString().split('T')[0];

          if (date === today) {
            editor.setExercises(plan);
            
            // Update the generator's form state to match the loaded plan's preferences
            setPreferences({
              duration: savedPrefs.duration,
              skillLevel: savedPrefs.skillLevel,
              goal: savedPrefs.goal,
              equipment: savedPrefs.equipment,
            });
            setMode(savedPrefs.mode);
            setIncludeIntervals(savedPrefs.includeJumpRopeIntervals);
            setRounds(savedPrefs.rounds);
            setAvailableEquipment(savedPrefs.availableEquipment);
            setIncludeWarmUp(savedPrefs.includeWarmUp);
            setWarmUpDuration(savedPrefs.warmUpDuration);
            setIncludeCoolDown(savedPrefs.includeCoolDown);
            setCoolDownDuration(savedPrefs.coolDownDuration);
            setDefaultRestDuration(savedPrefs.defaultRestDuration);
            setRestBetweenRounds(savedPrefs.restBetweenRounds);

            // Set original preferences to prevent "Update Workout" button from being active immediately
            setOriginalPreferences(savedPrefs as WorkoutPreferences);
            
            setIsEditing(true);
          } else {
            // Plan is from a previous day, remove it.
            sessionStorage.removeItem('suggestedWorkoutPlan');
          }
        } catch (e) {
          console.error("Failed to parse suggested workout plan from sessionStorage", e);
          sessionStorage.removeItem('suggestedWorkoutPlan');
        }
      }
    }
  }, []); // Run only on mount.


  const getFullPreferencesForGeneration = (): WorkoutPreferences => ({
      ...preferences,
      mode,
      includeJumpRopeIntervals: includeIntervals,
      rounds,
      availableEquipment,
      includeWarmUp,
      warmUpDuration,
      includeCoolDown,
      coolDownDuration,
      defaultRestDuration: useGlobalExerciseRest ? defaultRestDuration : 0,
      restBetweenRounds: useGlobalRoundRest ? restBetweenRounds : 0,
  });
  
  const hasChanges = useMemo(() => {
    if (!originalPreferences) return false;
    return JSON.stringify(getFullPreferencesForGeneration()) !== JSON.stringify(originalPreferences);
  }, [preferences, mode, includeIntervals, rounds, availableEquipment, includeWarmUp, warmUpDuration, includeCoolDown, coolDownDuration, defaultRestDuration, restBetweenRounds, useGlobalExerciseRest, useGlobalRoundRest, originalPreferences]);


  const handlePreferenceChange = <K extends keyof Omit<WorkoutPreferences, 'mode' | 'includeJumpRopeIntervals' | 'rounds' | 'availableEquipment' | 'includeWarmUp' | 'warmUpDuration' | 'includeCoolDown' | 'coolDownDuration' | 'defaultRestDuration' | 'restBetweenRounds'>>(
    key: K,
    value: Omit<WorkoutPreferences, 'mode' | 'includeJumpRopeIntervals' | 'rounds' | 'availableEquipment' | 'includeWarmUp' | 'warmUpDuration' | 'includeCoolDown' | 'coolDownDuration' | 'defaultRestDuration' | 'restBetweenRounds'>[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  
  const handleRopeTypeChange = (rope: Equipment) => {
      setPreferences(prev => {
          const newEquipment = prev.equipment.includes(rope)
            ? prev.equipment.filter(r => r !== rope)
            : [...prev.equipment, rope];
          // Ensure at least one rope is selected
          if (newEquipment.length === 0) newEquipment.push(rope);
          return { ...prev, equipment: newEquipment };
      })
  }

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setIsEditing(false);
    editor.reset();

    try {
      const fullPreferences: WorkoutPreferences = getFullPreferencesForGeneration();
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
    <div className={`max-w-4xl mx-auto ${isEditing ? 'pb-40' : 'pb-28'}`}>
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
                <WorkoutModeToggle selectedMode={mode} onModeChange={setMode} />
                
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
                        <EquipmentSelector selectedEquipment={availableEquipment} onChange={setAvailableEquipment} />
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
                            <input type="checkbox" id="include-intervals" className="sr-only peer" checked={includeIntervals} onChange={(e) => setIncludeIntervals(e.target.checked)} />
                            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-500/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                    </div>
                )}

                {/* Warm-up & Cool-down Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 p-4 rounded-lg animate-fade-in space-y-3">
                        <ToggleSwitch
                            label="Include Warm-up"
                            description="Recommended to prevent injury."
                            checked={includeWarmUp}
                            onChange={setIncludeWarmUp}
                        />
                        {includeWarmUp && (
                            <div className="space-y-2 animate-fade-in pl-4 border-l-2 border-gray-700 ml-2">
                                <label className="text-sm font-medium">Warm-up Duration: <span className="text-orange-400">{warmUpDuration} mins</span></label>
                                <input
                                    type="range" min="1" max="10" step="1"
                                    value={warmUpDuration}
                                    onChange={(e) => setWarmUpDuration(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-orange-500"
                                />
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-900/50 p-4 rounded-lg animate-fade-in space-y-3">
                        <ToggleSwitch
                            label="Include Cool-down"
                            description="Aids in muscle recovery."
                            checked={includeCoolDown}
                            onChange={setIncludeCoolDown}
                        />
                        {includeCoolDown && (
                            <div className="space-y-2 animate-fade-in pl-4 border-l-2 border-gray-700 ml-2">
                                <label className="text-sm font-medium">Cool-down Duration: <span className="text-blue-400">{coolDownDuration} mins</span></label>
                                <input
                                    type="range" min="1" max="10" step="1"
                                    value={coolDownDuration}
                                    onChange={(e) => setCoolDownDuration(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-blue-500"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Rest Settings */}
                <div className="bg-gray-900/50 p-4 rounded-lg animate-fade-in space-y-4">
                    <h3 className="font-semibold text-white">Rest Settings</h3>
                     <div className="space-y-2">
                        <ToggleSwitch
                            label="Global Rest Between Exercises"
                            checked={useGlobalExerciseRest}
                            onChange={setUseGlobalExerciseRest}
                        />
                        {useGlobalExerciseRest && (
                            <div className="pl-4 border-l-2 border-gray-700 ml-2 animate-fade-in space-y-2">
                                <label className="text-sm font-medium">Duration: <span className="text-orange-400">{formatTime(defaultRestDuration)}</span></label>
                                <StepperInput
                                    value={defaultRestDuration}
                                    onChange={setDefaultRestDuration}
                                    step={5}
                                    min={0}
                                    aria-label="Rest between exercises in seconds"
                                />
                            </div>
                        )}
                    </div>
                     <div className="space-y-2">
                        <ToggleSwitch
                            label="Global Rest Between Rounds"
                            checked={useGlobalRoundRest}
                            onChange={setUseGlobalRoundRest}
                        />
                        {useGlobalRoundRest && (
                             <div className="pl-4 border-l-2 border-gray-700 ml-2 animate-fade-in space-y-2">
                                <label className="text-sm font-medium">Duration: <span className="text-orange-400">{formatTime(restBetweenRounds)}</span></label>
                                <StepperInput
                                    value={restBetweenRounds}
                                    onChange={setRestBetweenRounds}
                                    step={15}
                                    min={0}
                                    aria-label="Rest between rounds in seconds"
                                />
                            </div>
                        )}
                    </div>
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
                    onChange={(e) => setRounds(parseInt(e.target.value))}
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
                            [WorkoutGoal.FullBody]: <RunIcon className="w-5 h-5"/>,
                            [WorkoutGoal.CardioEndurance]: <FlameIcon className="w-5 h-5"/>,
                            [WorkoutGoal.Power]: <ZapIcon className="w-5 h-5"/>,
                            [WorkoutGoal.CoreStrength]: <TargetIcon className="w-5 h-5"/>,
                            [WorkoutGoal.Freestyle]: <StarIcon className="w-5 h-5"/>,
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

      {isEditing && <EditableWorkoutPlan editor={editor} originalPreferences={originalPreferences} />}
    </div>
  );
};

export default WorkoutGenerator;
