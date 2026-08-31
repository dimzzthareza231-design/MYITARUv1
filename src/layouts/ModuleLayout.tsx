import React, { useEffect, useState, useMemo } from 'react';
import { Outlet, useNavigate, useLocation, useSearchParams, useParams } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar';
import { findModule, MODULE_REGISTRY } from '../data/moduleRegistry';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { 
  ChevronLeft, ChevronRight, Users, UserCheck, UserPlus,
  Calendar, Clock, ListOrdered, FileText, FileBadge, CheckCircle, CheckCircle2,
  AlertTriangle, ShieldAlert, ShieldCheck, HeartPulse, Stethoscope, Activity,
  Bed, TestTube, Microscope, Film, Eye, Pill, Package, Boxes, Archive,
  CreditCard, Receipt, DollarSign, Wallet, TrendingUp, BarChart3, Settings,
  Key, Database, FileCode, Shield, Layers, HelpCircle, Scissors, Cpu, Sparkles,
  QrCode, Smartphone, Phone, Search, Sliders, RefreshCw, Bookmark, Star, Zap,
  Home, ChevronDown, ArrowLeft, ClipboardList, Syringe, Scale, FlaskConical,
  ScanLine, FileSignature, Mic, Globe, Building2, Ticket, History
} from 'lucide-react';

// Smart icon resolver based on submenu label matching RME iconography
function getSubmenuIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes('problem') || l.includes('masalah')) return ClipboardList;
  if (l.includes('alergi') || l.includes('allergy') || l.includes('triase') || l.includes('insiden') || l.includes('alert')) return AlertTriangle;
  if (l.includes('obat') || l.includes('medication') || l.includes('resep') || l.includes('apotek') || l.includes('dispensing') || l.includes('etiket') || l.includes('stok') || l.includes('defecta') || l.includes('udd')) return Pill;
  if (l.includes('vital') || l.includes('tanda vital') || l.includes('tensi')) return HeartPulse;
  if (l.includes('imun') || l.includes('vaksin') || l.includes('injeksi')) return Syringe;
  if (l.includes('growth') || l.includes('tumbuh') || l.includes('gizi') || l.includes('diet') || l.includes('berat')) return Scale;
  if (l.includes('lab') || l.includes('lis') || l.includes('darah') || l.includes('qc') || l.includes('permintaan')) return FlaskConical;
  if (l.includes('radiologi') || l.includes('pacs') || l.includes('dicom') || l.includes('viewer') || l.includes('orthanc') || l.includes('foto')) return ScanLine;
  if (l.includes('resume') || l.includes('dokumen') || l.includes('tanda tangan') || l.includes('consent') || l.includes('legal')) return FileSignature;
  if (l.includes('suara') || l.includes('scribe') || l.includes('voice')) return Mic;
  if (l.includes('grounding') || l.includes('search') || l.includes('web') || l.includes('online')) return Globe;
  if (l.includes('pasien') || l.includes('peserta') || l.includes('praktisi')) return Users;
  if (l.includes('registrasi') || l.includes('admisi') || l.includes('booking') || l.includes('tambah')) return UserPlus;
  if (l.includes('antrian') || l.includes('flow') || l.includes('pemanggil') || l.includes('display')) return ListOrdered;
  if (l.includes('pemeriksaan') || l.includes('dokter') || l.includes('visite') || l.includes('keperawatan') || l.includes('klinik') || l.includes('poliklinik')) return Stethoscope;
  if (l.includes('bed') || l.includes('ruangan') || l.includes('kapasitas')) return Bed;
  if (l.includes('operasi') || l.includes('bedah')) return Activity;
  if (l.includes('billing') || l.includes('kasir') || l.includes('bayar') || l.includes('klaim') || l.includes('kwitansi') || l.includes('tarif') || l.includes('ina-cbg') || l.includes('keuangan')) return CreditCard;
  if (l.includes('sep') || l.includes('rujukan') || l.includes('prb') || l.includes('vclaim') || l.includes('vedika') || l.includes('veronisa') || l.includes('bpjs')) return ShieldCheck;
  if (l.includes('sdm') || l.includes('pegawai') || l.includes('shift') || l.includes('hadir') || l.includes('cuti') || l.includes('kredensial')) return UserCheck;
  if (l.includes('jadwal')) return Calendar;
  if (l.includes('inventory') || l.includes('gudang') || l.includes('barang') || l.includes('order') || l.includes('po')) return Package;
  if (l.includes('mutu') || l.includes('safety') || l.includes('pathway') || l.includes('cssd')) return ShieldAlert;
  if (l.includes('laporan') || l.includes('monitoring') || l.includes('analytics') || l.includes('rugi') || l.includes('laba')) return BarChart3;
  if (l.includes('satu sehat') || l.includes('kemenkes') || l.includes('bridging') || l.includes('wa') || l.includes('gateway') || l.includes('api') || l.includes('hub')) return Zap;
  if (l.includes('panduan') || l.includes('artikel') || l.includes('notifikasi') || l.includes('icd')) return FileText;
  if (l.includes('security') || l.includes('user') || l.includes('role') || l.includes('auth')) return Key;
  if (l.includes('backup') || l.includes('log') || l.includes('audit')) return Database;
  if (l.includes('pengaturan') || l.includes('kelola') || l.includes('setting') || l.includes('cloudflare') || l.includes('dns') || l.includes('waf')) return Settings;
  return FileText;
}

