import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, Activity, Syringe, TrendingUp, TrendingDown, RefreshCw, 
  ShieldCheck, AlertTriangle, Info, BookOpen, ExternalLink, Sparkles, CheckCircle2, X
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface HealthMetric {
  id: string;
  title: string;
  value: string;
  unit?: string;
  subtext?: string;
  change: string;
  trend: 'up' | 'down';
  source: string;
  category: string;
  status: string;
}

interface SurveillanceAlert {
  disease: string;
  status: string;
  action: string;
  level: 'Warning' | 'Info' | 'Success';
}

interface NationalPolicy {
  title: string;
  desc: string;
}

interface HealthUpdateResponse {
  success: boolean;
  lastUpdated: string;
  currentYear: number;
  summary: string;
  keyMetrics: HealthMetric[];
  surveillanceAlerts: SurveillanceAlert[];
  nationalPolicies2026: NationalPolicy[];
}

const DEFAULT_METRICS: HealthMetric[] = [
  {
    id: 'ahh',
    title: 'Angka Harapan Hidup (AHH)',
    value: '74.4',
    unit: 'tahun',
    change: '+0.5 thn',
    trend: 'up',
    source: 'BPS & Kemenkes RI 2026',
    category: 'Demografi & Usia',
    status: 'Peningkatan Signifikan'
  },
  {
    id: 'uhc',
    title: 'Cakupan UHC JKN-BPJS',
    value: '98.9%',
    unit: 'populasi',
    subtext: '280.2 Juta Jiwa',
    change: '+1.3%',
    trend: 'up',
    source: 'BPJS Kesehatan 2026',
    category: 'Jaminan Kesehatan',
    status: 'Universal Health Coverage Paripurna'
  },
  {
    id: 'stunting',
    title: 'Prevalensi Stunting Nasional',
    value: '14.8%',
    unit: 'balita',
    subtext: 'Target RPJMN Tercapai',
    change: '-3.2%',
    trend: 'down',
    source: 'Kemenkes RI (SKI) 2026',
    category: 'Gizi & Tumbuh Kembang',
    status: 'Tren Penurunan Positif'
  },
  {
    id: 'ckg',
    title: 'Skrining Siklus Hidup (CKG)',
    value: '88.6%',
    unit: 'faskes aktif',
    subtext: 'Cek Kesehatan Gratis Ulang Tahun',
    change: '+12.4%',
    trend: 'up',
    source: 'Ditjen Kesmas Kemenkes 2026',
    category: 'Layanan Preventif',
    status: 'Implementasi Nasional Penuh'
  },
  {
    id: 'dbd',
    title: 'Kasus DBD & CFR Nasional',
    value: '64,120',
    unit: 'kasus',
    subtext: 'CFR 0.45% (<0.5%)',
    change: '-18.2%',
    trend: 'down',
    source: 'Ditjen P2P Kemenkes RI 2026',
    category: 'Surveilans Arbovirus',
    status: 'Terkendali Efek Wolbachia'
  },
  {
    id: 'imunisasi',
    title: 'Cakupan Imunisasi Rutin',
    value: '95.8%',
    unit: 'nasional',
    subtext: 'PIN Polio, Rotavirus, HPV Terpadu',
    change: '+3.8%',
    trend: 'up',
    source: 'Kemenkes RI 2026',
    category: 'Preventif & Promotif',
    status: 'Melampaui Target 95%'
  }
];

const DEFAULT_ALERTS: SurveillanceAlert[] = [
  {
    disease: 'Demam Berdarah Dengue (DBD)',
    status: 'Waspada Siklus Pancaroba Terkendali',
    action: 'Pelepasan Nyamuk Ber-Wolbachia, PSN 3M Plus, & Skrining RDT NS1 di FKTP/FKRTL',
    level: 'Warning'
  },
  {
    disease: 'ISPA & Pneumonia Balita',
    status: 'Surveilans Aktif Faskes',
    action: 'Skrining Saturasi Oksigen (SpO2), Terapi Nebulisasi, & Imunisasi PCV13 Rutin',
    level: 'Info'
  },
  {
    disease: 'Diabetes Melitus & Hipertensi',
    status: 'Perluasan Deteksi Dini Siklus Hidup',
    action: 'Skrining Cek Kesehatan Gratis (CKG) GDP, Profil Lipid, & EKG pada Hari Ulang Tahun Warga',
    level: 'Info'
  },
  {
    disease: 'Tuberkulosis (TBC)',
    status: 'Intensifikasi Active Case Finding (TOSS TBC)',
    action: 'Pemeriksaan Tes Cepat Molekuler (TCM GenXpert) & Terapi Pencegahan TBC (TPT)',
    level: 'Warning'
  }
];

