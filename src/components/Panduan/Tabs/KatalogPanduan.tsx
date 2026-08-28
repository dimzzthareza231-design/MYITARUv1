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
