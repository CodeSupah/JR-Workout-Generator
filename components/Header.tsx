
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FlameIcon, ChartBarIcon, SparklesIcon } from './icons/Icons';

const Header: React.FC = () => {
  const commonLinkClass = "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200";
  const activeLinkClass = "bg-orange-500 text-white shadow-md";
  const inactiveLinkClass = "text-gray-300 hover:bg-white/10 hover:text-white";

  return (
    <header className="sticky top-0 z-10 bg-gray-900/70 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <FlameIcon className="w-8 h-8 text-orange-400" />
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Rope<span className="text-orange-400">Flow</span>
          </h1>
        </div>
        <nav className="flex items-center gap-2 md:gap-4 p-1 bg-gray-800 rounded-xl">
          <NavLink 
            to="/" 
            className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
          >
            <SparklesIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Generator</span>
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
          >
            <ChartBarIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Dashboard</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
