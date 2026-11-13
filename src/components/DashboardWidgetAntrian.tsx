import React from 'react';
import { Volume2, Stethoscope } from 'lucide-react';
import { useAntrian } from '../contexts/AntrianContext';
import { motion, AnimatePresence } from 'motion/react';

export function DashboardWidgetAntrian() {
  const {
    antrianList,
    totalPasienHariIni,
    totalMenunggu
  } = useAntrian();

  // Ambil antrian yang sedang aktif (Dipanggil / Dilayani)
  const antrianAktif = (antrianList || []).filter(a => a && (a.status === 'Dipanggil' || a.status === 'Dilayani'));
  
  // Ambil antrian yang menunggu
  const antrianMenunggu = (antrianList || []).filter(a => a && a.status === 'Menunggu').slice(0, 5);

  const gabunganAntrian = [...antrianAktif, ...antrianMenunggu].slice(0, 5);

  return (
    <div className="bg-white/95 dark:bg-[#0B1E36]/80 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-[#C9A94E]/30 shadow-lg dark:shadow-[0_10px_35px_rgba(11,30,54,0.6)] overflow-hidden h-full flex flex-col p-5 relative group hover:border-amber-400 dark:hover:border-[#C9A94E]/60 transition-all duration-300">
      {/* Aksen Garis Emas Atas */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#0F3B5E] via-[#E5CA78] to-[#C9A94E]"></div>

      {/* Background Soft Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C9A94E]/10 rounded-full blur-2xl pointer-events-none"></div>
      
      {/* SECTION JUDUL & STATISTIK */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-[13px] md:text-sm font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:to-[#E5CA78] leading-tight">Antrian Poli Hari Ini</h1>
          <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 text-[9px] font-bold rounded-full shadow-sm flex items-center gap-1.5 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 bg-rose-500 dark:bg-rose-400 rounded-full"></div> LIVE
          </span>
        </div>
        
        {/* Kotak Statistik Mewah Glassmorphic */}
        <div className="flex bg-slate-50 dark:bg-[#08182B]/80 backdrop-blur-md border border-slate-200 dark:border-[#C9A94E]/30 rounded-xl shadow-sm overflow-hidden">
          <div className="px-2.5 py-1 border-r border-slate-200 dark:border-[#C9A94E]/30 flex flex-col items-center justify-center min-w-[50px] bg-white dark:bg-white/[0.04]">
            <span className="text-[9px] text-slate-500 dark:text-slate-300 uppercase font-bold tracking-wide">Total</span>
            <span className="text-base font-black text-amber-600 dark:text-[#E5CA78] leading-none mt-0.5">{totalPasienHariIni}</span>
          </div>
          <div className="px-2.5 py-1 flex flex-col items-center justify-center min-w-[50px] bg-amber-50/80 dark:bg-[#C9A94E]/10">
            <span className="text-[9px] text-slate-500 dark:text-slate-300 uppercase font-bold tracking-wide">Antre</span>
            <span className="text-base font-black text-amber-600 dark:text-amber-400 leading-none mt-0.5">{totalMenunggu}</span>
          </div>
        </div>
      </div>

      {/* STATUS PANGGILAN (Chip Premium) - Muncul jika ada yang dipanggil */}
      <AnimatePresence>
        {antrianAktif.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 backdrop-blur-md rounded-xl shadow-[0_2px_12px_rgba(16,185,129,0.25)] flex items-center gap-2 border border-emerald-400/50 relative z-10"
          >
            <Volume2 className="text-white w-3.5 h-3.5 drop-shadow-md" />
            <span className="text-white text-[10px] font-bold tracking-wider drop-shadow-sm">SEDANG DIPANGGIL / DILAYANI</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DAFTAR ANTRIAN (Density Tinggi + Dual-Theme Table) */}
      <div className="bg-slate-50/90 dark:bg-[#08182B]/60 backdrop-blur-md rounded-xl shadow-inner border border-slate-200 dark:border-[#C9A94E]/20 flex flex-col overflow-hidden flex-1 relative z-10">
        {gabunganAntrian.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {gabunganAntrian.map((a, idx) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex items-center justify-between px-3 h-[42px] transition-colors border-b border-slate-200/70 dark:border-white/[0.04] last:border-b-0 group ${idx % 2 === 0 ? 'bg-white/70 dark:bg-white/[0.03]' : 'bg-transparent'} hover:bg-amber-50/60 dark:hover:bg-white/[0.08]`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`text-xs font-black shrink-0 w-[72px] tracking-tight ${a.status === 'Dipanggil' || a.status === 'Dilayani' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-700 dark:text-[#E5CA78]'}`}>
                    {a.nomorAntrian}
                  </span>
                  <div className="flex flex-col min-w-0 border-l border-slate-200 dark:border-white/10 pl-2.5">
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate leading-tight">
                      {a.namaPasien}
                    </span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-300 truncate leading-tight mt-0.5">
                      {a.poliNama}
                    </span>
                  </div>
                </div>
                <Stethoscope className="text-amber-600 dark:text-[#E5CA78] w-3.5 h-3.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-slate-500 dark:text-slate-400 italic p-4">
            Belum ada antrian hari ini.
          </div>
        )}
      </div>
      
    </div>
  );
}
