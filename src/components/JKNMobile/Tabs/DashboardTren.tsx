import React, { useState } from 'react';
import { TrendingUp, MapPin, Calendar, AlertTriangle } from 'lucide-react';

export function DashboardTren() {
  const [selectedRegion, setSelectedRegion] = useState('Jakarta Selatan');

  const regions = ['Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Timur', 'Jakarta Barat'];

  const diseaseData = [
    { name: 'ISPA', cases: 1250, trend: '+12%', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
    { name: 'Diare', cases: 890, trend: '+5%', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { name: 'Hipertensi', cases: 750, trend: '-3%', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { name: 'Diabetes Melitus', cases: 620, trend: '+8%', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { name: 'Demam Berdarah', cases: 340, trend: '+25%', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    { name: 'Gastritis', cases: 280, trend: '-2%', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const maxCases = Math.max(...diseaseData.map(d => d.cases));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-teal-600" /> Dashboard Tren Penyakit Daerah
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Informasi tren penyakit di wilayah Anda</p>
        </div>
        <select
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-sm font-bold focus:ring-2 focus:ring-teal-500 outline-none"
          value={selectedRegion}
          onChange={e => setSelectedRegion(e.target.value)}
        >
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {diseaseData.some(d => d.trend.startsWith('+2')) && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Peringatan Tren Penyakit</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
              Kasus Demam Berdarah di {selectedRegion} meningkat 25% dalam minggu terakhir. Jaga kebersihan lingkungan dan gunakan kelambu saat tidur.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" /> Tren Penyakit - {selectedRegion}
          </h3>
          <span className="text-sm text-slate-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" /> Agustus 2026
          </span>
        </div>

        <div className="space-y-4">
          {diseaseData.map((disease, idx) => (
            <div key={idx} className={`p-4 ${disease.bg} rounded-lg border border-slate-100 dark:border-slate-700`}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">{idx + 1}. {disease.name}</span>
                  <span className={`text-xs font-bold ${disease.color}`}>{disease.trend}</span>
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{disease.cases} kasus</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                <div
                  className="bg-teal-500 h-2 rounded-full transition-all"
                  style={{ width: `${(disease.cases / maxCases) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-500 mb-1">Total Kasus Bulan Ini</p>
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{diseaseData.reduce((sum, d) => sum + d.cases, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-500 mb-1">Penyakit Terbanyak</p>
          <p className="text-3xl font-bold text-red-600">ISPA</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-500 mb-1">Tren Tertinggi</p>
          <p className="text-3xl font-bold text-amber-600">DBD (+25%)</p>
        </div>
      </div>
    </div>
  );
}
