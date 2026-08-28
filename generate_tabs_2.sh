#!/bin/bash

# 4. TemplateCetak
cat << 'INNER' > src/components/Panduan/Tabs/TemplateCetak.tsx
import React from 'react';
import { File, Layout, Plus, Edit2, Copy, Trash2 } from 'lucide-react';

export function TemplateCetak() {
  const templates = [
    { id: 1, name: 'A4 SOP Standard', desc: 'Portrait, 1 Kolom, Header Logo RS', type: 'A4 Portrait' },
    { id: 2, name: 'A5 Buku Saku', desc: 'Portrait, 1 Kolom, Font Compact', type: 'A5 Portrait' },
    { id: 3, name: 'A3 Poster Alur', desc: 'Landscape, 2 Kolom, Header Besar', type: 'A3 Landscape' },
    { id: 4, name: 'Kartu Saku Lanyard', desc: '10x15cm, 1 Kolom, Font Extra Small', type: 'Custom' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Template Cetak</h1>
          <p className="text-slate-500">Kelola format dokumen cetak untuk panduan</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Tambah Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates.map((tpl) => (
          <div key={tpl.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="h-40 bg-slate-100 border-b border-slate-200 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <File className={`w-16 h-16 text-slate-300 ${tpl.type.includes('Landscape') ? 'rotate-90' : ''}`} />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-bold text-slate-800 mb-1">{tpl.name}</h3>
              <p className="text-xs text-slate-500 mb-3">{tpl.desc}</p>
              <div className="inline-flex bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-medium self-start mb-4">
                {tpl.type}
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between">
                <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded" title="Edit Template"><Edit2 className="w-4 h-4" /></button>
                <div className="flex gap-1">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Duplikasi"><Copy className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
INNER

# 5. KategoriPanduan
cat << 'INNER' > src/components/Panduan/Tabs/KategoriPanduan.tsx
import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { dummyCategories } from '../dummyData';
import * as Icons from 'lucide-react';

export function KategoriPanduan() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kategori Panduan</h1>
          <p className="text-slate-500">Kelola pengelompokan panduan sistem</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Kategori Baru
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Kategori</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Kode</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Total Panduan</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {dummyCategories.map((cat, i) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const IconComp = (Icons as any)[cat.icon] || Icons.Folder;
              return (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${cat.color}-100 text-${cat.color}-600`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-800">{cat.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-sm text-slate-600">{cat.code}</td>
                  <td className="p-4 font-medium text-slate-700">{cat.count} Panduan</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
INNER

# 6. DistribusiPanduan
cat << 'INNER' > src/components/Panduan/Tabs/DistribusiPanduan.tsx
import React from 'react';
import { Share2, Plus, Printer } from 'lucide-react';
import { dummyDistribution } from '../dummyData';

export function DistribusiPanduan() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Distribusi Fisik</h1>
          <p className="text-slate-500">Tracking penyebaran dokumen cetak ke unit</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
            <Printer className="w-4 h-4" /> Cetak Batch
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Catat Distribusi
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">ID</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Panduan</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Lokasi/Unit</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Target Role</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Jumlah Cetak</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {dummyDistribution.map((dist) => (
              <tr key={dist.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono text-sm text-slate-500">{dist.id}</td>
                <td className="p-4 font-medium text-slate-800">{dist.guide}</td>
                <td className="p-4">
                  {dist.location.map((l, i) => (
                    <span key={i} className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs mr-1">{l}</span>
                  ))}
                </td>
                <td className="p-4">
                  {dist.roles.map((r, i) => (
                    <span key={i} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs mr-1">{r}</span>
                  ))}
                </td>
                <td className="p-4 font-bold text-slate-700">{dist.copies} eks</td>
                <td className="p-4 text-sm text-slate-600">{dist.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
INNER
