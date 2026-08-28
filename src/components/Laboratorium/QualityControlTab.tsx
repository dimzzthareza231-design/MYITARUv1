import React, { useState } from 'react';
import { AnalyzerMachine, LeveyJenningsPoint } from './types';
import { ANALYZER_MACHINES_MOCK, LEVEY_JENNINGS_MOCK } from './data';
import { 
  Activity, CheckCircle2, AlertTriangle, RefreshCw, 
  Cpu, Wrench, ShieldCheck, Play, ArrowUpRight, Flame, BarChart3, Database
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { useToast } from '../../contexts/ToastContext';

export function QualityControlTab() {
  const toast = useToast();
  const [analyzers, setAnalyzers] = useState<AnalyzerMachine[]>(() => {
    const saved = localStorage.getItem('hospital_lab_analyzers');
    return saved ? JSON.parse(saved) : ANALYZER_MACHINES_MOCK;
  });

  const [qcData, setQcData] = useState<LeveyJenningsPoint[]>(() => {
    const saved = localStorage.getItem('hospital_lab_qc_points');
    return saved ? JSON.parse(saved) : LEVEY_JENNINGS_MOCK;
  });

  const [selectedParameter, setSelectedParameter] = useState('Hemoglobin Level 2 Control');
  const [isRunningQC, setIsRunningQC] = useState(false);

  // Mean & SD for selected control (Simulated: Mean 14.0, SD 0.3)
  const targetMean = 14.0;
  const targetSD = 0.3;
  const plus1SD = targetMean + targetSD;
  const minus1SD = targetMean - targetSD;
  const plus2SD = targetMean + 2 * targetSD;
  const minus2SD = targetMean - 2 * targetSD;
  const plus3SD = targetMean + 3 * targetSD;
  const minus3SD = targetMean - 3 * targetSD;

  // RUN DAILY QC
  const handleRunDailyQC = () => {
    setIsRunningQC(true);
    toast.info('Menjalankan Siklus Quality Control (QC) Internal Harian pada seluruh mesin analyzer...');

    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      const randomVal = Number((targetMean + (Math.random() * 0.4 - 0.2)).toFixed(2));
      const diff = randomVal - targetMean;
      const sdDiff = Number((diff / targetSD).toFixed(2));
      
      const newPoint: LeveyJenningsPoint = {
        date: today,
        value: randomVal,
        mean: targetMean,
        sd: targetSD,
        rule_violation: Math.abs(sdDiff) > 2 ? '1-2s Warning' : undefined,
        status: Math.abs(sdDiff) > 3 ? 'Failed' : Math.abs(sdDiff) > 2 ? 'Warning' : 'In-Control',
        status_westgard: Math.abs(sdDiff) > 2 ? '1-2s Warning' : 'In-Control'
      };

      const updatedPoints = [...qcData, newPoint];
      setQcData(updatedPoints);
      localStorage.setItem('hospital_lab_qc_points', JSON.stringify(updatedPoints));

      const updatedAnalyzers = analyzers.map(a => ({
        ...a,
        status_qc_hari_ini: 'Passed (Westgard In-Control)',
        qc_status: 'Passed',
        last_qc: `${today} 08:00 WIB`
      }));
      setAnalyzers(updatedAnalyzers);
      localStorage.setItem('hospital_lab_analyzers', JSON.stringify(updatedAnalyzers));

      setIsRunningQC(false);
      toast.success('Siklus QC Internal harian berhasil dijalankan! Semua instrumen In-Control (Westgard Valid).');
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left">
      {/* HEADER BANNER */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl">
            <Activity className="w-6 h-6" />
          </span>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Quality Control (QC) & Monitoring Instrumen Analyzer LIS
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi Presisi, Akurasi, Westgard Multi-Rules, dan Status Alat Otomatis ISO 15189.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunDailyQC}
          disabled={isRunningQC}
          className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
        >
          <Play className={`w-4 h-4 ${isRunningQC ? 'animate-spin' : ''}`} />
          <span>{isRunningQC ? 'Sedang Menjalankan Kalibrasi...' : 'Jalankan Siklus QC Harian'}</span>
        </button>
      </div>

      {/* ANALYZER INSTRUMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analyzers.map(machine => {
          const isOnline = machine.status?.includes('Operasional') || machine.status?.includes('Running') || machine.status?.includes('Siap');
          const isQcPassed = (machine.status_qc_hari_ini || machine.qc_status || '').includes('Passed') || machine.qc_status === 'Passed';
          const reagenVal = machine.reagen_persen ?? 78;
          const wasteVal = machine.waste_persen ?? 24;

          return (
            <div
              key={machine.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-600">{machine.id}</span>
                    <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
                    {machine.nama_alat}
                  </h4>
                  <span className="text-[11px] text-slate-500">{machine.merk || machine.modalitas}</span>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isOnline ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }`}>
                  {machine.status}
                </span>
              </div>

              {/* REAGENT & WASTE METRICS */}
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Sisa Reagen:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{reagenVal}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        reagenVal < 20 ? 'bg-rose-500' : reagenVal < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${reagenVal}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-500">Kapasitas Limbah (Waste):</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{wasteVal}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        wasteVal > 80 ? 'bg-rose-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${wasteVal}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* QC BADGE & DETAILS */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Koneksi LIS / Ruangan</span>
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                    {machine.koneksi_lis}
                  </span>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                  isQcPassed 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{machine.status_qc_hari_ini || machine.qc_status || 'Passed'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* LEVEY-JENNINGS QC CHART SECTION */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-600" />
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Kurva Kontrol Kualitas Levey-Jennings (Internal QC)
              </h4>
            </div>
            <p className="text-xs text-slate-500">
              Evaluasi stabilitas alat berdasarkan simpangan baku (&plusmn;1SD, &plusmn;2SD, &plusmn;3SD).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500">Pilih Parameter:</label>
            <select
              value={selectedParameter}
              onChange={e => setSelectedParameter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 font-bold outline-none"
            >
              <option value="Hemoglobin Level 2 Control">Hemoglobin Level 2 (Sysmex)</option>
              <option value="Glukosa Level 1 Control">Glukosa Serum Control (Cobas)</option>
              <option value="Troponin Level Normal">Troponin I Control (Abbott)</option>
            </select>
          </div>
        </div>

        {/* CHART CONTAINER */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={qcData} margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[13.0, 15.0]} tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', color: '#fff', borderRadius: '0.75rem', fontSize: '12px' }}
                formatter={(value: any) => [`${value} g/dL`, 'Nilai QC']}
              />
              
              {/* REFERENCE LINES */}
              <ReferenceLine y={targetMean} stroke="#059669" strokeWidth={2} label={{ value: 'Mean (14.0)', fill: '#059669', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={plus2SD} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '+2SD (14.6)', fill: '#f59e0b', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={minus2SD} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '-2SD (13.4)', fill: '#f59e0b', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={plus3SD} stroke="#e11d48" strokeDasharray="2 2" label={{ value: '+3SD (14.9)', fill: '#e11d48', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={minus3SD} stroke="#e11d48" strokeDasharray="2 2" label={{ value: '-3SD (13.1)', fill: '#e11d48', fontSize: 10, position: 'right' }} />

              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#0891b2" 
                strokeWidth={3} 
                dot={{ r: 5, fill: '#0891b2' }} 
                activeDot={{ r: 7 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* WESTGARD RULES GUIDE */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">Rule 1-2s (Warning)</span>
            <span className="text-[11px] text-slate-500">1 titik berada di luar rentang &plusmn;2SD. Perlu observasi run berikutnya.</span>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200">
            <span className="font-mono font-bold block">Rule 1-3s (Reject)</span>
            <span className="text-[11px]">1 titik di luar &plusmn;3SD. Kesalahan acak (Random Error). Tolak run & kalibrasi ulang.</span>
          </div>
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200">
            <span className="font-mono font-bold block">Rule 2-2s (Reject)</span>
            <span className="text-[11px]">2 titik berturut-turut di luar &plusmn;2SD pada sisi yang sama. Systematic Error.</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">Rule 10-x (Reject)</span>
            <span className="text-[11px] text-slate-500">10 titik berturut-turut pada 1 sisi mean. Mengindikasikan pergeseran reagen.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
