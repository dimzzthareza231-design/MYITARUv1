import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileCheck, Upload, CheckCircle2, AlertCircle, Clock, Settings,
  RefreshCw, FileText, Download, Eye, ShieldCheck, Check, Send
} from 'lucide-react';
import toast from 'react-hot-toast';

export function VedikaBridging() {
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

  const tabs = ['Kelola', 'Upload Berkas', 'Status Verifikasi', 'Feedback BPJS', 'Pengaturan'];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
              BPJS VEDIKA DIGITAL
            </span>
            <span className="text-xs text-slate-400 font-mono">Verifikasi Digital Klaim Online</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>📑</span> Bridging VEDIKA (Verifikasi Digital Klaim BPJS)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Pengiriman berkas digital klaim (SEP, Resume Medis, Billing, Surat Rujukan, Hasil Lab/Rad) langsung ke sistem Verifikator BPJS Kesehatan.
          </p>
        </div>
        <button
          onClick={() => toast.success('Status sinkronisasi Vedika: 100% Berkas Terhubung')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/20 flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync Status Klaim
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
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'Kelola' && <KelolaVedikaTab onNavigate={handleTabChange} />}
        {activeTab === 'Upload Berkas' && <UploadBerkasTab />}
        {activeTab === 'Status Verifikasi' && <StatusVerifikasiTab />}
        {activeTab === 'Feedback BPJS' && <FeedbackBPJSTab />}
        {activeTab === 'Pengaturan' && <PengaturanVedikaTab />}
      </div>
    </div>
  );
}

function KelolaVedikaTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const stats = [
    { label: 'Berkas Siap Kirim', value: '42 Berkas', color: 'text-blue-600', sub: 'Lengkap rekam medis & SEP' },
    { label: 'Dalam Proses Verifikasi', value: '118 Berkas', color: 'text-amber-500', sub: 'Diperiksa Verifikator BPJS' },
    { label: 'Klaim Disetujui (Layak)', value: '380 Berkas', color: 'text-emerald-600', sub: 'Siap diajukan FPK' },
    { label: 'Perlu Revisi / Pending', value: '6 Berkas', color: 'text-rose-500', sub: 'Ada berkas tambahan diminta' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 block mb-1">{s.label}</span>
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <span className="text-xs text-slate-500 mt-1 block">{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Monitoring Pengajuan Berkas Vedika Digital</h3>
            <p className="text-xs text-slate-500">Daftar bundel klaim pasien BPJS yang dikirimkan ke server Vedika.</p>
          </div>
          <button
            onClick={() => onNavigate('Upload Berkas')}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Berkas Baru
          </button>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">No. SEP</th>
                <th className="p-3">Nama Pasien & No. RM</th>
                <th className="p-3">Diagnosa (ICD-10)</th>
                <th className="p-3">Kelengkapan PDF</th>
                <th className="p-3">Status Verifikasi</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {[
                { sep: '0307R0010826V000102', nama: 'Budi Santoso (RM-00192)', diag: 'I10 - Hypertensive Heart Disease', files: '5 / 5 Dokumen', status: 'Layak Klaim', statusCol: 'emerald' },
                { sep: '0307R0010826V000103', nama: 'Siti Aminah (RM-00431)', diag: 'E11.9 - Type 2 Diabetes Mellitus', files: '5 / 5 Dokumen', status: 'Proses Verifikasi', statusCol: 'amber' },
                { sep: '0307R0010826V000104', nama: 'Ahmad Fauzi (RM-00512)', diag: 'K29.7 - Gastritis, Unspecified', files: '4 / 5 Dokumen', status: 'Perlu Revisi', statusCol: 'rose' }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{row.sep}</td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{row.nama}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{row.diag}</td>
                  <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{row.files}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      row.statusCol === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' :
                      row.statusCol === 'amber' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300' :
                      'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toast.success(`Membuka berkas digital SEP ${row.sep}`)}
                      className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                      Lihat Berkas
                    </button>
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

function UploadBerkasTab() {
  const [sep, setSep] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sep.trim()) {
      toast.error('Mohon masukkan nomor SEP');
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success(`Bundel PDF digital untuk SEP ${sep} berhasil diupload ke server Vedika!`);
      setSep('');
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Penggabungan & Pengiriman Bundel Klaim Digital (PDF Vedika)
        </h3>
        <p className="text-xs text-slate-500">Sistem otomatis menggabungkan SEP, Resume Medis, Laporan Operasi, Billing, dan Hasil Penunjang menjadi satu file PDF standar BPJS.</p>
      </div>

      <form onSubmit={handleUpload} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nomor Surat Eligibilitas Peserta (SEP)</label>
          <input
            type="text"
            value={sep}
            onChange={e => setSep(e.target.value)}
            placeholder="0307R0010826V000102..."
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
          <span className="font-bold text-slate-800 dark:text-white block">Dokumen Otomatis Termasuk:</span>
          <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Lembar SEP Pasien</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Resume Medis Elektronik (RME)</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Rincian Biaya Kasir (Billing)</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Hasil Lab / Radiologi (DICOM/PDF)</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/20 flex items-center justify-center gap-2"
        >
          {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {isUploading ? 'Sedang Menggabung & Mengirim...' : 'Kirim Bundel Vedika Sekarang'}
        </button>
      </form>
    </div>
  );
}

function StatusVerifikasiTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Status Lengkap Verifikasi Klaim Vedika</h3>
      <p className="text-xs text-slate-500">Hasil review kelayakan berkas klaim oleh tim verifikator BPJS Kesehatan.</p>
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        Bulan Pelayanan Berjalan: <strong>96.8% Klaim Berstatus Layak / Disetujui</strong>
      </div>
    </div>
  );
}

function FeedbackBPJSTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Catatan & Feedback Verifikator BPJS</h3>
      <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 space-y-1">
        <span className="font-bold text-rose-700 dark:text-rose-400 block">SEP 0307R0010826V000104 - Ahmad Fauzi</span>
        <p className="text-slate-600 dark:text-slate-300">
          Catatan Verifikator: Mohon lampirkan hasil pemeriksaan Endoskopi atau surat keterangan indikasi medis tambahan dari dokter DPJP.
        </p>
      </div>
    </div>
  );
}

function PengaturanVedikaTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-4 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Settings className="w-5 h-5 text-blue-600" />
        Pengaturan Server Vedika Digital
      </h3>
      <div>
        <label className="block font-semibold mb-1">URL Endpoint Vedika</label>
        <input type="text" defaultValue="https://vedika.bpjs-kesehatan.go.id/api/v1" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <div>
        <label className="block font-semibold mb-1">Secret Key Vedika</label>
        <input type="password" defaultValue="vedika_secret_key_8899" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <button
        onClick={() => toast.success('Pengaturan Vedika disimpan!')}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-900/20"
      >
        Simpan Konfigurasi
      </button>
    </div>
  );
}
