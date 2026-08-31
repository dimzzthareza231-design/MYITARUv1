import React, { useState } from 'react';
import { Users, Clock, CheckCircle, XCircle, Megaphone, RotateCcw, Activity, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAntrian, DAFTAR_POLI } from '../../contexts/AntrianContext';

export function PoliPelayanan() {
  const {
    antrianList, poliList,
    panggilAntrian, mulaiLayani, selesaikanAntrian, batalkanAntrian,
    resetAntrianHarian,
    totalPasienHariIni, totalMenunggu, totalDilayani, totalSelesai
  } = useAntrian();

  const [selectedPoli, setSelectedPoli] = useState<string>(DAFTAR_POLI[0].id);
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [filterStatus, setFilterStatus] = useState<string>('Menunggu');

  const poliAktif = DAFTAR_POLI.find(p => p.id === selectedPoli);
  const antrianPoli = antrianList.filter(a => a.poliId === selectedPoli);

  const filteredAntrianDisplay = antrianPoli.filter(a => {
    // Kategori
    if (filterKategori !== 'Semua') {
      if (filterKategori === 'BPJS' && a.penjamin !== 'BPJS Kesehatan') return false;
      if (filterKategori === 'Umum' && a.penjamin !== 'Umum/Tunai' && a.penjamin !== 'Umum/Pribadi') return false;
      if (filterKategori === 'Asuransi' && (a.penjamin === 'BPJS Kesehatan' || a.penjamin === 'Umum/Tunai' || a.penjamin === 'Umum/Pribadi')) return false;
    }
    // Status
    if (filterStatus !== 'Semua') {
       if (filterStatus === 'Menunggu' && a.status !== 'Menunggu') return false;
       if (filterStatus === 'Sedang Diperiksa' && a.status !== 'Dipanggil' && a.status !== 'Dilayani') return false;
       if (filterStatus === 'Selesai' && a.status !== 'Selesai') return false;
    }
    if (a.status === 'Batal') return false; // Hide cancelled by default in lists
    
    return true;
  });

  const antrianMenunggu = antrianPoli.filter(a => a.status === 'Menunggu');
  const antrianDipanggil = antrianPoli.find(a => a.status === 'Dipanggil' || a.status === 'Dilayani');

  // Aksi panggil pasien berikutnya
  const handlePanggil = () => {
    if (antrianMenunggu.length === 0) {
      toast.error('Tidak ada antrian yang menunggu');
      return;
    }
    const pasienBerikutnya = antrianMenunggu[0];
    panggilAntrian(pasienBerikutnya.id);
    toast.success(`📢 Memanggil: ${pasienBerikutnya.nomorAntrian} - ${pasienBerikutnya.namaPasien}`, {
      duration: 5000,
      icon: '🔔'
    });
  };

  const getStatusBadge = (status: string) => {
    const config: any = {
      'Menunggu': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      'Dipanggil': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      'Dilayani': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      'Selesai': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      'Batal': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };
    return config[status] || 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" /> Pelayanan Poli (Antrian Live)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Monitor antrian pasien per poli secara real-time
          </p>
        </div>
        <button
          onClick={resetAntrianHarian}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Reset Antrian
        </button>
      </div>

      {/* Statistik Global */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalPasienHariIni}</p>
            <p className="text-xs text-slate-500">Total Pasien</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalMenunggu}</p>
            <p className="text-xs text-slate-500">Menunggu</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Megaphone className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalDilayani}</p>
            <p className="text-xs text-slate-500">Dilayani</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalSelesai}</p>
            <p className="text-xs text-slate-500">Selesai</p>
          </div>
        </div>
      </div>

      {/* Grid Poli */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar: Daftar Poli */}
        <div className="lg:col-span-1 space-y-2">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 mb-3 text-sm">Pilih Poli Layanan</h2>
          {poliList.map(poli => {
            const jumlahAntrian = antrianList.filter(a => a.poliId === poli.id && a.status === 'Menunggu').length;
            const isActive = selectedPoli === poli.id;
            return (
              <button
                key={poli.id}
                onClick={() => setSelectedPoli(poli.id)}
                className={`group relative w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between shadow-2xs ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 dark:bg-blue-400 rounded-r-full" />
                )}

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform duration-200 shrink-0 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 scale-105' 
                      : 'bg-slate-100 dark:bg-slate-700 group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30'
                  }`}>
                    {poli.icon}
                  </div>
                  <div>
                    <p className={`font-bold text-sm transition-colors ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                      {poli.nama}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Kode: {poli.kode}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-transform duration-200 group-hover:scale-105 ${
                  jumlahAntrian > 0 
                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {jumlahAntrian} Antrian
                </span>
              </button>
            );
          })}
        </div>

        {/* Main: Antrian Poli Terpilih */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header Poli Terpilih */}
          {poliAktif && (
            <div className={`bg-gradient-to-r ${poliAktif.warna} rounded-xl p-6 text-white`}>
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-3xl">{poliAktif.icon}</span> {poliAktif.nama}
                  </h2>
                  <p className="text-white/80 mt-1">
                    Antrian menunggu: {antrianMenunggu.length} pasien
                  </p>
                </div>
                <button
                  onClick={handlePanggil}
                  disabled={antrianMenunggu.length === 0}
                  className="px-6 py-3 bg-white text-blue-700 rounded-lg font-bold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                >
                  <Megaphone className="w-5 h-5" /> Panggil Berikutnya
                </button>
              </div>
            </div>
          )}

          {/* Pasien Sedang Dipanggil/Dilayani */}
          {antrianDipanggil && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-purple-600 font-bold mb-1">SEDANG {antrianDipanggil.status.toUpperCase()}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold text-purple-700 dark:text-purple-300">{antrianDipanggil.nomorAntrian}</span>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">{antrianDipanggil.namaPasien}</p>
                      <p className="text-sm text-slate-500">No. RM: {antrianDipanggil.noRm}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {antrianDipanggil.status === 'Dipanggil' && (
                    <button
                      onClick={() => mulaiLayani(antrianDipanggil.id)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 text-sm"
                    >
                      Mulai Layani
                    </button>
                  )}
                  {antrianDipanggil.status === 'Dilayani' && (
                    <button
                      onClick={() => { selesaikanAntrian(antrianDipanggil.id); toast.success('Pasien selesai dilayani'); }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 text-sm flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" /> Selesai
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Filter & Daftar Antrian */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-500" />
                Daftar Antrian ({filteredAntrianDisplay.length})
              </h3>
              
              <div className="flex gap-2 text-sm">
                <select
                  value={filterKategori}
                  onChange={e => setFilterKategori(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Semua">Semua Kategori</option>
                  <option value="BPJS">BPJS</option>
                  <option value="Umum">Umum</option>
                  <option value="Asuransi">Asuransi/Lainnya</option>
                </select>
                
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Menunggu">Menunggu</option>
                  <option value="Sedang Diperiksa">Sedang Diperiksa</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredAntrianDisplay.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p>Tidak ada antrian yang cocok dengan filter.</p>
                </div>
              ) : (
                filteredAntrianDisplay.map((a, idx) => (
                  <div key={a.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 dark:text-white">{a.namaPasien}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusBadge(a.status)}`}>
                            {a.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500">
                          <span className="font-mono font-bold text-blue-600">{a.nomorAntrian}</span> • No. RM: {a.noRm} • Daftar: {a.jamDaftar}
                        </p>
                        {a.keluhan && <p className="text-xs text-slate-400 mt-1">Keluhan: {a.keluhan}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {a.status === 'Menunggu' && (
                        <>
                          <button
                            onClick={() => { panggilAntrian(a.id); toast.success(`📢 Memanggil: ${a.nomorAntrian} - ${a.namaPasien}`); }}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-xs font-bold hover:bg-blue-200"
                          >
                            Panggil
                          </button>
                          <button
                            onClick={() => { batalkanAntrian(a.id); toast.error('Antrian dibatalkan'); }}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {(a.status === 'Dipanggil' || a.status === 'Dilayani') && (
                        <button
                          onClick={() => { selesaikanAntrian(a.id); toast.success('Pasien selesai dilayani'); }}
                          className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded text-xs font-bold hover:bg-emerald-200 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Selesai
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
