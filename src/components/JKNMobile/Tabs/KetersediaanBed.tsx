import React, { useState } from 'react';
import { Bed, Search, MapPin, CheckCircle, Info } from 'lucide-react';

export function KetersediaanBed() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [bedData, setBedData] = useState(() => {
    
    
    const initial = [
      {
        id: 1,
        hospital: 'RSUD Kota Bandung',
        address: 'Jl. Klinik No. 22',
        distance: '2.4 km',
        updatedAt: '10 menit yang lalu',
        beds: [
          { kelas: 'Kelas 1', tersedia: 5, total: 20 },
          { kelas: 'Kelas 2', tersedia: 12, total: 30 },
          { kelas: 'Kelas 3', tersedia: 0, total: 50 },
          { kelas: 'ICU', tersedia: 2, total: 10 },
        ]
      },
      {
        id: 2,
        hospital: 'Klinik Hermina',
        address: 'Jl. Jenderal Sudirman No. 100',
        distance: '3.1 km',
        updatedAt: '25 menit yang lalu',
        beds: [
          { kelas: 'Kelas 1', tersedia: 2, total: 15 },
          { kelas: 'Kelas 2', tersedia: 8, total: 25 },
          { kelas: 'Kelas 3', tersedia: 15, total: 40 },
          { kelas: 'ICU', tersedia: 1, total: 8 },
        ]
      }
    ];

    return initial;
  });

  const filteredData = bedData.filter((h: any) => 
    h.hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Ketersediaan Tempat Tidur</h1>
          <p className="text-slate-500">Cek ketersediaan kamar di Klinik rujukan</p>
        </div>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Cari nama klinik..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none shadow-sm"
        />
      </div>

      <div className="space-y-4">
        {filteredData.map((hospital: any) => (
          <div key={hospital.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">{hospital.hospital}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" /> {hospital.address} • {hospital.distance}
                </p>
              </div>
              <span className="text-xs text-slate-500 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                Update: {hospital.updatedAt}
              </span>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {hospital.beds.map((bed: any, idx: number) => (
                <div key={idx} className={`p-3 rounded-xl border ${
                  bed.tersedia > 0 
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'
                }`}>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{bed.kelas}</p>
                  <div className="flex items-end gap-1">
                    <span className={`text-2xl font-bold ${
                      bed.tersedia > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    }`}>{bed.tersedia}</span>
                    <span className="text-sm text-slate-500 pb-1">/ {bed.total}</span>
                  </div>
                  {bed.tersedia === 0 && (
                    <p className="text-xs text-red-500 mt-1 font-medium">Penuh</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex gap-3 text-sm text-blue-800 dark:text-blue-300">
        <Info className="w-5 h-5 shrink-0" />
        <p>Data ketersediaan tempat tidur merupakan data real-time yang diupdate oleh masing-masing Fasilitas Kesehatan. Disarankan untuk tetap menghubungi Faskes terkait untuk kepastian.</p>
      </div>
    </div>
  );


}
