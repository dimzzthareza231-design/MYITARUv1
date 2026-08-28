import React, { createContext, useContext, useState, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  success: (msg: string) => void;
  error: (msg: string) => void;
  warning: (msg: string) => void;
  info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const showToast = (message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(p => p.filter(t => t.id !== id));
    }, duration);
  };
  
  const toast: ToastContextType = {
    success: (msg: string) => showToast(msg, 'success'),
    error: (msg: string) => showToast(msg, 'error', 5000),
    warning: (msg: string) => showToast(msg, 'warning', 4000),
    info: (msg: string) => showToast(msg, 'info')
  };
  
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={(id) => setToasts(p => p.filter(t => t.id !== id))} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[], onRemove: (id: number) => void }) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  };
  
  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`${colors[t.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-in slide-in-from-right-4 duration-300`}
        >
          <span className="text-xl">{icons[t.type]}</span>
          <span className="flex-1 font-medium whitespace-pre-line">{t.message}</span>
          <button
            onClick={() => onRemove(t.id)}
            className="text-white/80 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
