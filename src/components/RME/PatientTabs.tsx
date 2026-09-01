import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, CalendarDays, Building2, User, Activity, AlertTriangle, Pill, ClipboardList, Clock,
  Stethoscope, Syringe, HeartPulse, FileText, Plus, Search,
  ShieldAlert, Printer, Edit2, Trash2, X, Lock, Unlock, Eye,
  Calculator, FileSignature, ShieldCheck, Scale, Apple, Brain,
  ListChecks, FileCode2, FlaskConical, ScanLine, CheckCircle2, Mic, Globe, ChevronDown, UserCheck,
  ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import PrintPDFButton from '../PrintPDFButton';
import { SmartVoiceReport } from './SmartVoiceReport';
import { MedicalSearchGrounding } from '../MedicalSearchGrounding';
import { LaboratoryTab } from './LaboratoryTab';
import { RadiologyTab } from './RadiologyTab';
import { ImmunizationsTab } from './ImmunizationsTab';
import { GrowthChartTab } from './GrowthChartTab';
import { PendingAlertsModal } from './PendingAlertsModal';
import { AddendumModal } from './AddendumModal';

export function OverviewTab({ patientData }: { patientData: any }) {
  if (!patientData) return null;

  const activeProblems = patientData.problem_list?.filter((p: any) => p.status === 'Active') || [];
  const activeMeds = patientData.medications?.filter((m: any) => m.status === 'Active') || [];
  const allergies = patientData.allergies || [];
  const latestVitals = patientData.vitals?.[0] || null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Problems */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Active Problems</h3>
          </div>
          <div className="flex-1 space-y-2">
            {activeProblems.length > 0 ? activeProblems.map((p: any, i: number) => (
              <div key={i} className="text-sm border-l-2 border-blue-500 pl-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg">
                <div className="font-bold text-slate-800 dark:text-white">{p.nama}</div>
                <div className="text-xs text-slate-500">{p.kode_icd10} • Onset: {p.tanggal_onset}</div>
              </div>
            )) : <p className="text-sm text-slate-500 italic">No active problems</p>}
          </div>
        </div>

        {/* Active Medications */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <Pill className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Active Medications</h3>
          </div>
          <div className="flex-1 space-y-2">
            {activeMeds.length > 0 ? activeMeds.map((m: any, i: number) => (
              <div key={i} className="text-sm border-l-2 border-emerald-500 pl-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg">
                <div className="font-bold text-slate-800 dark:text-white">{m.name}</div>
                <div className="text-xs text-slate-500">{m.dose} • {m.frequency}</div>
              </div>
            )) : <p className="text-sm text-slate-500 italic">No active medications</p>}
          </div>
        </div>

        {/* Allergies */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Allergies</h3>
          </div>
          <div className="flex-1 space-y-2">
            {allergies.length > 0 ? allergies.map((a: any, i: number) => (
              <div key={i} className="text-sm border-l-2 border-rose-500 pl-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg">
                <div className="font-bold text-slate-800 dark:text-white">{a.allergen}</div>
                <div className="text-xs text-rose-600">{a.reaction}</div>
              </div>
            )) : <p className="text-sm text-slate-500 italic">No known allergies</p>}
          </div>
        </div>

        {/* Latest Vitals */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-3">
            <HeartPulse className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-900 dark:text-white">Latest Vitals</h3>
          </div>
          {latestVitals ? (
            <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">BP</div>
                <div className="font-bold text-rose-600">{latestVitals.bp}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">HR</div>
                <div className="font-bold text-emerald-600">{latestVitals.hr}</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Temp</div>
                <div className="font-bold text-amber-600">{latestVitals.temp}°C</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2 rounded-lg text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold">SpO2</div>
                <div className="font-bold text-blue-600">{latestVitals.spo2}%</div>
              </div>
              <div className="col-span-2 text-xs text-center text-slate-500 mt-1">Recorded: {latestVitals.date}</div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No vitals recorded</p>
          )}
        </div>
      </div>

    </div>
  );
}

export function TriaseTab() {
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
      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
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
      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
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
      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
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
      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
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
export function FisikTab() {
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
      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
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

      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ListChecks className="w-5 h-5 text-indigo-500" /> Checklist Head-to-Toe</h3>
        <div className="space-y-2">
          {headToToe.map((item) => (
            <div key={item} className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md/50 rounded-lg border border-slate-200 dark:border-slate-700">
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
export function SoapTab({ onOpenVoice }: { onOpenVoice?: () => void }) {
  const [soap, setSoap] = useState(() => {
    const saved = localStorage.getItem('simrs_rme_soap');
    return saved ? JSON.parse(saved) : { s: '', o: '', a: '', p: '' };
  });
  const [lastSaved, setLastSaved] = useState('');

  useEffect(() => {
    // Check if soap was updated externally
    const handleStorage = () => {
      const saved = localStorage.getItem('simrs_rme_soap');
      if (saved) setSoap(JSON.parse(saved));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem('simrs_rme_soap', JSON.stringify(soap));
      setLastSaved(new Date().toLocaleTimeString('id-ID'));
    }, 1000);
    return () => clearTimeout(t);
  }, [soap]);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
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
        <div key={key} className="card p-5 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
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
export function KodeTab() {
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
      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Search className="w-5 h-5 text-indigo-500" /> Smart-Search ICD-10 (WHO)</h3>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ketik kode atau nama penyakit..." className="w-full p-3 border rounded bg-white dark:bg-slate-900 dark:border-slate-600 mb-3" />
        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
          {filtered.map((d) => (
            <button key={d.code} onClick={() => { setSelectedDx([...selectedDx, d]); toast.success(`${d.code} ditambahkan sebagai diagnosis`); }} className="w-full text-left p-3 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{d.code}</span> — {d.desc}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
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
        <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold mb-3 flex items-center gap-2"><ListChecks className="w-5 h-5 text-blue-500" /> Prosedur / Tindakan (ICD-9-CM)</h3>
          <div className="space-y-2">
            {icd9.map((d) => (
              <button key={d.code} onClick={() => toast.success(`Prosedur ${d.code} dicatat`)} className="w-full text-left p-3 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition-colors">
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
export function CPOETab({ patientData }: { patientData: any }) {
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
        <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
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
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md/50 rounded-lg border border-slate-200 dark:border-slate-700">
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
        <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold mb-3">Order Laboratorium (Standar LOINC)</h3>
          <div className="space-y-2">
            {[
              { loinc: '2345-7', name: 'Glukosa Darah Puasa' },
              { loinc: '718-7', name: 'Hemoglobin' },
              { loinc: '2160-0', name: 'Kreatinin Serum' },
              { loinc: '1751-7', name: 'Albumin Serum' },
            ].map((t) => (
              <label key={t.loinc} className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md/50 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-indigo-600" />
                <span className="text-sm"><span className="font-bold text-indigo-600">{t.loinc}</span> — {t.name}</span>
              </label>
            ))}
          </div>
          <button onClick={() => toast.success('Order Lab terkirim ke Laboratorium')} className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold">📤 Kirim Order Lab</button>
        </div>
      )}

      {subTab === 'rad' && (
        <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold mb-3">Order Radiologi & Imaging (RIS/PACS - DICOM)</h3>
          <div className="space-y-2">
            {['Rontgen Thorax PA', 'USG Abdomen', 'CT-Scan Kepala', 'MRI Lumbal'].map((t) => (
              <label key={t} className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md/50 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer">
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
export function LegalTab({ patientData }: { patientData: any }) {
  const [locked, setLocked] = useState(() => null === 'true');
  const [retensi, setRetensi] = useState('Aktif');

  const toggleLock = () => {
    const newVal = !locked;
    setLocked(newVal);

    toast.success(newVal ? '🔒 RME terkunci (anti-manipulasi PMK 24/2022)' : '🔓 RME dibuka (butuh otorisasi)');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Resume Medis Otomatis (Discharge Summary)</h3>
        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md/50 rounded-lg border border-slate-200 dark:border-slate-700 text-sm space-y-2">
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

      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FileSignature className="w-5 h-5 text-emerald-500" /> Tanda Tangan Elektronik (TTE / BSrE)</h3>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-200 dark:border-emerald-800 mb-4">
          <p className="text-sm flex items-center gap-2 font-bold text-emerald-700"><ShieldCheck className="w-4 h-4" /> Sertifikat Digital Aktif</p>
          <p className="text-xs text-emerald-600 mt-1">Ditempelkan pada resume medis & resep untuk validitas hukum RME.</p>
        </div>
        <button onClick={() => toast.success('✅ TTE berhasil ditempelkan (sertifikat BSrE)')} className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold">✍️ Tempelkan TTE</button>
      </div>

      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">{locked ? <Lock className="w-5 h-5 text-rose-500" /> : <Unlock className="w-5 h-5 text-emerald-500" />} Penguncian Rekam Medis</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Data terkunci otomatis 1×24 jam setelah kunjungan selesai untuk mencegah manipulasi ilegal (PMK 24/2022).</p>
        <div className={`p-3 rounded-lg font-bold text-center mb-4 ${locked ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
          Status: {locked ? '🔒 TERKUNCI' : '🔓 TERBUKA'}
        </div>
        <button onClick={toggleLock} className={`w-full py-2.5 rounded-lg font-bold text-white ${locked ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {locked ? '🔓 Buka Kunci' : '🔒 Kunci Sekarang'}
        </button>
      </div>

      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-amber-500" /> Manajemen Retensi & Pemusnahan</h3>
        <div className="space-y-2">
          {['Aktif', 'Inaktif (> 5 tahun)', 'Siap Musnah'].map((s) => (
            <label key={s} className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md/50 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer">
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
export function AuditTab() {
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
      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-indigo-500" /> Role-Based Access Control (RBAC)</h3>
        <table className="w-full text-sm">
          <thead className="bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md/50">
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

      <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-500" /> Audit Trail (Immutable Log)</h3>
        <div className="space-y-2">
          {auditLog.map((l, i) => (
            <div key={i} className="p-3 bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-md/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
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
export function ProblemListTab({ patientData, setPatientData }: any) {
  const [filter, setFilter] = useState('Active');
  
  const handleDelete = (id: number) => {
    const updated = patientData.problem_list.filter((p: any) => p.id !== id);
    setPatientData({ ...patientData, problem_list: updated });
    toast.success('Problem dihapus');
  };

  const filteredProblems = patientData.problem_list.filter((p: any) => filter === 'All' || p.status === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-500" />
              Daftar Masalah Klinis (Problem List)
            </h2>
            <p className="text-sm text-slate-500">Diagnosis dan masalah medis longitudinal pasien</p>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none"
            >
              <option value="All">Semua Status</option>
              <option value="Active">Active</option>
              <option value="Resolved">Resolved</option>
              <option value="Historical">Historical</option>
              <option value="Suspected">Suspected</option>
              <option value="Ruled Out">Ruled Out</option>
            </select>
            <button onClick={() => toast('Form tambah problem', { icon: '🚧' })} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> Add Problem
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="p-4 font-bold text-slate-500">Diagnosis / Problem</th>
                <th className="p-4 font-bold text-slate-500">ICD-10</th>
                <th className="p-4 font-bold text-slate-500">Onset Date</th>
                <th className="p-4 font-bold text-slate-500">Severity</th>
                <th className="p-4 font-bold text-slate-500">Status</th>
                <th className="p-4 font-bold text-slate-500">Recorded By</th>
                <th className="p-4 font-bold text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">Tidak ada data untuk status {filter}</td>
                </tr>
              ) : filteredProblems.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{p.nama}</td>
                  <td className="p-4"><span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">{p.kode_icd10}</span></td>
                  <td className="p-4">{p.tanggal_onset}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.severity === 'Severe' ? 'bg-rose-50 text-rose-600 border border-rose-200' : p.severity === 'Moderate' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>{p.severity}</span>
                  </td>
                  <td className="p-4">
                    <select 
                      value={p.status}
                      onChange={(e) => {
                        const updated = patientData.problem_list.map((item: any) => item.id === p.id ? { ...item, status: e.target.value } : item);
                        setPatientData({ ...patientData, problem_list: updated });
                        toast.success(`Status diagnosis diubah menjadi ${e.target.value}`);
                      }}
                      className={`px-2 py-1 rounded text-xs font-bold border outline-none cursor-pointer ${
                        p.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                        p.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                        p.status === 'Historical' ? 'bg-slate-100 text-slate-600 border-slate-300' : 
                        p.status === 'Suspected' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        'bg-rose-50 text-rose-600 border-rose-200'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Historical">Historical</option>
                      <option value="Suspected">Suspected</option>
                      <option value="Ruled Out">Ruled Out</option>
                    </select>
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                    <div>dr. Budi Santoso</div>
                    <div className="text-[10px]">{p.tanggal_onset}</div>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function MedicationsTab({ patientData, setPatientData }: any) {
  const [filter, setFilter] = useState('All');

  const handleDelete = (id: number) => {
    const updated = patientData.medications.filter((m: any) => m.id !== id);
    setPatientData({ ...patientData, medications: updated });
    toast.success('Obat dihapus');
  };

  const filteredMeds = patientData.medications.filter((m: any) => filter === 'All' || m.status === filter);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-500" />
              Riwayat Penggunaan Obat (Medication History)
            </h2>
            <p className="text-sm text-slate-500">Catatan komprehensif obat yang pernah atau sedang dikonsumsi pasien.</p>
          </div>
          <div className="flex gap-2">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none font-medium"
            >
              <option value="All">Semua Status</option>
              <option value="Active">Active</option>
              <option value="Stopped">Stopped</option>
              <option value="Hold">Hold</option>
            </select>
            <button onClick={() => toast('Form tambah obat', { icon: '🚧' })} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="p-4 font-bold text-slate-500">Nama Obat</th>
                <th className="p-4 font-bold text-slate-500">Dosis & Rute</th>
                <th className="p-4 font-bold text-slate-500">Frekuensi</th>
                <th className="p-4 font-bold text-slate-500">Mulai - Berhenti</th>
                <th className="p-4 font-bold text-slate-500">Status</th>
                <th className="p-4 font-bold text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMeds.map((m: any) => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{m.name}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{m.dose}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{m.frequency}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{m.startDate} - {m.endDate || 'Sekarang'}</td>
                  <td className="p-4">
                    <select
                      value={m.status}
                      onChange={(e) => {
                        const updated = patientData.medications.map((item: any) => item.id === m.id ? { ...item, status: e.target.value } : item);
                        setPatientData({ ...patientData, medications: updated });
                      }}
                      className={`px-2 py-1 rounded-full text-xs font-bold border outline-none cursor-pointer ${
                        m.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        m.status === 'Stopped' ? 'bg-slate-100 text-slate-600 border-slate-300' :
                        'bg-amber-50 text-amber-600 border-amber-200'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Stopped">Stopped</option>
                      <option value="Hold">Hold</option>
                    </select>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button className="p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(m.id)} className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AllergiesTab({ patientData, setPatientData }: any) {
  const handleDelete = (id: number) => {
    const updated = patientData.allergies.filter((a: any) => a.id !== id);
    setPatientData({ ...patientData, allergies: updated });
    toast.success('Alergi dihapus');
  };
  return (
    <div className="card p-6 bg-white/[0.02] dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 border-t-4 border-t-red-500">
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

export function VitalsTab({ patientData }: any) {
  const chartData = [...(patientData.vitals || [])].reverse().map(v => {
    const bpParts = v.bp.split('/');
    return {
      date: v.date.split(' ')[0],
      systolic: parseInt(bpParts[0]),
      diastolic: parseInt(bpParts[1]),
      hr: parseInt(v.hr)
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-500" /> Tren Tanda Vital (Blood Pressure & Heart Rate)
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Sistolik" />
              <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Diastolik" />
              <Line type="monotone" dataKey="hr" stroke="#10b981" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} name="Nadi" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold">Vital Signs History</h2>
          <button onClick={() => toast('Form tambah vital', { icon: '🚧' })} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Vitals
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="p-4 font-bold text-slate-500">Tanggal & Waktu</th>
                <th className="p-4 font-bold text-slate-500">TD (mmHg)</th>
                <th className="p-4 font-bold text-slate-500">Nadi</th>
                <th className="p-4 font-bold text-slate-500">Suhu (°C)</th>
                <th className="p-4 font-bold text-slate-500">RR</th>
                <th className="p-4 font-bold text-slate-500">SpO2</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {patientData.vitals.map((v: any) => (
                <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-4">{v.date}</td>
                  <td className="p-4 font-bold text-rose-600 dark:text-rose-400">{v.bp}</td>
                  <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">{v.hr}</td>
                  <td className="p-4">{v.temp}</td>
                  <td className="p-4">{v.rr}</td>
                  <td className="p-4">{v.spo2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ENCOUNTERS TAB (Kunjungan & Alur Klinis Lengkap PMK 24/2022)
// ═══════════════════════════════════════════════════════════
export function EncountersTab({ patientData, onOpenVoice }: { patientData: any, onOpenVoice: () => void }) {
  const [activeEncounterId, setActiveEncounterId] = useState<string | null>(null);
  const [encounterSubTab, setEncounterSubTab] = useState<'soap' | 'fisik' | 'triase' | 'cpoe' | 'addendum'>('soap');
  const [showAddendumModal, setShowAddendumModal] = useState(false);
  
  // Encounters data with state & addendums
  const [encounters, setEncounters] = useState([
    { 
      id: 'ENC-001', 
      date: '30 Aug 2026', 
      time: '09:00', 
      type: 'Rawat Jalan', 
      poli: 'Poli Umum', 
      doctor: 'dr. Budi Santoso, Sp.PD', 
      diagnosis: 'Hypertension (I10)', 
      status: 'In Review',
      signedAt: null as string | null,
      tteHash: null as string | null,
      addendums: [] as any[]
    },
    { 
      id: 'ENC-002', 
      date: '15 Jul 2026', 
      time: '10:30', 
      type: 'Rawat Jalan', 
      poli: 'Penyakit Dalam', 
      doctor: 'dr. Budi Santoso, Sp.PD', 
      diagnosis: 'Type 2 DM (E11.9)', 
      status: 'Signed',
      signedAt: '15 Jul 2026 11:15 WIB',
      tteHash: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      addendums: [
        {
          id: 'ADD-101',
          date: '16 Jul 2026 09:00 WIB',
          author: 'dr. Budi Santoso, Sp.PD',
          reason: 'Koreksi dosis obat karena toleransi lambung',
          note: 'Dosis Metformin disesuaikan dari 1000mg menjadi 500mg 2x1 bersama makan.'
        }
      ]
    },
    { 
      id: 'ENC-003', 
      date: '10 Mar 2026', 
      time: '14:15', 
      type: 'IGD', 
      poli: 'Instalasi Gawat Darurat', 
      doctor: 'dr. Sarah Wijaya, Sp.Em', 
      diagnosis: 'Gastroenteritis Akut (A09.9)', 
      status: 'Locked',
      signedAt: '10 Mar 2026 18:30 WIB',
      tteHash: 'SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      addendums: []
    },
  ]);

  const activeEncounter = encounters.find(e => e.id === activeEncounterId);

  const handleSignDocument = (encId: string) => {
    const timeStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const mockHash = 'SHA256:' + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    setEncounters(prev => prev.map(enc => {
      if (enc.id === encId) {
        return {
          ...enc,
          status: 'Signed',
          signedAt: timeStr,
          tteHash: mockHash
        };
      }
      return enc;
    }));

    toast.success(`Dokumen ${encId} berhasil ditandatangani secara elektronik (TTE Bersertifikasi BSrE/BSSN)`);
  };

  const handleLockDocument = (encId: string) => {
    setEncounters(prev => prev.map(enc => {
      if (enc.id === encId) {
        return {
          ...enc,
          status: 'Locked'
        };
      }
      return enc;
    }));
    toast.success(`Rekam Medis ${encId} telah dikunci permanen sesuai regulasi PMK 24/2022`);
  };

  const handleAddAddendum = (addendumData: { text: string; reason: string; doctor: string; timestamp: string }) => {
    if (!activeEncounterId) return;
    const newAddendum = {
      id: `ADD-${Date.now().toString().slice(-4)}`,
      date: addendumData.timestamp || new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' WIB',
      author: addendumData.doctor || 'dr. Budi Santoso, Sp.PD',
      reason: addendumData.reason,
      note: addendumData.text
    };

    setEncounters(prev => prev.map(enc => {
      if (enc.id === activeEncounterId) {
        return {
          ...enc,
          addendums: [newAddendum, ...(enc.addendums || [])]
        };
      }
      return enc;
    }));

    setShowAddendumModal(false);
  };

  if (activeEncounterId && activeEncounter) {
    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* ENCOUNTER BANNER */}
        <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveEncounterId(null)}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Kembali ke Daftar Kunjungan"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Kunjungan {activeEncounter.id}
                </h2>
                <span className={`text-xs uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                  activeEncounter.status === 'Signed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                  activeEncounter.status === 'Locked' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700' :
                  'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                }`}>
                  {activeEncounter.status}
                </span>
                {activeEncounter.status === 'Signed' && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> TTE Terverifikasi
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {activeEncounter.date} • {activeEncounter.type} - {activeEncounter.poli} • DPJP: <strong>{activeEncounter.doctor}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={onOpenVoice} 
              className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800"
            >
              <Mic className="w-3.5 h-3.5" /> AI Scribe
            </button>
            
            {activeEncounter.status === 'In Review' && (
              <button 
                onClick={() => handleSignDocument(activeEncounter.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <FileSignature className="w-3.5 h-3.5" /> Tandatangani (TTE)
              </button>
            )}

            {activeEncounter.status === 'Signed' && (
              <>
                <button 
                  onClick={() => setShowAddendumModal(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Buat Addendum
                </button>
                <button 
                  onClick={() => handleLockDocument(activeEncounter.id)}
                  className="bg-slate-700 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" /> Kunci Dokumen (PMK 24)
                </button>
              </>
            )}

            {activeEncounter.status === 'Locked' && (
              <button 
                onClick={() => setShowAddendumModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Buat Addendum Resmi
              </button>
            )}
          </div>
        </div>

        {/* TTE STATUS BANNER IF SIGNED */}
        {activeEncounter.signedAt && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-start justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900 dark:text-emerald-200">Dokumen Rekam Medis Sah & Terotentikasi</p>
                <p className="text-emerald-700 dark:text-emerald-300">
                  Ditandatangani secara digital oleh {activeEncounter.doctor} pada {activeEncounter.signedAt}.
                </p>
                {activeEncounter.tteHash && (
                  <p className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Fingerprint Dokumen: {activeEncounter.tteHash}
                  </p>
                )}
              </div>
            </div>
            <span className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-md text-[10px] uppercase">
              BSrE Certified
            </span>
          </div>
        )}

        {/* ENCOUNTER SUB-NAVIGATION */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
          {[
            { id: 'soap', label: 'Catatan SOAP Dokter', icon: FileText },
            { id: 'fisik', label: 'Pemeriksaan Fisik', icon: Stethoscope },
            { id: 'triase', label: 'Triase & Tanda Vital', icon: HeartPulse },
            { id: 'cpoe', label: 'Resep & Order Penunjang', icon: Pill },
            { id: 'addendum', label: `Addendum (${activeEncounter.addendums?.length || 0})`, icon: ClipboardList },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = encounterSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setEncounterSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* SUBTAB CONTENT */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
          {encounterSubTab === 'soap' && (
            <SoapTab onOpenVoice={onOpenVoice} />
          )}

          {encounterSubTab === 'fisik' && (
            <FisikTab />
          )}

          {encounterSubTab === 'triase' && (
            <TriaseTab />
          )}

          {encounterSubTab === 'cpoe' && (
            <CPOETab patientData={patientData} />
          )}

          {encounterSubTab === 'addendum' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-amber-500" />
                    Riwayat Addendum Rekam Medis (PMK 24/2022)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sesuai ketentuan, data yang sudah ditandatangani tidak dihapus, melainkan dikoreksi melalui catatan addendum resmi.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddendumModal(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Buat Addendum Baru
                </button>
              </div>

              {activeEncounter.addendums && activeEncounter.addendums.length > 0 ? (
                <div className="space-y-3 mt-4">
                  {activeEncounter.addendums.map((add: any, idx: number) => (
                    <div key={add.id || idx} className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-800 dark:text-amber-300">
                          {add.id} • {add.author}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-mono">{add.date}</span>
                      </div>
                      <div className="text-xs">
                        <strong className="text-slate-700 dark:text-slate-300">Alasan Perubahan:</strong> {add.reason}
                      </div>
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-amber-100 dark:border-amber-900/30 text-xs text-slate-800 dark:text-slate-200 font-medium">
                        {add.note}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-sm">Belum ada catatan addendum untuk kunjungan ini.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {showAddendumModal && (
          <AddendumModal
            isOpen={showAddendumModal}
            onClose={() => setShowAddendumModal(false)}
            encounterId={activeEncounter.id}
            onSaveAddendum={handleAddAddendum}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-500" /> 
            Riwayat Kunjungan (Encounters)
          </h2>
          <p className="text-slate-500 dark:text-slate-400">Pilih kunjungan untuk melihat atau mengedit rekam medis (SOAP & Penunjang).</p>
        </div>
        <button 
          onClick={() => {
            const newId = `ENC-00${encounters.length + 1}`;
            const newEnc = {
              id: newId,
              date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
              time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
              type: 'Rawat Jalan',
              poli: 'Poli Umum',
              doctor: 'dr. Budi Santoso, Sp.PD',
              diagnosis: 'Menunggu Pemeriksaan',
              status: 'In Review',
              signedAt: null,
              tteHash: null,
              addendums: []
            };
            setEncounters([newEnc, ...encounters]);
            setActiveEncounterId(newId);
            toast.success(`Kunjungan baru ${newId} dibuat`);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Kunjungan Baru
        </button>
      </div>
      
      <div className="space-y-3">
        {encounters.map(enc => (
          <div 
            key={enc.id} 
            onClick={() => setActiveEncounterId(enc.id)}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 group-hover:bg-blue-50 group-hover:border-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{enc.date.split(' ')[1]}</span>
                  <span className="text-lg font-bold text-slate-800 dark:text-white leading-none">{enc.date.split(' ')[0]}</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    {enc.type} - {enc.poli}
                    {enc.status === 'Signed' && <span title="TTE Terverifikasi"><ShieldCheck className="w-4 h-4 text-emerald-500" /></span>}
                    {enc.status === 'Locked' && <span title="Terkunci Sesuai PMK 24"><Lock className="w-4 h-4 text-slate-500" /></span>}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {enc.time}</span>
                    <span className="flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5" /> {enc.doctor}</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                      Diagnosis: {enc.diagnosis}
                    </span>
                    {enc.addendums?.length > 0 && (
                      <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                        {enc.addendums.length} Addendum
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  enc.status === 'Signed' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                  enc.status === 'Locked' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700' :
                  'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                }`}>
                  {enc.status}
                </span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TIMELINE TAB
// ═══════════════════════════════════════════════════════════
export function TimelineTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-blue-500" />
          Clinical Timeline
        </h2>
        
        <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8 pb-4">
          
          {/* Item 1 */}
          <div className="relative pl-6">
            <div className="absolute -left-[13px] top-1 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
              <Stethoscope className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-900 dark:text-white">Pemeriksaan Dokter (Rawat Jalan)</h3>
              <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">30 Aug 2026, 09:00</span>
            </div>
            <p className="text-sm text-slate-500 mb-3">Oleh dr. Budi Santoso (Poli Umum)</p>
            
            <div className="ml-2 border-l-2 border-slate-100 dark:border-slate-800 pl-4 space-y-3">
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">SOAP Document Dibuat</p>
                  <p className="text-xs text-slate-500">Keluhan: Pusing, tekanan darah tinggi.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ClipboardList className="w-4 h-4 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Diagnosis Ditambahkan</p>
                  <p className="text-xs text-slate-500">Hypertension (I10) - Active</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Pill className="w-4 h-4 text-emerald-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Resep Obat Dibuat</p>
                  <p className="text-xs text-slate-500">Amlodipine 10mg, 1x1 oral</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Item 2 */}
          <div className="relative pl-6">
            <div className="absolute -left-[13px] top-1 w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
              <FlaskConical className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-900 dark:text-white">Hasil Laboratorium Tersedia</h3>
              <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">29 Aug 2026, 14:30</span>
            </div>
            <p className="text-sm text-slate-500">Panel Profil Lipid, Gula Darah Puasa</p>
          </div>
          
          {/* Item 3 */}
          <div className="relative pl-6">
            <div className="absolute -left-[13px] top-1 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center">
              <Stethoscope className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-slate-900 dark:text-white">Pemeriksaan Dokter (Rawat Jalan)</h3>
              <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded">15 Jul 2026, 10:30</span>
            </div>
            <p className="text-sm text-slate-500 mb-3">Oleh dr. Budi Santoso (Poli Penyakit Dalam)</p>
          </div>

        </div>
      </div>
    </div>
  );
}
