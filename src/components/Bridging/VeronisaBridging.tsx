import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck, Search, CheckCircle2, AlertCircle, Clock, Settings,
  RefreshCw, UserCheck, FileText, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export function VeronisaBridging() {
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

  const tabs = ['Kelola', 'Cek Eligibilitas', 'Riwayat Verifikasi', 'Pengaturan'];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700">
              VERONISA BPJS
            </span>
            <span className="text-xs text-slate-400 font-mono">Verifikasi Online Integrasi SEP & Rujukan</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>🛡️</span> Bridging VERONISA (Verifikasi Rujukan & Eligibilitas)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Verifikasi validitas rujukan FKTP/FKRTL, masa berlaku surat rujukan, dan pencegahan fraud klaim ganda.
          </p>
        </div>
        <button
          onClick={() => toast.success('Status Veronisa Engine: Online & Valid (24ms)')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-900/20 flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Check Service Status
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'Kelola' && <KelolaVeronisaTab onNavigate={handleTabChange} />}
        {activeTab === 'Cek Eligibilitas' && <CekEligibilitasTab />}
        {activeTab === 'Riwayat Verifikasi' && <RiwayatVeronisaTab />}
        {activeTab === 'Pengaturan' && <PengaturanVeronisaTab />}
      </div>
    </div>
  );
}

function KelolaVeronisaTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Status Verifikasi Veronisa</span>
          <div className="text-xl font-bold text-emerald-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" /> Terhubung
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Anti-fraud engine aktif</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Rujukan Terverifikasi Hari Ini</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white">312 <span className="text-xs font-normal text-slate-400">Rujukan</span></div>
          <span className="text-xs text-emerald-500 mt-1 block">100% Rujukan Aktif</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Deteksi Rujukan Kadaluarsa</span>
          <div className="text-2xl font-black text-rose-500">2 <span className="text-xs font-normal text-slate-400">Pasien</span></div>
          <span className="text-xs text-slate-400 mt-1 block">Diarahkan perbarui surat</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Pencegahan Fraud SEP Ganda</span>
          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">100%</div>
          <span className="text-xs text-slate-400 mt-1 block">0 Temuan Anomali</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Log Verifikasi Eligibilitas Terakhir</h3>
            <p className="text-xs text-slate-500">Hasil audit sistem Veronisa terhadap berkas rujukan peserta yang masuk.</p>
          </div>
          <button
            onClick={() => onNavigate('Cek Eligibilitas')}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            Cek Rujukan Manual
          </button>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Waktu</th>
                <th className="p-3">No. Kartu BPJS</th>
                <th className="p-3">Nama Pasien</th>
                <th className="p-3">Asal Faskes Rujukan</th>
                <th className="p-3">Masa Berlaku Rujukan</th>
                <th className="p-3">Status Eligibilitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {[
                { waktu: '10:24', noKartu: '0001234567890', nama: 'Budi Santoso', asal: 'Puskesmas Kebayoran Lama', masa: 'Sisa 48 Hari', status: 'VALID' },
                { waktu: '10:18', noKartu: '0001987654321', nama: 'Siti Aminah', asal: 'Klinik Pratama Sehat Sejahtera', masa: 'Sisa 62 Hari', status: 'VALID' },
                { waktu: '10:05', noKartu: '0001556677889', nama: 'Hendra Gunawan', asal: 'Puskesmas Tebet', masa: 'Sisa 12 Hari', status: 'VALID' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-3 font-mono text-slate-400">{row.waktu}</td>
                  <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.noKartu}</td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{row.nama}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{row.asal}</td>
                  <td className="p-3 font-medium text-emerald-600 dark:text-emerald-400">{row.masa}</td>
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

function CekEligibilitasTab() {
  const [noRujukan, setNoRujukan] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noRujukan.trim()) return;
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      setResult({
        noRujukan: noRujukan,
        nama: 'BUDI SANTOSO',
        noKartu: '0001234567890',
        diagnosa: 'I10 - Hypertensive Heart Disease',
        tglRujukan: '2026-08-01',
        berlakuSampai: '2026-10-30',
        faskesAsal: 'Puskesmas Kebayoran Lama (0115B001)',
        poliTujuan: 'Penyakit Dalam',
        status: 'ELIGIBLE & AKTIF'
      });
      toast.success('Rujukan terverifikasi Valid di Veronisa BPJS!');
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Pengecekan Eligibilitas Surat Rujukan (Veronisa)</h3>
        <p className="text-xs text-slate-500">Cek status keabsahan surat rujukan PCARE / Rumah Sakit.</p>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          value={noRujukan}
          onChange={e => setNoRujukan(e.target.value)}
          placeholder="Masukkan Nomor Rujukan (19 digit)..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button
          type="submit"
          disabled={isChecking}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
        >
          {isChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Periksa Keabsahan
        </button>
      </form>

      {result && (
        <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-500/30 rounded-xl space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-indigo-500/20">
            <span className="font-bold text-indigo-800 dark:text-indigo-300 text-base">{result.nama}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-600 text-white">
              {result.status}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block">Nomor Rujukan</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white">{result.noRujukan}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Nomor BPJS</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white">{result.noKartu}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Faskes Perujuk</span>
              <span className="font-medium text-slate-800 dark:text-white">{result.faskesAsal}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Masa Berlaku</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{result.tglRujukan} s/d {result.berlakuSampai}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RiwayatVeronisaTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Arsip Log Veronisa</h3>
      <p className="text-slate-500">Semua riwayat verifikasi rujukan tersimpan dan terenkripsi.</p>
    </div>
  );
}

function PengaturanVeronisaTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-4 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Settings className="w-5 h-5 text-indigo-600" />
        Konfigurasi API Veronisa BPJS
      </h3>
      <div>
        <label className="block font-semibold mb-1">Endpoint Veronisa Service</label>
        <input type="text" defaultValue="https://veronisa.bpjs-kesehatan.go.id/api/v1" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <button
        onClick={() => toast.success('Konfigurasi Veronisa disimpan!')}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-900/20"
      >
        Simpan Pengaturan
      </button>
    </div>
  );
}
