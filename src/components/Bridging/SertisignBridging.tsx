import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck, FileSignature, Award, Settings, CheckCircle2,
  RefreshCw, Lock, Key, FileText, Check, QrCode
} from 'lucide-react';
import toast from 'react-hot-toast';

export function SertisignBridging() {
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

  const tabs = ['Kelola', 'Tanda Tangan Dokumen', 'Sertifikat', 'Pengaturan'];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
              BSRE BSSN & SERTISIGN
            </span>
            <span className="text-xs text-slate-400 font-mono">TTE Tersertifikasi Resmi</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>🔏</span> Bridging Sertisign / TTE (Tanda Tangan Elektronik)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Penerbitan tanda tangan elektronik (TTE) tersertifikasi BSrE BSSN untuk dokter dan tenaga medis pada dokumen rekam medis & resep.
          </p>
        </div>
        <button
          onClick={() => toast.success('Sertifikat Digital BSrE Aktif & Tervalidasi!')}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-900/20 flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Verify Certificate
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
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'Kelola' && <KelolaTTE onNavigate={handleTabChange} />}
        {activeTab === 'Tanda Tangan Dokumen' && <TandaTanganDokumenTab />}
        {activeTab === 'Sertifikat' && <SertifikatTab />}
        {activeTab === 'Pengaturan' && <PengaturanTTETab />}
      </div>
    </div>
  );
}

function KelolaTTE({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Status Otoritas Sertifikat (CA)</span>
          <div className="text-xl font-bold text-emerald-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" /> BSrE Terhubung
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Root CA BSSN Valid</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Dokter dengan Sertifikat TTE</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white">48 <span className="text-xs font-normal text-slate-400">Dokter</span></div>
          <span className="text-xs text-emerald-500 mt-1 block">100% Aktif & Terdaftar</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Dokumen Ditandatangani Hari Ini</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">412 <span className="text-xs font-normal text-slate-400">Dokumen</span></div>
          <span className="text-xs text-slate-400 mt-1 block">Resume, Resep & Surat Ket.</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Keabsahan Hukum UU ITE</span>
          <div className="text-2xl font-black text-emerald-500">100% Sah</div>
          <span className="text-xs text-slate-400 mt-1 block">Kekuatan Hukum Penuh</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Log Dokumen Medis Ber-TTE Terakhir</h3>
            <p className="text-xs text-slate-500">Daftar dokumen rekam medis elektronik yang telah dibubuhi tanda tangan digital tersertifikasi.</p>
          </div>
          <button
            onClick={() => onNavigate('Tanda Tangan Dokumen')}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <FileSignature className="w-3.5 h-3.5" />
            Tanda Tangan Dokumen Baru
          </button>
        </div>

        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Nama Dokumen</th>
                <th className="p-3">Penandatangan (DPJP)</th>
                <th className="p-3">Waktu TTE</th>
                <th className="p-3">Hash Verifikasi (SHA-256)</th>
                <th className="p-3">Status Sertifikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {[
                { doc: 'Resume Medis Rawat Jalan #RM-00192', doctor: 'dr. Budi Setiawan, Sp.PD', time: '10:20 WIB', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae...', status: 'TERVERIFIKASI BSRE' },
                { doc: 'Surat Keterangan Kematian #SKK-00041', doctor: 'dr. Sarah Amelia, Sp.A', time: '09:45 WIB', hash: '8f434346648f6b96df89dda901c5176b10a6...', status: 'TERVERIFIKASI BSRE' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{row.doc}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{row.doctor}</td>
                  <td className="p-3 font-mono text-slate-400">{row.time}</td>
                  <td className="p-3 font-mono text-slate-500 text-[11px] truncate max-w-xs">{row.hash}</td>
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

function TandaTanganDokumenTab() {
  const [passphrase, setPassphrase] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      toast.success('Dokumen berhasil ditandatangani secara elektronik (BSrE BSSN)! QR Code & Hash disematkan.');
      setPassphrase('');
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-5 text-xs">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <FileSignature className="w-5 h-5 text-amber-600" />
          Pembubuhan Tanda Tangan Elektronik Tersertifikasi
        </h3>
        <p className="text-slate-500">Masukkan Passphrase Sertifikat Digital untuk menandatangani berkas medis.</p>
      </div>

      <form onSubmit={handleSign} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Pilih Dokumen yang Akan Ditandatangani</label>
          <select className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-medium">
            <option>Resume Medis Pasien #RM-00192 (Budi Santoso)</option>
            <option>Lembar Resep Elektronik #RX-00441 (dr. Budi Setiawan, Sp.PD)</option>
            <option>Laporan Operasi Bedah #OK-00082</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Passphrase TTE Dokter</label>
          <input
            type="password"
            value={passphrase}
            onChange={e => setPassphrase(e.target.value)}
            placeholder="Masukkan passphrase sertifikat..."
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono text-sm"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSigning}
          className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-md shadow-amber-900/20 flex items-center justify-center gap-2"
        >
          {isSigning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          {isSigning ? 'Sedang Membubuhkan TTE...' : 'Tanda Tangani Dokumen'}
        </button>
      </form>
    </div>
  );
}

function SertifikatTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-4 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Award className="w-5 h-5 text-amber-600" />
        Sertifikat Digital BSrE Aktif
      </h3>
      <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30 rounded-xl space-y-2">
        <div>
          <span className="text-slate-400 block">Subjek Sertifikat</span>
          <span className="font-bold text-slate-800 dark:text-white">dr. Budi Setiawan, Sp.PD (NIK: 3174011234560001)</span>
        </div>
        <div>
          <span className="text-slate-400 block">Penerbit Sertifikat</span>
          <span className="font-bold text-slate-800 dark:text-white">Balai Sertifikasi Elektronik (BSrE) - BSSN</span>
        </div>
        <div>
          <span className="text-slate-400 block">Masa Berlaku</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">Hingga 31 Desember 2027</span>
        </div>
      </div>
    </div>
  );
}

function PengaturanTTETab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-4 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Settings className="w-5 h-5 text-amber-600" />
        Konfigurasi Gateway BSrE BSSN
      </h3>
      <div>
        <label className="block font-semibold mb-1">URL Service BSrE</label>
        <input type="text" defaultValue="https://esign.bssn.go.id/api/sign/pdf" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>
      <button
        onClick={() => toast.success('Konfigurasi BSrE disimpan!')}
        className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-md shadow-amber-900/20"
      >
        Simpan Pengaturan
      </button>
    </div>
  );
}
