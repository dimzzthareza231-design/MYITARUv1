import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Calendar, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export function AntreanOnline() {
  const [antreanList, setAntreanList] = useState<any[]>([]);
  const [selectedFaskes, setSelectedFaskes] = useState('');
  const [selectedTanggal, setSelectedTanggal] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const saved = localStorage.getItem('simrs_jkn_antrean');
    if (saved) {
      setAntreanList(JSON.parse(saved));
    } else {
      const dummyData = [
        {
          id: 1,
          noAntrean: 'A-015',
          tanggal: '2026-02-10',
          faskes: 'Klinik Sehat Utama',
          poli: 'Poli Umum',
          status: 'Menunggu',
          estimasi: '30 menit'
        }
      ];
      setAntreanList(dummyData);
    }
  };

  const handleAmbilAntrean = () => {
    if (!selectedFaskes || !selectedTanggal) {
      toast.error('Pilih faskes dan tanggal terlebih dahulu');
      return;
    }
    const newAntrean = {
      id: Date.now(),
      noAntrean: `A-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      tanggal: selectedTanggal,
      faskes: selectedFaskes,
      poli: 'Poli Umum',
      status: 'Menunggu',
      estimasi: `${Math.floor(Math.random() * 60) + 10} menit`
    };
    const updated = [newAntrean, ...antreanList];
    setAntreanList(updated);
    localStorage.setItem('simrs_jkn_antrean', JSON.stringify(updated));
    toast.success(`Antrean berhasil diambil: ${newAntrean.noAntrean}`);
  };


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Antrean Online</h1>
          <p className="text-slate-500">Ambil nomor antrean untuk kunjungan ke faskes</p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-bold mb-4 text-slate-800 dark:text-white">Ambil Antrean Baru</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pilih Faskes</label>
            <select 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
              value={selectedFaskes}
              onChange={(e) => setSelectedFaskes(e.target.value)}
            >
              <option value="">-- Pilih Faskes --</option>
              <option value="Klinik Sehat Utama">Klinik Sehat Utama</option>
              <option value="Puskesmas Melati">Puskesmas Melati</option>
              <option value="Klinik MyItaru">Klinik MyItaru</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal Kunjungan</label>
            <input 
              type="date" 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
              value={selectedTanggal}
              onChange={(e) => setSelectedTanggal(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleAmbilAntrean}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Ambil Antrean
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-800 dark:text-white">Daftar Antrean Saya</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-3 text-left">No Antrean</th>
              <th className="p-3 text-left">Tanggal</th>
              <th className="p-3 text-left">Faskes</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Estimasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {antreanList.map((antrean) => (
              <tr key={antrean.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="p-3 font-bold text-blue-600">{antrean.noAntrean}</td>
                <td className="p-3">{antrean.tanggal}</td>
                <td className="p-3">{antrean.faskes}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    antrean.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' :
                    antrean.status === 'Dilayani' ? 'bg-green-100 text-green-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {antrean.status}
                  </span>
                </td>
                <td className="p-3">{antrean.estimasi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
