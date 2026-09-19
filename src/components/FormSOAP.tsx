import toast from "react-hot-toast";
import { useToast } from "../contexts/ToastContext";
import React, { useState } from 'react';
import TalkToText from './TalkToText';
import { MedicalSearchGrounding } from './MedicalSearchGrounding';

export default function FormSOAP({ kunjunganId, pasien, onClose }: { kunjunganId?: number, pasien?: any, onClose?: () => void }) {
  const [soap, setSoap] = useState({
    subjective: { keluhan_utama: '', riwayat_penyakit_sekarang: '', riwayat_alergi: '' },
    objective: { tanda_vital: { tekanan_darah: '', nadi: '', suhu: '', rr: '', spo2: '' }, pemeriksaan_fisik: '' },
    assessment: { diagnosis_primer: null as any, diagnosis_sekunder: [] as any[], catatan_assessment: '' },
    plan: { obat: [] as any[], tindakan: [], edukasi: '' }
  });
  
  const [activeTab, setActiveTab] = useState('subjective');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleTranscriptReady = (newSoap: any) => {
    setSoap(newSoap);
    if (newSoap.subjective?.keluhan_utama) setActiveTab('subjective');
  };
  
  const handleChange = (section: string, field: string, value: any) => {
    setSoap((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    
    const raw = localStorage.getItem('hospital_soap_records');
    const saved: any[] = raw ? JSON.parse(raw) : [];
    const existingIndex = saved.findIndex((r: any) => r.kunjungan_id === kunjunganId);
    
    const data = { kunjungan_id: kunjunganId, ...soap, updated_at: new Date().toISOString() };
    
    if (existingIndex >= 0) saved[existingIndex] = data;
    else saved.push(data);
    
    localStorage.setItem('hospital_soap_records', JSON.stringify(saved));

    setIsSaving(false);
    toast.success('Rekam medis berhasil disimpan');
    if (onClose) onClose();
  };
  
  const tabs = [
    { id: 'subjective', label: '📝 Subjective' },
    { id: 'objective', label: '🔍 Objective' },
    { id: 'assessment', label: '🎯 Assessment' },
    { id: 'plan', label: '💊 Plan' },
    { id: 'grounding', label: '🌐 Search Grounding' }
  ];
  
  return (
    <div className="p-6 max-w-6xl mx-auto min-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 Rekam Medis {pasien?.nama_pasien ? `- ${pasien.nama_pasien}` : ''}</h1>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Tutup</button>
        )}
      </div>
      
      {/* TalkToText - di atas form */}
      <TalkToText
        onTranscriptReady={handleTranscriptReady}
        currentSOAP={soap}
        setCurrentSOAP={setSoap}
      />
      
      {/* SOAP Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-slate-200 dark:border-slate-700">
        <div className="flex border-b dark:border-gray-700 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 border-b-2 border-blue-600 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {activeTab === 'subjective' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Keluhan Utama *</label>
                <textarea
                  value={soap.subjective.keluhan_utama}
                  onChange={(e) => handleChange('subjective', 'keluhan_utama', e.target.value)}
                  rows={3}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg bg-transparent"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Riwayat Penyakit Sekarang</label>
                <textarea
                  value={soap.subjective.riwayat_penyakit_sekarang}
                  onChange={(e) => handleChange('subjective', 'riwayat_penyakit_sekarang', e.target.value)}
                  rows={4}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg bg-transparent"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Riwayat Alergi</label>
                <input
                  type="text"
                  value={soap.subjective.riwayat_alergi}
                  onChange={(e) => handleChange('subjective', 'riwayat_alergi', e.target.value)}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg bg-transparent"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'objective' && (
            <div className="space-y-4">
              <h4 className="font-bold">❤️ Tanda Vital</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">TD (mmHg)</label>
                  <input
                    type="text"
                    value={soap.objective.tanda_vital.tekanan_darah}
                    onChange={(e) => handleChange('objective', 'tanda_vital', { ...soap.objective.tanda_vital, tekanan_darah: e.target.value })}
                    className="w-full p-2 border dark:border-gray-600 rounded bg-transparent"
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Nadi (bpm)</label>
                  <input
                    type="text"
                    value={soap.objective.tanda_vital.nadi}
                    onChange={(e) => handleChange('objective', 'tanda_vital', { ...soap.objective.tanda_vital, nadi: e.target.value })}
                    className="w-full p-2 border dark:border-gray-600 rounded bg-transparent"
                    placeholder="80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Suhu (°C)</label>
                  <input
                    type="text"
                    value={soap.objective.tanda_vital.suhu}
                    onChange={(e) => handleChange('objective', 'tanda_vital', { ...soap.objective.tanda_vital, suhu: e.target.value })}
                    className="w-full p-2 border dark:border-gray-600 rounded bg-transparent"
                    placeholder="36.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">RR (x/menit)</label>
                  <input
                    type="text"
                    value={soap.objective.tanda_vital.rr}
                    onChange={(e) => handleChange('objective', 'tanda_vital', { ...soap.objective.tanda_vital, rr: e.target.value })}
                    className="w-full p-2 border dark:border-gray-600 rounded bg-transparent"
                    placeholder="20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">SpO2 (%)</label>
                  <input
                    type="text"
                    value={soap.objective.tanda_vital.spo2}
                    onChange={(e) => handleChange('objective', 'tanda_vital', { ...soap.objective.tanda_vital, spo2: e.target.value })}
                    className="w-full p-2 border dark:border-gray-600 rounded bg-transparent"
                    placeholder="98"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-2 mt-4">Pemeriksaan Fisik</label>
                <textarea
                  value={soap.objective.pemeriksaan_fisik}
                  onChange={(e) => handleChange('objective', 'pemeriksaan_fisik', e.target.value)}
                  rows={5}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg bg-transparent"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'assessment' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Catatan Assessment</label>
                <textarea
                  value={soap.assessment.catatan_assessment}
                  onChange={(e) => handleChange('assessment', 'catatan_assessment', e.target.value)}
                  rows={4}
                  placeholder="Catatan analisis medis dari AI atau dokter..."
                  className="w-full p-3 border dark:border-gray-600 rounded-lg bg-transparent"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2">Diagnosis Primer (ICD-10)</label>
                {soap.assessment.diagnosis_primer ? (
                  <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 rounded">
                    <div className="font-mono font-bold">{soap.assessment.diagnosis_primer.code}</div>
                    <div>{soap.assessment.diagnosis_primer.name}</div>
                  </div>
                ) : (
                  <input type="text" placeholder="Kode ICD-10..." className="w-full p-3 border dark:border-gray-600 rounded-lg bg-transparent" />
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'plan' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Edukasi Pasien & Terapi</label>
                <textarea
                  value={soap.plan.edukasi}
                  onChange={(e) => handleChange('plan', 'edukasi', e.target.value)}
                  rows={4}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg bg-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'grounding' && (
            <MedicalSearchGrounding
              context={`Keluhan: ${soap.subjective.keluhan_utama}, Riwayat: ${soap.subjective.riwayat_penyakit_sekarang}`}
              onApplyRecommendation={(rec) => {
                handleChange('plan', 'edukasi', (soap.plan.edukasi ? soap.plan.edukasi + '\n\n' : '') + `[Google Search Grounding]:\n${rec}`);
                setActiveTab('plan');
              }}
            />
          )}
        </div>
        
        <div className="border-t dark:border-gray-700 p-4 flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50"
          >
            {isSaving ? '⏳ Menyimpan...' : '💾 Simpan Rekam Medis'}
          </button>
        </div>
      </div>
    </div>
  );


}