// Group submenus into structured RME-style categories
function groupSubmenus(moduleId: string, submenus: any[]) {
  if (!submenus || submenus.length === 0) return [];

  if (moduleId === 'rekam-medis') {
    return [
      {
        title: 'PATIENT CHART',
        items: submenus.filter(s => {
          const l = (typeof s === 'string' ? s : s.label).toLowerCase();
          return l.includes('pasien') || l.includes('overview') || l.includes('encounter');
        })
      },
      {
        title: 'LONGITUDINAL RECORD',
        items: submenus.filter(s => {
          const l = (typeof s === 'string' ? s : s.label).toLowerCase();
          return l.includes('icd') || l.includes('problem') || l.includes('alergi') || l.includes('obat') || l.includes('vital') || l.includes('growth') || l.includes('imun');
        })
      },
      {
        title: 'INVESTIGATIONS & RESUME',
        items: submenus.filter(s => {
          const l = (typeof s === 'string' ? s : s.label).toLowerCase();
          return l.includes('resume') || l.includes('dokumen') || l.includes('lab') || l.includes('radiologi');
        })
      }
    ].filter(g => g.items.length > 0);
  }

  if (moduleId === 'rawat-jalan') {
    return [
      {
        title: 'PELAYANAN POLIKLINIK',
        items: submenus
      }
    ];
  }

  // Automatic semantic categorization matching the RME sidebar archetype
  const groupA: any[] = [];
  const groupB: any[] = [];
  const groupC: any[] = [];

  submenus.forEach(s => {
    const l = (typeof s === 'string' ? s : s.label).toLowerCase();
    if (l.includes('master') || l.includes('registrasi') || l.includes('triase') || l.includes('pemeriksaan') || l.includes('admisi') || l.includes('worklist') || l.includes('resep') || l.includes('billing') || l.includes('pegawai') || l.includes('booking') || l.includes('pasien') || l.includes('dashboard') || l.includes('peserta')) {
      groupA.push(s);
    } else if (l.includes('antrian') || l.includes('jadwal') || l.includes('bed') || l.includes('observasi') || l.includes('hasil') || l.includes('lis') || l.includes('pacs') || l.includes('dispensing') || l.includes('stok') || l.includes('shift') || l.includes('riwayat') || l.includes('visite') || l.includes('asuhan') || l.includes('sep') || l.includes('rujukan') || l.includes('prb') || l.includes('sk')) {
      groupB.push(s);
    } else {
      groupC.push(s);
    }
  });

  if (submenus.length <= 4) {
    return [{ title: 'LAYANAN UTAMA', items: submenus }];
  }

  const groups = [];
  if (groupA.length > 0) groups.push({ title: 'LAYANAN & OPERASIONAL', items: groupA });
  if (groupB.length > 0) groups.push({ title: 'PENCATATAN & REKAM DATA', items: groupB });
  if (groupC.length > 0) groups.push({ title: 'PENGATURAN & KELOLA', items: groupC });

  return groups.length > 0 ? groups : [{ title: 'MENU & FITUR', items: submenus }];
}

