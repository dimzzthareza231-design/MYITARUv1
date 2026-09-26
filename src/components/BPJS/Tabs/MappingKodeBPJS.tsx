import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { initBPJSData } from '../bpjsData';

export function MappingKodeBPJS() {
  const [activeTab, setActiveTab] = useState('poli');
  const [mappingData, setMappingData] = useState<any>({
    poli: [],
    dokter: [],
    obat: [],
    tindakan: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    kode_internal: '',
    nama_internal: '',
    kode_bpjs: '',
    nama_bpjs: ''
  });

  useEffect(() => {
    initBPJSData();
    const saved = localStorage.getItem('simrs_bpjs_mapping') || localStorage.getItem('bpjs_mapping');
    if (saved) {
      setMappingData(JSON.parse(saved));
    } else {
      setMappingData({ poli: [], dokter: [], obat: [], tindakan: [] });
    }
  }, []);
  const tabs = [
    { id: 'poli', label: 'Poli' },
    { id: 'dokter', label: 'Dokter' },
    { id: 'obat', label: 'Obat' },
    { id: 'tindakan', label: 'Tindakan' }
  ];

  const handleSave = () => {
    if (!formData.kode_internal || !formData.nama_internal || !formData.kode_bpjs) {
      toast.error('Semua field wajib diisi');
      return;
    }

    const newData = { ...mappingData };
    
    if (editItem) {
      newData[activeTab] = newData[activeTab].map((item: any) =>
        item.id === editItem.id ? { ...editItem, ...formData } : item
      );
      toast.success('Mapping berhasil diupdate');
    } else {
      newData[activeTab] = [...newData[activeTab], { id: Date.now(), ...formData }];
      toast.success('Mapping berhasil ditambahkan');
    }

    setMappingData(newData);

    setShowAddModal(false);
    setEditItem(null);
    setFormData({ kode_internal: '', nama_internal: '', kode_bpjs: '', nama_bpjs: '' });
  };

  const handleDelete = (id: number) => {
    const newData = { ...mappingData };
    newData[activeTab] = newData[activeTab].filter((item: any) => item.id !== id);
    setMappingData(newData);
    toast.success('Mapping berhasil dihapus');
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setFormData({
      kode_internal: item.kode_internal,
      nama_internal: item.nama_internal,
      kode_bpjs: item.kode_bpjs,
      nama_bpjs: item.nama_bpjs
    });
    setShowAddModal(true);
  };

  const filteredData = (mappingData[activeTab] || []).filter((item: any) => {
    if (!item) return false;
    const term = (searchTerm || '').trim().toLowerCase();
    if (!term) return true;

    const kodeInternal = String(item.kode_internal || item.kodeInternal || '').toLowerCase();
    const namaInternal = String(item.nama_internal || item.namaInternal || '').toLowerCase();
    const kodeBpjs = String(item.kode_bpjs || item.kodeBpjs || '').toLowerCase();
    const namaBpjs = String(item.nama_bpjs || item.namaBpjs || '').toLowerCase();

    return kodeInternal.includes(term) || namaInternal.includes(term) || kodeBpjs.includes(term) || namaBpjs.includes(term);
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Mapping Kode BPJS</h1>
        <button
          onClick={() => { setEditItem(null); setFormData({ kode_internal: '', nama_internal: '', kode_bpjs: '', nama_bpjs: '' }); setShowAddModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Mapping
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
              className={`px-6 py-4 font-bold text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari mapping..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-slate-700/50">
              <tr>
                <th className="p-3 text-left text-slate-700 dark:text-slate-300">Kode Internal</th>
                <th className="p-3 text-left text-slate-700 dark:text-slate-300">Nama Internal</th>
                <th className="p-3 text-left text-slate-700 dark:text-slate-300">Kode BPJS</th>
                <th className="p-3 text-left text-slate-700 dark:text-slate-300">Nama BPJS</th>
                <th className="p-3 text-center text-slate-700 dark:text-slate-300">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredData.map((item: any) => (
                <tr key={item.id} className="border-t hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-3 font-mono text-slate-500 dark:text-slate-400 font-bold">{item.kode_internal}</td>
                  <td className="p-3 font-medium text-slate-800 dark:text-white">{item.nama_internal}</td>
                  <td className="p-3 font-mono text-blue-600 dark:text-blue-400 font-bold">{item.kode_bpjs}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-300">{item.nama_bpjs}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 rounded transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    Belum ada mapping untuk data {activeTab}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xl">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-bold">{editItem ? 'Edit Mapping' : 'Tambah Mapping'} - {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-2xl hover:opacity-80">✕</button>
            </div>
            <div className="p-6 space-y-4 text-slate-800 dark:text-slate-200">
              <div>
                <label className="block font-semibold mb-2 text-sm">Kode Internal *</label>
                <input
                  type="text"
                  value={formData.kode_internal}
                  onChange={(e) => setFormData({...formData, kode_internal: e.target.value})}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: PDU"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-sm">Nama Internal *</label>
                <input
                  type="text"
                  value={formData.nama_internal}
                  onChange={(e) => setFormData({...formData, nama_internal: e.target.value})}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Poli Umum"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-sm">Kode BPJS *</label>
                <input
                  type="text"
                  value={formData.kode_bpjs}
                  onChange={(e) => setFormData({...formData, kode_bpjs: e.target.value})}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 005"
                />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-sm">Nama BPJS</label>
                <input
                  type="text"
                  value={formData.nama_bpjs}
                  onChange={(e) => setFormData({...formData, nama_bpjs: e.target.value})}
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Poli Umum"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 py-2 rounded font-medium hover:bg-gray-300 dark:hover:bg-slate-600">
                  Batal
                </button>
                <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" /> Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
