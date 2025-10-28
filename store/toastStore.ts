export type Toast = {
  id: number;
  message: string;
  type: 'success' | 'error';
};

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners: Set<Listener> = new Set();
let nextId = 0;

const broadcast = () => {
  listeners.forEach(listener => listener([...toasts]));
};

export const toastStore = {
  addToast: (message: string, type: 'success' | 'error' = 'success') => {
    toasts.push({ id: nextId++, message, type });
    broadcast();
  },
  removeToast: (id: number) => {
    toasts = toasts.filter(toast => toast.id !== id);
    broadcast();
  },
  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener);
    listener([...toasts]); // Immediately notify with current state
    return () => {
      listeners.delete(listener);
    };
  },
  getState: () => [...toasts],
};
