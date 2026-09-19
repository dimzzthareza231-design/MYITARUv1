export interface Role {
  id: string;
  nama: string;
  icon: string;
  warna: string;
  deskripsi: string;
  kategori?: 'Medis' | 'Penunjang' | 'Administrasi' | 'Manajemen' | 'Sistem';
  moduleAccess: string[]; // daftar ID modul yang bisa diakses
}

// Modul yang bisa diakses SEMUA role (Self-service & Bantuan)
export const COMMON_MODULES = ['profile', 'notifikasi', 'panduan', 'dashboard'];

// Alias mapping agar backward compatibility dengan route lama / nama alternatif tetap bekerja sempurna
export const MODULE_ALIASES: Record<string, string[]> = {
  'rekam-medis': ['master-data', 'rme', 'rekammedis'],
  'pendaftaran': ['registrasi', 'admisi', 'pasien-baru'],
  'rawat-jalan': ['poli', 'poliklinik', 'rawatjalan'],
  'rawat-inap': ['bangsal', 'ranap', 'rawatinap', 'bed'],
  'laboratorium': ['lab', 'lis'],
  'radiologi': ['rad', 'pacs'],
  'orthanc': ['dicom', 'orthanc-pacs'],
  'vclaim': ['bpjs', 'v-claim'],
  'bpjs-klaim': ['klaim', 'inacbg', 'ina-cbg'],
  'satu-sehat': ['kemenkes', 'satusehat', 'fhir'],
  'api': ['integrasi', 'api-management'],
  'bridging-hub': ['bridging', 'hub'],
  'kasir': ['billing', 'keuangan', 'pembayaran'],
  'sdm': ['pegawai', 'hrd', 'staff'],
  'inventory': ['gudang', 'logistik'],
  'mutu': ['patient-safety', 'safety', 'komite-mutu'],
  'pengaturan-klinik': ['settings', 'pengaturan'],
  'apotek-ralan': ['farmasi-ralan'],
  'apotek-ranap': ['farmasi-ranap'],
  'stok-obat': ['farmasi-stok', 'obat'],
  'security': ['user-management', 'auth-management', 'users', 'roles']
};

