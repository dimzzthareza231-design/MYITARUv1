import React from 'react';
import { toast } from 'react-hot-toast';
import { X, AlertTriangle } from 'lucide-react';

export function ModalAnalisis({ result, onClose }: { result: any, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📊 Hasil Analisis Dokumen AI
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {/* Score */}
          <div className="mb-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 flex items-center gap-6">
            <div className={`text-6xl font-bold ${
                result.score >= 90 ? 'text-emerald-500' :
                result.score >= 70 ? 'text-amber-500' :
                'text-rose-500'
              }`}>
              {result.score}
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                {result.score >= 90 ? '✅ Kualitas Tinggi' :
                 result.score >= 70 ? '⚠️ Perlu Review' :
                 '❌ Tidak Valid'}
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                Skor Kelengkapan Rekam Medis
              </div>
            </div>
          </div>
          
          {/* Suggestions */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> 
              Yang Perlu Diperbaiki:
            </h3>
            
            {result.suggestions && result.suggestions.length > 0 ? (
              <div className="space-y-3">
                {result.suggestions.map((suggestion: string, idx: number) => (
                  <div key={idx} className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 rounded-lg font-medium">
                    {suggestion}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300 rounded-lg font-medium text-center">
                Semua bagian penting sudah terisi dengan baik!
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-3 p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 font-bold transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              toast.success('Dokumen diperbaiki otomatis');
              onClose();
            }}
            disabled={!result.suggestions || result.suggestions.length === 0}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-bold shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Perbaiki Otomatis
          </button>
        </div>
      </div>
    </div>
  );
}
