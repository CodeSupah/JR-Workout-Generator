import { UserProfile } from '../types';
import { getUserProfile, saveUserProfile } from '../services/profileService';

type Listener = (profile: UserProfile | null) => void;

let profile: UserProfile | null = null;
const listeners: Set<Listener> = new Set();
let isInitialized = false;
let initializePromise: Promise<void> | null = null;

const broadcast = () => {
  listeners.forEach(listener => listener(profile ? { ...profile } : null));
};

const initializeProfile = async () => {
    if (isInitialized || initializePromise) {
        return initializePromise;
    }
    initializePromise = (async () => {
        profile = await getUserProfile();
        isInitialized = true;
        broadcast();
        initializePromise = null;
    })();
    return initializePromise;
};

export const profileStore = {
  setProfile: async (newProfile: UserProfile) => {
    profile = newProfile;
    await saveUserProfile(newProfile);
    broadcast();
  },
  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener);
    if (isInitialized) {
        listener(profile ? { ...profile } : null);
    } else {
        initializeProfile();
    }
    
    return () => {
      listeners.delete(listener);
    };
  },
  getProfile: (): UserProfile | null => {
    if (!isInitialized) {
        initializeProfile();
    }
    return profile ? { ...profile } : null;
  },
};

// Initialize the store as soon as the module is loaded
initializeProfile();
