import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UserProfile, WorkoutGoal } from '../types';
import { getUserProfile, saveUserProfile } from '../services/profileService';
import { toastStore } from '../store/toastStore';
import { CameraIcon, ChevronDownIcon, UserIcon } from './icons/Icons';
import ToggleSwitch from './ToggleSwitch';

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [initialProfile, setInitialProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            const data = await getUserProfile();
            setProfile(data);
            setInitialProfile(data);
            setIsLoading(false);
        };
        loadProfile();
    }, []);

    const hasChanges = useMemo(() => {
        return JSON.stringify(profile) !== JSON.stringify(initialProfile);
    }, [profile, initialProfile]);

    const handleInputChange = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
        setProfile(prev => prev ? { ...prev, [key]: value } : null);
    };

    const handleNestedChange = (path: string, value: any) => {
        setProfile(prev => {
            if (!prev) return null;
            const keys = path.split('.');
            const newProfile = JSON.parse(JSON.stringify(prev));
            let current = newProfile;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newProfile;
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                handleInputChange('avatar', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSave = async () => {
        if (!profile) return;
        await saveUserProfile(profile);
        setInitialProfile(profile);
        
        // Sync primary goal with workout generator defaults
        try {
            const savedPrefsRaw = localStorage.getItem('workoutPreferences');
            const savedPrefs = savedPrefsRaw ? JSON.parse(savedPrefsRaw) : {};
            savedPrefs.goal = profile.primaryGoal;
            localStorage.setItem('workoutPreferences', JSON.stringify(savedPrefs));
        } catch(e) { console.error("Could not sync goal to workout prefs", e)}


        toastStore.addToast('Profile updated successfully!');
    };

    const handleReset = () => {
        setProfile(initialProfile);
    };
    
    // Unit conversion helpers
    const displayWeight = profile?.preferences.units === 'Imperial'
        ? (profile.weight * 2.20462).toFixed(1)
        : profile?.weight.toString();
    const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (isNaN(value) || !profile) return;
        const newWeightInKg = profile.preferences.units === 'Imperial' ? value / 2.20462 : value;
        handleInputChange('weight', newWeightInKg);
    }
    
    const displayHeight = profile?.preferences.units === 'Imperial'
        ? (profile.height / 2.54).toFixed(1)
        : profile?.height.toString();
    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (isNaN(value) || !profile) return;
        const newHeightInCm = profile.preferences.units === 'Imperial' ? value * 2.54 : value;
        handleInputChange('height', newHeightInCm);
    }


    if (isLoading || !profile) {
        return <div className="text-center p-10">Loading profile...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-40">
            <h1 className="text-3xl font-bold text-white">Profile & Preferences</h1>
            
            {/* My Profile Section */}
            <div className="bg-gray-800/50 p-6 rounded-2xl">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                            {profile.avatar ? (
                                <img src={profile.avatar} alt="User avatar" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-12 h-12 text-gray-500" />
                            )}
                        </div>
                         <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-0 right-0 p-1.5 bg-orange-500 rounded-full text-white hover:bg-orange-600">
                            <CameraIcon className="w-4 h-4" />
                        </button>
                        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </div>
                    <div className="flex-1 w-full text-center sm:text-left">
                        <input type="text" value={profile.name} onChange={e => handleInputChange('name', e.target.value)} className="text-2xl font-bold bg-transparent border-b-2 border-gray-700 focus:border-orange-500 outline-none w-full" />
                        <p className="text-gray-400">{profile.email}</p>
                        <p className="text-xs text-gray-500 mt-1">Joined: {new Date(profile.joinDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Personal Details */}
            <div className="bg-gray-800/50 p-6 rounded-2xl space-y-4">
                 <h2 className="text-xl font-bold">Personal Details</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="date" value={profile.dob || ''} onChange={e => handleInputChange('dob', e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Gender</label>
                        <div className="select-wrapper">
                            <select value={profile.gender} onChange={e => handleInputChange('gender', e.target.value as UserProfile['gender'])}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Non-binary</option>
                                <option>Prefer not to say</option>
                            </select>
                            <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Weight ({profile.preferences.units === 'Metric' ? 'kg' : 'lbs'})</label>
                        <input type="number" value={displayWeight} onChange={handleWeightChange} />
                    </div>
                    <div className="form-group">
                        <label>Height ({profile.preferences.units === 'Metric' ? 'cm' : 'in'})</label>
                        <input type="number" value={displayHeight} onChange={handleHeightChange} />
                    </div>
                    <div className="form-group md:col-span-2">
                        <label>Primary Fitness Goal</label>
                        <div className="select-wrapper">
                             <select value={profile.primaryGoal} onChange={e => handleInputChange('primaryGoal', e.target.value as WorkoutGoal)}>
                                {Object.values(WorkoutGoal).map(goal => <option key={goal}>{goal}</option>)}
                            </select>
                            <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                 </div>
            </div>

            {/* App Preferences */}
            <div className="bg-gray-800/50 p-6 rounded-2xl space-y-4">
                <h2 className="text-xl font-bold">App Preferences</h2>
                <div className="space-y-4">
                    <div>
                        <label className="font-semibold text-white mb-2 block">Units</label>
                        <div className="flex gap-2">
                            {(['Metric', 'Imperial'] as const).map(unit => (
                                <button key={unit} onClick={() => handleNestedChange('preferences.units', unit)} className={`py-2 px-4 rounded-lg text-sm font-medium flex-1 ${profile.preferences.units === unit ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>{unit}</button>
                            ))}
                        </div>
                    </div>
                    <ToggleSwitch label="Enable Voice Cues" description="Spoken guidance during workouts." checked={profile.preferences.sound.voiceCues} onChange={v => handleNestedChange('preferences.sound.voiceCues', v)} />
                    <ToggleSwitch label="Enable Sound Effects" description="Beeps and sounds for transitions." checked={profile.preferences.sound.effects} onChange={v => handleNestedChange('preferences.sound.effects', v)} />
                    <ToggleSwitch label="Achievement Notifications" description="Show an alert when you unlock an achievement." checked={profile.preferences.notifications.achievements} onChange={v => handleNestedChange('preferences.notifications.achievements', v)} />
                    <ToggleSwitch label="Adaptive Difficulty" description="Workout suggestions adapt to your performance." checked={profile.preferences.adaptiveDifficulty} onChange={v => handleNestedChange('preferences.adaptiveDifficulty', v)} />
                </div>
            </div>

            {/* About Section */}
            <div className="bg-gray-800/50 p-6 rounded-2xl">
                 <h2 className="text-xl font-bold mb-4">About Jump</h2>
                 <div className="space-y-2 text-sm">
                    <p className="flex justify-between"><span>App Version</span> <span className="text-gray-400">1.0.0</span></p>
                    <a href="#" className="flex justify-between text-orange-400 hover:text-orange-300"><span>Privacy Policy</span><span>&rarr;</span></a>
                    <a href="#" className="flex justify-between text-orange-400 hover:text-orange-300"><span>Terms of Service</span><span>&rarr;</span></a>
                    <a href="mailto:support@jumpapp.com" className="flex justify-between text-orange-400 hover:text-orange-300"><span>Contact Support</span><span>&rarr;</span></a>
                 </div>
            </div>
            
            {/* Save/Reset Bar */}
            {hasChanges && (
                 <div className="fixed bottom-[68px] left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-700 animate-fade-in-up z-30">
                    <div className="container mx-auto flex gap-4">
                        <button onClick={handleReset} className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg">Reset</button>
                        <button onClick={handleSave} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg">Save Changes</button>
                    </div>
                </div>
            )}
            
            <style>{`
                .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 500; color: #9CA3AF; }
                .form-group input, .form-group select {
                    width: 100%;
                    background-color: #1F2937;
                    color: white;
                    border: 1px solid #4B5563;
                    border-radius: 0.5rem;
                    padding: 0.75rem;
                    outline: none;
                }
                .form-group input:focus, .form-group select:focus {
                    border-color: #F97316;
                    box-shadow: 0 0 0 2px #F9731640;
                }
                .select-wrapper { position: relative; }
                .select-wrapper select { appearance: none; -webkit-appearance: none; }
            `}</style>
        </div>
    );
};

export default Profile;