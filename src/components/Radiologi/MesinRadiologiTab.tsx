import React, { useState } from 'react';
import { MesinRadiologiStatus } from './types';
import { DAFTAR_MESIN_RADIOLOGI } from './data';
import { 
  Activity, ShieldCheck, AlertTriangle, CheckCircle2, 
  Wrench, Zap, Clock, RefreshCw, Cpu, Gauge, Radio
} from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

export function MesinRadiologiTab() {
  const toast = useToast();

  const [mesinList, setMesinList] = useState<MesinRadiologiStatus[]>(() => {
    const saved = localStorage.getItem('hospital_radiologi_mesin');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn(e);
      }
    }
    return DAFTAR_MESIN_RADIOLOGI;
  });

  const saveMesin = (newList: MesinRadiologiStatus[]) => {
    setMesinList(newList);
    localStorage.setItem('hospital_radiologi_mesin', JSON.stringify(newList));
  };

  const handleRunCalibration = (mesin: MesinRadiologiStatus) => {
    toast.info(`Memulai QA/QC Kalibrasi Harian untuk ${mesin.nama_alat}...`);
    setTimeout(() => {
      const updated = mesinList.map(m => {
        if (m.id === mesin.id) {
          return {
            ...m,
            status: 'Operasional / Siap' as const,
            uji_kesesuaian_bapeten: `Lolos Uji QA/QC BAPETEN & BPFK (${new Date().toLocaleDateString('id-ID')})`
          };
        }
        return m;
      });
      saveMesin(updated);
      toast.success(`Kalibrasi ${mesin.nama_alat} berhasil lolos (Passed 100%)`);
    }, 800);
  };

  const handleToggleMaintenance = (mesin: MesinRadiologiStatus) => {
    const newStatus = mesin.status === 'Kalibrasi / Maintenance' ? 'Operasional / Siap' : 'Kalibrasi / Maintenance';
    const updated = mesinList.map(m => m.id === mesin.id ? { ...m, status: newStatus as any } : m);
    saveMesin(updated);
    toast.info(`Status ${mesin.nama_alat} diubah menjadi: ${newStatus}`);
  };

  return (
    <div className="space-y-6 text-left">
      {/* SUMMARY BANNER */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 rounded-2xl border border-slate-700 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-pink-600/30 rounded-xl text-pink-400 border border-pink-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-extrabold tracking-tight">
              Monitoring Kesiapan Alat & Keselamatan Radiasi (BAPETEN & QA/QC)
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Sistem pemantauan status mesin radiologi real-time, izin pemanfaatan radiasi BAPETEN, kalibrasi uji kesesuaian BPFK, dan beban kerja harian modalitas imaging.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Mesin Aktif</span>
            <span className="text-xl font-mono font-extrabold text-emerald-400">
              {mesinList.filter(m => m.status === 'Operasional / Siap' || m.status === 'Sedang Scanning').length} / {mesinList.length} Unit
            </span>
          </div>
        </div>
      </div>

      {/* GRID OF MACHINES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {mesinList.map((m) => {
          const isReady = m.status === 'Operasional / Siap';
          const isInUse = m.status === 'Sedang Scanning';
          const isMaintenance = m.status === 'Kalibrasi / Maintenance';

          return (
            <div
              key={m.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4 relative overflow-hidden"
            >
              {/* Top Bar */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-mono font-bold text-pink-600 dark:text-pink-400 block">
                    {m.id} • {m.modalitas}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-0.5">
                    {m.nama_alat}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {m.merk_tipe}
                  </p>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  isInUse ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 animate-pulse' :
                  isReady ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                  'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                }`}>
                  {m.status}
                </span>
              </div>

              {/* Location & Room */}
              <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{m.ruangan}</span>
              </div>

              {/* Active patient if scanning */}
              {m.pasien_saat_ini && (
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold block text-[10px] uppercase tracking-wider">
                    Sedang Scanning Pasien:
                  </span>
                  <span className="font-bold text-indigo-950 dark:text-indigo-200 block mt-0.5">
                    {m.pasien_saat_ini}
                  </span>
                </div>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 block text-[11px]">Pasien Hari Ini</span>
                  <span className="text-lg font-mono font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                    {m.total_pasien_hari_ini} Pasien
                  </span>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-slate-500 block text-[11px]">Koneksi PACS</span>
                  <span className="text-lg font-mono font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block flex items-center gap-1">
                    <Radio className="w-4 h-4" /> Online
                  </span>
                </div>
              </div>

              {/* BAPETEN & QA/QC INFO */}
              <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <span className="block text-slate-400">Uji Kesesuaian BAPETEN / BPFK:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">{m.uji_kesesuaian_bapeten}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>Masa Berlaku Izin:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{m.masa_berlaku_izin}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handleRunCalibration(m)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Kalibrasi QA/QC
                </button>

                <button
                  onClick={() => handleToggleMaintenance(m)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    isMaintenance
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-800 dark:text-amber-200'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{isMaintenance ? 'Aktifkan' : 'Maintenance'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
