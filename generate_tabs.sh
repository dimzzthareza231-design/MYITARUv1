#!/bin/bash
mkdir -p src/components/Panduan/Tabs

# 1. DashboardPanduan
cat << 'INNER' > src/components/Panduan/Tabs/DashboardPanduan.tsx
import React from 'react';
import { FileText, Printer, Star, AlertTriangle, TrendingUp } from 'lucide-react';
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

export function DashboardPanduan() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Panduan</h1>
          <p className="text-slate-500">Ringkasan aktivitas dan penggunaan panduan</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Lihat Feedback</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">Buat Panduan Baru</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Panduan Aktif', value: '25', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Total Cetakan Bulan Ini', value: '450', icon: Printer, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Rating Rata-rata', value: '4.6', icon: Star, color: 'text-amber-500', bg: 'bg-amber-100' },
          { label: 'Panduan Perlu Update', value: '3', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-slate-500">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            Trend Penggunaan (7 Hari Terakhir)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="usage" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Panduan Terpopuler</h3>
          <div className="space-y-4">
            {[
              { title: 'Cara Pemeriksaan Pasien', views: 600, rating: 4.9 },
              { title: 'Cara Pakai AI Scribe', views: 560, rating: 4.9 },
              { title: 'Cara Buat Resep Elektronik', views: 520, rating: 4.8 },
              { title: 'Cara Generate SEP', views: 512, rating: 4.8 },
              { title: 'Cara Input Pasien Baru', views: 420, rating: 4.6 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </div>
                  <span className="font-medium text-slate-700">{item.title}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> {item.views} views</span>
                  <span className="flex items-center gap-1 text-amber-500"><Star className="w-4 h-4 fill-current" /> {item.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
INNER

# 2. KatalogPanduan
cat << 'INNER' > src/components/Panduan/Tabs/KatalogPanduan.tsx
import React, { useState } from 'react';
import { Search, Filter, Grid, List, Eye, Edit, Printer, Star } from 'lucide-react';
import { dummyGuides } from '../dummyData';

export function KatalogPanduan() {
  const [view, setView] = useState<'grid'|'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Katalog Panduan</h1>
          <p className="text-slate-500">Jelajahi dan cari semua panduan sistem</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
          <button onClick={() => setView('list')} className={`p-1.5 rounded ${view === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setView('grid')} className={`p-1.5 rounded ${view === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <Grid className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari panduan..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none">
          <option value="">Semua Kategori</option>
          <option value="BPJS">BPJS</option>
          <option value="Pendaftaran">Pendaftaran</option>
          <option value="Poli">Poli</option>
        </select>
        <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm outline-none">
          <option value="">Semua Role</option>
          <option value="Dokter">Dokter</option>
          <option value="Perawat">Perawat</option>
          <option value="Admin">Admin</option>
        </select>
        <button className="px-4 py-2 border border-slate-300 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-slate-50">
          <Filter className="w-4 h-4" /> Filter Lanjutan
        </button>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Panduan</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Kategori</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Role</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Level</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Stats</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {dummyGuides.map((guide) => (
                <tr key={guide.id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{guide.title}</div>
                    <div className="text-xs text-slate-500">{guide.id} • Update: {guide.lastUpdate}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                      {guide.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {guide.role.slice(0, 2).map((r, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{r}</span>
                      ))}
                      {guide.role.length > 2 && <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">+{guide.role.length - 2}</span>}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{guide.level}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1" title="Views"><Eye className="w-3 h-3"/> {guide.views}</span>
                      <span className="flex items-center gap-1" title="Prints"><Printer className="w-3 h-3"/> {guide.prints}</span>
                      <span className="flex items-center gap-1 text-amber-500" title="Rating"><Star className="w-3 h-3 fill-current"/> {guide.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded"><Printer className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dummyGuides.map((guide) => (
            <div key={guide.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200">
                  {guide.category}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-3 h-3 fill-current" /> {guide.rating}
                </span>
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">{guide.title}</h3>
              <div className="text-xs text-slate-500 mb-4">{guide.id}</div>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {guide.views} views</span>
                <div className="flex gap-1">
                  <button className="p-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded text-slate-600"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 rounded text-slate-600"><Printer className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
INNER

# 3. EditorPanduan
cat << 'INNER' > src/components/Panduan/Tabs/EditorPanduan.tsx
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, Eye, Check, X, Plus, GripVertical, Image, Video, Trash2 } from 'lucide-react';

export function EditorPanduan() {
  const [activeTab, setActiveTab] = useState('info');
  const [content, setContent] = useState('');
  
  const tabs = [
    { id: 'info', label: 'Info Dasar' },
    { id: 'konten', label: 'Konten Utama' },
    { id: 'langkah', label: 'Langkah-langkah' },
    { id: 'tips', label: 'Tips & Peringatan' },
    { id: 'faq', label: 'FAQ' },
    { id: 'lampiran', label: 'Lampiran' },
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Buat Panduan Baru</h1>
          <p className="text-slate-500">Tulis dan desain panduan sistem</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-2">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900 flex items-center gap-2">
            <Save className="w-4 h-4" /> Simpan Draft
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2">
            <Check className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-hidden">
        <div className="w-48 shrink-0 flex flex-col gap-1">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'info' && (
            <div className="max-w-2xl space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Judul Panduan *</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Contoh: Cara Generate SEP" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Kategori *</label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option>Pilih Kategori</option>
                    <option>BPJS</option>
                    <option>Pendaftaran</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Kode Panduan</label>
                  <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50" value="AUTO-001" disabled />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Target Role</label>
                <div className="flex gap-4 flex-wrap mt-2">
                  {['Dokter', 'Perawat', 'Admin', 'Kasir', 'Farmasi'].map(role => (
                    <label key={role} className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" /> {role}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea rows={3} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
              </div>
            </div>
          )}

          {activeTab === 'konten' && (
            <div className="h-full flex flex-col">
              <label className="block text-sm font-bold text-slate-700 mb-2">Konten Lengkap Panduan</label>
              <div className="flex-1 bg-white">
                <ReactQuill 
                  theme="snow" 
                  value={content} 
                  onChange={setContent}
                  className="h-[400px] mb-12"
                />
              </div>
            </div>
          )}

          {activeTab === 'langkah' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Langkah-langkah</h3>
                <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-100">
                  <Plus className="w-4 h-4" /> Tambah Langkah
                </button>
              </div>
              
              {[1, 2].map(step => (
                <div key={step} className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative flex gap-4 group">
                  <div className="cursor-move text-slate-400 hover:text-slate-600 pt-2"><GripVertical className="w-5 h-5" /></div>
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">{step}</div>
                      <input type="text" className="flex-1 px-3 py-1.5 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Judul langkah..." />
                    </div>
                    <textarea rows={2} className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Deskripsi langkah..."></textarea>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 border border-slate-300 bg-white rounded flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-50"><Image className="w-4 h-4" /> Tambah Gambar</button>
                      <button className="px-3 py-1.5 border border-slate-300 bg-white rounded flex items-center gap-2 text-sm text-slate-600 hover:bg-slate-50"><Video className="w-4 h-4" /> Embed Video</button>
                    </div>
                  </div>
                  <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )}

          {['tips', 'faq', 'lampiran'].includes(activeTab) && (
            <div className="flex items-center justify-center h-full text-slate-400 flex-col gap-3">
              <FileText className="w-12 h-12 opacity-20" />
              <p>Form untuk {activeTab} akan tampil di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
INNER
