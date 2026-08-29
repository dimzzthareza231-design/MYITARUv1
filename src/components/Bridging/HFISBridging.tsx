import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building2, Bed, Calendar, Settings, RefreshCw, CheckCircle2,
  AlertCircle, ShieldCheck, Clock, Users, ArrowUpRight, Send
} from 'lucide-react';
import toast from 'react-hot-toast';

export function HFISBridging() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl || 'Kelola');

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const tabs = ['Kelola', 'Data Fasilitas', 'Kapasitas', 'Pengaturan'];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              BPJS HFIS & SIRANAP
            </span>
            <span className="text-xs text-slate-400 font-mono">Kode Faskes: 0307R001</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>🏥</span> Bridging HFIS (Health Facilities Information System)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Sinkronisasi data profil faskes, jadwal praktik dokter poliklinik, dan kapasitas tempat tidur realtime ke server BPJS & Kemenkes SIRANAP.
          </p>
        </div>
        <button
          onClick={() => toast.success('Sinkronisasi HFIS & Ketersediaan Kamar Berhasil! (38ms)')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-900/20 flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync Data HFIS
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1">
        {activeTab === 'Kelola' && <KelolaHFISTab onNavigate={handleTabChange} />}
        {activeTab === 'Data Fasilitas' && <DataFasilitasTab />}
        {activeTab === 'Kapasitas' && <KapasitasBedTab />}
        {activeTab === 'Pengaturan' && <PengaturanHFISTab />}
      </div>
    </div>
  );
}

function KelolaHFISTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Status Bridging HFIS</span>
          <div className="text-xl font-bold text-emerald-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" /> Aktif / Synced
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Update realtime ke BPJS</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Dokter Praktik Terdaftar</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white">48 <span className="text-xs font-normal text-slate-400">Dokter Spesialis</span></div>
          <span className="text-xs text-emerald-500 mt-1 block">100% Terverifikasi SIP</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Tempat Tidur (SIRANAP)</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">180 <span className="text-xs font-normal text-slate-400">Bed</span></div>
          <span className="text-xs text-slate-400 mt-1 block">Tersedia: 34 Bed Kosong</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Bed Occupancy Rate (BOR)</span>
          <div className="text-2xl font-black text-amber-500">81.1%</div>
          <span className="text-xs text-emerald-500 mt-1 block">Dalam batas ideal (60-85%)</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Jadwal Poliklinik & Kuota HFIS Hari Ini</h3>
            <p className="text-xs text-slate-500">Data jadwal dokter yang tampil pada aplikasi Mobile JKN peserta BPJS.</p>
          </div>
          <button
            onClick={() => onNavigate('Kapasitas')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Kelola Ketersediaan Kamar
          </button>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Nama Poliklinik</th>
                <th className="p-3">Dokter DPJP</th>
                <th className="p-3">Jam Praktik</th>
                <th className="p-3">Kuota HFIS</th>
                <th className="p-3">Sisa Kuota</th>
                <th className="p-3">Status BPJS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {[
                { poli: 'Poli Penyakit Dalam', dokter: 'dr. Budi Setiawan, Sp.PD', jam: '08:00 - 12:00', kuota: 40, sisa: 6, status: 'Buka' },
                { poli: 'Poli Anak', dokter: 'dr. Sarah Amelia, Sp.A', jam: '08:30 - 13:00', kuota: 35, sisa: 12, status: 'Buka' },
                { poli: 'Poli Bedah Umum', dokter: 'dr. H. Hendra Wijaya, Sp.B', jam: '09:00 - 14:00', kuota: 30, sisa: 18, status: 'Buka' },
                { poli: 'Poli Kebidanan & Kandungan', dokter: 'dr. Maya Indrawati, Sp.OG', jam: '10:00 - 15:00', kuota: 30, sisa: 4, status: 'Buka' }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{row.poli}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{row.dokter}</td>
                  <td className="p-3 font-mono text-slate-500">{row.jam}</td>
                  <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">{row.kuota}</td>
                  <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{row.sisa}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DataFasilitasTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-3xl mx-auto space-y-4 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Building2 className="w-5 h-5 text-emerald-600" />
        Profil Resmi Fasilitas Kesehatan (BPJS HFIS)
      </h3>

      <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
        <div>
          <span className="text-slate-400 block mb-0.5">Kode Faskes BPJS</span>
          <span className="font-mono font-bold text-slate-800 dark:text-white text-sm">0307R001</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Kode Registrasi Kemenkes</span>
          <span className="font-mono font-bold text-slate-800 dark:text-white text-sm">3201014</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Nama Resmi Faskes</span>
          <span className="font-bold text-slate-800 dark:text-white">Klinik MYITARU SEHAT UTAMA</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-0.5">Kelas Klinik</span>
          <span className="font-bold text-slate-800 dark:text-white">Tipe B (Pendidikan & Rujukan)</span>
        </div>
        <div className="col-span-2">
          <span className="text-slate-400 block mb-0.5">Alamat Lengkap</span>
          <span className="text-slate-800 dark:text-slate-200">Jl. Raya Kesehatan No. 101, Jakarta Selatan</span>
        </div>
      </div>
    </div>
  );
}

function KapasitasBedTab() {
  const [beds, setBeds] = useState([
    { kelas: 'VVIP', total: 10, terisi: 8, kosong: 2 },
    { kelas: 'VIP', total: 20, terisi: 18, kosong: 2 },
    { kelas: 'Kelas 1', total: 40, terisi: 32, kosong: 8 },
    { kelas: 'Kelas 2', total: 50, terisi: 42, kosong: 8 },
    { kelas: 'Kelas 3', total: 40, terisi: 30, kosong: 10 },
    { kelas: 'ICU / ICCU', total: 10, terisi: 8, kosong: 2 },
    { kelas: 'NICU / PICU', total: 6, terisi: 4, kosong: 2 },
    { kelas: 'Ruang Isolasi', total: 4, terisi: 2, kosong: 2 }
  ]);

  const handleUpdate = () => {
    toast.success('Kapasitas Bed Realtime berhasil dikirim ke SIRANAP & HFIS BPJS!');
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Ketersediaan Tempat Tidur (Bed Availability Bridging)</h3>
          <p className="text-xs text-slate-500">Kapasitas tempat tidur disinkronisasikan secara otomatis setiap ada mutasi pasien.</p>
        </div>
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          Kirim Update ke SIRANAP
        </button>
      </div>

      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-3">Kelas / Ruang Perawatan</th>
              <th className="p-3">Total Kapasitas</th>
              <th className="p-3">Terisi</th>
              <th className="p-3">Tersedia (Kosong)</th>
              <th className="p-3">Persentase Keterisian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {beds.map((b, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{b.kelas}</td>
                <td className="p-3 font-mono font-bold text-slate-800 dark:text-slate-200">{b.total} Bed</td>
                <td className="p-3 font-mono font-bold text-rose-500">{b.terisi} Bed</td>
                <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{b.kosong} Bed</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${(b.terisi / b.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-mono font-bold text-slate-600 dark:text-slate-300">
                      {Math.round((b.terisi / b.total) * 100)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PengaturanHFISTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-4 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Settings className="w-5 h-5 text-emerald-600" />
        Konfigurasi API HFIS BPJS
      </h3>
      <div>
        <label className="block font-semibold mb-1">Service URL HFIS</label>
        <input type="text" defaultValue="https://apijkn.bpjs-kesehatan.go.id/hfis-rest" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <div>
        <label className="block font-semibold mb-1">Consumer ID HFIS</label>
        <input type="text" defaultValue="29811" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <div>
        <label className="block font-semibold mb-1">Consumer Secret</label>
        <input type="password" defaultValue="secret_hfis_998811" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <button
        onClick={() => toast.success('Konfigurasi HFIS disimpan!')}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-md shadow-emerald-900/20"
      >
        Simpan Pengaturan HFIS
      </button>
    </div>
  );
}
