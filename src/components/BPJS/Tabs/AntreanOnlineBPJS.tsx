import React, { useState, useEffect } from 'react';
import {
  Clock, Users, CheckCircle, XCircle, RefreshCw,
  Smartphone, MapPin, Activity, Plus, Search
} from 'lucide-react';
import toast from 'react-hot-toast';

export function AntreanOnlineBPJS() {
  const [antreanList, setAntreanList] = useState<any[]>(() => {
    const saved = localStorage.getItem('simrs_bpjs_antrean_online');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ANT-001',
        noAntrean: 'A-001',
        tanggal: new Date().toISOString().split('T')[0],
        jamDaftar: '08:15',
        namaPasien: 'Budi Santoso',
        noKartu: '0001234567891',
        poli: 'Poli Umum',
        dokter: 'dr. Ahmad',
        jenis: 'Mobile JKN',
        status: 'Menunggu',
        estimasi: '09:30'
      },
      {
        id: 'ANT-002',
        noAntrean: 'A-002',
        tanggal: new Date().toISOString().split('T')[0],
        jamDaftar: '08:20',
        namaPasien: 'Siti Aminah',
        noKartu: '0001234567892',
        poli: 'Poli Gigi',
        dokter: 'drg. Rina',
        jenis: 'Walk-in',
        status: 'Dipanggil',
        estimasi: '09:45'
      }
    ];
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {

  }, [antreanList]);
  const handlePanggil = (id: string) => {
    setAntreanList(antreanList.map(a =>
      a.id === id ? { ...a, status: 'Dipanggil' } : a
    ));
    toast.success('Pasien dipanggil');
  };

  const handleSelesai = (id: string) => {
    setAntreanList(antreanList.map(a =>
      a.id === id ? { ...a, status: 'Selesai' } : a
    ));
    toast.success('Pasien selesai dilayani');
  };

  const handleBatal = (id: string) => {
    if (window.confirm('Batalkan antrean ini?')) {
      setAntreanList(antreanList.map(a =>
        a.id === id ? { ...a, status: 'Batal' } : a
      ));
      toast.success('Antrean dibatalkan');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Data antrean di-refresh dari Mobile JKN');
    }, 1500);
  };

  const stats = {
    total: antreanList.length,
    menunggu: antreanList.filter(a => a.status === 'Menunggu').length,
    dipanggil: antreanList.filter(a => a.status === 'Dipanggil').length,
    selesai: antreanList.filter(a => a.status === 'Selesai').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Antrean Online BPJS</h1>
          <p className="text-slate-500 dark:text-slate-400">Integrasi dengan Mobile JKN dan sistem antrean klinik</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Menyinkronkan...' : 'Refresh dari Mobile JKN'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center shadow-sm">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Total Antrean</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center shadow-sm">
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.menunggu}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Menunggu</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center shadow-sm">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.dipanggil}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Dipanggil</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center shadow-sm">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.selesai}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Selesai</div>
        </div>
      </div>

      {/* Daftar Antrean */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">No Antrean</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Pasien</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Poli / Dokter</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Jenis</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Estimasi</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {antreanList.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4">
                    <div className="font-bold text-lg text-slate-800 dark:text-white font-mono">{a.noAntrean}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{a.jamDaftar}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-800 dark:text-white">{a.namaPasien}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{a.noKartu}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{a.poli}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{a.dokter}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      a.jenis === 'Mobile JKN' 
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {a.jenis === 'Mobile JKN' ? '📱 Mobile JKN' : '🚶 Walk-in'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">{a.estimasi}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      a.status === 'Menunggu' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' :
                      a.status === 'Dipanggil' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' :
                      a.status === 'Selesai' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' :
                      'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      {a.status === 'Menunggu' && (
                        <button
                          onClick={() => handlePanggil(a.id)}
                          className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        >
                          Panggil
                        </button>
                      )}
                      {a.status === 'Dipanggil' && (
                        <button
                          onClick={() => handleSelesai(a.id)}
                          className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                        >
                          Selesai
                        </button>
                      )}
                      {(a.status === 'Menunggu' || a.status === 'Dipanggil') && (
                        <button
                          onClick={() => handleBatal(a.id)}
                          className="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold rounded hover:bg-red-100 dark:hover:bg-red-900/50"
                        >
                          Batal
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {antreanList.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 dark:text-slate-400">Belum ada data antrean.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Integrasi */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
          <Smartphone className="w-5 h-5" /> Informasi Integrasi Mobile JKN
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700 dark:text-blue-300">
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">Status Koneksi</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Terhubung
            </div>
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">Antrean dari Mobile JKN</div>
            <div className="mt-1">{antreanList.filter(a => a.jenis === 'Mobile JKN').length} pasien</div>
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">Sinkronisasi Terakhir</div>
            <div className="mt-1">{new Date().toLocaleString('id-ID')}</div>
          </div>
        </div>
      </div>
    </div>
  );


}
