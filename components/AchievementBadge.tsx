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
  
  const progressPercentage = Math.min((currentProgress / tier.goal) * 100, 100);

  const tooltipContent = (
    <div className="text-center">
      <p className="font-bold">{tier.name}</p>
      <p className="text-xs">{tier.description}</p>
      {!isUnlocked && (
        <p className="text-xs mt-1">
          Progress: {currentProgress} / {tier.goal}
        </p>
      )}
    </div>
  );
  
  return (
    <div className="relative group flex flex-col items-center gap-2 text-center">
      <div className={`relative w-16 h-16 flex items-center justify-center rounded-full transition-all duration-300 ${isUnlocked ? 'bg-yellow-500/20' : 'bg-gray-700'}`}>
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
      <span className={`text-xs font-semibold ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>{tier.name}</span>
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        {tooltipContent}
        <svg className="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
      </div>
    </div>
  );
};

export default AchievementBadge;
