import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Search, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal } from '../Modal';

export function AIDocumentValidatorButton() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysisResult = {
      score: 78,
      completeness: {
        'Data pasien lengkap': true,
        'Tanda vital tercatat': true,
        'Diagnosis ICD-10 valid': true,
        'Riwayat alergi': false,
        'Rencana follow-up': false
      },
      consistency: {
        'Kesesuaian usia dan diagnosis': true,
        'Kesesuaian diagnosis dan tindakan': false
      },
      suggestions: [
        { type: 'error', message: 'Field "Riwayat Alergi" wajib diisi (minimal "Tidak Ada")' },
        { type: 'warning', message: 'Narasi SOAP terlalu singkat (< 50 kata)' },
        { type: 'warning', message: 'Tidak ada rencana follow-up untuk pasien' },
        { type: 'error', message: 'Diagnosis A90 tidak sesuai dengan tindakan yang diberikan' }
      ]
    };
    
    setResult(analysisResult);
    setIsAnalyzing(false);
  };
  
  return (
    <>
      <button 
        onClick={handleAnalyze} 
        disabled={isAnalyzing}
        className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 dark:text-indigo-300 px-4 py-2 rounded-lg font-medium transition-colors border border-indigo-200 dark:border-indigo-800"
      >
        {isAnalyzing ? <Search className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {isAnalyzing ? 'Menganalisis...' : 'Analisis Dokumen RM'}
      </button>
      
      <Modal isOpen={!!result} onClose={() => setResult(null)} title="📊 Hasil Analisis AI Dokumen">
        {result && (
          <div className="p-2 space-y-6">
            {/* Score Section */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className={`text-5xl font-bold ${
                result.score >= 90 ? 'text-emerald-500' :
                result.score >= 70 ? 'text-amber-500' :
                'text-rose-500'
              }`}>
                {result.score}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skor Kualitas Dokumen</h3>
                <p className={`font-medium ${
                  result.score >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                  result.score >= 70 ? 'text-amber-600 dark:text-amber-400' :
                  'text-rose-600 dark:text-rose-400'
                }`}>
                  {result.score >= 90 ? '✅ Kualitas Tinggi' :
                   result.score >= 70 ? '⚠️ Perlu Review (Ada yang kurang)' :
                   '❌ Tidak Valid'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Positive Feedback */}
              <div>
                <h4 className="font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Yang Sudah Benar
                </h4>
                <ul className="space-y-2">
                  {Object.entries(result.completeness)
                    .filter(([_, value]) => value)
                    .map(([key, _]) => (
                      <li key={key} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{key}</span>
                      </li>
                  ))}
                  {Object.entries(result.consistency)
                    .filter(([_, value]) => value)
                    .map(([key, _]) => (
                      <li key={key} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{key}</span>
                      </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div>
                <h4 className="font-bold text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> Perlu Diperbaiki
                </h4>
                <div className="space-y-2">
                  {result.suggestions.map((s: any, i: number) => (
                    <div key={i} className={`p-3 rounded-lg text-sm flex gap-2 ${
                      s.type === 'error' 
                        ? 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-900/20 dark:border-rose-800/50 dark:text-rose-300' 
                        : 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-300'
                    }`}>
                      {s.type === 'error' ? <XCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
                      <span>{s.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
              <button 
                onClick={() => setResult(null)} 
                className="btn-secondary"
              >
                Abaikan
              </button>
              <button 
                onClick={() => {
                  toast.success('✨ Dokumen diperbaiki secara otomatis oleh AI');
                  setResult(null);
                }} 
                className="btn-primary bg-indigo-600 hover:bg-indigo-700 border-indigo-600 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Perbaiki Otomatis
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
