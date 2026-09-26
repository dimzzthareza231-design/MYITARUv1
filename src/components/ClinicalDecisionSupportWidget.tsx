import React, { useState, useEffect, useMemo } from 'react';
import {
  Brain,
  Sparkles,
  Activity,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Printer,
  RefreshCw,
  X,
  ShieldAlert,
  HeartPulse,
  Stethoscope,
  Thermometer,
  Wind,
  Zap,
  FileText,
  ArrowRight,
  Info,
  AlertCircle,
  Bookmark,
  Share2,
  Sliders,
  Flame,
  Droplet
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export interface CDSVPatients {
  name?: string;
  noRm?: string;
  age?: number | string;
  gender?: string;
  allergies?: string;
  history?: string;
}

export interface CDSVitals {
  systolic?: number | string;
  diastolic?: number | string;
  heartRate?: number | string;
  temperature?: number | string;
  respiratoryRate?: number | string;
  spO2?: number | string;
  weight?: number | string;
  height?: number | string;
  painScale?: number | string;
  gcs?: string;
  bloodGlucose?: number | string;
}

export interface CDSSymptoms {
  chiefComplaint: string;
  duration?: string;
  additionalSymptoms?: string;
  onset?: string;
  aggravatingFactors?: string;
}

export interface CDSResult {
  summary: string;
  vitalStatus: {
    status: 'NORMAL' | 'ABNORMAL' | 'CRITICAL';
    flags: Array<{
      parameter: string;
      value: string;
      severity: 'warning' | 'critical' | 'info';
      message: string;
    }>;
    earlyWarningScore?: {
      score: number;
      category: 'Low' | 'Medium' | 'High';
      recommendation: string;
    };
  };
  triage: {
    level: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
    name: string;
    color: string;
    urgency: string;
  };
  primaryDiagnosis: {
    code: string;
    nameId: string;
    nameEn: string;
    confidence: number;
    reasoning: string;
    clinicalCriteria: string;
    category: string;
  };
  differentialDiagnoses: Array<{
    code: string;
    nameId: string;
    nameEn: string;
    confidence: number;
    reasoning: string;
    differentiatingClues: string;
  }>;
  suggestedIcd9: Array<{
    code: string;
    name: string;
    category: string;
    indication: string;
  }>;
  redFlags: string[];
  recommendedWorkup: Array<{
    category: 'Laboratorium' | 'Radiologi' | 'Diagnostik Lain' | string;
    testName: string;
    reason: string;
  }>;
  immediateActions: string[];
  clinicalGuidelineRef: string;
  disclaimer: string;
}

interface ClinicalDecisionSupportWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
  mode?: 'modal' | 'inline' | 'drawer';
  initialPatient?: CDSVPatients;
  initialVitals?: CDSVitals;
  initialSymptoms?: CDSSymptoms;
  clinicalNotes?: string;
  onApplyDiagnosis?: (diagnosis: { code: string; nameId: string; nameEn?: string; reasoning?: string }) => void;
  onApplyWorkup?: (workups: Array<{ category: string; testName: string; reason: string }>) => void;
  title?: string;
}

