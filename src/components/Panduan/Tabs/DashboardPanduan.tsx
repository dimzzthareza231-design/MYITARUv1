import React from 'react';
import { FileText, Printer, Star, AlertTriangle, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Senin', usage: 400 },
  { name: 'Selasa', usage: 300 },
  { name: 'Rabu', usage: 550 },
  { name: 'Kamis', usage: 200 },
  { name: 'Jumat', usage: 278 },
  { name: 'Sabtu', usage: 189 },
  { name: 'Minggu', usage: 239 },
];

export function DashboardPanduan({ onNavigate }: { onNavigate?: (tab: any) => void }) {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Panduan Sistem</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Ringkasan aktivitas, statistik pembaca, dan efektivitas SOP operasional Klinik.</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => onNavigate?.('feedback')}
            className="px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            Lihat Feedback
          </button>
          <button
            onClick={() => onNavigate?.('editor')}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Buat Panduan Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Panduan Aktif', value: '25', icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/40' },
          { label: 'Total Cetakan Bulan Ini', value: '450', icon: Printer, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
          { label: 'Rating Kepuasan Staff', value: '4.8 / 5.0', icon: Star, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' },
          { label: 'Panduan Perlu Review', value: '3 Dokumen', icon: AlertTriangle, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-900/40' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</div>
              <div className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Tren Pembaca Panduan (7 Hari Terakhir)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }} 
                />
                <Bar dataKey="usage" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-800 dark:text-white">Panduan Terpopuler & Sering Dibuka</h3>
            <button onClick={() => onNavigate?.('katalog')} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1">
              Katalog Lengkap <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {[
              { title: 'SOP Pelayanan & Asesmen SOAP Rawat Jalan', views: 600, rating: 4.9 },
              { title: 'Panduan Penggunaan AI Medical Scribe', views: 560, rating: 4.9 },
              { title: 'Alur E-Prescribing & Validasi Obat Farmasi', views: 520, rating: 4.8 },
              { title: 'Petunjuk Penerbitan SEP & Klaim BPJS V-Claim', views: 512, rating: 4.8 },
              { title: 'Pendaftaran & Verifikasi NIK Pasien Baru', views: 420, rating: 4.6 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-750">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                    {i + 1}
                  </div>
                  <span className="font-semibold text-xs text-slate-700 dark:text-slate-200">{item.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-mono"><FileText className="w-3.5 h-3.5" /> {item.views}</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="w-3.5 h-3.5 fill-current" /> {item.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPanduan;
