import toast from "react-hot-toast";
import { useToast } from "../contexts/ToastContext";
import React, { useState } from 'react';
import TalkToText from './TalkToText';
import { MedicalSearchGrounding } from './MedicalSearchGrounding';
import ClinicalDecisionSupportWidget from './ClinicalDecisionSupportWidget';
import { Brain, Sparkles, Stethoscope } from 'lucide-react';

export default function FormSOAP({ kunjunganId, pasien, onClose }: { kunjunganId?: number, pasien?: any, onClose?: () => void }) {
  const [soap, setSoap] = useState({
    subjective: { keluhan_utama: '', riwayat_penyakit_sekarang: '', riwayat_alergi: '' },
    objective: { tanda_vital: { tekanan_darah: '', nadi: '', suhu: '', rr: '', spo2: '' }, pemeriksaan_fisik: '' },
    assessment: { diagnosis_primer: null as any, diagnosis_sekunder: [] as any[], catatan_assessment: '' },
    plan: { obat: [] as any[], tindakan: [], edukasi: '' }
  });
  
  const [activeTab, setActiveTab] = useState('subjective');
  const [isSaving, setIsSaving] = useState(false);
  const [showCDSModal, setShowCDSModal] = useState(false);
  const [aiStatus, setAiStatus] = useState<'AI_GENERATED' | 'PENDING_REVIEW' | 'HUMAN_VERIFIED' | 'FINAL'>('PENDING_REVIEW');
  
  const handleTranscriptReady = (newSoap: any) => {
    setSoap(newSoap);
    setAiStatus('AI_GENERATED');
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
    
    const data = { 
      kunjungan_id: kunjunganId, 
      ...soap, 
      ai_governance_status: aiStatus,
      updated_at: new Date().toISOString() 
    };
    
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
    { id: 'cdss', label: '🧠 AI Decision Support (ICD-10)' },
    { id: 'plan', label: '💊 Plan' },
    { id: 'grounding', label: '🌐 Search Grounding' }
  ];
  
  // Parse vitals from SOAP
  const parsedSystolic = soap.objective.tanda_vital.tekanan_darah?.split('/')[0]?.trim() || '';
  const parsedDiastolic = soap.objective.tanda_vital.tekanan_darah?.split('/')[1]?.trim() || '';
  
  const handleApplyCDSDiagnosis = (diag: { code: string; nameId: string; nameEn?: string; reasoning?: string }) => {
    handleChange('assessment', 'diagnosis_primer', { code: diag.code, name: diag.nameId });
    if (diag.reasoning) {
      handleChange('assessment', 'catatan_assessment', 
        (soap.assessment.catatan_assessment ? soap.assessment.catatan_assessment + '\n\n' : '') +
        `[CDSS ${diag.code} - ${diag.nameId}]:\n${diag.reasoning}`
      );
    }
    setActiveTab('assessment');
  };

  const handleApplyCDSWorkup = (workups: Array<{ category: string; testName: string; reason: string }>) => {
    const summary = workups.map(w => `[${w.category}] ${w.testName}: ${w.reason}`).join('\n');
    handleChange('plan', 'edukasi', 
      (soap.plan.edukasi ? soap.plan.edukasi + '\n\n' : '') +
      `[Pemeriksaan Penunjang yang Direkomendasikan AI]:\n${summary}`
    );
    setActiveTab('plan');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto min-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📋 Rekam Medis {pasien?.nama_pasien ? `- ${pasien.nama_pasien}` : ''}</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCDSModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow flex items-center gap-1.5 transition-all cursor-pointer"
            title="Buka Clinical Decision Support Widget"
          >
            <Brain className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>AI Decision Support (CDSS)</span>
          </button>
          {onClose && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Tutup</button>
          )}
        </div>
      </div>
      
      {/* TalkToText - di atas form */}
      <TalkToText
        onTranscriptReady={handleTranscriptReady}
        currentSOAP={soap}
        setCurrentSOAP={setSoap}
      />
      
      {/* BLUEPRINT SECTION 10: AI GOVERNANCE PIPELINE BAR */}
      <div className="mb-4 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-purple-500" />
            <span>AI Governance:</span>
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {[
              { id: 'AI_GENERATED', label: 'AI GENERATED', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' },
              { id: 'PENDING_REVIEW', label: 'PENDING REVIEW', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
              { id: 'HUMAN_VERIFIED', label: 'HUMAN VERIFIED', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' },
              { id: 'FINAL', label: 'FINAL', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' }
            ].map((p, idx) => (
              <React.Fragment key={p.id}>
                <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${aiStatus === p.id ? `${p.color} ring-1 ring-current shadow-xs` : 'text-slate-400 opacity-60'}`}>
                  {p.label}
                </span>
                {idx < 3 && <span className="text-slate-400 text-[10px]">→</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setAiStatus('HUMAN_VERIFIED');
              toast.success('Diverifikasi oleh dokter (Human-Verified)');
            }}
            className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-cyan-300 text-[11px] font-bold border border-blue-500/20 transition-all cursor-pointer"
          >
            ✓ Verifikasi Medis
          </button>
          <button
            type="button"
            onClick={() => {
              setAiStatus('FINAL');
              toast.success('Status rekam medis dikunci ke FINAL');
            }}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 hover:text-white text-emerald-600 dark:text-emerald-300 text-[11px] font-bold border border-emerald-500/20 transition-all cursor-pointer"
          >
            🔒 Finalisasi RME
          </button>
        </div>
      </div>

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
              {/* CDSS Quick Launcher Banner */}
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-slate-800 dark:to-slate-800/80 rounded-xl border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <Brain className="w-4 h-4 text-indigo-600 dark:text-cyan-400 animate-pulse" />
                    Clinical Decision Support (CDSS) • Gemini AI
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Analisis tanda vital & keluhan untuk rekomendasi diagnosis ICD-10, diagnosis banding, dan ICD-9-CM
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCDSModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                  <span>Buka Widget CDSS</span>
                </button>
              </div>

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

          {activeTab === 'cdss' && (
            <div className="py-2">
              <ClinicalDecisionSupportWidget
                mode="inline"
                initialPatient={{
                  name: pasien?.nama_pasien || pasien?.nama || '',
                  noRm: pasien?.no_rm || '',
                  age: pasien?.umur || '',
                  gender: pasien?.jenis_kelamin || '',
                  allergies: soap.subjective.riwayat_alergi || 'Tidak ada',
                  history: soap.subjective.riwayat_penyakit_sekarang || ''
                }}
                initialVitals={{
                  systolic: parsedSystolic,
                  diastolic: parsedDiastolic,
                  heartRate: soap.objective.tanda_vital.nadi || '',
                  temperature: soap.objective.tanda_vital.suhu || '',
                  respiratoryRate: soap.objective.tanda_vital.rr || '',
                  spO2: soap.objective.tanda_vital.spo2 || ''
                }}
                initialSymptoms={{
                  chiefComplaint: soap.subjective.keluhan_utama || '',
                  duration: '',
                  additionalSymptoms: soap.subjective.riwayat_penyakit_sekarang || ''
                }}
                clinicalNotes={soap.objective.pemeriksaan_fisik}
                onApplyDiagnosis={handleApplyCDSDiagnosis}
                onApplyWorkup={handleApplyCDSWorkup}
              />
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

      {/* Modal Popup Clinical Decision Support Widget */}
      {showCDSModal && (
        <ClinicalDecisionSupportWidget
          isOpen={showCDSModal}
          onClose={() => setShowCDSModal(false)}
          mode="modal"
          initialPatient={{
            name: pasien?.nama_pasien || pasien?.nama || '',
            noRm: pasien?.no_rm || '',
            age: pasien?.umur || '',
            gender: pasien?.jenis_kelamin || '',
            allergies: soap.subjective.riwayat_alergi || 'Tidak ada',
            history: soap.subjective.riwayat_penyakit_sekarang || ''
          }}
          initialVitals={{
            systolic: parsedSystolic,
            diastolic: parsedDiastolic,
            heartRate: soap.objective.tanda_vital.nadi || '',
            temperature: soap.objective.tanda_vital.suhu || '',
            respiratoryRate: soap.objective.tanda_vital.rr || '',
            spO2: soap.objective.tanda_vital.spo2 || ''
          }}
          initialSymptoms={{
            chiefComplaint: soap.subjective.keluhan_utama || '',
            duration: '',
            additionalSymptoms: soap.subjective.riwayat_penyakit_sekarang || ''
          }}
          clinicalNotes={soap.objective.pemeriksaan_fisik}
          onApplyDiagnosis={(diag) => {
            handleApplyCDSDiagnosis(diag);
            setShowCDSModal(false);
          }}
          onApplyWorkup={(workups) => {
            handleApplyCDSWorkup(workups);
            setShowCDSModal(false);
          }}
        />
      )}
    </div>
  );


}
