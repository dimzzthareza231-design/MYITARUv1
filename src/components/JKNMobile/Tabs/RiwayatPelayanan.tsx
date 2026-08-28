import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Activity, Pill, User, Search } from 'lucide-react';

export function RiwayatPelayanan() {
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('riwayatPelayanan');
    if (saved) {
      setRiwayat(JSON.parse(saved));
    } else {
      // Data dummy awal jika kosong
      const initialData = [
        {
          id: 1,
          tanggal: '10 Agustus 2026',
          faskes: 'Klinik Sehat Utama',
          poli: 'Poli Umum',
          dokter: 'dr. Andi Permana',
          diagnosa: 'J06.9 - Acute upper respiratory infection',
          tindakan: ['Konsultasi Medis', 'Pemeriksaan Fisik'],
          obat: ['Paracetamol 500mg (3x1)', 'Amoxicillin 500mg (3x1)'],
        },
        {
          id: 2,
          tanggal: '15 Juni 2026',
          faskes: 'Klinik Sehat Utama',
          poli: 'Poli Gigi',
          dokter: 'drg. Sarah Wijaya',
          diagnosa: 'K04.0 - Pulpitis',
          tindakan: ['Tumpatan Gigi', 'Scaling'],
          obat: ['Asam Mefenamat 500mg (3x1)'],
        }
      ];
      setRiwayat(initialData);
      localStorage.setItem('riwayatPelayanan', JSON.stringify(initialData));
    }
  }, []);

  const filteredRiwayat = riwayat.filter(r => 
    r.diagnosa.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.faskes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Riwayat Pelayanan (i-Care)</h1>
          <p className="text-slate-500">Akses rekam medis digital Anda di fasilitas kesehatan JKN</p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari riwayat (diagnosa, faskes)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none shadow-sm"
        />
      </div>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-teal-300 before:to-transparent">
        {filteredRiwayat.map((item, index) => (
          <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 bg-teal-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <FileText className="w-4 h-4" />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-teal-700 dark:text-teal-400">{item.faskes}</h3>
                <span className="text-xs font-medium bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {item.tanggal}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-800 dark:text-white flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-slate-400" /> {item.dokter} ({item.poli})
                </p>
                <div className="bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-300 p-2 rounded-lg text-sm font-medium border border-red-100 dark:border-red-900/30">
                  <span className="font-bold">Dx:</span> {item.diagnosa}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-700 pt-3">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Activity className="w-3 h-3" /> Tindakan
                  </p>
                  <ul className="text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                    {item.tindakan.map((t: string, i: number) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Pill className="w-3 h-3" /> Obat
                  </p>
                  <ul className="text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                    {item.obat.map((o: string, i: number) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredRiwayat.length === 0 && (
          <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500">Tidak ada riwayat pelayanan yang ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}
