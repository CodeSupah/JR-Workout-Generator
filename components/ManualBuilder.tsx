import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon } from './icons/Icons';

const ManualBuilder: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-24">
      <Link to="/workout" className="text-sm text-orange-400 hover:underline mb-4 inline-block">
        &larr; Back to Workout Hub
      </Link>
      <div className="bg-gray-800/50 p-8 rounded-2xl text-center">
        <SparklesIcon className="w-16 h-16 mx-auto text-orange-400 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Manual Workout Builder</h1>
        <p className="text-gray-400">This feature is coming soon!</p>
        <p className="text-gray-400 mt-2">
          Soon you'll be able to create your own workouts from scratch, adding any exercise you want.
        </p>
      </div>
    </div>
  );
};

export default ManualBuilder;
