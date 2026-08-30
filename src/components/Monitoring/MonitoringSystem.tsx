import React, { useState, useEffect } from 'react';
import { 
  Activity, AlertOctagon, LineChart, FileText, Server, Cpu, 
  Database, Network, CheckCircle2, AlertTriangle, RefreshCw, 
  Trash2, ShieldCheck, Terminal, Filter, Zap
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export function MonitoringSystem() {
  const [activeTab, setActiveTab] = useState<'health' | 'errors' | 'logs'>('health');

  const tabs = [
    { id: 'health', label: 'Kesehatan & Performa Server', icon: Activity },
    { id: 'errors', label: 'Pelacak Error Sistem (Sentry APM)', icon: AlertOctagon },
    { id: 'logs', label: 'Live Server & Engine Logs', icon: FileText },
  ] as const;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2.5 text-slate-900 dark:text-white">
            <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Monitoring Infrastruktur & Performa Sistem
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Telemetri metrik server, pelacak exception HTTP/Database, dan log transaksi real-time SIMK.
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
                ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400' 
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
        {activeTab === 'health' && <HealthTab />}
        {activeTab === 'errors' && <ErrorsTab />}
        {activeTab === 'logs' && <LogsTab />}
      </div>
    </div>
  );
}

function HealthTab() {
  const [cpu, setCpu] = useState(38);
  const [mem, setMem] = useState(58);
  const [disk, setDisk] = useState(42);
  const [latency, setLatency] = useState(48);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(prev => Math.min(95, Math.max(15, Math.round(prev + (Math.random() * 8 - 4)))));
      setMem(prev => Math.min(90, Math.max(40, Math.round(prev + (Math.random() * 4 - 2)))));
      setLatency(prev => Math.min(180, Math.max(25, Math.round(prev + (Math.random() * 12 - 6)))));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>Uptime Layanan SIMK</span>
            <Server className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">99.98%</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">SLA 30 Hari Terakhir (Tier 3 DC)</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>Rata-Rata Latensi API</span>
            <LineChart className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{latency} ms</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">HTTP REST & WebSocket Handshake</div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>Beban CPU Server</span>
            <Cpu className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{cpu}%</div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${cpu}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>Penggunaan RAM Memory</span>
            <Database className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{mem}%</div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${mem}%` }}></div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" />
          Matriks Status Layanan & Gateway Eksternal
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            { name: 'Basis Data Utama (PostgreSQL / Cloud SQL)', host: 'db-cluster-prod-01', ping: '1.2ms', status: 'ONLINE', color: 'bg-emerald-500' },
            { name: 'In-Memory Cache (Redis Cluster)', host: 'redis-prod.internal', ping: '0.4ms', status: 'ONLINE', color: 'bg-emerald-500' },
            { name: 'Gateway Kemenkes SatuSehat (FHIR)', host: 'api-satusehat.kemkes.go.id', ping: '42ms', status: 'ONLINE', color: 'bg-emerald-500' },
            { name: 'Bridge BPJS Kesehatan (VClaim / Antrean)', host: 'apijkn.bpjs-kesehatan.go.id', ping: '65ms', status: 'ONLINE', color: 'bg-emerald-500' },
            { name: 'PACS Image Archive Storage (S3 / GCS)', host: 'storage-apac.cloud', ping: '24ms', status: 'ONLINE', color: 'bg-emerald-500' },
            { name: 'Worker Antrean & Engine Notifikasi', host: 'queue-worker-02', ping: '2.1ms', status: 'ONLINE', color: 'bg-emerald-500' },
          ].map(svc => (
            <div key={svc.name} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 dark:text-white">{svc.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{svc.host} • {svc.ping}</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${svc.color} animate-pulse`}></span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{svc.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorsTab() {
  const toast = useToast();
  const [errors, setErrors] = useState([
    { id: 'ERR-501', path: '/api/v1/satusehat/encounter/sync', msg: 'Timeout connecting to SatuSehat IHS sandbox endpoint', count: 12, status: 'Open', lastSeen: '2 menit lalu', severity: 'High' },
    { id: 'ERR-402', path: '/api/v1/billing/qris/callback', msg: 'Invalid signature payload structure from Payment Gateway', count: 4, status: 'Open', lastSeen: '15 menit lalu', severity: 'Medium' },
    { id: 'ERR-500', path: '/api/v1/patient/register/lock', msg: 'Database deadlock detected during rapid queue registration', count: 1, status: 'Resolved', lastSeen: '2 jam lalu', severity: 'Critical' },
    { id: 'ERR-404', path: '/api/v1/pharmacy/recipe/not-found', msg: 'Recipe ID R-9912 not present in active prescription table', count: 2, status: 'Resolved', lastSeen: '1 hari lalu', severity: 'Low' },
  ]);

  const resolveErr = (id: string) => {
    setErrors(errors.map(e => (e.id === id ? { ...e, status: 'Resolved' } : e)));
    toast.success(`Error ${id} berhasil ditandai sebagai Resolved`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-500" />
            Pelacak Exception & Error Log (APM)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar kegagalan API, unhandled promise, dan respon status kode 4xx/5xx yang tertangkap.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 uppercase font-bold tracking-wider">
            <tr>
              <th className="p-3.5">Error ID</th>
              <th className="p-3.5">Endpoint / Path</th>
              <th className="p-3.5">Pesan Error</th>
              <th className="p-3.5 text-center">Frekuensi</th>
              <th className="p-3.5">Terakhir Terjadi</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Opsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {errors.map(e => (
              <tr key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition-colors">
                <td className="p-3.5 font-mono font-bold text-rose-600 dark:text-rose-400">{e.id}</td>
                <td className="p-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-300 font-semibold">{e.path}</td>
                <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200 max-w-xs">{e.msg}</td>
                <td className="p-3.5 text-center font-mono">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                    {e.count}x
                  </span>
                </td>
                <td className="p-3.5 text-slate-500 dark:text-slate-400 text-[11px]">{e.lastSeen}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      e.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}
                  >
                    {e.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  {e.status === 'Open' ? (
                    <button
                      onClick={() => resolveErr(e.id)}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold transition"
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="text-slate-400 text-xs flex items-center justify-end gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Selesai
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LogsTab() {
  const toast = useToast();
  const [logs, setLogs] = useState([
    { time: '10:00:01', level: 'INFO', msg: 'HTTP GET /api/v1/health - 200 OK - 12ms (Client: 192.168.1.102)' },
    { time: '10:00:05', level: 'INFO', msg: 'DB Query executed: SELECT * FROM pasien WHERE nik = $1 (Latency: 4ms)' },
    { time: '10:00:12', level: 'WARN', msg: 'Slow query detected on [tb_kunjungan_rawat_jalan]. Duration: 420ms' },
    { time: '10:00:15', level: 'ERROR', msg: 'Failed to sync with SatuSehat: Connection Timeout (Retrying...)' },
    { time: '10:00:16', level: 'INFO', msg: 'Retry worker queued task [SATUSEHAT_SYNC_09] with backoff 5s' },
    { time: '10:00:22', level: 'INFO', msg: 'BPJS VClaim Bridging: Peserta BPJS 000123456789 verified status: AKTIF' },
    { time: '10:00:30', level: 'INFO', msg: 'E-Resep R-2026-0081 successfully dispatched to Apotek Rawat Jalan' }
  ]);

  const clearLogs = () => {
    setLogs([]);
    toast.success('Live log console dibersihkan');
  };

  return (
    <div className="bg-slate-900 rounded-2xl shadow-sm p-6 border border-slate-800 flex flex-col space-y-4 text-slate-300 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="font-bold text-white flex items-center gap-2 text-sm">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Terminal Live Server Engine Logs
        </div>
        <button
          onClick={clearLogs}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Bersihkan Console
        </button>
      </div>

      <div className="space-y-1.5 overflow-y-auto max-h-96 custom-scrollbar pr-2">
        {logs.length === 0 ? (
          <div className="text-slate-500 py-8 text-center">Console log kosong.</div>
        ) : (
          logs.map((l, i) => (
            <div key={i} className="flex items-start gap-2.5 hover:bg-slate-800/40 p-1 rounded">
              <span className="text-slate-500 shrink-0">[{l.time}]</span>
              <span
                className={`font-bold shrink-0 ${
                  l.level === 'INFO'
                    ? 'text-blue-400'
                    : l.level === 'WARN'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {l.level}
              </span>
              <span className="text-slate-200">{l.msg}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MonitoringSystem;
