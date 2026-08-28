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
