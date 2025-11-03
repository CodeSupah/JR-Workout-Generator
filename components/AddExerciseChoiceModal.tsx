import React, { useMemo, useState, useEffect } from 'react';
import { SparklesIcon, BookOpenIcon, PlusIcon } from './icons/Icons';
import { WorkoutPlan, Exercise } from '../types';

type WorkoutSection = 'warmUp' | 'rounds' | 'coolDown';

type AddExerciseChoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (options: { type: 'suggestion' | 'library', groupEndIndex?: number }) => void;
  plan: WorkoutPlan | null;
  section: WorkoutSection | null;
};

type Step = 'target' | 'source';

interface SupersetGroup {
  name: string;
  endIndex: number;
}

const AddExerciseChoiceModal: React.FC<AddExerciseChoiceModalProps> = ({ isOpen, onClose, onSelect, plan, section }) => {
  const [step, setStep] = useState<Step>('target');
  const [selectedTarget, setSelectedTarget] = useState<{ groupEndIndex?: number } | null>(null);

  const supersetGroups = useMemo<SupersetGroup[]>(() => {
    if (!plan || section !== 'rounds') {
      return [];
    }
    const groups: SupersetGroup[] = [];
    let currentGroup: Exercise[] = [];

    plan.rounds.forEach((ex, index) => {
      currentGroup.push(ex);
      if (!ex.linkedToNext) {
        if (currentGroup.length > 1) {
          const lastEx = currentGroup[currentGroup.length - 1];
          groups.push({
            name: `SUPERSET (${lastEx.groupRounds || 1} Rounds)`,
            endIndex: index,
          });
        }
        currentGroup = [];
      }
    });

    return groups;
  }, [plan, section]);
  
  // Reset internal state when the modal is opened
  useEffect(() => {
    if (isOpen) {
        setStep('target');
        setSelectedTarget(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTargetSelect = (target: { groupEndIndex?: number }) => {
    setSelectedTarget(target);
    setStep('source');
  };

  const handleSourceSelect = (type: 'suggestion' | 'library') => {
    if (selectedTarget) {
      onSelect({ type, ...selectedTarget });
    }
  };

  const ActionButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }> = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
    >
      {icon}
      {label}
    </button>
  );
  
  const SourceButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    colorClass?: string;
  }> = ({ icon, label, onClick, colorClass = 'orange' }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 bg-${colorClass}-500/20 hover:bg-${colorClass}-500/40 text-${colorClass}-300 font-bold py-3 px-4 rounded-lg transition-colors`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60]" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700 flex items-center gap-4">
            {step === 'source' && (
                <button onClick={() => setStep('target')} className="text-gray-400 hover:text-white">&larr; Back</button>
            )}
            <h2 className="text-xl font-bold">
                {step === 'target' ? 'Where to add?' : 'Choose source'}
            </h2>
        </div>
        <div className="overflow-y-auto p-6 space-y-4">
            {step === 'target' ? (
                <>
                    <ActionButton icon={<PlusIcon className="w-5 h-5" />} label="Add New Standalone Exercise" onClick={() => handleTargetSelect({})} />
                    {supersetGroups.map(group => (
                        <ActionButton key={group.endIndex} icon={<PlusIcon className="w-5 h-5" />} label={`Add to ${group.name}`} onClick={() => handleTargetSelect({ groupEndIndex: group.endIndex })} />
                    ))}
                </>
            ) : (
                <>
                    <SourceButton icon={<SparklesIcon className="w-5 h-5" />} label="AI Suggestion" onClick={() => handleSourceSelect('suggestion')} colorClass="teal" />
                    <SourceButton icon={<BookOpenIcon className="w-5 h-5" />} label="From Library" onClick={() => handleSourceSelect('library')} />
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default AddExerciseChoiceModal;
