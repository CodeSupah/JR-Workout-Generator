import { UserProfile, FitnessObjective, Units } from '../types';

const PROFILE_KEY = 'jump-user-profile';

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
      console.error("Failed to parse user profile, returning default.", e);
  }
  
  // Default profile for a new user
  return {
    name: 'Sarah',
    email: 'sarah@jumpapp.com',
    joinDate: new Date().toISOString(),
    avatar: null,
    gender: 'Prefer not to say',
    dob: null,
    height: 170, // cm
    weight: 65, // kg
    primaryGoal: FitnessObjective.FitnessMaintenance,
    preferences: {
      units: 'Metric',
      sound: {
        voiceCues: true,
        voiceVolume: 0.8,
        effects: true,
        effectsVolume: 0.6,
      },
      notifications: {
        reminders: true,
        achievements: true,
        challenges: true,
      },
      adaptiveDifficulty: false,
    },
  };
};

export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};