import toast from "react-hot-toast";
import { useToast } from "../contexts/ToastContext";
import React, { useState } from 'react';
import { usePatientFlow, STATUS_RJ } from '../contexts/PatientFlowContext';
import FormSOAP from './FormSOAP';

export default function ModulRawatJalan() {
  const { kunjungan, updateStatus } = usePatientFlow();
  const [selectedPasien, setSelectedPasien] = useState<any>(null);
  const [showSOAP, setShowSOAP] = useState(false);
  
  // Pasien yang sedang diperiksa
  const pasienDiperiksa = kunjungan.filter((k: any) => 
    k.status === 'PERIKSA_POLI' && 
    k.jenis_kunjungan === 'Rawat Jalan'
  );
  
  // Pasien yang sudah selesai poli
  const pasienSelesaiPoli = kunjungan.filter((k: any) => 
    (k.status === 'ANTRI_LAB' || k.status === 'ANTRI_FARMASI') && 
    k.jenis_kunjungan === 'Rawat Jalan'
  );
  
  const handleStartPeriksa = (pasien: any) => {
    setSelectedPasien(pasien);
    setShowSOAP(true);
  };
  
  const handleSOAPSaved = () => {
    setShowSOAP(false);
    toast.success('Rekam medis tersimpan. Silakan lanjutkan ke tahap berikutnya.');
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">👨‍⚕️ Modul Rawat Jalan - Pemeriksaan Dokter</h1>
      
      {/* Sedang Diperiksa */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-bold mb-4 text-blue-600">🔍 Sedang Diperiksa ({pasienDiperiksa.length})</h2>
        {pasienDiperiksa.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Tidak ada pasien sedang diperiksa</p>
        ) : (
          <div className="space-y-3">
            {pasienDiperiksa.map((pasien: any) => (
              <div key={pasien.id} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg">{pasien.nama_pasien}</div>
                    <div className="text-sm text-gray-600">{pasien.no_rm} • {pasien.poli}</div>
                  </div>
                  <button
                    onClick={() => handleStartPeriksa(pasien)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    📋 Buka Rekam Medis
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Selesai Poli */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4 text-green-600">✓ Selesai Pemeriksaan ({pasienSelesaiPoli.length})</h2>
        {pasienSelesaiPoli.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Belum ada pasien selesai diperiksa</p>
        ) : (
          <div className="space-y-2">
            {pasienSelesaiPoli.map((pasien: any) => (
              <div key={pasien.id} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 flex justify-between items-center">
                <div>
                  <div className="font-semibold">{pasien.nama_pasien}</div>
                  <div className="text-xs text-gray-600">{pasien.no_rm} • {pasien.poli}</div>
                </div>
                <span className="text-green-600 font-semibold">✓ Selesai</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* SOAP Modal */}
      {showSOAP && selectedPasien && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-5xl my-8">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold">📋 Rekam Medis - {selectedPasien.nama_pasien}</h2>
                <p className="text-sm text-gray-600">{selectedPasien.no_rm} • {selectedPasien.poli}</p>
              </div>
              <button onClick={() => setShowSOAP(false)} className="text-2xl">✕</button>
            </div>
            <div className="p-6">
              <FormSOAP
                kunjunganId={selectedPasien.id}
                pasien={selectedPasien}
                onClose={handleSOAPSaved}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
