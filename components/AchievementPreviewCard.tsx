import React from 'react';

interface AchievementPreviewCardProps {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  progress?: number;
  goal?: number;
}

const AchievementPreviewCard: React.FC<AchievementPreviewCardProps> = ({ icon: Icon, title, description, progress, goal }) => {
  const isUnlocked = progress === undefined;
  const progressPercent = (progress !== undefined && goal && goal > 0) ? Math.min((progress / goal) * 100, 100) : 0;

  return (
    <div className="bg-gray-700/50 p-4 rounded-lg flex items-start gap-4">
      <div className={`flex-shrink-0 p-2 rounded-full ${isUnlocked ? 'bg-yellow-500/20' : 'bg-gray-900/50'}`}>
        <Icon className={`w-6 h-6 ${isUnlocked ? 'text-yellow-400' : 'text-gray-400'}`} />
      </div>
      <div className="flex-1">
        <p className="font-bold text-white">{title}</p>
        <p className="text-sm text-gray-400">{description}</p>
        {!isUnlocked && goal && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{progress} / {goal}</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1.5">
              <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementPreviewCard;
