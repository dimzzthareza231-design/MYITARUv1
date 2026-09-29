// ============================================================================
// MYITARU SIMRS — BLUEPRINT EVALUASI & PENGEMBANGAN APLIKASI
// Berdasarkan Diagram Arsitektur Blueprint Resmi MYITARU
// Satu Sistem, Satu Data, Untuk Pelayanan Kesehatan yang Lebih Baik
// ============================================================================

export interface BlueprintPrinciple {
  number: number;
  title: string;
  description: string;
  status: 'IMPLEMENTED' | 'ENFORCED' | 'ACTIVE';
}

export interface PatientFlowStep {
  step: number;
  name: string;
  icon: string;
  color: string;
  items: string[];
  route: string;
}

export interface BlueprintModuleCard {
  id: string;
  name: string;
  icon: string;
  color: string;
  borderColor: string;
  items: string[];
  route: string;
}

export interface DatabaseEntity {
  name: string;
  color: string;
  fields: string[];
  description: string;
}

export interface GapAnalysisItem {
  area: string;
  targetStatus: string;
  prioritas: 'P0' | 'P1' | 'P2' | 'P3';
  badgeColor: string;
  catatan: string;
}

export interface RoadmapPhase {
  phase: number;
  name: string;
  color: string;
  badge: string;
  items: string[];
}

export interface DefinitionOfDoneItem {
  id: string;
  label: string;
  description: string;
  category: 'core' | 'quality' | 'integration';
  defaultChecked: boolean;
}

// 1. VISI & TUJUAN
export const BLUEPRINT_VISION = {
  title: 'Visi',
  quote: 'Menjadi sistem informasi pelayanan kesehatan terintegrasi yang menghubungkan identitas pasien, pendaftaran, kunjungan, pelayanan klinis, rekam medis elektronik, penunjang, farmasi, pembiayaan, integrasi eksternal, audit, dan AI dalam satu alur pelayanan.',
  tujuan: [
    'Meningkatkan efisiensi pelayanan dan pengalaman pasien',
    'Menjamin keamanan dan kerahasiaan data rekam medis',
    'Mendukung pengambilan keputusan klinis berbasis bukti (CDSS)',
    'Memenuhi standar regulasi nasional (BPJS V-Claim & Kemenkes SATUSEHAT)',
    'Memberikan pengalaman yang lebih baik dan ergonomis bagi tenaga kesehatan'
  ]
};

// 2. PRINSIP DASAR SISTEM (10 PRINSIP)
export const BLUEPRINT_PRINCIPLES: BlueprintPrinciple[] = [
  {
    number: 1,
    title: 'One Patient, One Identity',
    description: 'Satu pasien memiliki satu identitas unik (No. RM & NIK) di seluruh faskes, mencegah duplikasi rekam medis.',
    status: 'ENFORCED'
  },
  {
    number: 2,
    title: 'One Encounter, One Episode',
    description: 'Setiap kunjungan medis memiliki nomor episode/encounter unik yang mengikat semua catatan klinis & tindakan.',
    status: 'ENFORCED'
  },
  {
    number: 3,
    title: 'Single Source of Truth',
    description: 'Semua modul membaca dan memperbarui data dari sumber terpusat tanpa desinkronisasi.',
    status: 'ACTIVE'
  },
  {
    number: 4,
    title: 'Role-Based Access (RBAC)',
    description: 'Hak akses dipisahkan ketat berdasarkan peran profesi medis dan administratif (11 role resmi).',
    status: 'ENFORCED'
  },
  {
    number: 5,
    title: 'Audit Everything Important',
    description: 'Audit trail mencatat siapa, apa, kapan, di mana, serta kondisi sebelum/sesudah setiap perubahan data.',
    status: 'ENFORCED'
  },
  {
    number: 6,
    title: 'AI-Assisted, Human-Verified',
    description: 'AI hanya bertindak sebagai pendukung keputusan klinis; dokter/tenaga medis berwenang penuh memverifikasi.',
    status: 'ACTIVE'
  },
  {
    number: 7,
    title: 'Clinical Data ≠ Administrative Data',
    description: 'Pemisahan tegas antara ranah data rahasia medis (SOAP/Diagnosis) dan data operasional tagihan/administrasi.',
    status: 'ENFORCED'
  },
  {
    number: 8,
    title: 'Workflow First',
    description: 'Desain sistem mengalir secara alami mengikuti alur pelayanan riil di poliklinik, IGD, rawat inap, dan apotek.',
    status: 'ACTIVE'
  },
  {
    number: 9,
    title: 'Offline Resilient',
    description: 'Sistem tetap responsif melalui caching lokal dan antrian sinkronisasi saat konektivitas jaringan terputus.',
    status: 'ACTIVE'
  },
  {
    number: 10,
    title: 'Security by Design',
    description: 'Keamanan, enkripsi, dan aturan isolasi Firestore dirancang sejak fondasi kode tanpa akses publik terbuka.',
    status: 'ENFORCED'
  }
];

