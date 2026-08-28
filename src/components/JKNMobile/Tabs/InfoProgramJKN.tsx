import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Bell, Info, Search, Megaphone } from 'lucide-react';

export function InfoProgramJKN() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');

  const berita = [
    { id: 1, judul: 'Penyesuaian Iuran JKN-KIS Tahun 2026', kategori: 'Kebijakan', tanggal: '01 Feb 2026', ringkasan: 'Iuran Kelas 3 tetap Rp 35.000, Kelas 2 Rp 100.000, Kelas 1 Rp 150.000 per bulan.', isi: 'Berdasarkan Peraturan Presiden terbaru, besaran iuran JKN-KIS untuk tahun 2026 tidak mengalami kenaikan untuk Kelas 3. Pemerintah tetap memberikan subsidi untuk peserta PBI (Penerima Bantuan Iuran). Peserta PBPU dan BP dapat membayar iuran melalui berbagai channel pembayaran yang telah bekerja sama dengan BPJS Kesehatan.' },
    { id: 2, judul: 'Layanan Telemedicine Resmi Terintegrasi', kategori: 'Layanan', tanggal: '15 Jan 2026', ringkasan: 'Konsultasi online kini tersedia di aplikasi Mobile JKN.', isi: 'BPJS Kesehatan telah mengintegrasikan layanan telemedicine ke dalam aplikasi Mobile JKN. Peserta dapat melakukan konsultasi dengan dokter di FKTP terdaftar tanpa perlu datang langsung. Layanan ini mencakup konsultasi umum, peresepan obat, dan rujukan online.' },
    { id: 3, judul: 'Program Skrining Kesehatan Gratis 2026', kategori: 'Program', tanggal: '10 Jan 2026', ringkasan: 'Skrining kesehatan gratis untuk 14 jenis penyakit bagi seluruh peserta JKN.', isi: 'BPJS Kesehatan meluncurkan program skrining kesehatan gratis yang mencakup 14 jenis penyakit antara lain: diabetes melitus, hipertensi, jantung koroner, stroke, kanker serviks, kanker payudara, dan lainnya. Peserta cukup datang ke FKTP terdaftar untuk mengikuti skrining.' },
    { id: 4, judul: 'Update Aplikasi Mobile JKN v5.0', kategori: 'Teknologi', tanggal: '05 Jan 2026', ringkasan: 'Fitur baru: AI Triage, BUGAR, dan pembayaran iuran langsung.', isi: 'Aplikasi Mobile JKN versi 5.0 menghadirkan fitur-fitur baru seperti AI Triage untuk penilaian gejala awal, fitur BUGAR untuk monitoring kesehatan mandiri, serta kemudahan pembayaran iuran langsung melalui aplikasi.' },
    { id: 5, judul: 'Kerja Sama dengan 3.500 Faskes Baru', kategori: 'Kebijakan', tanggal: '28 Des 2025', ringkasan: 'BPJS Kesehatan menambah 3.500 faskes mitra baru di seluruh Indonesia.', isi: 'Untuk meningkatkan aksesibilitas layanan, BPJS Kesehatan telah menambah 3.500 fasilitas kesehatan mitra baru yang tersebar di seluruh Indonesia. Peserta dapat melihat daftar faskes terdekat melalui aplikasi Mobile JKN.' },
    { id: 6, judul: 'Program Prolanis untuk Penyakit Kronis', kategori: 'Program', tanggal: '20 Des 2025', ringkasan: 'Pengelolaan penyakit kronis terstruktur untuk peserta dengan DM dan Hipertensi.', isi: 'Program Pengelolaan Penyakit Kronis (Prolanis) kini tersedia di seluruh FKTP mitra BPJS. Peserta dengan diabetes melitus dan hipertensi dapat mengikuti program ini untuk mendapatkan monitoring rutin, edukasi, dan obat-obatan secara terjadwal.' },
  ];

  const kategoriList = ['Semua', 'Kebijakan', 'Layanan', 'Program', 'Teknologi'];

  const filtered = berita.filter(b => {
    const matchSearch = b.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.ringkasan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchKategori = filterKategori === 'Semua' || b.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case 'Kebijakan': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Layanan': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Program': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Teknologi': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-teal-600" /> Info Program JKN
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Informasi seputar program dan kebijakan terbaru BPJS Kesehatan</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berita atau kebijakan..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {kategoriList.map(kat => (
            <button
              key={kat}
              onClick={() => setFilterKategori(kat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filterKategori === kat
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-teal-800 dark:text-teal-300">Informasi Penting</p>
          <p className="text-sm text-teal-600 dark:text-teal-400 mt-1">
            Untuk pertanyaan lebih lanjut, hubungi Call Center BPJS Kesehatan di 165 atau kunjungi kantor cabang terdekat.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(item => (
          <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getKategoriColor(item.kategori)}`}>{item.kategori}</span>
                  <span className="text-xs text-slate-400">{item.tanggal}</span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">{item.judul}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.ringkasan}</p>
              </div>
              {expandedId === item.id ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
            </button>
            {expandedId === item.id && (
              <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700 pt-3">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.isi}</p>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>Tidak ada berita yang cocok dengan pencarian.</p>
          </div>
        )}
      </div>
    </div>
  );
}
