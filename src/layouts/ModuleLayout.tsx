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
  if (l.includes('peminjaman') || l.includes('tracer') || l.includes('arsip') || l.includes('berkas')) return Archive;
  if (l.includes('klpcm') || l.includes('audit')) return ShieldCheck;
  if (l.includes('pelepasan') || l.includes('visum') || l.includes('legalisir')) return FileBadge;
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

// Helper to classify if a submenu item is a secondary/auxiliary item based on active route context
function isSecondaryItem(label: string, moduleId: string, activeTab: string): boolean {
  const l = label.toLowerCase();
  const act = activeTab.toLowerCase();

  // If the item is currently active, it is NEVER secondary
  if (label === activeTab) return false;

  // Global secondary/administrative/utility keywords
  if (
    l.includes('pengaturan') || l.includes('setting') || l.includes('audit') || 
    l.includes('log') || l.includes('mapping') || l.includes('tarif') || 
    l.includes('katalog') || l.includes('qa/qc') || l.includes('quality control') || 
    l.includes('pelepasan') || l.includes('peminjaman') || l.includes('tracer') ||
    l.includes('klpcm') || l.includes('status alat') || l.includes('kredensial') ||
    l.includes('hak akses') || l.includes('dokumen pendukung')
  ) {
    return true;
  }

  // Module-specific context awareness:
  // In Clinical / Examination tasks, doctor roster and master setup become secondary
  if (moduleId === 'rawat-jalan' && (act.includes('periksa') || act.includes('booking') || act.includes('flow'))) {
    if (l.includes('dokter rawat jalan') || l.includes('jadwal')) return true;
  }

  if (moduleId === 'rekam-medis' && (act.includes('pasien') || act.includes('resume') || act.includes('icd'))) {
    if (l.includes('audit') || l.includes('pelepasan') || l.includes('peminjaman')) return true;
  }

  if (moduleId === 'laboratorium' && (act.includes('worklist') || act.includes('hasil') || act.includes('validasi'))) {
    if (l.includes('katalog') || l.includes('quality control') || l.includes('bank darah')) return true;
  }

  if (moduleId === 'radiologi' && (act.includes('pacs') || act.includes('worklist') || act.includes('hasil'))) {
    if (l.includes('katalog') || l.includes('status alat')) return true;
  }

  if (moduleId === 'igd' && (act.includes('triase') || act.includes('penanganan') || act.includes('observasi'))) {
    if (l.includes('dokter igd')) return true;
  }

  if (moduleId === 'rawat-inap' && (act.includes('admisi') || act.includes('visite') || act.includes('asuhan'))) {
    if (l.includes('dokter ranap')) return true;
  }

  if (moduleId === 'apotek-ralan' && (act.includes('resep') || act.includes('dispensing'))) {
    if (l.includes('master stok')) return true;
  }

  return false;
}

