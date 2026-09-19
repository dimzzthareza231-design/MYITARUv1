import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, Shield, Database, Lock, Search, Filter, RefreshCw, 
  Download, Trash2, CheckCircle2, XCircle, AlertTriangle, Clock, 
  User, Globe, Laptop, Terminal, Play, Pause, Eye, Copy, Check,
  Radio, Server, ArrowUpRight, ArrowDownRight, Layers
} from 'lucide-react';
import { 
  ActivityLogEntry, 
  ActivityCategory, 
  ActivityStatus, 
  subscribeActivityLogs, 
  clearActivityLogs, 
  exportLogsToCsv, 
  simulateActivityEvent 
} from '../../lib/activityLogger';
import { isFirebaseConfigured } from '../../lib/firebase';
import { Modal } from '../Modal';
import toast from 'react-hot-toast';

export function ActivityLogsTab() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | ActivityCategory>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ActivityStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [inspectingLog, setInspectingLog] = useState<ActivityLogEntry | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Subscribe to real-time logs
  useEffect(() => {
    if (!isLiveStreaming) return;
    const unsubscribe = subscribeActivityLogs((newLogs) => {
      setLogs(newLogs);
    });
    return () => unsubscribe();
  }, [isLiveStreaming]);

  // Statistics
  const stats = useMemo(() => {
    const total = logs.length;
    const authLogs = logs.filter(l => l.category === 'auth');
    const authSuccess = authLogs.filter(l => l.status === 'SUCCESS').length;
    const authFailed = authLogs.filter(l => l.status === 'FAILED' || l.status === 'DENIED').length;

    const dbLogs = logs.filter(l => l.category === 'database');
    const dbReads = dbLogs.filter(l => l.details?.operationType === 'READ' || l.details?.operationType === 'SUBSCRIBE').length;
    const dbWrites = dbLogs.filter(l => l.details?.operationType === 'WRITE' || l.details?.operationType === 'DELETE').length;

    const securityAlerts = logs.filter(l => l.status === 'DENIED' || l.category === 'security').length;

    const latencies = logs.filter(l => l.details?.latencyMs).map(l => l.details.latencyMs as number);
    const avgLatency = latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 24;

    return {
      total,
      authSuccess,
      authFailed,
      dbReads,
      dbWrites,
      securityAlerts,
      avgLatency
    };
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Category filter
      if (selectedCategory !== 'all' && log.category !== selectedCategory) return false;
      // Status filter
      if (selectedStatus !== 'all' && log.status !== selectedStatus) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inAction = log.action.toLowerCase().includes(q);
        const inTarget = log.target.toLowerCase().includes(q);
        const inEmail = (log.user?.email || '').toLowerCase().includes(q);
        const inName = (log.user?.nama || '').toLowerCase().includes(q);
        const inMessage = (log.details?.message || '').toLowerCase().includes(q);
        const inIp = (log.details?.ipAddress || '').toLowerCase().includes(q);
        if (!inAction && !inTarget && !inEmail && !inName && !inMessage && !inIp) {
          return false;
        }
      }
      return true;
    });
  }, [logs, selectedCategory, selectedStatus, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Disalin ke clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulate = async (type: 'auth_success' | 'auth_failed' | 'db_read' | 'db_write' | 'security_alert') => {
    setIsSimulating(true);
    try {
      await simulateActivityEvent(type);
      toast.success('Percobaan aktivitas berhasil disimulasikan secara real-time.');
    } catch (e: any) {
      toast.error('Gagal simulasi: ' + e.message);
    } finally {
      setIsSimulating(false);
    }
  };

  const getStatusBadge = (status: ActivityStatus) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            SUCCESS
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3 h-3" />
            FAILED
          </span>
        );
      case 'DENIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3" />
            DENIED
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
            <AlertTriangle className="w-3 h-3" />
            WARNING
          </span>
        );
    }
  };

  const getCategoryIcon = (cat: ActivityCategory) => {
    switch (cat) {
      case 'auth':
        return <Lock className="w-4 h-4 text-sky-500" />;
      case 'database':
        return <Database className="w-4 h-4 text-emerald-500" />;
      case 'security':
        return <Shield className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div id="activity-logs-module" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    Activity & Security Logs
                  </h2>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isLiveStreaming 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' 
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                    {isLiveStreaming ? 'LIVE STREAMING' : 'STREAM PAUSED'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Pemantauan waktu nyata (real-time) autentikasi Firebase Auth dan akses transaksi database Cloud Firestore.
                </p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              id="toggle-stream-btn"
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                isLiveStreaming 
                  ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800' 
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              }`}
            >
              {isLiveStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isLiveStreaming ? 'Jeda Stream' : 'Lanjutkan Stream'}
            </button>

            <button
              id="export-csv-btn"
              onClick={() => exportLogsToCsv(filteredLogs)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh CSV
            </button>

            <button
              id="clear-logs-btn"
              onClick={() => {
                if (window.confirm('Bersihkan seluruh riwayat log di tampilan lokal saat ini?')) {
                  clearActivityLogs();
                  toast.success('Log aktivitas dibersihkan');
                }
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Bersihkan
            </button>
          </div>
        </div>

        {/* Real-Time Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/60">
          <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Event</span>
              <Layers className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-white font-mono">{stats.total}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Semua rekaman aktivitas</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Auth Berhasil</span>
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">{stats.authSuccess}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Login valid terkonfirmasi</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Auth Gagal</span>
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <p className="text-xl font-bold text-rose-600 dark:text-rose-400 font-mono">{stats.authFailed}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Sandi salah / ditolak</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">DB Reads</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <p className="text-xl font-bold text-sky-600 dark:text-sky-400 font-mono">{stats.dbReads}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Queries & snapshots</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">DB Writes</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500" />
            </div>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">{stats.dbWrites}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Inserts & updates</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-200/70 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Avg Latency</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400 font-mono">{stats.avgLatency} ms</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Firebase roundtrip</p>
          </div>
        </div>

        {/* Real-Time Live Activity Simulator Bar */}
        <div className="mt-5 p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                Uji Coba Percobaan Akses (Live Simulator)
              </p>
              <p className="text-[11px] text-indigo-700/80 dark:text-indigo-400/80">
                Kirim event simulasi untuk memvalidasi penangkapan real-time log autentikasi dan database.
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              disabled={isSimulating}
              onClick={() => handleSimulate('auth_success')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors shadow-xs"
            >
              + Sim. Google Auth
            </button>
            <button
              disabled={isSimulating}
              onClick={() => handleSimulate('auth_failed')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-400 transition-colors shadow-xs"
            >
              + Sim. Login Gagal
            </button>
            <button
              disabled={isSimulating}
              onClick={() => handleSimulate('db_read')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 border border-slate-200 dark:border-slate-700 hover:border-sky-400 transition-colors shadow-xs"
            >
              + Sim. DB Read
            </button>
            <button
              disabled={isSimulating}
              onClick={() => handleSimulate('db_write')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 transition-colors shadow-xs"
            >
              + Sim. DB Write
            </button>
            <button
              disabled={isSimulating}
              onClick={() => handleSimulate('security_alert')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-colors shadow-xs"
            >
              + Sim. Akses Ditolak
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Category Filter Pills */}
        <div className="flex items-center flex-wrap gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            Semua ({logs.length})
          </button>
          <button
            onClick={() => setSelectedCategory('auth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              selectedCategory === 'auth'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Lock className="w-3 h-3" />
            Auth ({logs.filter(l => l.category === 'auth').length})
          </button>
          <button
            onClick={() => setSelectedCategory('database')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              selectedCategory === 'database'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Database className="w-3 h-3" />
            Firestore ({logs.filter(l => l.category === 'database').length})
          </button>
          <button
            onClick={() => setSelectedCategory('security')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              selectedCategory === 'security'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3 h-3" />
            Security ({logs.filter(l => l.category === 'security').length})
          </button>
        </div>

        {/* Status Dropdown & Search Input */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">Status: Semua</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
            <option value="DENIED">DENIED</option>
            <option value="WARNING">WARNING</option>
          </select>

          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari user, action, IP, target..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main Activity Stream Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Waktu & Kategori</th>
                <th className="p-3.5">Aksi (Event)</th>
                <th className="p-3.5">Target Resource</th>
                <th className="p-3.5">User / Aktor</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Latency</th>
                <th className="p-3.5 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-mono text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 dark:text-slate-500 font-sans">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-semibold">Belum ada log aktivitas yang cocok dengan kriteria filter.</p>
                    <p className="text-xs mt-1">Uji coba event menggunakan tombol simulator di atas.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const date = new Date(log.timestamp);
                  const timeFormatted = date.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                  });
                  const dateFormatted = date.toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short'
                  });

                  return (
                    <tr 
                      key={log.id} 
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors group cursor-pointer"
                      onClick={() => setInspectingLog(log)}
                    >
                      {/* Waktu & Kategori */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/80">
                            {getCategoryIcon(log.category)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">
                              {timeFormatted}
                            </p>
                            <p className="text-[10px] text-slate-400 font-sans uppercase">
                              {dateFormatted} • {log.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Aksi (Event) */}
                      <td className="p-3.5">
                        <div>
                          <p className="font-bold text-indigo-600 dark:text-indigo-400">
                            {log.action}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sans line-clamp-1">
                            {log.details?.message || '-'}
                          </p>
                        </div>
                      </td>

                      {/* Target Resource */}
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[11px]">
                          {log.target}
                        </span>
                      </td>

                      {/* User / Aktor */}
                      <td className="p-3.5 font-sans">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {log.user?.nama || log.user?.email || 'Anonymous'}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {log.user?.email || 'System Operation'} {log.user?.roleId ? `[${log.user.roleId}]` : ''}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5 whitespace-nowrap font-sans">
                        {getStatusBadge(log.status)}
                      </td>

                      {/* Latency */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <span className={`font-bold ${
                          (log.details?.latencyMs || 0) > 100 
                            ? 'text-amber-500' 
                            : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {log.details?.latencyMs ? `${log.details.latencyMs} ms` : '-'}
                        </span>
                      </td>

                      {/* Inspect Button */}
                      <td className="p-3.5 text-center font-sans">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectingLog(log);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                          title="Lihat Rincian Teknis"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              Firestore Backend: <strong className="text-slate-700 dark:text-slate-300">collective-district-db34d</strong> (Project ID)
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            Menampilkan {filteredLogs.length} dari {logs.length} entri riwayat
          </span>
        </div>
      </div>

      {/* Deep Log Inspection Modal */}
      {inspectingLog && (
        <Modal
          isOpen={true}
          onClose={() => setInspectingLog(null)}
          title="Rincian Aktivitas & Audit Forensik"
        >
          <div className="space-y-4 text-xs font-sans text-slate-700 dark:text-slate-300">
            {/* Top Status Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs">
                  {getCategoryIcon(inspectingLog.category)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                    {inspectingLog.action}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    ID: {inspectingLog.id}
                  </p>
                </div>
              </div>
              {getStatusBadge(inspectingLog.status)}
            </div>

            {/* Technical Detail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">Timestamp</span>
                <p className="font-mono text-xs font-bold text-slate-800 dark:text-white mt-0.5">
                  {inspectingLog.timestamp}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">Target Path / Collection</span>
                <p className="font-mono text-xs font-bold text-slate-800 dark:text-white mt-0.5">
                  {inspectingLog.target}
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">User / Aktor</span>
                <p className="font-mono text-xs font-bold text-slate-800 dark:text-white mt-0.5">
                  {inspectingLog.user.nama || inspectingLog.user.email || 'Anonymous'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {inspectingLog.user.email} (Role: {inspectingLog.user.roleId || '-'})
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">Latency & Operation</span>
                <p className="font-mono text-xs font-bold text-slate-800 dark:text-white mt-0.5">
                  {inspectingLog.details.latencyMs ? `${inspectingLog.details.latencyMs} ms` : '-'} • Type: {inspectingLog.details.operationType || 'AUTH'}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  IP: {inspectingLog.details.ipAddress || '192.168.1.101'}
                </p>
              </div>
            </div>

            {/* Description message */}
            {inspectingLog.details.message && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] uppercase font-bold text-slate-400">Keterangan Aktivitas</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                  {inspectingLog.details.message}
                </p>
              </div>
            )}

            {/* Raw JSON Payload */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Payload JSON Mentah</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(inspectingLog, null, 2), inspectingLog.id)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                >
                  {copiedId === inspectingLog.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === inspectingLog.id ? 'Tersalin' : 'Salin JSON'}
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-48 border border-slate-800">
                {JSON.stringify(inspectingLog, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectingLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