// 3. ARSITEKTUR SISTEM
export const BLUEPRINT_ARCHITECTURE = {
  users: [
    { role: 'Admin', icon: '👤' },
    { role: 'Pendaftaran', icon: '📝' },
    { role: 'Dokter', icon: '👨‍⚕️' },
    { role: 'Perawat', icon: '👩‍⚕️' },
    { role: 'Lab', icon: '🔬' },
    { role: 'Kasir', icon: '💳' },
    { role: 'Manajemen', icon: '🏢' }
  ],
  appTier: 'Aplikasi Web & Mobile (React 19 + TypeScript + Tailwind CSS)',
  serviceLayer: [
    { name: 'Auth & RBAC', desc: 'Autentikasi & Otorisasi Berjenjang' },
    { name: 'Patient Service', desc: 'Master Pasien & Validasi NIK' },
    { name: 'Clinical Service', desc: 'RME, SOAP, & Penunjang' },
    { name: 'Integration Service', desc: 'Bridging BPJS & SATUSEHAT' },
    { name: 'AI Service', desc: 'GenAI Scribe, CDSS, & Interaction' }
  ],
  dataLayer: [
    { name: 'Firestore (Cloud)', desc: 'Penyimpanan Dokumen Cloud Real-time', icon: '☁️' },
    { name: 'Cloud Storage', desc: 'File Dokumen Medis & DICOM Imaging', icon: '🗄️' },
    { name: 'Local Cache (IndexedDB)', desc: 'Offline Resilience & Fast Query', icon: '⚡' }
  ],
  integrations: [
    { name: 'BPJS Kesehatan', desc: 'V-Claim, SEP, Rujukan, Antrean RS', icon: '💚' },
    { name: 'Kemenkes SATUSEHAT', desc: 'FHIR R4 API, Interoperabilitas Nasional', icon: '🇮🇩' }
  ]
};

// 4. ALUR PELAYANAN PASIEN (END-TO-END)
export const BLUEPRINT_PATIENT_FLOW: PatientFlowStep[] = [
  {
    step: 1,
    name: '1. Pendaftaran',
    icon: '📝',
    color: 'from-blue-600 to-cyan-600',
    items: ['Pasien Baru / Lama', 'Verifikasi NIK (Dukcapil)', 'No. RM Otomatis', 'Registrasi Kunjungan'],
    route: '/modul/pendaftaran'
  },
  {
    step: 2,
    name: '2. Encounter',
    icon: '📋',
    color: 'from-teal-600 to-emerald-600',
    items: ['Jenis Pelayanan', 'Poli & Dokter Tujuan', 'Jadwal & Kuota', 'Penjamin & Rujukan'],
    route: '/modul/pendaftaran?tab=2.+Registrasi+Kunjungan'
  },
  {
    step: 3,
    name: '3. Pelayanan Klinis',
    icon: '🩺',
    color: 'from-emerald-600 to-green-600',
    items: ['Antrean & Pemanggilan', 'Triase (IGD/Poli)', 'Pemeriksaan Fisik', 'SOAP & ICD Coding'],
    route: '/modul/rawat-jalan'
  },
  {
    step: 4,
    name: '4. Penunjang',
    icon: '🔬',
    color: 'from-purple-600 to-indigo-600',
    items: ['Order Laboratorium (LIS)', 'Radiologi & PACS DICOM', 'Prosedur Medis', 'Validasi Hasil Sp.PK/Rad'],
    route: '/modul/laboratorium'
  },
  {
    step: 5,
    name: '5. Farmasi',
    icon: '💊',
    color: 'from-rose-600 to-pink-600',
    items: ['E-Prescribing (Resep)', 'Screening Interaksi Obat', 'Dispensing & Etiket', 'Stock Auto-Deduction'],
    route: '/modul/apotek-ralan'
  },
  {
    step: 6,
    name: '6. Billing',
    icon: '💳',
    color: 'from-amber-600 to-orange-600',
    items: ['Komponen Tarif Otomatis', 'Invoice Terpadu', 'Pembayaran (Tunai/Non-Tunai)', 'Klaim Asuransi/BPJS'],
    route: '/modul/kasir'
  },
  {
    step: 7,
    name: '7. Disposisi',
    icon: '🚪',
    color: 'from-sky-600 to-blue-700',
    items: ['Rawat Jalan Selesai', 'Admisi Rawat Inap (Ranap)', 'Rujukan Eksternal', 'Discharge Planning'],
    route: '/modul/rawat-inap'
  },
  {
    step: 8,
    name: '8. RME Final',
    icon: '📁',
    color: 'from-slate-700 to-slate-900',
    items: ['Rekam Medis Terkunci', 'Ringkasan Pulang (Resume)', 'Dokumentasi Digital', 'Audit Trail Terverifikasi'],
    route: '/modul/rekam-medis'
  }
];

