import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SkillLevel, WorkoutGoal, WorkoutPreferences, WorkoutPlan, Exercise, WorkoutEnvironment } from '../types';
import { generateWorkoutPlan } from '../services/geminiService';
import { DumbbellIcon, FlameIcon, RunIcon, StarIcon, TargetIcon, ZapIcon, EditIcon, RopeIcon, SparklesIcon, CogIcon, BuildingOfficeIcon, HomeIcon, ChevronDownIcon, StretchIcon } from './icons/Icons';
import { useWorkoutEditor } from '../hooks/useWorkoutEditor';
import EditableWorkoutPlan from './EditableWorkoutPlan';
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

// New component for selecting available equipment in 'Home Limited' mode
const HOME_EQUIPMENT_LIST = ['Dumbbells', 'Kettlebell', 'Resistance Bands', 'Jump Rope', 'Pull-up Bar'];

const HomeEquipmentSelector: React.FC<{ selected: string[], onChange: (selected: string[]) => void }> = ({ selected, onChange }) => {
  const handleToggle = (item: string) => {
    onChange(selected.includes(item) ? selected.filter(i => i !== item) : [...selected, item]);
  };

  return (
    <div className="space-y-2 animate-fade-in">
      <label className="text-lg font-semibold">Available Equipment (Select all that apply)</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {HOME_EQUIPMENT_LIST.map(item => (
          <label key={item} className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${selected.includes(item) ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}>
            <input
              type="checkbox"
              checked={selected.includes(item)}
              onChange={() => handleToggle(item)}
              className="w-4 h-4 rounded bg-gray-600 border-gray-500 text-orange-600 focus:ring-orange-500/50"
            />
            <span className="text-sm font-medium">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
};


const WorkoutGenerator: React.FC = () => {
  // Refactored state to align with new preference structure
  const [preferences, setPreferences] = useState<{ duration: number; skillLevel: SkillLevel; goal: WorkoutGoal; }>({
    duration: 20,
    skillLevel: SkillLevel.Beginner,
    goal: WorkoutGoal.GeneralFitness,
  });
  const [environment, setEnvironment] = useState<WorkoutEnvironment>(WorkoutEnvironment.Gym);
  const [homeEquipment, setHomeEquipment] = useState<string[]>(['Dumbbells', 'Jump Rope']);
  const [rounds, setRounds] = useState(3);
  const [includeWarmUp, setIncludeWarmUp] = useState(true);
  const [warmUpDuration, setWarmUpDuration] = useState(3);
  const [includeCoolDown, setIncludeCoolDown] = useState(true);
  const [coolDownDuration, setCoolDownDuration] = useState(2);
  const [defaultRestDuration, setDefaultRestDuration] = useState(60);
  const [useGlobalExerciseRest, setUseGlobalExerciseRest] = useState(true);
  
  const [originalPreferences, setOriginalPreferences] = useState<WorkoutPreferences | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const editor = useWorkoutEditor();
  
  // Helper to gather all state into the full preferences object for saving
  const getFullPreferencesForSaving = (): Omit<WorkoutPreferences, 'restBetweenRounds'> => ({
      ...preferences,
      environment,
      homeEquipment,
      rounds,
      includeWarmUp,
      warmUpDuration,
      includeCoolDown,
      coolDownDuration,
      defaultRestDuration,
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('workoutPreferences');
    if (savedPrefs) {
      const parsedPrefs = JSON.parse(savedPrefs);
      setPreferences({
          duration: parsedPrefs.duration || 20,
          skillLevel: parsedPrefs.skillLevel || SkillLevel.Beginner,
          goal: parsedPrefs.goal || WorkoutGoal.GeneralFitness,
      });
      setEnvironment(parsedPrefs.environment || WorkoutEnvironment.Gym);
      setHomeEquipment(parsedPrefs.homeEquipment || ['Dumbbells', 'Jump Rope']);
      setRounds(parsedPrefs.rounds || 3);
      setIncludeWarmUp(parsedPrefs.includeWarmUp !== undefined ? parsedPrefs.includeWarmUp : true);
      setWarmUpDuration(parsedPrefs.warmUpDuration || 3);
      setIncludeCoolDown(parsedPrefs.includeCoolDown !== undefined ? parsedPrefs.includeCoolDown : true);
      setCoolDownDuration(parsedPrefs.coolDownDuration || 2);
      setDefaultRestDuration(parsedPrefs.defaultRestDuration || 60);
      setUseGlobalExerciseRest(parsedPrefs.useGlobalExerciseRest !== undefined ? parsedPrefs.useGlobalExerciseRest : true);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workoutPreferences', JSON.stringify(getFullPreferencesForSaving()));
  }, [preferences, environment, homeEquipment, rounds, includeWarmUp, warmUpDuration, includeCoolDown, coolDownDuration, defaultRestDuration, useGlobalExerciseRest]);


  // Load a suggested plan from sessionStorage if available
  useEffect(() => {
    if (!editor.plan) {
      const savedSuggestedPlan = sessionStorage.getItem('suggestedWorkoutPlan');
      if (savedSuggestedPlan) {
        try {
          const { plan, preferences: savedPrefs, date } = JSON.parse(savedSuggestedPlan);
          const today = new Date().toISOString().split('T')[0];

          if (date === today) {
            editor.setExercises(plan);
            
            setPreferences({
              duration: savedPrefs.duration,
              skillLevel: savedPrefs.skillLevel,
              goal: savedPrefs.goal,
            });
            setEnvironment(savedPrefs.environment);
            setHomeEquipment(savedPrefs.homeEquipment);
            setRounds(savedPrefs.rounds);
            setIncludeWarmUp(savedPrefs.includeWarmUp);
            setWarmUpDuration(savedPrefs.warmUpDuration);
            setIncludeCoolDown(savedPrefs.includeCoolDown);
            setCoolDownDuration(savedPrefs.coolDownDuration);
            setDefaultRestDuration(savedPrefs.defaultRestDuration);
            setOriginalPreferences(savedPrefs as WorkoutPreferences);
            
            setIsEditing(true);
          } else {
            sessionStorage.removeItem('suggestedWorkoutPlan');
          }
        } catch (e) {
          console.error("Failed to parse suggested workout plan from sessionStorage", e);
          sessionStorage.removeItem('suggestedWorkoutPlan');
        }
      }
    }
  }, []); 


  // Gathers all state for AI generation, applying logic for global rest toggles
  const getFullPreferencesForGeneration = (): WorkoutPreferences => ({
      ...preferences,
      environment,
      homeEquipment: environment === WorkoutEnvironment.HomeLimited ? homeEquipment : [],
      rounds,
      includeWarmUp,
      warmUpDuration,
      includeCoolDown,
      coolDownDuration,
      defaultRestDuration: useGlobalExerciseRest ? defaultRestDuration : 0,
      restBetweenRounds: 0, // Let AI decide
  });
  
  const hasChanges = useMemo(() => {
    if (!originalPreferences) return false;
    return JSON.stringify(getFullPreferencesForGeneration()) !== JSON.stringify(originalPreferences);
  }, [preferences, environment, homeEquipment, rounds, includeWarmUp, warmUpDuration, includeCoolDown, coolDownDuration, defaultRestDuration, useGlobalExerciseRest, originalPreferences]);


  const handlePreferenceChange = <K extends keyof typeof preferences>(
    key: K,
    value: (typeof preferences)[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };
  
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
  
  const environmentOptions = [
    { id: WorkoutEnvironment.Gym, label: 'Full Gym / Weights', icon: <BuildingOfficeIcon className="w-5 h-5" /> },
    { id: WorkoutEnvironment.HomeLimited, label: 'Home Limited Equipment', icon: <HomeIcon className="w-5 h-5" /> },
    { id: WorkoutEnvironment.HomeBodyweight, label: 'Home Bodyweight Only', icon: <RunIcon className="w-5 h-5" /> },
  ];
  
  return (
    <div className={`max-w-4xl mx-auto ${isEditing ? 'pb-40' : 'pb-28'}`}>
      <div className={`bg-gray-800/50 p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-sm transition-all duration-500 ${isEditing ? 'mb-8' : ''}`}>
        <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-1">Let's build your workout</h2>
              <p className="text-gray-400 mb-6">Customize your session and let AI do the rest.</p>
            </div>
            {/* The 'Regenerate' button has been moved to EditableWorkoutPlan for better UX context */}
        </div>

        {/* Hide form when editing to focus on the plan */}
        <div className={`${isEditing ? 'hidden' : 'animate-fade-in'}`}>
            {/* REORDERED LAYOUT as per request */}
            <div className="space-y-6">
                
                {/* 1. Workout Environment */}
                <div>
                  <label className="text-lg font-semibold mb-2 block">Workout Environment</label>
                  <div className="grid grid-cols-3 gap-2 bg-gray-900/50 p-1 rounded-xl">
                    {environmentOptions.map(env => (
                      <button
                        key={env.id}
                        onClick={() => setEnvironment(env.id)}
                        className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                          environment === env.id
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        {env.icon}
                        <span className="text-xs sm:text-sm text-center sm:text-left">{env.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Skill Level */}
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
                
                {/* 3. Primary Goal */}
                <div className="space-y-2">
                    <label className="text-lg font-semibold">Primary Goal</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {(Object.values(WorkoutGoal)).map(goal => {
                        const icons: {[key in WorkoutGoal]: React.ReactNode} = {
                            [WorkoutGoal.MuscleGain]: <DumbbellIcon className="w-5 h-5"/>,
                            [WorkoutGoal.StrengthPower]: <ZapIcon className="w-5 h-5"/>,
                            [WorkoutGoal.FatLoss]: <FlameIcon className="w-5 h-5"/>,
                            [WorkoutGoal.GeneralFitness]: <RunIcon className="w-5 h-5"/>,
                            [WorkoutGoal.RecoveryMobility]: <StretchIcon className="w-5 h-5"/>,
                        }
                        return (
                            <button
                            key={goal}
                            onClick={() => handlePreferenceChange('goal', goal)}
                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg transition-all ${preferences.goal === goal ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-700 hover:bg-gray-600'}`}
                            >
                            {icons[goal]}
                            <span className="text-xs font-semibold text-center">{goal}</span>
                            </button>
                        )
                    })}
                    </div>
                </div>

                {/* 4. Conditional Equipment Selector */}
                {environment === WorkoutEnvironment.HomeLimited && (
                    <div className="animate-fade-in">
                        <HomeEquipmentSelector selected={homeEquipment} onChange={setHomeEquipment} />
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

                {/* Rounds Slider */}
                <div className="space-y-2">
                    <label className="text-lg font-semibold">Rounds / Circuits: <span className="text-orange-400">{rounds}</span></label>
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
                </div>

                {/* Rest Settings */}
                <div className="bg-gray-900/50 p-4 rounded-lg animate-fade-in">
                    <div className="space-y-3">
                        <ToggleSwitch
                            label="Global Rest Between Exercises"
                            description="Let AI decide if unchecked."
                            checked={useGlobalExerciseRest}
                            onChange={setUseGlobalExerciseRest}
                        />
                        {useGlobalExerciseRest && (
                            <div className="space-y-2 animate-fade-in pl-4 border-l-2 border-gray-700 ml-2">
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
                </div>

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

      {isEditing && <EditableWorkoutPlan editor={editor} originalPreferences={originalPreferences} onRegenerate={() => setIsEditing(false)} />}
    </div>
  );
};

export default WorkoutGenerator;