export const ROLES: Role[] = [
  {
    id: 'viewer',
    nama: 'Guest Viewer',
    icon: '👁️',
    warna: 'from-gray-400 to-gray-500',
    deskripsi: 'Akses read-only ke seluruh modul operasional dan medis (hanya melihat, tidak dapat mengubah data).',
    kategori: 'Sistem',
    moduleAccess: [
      'rekam-medis', 'pendaftaran', 'igd', 'rawat-jalan', 'rawat-inap', 'operasi', 'laboratorium', 'radiologi',
      'triase', 'icu', 'cssd', 'rehab', 'telemedicine', 'gizi',
      'sdm', 'inventory', 'mutu', 'patient-flow',
      'apotek-ralan', 'apotek-ranap', 'stok-obat',
      'kasir', 'bpjs-klaim', 'laporan',
      'bridging-hub', 'wa-gateway', 'anjungan', 'api', 'jkn-mobile', 'vclaim', 'vedika', 'orthanc', 'bpjs-emr', 'hfis', 'veronisa', 'satu-sehat', 'sertisign', 'cloudflare',
      'pengaturan-klinik', 'security', 'audit', 'backup', 'monitoring',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'super_admin',
    nama: 'Super Admin',
    icon: '👑',
    warna: 'from-purple-500 to-pink-600',
    deskripsi: 'Akses penuh ke semua modul klinis, bridging, keuangan, keamanan, dan infrastruktur sistem tanpa batas.',
    kategori: 'Sistem',
    moduleAccess: [
      'rekam-medis', 'pendaftaran', 'igd', 'rawat-jalan', 'rawat-inap', 'operasi', 'laboratorium', 'radiologi',
      'triase', 'icu', 'cssd', 'rehab', 'telemedicine', 'gizi',
      'sdm', 'inventory', 'mutu', 'patient-flow',
      'apotek-ralan', 'apotek-ranap', 'stok-obat',
      'kasir', 'bpjs-klaim', 'laporan',
      'bridging-hub', 'wa-gateway', 'anjungan', 'api', 'jkn-mobile', 'vclaim', 'vedika', 'orthanc', 'bpjs-emr', 'hfis', 'veronisa', 'satu-sehat', 'sertisign', 'cloudflare',
      'pengaturan-klinik', 'security', 'audit', 'backup', 'monitoring',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'admin',
    nama: 'Administrator SIMK',
    icon: '🔧',
    warna: 'from-slate-500 to-slate-700',
    deskripsi: 'Pengelolaan manajerial tingkat lanjut untuk master data, SDM, inventori, laporan dan bridging sistem.',
    kategori: 'Sistem',
    moduleAccess: [
      'rekam-medis', 'pendaftaran', 'sdm', 'inventory', 'mutu', 'laporan', 'patient-flow',
      'apotek-ralan', 'apotek-ranap', 'stok-obat', 'kasir', 'bpjs-klaim',
      'bridging-hub', 'wa-gateway', 'anjungan', 'api', 'jkn-mobile', 'vclaim', 'vedika', 'orthanc', 'bpjs-emr', 'hfis', 'veronisa', 'satu-sehat', 'sertisign',
      'pengaturan-klinik', 'security', 'audit', 'backup', 'monitoring',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'direksi',
    nama: 'Direksi & Manajemen',
    icon: '🏛️',
    warna: 'from-amber-600 to-yellow-600',
    deskripsi: 'Akses executive dashboard tingkat tinggi untuk analitik operasional, KPI, dan laporan mutu layanan.',
    kategori: 'Manajemen',
    moduleAccess: [
      'laporan', 'mutu', 'sdm', 'inventory', 'kasir', 'bpjs-klaim', 'patient-flow', 'monitoring', 'audit',
      'rekam-medis', 'rawat-jalan', 'rawat-inap', 'igd', 'bridging-hub', 'hfis',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'dokter',
    nama: 'Dokter / DPJP',
    icon: '👨‍⚕️',
    warna: 'from-blue-500 to-cyan-600',
    deskripsi: 'Kewenangan klinis penuh untuk penulisan EMR, diagnosis ICD, asuhan medis, e-resep, dan validasi medis.',
    kategori: 'Medis',
    moduleAccess: [
      'rekam-medis', 'rawat-jalan', 'igd', 'rawat-inap', 'operasi', 'triase',
      'laboratorium', 'radiologi', 'orthanc', 'cssd',
      'apotek-ralan', 'stok-obat',
      'vclaim', 'bpjs-emr', 'satu-sehat', 'telemedicine', 'rehab', 'gizi', 'icu',
      'patient-flow', 'mutu', 'laporan',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'perawat',
    nama: 'Perawat',
    icon: '👩‍⚕️',
    warna: 'from-emerald-500 to-teal-600',
    deskripsi: 'Fokus pada asuhan keperawatan, triase gawat darurat, observasi vital sign, dan manajemen antrian pasien.',
    kategori: 'Medis',
    moduleAccess: [
      'igd', 'rawat-inap', 'rawat-jalan', 'triase', 'rekam-medis', 'icu', 'cssd', 'operasi',
      'apotek-ranap', 'stok-obat',
      'pendaftaran', 'patient-flow', 'gizi', 'sdm', 'satu-sehat',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'bidan',
    nama: 'Bidan',
    icon: '🤱',
    warna: 'from-pink-500 to-rose-600',
    deskripsi: 'Otoritas layanan asuhan kebidanan (Poli KIA/Kandungan), observasi partograf, dan perawatan khusus nifas.',
    kategori: 'Medis',
    moduleAccess: [
      'rawat-inap', 'rawat-jalan', 'igd', 'rekam-medis', 'pendaftaran', 'patient-flow', 'satu-sehat',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'apoteker',
    nama: 'Apoteker & Farmasi',
    icon: '💊',
    warna: 'from-purple-500 to-pink-600',
    deskripsi: 'Manajemen peresepan elektronik (e-prescription), dispensing obat, stok multi-depo, dan logistik obat.',
    kategori: 'Penunjang',
    moduleAccess: [
      'apotek-ralan', 'apotek-ranap', 'stok-obat', 'inventory', 'satu-sehat',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'kasir',
    nama: 'Kasir & Keuangan',
    icon: '💰',
    warna: 'from-amber-500 to-orange-600',
    deskripsi: 'Sentralisasi sistem tagihan (billing), pembayaran non-tunai, kwitansi, dan klaim asuransi/BPJS (INA-CBGs).',
    kategori: 'Administrasi',
    moduleAccess: [
      'kasir', 'bpjs-klaim', 'vclaim', 'vedika', 'veronisa', 'laporan', 'api',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'pendaftaran',
    nama: 'Petugas Pendaftaran',
    icon: '📋',
    warna: 'from-indigo-500 to-violet-600',
    deskripsi: 'Titik masuk registrasi pasien, penerbitan SEP V-Claim, validasi identitas dan penjadwalan antrian poli.',
    kategori: 'Administrasi',
    moduleAccess: [
      'pendaftaran', 'anjungan', 'jkn-mobile', 'vclaim', 'veronisa', 'rekam-medis', 'patient-flow', 'triase', 'wa-gateway',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'rekam_medis',
    nama: 'Petugas RMIK',
    icon: '🗂️',
    warna: 'from-blue-600 to-indigo-700',
    deskripsi: 'Pengelolaan berkas EMR (Rekam Medis Elektronik), koding ICD, audit RL Kemenkes, dan pengiriman SatuSehat.',
    kategori: 'Administrasi',
    moduleAccess: [
      'rekam-medis', 'pendaftaran', 'igd', 'rawat-jalan', 'rawat-inap', 'operasi',
      'laboratorium', 'radiologi', 'orthanc', 'bpjs-klaim', 'vclaim', 'vedika', 'bpjs-emr',
      'satu-sehat', 'sertisign', 'mutu', 'laporan', 'patient-flow', 'hfis', 'veronisa',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'laboran',
    nama: 'Analis Laboratorium',
    icon: '🔬',
    warna: 'from-red-500 to-rose-600',
    deskripsi: 'Pemeriksaan spesimen Lab (LIS), pemrosesan nilai kritis, quality control, dan bridging LOINC.',
    kategori: 'Penunjang',
    moduleAccess: [
      'laboratorium', 'satu-sehat', 'bridging-hub', 'rekam-medis',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'radiografer',
    nama: 'Radiografer',
    icon: '🩻',
    warna: 'from-sky-500 to-blue-600',
    deskripsi: 'Layanan diagnostic imaging radiologi, akuisisi citra ke PACS (Orthanc), dan bridging hasil ekspertise.',
    kategori: 'Penunjang',
    moduleAccess: [
      'radiologi', 'orthanc', 'satu-sehat', 'bridging-hub', 'rekam-medis',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'manajemen_mutu',
    nama: 'Komite Mutu (PMKP)',
    icon: '📊',
    warna: 'from-fuchsia-500 to-purple-600',
    deskripsi: 'Supervisi Indikator Mutu Nasional (INM), evaluasi RCA, insiden (IKP), dan standardisasi clinical pathway.',
    kategori: 'Manajemen',
    moduleAccess: [
      'mutu', 'laporan', 'patient-flow', 'audit', 'monitoring', 'rekam-medis',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'rehab_medik',
    nama: 'Fisioterapis & Rehab',
    icon: '🩺',
    warna: 'from-violet-500 to-purple-600',
    deskripsi: 'Pengkajian indeks Barthel (ADL), evaluasi sesi terapi fisik, dan pembuatan program home exercise pasien.',
    kategori: 'Penunjang',
    moduleAccess: [
      'rehab', 'rawat-jalan', 'rekam-medis',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'gizi',
    nama: 'Nutrisionis / Ahli Gizi',
    icon: '🥗',
    warna: 'from-teal-500 to-emerald-600',
    deskripsi: 'Skrining gizi komprehensif (MST), perhitungan preskripsi diet, serta monitoring asupan makronutrien.',
    kategori: 'Penunjang',
    moduleAccess: [
      'gizi', 'rawat-inap', 'rekam-medis',
      ...COMMON_MODULES
    ]
  },
  {
    id: 'it_support',
    nama: 'IT Support & Infra',
    icon: '💻',
    warna: 'from-cyan-600 to-blue-700',
    deskripsi: 'Otoritas manajemen server, pengelolaan API Gateway, keamanan cyber (WAF), dan disaster recovery (DRC).',
    kategori: 'Sistem',
    moduleAccess: [
      'security', 'audit', 'backup', 'monitoring', 'api', 'bridging-hub', 'pengaturan-klinik', 'wa-gateway', 'anjungan', 'hfis', 'cloudflare',
      ...COMMON_MODULES
    ]
  }
];

// Helper: ambil role by id
export const getRoleById = (roleId: string): Role | undefined => {
  return ROLES.find(r => r.id === roleId);
};

// Helper: dapatkan custom permission override dari localStorage jika ada
export const getCustomPermissions = (): Record<string, string[]> => {
  try {
    const saved = localStorage.getItem('simrs_role_custom_permissions');
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.warn('Error reading custom role permissions:', e);
    return {};
  }
};

// Helper: simpan custom permission override ke localStorage
export const saveCustomPermissions = (permissions: Record<string, string[]>) => {
  try {
    localStorage.setItem('simrs_role_custom_permissions', JSON.stringify(permissions));
  } catch (e) {
    console.warn('Error saving custom role permissions:', e);
  }
};

// Helper: cek apakah role memiliki akses ke modul tertentu
export const hasModuleAccess = (roleId: string, moduleId: string): boolean => {
  if (roleId === 'super_admin') return true;
  if (COMMON_MODULES.includes(moduleId)) return true;

  const custom = getCustomPermissions();
  if (custom[roleId] && Array.isArray(custom[roleId])) {
    const list = custom[roleId];
    if (list.includes(moduleId)) return true;
    for (const [canonical, aliases] of Object.entries(MODULE_ALIASES)) {
      if (canonical === moduleId && aliases.some(a => list.includes(a))) return true;
      if (aliases.includes(moduleId) && (list.includes(canonical) || aliases.some(a => list.includes(a)))) return true;
    }
  }

  const role = getRoleById(roleId);
  if (!role) return false;
  if (role.moduleAccess.includes(moduleId)) return true;

  for (const [canonical, aliases] of Object.entries(MODULE_ALIASES)) {
    if (canonical === moduleId && aliases.some(a => role.moduleAccess.includes(a))) return true;
    if (aliases.includes(moduleId) && (role.moduleAccess.includes(canonical) || aliases.some(a => role.moduleAccess.includes(a)))) return true;
  }

  return false;
};