// 5. MODUL UTAMA APLIKASI (12 KARTU MODUL)
export const BLUEPRINT_MODULE_CARDS: BlueprintModuleCard[] = [
  {
    id: 'master-pasien',
    name: 'Master Pasien',
    icon: '👥',
    color: 'bg-blue-500/10 text-blue-400',
    borderColor: 'border-blue-500/30',
    items: ['Identitas lengkap', 'No. RM & NIK', 'Penjamin & kontak darurat', 'Duplicate detection'],
    route: '/modul/pendaftaran'
  },
  {
    id: 'pendaftaran',
    name: 'Pendaftaran',
    icon: '📝',
    color: 'bg-cyan-500/10 text-cyan-400',
    borderColor: 'border-cyan-500/30',
    items: ['Pasien baru/lama', 'Registrasi kunjungan', 'Validasi data', 'Rujukan & penjamin'],
    route: '/modul/pendaftaran'
  },
  {
    id: 'encounter-queue',
    name: 'Encounter & Queue',
    icon: '⏱️',
    color: 'bg-emerald-500/10 text-emerald-400',
    borderColor: 'border-emerald-500/30',
    items: ['Jenis pelayanan', 'Antrean & status', 'Patient flow', 'Integrasi modul lain'],
    route: '/modul/rawat-jalan'
  },
  {
    id: 'rme-patient-360',
    name: 'RME (Patient 360)',
    icon: '📋',
    color: 'bg-purple-500/10 text-purple-400',
    borderColor: 'border-purple-500/30',
    items: ['Riwayat medis', 'Allergy & problem list', 'Medikasi & imunisasi', 'Timeline & dokumen'],
    route: '/modul/rekam-medis'
  },
  {
    id: 'soap',
    name: 'SOAP',
    icon: '🩺',
    color: 'bg-rose-500/10 text-rose-400',
    borderColor: 'border-rose-500/30',
    items: ['Subjective, Objective, Assessment, Plan', 'Finalisasi & amendment', 'Integrasi diagnosis/prosedur', 'Clinical alert'],
    route: '/modul/rawat-jalan'
  },
  {
    id: 'icd-coding',
    name: 'ICD-10 & ICD-9-CM',
    icon: '🏷️',
    color: 'bg-amber-500/10 text-amber-400',
    borderColor: 'border-amber-500/30',
    items: ['Pencarian kode pintar', 'AI assistance coding', 'Verifikasi dokter', 'Koding final klaim'],
    route: '/modul/rekam-medis'
  },
  {
    id: 'penunjang',
    name: 'Penunjang',
    icon: '🔬',
    color: 'bg-teal-500/10 text-teal-400',
    borderColor: 'border-teal-500/30',
    items: ['Lab (order & hasil)', 'Radiologi (gambar & laporan)', 'Prosedur klinis', 'Validasi hasil dokter Sp.'],
    route: '/modul/laboratorium'
  },
  {
    id: 'farmasi',
    name: 'Farmasi',
    icon: '💊',
    color: 'bg-pink-500/10 text-pink-400',
    borderColor: 'border-pink-500/30',
    items: ['Resep & interaksi', 'Cek alergi & stok', 'Dispensing & etiket', 'Riwayat pemberian obat'],
    route: '/modul/apotek-ralan'
  },
  {
    id: 'inventory',
    name: 'Inventory',
    icon: '📦',
    color: 'bg-lime-500/10 text-lime-400',
    borderColor: 'border-lime-500/30',
    items: ['Pembelian & penerimaan', 'Batch & expiry date', 'Stock & mutasi depo', 'Stock opname berkala'],
    route: '/modul/inventory'
  },
  {
    id: 'billing',
    name: 'Billing',
    icon: '💵',
    color: 'bg-yellow-500/10 text-yellow-400',
    borderColor: 'border-yellow-500/30',
    items: ['Komponen otomatis', 'Invoice & pembayaran', 'BPJS / Self-pay', 'Klaim asuransi & kwitansi'],
    route: '/modul/kasir'
  },
  {
    id: 'integrasi',
    name: 'Integrasi',
    icon: '🔗',
    color: 'bg-sky-500/10 text-sky-400',
    borderColor: 'border-sky-500/30',
    items: ['BPJS (SEP, V-Claim, dll)', 'SATUSEHAT (FHIR R4)', 'API management & logs', 'Mapping & transformation'],
    route: '/modul/bridging-hub'
  },
  {
    id: 'ai-myitaru',
    name: 'AI MYITARU',
    icon: '✨',
    color: 'bg-indigo-500/10 text-indigo-400',
    borderColor: 'border-indigo-500/30',
    items: ['AI Scribe (Voice-to-SOAP)', 'Clinical Summary', 'Coding Assistant (ICD)', 'Drug Interaction Checker', 'Patient Education'],
    route: '/modul/rawat-jalan'
  }
];