// Preset Clinical Cases for Quick Demonstration & Emergency Evaluation
const CLINICAL_PRESETS = [
  {
    label: 'Sindrom Koroner Akut (UAP/NSTEMI)',
    patient: { name: 'Bpk. Ahmad Fauzi', noRm: 'RM-260312-089', age: 54, gender: 'L', history: 'Perokok aktif 25 tahun, Dislipidemia', allergies: 'Tidak ada' },
    vitals: { systolic: 165, diastolic: 95, heartRate: 104, temperature: 36.8, respiratoryRate: 24, spO2: 95, painScale: 8, gcs: '15', bloodGlucose: 145, weight: 72, height: 168 },
    symptoms: {
      chiefComplaint: 'Nyeri dada kiri seperti tertimpa beban berat menjalar ke rahang dan lengan kiri sejak 1 jam lalu.',
      duration: '1 jam',
      additionalSymptoms: 'Keringat dingin profus, sesak napas ringan, mual'
    }
  },
  {
    label: 'Pneumonia Komunitas & Desaturasi SpO2',
    patient: { name: 'Ibu Siti Aminah', noRm: 'RM-260219-142', age: 62, gender: 'P', history: 'Hipertensi terkontrol', allergies: 'Amoxicillin' },
    vitals: { systolic: 135, diastolic: 85, heartRate: 110, temperature: 38.6, respiratoryRate: 28, spO2: 91, painScale: 4, gcs: '15', bloodGlucose: 120, weight: 58, height: 155 },
    symptoms: {
      chiefComplaint: 'Sesak napas memberat disertai batuk produktif dahak kuning kehijauan dan demam tinggi 4 hari.',
      duration: '4 hari',
      additionalSymptoms: 'Ronki basah halus basal bilateral, menggigil, lemas'
    }
  },
  {
    label: 'Demam Berdarah Dengue (DBD Fase Kritis)',
    patient: { name: 'Ananda Kevin Wijaya', noRm: 'RM-260301-205', age: 14, gender: 'L', history: 'Tidak ada riwayat sakit kronis', allergies: 'Tidak ada' },
    vitals: { systolic: 95, diastolic: 65, heartRate: 116, temperature: 37.9, respiratoryRate: 22, spO2: 98, painScale: 5, gcs: '15', bloodGlucose: 95, weight: 45, height: 152 },
    symptoms: {
      chiefComplaint: 'Demam tinggi mendadak hari ke-4, saat ini demam turun tetapi pasien tampak lemas, nyeri ulu hati hebat, dan mimisan.',
      duration: '4 hari',
      additionalSymptoms: 'Nyeri retro-orbital, mual muntah, uji rumple leede positif'
    }
  },
  {
    label: 'Krisis Hiperglikemia / DM Tipe 2',
    patient: { name: 'Ibu Ratna Dewi', noRm: 'RM-251120-033', age: 50, gender: 'P', history: 'Diabetes Melitus Tipe 2 sejak 5 tahun, tidak rutin minum obat', allergies: 'Tidak ada' },
    vitals: { systolic: 140, diastolic: 88, heartRate: 98, temperature: 37.0, respiratoryRate: 20, spO2: 97, painScale: 2, gcs: '15', bloodGlucose: 348, weight: 68, height: 158 },
    symptoms: {
      chiefComplaint: 'Badan lemas sekali, sangat sering buang air kecil (terutama malam hari), dan haus terus-menerus sejak 1 minggu terakhir.',
      duration: '1 minggu',
      additionalSymptoms: 'Nafsu makan berkurang, penglihatan kadang kabur, penurunan BB 3 kg'
    }
  },
  {
    label: 'GERD & Dispepsia Akut',
    patient: { name: 'Sdr. Hendra Pratama', noRm: 'RM-260114-118', age: 29, gender: 'L', history: 'Kebiasaan minum kopi pekat & terlambat makan', allergies: 'Tidak ada' },
    vitals: { systolic: 120, diastolic: 80, heartRate: 78, temperature: 36.6, respiratoryRate: 18, spO2: 99, painScale: 5, gcs: '15', bloodGlucose: 102, weight: 65, height: 172 },
    symptoms: {
      chiefComplaint: 'Rasa panas terbakar di ulu hati hingga dada (heartburn) dan rasa asam pahit di tenggorokan setelah makan pedas.',
      duration: '3 hari',
      additionalSymptoms: 'Perut kembung, sering bersendawa, mual tanpa muntah'
    }
  }
];

