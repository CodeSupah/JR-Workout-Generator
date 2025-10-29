import React, { useEffect, useState } from 'react';
import { UnlockedAchievementInfo } from '../types';
import { MedalIcon } from './icons/Icons';

type AchievementUnlockedToastProps = {
  tier: UnlockedAchievementInfo;
  onDismiss: () => void;
};

const AchievementUnlockedToast: React.FC<AchievementUnlockedToastProps> = ({ tier, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const inTimer = setTimeout(() => setIsVisible(true), 100);
    // Animate out and then call dismiss
    const outTimer = setTimeout(() => {
        setIsVisible(false);
        const dismissTimer = setTimeout(onDismiss, 300); // Wait for animation
        return () => clearTimeout(dismissTimer);
    }, 5000);

    return () => {
        clearTimeout(inTimer);
        clearTimeout(outTimer);
    };
  }, [onDismiss]);

  const Icon = tier.icon;

  return (
    <div 
      className={`bg-gray-800 shadow-2xl rounded-xl pointer-events-auto ring-1 ring-yellow-500/50 overflow-hidden flex items-center p-4 space-x-4 transition-all duration-300 ease-in-out transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex-shrink-0 p-3 bg-yellow-500/20 rounded-full">
        <Icon className="w-8 h-8 text-yellow-400" />
      </div>
      <div>
        <p className="text-sm font-bold text-yellow-400 uppercase tracking-wide">Achievement Unlocked!</p>
        <p className="text-white font-semibold">{tier.name}</p>
      </div>
    </div>
  );
};

export default AchievementUnlockedToast;
