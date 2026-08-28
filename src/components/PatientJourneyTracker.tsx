import React, { useState } from 'react';
import { usePatientFlow, STATUS_RJ, STATUS_RI } from '../contexts/PatientFlowContext';

export default function PatientJourneyTracker({ kunjunganId, jenisKunjungan }: { kunjunganId: number, jenisKunjungan: string }) {
  const { kunjungan, updateStatus } = usePatientFlow();
  const [showHistory, setShowHistory] = useState(false);
  
  const pasien = kunjungan.find((k: any) => k.id === kunjunganId);
  if (!pasien) return <div>Pasien tidak ditemukan</div>;
  
  const alurRJ = [
    { status: 'DAFTAR', label: 'Pendaftaran', icon: '📋', color: 'blue', optional: false },
    { status: 'ANTRI_POLI', label: 'Antrian Poli', icon: '🏥', color: 'purple', optional: false },
    { status: 'PERIKSA_POLI', label: 'Pemeriksaan', icon: '👨‍⚕️', color: 'indigo', optional: false },
    { status: 'ANTRI_LAB', label: 'Lab', icon: '🔬', color: 'cyan', optional: true },
    { status: 'ANTRI_FARMASI', label: 'Farmasi', icon: '💊', color: 'green', optional: false },
    { status: 'ANTRI_KASIR', label: 'Kasir', icon: '💰', color: 'yellow', optional: false },
    { status: 'PULANG', label: 'Pulang', icon: '🏠', color: 'gray', optional: false }
  ];
  
  const alurRI = [
    { status: 'DAFTAR', label: 'Pendaftaran', icon: '📋', color: 'blue', optional: false },
    { status: 'PENANGANAN_AWAL', label: 'Penanganan Awal', icon: '🚑', color: 'red', optional: false },
    { status: 'TRANSFER_BANGSAL', label: 'Transfer Bangsal', icon: '🛏️', color: 'purple', optional: false },
    { status: 'DIRAWAT', label: 'Perawatan', icon: '💉', color: 'indigo', optional: false },
    { status: 'DISCHARGE_PLAN', label: 'Discharge', icon: '📝', color: 'orange', optional: false },
    { status: 'PROSES_BILLING', label: 'Billing', icon: '💰', color: 'yellow', optional: false },
    { status: 'OBAT_PULANG', label: 'Obat Pulang', icon: '💊', color: 'green', optional: false },
    { status: 'PULANG', label: 'Pulang', icon: '🏠', color: 'gray', optional: false }
  ];
  
  const alur = jenisKunjungan === 'Rawat Inap' ? alurRI : alurRJ;
  const currentStepIndex = alur.findIndex(s => s.status === pasien.status);
  
  const handleAdvance = () => {
    const nextStep = alur[currentStepIndex + 1];
    if (nextStep) {
      updateStatus(kunjunganId, nextStep.status, 'Current User');
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold">🛤️ Patient Journey</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{pasien.nama_pasien} • {pasien.no_rm}</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showHistory ? 'Sembunyikan' : 'Lihat'} Riwayat
        </button>
      </div>
      
      {/* Visual Journey */}
      <div className="flex items-start justify-between overflow-x-auto pb-4 custom-scrollbar">
        {alur.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;
          
          return (
            <React.Fragment key={step.status}>
              <div className="flex flex-col items-center min-w-[100px]">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl border-4 ${
                  isCompleted ? 'bg-green-500 border-green-600 text-white' :
                  isActive ? 'bg-blue-500 border-blue-600 text-white animate-pulse' :
                  'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400'
                }`}>
                  {isCompleted ? '✓' : step.icon}
                </div>
                <div className={`mt-2 text-xs font-semibold text-center ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                }`}>
                  {step.label}
                  {step.optional && <span className="block text-[10px] italic">(opsional)</span>}
                </div>
              </div>
              {idx < alur.length - 1 && (
                <div className={`flex-1 h-1 mx-2 mt-7 min-w-[20px] ${
                  idx < currentStepIndex ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'
                }`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Current Status */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Status Saat Ini:</div>
            <div className="text-lg font-bold text-blue-700 dark:text-blue-400">
              {alur[currentStepIndex]?.icon} {(STATUS_RJ as any)[pasien.status] || (STATUS_RI as any)[pasien.status] || pasien.status}
            </div>
          </div>
          {currentStepIndex < alur.length - 1 && (
            <button
              onClick={handleAdvance}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              ➡️ Lanjut ke {alur[currentStepIndex + 1]?.label}
            </button>
          )}
        </div>
      </div>
      
      {/* History */}
      {showHistory && (
        <div className="mt-6 border-t dark:border-gray-700 pt-4">
          <h3 className="font-bold mb-3">📜 Riwayat</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {[...(pasien.history_status || [])].reverse().map((h: any, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">{h.status}</div>
                  <div className="text-xs text-gray-500">{h.waktu} • oleh {h.oleh}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
