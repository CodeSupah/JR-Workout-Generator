import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExerciseDetails } from '../types';
import { getAllExercises } from '../services/exerciseService';
import { BookOpenIcon } from './icons/Icons';

const ExerciseList: React.FC = () => {
    const [exercises, setExercises] = useState<ExerciseDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
    const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
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
    const availableEquipment = useMemo(() => {
        const equipmentSet = new Set(exercises.map(ex => ex.equipment));
        return Array.from(equipmentSet).sort().map(e => e.replace(/-/g, ' '));
    }, [exercises]);

    const handleToggleFilter = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setter(prev => 
            prev.includes(value) 
            ? prev.filter(item => item !== value) 
            : [...prev, value]
        );
    };

    const filteredAndGroupedExercises = useMemo(() => {
        const filtered = exercises.filter(ex => {
            // 1. Search term filter
            const searchTermLower = searchTerm.toLowerCase();
            const searchMatch = searchTermLower === '' ||
                ex.name.toLowerCase().includes(searchTermLower) ||
                ex.category.toLowerCase().includes(searchTermLower) ||
                ex.muscleGroups.some(m => m.toLowerCase().includes(searchTermLower)) ||
                (ex.keywords && ex.keywords.some(k => k.toLowerCase().includes(searchTermLower)));

            // 2. Difficulty filter
            const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(ex.difficulty);

            // 3. Equipment filter
            const equipmentMatch = selectedEquipment.length === 0 || selectedEquipment.includes(ex.equipment.replace(/-/g, ' '));
            
            return searchMatch && difficultyMatch && equipmentMatch;
        });

        return filtered.reduce((acc, ex) => {
            const category = ex.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(ex);
            return acc;
        }, {} as Record<string, ExerciseDetails[]>);
    }, [exercises, searchTerm, selectedDifficulties, selectedEquipment]);
    
    const hasActiveFilters = searchTerm || selectedDifficulties.length > 0 || selectedEquipment.length > 0;

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

            {/* Filters */}
            <div className="bg-gray-800/50 p-4 rounded-xl space-y-4">
                <div>
                    <h3 className="font-semibold text-gray-300 mb-2 text-sm">Difficulty</h3>
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
                <div>
                    <h3 className="font-semibold text-gray-300 mb-2 text-sm">Equipment</h3>
                    <div className="flex flex-wrap gap-2">
                         {availableEquipment.map(equip => (
                            <FilterButton
                                key={equip}
                                label={equip.charAt(0).toUpperCase() + equip.slice(1)}
                                isSelected={selectedEquipment.includes(equip)}
                                onClick={() => handleToggleFilter(setSelectedEquipment, equip)}
                            />
                        ))}
                    </div>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedDifficulties([]);
                            setSelectedEquipment([]);
                        }}
                        className="text-xs text-orange-400 hover:text-orange-300 font-semibold pt-2"
                    >
                        Clear All Filters
                    </button>
                )}
            </div>

            {Object.keys(filteredAndGroupedExercises).length > 0 ? (
                Object.entries(filteredAndGroupedExercises).map(([category, exercisesInCategory]) => (
                    <div key={category} className="bg-gray-800/50 p-6 rounded-2xl">
                        <h2 className="text-xl font-bold text-orange-400 mb-4">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {exercisesInCategory.map(ex => (
                                <Link
                                    key={ex.id}
                                    to={`/exercises/${ex.id}`}
                                    className="block bg-gray-700 p-4 rounded-lg hover:bg-gray-600 hover:ring-2 hover:ring-orange-500 transition-all"
                                >
                                    <h3 className="font-semibold text-white">{ex.name}</h3>
                                    <p className="text-sm text-gray-400 capitalize">{ex.difficulty} &bull; {ex.equipment.replace(/-/g, ' ')}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))
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