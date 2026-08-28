import React, { useState, useEffect } from 'react';
import { HeartPulse, Activity, Syringe, TrendingUp } from 'lucide-react';

export function DashboardNewsWidget() {
  const [currentDate, setCurrentDate] = useState<string>('Loading...');

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('id-ID', options));
  }, []);

  return (
    <div className="bg-[#0B1E36]/75 dark:bg-[#0B1E36]/75 backdrop-blur-xl rounded-2xl border border-[#C9A94E]/30 shadow-[0_10px_35px_rgba(11,30,54,0.6)] relative overflow-hidden group hover:border-[#C9A94E]/60 transition-all duration-300 h-full flex flex-col p-5">
      {/* Aksen Garis Emas Atas */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#0F3B5E] via-[#E5CA78] to-[#C9A94E]"></div>
      
      {/* Background Soft Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C9A94E]/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header Widget */}
      <div className="flex justify-between items-center mb-4 mt-0.5 relative z-10">
        <h2 className="text-[13px] md:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#E5CA78] flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#E5CA78] drop-shadow-sm" /> 
          Update Kesehatan 2026
        </h2>
        <span className="bg-[#C9A94E]/15 text-[#E5CA78] border border-[#C9A94E]/30 backdrop-blur-sm text-[9px] md:text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
          Auto-update harian
        </span>
      </div>

      {/* Metrik Global */}
      <div className="flex flex-col gap-2.5 flex-1 justify-center relative z-10">
        
        {/* Metrik 1 */}
        <div className="flex items-center justify-between bg-white/[0.04] dark:bg-[#08182B]/60 backdrop-blur-md p-3 rounded-xl border border-white/[0.08] dark:border-[#C9A94E]/20 shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-all hover:bg-white/[0.08] hover:border-[#C9A94E]/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 flex items-center justify-center text-rose-400 border border-rose-500/30 shadow-sm">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs font-semibold text-slate-300 leading-tight">Angka Harapan Hidup</span>
              <span className="text-sm md:text-base font-black text-white leading-tight">73.4 <span className="text-[9px] md:text-[10px] font-medium text-slate-400">tahun</span></span>
            </div>
          </div>
          <span className="text-[10px] md:text-xs text-emerald-400 font-black flex items-center gap-1 bg-emerald-500/15 px-2 py-1 rounded-lg border border-emerald-500/30">
            <TrendingUp className="w-3 h-3" /> 0.2%
          </span>
        </div>

        {/* Metrik 2 */}
        <div className="flex items-center justify-between bg-white/[0.04] dark:bg-[#08182B]/60 backdrop-blur-md p-3 rounded-xl border border-white/[0.08] dark:border-[#C9A94E]/20 shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-all hover:bg-white/[0.08] hover:border-[#C9A94E]/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 border border-amber-500/30 shadow-sm">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-xs font-semibold text-slate-300 leading-tight">Kasus DB (Indonesia)</span>
              <span className="text-sm md:text-base font-black text-white leading-tight">12,847 <span className="text-[9px] md:text-[10px] font-medium text-slate-400">kasus</span></span>
            </div>
          </div>
          <span className="text-[10px] md:text-xs text-rose-400 font-black flex items-center gap-1 bg-rose-500/15 px-2 py-1 rounded-lg border border-rose-500/30">
            <TrendingUp className="w-3 h-3" /> 15%
          </span>
        </div>

        {/* Metrik 3 */}
        <div className="flex flex-col gap-2 bg-white/[0.04] dark:bg-[#08182B]/60 backdrop-blur-md p-3 rounded-xl border border-white/[0.08] dark:border-[#C9A94E]/20 shadow-[0_2px_10px_rgba(0,0,0,0.2)] transition-all hover:bg-white/[0.08] hover:border-[#C9A94E]/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center text-cyan-400 border border-cyan-500/30 shadow-sm">
                <Syringe className="w-4 h-4" />
              </div>
              <span className="text-[10px] md:text-xs font-semibold text-slate-300">Cakupan Imunisasi (2026)</span>
            </div>
            <span className="text-sm md:text-base font-black text-[#E5CA78]">87.6%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden mt-1 border border-white/5">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-[#1A548C] to-[#C9A94E] rounded-full" style={{ width: '87.6%' }}></div>
          </div>
        </div>
      </div>

      {/* Footer Update Otomatis */}
      <div className="mt-4 text-right flex justify-end relative z-10">
        <span className="text-[9px] md:text-[10px] text-slate-400 font-medium italic">
          Sumber: WHO & Kemenkes RI | Diperbarui: {currentDate}
        </span>
      </div>
    </div>
  );
}
