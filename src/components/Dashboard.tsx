import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MODULE_REGISTRY } from '../data/moduleRegistry';
import { useHospital } from '../contexts/HospitalContext';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { getRoleById } from '../data/roles';
import TopNavbar from './TopNavbar';
import { storage } from '../utils/storage';
import { DashboardWidgetAntrian } from './DashboardWidgetAntrian';
import { DashboardNewsWidget } from './DashboardNewsWidget';
import { AIClinicalInsightsGrid } from './Dashboard/AIClinicalInsightsGrid';
import { DATA_PEGAWAI } from '../data/dataPegawai';
import { DATA_DOKTER } from '../data/dataDokter';
import { Sparkles, Quote, Workflow, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { BlueprintModal } from './Blueprint/BlueprintModal';

// Koleksi Quotes Kesehatan Harian
const HEALTH_QUOTES = [
  { text: "Kesehatan yang baik bukanlah sesuatu yang dapat kita beli, melainkan tabungan yang paling berharga.", author: "Anne Wilson Schaef" },
  { text: "Harta sejati adalah kesehatan fisik dan ketenangan jiwa, bukan sekadar kepingan emas.", author: "Mahatma Gandhi" },
  { text: "Merawat diri sendiri adalah langkah awal terbaik untuk dapat memberikan pelayanan terbaik bagi sesama.", author: "Eleanor Brown" },
  { text: "Pencegahan adalah obat terbaik, dan senyum yang tulus adalah terapi paling menenangkan.", author: "Prinsip Kedokteran" },
  { text: "Kesehatan adalah hubungan harmonis yang menyatukan tubuh, pikiran, dan dedikasi kita.", author: "B.K.S. Iyengar" },
  { text: "Setiap tindakan medis yang presisi berakar pada ketelitian, empati, dan kepedulian yang mendalam.", author: "Etika Pelayanan Medis" },
  { text: "Pikiran yang tenang dan fokus adalah kunci ketahanan fisik serta keputusan klinis yang tepat.", author: "Pakar Kesehatan" },
  { text: "Kebugaran dan kesehatan adalah fondasi utama dari kebahagiaan dan produktivitas hidup sejati.", author: "Joseph Pilates" },
  { text: "Pelayanan kesehatan yang prima berawal dari komitmen integritas dan kemanusiaan tanpa batas.", author: "Nilai MYITARU" },
  { text: "Waktu dan kesehatan adalah aset berharga yang harus dijaga dengan penuh kebijaksanaan.", author: "Denis Waitley" }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { activeUser, pasien, kunjungan } = useHospital();
  const { currentUser, hasAccess } = useAuth();
  const currentRole = currentUser ? getRoleById(currentUser.roleId) : null;
  const toast = useToast();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleForModal, setSelectedModuleForModal] = useState<any>(null);
  const [showBlueprintModal, setShowBlueprintModal] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedModuleForModal) setSelectedModuleForModal(null);
        if (showBlueprintModal) setShowBlueprintModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedModuleForModal, showBlueprintModal]);

  // Quotes yang berganti otomatis setiap hari berdasarkan tanggal
  const dailyQuote = useMemo(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return HEALTH_QUOTES[dayOfYear % HEALTH_QUOTES.length];
  }, []);
  
  const totalPasien = pasien && pasien.length > 0 ? pasien.length : storage.get('db_pasien', []).length;
  const totalIgd = storage.get('myitaru_igd_triase', []).length;
  const totalPoli = kunjungan && kunjungan.length > 0
    ? kunjungan.filter((k: any) => k.tipe === 'Rawat Jalan' && (k.status === 'Menunggu' || k.status === 'Antri' || k.status === 'Diperiksa')).length
    : storage.get('hospital_kunjungan', []).filter((k: any) => k.tipe === 'Rawat Jalan' && (k.status === 'Menunggu' || k.status === 'Antri' || k.status === 'Diperiksa')).length;
  
  const formatDate = (d: Date) => d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  
  return (
    <div className="min-h-screen bg-[#071322] relative flex flex-col selection:bg-[#C9A94E]/30 selection:text-white overflow-hidden">
      
      {/* AMBIENT MESH GRADIENT BACKGROUND FOR GLASSMORPHISM */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C9A94E]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-cyan-900/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
      </div>
      
      {/* NAVBAR */}
      <TopNavbar />
      
      <main className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto flex-1">
        
        {/* TOP SECTION: WELCOME & WIDGET */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10 items-stretch">
          
          {/* WELCOME CARD -> LUXURY GLASSMORPHISM */}
          <div className="md:col-span-2 bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-6 md:p-8 text-white border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] h-full flex flex-col justify-between relative overflow-hidden animate-fade-in-up">
            {/* Top gold accent line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#E5CA78]/60 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center h-full justify-between gap-8">
              <div className="flex flex-col gap-4 flex-1">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] text-[#E5CA78] text-[10px] font-bold uppercase tracking-widest mb-3 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#E5CA78]" />
                    Sistem Informasi Klinik
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">
                    Selamat Datang Di MY ITARU
                  </h2>
                </div>

                <div className="flex items-end gap-4 mt-1">
                  <div className="text-5xl md:text-7xl font-extrabold tracking-tighter tabular-nums text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] font-mono">
                    {currentTime.getHours().toString().padStart(2, '0')}<span className="animate-[pulse_1s_ease-in-out_infinite] text-[#E5CA78]/80">:</span>{currentTime.getMinutes().toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base font-medium text-slate-300 flex flex-col gap-1 mb-2">
                    <span className="tracking-wide">{currentTime.toLocaleDateString('id-ID', { weekday: 'long' })}</span>
                    <span className="text-white/60 text-xs md:text-sm">{currentTime.getDate()} {currentTime.toLocaleDateString('id-ID', { month: 'long' })} {currentTime.getFullYear()}</span>
                  </div>
                </div>

                {/* DAILY HEALTH QUOTE */}
                <div className="mt-4 p-4 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/[0.05] flex items-start gap-3 max-w-xl">
                  <Quote className="w-4 h-4 text-[#C9A94E] shrink-0 mt-1 rotate-180 opacity-70" />
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[12px] text-slate-300 italic font-medium leading-relaxed">
                      "{dailyQuote.text}"
                    </p>
                    <span className="text-[10px] text-[#C9A94E]/80 font-bold tracking-wider uppercase self-end">
                      — {dailyQuote.author}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row xl:flex-col gap-4 mt-4 xl:mt-0 xl:min-w-[220px]">
                <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-4 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transform transition-all duration-300 hover:bg-white/[0.08] hover:border-[#C9A94E]/40 hover:-translate-y-0.5 flex-1 flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors"></div>
                  <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">Total Pasien</div>
                  <div className="text-3xl font-black mt-1 text-white font-mono tabular-nums">{totalPasien}</div>
                </div>
                <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-4 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transform transition-all duration-300 hover:bg-white/[0.08] hover:border-rose-400/40 hover:-translate-y-0.5 flex-1 flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-colors"></div>
                  <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">Pasien IGD</div>
                  <div className="text-3xl font-black mt-1 text-rose-400 font-mono tabular-nums">{totalIgd}</div>
                </div>
                <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-4 border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] transform transition-all duration-300 hover:bg-white/[0.08] hover:border-[#C9A94E]/40 hover:-translate-y-0.5 flex-1 flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#C9A94E]/10 rounded-full blur-xl group-hover:bg-[#C9A94E]/20 transition-colors"></div>
                  <div className="text-xs text-slate-400 font-medium tracking-wide uppercase">Antrean Poli</div>
                  <div className="text-3xl font-black mt-1 text-[#E5CA78] font-mono tabular-nums">{totalPoli}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* WIDGET BERITA KESEHATAN */}
          <div className="col-span-1 h-full animate-fade-in-up animation-delay-200 opacity-90 hover:opacity-100 transition-opacity">
            <DashboardNewsWidget />
          </div>

          {/* WIDGET ANTRIAN LIVE */}
          <div className="col-span-1 h-full animate-fade-in-up animation-delay-300 opacity-90 hover:opacity-100 transition-opacity">
            <DashboardWidgetAntrian />
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-10 relative group max-w-3xl mx-auto">
          <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none z-10">
            <svg className="w-5 h-5 text-slate-400 group-focus-within:text-[#E5CA78] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari modul atau layanan... (Contoh: Pendaftaran, Kasir)"
            className="w-full pl-14 pr-6 py-4 rounded-full bg-white/[0.03] backdrop-blur-2xl border border-white/[0.1] text-white placeholder-slate-400 focus:bg-white/[0.05] focus:border-[#C9A94E]/50 focus:ring-4 focus:ring-[#C9A94E]/10 focus:outline-none transition-all shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.05)] text-base md:text-lg"
          />
        </div>
        
        {/* GRID PER KATEGORI */}
        <div className="space-y-14 pb-16">
          {MODULE_REGISTRY.map((cat) => {
            const matchingModules = cat.modules.filter(m => {
              // Proteksi berdasarkan role
              if (!hasAccess(m.id)) return false;
              // Proteksi security hanya untuk super_admin, admin, dan it_support
              if ((m.id === 'security' || m.label === 'Security') && currentUser?.roleId !== 'super_admin' && currentUser?.roleId !== 'admin' && currentUser?.roleId !== 'it_support') return false;
              return m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     m.submenus.some((s: any) => (typeof s === 'string' ? s : s.label).toLowerCase().includes(searchQuery.toLowerCase()));
            });
            
            if (matchingModules.length === 0) return null;
            
            return (
              <div key={cat.id} className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/[0.05] pb-4 px-2">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{cat.label}</h3>
                  <span className="text-[10px] font-bold px-3 py-1 bg-white/[0.05] text-slate-300 rounded-full border border-white/[0.1] uppercase tracking-widest ml-2">
                    {matchingModules.length} Modul
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-6">
                  {matchingModules.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => {
                        if (mod.submenus && mod.submenus.length > 0) {
                          setSelectedModuleForModal(mod);
                        } else {
                          navigate(`/modul/${mod.id}`);
                        }
                      }}
                      className="group relative bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.2] transition-all duration-500 hover:-translate-y-1.5 text-left flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden min-h-[160px]"
                    >
                      {/* Subtle hover accent glow */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative z-10 flex-1">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-2xl mb-5 shadow-[0_8px_16px_rgba(0,0,0,0.2)] border border-white/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                          {mod.icon}
                        </div>
                        <h4 className="font-bold text-white/90 group-hover:text-white transition-colors text-base line-clamp-2 leading-snug">
                          {mod.label}
                        </h4>
                      </div>
                      
                      <div className="mt-5 flex items-center justify-between text-xs text-slate-400 group-hover:text-[#E5CA78] relative z-10">
                        <span className="font-medium tracking-wide">{mod.submenus.length} Layanan</span>
                        <div className="w-6 h-6 rounded-full bg-white/[0.05] flex items-center justify-center group-hover:bg-[#C9A94E]/20 transition-colors">
                          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* BAGIAN PALING BAWAH: AI CLINICAL INSIGHTS & BLUEPRINT PENGEMBANGAN         */}
        {/* ========================================================================= */}

        {/* AI CLINICAL INSIGHTS MODULAR DRAG-AND-DROP GRID */}
        <div className="mb-10">
          <AIClinicalInsightsGrid />
        </div>

        {/* BLUEPRINT SISTEM EVALUASI & PENGEMBANGAN HERO CARD */}
        <div className="mb-12 bg-gradient-to-r from-[#072448]/95 via-[#0D3B66]/90 to-[#0B525B]/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-cyan-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl">🗺️</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 tracking-wider uppercase">
                  Arsitektur Resmi MYITARU
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 10 Prinsip Dasar &amp; 14 Kriteria DoD Terpenuhi
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                BLUEPRINT EVALUASI &amp; PENGEMBANGAN APLIKASI
              </h3>
              <p className="text-xs sm:text-sm text-cyan-100/90 max-w-3xl leading-relaxed">
                Sistem Informasi Manajemen Klinik / Hospital Information System + RME + AI • 
                <span className="italic ml-1 text-cyan-200">"Satu Sistem, Satu Data, Untuk Pelayanan Kesehatan yang Lebih Baik"</span>
              </p>

              {/* 8-Step mini pipeline */}
              <div className="pt-2 flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-[11px] font-bold">
                {[
                  { n: '1', l: 'Pendaftaran', r: '/modul/pendaftaran' },
                  { n: '2', l: 'Encounter', r: '/modul/pendaftaran?tab=2.+Registrasi+Kunjungan' },
                  { n: '3', l: 'Klinis (SOAP)', r: '/modul/rawat-jalan' },
                  { n: '4', l: 'Penunjang', r: '/modul/laboratorium' },
                  { n: '5', l: 'Farmasi', r: '/modul/apotek-ralan' },
                  { n: '6', l: 'Billing', r: '/modul/kasir' },
                  { n: '7', l: 'Disposisi', r: '/modul/rawat-inap' },
                  { n: '8', l: 'RME Final', r: '/modul/rekam-medis' }
                ].map((s, idx) => (
                  <React.Fragment key={s.n}>
                    <button
                      onClick={() => navigate(s.r)}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-cyan-500 hover:text-slate-950 text-white border border-white/15 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
                    >
                      <span className="w-4 h-4 rounded-full bg-cyan-400/30 text-cyan-200 text-[9px] flex items-center justify-center font-mono">{s.n}</span>
                      <span>{s.l}</span>
                    </button>
                    {idx < 7 && <span className="text-cyan-400/60 font-bold">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex sm:flex-row flex-col items-stretch sm:items-center gap-3 shrink-0">
              <button
                onClick={() => setShowBlueprintModal(true)}
                className="px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Buka Blueprint Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/modul/blueprint')}
                className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Halaman Modul</span>
              </button>
            </div>
          </div>
        </div>
        
      </main>

      {/* SUB-MODULE MODAL POP-UP */}
      {selectedModuleForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* BACKDROP OVERLAY */}
          <div 
            className="absolute inset-0 bg-[#071322]/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
            onClick={() => setSelectedModuleForModal(null)}
          ></div>
          
          {/* MODAL CONTENT */}
          <div className="bg-white dark:bg-[#0B1E36] rounded-3xl w-full max-w-4xl relative z-10 shadow-2xl border border-slate-200 dark:border-[#C9A94E]/30 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 ease-out">
            {/* HEADER */}
            <div className={`p-6 md:p-8 bg-gradient-to-r ${selectedModuleForModal.color || 'from-blue-600 to-indigo-600'} text-white flex items-center gap-5 relative overflow-hidden`}>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mt-20 -mr-20 pointer-events-none"></div>
              
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner backdrop-blur-md relative z-10 border border-white/20">
                {selectedModuleForModal.icon}
              </div>
              <div className="flex-1 relative z-10">
                <h2 className="text-2xl md:text-3xl font-black tracking-tight">{selectedModuleForModal.label}</h2>
                <p className="text-white/80 text-sm md:text-base mt-1 font-medium">Pilih sub-modul atau layanan yang ingin diakses</p>
              </div>
              <button 
                onClick={() => setSelectedModuleForModal(null)}
                className="w-12 h-12 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative z-10 border border-white/10"
                title="Tutup (Esc)"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* BODY - GRID (3 OR 4 COLS) */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-transparent">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {selectedModuleForModal.submenus.map((sub: any, index: number) => {
                  const subLabel = typeof sub === 'string' ? sub : sub.label;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedModuleForModal(null);
                        navigate(`/modul/${selectedModuleForModal.id}?tab=${encodeURIComponent(subLabel)}`);
                      }}
                      className="group p-5 md:p-6 bg-white dark:bg-[#102D52]/50 rounded-2xl border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-[#184270]/80 hover:border-blue-300 dark:hover:border-[#C9A94E]/60 transition-all duration-300 flex flex-col items-center text-center gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1.5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#08182B] flex items-center justify-center text-2xl shadow-sm border border-slate-200/50 dark:border-white/5 group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(201,169,78,0.2)] transition-all duration-300">
                        <span className="opacity-80 group-hover:opacity-100 transition-opacity">
                          {selectedModuleForModal.icon}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-[#E5CA78] transition-colors leading-snug px-2">
                        {subLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BLUEPRINT EVALUASI & PENGEMBANGAN APLIKASI */}
      {showBlueprintModal && (
        <BlueprintModal
          isOpen={showBlueprintModal}
          onClose={() => setShowBlueprintModal(false)}
        />
      )}
    </div>
  );
}

