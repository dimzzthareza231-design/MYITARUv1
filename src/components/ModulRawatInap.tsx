import toast from "react-hot-toast";
import { useToast } from "../contexts/ToastContext";
import React, { useState } from 'react';
import { usePatientFlow, STATUS_RI } from '../contexts/PatientFlowContext';

export default function ModulRawatInap() {
  const { kunjungan, updateStatus } = usePatientFlow();
  const [selectedPasien, setSelectedPasien] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  
  const pasienDirawat = kunjungan.filter((k: any) => 
    k.jenis_kunjungan === 'Rawat Inap' && 
    !['PULANG', 'DAFTAR'].includes(k.status)
  );
  
  const handleAdvance = (pasien: any, nextStatus: string) => {
    const statusLabel = (STATUS_RI as any)[nextStatus] || nextStatus;
    if (true) {
      updateStatus(pasien.id, nextStatus, 'Perawat/Dokter');
      toast.success(`Status diperbarui ke: ${statusLabel}`);
    }
  };
  
  const getNextAction = (pasien: any) => {
    const actions: Record<string, { to: string, label: string, color: string }> = {
      'PENANGANAN_AWAL': { to: 'TRANSFER_BANGSAL', label: '🛏️ Transfer Bangsal', color: 'bg-purple-600' },
      'TRANSFER_BANGSAL': { to: 'DIRAWAT', label: '💉 Mulai Perawatan', color: 'bg-indigo-600' },
      'DIRAWAT': { to: 'VISITE_DOKTER', label: '👨⚕️ Visite Dokter', color: 'bg-blue-600' },
      'VISITE_DOKTER': { to: 'DIRAWAT', label: '✓ Selesai Visite', color: 'bg-green-600' },
      'PERIKSA_PENUNJANG': { to: 'DIRAWAT', label: '✓ Hasil Diterima', color: 'bg-green-600' },
      'DISCHARGE_PLAN': { to: 'PROSES_BILLING', label: '💰 Proses Billing', color: 'bg-yellow-600' },
      'PROSES_BILLING': { to: 'OBAT_PULANG', label: '💊 Obat Pulang', color: 'bg-green-600' },
      'OBAT_PULANG': { to: 'PULANG', label: '🏠 Pasien Pulang', color: 'bg-blue-600' }
    };
    return actions[pasien.status];
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🛏️ Modul Rawat Inap</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-4">
          <div className="text-sm opacity-90">Total Dirawat</div>
          <div className="text-3xl font-bold">{pasienDirawat.length}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="text-sm opacity-90">Visite Hari Ini</div>
          <div className="text-3xl font-bold">{pasienDirawat.filter((p: any) => p.status === 'VISITE_DOKTER').length}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-4">
          <div className="text-sm opacity-90">Discharge Plan</div>
          <div className="text-3xl font-bold">{pasienDirawat.filter((p: any) => p.status === 'DISCHARGE_PLAN').length}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="text-sm opacity-90">Siap Pulang</div>
          <div className="text-3xl font-bold">{pasienDirawat.filter((p: any) => ['OBAT_PULANG', 'PULANG'].includes(p.status)).length}</div>
        </div>
      </div>
      
      {/* Patient List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">Kamar</th>
              <th className="p-3 text-left">No RM</th>
              <th className="p-3 text-left">Nama Pasien</th>
              <th className="p-3 text-left">Diagnosis</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Tgl Masuk</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pasienDirawat.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  <div className="text-5xl mb-3">🛏️</div>
                  <p>Tidak ada pasien rawat inap</p>
                </td>
              </tr>
            ) : (
              pasienDirawat.map((pasien: any) => {
                const nextAction = getNextAction(pasien);
                return (
                  <tr key={pasien.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 font-bold">{pasien.kamar || '-'}</td>
                    <td className="p-3 font-mono text-sm">{pasien.no_rm}</td>
                    <td className="p-3 font-semibold">{pasien.nama_pasien}</td>
                    <td className="p-3 text-sm">{pasien.diagnosis || '-'}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded text-xs font-semibold">
                        {(STATUS_RI as any)[pasien.status] || pasien.status}
                      </span>
                    </td>
                    <td className="p-3 text-sm">{pasien.jam_daftar}</td>
                    <td className="p-3 text-center">
                      <div className="flex gap-1 justify-center">
                        {nextAction && (
                          <button
                            onClick={() => handleAdvance(pasien, nextAction.to)}
                            className={`${nextAction.color} text-white px-3 py-1 rounded text-xs hover:opacity-90`}
                          >
                            {nextAction.label}
                          </button>
                        )}
                        <button
                          onClick={() => { setSelectedPasien(pasien); setShowDetail(true); }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                        >
                          👁️ Detail
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Detail Modal */}
      {showDetail && selectedPasien && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl">
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl font-bold">👤 Detail Pasien Rawat Inap</h2>
              <button onClick={() => setShowDetail(false)} className="text-2xl">✕</button>
            </div>
            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm text-gray-600">No RM:</label><p className="font-semibold">{selectedPasien.no_rm}</p></div>
                <div><label className="text-sm text-gray-600">Nama:</label><p className="font-semibold">{selectedPasien.nama_pasien}</p></div>
                <div><label className="text-sm text-gray-600">Kamar:</label><p className="font-semibold">{selectedPasien.kamar || '-'}</p></div>
                <div><label className="text-sm text-gray-600">Dokter:</label><p className="font-semibold">{selectedPasien.dokter || '-'}</p></div>
                <div><label className="text-sm text-gray-600">Diagnosis:</label><p className="font-semibold">{selectedPasien.diagnosis || '-'}</p></div>
                <div><label className="text-sm text-gray-600">Status:</label><p className="font-semibold">{(STATUS_RI as any)[selectedPasien.status]}</p></div>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Riwayat Status:</label>
                <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                  {(selectedPasien.history_status || []).map((h: any, idx: number) => (
                    <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                      <strong>{h.status}</strong> - {h.waktu} oleh {h.oleh}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t dark:border-gray-700 p-4">
              <button onClick={() => setShowDetail(false)} className="w-full bg-gray-200 dark:bg-gray-700 py-2 rounded">Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