// 6. DATABASE (KONSEPTUAL)
export const BLUEPRINT_DATABASE: DatabaseEntity[] = [
  {
    name: 'patients',
    color: 'border-blue-500/50 bg-blue-950/30',
    fields: ['patient_id', 'no_rm', 'nik', 'nama', 'tgl_lahir', 'penjamin_id'],
    description: 'Master data identitas pasien'
  },
  {
    name: 'encounters',
    color: 'border-teal-500/50 bg-teal-950/30',
    fields: ['encounter_id', 'patient_id', 'type', 'status', 'start_time'],
    description: 'Episode kunjungan pasien'
  },
  {
    name: 'appointments',
    color: 'border-cyan-500/50 bg-cyan-950/30',
    fields: ['appointment_id', 'patient_id', 'poli', 'doctor', 'queue_no'],
    description: 'Antrean & janji temu'
  },
  {
    name: 'users',
    color: 'border-indigo-500/50 bg-indigo-950/30',
    fields: ['user_id', 'name', 'email', 'role_id', 'status'],
    description: 'Data pengguna sistem'
  },
  {
    name: 'roles',
    color: 'border-purple-500/50 bg-purple-950/30',
    fields: ['role_id', 'name', 'permissions'],
    description: 'Matriks izin akses RBAC'
  },
  {
    name: 'clinical_notes',
    color: 'border-rose-500/50 bg-rose-950/30',
    fields: ['note_id', 'encounter_id', 'user_id', 'soap_data', 'amendment'],
    description: 'Catatan rekam medis & SOAP'
  },
  {
    name: 'diagnoses',
    color: 'border-amber-500/50 bg-amber-950/30',
    fields: ['diagnosis_id', 'encounter_id', 'icd10_code', 'is_primary'],
    description: 'Kodefikasi diagnosis WHO'
  },
  {
    name: 'procedures',
    color: 'border-yellow-500/50 bg-yellow-950/30',
    fields: ['procedure_id', 'encounter_id', 'icd9_code', 'doctor_id'],
    description: 'Tindakan medis ICD-9-CM'
  },
  {
    name: 'orders',
    color: 'border-violet-500/50 bg-violet-950/30',
    fields: ['order_id', 'encounter_id', 'type', 'status', 'created_at'],
    description: 'Permintaan lab & radiologi'
  },
  {
    name: 'results',
    color: 'border-fuchsia-500/50 bg-fuchsia-950/30',
    fields: ['result_id', 'order_id', 'value', 'unit', 'verified_by'],
    description: 'Hasil pemeriksaan penunjang'
  },
  {
    name: 'prescriptions',
    color: 'border-pink-500/50 bg-pink-950/30',
    fields: ['prescription_id', 'encounter_id', 'drug_id', 'dosage', 'status'],
    description: 'Resep obat elektronik'
  },
  {
    name: 'inventory',
    color: 'border-emerald-500/50 bg-emerald-950/30',
    fields: ['item_id', 'batch_no', 'expiry_date', 'stock_qty', 'depo_id'],
    description: 'Stok obat & alkes faskes'
  },
  {
    name: 'billing',
    color: 'border-amber-600/50 bg-amber-950/30',
    fields: ['invoice_id', 'encounter_id', 'total_amount', 'payment_status'],
    description: 'Kuitansi & rincian biaya'
  },
  {
    name: 'documents',
    color: 'border-slate-500/50 bg-slate-900/50',
    fields: ['document_id', 'patient_id', 'type', 'file_url', 'hash_sha256'],
    description: 'Dokumen berkas & cetakan resmi'
  },
  {
    name: 'audit_logs',
    color: 'border-red-500/50 bg-red-950/30',
    fields: ['log_id', 'user_id', 'action', 'timestamp', 'before_after'],
    description: 'Catatan jejak audit sistem'
  }
];

