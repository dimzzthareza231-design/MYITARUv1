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
