import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FileText, Send, CheckCircle2, AlertCircle, Clock, Settings,
  RefreshCw, ShieldCheck, Database, Stethoscope, Search, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export function BPJSEMRBridging() {
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

  const tabs = ['Kelola', 'Kirim Data Klinis', 'Status Submit', 'Pengaturan'];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
              BRIDGING EMR RESUME MEDIS BPJS
            </span>
            <span className="text-xs text-slate-400 font-mono">Service E-Rekam Medis BPJS</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>📋</span> Bridging BPJS EMR (Data Klinis Pasien)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Pengiriman resume medis digital terstandar (Anamnesis, Pemeriksaan Fisik, Terapi Obat, Prosedur Bedah) langsung ke server BPJS Kesehatan.
          </p>
        </div>
        <button
          onClick={() => toast.success('Sinkronisasi EMR BPJS Berhasil! (31ms)')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/20 flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync EMR Engine
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
        {activeTab === 'Kelola' && <KelolaEMRTab onNavigate={handleTabChange} />}
        {activeTab === 'Kirim Data Klinis' && <KirimDataKlinisTab />}
        {activeTab === 'Status Submit' && <StatusSubmitEMRTab />}
        {activeTab === 'Pengaturan' && <PengaturanEMRTab />}
      </div>
    </div>
  );
}

function KelolaEMRTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Status Bridging EMR</span>
          <div className="text-xl font-bold text-emerald-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" /> Online
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Ready to send clinical data</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Resume Terkirim Hari Ini</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white">284 <span className="text-xs font-normal text-slate-400">Berkas</span></div>
          <span className="text-xs text-emerald-500 mt-1 block">100% Validasi Sukses</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Antrean Kirim EMR</span>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">0 <span className="text-xs font-normal text-slate-400">Pending</span></div>
          <span className="text-xs text-slate-400 mt-1 block">Real-time auto-dispatch</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Standar Enkripsi BPJS</span>
          <div className="text-2xl font-black text-emerald-500">AES-256</div>
          <span className="text-xs text-slate-400 mt-1 block">Terenkripsi Signature</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Riwayat Submit Resume Medis Klinis</h3>
            <p className="text-xs text-slate-500">Status pengiriman data klinis rekam medis elektronik ke server BPJS.</p>
          </div>
          <button
            onClick={() => onNavigate('Kirim Data Klinis')}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Kirim Data Klinis
          </button>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">No. SEP</th>
                <th className="p-3">Nama Pasien & DPJP</th>
                <th className="p-3">Data Terkirim</th>
                <th className="p-3">Waktu Submit</th>
                <th className="p-3">Status BPJS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {[
                { sep: '0307R0010826V000102', nama: 'Budi Santoso', dpjp: 'dr. Budi Setiawan, Sp.PD', data: 'Anamnesis, Vital, Obat, ICD-10', time: '10:14 WIB', status: 'Diterima BPJS' },
                { sep: '0307R0010826V000103', nama: 'Siti Aminah', dpjp: 'dr. Sarah Amelia, Sp.A', data: 'Anamnesis, Vital, Imunisasi, Obat', time: '09:50 WIB', status: 'Diterima BPJS' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">{row.sep}</td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">{row.nama}</span>
                    <span className="text-slate-400 text-[11px]">{row.dpjp}</span>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{row.data}</td>
                  <td className="p-3 font-mono text-slate-400">{row.time}</td>
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

function KirimDataKlinisTab() {
  const [sep, setSep] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sep.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success(`Data klinis rekam medis untuk SEP ${sep} berhasil dikirim ke server BPJS EMR!`);
      setSep('');
    }, 800);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-5 text-xs">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600" />
          Kirim Data Klinis EMR ke BPJS
        </h3>
        <p className="text-slate-500">Kirim paket data resume SOAP dan terapi obat pasien sesuai standar format JSON BPJS EMR.</p>
      </div>

      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Nomor SEP Pasien</label>
          <input
            type="text"
            value={sep}
            onChange={e => setSep(e.target.value)}
            placeholder="0307R0010826V000102..."
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono text-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSending}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-900/20 flex items-center justify-center gap-2"
        >
          {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Kirim Data EMR
        </button>
      </form>
    </div>
  );
}

function StatusSubmitEMRTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">Status Submit EMR</h3>
      <p className="text-slate-500">Semua data klinis yang dikirim terverifikasi pada log audit BPJS.</p>
    </div>
  );
}

function PengaturanEMRTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-4 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Settings className="w-5 h-5 text-blue-600" />
        Konfigurasi API EMR BPJS
      </h3>
      <div>
        <label className="block font-semibold mb-1">URL Service EMR</label>
        <input type="text" defaultValue="https://apijkn.bpjs-kesehatan.go.id/emr-rest" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <button
        onClick={() => toast.success('Konfigurasi EMR disimpan!')}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-md shadow-blue-900/20"
      >
        Simpan Pengaturan
      </button>
    </div>
  );
}
