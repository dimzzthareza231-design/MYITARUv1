import React from 'react';
import { UserPlus, Search } from 'lucide-react';

export function StaffManagement() {
  const staff = [
    { id: 'DR-001', name: 'dr. Andi Kurniawan', role: 'Dokter Umum', shift: 'Pagi', status: 'Hadir' },
    { id: 'DR-002', name: 'dr. Budi Santoso, Sp.PD', role: 'Dokter Spesialis', shift: 'Siang', status: 'Cuti' },
    { id: 'NR-001', name: 'Ns. Siti Fatimah, S.Kep', role: 'Perawat', shift: 'Pagi', status: 'Hadir' },
    { id: 'AD-001', name: 'Rina Melati', role: 'Staf Registrasi', shift: 'Malam', status: 'Hadir' },
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">SDM & Tenaga Medis</h1>
          <p className="text-slate-500">Manajemen pegawai, dokter, dan jadwal shift</p>
        </div>
        <button className="bg-[var(--color-primary-blue)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors">
          <UserPlus className="w-5 h-5" />
          <span className="font-medium">Tambah Staf</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 shadow-sm">
              <tr>
                <th className="p-4 font-semibold text-sm">ID Pegawai</th>
                <th className="p-4 font-semibold text-sm">Nama</th>
                <th className="p-4 font-semibold text-sm">Posisi</th>
                <th className="p-4 font-semibold text-sm">Shift Saat Ini</th>
                <th className="p-4 font-semibold text-sm">Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {staff.map(member => (
                <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-500">{member.id}</td>
                  <td className="p-4 text-sm font-bold">{member.name}</td>
                  <td className="p-4 text-sm text-slate-500">{member.role}</td>
                  <td className="p-4 text-sm">{member.shift}</td>
                  <td className="p-4 text-sm">
                    {member.status === 'Hadir' ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Hadir</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">Cuti</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
