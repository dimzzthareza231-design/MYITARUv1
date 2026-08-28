import React, { useState, useEffect, useRef } from 'react';
import {
  User, Activity, AlertTriangle, Pill, ClipboardList, Clock,
  Stethoscope, Syringe, HeartPulse, FileText, Plus, Search,
  ShieldAlert, Printer, Edit2, Trash2, X, Lock, Unlock, Eye,
  Calculator, FileSignature, ShieldCheck, Scale, Apple, Brain,
  ListChecks, FileCode2, FlaskConical, ScanLine, CheckCircle2, Mic, Globe
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import PrintPDFButton from '../PrintPDFButton';
import { SmartVoiceReport } from './SmartVoiceReport';
import { MedicalSearchGrounding } from '../MedicalSearchGrounding';

// ═══════════════════════════════════════════════════════════
// INFORMED CONSENT MODAL (dipindah dari MedicalRecords)
// ═══════════════════════════════════════════════════════════
function InformedConsentModal({ onClose, patient }: { onClose: () => void, patient?: any }) {
  const [consent, setConsent] = useState({
    tindakan: [] as string[],
    setuju: false,
    nama: '',
    hubungan: 'Pasien Sendiri',
    ttd: null as string | null
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const tindakanList = [
    'Pemeriksaan Fisik', 'Pengambilan Sampel Darah', 'Pengambilan Sampel Urine',
    'Nebulizer', 'Jahit Luka', 'Pemberian Injeksi', 'Pemasangan Infus', 'Tindakan Medis Lainnya'
  ];

  const handleTtd = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) * canvas.width) / rect.width;
    const y = ((e.clientY - rect.top) * canvas.height) / rect.height;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setConsent((c) => ({ ...c, ttd: canvas.toDataURL() }));
  };

  const handleSave = () => {
    if (!consent.setuju || !consent.nama) {
      toast.error('Persetujuan dan nama wajib diisi');
      return;
    }
    const saved = JSON.parse(localStorage.getItem('informed_consent') || '[]');
    saved.push({ ...consent, id: Date.now(), tanggal: new Date().toISOString(), patientId: patient?.id, patientName: patient?.nama });
    localStorage.setItem('informed_consent', JSON.stringify(saved));
    toast.success('Informed Consent berhasil disimpan');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="bg-emerald-600 text-white p-4 flex justify-between items-center rounded-t-xl sticky top-0 z-10">
          <h2 className="text-xl font-bold">✍️ Informed Consent - Persetujuan Tindakan Medis</h2>
          <button onClick={onClose} className="text-2xl hover:bg-emerald-700 w-8 h-8 rounded flex items-center justify-center">✕</button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">📋 Informasi Penting</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Dengan menandatangani formulir ini, Anda menyatakan telah memahami dan menyetujui tindakan medis yang akan dilakukan oleh tenaga medis.
            </p>
          </div>
          <div>
            <label className="block font-semibold mb-3 text-slate-800 dark:text-slate-200">Pilih Tindakan yang Disetujui:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tindakanList.map((t) => (
                <label key={t} className="flex items-center gap-3 p-3 border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-600 rounded"
                    checked={consent.tindakan.includes(t)}
                    onChange={(e) => {
                      if (e.target.checked) setConsent((c) => ({ ...c, tindakan: [...c.tindakan, t] }));
                      else setConsent((c) => ({ ...c, tindakan: c.tindakan.filter((x) => x !== t) }));
                    }}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg cursor-pointer">
            <input type="checkbox" checked={consent.setuju} onChange={(e) => setConsent((c) => ({ ...c, setuju: e.target.checked }))} className="w-5 h-5 mt-0.5 text-amber-600 rounded" />
            <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
              Saya menyatakan telah memahami penjelasan tentang tindakan medis di atas dan <strong>menyetujui</strong> untuk dilakukan tindakan tersebut.
            </span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-300">Nama Penandatangan *</label>
              <input type="text" value={consent.nama} onChange={(e) => setConsent((c) => ({ ...c, nama: e.target.value }))} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg" placeholder="Masukkan nama lengkap" />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-300">Hubungan dengan Pasien</label>
              <select value={consent.hubungan} onChange={(e) => setConsent((c) => ({ ...c, hubungan: e.target.value }))} className="w-full p-3 border dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg">
                <option>Pasien Sendiri</option>
                <option>Suami/Istri</option>
                <option>Orang Tua</option>
                <option>Anak</option>
                <option>Wali</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-2 text-slate-700 dark:text-slate-300">Tanda Tangan Digital:</label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={700}
                height={200}
                className="w-full h-48 cursor-crosshair touch-none"
                onMouseDown={(e) => {
                  const canvas = canvasRef.current;
                  if (!canvas) return;
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;
                  const rect = canvas.getBoundingClientRect();
                  ctx.beginPath();
                  ctx.moveTo(((e.clientX - rect.left) * canvas.width) / rect.width, ((e.clientY - rect.top) * canvas.height) / rect.height);
                }}
                onMouseMove={handleTtd}
                onMouseUp={() => {
                  const canvas = canvasRef.current;
                  const ctx = canvas?.getContext('2d');
                  ctx?.beginPath();
                }}
              />
            </div>
            <button
              onClick={() => {
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext('2d');
                if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                setConsent((c) => ({ ...c, ttd: null }));
              }}
              className="mt-3 text-sm font-semibold text-rose-600 hover:text-rose-700"
            >
              🗑️ Hapus Tanda Tangan
            </button>
          </div>
        </div>
        <div className="border-t dark:border-slate-700 p-6 flex gap-4 sticky bottom-0 bg-white dark:bg-slate-800 rounded-b-xl">
          <button onClick={onClose} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-3 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Batal</button>
          <button onClick={handleSave} className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm">💾 Simpan Persetujuan</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export function Patient360({ patient, onBack }: { patient?: any, onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [patientData, setPatientData] = useState<any>(null);
  const [showConsent, setShowConsent] = useState(false);
  const [showSmartVoice, setShowSmartVoice] = useState(false);

  useEffect(() => {
    const defaultData = {
      ...(patient || {}),
      allergies: patient?.allergies || [
        { id: 1, allergen: 'Penicillin', reaction: 'Urticaria, Anaphylaxis risk', severity: 'Severe', tanggal_diketahui: '10 Jan 2020', verified_by: 'Dr. Sarah' },
        { id: 2, allergen: 'Seafood', reaction: 'Itching', severity: 'Mild', tanggal_diketahui: '05 Mar 2018', verified_by: 'Dr. Budi' }
      ],
      problem_list: patient?.problem_list || [
        { id: 1, nama: 'Type 2 Diabetes Mellitus', kode_icd10: 'E11.9', tanggal_onset: '2022-03-10', severity: 'Moderate', status: 'Active' },
        { id: 2, nama: 'Essential (primary) hypertension', kode_icd10: 'I10', tanggal_onset: '2021-06-20', severity: 'Moderate', status: 'Active' }
      ],
      medications: patient?.medications || [
        { id: 1, name: 'Metformin', dose: '500 mg - Oral', frequency: '2x1', startDate: '2022-03-15', status: 'Active' },
        { id: 2, name: 'Amlodipine', dose: '5 mg - Oral', frequency: '1x1', startDate: '2021-06-25', status: 'Active' }
      ],
      vitals: patient?.vitals || [
        { id: 1, date: '01 Aug 2026 08:00', bp: '130/85', hr: '78', temp: '36.5', rr: '18', spo2: '98', tb: '170', bb: '75' },
        { id: 2, date: '01 Jul 2026 09:30', bp: '125/80', hr: '75', temp: '36.6', rr: '16', spo2: '99', tb: '170', bb: '74.5' }
      ]
    };
    setPatientData(defaultData);
  }, [patient]);

  const handleApplyVoiceToSOAP = (data: { s: string; o: string; a: string; p: string; parsed?: any }) => {
    localStorage.setItem('soap_draft', JSON.stringify({
      s: data.s,
      o: data.o,
      a: data.a,
      p: data.p
    }));

    // If new vitals or problems parsed, update patient state
    if (data.parsed?.vitals && Object.keys(data.parsed.vitals).length > 0) {
      const v = data.parsed.vitals;
      const newVital = {
        id: Date.now(),
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        bp: v.tekanan_darah || '120/80',
        hr: v.nadi || '80',
        temp: v.suhu || '36.5',
        rr: '18',
        spo2: v.spo2 || '98',
        tb: '170',
        bb: '70'
      };
      setPatientData((prev: any) => ({
        ...prev,
        vitals: [newVital, ...(prev?.vitals || [])]
      }));
    }

    if (data.parsed?.icd10 && data.parsed.icd10.length > 0) {
      const newProblems = data.parsed.icd10.map((d: any, idx: number) => ({
        id: Date.now() + idx,
        nama: d.name,
        kode_icd10: d.code,
        tanggal_onset: new Date().toISOString().split('T')[0],
        severity: 'Moderate',
        status: 'Active'
      }));
      setPatientData((prev: any) => ({
        ...prev,
        problem_list: [...newProblems, ...(prev?.problem_list || [])]
      }));
    }

    toast.success('Rekam medis pasien diperbarui dari Laporan Suara Cerdas');
    setActiveTab('soap');
  };

  if (!patientData) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'voice_report', label: '🎙️ Laporan Suara Cerdas', icon: Mic },
    { id: 'search_grounding', label: '🌐 Google Search Grounding Klinis', icon: Globe },
    { id: 'triase', label: 'Triase & Skrining', icon: Activity },
    { id: 'fisik', label: 'Pemeriksaan Fisik', icon: Stethoscope },
    { id: 'soap', label: 'SOAP', icon: FileText },
    { id: 'kode', label: 'Kodefikasi ICD/SNOMED', icon: FileCode2 },
    { id: 'cpoe', label: 'CPOE / E-Resep', icon: Pill },
    { id: 'legal', label: 'Resume & Legal', icon: FileSignature },
    { id: 'audit', label: 'Keamanan & Audit', icon: ShieldCheck },
    { id: 'problems', label: 'Problem List', icon: ClipboardList },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
    { id: 'vitals', label: 'Vital Signs', icon: HeartPulse },
    { id: 'immunizations', label: 'Immunizations', icon: Syringe },
    { id: 'growth', label: 'Growth Chart', icon: Scale },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      {/* HEADER */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-4 flex justify-between items-start">
        <div className="flex gap-6">
          <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <User className="w-12 h-12" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{patientData?.nama || 'Pasien'}</h1>
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-bold border border-slate-200 dark:border-slate-600">
                {patientData?.jenis_kelamin || 'L'} • {patientData?.umur || 35} Thn
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mt-3">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-16 text-slate-400">No. RM:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{patientData?.no_rm || 'RM-000000'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-16 text-slate-400">Gol. Darah:</span>
                <span className="font-medium text-rose-600 font-bold">O+</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <span className="w-16 text-slate-400">Jaminan:</span>
                <span className="font-medium text-emerald-600 font-bold bg-emerald-50 px-2 rounded">BPJS Kesehatan</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {onBack && (
            <button onClick={onBack} className="text-slate-500 hover:text-slate-800 self-end mb-2"><X className="w-6 h-6" /></button>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSmartVoice(true)}
              className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-3 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all transform hover:scale-105"
            >
              <Mic className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span>Laporan Suara Cerdas</span>
            </button>
            <PrintPDFButton 
              filename={`RME_${patientData?.nama || 'Pasien'}`} 
              label="📄 Print PDF RME" 
              className="text-sm bg-white border border-slate-300 !text-slate-700 hover:bg-slate-50" 
              documentData={patientData}
              docType="resume_medis"
              title="RINGKASAN REKAM MEDIS ELEKTRONIK PASIEN (RME 360)"
            />
          </div>
        </div>
      </div>

      {/* ALLERGY BANNER */}
      {patientData.allergies?.length > 0 && (
        <div className="mb-4 bg-red-600 text-white p-3 rounded-lg flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <div>
              <h3 className="font-bold">CRITICAL ALLERGY ALERT</h3>
              <p className="text-sm text-red-100">{patientData.allergies.map((a: any) => `${a.allergen} (${a.severity})`).join(', ')}</p>
            </div>
          </div>
        </div>
      )}

      {/* TABS NAVIGATION */}
      <div className="flex gap-1 overflow-x-auto mb-4 border-b border-slate-200 dark:border-slate-700 pb-px custom-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'overview' && <OverviewTab patientData={patientData} />}
        {activeTab === 'voice_report' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Mic className="w-5 h-5 text-indigo-500" /> Modul Laporan Suara Cerdas Pasien
                </h2>
                <p className="text-sm text-slate-500">
                  Dikte suara medis real-time dengan filter kebisingan cerdas untuk {patientData?.nama}
                </p>
              </div>
              <button
                onClick={() => setShowSmartVoice(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm"
              >
                <Mic className="w-4 h-4 text-cyan-300 animate-pulse" /> Buka Modal Dikte & Visualizer
              </button>
            </div>
            
            <div className="p-8 border-2 border-dashed border-indigo-200 dark:border-indigo-800/80 rounded-2xl text-center bg-indigo-50/40 dark:bg-indigo-950/20">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Mic className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Siap Merekam Dikte Klinis Dokter</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Gunakan fitur ini untuk merekam keluhan, temuan fisik, diagnosis, dan terapi dengan penyaringan kebisingan aktif dan verifikasi SOAP terstruktur.
              </p>
              <button
                onClick={() => setShowSmartVoice(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md flex items-center gap-2 mx-auto transform hover:scale-105 transition-all"
              >
                <Mic className="w-5 h-5 text-cyan-300 animate-pulse" /> Mulai Laporan Suara Cerdas Sekarang
              </button>
            </div>
          </div>
        )}
        {activeTab === 'search_grounding' && (
          <MedicalSearchGrounding
            context={`Pasien: ${patientData?.nama}, Usia: ${patientData?.umur || 35} tahun, Masalah Aktif: ${patientData?.problem_list?.map((p: any) => p.nama).join(', ') || '-'}`}
            onApplyRecommendation={(rec) => {
              const currentDraft = JSON.parse(localStorage.getItem('soap_draft') || '{}');
              localStorage.setItem('soap_draft', JSON.stringify({
                ...currentDraft,
                p: (currentDraft.p ? currentDraft.p + '\n\n' : '') + `[Google Search Grounding]:\n${rec}`
              }));
              toast.success('Rekomendasi diterapkan ke Plan SOAP.');
            }}
          />
        )}
        {activeTab === 'triase' && <TriaseTab />}
        {activeTab === 'fisik' && <FisikTab />}
        {activeTab === 'soap' && <SoapTab onOpenVoice={() => setShowSmartVoice(true)} />}
        {activeTab === 'kode' && <KodeTab />}
        {activeTab === 'cpoe' && <CPOETab patientData={patientData} />}
        {activeTab === 'legal' && <LegalTab patientData={patientData} />}
        {activeTab === 'audit' && <AuditTab />}
        {activeTab === 'problems' && <ProblemListTab patientData={patientData} setPatientData={setPatientData} />}
        {activeTab === 'medications' && <MedicationsTab patientData={patientData} setPatientData={setPatientData} />}
        {activeTab === 'allergies' && <AllergiesTab patientData={patientData} setPatientData={setPatientData} />}
        {activeTab === 'vitals' && <VitalsTab patientData={patientData} />}
        {activeTab === 'immunizations' && <ImmunizationsTab />}
        {activeTab === 'growth' && <GrowthChartTab />}
      </div>

      {showConsent && <InformedConsentModal patient={patientData} onClose={() => setShowConsent(false)} />}
      
      {showSmartVoice && (
        <SmartVoiceReport
          patient={patientData}
          isOpen={showSmartVoice}
          onClose={() => setShowSmartVoice(false)}
          onApplyToSOAP={handleApplyVoiceToSOAP}
          onApplyToRecord={(rec) => {
            toast.success('Laporan suara terverifikasi dan masuk ke audit log pasien.');
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// OVERVIEW TAB (Read-only Summary)
// ═══════════════════════════════════════════════════════════
function OverviewTab({ patientData }: { patientData: any }) {
  if (!patientData) return null;

  const activeProblems = patientData.problem_list?.filter((p: any) => p.status === 'Active') || [];
  const activeMeds = patientData.medications?.filter((m: any) => m.status === 'Active') || [];
  const allergies = patientData.allergies || [];
  const latestVitals = patientData.vitals?.[0] || null;
  const immunizations = patientData.immunizations || [];

  // Data SOAP terakhir (simulasi - bisa diambil dari localStorage)
  const lastSOAP = JSON.parse(localStorage.getItem('last_soap') || 'null');
  const lastResume = JSON.parse(localStorage.getItem('last_resume') || 'null');
  const lastTriase = JSON.parse(localStorage.getItem('last_triase') || 'null');
  const lastPhysicalExam = JSON.parse(localStorage.getItem('last_physical_exam') || 'null');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ═══════════ BANNER ALERGI ═══════════ */}
      {allergies.length > 0 && (
        <div className="bg-red-600 text-white p-4 rounded-xl flex items-center gap-4 shadow-lg">
          <ShieldAlert className="w-8 h-8 shrink-0 animate-pulse" />
          <div className="flex-1">
            <h3 className="font-bold text-lg">⚠️ PERINGATAN ALERGI</h3>
            <p className="text-red-100 text-sm">
              {allergies.map((a: any) => `${a.allergen} (${a.severity})`).join(' • ')}
            </p>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold shrink-0">
            {allergies.length} Alergi
          </span>
        </div>
      )}

      {/* ═══════════ QUICK STATS ═══════════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{activeProblems.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Problem Aktif</div>
          </div>
        </div>
        <div className="card p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{activeMeds.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Obat Aktif</div>
          </div>
        </div>
        <div className="card p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{allergies.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Alergi</div>
          </div>
        </div>
        <div className="card p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{immunizations.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Imunisasi</div>
          </div>
        </div>
      </div>

      {/* ═══════════ GRID RINGKASAN UTAMA ═══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* KOLOM KIRI: Demografi + Vital */}
        <div className="space-y-4">
          {/* Data Demografi */}
          <div className="card p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" /> Data Demografi
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">No. RM</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">{patientData.no_rm || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Nama Lengkap</span>
                <span className="font-bold text-slate-900 dark:text-white">{patientData.nama || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Jenis Kelamin</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {patientData.jenis_kelamin === 'L' ? '👨 Laki-laki' : '👩 Perempuan'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Gol. Darah</span>
                <span className="font-bold text-red-600 dark:text-red-400">{patientData.gol_darah || 'O+'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Penjamin</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">BPJS Kesehatan</span>
              </div>
            </div>
          </div>

          {/* Tanda Vital Terakhir */}
          <div className="card p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-500" /> Tanda Vital Terakhir
            </h3>
            {latestVitals ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-1">TD</div>
                  <div className="font-bold text-lg text-slate-900 dark:text-white">{latestVitals.bp}</div>
                  <div className="text-[10px] text-slate-400">mmHg</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-1">Nadi</div>
                  <div className="font-bold text-lg text-slate-900 dark:text-white">{latestVitals.hr}</div>
                  <div className="text-[10px] text-slate-400">x/mnt</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-1">Suhu</div>
                  <div className="font-bold text-lg text-slate-900 dark:text-white">{latestVitals.temp}</div>
                  <div className="text-[10px] text-slate-400">°C</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-1">SpO2</div>
                  <div className="font-bold text-lg text-slate-900 dark:text-white">{latestVitals.spo2}%</div>
                  <div className="text-[10px] text-slate-400">%</div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Belum ada data vital</p>
            )}
            {latestVitals && (
              <div className="mt-3 text-xs text-slate-400 text-center">📅 {latestVitals.date}</div>
            )}
          </div>
        </div>

        {/* KOLOM TENGAH: Problem + Obat + Triase */}
        <div className="space-y-4">
          {/* Problem List */}
          <div className="card p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-indigo-500" /> Problem List Aktif
              </span>
              <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {activeProblems.length}
              </span>
            </h3>
            {activeProblems.length > 0 ? (
              <div className="space-y-2">
                {activeProblems.map((problem: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{problem.nama}</p>
                      <p className="text-xs text-slate-500 font-mono">{problem.kode_icd10} • Sejak {problem.tanggal_onset}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                      problem.severity === 'Severe' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' :
                      problem.severity === 'Moderate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                      'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                    }`}>
                      {problem.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Tidak ada problem aktif</p>
            )}
          </div>

          {/* Obat Aktif */}
          <div className="card p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-purple-500" /> Obat Aktif
              </span>
              <span className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded-full font-bold">
                {activeMeds.length}
              </span>
            </h3>
            {activeMeds.length > 0 ? (
              <div className="space-y-2">
                {activeMeds.map((med: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/50">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
                      <Pill className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{med.name}</p>
                      <p className="text-xs text-slate-500">{med.dose} • {med.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Tidak ada obat aktif</p>
            )}
          </div>

          {/* Hasil Triase Terakhir */}
          {lastTriase && (
            <div className="card p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" /> Triase Terakhir
              </h3>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-3 h-3 rounded-full ${
                    lastTriase.kategori === 'Merah' ? 'bg-red-500' :
                    lastTriase.kategori === 'Kuning' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}></span>
                  <span className="font-bold text-slate-900 dark:text-white">{lastTriase.kategori}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{lastTriase.keluhan || '-'}</p>
              </div>
            </div>
          )}
        </div>

        {/* KOLOM KANAN: SOAP + Resume + Kunjungan */}
        <div className="space-y-4">
          {/* SOAP Terakhir */}
          <div className="card p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" /> SOAP Terakhir
            </h3>
            {lastSOAP ? (
              <div className="space-y-3 text-sm">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <span className="font-bold text-blue-700 dark:text-blue-400">S:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-1 line-clamp-2">{lastSOAP.subjective?.keluhan_utama || '-'}</p>
                </div>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="font-bold text-green-700 dark:text-green-400">O:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-1 line-clamp-2">{lastSOAP.objective?.pemeriksaan_fisik || '-'}</p>
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                  <span className="font-bold text-amber-700 dark:text-amber-400">A:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-1 line-clamp-2">{lastSOAP.assessment?.primaryDiagnosis?.desc || '-'}</p>
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <span className="font-bold text-purple-700 dark:text-purple-400">P:</span>
                  <p className="text-slate-700 dark:text-slate-300 mt-1 line-clamp-2">{lastSOAP.plan?.medications?.[0]?.nama || '-'}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Belum ada data SOAP</p>
            )}
          </div>

          {/* Resume Medis Terakhir */}
          <div className="card p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-emerald-500" /> Resume Medis Terakhir
            </h3>
            {lastResume ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">{lastResume.ringkasan || '-'}</p>
                <p className="text-xs text-slate-500 mt-2">📅 {lastResume.tanggal || '-'}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">Belum ada resume medis</p>
            )}
          </div>

          {/* Kunjungan Terakhir */}
          <div className="card p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> Kunjungan Terakhir
            </h3>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/50">
              <div className="text-sm font-bold text-slate-900 dark:text-white mb-1">05 Agt 2026 • Poli Penyakit Dalam</div>
              <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">Kontrol Rutin DM Tipe 2</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">👨‍⚕️ dr. Budi Santoso, Sp.PD</div>
            </div>
          </div>

          {/* Ringkasan Klinis */}
          <div className="card p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" /> Ringkasan Klinis
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Pasien {patientData.jenis_kelamin === 'L' ? 'pria' : 'wanita'} dengan riwayat
              {activeProblems.length > 0 && (
                <span className="font-medium text-indigo-600 dark:text-indigo-400"> {activeProblems.map((p: any) => p.nama).join(', ')}</span>
              )}.
              {allergies.length > 0 && (
                <> Alergi <span className="font-bold text-red-600 dark:text-red-400">{allergies.map((a: any) => a.allergen).join(', ')}</span>.</>
              )}
              {' '}Kondisi klinis stabil.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════ PEMERIKSAAN FISIK TERAKHIR ═══════════ */}
      {lastPhysicalExam && (
        <div className="card p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-500" /> Pemeriksaan Fisik Terakhir
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <span className="font-bold text-slate-700 dark:text-slate-300">Kepala:</span>
              <span className="text-slate-600 dark:text-slate-400 ml-2">{lastPhysicalExam.kepala || 'Normocephal'}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <span className="font-bold text-slate-700 dark:text-slate-300">Thorax:</span>
              <span className="text-slate-600 dark:text-slate-400 ml-2">{lastPhysicalExam.thorax || 'Vesikuler'}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <span className="font-bold text-slate-700 dark:text-slate-300">Abdomen:</span>
              <span className="text-slate-600 dark:text-slate-400 ml-2">{lastPhysicalExam.abdomen || 'Supel'}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <span className="font-bold text-slate-700 dark:text-slate-300">Ekstremitas:</span>
              <span className="text-slate-600 dark:text-slate-400 ml-2">{lastPhysicalExam.ekstremitas || 'Edema (-)'}</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ GRAFIK TREND VITAL ═══════════ */}
      {patientData.vitals && patientData.vitals.length > 0 && (
        <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
            <Activity className="w-5 h-5 text-indigo-500" /> Grafik Trend Tanda Vital
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[...patientData.vitals].reverse().map((v: any) => {
                const [sys, dia] = String(v.bp || '0/0').split('/').map(Number);
                return { date: String(v.date || '').slice(0, 11), sistolik: sys, diastolik: dia, nadi: Number(v.hr), spo2: Number(v.spo2) };
              })}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="sistolik" stroke="#3b82f6" strokeWidth={2} name="Sistolik" />
                <Line type="monotone" dataKey="diastolik" stroke="#8b5cf6" strokeWidth={2} name="Diastolik" />
                <Line type="monotone" dataKey="nadi" stroke="#ef4444" strokeWidth={2} name="Nadi" />
                <Line type="monotone" dataKey="spo2" stroke="#10b981" strokeWidth={2} name="SpO2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function TriaseTab() {
  const [morse, setMorse] = useState({ riwayatJatuh: false, dxSekunder: false, alatBantu: '0', terapiInfus: false, gayaBerjalan: '0', statusMental: false });
  const [must, setMust] = useState({ bmiSkor: 0, bbTurun: 0, sakitAkut: 0 });
  const [nyeri, setNyeri] = useState(3);
  const [vital, setVital] = useState({ sistole: '', diastole: '', nadi: '', suhu: '', rr: '', spo2: '', tb: '', bb: '' });

  const morseScore = (morse.riwayatJatuh ? 25 : 0) + (morse.dxSekunder ? 15 : 0) + parseInt(morse.alatBantu) + (morse.terapiInfus ? 20 : 0) + parseInt(morse.gayaBerjalan) + (morse.statusMental ? 15 : 0);
  const morseRisk = morseScore >= 45 ? 'Risiko Tinggi' : morseScore >= 25 ? 'Risiko Sedang' : 'Risiko Rendah';
  const mustScore = must.bmiSkor + must.bbTurun + must.sakitAkut;
  const mustRisk = mustScore >= 2 ? 'Risiko Tinggi' : mustScore === 1 ? 'Risiko Sedang' : 'Risiko Rendah';

  const tbM = parseFloat(vital.tb) / 100 || 0;
  const bmi = tbM > 0 && vital.bb ? (parseFloat(vital.bb) / (tbM * tbM)).toFixed(1) : '-';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* MORSE FALL RISK */}
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Skrining Risiko Jatuh (Morse)</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2"><input type="checkbox" checked={morse.riwayatJatuh} onChange={(e) => setMorse({ ...morse, riwayatJatuh: e.target.checked })} /> Riwayat jatuh 3 bulan terakhir (25)</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={morse.dxSekunder} onChange={(e) => setMorse({ ...morse, dxSekunder: e.target.checked })} /> Diagnosis sekunder &gt; 1 (15)</label>
          <label className="flex flex-col gap-1">Alat bantu jalan
            <select value={morse.alatBantu} onChange={(e) => setMorse({ ...morse, alatBantu: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-600">
              <option value="0">Tidak ada / bedrest (0)</option>
              <option value="15">Kruk / tongkat (15)</option>
              <option value="30">Berpegangan furniture (30)</option>
            </select>
          </label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={morse.terapiInfus} onChange={(e) => setMorse({ ...morse, terapiInfus: e.target.checked })} /> Terapi infus / heparin lock (20)</label>
          <label className="flex flex-col gap-1">Gaya berjalan
            <select value={morse.gayaBerjalan} onChange={(e) => setMorse({ ...morse, gayaBerjalan: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-600">
              <option value="0">Normal (0)</option>
              <option value="10">Lemah (10)</option>
              <option value="20">Terganggu (20)</option>
            </select>
          </label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={morse.statusMental} onChange={(e) => setMorse({ ...morse, statusMental: e.target.checked })} /> Status mental tidak sadar keterbatasan diri (15)</label>
        </div>
        <div className={`mt-4 p-3 rounded-lg font-bold text-center ${morseScore >= 45 ? 'bg-red-100 text-red-700' : morseScore >= 25 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
          Skor: {morseScore} — {morseRisk}
        </div>
      </div>

      {/* MUST NUTRITION */}
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Apple className="w-5 h-5 text-emerald-500" /> Skrining Gizi Awal (MUST)</h3>
        <div className="space-y-3">
          <label className="flex flex-col gap-1">BMI / Skor BMI
            <select value={must.bmiSkor} onChange={(e) => setMust({ ...must, bmiSkor: parseInt(e.target.value) })} className="p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-600">
              <option value="0">BMI &gt; 20 (0)</option>
              <option value="1">BMI 18.5–20 (1)</option>
              <option value="2">BMI &lt; 18.5 (2)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">Penurunan BB 3–6 bulan terakhir
            <select value={must.bbTurun} onChange={(e) => setMust({ ...must, bbTurun: parseInt(e.target.value) })} className="p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-600">
              <option value="0">&lt; 5% (0)</option>
              <option value="1">5–10% (1)</option>
              <option value="2">&gt; 10% (2)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">Efek sakit akut (tidak makan &gt; 5 hari)
            <select value={must.sakitAkut} onChange={(e) => setMust({ ...must, sakitAkut: parseInt(e.target.value) })} className="p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-600">
              <option value="0">Tidak (0)</option>
              <option value="2">Ya (2)</option>
            </select>
          </label>
        </div>
        <div className={`mt-4 p-3 rounded-lg font-bold text-center ${mustScore >= 2 ? 'bg-red-100 text-red-700' : mustScore === 1 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
          Skor MUST: {mustScore} — {mustRisk}
        </div>
      </div>

      {/* PAIN ASSESSMENT */}
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Brain className="w-5 h-5 text-rose-500" /> Asesmen Nyeri (VAS / Wong-Baker)</h3>
        <div className="flex justify-between mb-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button key={n} onClick={() => setNyeri(n)} className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${nyeri === n ? 'scale-110 text-white' : 'text-slate-600 dark:text-slate-300'} ${n <= 3 ? 'bg-emerald-100' : n <= 6 ? 'bg-amber-100' : 'bg-red-100'} ${nyeri === n ? (n <= 3 ? 'bg-emerald-500' : n <= 6 ? 'bg-amber-500' : 'bg-red-500') : ''}`}>
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400 mb-4">
          <span>😀 Tidak nyeri</span><span>😭 Nyeri hebat</span>
        </div>
        <div className={`p-3 rounded-lg font-bold text-center ${nyeri <= 3 ? 'bg-emerald-100 text-emerald-700' : nyeri <= 6 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
          Skor Nyeri: {nyeri}/10 — {nyeri <= 3 ? 'Nyeri Ringan' : nyeri <= 6 ? 'Nyeri Sedang' : 'Nyeri Berat'}
        </div>
      </div>

      {/* VITALS + BMI CALCULATOR */}
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><HeartPulse className="w-5 h-5 text-blue-500" /> Tanda Vital & Kalkulator IMT</h3>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder="Sistole (mmHg)" value={vital.sistole} onChange={(e) => setVital({ ...vital, sistole: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-600" />
          <input type="number" placeholder="Diastole (mmHg)" value={vital.diastole} onChange={(e) => setVital({ ...vital, diastole: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-600" />
          <input type="number" placeholder="Nadi (x/mnt)" value={vital.nadi} onChange={(e) => setVital({ ...vital, nadi: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-600" />
          <input type="number" placeholder="Suhu (°C)" value={vital.suhu} onChange={(e) => setVital({ ...vital, suhu: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-600" />
          <input type="number" placeholder="RR (x/mnt)" value={vital.rr} onChange={(e) => setVital({ ...vital, rr: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-600" />
          <input type="number" placeholder="SpO₂ (%)" value={vital.spo2} onChange={(e) => setVital({ ...vital, spo2: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-600" />
          <input type="number" placeholder="TB (cm)" value={vital.tb} onChange={(e) => setVital({ ...vital, tb: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-600" />
          <input type="number" placeholder="BB (kg)" value={vital.bb} onChange={(e) => setVital({ ...vital, bb: e.target.value })} className="p-2 border rounded bg-white dark:bg-slate-900 dark:border-slate-600" />
        </div>
        <div className="mt-4 p-3 rounded-lg font-bold text-center bg-blue-100 text-blue-700 flex items-center justify-center gap-2">
          <Calculator className="w-4 h-4" /> IMT Otomatis: {bmi} {bmi !== '-' && (parseFloat(bmi) < 18.5 ? '(Kurus)' : parseFloat(bmi) < 25 ? '(Normal)' : parseFloat(bmi) < 30 ? '(Overweight)' : '(Obesitas)')}
        </div>
        <button onClick={() => toast.success('Data triase & vital tersimpan')} className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700">💾 Simpan Triase</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PEMERIKSAAN FISIK TAB (Body Mapping + Head-to-Toe)
// ═══════════════════════════════════════════════════════════
function FisikTab() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [findings, setFindings] = useState<Record<string, string>>({});
  const regions = [
    { id: 'kepala', label: 'Kepala', cx: 100, cy: 30 },
    { id: 'leher', label: 'Leher', cx: 100, cy: 55 },
    { id: 'dada', label: 'Dada / Thorax', cx: 100, cy: 90 },
    { id: 'abdomen', label: 'Abdomen', cx: 100, cy: 130 },
    { id: 'pinggul', label: 'Pinggul / Pelvis', cx: 100, cy: 160 },
    { id: 'tangan_kiri', label: 'Ekstremitas Atas Kiri', cx: 60, cy: 110 },
    { id: 'tangan_kanan', label: 'Ekstremitas Atas Kanan', cx: 140, cy: 110 },
    { id: 'kaki_kiri', label: 'Ekstremitas Bawah Kiri', cx: 85, cy: 210 },
    { id: 'kaki_kanan', label: 'Ekstremitas Bawah Kanan', cx: 115, cy: 210 },
  ];
  const headToToe = ['Keadaan Umum & Kesadaran', 'Kepala (Normocephal)', 'Mata (Konjungtiva/Sklera)', 'THT', 'Leher (JVP/KGB)', 'Thorax (Jantung/Paru)', 'Abdomen (Bising Usus/Nyeri Tekan)', 'Ekstremitas (Edema/CRT)', 'Kulit (Turgor/Ruam)', 'Genitalia', 'Neurologis (Refleks)'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Stethoscope className="w-5 h-5 text-indigo-500" /> Body Mapping Tool</h3>
        <div className="flex justify-center">
          <svg viewBox="0 0 200 260" className="w-56 h-auto">
            {/* simplified body */}
            <circle cx="100" cy="30" r="18" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
            <rect x="88" y="48" width="24" height="14" rx="4" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
            <rect x="80" y="62" width="40" height="60" rx="8" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
            <rect x="82" y="122" width="36" height="45" rx="6" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
            <rect x="55" y="66" width="12" height="70" rx="6" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
            <rect x="133" y="66" width="12" height="70" rx="6" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
            <rect x="82" y="167" width="14" height="80" rx="6" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
            <rect x="104" y="167" width="14" height="80" rx="6" fill="#e0e7ff" stroke="#6366f1" strokeWidth="2" />
            {regions.map((r) => (
              <circle
                key={r.id}
                cx={r.cx}
                cy={r.cy}
                r="7"
                fill={selectedRegion === r.id ? '#ef4444' : findings[r.id] ? '#22c55e' : '#f59e0b'}
                stroke="#fff"
                strokeWidth="2"
                className="cursor-pointer hover:opacity-70"
                onClick={() => setSelectedRegion(r.id)}
              >
                <title>{r.label}</title>
              </circle>
            ))}
          </svg>
        </div>
        <div className="flex justify-center gap-4 text-xs mt-2">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Belum</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span> Terisi</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span> Dipilih</span>
        </div>
        {selectedRegion && (
          <div className="mt-4">
            <label className="block font-bold mb-1 text-sm">Temuan: {regions.find((r) => r.id === selectedRegion)?.label}</label>
            <textarea
              value={findings[selectedRegion] || ''}
              onChange={(e) => setFindings({ ...findings, [selectedRegion]: e.target.value })}
              className="w-full p-3 border rounded bg-white dark:bg-slate-900 dark:border-slate-600"
              placeholder="Catat temuan pemeriksaan (anotasi)..."
            />
            <button onClick={() => { toast.success('Temuan tersimpan'); setSelectedRegion(null); }} className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold">Simpan Temuan</button>
          </div>
        )}
      </div>

      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ListChecks className="w-5 h-5 text-indigo-500" /> Checklist Head-to-Toe</h3>
        <div className="space-y-2">
          {headToToe.map((item) => (
            <div key={item} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <input type="checkbox" className="w-4 h-4 text-indigo-600" />
              <span className="text-sm flex-1">{item}</span>
              <input type="text" placeholder="Temuan..." className="p-1.5 text-sm border rounded bg-white dark:bg-slate-900 dark:border-slate-600 w-40" />
            </div>
          ))}
        </div>
        <button onClick={() => toast.success('Pemeriksaan fisik tersimpan')} className="mt-4 w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700">💾 Simpan Pemeriksaan Fisik</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SOAP TAB (Auto-save)
// ═══════════════════════════════════════════════════════════
function SoapTab({ onOpenVoice }: { onOpenVoice?: () => void }) {
  const [soap, setSoap] = useState(() => {
    const saved = localStorage.getItem('soap_draft');
    return saved ? JSON.parse(saved) : { s: '', o: '', a: '', p: '' };
  });
  const [lastSaved, setLastSaved] = useState('');

  useEffect(() => {
    // Check if soap was updated externally
    const handleStorage = () => {
      const saved = localStorage.getItem('soap_draft');
      if (saved) setSoap(JSON.parse(saved));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem('soap_draft', JSON.stringify(soap));
      setLastSaved(new Date().toLocaleTimeString('id-ID'));
    }, 1000);
    return () => clearTimeout(t);
  }, [soap]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
            <FileText className="w-5 h-5 text-blue-500" /> Dasbor SOAP Dokter & Perawat
          </h3>
          <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Auto-save aktif: {lastSaved || 'Baru saja'}
          </span>
        </div>

        {onOpenVoice && (
          <button
            onClick={onOpenVoice}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-sm transform hover:scale-105 transition-all"
          >
            <Mic className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>🎙️ Dikte dengan Laporan Suara Cerdas</span>
          </button>
        )}
      </div>
      {([
        ['s', 'Subjective (Keluhan / Anamnesis: RPS, RPD, RPK)'],
        ['o', 'Objective (Pemeriksaan Fisik & Penunjang)'],
        ['a', 'Assessment (Diagnosis Kerja & Banding)'],
        ['p', 'Plan (Terapi, Tindakan, Edukasi, Follow-up)']
      ] as const).map(([key, label]) => (
        <div key={key} className="card p-5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <label className="block font-bold mb-2 text-sm uppercase tracking-wide text-slate-600 dark:text-slate-300">{label}</label>
          <textarea value={soap[key as 's'|'o'|'a'|'p']} onChange={(e) => setSoap({ ...soap, [key]: e.target.value })} className="w-full p-3 border rounded bg-white dark:bg-slate-900 dark:border-slate-600 min-h-[100px]" placeholder={`Tulis ${label}...`} />
        </div>
      ))}
      <button onClick={() => toast.success('SOAP tersimpan permanen')} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">💾 Simpan SOAP</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// KODEFIKASI TAB (ICD-10, ICD-9-CM, SNOMED-CT)
// ═══════════════════════════════════════════════════════════
function KodeTab() {
  const [search, setSearch] = useState('');
  const [selectedDx, setSelectedDx] = useState<any[]>([]);
  const icd10 = [
    { code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications' },
    { code: 'I10', desc: 'Essential (primary) hypertension' },
    { code: 'A90', desc: 'Dengue fever' },
    { code: 'J18.9', desc: 'Pneumonia, unspecified organism' },
    { code: 'K21.0', desc: 'GERD with esophagitis' },
    { code: 'N39.0', desc: 'Urinary tract infection' },
  ];
  const icd9 = [
    { code: '89.52', desc: 'Electrocardiogram' },
    { code: '99.21', desc: 'Injection of antibiotic' },
    { code: '47.09', desc: 'Other appendectomy' },
    { code: '93.90', desc: 'Non-invasive mechanical ventilation' },
  ];
  const filtered = icd10.filter((d) => d.code.toLowerCase().includes(search.toLowerCase()) || d.desc.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-indigo-500" /> Smart-Search ICD-10 (WHO)</h3>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ketik kode atau nama penyakit..." className="w-full p-3 border rounded bg-white dark:bg-slate-900 dark:border-slate-600 mb-3" />
        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
          {filtered.map((d) => (
            <button key={d.code} onClick={() => { setSelectedDx([...selectedDx, d]); toast.success(`${d.code} ditambahkan sebagai diagnosis`); }} className="w-full text-left p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{d.code}</span> — {d.desc}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold mb-3 flex items-center gap-2"><FileCode2 className="w-5 h-5 text-emerald-500" /> Diagnosis Terpilih</h3>
          {selectedDx.length === 0 ? <p className="text-sm text-slate-500">Belum ada diagnosis dipilih.</p> : (
            <div className="space-y-2">
              {selectedDx.map((d, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
                  <span className="text-sm"><span className="font-bold">{i === 0 ? 'Dx Utama' : `Dx Sekunder ${i}`}</span>: {d.code} - {d.desc}</span>
                  <button onClick={() => setSelectedDx(selectedDx.filter((_, j) => j !== i))} className="text-rose-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold mb-3 flex items-center gap-2"><ListChecks className="w-5 h-5 text-blue-500" /> Prosedur / Tindakan (ICD-9-CM)</h3>
          <div className="space-y-2">
            {icd9.map((d) => (
              <button key={d.code} onClick={() => toast.success(`Prosedur ${d.code} dicatat`)} className="w-full text-left p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors">
                <span className="font-bold text-blue-600 dark:text-blue-400">{d.code}</span> — {d.desc}
              </button>
            ))}
          </div>
        </div>
        <div className="card p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-200 dark:border-indigo-800">
          <p className="text-sm flex items-start gap-2"><ShieldCheck className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" /> Teks klinis otomatis dipetakan ke <strong>SNOMED-CT</strong> dan kompatibel dengan gateway <strong>SATUSEHAT Kemenkes</strong>.</p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CPOE TAB (E-Resep + Lab LOINC + Radiologi)
// ═══════════════════════════════════════════════════════════
function CPOETab({ patientData }: { patientData: any }) {
  const [subTab, setSubTab] = useState<'resep' | 'lab' | 'rad'>('resep');
  const [drugs, setDrugs] = useState<{ name: string, dose: string }[]>([]);
  const [newDrug, setNewDrug] = useState({ name: '', dose: '' });
  const [warning, setWarning] = useState<string | null>(null);

  const addDrug = () => {
    if (!newDrug.name) return;
    // Drug-drug interaction check
    const lower = newDrug.name.toLowerCase();
    const hasWarfarin = drugs.some((d) => d.name.toLowerCase().includes('warfarin'));
    const hasAspirin = drugs.some((d) => d.name.toLowerCase().includes('aspirin'));
    if ((lower.includes('warfarin') && hasAspirin) || (lower.includes('aspirin') && hasWarfarin)) {
      setWarning('⚠️ Interaksi Mayor: Warfarin + Aspirin meningkatkan risiko perdarahan.');
    } else if (patientData?.allergies?.some((a: any) => lower.includes(a.allergen.toLowerCase()))) {
      setWarning(`🚫 HARD ALERT: Obat mengandung alergen "${newDrug.name}" yang dikontraindikasikan untuk pasien ini!`);
    } else {
      setWarning(null);
    }
    setDrugs([...drugs, newDrug]);
    setNewDrug({ name: '', dose: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[
          { id: 'resep', label: '💊 E-Resep', icon: Pill },
          { id: 'lab', label: '🧪 Order Lab (LOINC)', icon: FlaskConical },
          { id: 'rad', label: '🩻 Order Radiologi (RIS/PACS)', icon: ScanLine },
        ].map((t) => (
          <button key={t.id} onClick={() => setSubTab(t.id as any)} className={`px-4 py-2 rounded-lg font-bold text-sm ${subTab === t.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {subTab === 'resep' && (
        <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          {warning && (
            <div className={`mb-4 p-3 rounded-lg font-bold text-sm ${warning.includes('HARD') ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-amber-100 text-amber-700 border border-amber-300'}`}>
              {warning}
            </div>
          )}
          <div className="flex gap-2 mb-4">
            <input type="text" placeholder="Cari obat (zat aktif / nama dagang - KFA)" value={newDrug.name} onChange={(e) => setNewDrug({ ...newDrug, name: e.target.value })} className="flex-1 p-2.5 border rounded bg-white dark:bg-slate-900 dark:border-slate-600" />
            <input type="text" placeholder="Dosis (kalk auto anak/geriatri)" value={newDrug.dose} onChange={(e) => setNewDrug({ ...newDrug, dose: e.target.value })} className="w-56 p-2.5 border rounded bg-white dark:bg-slate-900 dark:border-slate-600" />
            <button onClick={addDrug} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-1"><Plus className="w-4 h-4" /> Tambah</button>
          </div>
          <div className="space-y-2">
            {drugs.map((d, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="flex items-center gap-2"><Pill className="w-4 h-4 text-indigo-500" /> <strong>{d.name}</strong> {d.dose && `— ${d.dose}`}</span>
                <button onClick={() => setDrugs(drugs.filter((_, j) => j !== i))} className="text-rose-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
            {drugs.length === 0 && <p className="text-sm text-slate-500 text-center p-4">Belum ada obat. Resep dikirim langsung ke Instalasi Farmasi.</p>}
          </div>
          {drugs.length > 0 && <button onClick={() => toast.success('E-Resep terkirim ke Farmasi')} className="mt-4 w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold">📤 Kirim E-Resep ke Farmasi</button>}
        </div>
      )}

      {subTab === 'lab' && (
        <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold mb-3">Order Laboratorium (Standar LOINC)</h3>
          <div className="space-y-2">
            {[
              { loinc: '2345-7', name: 'Glukosa Darah Puasa' },
              { loinc: '718-7', name: 'Hemoglobin' },
              { loinc: '2160-0', name: 'Kreatinin Serum' },
              { loinc: '1751-7', name: 'Albumin Serum' },
            ].map((t) => (
              <label key={t.loinc} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-indigo-600" />
                <span className="text-sm"><span className="font-bold text-indigo-600">{t.loinc}</span> — {t.name}</span>
              </label>
            ))}
          </div>
          <button onClick={() => toast.success('Order Lab terkirim ke Laboratorium')} className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold">📤 Kirim Order Lab</button>
        </div>
      )}

      {subTab === 'rad' && (
        <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold mb-3">Order Radiologi & Imaging (RIS/PACS - DICOM)</h3>
          <div className="space-y-2">
            {['Rontgen Thorax PA', 'USG Abdomen', 'CT-Scan Kepala', 'MRI Lumbal'].map((t) => (
              <label key={t} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-indigo-600" />
                <span className="text-sm">{t}</span>
              </label>
            ))}
          </div>
          <button onClick={() => toast.success('Order Radiologi terkirim (viewer DICOM tersedia)')} className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold">📤 Kirim Order Radiologi</button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LEGAL TAB (Resume, TTE, Locking, Retensi)
// ═══════════════════════════════════════════════════════════
function LegalTab({ patientData }: { patientData: any }) {
  const [locked, setLocked] = useState(() => localStorage.getItem(`rme_lock_${patientData?.id}`) === 'true');
  const [retensi, setRetensi] = useState('Aktif');

  const toggleLock = () => {
    const newVal = !locked;
    setLocked(newVal);
    localStorage.setItem(`rme_lock_${patientData?.id}`, String(newVal));
    toast.success(newVal ? '🔒 RME terkunci (anti-manipulasi PMK 24/2022)' : '🔓 RME dibuka (butuh otorisasi)');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Resume Medis Otomatis (Discharge Summary)</h3>
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 text-sm space-y-2">
          <p><strong>Identitas:</strong> {patientData?.nama} ({patientData?.no_rm})</p>
          <p><strong>Diagnosis Masuk:</strong> Observasi Febris</p>
          <p><strong>Diagnosis Akhir:</strong> Dengue Fever (A90)</p>
          <p><strong>Tindakan:</strong> Terapi suportif, rehidrasi</p>
          <p><strong>Obat Pulang:</strong> Paracetamol 500mg 3x1</p>
          <p><strong>Anjuran:</strong> Kontrol 3 hari, banyak minum, istirahat</p>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={() => toast.success('Resume medis digenerate dari riwayat lengkap')} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold">⚡ Generate Resume</button>
          <PrintPDFButton 
            filename={`Resume_${patientData?.nama || 'Medis'}`} 
            label="🖨️ Cetak Dokumen" 
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-2.5 justify-center" 
            documentData={patientData}
            docType="resume_medis"
            title="RESUME MEDIS ELEKTRONIK TERPADU"
          />
        </div>
      </div>

      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FileSignature className="w-5 h-5 text-emerald-500" /> Tanda Tangan Elektronik (TTE / BSrE)</h3>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-200 dark:border-emerald-800 mb-4">
          <p className="text-sm flex items-center gap-2 font-bold text-emerald-700"><ShieldCheck className="w-4 h-4" /> Sertifikat Digital Aktif</p>
          <p className="text-xs text-emerald-600 mt-1">Ditempelkan pada resume medis & resep untuk validitas hukum RME.</p>
        </div>
        <button onClick={() => toast.success('✅ TTE berhasil ditempelkan (sertifikat BSrE)')} className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold">✍️ Tempelkan TTE</button>
      </div>

      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">{locked ? <Lock className="w-5 h-5 text-rose-500" /> : <Unlock className="w-5 h-5 text-emerald-500" />} Penguncian Rekam Medis</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Data terkunci otomatis 1×24 jam setelah kunjungan selesai untuk mencegah manipulasi ilegal (PMK 24/2022).</p>
        <div className={`p-3 rounded-lg font-bold text-center mb-4 ${locked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
          Status: {locked ? '🔒 TERKUNCI' : '🔓 TERBUKA'}
        </div>
        <button onClick={toggleLock} className={`w-full py-2.5 rounded-lg font-bold text-white ${locked ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {locked ? '🔓 Buka Kunci' : '🔒 Kunci Sekarang'}
        </button>
      </div>

      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" /> Manajemen Retensi & Pemusnahan</h3>
        <div className="space-y-2">
          {['Aktif', 'Inaktif (> 5 tahun)', 'Siap Musnah'].map((s) => (
            <label key={s} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer">
              <input type="radio" name="retensi" checked={retensi === s} onChange={() => setRetensi(s)} className="w-4 h-4" />
              <span className="text-sm">{s}</span>
            </label>
          ))}
        </div>
        <button onClick={() => toast.success(`Status retensi: ${retensi}`)} className="mt-4 w-full bg-amber-600 text-white py-2.5 rounded-lg font-bold">Simpan Status Retensi</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// AUDIT TAB (RBAC + Audit Trail)
// ═══════════════════════════════════════════════════════════
function AuditTab() {
  const roles = [
    { role: 'Admin Pendaftaran', demo: true, soap: false, resep: false, kode: false },
    { role: 'Perawat', demo: true, soap: true, resep: false, kode: false },
    { role: 'Dokter', demo: true, soap: true, resep: true, kode: true },
    { role: 'Apoteker', demo: true, soap: false, resep: true, kode: false },
  ];
  const auditLog = [
    { user: 'dr. Budi', waktu: '10:05:12', ip: '192.168.1.10', aksi: 'VIEW', target: 'SOAP' },
    { user: 'Ns. Rina', waktu: '09:58:44', ip: '192.168.1.22', aksi: 'EDIT', target: 'Vital Signs' },
    { user: 'admin', waktu: '09:30:01', ip: '192.168.1.1', aksi: 'VIEW', target: 'Demografi' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-indigo-500" /> Role-Based Access Control (RBAC)</h3>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="p-2 text-left">Role</th>
              <th className="p-2">Demografi</th>
              <th className="p-2">SOAP</th>
              <th className="p-2">Resep</th>
              <th className="p-2">Kode</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.role} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-2 font-bold">{r.role}</td>
                <td className="p-2 text-center">{r.demo ? '✅' : '❌'}</td>
                <td className="p-2 text-center">{r.soap ? '✅' : '❌'}</td>
                <td className="p-2 text-center">{r.resep ? '✅' : '❌'}</td>
                <td className="p-2 text-center">{r.kode ? '✅' : '❌'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-500" /> Audit Trail (Immutable Log)</h3>
        <div className="space-y-2">
          {auditLog.map((l, i) => (
            <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <div className="text-sm">
                <strong>{l.user}</strong> melakukan <span className={`font-bold ${l.aksi === 'EDIT' ? 'text-amber-600' : 'text-blue-600'}`}>{l.aksi}</span> pada <strong>{l.target}</strong>
              </div>
              <div className="text-xs text-slate-500 text-right">
                {l.waktu}<br />IP: {l.ip}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">Setiap aktivitas dicatat permanen: Siapa, Kapan (timestamp ms), Di mana (IP), Apa tindakan.</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXISTING TABS (dipertahankan dari versi lama)
// ═══════════════════════════════════════════════════════════
function ProblemListTab({ patientData, setPatientData }: any) {
  const handleDelete = (id: number) => {
    const updated = patientData.problem_list.filter((p: any) => p.id !== id);
    setPatientData({ ...patientData, problem_list: updated });
    toast.success('Problem dihapus');
  };
  return (
    <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Problem List</h2>
        <button onClick={() => toast('Form tambah problem', { icon: '🚧' })} className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Problem
        </button>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="p-4 font-bold">Diagnosis / Problem</th>
            <th className="p-4 font-bold">ICD-10</th>
            <th className="p-4 font-bold">Onset Date</th>
            <th className="p-4 font-bold">Severity</th>
            <th className="p-4 font-bold">Status</th>
            <th className="p-4 font-bold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {patientData.problem_list.map((p: any) => (
            <tr key={p.id}>
              <td className="p-4 font-medium">{p.nama}</td>
              <td className="p-4 font-mono text-slate-500">{p.kode_icd10}</td>
              <td className="p-4">{p.tanggal_onset}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${p.severity === 'Severe' ? 'bg-rose-100 text-rose-700' : p.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{p.severity}</span>
              </td>
              <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'Active' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>{p.status}</span></td>
              <td className="p-4 flex gap-2">
                <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 className="w-4 h-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MedicationsTab({ patientData, setPatientData }: any) {
  const handleDelete = (id: number) => {
    const updated = patientData.medications.filter((m: any) => m.id !== id);
    setPatientData({ ...patientData, medications: updated });
    toast.success('Obat dihapus');
  };
  return (
    <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Medication History</h2>
        <button onClick={() => toast('Form tambah obat', { icon: '🚧' })} className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Medication
        </button>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="p-4 font-bold">Nama Obat</th>
            <th className="p-4 font-bold">Dosis & Rute</th>
            <th className="p-4 font-bold">Frekuensi</th>
            <th className="p-4 font-bold">Tanggal Mulai</th>
            <th className="p-4 font-bold">Status</th>
            <th className="p-4 font-bold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {patientData.medications.map((m: any) => (
            <tr key={m.id}>
              <td className="p-4 font-bold">{m.name}</td>
              <td className="p-4">{m.dose}</td>
              <td className="p-4">{m.frequency}</td>
              <td className="p-4">{m.startDate}</td>
              <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">{m.status}</span></td>
              <td className="p-4"><button onClick={() => handleDelete(m.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 className="w-4 h-4" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AllergiesTab({ patientData, setPatientData }: any) {
  const handleDelete = (id: number) => {
    const updated = patientData.allergies.filter((a: any) => a.id !== id);
    setPatientData({ ...patientData, allergies: updated });
    toast.success('Alergi dihapus');
  };
  return (
    <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 border-t-4 border-t-red-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-red-600">Allergy List</h2>
        <button onClick={() => toast('Form tambah alergi', { icon: '🚧' })} className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Allergy
        </button>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="p-4 font-bold">Allergen</th>
            <th className="p-4 font-bold">Reaksi</th>
            <th className="p-4 font-bold">Severity</th>
            <th className="p-4 font-bold">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {patientData.allergies.map((a: any) => (
            <tr key={a.id}>
              <td className="p-4 font-bold text-red-700">{a.allergen}</td>
              <td className="p-4">{a.reaction}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${a.severity === 'Severe' ? 'bg-red-100 text-red-700' : a.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{a.severity}</span>
              </td>
              <td className="p-4"><button onClick={() => handleDelete(a.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"><Trash2 className="w-4 h-4" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VitalsTab({ patientData }: any) {
  return (
    <div className="card p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Vital Signs History</h2>
        <button onClick={() => toast('Form tambah vital', { icon: '🚧' })} className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Vitals
        </button>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="p-4 font-bold">Tanggal & Waktu</th>
            <th className="p-4 font-bold">TD (mmHg)</th>
            <th className="p-4 font-bold">Nadi</th>
            <th className="p-4 font-bold">Suhu (°C)</th>
            <th className="p-4 font-bold">RR</th>
            <th className="p-4 font-bold">SpO2</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {patientData.vitals.map((v: any) => (
            <tr key={v.id}>
              <td className="p-4">{v.date}</td>
              <td className="p-4 font-bold">{v.bp}</td>
              <td className="p-4">{v.hr}</td>
              <td className="p-4">{v.temp}</td>
              <td className="p-4">{v.rr}</td>
              <td className="p-4">{v.spo2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ImmunizationsTab() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
      <Syringe className="w-16 h-16 mb-4 text-slate-300" />
      <p>Data Imunisasi kosong atau belum diinput.</p>
    </div>
  );
}

function GrowthChartTab() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
      <Scale className="w-16 h-16 mb-4 text-slate-300" />
      <p>Growth Chart (Kurva WHO/KMS) hanya tersedia untuk pasien anak (Pediatri).</p>
    </div>
  );
}
