import React, { useMemo, useState } from 'react';
import { Exercise, ExerciseDetails, WorkoutPreferences, SkillLevel, Equipment, WorkoutType } from '../types';
import { EXERCISE_DATABASE } from '../data/exerciseDatabase';
import { SparklesIcon, DumbbellIcon, RunIcon } from './icons/Icons';

type ExerciseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exerciseData: Omit<Exercise, 'id' | 'status'>) => void;
  mode: 'add' | 'replace';
  exerciseToEdit?: Exercise;
  purposeFilter?: 'warmup' | 'cooldown' | 'main';
  originalPreferences?: WorkoutPreferences | null;
  defaultRest?: number;
};

const ExerciseModal: React.FC<ExerciseModalProps> = ({ isOpen, onClose, onSelectExercise, mode, exerciseToEdit, purposeFilter, originalPreferences, defaultRest = 15 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'equipment' | 'muscleGroup' | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All Muscles');
  const [selectedWorkoutTypes, setSelectedWorkoutTypes] = useState<string[]>([]);


  const availableDifficulties = useMemo(() => ['Beginner', 'Intermediate', 'Advanced'], []);
  const availableWorkoutTypes = useMemo<WorkoutType[]>(() => ['Compound', 'Isolation', 'Cardio/HIIT', 'Mobility/Stretch', 'Core/Accessory'], []);
  
  const availableEquipment = useMemo(() => {
    const equipmentSet = new Set(
      EXERCISE_DATABASE
        .filter(ex => purposeFilter ? ex.purpose === purposeFilter : true)
        .map(ex => ex.equipment)
    );
    // A bit of custom logic to group similar equipment for a cleaner filter UI
    const mapped = Array.from(equipmentSet).map(e => {
      if (['rope', 'weighted-rope'].includes(e)) return 'Jump Rope';
      if (['cable-machine', 'leg-press-machine'].includes(e)) return 'Machine';
      return e.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    });
    return [...new Set(mapped)].sort();
  }, [purposeFilter]);

  const muscleGroupCategories = useMemo(() => {
    const muscleSet = new Set<string>();
    EXERCISE_DATABASE.forEach(ex => {
        if (purposeFilter && ex.purpose !== purposeFilter) return;
        if (ex.category !== 'Flexibility & Mobility') {
            ex.muscleGroups.forEach(m => muscleSet.add(m));
        }
    });
    const stretchesAvailable = EXERCISE_DATABASE.some(ex => ex.purpose === purposeFilter && ex.category === 'Flexibility & Mobility');
    const baseGroups = ['All Muscles'];
    if (stretchesAvailable) baseGroups.push('Stretches');
    return [...baseGroups, ...Array.from(muscleSet).sort()];
  }, [purposeFilter]);

  const recommendedExercises = useMemo(() => {
    if (!originalPreferences || !purposeFilter) return [];

    if (purposeFilter === 'warmup' || purposeFilter === 'cooldown') {
        return EXERCISE_DATABASE.filter(ex => {
            if (ex.purpose !== purposeFilter) return false;
            if (ex.category !== 'Flexibility & Mobility') return false;
            if (exerciseToEdit && ex.name === exerciseToEdit.exercise) return false;
            return true;
        }).slice(0, 9);
    }

    const prefs = originalPreferences;
    
    return EXERCISE_DATABASE.filter(ex => {
        if (ex.purpose !== 'main') return false;

        const skillMap: Record<SkillLevel, ExerciseDetails['difficulty'][]> = {
            [SkillLevel.Beginner]: ['Beginner'],
            [SkillLevel.Intermediate]: ['Beginner', 'Intermediate'],
            [SkillLevel.Advanced]: ['Beginner', 'Intermediate', 'Advanced'],
        };
        if (!skillMap[prefs.skillLevel].includes(ex.difficulty)) return false;

        const userEquipmentLower = prefs.availableEquipment.map(e => e.toLowerCase().replace(/ /g, '-'));
        const ropeTypeToEquipmentMap: { [key in Equipment]: 'rope' | 'weighted-rope' } = {
            [Equipment.Regular]: 'rope',
            [Equipment.Speed]: 'rope',
            [Equipment.Weighted]: 'weighted-rope',
        };
        const availableRopeEquipment = [...new Set(prefs.equipment.map(r => ropeTypeToEquipmentMap[r]))];

        let equipmentMatch = false;
        switch (prefs.mode) {
            case 'jump-rope':
                if (availableRopeEquipment.includes(ex.equipment as any)) equipmentMatch = true;
                break;
            case 'equipment':
                const gymEquipmentTypes = ['dumbbell', 'resistance-band', 'kettlebell', 'barbell', 'cable-machine', 'leg-press-machine'];
                if (userEquipmentLower.includes('gym')) {
                    if (gymEquipmentTypes.includes(ex.equipment) || ex.equipment === 'bodyweight') equipmentMatch = true;
                } else {
                    if (userEquipmentLower.includes(ex.equipment) || ex.equipment === 'bodyweight') equipmentMatch = true;
                }
                if (prefs.includeJumpRopeIntervals && ex.equipment === 'rope') equipmentMatch = true;
                break;
            case 'no-equipment':
                if (ex.equipment === 'bodyweight') equipmentMatch = true;
                if (prefs.includeJumpRopeIntervals && ex.equipment === 'rope') equipmentMatch = true;
                break;
        }
        if (!equipmentMatch) return false;
        if (exerciseToEdit && ex.name === exerciseToEdit.exercise) return false;

        return true;
    }).slice(0, 9);
  }, [originalPreferences, purposeFilter, exerciseToEdit]);

  const handleToggleFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
      setter(prev => 
          prev.includes(value) 
          ? prev.filter(item => item !== value) 
          : [...prev, value]
      );
  };
  
  const handleSetViewMode = (mode: 'equipment' | 'muscleGroup') => {
      if (viewMode !== mode) {
          setViewMode(mode);
          setSearchTerm(''); // Fix: Reset search term on view change
          setSelectedEquipment([]);
          setSelectedMuscleGroup('All Muscles');
          setSelectedDifficulties([]);
          setSelectedWorkoutTypes([]);
      }
  };

  const filteredExercises = useMemo(() => {
    return EXERCISE_DATABASE.filter(ex => {
      const purposeMatch = purposeFilter ? ex.purpose === purposeFilter : true;
      if (!purposeMatch) return false;
  
      const searchTermLower = searchTerm.toLowerCase();
      const searchMatch =
        searchTermLower === '' ||
        ex.name.toLowerCase().includes(searchTermLower) ||
        (ex.keywords && ex.keywords.some(k => k.toLowerCase().includes(searchTermLower)));
      if (!searchMatch) return false;
  
      if (!viewMode) return true; // Only purpose and search matter if no view mode
  
      const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(ex.difficulty);
      if (!difficultyMatch) return false;

      const workoutTypeMatch = selectedWorkoutTypes.length === 0 || selectedWorkoutTypes.includes(ex.workoutType);
      if (!workoutTypeMatch) return false;
  
      if (viewMode === 'equipment') {
        return (
          selectedEquipment.length === 0 ||
          selectedEquipment.some(selected => {
            const selectedFormatted = selected.toLowerCase().replace(/ /g, '-');
            if (selected === 'Jump Rope') return ['rope', 'weighted-rope'].includes(ex.equipment);
            if (selected === 'Machine') return ['cable-machine', 'leg-press-machine'].includes(ex.equipment);
            return ex.equipment === selectedFormatted;
          })
        );
      }
  
      if (viewMode === 'muscleGroup') {
        if (selectedMuscleGroup === 'Stretches') {
          return ex.category === 'Flexibility & Mobility';
        }
        if (selectedMuscleGroup !== 'All Muscles') {
          return ex.muscleGroups.includes(selectedMuscleGroup) && ex.category !== 'Flexibility & Mobility';
        }
      }
      return true;
    });
  }, [purposeFilter, searchTerm, selectedDifficulties, selectedEquipment, selectedMuscleGroup, viewMode, selectedWorkoutTypes]);

  const categorizedSuggestions = useMemo(() => {
    const grouped: { [key: string]: ExerciseDetails[] } = {};

    if (!viewMode) {
        if (filteredExercises.length > 0) grouped['All Exercises'] = filteredExercises;
    } else if (viewMode === 'equipment') {
        filteredExercises.forEach(ex => {
            let key = ex.equipment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            if (['Rope', 'Weighted Rope'].includes(key)) key = 'Jump Rope';
            if (['Cable Machine', 'Leg Press Machine'].includes(key)) key = 'Machine';
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(ex);
        });
    } else { // 'muscleGroup' view
        if (selectedMuscleGroup === 'Stretches') {
            if (filteredExercises.length > 0) grouped['Stretches'] = filteredExercises;
        } else {
            filteredExercises.forEach(ex => {
                if (ex.category !== 'Flexibility & Mobility') {
                    ex.muscleGroups.forEach(muscle => {
                        if (selectedMuscleGroup === 'All Muscles' || selectedMuscleGroup === muscle) {
                            if (!grouped[muscle]) grouped[muscle] = [];
                            if (!grouped[muscle].some(e => e.id === ex.id)) {
                                grouped[muscle].push(ex);
                            }
                        }
                    });
                }
            });
        }
    }
    
    const sortedGrouped: { [key: string]: ExerciseDetails[] } = {};
    const categoryOrder = ['Bodyweight', 'Jump Rope', 'Resistance Band', 'Dumbbell', 'Kettlebell', 'Barbell', 'Machine'];
    const sortedKeys = Object.keys(grouped).sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return a.localeCompare(b);
    });

    sortedKeys.forEach(key => {
        sortedGrouped[key] = grouped[key].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return Object.entries(sortedGrouped);
  }, [filteredExercises, viewMode, selectedMuscleGroup]);

  if (!isOpen) return null;

  const handleSelect = (exerciseName: string) => {
    const selectedExercise = EXERCISE_DATABASE.find(ex => ex.name === exerciseName);
    if (!selectedExercise) return;
    
    const difficultyMap: Record<ExerciseDetails['difficulty'], Exercise['difficulty']> = {
        'Beginner': 'Easy',
        'Intermediate': 'Medium',
        'Advanced': 'Hard'
    };

    const fullExerciseData: Omit<Exercise, 'id' | 'status'> = {
        exercise: selectedExercise.name,
        duration: 45, // Default for new exercises
        rest: defaultRest, // Default for new exercises
        equipment: selectedExercise.equipment,
        difficulty: difficultyMap[selectedExercise.difficulty],
    };
    onSelectExercise(fullExerciseData);
    onClose();
  };
  
  const handleSurpriseMe = () => {
    const listToUse = recommendedExercises.length > 0 ? recommendedExercises : filteredExercises;
    if (listToUse.length === 0) return;
    const randomExercise = listToUse[Math.floor(Math.random() * listToUse.length)];
    handleSelect(randomExercise.name);
  }
  
  const FilterButton: React.FC<{ label: string; isSelected: boolean; onClick: () => void; }> = ({ label, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            isSelected
            ? 'bg-orange-500 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        }`}
    >
        {label}
    </button>
  );

  const title = mode === 'add' ? 'Add Exercise' : `Replace "${exerciseToEdit?.exercise}"`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl flex flex-col" onClick={e => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-700 flex-shrink-0">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{title}</h2>
                <button type="button" onClick={handleSurpriseMe} className="flex items-center gap-2 text-sm bg-orange-500/20 text-orange-300 hover:bg-orange-500/40 px-3 py-1.5 rounded-md">
                    <SparklesIcon className="w-4 h-4" />
                    Surprise Me
                </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {mode === 'replace' && recommendedExercises.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-bold text-lg text-green-400 mb-3">Recommended For You</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {recommendedExercises.map(ex => (
                            <button key={ex.id} type="button" onClick={() => handleSelect(ex.name)} className="p-3 bg-gray-700 hover:bg-green-500 text-left rounded-lg text-sm transition-colors truncate" title={ex.name}>
                                {ex.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {mode === 'replace' && recommendedExercises.length > 0 && (
                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-700" /></div>
                    <div className="relative flex justify-center"><span className="bg-gray-800 px-3 text-lg font-medium text-gray-300">Full Library</span></div>
                </div>
            )}
            
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 text-white rounded-lg py-2 px-4 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                
                <div className="space-y-2">
                    <h3 className="font-semibold text-gray-400 text-xs">Organize By</h3>
                    <div className="flex bg-gray-900/50 p-1 rounded-lg">
                        <button onClick={() => handleSetViewMode('equipment')} className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${viewMode === 'equipment' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                            <DumbbellIcon className="w-5 h-5" /> Equipment
                        </button>
                        <button onClick={() => handleSetViewMode('muscleGroup')} className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${viewMode === 'muscleGroup' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                            <RunIcon className="w-5 h-5" /> Muscle Group
                        </button>
                    </div>
                </div>
                
                {viewMode && (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <h4 className="font-semibold text-gray-400 mb-2 text-xs">Difficulty</h4>
                            <div className="flex flex-wrap gap-2">
                                {availableDifficulties.map(diff => (
                                    <FilterButton key={diff} label={diff} isSelected={selectedDifficulties.includes(diff)} onClick={() => handleToggleFilter(setSelectedDifficulties, diff)} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-400 mb-2 text-xs">Workout Type</h4>
                            <div className="flex flex-wrap gap-2">
                                {availableWorkoutTypes.map(type => (
                                    <FilterButton key={type} label={type} isSelected={selectedWorkoutTypes.includes(type)} onClick={() => handleToggleFilter(setSelectedWorkoutTypes, type)} />
                                ))}
                            </div>
                        </div>
                        {viewMode === 'equipment' && (
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-400 mb-2 text-xs">Equipment</h4>
                                <div className="flex flex-wrap gap-2">
                                    {availableEquipment.map(equip => (
                                        <FilterButton key={equip} label={equip} isSelected={selectedEquipment.includes(equip)} onClick={() => handleToggleFilter(setSelectedEquipment, equip)} />
                                    ))}
                                </div>
                            </div>
                        )}
                         {viewMode === 'muscleGroup' && (
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-400 mb-2 text-xs">Muscle Group</h4>
                                <div className="flex flex-wrap gap-2">
                                    {muscleGroupCategories.map(group => (
                                        <FilterButton key={group} label={group} isSelected={selectedMuscleGroup === group} onClick={() => setSelectedMuscleGroup(group)} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {categorizedSuggestions.length > 0 ? (
                    categorizedSuggestions.map(([category, exercises]) => (
                        <div key={category}>
                            <h3 className="font-bold text-orange-400 mb-2">{category}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                {exercises.map(ex => (
                                    <button
                                        key={ex.name}
                                        type="button"
                                        onClick={() => handleSelect(ex.name)}
                                        className="p-3 bg-gray-700 hover:bg-orange-500 text-left rounded-lg text-sm transition-colors truncate"
                                        title={ex.name}
                                    >
                                        {ex.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400 py-8">
                        <p className="font-semibold">No exercises match your filters.</p>
                        <p className="text-sm">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
          </div>
          <div className="bg-gray-700/50 px-6 py-3 flex justify-end gap-3 border-t border-gray-700 flex-shrink-0">
            <button type="button" onClick={onClose} className="py-2 px-4 rounded-md text-white hover:bg-gray-600">Cancel</button>
          </div>
      </div>
    </div>
  );
};

export default ExerciseModal;