// 7. KEAMANAN & AKSES
export const BLUEPRINT_SECURITY = {
  authentication: [
    'Login Multi-Faktor (MFA / 2FA)',
    'Session Management dengan Token Aman',
    'Enkripsi Data At-Rest & In-Transit (TLS/SSL)'
  ],
  rbac: [
    'Super Admin', 'Admin', 'Pendaftaran', 'Dokter',
    'Perawat', 'Rekam Medis', 'Farmasi', 'Lab',
    'Radiologi', 'Kasir', 'Manajemen'
  ],
  firestoreRules: [
    'Tidak ada akses publik (No Public Read/Write)',
    'Validasi Role & Permission di tingkat aturan Firestore',
    'Enkripsi dan isolasi data klinis sensitif'
  ],
  auditTrail: [
    'Pencatatan real-time semua aktivitas penting',
    'Dimensi 5W+1H: Siapa, apa, kapan, di mana, sebelum & sesudah'
  ]
};

// 8. OFFLINE MODE & SYNC
export const BLUEPRINT_OFFLINE_SYNC = {
  pipeline: [
    { title: 'Aplikasi', desc: 'UI berinteraksi langsung dengan input pengguna', icon: '📱' },
    { title: 'IndexedDB (Local Cache)', desc: 'Penyimpanan terenkripsi lokal perangkat', icon: '💾' },
    { title: 'Sync Queue (Conflict Resolution)', desc: 'Antrean transaksi berstempel waktu', icon: '🔄' },
    { title: 'Firestore (Cloud)', desc: 'Pangkalan data pusat terpusat', icon: '☁️' }
  ],
  rules: [
    'Data tetap bisa diakses dan diinput saat offline',
    'Sinkronisasi otomatis saat online kembali dengan penanganan konflik',
    'LocalStorage diutamakan untuk preferensi dan cache ringan'
  ]
};

// 9. INTEGRASI EKSTERNAL
export const BLUEPRINT_EXTERNAL_INTEGRATIONS = {
  bpjs: {
    title: 'BPJS Kesehatan',
    features: ['Eligibility Cek Peserta', 'Generate & Batal SEP', 'Rujukan Online', 'V-Claim & Vedika Integration']
  },
  satusehat: {
    title: 'SATUSEHAT Kemenkes RI',
    features: ['FHIR R4 Resource Mapping', 'Data Registrasi Encounter', 'Data Klinis (Condition, Observation)', 'Laporan Pelayanan Terstandar']
  }
};

