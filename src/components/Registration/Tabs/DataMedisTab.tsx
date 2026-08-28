import React from 'react';
import { RegistrationFormState, Alergi, Problem, Obat } from './types';
import { Trash2, Plus } from 'lucide-react';
import { TalkToTextButton } from '../TalkToTextButton';

interface Props {
  data: RegistrationFormState;
  onChange: (field: string, value: any) => void;
}

export function DataMedisTab({ data, onChange }: Props) {
  
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
        <div>
          <h3 className="font-bold text-indigo-800 mb-1">Data Medis Awal</h3>
          <p className="text-sm text-indigo-600">Isi data medis awal atau gunakan fitur voice untuk mempercepat proses (Talk-to-Text).</p>
        </div>
        <TalkToTextButton onExtracted={handleTalkToTextResult} onTranscriptUpdate={handleTranscriptUpdate} />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Keluhan Utama</label>
        <textarea 
          rows={3}
          value={data.keluhanUtama} 
          onChange={e => onChange('keluhanUtama', e.target.value)}
          className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" 
          placeholder="Keluhan utama pasien datang ke fasilitas kesehatan..."
        />
      </div>

      <div className="border-t border-slate-200 pt-6">
        <h4 className="font-bold text-slate-800 mb-4">Tanda Vital Awal</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">TD (mmHg)</label>
            <input type="text" value={data.tandaVital?.td || ''} onChange={e => onChange('tandaVital', {...data.tandaVital, td: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" placeholder="120/80" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nadi (bpm)</label>
            <input type="text" value={data.tandaVital?.nadi || ''} onChange={e => onChange('tandaVital', {...data.tandaVital, nadi: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" placeholder="80" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Suhu (°C)</label>
            <input type="text" value={data.tandaVital?.suhu || ''} onChange={e => onChange('tandaVital', {...data.tandaVital, suhu: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" placeholder="36.5" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">RR (x/mnt)</label>
            <input type="text" value={data.tandaVital?.rr || ''} onChange={e => onChange('tandaVital', {...data.tandaVital, rr: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" placeholder="20" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">SpO2 (%)</label>
            <input type="text" value={data.tandaVital?.spo2 || ''} onChange={e => onChange('tandaVital', {...data.tandaVital, spo2: e.target.value})} className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" placeholder="99" />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-slate-800">Riwayat Alergi</h4>
          <button type="button" onClick={addAlergi} className="text-blue-600 font-bold hover:underline text-sm flex items-center gap-1"><Plus className="w-4 h-4"/> Tambah Alergi</button>
        </div>
        
        {(!data.riwayatAlergi || data.riwayatAlergi.length === 0) ? (
          <div className="text-center p-4 border border-dashed rounded text-slate-500">Tidak ada riwayat alergi</div>
        ) : (
          <div className="space-y-3">
            {data.riwayatAlergi.map((alergi, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <input type="text" placeholder="Alergen (Mis: Penisilin)" value={alergi.allergen} onChange={e => updateAlergi(idx, 'allergen', e.target.value)} className="flex-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
                <input type="text" placeholder="Reaksi" value={alergi.reaction} onChange={e => updateAlergi(idx, 'reaction', e.target.value)} className="flex-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium" />
                <select value={alergi.severity} onChange={e => updateAlergi(idx, 'severity', e.target.value)} className="w-32 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium">
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
                <button type="button" onClick={() => removeAlergi(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded border border-transparent"><Trash2 className="w-5 h-5"/></button>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}
