import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import WorkoutGenerator from './components/WorkoutGenerator';
import LiveSession from './components/LiveSession';
import Header from './components/Header';
import { toastStore, Toast } from './store/toastStore';
import { CheckCircleIcon, XCircleIcon } from './components/icons/Icons';

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
      {!isLiveSession && <Header />}
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<WorkoutGenerator />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/session" element={<LiveSession />} />
        </Routes>
      </main>
       {/* Toast Container */}
      <div className="fixed top-5 right-5 z-50 space-y-3">
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
};

export default App;
