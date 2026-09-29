import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BLUEPRINT_VISION, 
  BLUEPRINT_PRINCIPLES, 
  BLUEPRINT_ARCHITECTURE, 
  BLUEPRINT_PATIENT_FLOW, 
  BLUEPRINT_MODULE_CARDS, 
  BLUEPRINT_DATABASE, 
  BLUEPRINT_SECURITY, 
  BLUEPRINT_OFFLINE_SYNC, 
  BLUEPRINT_EXTERNAL_INTEGRATIONS, 
  BLUEPRINT_AI_GOVERNANCE, 
  BLUEPRINT_GAP_ANALYSIS, 
  BLUEPRINT_ROADMAP, 
  BLUEPRINT_DOD_CHECKLIST,
  DefinitionOfDoneItem,
  GapAnalysisItem
} from '../../data/blueprintData';
import { 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Database, 
  Workflow, 
  Layers, 
  Users, 
  ExternalLink, 
  Printer, 
  CheckSquare, 
  AlertTriangle, 
  Cpu, 
  Activity, 
  Globe, 
  FileText, 
  Key, 
  RotateCcw,
  Search,
  Check,
  Eye,
  HeartPulse,
  Brain,
  Zap,
  Lock,
  WifiOff
} from 'lucide-react';
import toast from 'react-hot-toast';

