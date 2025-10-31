import React, { useRef, useEffect } from 'react';
import { SessionItem } from '../utils/workoutUtils';
import { CheckCircleIcon, PauseIcon, RunIcon, FlameIcon, SparklesIcon } from './icons/Icons';

type VerticalTimelineProps = {
  items: SessionItem[];
  currentIndex: number;
};

const TimelineItem: React.FC<{ item: SessionItem, isPast: boolean, isCurrent: boolean }> = ({ item, isPast, isCurrent }) => {
    const itemRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (isCurrent) {
            itemRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [isCurrent]);

    const getIcon = () => {
        if (item.isRest) return <PauseIcon className="w-4 h-4" />;
        if (item.purpose === 'warmup') return <FlameIcon className="w-4 h-4" />;
        if (item.purpose === 'cooldown') return <SparklesIcon className="w-4 h-4" />;
        return <RunIcon className="w-4 h-4" />;
    };
    
    return (
        <div ref={itemRef} className={`relative pl-8 transition-all duration-300 ${isPast ? 'opacity-40' : 'opacity-100'}`}>
            {/* Dot and Line */}
            <div className="absolute left-0 top-1 flex flex-col items-center h-full">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCurrent ? 'bg-orange-500 ring-4 ring-orange-500/30' : 'bg-gray-600'}`}>
                    {isPast ? <CheckCircleIcon className="w-5 h-5 text-green-400" /> : getIcon()}
                </div>
                 <div className="w-0.5 h-full bg-gray-600 mt-1"></div>
            </div>
            
            {/* Content */}
            <div className={`py-1 transform transition-transform duration-300 ${isCurrent ? 'scale-105' : 'scale-100'}`}>
                <p className={`font-semibold truncate ${isCurrent ? 'text-orange-300' : 'text-white'}`}>
                    {item.exercise}
                </p>
                <p className="text-xs text-gray-400">
                    {item.isRest ? `${item.duration}s Rest` : (
                        item.unit === 'reps' ? `${item.reps} reps` : `${item.duration}s`
                    )}
                </p>
            </div>
        </div>
    );
};


const VerticalTimeline: React.FC<VerticalTimelineProps> = ({ items, currentIndex }) => {
  if (items.length === 0) {
    return null;
  }
  
  const purposeDisplayMap: Record<SessionItem['purpose'], string> = {
      warmup: 'Warm-up',
      main: 'Main Workout',
      cooldown: 'Cool-down',
  };

  return (
    <div className="h-full bg-gray-900/50 backdrop-blur-md flex flex-col pt-20 pb-8 overflow-hidden">
        <h3 className="text-lg font-bold text-center text-gray-300 mb-4 px-2">Workout Plan</h3>
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 md:px-6">
            <div className="relative">
                {items.map((item, index) => {
                    const prevItem = items[index - 1];
                    const showHeader = !prevItem || item.purpose !== prevItem.purpose;
                    
                    return (
                        <React.Fragment key={`${item.id}-${index}`}>
                            {showHeader && (
                                <div className="pt-4 pb-2 sticky top-0 bg-transparent z-10">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>
                                        {purposeDisplayMap[item.purpose]}
                                    </h4>
                                </div>
                            )}
                            <TimelineItem 
                                item={item}
                                isPast={index < currentIndex}
                                isCurrent={index === currentIndex}
                            />
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
         <style>{`
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `}</style>
    </div>
  );
};

export default VerticalTimeline;