// 10. AI & GOVERNANCE
export const BLUEPRINT_AI_GOVERNANCE = {
  fiturAi: [
    'AI Scribe (Transkripsi Suara ke SOAP)',
    'Clinical Summary Generator',
    'Coding Assistant (Rekomendasi ICD-10 & 9)',
    'Duplicate Patient Detection',
    'Drug-Drug Interaction Checker',
    'Clinical Decision Alert (Tanda Vital Cito)',
    'Discharge Summary Automation',
    'Patient Education Generator',
    'AI Audit Log Verification'
  ],
  auditEvent: [
    'User (Dokter/Petugas)',
    'Patient (No. RM & NIK)',
    'Encounter ID',
    'Action (Generate / Validate)',
    'Module Name',
    'Timestamp ISO',
    'AI Output Payload',
    'Verification Status'
  ],
  statusPipeline: [
    { id: 'AI_GENERATED', label: 'AI GENERATED', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
    { id: 'PENDING_REVIEW', label: 'PENDING REVIEW', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    { id: 'HUMAN_VERIFIED', label: 'HUMAN VERIFIED', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' },
    { id: 'FINAL', label: 'FINAL', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' }
  ]
};

// 11. GAP ANALYSIS (RINGKASAN)
export const BLUEPRINT_GAP_ANALYSIS: GapAnalysisItem[] = [
  {
    area: 'Security & Firestore Rules',
    targetStatus: 'Perlu perbaikan',
    prioritas: 'P0',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    catatan: 'Aturan keamanan cloud ketat, tidak ada celah open-read/write.'
  },
  {
    area: 'RBAC & Permission',
    targetStatus: 'Perlu diperkuat',
    prioritas: 'P0',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    catatan: '11 Role profesi medis terisolasi sesuai wewenang tugas.'
  },
  {
    area: 'Master Pasien & Duplicate',
    targetStatus: 'Sudah ada (validasi)',
    prioritas: 'P1',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    catatan: 'Pendeteksian duplikasi NIK dan No. RM dengan scoring kemiripan.'
  },
  {
    area: 'Modul Pendaftaran',
    targetStatus: 'Perlu penyempurnaan',
    prioritas: 'P1',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    catatan: 'Form wizard terpadu dengan generator encounter ID otomatis.'
  },
  {
    area: 'RME & Integrasi',
    targetStatus: 'Perlu pembenahan',
    prioritas: 'P1',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    catatan: 'Patient 360 view, ICD-10 smart tagging, dan audit KLPCM.'
  },
  {
    area: 'AI & Clinical Support',
    targetStatus: 'Perlu governance',
    prioritas: 'P1',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    catatan: 'Pipeline 4-tahap verifikasi manusia untuk setiap output GenAI.'
  },
  {
    area: 'BPJS & SATUSEHAT',
    targetStatus: 'Perlu arsitektur integrasi',
    prioritas: 'P2',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    catatan: 'Simulasi dan real bridging konektor dengan FHIR R4 schema.'
  },
  {
    area: 'Modul Lain (ICU, Gizi, dll)',
    targetStatus: 'Fase pengembangan',
    prioritas: 'P3',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    catatan: 'Modul khusus spesialisasi rawat inap intensif & pendukung.'
  }
];

// 12. FASE PENGEMBANGAN (ROADMAP)
export const BLUEPRINT_ROADMAP: RoadmapPhase[] = [
  {
    phase: 1,
    name: 'Fase 1: System Foundation',
    color: 'from-blue-600 to-indigo-600',
    badge: 'Fondasi Utama',
    items: ['Security & Firestore Rules', 'Authentication & MFA', 'RBAC 11 Role Profesi', 'Audit Trail & Encounter ID', 'Database Architecture']
  },
  {
    phase: 2,
    name: 'Fase 2: Core Patient Journey',
    color: 'from-teal-600 to-emerald-600',
    badge: 'Alur Inti',
    items: ['Master Pasien & Duplicate Check', 'Pendaftaran Kunjungan', 'Antrean & Display Loket', 'Rawat Jalan (Poli) & IGD Triase', 'RME Patient 360 & SOAP']
  },
  {
    phase: 3,
    name: 'Fase 3: Supporting Services',
    color: 'from-purple-600 to-pink-600',
    badge: 'Penunjang',
    items: ['Laboratorium & LIS Integration', 'Radiologi & PACS DICOM', 'Farmasi & E-Prescribing', 'Kasir & Billing Terpadu', 'Inventory & Stock Opname']
  },
  {
    phase: 4,
    name: 'Fase 4: AI & Integration',
    color: 'from-amber-600 to-orange-600',
    badge: 'AI & Eksternal',
    items: ['AI Scribe & Clinical Decision Support', 'AI Governance Pipeline 4 Tahap', 'BPJS Kesehatan V-Claim Bridging', 'Kemenkes SATUSEHAT FHIR R4', 'API Management Gateway']
  },
  {
    phase: 5,
    name: 'Fase 5: Advanced Modules',
    color: 'from-rose-600 to-red-700',
    badge: 'Spesialisasi',
    items: ['ICU & Critical Care Monitoring', 'CSSD Instrument Sterilization', 'Rehabilitasi Medik (Barthel Index)', 'Gizi & Diet Planning', 'Telemedicine & Multi-Branch RS']
  }
];

// 13. DEFINISI SELESAI (CHECKLIST 14 ITEM)
export const BLUEPRINT_DOD_CHECKLIST: DefinitionOfDoneItem[] = [
  { id: 'dod_ui', label: 'UI Tersedia', description: 'Tampilan antarmuka lengkap, bersih, responsif, dan mendukung mode gelap.', category: 'core', defaultChecked: true },
  { id: 'dod_form', label: 'Form Validation', description: 'Semua kolom formulir divalidasi dengan pesan kesalahan berbahasa Indonesia yang jelas.', category: 'core', defaultChecked: true },
  { id: 'dod_db', label: 'Database Persistence', description: 'Data tersimpan ke Firestore Cloud dan disinkronkan ke cache lokal secara konsisten.', category: 'core', defaultChecked: true },
  { id: 'dod_loading', label: 'Loading State', description: 'Status pemuatan data ditampilkan secara halus melalui skeleton screen.', category: 'quality', defaultChecked: true },
  { id: 'dod_error', label: 'Error Handling', description: 'Penanganan galat terisolasi melalui ErrorBoundary dan notifikasi toast profesional.', category: 'quality', defaultChecked: true },
  { id: 'dod_empty', label: 'Empty State', description: 'Keadaan data kosong memiliki ilustrasi, penjelasan ramah, dan aksi mulai.', category: 'quality', defaultChecked: true },
  { id: 'dod_perm', label: 'Permission Check', description: 'Pengecekan hak akses RBAC aktif di tingkat route, tombol aksi, dan controller.', category: 'core', defaultChecked: true },
  { id: 'dod_audit', label: 'Audit Log', description: 'Pencatatan riwayat perubahan data (siapa, kapan, apa) tercatat di AuditTrail.', category: 'core', defaultChecked: true },
  { id: 'dod_module', label: 'Related Module Integration', description: 'Keterhubungan otomatis antar modul (Pendaftaran -> Poli -> Lab -> Farmasi -> Kasir).', category: 'integration', defaultChecked: true },
  { id: 'dod_mobile', label: 'Mobile Responsive', description: 'Dapat diakses nyaman melalui tablet dokter/perawat dan ponsel pintar.', category: 'quality', defaultChecked: true },
  { id: 'dod_offline', label: 'Offline Behavior', description: 'Sistem tetap dapat membaca data ketika koneksi terputus dan melakukan sinkronisasi.', category: 'quality', defaultChecked: true },
  { id: 'dod_val', label: 'Data Validation', description: 'Format NIK 16 digit, No. RM standar, nomor telepon, dan kode diagnosis terstandar.', category: 'core', defaultChecked: true },
  { id: 'dod_dup', label: 'Duplicate Prevention', description: 'Pendeteksian duplikasi NIK dan rekam medis ganda sebelum data disimpan.', category: 'core', defaultChecked: true },
  { id: 'dod_test', label: 'Test Workflow', description: 'Seluruh alur pelayanan telah diuji coba dari awal kedatangan hingga pasien pulang.', category: 'integration', defaultChecked: true }
];
