import React, { useState, useEffect } from 'react';
import { getWorkoutHistory } from '../services/workoutService';
import { SessionSummary } from '../types';
import StatsChart from './StatsChart';

type Period = 'Day' | 'Week' | 'Month' | 'Year';

// Date utility functions
const getWeekRange = (offset: number) => {
    const now = new Date();
    now.setDate(now.getDate() + offset * 7);
    const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
    const startOfWeek = new Date(now);
    // Set to Monday of the current week
    startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const label = offset === 0 ? 'This Week' : offset === -1 ? 'Last Week' : startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' - ' + endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return { start: startOfWeek, end: endOfWeek, label };
};

const getDayRange = (offset: number) => {
    const now = new Date();
    now.setDate(now.getDate() + offset);
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const label = offset === 0 ? 'Today' : offset === -1 ? 'Yesterday' : now.toLocaleDateString('en-US', { weekday: 'long' });
    return { start: startOfDay, end: endOfDay, label };
};

const getMonthRange = (offset: number) => {
    const now = new Date();
    now.setMonth(now.getMonth() + offset);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
    
    const label = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return { start: startOfMonth, end: endOfMonth, label };
};

const getYearRange = (offset: number) => {
    const now = new Date();
    const year = now.getFullYear() + offset;
    const startOfYear = new Date(year, 0, 1);
    startOfYear.setHours(0,0,0,0);
    const endOfYear = new Date(year, 11, 31);
    endOfYear.setHours(23, 59, 59, 999);
    
    const label = year.toString();
    return { start: startOfYear, end: endOfYear, label };
};


const ActivityOverview: React.FC = () => {
    const [period, setPeriod] = useState<Period>('Week');
    const [offset, setOffset] = useState(0);
    const [history, setHistory] = useState<SessionSummary[]>([]);
    const [chartData, setChartData] = useState<{ name: string; minutes: number }[]>([]);
    const [periodLabel, setPeriodLabel] = useState('');

    useEffect(() => {
        // FIX: getWorkoutHistory is a synchronous function, so we don't need to use .then()
        setHistory(getWorkoutHistory());
    }, []);

    useEffect(() => {
        if (!history) return;

        let range: { start: Date; end: Date; label: string; };
        let data: { name: string; minutes: number }[] = [];

        switch (period) {
            case 'Day':
                range = getDayRange(offset);
                data = Array.from({ length: 6 }, (_, i) => ({ name: `${i*4}h`, minutes: 0 })); // 4-hour chunks
                history
                    .filter(s => { const d = new Date(s.date); return d >= range.start && d <= range.end; })
                    .forEach(s => {
                        const hour = new Date(s.date).getHours();
                        const chunkIndex = Math.floor(hour / 4);
                        if (data[chunkIndex]) {
                            data[chunkIndex].minutes += Math.floor(s.totalTime / 60);
                        }
                    });
                data.forEach((d, i) => d.name = `${i*4}:00`);
                break;
            case 'Week':
                range = getWeekRange(offset);
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                data = days.map(day => ({ name: day, minutes: 0 }));
                history
                    .filter(s => { const d = new Date(s.date); return d >= range.start && d <= range.end; })
                    .forEach(s => {
                        const dayIndex = new Date(s.date).getDay();
                        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Mon = 0
                        data[adjustedIndex].minutes += Math.floor(s.totalTime / 60);
                    });
                break;
            case 'Month':
                range = getMonthRange(offset);
                const weeksInMonth = Math.ceil(range.end.getDate() / 7);
                data = Array.from({ length: weeksInMonth }, (_, i) => ({ name: `Wk ${i + 1}`, minutes: 0 }));
                 history
                    .filter(s => { const d = new Date(s.date); return d >= range.start && d <= range.end; })
                    .forEach(s => {
                        const weekOfMonth = Math.ceil(new Date(s.date).getDate() / 7);
                        if (data[weekOfMonth-1]) {
                             data[weekOfMonth - 1].minutes += Math.floor(s.totalTime / 60);
                        }
                    });
                break;
            case 'Year':
                range = getYearRange(offset);
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                data = months.map(month => ({ name: month, minutes: 0 }));
                history
                    .filter(s => { const d = new Date(s.date); return d >= range.start && d <= range.end; })
                    .forEach(s => {
                        const monthIndex = new Date(s.date).getMonth();
                        data[monthIndex].minutes += Math.floor(s.totalTime / 60);
                    });
                break;
        }
        
        setChartData(data);
        setPeriodLabel(range.label);

    }, [period, offset, history]);
    
    const handlePeriodChange = (newPeriod: Period) => {
        setPeriod(newPeriod);
        setOffset(0); // Reset to current period when changing view
    };
    
    const isNextDisabled = offset >= 0;

    return (
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Activity Overview</h3>
            
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setOffset(offset - 1)} className="p-2 rounded-full hover:bg-gray-700 transition-colors">&lt;</button>
                <span className="font-semibold text-lg">{periodLabel}</span>
                <button onClick={() => setOffset(offset + 1)} disabled={isNextDisabled} className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">&gt;</button>
            </div>

            <div className="grid grid-cols-4 gap-2 bg-gray-900/50 p-1 rounded-xl mb-6">
                {(['Day', 'Week', 'Month', 'Year'] as Period[]).map(p => (
                    <button
                        key={p}
                        onClick={() => handlePeriodChange(p)}
                        className={`py-2 px-2 rounded-lg text-sm font-medium transition-all ${
                            period === p
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>
            
            <div className="h-72">
                <StatsChart data={chartData} />
            </div>
        </div>
    );
};

export default ActivityOverview;