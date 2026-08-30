import React, { useState } from 'react';
import { 
  HardDrive, DownloadCloud, RotateCcw, AlertTriangle, PlayCircle, ShieldCheck, 
  CheckCircle2, Clock, Server, Cloud, RefreshCw, Database, FileArchive, Check, ArrowRight
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import { useAuditTrail } from '../../contexts/AuditTrailContext';

export function BackupManagement() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'restore' | 'dr'>('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Backup Dashboard', icon: HardDrive },
    { id: 'jobs', label: 'Jadwal & Riwayat Backup', icon: DownloadCloud },
    { id: 'restore', label: 'Restore Data Wizard', icon: RotateCcw },
    { id: 'dr', label: 'Disaster Recovery (DR)', icon: AlertTriangle },
  ] as const;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5 text-slate-900 dark:text-white">
            <HardDrive className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Pencadangan & Pemulihan Sistem (Backup & DR)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manajemen pencadangan basis data otomatis, snapshot berkala, restore point, dan simulasi failover.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto custom-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'dashboard' && <DashboardTab onNavigateJobs={() => setActiveTab('jobs')} onNavigateRestore={() => setActiveTab('restore')} />}
        {activeTab === 'jobs' && <JobsTab />}
        {activeTab === 'restore' && <RestoreTab />}
        {activeTab === 'dr' && <DrTab />}
      </div>
    </div>
  );
}

