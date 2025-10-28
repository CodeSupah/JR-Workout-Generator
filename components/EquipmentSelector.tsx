import React from 'react';
import { DumbbellIcon, BandIcon, KettlebellIcon, RunIcon } from './icons/Icons';

type EquipmentSelectorProps = {
  selectedEquipment: string[];
  onChange: (selected: string[]) => void;
};

const EQUIPMENT_LIST: { category: string; icon: React.ReactNode; items: string[] }[] = [
  {
    category: 'Free Weights',
    icon: <DumbbellIcon className="w-5 h-5" />,
    items: ['Dumbbell', 'Kettlebell', 'Barbell'],
  },
  {
    category: 'Bands',
    icon: <BandIcon className="w-5 h-5" />,
    items: ['Resistance Band'],
  },
   {
    category: 'General',
    icon: <RunIcon className="w-5 h-5" />,
    items: ['gym'], // Special keyword for full gym access
  },
];

const EquipmentSelector: React.FC<EquipmentSelectorProps> = ({ selectedEquipment, onChange }) => {
  const handleToggle = (item: string) => {
    const isSelected = selectedEquipment.includes(item);
    if (isSelected) {
      onChange(selectedEquipment.filter(i => i !== item));
    } else {
      onChange([...selectedEquipment, item]);
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-lg font-semibold">Available Equipment</label>
      <div className="space-y-3">
        {EQUIPMENT_LIST.map(({ category, icon, items }) => (
          <div key={category} className="bg-gray-900/50 p-4 rounded-lg">
            <h3 className="flex items-center gap-2 font-semibold text-orange-400 mb-3">
              {icon}
              {category}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {items.map(item => {
                  const isSelected = selectedEquipment.includes(item);
                  const label = item === 'gym' ? 'Full Gym Access' : item;
                  return (
                    <label
                        key={item}
                        className={`flex items-center gap-2 p-3 rounded-md cursor-pointer transition-all ${ isSelected ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggle(item)}
                            className="w-4 h-4 rounded bg-gray-600 border-gray-500 text-orange-600 focus:ring-orange-500/50"
                        />
                        <span className="text-sm font-medium">{label}</span>
                    </label>
                  )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentSelector;