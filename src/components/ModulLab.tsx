import toast from "react-hot-toast";
import { useToast } from "../contexts/ToastContext";
import React, { useState } from 'react';
import { usePatientFlow } from '../contexts/PatientFlowContext';

export default function ModulLab() {
  const { kunjungan, updateStatus } = usePatientFlow();
  const [selectedPasien, setSelectedPasien] = useState<any>(null);
  const [showInputHasil, setShowInputHasil] = useState(false);
  const [hasilLab, setHasilLab] = useState({});
  
  const pasienAntriLab = kunjungan.filter((k: any) => k.status === 'ANTRI_LAB');
  const pasienProsesLab = kunjungan.filter((k: any) => k.status === 'PROSES_LAB');
  
  const handleMulaiProses = (pasien: any) => {
    if (true) {
      updateStatus(pasien.id, 'PROSES_LAB', 'Lab');
      toast.success(`Proses lab dimulai untuk ${pasien.nama_pasien}`);
    }
  };
  
  const handleSelesaiLab = () => {
    if (!selectedPasien) return;
    
    updateStatus(selectedPasien.id, 'SELESAI_LAB', 'Lab');
    
    // Automatically forward to Farmasi after lab is done for Rawat Jalan
    if (selectedPasien.jenis_kunjungan === 'Rawat Jalan') {
      updateStatus(selectedPasien.id, 'ANTRI_FARMASI', 'Lab');
    }
    
    setShowInputHasil(false);
    setSelectedPasien(null);
    setHasilLab({});
    toast.success(`Hasil lab ${selectedPasien.nama_pasien} tersimpan!\n\nPasien diteruskan ke Farmasi.`);
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🔬 Modul Laboratorium & Radiologi</h1>
      
      {/* Antri Lab */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-bold mb-4 text-yellow-600">⏳ Antri Lab ({pasienAntriLab.length})</h2>
        {pasienAntriLab.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Tidak ada pasien antri</p>
        ) : (
          <div className="space-y-2">
            {pasienAntriLab.map((pasien: any) => (
              <div key={pasien.id} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 flex justify-between items-center">
                <div>
                  <div className="font-bold">{pasien.nama_pasien}</div>
                  <div className="text-sm text-gray-600">{pasien.no_rm} • {pasien.poli}</div>
                </div>
                <button
                  onClick={() => handleMulaiProses(pasien)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  🔬 Mulai Proses
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Proses Lab */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4 text-blue-600">🔬 Dalam Proses ({pasienProsesLab.length})</h2>
        {pasienProsesLab.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Tidak ada pasien sedang diproses</p>
        ) : (
          <div className="space-y-2">
            {pasienProsesLab.map((pasien: any) => (
              <div key={pasien.id} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 flex justify-between items-center">
                <div>
                  <div className="font-bold">{pasien.nama_pasien}</div>
                  <div className="text-sm text-gray-600">{pasien.no_rm}</div>
                </div>
                <button
                  onClick={() => { setSelectedPasien(pasien); setShowInputHasil(true); }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  📝 Input Hasil
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Input Hasil Modal */}
      {showInputHasil && selectedPasien && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-bold">📝 Input Hasil Lab - {selectedPasien.nama_pasien}</h2>
              <button onClick={() => setShowInputHasil(false)} className="text-2xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-semibold mb-2">Jenis Pemeriksaan</label>
                <select className="w-full p-3 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg">
                  <option>Darah Lengkap</option>
                  <option>Kimia Darah</option>
                  <option>Urinalisis</option>
                  <option>Rontgen Thorax</option>
                  <option>USG</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-2">Hasil Pemeriksaan</label>
                <textarea rows={6} className="w-full p-3 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg" placeholder="Masukkan hasil pemeriksaan..." />
              </div>
              <div>
                <label className="block font-semibold mb-2">Kesimpulan</label>
                <textarea rows={3} className="w-full p-3 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg" placeholder="Kesimpulan hasil..." />
              </div>
              <div>
                <label className="block font-semibold mb-2">Dokter Penanggung Jawab</label>
                <input type="text" className="w-full p-3 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg" placeholder="Nama dokter" />
              </div>
            </div>
            <div className="border-t dark:border-gray-700 p-4 flex gap-2">
              <button onClick={() => setShowInputHasil(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 py-2 rounded">Batal</button>
              <button onClick={handleSelesaiLab} className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">💾 Simpan Hasil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
