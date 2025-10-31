import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExerciseDetails } from '../types';
import { getAllExercises } from '../services/exerciseService';
import { BookOpenIcon, DumbbellIcon, RunIcon } from './icons/Icons';

type ViewMode = 'equipment' | 'muscleGroup';

const ExerciseList: React.FC = () => {
    const [exercises, setExercises] = useState<ExerciseDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All Muscles');
    const [viewMode, setViewMode] = useState<ViewMode | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExercises = async () => {
            setLoading(true);
            const data = await getAllExercises();
            setExercises(data);
            setLoading(false);
        };
        fetchExercises();
    }, []);

    const availableDifficulties = useMemo(() => ['Beginner', 'Intermediate', 'Advanced'], []);
    
    const equipmentCategories = useMemo(() => ['Barbell', 'Bodyweight', 'Dumbbell', 'Jump Rope', 'Kettlebell', 'Machine', 'Plate', 'Resistance Band'], []);
    
    const muscleGroupCategories = useMemo(() => {
        const muscleSet = new Set<string>();
        exercises.forEach(ex => {
            if (ex.category !== 'Flexibility & Mobility') {
                ex.muscleGroups.forEach(m => muscleSet.add(m));
            }
        });
        return ['All Muscles', 'Stretches', ...Array.from(muscleSet).sort()];
    }, [exercises]);

    const handleToggleFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setter(prev => 
            prev.includes(value) 
            ? prev.filter(item => item !== value) 
            : [...prev, value]
        );
    };
    
    const handleSetViewMode = (mode: ViewMode) => {
        if (viewMode !== mode) {
            setViewMode(mode);
            // Reset filters when changing view
            setSearchTerm('');
            setSelectedEquipment([]);
            setSelectedMuscleGroup('All Muscles');
            setSelectedDifficulties([]);
        }
    }

    const filteredExercises = useMemo(() => {
        return exercises.filter(ex => {
          const searchTermLower = searchTerm.toLowerCase();
          const searchMatch =
            searchTermLower === '' ||
            ex.name.toLowerCase().includes(searchTermLower) ||
            ex.category.toLowerCase().includes(searchTermLower) ||
            ex.muscleGroups.some(m => m.toLowerCase().includes(searchTermLower)) ||
            (ex.keywords && ex.keywords.some(k => k.toLowerCase().includes(searchTermLower)));
      
          if (!searchMatch) return false;
      
          if (viewMode === null) return true; // Only search matters if no view is selected
      
          const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(ex.difficulty);
          if (!difficultyMatch) return false;
      
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
              return ex.muscleGroups.includes(selectedMuscleGroup);
            }
          }
          return true;
        });
      }, [exercises, searchTerm, selectedDifficulties, selectedEquipment, selectedMuscleGroup, viewMode]);

      const groupedExercises = useMemo(() => {
        const grouped: Record<string, ExerciseDetails[]> = {};
    
        if (viewMode === 'equipment') {
          filteredExercises.forEach(ex => {
            let key = ex.equipment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            if (['Rope', 'Weighted Rope'].includes(key)) key = 'Jump Rope';
            if (['Cable Machine', 'Leg Press Machine'].includes(key)) key = 'Machine';
            if (ex.category === 'Flexibility & Mobility') key = 'Flexibility & Mobility';
    
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(ex);
          });
        } else if (viewMode === 'muscleGroup') {
          if (selectedMuscleGroup === 'Stretches') {
            if (filteredExercises.length > 0) grouped['Stretches'] = filteredExercises;
          } else {
            filteredExercises.forEach(ex => {
              if (ex.category !== 'Flexibility & Mobility') {
                ex.muscleGroups.forEach(muscle => {
                  if (selectedMuscleGroup === 'All Muscles' || selectedMuscleGroup === muscle) {
                    if (!grouped[muscle]) grouped[muscle] = [];
                    // Avoid duplicates if 'All Muscles' is selected
                    if (!grouped[muscle].some(e => e.id === ex.id)) {
                      grouped[muscle].push(ex);
                    }
                  }
                });
              }
            });
          }
        } else {
          // viewMode is null
          if (filteredExercises.length > 0) grouped['All Exercises'] = filteredExercises;
        }
    
        // Sort groups and exercises within groups
        const sortedGrouped: Record<string, ExerciseDetails[]> = {};
        Object.keys(grouped)
          .sort()
          .forEach(key => {
            sortedGrouped[key] = grouped[key].sort((a, b) => a.name.localeCompare(b.name));
          });
    
        return sortedGrouped;
      }, [filteredExercises, viewMode, selectedMuscleGroup]);
    
    const hasActiveFilters = searchTerm || selectedDifficulties.length > 0 || selectedEquipment.length > 0 || selectedMuscleGroup !== 'All Muscles';

    if (loading) {
        return <div className="text-center p-10">Loading exercises...</div>;
    }
    
    const FilterButton: React.FC<{ label: string; isSelected: boolean; onClick: () => void; }> = ({ label, isSelected, onClick }) => (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isSelected
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            }`}
        >
            {label}
        </button>
    );
    
    const results = Object.entries(groupedExercises);
    const hasResults = results.length > 0;

    return (
        <div className="space-y-8 animate-fade-in pb-24">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-white">Exercise Library</h1>
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64 bg-gray-800 border border-gray-700 text-white rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                </div>
            </div>
            
             {/* View Toggle */}
            <div className="bg-gray-800/50 p-4 rounded-xl space-y-3">
                <h3 className="font-semibold text-gray-300 text-sm">Organize By</h3>
                <div className="flex bg-gray-900/50 p-1 rounded-lg">
                    <button onClick={() => handleSetViewMode('equipment')} className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${viewMode === 'equipment' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                        <DumbbellIcon className="w-5 h-5" /> Equipment
                    </button>
                    <button onClick={() => handleSetViewMode('muscleGroup')} className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-semibold transition-colors ${viewMode === 'muscleGroup' ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>
                        <RunIcon className="w-5 h-5" /> Muscle Group
                    </button>
                </div>
            </div>

            {/* Filters */}
            {viewMode && (
                <div className="bg-gray-800/50 p-4 rounded-xl space-y-4 animate-fade-in">
                    <h3 className="font-semibold text-gray-300 text-sm">Filters</h3>
                    
                    <div>
                        <h4 className="font-medium text-gray-400 mb-2 text-xs">Difficulty</h4>
                        <div className="flex flex-wrap gap-2">
                            {availableDifficulties.map(diff => (
                                <FilterButton
                                    key={diff}
                                    label={diff}
                                    isSelected={selectedDifficulties.includes(diff)}
                                    onClick={() => handleToggleFilter(setSelectedDifficulties, diff)}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {viewMode === 'equipment' && (
                        <div>
                            <h4 className="font-medium text-gray-400 mb-2 text-xs">Equipment</h4>
                            <div className="flex flex-wrap gap-2">
                                {equipmentCategories.map(equip => (
                                    <FilterButton
                                        key={equip}
                                        label={equip}
                                        isSelected={selectedEquipment.includes(equip)}
                                        onClick={() => handleToggleFilter(setSelectedEquipment, equip)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {viewMode === 'muscleGroup' && (
                        <div>
                            <h4 className="font-medium text-gray-400 mb-2 text-xs">Muscle Group</h4>
                            <div className="flex flex-wrap gap-2">
                                {muscleGroupCategories.map(group => (
                                    <FilterButton
                                        key={group}
                                        label={group}
                                        isSelected={selectedMuscleGroup === group}
                                        onClick={() => setSelectedMuscleGroup(group)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {hasActiveFilters && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedDifficulties([]);
                                setSelectedEquipment([]);
                                setSelectedMuscleGroup('All Muscles');
                            }}
                            className="text-xs text-orange-400 hover:text-orange-300 font-semibold pt-2"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>
            )}

            {hasResults ? (
                <div className="space-y-8">
                     {viewMode === null ? (
                        <div className="bg-gray-800/50 p-6 rounded-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results[0][1].map(ex => (
                                    <Link
                                        key={ex.id}
                                        to={`/exercises/${ex.id}`}
                                        className="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600 hover:ring-2 hover:ring-orange-500 transition-all"
                                    >
                                        <h3 className="font-semibold text-white">{ex.name}</h3>
                                        <p className="text-sm text-gray-400 capitalize">{ex.difficulty} &bull; {ex.category}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        results.map(([groupName, exercisesInGroup]) => {
                            if (exercisesInGroup.length === 0) return null;
                            const groupColor = groupName === 'Stretches' || groupName === 'Flexibility & Mobility' ? 'text-teal-400' : 'text-orange-400';
                            return (
                                <div key={groupName} className="bg-gray-800/50 p-6 rounded-2xl animate-fade-in">
                                    <h2 className={`text-2xl font-bold ${groupColor} mb-4 border-b border-gray-700 pb-2`}>{groupName}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {exercisesInGroup.map(ex => (
                                            <Link
                                                key={ex.id}
                                                to={`/exercises/${ex.id}`}
                                                className="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600 hover:ring-2 hover:ring-orange-500 transition-all"
                                            >
                                                <h3 className="font-semibold text-white">{ex.name}</h3>
                                                <p className="text-sm text-gray-400 capitalize">{ex.difficulty} &bull; {ex.category}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            ) : (
                <div className="text-center p-10 bg-gray-800/50 rounded-lg">
                    <BookOpenIcon className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2">No Exercises Found</h2>
                    <p className="text-gray-400">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default ExerciseList;