export default function ModuleLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');

  const { hasAccess, currentUser } = useAuth();
  const { moduleId: paramModuleId } = useParams();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Extract module ID from URL (e.g. /modul/pendaftaran -> pendaftaran)
  const pathParts = location.pathname.split('/');
  const moduleId = paramModuleId || pathParts[pathParts.length - 1];

  const isGoogleBlocked = Boolean(currentUser?.isGoogleAuth);
  const hasModuleAccess = !moduleId || !currentUser || (hasAccess(moduleId) && !isGoogleBlocked);

  // Proteksi: jika user tidak punya akses, redirect ke dashboard
  useEffect(() => {
    if (moduleId && currentUser) {
      if (isGoogleBlocked) {
        toast.error('Anda tidak berhak mengakses modul ini', { id: 'pelayanan-block' });
        navigate('/dashboard');
      } else if (!hasAccess(moduleId)) {
        toast.error('Anda tidak memiliki akses ke modul ini');
        navigate('/');
      }
    }
  }, [moduleId, currentUser, navigate, hasAccess, isGoogleBlocked]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const hasOpenModal = document.querySelector('[role="dialog"]') !== null || 
                             document.querySelector('.fixed.inset-0:not(.top-navbar-overlay)') !== null;
        if (!hasOpenModal) {
          navigate('/dashboard');
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (!hasModuleAccess) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900 flex-col">
        <div className="text-center bg-slate-800 p-10 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h2>
          <p className="text-slate-400">Anda tidak memiliki izin untuk mengakses modul ini.</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="mt-8 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const found = findModule(moduleId);
  const config = found ? found.module : { label: moduleId, icon: '⚙️', submenus: [] };
  const category = found ? found.category : null;

  // Default tab or tab from URL
  const defaultTab = (config.submenus && config.submenus.length > 0) ? (typeof config.submenus[0] === 'string' ? config.submenus[0] : (config.submenus[0]?.label || 'Data')) : 'Data';
  const activeTab = searchParams.get('tab') || defaultTab;

  const hasSubmenus = Boolean(config.submenus && config.submenus.length > 0);

  // Filtered submenus if search is active
  const filteredSubmenus = useMemo(() => {
    if (!config.submenus) return [];
    if (!sidebarSearch.trim()) return config.submenus;
    return config.submenus.filter((sub: any) => {
      const label = typeof sub === 'string' ? sub : sub.label;
      return label.toLowerCase().includes(sidebarSearch.toLowerCase());
    });
  }, [config.submenus, sidebarSearch]);

  // Grouped submenus for RME sidebar layout
  const sidebarGroups = useMemo(() => {
    return groupSubmenus(moduleId, filteredSubmenus);
  }, [moduleId, filteredSubmenus]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col w-full text-slate-200">
      
      {/* 1. NAVBAR (TOP) */}
      <TopNavbar currentTime={currentTime} />

      {/* Konten Utama */}
      <main className="flex-1 w-full relative pb-10 flex flex-col max-w-[1700px] mx-auto px-3 sm:px-5 lg:px-6 pt-4">
        
        {/* 2. BREADCRUMB & HEADER BAR */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800 backdrop-blur-md shadow-sm">
          <nav className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg hover:bg-slate-800/80"
            >
              <Home className="w-4 h-4 text-cyan-400" />
              <span>Dashboard</span>
            </button>
            <span className="text-slate-600">/</span>
            {category && (
              <>
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <span>{category.icon}</span> {category.label}
                </span>
                <span className="text-slate-600">/</span>
              </>
            )}
            <span className="text-white font-bold flex items-center gap-1.5 px-2 py-0.5 bg-slate-800 rounded-md border border-slate-700">
              <span>{config.icon}</span> {config.label}
            </span>
            {hasSubmenus && activeTab && (
              <>
                <span className="text-slate-600">/</span>
                <span className="text-cyan-300 font-semibold px-2 py-0.5 bg-cyan-950/60 rounded-md border border-cyan-800/60">
                  {activeTab}
                </span>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          </div>
        </div>

        {/* 3. LAYOUT CONTAINER (RME-STYLE SIDEBAR + CONTENT OUTLET) */}
        <div className="flex flex-col lg:flex-row gap-4 items-start w-full flex-1">
          
          {/* RME-STYLE COLLAPSIBLE SIDEBAR */}
          {hasSubmenus && (
            <aside 
              className={`w-full ${
                isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
              } bg-[#0a1122] border border-slate-800 rounded-2xl flex flex-col shrink-0 transition-all duration-300 ease-in-out shadow-2xl backdrop-blur-md overflow-hidden self-stretch lg:self-auto`}
            >
              {/* SIDEBAR HEADER / IDENTITY CARD (MATCHING RME AVATAR & BADGE DESIGN) */}
              <div className={`p-3.5 border-b border-slate-800/80 flex items-center ${isSidebarCollapsed ? 'lg:justify-center' : 'justify-between'} transition-all duration-300 bg-[#0B132B]/70`}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-12 rounded-2xl bg-[#14234b] border border-blue-900/60 text-blue-400 font-extrabold text-xl flex items-center justify-center shrink-0 shadow-inner">
                    {config.icon || '📋'}
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="overflow-hidden transition-all duration-300">
                      <h2 className="font-bold text-white text-sm sm:text-base leading-tight truncate">{config.label}</h2>
                      <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-950/40 border border-rose-900/60 text-rose-300 text-[10px] font-bold w-fit">
                        <ShieldAlert className="w-3 h-3 text-rose-400 shrink-0" />
                        <span className="truncate">{category?.label || 'Pelayanan Terintegrasi'}</span>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden lg:flex p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95"
                  title={isSidebarCollapsed ? 'Perluas Navigasi' : 'Sempitkan Navigasi'}
                >
                  {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>

              {/* QUICK SEARCH (When Expanded and more than 4 submenus) */}
              {!isSidebarCollapsed && config.submenus && config.submenus.length > 4 && (
                <div className="p-2.5 border-b border-slate-800/80 bg-slate-900/60">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari menu modul..."
                      value={sidebarSearch}
                      onChange={(e) => setSidebarSearch(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* SUBMENU CATEGORIES & ITEMS (MATCHING RME DESIGN) */}
              <div className={`flex-1 overflow-y-auto space-y-4 custom-scrollbar transition-all duration-300 ${isSidebarCollapsed ? 'p-2' : 'p-3'} max-h-[calc(100vh-200px)]`}>
                {sidebarGroups.map((group: any, gIdx: number) => (
                  <div key={gIdx} className="space-y-1.5">
                    {!isSidebarCollapsed ? (
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 pt-2 pb-0.5 truncate">
                        {group.title}
                      </div>
                    ) : (
                      <div className="h-px bg-slate-800/80 my-2 mx-1" />
                    )}

                    <div className="space-y-1">
                      {group.items.map((sub: any) => {
                        const label = typeof sub === 'string' ? sub : sub.label;
                        const isActive = activeTab === label;
                        const IconComponent = getSubmenuIcon(label);

                        return (
                          <button
                            key={label}
                            onClick={() => setSearchParams({ tab: label })}
                            className={`group relative w-full flex items-center gap-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                              isSidebarCollapsed ? 'justify-center p-2' : 'px-2.5 py-2'
                            } ${
                              isActive 
                                ? 'bg-blue-950/40 text-blue-300 font-bold border border-blue-800/50 shadow-xs' 
                                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                            }`}
                          >
                            {/* Active Indicator Bar */}
                            {isActive && !isSidebarCollapsed && (
                              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-500 rounded-r-full shadow-sm shadow-blue-500/50" />
                            )}

                            {/* Menu Icon with dedicated rounded container matching RME */}
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                              isActive
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                : 'bg-slate-800/90 border border-slate-700/60 text-slate-400 group-hover:bg-slate-700 group-hover:text-blue-300 group-hover:border-slate-600 group-hover:scale-105'
                            }`}>
                              <IconComponent className="w-4 h-4 transition-transform duration-200" />
                            </div>

                            {/* Text Label */}
                            {!isSidebarCollapsed && (
                              <>
                                <span className="text-left truncate flex-1 leading-snug">{label}</span>
                                <ChevronRight className={`w-3 h-3 ml-auto transition-transform duration-200 ${isActive ? 'opacity-100 text-blue-400 translate-x-0.5' : 'opacity-20 group-hover:opacity-70 group-hover:translate-x-0.5'}`} />
                              </>
                            )}

                            {/* Floating Tooltip when collapsed */}
                            {isSidebarCollapsed && (
                              <div className="hidden lg:block absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl border border-slate-700 whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 z-50 translate-x-1 group-hover:translate-x-0">
                                {label}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* SIDEBAR FOOTER */}
              {!isSidebarCollapsed && (
                <div className="p-3 border-t border-slate-800/80 bg-[#0B132B]/50 text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>MYITARU SIMRS</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">v1.0.0</span>
                </div>
              )}
            </aside>
          )}

          {/* CONTENT AREA (OUTLET) */}
          <div className="flex-1 min-w-0 w-full bg-slate-900/60 rounded-2xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
            <Outlet context={{ activeTab }} />
          </div>

        </div>

      </main>

    </div>
  );
}


