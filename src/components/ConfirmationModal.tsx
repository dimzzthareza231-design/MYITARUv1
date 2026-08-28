import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationModal({
  isOpen,
  title = 'Konfirmasi Tindakan',
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'warning',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const colorScheme = {
    danger: {
      bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      btn: 'bg-rose-600 hover:bg-rose-500 text-white',
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      btn: 'bg-amber-600 hover:bg-amber-500 text-white',
    },
    info: {
      bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
      btn: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    },
  }[variant];

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${colorScheme.bg}`}>
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-semibold transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-md ${colorScheme.btn}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
