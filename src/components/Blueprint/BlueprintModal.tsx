import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { BlueprintSystemView } from './BlueprintSystemView';

interface BlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BlueprintModal({ isOpen, onClose }: BlueprintModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Blueprint Evaluasi & Pengembangan Aplikasi MYITARU SIMRS"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-[1700px] h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* MODAL TOP HEADER */}
        <div className="bg-[#071E3D] px-6 py-3.5 border-b border-cyan-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🗺️</span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                MYITARU SIMRS — BLUEPRINT EVALUASI &amp; PENGEMBANGAN
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                  Arsitektur Resmi
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE BLUEPRINT CANVAS) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <BlueprintSystemView />
        </div>
      </div>
    </div>
  );
}

export default BlueprintModal;
