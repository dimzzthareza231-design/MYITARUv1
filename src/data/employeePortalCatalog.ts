export type DivisionCategory =
  | 'Pimpinan & Komite'
  | 'Pelayanan Klinis'
  | 'Penunjang Medik'
  | 'Penunjang Non-Medik & Sarana'
  | 'Administrasi, Keuangan & TI';

export interface DivisionDefinition {
  id: string;
  name: string;
  category: DivisionCategory;
  sampleRoles: string[];
  isClinical: boolean;
  isAdminCapable: boolean;
  simrsModuleId?: string;
  specificModules: string[];
  jobdeskSummary: string;
  defaultStaffName: string;
  defaultNip: string;
  defaultShift: string;
  abacSensitivity: 'Tinggi (Klinis / EMR)' | 'Tinggi (Tata Kelola & Keamanan)' | 'Menengah (Operasional Unit)' | 'Standar (Administrasi)';
}

export interface CoreModuleDefinition {
  id:
    | 'profil'
    | 'shift'
    | 'absensi'
    | 'cuti'
    | 'payroll'
    | 'pelatihan'
    | 'kinerja'
    | 'komunikasi'
    | 'helpdesk';
  label: string;
  shortDesc: string;
}

export const CORE_EMPLOYEE_MODULES: CoreModuleDefinition[] = [
  { id: 'profil', label: 'Profil 360° & Lisensi', shortDesc: 'Data kepegawaian HRIS, STR/SIP & alert kedaluwarsa' },
  { id: 'shift', label: 'Jadwal & Tukar Shift', shortDesc: 'Kalender 3 shift, batas 40 jam/minggu & deteksi konflik' },
  { id: 'absensi', label: 'Absensi & Geofencing', shortDesc: 'Presensi GPS, biometrik, mode offline & lembur' },
  { id: 'cuti', label: 'Cuti, Izin & Approval', shortDesc: 'Saldo real-time, pengajuan & persetujuan berjenjang' },
  { id: 'payroll', label: 'Payroll & Kompensasi', shortDesc: 'Slip gaji digital, remunerasi & klaim reimbursement' },
  { id: 'pelatihan', label: 'Pengetahuan & Diklat', shortDesc: 'Pustaka SOP, katalog diklat & pelacakan sertifikat' },
  { id: 'kinerja', label: 'Kinerja KPI & OPPE', shortDesc: 'Indeks kinerja individu & evaluasi klinis OPPE' },
  { id: 'komunikasi', label: 'Komunikasi & SBAR', shortDesc: 'Pengumuman resmi, direktori & handover shift SBAR' },
  { id: 'helpdesk', label: 'Helpdesk TI & HR', shortDesc: 'Tiket dukungan ITIL 4, FAQ & kontak darurat RS' }
];

export const HOSPITAL_DIVISIONS: DivisionDefinition[] = [
  {
    id: 'direktur',
    name: 'Direktur',
    category: 'Pimpinan & Komite',
    sampleRoles: ['Direktur Utama', 'Sekretariat Direktur'],
    isClinical: false,
    isAdminCapable: true,
    simrsModuleId: 'laporan',
    specificModules: ['Dasbor Eksekutif RS', 'Approval Strategis', 'Laporan Mutu & Kinerja', 'Ringkasan Audit SPI'],
    jobdeskSummary: 'Pengambilan keputusan strategis, pengawasan indikator mutu nasional (INM), dan persetujuan program kerja tahunan.',
    defaultStaffName: 'dr. H. Hendra Wijaya, MARS',
    defaultNip: 'NIP-19750101-001',
    defaultShift: 'Manajerial (08:00 - 16:00 WIB)',
    abacSensitivity: 'Tinggi (Tata Kelola & Keamanan)'
  },
  {
    id: 'wadir',
    name: 'Wakil Direktur',
    category: 'Pimpinan & Komite',
    sampleRoles: ['Wadir Pelayanan Medik', 'Wadir Penunjang', 'Wadir Administrasi & SDM'],
    isClinical: false,
    isAdminCapable: true,
    simrsModuleId: 'monitoring',
    specificModules: ['Dasbor KPI Lintas Bidang', 'Approval Berjenjang', 'Laporan Beban Kerja Unit'],
    jobdeskSummary: 'Koordinasi kinerja antarbidang pelayanan, penunjang, dan sumber daya manusia serta eskalasi approval berjenjang.',
    defaultStaffName: 'Dr. Ratna Sari Dewi, M.Kes',
    defaultNip: 'NIP-19780412-002',
    defaultShift: 'Manajerial (08:00 - 16:00 WIB)',
    abacSensitivity: 'Tinggi (Tata Kelola & Keamanan)'
  },
  {
    id: 'yanmed',
    name: 'Bidang Pelayanan Medik',
    category: 'Pimpinan & Komite',
    sampleRoles: ['Kepala Bidang Yanmed', 'Staf Administrasi Medik'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'patient-flow',
    specificModules: ['Monitoring Jadwal Dokter', 'Laporan Pelayanan Klinis', 'Approval Klinis & Kredensial'],
    jobdeskSummary: 'Pengawasan kepatuhan praktik dokter spesialis, evaluasi alur pelayanan klinis, dan kredensialing KSM.',
    defaultStaffName: 'dr. Aditya Pratama, MMR',
    defaultNip: 'NIP-19810615-010',
    defaultShift: 'Reguler Pagi (07:30 - 15:30 WIB)',
    abacSensitivity: 'Tinggi (Klinis / EMR)'
  },
  {
    id: 'keperawatan',
    name: 'Bidang Keperawatan',
    category: 'Pelayanan Klinis',
    sampleRoles: ['Kepala Bidang Keperawatan', 'Kepala Ruang (Karu)', 'Perawat Klinis'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'rawat-inap',
    specificModules: ['Worklist Tugas Keperawatan', 'Handover SBAR Terverifikasi', 'Jadwal Shift Unit', 'Supervisi Asesmen'],
    jobdeskSummary: 'Koordinasi asuhan keperawatan 24 jam, supervisi handover Nurse Station & Bedside pasien, serta penjadwalan 3 shift.',
    defaultStaffName: 'Ns. Siti Fatimah, M.Kep',
    defaultNip: 'NIP-19840920-015',
    defaultShift: 'Shift Pagi (07:00 - 14:00 WIB)',
    abacSensitivity: 'Tinggi (Klinis / EMR)'
  },
  {
    id: 'penunjang-medik',
    name: 'Bidang Penunjang Medik',
    category: 'Penunjang Medik',
    sampleRoles: ['Kepala Bidang Penunjang', 'Staf Penunjang Medik'],
    isClinical: false,
    isAdminCapable: false,
    simrsModuleId: 'laboratorium',
    specificModules: ['Monitoring Order Lab/Rad/Farmasi', 'Laporan Turnaround Time (TAT)', 'Kalibrasi Alat Penunjang'],
    jobdeskSummary: 'Pemantauan waktu tunggu layanan laboratorium, radiologi, farmasi, dan gizi agar sesuai standar SPM.',
    defaultStaffName: 'apt. Bambang Suryono, M.Farm',
    defaultNip: 'NIP-19820311-021',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Menengah (Operasional Unit)'
  },
  {
    id: 'penunjang-non-medik',
    name: 'Bidang Penunjang Non-Medik',
    category: 'Penunjang Non-Medik & Sarana',
    sampleRoles: ['Kepala Bidang Non-Medik', 'Teknisi', 'Kesling', 'Laundry', 'CSSD'],
    isClinical: false,
    isAdminCapable: false,
    simrsModuleId: 'cssd',
    specificModules: ['Work Order Sarana', 'Checklist Kebersihan & Sterilisasi', 'Inventaris Aset', 'Laporan Insiden K3'],
    jobdeskSummary: 'Pengelolaan sterilisasi, linen, sanitasi lingkungan, pemeliharaan utilitas RS, serta keselamatan fasilitas.',
    defaultStaffName: 'Ir. Gunawan Saputra, M.T.',
    defaultNip: 'NIP-19800707-025',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Menengah (Operasional Unit)'
  },
  {
    id: 'keuangan',
    name: 'Bagian Keuangan',
    category: 'Administrasi, Keuangan & TI',
    sampleRoles: ['Kepala Bagian Keuangan', 'Staf Keuangan', 'Kasir'],
    isClinical: false,
    isAdminCapable: false,
    simrsModuleId: 'kasir',
    specificModules: ['Rekonsiliasi Billing & Kas', 'Approval Klaim BPJS / Asuransi', 'Verifikasi Reimbursement', 'Laporan Keuangan'],
    jobdeskSummary: 'Transaksi pasien, pengelolaan kas, tagihan rawat inap/jalan, pengawasan payroll, dan pelaporan keuangan RS.',
    defaultStaffName: 'Rina Melati, S.E., Ak.',
    defaultNip: 'NIP-19870214-030',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Menengah (Operasional Unit)'
  },
  {
    id: 'sdm-umum',
    name: 'Bagian SDM & Umum',
    category: 'Administrasi, Keuangan & TI',
    sampleRoles: ['Kepala Bagian SDM', 'Staf HRIS', 'Staf Umum'],
    isClinical: false,
    isAdminCapable: true,
    simrsModuleId: 'sdm',
    specificModules: ['Manajemen Pegawai HRIS', 'Kontrak & Masa Berlaku STR/SIP', 'Approval Cuti & Rekap Absensi', 'Rekrutmen & Surat'],
    jobdeskSummary: 'Administrasi kepegawaian menyeluruh, rekrutmen, perpanjangan kontrak, pengawasan absensi, cuti, dan ketatausahaan.',
    defaultStaffName: 'Dian Puspita, S.Psi., M.M.',
    defaultNip: 'NIP-19861102-035',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Tinggi (Tata Kelola & Keamanan)'
  },
  {
    id: 'perencanaan',
    name: 'Bagian Perencanaan',
    category: 'Administrasi, Keuangan & TI',
    sampleRoles: ['Kepala Bagian Perencanaan', 'Analis Program & Anggaran'],
    isClinical: false,
    isAdminCapable: false,
    simrsModuleId: 'laporan',
    specificModules: ['Dasbor Program Kerja', 'Laporan Kinerja Unit', 'Usulan Anggaran & RBA'],
    jobdeskSummary: 'Penyusunan rencana strategis RS, evaluasi serapan anggaran unit, dan monitoring capaian KPI tahunan.',
    defaultStaffName: 'Haryo Wibowo, S.E., M.P.P.',
    defaultNip: 'NIP-19850819-040',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Standar (Administrasi)'
  },
  {
    id: 'igd',
    name: 'Instalasi Gawat Darurat (IGD)',
    category: 'Pelayanan Klinis',
    sampleRoles: ['Dokter Jaga IGD', 'Perawat IGD', 'Bidan VK', 'PRS', 'Driver Ambulans'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'igd',
    specificModules: ['Worklist Triase Pasien', 'Handover SBAR IGD', 'Log Respon Ambulans', 'Akses Cepat EMR IGD'],
    jobdeskSummary: 'Anamnesis cepat, triase gawat darurat ATS/ESI, resusitasi, persiapan alat darurat, dan mobilisasi ambulans 24 jam.',
    defaultStaffName: 'dr. Bima Sakti, Sp.EM',
    defaultNip: 'NIP-19880512-101',
    defaultShift: 'Shift Siang (14:00 - 21:00 WIB)',
    abacSensitivity: 'Tinggi (Klinis / EMR)'
  },
  {
    id: 'rawat-jalan',
    name: 'Instalasi Rawat Jalan',
    category: 'Pelayanan Klinis',
    sampleRoles: ['Dokter Poli', 'Perawat Poli', 'Admin Pendaftaran'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'rawat-jalan',
    specificModules: ['Daftar Antrean Poli', 'Jadwal Praktik Poli', 'E-Resep Terpadu', 'Registrasi Pasien'],
    jobdeskSummary: 'Pemeriksaan rawat jalan, penegakan diagnosis ICD-10, peresepan elektronik, order penunjang, dan edukasi rehabilitasi.',
    defaultStaffName: 'dr. Budi Santoso, Sp.PD',
    defaultNip: 'NIP-19830125-105',
    defaultShift: 'Shift Pagi (07:30 - 14:30 WIB)',
    abacSensitivity: 'Tinggi (Klinis / EMR)'
  },
  {
    id: 'rawat-inap',
    name: 'Instalasi Rawat Inap',
    category: 'Pelayanan Klinis',
    sampleRoles: ['Dokter DPJP', 'Perawat Bangsal', 'Admin Ruangan'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'rawat-inap',
    specificModules: ['Daftar Pasien Bangsal', 'Jadwal Visite DPJP', 'Handover SBAR Bangsal', 'Worklist Asuhan Keperawatan'],
    jobdeskSummary: 'Pengkajian keperawatan harian, pemberian obat terjadwal, pemantauan TTV, kolaborasi visite DPJP, dan dokumentasi CPPT.',
    defaultStaffName: 'Ns. Dewi Anggraini, S.Kep',
    defaultNip: 'NIP-19900308-110',
    defaultShift: 'Shift Malam (21:00 - 07:00 WIB)',
    abacSensitivity: 'Tinggi (Klinis / EMR)'
  },
  {
    id: 'icu',
    name: 'Instalasi Perawatan Intensif (ICU/ICCU/NICU)',
    category: 'Pelayanan Klinis',
    sampleRoles: ['Dokter Intensivis (KIC)', 'Perawat ICU/NICU/PICU'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'icu',
    specificModules: ['Worklist Pasien Kritis', 'Monitoring TTV & Ventilator', 'Handover Kritis SBAR', 'Akses EMR Intensif'],
    jobdeskSummary: 'Pemantauan hemodinamik ketat, manajemen ventilator, kalkulasi skor SOFA, dan serah terima pasien kritis.',
    defaultStaffName: 'dr. Kevin Wijaya, Sp.An-KIC',
    defaultNip: 'NIP-19851203-115',
    defaultShift: 'Shift Pagi (07:00 - 14:00 WIB)',
    abacSensitivity: 'Tinggi (Klinis / EMR)'
  },
  {
    id: 'ibs',
    name: 'Instalasi Bedah Sentral (IBS)',
    category: 'Pelayanan Klinis',
    sampleRoles: ['Dokter Bedah', 'Perawat Kamar Operasi', 'Dokter/Penata Anestesi'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'operasi',
    specificModules: ['Jadwal Kamar Operasi', 'Checklist Keselamatan Bedah WHO', 'Worklist Pra & Pasca Bedah'],
    jobdeskSummary: 'Penjadwalan operasi elektif & cito, verifikasi WHO Surgical Safety Checklist (Sign In, Time Out, Sign Out), dan pemulihan PACU.',
    defaultStaffName: 'dr. Bambang Alamsyah, Sp.B',
    defaultNip: 'NIP-19810918-120',
    defaultShift: 'Shift Pagi (07:00 - 14:00 WIB)',
    abacSensitivity: 'Tinggi (Klinis / EMR)'
  },
  {
    id: 'farmasi',
    name: 'Instalasi Farmasi',
    category: 'Penunjang Medik',
    sampleRoles: ['Apoteker Klinis', 'Asisten Apoteker', 'Staf Gudang Obat'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'apotek-ralan',
    specificModules: ['Antrean Resep Elektronik', 'Verifikasi Telaah Resep', 'Dispensing & Stok Obat', 'Laporan Farmasi'],
    jobdeskSummary: 'Menerima dan menelaah e-resep, memeriksa interaksi obat, verifikasi stok multi-depo, dispensing, dan kepatuhan Fornas.',
    defaultStaffName: 'apt. Dewi Lestari, S.Farm',
    defaultNip: 'NIP-19890722-201',
    defaultShift: 'Shift Pagi (07:30 - 14:30 WIB)',
    abacSensitivity: 'Tinggi (Klinis / EMR)'
  },
  {
    id: 'laboratorium',
    name: 'Instalasi Laboratorium',
    category: 'Penunjang Medik',
    sampleRoles: ['Analis Lab (ATLM)', 'Dokter Spesialis Patologi Klinik'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'laboratorium',
    specificModules: ['Worklist Order Lab', 'Input & Validasi Hasil Kritis', 'Quality Control (QC) Harian'],
    jobdeskSummary: 'Pengambilan & pemrosesan sampel patologi klinik, kalibrasi QC harian, validasi hasil LOINC, dan rilis nilai kritis ke EMR.',
    defaultStaffName: 'Ahmad Fauzi, A.Md.AK',
    defaultNip: 'NIP-19910411-205',
    defaultShift: 'Shift Pagi (07:00 - 14:00 WIB)',
    abacSensitivity: 'Tinggi (Klinis / EMR)'
  },
  {
    id: 'radiologi',
    name: 'Instalasi Radiologi',
    category: 'Penunjang Medik',
    sampleRoles: ['Radiografer', 'Dokter Spesialis Radiologi'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'radiologi',
    specificModules: ['Worklist Order Pencitraan', 'Ekspertise & Validasi PACS', 'Jadwal CT-Scan / MRI'],
    jobdeskSummary: 'Pemeriksaan radiografi, CT-Scan, MRI, akuisisi citra ke PACS Orthanc, pelaporan ekspertise, dan rilis ke EMR.',
    defaultStaffName: 'Bayu Pratama, A.Md.Rad',
    defaultNip: 'NIP-19920809-210',
    defaultShift: 'Shift Siang (14:00 - 21:00 WIB)',
    abacSensitivity: 'Tinggi (Klinis / EMR)'
  },
  {
    id: 'gizi',
    name: 'Instalasi Gizi',
    category: 'Penunjang Medik',
    sampleRoles: ['Ahli Gizi (Dietisien)', 'Staf Dapur Gizi'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'gizi',
    specificModules: ['Order Diet Pasien Ranap', 'Siklus Menu Terstandar', 'Laporan Pemantauan Asupan'],
    jobdeskSummary: 'Skrining malnutrisi (MST), penentuan preskripsi diet pasien rawat inap, produksi makanan higienis, dan audit sisa asupan.',
    defaultStaffName: 'Citra Kirana, S.Gz, RD',
    defaultNip: 'NIP-19930117-215',
    defaultShift: 'Shift Pagi (06:00 - 13:00 WIB)',
    abacSensitivity: 'Menengah (Operasional Unit)'
  },
  {
    id: 'rekam-medis',
    name: 'Instalasi Rekam Medis',
    category: 'Penunjang Medik',
    sampleRoles: ['Koder INA-CBGs', 'Petugas Assembling & Filing', 'Analis RM'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'rekam-medis',
    specificModules: ['Coding ICD-10 & ICD-9CM', 'Cek Kelengkapan Berkas EMR', 'Statistik RL Kemenkes', 'Audit Akses RM'],
    jobdeskSummary: 'Assembling berkas, koding diagnosis & prosedur, verifikasi kelengkapan resume medis, pelaporan RL, dan penjagaan kerahasiaan RM.',
    defaultStaffName: 'Sari Indah, A.Md.RMIK',
    defaultNip: 'NIP-19881030-220',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Tinggi (Klinis / EMR)'
  },
  {
    id: 'cssd',
    name: 'Instalasi CSSD',
    category: 'Penunjang Non-Medik & Sarana',
    sampleRoles: ['Petugas Sterilisasi CSSD'],
    isClinical: false,
    isAdminCapable: false,
    simrsModuleId: 'cssd',
    specificModules: ['Work Order Sterilisasi', 'Checklist Instrumen Bedah', 'Log Autoclave & Distribusi'],
    jobdeskSummary: 'Dekontaminasi, pengemasan, uji indikator biologi autoclave, dan distribusi set instrumen steril ke OK serta ruangan.',
    defaultStaffName: 'Rudi Hartono, A.Md',
    defaultNip: 'NIP-19900614-301',
    defaultShift: 'Shift Pagi (07:00 - 14:00 WIB)',
    abacSensitivity: 'Menengah (Operasional Unit)'
  },
  {
    id: 'laundry',
    name: 'Instalasi Laundry',
    category: 'Penunjang Non-Medik & Sarana',
    sampleRoles: ['Petugas Pengelolaan Linen'],
    isClinical: false,
    isAdminCapable: false,
    specificModules: ['Work Order Linen Infeksius/Non-Infeksius', 'Checklist Kebersihan Ruangan', 'Inventaris Stok Linen'],
    jobdeskSummary: 'Pemilahan linen kotor infeksius dan non-infeksius, pencucian standar PPI, penyetrikaan, serta distribusi stok bersih ke bangsal.',
    defaultStaffName: 'Sulastri, A.Md',
    defaultNip: 'NIP-19891201-305',
    defaultShift: 'Shift Pagi (07:00 - 14:00 WIB)',
    abacSensitivity: 'Standar (Administrasi)'
  },
  {
    id: 'ipsrs',
    name: 'Instalasi Pemeliharaan Sarana (IPSRS)',
    category: 'Penunjang Non-Medik & Sarana',
    sampleRoles: ['Teknisi Listrik & Genset', 'Teknisi Gas Medik', 'Teknisi Elektromedis & AC'],
    isClinical: false,
    isAdminCapable: false,
    specificModules: ['Work Order Pemeliharaan', 'Laporan Kerusakan Alat/Sarana', 'Inventaris & Kalibrasi Aset'],
    jobdeskSummary: 'Preventive maintenance listrik, sentral gas medik, HVAC/HEPA ruang operasi, serta perbaikan cepat peralatan fasilitas.',
    defaultStaffName: 'Wahyu Hidayat, S.T.',
    defaultNip: 'NIP-19870425-310',
    defaultShift: 'Shift Pagi (07:30 - 14:30 WIB)',
    abacSensitivity: 'Menengah (Operasional Unit)'
  },
  {
    id: 'kesling',
    name: 'Kesehatan Lingkungan & Sanitasi',
    category: 'Penunjang Non-Medik & Sarana',
    sampleRoles: ['Sanitarian / Petugas Kesling'],
    isClinical: false,
    isAdminCapable: false,
    specificModules: ['Checklist Sanitasi & IPAL', 'Manifest Pengelolaan Limbah B3 Medis', 'Laporan Insiden Lingkungan'],
    jobdeskSummary: 'Pemantauan kualitas air bersih/IPAL, pengawasan TPS limbah B3 medis, pengendalian vektor, dan uji swab udara ruang kritis.',
    defaultStaffName: 'Nadia Kartika, S.KM',
    defaultNip: 'NIP-19910903-315',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Menengah (Operasional Unit)'
  },
  {
    id: 'security',
    name: 'Keamanan (Security)',
    category: 'Penunjang Non-Medik & Sarana',
    sampleRoles: ['Kepala Regu Security', 'Petugas Keamanan RS'],
    isClinical: false,
    isAdminCapable: false,
    specificModules: ['Jadwal Patroli Titik Rawan', 'Log Kejadian & Pengunjung', 'Laporan Insiden Keamanan'],
    jobdeskSummary: 'Pengamanan area IGD, akses ruangan terbatas, patroli keliling terjadwal, serta manajemen kedaruratan keamanan kode internal.',
    defaultStaffName: 'Agus Setiawan (Danru)',
    defaultNip: 'NIP-19860228-320',
    defaultShift: 'Shift Malam (21:00 - 07:00 WIB)',
    abacSensitivity: 'Menengah (Operasional Unit)'
  },
  {
    id: 'driver-ambulans',
    name: 'Driver Ambulans',
    category: 'Penunjang Non-Medik & Sarana',
    sampleRoles: ['Pengemudi Ambulans Gawat Darurat', 'Petugas Evakuasi'],
    isClinical: false,
    isAdminCapable: false,
    simrsModuleId: 'igd',
    specificModules: ['Log Perjalanan Rujukan/Penjemputan', 'Checklist Kesiapan Kendaraan & O2', 'Jadwal Siaga 24 Jam'],
    jobdeskSummary: 'Pengecekan harian mesin, sirine, dan tabung oksigen ambulans serta eksekusi penjemputan/rujukan pasien darurat.',
    defaultStaffName: 'Dedi Kurniawan',
    defaultNip: 'NIP-19890505-325',
    defaultShift: 'Shift Siang (14:00 - 21:00 WIB)',
    abacSensitivity: 'Menengah (Operasional Unit)'
  },
  {
    id: 'ksm',
    name: 'Kelompok Staf Medis (KSM)',
    category: 'Pelayanan Klinis',
    sampleRoles: ['Dokter Spesialis / Subspesialis per KSM'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'rawat-inap',
    specificModules: ['Daftar Pasien KSM', 'Jadwal Visite & Konsul', 'E-Resep & Akses EMR', 'Laporan Klinis & OPPE'],
    jobdeskSummary: 'Pelayanan medis spesialistik rawat jalan dan rawat inap, konsul antar-KSM, pemenuhan PPK, serta evaluasi kinerja klinis OPPE.',
    defaultStaffName: 'dr. Hendra Wijaya, Sp.JP',
    defaultNip: 'NIP-19791112-401',
    defaultShift: 'Praktik Spesialis (08:00 - 15:00 WIB)',
    abacSensitivity: 'Tinggi (Klinis / EMR)'
  },
  {
    id: 'komite',
    name: 'Komite Medik / Keperawatan / PPI / PMKP / K3 / Etik',
    category: 'Pimpinan & Komite',
    sampleRoles: ['Ketua / Sekretaris / Anggota Komite Mutu & Keselamatan'],
    isClinical: true,
    isAdminCapable: false,
    simrsModuleId: 'mutu',
    specificModules: ['Dasbor Indikator Mutu (INM)', 'Laporan Insiden Keselamatan (IKP)', 'Audit Kepatuhan PPI/K3', 'Notulen Rapat Komite'],
    jobdeskSummary: 'Penyusunan standar mutu, investigasi RCA insiden keselamatan pasien, audit kepatuhan cuci tangan PPI, dan kredensialing etik.',
    defaultStaffName: 'drg. Maya Sari, MARS',
    defaultNip: 'NIP-19830716-405',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Tinggi (Tata Kelola & Keamanan)'
  },
  {
    id: 'spi',
    name: 'Satuan Pengawas Internal (SPI)',
    category: 'Pimpinan & Komite',
    sampleRoles: ['Auditor Internal RS'],
    isClinical: false,
    isAdminCapable: true,
    simrsModuleId: 'audit',
    specificModules: ['Rencana Audit Tahunan', 'Catatan Temuan Audit', 'Tindak Lanjut Korektif', 'Register Risiko COBIT'],
    jobdeskSummary: 'Audit kepatuhan operasional, keuangan, dan tata kelola TI (COBIT 2019), serta pelacakan penyelesaian tindak lanjut.',
    defaultStaffName: 'Fajar Nugroho, S.E., CIA',
    defaultNip: 'NIP-19821010-410',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Tinggi (Tata Kelola & Keamanan)'
  },
  {
    id: 'simrs-ti',
    name: 'Unit SIMK / TI',
    category: 'Administrasi, Keuangan & TI',
    sampleRoles: ['Kepala Unit TI', 'Analis Sistem', 'Programmer', 'Teknisi Hardware'],
    isClinical: false,
    isAdminCapable: true,
    simrsModuleId: 'monitoring',
    specificModules: ['Manajemen User & RBAC/ABAC', 'Feature Flags Modul', 'Monitor Integrasi FHIR/BPJS/HRIS', 'Antrean Tiket IT & Audit SIEM'],
    jobdeskSummary: 'Pengelolaan API Gateway, integrasi SATUSEHAT/BPJS/HRIS, keamanan ISO 27001, tata kelola ITIL 4 helpdesk, dan pengendalian akses.',
    defaultStaffName: 'Bagas Setiawan, S.Kom., M.TI',
    defaultNip: 'NIP-19900105-501',
    defaultShift: 'On-Call 24/7 & Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Tinggi (Tata Kelola & Keamanan)'
  },
  {
    id: 'humas',
    name: 'Humas & Pemasaran',
    category: 'Administrasi, Keuangan & TI',
    sampleRoles: ['Staf Humas RS', 'Admin Media Sosial & Portal'],
    isClinical: false,
    isAdminCapable: false,
    simrsModuleId: 'crm',
    specificModules: ['Pengumuman Resmi Internal', 'Manajemen Konten Portal', 'Laporan Trafik Web & App Pasien'],
    jobdeskSummary: 'Publikasi pengumuman layanan, edukasi Healthpedia, komunikasi publik, serta pemantauan engagement portal pasien & karyawan.',
    defaultStaffName: 'Clara Oktaviani, S.I.Kom',
    defaultNip: 'NIP-19940321-505',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Standar (Administrasi)'
  },
  {
    id: 'diklat',
    name: 'Pendidikan & Pelatihan (Diklat)',
    category: 'Administrasi, Keuangan & TI',
    sampleRoles: ['Koordinator Diklat', 'Staf Akreditasi SDM'],
    isClinical: false,
    isAdminCapable: false,
    specificModules: ['Katalog Pelatihan & BLS/ACLS', 'Verifikasi Sertifikat Karyawan', 'Jadwal Orientasi & Laporan Diklat'],
    jobdeskSummary: 'Penyelenggaraan pelatihan wajib (BHD, K3, PPI), pelacakan SKP & sertifikat pegawai, serta fasilitasi orientasi staf baru.',
    defaultStaffName: 'Taufik Hidayat, S.Pd., M.M.',
    defaultNip: 'NIP-19860711-510',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Standar (Administrasi)'
  },
  {
    id: 'hukum-etik',
    name: 'Hukum & Etik',
    category: 'Pimpinan & Komite',
    sampleRoles: ['Staf Hukum & Kepatuhan (DPO)', 'Sekretariat Etik'],
    isClinical: false,
    isAdminCapable: true,
    specificModules: ['Repositori Kebijakan UU PDP & PMK 24', 'Tiket Konsultasi Hukum Klinis', 'Laporan Etik & Persetujuan'],
    jobdeskSummary: 'Pengawalan kepatuhan UU PDP & PMK 24/2022 selaku fungsi DPO, penelaahan perjanjian kerja sama, dan konsultasi medikolegal.',
    defaultStaffName: 'Siti Rahma, S.H., M.H.Kes',
    defaultNip: 'NIP-19850218-515',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Tinggi (Tata Kelola & Keamanan)'
  },
  {
    id: 'pengadaan',
    name: 'Pengadaan & Logistik',
    category: 'Penunjang Non-Medik & Sarana',
    sampleRoles: ['Staf Pengadaan', 'Petugas Gudang Logistik'],
    isClinical: false,
    isAdminCapable: false,
    simrsModuleId: 'inventory',
    specificModules: ['Permintaan Barang Unit', 'Approval Pengadaan (PR/PO)', 'Monitoring Stok & Gudang'],
    jobdeskSummary: 'Evaluasi permintaan barang medis dan non-medis, pengadaan transparan, penerimaan barang, dan distribusi stok antar gudang.',
    defaultStaffName: 'Eko Prasetyo, S.E.',
    defaultNip: 'NIP-19881124-520',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Menengah (Operasional Unit)'
  },
  {
    id: 'administrasi-umum',
    name: 'Administrasi Umum / Rumah Tangga',
    category: 'Administrasi, Keuangan & TI',
    sampleRoles: ['Staf Tata Usaha', 'Resepsionis & Tamu'],
    isClinical: false,
    isAdminCapable: false,
    specificModules: ['Disposisi Surat-Menyurat', 'Reservasi Ruang Rapat', 'Permintaan ATK & Log Buku Tamu'],
    jobdeskSummary: 'Pengelolaan persuratan resmi, penjadwalan ruang pertemuan, inventaris alat tulis kantor, dan resepsionis tamu instansi.',
    defaultStaffName: 'Wulan Dari, A.Md',
    defaultNip: 'NIP-19930814-525',
    defaultShift: 'Reguler Pagi (08:00 - 16:00 WIB)',
    abacSensitivity: 'Standar (Administrasi)'
  }
];

export const GOVERNANCE_FRAMEWORKS = [
  { code: 'UU PDP', title: 'UU No. 27/2022 Perlindungan Data Pribadi', scope: 'Enkripsi PII, DPO oversight, pembatasan akses berbasis tujuan' },
  { code: 'PMK 24/2022', title: 'Permenkes 24 Tahun 2022 tentang RME', scope: 'Kerahasiaan EMR, audit akses immutable, interoperabilitas SATUSEHAT' },
  { code: 'ISO 27001/27799', title: 'Keamanan Informasi Kesehatan', scope: 'Kontrol RBAC+ABAC, TLS 1.3 / AES-256, manajemen insiden & sesi' },
  { code: 'ITIL 4 & COBIT 2019', title: 'Tata Kelola Layanan & Risiko TI', scope: 'APO12, APO13, DSS02, DSS05, change approval workflow & SLA helpdesk' }
];
