import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, GripVertical, BrainCircuit, AlertTriangle, Activity, 
  Pill, ShieldAlert, RotateCcw, Settings2, CheckCircle2, 
  ArrowRight, ChevronDown, ChevronUp, Clock, RefreshCw,
  Layers, Check, Eye, HelpCircle, FileCheck, BedDouble, Stethoscope
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface AIInsightCardItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badgeColor: string;
  iconName: 'alert' | 'trend' | 'pill' | 'claim' | 'bed' | 'stewardship';
  accentBorder: string;
  bgGlow: string;
  metrics: { label: string; value: string; status?: 'normal' | 'warning' | 'critical' | 'info' }[];
  insights: { text: string; type: 'critical' | 'warning' | 'recommendation' | 'success' }[];
  actionLabel: string;
  actionRoute: string;
  lastUpdated: string;
}

const DEFAULT_INSIGHT_CARDS: AIInsightCardItem[] = [
  {
    id: 'triage_critical_monitor',
    title: 'Triase & Early Warning (NEWS-2)',
    subtitle: 'Pemantauan Skor Kritis & Deteksi Sepsis Dini',
    category: 'IGD & Ruang Kritis',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    iconName: 'alert',
    accentBorder: 'hover:border-rose-500/50',
    bgGlow: 'from-rose-500/10',
    metrics: [
      { label: 'Pasien High-Risk', value: '2 Kasus', status: 'critical' },
      { label: 'Rata-rata Triase', value: '3.8 Menit', status: 'normal' },
      { label: 'Kepatuhan EWS', value: '98.2%', status: 'info' }
    ],
    insights: [
      { text: 'Pasien Ny. Siti (RM-09122) NEWS-2: 7 (Takhikardia & Hipotensi). AI rekomendasikan skrining laktat & evaluasi sepsis bundle.', type: 'critical' },
      { text: 'Pasien Tn. Budi di Triase IGD menunjukkan desaturasi SpO2 89%. Dianjurkan kanul O2 4Lpm.', type: 'warning' }
    ],
    actionLabel: 'Buka Modul Triase IGD',
    actionRoute: '/modul/triase',
    lastUpdated: 'Baru saja'
  },
  {
    id: 'diagnostic_epidemic_forecast',
    title: 'Surveilans & Prediksi Epidemiologi',
    subtitle: 'Deteksi Kluster Penyakit Menular & Tren Poliklinik',
    category: 'Rawat Jalan & Litbang',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    iconName: 'trend',
    accentBorder: 'hover:border-amber-500/50',
    bgGlow: 'from-amber-500/10',
    metrics: [
      { label: 'Kasus ISPA', value: '+31% Pekan Ini', status: 'warning' },
      { label: 'Demam Dengue', value: '8 Terkonfirmasi', status: 'warning' },
      { label: 'Akurasi Prediksi', value: '94.6%', status: 'normal' }
    ],
    insights: [
      { text: 'Peningkatan kluster kasus demam berdarah di Wilayah Kelurahan Sukajadi. Siapkan cadangan RDT NS1 di Laboratorium.', type: 'warning' },
      { text: 'Kapasitas Poli Penyakit Dalam diproyeksikan melonjak 22% pada jam 09.00-11.30 esok hari.', type: 'recommendation' }
    ],
    actionLabel: 'Buka Poliklinik & Antrean',
    actionRoute: '/modul/poli',
    lastUpdated: '3 menit lalu'
  },
  {
    id: 'drug_interaction_safety',
    title: 'Pharmacovigilance & Interaksi Obat',
    subtitle: 'Skrining Kontraindikasi & Dosis Resep Elektronik',
    category: 'Farmasi & Patient Safety',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    iconName: 'pill',
    accentBorder: 'hover:border-purple-500/50',
    bgGlow: 'from-purple-500/10',
    metrics: [
      { label: 'Resep Di-scan', value: '184 R/', status: 'normal' },
      { label: 'Interaksi Dicegah', value: '3 Insiden', status: 'critical' },
      { label: 'Safety Index', value: '99.4%', status: 'normal' }
    ],
    insights: [
      { text: 'Interaksi signifikan terdeteksi: Clopidogrel + Omeprazole dapat menurunkan efek antiplatelet. Rekomendasikan Pantoprazole.', type: 'critical' },
      { text: 'Penyesuaian dosis Ciprofloxacin direkomendasikan pada pasien lansia dengan eGFR < 30 mL/min.', type: 'recommendation' }
    ],
    actionLabel: 'Buka Modul Farmasi & Obat',
    actionRoute: '/modul/apotek-ralan',
    lastUpdated: '1 menit lalu'
  },
  {
    id: 'bpjs_claims_readiness',
    title: 'AI Smart Coder & INA-CBGs Pre-Check',
    subtitle: 'Validasi Kelengkapan Resume Medis & Klaim BPJS',
    category: 'Casemix & Keuangan',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    iconName: 'claim',
    accentBorder: 'hover:border-emerald-500/50',
    bgGlow: 'from-emerald-500/10',
    metrics: [
      { label: 'Klaim Siap Kirim', value: '42 Berkas', status: 'normal' },
      { label: 'Potensi Dispute', value: '2 Berkas', status: 'warning' },
      { label: 'Kesesuaian Tarif', value: 'Rp 148.2 jt', status: 'normal' }
    ],
    insights: [
      { text: '2 klaim Rawat Inap bedah berisiko pending verifikasi: Laporan operasi belum dilampirkan tanda tangan digital dokter.', type: 'warning' },
      { text: 'Kesesuaian diagnosis sekunder ICD-10 dengan terapi penunjang terverifikasi 97.8% valid.', type: 'success' }
    ],
    actionLabel: 'Review Klaim BPJS & VClaim',
    actionRoute: '/modul/vclaim',
    lastUpdated: '5 menit lalu'
  },
  {
    id: 'bed_capacity_optimizer',
    title: 'Kapasitas Tempat Tidur & Discharge Predictor',
    subtitle: 'Optimalisasi BOR & Prediksi Pasien Pulang (KRS)',
    category: 'Rawat Inap & Manajemen Bed',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    iconName: 'bed',
    accentBorder: 'hover:border-blue-500/50',
    bgGlow: 'from-blue-500/10',
    metrics: [
      { label: 'BOR Terkini', value: '78.5%', status: 'normal' },
      { label: 'Prediksi KRS Hari Ini', value: '11 Pasien', status: 'info' },
      { label: 'Bed ICU Tersedia', value: '3 Bed', status: 'normal' }
    ],
    insights: [
      { text: '7 pasien Paviliun Dahlia telah memenuhi kriteria pemulangan klinis. Pengosongan bed dapat dipercepat sebelum pukul 13.00.', type: 'recommendation' },
      { text: 'Ruang Isolasi Tekanan Negatif terisi 100%. Rencanakan eskalasi bed cadangan di Gedung B.', type: 'warning' }
    ],
    actionLabel: 'Kelola Bed Management',
    actionRoute: '/modul/bed-management',
    lastUpdated: '4 menit lalu'
  },
  {
    id: 'antimicrobial_stewardship',
    title: 'Clinical Pathway & Antimicrobial Stewardship',
    subtitle: 'Kepatuhan Restriksi Antibiotik & Standar Mutu',
    category: 'Komite Medik & Akreditasi',
    badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    iconName: 'stewardship',
    accentBorder: 'hover:border-teal-500/50',
    bgGlow: 'from-teal-500/10',
    metrics: [
      { label: 'Kepatuhan Restriksi', value: '96.5%', status: 'normal' },
      { label: 'De-eskalasi Oral', value: '4 Pasien', status: 'info' },
      { label: 'Kepatuhan CP', value: '92.4%', status: 'normal' }
    ],
    insights: [
      { text: 'Hasil kultur sputum menunjukkan sensitivitas baik pada Amoksisilin-Klavulanat. Rekomendasi de-eskalasi dari Meropenem.', type: 'recommendation' },
      { text: 'Kepatuhan Surgical Safety Checklist kamar operasi minggu ini mencapai 100% tanpa insiden.', type: 'success' }
    ],
    actionLabel: 'Buka Patient Safety & Mutu',
    actionRoute: '/modul/mutu',
    lastUpdated: '10 menit lalu'
  }
];

