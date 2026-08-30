import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  maxWidth?: string;
  footer?: ReactNode;
  icon?: ReactNode;
  subtitle?: string;
  variant?: 'default' | 'add' | 'edit' | 'danger' | 'detail';
  badgeText?: string;
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  maxWidth, 
  footer, 
  icon, 
  subtitle,
  variant = 'default',
  badgeText
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  const widthClass = maxWidth || sizes[size];

  const variantStyles = {
    default: {
      headerBg: 'bg-slate-50/80 dark:bg-slate-800/90',
      iconBox: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    add: {
      headerBg: 'bg-gradient-to-r from-blue-500/10 via-slate-50/80 to-slate-50/80 dark:via-slate-800/90 dark:to-slate-800/90',
      iconBox: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    edit: {
      headerBg: 'bg-gradient-to-r from-amber-500/10 via-slate-50/80 to-slate-50/80 dark:via-slate-800/90 dark:to-slate-800/90',
      iconBox: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    danger: {
      headerBg: 'bg-gradient-to-r from-rose-500/10 via-slate-50/80 to-slate-50/80 dark:via-slate-800/90 dark:to-slate-800/90',
      iconBox: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    },
    detail: {
      headerBg: 'bg-gradient-to-r from-cyan-500/10 via-slate-50/80 to-slate-50/80 dark:via-slate-800/90 dark:to-slate-800/90',
      iconBox: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
    }
  };

  const currentVariant = variantStyles[variant] || variantStyles.default;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md transition-all">
      <div 
        className="fixed inset-0" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shadow-2xl w-full ${widthClass} flex flex-col max-h-[92vh] overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200`}>
        {/* MODAL HEADER */}
        <div className={`flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-slate-700/80 ${currentVariant.headerBg} backdrop-blur-sm`}>
          <div className="flex items-center gap-3">
            {icon && (
              <div className={`p-2 rounded-xl border flex items-center justify-center ${currentVariant.iconBox}`}>
                {icon}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {title}
                </h3>
                {badgeText && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${currentVariant.badge}`}>
                    {badgeText}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 text-slate-800 dark:text-slate-200">
          {children}
        </div>

        {/* MODAL FOOTER */}
        {footer && (
          <div className="border-t border-slate-200/80 dark:border-slate-700/80 px-5 py-3.5 bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}