// Group submenus into structured RME-style categories with primary/secondary tagging
function groupSubmenus(moduleId: string, submenus: any[], activeTab: string) {
  if (!submenus || submenus.length === 0) return [];

  if (moduleId === 'rekam-medis') {
    return [
      {
        id: 'rme_berkas',
        title: 'BERKAS & REKAM MEDIS',
        isPrimaryCategory: true,
        items: submenus.filter(s => {
          const l = (typeof s === 'string' ? s : s.label).toLowerCase();
          return l.includes('pasien') || l.includes('overview') || l.includes('berkas') || l.includes('peminjaman') || l.includes('tracer');
        })
      },
      {
        id: 'rme_icd',
        title: 'KODEFIKASI KLINIS (WHO)',
        isPrimaryCategory: true,
        items: submenus.filter(s => {
          const l = (typeof s === 'string' ? s : s.label).toLowerCase();
          return l.includes('icd') || l.includes('problem') || l.includes('diagnosis') || l.includes('tindakan');
        })
      },
      {
        id: 'rme_dokumen',
        title: 'DOKUMEN & MUTU RME',
        isPrimaryCategory: false,
        items: submenus.filter(s => {
          const l = (typeof s === 'string' ? s : s.label).toLowerCase();
          return l.includes('resume') || l.includes('audit') || l.includes('klpcm') || l.includes('pelepasan') || l.includes('dokumen') || l.includes('visum');
        })
      }
    ].filter(g => g.items.length > 0);
  }

  if (moduleId === 'rawat-jalan') {
    return [
      {
        id: 'ralan_utama',
        title: 'PELAYANAN POLIKLINIK',
        isPrimaryCategory: true,
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
    if (l.includes('master') || l.includes('registrasi') || l.includes('triase') || l.includes('pemeriksaan') || l.includes('admisi') || l.includes('worklist') || l.includes('resep') || l.includes('billing') || l.includes('booking') || l.includes('pasien') || l.includes('dashboard') || l.includes('peserta')) {
      groupA.push(s);
    } else if (l.includes('antrian') || l.includes('jadwal') || l.includes('bed') || l.includes('observasi') || l.includes('hasil') || l.includes('lis') || l.includes('pacs') || l.includes('dispensing') || l.includes('stok') || l.includes('shift') || l.includes('riwayat') || l.includes('visite') || l.includes('asuhan') || l.includes('sep') || l.includes('rujukan') || l.includes('prb') || l.includes('sk')) {
      groupB.push(s);
    } else {
      groupC.push(s);
    }
  });

  if (submenus.length <= 4) {
    return [{ id: 'group_main', title: 'LAYANAN UTAMA', isPrimaryCategory: true, items: submenus }];
  }

  const groups = [];
  if (groupA.length > 0) groups.push({ id: 'group_a', title: 'LAYANAN & OPERASIONAL', isPrimaryCategory: true, items: groupA });
  if (groupB.length > 0) groups.push({ id: 'group_b', title: 'PENCATATAN & REKAM DATA', isPrimaryCategory: true, items: groupB });
  if (groupC.length > 0) groups.push({ id: 'group_c', title: 'PENGATURAN & KELOLA', isPrimaryCategory: false, items: groupC });

  return groups.length > 0 ? groups : [{ id: 'group_fallback', title: 'MENU & FITUR', isPrimaryCategory: true, items: submenus }];
}

export default function ModuleLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  
  // Context-Aware Sidebar state: 'focus' hides secondary clutter for medical tasks, 'all' reveals all
  const [focusMode, setFocusMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('myitaru_sidebar_focus_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Category Accordion State
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const { hasAccess, currentUser } = useAuth();
  const { moduleId: paramModuleId } = useParams();

  useEffect(() => {
    localStorage.setItem('myitaru_sidebar_focus_mode', JSON.stringify(focusMode));
  }, [focusMode]);

  // Extract module ID from URL (e.g. /modul/pendaftaran -> pendaftaran)
  const pathParts = location.pathname.split('/');
  const moduleId = paramModuleId || pathParts[pathParts.length - 1];

  // Role-based module access check
  const hasModuleAccess = !moduleId || !currentUser || hasAccess(moduleId);

  // Proteksi: jika user tidak punya akses, redirect ke dashboard
  useEffect(() => {
    if (moduleId && currentUser) {
      if (!hasAccess(moduleId)) {
        toast.error('Anda tidak memiliki akses ke modul ini');
        navigate('/dashboard');
      }
    }
  }, [moduleId, currentUser, navigate, hasAccess]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const hasOpenModal = document.querySelector('[role="dialog"]') !== null || 
                             document.querySelector('.fixed.inset-0:not(.top-navbar-overlay)') !== null;
        if (!hasOpenModal) {
          navigate('/dashboard');
        }
      }
      // Keyboard shortcut: Shift+F to toggle Clinical Focus Mode
      if (e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        e.preventDefault();
        setFocusMode(prev => {
          const next = !prev;
          toast.success(next ? 'Mode Fokus Klinis Diaktifkan (Menu sekunder disembunyikan)' : 'Mode Lengkap Diaktifkan (Semua menu ditampilkan)');
          return next;
        });
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

  // Grouped submenus for RME sidebar layout
  const rawSidebarGroups = useMemo(() => {
    return groupSubmenus(moduleId, config.submenus || [], activeTab);
  }, [moduleId, config.submenus, activeTab]);

  // Context-aware filtered submenus & groups
  const { sidebarGroups, totalHiddenCount, hasSecondaryItems } = useMemo(() => {
    let hiddenCount = 0;
    let foundSecondary = false;

    const filtered = rawSidebarGroups.map(group => {
      // Filter by search text first
      let items = group.items;
      if (sidebarSearch.trim()) {
        items = items.filter((sub: any) => {
          const label = typeof sub === 'string' ? sub : sub.label;
          return label.toLowerCase().includes(sidebarSearch.toLowerCase());
        });
      }

      // If search is active or focusMode is off, show all matching items
      if (sidebarSearch.trim() || !focusMode) {
        return {
          ...group,
          items: items.map((sub: any) => {
            const label = typeof sub === 'string' ? sub : sub.label;
            const isSec = isSecondaryItem(label, moduleId, activeTab);
            if (isSec) foundSecondary = true;
            return { raw: sub, label, isSecondary: isSec };
          })
        };
      }

      // Under Focus Mode, hide secondary items unless they are the currently active tab
      const mapped = items.map((sub: any) => {
        const label = typeof sub === 'string' ? sub : sub.label;
        const isSec = isSecondaryItem(label, moduleId, activeTab);
        if (isSec) foundSecondary = true;
        return { raw: sub, label, isSecondary: isSec };
      });

      const visibleItems = mapped.filter((item: any) => !item.isSecondary || item.label === activeTab);
      hiddenCount += (mapped.length - visibleItems.length);

      return {
        ...group,
        items: visibleItems
      };
    }).filter(group => group.items.length > 0);

    return { 
      sidebarGroups: filtered, 
      totalHiddenCount: hiddenCount, 
      hasSecondaryItems: foundSecondary 
    };
  }, [rawSidebarGroups, sidebarSearch, focusMode, moduleId, activeTab]);

  // Mobile horizontal submenu items
  const mobileSubmenus = useMemo(() => {
    if (!config.submenus) return [];
    if (!sidebarSearch.trim()) return config.submenus;
    return config.submenus.filter((sub: any) => {
      const label = typeof sub === 'string' ? sub : sub.label;
      return label.toLowerCase().includes(sidebarSearch.toLowerCase());
    });
  }, [config.submenus, sidebarSearch]);

  const toggleCategory = (groupId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col w-full text-slate-900 dark:text-slate-200 transition-colors">
      
      {/* 1. NAVBAR (TOP) */}
      <TopNavbar />

      {/* Konten Utama */}
      <main className="flex-1 w-full relative pb-10 flex flex-col max-w-[1700px] mx-auto px-3 sm:px-5 lg:px-6 pt-4">
        
        {/* 2. BREADCRUMB & HEADER BAR */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-xs">
          <nav className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-bold flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80"
            >
              <Home className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Dashboard</span>
            </button>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            {category && (
              <>
                <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                  <span>{category.icon}</span> {category.label}
                </span>
                <span className="text-slate-400 dark:text-slate-600">/</span>
              </>
            )}
            <span className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
              <span>{config.icon}</span> {config.label}
            </span>
            {hasSubmenus && activeTab && (
              <>
                <span className="text-slate-400 dark:text-slate-600">/</span>
                <span className="text-blue-700 dark:text-cyan-300 font-semibold px-2 py-0.5 bg-blue-50 dark:bg-cyan-950/60 rounded-md border border-blue-200 dark:border-cyan-800/60">
                  {activeTab}
                </span>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {/* Quick Context-Aware Focus Mode Button in Header */}
            {hasSubmenus && hasSecondaryItems && (
              <button
                onClick={() => {
                  setFocusMode(!focusMode);
                  toast.success(!focusMode ? 'Mode Fokus Aktif (Menu sekunder disembunyikan)' : 'Menampilkan semua menu');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  focusMode
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border-blue-200 dark:border-blue-800/60 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                title="Tekan Shift+F untuk beralih mode fokus kerja medis"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                <span className="hidden sm:inline">{focusMode ? 'Fokus Medis' : 'Semua Menu'}</span>
                {focusMode && totalHiddenCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] bg-blue-200/60 dark:bg-cyan-900/80 text-blue-900 dark:text-cyan-200 rounded-full font-mono">
                    -{totalHiddenCount}
                  </span>
                )}
              </button>
            )}

            {/* Quick Blueprint Button */}
            <button
              onClick={() => navigate('/modul/blueprint')}
              className="flex items-center gap-1.5 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Buka Blueprint Evaluasi & Pengembangan Aplikasi"
            >
              <span>🗺️</span>
              <span className="hidden sm:inline">Blueprint</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
          </div>
        </div>

        {/* MOBILE SUBMENU HORIZONTAL TAB BAR (Visible on < lg screens) */}
        {hasSubmenus && (
          <div className="lg:hidden mb-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-xs space-y-2">
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span>{config.icon}</span>
                <span>Menu Modul</span>
              </span>
              {hasSecondaryItems && (
                <button
                  onClick={() => setFocusMode(!focusMode)}
                  className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{focusMode ? 'Tampilkan Semua' : 'Mode Fokus'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {mobileSubmenus.map((sub: any) => {
                const label = typeof sub === 'string' ? sub : sub.label;
                const isSec = isSecondaryItem(label, moduleId, activeTab);
                if (focusMode && isSec && label !== activeTab && !sidebarSearch.trim()) {
                  return null;
                }

                const isActive = activeTab === label;
                const IconComponent = getSubmenuIcon(label);

                return (
                  <button
                    key={label}
                    onClick={() => setSearchParams({ tab: label })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5 shrink-0" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. LAYOUT CONTAINER (DESKTOP SIDEBAR + CONTENT OUTLET) */}
        <div className="flex flex-col lg:flex-row gap-4 items-start w-full flex-1">
          
          {/* RME-STYLE COLLAPSIBLE SIDEBAR (Hidden on mobile, uses sticky scroller above) */}
          {hasSubmenus && (
            <aside 
              className={`hidden lg:flex ${
                isSidebarCollapsed ? 'lg:w-20 overflow-visible' : 'lg:w-72 overflow-hidden'
              } bg-white dark:bg-[#0a1122] border border-slate-200 dark:border-slate-800 rounded-2xl flex-col shrink-0 transition-all duration-300 ease-in-out shadow-sm dark:shadow-2xl backdrop-blur-md self-stretch lg:self-auto sticky top-20 z-30`}
            >
              {/* SIDEBAR HEADER / IDENTITY CARD */}
              <div className={`p-3.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center ${isSidebarCollapsed ? 'lg:justify-center' : 'justify-between'} transition-all duration-300 bg-slate-50/80 dark:bg-[#0B132B]/70`}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-[#14234b] border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 font-extrabold text-xl flex items-center justify-center shrink-0 shadow-inner">
                    {config.icon || '📋'}
                  </div>
                  {!isSidebarCollapsed && (
                    <div className="overflow-hidden transition-all duration-300">
                      <h2 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-tight truncate">{config.label}</h2>
                      <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-rose-950/40 border border-blue-200 dark:border-rose-900/60 text-blue-700 dark:text-rose-300 text-[10px] font-bold w-fit">
                        <ShieldAlert className="w-3 h-3 text-blue-500 dark:text-rose-400 shrink-0" />
                        <span className="truncate">{category?.label || 'Pelayanan Terintegrasi'}</span>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="hidden lg:flex p-1.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                  title={isSidebarCollapsed ? 'Perluas Navigasi' : 'Sempitkan Navigasi'}
                >
                  {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>

              {/* CONTEXT-AWARE CLINICAL FOCUS SWITCH (Visible when Expanded) */}
              {!isSidebarCollapsed && hasSecondaryItems && (
                <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800/80 bg-blue-50/50 dark:bg-slate-900/90 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                    <span>Fokus Tugas Medis</span>
                  </div>
                  <button
                    onClick={() => {
                      setFocusMode(!focusMode);
                      toast.success(!focusMode ? 'Mode Fokus Aktif (Menyembunyikan menu sekunder)' : 'Menampilkan semua menu');
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      focusMode ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                    title="Beralih Mode Fokus Klinis (Shift+F)"
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        focusMode ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              )}

              {/* QUICK SEARCH (When Expanded and more than 4 submenus) */}
              {!isSidebarCollapsed && config.submenus && config.submenus.length > 4 && (
                <div className="p-2.5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/60">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari menu modul..."
                      value={sidebarSearch}
                      onChange={(e) => setSidebarSearch(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1.5 bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* SUBMENU CATEGORIES & ITEMS WITH ACCORDION */}
              <div className={`flex-1 overflow-y-auto space-y-4 custom-scrollbar transition-all duration-300 ${isSidebarCollapsed ? 'p-2' : 'p-3'} max-h-[calc(100vh-250px)]`}>
                {sidebarGroups.map((group: any, gIdx: number) => {
                  const isCollapsed = Boolean(collapsedCategories[group.id || `group_${gIdx}`]);
                  const containsActiveTab = group.items.some((item: any) => item.label === activeTab);

                  return (
                    <div key={group.id || gIdx} className="space-y-1.5">
                      {!isSidebarCollapsed ? (
                        <button
                          type="button"
                          onClick={() => toggleCategory(group.id || `group_${gIdx}`)}
                          className="w-full flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2.5 pt-2 pb-0.5 hover:text-slate-700 dark:hover:text-slate-300 transition-colors group cursor-pointer"
                        >
                          <span className="truncate flex items-center gap-1.5">
                            {containsActiveTab && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                            {group.title}
                          </span>
                          <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`} />
                        </button>
                      ) : (
                        <div className="h-px bg-slate-200 dark:bg-slate-800/80 my-2 mx-1" />
                      )}

                      {(!isCollapsed || isSidebarCollapsed) && (
                        <div className="space-y-1">
                          {group.items.map((itemObj: any) => {
                            const label = itemObj.label;
                            const isActive = activeTab === label;
                            const IconComponent = getSubmenuIcon(label);

                            return (
                              <button
                                key={label}
                                onClick={() => setSearchParams({ tab: label })}
                                className={`group relative w-full flex items-center gap-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                  isSidebarCollapsed ? 'justify-center p-2' : 'px-2.5 py-2'
                                } ${
                                  isActive 
                                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800/50 shadow-xs' 
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                                }`}
                              >
                                {/* Active Indicator Bar */}
                                {isActive && !isSidebarCollapsed && (
                                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-500 rounded-r-full shadow-sm shadow-blue-500/50" />
                                )}

                                {/* Menu Icon with dedicated rounded container */}
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                                  isActive
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                                    : 'bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 group-hover:text-blue-600 dark:group-hover:text-blue-300 group-hover:border-slate-300 dark:group-hover:border-slate-600 group-hover:scale-105'
                                }`}>
                                  <IconComponent className="w-4 h-4 transition-transform duration-200" />
                                </div>

                                {/* Text Label */}
                                {!isSidebarCollapsed && (
                                  <>
                                    <span className="text-left truncate flex-1 leading-snug">{label}</span>
                                    <ChevronRight className={`w-3 h-3 ml-auto transition-transform duration-200 ${isActive ? 'opacity-100 text-blue-600 dark:text-blue-400 translate-x-0.5' : 'opacity-20 group-hover:opacity-70 group-hover:translate-x-0.5'}`} />
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
                      )}
                    </div>
                  );
                })}

                {/* HIDDEN SECONDARY ITEMS NOTICE BANNER (IN FOCUS MODE) */}
                {!isSidebarCollapsed && focusMode && totalHiddenCount > 0 && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-1.5 mt-2">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {totalHiddenCount} menu sekunder disembunyikan
                    </p>
                    <button
                      onClick={() => setFocusMode(false)}
                      className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold transition-all shadow-2xs"
                    >
                      Buka Semua Menu
                    </button>
                  </div>
                )}
              </div>

              {/* SIDEBAR FOOTER */}
              {!isSidebarCollapsed && (
                <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#0B132B]/50 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>MYITARU SIMK</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">v1.0.0</span>
                </div>
              )}
            </aside>
          )}

          {/* CONTENT AREA (OUTLET) */}
          <div className="flex-1 min-w-0 w-full bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm dark:shadow-2xl relative min-h-[calc(100vh-160px)] flex flex-col">
            <Outlet context={{ activeTab }} />
          </div>

        </div>

      </main>

    </div>
  );
}


