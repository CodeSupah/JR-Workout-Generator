import React from 'react';
import { HomeIcon, DumbbellIcon, BandIcon, FlameIcon, RunIcon, RopeIcon, BriefcaseIcon, BuildingOfficeIcon } from '../components/icons/Icons';

export interface ProgramCategory {
  name: string;
  icon: React.FC<{className?: string}>;
  color: string;
}

export const PROGRAM_CATEGORIES: ProgramCategory[] = [
  { name: "At Home", icon: HomeIcon, color: "text-blue-400" },
  { name: "Travel", icon: BriefcaseIcon, color: "text-green-400" },
  { name: "Dumbbells Only", icon: DumbbellIcon, color: "text-teal-400" },
  { name: "Band Only", icon: BandIcon, color: "text-indigo-400" },
  { name: "Cardio & HIIT", icon: FlameIcon, color: "text-red-400" },
  { name: "Gym", icon: BuildingOfficeIcon, color: "text-pink-400" },
  { name: "Bodyweight Only", icon: RunIcon, color: "text-yellow-400" },
  { name: "Jump Rope Only", icon: RopeIcon, color: "text-orange-400" },
];
