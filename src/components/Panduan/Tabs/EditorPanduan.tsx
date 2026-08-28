import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Save, Eye, Check, X, Plus, GripVertical, Image, Video, Trash2, FileText } from 'lucide-react';

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
