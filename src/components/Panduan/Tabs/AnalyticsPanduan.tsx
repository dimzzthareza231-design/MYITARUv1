import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AnalyticsPanduan() {
  const topGuides = [
    { name: 'Pemeriksaan Pasien', views: 600 },
    { name: 'AI Scribe', views: 560 },
    { name: 'Resep Elektronik', views: 520 },
    { name: 'Generate SEP', views: 512 },
  ];

  const feedbackData = [
    { name: 'Sangat Membantu', value: 400 },
    { name: 'Cukup', value: 300 },
    { name: 'Membingungkan', value: 100 },
    { name: 'Lainnya', value: 50 },
  ];
  const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics & Laporan</h1>
          <p className="text-slate-500">Analisis penggunaan panduan secara mendalam</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">
          Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Panduan Paling Sering Dilihat</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topGuides} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="views" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Distribusi Kategori Feedback</h3>
          <div className="h-72 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={feedbackData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {feedbackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-2 text-sm">
              {feedbackData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-slate-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
