import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, FileText, Calendar, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import PrintPDFButton from '../../PrintPDFButton';

export function SuratKontrolBPJS() {
  const [suratKontrolList, setSuratKontrolList] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  useEffect(() => {
    const saved = localStorage.getItem('simrs_bpjs_surat_kontrol');
    if (saved) {
      setSuratKontrolList(JSON.parse(saved));
    } else {
      // Data dummy jika belum ada
      const dummyData = [
        {
          id: 1,
          no_surat: 'SK-20260801-001',
          nama_pasien: 'Budi Santoso',
          tanggal_kontrol: '2026-08-15',
          dokter: 'dr. Ahmad, Sp.PD',
          poli: 'Poli Penyakit Dalam',
          diagnosis: 'Diabetes Mellitus',
          status: 'Aktif'
        },
        {
          id: 2,
          no_surat: 'SK-20260801-002',
          nama_pasien: 'Siti Aminah',
          tanggal_kontrol: '2026-08-20',
          dokter: 'dr. Rina, Sp.JP',
          poli: 'Poli Jantung',
          diagnosis: 'Hipertensi',
          status: 'Aktif'
        }
      ];
      setSuratKontrolList(dummyData);
    }
  }, []);
  const handleAdd = () => {
    setShowAddModal(true);
  };
  
  const handleSave = (data: any) => {
    const newSurat = {
      ...data,
      id: Date.now(),
      no_surat: `SK-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(suratKontrolList.length + 1).padStart(3, '0')}`,
      status: 'Aktif'
    };
    const updated = [...suratKontrolList, newSurat];
    setSuratKontrolList(updated);
    localStorage.setItem('simrs_bpjs_surat_kontrol', JSON.stringify(updated));
    setShowAddModal(false);
    toast.success('Surat kontrol berhasil ditambahkan');
  };
  
  const handleDelete = (id: number) => {
    if (window.confirm('Yakin ingin menghapus surat kontrol ini?')) {
      const updated = suratKontrolList.filter(s => s.id !== id);
      setSuratKontrolList(updated);
      localStorage.setItem('simrs_bpjs_surat_kontrol', JSON.stringify(updated));
      toast.success('Surat kontrol berhasil dihapus');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Surat Kontrol</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Generate Surat Kontrol Baru
        </button>
      </div>
      
      {suratKontrolList.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500">Belum ada surat kontrol</p>
          <button
            onClick={handleAdd}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Buat Surat Kontrol Pertama
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">No Surat</th>
                <th className="p-3 text-left">Nama Pasien</th>
                <th className="p-3 text-left">Tanggal Kontrol</th>
                <th className="p-3 text-left">Dokter</th>
                <th className="p-3 text-left">Poli</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {suratKontrolList.map((sk, index) => (
                <tr key={sk.id || index} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-mono">{sk.no_surat}</td>
                  <td className="p-3 font-medium">{sk.nama_pasien}</td>
                  <td className="p-3">{sk.tanggal_kontrol}</td>
                  <td className="p-3">{sk.dokter}</td>
                  <td className="p-3">{sk.poli}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {sk.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <PrintPDFButton
                        documentData={{
                          nama: sk.nama_pasien,
                          no_rm: sk.no_rm || `RM-${sk.id}`,
                          unit_pelayanan: sk.poli || 'Poliklinik Penyakit Dalam',
                          dokter: sk.dokter,
                          diagnosis_utama: sk.diagnosis || 'Pemeriksaan Lanjutan / Kontrol Ulang',
                          penjamin: 'BPJS Kesehatan',
                          edukasi_instruksi: `Surat Rencana Kontrol (SKDP) berlaku untuk kunjungan tanggal ${sk.tanggal_kontrol} ke ${sk.poli} bersama ${sk.dokter}.`
                        }}
                        docType="surat_rujukan"
                        filename={`Surat_Kontrol_${sk.no_surat}`}
                        label="Cetak"
                        title="SURAT RENCANA KONTROL (SKDP) BPJS"
                        className="py-1 px-2.5 text-xs font-semibold"
                      />
                      <button
                        onClick={() => handleDelete(sk.id)}
                        className="text-red-500 hover:text-red-600 px-2 py-1 rounded text-xs flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {showAddModal && (
        <ModalSuratKontrol
          onClose={() => setShowAddModal(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ModalSuratKontrol({ onClose, onSave }: { onClose: () => void, onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    nama_pasien: '',
    tanggal_kontrol: '',
    dokter: '',
    poli: '',
    diagnosis: ''
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama_pasien || !formData.tanggal_kontrol) {
      toast.error('Nama pasien dan tanggal kontrol wajib diisi');
      return;
    }
    onSave(formData);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Generate Surat Kontrol Baru</h2>
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
            <label className="block font-semibold mb-2">Tanggal Kontrol *</label>
            <input
              type="date"
              value={formData.tanggal_kontrol}
              onChange={(e) => setFormData({...formData, tanggal_kontrol: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Dokter</label>
            <input
              type="text"
              value={formData.dokter}
              onChange={(e) => setFormData({...formData, dokter: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">Poli</label>
            <input
              type="text"
              value={formData.poli}
              onChange={(e) => setFormData({...formData, poli: e.target.value})}
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
            />
          </div>
          <div className="flex gap-2 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded">
              Batal
            </button>
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
