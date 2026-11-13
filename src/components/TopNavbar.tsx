import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MODULE_REGISTRY } from '../data/moduleRegistry';
import { useAuth } from '../contexts/AuthContext';
import { useHospital } from '../contexts/HospitalContext';
import UserMenu from './UserMenu';
import { 
  Activity, 
  Globe, 
  Sparkles, 
  QrCode, 
  Brain, 
  Search, 
  ChevronDown, 
  Layers, 
  Command, 
  ChevronRight,
  Menu,
  X,
  Stethoscope,
  HeartPulse,
  Flame,
  LayoutGrid,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Mic,
  Pill,
  FileText,
  ScanLine,
  ShieldAlert,
  FileCheck,
  TrendingUp,
  FlaskConical,
  FileSignature,
  Cpu,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { MedicalSearchGrounding } from './MedicalSearchGrounding';
import { PatientQRScannerModal } from './RME/PatientQRScannerModal';
import ClinicalDecisionSupportWidget from './ClinicalDecisionSupportWidget';
import { SmartVoiceReport } from './RME/SmartVoiceReport';
import NotificationBell from './NotificationBell';

interface TopNavbarProps {
  currentTime?: Date;
}

export default function TopNavbar({ currentTime }: TopNavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasAccess } = useAuth();
  const { hospitalSettings } = useHospital();

  // State Management
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('pelayanan');
  const [menuSearchQuery, setMenuSearchQuery] = useState('');
  
  const [showAISuiteMenu, setShowAISuiteMenu] = useState(false);
  const [aiCategoryFilter, setAiCategoryFilter] = useState<'all' | 'klinis' | 'voice' | 'farmasi' | 'bpjs' | 'utilitas'>('all');
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showCDSSModal, setShowCDSSModal] = useState(false);
  const [showVoiceScribeModal, setShowVoiceScribeModal] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const aiSuiteRef = useRef<HTMLDivElement>(null);

  // Filter modules based on user authorization
  const accessibleCategories = useMemo(() => {
    return MODULE_REGISTRY.map(cat => {
      const allowedModules = cat.modules.filter(mod => hasAccess(mod.id));
      return {
        ...cat,
        modules: allowedModules
      };
    }).filter(cat => cat.modules.length > 0);
  }, [hasAccess]);

  // Set default selected category tab if current is empty
  useEffect(() => {
    if (accessibleCategories.length > 0 && !accessibleCategories.some(c => c.id === selectedCategoryTab)) {
      setSelectedCategoryTab(accessibleCategories[0].id);
    }
  }, [accessibleCategories, selectedCategoryTab]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setShowMegaMenu(false);
      }
      if (aiSuiteRef.current && !aiSuiteRef.current.contains(e.target as Node)) {
        setShowAISuiteMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setShowMegaMenu(false);
    setShowAISuiteMenu(false);
    setShowMobileDrawer(false);
  }, [location.pathname]);

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  // Direct fast links for top clinical workflows
  const quickDirectLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { label: 'Rawat Jalan', path: '/modul/rawat-jalan', icon: Stethoscope },
    { label: 'IGD', path: '/modul/igd', icon: Flame },
    { label: 'Rawat Inap', path: '/modul/rawat-inap', icon: HeartPulse },
    { label: 'RME Pasien', path: '/modul/rekam-medis', icon: Activity }
  ];

  // Comprehensive Catalog of all AI & Intelligent Capabilities across MYITARU
  const ALL_AI_TOOLS = useMemo(() => [
    {
      id: 'ai_cdss',
      title: 'AI CDSS & ICD-10 Assistant',
      category: 'klinis' as const,
      categoryLabel: 'Diagnostik Klinis',
      badge: 'CDSS AI',
      badgeColor: 'bg-cyan-900/50 text-cyan-300 border-cyan-700/60',
      icon: Brain,
      iconBg: 'bg-indigo-950/80 border-indigo-500/40 text-cyan-300',
      description: 'Rekomendasi diagnosis diferensial, severity index, & kalkulator NEWS-2',
      action: () => {
        setShowCDSSModal(true);
        setShowAISuiteMenu(false);
      }
    },
    {
      id: 'ai_voice_scribe',
      title: 'AI Ambient Voice Scribe (SOAP)',
      category: 'voice' as const,
      categoryLabel: 'Suara & EMR',
      badge: 'Voice AI',
      badgeColor: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/60',
      icon: Mic,
      iconBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
      description: 'Dikte suara percakapan dokter-pasien terkonversi otomatis ke format SOAP',
      action: () => {
        setShowVoiceScribeModal(true);
        setShowAISuiteMenu(false);
      }
    },
    {
      id: 'ai_search_grounding',
      title: 'Live Search Medical Grounding',
      category: 'klinis' as const,
      categoryLabel: 'Diagnostik Klinis',
      badge: 'Google Web',
      badgeColor: 'bg-amber-900/50 text-amber-300 border-amber-700/60',
      icon: Globe,
      iconBg: 'bg-[#0F3254] border-[#C9A94E]/40 text-[#E8D49E]',
      description: 'Pencarian literatur medis terkini & guideline evidence-based medicine',
      action: () => {
        setShowSearchModal(true);
        setShowAISuiteMenu(false);
      }
    },
    {
      id: 'ai_drug_checker',
      title: 'AI Pharmacovigilance & Interaksi Obat',
      category: 'farmasi' as const,
      categoryLabel: 'Farmasi & Safety',
      badge: 'Safety AI',
      badgeColor: 'bg-purple-900/50 text-purple-300 border-purple-700/60',
      icon: Pill,
      iconBg: 'bg-purple-950/80 border-purple-500/40 text-purple-300',
      description: 'Deteksi otomatis interaksi obat berisiko, polifarmasi, & penyesuaian dosis',
      action: () => {
        navigate('/modul/apotek-ralan?tab=Resep+%26+Antrian+Ralan');
        setShowAISuiteMenu(false);
      }
    },
    {
      id: 'ai_bpjs_auditor',
      title: 'AI BPJS Pre-Auditor & INA-CBGs',
      category: 'bpjs' as const,
      categoryLabel: 'Klaim & Casemix',
      badge: 'Casemix AI',
      badgeColor: 'bg-blue-900/50 text-blue-300 border-blue-700/60',
      icon: ShieldCheck,
      iconBg: 'bg-blue-950/80 border-blue-500/40 text-blue-300',
      description: 'Validasi kelayakan klaim, kesesuaian diagnosis, & pencegahan dispute BPJS',
      action: () => {
        navigate('/modul/bpjs-klaim?tab=AI+Validator');
        setShowAISuiteMenu(false);
      }
    },
    {
      id: 'ai_klpcm_audit',
      title: 'AI Audit Kelengkapan RM (KLPCM)',
      category: 'voice' as const,
      categoryLabel: 'Suara & EMR',
      badge: 'Audit AI',
      badgeColor: 'bg-rose-900/50 text-rose-300 border-rose-700/60',
      icon: FileCheck,
      iconBg: 'bg-rose-950/80 border-rose-500/40 text-rose-300',
      description: 'Skrining berkas inkomplit 1x24 jam & kepatuhan regulasi akreditasi',
      action: () => {
        navigate('/modul/rekam-medis?tab=Audit+KLPCM');
        setShowAISuiteMenu(false);
      }
    },
    {
      id: 'ai_radiology_analyzer',
      title: 'AI Radiologi & Analisis Citra PACS',
      category: 'klinis' as const,
      categoryLabel: 'Diagnostik Klinis',
      badge: 'Vision AI',
      badgeColor: 'bg-indigo-900/50 text-indigo-300 border-indigo-700/60',
      icon: ScanLine,
      iconBg: 'bg-indigo-950/80 border-indigo-500/40 text-indigo-300',
      description: 'Deteksi kelainan citra rontgen/CT & asistensi pembacaan radiolog cepat',
      action: () => {
        navigate('/modul/radiologi?tab=Worklist+%26+Permintaan');
        setShowAISuiteMenu(false);
      }
    },
    {
      id: 'ai_triase_earlywarning',
      title: 'AI Triase & Early Warning (NEWS-2)',
      category: 'klinis' as const,
      categoryLabel: 'Diagnostik Klinis',
      badge: 'Triage AI',
      badgeColor: 'bg-red-900/50 text-red-300 border-red-700/60',
      icon: Flame,
      iconBg: 'bg-red-950/80 border-red-500/40 text-red-300',
      description: 'Skrining prioritas gawat darurat & peringatan dini perburukan tanda vital',
      action: () => {
        navigate('/modul/igd');
        setShowAISuiteMenu(false);
      }
    },
    {
      id: 'ai_icd_coder',
      title: 'AI Semantic Coder ICD-10 & ICD-9',
      category: 'voice' as const,
      categoryLabel: 'Suara & EMR',
      badge: 'NLP Coder',
      badgeColor: 'bg-teal-900/50 text-teal-300 border-teal-700/60',
      icon: FileText,
      iconBg: 'bg-teal-950/80 border-teal-500/40 text-teal-300',
      description: 'Kodifikasi diagnosis dan prosedur medis cepat berbasis kecerdasan semantik',
      action: () => {
        navigate('/modul/rekam-medis?tab=ICD-10+Diagnosis');
        setShowAISuiteMenu(false);
      }
    },
    {
      id: 'ai_resume_medis',
      title: 'AI Resume Medis & Ringkasan Pulang',
      category: 'voice' as const,
      categoryLabel: 'Suara & EMR',
      badge: 'Smart EMR',
      badgeColor: 'bg-cyan-900/50 text-cyan-300 border-cyan-700/60',
      icon: FileSignature,
      iconBg: 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300',
      description: 'Sintesis otomatis riwayat rawat, terapi, dan anjuran kepulangan pasien',
      action: () => {
        navigate('/modul/rekam-medis?tab=Resume+Medis');
        setShowAISuiteMenu(false);
      }
    },
    {
      id: 'ai_patient_safety_rca',
      title: 'AI Patient Safety & Fishbone RCA',
      category: 'farmasi' as const,
      categoryLabel: 'Farmasi & Safety',
      badge: 'Risk AI',
      badgeColor: 'bg-amber-900/50 text-amber-300 border-amber-700/60',
      icon: ShieldAlert,
      iconBg: 'bg-amber-950/80 border-amber-500/40 text-amber-300',
      description: 'Investigasi insiden keselamatan pasien dengan otomatisasi diagram Ishikawa',
      action: () => {
        navigate('/modul/mutu?tab=Patient+Safety&subtab=investigation');
        setShowAISuiteMenu(false);
      }
    },
    {
      id: 'ai_pathway_variance',
      title: 'AI Clinical Pathway & Variansi LOS',
      category: 'farmasi' as const,
      categoryLabel: 'Farmasi & Safety',
      badge: 'Pathway AI',
      badgeColor: 'bg-blue-900/50 text-blue-300 border-blue-700/60',
      icon: Activity,
      iconBg: 'bg-blue-950/80 border-blue-500/40 text-blue-300',
      description: 'Evaluasi kepatuhan alur klinis dan deteksi deviasi lama rawat inap (LOS)',
      action: () => {
        navigate('/modul/mutu?tab=Clinical+Pathway&subtab=variance');
        setShowAISuiteMenu(false);
      }
    },
    {
      id: 'ai_bed_capacity',
      title: 'AI Prediksi BOR & Kapasitas Ranap',
      category: 'bpjs' as const,
      categoryLabel: 'Klaim & Casemix',
      badge: 'Forecast AI',
      badgeColor: 'bg-violet-900/50 text-violet-300 border-violet-700/60',
      icon: TrendingUp,
      iconBg: 'bg-violet-950/80 border-violet-500/40 text-violet-300',
      description: 'Prediksi keterisian tempat tidur, lonjakan poliklinik, dan discharge planner',
      action: () => {
        navigate('/modul/rawat-inap');
        setShowAISuiteMenu(false);
      }
    },
    {
      id: 'tool_qr_scanner',
      title: 'Scan QR Berkas RM Fisik (Kamera)',
      category: 'utilitas' as const,
      categoryLabel: 'Utilitas Scanner',
      badge: 'Kamera Scanner',
      badgeColor: 'bg-emerald-900/50 text-emerald-300 border-emerald-700/60',
      icon: QrCode,
      iconBg: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
      description: 'Buka rekam medis pasien instan dari pemindaian barcode / QR dokumen fisik',
      action: () => {
        setShowQRScanner(true);
        setShowAISuiteMenu(false);
      }
    }
  ], [navigate]);

  const filteredAITools = useMemo(() => {
    return ALL_AI_TOOLS.filter(tool => {
      const matchCategory = aiCategoryFilter === 'all' || tool.category === aiCategoryFilter;
      const matchSearch = !aiSearchQuery.trim() || 
        tool.title.toLowerCase().includes(aiSearchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(aiSearchQuery.toLowerCase()) ||
        tool.badge.toLowerCase().includes(aiSearchQuery.toLowerCase()) ||
        tool.categoryLabel.toLowerCase().includes(aiSearchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [ALL_AI_TOOLS, aiCategoryFilter, aiSearchQuery]);

  // Active Category in Mega Menu
  const activeCategory = accessibleCategories.find(c => c.id === selectedCategoryTab) || accessibleCategories[0];

  // Filtered modules for search inside mega menu
  const searchResults = useMemo(() => {
    if (!menuSearchQuery.trim()) return null;
    const query = menuSearchQuery.toLowerCase();
    const results: Array<{ category: string; module: any }> = [];

    accessibleCategories.forEach(cat => {
      cat.modules.forEach(mod => {
        const matchLabel = mod.label.toLowerCase().includes(query);
        const matchSubmenu = mod.submenus?.some((s: any) => {
          const sLabel = typeof s === 'string' ? s : s.label;
          return sLabel.toLowerCase().includes(query);
        });

        if (matchLabel || matchSubmenu) {
          results.push({ category: cat.label, module: mod });
        }
      });
    });
    return results;
  }, [menuSearchQuery, accessibleCategories]);

  return (
    <header className="bg-[#08121E]/95 backdrop-blur-xl border-b border-[#C9A94E]/25 shadow-[0_10px_35px_rgba(0,0,0,0.5)] sticky top-0 z-50 transition-all">
      {/* Top Brushed Gold Hairline Highlight */}
      <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-[#E8D49E]/70 to-transparent"></div>

      <div className="flex items-center justify-between px-4 sm:px-6 max-w-[1700px] mx-auto h-[66px] gap-3">
        
        {/* ========================================================================= */}
        {/* 1. KIRI: BRANDING & LOGO                                                  */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A94E]/50 rounded-xl p-1 -m-1 transition-all"
            title="Kembali ke Dashboard Utama"
          >
            {/* Logo Emblem with Ambient Backlight */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#C9A94E]/30 to-cyan-500/20 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#102A4A] via-[#0C1F38] to-[#163B66] border border-[#C9A94E]/40 p-1 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-[#E8D49E] transition-all">
                {hospitalSettings?.logoUrl ? (
                  <img 
                    src={hospitalSettings.logoUrl} 
                    alt="Logo RS" 
                    className="w-full h-full object-contain rounded-lg" 
                  />
                ) : (
                  <Activity className="text-[#E8D49E] w-5 h-5 drop-shadow-[0_2px_8px_rgba(201,169,78,0.5)]" />
                )}
              </div>
            </div>

            {/* Klinik Name */}
            <div className="hidden sm:block">
              <h1 className="text-base font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#E8D49E] leading-tight whitespace-nowrap">
                {hospitalSettings?.name || 'MYITARU SIMK'}
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium truncate max-w-[200px]">
                {hospitalSettings?.subname || 'Smart Klinik Suite'}
              </p>
            </div>
          </button>

          {/* Mega Menu Launcher Button */}
          <div className="relative hidden md:block shrink-0" ref={megaMenuRef}>
            <button
              onClick={() => setShowMegaMenu(!showMegaMenu)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-sm whitespace-nowrap shrink-0 ${
                showMegaMenu
                  ? 'bg-gradient-to-r from-[#173A63] to-[#1B4677] text-white border-[#E8D49E] shadow-[0_0_15px_rgba(201,169,78,0.25)]'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 hover:text-white border-white/10 hover:border-[#C9A94E]/40'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#E8D49E] shrink-0" />
              <span>Direktori Modul</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${showMegaMenu ? 'rotate-180 text-[#E8D49E]' : ''}`} />
            </button>

            {/* ========================================================================= */}
            {/* MEGA MENU MODAL / FLYOUT (LUXURY GLASS ARCHITECTURE)                      */}
            {/* ========================================================================= */}
            {showMegaMenu && (
              <div className="absolute top-full left-0 mt-3 w-[720px] max-w-[90vw] bg-[#0A1627]/98 border border-[#C9A94E]/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 backdrop-blur-2xl overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                {/* Mega Menu Top Header */}
                <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#C9A94E]/15 border border-[#C9A94E]/30 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#E8D49E]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Direktori Layanan & Modul RS</h3>
                      <p className="text-[11px] text-slate-400">Pilih departemen klinis, penunjang, atau modul manajemen</p>
                    </div>
                  </div>

                  {/* Filter inside Mega Menu */}
                  <div className="relative w-56">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari modul / submenu..."
                      value={menuSearchQuery}
                      onChange={(e) => setMenuSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/[0.05] border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[#C9A94E] transition-all"
                    />
                  </div>
                </div>

                {/* Content: Search results OR Category Tabs */}
                {searchResults ? (
                  <div className="p-4 max-h-[420px] overflow-y-auto">
                    <p className="text-[11px] text-[#E8D49E] font-semibold mb-3">
                      Ditemukan {searchResults.length} modul untuk "{menuSearchQuery}":
                    </p>
                    {searchResults.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-xs">
                        Tidak ada modul yang sesuai dengan kata kunci pencarian.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2.5">
                        {searchResults.map(({ category, module: mod }) => (
                          <button
                            key={mod.id}
                            onClick={() => {
                              navigate(`/modul/${mod.id}`);
                              setShowMegaMenu(false);
                            }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[#C9A94E]/40 text-left transition-all group"
                          >
                            <span className="text-xl p-2 rounded-lg bg-white/[0.05] border border-white/10 group-hover:scale-110 transition-transform">
                              {mod.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="text-xs font-bold text-white group-hover:text-[#E8D49E] transition-colors truncate">
                                  {mod.label}
                                </h4>
                                <span className="text-[9px] text-slate-400 uppercase tracking-wider">{category}</span>
                              </div>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {mod.submenus?.length ? `${mod.submenus.length} Sub-layanan` : 'Akses Langsung'}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-[380px]">
                    {/* Left category selector */}
                    <div className="w-48 border-r border-white/10 p-2 space-y-1 bg-black/20 overflow-y-auto">
                      {accessibleCategories.map(cat => {
                        const isSelected = selectedCategoryTab === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategoryTab(cat.id)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#1A4372] to-[#122E50] text-white border border-[#C9A94E]/40 shadow-sm'
                                : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span className="text-sm">{cat.icon}</span>
                              <span className="truncate">{cat.label}</span>
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300 font-mono">
                              {cat.modules.length}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Module List for Selected Category */}
                    <div className="flex-1 p-4 overflow-y-auto max-h-[380px]">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                        <span className="text-xs font-bold text-[#E8D49E] uppercase tracking-wider flex items-center gap-1.5">
                          <span>{activeCategory?.icon}</span>
                          <span>Departemen {activeCategory?.label}</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Klik modul untuk membuka halaman</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        {activeCategory?.modules.map(mod => (
                          <div
                            key={mod.id}
                            className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[#C9A94E]/40 transition-all flex flex-col justify-between group"
                          >
                            <div className="flex items-center gap-2.5 mb-2">
                              <span className="text-lg p-1.5 rounded-lg bg-white/[0.05] border border-white/10">
                                {mod.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-white group-hover:text-[#E8D49E] transition-colors truncate">
                                  {mod.label}
                                </h4>
                                <span className="text-[10px] text-slate-400">
                                  {mod.submenus?.length ? `${mod.submenus.length} Menu` : 'Modul Utama'}
                                </span>
                              </div>
                            </div>

                            {/* Submenu Pills */}
                            {mod.submenus && mod.submenus.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {mod.submenus.slice(0, 3).map((sub: any) => {
                                  const subLabel = typeof sub === 'string' ? sub : sub.label;
                                  return (
                                    <button
                                      key={subLabel}
                                      onClick={() => {
                                        navigate(`/modul/${mod.id}?tab=${encodeURIComponent(subLabel)}`);
                                        setShowMegaMenu(false);
                                      }}
                                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-[#C9A94E]/20 text-slate-300 hover:text-[#E8D49E] border border-white/5 transition-colors truncate max-w-[130px]"
                                    >
                                      {subLabel}
                                    </button>
                                  );
                                })}
                                {mod.submenus.length > 3 && (
                                  <button
                                    onClick={() => {
                                      navigate(`/modul/${mod.id}`);
                                      setShowMegaMenu(false);
                                    }}
                                    className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-[#E8D49E] hover:underline"
                                  >
                                    +{mod.submenus.length - 3} lagi
                                  </button>
                                )}
                              </div>
                            )}

                            <button
                              onClick={() => {
                                navigate(`/modul/${mod.id}`);
                                setShowMegaMenu(false);
                              }}
                              className="mt-2.5 w-full flex items-center justify-between text-[11px] font-semibold text-cyan-400 group-hover:text-[#E8D49E] transition-colors pt-2 border-t border-white/5"
                            >
                              <span>Buka Modul</span>
                              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mega Menu Footer with Fast Hint */}
                <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-300">Pintasan Cepat:</span>
                    <button 
                      onClick={openCommandPalette} 
                      className="text-[#E8D49E] hover:underline flex items-center gap-1 font-mono"
                    >
                      <Command className="w-3 h-3" /> Tekan Ctrl + K untuk pencarian global
                    </button>
                  </div>
                  <button
                    onClick={() => setShowMegaMenu(false)}
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    Tutup [ESC]
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TENGAH: CURATED DIRECT LINKS & SLEEK SEARCH BAR                        */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex items-center gap-2 flex-1 justify-center max-w-2xl mx-auto">
          {/* Quick Direct Links (Paling Sering Digunakan) */}
          <nav className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/[0.07] backdrop-blur-md shrink-0">
            {quickDirectLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all relative whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#183F6D] to-[#123157] text-white shadow-sm border border-[#C9A94E]/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#E8D49E]' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Unified Smart Omnisearch Trigger (Command Bar Style) */}
          <button
            onClick={openCommandPalette}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 hover:border-[#C9A94E]/40 text-xs font-medium transition-all shadow-inner group whitespace-nowrap shrink-0"
            title="Buka Command Palette (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#E8D49E] transition-colors shrink-0" />
            <span className="hidden xl:inline text-slate-400 group-hover:text-slate-200">Cari pasien / aksi...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/40 text-[#E8D49E] border border-white/10">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 3. KANAN: AI CLINICAL SUITE HUB + NOTIF + USER PROFILE                    */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Unified AI & Clinical Tools Dropdown Hub */}
          <div className="relative" ref={aiSuiteRef}>
            <button
              onClick={() => setShowAISuiteMenu(!showAISuiteMenu)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm whitespace-nowrap shrink-0 ${
                showAISuiteMenu
                  ? 'bg-gradient-to-r from-[#16365D] via-[#1C4373] to-[#102A4A] text-white border-[#C9A94E]/60 shadow-[0_0_15px_rgba(201,169,78,0.25)]'
                  : 'bg-gradient-to-r from-white/[0.05] to-white/[0.02] hover:bg-white/[0.08] text-white border-white/10 hover:border-[#C9A94E]/45'
              }`}
              title="Akses Alat Kecerdasan Klinis AI & Diagnostik Cepat"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E8D49E] shrink-0" />
              <span className="hidden sm:inline bg-gradient-to-r from-[#E8D49E] via-white to-cyan-200 bg-clip-text text-transparent">
                AI & Tools
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform shrink-0 ${showAISuiteMenu ? 'rotate-180 text-[#E8D49E]' : ''}`} />
            </button>

            {/* AI Tools Luxury Dropdown Palette */}
            {showAISuiteMenu && (
              <div className="absolute right-0 mt-3 w-[360px] sm:w-[480px] bg-[#0B1728]/98 border border-[#C9A94E]/30 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-50 backdrop-blur-2xl p-3 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* AI Suite Header */}
                <div className="px-2 py-2 border-b border-white/10 mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#183F6D] to-[#C9A94E] flex items-center justify-center shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span className="bg-gradient-to-r from-[#E8D49E] via-white to-cyan-200 bg-clip-text text-transparent">
                          MYITARU AI Suite
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">({ALL_AI_TOOLS.length} Kecerdasan)</span>
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950/50 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                    Siap Pakai
                  </span>
                </div>

                {/* Search Bar for AI Tools */}
                <div className="px-1 mb-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari fitur AI (suara, diagnosa, obat, klaim, triage)..."
                      value={aiSearchQuery}
                      onChange={(e) => setAiSearchQuery(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-400/50"
                    />
                    {aiSearchQuery && (
                      <button
                        onClick={() => setAiSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-2 px-1 mb-1 custom-scrollbar">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'klinis', label: 'Diagnostik' },
                    { id: 'voice', label: 'Suara & EMR' },
                    { id: 'farmasi', label: 'Farmasi & Safety' },
                    { id: 'bpjs', label: 'BPJS & Prediksi' },
                    { id: 'utilitas', label: 'Utilitas' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setAiCategoryFilter(tab.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                        aiCategoryFilter === tab.id
                          ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-xs border border-purple-400/50'
                          : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* AI Tools List Grid */}
                <div className="max-h-[360px] overflow-y-auto space-y-1.5 p-1 custom-scrollbar">
                  {filteredAITools.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Tidak ada fitur AI yang cocok dengan "{aiSearchQuery}"
                    </div>
                  ) : (
                    filteredAITools.map(tool => {
                      const IconComponent = tool.icon;
                      return (
                        <button
                          key={tool.id}
                          onClick={tool.action}
                          className="w-full flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.07] border border-white/5 hover:border-purple-400/30 text-left transition-all duration-200 group"
                        >
                          <div className={`w-8 h-8 rounded-lg ${tool.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                                {tool.title}
                              </h4>
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium border shrink-0 ${tool.badgeColor}`}>
                                {tool.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug">
                              {tool.description}
                            </p>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
                        </button>
                      );
                    })
                  )}
                </div>

                {/* AI Suite Footer */}
                <div className="mt-2 pt-2 border-t border-white/10 px-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>MYITARU Clinical AI Suite</span>
                  <button
                    onClick={() => {
                      setShowAISuiteMenu(false);
                      openCommandPalette();
                    }}
                    className="text-[#E8D49E] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>Omnibar (⌘K)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="p-0.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center">
            <NotificationBell />
          </div>

          {/* User Profile Capsule */}
          <UserMenu />

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setShowMobileDrawer(!showMobileDrawer)}
            className="lg:hidden p-2 rounded-xl bg-white/[0.05] border border-white/10 text-white hover:bg-white/10 transition-colors"
            title="Buka Navigasi Mobile"
          >
            {showMobileDrawer ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. MOBILE NAVIGATION DRAWER (REPLACING OLD UGLY SELECT BOX)               */}
      {/* ========================================================================= */}
      {showMobileDrawer && (
        <div className="lg:hidden fixed inset-x-0 top-[66px] bottom-0 bg-[#07111D]/95 backdrop-blur-2xl z-40 border-t border-[#C9A94E]/25 p-4 overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-4 max-w-lg mx-auto">
            {/* Quick Actions Bar */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setShowMobileDrawer(false);
                  openCommandPalette();
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs font-bold"
              >
                <Search className="w-4 h-4 text-[#E8D49E]" />
                <span>Pencarian (⌘K)</span>
              </button>
              <button
                onClick={() => {
                  setShowMobileDrawer(false);
                  setShowCDSSModal(true);
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/30 text-white text-xs font-bold"
              >
                <Brain className="w-4 h-4 text-cyan-300" />
                <span>AI CDSS</span>
              </button>
              <button
                onClick={() => {
                  setShowMobileDrawer(false);
                  setShowVoiceScribeModal(true);
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald-900/60 to-teal-900/60 border border-emerald-500/30 text-white text-xs font-bold"
              >
                <Mic className="w-4 h-4 text-emerald-300" />
                <span>Voice Scribe</span>
              </button>
              <button
                onClick={() => {
                  setShowMobileDrawer(false);
                  setShowQRScanner(true);
                }}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs font-bold"
              >
                <QrCode className="w-4 h-4 text-emerald-300" />
                <span>Scan QR RM</span>
              </button>
            </div>

            {/* AI Tools Quick Access Accordion on Mobile */}
            <div className="rounded-xl bg-gradient-to-br from-purple-950/40 to-indigo-950/40 border border-purple-500/30 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Kecerdasan Klinis AI ({ALL_AI_TOOLS.length})
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50 font-mono">
                  AKTIF
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                {ALL_AI_TOOLS.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setShowMobileDrawer(false);
                        tool.action();
                      }}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] hover:bg-white/10 text-left text-xs text-slate-200 transition-colors"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Icon className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                        <span className="truncate">{tool.title}</span>
                      </span>
                      <span className={`text-[8px] px-1.5 py-0.2 rounded border shrink-0 ${tool.badgeColor}`}>
                        {tool.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Categories Accordion */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Semua Modul & Departemen
              </h3>
              {accessibleCategories.map(cat => (
                <div key={cat.id} className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
                  <div className="p-3 bg-white/[0.03] font-bold text-xs text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{cat.modules.length} Modul</span>
                  </div>
                  <div className="p-2 grid grid-cols-1 gap-1">
                    {cat.modules.map(mod => (
                      <button
                        key={mod.id}
                        onClick={() => {
                          navigate(`/modul/${mod.id}`);
                          setShowMobileDrawer(false);
                        }}
                        className="flex items-center justify-between p-2 rounded-lg text-xs text-slate-200 hover:bg-white/10 hover:text-white text-left transition-colors"
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span>{mod.icon}</span>
                          <span className="truncate">{mod.label}</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODALS & POPUPS                                                        */}
      {/* ========================================================================= */}
      {showQRScanner && (
        <PatientQRScannerModal
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
          onPatientSelected={(selected) => {
            setShowQRScanner(false);
            navigate(`/modul/rekam-medis?tab=Daftar+Pasien&rm=${encodeURIComponent(selected.no_rm)}`);
          }}
        />
      )}

      {showSearchModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[120] flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
            <MedicalSearchGrounding
              isOpen={showSearchModal}
              onClose={() => setShowSearchModal(false)}
            />
          </div>
        </div>
      )}

      {showCDSSModal && (
        <ClinicalDecisionSupportWidget
          isOpen={showCDSSModal}
          onClose={() => setShowCDSSModal(false)}
          mode="modal"
        />
      )}

      {showVoiceScribeModal && (
        <SmartVoiceReport
          isOpen={showVoiceScribeModal}
          onClose={() => setShowVoiceScribeModal(false)}
        />
      )}
    </header>
  );
}
