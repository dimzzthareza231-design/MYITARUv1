import React from 'react';
import { Sparkles, Printer } from 'lucide-react';

export function AdministrasiTab({ formData, updateForm }: { formData: any, updateForm: (data: any) => void }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-bold mb-4 flex items-center justify-between text-slate-900 dark:text-white">
          Resume Medis (Discharge Summary)
          <button className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md flex items-center gap-1 font-bold hover:bg-indigo-200 transition-colors">
            <Sparkles className="w-3 h-3" /> Auto-Generate Resume
          </button>
        </h3>
        <textarea 
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[150px] mb-4" 
          placeholder="Ringkasan anamnesis, pemeriksaan fisik, diagnosis, dan terapi..."
          value={formData.resume}
          onChange={(e) => updateForm({ resume: e.target.value })}
        />
        <button className="w-full py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 font-bold transition-colors">
          <Printer className="w-4 h-4"/> Cetak Resume Medis
        </button>
      </div>

      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Status Akhir Kunjungan</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Selesai (Pulang)', 'Rujuk Rawat Inap', 'Rujuk RS Lain', 'Meninggal', 'Pulang APS'].map(status => (
            <label key={status} className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
              formData.status === status 
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-bold' 
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}>
              <input 
                type="radio" 
                name="status" 
                checked={formData.status === status}
                onChange={() => updateForm({ status })}
                className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="text-sm">{status}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Informed Consent (Persetujuan Tindakan)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tanda Tangan Pasien / Wali</label>
            <div className="bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl h-40 flex flex-col items-center justify-center cursor-crosshair hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <span className="text-slate-400 font-medium">Tanda Tangan Di Sini</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tanda Tangan Saksi</label>
            <div className="bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl h-40 flex flex-col items-center justify-center cursor-crosshair hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <span className="text-slate-400 font-medium">Tanda Tangan Di Sini</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
