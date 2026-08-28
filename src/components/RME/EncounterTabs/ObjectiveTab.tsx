import React from 'react';

export function ObjectiveTab({ formData, updateForm }: { formData: any, updateForm: (data: any) => void }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Tanda-tanda Vital</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">TD (mmHg)</label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500" 
              placeholder="120/80"
              value={formData.vitalSigns.td}
              onChange={e => updateForm({ vitalSigns: {...formData.vitalSigns, td: e.target.value}})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nadi (x/mnt)</label>
            <input 
              type="number" 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500" 
              placeholder="80"
              value={formData.vitalSigns.hr}
              onChange={e => updateForm({ vitalSigns: {...formData.vitalSigns, hr: e.target.value}})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Napas (x/mnt)</label>
            <input 
              type="number" 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500" 
              placeholder="20"
              value={formData.vitalSigns.rr}
              onChange={e => updateForm({ vitalSigns: {...formData.vitalSigns, rr: e.target.value}})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Suhu (°C)</label>
            <input 
              type="number" 
              step="0.1"
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500" 
              placeholder="36.5"
              value={formData.vitalSigns.temp}
              onChange={e => updateForm({ vitalSigns: {...formData.vitalSigns, temp: e.target.value}})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SpO2 (%)</label>
            <input 
              type="number" 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500" 
              placeholder="98"
              value={formData.vitalSigns.spo2}
              onChange={e => updateForm({ vitalSigns: {...formData.vitalSigns, spo2: e.target.value}})}
            />
          </div>
        </div>
      </div>
      
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Pemeriksaan Fisik</h3>
        <textarea 
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 min-h-[120px]" 
          placeholder="Compos mentis, Kepala normocephal, Thorax vesikuler..."
          value={formData.physicalExam}
          onChange={e => updateForm({ physicalExam: e.target.value })}
        />
      </div>

      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Pemeriksaan Penunjang (Lab & Rad)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hasil Laboratorium</label>
            <select 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
              value={formData.labResults}
              onChange={e => updateForm({ labResults: e.target.value })}
            >
              <option value="">-- Pilih Hasil Lab --</option>
              <option value="Darah Rutin (Normal)">Darah Rutin (06 Aug 2026) - Normal</option>
              <option value="Darah Rutin (Leukositosis)">Darah Rutin (06 Aug 2026) - Leukositosis</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hasil Radiologi</label>
            <select 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
              value={formData.radResults}
              onChange={e => updateForm({ radResults: e.target.value })}
            >
              <option value="">-- Pilih Hasil Radiologi --</option>
              <option value="X-Ray Thorax (Normal)">X-Ray Thorax (05 Aug 2026) - Normal</option>
              <option value="X-Ray Thorax (Pneumonia)">X-Ray Thorax (05 Aug 2026) - Infiltrat</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
