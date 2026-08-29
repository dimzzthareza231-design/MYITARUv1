import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Monitor, Volume2, Users, Settings, Play, Radio,
  Tv, Printer, QrCode, Ticket, CheckCircle2, RefreshCw,
  Maximize2, ArrowRight, ShieldCheck, Search
} from 'lucide-react';
import toast from 'react-hot-toast';

export function AnjunganBridging() {
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

  const tabs = ['Kelola', 'Display', 'Pemanggil', 'Pengaturan'];

  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              APM Hub Active
            </span>
            <span className="text-xs text-slate-400 font-mono">4 Kiosks & 6 Displays Online</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
            <span>🖥️</span> Anjungan Pendaftaran Mandiri (APM) & Antrean TV
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            Kelola mesin kios check-in mandiri pasien, display monitor antrean TV, pemanggil suara pintar (TTS), dan integrasi WS BPJS Antrean.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto custom-scrollbar shrink-0">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'Kelola' && <KelolaAPMTab onNavigate={handleTabChange} />}
        {activeTab === 'Display' && <DisplayMonitorTab />}
        {activeTab === 'Pemanggil' && <PemanggilAntrianTab />}
        {activeTab === 'Pengaturan' && <PengaturanAPMTab />}
      </div>
    </div>
  );
}

function KelolaAPMTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const kiosks = [
    { id: 'KIOS-01', location: 'Lobi Utama Gedung A', type: 'Check-in Pasien BPJS & Umum', paper: '85%', status: 'ONLINE' },
    { id: 'KIOS-02', location: 'Lobi Rawat Jalan Lantai 1', type: 'Check-in Surat Kontrol / SEP', paper: '92%', status: 'ONLINE' },
    { id: 'KIOS-03', location: 'Instalasi Farmasi & Kasir', type: 'Tiket Antrean Resep', paper: '64%', status: 'ONLINE' },
    { id: 'KIOS-04', location: 'Instalasi Gawat Darurat (IGD)', type: 'Triase & Pendaftaran Cepat', paper: '98%', status: 'ONLINE' }
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Status Kiosk Anjungan</span>
          <div className="text-2xl font-black text-emerald-500">4 / 4 Online</div>
          <span className="text-xs text-slate-400 mt-1 block">Semua kiosk berfungsi prima</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Check-In Mandiri</span>
          <div className="text-2xl font-black text-slate-800 dark:text-white">620 <span className="text-xs font-normal text-slate-400">Pasien</span></div>
          <span className="text-xs text-emerald-500 mt-1 block font-medium">Rata-rata 22 detik/pasien</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Panggilan Antrean TV</span>
          <div className="text-2xl font-black text-sky-600 dark:text-sky-400">1,248 <span className="text-xs font-normal text-slate-400">Panggilan</span></div>
          <span className="text-xs text-slate-400 mt-1 block">Voice TTS & Chime Aktif</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Integrasi WS Antrean BPJS</span>
          <div className="text-2xl font-black text-emerald-500">Synced</div>
          <span className="text-xs text-slate-400 mt-1 block">Response Time 42ms</span>
        </div>
      </div>

      {/* Terminal Kiosks */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Daftar Terminal Kiosk Anjungan Mandiri</h3>
            <p className="text-xs text-slate-500">Monitoring status hardware, barcode scanner, dan thermal printer pada masing-masing mesin.</p>
          </div>
          <button
            onClick={() => onNavigate('Display')}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-sky-900/20"
          >
            <Tv className="w-4 h-4" />
            Buka Display Antrean TV
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kiosks.map(kiosk => (
            <div
              key={kiosk.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center font-bold text-xs">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{kiosk.id}</h4>
                    <span className="text-xs text-slate-500">{kiosk.location}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  {kiosk.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 my-2">
                <strong>Fungsi:</strong> {kiosk.type}
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200 dark:border-slate-700/60">
                <span className="text-slate-400 flex items-center gap-1">
                  <Printer className="w-3.5 h-3.5" /> Kertas Thermal: <strong>{kiosk.paper}</strong>
                </span>
                <button
                  onClick={() => toast.success(`Test print tiket uji coba ke ${kiosk.id}... Berhasil!`)}
                  className="text-sky-600 dark:text-sky-400 font-bold hover:underline"
                >
                  Test Print
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DisplayMonitorTab() {
  const [currentPanggilan, setCurrentPanggilan] = useState({
    nomor: 'A-042',
    loket: 'Poli Penyakit Dalam (Dokter 1)',
    dokter: 'dr. Budi Setiawan, Sp.PD'
  });

  const antrianList = [
    { loket: 'Poli Umum', nomor: 'A-018', status: 'Melayani' },
    { loket: 'Poli Gigi & Mulut', nomor: 'B-009', status: 'Melayani' },
    { loket: 'Poli Anak', nomor: 'C-023', status: 'Melayani' },
    { loket: 'Poli Kandungan (Obgyn)', nomor: 'D-012', status: 'Melayani' },
    { loket: 'Loket Kasir 1', nomor: 'K-084', status: 'Melayani' },
    { loket: 'Loket Farmasi', nomor: 'F-102', status: 'Siap Ambil' }
  ];

  return (
    <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
      {/* Header Display */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">
            DISPLAY INFORMASI ANTREAN POLIKLINIK Klinik MYITARU
          </h2>
          <p className="text-xs text-slate-400">RSUD Smart Hospital - Gedung Pelayanan Rawat Jalan Terpadu</p>
        </div>
        <div className="text-right font-mono text-sm text-sky-400 font-bold">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Main Calling Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-sky-950/60 to-slate-900 border-2 border-sky-500/50 rounded-2xl p-8 text-center flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
          <span className="px-4 py-1 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
            SEDANG DIPANGGIL
          </span>
          <div className="text-6xl sm:text-8xl font-black font-mono text-sky-300 tracking-wider my-2 drop-shadow-md">
            {currentPanggilan.nomor}
          </div>
          <div className="text-2xl font-bold text-white mt-2">{currentPanggilan.loket}</div>
          <div className="text-sm text-slate-400 mt-1">{currentPanggilan.dokter}</div>
        </div>

        {/* Video / Info Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-2">
              INFORMASI & EDUKASI KESEHATAN
            </span>
            <h4 className="font-bold text-white text-base mb-2">Pentingnya Cuci Tangan 6 Langkah</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jaga kebersihan diri dan lingkungan dengan membiasakan cuci tangan memakai sabun atau hand sanitizer sebelum dan sesudah kontak dengan pasien.
            </p>
          </div>

          <div className="p-4 bg-sky-950/40 border border-sky-800/40 rounded-xl mt-4">
            <span className="text-xs font-bold text-sky-300 block mb-1">💡 Tips Pendaftaran Cepat:</span>
            <span className="text-[11px] text-slate-300 block">
              Gunakan Mobile JKN untuk booking antrean sebelum datang ke klinik.
            </span>
          </div>
        </div>
      </div>

      {/* Sub Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {antrianList.map((item, i) => (
          <div key={i} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] font-bold text-slate-400 block truncate">{item.loket}</span>
            <div className="text-2xl font-black font-mono text-white my-1">{item.nomor}</div>
            <span className="text-[10px] font-bold text-emerald-400">{item.status}</span>
          </div>
        ))}
      </div>

      {/* Running Text */}
      <div className="bg-sky-950/80 border border-sky-900 p-2.5 rounded-xl flex items-center gap-3 overflow-hidden text-xs text-sky-200">
        <span className="px-2 py-0.5 bg-sky-600 text-white font-bold rounded text-[10px] shrink-0 uppercase">
          INFO
        </span>
        <div className="font-medium truncate">
          Selamat datang di Klinik MYITARU. Harap selalu menjaga ketertiban, menjaga jarak, dan mengawasi barang bawaan Anda. Bagi pasien BPJS harap siapkan KTP dan Surat Rujukan / Surat Kontrol.
        </div>
      </div>
    </div>
  );
}

function PemanggilAntrianTab() {
  const [poliTujuan, setPoliTujuan] = useState('Poli Penyakit Dalam');
  const [nomorAntrian, setNomorAntrian] = useState('A-042');
  const [suaraSpeed, setSuaraSpeed] = useState(1);

  const handlePanggilSuara = () => {
    const textToSpeak = `Nomor antrian, ${nomorAntrian.replace('-', ' ')}, silakan menuju, ${poliTujuan}`;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'id-ID';
      utterance.rate = suaraSpeed;
      window.speechSynthesis.speak(utterance);
      toast.success(`🔊 Memanggil suara: "${textToSpeak}"`);
    } else {
      toast.success(`🔊 Suara: ${textToSpeak}`);
    }
  };

  const handleNextAntrian = () => {
    const prefix = nomorAntrian.split('-')[0];
    const num = parseInt(nomorAntrian.split('-')[1] || '0') + 1;
    const newNum = `${prefix}-${String(num).padStart(3, '0')}`;
    setNomorAntrian(newNum);
    toast.success(`Nomor antrian berganti ke ${newNum}`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-5">
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-sky-600" />
          Pemanggil Antrean Suara (TTS Smart Announcer)
        </h3>
        <p className="text-xs text-slate-500">Panggil nomor antrian pasien secara otomatis melalui pengeras suara instalasi.</p>
      </div>

      <div className="p-6 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">NOMOR SAAT INI</span>
        <div className="text-6xl font-black font-mono text-sky-600 dark:text-sky-400">
          {nomorAntrian}
        </div>
        <div className="font-bold text-slate-800 dark:text-white text-base">
          {poliTujuan}
        </div>

        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={handlePanggilSuara}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-sky-900/20 flex items-center gap-2"
          >
            <Volume2 className="w-5 h-5" />
            Panggil Pasien (Audio)
          </button>
          <button
            onClick={handleNextAntrian}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4" />
            Nomor Berikutnya
          </button>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Poliklinik / Ruang Pelayanan</label>
          <select
            value={poliTujuan}
            onChange={e => setPoliTujuan(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-semibold"
          >
            <option>Poli Penyakit Dalam</option>
            <option>Poli Anak & Tumbuh Kembang</option>
            <option>Poli Bedah Umum</option>
            <option>Poli Kebidanan & Kandungan</option>
            <option>Poli Gigi & Mulut</option>
            <option>Loket Kasir & Pembayaran</option>
            <option>Loket Farmasi & Pengambilan Obat</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Kecepatan Bicara Suara</label>
          <input
            type="range"
            min="0.8"
            max="1.3"
            step="0.1"
            value={suaraSpeed}
            onChange={e => setSuaraSpeed(parseFloat(e.target.value))}
            className="w-full accent-sky-600"
          />
          <span className="text-slate-400 text-[11px]">Kecepatan: {suaraSpeed}x</span>
        </div>
      </div>
    </div>
  );
}

function PengaturanAPMTab() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto space-y-4 text-xs">
      <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
        <Settings className="w-5 h-5 text-sky-600" />
        Konfigurasi Hardware Kiosk & Audio Chime
      </h3>

      <div>
        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">IP Address Server Anjungan</label>
        <input type="text" defaultValue="192.168.1.100:8080" className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-mono" />
      </div>

      <div>
        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Model Suara Bell Pembuka</label>
        <select className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-semibold">
          <option>Airport Chime (Ting-Tong-Ting)</option>
          <option>Modern Hospital Ding (2-Tone)</option>
          <option>Classic Bell</option>
        </select>
      </div>

      <button
        onClick={() => toast.success('Pengaturan Anjungan & Antrean disimpan!')}
        className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold shadow-md shadow-sky-900/20"
      >
        Simpan Pengaturan
      </button>
    </div>
  );
}
