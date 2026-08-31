import React, { useState, useEffect } from 'react';
import {
  Tv, Volume2, Users, Play, RefreshCw, Maximize2, Minimize2,
  Sparkles, CheckCircle2, ArrowRight, Stethoscope, Clock, ShieldCheck,
  AlertCircle, ChevronRight, HeartPulse, Pill, CreditCard, BellRing
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { MasterPoli, Pasien, Kunjungan, Dokter } from '../types';

interface PoliklinikQueueDisplayProps {
  currentPoli: MasterPoli | null;
  kunjungan: Kunjungan[];
  pasien: Pasien[];
  dokter: Dokter[];
  allPoliList: MasterPoli[];
  activeQueueId: string | null;
  onSelectQueue: (queueId: string) => void;
  onCallQueue: (queueId: string, nomor: string, nama: string, poliNama: string) => void;
  onStartExam: (queueId: string) => void;
  onPoliChange?: (poliId: string) => void;
}

export function PoliklinikQueueDisplay({
  currentPoli,
  kunjungan,
  pasien,
  dokter,
  allPoliList,
  activeQueueId,
  onSelectQueue,
  onCallQueue,
  onStartExam,
  onPoliChange
}: PoliklinikQueueDisplayProps) {
  const toast = useToast();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Clock timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter rawat jalan visits
  const ralanVisits = kunjungan.filter(
    k => k.tipe === 'Rawat Jalan' || k.tipe === 'Poliklinik' || (k as any).jenis_kunjungan === 'Rawat Jalan'
  );

  // Find currently calling or active patient
  const callingVisit = ralanVisits.find(k => k.status === 'Panggil') ||
    ralanVisits.find(k => k.status === 'Diperiksa') ||
    (activeQueueId ? ralanVisits.find(k => k.id === activeQueueId) : null) ||
    ralanVisits[0];

  const callingPatient = callingVisit
    ? pasien.find(p => String(p.id) === String(callingVisit.pasien_id))
    : null;

  const callingPoli = callingVisit
    ? allPoliList.find(p => p.id === callingVisit.poli_id)
    : currentPoli || allPoliList[0];

  const callingDokter = callingVisit
    ? dokter.find(d => d.id === callingVisit.dokter_id || d.poli_id === callingVisit.poli_id)
    : dokter.find(d => d.poli_id === callingPoli?.id) || dokter[0];

  // TTS Speech Announcer
  const triggerVoiceCall = (nomor: string, poliNama: string, namaPasien?: string) => {
    const speechText = `Nomor antrean ${nomor.replace('-', ' ')}, atas nama ${namaPasien || 'Pasien'}, silakan menuju ${poliNama}`;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'id-ID';
      utterance.rate = speechSpeed;
      window.speechSynthesis.speak(utterance);
      toast.success(`🔊 Panggilan Suara: ${speechText}`);
    } else {
      toast.success(`🔊 Panggilan: ${speechText}`);
    }
  };

  const handleManualCall = () => {
    if (!callingVisit) {
      toast.error('Tidak ada antrean yang dapat dipanggil.');
      return;
    }
    const nomor = callingVisit.nomor_antrian || 'A-001';
    const poliNama = callingPoli?.nama || 'Poliklinik Rawat Jalan';
    const nama = callingPatient?.nama || 'Pasien';
    onCallQueue(callingVisit.id, nomor, nama, poliNama);
    triggerVoiceCall(nomor, poliNama, nama);
  };

  // Find next waiting queue in current or all poli
  const waitingVisits = ralanVisits.filter(k => k.status === 'Menunggu' || !k.status);
  const handleCallNext = () => {
    const nextVisit = currentPoli
      ? waitingVisits.find(k => k.poli_id === currentPoli.id) || waitingVisits[0]
      : waitingVisits[0];

    if (nextVisit) {
      const p = pasien.find(px => String(px.id) === String(nextVisit.pasien_id));
      const poliObj = allPoliList.find(pl => pl.id === nextVisit.poli_id);
      const poliNama = poliObj?.nama || 'Poliklinik';
      const nomor = nextVisit.nomor_antrian || 'A-000';
      const nama = p?.nama || 'Pasien';

      onSelectQueue(nextVisit.id);
      onCallQueue(nextVisit.id, nomor, nama, poliNama);
      triggerVoiceCall(nomor, poliNama, nama);
    } else {
      toast.info('Semua antrean pasien sudah dipanggil / selesai.');
    }
  };

  // Sub-counters summary per active poliklinik
  const subCounterPoliList = allPoliList.slice(0, 6);

  const displayContent = (
    <div className="bg-slate-950 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col space-y-5">
      {/* Top TV Monitor Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-4 border-b border-slate-800/90">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-cyan-200">
                DISPLAY INFORMASI ANTREAN POLIKLINIK
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE TV
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              RSUD Smart Hospital • Gedung Pelayanan Rawat Jalan Terpadu (Lantai 1 & 2)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Realtime Clock & Date */}
          <div className="hidden sm:flex flex-col text-right font-mono bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-sky-400 font-bold">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
            </span>
            <span className="text-[10px] text-slate-400">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all shadow-sm"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Buka Layar Penuh (TV Monitor)'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Calling Box & Education Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Calling Board (8 cols) */}
        <div className="lg:col-span-8 bg-gradient-to-br from-sky-950/70 via-slate-900 to-slate-950 border-2 border-sky-500/50 rounded-2xl p-6 sm:p-7 text-center flex flex-col items-center justify-between shadow-2xl relative overflow-hidden group">
          {/* Top Status Badge */}
          <div className="w-full flex justify-between items-center mb-2">
            <span className="px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-400/40 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              <BellRing className="w-3.5 h-3.5" />
              SEDANG DIPANGGIL
            </span>

            <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
              Loket: {callingPoli?.kode || 'POLI'}
            </span>
          </div>

          {/* Giant Calling Number */}
          <div className="my-3">
            <div className="text-6xl sm:text-8xl font-black font-mono text-sky-300 tracking-wider drop-shadow-[0_10px_20px_rgba(56,189,248,0.3)]">
              {callingVisit?.nomor_antrian || 'A-001'}
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white mt-2">
              {callingPatient?.nama || 'Pasien Rawat Jalan'}
            </div>
            <div className="text-sm font-semibold text-cyan-300 mt-0.5">
              {callingPoli?.nama || 'Poli Penyakit Dalam'}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
              <span>DPJP: {callingDokter?.nama || 'dr. Spesialis Jaga'}</span>
            </div>
          </div>

          {/* Direct Action Buttons on Main Board */}
          <div className="w-full pt-4 border-t border-slate-800/80 flex flex-wrap gap-2 sm:gap-3 justify-center items-center">
            <button
              onClick={handleManualCall}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-sky-900/30 flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <Volume2 className="w-4 h-4" />
              <span>Panggil Suara (TTS)</span>
            </button>

            <button
              onClick={handleCallNext}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <span>Panggil Berikutnya</span>
            </button>

            {callingVisit && (
              <button
                onClick={() => onStartExam(callingVisit.id)}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <Stethoscope className="w-4 h-4" />
                <span>Mulai Periksa (SOAP)</span>
              </button>
            )}
          </div>
        </div>

        {/* Education & Info Side Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  EDUKASI & PROTOKOL KLINIK
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Info Pasien</span>
              </div>

              <h4 className="font-bold text-white text-sm mb-1.5">
                Pentingnya Cuci Tangan 6 Langkah & Etika Batuk
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Jaga kebersihan diri dengan mencuci tangan menggunakan sabun / hand sanitizer sebelum dan sesudah pemeriksaan medis di poliklinik.
              </p>
            </div>

            <div className="mt-4 p-3 bg-sky-950/40 border border-sky-800/40 rounded-xl">
              <span className="text-xs font-bold text-sky-300 block mb-1">
                💡 Reservasi Cepat Mobile JKN:
              </span>
              <span className="text-[11px] text-slate-300 block leading-tight">
                Gunakan aplikasi Mobile JKN untuk check-in mandiri & pengambilan antrean dari rumah tanpa perlu menunggu di loket pendaftaran.
              </span>
            </div>
          </div>

          {/* Quick Queue Stats */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 font-medium block">Total Antrean Hari Ini</span>
              <span className="text-xl font-black text-white font-mono">{ralanVisits.length}</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-amber-400 font-medium block">Sisa Menunggu</span>
              <span className="text-xl font-black text-amber-400 font-mono">{waitingVisits.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-counters Grid per Poliklinik */}
      <div>
        <div className="flex justify-between items-center mb-2.5 px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-cyan-400" />
            STATUS ANTREAN POLIKLINIK LAINNYA
          </span>
          <span className="text-[11px] text-slate-500">Klik poliklinik untuk beralih</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {subCounterPoliList.map((pItem) => {
            const poliQueues = ralanVisits.filter(k => k.poli_id === pItem.id);
            const activeVisitInPoli = poliQueues.find(k => k.status === 'Diperiksa' || k.status === 'Panggil') || poliQueues[0];
            const waitingCount = poliQueues.filter(k => k.status === 'Menunggu' || !k.status).length;
            const isCurrent = currentPoli?.id === pItem.id;

            return (
              <div
                key={pItem.id}
                onClick={() => onPoliChange && onPoliChange(pItem.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer text-center flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-sky-950/60 border-sky-500 shadow-md ring-1 ring-sky-500/50'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="text-base mb-1">{pItem.icon || '🩺'}</div>
                  <span className="text-[11px] font-bold text-slate-300 block truncate" title={pItem.nama}>
                    {pItem.nama.replace('Poliklinik ', 'Poli ')}
                  </span>
                  <div className="text-xl font-black font-mono text-sky-400 my-1">
                    {activeVisitInPoli?.nomor_antrian || `${pItem.kode}-001`}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-800/80 text-slate-400">
                  <span>Antre: <strong className="text-amber-400">{waitingCount}</strong></span>
                  <span className="text-emerald-400 font-bold">
                    {activeVisitInPoli?.status || 'Siap'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Running Announcement Text (Tulisan Bergerak / Marquee) */}
      <div className="bg-sky-950/70 border border-sky-900/70 p-2.5 rounded-xl flex items-center gap-3 overflow-hidden text-xs text-sky-200 shadow-inner">
        <div className="px-2.5 py-1 bg-gradient-to-r from-sky-600 to-blue-600 text-white font-black rounded-lg text-[10px] shrink-0 uppercase tracking-wider shadow-md flex items-center gap-1.5 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
          PENGUMUMAN
        </div>
        <div className="w-full overflow-hidden relative flex items-center">
          <div className="animate-marquee font-medium text-sky-200 text-xs sm:text-sm">
            📢 Selamat datang di Poliklinik Rawat Jalan MYITARU SIMK. Harap menjaga ketertiban, membawa kartu identitas (KTP) &amp; Kartu BPJS / Surat Rujukan saat dipanggil dokter. Mohon tertib di ruang tunggu dan perhatikan panggilan nomor antrean pada layar monitor. Terima kasih atas kerjasama Anda.
          </div>
        </div>
      </div>
    </div>
  );

  // If Fullscreen TV mode is requested
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 p-6 sm:p-10 overflow-y-auto flex flex-col justify-between">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center">
          {displayContent}
        </div>
      </div>
    );
  }

  return displayContent;
}
