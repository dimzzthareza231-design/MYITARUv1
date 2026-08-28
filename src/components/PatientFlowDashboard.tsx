import React, { useState } from 'react';
import { usePatientFlow, STATUS_RJ, STATUS_RI } from '../contexts/PatientFlowContext';
import PatientJourneyTracker from './PatientJourneyTracker';
import FormSOAP from './FormSOAP';

export default function PatientFlowDashboard() {
  const { kunjungan, notifications, markNotifRead, markAllNotifRead } = usePatientFlow();
  const [filter, setFilter] = useState('all');
  const [selectedPasien, setSelectedPasien] = useState<any>(null);
  const [showJourneyModal, setShowJourneyModal] = useState(false);
  const [showSOAPModal, setShowSOAPModal] = useState(false);
  
  const stats = {
    total_aktif: kunjungan.filter((k: any) => k.status !== 'PULANG').length,
    rawat_jalan: kunjungan.filter((k: any) => k.jenis_kunjungan === 'Rawat Jalan' && k.status !== 'PULANG').length,
    rawat_inap: kunjungan.filter((k: any) => k.jenis_kunjungan === 'Rawat Inap' && k.status !== 'PULANG').length,
    antri_poli: kunjungan.filter((k: any) => k.status === 'ANTRI_POLI').length,
    antri_farmasi: kunjungan.filter((k: any) => k.status === 'ANTRI_FARMASI').length,
    antri_kasir: kunjungan.filter((k: any) => k.status === 'ANTRI_KASIR').length,
    sedang_dirawat: kunjungan.filter((k: any) => k.status === 'DIRAWAT').length
  };
  
  const filteredKunjungan = kunjungan.filter((k: any) => {
    if (filter === 'all') return k.status !== 'PULANG';
    if (filter === 'rawat_jalan') return k.jenis_kunjungan === 'Rawat Jalan' && k.status !== 'PULANG';
    if (filter === 'rawat_inap') return k.jenis_kunjungan === 'Rawat Inap' && k.status !== 'PULANG';
    return k.status === filter;
  });
  
  const getStatusBadge = (status: string) => {
    const colors: any = {
      'DAFTAR': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'ANTRI_POLI': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'PERIKSA_POLI': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      'ANTRI_FARMASI': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'ANTRI_KASIR': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'DIRAWAT': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };
  
  return (
    <div className="p-6 min-h-[80vh] w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">🏥 Patient Flow Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Monitoring alur pasien real-time</p>
        </div>
        {notifications.filter((n: any) => !n.read).length > 0 && (
          <button onClick={markAllNotifRead} className="text-sm text-blue-600 hover:underline">
            ✓ Tandai semua dibaca
          </button>
        )}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-3">
          <div className="text-2xl">👥</div>
          <div className="text-2xl font-bold">{stats.total_aktif}</div>
          <div className="text-xs">Total Aktif</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-3">
          <div className="text-2xl">🚶</div>
          <div className="text-2xl font-bold">{stats.rawat_jalan}</div>
          <div className="text-xs">Rawat Jalan</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg p-3">
          <div className="text-2xl">🛏️</div>
          <div className="text-2xl font-bold">{stats.rawat_inap}</div>
          <div className="text-xs">Rawat Inap</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-3">
          <div className="text-2xl">🏥</div>
          <div className="text-2xl font-bold">{stats.antri_poli}</div>
          <div className="text-xs">Antri Poli</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-3">
          <div className="text-2xl">💊</div>
          <div className="text-2xl font-bold">{stats.antri_farmasi}</div>
          <div className="text-xs">Antri Farmasi</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-3">
          <div className="text-2xl">💰</div>
          <div className="text-2xl font-bold">{stats.antri_kasir}</div>
          <div className="text-xs">Antri Kasir</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg p-3">
          <div className="text-2xl">💉</div>
          <div className="text-2xl font-bold">{stats.sedang_dirawat}</div>
          <div className="text-xs">Dirawat</div>
        </div>
      </div>
      
      {/* Notifications */}
      {notifications.filter((n: any) => !n.read).length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-yellow-800 dark:text-yellow-400 mb-3">🔔 Notifikasi Terbaru</h3>
          <div className="space-y-2">
            {notifications.filter((n: any) => !n.read).slice(0, 5).map((n: any) => (
              <div key={n.id} className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded">
                <div className="flex-1">
                  <div className="text-sm font-semibold">{n.nama_pasien}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {n.status_lama} → <strong>{n.status_baru}</strong>
                  </div>
                </div>
                <button onClick={() => markNotifRead(n.id)} className="text-xs text-blue-600">✓</button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-4 border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Semua Aktif' },
            { id: 'rawat_jalan', label: 'Rawat Jalan' },
            { id: 'rawat_inap', label: 'Rawat Inap' },
            { id: 'ANTRI_POLI', label: 'Antri Poli' },
            { id: 'ANTRI_FARMASI', label: 'Antri Farmasi' },
            { id: 'ANTRI_KASIR', label: 'Antri Kasir' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                filter === f.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Patient List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-x-auto border border-slate-200 dark:border-slate-700">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-100 dark:bg-slate-900/50">
            <tr>
              <th className="p-3 text-left">No RM</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Jenis</th>
              <th className="p-3 text-left">Poli/Kamar</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Jam</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredKunjungan.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  <div className="text-5xl mb-3">🏥</div>
                  <p>Tidak ada pasien aktif</p>
                </td>
              </tr>
            ) : (
              filteredKunjungan.map((k: any) => (
                <tr key={k.id} className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                  <td className="p-3 font-mono text-sm">{k.no_rm}</td>
                  <td className="p-3 font-semibold">{k.nama_pasien}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      k.jenis_kunjungan === 'Rawat Inap' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {k.jenis_kunjungan}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{k.poli || k.kamar}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(k.status)}`}>
                      {(STATUS_RJ as any)[k.status] || (STATUS_RI as any)[k.status] || k.status}
                    </span>
                  </td>
                  <td className="p-3 text-sm">{k.jam_daftar}</td>
                  <td className="p-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => { setSelectedPasien(k); setShowJourneyModal(true); }}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm flex items-center gap-1"
                      >
                        🛤️ Alur
                      </button>
                      {['ANTRI_POLI', 'PERIKSA_POLI'].includes(k.status) && (
                        <button
                          onClick={() => { setSelectedPasien(k); setShowSOAPModal(true); }}
                          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-sm flex items-center gap-1"
                        >
                          📝 SOAP
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Journey Modal */}
      {showJourneyModal && selectedPasien && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 p-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold">🛤️ Patient Journey</h2>
              <button onClick={() => setShowJourneyModal(false)} className="text-2xl">&times;</button>
            </div>
            <div className="p-6">
              <PatientJourneyTracker
                kunjunganId={selectedPasien.id}
                jenisKunjungan={selectedPasien.jenis_kunjungan}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* SOAP Modal */}
      {showSOAPModal && selectedPasien && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <FormSOAP
                kunjunganId={selectedPasien.id}
                pasien={selectedPasien}
                onClose={() => setShowSOAPModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
