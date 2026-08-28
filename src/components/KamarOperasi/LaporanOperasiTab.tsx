import React from 'react';
import { PasienOperasiItem, RuangOKStatus } from './types';
import { 
  FileSpreadsheet, Activity, TrendingUp, BarChart3, 
  PieChart as PieIcon, ShieldCheck, Download, Printer, CheckCircle2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { useToast } from '../../contexts/ToastContext';

interface LaporanOperasiTabProps {
  pasienList: PasienOperasiItem[];
  ruangOKList: RuangOKStatus[];
}

export function LaporanOperasiTab({ pasienList, ruangOKList }: LaporanOperasiTabProps) {
  const toast = useToast();

  // Monthly Trend Data
  const monthlyData = [
    { bulan: 'Jan', elektif: 42, cito: 12, total: 54 },
    { bulan: 'Feb', elektif: 48, cito: 15, total: 63 },
    { bulan: 'Mar', elektif: 55, cito: 18, total: 73 },
    { bulan: 'Apr', elektif: 50, cito: 14, total: 64 },
    { bulan: 'Mei', elektif: 62, cito: 20, total: 82 },
    { bulan: 'Jun', elektif: 58, cito: 16, total: 74 },
    { bulan: 'Jul', elektif: 65, cito: 22, total: 87 },
    { bulan: 'Agu (Est)', elektif: 70, cito: 24, total: 94 }
  ];

  // Specialty Distribution
  const specialtyData = [
    { name: 'Bedah Umum & Digestif', value: 35, color: '#f43f5e' },
    { name: 'Obstetri & Ginekologi', value: 25, color: '#ec4899' },
    { name: 'Orthopedi & Trauma', value: 18, color: '#3b82f6' },
    { name: 'Urologi & Endourologi', value: 12, color: '#06b6d4' },
    { name: 'Bedah Mata & Katarak', value: 10, color: '#10b981' }
  ];

  // Export to CSV
  const handleExportCSV = () => {
    const headers = 'No_Operasi,No_RM,Nama_Pasien,Penjamin,Tindakan,ICD9,Dokter_Operator,Ruang_OK,Status,Sifat\n';
    const rows = pasienList.map(p => 
      `"${p.nomor}","${p.no_rm}","${p.nama_pasien}","${p.penjamin}","${p.tindakan}","${p.kode_icd9}","${p.operator}","${p.ruang_ok}","${p.status}","${p.sifat_operasi}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Kamar_Operasi_MYITARU_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Laporan Operasi berhasil diexport ke CSV!');
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-lg backdrop-blur-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-rose-500" /> Laporan & Analitik Pelayanan Instalasi Bedah Sentral
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Indikator Mutu Nasional (INM) Kamar Bedah, utilisasi ruang operasi, dan audit keselamatan bedah WHO
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/40 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Indikator Mutu Nasional (INM) Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Kepatuhan WHO Checklist</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">100%</div>
          <div className="text-[11px] text-slate-400 mt-1">Target Kemenkes: 100% (Tercapai)</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Penundaan Operasi Elektif</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">0.8%</div>
          <div className="text-[11px] text-slate-400 mt-1">Standar Nasional &lt; 5.0%</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Kematian di Meja Operasi</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">0.00%</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero Death on Table</div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl shadow-sm">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
            <span>Insiden Benda Asing Tertinggal</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">0 Kasus</div>
          <div className="text-[11px] text-slate-400 mt-1">Sign-Out Kassa Sesuai 100%</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Trend Volume Operasi */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-lg backdrop-blur-md">
          <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-rose-500" /> Tren Volume Tindakan Bedah (Elektif vs Cito 2026)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="bulan" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="elektif" name="Elektif" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cito" name="Cito Emergency" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Proporsi Spesialisasi */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-lg backdrop-blur-md">
          <h3 className="font-bold text-white text-sm mb-4 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-rose-500" /> Distribusi Tindakan Berdasarkan Spesialisasi Bedah
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={specialtyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: any) => `${(name || '').split(' ')[0]} (${((percent || 0) * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {specialtyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Kamar Operasi Utilization Table */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-lg backdrop-blur-md space-y-4">
        <h3 className="font-bold text-white text-sm">Tingkat Utilisasi & Efisiensi Kamar Operasi (OK 1 - OK 5)</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ruangOKList.map((room) => {
            const usagePercent = String(room.id).includes('01') || room.id === 1 ? 88 : String(room.id).includes('02') || room.id === 2 ? 75 : String(room.id).includes('03') || room.id === 3 ? 68 : String(room.id).includes('04') || room.id === 4 ? 92 : 60;
            return (
              <div key={room.id} className="p-3.5 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{room.nama.split('-')[0]}</span>
                  <span className="text-emerald-400 font-bold">{usagePercent}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${usagePercent}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">{room.spesialisasi}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
