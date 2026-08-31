export const COLS: Record<string, any[]> = {
  pasien: [{key:'no_rm',label:'No RM'},{key:'nama_pasien',label:'Nama'},{key:'nik',label:'NIK'},{key:'penjamin',label:'Penjamin'},{key:'status',label:'Status',badge:true}],
  antrian: [{key:'no_antrian',label:'No Antrian'},{key:'nama_pasien',label:'Nama'},{key:'poli',label:'Poli'},{key:'status',label:'Status',badge:true}],
  triase: [{key:'nama_pasien',label:'Nama'},{key:'keluhan',label:'Keluhan'},{key:'kategori',label:'Kategori',badge:true},{key:'td',label:'TD'},{key:'nadi',label:'Nadi'}],
  lab: [{key:'no_permintaan',label:'ID Permintaan'},{key:'nama_pasien',label:'Nama'},{key:'jenis',label:'Tipe'},{key:'dokter',label:'Dokter'},{key:'status',label:'Status',badge:true}],
  bed: [{key:'kode_bed',label:'No Bed'},{key:'ruangan',label:'Ruangan'},{key:'kelas',label:'Kelas'},{key:'status',label:'Status',badge:true}],
  resep: [{key:'no_resep',label:'No Resep'},{key:'nama_pasien',label:'Nama'},{key:'obat',label:'Obat'},{key:'dosis',label:'Dosis'},{key:'status',label:'Status',badge:true}],
  obat: [{key:'kode',label:'Kode'},{key:'nama',label:'Nama Obat'},{key:'stok',label:'Stok'},{key:'harga',label:'Harga'},{key:'status',label:'Status',badge:true}],
  klaim: [{key:'no_klaim',label:'No Klaim'},{key:'nama_pasien',label:'Nama'},{key:'total',label:'Total'},{key:'status',label:'Status',badge:true}],
  sep: [{key:'no_sep',label:'No SEP'},{key:'nama_pasien',label:'Nama'},{key:'no_kartu',label:'No Kartu'},{key:'poli',label:'Poli'},{key:'status',label:'Status',badge:true}],
  rujukan: [{key:'no_rujukan',label:'No Rujukan'},{key:'nama_pasien',label:'Nama'},{key:'faskes_asal',label:'Faskes Asal'},{key:'status',label:'Status',badge:true}],
  mapping: [{key:'kode_internal',label:'Kode Internal'},{key:'nama_internal',label:'Nama Internal'},{key:'kode_bpjs',label:'Kode BPJS'},{key:'status',label:'Status',badge:true}],
  jadwal: [{key:'dokter',label:'Dokter'},{key:'poli',label:'Poli'},{key:'hari',label:'Hari'},{key:'jam',label:'Jam'},{key:'status',label:'Status',badge:true}],
  pegawai: [{key:'nip',label:'NIP'},{key:'nama',label:'Nama'},{key:'jabatan',label:'Jabatan'},{key:'shift',label:'Shift'},{key:'status',label:'Status',badge:true}],
  dokumen: [{key:'nomor',label:'Nomor'},{key:'nama',label:'Nama'},{key:'kategori',label:'Kategori'},{key:'tanggal',label:'Tanggal'},{key:'status',label:'Status',badge:true}]
};

