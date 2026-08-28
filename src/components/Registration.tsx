import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useHospital } from '../contexts/HospitalContext';
import { useToast } from '../contexts/ToastContext';
import { RegistrationForm } from './Registration/RegistrationForm';
import { ProfessionalTable } from './ProfessionalTable';
import SmartTable from './SmartTable';
import PrintPDFButton from './PrintPDFButton';

export function Registration() {
  const { activeTab } = useOutletContext<{ activeTab: string }>();
  const { pasien, kunjungan, updateKunjunganStatus } = useHospital();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState<any>(null);
  const toast = useToast();

  if (showRegistrationForm || activeTab === 'Pasien Baru') {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 min-h-[80vh] flex flex-col rounded-xl overflow-hidden">
        <div className="p-4 bg-white dark:bg-slate-800 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="font-bold text-lg dark:text-white">Pendaftaran Pasien Baru</h2>
          {showRegistrationForm && (
            <button onClick={() => setShowRegistrationForm(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
              Kembali
            </button>
          )}
        </div>
        <RegistrationForm 
            initialData={selectedPasien ? { 
                nik: selectedPasien.nik, 
                namaLengkap: selectedPasien.nama, 
                noRm: selectedPasien.no_rm,
                jenisKelamin: selectedPasien.jenis_kelamin,
                noHpUtama: selectedPasien.no_hp
            } : undefined} 
            onClose={() => setShowRegistrationForm(false)} 
        />
      </div>
    );
  }

  if (activeTab === 'Cari Pasien') {
    const columns: any[] = [
      { key: 'no_rm', label: 'No RM', sortable: true },
      { key: 'nik', label: 'NIK', sortable: true, render: (val: any) => val || '-' },
      { key: 'nama', label: 'Nama Lengkap', sortable: true },
      { key: 'jenis_kelamin', label: 'L/P', sortable: true, filterable: true },
      { key: 'no_hp', label: 'No. HP', sortable: true, render: (val: any) => val || '-' },
      {
        key: 'print',
        label: 'Dokumen / PDF',
        render: (_: any, row: any) => (
          <div onClick={(e) => e.stopPropagation()}>
            <PrintPDFButton
              documentData={{
                nama: row.nama,
                no_rm: row.no_rm,
                nik: row.nik,
                jenis_kelamin: row.jenis_kelamin,
                no_hp: row.no_hp,
                unit_pelayanan: 'Instalasi Admisi & Rekam Medis (Pendaftaran)',
                penjamin: row.penjamin || 'BPJS Kesehatan',
                alamat: row.alamat || 'Kota Bandung, Jawa Barat'
              }}
              docType="general"
              filename={`Identitas_Pasien_${row.no_rm}_${row.nama}`}
              label="Cetak"
              title="KARTU IDENTITAS & DATA REGISTRASI PASIEN"
              className="py-1 px-2.5 text-xs font-medium"
            />
          </div>
        )
      }
    ];

    const actions = [
      {
        icon: <Plus className="w-4 h-4" />,
        label: 'Pasien Baru',
        color: 'bg-blue-600 hover:bg-blue-700',
        onClick: () => { setSelectedPasien(null); setShowRegistrationForm(true); }
      }
    ];

    return (
      <div className="p-6 h-full">
        <ProfessionalTable 
          title="Daftar Pasien (Pencarian Real-time)"
          columns={columns}
          data={pasien}
          actions={actions}
          onRowClick={(row) => { setSelectedPasien(row); setShowRegistrationForm(true); toast.info(`Membuka data pasien ${row.nama}`); }}
          pageSize={10}
          emptyMessage="Belum ada data pasien. Klik 'Pasien Baru' untuk menambahkan."
        />
      </div>
    );
  }

  if (activeTab === 'Antrian') {
    const antrianColumns = [
      { key: 'nomor_antrian', label: 'No. Antrian' },
      { key: 'nama', label: 'Nama Pasien' },
      { key: 'poli', label: 'Poliklinik' },
      { key: 'status', label: 'Status', badge: true }
    ];

    const antrianData = kunjungan.map(k => {
      const p = pasien.find(px => String(px.id) === String(k.pasien_id));
      return {
        id: k.id,
        nomor_antrian: k.nomor_antrian,
        nama: p ? (p.nama || (p as any).nama_pasien) : 'Unknown',
        poli: k.poli_id,
        status: k.status
      };
    });

    return (
      <div className="p-6 h-full">
        <SmartTable 
          storageKey="hospital_kunjungan_antrian"
          columns={antrianColumns}
          title="Antrian Pendaftaran Hari Ini"
          extraActions={
            <div className="flex gap-2">
              <button className="bg-emerald-600 text-white px-3 py-2 rounded text-sm hover:bg-emerald-700" onClick={() => toast.success('Memanggil nomor antrian selanjutnya')}>🔊 Panggil</button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <SmartTable 
        storageKey={`hospital_pendaftaran_${activeTab}`}
        columns={[
          { key: 'nomor', label: 'Nomor' },
          { key: 'tanggal', label: 'Tanggal' },
          { key: 'keterangan', label: 'Keterangan' },
          { key: 'status', label: 'Status', badge: true }
        ]}
        title={activeTab}
      />
    </div>
  );
}
