const fs = require('fs');

const medicalRecords = `import React from 'react';
import { FileText, Search, Plus, Filter } from 'lucide-react';
import { useHospital } from '../contexts/HospitalContext';

export function MedicalRecords() {
  const { patients } = useHospital();
  
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Rekam Medis (EMR)</h1>
          <p className="text-slate-500">Manajemen berkas rekam medis dan histori pasien</p>
        </div>
        <button className="bg-[var(--color-primary-blue)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Tambah Dokumen</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex gap-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama, No. RM..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]"
            />
          </div>
          <button className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 shadow-sm">
              <tr>
                <th className="p-4 font-semibold text-sm">No. RM</th>
                <th className="p-4 font-semibold text-sm">Nama Pasien</th>
                <th className="p-4 font-semibold text-sm">Terakhir Berkunjung</th>
                <th className="p-4 font-semibold text-sm">Diagnosis (ICD-10)</th>
                <th className="p-4 font-semibold text-sm">Status Dokumen</th>
                <th className="p-4 font-semibold text-sm">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {patients.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-[var(--color-primary-blue)]">{p.no_rm}</td>
                  <td className="p-4 text-sm font-bold">{p.nama}</td>
                  <td className="p-4 text-sm text-slate-500">Hari ini</td>
                  <td className="p-4 text-sm">-</td>
                  <td className="p-4 text-sm">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Lengkap
                    </span>
                  </td>
                  <td className="p-4 text-sm">
                    <button className="text-[var(--color-primary-blue)] hover:underline font-medium">Buka Berkas</button>
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
`;

const pharmacy = `import React from 'react';
import { FlaskConical, Search, Plus } from 'lucide-react';

export function Pharmacy() {
  const inventory = [
    { id: 'MED-01', name: 'Paracetamol 500mg', category: 'Tablet', stock: 1250, minStock: 200, unit: 'Strip' },
    { id: 'MED-02', name: 'Amoxicillin 500mg', category: 'Antibiotik', stock: 840, minStock: 300, unit: 'Strip' },
    { id: 'MED-03', name: 'Omeprazole 20mg', category: 'Kapsul', stock: 45, minStock: 100, unit: 'Strip' },
    { id: 'MED-04', name: 'Vitamin C 1000mg', category: 'Vitamin', stock: 500, minStock: 100, unit: 'Botol' },
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Farmasi & Inventaris</h1>
          <p className="text-slate-500">Manajemen stok obat dan bahan medis habis pakai</p>
        </div>
        <button className="bg-[var(--color-primary-blue)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Tambah Obat Baru</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex gap-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari nama obat, kode..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-blue)]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 shadow-sm">
              <tr>
                <th className="p-4 font-semibold text-sm">Kode Obat</th>
                <th className="p-4 font-semibold text-sm">Nama Obat</th>
                <th className="p-4 font-semibold text-sm">Kategori</th>
                <th className="p-4 font-semibold text-sm">Stok</th>
                <th className="p-4 font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {inventory.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-500">{item.id}</td>
                  <td className="p-4 text-sm font-bold">{item.name}</td>
                  <td className="p-4 text-sm text-slate-500">{item.category}</td>
                  <td className="p-4 text-sm">{item.stock} {item.unit}</td>
                  <td className="p-4 text-sm">
                    {item.stock <= item.minStock ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        Stok Menipis
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Aman
                      </span>
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
`;

const bedManagement = `import React from 'react';
import { BedDouble, Search } from 'lucide-react';

export function BedManagement() {
  const beds = [
    { id: 'R-101', room: 'Mawar', class: 'Kelas 1', status: 'Terisi', patient: 'Ahmad Dahlan' },
    { id: 'R-102', room: 'Mawar', class: 'Kelas 1', status: 'Kosong', patient: '-' },
    { id: 'R-201', room: 'Melati', class: 'VIP', status: 'Dibersihkan', patient: '-' },
    { id: 'R-301', room: 'Tulip', class: 'Kelas 3', status: 'Terisi', patient: 'Siti Aminah' },
  ];

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Tempat Tidur</h1>
          <p className="text-slate-500">Informasi ketersediaan dan status ruangan rawat inap</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 shadow-sm">
              <tr>
                <th className="p-4 font-semibold text-sm">No. Bed / Ruangan</th>
                <th className="p-4 font-semibold text-sm">Kelas</th>
                <th className="p-4 font-semibold text-sm">Status</th>
                <th className="p-4 font-semibold text-sm">Pasien</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {beds.map(bed => (
                <tr key={bed.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 text-sm font-bold">{bed.id} <span className="font-normal text-slate-500 ml-2">({bed.room})</span></td>
                  <td className="p-4 text-sm text-slate-500">{bed.class}</td>
                  <td className="p-4 text-sm">
                    {bed.status === 'Kosong' && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Kosong</span>}
                    {bed.status === 'Terisi' && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Terisi</span>}
                    {bed.status === 'Dibersihkan' && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">Dibersihkan</span>}
                  </td>
                  <td className="p-4 text-sm">{bed.patient}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;

const staffManagement = `import React from 'react';
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
`;

fs.writeFileSync('src/components/MedicalRecords.tsx', medicalRecords);
fs.writeFileSync('src/components/Pharmacy.tsx', pharmacy);
fs.writeFileSync('src/components/BedManagement.tsx', bedManagement);
fs.writeFileSync('src/components/StaffManagement.tsx', staffManagement);

// Now update App.tsx and Sidebar.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

if (!appContent.includes('MedicalRecords')) {
  appContent = appContent.replace(
    "import { HelpSystem } from './components/HelpSystem';", 
    `import { HelpSystem } from './components/HelpSystem';
import { MedicalRecords } from './components/MedicalRecords';
import { Pharmacy } from './components/Pharmacy';
import { BedManagement } from './components/BedManagement';
import { StaffManagement } from './components/StaffManagement';`
  );
  
  appContent = appContent.replace(
    "case 'ai-analytics':\n        return <AIAnalytics />;",
    `case 'ai-analytics':
        return <AIAnalytics />;
      case 'rekam-medis':
        return <MedicalRecords />;
      case 'farmasi':
        return <Pharmacy />;
      case 'tempat-tidur':
        return <BedManagement />;
      case 'sdm':
        return <StaffManagement />;`
  );
  fs.writeFileSync('src/App.tsx', appContent);
}

let sidebarContent = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

if (!sidebarContent.includes('rekam-medis')) {
  sidebarContent = sidebarContent.replace(
    "{ id: 'billing', label: 'Billing & Kasir', icon: CreditCard, roles: ['Admin', 'Kasir'] },",
    `{ id: 'rekam-medis', label: 'Rekam Medis (EMR)', icon: FileSignature, roles: ['Admin', 'Dokter', 'Perawat'] },
    { id: 'farmasi', label: 'Farmasi', icon: FlaskConical, roles: ['Admin', 'Farmasi'] },
    { id: 'tempat-tidur', label: 'Ketersediaan Bed', icon: BedDouble, roles: ['Admin', 'Perawat', 'Staf Registrasi'] },
    { id: 'sdm', label: 'SDM & Tenaga Medis', icon: LifeBuoy, roles: ['Admin'] },
    { id: 'billing', label: 'Billing & Kasir', icon: CreditCard, roles: ['Admin', 'Kasir'] },`
  );
  fs.writeFileSync('src/components/Sidebar.tsx', sidebarContent);
}

