import React from 'react';
import { Achievement, AchievementTier, UserAchievement } from '../types';
import { MedalIcon } from './icons/Icons';

type AchievementBadgeProps = {
  achievement: Achievement;
  tier: AchievementTier;
  userProgress?: UserAchievement;
};

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, tier, userProgress }) => {
  const isUnlocked = userProgress?.unlockedTiers.some(ut => ut.tier === tier.tier) || false;
  const currentProgress = userProgress?.currentProgress || 0;
  
  const progressPercentage = tier.goal > 0 ? Math.min((currentProgress / tier.goal) * 100, 100) : 0;
  
  return (
    <div className="flex flex-col items-center text-center">
      {/* Icon with progress ring */}
      <div className={`relative w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 ${isUnlocked ? 'bg-yellow-500/20' : 'bg-gray-700'}`}>
        <MedalIcon className={`w-10 h-10 ${isUnlocked ? 'text-yellow-400' : 'text-gray-500'}`} />
        {!isUnlocked && (
          <svg className="absolute w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-gray-600"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="text-orange-500"
              strokeDasharray={`${progressPercentage}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {/* Text content */}
      <div className="mt-2 text-center">
        <p className={`text-xs font-semibold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>{tier.name}</p>
        <p className="text-[11px] text-gray-400 leading-tight mt-1">{tier.description}</p>
        {!isUnlocked && (
          <p className="text-xs font-mono text-gray-500 mt-1">
            {currentProgress} / {tier.goal}
          </p>
        )}
      </div>
    </div>
  );
};

export default AchievementBadge;