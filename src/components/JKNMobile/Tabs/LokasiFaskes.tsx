import React, { useState } from 'react';
import { MapPin, Search, Phone, Navigation, Star, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export function LokasiFaskes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipe, setFilterTipe] = useState('Semua');

  const daftarFaskes = [
    { id: 1, nama: 'Klinik MyItaru Pusat', tipe: 'Klinik', alamat: 'Jl. Sudirman No. 100, Jakarta Selatan', telepon: '021-1234567', jarak: '0.5 km', rating: 4.5, jam: '24 Jam' },
    { id: 2, nama: 'Puskesmas Melati', tipe: 'Puskesmas', alamat: 'Jl. Mawar No. 10, Jakarta Selatan', telepon: '021-2345678', jarak: '1.2 km', rating: 4.2, jam: '07:00 - 21:00' },
    { id: 3, nama: 'Klinik Sehat Utama', tipe: 'Klinik', alamat: 'Jl. Anggrek No. 25, Jakarta Selatan', telepon: '021-3456789', jarak: '2.5 km', rating: 4.3, jam: '08:00 - 20:00' },
    { id: 4, nama: 'Klinik Cipto Mangunkusumo', tipe: 'Klinik', alamat: 'Jl. Diponegoro No. 71, Jakarta Pusat', telepon: '021-4567890', jarak: '5.8 km', rating: 4.7, jam: '24 Jam' },
    { id: 5, nama: 'Klinik Keluarga Bahagia', tipe: 'Klinik', alamat: 'Jl. Kenanga No. 8, Jakarta Selatan', telepon: '021-5678901', jarak: '1.8 km', rating: 4.1, jam: '08:00 - 17:00' },
    { id: 6, nama: 'Puskesmas Cempaka', tipe: 'Puskesmas', alamat: 'Jl. Cempaka No. 5, Jakarta Timur', telepon: '021-6789012', jarak: '3.1 km', rating: 4.0, jam: '07:00 - 14:00' },
  ];

  const tipeList = ['Semua', 'Klinik', 'Puskesmas', 'Klinik'];

  const filtered = daftarFaskes.filter(f => {
    const matchSearch = f.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.alamat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTipe = filterTipe === 'Semua' || f.tipe === filterTipe;
    return matchSearch && matchTipe;
  });

  const handleTelepon = (telepon: string, nama: string) => {
    toast.success(`Menghubungi ${nama} di ${telepon} (simulasi)`);
  };

  const handleNavigasi = (nama: string) => {
    toast.success(`Membuka navigasi ke ${nama} (simulasi)`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-teal-600" /> Info Lokasi Faskes
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Cari fasilitas kesehatan terdekat beserta nomor telepon dan jarak</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari faskes berdasarkan nama atau alamat..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {tipeList.map(tipe => (
            <button
              key={tipe}
              onClick={() => setFilterTipe(tipe)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filterTipe === tipe
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {tipe}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(faskes => (
          <div key={faskes.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-white">{faskes.nama}</h3>
                <span className="inline-block mt-1 px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded text-xs font-bold">{faskes.tipe}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold">{faskes.rating}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{faskes.alamat}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>{faskes.telepon}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span>{faskes.jam}</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 shrink-0" />
                <span className="font-bold text-teal-600">{faskes.jarak}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleTelepon(faskes.telepon, faskes.nama)}
                className="flex-1 px-3 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> Telepon
              </button>
              <button
                onClick={() => handleNavigasi(faskes.nama)}
                className="flex-1 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" /> Navigasi
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Tidak ada faskes yang cocok dengan pencarian.</p>
          </div>
        )}
      </div>
    </div>
  );
}
