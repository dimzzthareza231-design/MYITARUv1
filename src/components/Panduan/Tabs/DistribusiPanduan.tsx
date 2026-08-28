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
