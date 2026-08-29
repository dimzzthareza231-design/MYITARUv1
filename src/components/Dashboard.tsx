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
import { DATA_PEGAWAI } from '../data/dataPegawai';
import { DATA_DOKTER } from '../data/dataDokter';
import { Sparkles, Quote } from 'lucide-react';

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
  const { activeUser } = useHospital();
  const { currentUser, hasAccess } = useAuth();
  const currentRole = currentUser ? getRoleById(currentUser.roleId) : null;
  const toast = useToast();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Quotes yang berganti otomatis setiap hari berdasarkan tanggal
  const dailyQuote = useMemo(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return HEALTH_QUOTES[dayOfYear % HEALTH_QUOTES.length];
  }, []);
  
  const totalPasien = storage.get('db_pasien', []).length;
  const totalIgd = storage.get('myitaru_igd_triase', []).length;
  const totalPoli = storage.get('hospital_kunjungan', []).filter((k: any) => k.tipe === 'Rawat Jalan' && (k.status === 'Menunggu' || k.status === 'Antri' || k.status === 'Diperiksa')).length;
  
  const formatDate = (d: Date) => d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  
  return (
    <div className="min-h-screen bg-[#071322] relative flex flex-col selection:bg-[#C9A94E]/30 selection:text-white">
      
      {/* WATERMARK */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <div className="text-[14rem] font-black text-white opacity-[0.015] rotate-[-15deg] whitespace-nowrap">
          Dimas Pangestu
        </div>
      </div>
      
      {/* NAVBAR */}
      <TopNavbar currentTime={currentTime} />
      
      <main className="relative z-10 p-4 sm:p-6 max-w-[1600px] w-full mx-auto flex-1">
        
        {/* TOP SECTION: WELCOME & WIDGET */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 items-stretch">
          
          {/* WELCOME CARD -> LUXURY DASHBOARD INFO */}
          <div className="md:col-span-2 bg-gradient-to-r from-[#0B1E36] via-[#102D52] to-[#184270] rounded-2xl shadow-[0_10px_35px_rgba(11,30,54,0.7)] p-6 md:p-8 text-white border border-[#C9A94E]/35 h-full flex flex-col justify-between relative overflow-hidden animate-fade-in-up">
            {/* Top gold accent line */}
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#0F3B5E] via-[#E5CA78] to-[#C9A94E]"></div>
            
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-[#C9A94E] opacity-10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-400 opacity-15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center h-full justify-between gap-6">
              <div className="flex flex-col gap-3 flex-1">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C9A94E]/15 border border-[#C9A94E]/30 text-[#E5CA78] text-[10px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3 text-[#E5CA78]" />
                    Sistem Informasi Klinik
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#E5CA78] tracking-wide">
                    Selamat Datang Di MY ITARU
                  </h2>
                </div>

                <div className="flex items-end gap-3 mt-1">
                  <div className="text-4xl md:text-6xl font-extrabold tracking-tight tabular-nums text-transparent bg-clip-text bg-gradient-to-br from-white via-cyan-100 to-[#E5CA78] drop-shadow-md">
                    {currentTime.getHours().toString().padStart(2, '0')}<span className="animate-[pulse_1s_ease-in-out_infinite] text-[#E5CA78]">:</span>{currentTime.getMinutes().toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm md:text-base font-medium text-slate-200 flex items-center gap-2 mb-1 flex-wrap">
                    <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md shadow-sm border border-white/10">{currentTime.toLocaleDateString('id-ID', { weekday: 'long' })}</span>
                    <span className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md shadow-sm border border-white/10">{currentTime.getDate()} {currentTime.toLocaleDateString('id-ID', { month: 'long' })} {currentTime.getFullYear()}</span>
                  </div>
                </div>

                {/* DAILY HEALTH QUOTE */}
                <div className="mt-2 p-3 bg-white/5 backdrop-blur-md rounded-xl border border-[#C9A94E]/25 shadow-sm flex items-start gap-2.5 max-w-xl">
                  <Quote className="w-4 h-4 text-[#E5CA78] shrink-0 mt-0.5 rotate-180 opacity-90" />
                  <div className="flex flex-col">
                    <p className="text-[11px] md:text-xs text-slate-200 italic font-medium leading-relaxed">
                      "{dailyQuote.text}"
                    </p>
                    <span className="text-[9px] md:text-[10px] text-[#E5CA78] font-semibold mt-1 self-end">
                      — {dailyQuote.author}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row xl:flex-col gap-3 mt-4 xl:mt-0 xl:min-w-[200px]">
                <div className="bg-[#08182B]/60 backdrop-blur-md rounded-xl p-3.5 border border-[#C9A94E]/30 transform transition-all duration-300 hover:bg-[#0D2542]/80 hover:border-[#C9A94E]/60 shadow-lg flex-1 flex flex-col justify-center">
                  <div className="text-[11px] md:text-xs text-slate-300 font-medium truncate">Total Pasien</div>
                  <div className="text-2xl md:text-3xl font-black mt-0.5 text-white drop-shadow-md">{totalPasien}</div>
                </div>
                <div className="bg-[#08182B]/60 backdrop-blur-md rounded-xl p-3.5 border border-[#C9A94E]/30 transform transition-all duration-300 hover:bg-[#0D2542]/80 hover:border-[#C9A94E]/60 shadow-lg flex-1 flex flex-col justify-center">
                  <div className="text-[11px] md:text-xs text-slate-300 font-medium truncate">Pasien IGD</div>
                  <div className="text-2xl md:text-3xl font-black mt-0.5 text-rose-400 drop-shadow-md">{totalIgd}</div>
                </div>
                <div className="bg-[#08182B]/60 backdrop-blur-md rounded-xl p-3.5 border border-[#C9A94E]/30 transform transition-all duration-300 hover:bg-[#0D2542]/80 hover:border-[#C9A94E]/60 shadow-lg flex-1 flex flex-col justify-center">
                  <div className="text-[11px] md:text-xs text-slate-300 font-medium truncate">Antrean Poli</div>
                  <div className="text-2xl md:text-3xl font-black mt-0.5 text-[#E5CA78] drop-shadow-md">{totalPoli}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* WIDGET BERITA KESEHATAN */}
          <div className="col-span-1 h-full animate-fade-in-up animation-delay-200">
            <DashboardNewsWidget />
          </div>

          {/* WIDGET ANTRIAN LIVE */}
          <div className="col-span-1 h-full animate-fade-in-up animation-delay-300">
            <DashboardWidgetAntrian />
          </div>
        </div>
        
        {/* SEARCH */}
        <div className="mb-8 relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
            <span className="text-xl">🔍</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari modul atau layanan... (Contoh: Pasien, IGD, Kasir)"
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-[#0B1E36]/60 backdrop-blur-xl border border-[#C9A94E]/30 text-white placeholder-slate-400 focus:border-[#C9A94E] focus:ring-1 focus:ring-[#C9A94E]/50 focus:outline-none transition-all shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-lg"
          />
        </div>
        
        {/* GRID PER KATEGORI */}
        <div className="space-y-12 pb-12">
          {MODULE_REGISTRY.map((cat) => {
            const matchingModules = cat.modules.filter(m => {
              // Proteksi berdasarkan role
              if (!hasAccess(m.id)) return false;
              // Proteksi security hanya untuk admin (logic lama tetap dipertahankan)
              if ((m.id === 'security' || m.label === 'Security') && currentUser?.roleId !== 'super_admin' && currentUser?.roleId !== 'admin') return false;
              return m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     m.submenus.some((s: any) => (typeof s === 'string' ? s : s.label).toLowerCase().includes(searchQuery.toLowerCase()));
            });
            
            if (matchingModules.length === 0) return null;
            
            return (
              <div key={cat.id} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-[#C9A94E]/20 pb-3">
                  <span className="text-2xl drop-shadow-sm">{cat.icon}</span>
                  <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#E5CA78] tracking-wide">{cat.label}</h3>
                  <span className="text-xs font-bold px-3 py-1 bg-[#0B1E36]/80 backdrop-blur-md text-[#E5CA78] rounded-full border border-[#C9A94E]/30 shadow-sm">
                    {matchingModules.length} Modul
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                  {matchingModules.map((mod) => (
                    <button
                      key={mod.id}
                      onClick={() => navigate(`/modul/${mod.id}`)}
                      className="group relative bg-[#0B1E36]/60 backdrop-blur-xl rounded-2xl p-5 border border-white/[0.08] hover:border-[#C9A94E]/70 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 text-left flex flex-col justify-between shadow-[0_8px_25px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_35px_rgba(201,169,78,0.2)] overflow-hidden"
                    >
                      {/* Subtle hover gold glow */}
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#C9A94E]/10 rounded-full blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-2xl mb-3 shadow-[0_4px_15px_rgba(0,0,0,0.25)] border border-white/10 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(201,169,78,0.3)] transition-all`}>
                          {mod.icon}
                        </div>
                        <h4 className="font-bold text-white group-hover:text-[#E5CA78] transition-colors text-sm line-clamp-1">
                          {mod.label}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-medium">
                          {mod.submenus.length} Layanan
                        </p>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400 group-hover:text-[#E5CA78] relative z-10">
                        <span className="font-medium">Akses</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
      </main>
    </div>
  );
}

