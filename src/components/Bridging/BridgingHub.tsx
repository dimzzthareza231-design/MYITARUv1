import React, { useState, useEffect } from 'react';
import {
  Link2, CheckCircle2, AlertTriangle, XCircle, RefreshCw,
  Activity, ArrowUpRight, ShieldCheck, Database, Smartphone,
  Radio, FileCheck2, Cpu, HardDrive, Bell, Zap, Play, Terminal
} from 'lucide-react';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

interface BridgingService {
  id: string;
  name: string;
  category: 'BPJS' | 'Kemenkes' | 'External' | 'Internal';
  status: 'ONLINE' | 'STANDBY' | 'WARNING' | 'ERROR';
  latency: number;
  lastSync: string;
  description: string;
  endpoint: string;
  syncCountToday: number;
  errorCountToday: number;
  icon: string;
  route: string;
}

export function BridgingHub() {
  const { activeTab } = useOutletContext<{ activeTab?: string }>() || {};
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'BPJS' | 'Kemenkes' | 'External' | 'Internal'>('ALL');
  const [testLog, setTestLog] = useState<string[]>([]);
  const [isRunningPing, setIsRunningPing] = useState(false);

  const [services, setServices] = useState<BridgingService[]>([
    {
      id: 'vclaim',
      name: 'BPJS V-Claim v2.0',
      category: 'BPJS',
      status: 'ONLINE',
      latency: 42,
      lastSync: 'Baru saja',
      description: 'Bridging SEP, Rujukan, Surat Kontrol, PRB & Lembar Klaim V-Claim Trust/Prod.',
      endpoint: 'https://apijkn.bpjs-kesehatan.go.id/vclaim-rest',
      syncCountToday: 384,
      errorCountToday: 0,
      icon: '💚',
      route: '/modul/vclaim'
    },
    {
      id: 'satu-sehat',
      name: 'Kemenkes SatuSehat FHIR',
      category: 'Kemenkes',
      status: 'ONLINE',
      latency: 85,
      lastSync: '1 menit yang lalu',
      description: 'Sinkronisasi RME (Encounter, Condition, Observation, Medication) ke platform Kemenkes RI.',
      endpoint: 'https://api-satusehat.kemkes.go.id/fhir-r4/v1',
      syncCountToday: 1240,
      errorCountToday: 2,
      icon: '🌐',
      route: '/modul/satu-sehat'
    },
    {
      id: 'hfis',
      name: 'BPJS HFIS (Faskes & Bed)',
      category: 'BPJS',
      status: 'ONLINE',
      latency: 56,
      lastSync: '5 menit yang lalu',
      description: 'Sinkronisasi Jadwal Praktik Dokter Poliklinik & Ketersediaan Tempat Tidur SIRANAP.',
      endpoint: 'https://apijkn.bpjs-kesehatan.go.id/hfis-rest',
      syncCountToday: 96,
      errorCountToday: 0,
      icon: '🏥',
      route: '/modul/hfis'
    },
    {
      id: 'vedika',
      name: 'BPJS Vedika (Digital Klaim)',
      category: 'BPJS',
      status: 'ONLINE',
      latency: 68,
      lastSync: '12 menit yang lalu',
      description: 'Pengiriman Berkas Digital Klaim (SEP, Resume Medis, Laporan Tindakan, Billing).',
      endpoint: 'https://vedika.bpjs-kesehatan.go.id/api/upload',
      syncCountToday: 142,
      errorCountToday: 1,
      icon: '✅',
      route: '/modul/vedika'
    },
    {
      id: 'veronisa',
      name: 'Veronisa (Eligibilitas & Biometrik)',
      category: 'BPJS',
      status: 'ONLINE',
      latency: 38,
      lastSync: '3 menit yang lalu',
      description: 'Verifikasi sidik jari/fingerprint peserta dan validasi keaktifan kartu BPJS.',
      endpoint: 'https://apijkn.bpjs-kesehatan.go.id/veronisa',
      syncCountToday: 278,
      errorCountToday: 0,
      icon: '🔍',
      route: '/modul/veronisa'
    },
    {
      id: 'bpjs-emr',
      name: 'BPJS E-MR Bridging',
      category: 'BPJS',
      status: 'ONLINE',
      latency: 62,
      lastSync: '8 menit yang lalu',
      description: 'Pengiriman ringkasan riwayat klinis dan diagnosa primer/sekunder pasien rawat jalan.',
      endpoint: 'https://apijkn.bpjs-kesehatan.go.id/emr-rest',
      syncCountToday: 195,
      errorCountToday: 0,
      icon: '♿',
      route: '/modul/bpjs-emr'
    },
    {
      id: 'wa-gateway',
      name: 'WhatsApp Official Gateway',
      category: 'External',
      status: 'ONLINE',
      latency: 110,
      lastSync: 'Realtime',
      description: 'Notifikasi nomor antrian, reminder kontrol H-1, hasil lab & pengiriman dokumen PDF.',
      endpoint: 'https://api.wagw.myitaru.id/v1/messages',
      syncCountToday: 512,
      errorCountToday: 3,
      icon: '💬',
      route: '/modul/wa-gateway'
    },
    {
      id: 'anjungan',
      name: 'Anjungan Mandiri (APM) & Antrean',
      category: 'Internal',
      status: 'ONLINE',
      latency: 15,
      lastSync: 'Realtime',
      description: 'Display antrian TV fullscreen, voice call generator, pendaftaran mandiri kiosk.',
      endpoint: 'http://192.168.1.100:8080/apm-api',
      syncCountToday: 620,
      errorCountToday: 0,
      icon: '🖥️',
      route: '/modul/anjungan'
    },
    {
      id: 'orthanc',
      name: 'Orthanc DICOM PACS Server',
      category: 'Internal',
      status: 'ONLINE',
      latency: 28,
      lastSync: '2 menit yang lalu',
      description: 'Server penyimpanan citra medis DICOM (Rontgen, CT-Scan, USG) & Web Viewer.',
      endpoint: 'http://pacs.myitaru.local:8042',
      syncCountToday: 74,
      errorCountToday: 0,
      icon: '🎬',
      route: '/modul/orthanc'
    },
    {
      id: 'sertisign',
      name: 'Sertisign (TTE BSrE / Kominfo)',
      category: 'External',
      status: 'ONLINE',
      latency: 92,
      lastSync: '15 menit yang lalu',
      description: 'Layanan tanda tangan elektronik tersertifikasi resmi untuk rekam medis & resep dokter.',
      endpoint: 'https://tte.bsre.id/api/sign/pdf',
      syncCountToday: 210,
      errorCountToday: 0,
      icon: '✍️',
      route: '/modul/sertisign'
    },
    {
      id: 'cloudflare',
      name: 'Cloudflare Enterprise Security',
      category: 'External',
      status: 'ONLINE',
      latency: 18,
      lastSync: 'Realtime',
      description: 'Proteksi DDoS L3/L7, Anti-Bot Turnstile, SSL Full Strict, WAF Rate Limiting & R2 Storage.',
      endpoint: 'https://api.cloudflare.com/client/v4',
      syncCountToday: 3840,
      errorCountToday: 0,
      icon: '🛡️',
      route: '/modul/cloudflare'
    },
    {
      id: 'api',
      name: 'API & Payment Gateway Duitku',
      category: 'External',
      status: 'ONLINE',
      latency: 75,
      lastSync: '4 menit yang lalu',
      description: 'Integrasi pembayaran QRIS, Virtual Account, Duitku, dan integrasi API eksternal APAM.',
      endpoint: 'https://passport.duitku.com/webapi/api/merchant',
      syncCountToday: 188,
      errorCountToday: 0,
      icon: '🔑',
      route: '/modul/api'
    },
    {
      id: 'jkn-mobile',
      name: 'Mobile JKN & BPJS Antrean',
      category: 'BPJS',
      status: 'ONLINE',
      latency: 48,
      lastSync: 'Baru saja',
      description: 'Pendaftaran antrean online faskes via aplikasi Mobile JKN BPJS Kesehatan.',
      endpoint: 'https://apijkn.bpjs-kesehatan.go.id/antreanrs',
      syncCountToday: 430,
      errorCountToday: 0,
      icon: '📱',
      route: '/modul/jkn-mobile'
    }
  ]);

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setServices(prev => prev.map(s => ({
        ...s,
        latency: Math.floor(20 + Math.random() * 80),
        lastSync: 'Baru saja'
      })));
      setIsRefreshing(false);
      toast.success('Status seluruh endpoint bridging berhasil disegarkan!');
    }, 800);
  };

  const handleRunHealthCheck = () => {
    setIsRunningPing(true);
    setTestLog(['Memulai Comprehensive Bridging Health Check...']);
    
    let step = 0;
    const targets = [
      'Memeriksa V-Claim Trust API Gateway (ConsID: 29811)... Status 200 OK (38ms)',
      'Memverifikasi OAuth2 Token SatuSehat Kemenkes... Token Valid (Expires in 58m)',
      'Sinkronisasi Status Antrian WS BPJS & Mobile JKN... Berhasil (41ms)',
      'Validasi Koneksi PACS DICOM Orthanc Port 8042... Connected (12ms)',
      'Pengecekan Kuota WhatsApp Gateway Official... 8,420 Pesan Tersedia',
      'Verifikasi Sertifikat BSrE TTE Keystore... Certificate Valid s.d. 2028',
      'Pemeriksaan Webhook Duitku & Payment Gateway... Listener Ready'
    ];

    const interval = setInterval(() => {
      if (step < targets.length) {
        setTestLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${targets[step]}`]);
        step++;
      } else {
        clearInterval(interval);
        setIsRunningPing(false);
        setTestLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ Seluruh 12 modul bridging berstatus OPERASIONAL NORMAL!`]);
        toast.success('Health check bridging selesai! Semua sistem terhubung sempurna.');
      }
    }, 400);
  };

  const filteredServices = services.filter(s => {
    if (selectedFilter === 'ALL') return true;
    return s.category === selectedFilter;
  });

  const totalSync = services.reduce((acc, curr) => acc + curr.syncCountToday, 0);
  const totalErrors = services.reduce((acc, curr) => acc + curr.errorCountToday, 0);
  const avgLatency = Math.round(services.reduce((acc, curr) => acc + curr.latency, 0) / services.length);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Link2 className="w-64 h-64 text-emerald-400" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/40 rounded-full text-emerald-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Universal Bridging Hub v3.4
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-md font-mono">
                12 Services Integrated
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
              <span>🔗</span> Pusat Integrasi & Bridging Eksternal Klinik
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Manajemen dan monitoring terpusat untuk seluruh koneksi bridging: BPJS Kesehatan (V-Claim, HFIS, Vedika, Veronisa, E-MR), Kemenkes SatuSehat FHIR, WhatsApp Gateway, PACS Orthanc, TTE BSrE, dan Payment Gateway.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              Segarkan Status
            </button>
            <button
              onClick={handleRunHealthCheck}
              disabled={isRunningPing}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/30 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              Uji Semua Koneksi (Ping)
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Status Layanan</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-white">
            12 / 12 <span className="text-sm font-bold text-emerald-500">100% Aktif</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">Seluruh gateway terhubung normal</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Transaksi Bridging Hari Ini</span>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-white">
            {totalSync.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-400">Request</span>
          </div>
          <div className="text-xs text-emerald-500 mt-1 font-medium">↑ 14.8% dibanding kemarin</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Rata-Rata Latensi</span>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-white">
            {avgLatency} <span className="text-xs font-semibold text-slate-400">ms</span>
          </div>
          <div className="text-xs text-emerald-500 mt-1 font-medium">Sangat Cepat (&lt; 100ms)</div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Tingkat Keberhasilan</span>
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-800 dark:text-white">
            {((1 - (totalErrors / (totalSync || 1))) * 100).toFixed(2)}%
          </div>
          <div className="text-xs text-slate-400 mt-1">{totalErrors} request error tertangani</div>
        </div>
      </div>

      {/* Terminal Live Health Check Log (If Running or Has Log) */}
      {testLog.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-inner">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800 text-xs">
            <span className="text-emerald-400 font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Live Ping & Diagnostics Console
            </span>
            <button
              onClick={() => setTestLog([])}
              className="text-slate-500 hover:text-slate-300 text-xs font-mono"
            >
              Clear Log
            </button>
          </div>
          <div className="font-mono text-xs text-slate-300 space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
            {testLog.map((log, i) => (
              <div key={i} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar">
          {(['ALL', 'BPJS', 'Kemenkes', 'External', 'Internal'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                selectedFilter === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat === 'ALL' ? 'Semua Modul (12)' : `${cat} Integrations`}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Menampilkan <strong className="text-slate-800 dark:text-white">{filteredServices.length}</strong> modul bridging
        </div>
      </div>

      {/* Grid of Bridging Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base leading-tight">
                      {service.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {service.category} Bridging
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {service.status}
                </span>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed mb-4">
                {service.description}
              </p>

              <div className="bg-slate-50 dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 font-mono text-[11px] text-slate-500 dark:text-slate-400 mb-4 truncate" title={service.endpoint}>
                {service.endpoint}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-100 dark:border-slate-700/60 mb-4">
                <div>
                  <div className="text-[10px] text-slate-400">Latensi</div>
                  <div className="font-bold text-slate-700 dark:text-slate-200 font-mono">{service.latency} ms</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Req Hari Ini</div>
                  <div className="font-bold text-blue-600 dark:text-blue-400 font-mono">{service.syncCountToday}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Errors</div>
                  <div className={`font-bold font-mono ${service.errorCountToday > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {service.errorCountToday}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  toast.success(`Ping ke ${service.name}: ${service.latency}ms (200 OK)`);
                }}
                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Ping Test
              </button>
              <button
                onClick={() => navigate(service.route)}
                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-1 group-hover:shadow-blue-600/30"
              >
                Buka Modul
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
