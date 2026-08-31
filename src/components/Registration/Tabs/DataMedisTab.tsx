import React from 'react';
import { RegistrationFormState, Alergi } from './types';
import { Trash2, Plus } from 'lucide-react';
import { TalkToTextButton } from '../TalkToTextButton';

interface Props {
  data: RegistrationFormState;
  onChange: (field: string, value: any) => void;
}

export function DataMedisTab({ data, onChange }: Props) {
  const inputClass = "w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 outline-none font-medium text-xs";
  const labelClass = "block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1";

  const handleTalkToTextResult = (result: any) => {
    if (!result) return;
    if (result.patient_info?.keluhan_utama) {
      onChange('keluhanUtama', result.patient_info.keluhan_utama);
    }
  };

  const handleTranscriptUpdate = (text: string) => {
    if (text && text.trim()) {
      onChange('keluhanUtama', text);
    }
  };

  const addAlergi = () => {
    onChange('riwayatAlergi', [...(data.riwayatAlergi || []), { allergen: '', reaction: '', severity: 'Moderate' }]);
  };
  
  const updateAlergi = (idx: number, field: keyof Alergi, value: string) => {
    const newData = [...data.riwayatAlergi];
    newData[idx] = { ...newData[idx], [field]: value };
    onChange('riwayatAlergi', newData);
  };
  
  const removeAlergi = (idx: number) => {
    const newData = [...data.riwayatAlergi];
    newData.splice(idx, 1);
    onChange('riwayatAlergi', newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-indigo-50/80 dark:bg-slate-800 p-4 rounded-xl border border-indigo-100 dark:border-slate-700">
        <div>
          <h3 className="font-bold text-sm text-indigo-900 dark:text-indigo-300 mb-1">Data Medis Awal & Keluhan</h3>
          <p className="text-xs text-indigo-700 dark:text-slate-300 font-medium">Isi keluhan utama atau gunakan fitur suara Talk-to-Text (AI) untuk mengisi otomatis.</p>
        </div>
        <TalkToTextButton onExtracted={handleTalkToTextResult} onTranscriptUpdate={handleTranscriptUpdate} />
      </div>

      <div>
        <label className={labelClass}>Keluhan Utama <span className="text-red-500">*</span></label>
        <textarea 
          rows={3}
          value={data.keluhanUtama} 
          onChange={e => onChange('keluhanUtama', e.target.value)}
          className={inputClass} 
          placeholder="Keluhan utama pasien saat datang..."
        />
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 mb-4">Tanda Vital Awal</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className={labelClass}>TD (mmHg)</label>
            <input type="text" value={data.tandaVital?.td || ''} onChange={e => onChange('tandaVital', {...data.tandaVital, td: e.target.value})} className={inputClass} placeholder="120/80" />
          </div>
          <div>
            <label className={labelClass}>Nadi (bpm)</label>
            <input type="text" value={data.tandaVital?.nadi || ''} onChange={e => onChange('tandaVital', {...data.tandaVital, nadi: e.target.value})} className={inputClass} placeholder="80" />
          </div>
          <div>
            <label className={labelClass}>Suhu (°C)</label>
            <input type="text" value={data.tandaVital?.suhu || ''} onChange={e => onChange('tandaVital', {...data.tandaVital, suhu: e.target.value})} className={inputClass} placeholder="36.5" />
          </div>
          <div>
            <label className={labelClass}>RR (x/mnt)</label>
            <input type="text" value={data.tandaVital?.rr || ''} onChange={e => onChange('tandaVital', {...data.tandaVital, rr: e.target.value})} className={inputClass} placeholder="20" />
          </div>
          <div>
            <label className={labelClass}>SpO2 (%)</label>
            <input type="text" value={data.tandaVital?.spo2 || ''} onChange={e => onChange('tandaVital', {...data.tandaVital, spo2: e.target.value})} className={inputClass} placeholder="99" />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Riwayat Alergi Pasien</h4>
          <button type="button" onClick={addAlergi} className="text-blue-600 dark:text-cyan-400 font-bold hover:underline text-xs flex items-center gap-1">
            <Plus className="w-3.5 h-3.5"/> Tambah Alergi
          </button>
        </div>
        
        {(!data.riwayatAlergi || data.riwayatAlergi.length === 0) ? (
          <div className="text-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 text-xs font-medium">
            Tidak ada riwayat alergi yang tercatat.
          </div>
        ) : (
          <div className="space-y-3">
            {data.riwayatAlergi.map((alergi, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input type="text" placeholder="Alergen (Mis: Penisilin, Seafood)" value={alergi.allergen} onChange={e => updateAlergi(idx, 'allergen', e.target.value)} className={inputClass} />
                <input type="text" placeholder="Reaksi (Mis: Gatal, Sesak)" value={alergi.reaction} onChange={e => updateAlergi(idx, 'reaction', e.target.value)} className={inputClass} />
                <select value={alergi.severity} onChange={e => updateAlergi(idx, 'severity', e.target.value)} className={`${inputClass} w-36`}>
                  <option value="Mild">Mild (Ringan)</option>
                  <option value="Moderate">Moderate (Sedang)</option>
                  <option value="Severe">Severe (Berat)</option>
                </select>
                <button type="button" onClick={() => removeAlergi(idx)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg">
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}

