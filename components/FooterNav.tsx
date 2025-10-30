import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, DumbbellIcon, ChartBarIcon, UserIcon } from './icons/Icons';

const FooterNav: React.FC = () => {
  const commonLinkClass = "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors duration-200 flex-1";
  const activeLinkClass = "text-orange-400";
  const inactiveLinkClass = "text-gray-400 hover:text-white";

  const navItems = [
    { to: "/", label: "Home", icon: <HomeIcon className="w-6 h-6" />, end: true },
    { to: "/workout", label: "Workout", icon: <DumbbellIcon className="w-6 h-6" /> },
    { to: "/profile", label: "Profile", icon: <UserIcon className="w-6 h-6" /> },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 bg-gray-900/80 backdrop-blur-md border-t border-gray-700">
      <nav className="container mx-auto flex justify-around items-center p-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </footer>
  );
};

export default FooterNav;