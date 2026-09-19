import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, RefreshCw, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { initBPJSData } from '../bpjsData';

export function ProgramRujukBalikBPJS() {
  const [prbList, setPrbList] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  useEffect(() => {
    initBPJSData();
    const saved = localStorage.getItem('simrs_bpjs_prb') || localStorage.getItem('bpjs_prb');
    if (saved) {
      setPrbList(JSON.parse(saved));
    } else {
      setPrbList([]);
    }
  }, []);
  const handleAdd = () => setShowAddModal(true);
  
  const handleSave = (data: any) => {
    const newPRB = {
      ...data,
      id: Date.now(),
      no_prb: `PRB-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(prbList.length + 1).padStart(3, '0')}`,
      obat: data.obat.split(',').map((o: string) => o.trim()),
      status: 'Aktif'
    };
    const updated = [...prbList, newPRB];
    setPrbList(updated);
    localStorage.setItem('simrs_bpjs_prb', JSON.stringify(updated));
    setShowAddModal(false);
    toast.success('PRB berhasil ditambahkan');
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm('Yakin ingin menghapus PRB ini?')) {
      const updated = prbList.filter(p => p.id !== id);
      setPrbList(updated);
      localStorage.setItem('simrs_bpjs_prb', JSON.stringify(updated));
      toast.success('PRB berhasil dihapus');
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Program Rujuk Balik (PRB)</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Generate PRB Baru
        </button>
      </div>
      
      {prbList.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">💊</div>
          <p className="text-gray-500">Belum ada Program Rujuk Balik</p>
          <button
            onClick={handleAdd}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Buat PRB Pertama
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">No PRB</th>
                <th className="p-3 text-left">Nama Pasien</th>
                <th className="p-3 text-left">Diagnosis</th>
                <th className="p-3 text-left">Obat</th>
                <th className="p-3 text-left">Tanggal</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {prbList.map((prb, index) => (
                <tr key={prb.id || index} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono text-blue-600 font-bold">{prb.no_prb}</td>
                  <td className="p-3 font-medium text-slate-800">{prb.nama_pasien}</td>
                  <td className="p-3">{prb.diagnosis}</td>
                  <td className="p-3">{Array.isArray(prb.obat) ? prb.obat.join(', ') : prb.obat}</td>
                  <td className="p-3">{prb.tanggal_prb}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {prb.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(prb.id)}
                      className="text-red-500 hover:text-red-600 px-3 py-1 rounded text-sm flex items-center gap-1 justify-center mx-auto"
                    >
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showAddModal && (
        <ModalPRB onClose={() => setShowAddModal(false)} onSave={handleSave} />
      )}
    </div>
  );
}

function ModalPRB({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    nama_pasien: '',
    tanggal_prb: '',
    diagnosis: '',
    obat: ''
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_pasien || !formData.tanggal_prb) {
      toast.error('Nama pasien dan tanggal wajib diisi');
      return;
    }
    onSave(formData);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Generate PRB Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Nama Pasien *</label>
            <input
              type="text"
              value={formData.nama_pasien}
              onChange={(e) => setFormData({...formData, nama_pasien: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Tanggal PRB *</label>
            <input
              type="date"
              value={formData.tanggal_prb}
              onChange={(e) => setFormData({...formData, tanggal_prb: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Diagnosis</label>
            <input
              type="text"
              value={formData.diagnosis}
              onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Contoh: Diabetes Mellitus"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Obat (Pisahkan dengan koma)</label>
            <input
              type="text"
              value={formData.obat}
              onChange={(e) => setFormData({...formData, obat: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Contoh: Metformin 500mg, Glibenclamide 5mg"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded font-medium">
              Batal
            </button>
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
