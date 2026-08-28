import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, Search } from 'lucide-react';

export function JadwalOperasi() {
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  const jadwalOperasi = [
    { id: 1, pasien: 'Budi Santoso', rm: 'RM-001234', operasi: 'Appendektomi', tanggal: '10 Feb 2026', jam: '08:00', ruangan: 'OK 1', dokter: 'Dr. Ahmad, Sp.B', status: 'Terjadwal' },
    { id: 2, pasien: 'Siti Aminah', rm: 'RM-001235', operasi: 'Kolesistektomi', tanggal: '10 Feb 2026', jam: '10:00', ruangan: 'OK 2', dokter: 'Dr. Rina, Sp.B', status: 'Terjadwal' },
    { id: 3, pasien: 'Joko Anwar', rm: 'RM-001236', operasi: 'Herniotomi', tanggal: '11 Feb 2026', jam: '09:00', ruangan: 'OK 1', dokter: 'Dr. Ahmad, Sp.B', status: 'Terjadwal' },
    { id: 4, pasien: 'Dewi Lestari', rm: 'RM-001237', operasi: 'Sectio Caesarea', tanggal: '11 Feb 2026', jam: '13:00', ruangan: 'OK 3', dokter: 'Dr. Maya, Sp.OG', status: 'Terjadwal' },
    { id: 5, pasien: 'Andi Wijaya', rm: 'RM-001238', operasi: 'ORIF Fraktur Femur', tanggal: '09 Feb 2026', jam: '08:00', ruangan: 'OK 1', dokter: 'Dr. Budi, Sp.OT', status: 'Selesai' },
  ];

  const statusList = ['Semua', 'Terjadwal', 'Selesai'];

  const filtered = jadwalOperasi.filter(j => {
    const matchSearch = j.pasien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.operasi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || j.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Calendar className="w-6 h-6 text-teal-600" /> Jadwal Tindakan Operasi
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Lihat jadwal operasi dan tindakan medis yang telah dijadwalkan</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari pasien atau jenis operasi..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500 outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {statusList.map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filterStatus === status
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Pasien</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Tindakan Operasi</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Tanggal & Jam</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Ruangan</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Dokter Operator</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filtered.map(jadwal => (
                <tr key={jadwal.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4">
                    <div className="font-bold text-slate-800 dark:text-white">{jadwal.pasien}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{jadwal.rm}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{jadwal.operasi}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4" /> {jadwal.tanggal}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mt-1">
                      <Clock className="w-3 h-3" /> {jadwal.jam} WIB
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{jadwal.ruangan}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                      <User className="w-4 h-4" /> {jadwal.dokter}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      jadwal.status === 'Terjadwal' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    }`}>
                      {jadwal.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">Tidak ada jadwal operasi yang cocok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
