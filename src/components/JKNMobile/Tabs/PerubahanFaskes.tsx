import React, { useState } from 'react';
import { MapPin, Save, Search, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function PerubahanFaskes() {
  const [faskesSaatIni, setFaskesSaatIni] = useState(() => localStorage.getItem('faskesPeserta') || 'Klinik Sehat Utama');
  const [faskesBaru, setFaskesBaru] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const daftarFaskes = [
    { nama: 'Puskesmas Melati', alamat: 'Jl. Mawar No. 10, Jakarta Selatan', jarak: '1.2 km', tipe: 'Puskesmas' },
    { nama: 'Klinik Keluarga Bahagia', alamat: 'Jl. Anggrek No. 25, Jakarta Selatan', jarak: '2.5 km', tipe: 'Klinik' },
    { nama: 'Puskesmas Cempaka', alamat: 'Jl. Cempaka No. 5, Jakarta Timur', jarak: '3.1 km', tipe: 'Puskesmas' },
    { nama: 'Dokter Praktik Mandiri dr. Ahmad', alamat: 'Jl. Kenanga No. 8, Jakarta Selatan', jarak: '1.8 km', tipe: 'DPM' },
    { nama: 'Klinik Sehat Sentosa', alamat: 'Jl. Melati No. 15, Jakarta Selatan', jarak: '2.0 km', tipe: 'Klinik' },
  ];

  const filteredFaskes = daftarFaskes.filter(f =>
    f.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faskesBaru) { toast.error('Pilih FKTP baru terlebih dahulu'); return; }
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem('faskesPeserta', faskesBaru);
      setIsSubmitting(false);
      setFaskesSaatIni(faskesBaru);
      setFaskesBaru('');
      toast.success('Perubahan FKTP berhasil diajukan');
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <MapPin className="w-6 h-6 text-teal-600" /> Perubahan Faskes (FKTP)
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Ajukan pindah Fasilitas Kesehatan Tingkat Pertama</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">FKTP Saat Ini</h3>
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-teal-600" />
            <div>
              <p className="font-bold text-slate-800 dark:text-white">{faskesSaatIni}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Terdaftar sejak: 10 Januari 2020</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Pilih FKTP Baru</h3>
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Cari FKTP berdasarkan nama atau alamat..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {filteredFaskes.map(faskes => (
              <label
                key={faskes.nama}
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                  faskesBaru === faskes.nama
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 ring-1 ring-teal-500'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <input type="radio" name="faskesBaru" checked={faskesBaru === faskes.nama} onChange={() => setFaskesBaru(faskes.nama)} className="w-4 h-4 text-teal-600" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800 dark:text-white">{faskes.nama}</p>
                    <span className="text-xs text-slate-400">{faskes.jarak}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{faskes.alamat}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded text-xs font-bold">{faskes.tipe}</span>
                </div>
              </label>
            ))}
            {filteredFaskes.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p>Tidak ada FKTP yang cocok dengan pencarian.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Informasi:</strong> Perubahan FKTP akan berlaku mulai tanggal 1 bulan berikutnya setelah pengajuan disetujui.
          </p>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 disabled:opacity-50 flex items-center justify-center gap-2">
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Memproses...' : 'Ajukan Perubahan FKTP'}
        </button>
      </form>
    </div>
  );
}
