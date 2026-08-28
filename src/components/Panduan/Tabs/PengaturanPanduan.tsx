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
