#!/bin/bash

# 7. FeedbackPanduan
cat << 'INNER' > src/components/Panduan/Tabs/FeedbackPanduan.tsx
import React from 'react';
import { Star, MessageSquareReply, Filter } from 'lucide-react';
import { dummyFeedback } from '../dummyData';

export function FeedbackPanduan() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Feedback Pengguna</h1>
          <p className="text-slate-500">Tinjau masukan dan rating panduan dari pengguna</p>
        </div>
        <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Tanggal</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Panduan</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Pengguna</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Rating</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Komentar</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {dummyFeedback.map((fb) => (
              <tr key={fb.id} className="hover:bg-slate-50">
                <td className="p-4 text-sm text-slate-600 whitespace-nowrap">{fb.date}</td>
                <td className="p-4 font-medium text-slate-800">{fb.guide}</td>
                <td className="p-4 text-sm text-slate-700">{fb.user}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-4 h-4 ${star <= fb.rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-slate-700 line-clamp-2">{fb.comment}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase
                    ${fb.category === 'Membantu' ? 'bg-emerald-100 text-emerald-700' : 
                      fb.category === 'Membingungkan' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {fb.category}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1">
                    <MessageSquareReply className="w-3 h-3" /> Balas
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
INNER

# 8. AnalyticsPanduan
cat << 'INNER' > src/components/Panduan/Tabs/AnalyticsPanduan.tsx
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
INNER

# 9. PengaturanPanduan
cat << 'INNER' > src/components/Panduan/Tabs/PengaturanPanduan.tsx
import React from 'react';
import { Save } from 'lucide-react';

export function PengaturanPanduan() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pengaturan Sistem Panduan</h1>
          <p className="text-slate-500">Konfigurasi workflow dan integrasi</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2">
          <Save className="w-4 h-4" /> Simpan Perubahan
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-8">
        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">General Setting</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-slate-700">Default Template Cetak</label>
                <p className="text-xs text-slate-500 mt-1">Template standar untuk export PDF/Print</p>
              </div>
              <div className="md:col-span-2">
                <select className="w-full md:w-2/3 px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                  <option>A4 SOP Standard</option>
                  <option>A5 Buku Saku</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-slate-700">Reminder Review Tahunan</label>
                <p className="text-xs text-slate-500 mt-1">Hari sebelum kadaluarsa</p>
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input type="number" defaultValue="30" className="w-24 px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" />
                <span className="text-sm text-slate-600">Hari</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Approval Workflow</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
              <div>
                <span className="block text-sm font-bold text-slate-700">Wajibkan Approval</span>
                <span className="text-xs text-slate-500">Panduan tidak akan dipublish sebelum disetujui</span>
              </div>
            </label>
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mt-3 flex items-center gap-4 text-sm font-medium">
              <div className="text-slate-600">Maker <br/><span className="text-xs font-normal text-slate-500">Semua Role</span></div>
              <div className="w-12 h-px bg-slate-300"></div>
              <div className="text-slate-600">Reviewer <br/><span className="text-xs font-normal text-slate-500">Supervisor</span></div>
              <div className="w-12 h-px bg-slate-300"></div>
              <div className="text-slate-600">Approver <br/><span className="text-xs font-normal text-slate-500">Manajemen</span></div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Integrasi Aplikasi</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
              <div>
                <span className="block text-sm font-bold text-slate-700">Auto-show Contextual Help</span>
                <span className="text-xs text-slate-500">Tampilkan saran panduan relevan berdasarkan modul yang dibuka user</span>
              </div>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
INNER