export function BlueprintSystemView() {
  const navigate = useNavigate();

  // Active section tab
  const [activeTab, setActiveTab] = useState<'full' | 'visi_prinsip' | 'flow' | 'modules' | 'database' | 'ai_gov' | 'gap_dod'>('full');
  
  // Interactive Checklist Persistence
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('myitaru_blueprint_dod_checked');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn(e);
      }
    }
    const initial: Record<string, boolean> = {};
    BLUEPRINT_DOD_CHECKLIST.forEach(item => {
      initial[item.id] = item.defaultChecked;
    });
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('myitaru_blueprint_dod_checked', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleCheck = (id: string) => {
    const isChecked = !checkedItems[id];
    setCheckedItems(prev => ({
      ...prev,
      [id]: isChecked
    }));
    toast.success(isChecked ? 'Kriteria ditandai selesai' : 'Kriteria ditandai belum selesai');
  };

  const completedCount = useMemo(() => {
    return Object.values(checkedItems).filter(Boolean).length;
  }, [checkedItems]);

  const progressPercent = Math.round((completedCount / BLUEPRINT_DOD_CHECKLIST.length) * 100);

  // Selected patient flow step for interactive preview
  const [selectedFlowStep, setSelectedFlowStep] = useState<number>(1);
  const currentStepData = BLUEPRINT_PATIENT_FLOW.find(s => s.step === selectedFlowStep) || BLUEPRINT_PATIENT_FLOW[0];

  // GAP Analysis Filter
  const [gapFilter, setGapFilter] = useState<'ALL' | 'P0' | 'P1' | 'P2' | 'P3'>('ALL');
  const filteredGap = useMemo(() => {
    if (gapFilter === 'ALL') return BLUEPRINT_GAP_ANALYSIS;
    return BLUEPRINT_GAP_ANALYSIS.filter(g => g.prioritas === gapFilter);
  }, [gapFilter]);

  // Database Search
  const [dbSearch, setDbSearch] = useState('');
  const filteredDatabase = useMemo(() => {
    if (!dbSearch.trim()) return BLUEPRINT_DATABASE;
    const q = dbSearch.toLowerCase();
    return BLUEPRINT_DATABASE.filter(e => 
      e.name.toLowerCase().includes(q) || 
      e.description.toLowerCase().includes(q) ||
      e.fields.some(f => f.toLowerCase().includes(q))
    );
  }, [dbSearch]);

  // AI Governance Demo Simulator
  const [simulatedAiStatus, setSimulatedAiStatus] = useState<'AI_GENERATED' | 'PENDING_REVIEW' | 'HUMAN_VERIFIED' | 'FINAL'>('AI_GENERATED');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1700px] mx-auto w-full text-slate-900 dark:text-slate-100 flex-1">
      
      {/* 1. TOP HERO BLUEPRINT BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#072448] via-[#0D3B66] to-[#0B525B] p-6 sm:p-8 text-white border border-cyan-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-cyan-300 font-extrabold text-2xl border border-white/20 shadow-inner">
                🏥
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                    MYITARU
                    <span className="text-sm sm:text-base font-medium text-cyan-200">Integrated Health Information System</span>
                  </h1>
                </div>
                <p className="text-xs sm:text-sm font-bold text-cyan-300 tracking-wider uppercase mt-0.5">
                  BLUEPRINT EVALUASI & PENGEMBANGAN APLIKASI
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
              Sistem Informasi Manajemen Klinik / Hospital Information System + RME + AI. 
              <span className="text-cyan-200 font-semibold italic ml-1">"Satu Sistem, Satu Data, Untuk Pelayanan Kesehatan yang Lebih Baik"</span>
            </p>
          </div>

          {/* Quick Metric Badges */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center">
              <p className="text-[10px] text-cyan-200 font-bold uppercase tracking-wider">Kesiapan Arsitektur</p>
              <div className="text-2xl font-black text-white flex items-center justify-center gap-1.5 mt-0.5">
                <span>{progressPercent}%</span>
                <span className="text-xs text-emerald-400 font-bold font-mono">14/14 DoD</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Cetak Dokumen Blueprint Resmi"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Blueprint</span>
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS BAR */}
        <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
          {[
            { id: 'full', label: 'Canvas Penuh (Blueprint 1-13)', icon: Layers },
            { id: 'visi_prinsip', label: '1 & 2. Visi & 10 Prinsip', icon: ShieldCheck },
            { id: 'flow', label: '4. Alur End-to-End', icon: Workflow },
            { id: 'modules', label: '5. Modul & Arsitektur', icon: Cpu },
            { id: 'database', label: '6. Database (15 Entitas)', icon: Database },
            { id: 'ai_gov', label: '10. AI & Tata Kelola', icon: Brain },
            { id: 'gap_dod', label: '11 & 13. GAP & Checklist', icon: CheckSquare }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-400 text-slate-950 shadow-md scale-102'
                    : 'bg-white/5 hover:bg-white/15 text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: VISI, TUJUAN & 10 PRINSIP DASAR SISTEM                         */}
      {/* ========================================================================= */}
      {(activeTab === 'full' || activeTab === 'visi_prinsip') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 1. VISI & TUJUAN (5 Cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">1. VISI &amp; TUJUAN</h2>
                  <p className="text-xs text-slate-500">Arah strategis pengembangan MYITARU</p>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-xs sm:text-sm text-blue-950 dark:text-blue-200 leading-relaxed font-medium">
                <span className="font-bold text-blue-700 dark:text-cyan-300 block mb-1 uppercase tracking-wider text-[11px]">Visi:</span>
                "{BLUEPRINT_VISION.quote}"
              </div>

              <div className="mt-5 space-y-2.5">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tujuan Utama:</h3>
                {BLUEPRINT_VISION.tujuan.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> Kemenkes Permenkes No. 24 / 2022
              </span>
              <span>Regulasi Terpenuhi</span>
            </div>
          </div>

          {/* 2. 10 PRINSIP DASAR SISTEM (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">2. PRINSIP DASAR SISTEM</h2>
                  <p className="text-xs text-slate-500">10 Hukum inti arsitektur dan operasional data kesehatan</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold">
                10 Prinsip Terpenuhi
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto custom-scrollbar p-1">
              {BLUEPRINT_PRINCIPLES.map(p => (
                <div 
                  key={p.number}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-400 dark:hover:border-purple-600 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                        {p.number}
                      </span>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                        {p.title}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pl-8">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: ALUR PELAYANAN PASIEN (END-TO-END) — 8 TAHAPAN                 */}
      {/* ========================================================================= */}
      {(activeTab === 'full' || activeTab === 'flow') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Workflow className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">4. ALUR PELAYANAN PASIEN (END-TO-END)</h2>
                <p className="text-xs text-slate-500">8 Tahap perjalanan pasien terhubung tanpa silo data</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Klik tahapan untuk melihat rincian & membuka modul</span>
            </div>
          </div>

          {/* 8-STEP HORIZONTAL PIPELINE STEPPER */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
            {BLUEPRINT_PATIENT_FLOW.map(flow => {
              const isSelected = selectedFlowStep === flow.step;
              return (
                <div
                  key={flow.step}
                  onClick={() => setSelectedFlowStep(flow.step)}
                  className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-500 dark:border-cyan-400 shadow-md scale-102'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs text-white bg-gradient-to-br ${flow.color} shadow-xs`}>
                        {flow.step}
                      </span>
                      <span className="text-xl">{flow.icon}</span>
                    </div>

                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                      {flow.name.replace(/^\d+\.\s*/, '')}
                    </h4>

                    <ul className="space-y-1 text-[10px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      {flow.items.map((item, idx) => (
                        <li key={idx} className="truncate">• {item}</li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(flow.route);
                    }}
                    className="mt-3 w-full py-1.5 bg-slate-200/80 hover:bg-blue-600 hover:text-white dark:bg-slate-700 dark:hover:bg-cyan-500 dark:hover:text-slate-950 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Buka Modul</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* ACTIVE FLOW STEP DRILLDOWN CARD */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50 via-cyan-50 to-slate-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border border-blue-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentStepData.icon}</span>
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">Tahap {currentStepData.step} dari 8</span>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{currentStepData.name}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Sub-proses: {currentStepData.items.join(' • ')}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(currentStepData.route)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 self-start sm:self-auto shadow-md"
            >
              <span>Akses Halaman Layanan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: MODUL UTAMA APLIKASI (12 KARTU MODUL LENGKAP)                 */}
      {/* ========================================================================= */}
      {(activeTab === 'full' || activeTab === 'modules') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">5. MODUL UTAMA APLIKASI</h2>
                <p className="text-xs text-slate-500">12 Pilar fungsional sistem kesehatan klinik &amp; rumah sakit</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              12 Modul Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {BLUEPRINT_MODULE_CARDS.map(mod => (
              <div 
                key={mod.id}
                className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-cyan-400 transition-all flex flex-col justify-between group shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl p-2 rounded-xl bg-white dark:bg-slate-700/60 shadow-2xs">
                      {mod.icon}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${mod.color} ${mod.borderColor}`}>
                      Layanan
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {mod.name}
                  </h3>

                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {mod.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => navigate(mod.route)}
                  className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 transition-colors"
                >
                  <span>Buka Modul</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3, 7, 8, 9: ARSITEKTUR, KEAMANAN, OFFLINE & INTEGRASI EKSTERNAL    */}
      {/* ========================================================================= */}
      {(activeTab === 'full' || activeTab === 'modules') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 3. ARSITEKTUR SISTEM */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">3. ARSITEKTUR SISTEM</h3>
            </div>

            {/* Users */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pengguna (User):</span>
              <div className="flex flex-wrap gap-1.5">
                {BLUEPRINT_ARCHITECTURE.users.map((u, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                    <span>{u.icon}</span> {u.role}
                  </span>
                ))}
              </div>
            </div>

            {/* App Tier */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-900 dark:text-blue-300">
              📱 {BLUEPRINT_ARCHITECTURE.appTier}
            </div>

            {/* Service Layer */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Layer (Business Logic):</span>
              <div className="space-y-1">
                {BLUEPRINT_ARCHITECTURE.serviceLayer.map((s, i) => (
                  <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{s.name}</span>
                    <span className="text-[11px] text-slate-500">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Layer */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data Layer:</span>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                {BLUEPRINT_ARCHITECTURE.dataLayer.map((d, i) => (
                  <div key={i} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-lg block">{d.icon}</span>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate block">{d.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7. KEAMANAN & AKSES */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">7. KEAMANAN &amp; AKSES</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-blue-500" /> Authentication
                </span>
                <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
                  {BLUEPRINT_SECURITY.authentication.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-500" /> RBAC (11 Role Resmi)
                </span>
                <div className="flex flex-wrap gap-1 pt-1">
                  {BLUEPRINT_SECURITY.rbac.map((r, i) => (
                    <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Firestore Security Rules
                </span>
                <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
                  {BLUEPRINT_SECURITY.firestoreRules.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>
          </div>

          {/* 8 & 9. OFFLINE MODE & INTEGRASI EKSTERNAL */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {/* 8. OFFLINE MODE & SYNC */}
            <div>
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <WifiOff className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">8. OFFLINE MODE &amp; SYNC</h3>
              </div>

              <div className="mt-3 flex items-center justify-between text-center gap-1">
                {BLUEPRINT_OFFLINE_SYNC.pipeline.map((p, i) => (
                  <React.Fragment key={i}>
                    <div className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-sm block">{p.icon}</span>
                      <span className="text-[9px] font-bold text-slate-800 dark:text-slate-200 block truncate">{p.title}</span>
                    </div>
                    {i < BLUEPRINT_OFFLINE_SYNC.pipeline.length - 1 && (
                      <span className="text-slate-400 text-xs font-bold">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
              <ul className="mt-2.5 text-[11px] text-slate-500 space-y-1 list-disc pl-4">
                {BLUEPRINT_OFFLINE_SYNC.rules.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            {/* 9. INTEGRASI EKSTERNAL */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5 pb-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Globe className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">9. INTEGRASI EKSTERNAL</h4>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300 block mb-1">BPJS Kesehatan</span>
                  <ul className="text-[10px] text-emerald-700 dark:text-emerald-400 space-y-0.5">
                    {BLUEPRINT_EXTERNAL_INTEGRATIONS.bpjs.features.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                  <span className="font-bold text-xs text-blue-900 dark:text-blue-300 block mb-1">SATUSEHAT (FHIR)</span>
                  <ul className="text-[10px] text-blue-700 dark:text-blue-400 space-y-0.5">
                    {BLUEPRINT_EXTERNAL_INTEGRATIONS.satusehat.features.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: DATABASE (KONSEPTUAL) — 15 ENTITAS LENGKAP                    */}
      {/* ========================================================================= */}
      {(activeTab === 'full' || activeTab === 'database') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">6. DATABASE (KONSEPTUAL)</h2>
                <p className="text-xs text-slate-500">15 Entitas inti relasional Firestore untuk SIMRS &amp; RME</p>
              </div>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={dbSearch}
                onChange={e => setDbSearch(e.target.value)}
                placeholder="Cari tabel atau kolom..."
                className="pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-cyan-500 w-52"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {filteredDatabase.map(table => (
              <div 
                key={table.name}
                className={`p-3.5 rounded-2xl border ${table.color} backdrop-blur-sm space-y-2 shadow-2xs hover:scale-102 transition-transform`}
              >
                <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-700/60 pb-1.5">
                  <h4 className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                    {table.name}
                  </h4>
                  <span className="text-[9px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded">
                    {table.fields.length} cols
                  </span>
                </div>

                <ul className="space-y-0.5 font-mono text-[10px] text-slate-600 dark:text-slate-300">
                  {table.fields.map((f, i) => (
                    <li key={i} className="flex items-center gap-1">
                      <span className="text-cyan-500">•</span>
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                  {table.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 10: AI & GOVERNANCE                                              */}
      {/* ========================================================================= */}
      {(activeTab === 'full' || activeTab === 'ai_gov') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">10. AI &amp; GOVERNANCE</h2>
                <p className="text-xs text-slate-500">Standar tata kelola klinis: AI-Assisted, Human-Verified</p>
              </div>
            </div>

            <span className="px-3 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold border border-purple-200 dark:border-purple-800">
              Tata Kelola Aktif
            </span>
          </div>

          {/* 4-STAGE VERIFICATION PIPELINE */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Pipeline Verifikasi Medis (4 Tahap):</span>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {BLUEPRINT_AI_GOVERNANCE.statusPipeline.map((pipe, idx) => {
                const isActiveInSim = simulatedAiStatus === pipe.id;
                return (
                  <div
                    key={pipe.id}
                    onClick={() => setSimulatedAiStatus(pipe.id as any)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-center space-y-1 ${
                      isActiveInSim
                        ? `${pipe.color} shadow-md scale-102 ring-2 ring-purple-400`
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-400">Tahap {idx + 1}</span>
                    <h4 className="font-extrabold text-xs sm:text-sm">{pipe.label}</h4>
                    <p className="text-[10px] opacity-80">
                      {idx === 0 && 'Draft hasil GenAI dibuat otomatis'}
                      {idx === 1 && 'Menunggu tinjauan dokter pemeriksa'}
                      {idx === 2 && 'Dokter menyetujui / mengoreksi'}
                      {idx === 3 && 'Terkunci permanen ke RME resmi'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* FITUR AI */}
            <div className="p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800/60 space-y-3">
              <h4 className="font-bold text-sm text-purple-900 dark:text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> 9 Fitur AI Klinis MYITARU:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                {BLUEPRINT_AI_GOVERNANCE.fiturAi.map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-purple-500 font-bold">✓</span>
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AUDIT EVENT SCHEMA */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Skema Jejak Audit Event AI:
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {BLUEPRINT_AI_GOVERNANCE.auditEvent.map((e, i) => (
                  <span key={i} className="text-xs font-mono px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    {e}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500">
                Setiap output AI yang digunakan dalam diagnosis dicatat lengkap bersama identitas dokter yang menyetujuinya untuk kepatuhan medikolegal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 11 & 12: GAP ANALYSIS & FASE PENGEMBANGAN                         */}
      {/* ========================================================================= */}
      {(activeTab === 'full' || activeTab === 'gap_dod') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 11. GAP ANALYSIS (RINGKASAN) — 6 COLS */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">11. GAP ANALYSIS (RINGKASAN)</h3>
                  <p className="text-xs text-slate-500">Prioritas penyempurnaan fitur sistem</p>
                </div>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-1 text-[10px] font-bold">
                {['ALL', 'P0', 'P1', 'P2', 'P3'].map(p => (
                  <button
                    key={p}
                    onClick={() => setGapFilter(p as any)}
                    className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                      gapFilter === p 
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-2">Area Modul</th>
                    <th className="pb-2">Status Target</th>
                    <th className="pb-2 text-right">Prioritas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredGap.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white pr-2">
                        {item.area}
                        <span className="block text-[10px] font-normal text-slate-500 mt-0.5">{item.catatan}</span>
                      </td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {item.targetStatus}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                          {item.prioritas}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 12. FASE PENGEMBANGAN (ROADMAP) — 6 COLS */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-500/20">
                  <Workflow className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">12. FASE PENGEMBANGAN</h3>
                  <p className="text-xs text-slate-500">Roadmap 5 tahap maturitas rumah sakit</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Fase 1-4 Aktif</span>
            </div>

            <div className="space-y-2.5">
              {BLUEPRINT_ROADMAP.map(phase => (
                <div 
                  key={phase.phase}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span className={`w-5 h-5 rounded-md text-[10px] font-extrabold text-white bg-gradient-to-br ${phase.color} flex items-center justify-center`}>
                        {phase.phase}
                      </span>
                      {phase.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                      {phase.badge}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {phase.items.map((item, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 13: DEFINISI SELESAI (CHECKLIST 14 ITEM INTERAKTIF)                */}
      {/* ========================================================================= */}
      {(activeTab === 'full' || activeTab === 'gap_dod') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">13. DEFINISI SELESAI (CHECKLIST)</h2>
                <p className="text-xs text-slate-500">14 Kriteria penyelesaian teknis dan kepatuhan sistem</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 block">Progres Verifikasi:</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {completedCount} / {BLUEPRINT_DOD_CHECKLIST.length} ({progressPercent}%)
                </span>
              </div>

              <button
                onClick={() => {
                  const allTrue: Record<string, boolean> = {};
                  BLUEPRINT_DOD_CHECKLIST.forEach(i => allTrue[i.id] = true);
                  setCheckedItems(allTrue);
                  toast.success('Semua 14 kriteria telah diverifikasi selesai!');
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Tandai Semua Selesai
              </button>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 14 CHECKLIST ITEMS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {BLUEPRINT_DOD_CHECKLIST.map(item => {
              const isChecked = Boolean(checkedItems[item.id]);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 text-slate-900 dark:text-white'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' 
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className={`text-xs font-bold leading-tight ${isChecked ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {item.label}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

export default BlueprintSystemView;
