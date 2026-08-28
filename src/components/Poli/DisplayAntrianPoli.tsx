import React, { useEffect, useState } from 'react';
import { Volume2, Clock } from 'lucide-react';
import { useAntrian, DAFTAR_POLI } from '../../contexts/AntrianContext';

export function DisplayAntrianPoli() {
  const { antrianList } = useAntrian();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update jam setiap detik
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Ambil pasien yang sedang Dipanggil atau Dilayani per poli
  const antrianAktif = DAFTAR_POLI.map(poli => {
    const sedangDipanggil = antrianList.find(a =>
      a.poliId === poli.id && (a.status === 'Dipanggil' || a.status === 'Dilayani')
    );
    return { poli, antrian: sedangDipanggil };
  }).filter(item => item.antrian);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">🏥 MYITARU SIMRS - Antrian Poli</h1>
        <div className="flex items-center justify-center gap-2 text-blue-300">
          <Clock className="w-6 h-6" />
          <span className="text-2xl font-mono">
            {currentTime.toLocaleTimeString('id-ID')} WIB
          </span>
        </div>
      </div>

      {/* Grid Poli dengan Nomor Antrian Aktif */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {DAFTAR_POLI.map(poli => {
          const antrianPoli = antrianList.find(a =>
            a.poliId === poli.id && (a.status === 'Dipanggil' || a.status === 'Dilayani')
          );
          const menunggu = antrianList.filter(a => a.poliId === poli.id && a.status === 'Menunggu').length;

          return (
            <div key={poli.id} className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 ${
              antrianPoli ? 'ring-2 ring-blue-400 animate-pulse-slow' : ''
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{poli.icon}</span>
                <h2 className="text-xl font-bold">{poli.nama}</h2>
              </div>

              {antrianPoli ? (
                <div className="text-center py-6">
                  <p className="text-sm text-blue-300 mb-2">NOMOR ANTRIAN SAAT INI</p>
                  <div className="text-7xl font-bold text-white mb-3">{antrianPoli.nomorAntrian}</div>
                  <p className="text-lg text-blue-200">{antrianPoli.namaPasien}</p>
                  <div className="mt-3 inline-block px-4 py-1 bg-blue-500 rounded-full text-sm font-bold">
                    {antrianPoli.status === 'Dipanggil' ? '🔔 SEDANG DIPANGGIL' : '⚕️ SEDANG DILAYANI'}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <p className="text-lg">Tidak ada antrian aktif</p>
                  <p className="text-sm mt-1">{menunggu} pasien menunggu</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/10 text-sm text-blue-300 text-center">
                Antrian menunggu: <span className="font-bold text-white">{menunggu}</span> pasien
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-10 text-blue-400 text-sm flex items-center justify-center gap-2">
        <Volume2 className="w-4 h-4" />
        Sistem antrian diperbarui secara otomatis (live)
      </div>
    </div>
  );
}
