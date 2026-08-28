import React, { useState } from 'react';
import { Search, User, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function InfoPeserta() {
  const [searchType, setSearchType] = useState('nik');
  const [searchValue, setSearchValue] = useState('');
  const [pesertaData, setPesertaData] = useState<any>(null);

  const handleSearch = () => {
    if (!searchValue) {
      toast.error('Masukkan nomor pencarian');
      return;
    }
    // Simulate search
    setPesertaData({
      nama: 'Budi Santoso',
      nik: '3201123456789001',
      noKartu: '0001234567891',
      status: 'Aktif',
      kelas: 'Kelas 3',
      segmen: 'PBPU',
      faskes1: 'Klinik Sehat Utama',
      tanggalDaftar: '2020-01-15'
    });
    toast.success('Data peserta ditemukan');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Info Peserta</h1>
          <p className="text-slate-500">Cari dan lihat data kepesertaan JKN</p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-bold mb-4">Pencarian Data Peserta</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cari Berdasarkan</label>
            <select 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="nik">NIK</option>
              <option value="noKartu">Nomor Kartu</option>
              <option value="kk">Nomor Kartu Keluarga</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Masukkan Nomor</label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={searchType === 'nik' ? '16 digit NIK' : 'Masukkan nomor'}
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" /> Cari
            </button>
          </div>
        </div>
      </div>
      {pesertaData && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white">Data Peserta</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${
              pesertaData.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              {pesertaData.status === 'Aktif' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {pesertaData.status}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="text-sm text-slate-500">Nama Lengkap</p>
              <p className="font-bold text-slate-800 dark:text-white">{pesertaData.nama}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="text-sm text-slate-500">NIK</p>
              <p className="font-bold text-slate-800 dark:text-white">{pesertaData.nik}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="text-sm text-slate-500">Nomor Kartu</p>
              <p className="font-bold text-slate-800 dark:text-white">{pesertaData.noKartu}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="text-sm text-slate-500">Kelas Rawat</p>
              <p className="font-bold text-slate-800 dark:text-white">{pesertaData.kelas}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="text-sm text-slate-500">Segmen</p>
              <p className="font-bold text-slate-800 dark:text-white">{pesertaData.segmen}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="text-sm text-slate-500">Faskes Tingkat 1</p>
              <p className="font-bold text-slate-800 dark:text-white">{pesertaData.faskes1}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