function DashboardTab({ onNavigateJobs, onNavigateRestore }: { onNavigateJobs: () => void; onNavigateRestore: () => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 border-l-4 border-l-emerald-500 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>Status Backup Terakhir</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">BERHASIL</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Hari ini, 02:00:15 WIB (Full Database Snapshot)</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 border-l-4 border-l-blue-500 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>Total Storage Cadangan</span>
            <Cloud className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">4.2 TB</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Tersimpan di Google Cloud Storage & AWS S3 Coldline</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 border-l-4 border-l-indigo-500 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>Recovery Point Objective (RPO)</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">&le; 1 Jam</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Incremental WAL replication setiap 15 menit</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            Distribusi Penyimpanan Backup
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Basis Data Rekam Medis (EMR/RME)', size: '2.8 TB', pct: 67, color: 'bg-blue-600' },
              { name: 'Arsip Gambar Radiologi (PACS / DICOM)', size: '1.1 TB', pct: 26, color: 'bg-indigo-600' },
              { name: 'Log Transaksi & Audit Trail', size: '250 GB', pct: 6, color: 'bg-cyan-600' },
              { name: 'Konfigurasi Sistem & Master Data', size: '50 GB', pct: 1, color: 'bg-emerald-600' },
            ].map(item => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono font-bold">{item.size} ({item.pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Integritas & Retensi Cadangan
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Seluruh berkas pencadangan dienkripsi menggunakan AES-256 GCM pada level storage dan diuji validitas hash MD5 secara otomatis setiap hari pukul 04:00 WIB.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Retensi Harian</div>
                <div className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">30 Hari</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Retensi Bulanan</div>
                <div className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">12 Bulan</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              onClick={onNavigateJobs}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              Lihat Jadwal Backup <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onNavigateRestore}
              className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              Wizard Restore
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobsTab() {
  const toast = useToast();
  const { logActivity } = useAuditTrail();
  const [isRunning, setIsRunning] = useState(false);

  const [jobs] = useState([
    { id: 'JOB-FULL-01', name: 'Pencadangan Penuh Harian (Full Snapshot)', schedule: 'Setiap Hari 02:00 WIB', type: 'Full DB', status: 'Aktif', lastRun: 'Hari ini, 02:00 WIB', size: '2.8 TB' },
    { id: 'JOB-INC-01', name: 'Pencadangan Inkremental Transaksi (WAL)', schedule: 'Setiap 1 Jam', type: 'Incremental', status: 'Aktif', lastRun: '15 menit lalu', size: '1.2 GB' },
    { id: 'JOB-PACS-01', name: 'Sinkronisasi Arsip Radiologi DICOM', schedule: 'Setiap Hari 03:30 WIB', type: 'Blob Storage', status: 'Aktif', lastRun: 'Hari ini, 03:30 WIB', size: '45 GB' },
    { id: 'JOB-CFG-01', name: 'Cadangan Konfigurasi SIMK & Akun', schedule: 'Setiap 6 Jam', type: 'Config/JSON', status: 'Aktif', lastRun: '1 jam lalu', size: '12 MB' },
  ]);

  const triggerManual = () => {
    setIsRunning(true);
    toast.info('Memulai proses pencadangan database manual...');

    setTimeout(() => {
      setIsRunning(false);
      logActivity('admin', 'Manual Backup', 'Backup & DR', 'Database', 'ALL');
      toast.success('Pencadangan data manual berhasil diselesaikan!');
    }, 2500);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <DownloadCloud className="w-5 h-5 text-blue-600" />
            Jadwal Pencadangan Otomatis
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Daftar cron job backup yang berjalan di server latar belakang.</p>
        </div>
        <button
          onClick={triggerManual}
          disabled={isRunning}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
          {isRunning ? 'Sedang Mencadangkan...' : 'Jalankan Backup Sekarang'}
        </button>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase font-bold tracking-wider">
            <tr>
              <th className="p-3.5">ID Job</th>
              <th className="p-3.5">Nama Pekerjaan</th>
              <th className="p-3.5">Tipe</th>
              <th className="p-3.5">Frekuensi Jadwal</th>
              <th className="p-3.5">Terakhir Berjalan</th>
              <th className="p-3.5">Ukuran</th>
              <th className="p-3.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {jobs.map(j => (
              <tr key={j.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition-colors">
                <td className="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">{j.id}</td>
                <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">{j.name}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {j.type}
                  </span>
                </td>
                <td className="p-3.5 text-slate-600 dark:text-slate-400">{j.schedule}</td>
                <td className="p-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{j.lastRun}</td>
                <td className="p-3.5 font-mono font-semibold text-slate-700 dark:text-slate-300">{j.size}</td>
                <td className="p-3.5 text-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {j.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RestoreTab() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [selectedPoint, setSelectedPoint] = useState('rp-1');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const restorePoints = [
    { id: 'rp-1', label: 'Hari Ini, 02:00 WIB (Full Snapshot Terakhir)', size: '2.8 TB', type: 'Full DB' },
    { id: 'rp-2', label: 'Hari Ini, 12:00 WIB (Inkremental Siang)', size: '1.1 GB', type: 'WAL Inkremental' },
    { id: 'rp-3', label: 'Kemarin, 02:00 WIB (Full Snapshot Kemarin)', size: '2.7 TB', type: 'Full DB' },
  ];

  const handleRestore = () => {
    if (!isConfirmed) {
      toast.error('Centang konfirmasi persetujuan terlebih dahulu');
      return;
    }

    setIsRestoring(true);
    toast.info('Memulai pemulihan database dari restore point...');

    setTimeout(() => {
      setIsRestoring(false);
      setStep(3);
      toast.success('Database berhasil dipulihkan!');
    }, 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 sm:p-8 max-w-3xl mx-auto border border-slate-200 dark:border-slate-700 space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <RotateCcw className="w-5 h-5 text-blue-600" />
          Wizard Pemulihan Data (Restore Point)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Kembalikan snapshot basis data ke titik waktu tertentu dengan aman.</p>
      </div>

      {/* Stepper Header */}
      <div className="flex justify-between items-center relative max-w-md mx-auto py-2">
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0"></div>
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs relative z-10 transition-all ${
              step >= s
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}
          >
            {step > s ? <Check className="w-4 h-4" /> : s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Langkah 1: Pilih Titik Pemulihan (Restore Point)</h3>
          <div className="space-y-2.5">
            {restorePoints.map(r => (
              <label
                key={r.id}
                onClick={() => setSelectedPoint(r.id)}
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedPoint === r.id
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="rp"
                    checked={selectedPoint === r.id}
                    onChange={() => setSelectedPoint(r.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-white">{r.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Tipe: {r.type}</div>
                  </div>
                </div>
                <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-300">{r.size}</span>
              </label>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 mt-4"
          >
            Lanjutkan ke Konfirmasi <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5 pt-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">Langkah 2: Konfirmasi & Validasi Keamanan</h3>
          
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-900 dark:text-rose-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> PERINGATAN SISTEM KRITIS:
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              Proses restore akan menimpa data operasional saat ini dengan data dari snapshot yang dipilih. Transaksi yang dicatat setelah waktu snapshot harus disinkronkan kembali secara manual.
            </p>
          </div>

          <label className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={e => setIsConfirmed(e.target.checked)}
              className="w-4 h-4 text-rose-600 rounded mt-0.5 cursor-pointer"
            />
            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              Saya memahami risiko ini dan telah mengonfirmasi dengan Tim IT & Direksi untuk melakukan pemulihan basis data.
            </span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              disabled={isRestoring}
              className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Kembali
            </button>
            <button
              onClick={handleRestore}
              disabled={!isConfirmed || isRestoring}
              className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {isRestoring ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
              {isRestoring ? 'Memulihkan Data...' : 'Mulai Restore Data'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center space-y-4 py-6">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">Pemulihan Data Selesai!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Seluruh tabel basis data, master data, dan relasi transaksi telah berhasil dikembalikan ke keadaan snapshot terpilih.
          </p>
          <button
            onClick={() => { setStep(1); setIsConfirmed(false); }}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Kembali ke Beranda Backup
          </button>
        </div>
      )}
    </div>
  );
}

function DrTab() {
  const toast = useToast();
  const [isDrilling, setIsDrilling] = useState(false);
  const [drillLogs, setDrillLogs] = useState<string[]>([]);

  const startDrill = () => {
    setIsDrilling(true);
    setDrillLogs([
      '[00:01] Menginjeksikan simulasi gangguan pada Data Center Utama (Main DC)...',
      '[00:04] Heartbeat timeout terdeteksi pada Primary PostgreSQL Cluster.',
      '[00:08] Mengaktifkan protokol Disaster Recovery otomatis (Failover Sequence)...',
      '[00:15] Mempromosikan Hot Standby Replica di DR Region (AWS Singapore) menjadi Primary...',
      '[00:28] Mengalihkan DNS & Reverse Proxy Gateway ke DR Server Cluster...',
      '[00:42] Validasi integritas transaksi selesai. Semua servis SIMK berjalan normal di DR Site. (RTO: 42 Detik)'
    ]);
    toast.success('Simulasi Disaster Recovery (DR Drill) dimulai');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Rencana & Arsitektur Disaster Recovery (DR Plan)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Skema mitigasi bencana untuk menjamin ketersediaan layanan 24/7 (High Availability).
            </p>
          </div>
          <button
            onClick={startDrill}
            disabled={isDrilling}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2"
          >
            <PlayCircle className="w-4 h-4" /> Mulai Simulasi DR Drill
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Primary Data Center</div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">Jakarta (Equinix JK1)</div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Aktif & Sehat
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">DR Site Location</div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">Singapore (AWS ap-se-1)</div>
            <div className="text-[11px] text-blue-600 font-semibold">Hot Standby Sync</div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Target RTO</div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">&lt; 5 Menit</div>
            <div className="text-[11px] text-slate-500">Automated DNS Switch</div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Target RPO</div>
            <div className="text-sm font-bold text-slate-800 dark:text-white">&lt; 15 Menit</div>
            <div className="text-[11px] text-slate-500">Async Replication</div>
          </div>
        </div>
      </div>

      {isDrilling && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border-2 border-rose-500 space-y-4 animate-in fade-in duration-300">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-rose-600 text-sm flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-4 h-4" /> SIMULASI FAILOVER DR DRILL BERLANGSUNG
            </h3>
            <button
              onClick={() => { setIsDrilling(false); setDrillLogs([]); toast.info('Simulasi DR direset'); }}
              className="text-xs px-3 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-lg text-slate-700 dark:text-slate-300 font-semibold"
            >
              Reset Simulasi
            </button>
          </div>

          <div className="p-4 bg-slate-900 rounded-xl space-y-2 font-mono text-xs text-slate-300">
            {drillLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400">&gt;</span>
                <span className={idx === drillLogs.length - 1 ? 'text-emerald-400 font-bold' : ''}>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BackupManagement;
