import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChartProps {
  data: { name: string; minutes: number }[];
}

const StatsChart: React.FC<ChartProps> = ({ data }) => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
        barSize={20}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
        <XAxis dataKey="name" tick={{ fill: '#A0AEC0' }} stroke="#4A5568" />
        <YAxis tick={{ fill: '#A0AEC0' }} stroke="#4A5568" />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1A202C',
            border: '1px solid #4A5568',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: '#F7FAFC' }}
        />
        <Bar dataKey="minutes" fill="#F97316" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.name === today ? '#FB923C' : '#F97316'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StatsChart;
