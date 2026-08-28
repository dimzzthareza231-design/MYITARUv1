import toast from "react-hot-toast";
import { useToast } from "../contexts/ToastContext";
import React, { useState } from 'react';
import { usePatientFlow, STATUS_RJ } from '../contexts/PatientFlowContext';

export default function ModulPoli() {
  const { kunjungan, updateStatus } = usePatientFlow();
  const [selectedPoli, setSelectedPoli] = useState('Semua');
  const [selectedPasien, setSelectedPasien] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  
  // Filter pasien yang sedang antri di poli
  const pasienAntri = kunjungan.filter((k: any) => 
    k.status === 'ANTRI_POLI' && 
    k.jenis_kunjungan === 'Rawat Jalan' &&
    (selectedPoli === 'Semua' || k.poli === selectedPoli)
  );
  
  const poliList = ['Semua', 'Poli Umum', 'Poli Penyakit Dalam', 'Poli Anak', 'Poli Jantung', 'Poli Mata', 'Poli Bedah'];
  
  const handlePanggil = (pasien: any) => {
    if (true) {
      updateStatus(pasien.id, 'PERIKSA_POLI', 'Dokter');
      toast.success(`${pasien.nama_pasien} dipanggil ke ruang periksa`);
    }
  };
  
  const handleSelesaiPeriksa = (pasien: any) => {
    // Cek apakah ada request lab
    const hasLabRequest = false;
    const nextStatus = hasLabRequest ? 'ANTRI_LAB' : 'ANTRI_FARMASI';
    const nextModul = hasLabRequest ? 'Lab/Radiologi' : 'Farmasi';
    
    updateStatus(pasien.id, nextStatus, 'Dokter');
    toast.success(`Pemeriksaan selesai!\n\nPasien diteruskan ke: ${nextModul}`);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">🏥 Modul Poli - Antrian Pemeriksaan</h1>
          <p className="text-gray-600 text-sm">Kelola antrian pasien per poli</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
          <span className="text-sm text-gray-600">Total Antri:</span>
          <span className="text-2xl font-bold text-blue-600 ml-2">{pasienAntri.length}</span>
        </div>
      </div>
      
      {/* Filter Poli */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <label className="font-semibold mb-2 block">Filter Poli:</label>
        <div className="flex flex-wrap gap-2">
          {poliList.map(poli => (
            <button
              key={poli}
              onClick={() => setSelectedPoli(poli)}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedPoli === poli
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200'
              }`}
            >
              {poli}
            </button>
          ))}
        </div>
      </div>
      
      {/* Antrian List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">No Antrian</th>
              <th className="p-3 text-left">No RM</th>
              <th className="p-3 text-left">Nama Pasien</th>
              <th className="p-3 text-left">Poli</th>
              <th className="p-3 text-left">Dokter</th>
              <th className="p-3 text-left">Jam Daftar</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pasienAntri.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  <div className="text-5xl mb-3">🏥</div>
                  <p>Tidak ada pasien antri di poli ini</p>
                </td>
              </tr>
            ) : (
              pasienAntri.map((pasien: any, idx: number) => (
                <tr key={pasien.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="p-3">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  </td>
                  <td className="p-3 font-mono text-sm">{pasien.no_rm}</td>
                  <td className="p-3 font-semibold">{pasien.nama_pasien}</td>
                  <td className="p-3 text-sm">{pasien.poli}</td>
                  <td className="p-3 text-sm">{pasien.dokter || '-'}</td>
                  <td className="p-3 text-sm">{pasien.jam_daftar}</td>
                  <td className="p-3 text-center">
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => handlePanggil(pasien)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs"
                      >
                        📢 Panggil
                      </button>
                      <button
                        onClick={() => handleSelesaiPeriksa(pasien)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                      >
                        ✓ Selesai
                      </button>
                      <button
                        onClick={() => { setSelectedPasien(pasien); setShowDetail(true); }}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                      >
                        👁️ Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Detail Modal */}
      {showDetail && selectedPasien && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-bold">👤 Detail Pasien</h2>
              <button onClick={() => setShowDetail(false)} className="text-2xl">✕</button>
            </div>
            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm text-gray-600">No RM:</label><p className="font-semibold">{selectedPasien.no_rm}</p></div>
                <div><label className="text-sm text-gray-600">Nama:</label><p className="font-semibold">{selectedPasien.nama_pasien}</p></div>
                <div><label className="text-sm text-gray-600">Poli:</label><p className="font-semibold">{selectedPasien.poli}</p></div>
                <div><label className="text-sm text-gray-600">Dokter:</label><p className="font-semibold">{selectedPasien.dokter || '-'}</p></div>
                <div><label className="text-sm text-gray-600">Penjamin:</label><p className="font-semibold">{selectedPasien.penjamin}</p></div>
                <div><label className="text-sm text-gray-600">Jam Daftar:</label><p className="font-semibold">{selectedPasien.jam_daftar}</p></div>
              </div>
              {selectedPasien.diagnosis && (
                <div>
                  <label className="text-sm text-gray-600">Keluhan:</label>
                  <p className="p-2 bg-gray-50 dark:bg-gray-700 rounded">{selectedPasien.diagnosis}</p>
                </div>
              )}
            </div>
            <div className="border-t dark:border-gray-700 p-4 flex gap-2">
              <button onClick={() => setShowDetail(false)} className="flex-1 bg-gray-200 py-2 rounded">Tutup</button>
              <button onClick={() => { setShowDetail(false); handlePanggil(selectedPasien); }} className="flex-1 bg-yellow-500 text-white py-2 rounded">📢 Panggil</button>
              <button onClick={() => { setShowDetail(false); handleSelesaiPeriksa(selectedPasien); }} className="flex-1 bg-green-600 text-white py-2 rounded">✓ Selesai</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
