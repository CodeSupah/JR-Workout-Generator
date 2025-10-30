import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import WorkoutHub from './components/WorkoutHub';
import ManualBuilder from './components/ManualBuilder';
import LiveSession from './components/LiveSession';
import Home from './components/Home';
import FooterNav from './components/FooterNav';
import Preferences from './components/Preferences';
import { toastStore, Toast } from './store/toastStore';
import { CheckCircleIcon, XCircleIcon } from './components/icons/Icons';
import ExerciseList from './components/ExerciseList';
import ExerciseDetail from './components/ExerciseDetail';

const ToastMessage: React.FC<{ toast: Toast, onRemove: (id: number) => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
    error: <XCircleIcon className="w-6 h-6 text-red-400" />,
  };

  return (
    <div className="bg-gray-700 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden flex items-center p-4 space-x-3 animate-fade-in-down">
      {icons[toast.type]}
      <p className="text-white font-medium">{toast.message}</p>
    </div>
  );
};

const App: React.FC = () => {
  const location = useLocation();
  const isLiveSession = location.pathname === '/session';
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setToasts);
    return () => unsubscribe();
  }, []);

  const removeToast = (id: number) => {
    toastStore.removeToast(id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/50 to-gray-900 text-white selection:bg-orange-500/30">
      <main className="container mx-auto p-4 md:p-6 lg:p-8 pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workout" element={<WorkoutHub />} />
          <Route path="/manual-builder" element={<ManualBuilder />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/session" element={<LiveSession />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/exercises" element={<ExerciseList />} />
          <Route path="/exercises/:exerciseId" element={<ExerciseDetail />} />
        </Routes>
      </main>
       {/* Toast Container */}
      <div className="fixed top-5 right-5 z-50 space-y-3">
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
      {!isLiveSession && <FooterNav />}
    </div>
  );
};

export default App;