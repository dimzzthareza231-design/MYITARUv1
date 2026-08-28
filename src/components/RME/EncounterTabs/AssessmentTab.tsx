import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

export function AssessmentTab({ formData, updateForm }: { formData: any, updateForm: (data: any) => void }) {
  const [searchICD, setSearchICD] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  // Dummy ICD-10 data
  const icd10DB = [
    { code: 'J06.9', desc: 'Acute upper respiratory infection, unspecified' },
    { code: 'A09', desc: 'Infectious gastroenteritis and colitis, unspecified' },
    { code: 'I10', desc: 'Essential (primary) hypertension' },
    { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications' },
    { code: 'R50.9', desc: 'Fever, unspecified' }
  ];

  const filteredICD = icd10DB.filter(d => 
    d.code.toLowerCase().includes(searchICD.toLowerCase()) || 
    d.desc.toLowerCase().includes(searchICD.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 border-l-indigo-500">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Diagnosis Primer (Utama)</h3>
        <div className="relative">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Cari ICD-10 <span className="text-rose-500">*</span></label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              className="w-full pl-9 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
              placeholder="Ketik kode atau nama penyakit (min. 3 huruf)..."
              value={formData.primaryDiagnosis ? `${formData.primaryDiagnosis.code} - ${formData.primaryDiagnosis.desc}` : searchICD}
              onChange={(e) => {
                if (formData.primaryDiagnosis) {
                  updateForm({ primaryDiagnosis: null });
                }
                setSearchICD(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
            />
          </div>
          
          {showResults && searchICD && !formData.primaryDiagnosis && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredICD.length > 0 ? (
                filteredICD.map(icd => (
                  <div 
                    key={icd.code}
                    className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer border-b border-slate-100 dark:border-slate-700 last:border-0"
                    onClick={() => {
                      updateForm({ primaryDiagnosis: icd });
                      setShowResults(false);
                      setSearchICD('');
                    }}
                  >
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-2">{icd.code}</span>
                    <span className="text-slate-700 dark:text-slate-300">{icd.desc}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 text-slate-500 text-center">Tidak ditemukan</div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Diagnosis Sekunder & Komplikasi</h3>
        
        {formData.secondaryDiagnoses.length > 0 && (
          <div className="space-y-3 mb-4">
            {formData.secondaryDiagnoses.map((diag: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-2">{diag.code}</span>
                  <span className="text-slate-700 dark:text-slate-300">{diag.desc}</span>
                </div>
                <button
                  onClick={() => {
                    const newDiags = formData.secondaryDiagnoses.filter((_: any, i: number) => i !== idx);
                    updateForm({ secondaryDiagnoses: newDiags });
                  }}
                  className="text-rose-500 hover:text-rose-700 font-medium text-sm"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button 
          onClick={() => {
            // Just add a dummy for demo
            updateForm({ 
              secondaryDiagnoses: [...formData.secondaryDiagnoses, { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications' }] 
            });
          }}
          className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-4 h-4"/> Tambah Diagnosis Sekunder
        </button>
      </div>
      
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Assessment Klinis (Narasi)</h3>
        <textarea 
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px]" 
          placeholder="Catatan klinis dokter..."
          value={formData.clinicalNotes}
          onChange={e => updateForm({ clinicalNotes: e.target.value })}
        />
      </div>
    </div>
  );
}