export const MODULE_REGISTRY = [
  { id: 'pelayanan', label: 'Pelayanan', icon: '🏥', navColor: 'hover:bg-blue-600', modules: [
    {
      id: 'rekam-medis',
      label: 'Rekam Medis (RME)',
      icon: '📋',
      color: 'from-blue-500 to-indigo-600',
      submenus: ['Daftar Pasien', 'ICD-10 Diagnosis', 'ICD-9 Tindakan', 'Resume Medis']
    },
    
    { id: 'pendaftaran', label: 'Pendaftaran Pasien', icon: '📝', color: 'from-blue-500 to-blue-600', SPECIAL: true,
      submenus: [
        { label: '1. Master Pasien', cols: 'pasien', source: 'db_pasien' },
        { label: '2. Registrasi Kunjungan', cols: 'pasien', source: 'db_kunjungan' },
        { label: '3. Antrian', cols: 'antrian', source: 'db_antrian' },
        { label: '4. Riwayat Pendaftaran', cols: 'pasien', source: 'db_kunjungan' }
      ] },
    { id: 'igd', label: 'IGD', icon: '🚑', color: 'from-red-500 to-red-600', SPECIAL: true,
      submenus: [{ label: 'Triase', cols: 'triase', source: 'myitaru_igd_triase' }, { label: 'Penanganan IGD', cols: 'dokumen' }, { label: 'Observasi', cols: 'dokumen' }, { label: 'Dokter IGD', cols: 'pegawai', source: 'db_dokter_igd' }] },
    { id: 'rawat-jalan', label: 'Poliklinik', icon: '🩺', color: 'from-teal-500 to-teal-600', SPECIAL: true,
      submenus: [
        { label: 'Booking Registrasi', cols: 'pasien' },
        { label: 'Daftar Poliklinik', cols: 'dokumen' },
        { label: 'Antrian Poli', cols: 'antrian' },
        { label: 'Pemeriksaan', cols: 'pasien' },
        { label: 'Jadwal Dokter', cols: 'jadwal' },
        { label: 'Dokter Rawat Jalan', cols: 'pegawai', source: 'db_dokter' },
        { label: 'Patient Flow', cols: 'antrian' }
      ] },
    { id: 'rawat-inap', label: 'Rawat Inap', icon: '🛏️', color: 'from-indigo-500 to-indigo-600', SPECIAL: true,
      submenus: [{ label: 'Admisi', cols: 'pasien' }, { label: 'Ketersediaan Bed', cols: 'bed' }, { label: 'Visite', cols: 'pasien' }, { label: 'Asuhan Keperawatan', cols: 'dokumen' }, { label: 'Discharge Planning', cols: 'dokumen' }, { label: 'Dokter Ranap', cols: 'pegawai' }] },
    { id: 'operasi', label: 'Operasi', icon: '⚡', color: 'from-rose-500 to-rose-600', SPECIAL: true,
      submenus: [{ label: 'Pasien Operasi', cols: 'pasien' }, { label: 'Booking Operasi', cols: 'jadwal' }, { label: 'Paket Operasi', cols: 'dokumen' }, { label: 'Obat Operasi', cols: 'obat' }, { label: 'Laporan Operasi', cols: 'dokumen' }] },
    { id: 'laboratorium', label: 'Laboratorium & LIS', icon: '🔬', color: 'from-cyan-500 to-cyan-600', SPECIAL: true,
      submenus: [
        { label: 'Worklist & Permintaan', cols: 'lab' },
        { label: 'Input Hasil (LIS)', cols: 'lab' },
        { label: 'Validasi Sp.PK', cols: 'lab' },
        { label: 'Katalog & Tarif LOINC', cols: 'dokumen' },
        { label: 'Quality Control (QC)', cols: 'dokumen' },
        { label: 'Bank Darah (BDRS)', cols: 'dokumen' }
      ] },
    { id: 'radiologi', label: 'Radiologi & PACS', icon: '🎬', color: 'from-pink-500 to-pink-600', SPECIAL: true,
      submenus: [
        { label: 'Worklist & Permintaan', cols: 'lab' },
        { label: 'PACS & DICOM Viewer', cols: 'dokumen' },
        { label: 'Hasil & Ekspertise', cols: 'dokumen' },
        { label: 'Katalog & Tarif', cols: 'dokumen' },
        { label: 'Status Alat & QA/QC', cols: 'dokumen' }
      ] }
  ]},
  { id: 'manajemen', label: 'Manajemen', icon: '🏢', navColor: 'hover:bg-slate-600', modules: [
    { id: 'sdm', label: 'SDM & Shift', icon: '👥', color: 'from-slate-500 to-slate-700',
      submenus: [{ label: 'Data Pegawai', cols: 'pegawai', source: 'db_perawat' }, { label: 'Data Dokter', cols: 'pegawai', source: 'db_dokter' }, { label: 'Jadwal Shift', cols: 'jadwal' }, { label: 'Kehadiran', cols: 'pegawai' }, { label: 'Kredensial', cols: 'dokumen' }] },
    { id: 'inventory', label: 'Inventory', icon: '📦', color: 'from-orange-500 to-orange-600',
      submenus: [{ label: 'Stok Barang', cols: 'obat' }, { label: 'Gudang', cols: 'obat' }, { label: 'Purchase Order', cols: 'klaim' }, { label: 'Stok Opname', cols: 'obat' }] },
    { id: 'mutu', label: 'Mutu & Safety', icon: '🛡️', color: 'from-yellow-500 to-yellow-600',
      submenus: [{ label: 'Patient Safety', cols: 'dokumen' }, { label: 'Clinical Pathway', cols: 'dokumen' }, { label: 'CSSD', cols: 'dokumen' }, { label: 'Insiden', cols: 'dokumen' }] }
  ]},
  { id: 'farmasi', label: 'Farmasi', icon: '💊', navColor: 'hover:bg-purple-600', modules: [
    { id: 'apotek-ralan', label: 'Apotek Ralan', icon: '💊', color: 'from-purple-500 to-purple-600', SPECIAL: true,
      submenus: [{ label: 'Resep & Antrian Ralan', cols: 'resep' }, { label: 'Dispensing & Etiket', cols: 'resep' }, { label: 'Penyerahan & PIO', cols: 'resep' }, { label: 'Master Stok Ralan', cols: 'obat' }] },
    { id: 'apotek-ranap', label: 'Apotek Ranap', icon: '🧪', color: 'from-violet-500 to-violet-600', SPECIAL: true,
      submenus: [{ label: 'Jadwal UDD Bangsal', cols: 'resep' }, { label: 'Rekonsiliasi Obat', cols: 'resep' }, { label: 'Retur Sisa Obat', cols: 'resep' }, { label: 'Stok Depo Ranap', cols: 'obat' }] },
    { id: 'stok-obat', label: 'Stok Obat', icon: '💉', color: 'from-fuchsia-500 to-fuchsia-600', SPECIAL: true,
      submenus: [{ label: 'Master Stok & Multi-Depo', cols: 'obat' }, { label: 'Defecta & Surat Pesanan (SP)', cols: 'klaim' }, { label: 'Register Narkotika & LASA', cols: 'obat' }, { label: 'Katalog Fornas & KFA', cols: 'mapping' }] }
  ]},
  { id: 'keuangan', label: 'Keuangan', icon: '💰', navColor: 'hover:bg-yellow-600', modules: [
    { id: 'kasir', label: 'Kasir', icon: '💵', color: 'from-yellow-500 to-yellow-600',
      submenus: [{ label: 'Billing Ralan', cols: 'klaim' }, { label: 'Billing Ranap', cols: 'klaim' }, { label: 'Pembayaran', cols: 'klaim' }, { label: 'Kwitansi', cols: 'dokumen' }] },
    { id: 'bpjs-klaim', label: 'BPJS Klaim', icon: '💚', color: 'from-green-500 to-green-600',
      submenus: [{ label: 'Klaim BPJS', cols: 'klaim' }, { label: 'INA-CBGs', cols: 'klaim' }, { label: 'AI Validator', cols: 'klaim' }, { label: 'Vedika', cols: 'klaim' }] },
    { id: 'laporan', label: 'Laporan', icon: '📊', color: 'from-lime-500 to-lime-600',
      submenus: [{ label: 'Laporan Pasien', cols: 'pasien' }, { label: 'Laporan Keuangan', cols: 'klaim' }, { label: 'Laporan Laba Rugi', cols: 'klaim' }, { label: 'Laporan Obat', cols: 'obat' }, { label: 'Laporan BPJS', cols: 'klaim' }] }
  ]},
  { id: 'bridging', label: 'Bridging', icon: '🔗', navColor: 'hover:bg-green-600', modules: [
    { id: 'bridging-hub', label: 'Bridging Hub (Pusat)', icon: '🌐', color: 'from-blue-600 to-indigo-600', SPECIAL: true,
      submenus: [{ label: 'Semua Layanan', cols: 'dokumen' }, { label: 'BPJS Kesehatan', cols: 'dokumen' }, { label: 'Kemenkes SatuSehat', cols: 'dokumen' }, { label: 'Sistem Eksternal', cols: 'dokumen' }] },
    { id: 'wa-gateway', label: 'WA Gateway', icon: '💬', color: 'from-green-500 to-green-600',
      submenus: [{ label: 'Manage', cols: 'pegawai' }, { label: 'Send Message', cols: 'dokumen' }, { label: 'Send Image', cols: 'dokumen' }, { label: 'Send File', cols: 'dokumen' }, { label: 'Pengaturan', cols: 'dokumen' }] },
    { id: 'anjungan', label: 'Anjungan', icon: '🖥️', color: 'from-sky-500 to-sky-600',
      submenus: [{ label: 'Kelola', cols: 'dokumen' }, { label: 'Display', cols: 'antrian' }, { label: 'Pemanggil', cols: 'antrian' }, { label: 'Pengaturan', cols: 'dokumen' }] },
    { id: 'api', label: 'API', icon: '🔑', color: 'from-gray-600 to-gray-700',
      submenus: [{ label: 'Kelola', cols: 'dokumen' }, { label: 'Notifikasi APAM', cols: 'dokumen' }, { label: 'Pengaturan APAM', cols: 'dokumen' }, { label: 'Payment Duitku', cols: 'klaim' }, { label: 'Pengaturan API Key', cols: 'dokumen' }] },
    { id: 'jkn-mobile', label: 'JKN Mobile', icon: '📱', color: 'from-blue-500 to-blue-600', SPECIAL: true,
      submenus: [] },
    { id: 'vclaim', label: 'VClaim Request', icon: '📄', color: 'from-green-500 to-green-700',
      submenus: [{ label: 'Kelola', cols: 'dokumen' }, { label: 'Referensi', cols: 'mapping' }, { label: 'Peserta', cols: 'pasien' }, { label: 'Rencana Kontrol', cols: 'jadwal' }, { label: 'SEP', cols: 'sep' }, { label: 'Rujukan', cols: 'rujukan' }, { label: 'PRB', cols: 'rujukan' }, { label: 'Lembar Pengajuan Klaim', cols: 'klaim' }, { label: 'Monitoring', cols: 'klaim' }, { label: 'Mapping Poli', cols: 'mapping' }, { label: 'Mapping Dokter', cols: 'mapping' }] },
    { id: 'vedika', label: 'Vedika', icon: '✅', color: 'from-teal-500 to-teal-600',
      submenus: [{ label: 'Kelola', cols: 'klaim' }, { label: 'Upload Berkas', cols: 'dokumen' }, { label: 'Status Verifikasi', cols: 'klaim' }, { label: 'Feedback BPJS', cols: 'dokumen' }, { label: 'Pengaturan', cols: 'dokumen' }] },
    { id: 'orthanc', label: 'Orthanc', icon: '🎬', color: 'from-pink-500 to-pink-600',
      submenus: [{ label: 'Kelola', cols: 'dokumen' }, { label: 'DICOM Viewer', cols: 'dokumen' }, { label: 'Upload Hasil', cols: 'dokumen' }, { label: 'Archive', cols: 'dokumen' }, { label: 'Pengaturan', cols: 'dokumen' }] },
    { id: 'bpjs-emr', label: 'BPJS E-MR', icon: '♿', color: 'from-blue-500 to-blue-700',
      submenus: [{ label: 'Kelola', cols: 'dokumen' }, { label: 'Kirim Data Klinis', cols: 'dokumen' }, { label: 'Status Submit', cols: 'klaim' }, { label: 'Pengaturan', cols: 'dokumen' }] },
    { id: 'hfis', label: 'Bridging HFIS', icon: '🏥', color: 'from-emerald-500 to-emerald-600',
      submenus: [{ label: 'Kelola', cols: 'dokumen' }, { label: 'Data Fasilitas', cols: 'dokumen' }, { label: 'Kapasitas', cols: 'bed' }, { label: 'Pengaturan', cols: 'dokumen' }] },
    { id: 'veronisa', label: 'Veronisa', icon: '🔍', color: 'from-amber-500 to-amber-600',
      submenus: [{ label: 'Kelola', cols: 'pasien' }, { label: 'Cek Eligibilitas', cols: 'pasien' }, { label: 'Riwayat Verifikasi', cols: 'pasien' }, { label: 'Pengaturan', cols: 'dokumen' }] },
    { id: 'satu-sehat', label: 'Satu Sehat', icon: '🌐', color: 'from-green-500 to-green-600',
      submenus: [{ label: 'Kelola', cols: 'dokumen' }, { label: 'Referensi Praktisi', cols: 'pegawai' }, { label: 'Referensi Pasien', cols: 'pasien' }, { label: 'Mapping Departemen', cols: 'mapping' }, { label: 'Mapping Lokasi', cols: 'mapping' }, { label: 'Mapping Praktisi', cols: 'mapping' }, { label: 'Mapping Obat', cols: 'mapping' }, { label: 'Mapping Lab', cols: 'mapping' }, { label: 'Mapping Radiologi', cols: 'mapping' }, { label: 'Data Response', cols: 'dokumen' }, { label: 'Verifikasi KYC', cols: 'pegawai' }, { label: 'Pengaturan', cols: 'dokumen' }] },
    { id: 'sertisign', label: 'Sertisign', icon: '✍️', color: 'from-purple-500 to-purple-600',
      submenus: [{ label: 'Kelola', cols: 'dokumen' }, { label: 'Tanda Tangan Dokumen', cols: 'dokumen' }, { label: 'Sertifikat', cols: 'dokumen' }, { label: 'Pengaturan', cols: 'dokumen' }] },
    { id: 'cloudflare', label: 'Cloudflare Security', icon: '🛡️', color: 'from-orange-500 to-amber-600', SPECIAL: true,
      submenus: [{ label: 'Overview', cols: 'dokumen' }, { label: 'Turnstile', cols: 'dokumen' }, { label: 'DNS', cols: 'dokumen' }, { label: 'WAF', cols: 'dokumen' }, { label: 'R2 Storage', cols: 'dokumen' }, { label: 'Tunnel', cols: 'dokumen' }] }
  ]},
  { id: 'sistem', label: 'Sistem', icon: '⚙️', navColor: 'hover:bg-gray-600', modules: [
    { id: 'pengaturan-klinik', label: 'Pengaturan Klinik', icon: '🏥', color: 'from-blue-600 to-blue-700', submenus: [{ label: 'Kop Surat & Logo', cols: 'dokumen' }] },
    { id: 'panduan', label: 'Panduan', icon: '📖', color: 'from-blue-500 to-blue-600', submenus: [{ label: 'Artikel', cols: 'dokumen' }] },
    { id: 'notifikasi', label: 'Notifikasi', icon: '🔔', color: 'from-red-500 to-red-600', submenus: [{ label: 'Semua', cols: 'dokumen' }] },
    { id: 'profile', label: 'Profile', icon: '👤', color: 'from-fuchsia-500 to-fuchsia-600', SPECIAL: true, submenus: [] },
    { id: 'security', label: 'Security', icon: '🔐', color: 'from-gray-600 to-gray-700', submenus: [{ label: 'Users', cols: 'pegawai' }, { label: 'Roles', cols: 'dokumen' }] },
    { id: 'audit', label: 'Audit Trail', icon: '📜', color: 'from-amber-500 to-amber-600', submenus: [{ label: 'Logs', cols: 'dokumen' }] },
    { id: 'backup', label: 'Backup & DR', icon: '💾', color: 'from-slate-500 to-slate-600', submenus: [{ label: 'Backup', cols: 'dokumen' }] },
    { id: 'monitoring', label: 'Monitoring', icon: '📡', color: 'from-cyan-500 to-cyan-600', submenus: [{ label: 'Logs', cols: 'dokumen' }] }
  ]}
];

export const findModule = (id: string) => {
  for (const cat of MODULE_REGISTRY) {
    const mod = cat.modules.find(m => m.id === id);
    if (mod) return { category: cat, module: mod };
  }
  return null;
};