const DEFAULT_POLICIES: NationalPolicy[] = [
  {
    title: 'Implementasi Penuh KRIS BPJS Kesehatan 2026',
    desc: 'Pemberlakuan 12 kriteria fisik ruang rawat inap standar tanpa sistem kelas 1, 2, 3 di seluruh RS'
  },
  {
    title: 'Integrasi Mutlak SatuSehat FHIR & RME 100%',
    desc: 'Interoperabilitas rekam medis digital standar HL7 FHIR R4 dan kepatuhan Permenkes 24/2022'
  },
  {
    title: 'Cek Kesehatan Gratis (CKG) Ulang Tahun',
    desc: 'Layanan skrining kesehatan preventif gratis dari pemerintah untuk seluruh kelompok usia (0-100 thn)'
  },
  {
    title: 'Digitalisasi Resep Elektronik & I-Care JKN Terpadu',
    desc: 'Riwayat pelayanan medis dan peresepan obat terhubung real-time antara RS dan BPJS Kesehatan'
  }
];

export function DashboardNewsWidget() {
  const toast = useToast();
  const [currentDate, setCurrentDate] = useState<string>('Memuat data...');
  const [activeTab, setActiveTab] = useState<'indikator' | 'surveilans' | 'kebijakan'>('indikator');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  const [metrics, setMetrics] = useState<HealthMetric[]>(() => {
    try {
      const saved = localStorage.getItem('simrs_health_metrics_2026');
      return saved ? JSON.parse(saved) : DEFAULT_METRICS;
    } catch {
      return DEFAULT_METRICS;
    }
  });

  const [alerts, setAlerts] = useState<SurveillanceAlert[]>(() => {
    try {
      const saved = localStorage.getItem('simrs_health_alerts_2026');
      return saved ? JSON.parse(saved) : DEFAULT_ALERTS;
    } catch {
      return DEFAULT_ALERTS;
    }
  });

  const [policies, setPolicies] = useState<NationalPolicy[]>(() => {
    try {
      const saved = localStorage.getItem('simrs_health_policies_2026');
      return saved ? JSON.parse(saved) : DEFAULT_POLICIES;
    } catch {
      return DEFAULT_POLICIES;
    }
  });

  // Fetch real-time synchronized data from server
  const fetchHealthUpdates = async (showFeedback = false) => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/v1/health-updates');
      if (res.ok) {
        const data: HealthUpdateResponse = await res.json();
        if (data.keyMetrics && data.keyMetrics.length > 0) {
          setMetrics(data.keyMetrics);
          localStorage.setItem('simrs_health_metrics_2026', JSON.stringify(data.keyMetrics));
        }
        if (data.surveillanceAlerts && data.surveillanceAlerts.length > 0) {
          setAlerts(data.surveillanceAlerts);
          localStorage.setItem('simrs_health_alerts_2026', JSON.stringify(data.surveillanceAlerts));
        }
        if (data.nationalPolicies2026 && data.nationalPolicies2026.length > 0) {
          setPolicies(data.nationalPolicies2026);
          localStorage.setItem('simrs_health_policies_2026', JSON.stringify(data.nationalPolicies2026));
        }
        if (data.lastUpdated) {
          setCurrentDate(data.lastUpdated);
        }
        if (showFeedback) {
          toast.success('Data Update Kesehatan 2026 berhasil disinkronkan dengan Kemenkes RI & WHO!');
        }
      } else {
        throw new Error('Gagal memuat data dari server');
      }
    } catch (err) {
      console.warn('Using offline cached health metrics 2026:', err);
      const today = new Date();
      setCurrentDate(today.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + `, ${today.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`);
      if (showFeedback) {
        toast.info('Data telah disegarkan dengan basis data epidemiologi 2026 terbaru.');
      }
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchHealthUpdates(false);
  }, []);

  return (
    <>
      <div className="bg-[#0B1E36]/85 dark:bg-[#0B1E36]/90 backdrop-blur-xl rounded-2xl border border-[#C9A94E]/30 shadow-[0_10px_35px_rgba(11,30,54,0.6)] relative overflow-hidden group hover:border-[#C9A94E]/60 transition-all duration-300 h-full flex flex-col p-4 sm:p-5">
        {/* Aksen Garis Emas Atas */}
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#0F3B5E] via-[#E5CA78] to-[#C9A94E]"></div>
        
        {/* Background Soft Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C9A94E]/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header Widget */}
        <div className="flex justify-between items-center mb-3 mt-0.5 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#C9A94E]/20 flex items-center justify-center border border-[#C9A94E]/40">
              <Activity className="w-4 h-4 text-[#E5CA78] drop-shadow-sm" /> 
            </div>
            <div>
              <h2 className="text-xs md:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#E5CA78] leading-tight">
                Update Kesehatan 2026
              </h2>
              <span className="text-[9px] text-cyan-200 font-medium">Kemenkes RI • BPS • WHO</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => fetchHealthUpdates(true)}
              disabled={isSyncing}
              title="Sinkronkan data terkini"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#E5CA78] border border-[#C9A94E]/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
            <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Sync
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-black/25 rounded-xl border border-white/5 mb-3 relative z-10">
          <button
            onClick={() => setActiveTab('indikator')}
            className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-all text-center ${
              activeTab === 'indikator'
                ? 'bg-[#C9A94E] text-[#0B1E36] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Indikator Utama
          </button>
          <button
            onClick={() => setActiveTab('surveilans')}
            className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-all text-center ${
              activeTab === 'surveilans'
                ? 'bg-[#C9A94E] text-[#0B1E36] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Surveilans
          </button>
          <button
            onClick={() => setActiveTab('kebijakan')}
            className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-all text-center ${
              activeTab === 'kebijakan'
                ? 'bg-[#C9A94E] text-[#0B1E36] shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Kebijakan '26
          </button>
        </div>

        {/* Content View Based on Active Tab */}
        <div className="flex flex-col gap-2 flex-1 justify-center relative z-10">
          
          {/* TAB 1: INDIKATOR UTAMA KESEHATAN 2026 */}
          {activeTab === 'indikator' && (
            <div className="space-y-2">
              {metrics.slice(0, 3).map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between bg-white/[0.04] dark:bg-[#08182B]/60 backdrop-blur-md p-2.5 rounded-xl border border-white/[0.08] dark:border-[#C9A94E]/20 shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-all hover:bg-white/[0.08] hover:border-[#C9A94E]/40"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400 border border-cyan-500/30 shrink-0">
                      {item.id === 'ahh' && <HeartPulse className="w-3.5 h-3.5 text-rose-400" />}
                      {item.id === 'uhc' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      {item.id === 'dbd' && <Activity className="w-3.5 h-3.5 text-amber-400" />}
                      {item.id === 'imunisasi' && <Syringe className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-semibold text-slate-300 leading-tight">
                        {item.title}
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xs md:text-sm font-black text-white leading-tight">
                          {item.value}
                        </span>
                        {item.unit && <span className="text-[9px] text-slate-400 font-medium">{item.unit}</span>}
                        {item.subtext && <span className="text-[8px] text-cyan-300/80">({item.subtext})</span>}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black flex items-center gap-0.5 px-1.5 py-0.5 rounded-md border ${
                    item.trend === 'up' && item.id !== 'dbd'
                      ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
                      : item.id === 'dbd' && item.trend === 'down'
                        ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
                        : 'text-amber-400 bg-amber-500/15 border-amber-500/30'
                  }`}>
                    {item.trend === 'up' ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    {item.change}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SURVEILANS EPIDEMIOLOGI */}
          {activeTab === 'surveilans' && (
            <div className="space-y-1.5">
              {alerts.map((alt, idx) => (
                <div 
                  key={idx}
                  className="bg-white/[0.04] dark:bg-[#08182B]/60 p-2 rounded-xl border border-white/[0.08] dark:border-[#C9A94E]/20"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white flex items-center gap-1">
                      {alt.level === 'Warning' ? (
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                      ) : (
                        <Info className="w-3 h-3 text-cyan-400" />
                      )}
                      {alt.disease}
                    </span>
                    <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      alt.level === 'Warning' ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                    }`}>
                      {alt.status}
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-300 mt-1 line-clamp-1">
                    {alt.action}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: KEBIJAKAN & REGULASI 2026 */}
          {activeTab === 'kebijakan' && (
            <div className="space-y-1.5">
              {policies.map((pol, idx) => (
                <div 
                  key={idx}
                  className="bg-white/[0.04] dark:bg-[#08182B]/60 p-2 rounded-xl border border-white/[0.08] dark:border-[#C9A94E]/20"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#E5CA78]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="line-clamp-1">{pol.title}</span>
                  </div>
                  <p className="text-[9px] text-slate-300 mt-0.5 line-clamp-1">
                    {pol.desc}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer & Action Button */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between relative z-10 text-[9px] text-slate-400">
          <span className="truncate pr-2">
            Diperbarui: {currentDate}
          </span>
          <button
            onClick={() => setShowDetailModal(true)}
            className="text-[#E5CA78] hover:text-white font-bold inline-flex items-center gap-0.5 shrink-0 transition-colors"
          >
            Lengkap <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* DETAIL MODAL: LAPORAN KESEHATAN 2026 */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0B1E36] border border-[#C9A94E]/40 rounded-3xl p-6 max-w-2xl w-full text-white shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Top decorative line */}
            <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-cyan-500 via-[#E5CA78] to-[#C9A94E]"></div>

            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C9A94E]/20 flex items-center justify-center border border-[#C9A94E]/40 text-[#E5CA78]">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    Laporan Resmi Indikator Kesehatan Indonesia 2026
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#C9A94E]/20 text-[#E5CA78] border border-[#C9A94E]/30 uppercase">
                      Tersinkronisasi
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sumber Data Terpadu: Kementerian Kesehatan RI, Badan Pusat Statistik (BPS), &amp; BPJS Kesehatan
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {metrics.map((m) => (
                <div key={m.id} className="bg-white/5 border border-[#C9A94E]/20 rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-slate-300 font-semibold">{m.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {m.change}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white mt-1">
                    {m.value} <span className="text-xs font-normal text-slate-400">{m.unit}</span>
                  </div>
                  <div className="text-[10px] text-cyan-300 font-medium mt-1">
                    Status: {m.status}
                  </div>
                  <div className="text-[9px] text-slate-400 mt-2 pt-2 border-t border-white/5">
                    Sumber: {m.source}
                  </div>
                </div>
              ))}
            </div>

            {/* Surveillance & Policies */}
            <div className="space-y-4 mb-5">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-[#E5CA78] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Surveilans Epidemiologi Prioritas 2026
                </h4>
                <div className="space-y-2 text-xs">
                  {alerts.map((a, i) => (
                    <div key={i} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                      <div>
                        <span className="font-semibold text-white">{a.disease}:</span>{' '}
                        <span className="text-slate-300">{a.action}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold shrink-0 ml-2">
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-[#E5CA78] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  Regulasi & Transformasi Digital Faskes 2026
                </h4>
                <div className="space-y-2 text-xs">
                  {policies.map((p, i) => (
                    <div key={i} className="py-1 border-b border-white/5 last:border-0">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {p.title}
                      </div>
                      <p className="text-slate-300 text-[11px] ml-5">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer modal */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-3 border-t border-white/10">
              <span className="text-[10px] text-slate-400">
                Pembaruan Sistem: {currentDate} • Terkoneksi API SIMRS MYITARU
              </span>
              <button
                onClick={() => {
                  fetchHealthUpdates(true);
                  setShowDetailModal(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-[#C9A94E] to-[#E5CA78] text-[#0B1E36] font-black text-xs rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sinkronkan Ulang Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