const STORAGE_KEY = 'myitaru_ai_clinical_insights_order';

export function AIClinicalInsightsGrid() {
  const navigate = useNavigate();

  // Load ordered cards from localStorage or fall back to default
  const [cards, setCards] = useState<AIInsightCardItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const orderIds: string[] = JSON.parse(saved);
        const cardMap = new Map(DEFAULT_INSIGHT_CARDS.map(c => [c.id, c]));
        const ordered: AIInsightCardItem[] = [];
        orderIds.forEach(id => {
          const card = cardMap.get(id);
          if (card) {
            ordered.push(card);
            cardMap.delete(id);
          }
        });
        // Append any new card not yet in saved order
        cardMap.forEach(card => ordered.push(card));
        return ordered;
      }
    } catch (e) {
      console.warn('Gagal membaca susunan layout grid tersimpan:', e);
    }
    return DEFAULT_INSIGHT_CARDS;
  });

  // State for drag & drop
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [collapsedCards, setCollapsedCards] = useState<Record<string, boolean>>({});
  const [gridColumns, setGridColumns] = useState<'3' | '2'>('3');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRearrangeMode, setIsRearrangeMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sync to localStorage
  const saveOrderToStorage = (newCards: AIInsightCardItem[]) => {
    try {
      const ids = newCards.map(c => c.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (e) {
      console.warn('Gagal menyimpan urutan card ke local storage:', e);
    }
  };

  // Reorder helper
  const reorderCards = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    const sourceIndex = cards.findIndex(c => c.id === sourceId);
    const targetIndex = cards.findIndex(c => c.id === targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const updated = [...cards];
    const [moved] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, moved);

    setCards(updated);
    saveOrderToStorage(updated);
    toast.success(`Modul "${moved.title}" dipindahkan ke posisi baru`, {
      id: 'grid-reorder',
      icon: '✨'
    });
  };

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedId;
    if (sourceId && sourceId !== targetId) {
      reorderCards(sourceId, targetId);
    }
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  // Manual move left/right for touch & keyboard accessibility
  const moveCard = (id: string, direction: 'up' | 'down') => {
    const index = cards.findIndex(c => c.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;

    const updated = [...cards];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    setCards(updated);
    saveOrderToStorage(updated);
  };

  const resetLayout = () => {
    setCards(DEFAULT_INSIGHT_CARDS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    toast.success('Tata letak grid dikembalikan ke susunan standar');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Data kalkulasi AI Clinical Insights berhasil dimutakhirkan');
    }, 700);
  };

  const toggleCollapse = (id: string) => {
    setCollapsedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    cards.forEach(c => set.add(c.category));
    return ['all', ...Array.from(set)];
  }, [cards]);

  const filteredCards = useMemo(() => {
    if (selectedCategory === 'all') return cards;
    return cards.filter(c => c.category === selectedCategory);
  }, [cards, selectedCategory]);

  const renderIcon = (name: AIInsightCardItem['iconName']) => {
    switch (name) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'trend':
        return <Activity className="w-5 h-5 text-amber-400" />;
      case 'pill':
        return <Pill className="w-5 h-5 text-purple-400" />;
      case 'claim':
        return <FileCheck className="w-5 h-5 text-emerald-400" />;
      case 'bed':
        return <BedDouble className="w-5 h-5 text-blue-400" />;
      case 'stewardship':
        return <Stethoscope className="w-5 h-5 text-teal-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#E5CA78]" />;
    }
  };

  return (
    <section className="mb-12 relative z-10">
      {/* SECTION HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F3B5E] via-[#1A4F7A] to-[#C9A94E] flex items-center justify-center text-[#E5CA78] shadow-[0_0_15px_rgba(201,169,78,0.25)] border border-[#C9A94E]/30">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  AI Clinical Insights & Neural Copilot
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#C9A94E]/20 text-[#E5CA78] border border-[#C9A94E]/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Live Grid
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">
                Panel analitik klinis modular berbasis AI. Tarik handle <span className="font-mono text-[#E5CA78]">⠿</span> untuk mengatur ulang posisi modul.
              </p>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Rearrange Mode Toggle */}
          <button
            onClick={() => setIsRearrangeMode(!isRearrangeMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isRearrangeMode
                ? 'bg-[#C9A94E] text-[#071322] border-[#E5CA78] shadow-[0_0_15px_rgba(201,169,78,0.4)]'
                : 'bg-white/[0.04] text-slate-200 border-white/[0.1] hover:bg-white/[0.08] hover:border-[#C9A94E]/40'
            }`}
            title="Aktifkan mode pengaturan posisi"
          >
            <GripVertical className="w-3.5 h-3.5" />
            <span>{isRearrangeMode ? 'Selesai Atur' : 'Atur Tata Letak'}</span>
          </button>

          {/* Grid Columns Switcher */}
          <div className="hidden sm:flex items-center bg-white/[0.03] border border-white/[0.08] rounded-xl p-0.5">
            <button
              onClick={() => setGridColumns('2')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                gridColumns === '2' ? 'bg-white/[0.1] text-[#E5CA78]' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan 2 Kolom"
            >
              2 Kolom
            </button>
            <button
              onClick={() => setGridColumns('3')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                gridColumns === '3' ? 'bg-white/[0.1] text-[#E5CA78]' : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan 3 Kolom"
            >
              3 Kolom
            </button>
          </div>

          {/* Refresh AI Data */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-slate-300 hover:text-white hover:border-[#C9A94E]/40 transition-colors"
            title="Refresh Analitik AI"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#E5CA78]' : ''}`} />
          </button>

          {/* Reset Layout */}
          <button
            onClick={resetLayout}
            className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-xs font-semibold text-slate-300 hover:text-rose-300 hover:border-rose-400/40 transition-colors flex items-center gap-1"
            title="Kembalikan posisi standar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* REARRANGE HINT BANNER (When active) */}
      {isRearrangeMode && (
        <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-[#0F3B5E]/80 to-[#1A3A5E]/80 border border-[#C9A94E]/40 backdrop-blur-md flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <span className="text-xl">✨</span>
            <p className="text-xs text-slate-200">
              <strong className="text-[#E5CA78]">Mode Atur Tata Letak Aktif:</strong> Klik dan tahan kartu pada ikon <span className="font-mono text-[#E5CA78]">⠿</span> lalu geser (drag) ke posisi yang diinginkan. Anda juga bisa menggunakan tombol panah kiri/kanan di kartu.
            </p>
          </div>
          <button
            onClick={() => setIsRearrangeMode(false)}
            className="px-3 py-1 rounded-lg bg-[#C9A94E] hover:bg-[#D8B95E] text-[#071322] font-bold text-xs shrink-0 transition-colors"
          >
            Simpan & Tutup
          </button>
        </div>
      )}

      {/* MODULAR DRAG-AND-DROP GRID */}
      <div 
        className={`grid gap-6 transition-all duration-300 ${
          gridColumns === '2' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
        }`}
      >
        {filteredCards.map((card, index) => {
          const isDragging = draggedId === card.id;
          const isDragOver = dragOverId === card.id && draggedId !== card.id;
          const isCollapsed = collapsedCards[card.id];

          return (
            <div
              key={card.id}
              draggable
              onDragStart={(e) => handleDragStart(e, card.id)}
              onDragOver={(e) => handleDragOver(e, card.id)}
              onDrop={(e) => handleDrop(e, card.id)}
              onDragEnd={handleDragEnd}
              className={`group relative rounded-3xl transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-2xl border ${
                isDragging 
                  ? 'opacity-40 scale-95 border-dashed border-[#C9A94E] shadow-[0_0_30px_rgba(201,169,78,0.3)]' 
                  : isDragOver
                  ? 'scale-[1.02] border-[#E5CA78] shadow-[0_0_25px_rgba(201,169,78,0.4)] ring-2 ring-[#C9A94E]/50'
                  : 'bg-white/[0.03] border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.06)] hover:bg-white/[0.05] hover:border-white/[0.18]'
              }`}
            >
              {/* Top ambient glow */}
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${card.bgGlow} to-transparent rounded-bl-full pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-500`}></div>

              {/* CARD HEADER */}
              <div className="p-5 pb-3 relative z-10 border-b border-white/[0.06]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Drag Handle */}
                    <div 
                      className={`p-1.5 rounded-lg cursor-grab active:cursor-grabbing transition-colors ${
                        isRearrangeMode 
                          ? 'bg-[#C9A94E]/20 text-[#E5CA78] border border-[#C9A94E]/40' 
                          : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.05]'
                      }`}
                      title="Tahan dan geser untuk memindahkan kartu"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shadow-inner">
                      {renderIcon(card.iconName)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base leading-snug group-hover:text-[#E5CA78] transition-colors">
                          {card.title}
                        </h3>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium line-clamp-1">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Collapse Toggle */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isRearrangeMode && (
                      <div className="flex items-center gap-0.5 bg-black/20 rounded-lg p-0.5 border border-white/10">
                        <button
                          onClick={() => moveCard(card.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/10 text-xs"
                          title="Geser ke kiri / atas"
                        >
                          ◀
                        </button>
                        <button
                          onClick={() => moveCard(card.id, 'down')}
                          disabled={index === cards.length - 1}
                          className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/10 text-xs"
                          title="Geser ke kanan / bawah"
                        >
                          ▶
                        </button>
                      </div>
                    )}

                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${card.badgeColor}`}>
                      {card.category}
                    </span>

                    <button
                      onClick={() => toggleCollapse(card.id)}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
                      title={isCollapsed ? 'Perluas Kartu' : 'Ciutkan Kartu'}
                    >
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* CARD BODY (Collapsible) */}
              {!isCollapsed && (
                <div className="p-5 pt-4 flex-1 flex flex-col justify-between space-y-4 relative z-10 animate-in fade-in duration-200">
                  {/* Metric Chips Row */}
                  <div className="grid grid-cols-3 gap-2">
                    {card.metrics.map((metric, mIdx) => (
                      <div 
                        key={mIdx}
                        className="bg-white/[0.03] backdrop-blur-md rounded-xl p-2.5 border border-white/[0.05] text-center"
                      >
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold truncate">
                          {metric.label}
                        </p>
                        <p className={`text-sm font-black mt-0.5 truncate ${
                          metric.status === 'critical' ? 'text-rose-400' :
                          metric.status === 'warning' ? 'text-amber-400' :
                          metric.status === 'info' ? 'text-cyan-400' : 'text-emerald-400'
                        }`}>
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Clinical Recommendations & Real-Time Alerts */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#E5CA78]/80 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#E5CA78]" />
                      Rekomendasi Preskriptif AI
                    </p>

                    <div className="space-y-1.5">
                      {card.insights.map((insight, iIdx) => (
                        <div 
                          key={iIdx}
                          className={`p-2.5 rounded-xl text-xs font-medium leading-relaxed border flex items-start gap-2 ${
                            insight.type === 'critical' 
                              ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' :
                            insight.type === 'warning'
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' :
                            insight.type === 'success'
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' :
                              'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
                          }`}
                        >
                          <span className="shrink-0 mt-0.5 text-sm">
                            {insight.type === 'critical' ? '🚨' : insight.type === 'warning' ? '⚠️' : insight.type === 'success' ? '✅' : '💡'}
                          </span>
                          <span className="flex-1">{insight.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer: Timestamp & Direct Navigation */}
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-white/[0.05]">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {card.lastUpdated}
                    </span>

                    <button
                      onClick={() => navigate(card.actionRoute)}
                      className="inline-flex items-center gap-1.5 font-bold text-[#E5CA78] hover:text-white transition-colors group/btn cursor-pointer py-1 px-2 rounded-lg hover:bg-white/[0.05]"
                    >
                      <span>{card.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}

              {/* Minimized Quick Preview */}
              {isCollapsed && (
                <div className="p-3 px-5 flex items-center justify-between text-xs text-slate-400 bg-white/[0.01]">
                  <span className="text-[11px] truncate">
                    {card.metrics[0]?.label}: <strong className="text-white">{card.metrics[0]?.value}</strong>
                  </span>
                  <button
                    onClick={() => navigate(card.actionRoute)}
                    className="text-[#E5CA78] font-semibold text-xs flex items-center gap-1"
                  >
                    Buka Modul →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