export default function ClinicalDecisionSupportWidget({
  isOpen = true,
  onClose,
  mode = 'modal',
  initialPatient,
  initialVitals,
  initialSymptoms,
  clinicalNotes: initialNotes = '',
  onApplyDiagnosis,
  onApplyWorkup,
  title = 'Clinical Decision Support (CDSS) • AI ICD-10 Engine'
}: ClinicalDecisionSupportWidgetProps) {
  const toast = useToast();

  // Patient State
  const [patient, setPatient] = useState<CDSVPatients>(initialPatient || {
    name: 'Bpk. Hendra Kusuma',
    noRm: 'RM-260315-042',
    age: 48,
    gender: 'L',
    allergies: 'Tidak ada alergi obat',
    history: 'Hipertensi grade 1'
  });

  // Vitals State
  const [vitals, setVitals] = useState<CDSVitals>(initialVitals || {
    systolic: 150,
    diastolic: 95,
    heartRate: 98,
    temperature: 36.7,
    respiratoryRate: 20,
    spO2: 96,
    weight: 70,
    height: 168,
    painScale: 6,
    gcs: '15',
    bloodGlucose: 130
  });

  // Symptoms State
  const [symptoms, setSymptoms] = useState<CDSSymptoms>(initialSymptoms || {
    chiefComplaint: 'Nyeri dada kiri seperti rasa tertekan beban berat menjalar ke bahu kiri sejak 2 jam lalu pasca aktivitas fisik.',
    duration: '2 jam',
    additionalSymptoms: 'Keringat dingin, dada berdebar, mual ringan'
  });

  const [clinicalNotes, setClinicalNotes] = useState<string>(initialNotes);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CDSResult | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'workup' | 'management'>('diagnosis');
  const [showPatientEdit, setShowPatientEdit] = useState<boolean>(false);

  // Auto-calculated BMI
  const bmi = useMemo(() => {
    const w = Number(vitals.weight);
    const h = Number(vitals.height) / 100;
    if (w > 0 && h > 0) {
      const val = w / (h * h);
      let cat = 'Normal';
      if (val < 18.5) cat = 'Underweight';
      else if (val >= 25 && val < 30) cat = 'Overweight';
      else if (val >= 30) cat = 'Obesitas';
      return { value: val.toFixed(1), category: cat };
    }
    return null;
  }, [vitals.weight, vitals.height]);

  // Vitals Status Checkers
  const bpStatus = useMemo(() => {
    const s = Number(vitals.systolic);
    const d = Number(vitals.diastolic);
    if (!s || !d) return { label: 'Belum diisi', color: 'text-slate-400' };
    if (s >= 180 || d >= 120) return { label: 'Krisis Hipertensi', color: 'text-rose-600 dark:text-rose-400 font-bold' };
    if (s >= 140 || d >= 90) return { label: 'Hipertensi Tkt 2', color: 'text-amber-600 dark:text-amber-400 font-bold' };
    if (s >= 130 || d >= 80) return { label: 'Hipertensi Tkt 1', color: 'text-amber-500' };
    if (s <= 90) return { label: 'Hipotensi', color: 'text-rose-500 font-bold' };
    return { label: 'Normal / Terkontrol', color: 'text-emerald-600 dark:text-emerald-400' };
  }, [vitals.systolic, vitals.diastolic]);

  const hrStatus = useMemo(() => {
    const hr = Number(vitals.heartRate);
    if (!hr) return { label: '-', color: 'text-slate-400' };
    if (hr >= 120) return { label: 'Takikardia Berat', color: 'text-rose-600 dark:text-rose-400 font-bold' };
    if (hr >= 100) return { label: 'Takikardia', color: 'text-amber-500' };
    if (hr < 60) return { label: 'Bradikardia', color: 'text-amber-500' };
    return { label: 'Normal (60-100)', color: 'text-emerald-600 dark:text-emerald-400' };
  }, [vitals.heartRate]);

  const spo2Status = useMemo(() => {
    const sp = Number(vitals.spO2);
    if (!sp) return { label: '-', color: 'text-slate-400' };
    if (sp < 92) return { label: 'Hipoksemia Berat', color: 'text-rose-600 dark:text-rose-400 font-bold' };
    if (sp < 95) return { label: 'Hipoksemia Ringan', color: 'text-amber-500' };
    return { label: 'Aman (≥95%)', color: 'text-emerald-600 dark:text-emerald-400' };
  }, [vitals.spO2]);

  const tempStatus = useMemo(() => {
    const t = Number(vitals.temperature);
    if (!t) return { label: '-', color: 'text-slate-400' };
    if (t >= 39) return { label: 'Hiperpireksia', color: 'text-rose-600 dark:text-rose-400 font-bold' };
    if (t >= 37.8) return { label: 'Febris (Demam)', color: 'text-amber-500 font-bold' };
    if (t < 36.0) return { label: 'Hipotermia', color: 'text-rose-500' };
    return { label: 'Afebris (Normal)', color: 'text-emerald-600 dark:text-emerald-400' };
  }, [vitals.temperature]);

  // Load Presets
  const applyPreset = (preset: typeof CLINICAL_PRESETS[0]) => {
    setPatient(preset.patient);
    setVitals(preset.vitals);
    setSymptoms(preset.symptoms);
    setResult(null);
    toast.info(`Kasus klinis dimuat: ${preset.label}`);
  };

  // Add quick symptom tag
  const addSymptomTag = (tag: string) => {
    setSymptoms(prev => {
      const current = prev.additionalSymptoms ? prev.additionalSymptoms.trim() : '';
      if (current.includes(tag)) return prev;
      return {
        ...prev,
        additionalSymptoms: current ? `${current}, ${tag}` : tag
      };
    });
  };

  // Trigger Gemini Analysis
  const handleAnalyze = async () => {
    if (!symptoms.chiefComplaint.trim() && !clinicalNotes.trim()) {
      toast.error('Mohon isi keluhan utama atau catatan klinis pasien terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/ai/clinical-decision-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient,
          vitals,
          symptoms,
          clinicalNotes
        })
      });

      if (!res.ok) {
        throw new Error(`Server status: ${res.status}`);
      }

      const data: CDSResult = await res.json();
      setResult(data);
      toast.success('Analisis Clinical Decision Support & Rekomendasi ICD-10 Berhasil!');

      // Save to localStorage history
      try {
        const historyKey = 'hospital_cds_records';
        const existing = JSON.parse(localStorage.getItem(historyKey) || '[]');
        const newRecord = {
          id: `CDS-${Date.now()}`,
          timestamp: new Date().toISOString(),
          patientName: patient.name,
          noRm: patient.noRm,
          chiefComplaint: symptoms.chiefComplaint,
          primaryDiagnosis: data.primaryDiagnosis,
          triage: data.triage
        };
        localStorage.setItem(historyKey, JSON.stringify([newRecord, ...existing.slice(0, 49)]));
      } catch (err) {
        console.error('Failed to save CDS history to localStorage:', err);
      }
    } catch (error: any) {
      console.error('CDS API call failed:', error);
      toast.error('Gagal memproses analisis klinis. Menggunakan mesin rule-based internal.');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy code helper
  const handleCopy = (code: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedCode(code);
    toast.success(`Disalin: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Apply diagnosis callback
  const handleApply = (diag: { code: string; nameId: string; nameEn?: string; reasoning?: string }) => {
    if (onApplyDiagnosis) {
      onApplyDiagnosis(diag);
      toast.success(`Diagnosis ${diag.code} (${diag.nameId}) berhasil diterapkan ke berkas pemeriksaan!`);
    } else {
      navigator.clipboard.writeText(`${diag.code} - ${diag.nameId}`);
      toast.success(`Diagnosis ${diag.code} disalin ke clipboard.`);
    }
  };

  // Apply all workups
  const handleApplyAllWorkups = () => {
    if (!result?.recommendedWorkup?.length) return;
    if (onApplyWorkup) {
      onApplyWorkup(result.recommendedWorkup);
      toast.success(`${result.recommendedWorkup.length} pemeriksaan penunjang berhasil ditambahkan ke rencana tindakan!`);
    } else {
      const summary = result.recommendedWorkup.map(w => `[${w.category}] ${w.testName}: ${w.reason}`).join('\n');
      navigator.clipboard.writeText(summary);
      toast.success('Daftar pemeriksaan penunjang disalin ke clipboard.');
    }
  };

  // Copy Complete Clinical Summary
  const handleCopyFullSummary = () => {
    if (!result) return;
    const text = `
=== MYITARU CLINICAL DECISION SUPPORT RESUME ===
Pasien: ${patient.name || '-'} (${patient.noRm || '-'}) | ${patient.age || '-'} Thn (${patient.gender || '-'})
Tanda Vital: TD ${vitals.systolic}/${vitals.diastolic} mmHg, HR ${vitals.heartRate} bpm, RR ${vitals.respiratoryRate} x/m, SpO2 ${vitals.spO2}%, Temp ${vitals.temperature}°C, Nyeri ${vitals.painScale}/10
Keluhan: "${symptoms.chiefComplaint}"
Durasi: ${symptoms.duration || '-'} | Gejala Lain: ${symptoms.additionalSymptoms || '-'}

DIAGNOSIS UTAMA (ICD-10):
- [${result.primaryDiagnosis.code}] ${result.primaryDiagnosis.nameId} (${result.primaryDiagnosis.nameEn}) - Akurasi/Confidence: ${result.primaryDiagnosis.confidence}%
- Rationale: ${result.primaryDiagnosis.reasoning}

DIAGNOSIS BANDING:
${result.differentialDiagnoses.map(d => `- [${d.code}] ${d.nameId} (${d.confidence}%): ${d.reasoning}`).join('\n')}

TRIAGE: ${result.triage.name} (${result.triage.urgency})
EARLY WARNING SCORE: NEWS ${result.vitalStatus.earlyWarningScore?.score || 0} (${result.vitalStatus.earlyWarningScore?.category || '-'})

REKOMENDASI PEMERIKSAAN:
${result.recommendedWorkup.map(w => `- [${w.category}] ${w.testName}`).join('\n')}

TATALAKSANA AWAL:
${result.immediateActions.map(a => `- ${a}`).join('\n')}

Referensi: ${result.clinicalGuidelineRef}
Disclaimer: ${result.disclaimer}
`.trim();

    navigator.clipboard.writeText(text);
    toast.success('Resume lengkap CDS disalin ke clipboard.');
  };

  // Print helper
  const handlePrint = () => {
    window.print();
  };

  if (!isOpen && mode === 'modal') return null;

  const content = (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
      {/* HEADER WIDGET */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 border-b border-indigo-500/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-white/20">
            <Brain className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-indigo-200">
                {title}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-300" />
                Gemini 3.8 Flash
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                CDSS Live
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Analisis cerdas tanda vital & gejala untuk rekomendasi kode diagnosis ICD-10 & ICD-9-CM terintegrasi
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {result && (
            <>
              <button
                onClick={handleCopyFullSummary}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
                title="Salin Resume Lengkap"
              >
                <Share2 className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Salin Resume</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
                title="Cetak Lembar CDSS"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span className="hidden sm:inline">Cetak</span>
              </button>
            </>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-rose-500/40 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="Tutup Widget"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* QUICK PRESETS BAR */}
      <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2 border-b border-slate-200 dark:border-slate-700/60 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1">
          <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
          Simulasi Kasus Cepat:
        </span>
        {CLINICAL_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => applyPreset(preset)}
            className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-600 shrink-0 font-medium transition-colors shadow-2xs"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* BODY GRID: INPUTS (LEFT) vs RESULTS (RIGHT) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT COLUMN: PATIENT, VITALS & SYMPTOMS INPUTS */}
          <div className="lg:col-span-5 space-y-4">
            {/* PATIENT INFO BANNER */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Identitas Pasien Terperiksa</span>
                <button
                  onClick={() => setShowPatientEdit(!showPatientEdit)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  {showPatientEdit ? 'Tutup Edit' : 'Edit Pasien'}
                </button>
              </div>

              {!showPatientEdit ? (
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {patient.name || 'Pasien Anonim'}
                      <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                        ({patient.noRm || '-'})
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {patient.age || '-'} Tahun • {patient.gender === 'L' ? 'Laki-Laki' : patient.gender === 'P' ? 'Perempuan' : patient.gender || '-'} • Riwayat: {patient.history || 'Tidak ada'}
                    </p>
                    {patient.allergies && patient.allergies !== 'Tidak ada' && (
                      <span className="inline-block mt-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                        Alergi: {patient.allergies}
                      </span>
                    )}
                  </div>
                  {bmi && (
                    <div className="text-right pl-2">
                      <span className="text-[10px] text-slate-400 font-bold block">IMT (BMI)</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{bmi.value}</span>
                      <span className="block text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">({bmi.category})</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Nama Pasien</label>
                    <input
                      type="text"
                      value={patient.name || ''}
                      onChange={e => setPatient({ ...patient, name: e.target.value })}
                      className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">No. RM</label>
                    <input
                      type="text"
                      value={patient.noRm || ''}
                      onChange={e => setPatient({ ...patient, noRm: e.target.value })}
                      className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Usia (Tahun)</label>
                    <input
                      type="number"
                      value={patient.age || ''}
                      onChange={e => setPatient({ ...patient, age: e.target.value })}
                      className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Jenis Kelamin</label>
                    <select
                      value={patient.gender || 'L'}
                      onChange={e => setPatient({ ...patient, gender: e.target.value })}
                      className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                    >
                      <option value="L">Laki-laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* VITALS ENTRY & DASHBOARD */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    Tanda Vital Saat Ini (Vitals)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">Parameter Objektif</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* Tekanan Darah */}
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold flex items-center gap-1">
                      <Activity className="w-3 h-3 text-indigo-500" /> TD (mmHg)
                    </span>
                    <span className={`text-[10px] font-bold ${bpStatus.color}`}>{bpStatus.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="120"
                      value={vitals.systolic || ''}
                      onChange={e => setVitals({ ...vitals, systolic: e.target.value })}
                      className="w-full p-1 text-center font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                    />
                    <span className="text-slate-400 font-bold">/</span>
                    <input
                      type="number"
                      placeholder="80"
                      value={vitals.diastolic || ''}
                      onChange={e => setVitals({ ...vitals, diastolic: e.target.value })}
                      className="w-full p-1 text-center font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                    />
                  </div>
                </div>

                {/* Nadi (Heart Rate) */}
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold flex items-center gap-1">
                      <HeartPulse className="w-3 h-3 text-rose-500" /> Nadi (bpm)
                    </span>
                    <span className={`text-[10px] font-bold ${hrStatus.color}`}>{hrStatus.label}</span>
                  </div>
                  <input
                    type="number"
                    placeholder="80"
                    value={vitals.heartRate || ''}
                    onChange={e => setVitals({ ...vitals, heartRate: e.target.value })}
                    className="w-full p-1 text-center font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                  />
                </div>

                {/* Suhu Tubuh */}
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-amber-500" /> Suhu (°C)
                    </span>
                    <span className={`text-[10px] font-bold ${tempStatus.color}`}>{tempStatus.label}</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={vitals.temperature || ''}
                    onChange={e => setVitals({ ...vitals, temperature: e.target.value })}
                    className="w-full p-1 text-center font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                  />
                </div>

                {/* Frekuensi Napas (RR) */}
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold flex items-center gap-1">
                      <Wind className="w-3 h-3 text-cyan-500" /> RR (x/m)
                    </span>
                  </div>
                  <input
                    type="number"
                    placeholder="18"
                    value={vitals.respiratoryRate || ''}
                    onChange={e => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                    className="w-full p-1 text-center font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                  />
                </div>

                {/* Saturasi O2 (SpO2) */}
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-blue-500" /> SpO2 (%)
                    </span>
                    <span className={`text-[10px] font-bold ${spo2Status.color}`}>{spo2Status.label}</span>
                  </div>
                  <input
                    type="number"
                    placeholder="98"
                    value={vitals.spO2 || ''}
                    onChange={e => setVitals({ ...vitals, spO2: e.target.value })}
                    className="w-full p-1 text-center font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                  />
                </div>

                {/* Gula Darah Sewaktu (GDS) */}
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    <span className="font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-purple-500" /> GDS (mg/dL)
                    </span>
                  </div>
                  <input
                    type="number"
                    placeholder="120"
                    value={vitals.bloodGlucose || ''}
                    onChange={e => setVitals({ ...vitals, bloodGlucose: e.target.value })}
                    className="w-full p-1 text-center font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                  />
                </div>
              </div>

              {/* Slider Skala Nyeri (NRS 0-10) */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                    <Flame className={`w-3.5 h-3.5 ${Number(vitals.painScale) >= 7 ? 'text-rose-500' : Number(vitals.painScale) >= 4 ? 'text-amber-500' : 'text-slate-400'}`} />
                    Skala Nyeri (NRS 0–10):
                  </span>
                  <span className={`font-black text-sm px-2 py-0.5 rounded ${
                    Number(vitals.painScale) >= 7 ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                    Number(vitals.painScale) >= 4 ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                  }`}>
                    {vitals.painScale || 0} / 10 • {
                      Number(vitals.painScale) === 0 ? 'Tidak Ada Nyeri' :
                      Number(vitals.painScale) <= 3 ? 'Nyeri Ringan' :
                      Number(vitals.painScale) <= 6 ? 'Nyeri Sedang' : 'Nyeri Berat'
                    }
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={vitals.painScale || 0}
                  onChange={e => setVitals({ ...vitals, painScale: Number(e.target.value) })}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* SYMPTOMS & CHIEF COMPLAINT INPUT */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-indigo-500" />
                  Keluhan Utama & Gejala (Anamnesis)
                </span>
                <span className="text-[10px] text-rose-500 font-bold">*Wajib</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Keluhan Utama (Chief Complaint):
                </label>
                <textarea
                  rows={3}
                  value={symptoms.chiefComplaint}
                  onChange={e => setSymptoms({ ...symptoms, chiefComplaint: e.target.value })}
                  placeholder="Contoh: Nyeri dada kiri menjalar ke rahang dan lengan kiri sejak 2 jam lalu..."
                  className="w-full p-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Durasi / Onset:
                  </label>
                  <input
                    type="text"
                    value={symptoms.duration || ''}
                    onChange={e => setSymptoms({ ...symptoms, duration: e.target.value })}
                    placeholder="Contoh: 2 jam, 3 hari"
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Gejala Penyerta:
                  </label>
                  <input
                    type="text"
                    value={symptoms.additionalSymptoms || ''}
                    onChange={e => setSymptoms({ ...symptoms, additionalSymptoms: e.target.value })}
                    placeholder="Contoh: Mual, keringat dingin"
                    className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Quick Symptom Tags */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Pilih Cepat Gejala Umum:</label>
                <div className="flex flex-wrap gap-1">
                  {['Demam Tinggi', 'Sesak Napas', 'Nyeri Dada Kiri', 'Keringat Dingin', 'Batuk Berdahak', 'Mual & Muntah', 'Nyeri Ulu Hati', 'Pusing Berputar', 'Badan Lemas', 'Mimisan'].map((tag, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addSymptomTag(tag)}
                      className="px-2 py-0.5 rounded text-[11px] bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catatan Tambahan / Pemeriksaan Fisik */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Catatan Pemeriksaan Fisik Tambahan (Opsional):
                </label>
                <input
                  type="text"
                  value={clinicalNotes}
                  onChange={e => setClinicalNotes(e.target.value)}
                  placeholder="Contoh: Auskultasi paru ronki basah halus basal, wheezing (-)..."
                  className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-sm tracking-wide shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Menganalisis Tanda Vital & Gejala dengan Gemini AI...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 text-cyan-300 animate-pulse" />
                  <span>Analisis Klinis & Rekomendasi ICD-10 (Gemini AI)</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT COLUMN: RESULTS, DIAGNOSES & WORKUP */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {isLoading && (
              <div className="flex-1 min-h-[420px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center">
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 animate-spin flex items-center justify-center p-1">
                    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
                      <Brain className="w-8 h-8 text-indigo-600 dark:text-cyan-400 animate-pulse" />
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-bounce" />
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-white mb-2">
                  Gemini Clinical Reasoning Engine Aktif
                </h4>
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  <p className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Mengevaluasi parameter vital & National Early Warning Score
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Memetakan gejala klinis ke ontologi WHO ICD-10 & ICD-9-CM
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-indigo-500 animate-spin" /> Menghitung probabilitas diagnosis & menyusun rencana kerja
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !result && (
              <div className="flex-1 min-h-[420px] bg-white dark:bg-slate-800/60 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 border border-indigo-200 dark:border-indigo-800">
                  <Brain className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                  Siap Melakukan Analisis Klinis Pasien
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-4">
                  Lengkapi tanda vital (Tekanan Darah, Nadi, Suhu, RR, SpO2) dan keluhan utama di kolom kiri, atau klik salah satu simulasi kasus cepat di atas, kemudian tekan tombol <strong>"Analisis Klinis & Rekomendasi ICD-10"</strong>.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    WHO ICD-10 Validated
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    PPK Kemenkes RI Aligned
                  </span>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    ICD-9-CM Procedures
                  </span>
                </div>
              </div>
            )}

            {!isLoading && result && (
              <div className="space-y-4">
                {/* 1. TRIAGE & EARLY WARNING SCORE BANNER */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="px-3 py-2 rounded-xl text-white font-black text-sm text-center shadow-md shrink-0"
                      style={{ backgroundColor: result.triage.color || '#3B82F6' }}
                    >
                      {result.triage.level}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {result.triage.name}
                        </h4>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {result.vitalStatus.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {result.triage.urgency}
                      </p>
                    </div>
                  </div>

                  {result.vitalStatus.earlyWarningScore && (
                    <div className="text-left sm:text-right bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200 dark:border-slate-700/60 w-full sm:w-auto">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Early Warning Score (NEWS)
                      </span>
                      <div className="flex items-center sm:justify-end gap-1.5">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          Skor {result.vitalStatus.earlyWarningScore.score}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          result.vitalStatus.earlyWarningScore.category === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                          result.vitalStatus.earlyWarningScore.category === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {result.vitalStatus.earlyWarningScore.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* VITAL FLAGS ALERTS (IF ANY) */}
                {result.vitalStatus.flags && result.vitalStatus.flags.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 mb-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      Parameter Vital Perlu Perhatian ({result.vitalStatus.flags.length})
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {result.vitalStatus.flags.map((flag, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs p-1.5 rounded bg-white/80 dark:bg-slate-900/60 border border-amber-200/60 dark:border-amber-900/40"
                        >
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {flag.parameter}: <strong className="text-slate-900 dark:text-white">{flag.value}</strong>
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            flag.severity === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                            'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {flag.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* RED FLAGS BOX (IF PRESENT) */}
                {result.redFlags && result.redFlags.length > 0 && (
                  <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300 mb-1">
                      <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      Tanda Bahaya & Red Flags Klinis:
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-rose-700 dark:text-rose-300 pl-1">
                      {result.redFlags.map((rf, idx) => (
                        <li key={idx} className="font-medium">{rf}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* TAB SWITCHER: DIAGNOSIS vs WORKUP vs MANAGEMENT */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 text-xs font-bold gap-2">
                  <button
                    onClick={() => setActiveTab('diagnosis')}
                    className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                      activeTab === 'diagnosis'
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    Diagnosis ICD-10 ({1 + (result.differentialDiagnoses?.length || 0)})
                  </button>
                  <button
                    onClick={() => setActiveTab('workup')}
                    className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                      activeTab === 'workup'
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Pemeriksaan & Prosedur ({result.recommendedWorkup?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('management')}
                    className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
                      activeTab === 'management'
                        ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Tatalaksana Awal & PPK
                  </button>
                </div>

                {/* TAB 1: DIAGNOSES (PRIMARY + DIFFERENTIALS) */}
                {activeTab === 'diagnosis' && (
                  <div className="space-y-4">
                    {/* PRIMARY DIAGNOSIS (HERO CARD) */}
                    <div className="bg-gradient-to-br from-indigo-50/80 via-white to-cyan-50/50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800/80 rounded-2xl p-4 sm:p-5 border-2 border-indigo-400/50 dark:border-indigo-500/40 shadow-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-cyan-600 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-xs uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-200" />
                        Rekomendasi Utama (Confidence {result.primaryDiagnosis.confidence}%)
                      </div>

                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-mono text-base font-black px-2.5 py-0.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                              {result.primaryDiagnosis.code}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {result.primaryDiagnosis.category || 'ICD-10 WHO'}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                            {result.primaryDiagnosis.nameId}
                          </h3>
                          <p className="text-xs italic text-slate-500 dark:text-slate-400">
                            {result.primaryDiagnosis.nameEn}
                          </p>
                        </div>
                      </div>

                      {/* Confidence Bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden my-2.5">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-700"
                          style={{ width: `${result.primaryDiagnosis.confidence}%` }}
                        />
                      </div>

                      {/* Clinical Reasoning */}
                      <div className="bg-white/80 dark:bg-slate-900/60 rounded-xl p-3 border border-indigo-100 dark:border-slate-700 text-xs space-y-1.5 my-3">
                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                          <strong className="text-indigo-600 dark:text-indigo-400">Alasan Klinis: </strong>
                          {result.primaryDiagnosis.reasoning}
                        </p>
                        {result.primaryDiagnosis.clinicalCriteria && (
                          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                            <strong>Kriteria Klinis Terpenuhi: </strong>
                            {result.primaryDiagnosis.clinicalCriteria}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
                        <button
                          onClick={() => handleCopy(result.primaryDiagnosis.code, `${result.primaryDiagnosis.code} - ${result.primaryDiagnosis.nameId}`)}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 text-xs font-semibold border border-slate-200 dark:border-slate-600 flex items-center gap-1.5 transition-colors shadow-2xs"
                        >
                          {copiedCode === result.primaryDiagnosis.code ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Salin Kode</span>
                        </button>

                        <button
                          onClick={() => handleApply(result.primaryDiagnosis)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4 text-cyan-200" />
                          <span>Terapkan Sebagai Diagnosis Utama Pasien</span>
                        </button>
                      </div>
                    </div>

                    {/* DIFFERENTIAL DIAGNOSES (DIAGNOSIS BANDING) */}
                    {result.differentialDiagnoses && result.differentialDiagnoses.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                          Diagnosis Banding (Differential Diagnoses)
                        </h4>

                        <div className="grid grid-cols-1 gap-2.5">
                          {result.differentialDiagnoses.map((diff, idx) => (
                            <div
                              key={idx}
                              className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                                      {diff.code}
                                    </span>
                                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                                      {diff.confidence}% Confidence
                                    </span>
                                  </div>
                                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                                    {diff.nameId}
                                  </h5>
                                  <p className="text-[11px] text-slate-500 italic mb-1.5">
                                    {diff.nameEn}
                                  </p>
                                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {diff.reasoning}
                                  </p>
                                  {diff.differentiatingClues && (
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                      <strong>Pembeda Klinis: </strong>{diff.differentiatingClues}
                                    </p>
                                  )}
                                </div>

                                <div className="flex flex-col gap-1.5 shrink-0">
                                  <button
                                    onClick={() => handleApply(diff)}
                                    className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800 transition-colors whitespace-nowrap"
                                  >
                                    Pilih Diagnosis Ini
                                  </button>
                                  <button
                                    onClick={() => handleCopy(diff.code, `${diff.code} - ${diff.nameId}`)}
                                    className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                                  >
                                    <Copy className="w-3 h-3" /> Salin
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: WORKUP & ICD-9 PROCEDURES */}
                {activeTab === 'workup' && (
                  <div className="space-y-4">
                    {/* Suggested ICD-9 Procedures */}
                    {result.suggestedIcd9 && result.suggestedIcd9.length > 0 && (
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-indigo-500" />
                            Rekomendasi Prosedur & Tindakan (ICD-9-CM)
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">Tindakan Diagnostik</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {result.suggestedIcd9.map((proc, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-2"
                            >
                              <div>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className="font-mono text-xs font-black px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                                    {proc.code}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-400">{proc.category}</span>
                                </div>
                                <h6 className="text-xs font-bold text-slate-800 dark:text-slate-200">{proc.name}</h6>
                                <p className="text-[10px] text-slate-500">{proc.indication}</p>
                              </div>
                              <button
                                onClick={() => handleCopy(proc.code, `${proc.code} - ${proc.name}`)}
                                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                                title="Salin Kode ICD-9"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended Workup (Lab, Rad, etc.) */}
                    {result.recommendedWorkup && result.recommendedWorkup.length > 0 && (
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-2xs">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-indigo-500" />
                            Rekomendasi Pemeriksaan Penunjang (Workup)
                          </span>
                          <button
                            onClick={handleApplyAllWorkups}
                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Tambahkan Semua
                          </button>
                        </div>

                        <div className="space-y-2">
                          {result.recommendedWorkup.map((work, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3 text-xs"
                            >
                              <div>
                                <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mb-1 ${
                                  work.category === 'Laboratorium' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                                  work.category === 'Radiologi' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                }`}>
                                  {work.category}
                                </span>
                                <h6 className="font-bold text-slate-900 dark:text-white">{work.testName}</h6>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{work.reason}</p>
                              </div>
                              <button
                                onClick={() => handleCopy(work.testName, work.testName)}
                                className="px-2 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 shrink-0"
                              >
                                Salin
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: MANAGEMENT & CLINICAL GUIDELINES */}
                {activeTab === 'management' && (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 text-xs shadow-2xs">
                      <span className="font-bold text-slate-400 block mb-1 uppercase tracking-wider text-[10px]">
                        Ringkasan Kasus Klinis (Clinical Case Summary)
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                        {result.summary}
                      </p>
                    </div>

                    {/* Immediate Actions */}
                    {result.immediateActions && result.immediateActions.length > 0 && (
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700 shadow-2xs">
                        <span className="font-bold text-slate-700 dark:text-slate-200 block mb-2 text-xs flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          Tatalaksana Awal Berbasis Panduan Praktik Klinis (PPK):
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                          {result.immediateActions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="leading-relaxed">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Guideline Reference */}
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                        <Info className="w-3.5 h-3.5 text-indigo-500" />
                        Referensi Panduan Klinis:
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                        {result.clinicalGuidelineRef}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-2 border-t border-slate-200 dark:border-slate-700 pt-1.5">
                        {result.disclaimer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // If modal mode, render in backdrop overlay
  if (mode === 'modal') {
    return (
      <div className="fixed inset-0 z-[110] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-6xl max-h-[92vh] flex flex-col">
          {content}
        </div>
      </div>
    );
  }

  // Inline mode
  return <div className="w-full">{content}</div>;
}
