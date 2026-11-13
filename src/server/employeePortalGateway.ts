import crypto from 'crypto';
import type express from 'express';
import {
  HOSPITAL_DIVISIONS,
  CORE_EMPLOYEE_MODULES,
  GOVERNANCE_FRAMEWORKS,
  type DivisionDefinition
} from '../data/employeePortalCatalog';

export interface GatewayDependencies {
  createAuditLog?: (entry: {
    user_id: string;
    user_name: string;
    action: string;
    module: string;
    details: string;
    ip_address?: string;
    status: 'SUCCESS' | 'WARNING' | 'FAILED';
  }) => void;
}

export interface AbacContext {
  onDuty: boolean;
  unitMatch: boolean;
  careRelationship: boolean;
  breakGlassActive: boolean;
  breakGlassReason: string;
}

interface EmployeeUserRecord {
  id: string;
  nip: string;
  email: string;
  name: string;
  divisionId: string;
  divisionName: string;
  roleTitle: string;
  portalRole: 'ADMIN_TI' | 'PIMPINAN' | 'KLINIS' | 'KEPERAWATAN' | 'PENUNJANG' | 'STAF_UMUM';
  isClinical: boolean;
  isAdminCapable: boolean;
  active: boolean;
  strNumber?: string;
  strExpiry?: string;
  sipNumber?: string;
  sipExpiry?: string;
  unitLocation: string;
  shiftPattern: string;
  lastHrisSync: string;
}

interface MfaChallenge {
  challengeId: string;
  userId: string;
  otp: string;
  authType: 'nip' | 'google';
  deviceInfo: string;
  expiresAt: number;
}

interface GatewaySession {
  token: string;
  userId: string;
  nip: string;
  name: string;
  email: string;
  divisionId: string;
  divisionName: string;
  roleTitle: string;
  portalRole: EmployeeUserRecord['portalRole'];
  isClinical: boolean;
  isAdminCapable: boolean;
  mfaVerified: boolean;
  authType: 'nip' | 'google';
  deviceFingerprint: string;
  abac: AbacContext;
  createdAt: string;
}

interface SiemAuditEntry {
  id: string;
  timestamp: string;
  actorNip: string;
  actorName: string;
  divisionId: string;
  eventType: string;
  resource: string;
  decision: 'ALLOW' | 'DENY' | 'CHALLENGE' | 'BREAK_GLASS';
  detail: string;
  ipAddress: string;
  hash: string;
}

interface AbacPolicies {
  requireOnDutyForClinicalEmr: boolean;
  requireUnitMatchForSensitiveActions: boolean;
  requireCareRelationshipForPatientRecords: boolean;
  allowBreakGlassWithAudit: boolean;
  enforce40HourShiftCap: boolean;
  mfaRequiredForClinicalAndAdmin: boolean;
}

interface ConfigChangeProposal {
  id: string;
  proposedAt: string;
  proposedBy: string;
  category: 'FEATURE_FLAG' | 'ABAC_POLICY' | 'RBAC_MATRIX' | 'PORTAL_CONTENT';
  title: string;
  targetKey: string;
  proposedValue: unknown;
  justification: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
}

const DEFAULT_DEMO_OTP = '123456';

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function mapPortalRole(div: DivisionDefinition): EmployeeUserRecord['portalRole'] {
  if (div.id === 'simrs-ti' || div.id === 'sdm-umum') return 'ADMIN_TI';
  if (div.id === 'direktur' || div.id === 'wadir' || div.id === 'spi' || div.id === 'hukum-etik') return 'PIMPINAN';
  if (div.id === 'keperawatan' || div.id === 'rawat-inap') return 'KEPERAWATAN';
  if (div.isClinical) return 'KLINIS';
  if (div.category === 'Penunjang Medik' || div.category === 'Penunjang Non-Medik & Sarana') return 'PENUNJANG';
  return 'STAF_UMUM';
}

export function registerEmployeePortalGateway(app: express.Application, deps: GatewayDependencies = {}) {
  // Klinik Campus Reference Coordinate (MYITARU Medical Center - Jakarta)
  const HOSPITAL_GEOFENCE = {
    name: 'Kampus Utama MYITARU Klinik Jakarta',
    lat: -6.229728,
    lng: 106.829518,
    radiusMeters: 200
  };

  // =========================================================================
  // 1. IN-MEMORY ENTERPRISE STORES (SIMK / HRIS / GATEWAY STATE)
  // =========================================================================
  const usersStore: EmployeeUserRecord[] = HOSPITAL_DIVISIONS.map((div, index) => ({
    id: `emp-${div.id}`,
    nip: div.defaultNip,
    email: `${div.id.replace(/[^a-z0-9]/g, '')}@rs-myitaru.id`,
    name: div.defaultStaffName,
    divisionId: div.id,
    divisionName: div.name,
    roleTitle: div.sampleRoles[0] || div.name,
    portalRole: mapPortalRole(div),
    isClinical: div.isClinical,
    isAdminCapable: div.isAdminCapable,
    active: true,
    strNumber: div.isClinical ? `STR-3171-${100400 + index}` : undefined,
    strExpiry: div.isClinical ? (index % 3 === 0 ? '2026-06-15' : '2028-11-30') : undefined,
    sipNumber: div.isClinical ? `SIP-DKI-${2201 + index}/2025` : undefined,
    sipExpiry: div.isClinical ? '2027-09-20' : undefined,
    unitLocation: div.name,
    shiftPattern: div.defaultShift,
    lastHrisSync: new Date().toISOString()
  }));

  const mfaChallenges = new Map<string, MfaChallenge>();
  const sessions = new Map<string, GatewaySession>();
  const idempotencyCache = new Map<string, { status: number; body: unknown; createdAt: number }>();
  const rateLimitMap = new Map<string, number[]>();

  let abacPolicies: AbacPolicies = {
    requireOnDutyForClinicalEmr: true,
    requireUnitMatchForSensitiveActions: true,
    requireCareRelationshipForPatientRecords: false,
    allowBreakGlassWithAudit: true,
    enforce40HourShiftCap: true,
    mfaRequiredForClinicalAndAdmin: true
  };

  let featureFlags: Record<string, { label: string; enabled: boolean; targetScope: string; description: string }> = {
    offline_attendance: {
      label: 'Absensi Mode Offline + Auto-Sync Idempoten',
      enabled: true,
      targetScope: 'Semua Divisi',
      description: 'Mengizinkan penyimpanan presensi saat zona blankspot dengan deduplikasi Idempotency-Key.'
    },
    sbar_bedside_handover: {
      label: 'Handover Shift SBAR Bedside & Supervisi Karu',
      enabled: true,
      targetScope: 'Keperawatan, IGD, Rawat Inap, ICU, IBS',
      description: 'Validasi serah terima pasien antar shift lengkap dengan tanda tangan Karu.'
    },
    doctor_oppe_dashboard: {
      label: 'Evaluasi Kinerja Klinis Dokter (OPPE)',
      enabled: true,
      targetScope: 'KSM, Yanmed, Komite Medik, Direktur',
      description: 'Pemantauan ALOS, mortalitas, kepatuhan Fornas, dan kelengkapan resume medis.'
    },
    break_glass_emergency: {
      label: 'Protokol Darurat Break-Glass EMR',
      enabled: true,
      targetScope: 'Klinis & IGD',
      description: 'Membuka akses darurat EMR saat darurat nyawa dengan pencatatan audit immutable wajib.'
    },
    bpjs_vclaim_bridge: {
      label: 'Middleware BPJS VClaim & Antrean JKN',
      enabled: true,
      targetScope: 'Keuangan, Rekam Medis, Pendaftaran, Rawat Jalan',
      description: 'Validasi SEP, INA-CBGs, dan verifikasi rujukan melalui middleware API.'
    },
    satusehat_fhir_sync: {
      label: 'Adapter FHIR R4 SATUSEHAT Kemenkes',
      enabled: true,
      targetScope: 'Klinis, Rekam Medis, TI',
      description: 'Sinkronisasi asinkron Encounter, Observation, dan Condition melalui message queue.'
    }
  };

  let rbacMatrix: Record<
    EmployeeUserRecord['portalRole'],
    {
      label: string;
      coreModules: string[];
      canAccessDivisionSpecific: boolean;
      canApproveUnitLeave: boolean;
      canApproveSdmLeave: boolean;
      canAccessAdminArea: boolean;
      canViewOppe: boolean;
      canReviewConfigChanges: boolean;
    }
  > = {
    ADMIN_TI: {
      label: 'Unit SIMK / TI & SDM Admin',
      coreModules: CORE_EMPLOYEE_MODULES.map((m) => m.id),
      canAccessDivisionSpecific: true,
      canApproveUnitLeave: true,
      canApproveSdmLeave: true,
      canAccessAdminArea: true,
      canViewOppe: true,
      canReviewConfigChanges: true
    },
    PIMPINAN: {
      label: 'Direksi, SPI & Hukum Etik',
      coreModules: CORE_EMPLOYEE_MODULES.map((m) => m.id),
      canAccessDivisionSpecific: true,
      canApproveUnitLeave: true,
      canApproveSdmLeave: true,
      canAccessAdminArea: true,
      canViewOppe: true,
      canReviewConfigChanges: true
    },
    KLINIS: {
      label: 'Dokter Spesialis, IGD, Farmasi, Penunjang Klinis',
      coreModules: CORE_EMPLOYEE_MODULES.map((m) => m.id),
      canAccessDivisionSpecific: true,
      canApproveUnitLeave: true,
      canApproveSdmLeave: false,
      canAccessAdminArea: false,
      canViewOppe: true,
      canReviewConfigChanges: false
    },
    KEPERAWATAN: {
      label: 'Bidang Keperawatan, Karu & Perawat Ruangan',
      coreModules: CORE_EMPLOYEE_MODULES.map((m) => m.id),
      canAccessDivisionSpecific: true,
      canApproveUnitLeave: true,
      canApproveSdmLeave: false,
      canAccessAdminArea: false,
      canViewOppe: false,
      canReviewConfigChanges: false
    },
    PENUNJANG: {
      label: 'Penunjang Medik & Non-Medik (CSSD, IPSRS, Gizi, Kesling, Security)',
      coreModules: CORE_EMPLOYEE_MODULES.map((m) => m.id),
      canAccessDivisionSpecific: true,
      canApproveUnitLeave: true,
      canApproveSdmLeave: false,
      canAccessAdminArea: false,
      canViewOppe: false,
      canReviewConfigChanges: false
    },
    STAF_UMUM: {
      label: 'Keuangan, Perencanaan, Humas, Diklat & Tata Usaha',
      coreModules: CORE_EMPLOYEE_MODULES.map((m) => m.id),
      canAccessDivisionSpecific: true,
      canApproveUnitLeave: false,
      canApproveSdmLeave: false,
      canAccessAdminArea: false,
      canViewOppe: false,
      canReviewConfigChanges: false
    }
  };

  let portalAnnouncements = [
    {
      id: 'ann-1',
      title: 'Pembaruan Kebijakan Keamanan PMK 24/2022 & MFA Klinis',
      category: 'Tata Kelola & Keamanan',
      priority: 'Penting',
      publishedAt: '2026-04-02 08:00',
      author: 'Komite Mutu & Unit SIMK/TI',
      summary: 'Seluruh tenaga klinis dan pengelola sistem wajib mengaktifkan MFA 6-digit serta menjaga kepatuhan atribut ABAC On-Duty saat mengakses Rekam Medis Elektronik.'
    },
    {
      id: 'ann-2',
      title: 'Jadwal Uji Kompetensi BHD / ACLS Batch Q2 2026',
      category: 'Diklat & SDM',
      priority: 'Info',
      publishedAt: '2026-04-01 10:30',
      author: 'Instalasi Pendidikan & Pelatihan',
      summary: 'Pegawai dengan masa berlaku sertifikat BHD kurang dari 90 hari dapat mendaftar langsung melalui modul Pengetahuan & Diklat.'
    },
    {
      id: 'ann-3',
      title: 'Pemeliharaan Terjadwal Adapter SATUSEHAT FHIR R4 Minggu Dini Hari',
      category: 'Operasional TI',
      priority: 'Info',
      publishedAt: '2026-03-29 14:15',
      author: 'Unit SIMK / TI',
      summary: 'Pengiriman data klinis akan masuk ke Message Queue asinkron dan dikirim otomatis dengan mekanisme retry idempoten tanpa kehilangan transaksi.'
    }
  ];

  // Shift schedule store (3-shift & long-shift with weekly hour calculation)
  const shiftSchedulesStore: Array<{
    id: string;
    nip: string;
    employeeName: string;
    divisionId: string;
    date: string;
    dayLabel: string;
    shiftType: 'Pagi (07:00-14:00)' | 'Siang (14:00-21:00)' | 'Malam (21:00-07:00)' | 'Reguler (08:00-16:00)' | 'Libur';
    hours: number;
    unit: string;
    status: 'Terjadwal' | 'Sedang Bertugas' | 'Selesai' | 'Tukar Pending';
  }> = [
    { id: 'sh-1', nip: 'DEFAULT', employeeName: 'Aktif', divisionId: 'ALL', date: '2026-04-06', dayLabel: 'Senin', shiftType: 'Pagi (07:00-14:00)', hours: 7, unit: 'Unit Bertugas', status: 'Selesai' },
    { id: 'sh-2', nip: 'DEFAULT', employeeName: 'Aktif', divisionId: 'ALL', date: '2026-04-07', dayLabel: 'Selasa', shiftType: 'Pagi (07:00-14:00)', hours: 7, unit: 'Unit Bertugas', status: 'Selesai' },
    { id: 'sh-3', nip: 'DEFAULT', employeeName: 'Aktif', divisionId: 'ALL', date: '2026-04-08', dayLabel: 'Rabu', shiftType: 'Siang (14:00-21:00)', hours: 7, unit: 'Unit Bertugas', status: 'Sedang Bertugas' },
    { id: 'sh-4', nip: 'DEFAULT', employeeName: 'Aktif', divisionId: 'ALL', date: '2026-04-09', dayLabel: 'Kamis', shiftType: 'Siang (14:00-21:00)', hours: 7, unit: 'Unit Bertugas', status: 'Terjadwal' },
    { id: 'sh-5', nip: 'DEFAULT', employeeName: 'Aktif', divisionId: 'ALL', date: '2026-04-10', dayLabel: 'Jumat', shiftType: 'Malam (21:00-07:00)', hours: 10, unit: 'Unit Bertugas', status: 'Terjadwal' },
    { id: 'sh-6', nip: 'DEFAULT', employeeName: 'Aktif', divisionId: 'ALL', date: '2026-04-11', dayLabel: 'Sabtu', shiftType: 'Libur', hours: 0, unit: 'Istirahat Mingguan', status: 'Terjadwal' }
  ];

  const shiftSwapsStore: Array<{
    id: string;
    requesterName: string;
    requesterNip: string;
    divisionId: string;
    fromDate: string;
    fromShift: string;
    targetColleague: string;
    toDate: string;
    toShift: string;
    reason: string;
    weeklyHoursAfterSwap: number;
    conflictWarning?: string;
    status: 'Menunggu Atasan Unit' | 'Disetujui' | 'Ditolak';
    createdAt: string;
  }> = [
    {
      id: 'swp-1',
      requesterName: 'Ns. Siti Fatimah, M.Kep',
      requesterNip: 'NIP-19840920-015',
      divisionId: 'keperawatan',
      fromDate: '2026-04-10',
      fromShift: 'Malam (21:00-07:00)',
      targetColleague: 'Ns. Raka Pradipta, S.Kep',
      toDate: '2026-04-11',
      toShift: 'Pagi (07:00-14:00)',
      reason: 'Pertukaran jadwal jaga akhir pekan & menjaga kepatuhan batas 40 jam/minggu',
      weeklyHoursAfterSwap: 35,
      status: 'Disetujui',
      createdAt: '2026-04-05 09:15'
    }
  ];

  const attendanceLogsStore: Array<{
    id: string;
    nip: string;
    employeeName: string;
    divisionId: string;
    timestamp: string;
    type: 'MASUK' | 'PULANG' | 'LEMBUR' | 'KOREKSI';
    method: 'Geofencing + Biometrik' | 'Offline Sync (Idempoten)' | 'Koreksi Manual';
    distanceMeters: number;
    withinGeofence: boolean;
    biometricVerified: boolean;
    note?: string;
    idempotencyKey?: string;
  }> = [
    {
      id: 'att-1',
      nip: 'GLOBAL',
      employeeName: 'Presensi Harian Unit',
      divisionId: 'ALL',
      timestamp: '2026-04-08 06:54:12',
      type: 'MASUK',
      method: 'Geofencing + Biometrik',
      distanceMeters: 28,
      withinGeofence: true,
      biometricVerified: true,
      note: 'Lobby Utama Gedung A'
    },
    {
      id: 'att-2',
      nip: 'GLOBAL',
      employeeName: 'Presensi Harian Unit',
      divisionId: 'ALL',
      timestamp: '2026-04-07 14:12:40',
      type: 'PULANG',
      method: 'Geofencing + Biometrik',
      distanceMeters: 34,
      withinGeofence: true,
      biometricVerified: true,
      note: 'Selesai Handover Shift Pagi'
    }
  ];

  const leaveRequestsStore: Array<{
    id: string;
    nip: string;
    employeeName: string;
    divisionId: string;
    type: 'Cuti Tahunan' | 'Cuti Sakit' | 'Izin Pelatihan / Seminar' | 'Izin Khusus';
    startDate: string;
    endDate: string;
    days: number;
    substitute: string;
    reason: string;
    status: 'Menunggu Atasan Unit' | 'Menunggu Verifikasi SDM' | 'Disetujui Final' | 'Ditolak';
    unitApprovedBy?: string;
    sdmApprovedBy?: string;
    createdAt: string;
  }> = [
    {
      id: 'lv-101',
      nip: 'NIP-19900308-110',
      employeeName: 'Ns. Dewi Anggraini, S.Kep',
      divisionId: 'rawat-inap',
      type: 'Cuti Tahunan',
      startDate: '2026-04-20',
      endDate: '2026-04-22',
      days: 3,
      substitute: 'Ns. Rian Kusuma, S.Kep',
      reason: 'Keperluan keluarga di luar kota',
      status: 'Menunggu Verifikasi SDM',
      unitApprovedBy: 'Karu Bangsal Melati',
      createdAt: '2026-04-06 11:20'
    },
    {
      id: 'lv-102',
      nip: 'NIP-19890722-201',
      employeeName: 'apt. Dewi Lestari, S.Farm',
      divisionId: 'farmasi',
      type: 'Izin Pelatihan / Seminar',
      startDate: '2026-04-18',
      endDate: '2026-04-18',
      days: 1,
      substitute: 'apt. Hendri Gunawan, S.Farm',
      reason: 'Simposium Farmasi Klinis & Stewardship Antibiotik',
      status: 'Menunggu Atasan Unit',
      createdAt: '2026-04-07 09:05'
    }
  ];

  const reimbursementsStore: Array<{
    id: string;
    nip: string;
    employeeName: string;
    title: string;
    category: 'Diklat / SKP' | 'Perjalanan Dinas' | 'Kesehatan Pegawai' | 'Operasional Unit';
    amount: number;
    date: string;
    status: 'Diajukan' | 'Diverifikasi Keuangan' | 'Dibayarkan';
  }> = [
    {
      id: 'rmb-1',
      nip: 'NIP-19880512-101',
      employeeName: 'dr. Bima Sakti, Sp.EM',
      title: 'Resertifikasi ATLS Ikatan Dokter Indonesia',
      category: 'Diklat / SKP',
      amount: 3500000,
      date: '2026-03-28',
      status: 'Dibayarkan'
    },
    {
      id: 'rmb-2',
      nip: 'NIP-19900105-501',
      employeeName: 'Bagas Setiawan, S.Kom., M.TI',
      title: 'Workshop Keamanan ISO 27001 Rumah Sakit',
      category: 'Diklat / SKP',
      amount: 2250000,
      date: '2026-04-02',
      status: 'Diverifikasi Keuangan'
    }
  ];

  const sbarHandoversStore: Array<{
    id: string;
    unit: string;
    divisionId: string;
    sessionType: 'Nurse Station (Terjadwal)' | 'Bedside Handover';
    fromShift: string;
    toShift: string;
    senderName: string;
    receiverName: string;
    patientLabel: string;
    situation: string;
    background: string;
    assessment: string;
    recommendation: string;
    karuVerified: boolean;
    karuName?: string;
    createdAt: string;
  }> = [
    {
      id: 'sbar-1',
      unit: 'Ruang Melati Lt. 3 / IGD',
      divisionId: 'keperawatan',
      sessionType: 'Bedside Handover',
      fromShift: 'Shift Pagi (07:00-14:00)',
      toShift: 'Shift Siang (14:00-21:00)',
      senderName: 'Ns. Siti Fatimah, M.Kep',
      receiverName: 'Ns. Dewi Anggraini, S.Kep',
      patientLabel: 'Tn. Ahmad Subarjo (No. RM: RM-240101-0001) · Bed M-302',
      situation: 'Post-op apendektomi H+1, nyeri luka operasi VAS 3/10, kesadaran compos mentis.',
      background: 'Riwayat hipertensi terkontrol, alergi penisilin (tercatat di gelang kuning). Terpasang infus RL 20 tpm.',
      assessment: 'TD 128/78 mmHg, Nadi 82x/m, Suhu 36.7°C, SpO2 99%, luka kering tanpa rembesan.',
      recommendation: 'Lanjutkan Ketorolac IV sesuai jadwal pukul 16:00, observasi mobilisasi dini & cek bising usus sore.',
      karuVerified: true,
      karuName: 'Karu Unit Rawat Inap',
      createdAt: '2026-04-08 13:50'
    },
    {
      id: 'sbar-2',
      unit: 'ICU Dewasa Bed 02',
      divisionId: 'icu',
      sessionType: 'Nurse Station (Terjadwal)',
      fromShift: 'Shift Pagi (07:00-14:00)',
      toShift: 'Shift Siang (14:00-21:00)',
      senderName: 'dr. Kevin Wijaya, Sp.An-KIC',
      receiverName: 'Ns. Pratama, S.Kep',
      patientLabel: 'Ny. Ratna Kusuma (No. RM: RM-240214-0042) · ICU-02',
      situation: 'Dalam penyapihan ventilator mode CPAP PEEP 5 FiO2 35%, AGD stabil.',
      background: 'Pneumonia berat komunitas, terpasang CVC kanan, norepinefrin sudah tap-off sejak 09:00 WIB.',
      assessment: 'MAP 76 mmHg, SpO2 98%, balans cairan -250 mL/24 jam, skor SOFA turun dari 7 menjadi 4.',
      recommendation: 'Ulang foto toraks evaluasi pukul 17:00, pertimbangkan ekstubasi bila SBT 2 jam berhasil.',
      karuVerified: false,
      createdAt: '2026-04-08 13:58'
    }
  ];

  const helpdeskTicketsStore: Array<{
    id: string;
    ticketNo: string;
    requesterName: string;
    requesterContact: string;
    divisionName: string;
    category: 'TI / SIMK & MFA' | 'HR & Absensi / Payroll' | 'Instalasi Aplikasi Mobile' | 'Sarana / Medis';
    priority: 'P1 - Kritis (15 Menit)' | 'P2 - Tinggi (1 Jam)' | 'P3 - Normal (4 Jam)';
    subject: string;
    description: string;
    source: 'Portal Karyawan' | 'Landing Page App';
    status: 'Terbuka' | 'Ditangani ITIL L1/L2' | 'Selesai';
    assignedTeam: string;
    createdAt: string;
  }> = [
    {
      id: 'tkt-1',
      ticketNo: 'INC-2026-0408-01',
      requesterName: 'dr. Budi Santoso, Sp.PD',
      requesterContact: 'NIP-19830125-105',
      divisionName: 'Instalasi Rawat Jalan',
      category: 'TI / SIMK & MFA',
      priority: 'P2 - Tinggi (1 Jam)',
      subject: 'Reset device binding aplikasi mobile karyawan di perangkat baru',
      description: 'Perlu pembaharuan fingerprint perangkat Android baru untuk akses MFA.',
      source: 'Portal Karyawan',
      status: 'Ditangani ITIL L1/L2',
      assignedTeam: 'Service Desk TI (ISO 27001)',
      createdAt: '2026-04-08 09:10'
    },
    {
      id: 'tkt-2',
      ticketNo: 'INC-2026-0408-02',
      requesterName: 'Ns. Dewi Anggraini, S.Kep',
      requesterContact: 'NIP-19900308-110',
      divisionName: 'Instalasi Rawat Inap',
      category: 'HR & Absensi / Payroll',
      priority: 'P3 - Normal (4 Jam)',
      subject: 'Verifikasi lembur shift malam ruang Melati',
      description: 'Mohon validasi 2 jam lembur perpanjangan handover pasien kritis.',
      source: 'Portal Karyawan',
      status: 'Selesai',
      assignedTeam: 'SDM & Payroll Service',
      createdAt: '2026-04-07 20:45'
    }
  ];

  const divisionActionState = new Map<string, Record<string, string>>();

  const siemAuditTrail: SiemAuditEntry[] = [
    {
      id: 'siem-1',
      timestamp: '2026-04-08 07:02:14',
      actorNip: 'NIP-19900105-501',
      actorName: 'Bagas Setiawan, S.Kom., M.TI',
      divisionId: 'simrs-ti',
      eventType: 'GATEWAY_BOOT',
      resource: 'API Gateway + RBAC/ABAC Engine',
      decision: 'ALLOW',
      detail: 'Inisialisasi kebijakan UU PDP, PMK 24/2022, ISO 27001/27799, dan ITIL 4/COBIT 2019 aktif.',
      ipAddress: '10.24.1.15',
      hash: 'sha256:9f4c2b81e7a03d91'
    }
  ];

  const configChangeProposals: ConfigChangeProposal[] = [
    {
      id: 'chg-101',
      proposedAt: '2026-04-08 09:30:00',
      proposedBy: 'Bagas Setiawan, S.Kom., M.TI (Unit SIMK/TI)',
      category: 'ABAC_POLICY',
      title: 'Aktifkan verifikasi hubungan perawatan (Care Relationship) untuk akses EMR detail',
      targetKey: 'requireCareRelationshipForPatientRecords',
      proposedValue: true,
      justification: 'Memperketat prinsip need-to-know sesuai PMK 24/2022 dan audit SPI Q2 2026.',
      status: 'PENDING_REVIEW'
    },
    {
      id: 'chg-102',
      proposedAt: '2026-04-07 15:10:00',
      proposedBy: 'Dian Puspita, S.Psi., M.M. (SDM & Umum)',
      category: 'FEATURE_FLAG',
      title: 'Aktifkan mode absensi offline idempoten untuk seluruh unit',
      targetKey: 'offline_attendance',
      proposedValue: true,
      justification: 'Menjaga kelancaran presensi di area basement & ambulans saat sinyal lemah.',
      status: 'APPROVED',
      reviewedAt: '2026-04-07 16:00:00',
      reviewedBy: 'Siti Rahma, S.H., M.H.Kes (DPO / Hukum & Etik)',
      reviewNote: 'Disetujui dengan syarat enkripsi lokal & Idempotency-Key aktif.'
    }
  ];

  const governanceChangelog: Array<{
    id: string;
    appliedAt: string;
    proposalId: string;
    category: string;
    title: string;
    approvedBy: string;
    summary: string;
  }> = [
    {
      id: 'clog-1',
      appliedAt: '2026-04-07 16:00:00',
      proposalId: 'chg-102',
      category: 'FEATURE_FLAG',
      title: 'Aktivasi Mode Absensi Offline Idempoten',
      approvedBy: 'Siti Rahma, S.H., M.H.Kes (DPO / Hukum & Etik)',
      summary: 'Feature flag offline_attendance diaktifkan dengan proteksi Idempotency-Key.'
    }
  ];

  const integrationHealthStore = [
    {
      id: 'satusehat',
      name: 'SATUSEHAT Kemenkes (FHIR R4 Adapter)',
      protocol: 'REST / FHIR R4 Bundle (OAuth2)',
      status: 'TERHUBUNG',
      latencyMs: 118,
      queueDepth: 3,
      idempotencyRate: '100%',
      lastSync: '2026-04-08 13:55:00'
    },
    {
      id: 'bpjs-vclaim',
      name: 'BPJS Kesehatan Middleware (VClaim & Antrean JKN)',
      protocol: 'REST + HMAC-SHA256 + LZ-String',
      status: 'TERHUBUNG',
      latencyMs: 142,
      queueDepth: 0,
      idempotencyRate: '100%',
      lastSync: '2026-04-08 13:57:12'
    },
    {
      id: 'hris-core',
      name: 'HRIS Kepegawaian & Payroll Inti',
      protocol: 'Internal mTLS / Sync Queue',
      status: 'TERHUBUNG',
      latencyMs: 34,
      queueDepth: 0,
      idempotencyRate: '100%',
      lastSync: '2026-04-08 13:50:00'
    },
    {
      id: 'async-mq',
      name: 'Async Message Queue (Notifikasi & Retry Idempoten)',
      protocol: 'Worker Queue (Dead-Letter Guarded)',
      status: 'TERHUBUNG',
      latencyMs: 19,
      queueDepth: 2,
      idempotencyRate: '100%',
      lastSync: '2026-04-08 13:58:01'
    }
  ];

  const landingAnalyticsStore = {
    totalVisits: 1842,
    byDevice: { Android: 964, iOS: 418, Desktop: 460 },
    byCta: { playstore: 612, appstore: 285, qr: 214, deeplink: 198, mobile_web: 341, portal: 512 },
    byUtmSource: { intranet: 740, qrcode_lobby: 520, whatsapp_hr: 392, direct: 190 },
    recentEvents: [
      { timestamp: '2026-04-08 13:45', device: 'Android', cta: 'playstore', utmSource: 'whatsapp_hr' },
      { timestamp: '2026-04-08 13:32', device: 'Desktop', cta: 'qr', utmSource: 'intranet' },
      { timestamp: '2026-04-08 13:18', device: 'iOS', cta: 'mobile_web', utmSource: 'qrcode_lobby' }
    ] as Array<{ timestamp: string; device: string; cta: string; utmSource: string }>
  };

  // =========================================================================
  // 2. GATEWAY HELPERS (SIEM LOG, RATE LIMIT, IDEMPOTENCY, RBAC+ABAC)
  // =========================================================================
  function appendSiemLog(params: {
    actorNip: string;
    actorName: string;
    divisionId: string;
    eventType: string;
    resource: string;
    decision: SiemAuditEntry['decision'];
    detail: string;
    ipAddress?: string;
  }) {
    const hash = crypto
      .createHash('sha256')
      .update(`${Date.now()}-${params.actorNip}-${params.eventType}-${params.resource}`)
      .digest('hex')
      .slice(0, 16);

    const entry: SiemAuditEntry = {
      id: `siem-${Date.now()}-${Math.floor(Math.random() * 999)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorNip: params.actorNip,
      actorName: params.actorName,
      divisionId: params.divisionId,
      eventType: params.eventType,
      resource: params.resource,
      decision: params.decision,
      detail: params.detail,
      ipAddress: params.ipAddress || '127.0.0.1',
      hash: `sha256:${hash}`
    };

    siemAuditTrail.unshift(entry);
    if (siemAuditTrail.length > 200) siemAuditTrail.pop();

    deps.createAuditLog?.({
      user_id: params.actorNip,
      user_name: params.actorName,
      action: `${params.eventType} [${params.decision}]`,
      module: 'PORTAL_KARYAWAN_GATEWAY',
      details: `${params.resource}: ${params.detail}`,
      ip_address: params.ipAddress,
      status: params.decision === 'DENY' ? 'FAILED' : params.decision === 'BREAK_GLASS' ? 'WARNING' : 'SUCCESS'
    });
  }

  function evaluateAccess(session: GatewaySession, division: DivisionDefinition) {
    const rolePolicy = rbacMatrix[session.portalRole];
    const reasons: string[] = [];

    // Clinical & EMR sensitive check via RBAC + ABAC
    let emrAccess: 'GRANTED' | 'LOCKED' | 'BREAK_GLASS' = 'GRANTED';
    if (abacPolicies.mfaRequiredForClinicalAndAdmin && (division.isClinical || division.isAdminCapable) && !session.mfaVerified) {
      emrAccess = 'LOCKED';
      reasons.push('MFA 6-digit wajib diselesaikan.');
    } else if (session.abac.breakGlassActive && abacPolicies.allowBreakGlassWithAudit && featureFlags.break_glass_emergency.enabled) {
      emrAccess = 'BREAK_GLASS';
      reasons.push(`Mode Darurat Break-Glass aktif (${session.abac.breakGlassReason || 'Penyelamatan Nyawa'}).`);
    } else {
      if (division.isClinical && abacPolicies.requireOnDutyForClinicalEmr && !session.abac.onDuty) {
        emrAccess = 'LOCKED';
        reasons.push('Atribut ABAC: Status jaga saat ini Off-Duty (akses EMR klinis dikunci).');
      }
      if (abacPolicies.requireUnitMatchForSensitiveActions && !session.abac.unitMatch) {
        emrAccess = 'LOCKED';
        reasons.push('Atribut ABAC: Lokasi unit kerja tidak cocok dengan unit layanan.');
      }
      if (division.isClinical && abacPolicies.requireCareRelationshipForPatientRecords && !session.abac.careRelationship) {
        emrAccess = 'LOCKED';
        reasons.push('Atribut ABAC: Tidak ada relasi perawatan aktif (DPJP/Perawat jaga) dengan pasien.');
      }
    }

    const adminAreaAccess = rolePolicy.canAccessAdminArea || session.isAdminCapable || session.divisionId === 'direktur';
    const oppeAccess = rolePolicy.canViewOppe && featureFlags.doctor_oppe_dashboard.enabled;
    const sbarAccess = featureFlags.sbar_bedside_handover.enabled;

    return {
      emrAccess,
      emrReasons: reasons,
      adminAreaAccess,
      oppeAccess,
      sbarAccess,
      offlineAttendanceEnabled: featureFlags.offline_attendance.enabled,
      shift40HourRuleEnforced: abacPolicies.enforce40HourShiftCap,
      roleLabel: rolePolicy.label
    };
  }

  function extractBearerToken(req: express.Request): string | null {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      return auth.slice(7).trim();
    }
    const queryToken = req.query.token;
    return typeof queryToken === 'string' && queryToken ? queryToken : null;
  }

  function requireGatewaySession(req: express.Request, res: express.Response): GatewaySession | null {
    const token = extractBearerToken(req);
    if (!token || !sessions.has(token)) {
      res.status(401).json({
        success: false,
        code: 'GATEWAY_UNAUTHORIZED',
        message: 'Sesi API Gateway tidak ditemukan atau telah berakhir. Silakan login kembali.'
      });
      return null;
    }
    return sessions.get(token)!;
  }

  // Sliding window rate limiter + Idempotency middleware for /api/gateway/*
  app.use('/api/gateway', (req, res, next) => {
    const ip = req.ip || '127.0.0.1';
    const now = Date.now();
    const history = (rateLimitMap.get(ip) || []).filter((ts) => now - ts < 60_000);
    history.push(now);
    rateLimitMap.set(ip, history);

    res.setHeader('X-Gateway-Version', 'MYITARU-GW-2026.1');
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, 180 - history.length)));

    if (history.length > 180) {
      return res.status(429).json({
        success: false,
        code: 'GATEWAY_RATE_LIMITED',
        message: 'Melebihi batas permintaan API Gateway (180 req/menit).'
      });
    }

    const idemKey = req.headers['idempotency-key'];
    if (req.method !== 'GET' && typeof idemKey === 'string' && idemKey.trim()) {
      const cacheKey = `${req.path}::${idemKey.trim()}`;
      const existing = idempotencyCache.get(cacheKey);
      if (existing) {
        res.setHeader('X-Idempotent-Replay', 'true');
        return res.status(existing.status).json(existing.body);
      }

      const originalJson = res.json.bind(res);
      res.json = ((body: unknown) => {
        idempotencyCache.set(cacheKey, { status: res.statusCode || 200, body, createdAt: Date.now() });
        return originalJson(body);
      }) as typeof res.json;
    }

    next();
  });

  // =========================================================================
  // 3. AUTHENTICATION & MANDATORY MFA OTP
  // =========================================================================
  app.post('/api/gateway/auth/login', (req, res) => {
    const { identifier, divisionId, authType, googleEmail, googleName, deviceInfo } = req.body || {};

    let user: EmployeeUserRecord | undefined;
    if (divisionId) {
      user = usersStore.find((u) => u.divisionId === divisionId);
    }
    if (!user && identifier) {
      const cleanId = String(identifier).trim().toLowerCase();
      user = usersStore.find(
        (u) => u.nip.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId || u.name.toLowerCase().includes(cleanId)
      );
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'NIP / Email pegawai tidak terdaftar di direktori HRIS. Gunakan pemilih divisi cepat atau hubungi SDM.'
      });
    }

    if (!user.active) {
      appendSiemLog({
        actorNip: user.nip,
        actorName: user.name,
        divisionId: user.divisionId,
        eventType: 'LOGIN_ATTEMPT',
        resource: 'Portal Karyawan Auth',
        decision: 'DENY',
        detail: 'Akun pegawai dalam status dinonaktifkan.',
        ipAddress: req.ip
      });
      return res.status(403).json({
        success: false,
        message: 'Akun pegawai dinonaktifkan oleh Administrator / Bagian SDM.'
      });
    }

    const effectiveName = authType === 'google' && googleName ? `${googleName} (${user.divisionName})` : user.name;
    const effectiveEmail = authType === 'google' && googleEmail ? googleEmail : user.email;

    const needsMfa = abacPolicies.mfaRequiredForClinicalAndAdmin && (user.isClinical || user.isAdminCapable);

    if (needsMfa) {
      const challengeId = 'mfa-' + crypto.randomUUID().slice(0, 8);
      mfaChallenges.set(challengeId, {
        challengeId,
        userId: user.id,
        otp: DEFAULT_DEMO_OTP,
        authType: authType === 'google' ? 'google' : 'nip',
        deviceInfo: String(deviceInfo || 'Browser Web Portal MYITARU'),
        expiresAt: Date.now() + 10 * 60 * 1000
      });

      appendSiemLog({
        actorNip: user.nip,
        actorName: effectiveName,
        divisionId: user.divisionId,
        eventType: 'MFA_CHALLENGE_ISSUED',
        resource: `MFA (${authType === 'google' ? 'Google SSO' : 'NIP'})`,
        decision: 'CHALLENGE',
        detail: `Tantangan OTP 6-digit diterbitkan untuk role sensitif (${user.divisionName}).`,
        ipAddress: req.ip
      });

      return res.json({
        success: true,
        mfaRequired: true,
        challengeId,
        demoOtpHint: DEFAULT_DEMO_OTP,
        userPreview: {
          nip: user.nip,
          name: effectiveName,
          email: effectiveEmail,
          divisionId: user.divisionId,
          divisionName: user.divisionName,
          roleTitle: user.roleTitle,
          isClinical: user.isClinical,
          isAdminCapable: user.isAdminCapable
        }
      });
    }

    // Standard role direct issue (MFA optional)
    const token = 'emp_' + crypto.randomBytes(16).toString('hex');
    const session: GatewaySession = {
      token,
      userId: user.id,
      nip: user.nip,
      name: effectiveName,
      email: effectiveEmail,
      divisionId: user.divisionId,
      divisionName: user.divisionName,
      roleTitle: user.roleTitle,
      portalRole: user.portalRole,
      isClinical: user.isClinical,
      isAdminCapable: user.isAdminCapable,
      mfaVerified: true,
      authType: authType === 'google' ? 'google' : 'nip',
      deviceFingerprint: `DEV-${user.nip.slice(-3)}-${String(deviceInfo || 'WEB').slice(0, 12).toUpperCase()}`,
      abac: {
        onDuty: true,
        unitMatch: true,
        careRelationship: true,
        breakGlassActive: false,
        breakGlassReason: ''
      },
      createdAt: new Date().toISOString()
    };
    sessions.set(token, session);

    appendSiemLog({
      actorNip: user.nip,
      actorName: effectiveName,
      divisionId: user.divisionId,
      eventType: 'GATEWAY_LOGIN',
      resource: 'Portal Karyawan',
      decision: 'ALLOW',
      detail: `Login berhasil (${session.authType.toUpperCase()}) dengan Device Binding ${session.deviceFingerprint}.`,
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      mfaRequired: false,
      token,
      session
    });
  });

  app.post('/api/gateway/auth/verify-mfa', (req, res) => {
    const { challengeId, otp, deviceName } = req.body || {};
    const challenge = mfaChallenges.get(String(challengeId || ''));

    if (!challenge || challenge.expiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Sesi tantangan MFA tidak ditemukan atau sudah kedaluwarsa.'
      });
    }

    const cleanOtp = String(otp || '').trim();
    if (cleanOtp !== challenge.otp && cleanOtp !== DEFAULT_DEMO_OTP) {
      const user = usersStore.find((u) => u.id === challenge.userId);
      appendSiemLog({
        actorNip: user?.nip || 'UNKNOWN',
        actorName: user?.name || 'Unknown User',
        divisionId: user?.divisionId || 'unknown',
        eventType: 'MFA_VERIFY_FAILED',
        resource: 'MFA 6-Digit OTP',
        decision: 'DENY',
        detail: 'Kode OTP MFA tidak valid.',
        ipAddress: req.ip
      });
      return res.status(401).json({
        success: false,
        message: `Kode OTP salah. Gunakan kode demo ${DEFAULT_DEMO_OTP}.`
      });
    }

    const user = usersStore.find((u) => u.id === challenge.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    mfaChallenges.delete(challenge.challengeId);
    const token = 'emp_' + crypto.randomBytes(16).toString('hex');
    const deviceFingerprint = `BND-${user.nip.slice(-3)}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    const session: GatewaySession = {
      token,
      userId: user.id,
      nip: user.nip,
      name: user.name,
      email: user.email,
      divisionId: user.divisionId,
      divisionName: user.divisionName,
      roleTitle: user.roleTitle,
      portalRole: user.portalRole,
      isClinical: user.isClinical,
      isAdminCapable: user.isAdminCapable,
      mfaVerified: true,
      authType: challenge.authType,
      deviceFingerprint,
      abac: {
        onDuty: true,
        unitMatch: true,
        careRelationship: true,
        breakGlassActive: false,
        breakGlassReason: ''
      },
      createdAt: new Date().toISOString()
    };

    sessions.set(token, session);

    appendSiemLog({
      actorNip: user.nip,
      actorName: user.name,
      divisionId: user.divisionId,
      eventType: 'MFA_VERIFIED_LOGIN',
      resource: 'Portal Karyawan + Device Binding',
      decision: 'ALLOW',
      detail: `MFA 6-digit terverifikasi (${challenge.authType.toUpperCase()}). Perangkat terikat: ${deviceName || challenge.deviceInfo} [${deviceFingerprint}].`,
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      token,
      session
    });
  });

  app.post('/api/gateway/auth/logout', (req, res) => {
    const token = extractBearerToken(req);
    if (token && sessions.has(token)) {
      const s = sessions.get(token)!;
      appendSiemLog({
        actorNip: s.nip,
        actorName: s.name,
        divisionId: s.divisionId,
        eventType: 'GATEWAY_LOGOUT',
        resource: 'Portal Karyawan',
        decision: 'ALLOW',
        detail: 'Sesi pengguna diakhiri secara aman.',
        ipAddress: req.ip
      });
      sessions.delete(token);
    }
    res.json({ success: true });
  });

  // =========================================================================
  // 4. BOOTSTRAP & LIVE ABAC CONTEXT EVALUATION
  // =========================================================================
  app.get('/api/gateway/bootstrap', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const division = HOSPITAL_DIVISIONS.find((d) => d.id === session.divisionId) || HOSPITAL_DIVISIONS[0];
    const user = usersStore.find((u) => u.id === session.userId) || usersStore[0];
    const access = evaluateAccess(session, division);

    res.json({
      success: true,
      session,
      user,
      division,
      access,
      abacPolicies,
      featureFlags,
      announcements: portalAnnouncements,
      governanceFrameworks: GOVERNANCE_FRAMEWORKS,
      geofence: HOSPITAL_GEOFENCE
    });
  });

  app.post('/api/gateway/abac-context', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const { onDuty, unitMatch, careRelationship, breakGlassActive, breakGlassReason } = req.body || {};
    if (typeof onDuty === 'boolean') session.abac.onDuty = onDuty;
    if (typeof unitMatch === 'boolean') session.abac.unitMatch = unitMatch;
    if (typeof careRelationship === 'boolean') session.abac.careRelationship = careRelationship;

    if (typeof breakGlassActive === 'boolean') {
      if (breakGlassActive && !abacPolicies.allowBreakGlassWithAudit) {
        return res.status(403).json({
          success: false,
          message: 'Kebijakan Break-Glass saat ini dinonaktifkan oleh Administrator.'
        });
      }
      session.abac.breakGlassActive = breakGlassActive;
      session.abac.breakGlassReason = breakGlassActive
        ? String(breakGlassReason || 'Penanganan Kegawatdaruratan Pasien (Kode Biru)')
        : '';
    }

    const division = HOSPITAL_DIVISIONS.find((d) => d.id === session.divisionId) || HOSPITAL_DIVISIONS[0];
    const access = evaluateAccess(session, division);

    appendSiemLog({
      actorNip: session.nip,
      actorName: session.name,
      divisionId: session.divisionId,
      eventType: session.abac.breakGlassActive ? 'ABAC_BREAK_GLASS' : 'ABAC_CONTEXT_EVALUATION',
      resource: `Unit ${division.name}`,
      decision: session.abac.breakGlassActive ? 'BREAK_GLASS' : access.emrAccess === 'LOCKED' ? 'DENY' : 'ALLOW',
      detail: `onDuty=${session.abac.onDuty}, unitMatch=${session.abac.unitMatch}, careRel=${session.abac.careRelationship}${session.abac.breakGlassActive ? ` | Alasan: ${session.abac.breakGlassReason}` : ''}`,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      abac: session.abac,
      access
    });
  });

  // =========================================================================
  // 5. CORE EMPLOYEE MODULES (ALL 9 MANDATORY MODULES)
  // =========================================================================
  app.get('/api/gateway/profile', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;
    const user = usersStore.find((u) => u.id === session.userId) || usersStore[0];
    const division = HOSPITAL_DIVISIONS.find((d) => d.id === session.divisionId) || HOSPITAL_DIVISIONS[0];

    res.json({
      success: true,
      user,
      division,
      contracts: {
        statusKepegawaian: 'Pegawai Tetap RS',
        tanggalMasuk: '2021-03-01',
        masaKerja: '5 Tahun 1 Bulan',
        penilaianTerakhir: '92.4 (Sangat Baik)'
      },
      licenses: division.isClinical
        ? [
            {
              id: 'lic-1',
              name: 'Surat Tanda Registrasi (STR)',
              number: user.strNumber || 'STR-3171-100991',
              expiry: user.strExpiry || '2026-06-15',
              daysRemaining: user.strExpiry === '2026-06-15' ? 68 : 940,
              status: user.strExpiry === '2026-06-15' ? 'Segera Perpanjang (<90 Hari)' : 'Aktif'
            },
            {
              id: 'lic-2',
              name: 'Surat Izin Praktik (SIP)',
              number: user.sipNumber || 'SIP-DKI-2201/2025',
              expiry: user.sipExpiry || '2027-09-20',
              daysRemaining: 530,
              status: 'Aktif'
            }
          ]
        : [
            {
              id: 'lic-3',
              name: 'Sertifikat K3 & PPI Rumah Sakit',
              number: `K3-MYITARU-${user.nip.slice(-3)}`,
              expiry: '2027-12-31',
              daysRemaining: 632,
              status: 'Aktif'
            }
          ]
    });
  });

  app.put('/api/gateway/profile', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;
    const user = usersStore.find((u) => u.id === session.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });

    const { email, unitLocation } = req.body || {};
    if (email) {
      user.email = String(email);
      session.email = user.email;
    }
    if (unitLocation) user.unitLocation = String(unitLocation);
    user.lastHrisSync = new Date().toISOString();

    appendSiemLog({
      actorNip: session.nip,
      actorName: session.name,
      divisionId: session.divisionId,
      eventType: 'PROFILE_SELF_UPDATE',
      resource: 'HRIS Profil 360',
      decision: 'ALLOW',
      detail: 'Pembaruan profil mandiri tersinkronisasi ke HRIS.',
      ipAddress: req.ip
    });

    res.json({ success: true, user });
  });

  // Shifts + 40 Hour Weekly Cap + Conflict Detection + Swap Approval
  app.get('/api/gateway/shifts', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const myShifts = shiftSchedulesStore.map((s) => ({
      ...s,
      nip: session.nip,
      employeeName: session.name,
      unit: s.shiftType === 'Libur' ? 'Istirahat Mingguan' : session.divisionName
    }));

    const totalWeeklyHours = myShifts.reduce((acc, s) => acc + s.hours, 0);
    const exceeds40 = totalWeeklyHours > 40;

    res.json({
      success: true,
      shifts: myShifts,
      totalWeeklyHours,
      maxLegalWeeklyHours: 40,
      exceeds40,
      swaps: shiftSwapsStore.filter((sw) => sw.divisionId === session.divisionId || session.isAdminCapable || session.divisionId === 'keperawatan' || sw.requesterNip === session.nip)
    });
  });

  app.post('/api/gateway/shifts/swap', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const { fromDate, fromShift, targetColleague, toDate, toShift, reason, extraHours } = req.body || {};
    const projectedHours = 38 + Number(extraHours || 0);
    const conflictWarning =
      abacPolicies.enforce40HourShiftCap && projectedHours > 40
        ? `Peringatan UU Ketenagakerjaan: Total jam kerja menjadi ${projectedHours} jam/minggu (melebihi batas 40 jam). Memerlukan justifikasi & persetujuan Atasan Unit.`
        : undefined;

    const newSwap = {
      id: 'swp-' + Date.now(),
      requesterName: session.name,
      requesterNip: session.nip,
      divisionId: session.divisionId,
      fromDate: String(fromDate || '2026-04-09'),
      fromShift: String(fromShift || 'Siang (14:00-21:00)'),
      targetColleague: String(targetColleague || 'Rekan Satu Unit'),
      toDate: String(toDate || '2026-04-11'),
      toShift: String(toShift || 'Pagi (07:00-14:00)'),
      reason: String(reason || 'Penyesuaian jadwal jaga unit'),
      weeklyHoursAfterSwap: projectedHours,
      conflictWarning,
      status: 'Menunggu Atasan Unit' as const,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    shiftSwapsStore.unshift(newSwap);

    appendSiemLog({
      actorNip: session.nip,
      actorName: session.name,
      divisionId: session.divisionId,
      eventType: 'SHIFT_SWAP_REQUEST',
      resource: 'Jadwal & Shift Unit',
      decision: 'ALLOW',
      detail: `Pengajuan tukar shift ${newSwap.fromDate} <-> ${newSwap.toDate} (${projectedHours} jam/minggu).`,
      ipAddress: req.ip
    });

    res.json({ success: true, swap: newSwap });
  });

  app.post('/api/gateway/shifts/approve', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;
    const { swapId, decision } = req.body || {};
    const target = shiftSwapsStore.find((s) => s.id === swapId);
    if (!target) return res.status(404).json({ success: false, message: 'Pengajuan tukar shift tidak ditemukan.' });

    target.status = decision === 'REJECT' ? 'Ditolak' : 'Disetujui';
    appendSiemLog({
      actorNip: session.nip,
      actorName: session.name,
      divisionId: session.divisionId,
      eventType: 'SHIFT_SWAP_APPROVAL',
      resource: target.id,
      decision: 'ALLOW',
      detail: `Tukar shift oleh ${target.requesterName} status diubah menjadi ${target.status}.`,
      ipAddress: req.ip
    });
    res.json({ success: true, swap: target });
  });

  // Attendance Geofencing + Biometric + Offline Sync
  app.get('/api/gateway/attendance', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const logs = attendanceLogsStore.filter(
      (l) => l.nip === 'GLOBAL' || l.nip === session.nip || l.divisionId === session.divisionId
    );

    res.json({
      success: true,
      geofence: HOSPITAL_GEOFENCE,
      offlineModeEnabled: featureFlags.offline_attendance.enabled,
      logs,
      monthlySummary: {
        hadirTepatWaktu: 19,
        terlambat: 0,
        lemburJam: 6.5,
        statusRekap: 'Memenuhi Target Kehadiran'
      }
    });
  });

  app.post('/api/gateway/attendance/clock', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const { type, lat, lng, biometricVerified, note, isOfflineReplay } = req.body || {};
    const userLat = typeof lat === 'number' ? lat : HOSPITAL_GEOFENCE.lat;
    const userLng = typeof lng === 'number' ? lng : HOSPITAL_GEOFENCE.lng;
    const distanceMeters = haversineMeters(userLat, userLng, HOSPITAL_GEOFENCE.lat, HOSPITAL_GEOFENCE.lng);
    const withinGeofence = distanceMeters <= HOSPITAL_GEOFENCE.radiusMeters;

    if (!withinGeofence && !isOfflineReplay && type !== 'KOREKSI') {
      appendSiemLog({
        actorNip: session.nip,
        actorName: session.name,
        divisionId: session.divisionId,
        eventType: 'ATTENDANCE_OUT_OF_GEOFENCE',
        resource: 'Absensi Geofencing',
        decision: 'DENY',
        detail: `Presensi ditolak karena radius ${distanceMeters}m > batas ${HOSPITAL_GEOFENCE.radiusMeters}m.`,
        ipAddress: req.ip
      });
      return res.status(400).json({
        success: false,
        distanceMeters,
        message: `Posisi Anda (${distanceMeters} m) berada di luar radius geofence RS (${HOSPITAL_GEOFENCE.radiusMeters} m). Gunakan opsi Koreksi atau aktifkan koordinat kampus RS.`
      });
    }

    const entry = {
      id: 'att-' + Date.now() + '-' + Math.floor(Math.random() * 100),
      nip: session.nip,
      employeeName: session.name,
      divisionId: session.divisionId,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: (type || 'MASUK') as 'MASUK' | 'PULANG' | 'LEMBUR' | 'KOREKSI',
      method: isOfflineReplay ? ('Offline Sync (Idempoten)' as const) : ('Geofencing + Biometrik' as const),
      distanceMeters,
      withinGeofence,
      biometricVerified: Boolean(biometricVerified ?? true),
      note: String(note || (withinGeofence ? 'Area Kampus MYITARU Klinik' : 'Koreksi / Tugas Luar')),
      idempotencyKey: typeof req.headers['idempotency-key'] === 'string' ? req.headers['idempotency-key'] : undefined
    };

    attendanceLogsStore.unshift(entry);
    appendSiemLog({
      actorNip: session.nip,
      actorName: session.name,
      divisionId: session.divisionId,
      eventType: `ATTENDANCE_${entry.type}`,
      resource: entry.method,
      decision: 'ALLOW',
      detail: `Presensi ${entry.type} tercatat (${entry.distanceMeters} m dari RS).`,
      ipAddress: req.ip
    });

    res.json({ success: true, entry });
  });

  app.post('/api/gateway/attendance/sync-offline', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    if (!featureFlags.offline_attendance.enabled) {
      return res.status(403).json({
        success: false,
        message: 'Feature flag absensi offline saat ini sedang dinonaktifkan.'
      });
    }

    const items = Array.isArray(req.body?.items) ? req.body.items : [];
    const synced: typeof attendanceLogsStore = [];
    let skippedDuplicates = 0;

    for (const item of items) {
      const idem = String(item.idempotencyKey || '');
      if (idem && attendanceLogsStore.some((existing) => existing.idempotencyKey === idem)) {
        skippedDuplicates += 1;
        continue;
      }

      const entry = {
        id: 'att-off-' + Date.now() + '-' + Math.floor(Math.random() * 999),
        nip: session.nip,
        employeeName: session.name,
        divisionId: session.divisionId,
        timestamp: String(item.capturedAt || new Date().toISOString().replace('T', ' ').slice(0, 19)),
        type: (item.type || 'MASUK') as 'MASUK' | 'PULANG' | 'LEMBUR' | 'KOREKSI',
        method: 'Offline Sync (Idempoten)' as const,
        distanceMeters: Number(item.distanceMeters || 42),
        withinGeofence: true,
        biometricVerified: true,
        note: String(item.note || 'Sinkronisasi antrean offline'),
        idempotencyKey: idem || undefined
      };
      attendanceLogsStore.unshift(entry);
      synced.push(entry);
    }

    appendSiemLog({
      actorNip: session.nip,
      actorName: session.name,
      divisionId: session.divisionId,
      eventType: 'ATTENDANCE_OFFLINE_SYNC',
      resource: 'Idempotent Queue Sync',
      decision: 'ALLOW',
      detail: `${synced.length} presensi offline disinkronkan (${skippedDuplicates} duplikat dicegah).`,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      syncedCount: synced.length,
      skippedDuplicates,
      synced
    });
  });

  // Leave Requests & Multi-Tier Approval
  app.get('/api/gateway/leaves', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;
    res.json({
      success: true,
      balances: {
        tahunanTotal: 12,
        tahunanTerpakai: 3,
        tahunanSisa: 9,
        izinDiklatTersisa: 5
      },
      requests: leaveRequestsStore
    });
  });

  app.post('/api/gateway/leaves', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const { type, startDate, endDate, days, substitute, reason } = req.body || {};
    const newLeave = {
      id: 'lv-' + Date.now(),
      nip: session.nip,
      employeeName: session.name,
      divisionId: session.divisionId,
      type: (type || 'Cuti Tahunan') as 'Cuti Tahunan' | 'Cuti Sakit' | 'Izin Pelatihan / Seminar' | 'Izin Khusus',
      startDate: String(startDate || '2026-04-24'),
      endDate: String(endDate || '2026-04-25'),
      days: Number(days || 2),
      substitute: String(substitute || 'Rekan Pengganti Unit'),
      reason: String(reason || 'Keperluan pribadi'),
      status: 'Menunggu Atasan Unit' as const,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    leaveRequestsStore.unshift(newLeave);
    appendSiemLog({
      actorNip: session.nip,
      actorName: session.name,
      divisionId: session.divisionId,
      eventType: 'LEAVE_SUBMITTED',
      resource: newLeave.id,
      decision: 'ALLOW',
      detail: `Pengajuan ${newLeave.type} (${newLeave.days} hari) menunggu approval Atasan Unit.`,
      ipAddress: req.ip
    });

    res.json({ success: true, leave: newLeave });
  });

  app.post('/api/gateway/leaves/approve', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;
    const { leaveId, action } = req.body || {};
    const item = leaveRequestsStore.find((l) => l.id === leaveId);
    if (!item) return res.status(404).json({ success: false, message: 'Pengajuan cuti tidak ditemukan.' });

    if (action === 'REJECT') {
      item.status = 'Ditolak';
    } else if (item.status === 'Menunggu Atasan Unit') {
      item.unitApprovedBy = session.name;
      item.status = 'Menunggu Verifikasi SDM';
    } else if (item.status === 'Menunggu Verifikasi SDM') {
      item.sdmApprovedBy = session.name;
      item.status = 'Disetujui Final';
    }

    appendSiemLog({
      actorNip: session.nip,
      actorName: session.name,
      divisionId: session.divisionId,
      eventType: 'LEAVE_WORKFLOW_STEP',
      resource: item.id,
      decision: 'ALLOW',
      detail: `Status pengajuan cuti ${item.employeeName} diperbarui menjadi ${item.status}.`,
      ipAddress: req.ip
    });

    res.json({ success: true, leave: item });
  });

  // Payroll & Reimbursement
  app.get('/api/gateway/payroll', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const baseSalary = session.isClinical ? 12500000 : session.isAdminCapable ? 10500000 : 7800000;
    const jasaMedis = session.isClinical ? 6400000 : 1850000;
    const tunjanganShift = 1150000;
    const bpjsKesehatanPot = 180000;
    const pph21 = Math.round((baseSalary + jasaMedis) * 0.04);
    const takeHomePay = baseSalary + jasaMedis + tunjanganShift - bpjsKesehatanPot - pph21;

    res.json({
      success: true,
      currentSlip: {
        periode: 'Maret 2026',
        nip: session.nip,
        nama: session.name,
        unit: session.divisionName,
        gajiPokok: baseSalary,
        jasaPelayanan: jasaMedis,
        tunjanganShiftLembur: tunjanganShift,
        potonganBpjs: bpjsKesehatanPot,
        potonganPajak: pph21,
        takeHomePay,
        statusPembayaran: 'Sudah Ditransfer (Mandiri Payroll)'
      },
      reimbursements: reimbursementsStore
    });
  });

  app.post('/api/gateway/payroll/reimburse', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const { title, category, amount } = req.body || {};
    const newItem = {
      id: 'rmb-' + Date.now(),
      nip: session.nip,
      employeeName: session.name,
      title: String(title || 'Klaim Pelatihan / Operasional'),
      category: (category || 'Diklat / SKP') as 'Diklat / SKP' | 'Perjalanan Dinas' | 'Kesehatan Pegawai' | 'Operasional Unit',
      amount: Number(amount || 500000),
      date: new Date().toISOString().split('T')[0],
      status: 'Diajukan' as const
    };
    reimbursementsStore.unshift(newItem);
    res.json({ success: true, reimbursement: newItem });
  });

  // Training & SOP
  const trainingCatalog = [
    { id: 'trn-1', code: 'SOP-PPI-01', type: 'SOP Wajib', title: 'Kepatuhan Kebersihan Tangan 6 Langkah & 5 Momen WHO', unit: 'Komite PPI', status: 'Dibaca & Disetujui', enrolled: true, skp: 2 },
    { id: 'trn-2', code: 'DIKLAT-BHD-26', type: 'Pelatihan Wajib', title: 'Bantuan Hidup Dasar (BHD) & Code Blue Response 2026', unit: 'Instalasi Diklat', status: 'Terjadwal 19 Apr 2026', enrolled: false, skp: 4 },
    { id: 'trn-3', code: 'SEC-UUPDP-26', type: 'Pelatihan Kepatuhan', title: 'Pelindungan Data Pribadi Pasien (UU PDP & PMK 24/2022)', unit: 'Hukum & SIMK/TI', status: 'Sertifikat Aktif', enrolled: true, skp: 3 },
    { id: 'trn-4', code: 'SOP-SBAR-04', type: 'SOP Klinis', title: 'Komunikasi Efektif SBAR Saat Serah Terima Shift & Konsul DPJP', unit: 'Komite Mutu & Keperawatan', status: 'Wajib Tahunan', enrolled: false, skp: 2 }
  ];

  app.get('/api/gateway/training', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;
    res.json({
      success: true,
      courses: trainingCatalog,
      certificates: [
        { name: 'Bantuan Hidup Dasar (BHD)', validUntil: '2027-01-15', status: 'Aktif' },
        { name: 'Keamanan Informasi Kesehatan (PMK 24/2022)', validUntil: '2026-06-30', status: 'Perlu Resertifikasi' }
      ]
    });
  });

  app.post('/api/gateway/training/enroll', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;
    const { courseId } = req.body || {};
    const course = trainingCatalog.find((c) => c.id === courseId);
    if (!course) return res.status(404).json({ success: false, message: 'Pelatihan tidak ditemukan.' });
    course.enrolled = true;
    course.status = 'Terdaftar (Menunggu Jadwal)';
    res.json({ success: true, course });
  });

  // Performance KPI & Doctor OPPE
  app.get('/api/gateway/performance', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;
    const division = HOSPITAL_DIVISIONS.find((d) => d.id === session.divisionId) || HOSPITAL_DIVISIONS[0];
    const access = evaluateAccess(session, division);

    res.json({
      success: true,
      individualKpi: {
        periode: 'Kuartal I 2026',
        totalScore: 93.2,
        predikat: 'Sangat Baik (Memenuhi Target RS)',
        dimensions: [
          { label: 'Kuantitas & Beban Kerja Unit', score: 94, target: 90, weight: '30%' },
          { label: 'Kualitas & Akurasi Dokumentasi', score: 95, target: 90, weight: '30%' },
          { label: 'Perilaku Profesional & Disiplin Shift', score: 92, target: 85, weight: '25%' },
          { label: 'Kepatuhan K3 / PPI & Risiko Jabatan', score: 91, target: 88, weight: '15%' }
        ]
      },
      oppeVisible: access.oppeAccess,
      doctorOppeMetrics: access.oppeAccess
        ? [
            { doctor: 'dr. Budi Santoso, Sp.PD', ksm: 'Penyakit Dalam', alosDays: 3.8, mortalityRate: '0.4%', fornasCompliance: '97.2%', resumeUnder24h: '98.5%', status: 'Memenuhi Standar' },
            { doctor: 'dr. Bambang Alamsyah, Sp.B', ksm: 'Bedah Umum', alosDays: 3.1, mortalityRate: '0.2%', fornasCompliance: '95.8%', resumeUnder24h: '96.4%', status: 'Memenuhi Standar' },
            { doctor: 'dr. Hendra Wijaya, Sp.JP', ksm: 'Kardiologi', alosDays: 4.2, mortalityRate: '0.8%', fornasCompliance: '98.1%', resumeUnder24h: '99.0%', status: 'Memenuhi Standar' }
          ]
        : []
    });
  });

  // SBAR Handover + Internal Directory + Announcements
  app.get('/api/gateway/sbar', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;
    res.json({
      success: true,
      handovers: sbarHandoversStore,
      announcements: portalAnnouncements,
      directory: usersStore.slice(0, 18).map((u) => ({
        nip: u.nip,
        name: u.name,
        divisionName: u.divisionName,
        roleTitle: u.roleTitle,
        email: u.email,
        shiftPattern: u.shiftPattern
      }))
    });
  });

  app.post('/api/gateway/sbar', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const { unit, sessionType, fromShift, toShift, receiverName, patientLabel, situation, background, assessment, recommendation } = req.body || {};
    const entry = {
      id: 'sbar-' + Date.now(),
      unit: String(unit || session.divisionName),
      divisionId: session.divisionId,
      sessionType: (sessionType === 'Nurse Station (Terjadwal)' ? 'Nurse Station (Terjadwal)' : 'Bedside Handover') as
        | 'Nurse Station (Terjadwal)'
        | 'Bedside Handover',
      fromShift: String(fromShift || session.divisionName),
      toShift: String(toShift || 'Shift Berikutnya'),
      senderName: session.name,
      receiverName: String(receiverName || 'Petugas Shift Pengganti'),
      patientLabel: String(patientLabel || 'Pasien Unit'),
      situation: String(situation || ''),
      background: String(background || ''),
      assessment: String(assessment || ''),
      recommendation: String(recommendation || ''),
      karuVerified: false,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    sbarHandoversStore.unshift(entry);
    appendSiemLog({
      actorNip: session.nip,
      actorName: session.name,
      divisionId: session.divisionId,
      eventType: 'SBAR_HANDOVER_CREATED',
      resource: entry.patientLabel,
      decision: 'ALLOW',
      detail: `Handover ${entry.sessionType} diserahkan ke ${entry.receiverName}.`,
      ipAddress: req.ip
    });

    res.json({ success: true, handover: entry });
  });

  app.post('/api/gateway/sbar/verify', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;
    const { sbarId } = req.body || {};
    const item = sbarHandoversStore.find((h) => h.id === sbarId);
    if (!item) return res.status(404).json({ success: false, message: 'Catatan SBAR tidak ditemukan.' });
    item.karuVerified = true;
    item.karuName = session.name;
    res.json({ success: true, handover: item });
  });

  // Helpdesk TI & HR (accessible both authenticated & from landing page support form)
  app.get('/api/gateway/helpdesk', (req, res) => {
    res.json({
      success: true,
      tickets: helpdeskTicketsStore,
      emergencyContacts: [
        { label: 'Service Desk TI / SIMK (24 Jam)', phone: 'Ext. 1100 / 0811-900-1100', sla: 'Respon < 15 Menit (P1)' },
        { label: 'HR Helpdesk & Payroll', phone: 'Ext. 1205', sla: 'Hari Kerja 08:00 - 16:30' },
        { label: 'Code Blue / Kegawatdaruratan Internal', phone: 'Ext. 911', sla: 'Segera < 3 Menit' },
        { label: 'Data Protection Officer (UU PDP)', phone: 'dpo@rs-myitaru.id', sla: 'Eskalasi Keamanan Data' }
      ],
      faqs: [
        { q: 'Bagaimana jika kode OTP MFA tidak diterima saat login?', a: 'Pada lingkungan demo gunakan kode 123456, atau klik "Buat Tiket TI" bila perangkat baru belum terikat.' },
        { q: 'Apakah absensi tetap tercatat di area basement / ambulans tanpa sinyal?', a: 'Ya. Aktifkan Mode Offline di aplikasi mobile karyawan. Data disimpan terenkripsi dan otomatis disinkronkan menggunakan Idempotency-Key.' },
        { q: 'Mengapa tombol Rekam Medis terkunci saat Off-Duty?', a: 'Kebijakan ABAC (Attribute-Based Access Control) sesuai PMK 24/2022 membatasi akses EMR di luar jadwal jaga, kecuali menggunakan protokol darurat Break-Glass yang diaudit.' }
      ]
    });
  });

  app.post('/api/gateway/helpdesk', (req, res) => {
    const token = extractBearerToken(req);
    const session = token ? sessions.get(token) : undefined;
    const { requesterName, requesterContact, divisionName, category, priority, subject, description, source } = req.body || {};

    const ticket = {
      id: 'tkt-' + Date.now(),
      ticketNo: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      requesterName: String(requesterName || session?.name || 'Karyawan RS'),
      requesterContact: String(requesterContact || session?.nip || 'Eksternal'),
      divisionName: String(divisionName || session?.divisionName || 'Umum / Pengunjung Landing Page'),
      category: (category || 'TI / SIMK & MFA') as
        | 'TI / SIMK & MFA'
        | 'HR & Absensi / Payroll'
        | 'Instalasi Aplikasi Mobile'
        | 'Sarana / Medis',
      priority: (priority || 'P2 - Tinggi (1 Jam)') as 'P1 - Kritis (15 Menit)' | 'P2 - Tinggi (1 Jam)' | 'P3 - Normal (4 Jam)',
      subject: String(subject || 'Permintaan Bantuan Layanan'),
      description: String(description || '-'),
      source: (source === 'Landing Page App' ? 'Landing Page App' : 'Portal Karyawan') as 'Portal Karyawan' | 'Landing Page App',
      status: 'Terbuka' as const,
      assignedTeam: category === 'HR & Absensi / Payroll' ? 'SDM & Payroll Service' : 'Service Desk TI (ITIL 4)',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    helpdeskTicketsStore.unshift(ticket);
    appendSiemLog({
      actorNip: session?.nip || ticket.requesterContact,
      actorName: ticket.requesterName,
      divisionId: session?.divisionId || 'landing',
      eventType: 'HELPDESK_TICKET_CREATED',
      resource: ticket.ticketNo,
      decision: 'ALLOW',
      detail: `[${ticket.priority}] ${ticket.subject}`,
      ipAddress: req.ip
    });

    res.json({ success: true, ticket });
  });

  app.post('/api/gateway/helpdesk/resolve', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;
    const { ticketId, status } = req.body || {};
    const t = helpdeskTicketsStore.find((item) => item.id === ticketId);
    if (!t) return res.status(404).json({ success: false, message: 'Tiket tidak ditemukan.' });
    t.status = status === 'Selesai' ? 'Selesai' : 'Ditangani ITIL L1/L2';
    res.json({ success: true, ticket: t });
  });

  // =========================================================================
  // 6. ALL 34 DIVISION-SPECIFIC WORKSPACES (RBAC + ABAC PROTECTED)
  // =========================================================================
  app.get('/api/gateway/divisions/:divisionId/workspace', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const div = HOSPITAL_DIVISIONS.find((d) => d.id === req.params.divisionId);
    if (!div) {
      return res.status(404).json({ success: false, message: 'Divisi rumah sakit tidak ditemukan.' });
    }

    const access = evaluateAccess(session, div);
    const divisionActions = divisionActionState.get(div.id) || {};

    const worklist = div.specificModules.map((modName, idx) => {
      const itemId = `${div.id}-task-${idx + 1}`;
      const isClinicalLocked = div.isClinical && access.emrAccess === 'LOCKED';
      const defaultStatus = isClinicalLocked
        ? 'Terkunci (ABAC)'
        : idx === 0
        ? 'Prioritas Aktif'
        : idx === 1
        ? 'Dalam Proses'
        : 'Terpantau Baik';

      return {
        id: itemId,
        moduleTitle: modName,
        referenceCode: `${div.id.toUpperCase().slice(0, 4)}-2026-0${idx + 1}`,
        assignedUnit: div.name,
        sensitivity: div.abacSensitivity,
        metricSummary:
          idx === 0
            ? `${4 + ((div.name.length + idx) % 12)} item memerlukan verifikasi`
            : idx === 1
            ? `SLA Unit: 98.${(div.name.length % 7) + 2}% terpenuhi`
            : 'Sinkron API Gateway (FHIR/HRIS)',
        status: divisionActions[itemId] || defaultStatus,
        requiresEmrClearance: div.isClinical
      };
    });

    res.json({
      success: true,
      division: div,
      access,
      kpis: [
        { label: 'Kepatuhan Standar Unit', value: '97.8%', hint: 'Target >= 95%' },
        { label: 'Beban Tugas Shift Berjalan', value: `${6 + (div.name.length % 9)} Item`, hint: div.defaultShift },
        { label: 'Kesiapan SDM Terjadwal', value: '100% Terpenuhi', hint: 'Batas 40 jam/minggu aman' }
      ],
      worklist
    });
  });

  app.post('/api/gateway/divisions/:divisionId/action', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const div = HOSPITAL_DIVISIONS.find((d) => d.id === req.params.divisionId);
    if (!div) return res.status(404).json({ success: false, message: 'Divisi tidak ditemukan.' });

    const access = evaluateAccess(session, div);
    if (div.isClinical && access.emrAccess === 'LOCKED') {
      appendSiemLog({
        actorNip: session.nip,
        actorName: session.name,
        divisionId: session.divisionId,
        eventType: 'ABAC_POLICY_BLOCK',
        resource: `${div.name} (${req.body?.taskId || 'task'})`,
        decision: 'DENY',
        detail: access.emrReasons.join(' '),
        ipAddress: req.ip
      });
      return res.status(403).json({
        success: false,
        message: `Aksi ditolak kebijakan ABAC: ${access.emrReasons.join(' ')}`
      });
    }

    const { taskId, newStatus } = req.body || {};
    const state = divisionActionState.get(div.id) || {};
    state[String(taskId)] = String(newStatus || 'Selesai Diverifikasi');
    divisionActionState.set(div.id, state);

    appendSiemLog({
      actorNip: session.nip,
      actorName: session.name,
      divisionId: session.divisionId,
      eventType: access.emrAccess === 'BREAK_GLASS' ? 'BREAK_GLASS_CLINICAL_ACTION' : 'DIVISION_TASK_UPDATED',
      resource: `${div.name} :: ${taskId}`,
      decision: access.emrAccess === 'BREAK_GLASS' ? 'BREAK_GLASS' : 'ALLOW',
      detail: `Status item diperbarui menjadi "${state[String(taskId)]}".`,
      ipAddress: req.ip
    });

    res.json({ success: true, taskId, status: state[String(taskId)] });
  });

  // =========================================================================
  // 7. AREA ADMIN & GOVERNANCE (CHANGE APPROVAL, SIEM, INTEGRATIONS)
  // =========================================================================
  app.get('/api/gateway/admin/state', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const division = HOSPITAL_DIVISIONS.find((d) => d.id === session.divisionId) || HOSPITAL_DIVISIONS[0];
    const access = evaluateAccess(session, division);
    if (!access.adminAreaAccess) {
      appendSiemLog({
        actorNip: session.nip,
        actorName: session.name,
        divisionId: session.divisionId,
        eventType: 'ADMIN_AREA_FORBIDDEN',
        resource: 'Area Admin Portal Karyawan',
        decision: 'DENY',
        detail: 'Pengguna tidak memiliki peran Admin/Direksi/SPI/DPO untuk membuka Area Admin.',
        ipAddress: req.ip
      });
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak: Area Admin & Tata Kelola hanya untuk Unit SIMK/TI, SDM, Direksi, SPI, atau Hukum & Etik.'
      });
    }

    res.json({
      success: true,
      users: usersStore,
      rbacMatrix,
      abacPolicies,
      featureFlags,
      announcements: portalAnnouncements,
      proposals: configChangeProposals,
      changelog: governanceChangelog,
      siemAuditTrail: siemAuditTrail.slice(0, 60),
      integrations: integrationHealthStore,
      analyticsSummary: {
        totalActiveEmployees: usersStore.filter((u) => u.active).length,
        divisionsCovered: HOSPITAL_DIVISIONS.length,
        activeSessions: sessions.size,
        pendingApprovals: configChangeProposals.filter((p) => p.status === 'PENDING_REVIEW').length + leaveRequestsStore.filter((l) => l.status !== 'Disetujui Final' && l.status !== 'Ditolak').length,
        complianceScore: '99.4%'
      }
    });
  });

  app.post('/api/gateway/admin/users', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const { action, userId, name, nip, divisionId } = req.body || {};
    if (action === 'HRIS_SYNC') {
      const now = new Date().toISOString();
      usersStore.forEach((u) => {
        u.lastHrisSync = now;
      });
      appendSiemLog({
        actorNip: session.nip,
        actorName: session.name,
        divisionId: session.divisionId,
        eventType: 'HRIS_DIRECTORY_SYNC',
        resource: 'HRIS -> Portal Karyawan',
        decision: 'ALLOW',
        detail: `Sinkronisasi ${usersStore.length} akun pegawai dari sumber kebenaran HRIS selesai.`,
        ipAddress: req.ip
      });
      return res.json({ success: true, users: usersStore, message: 'Sinkronisasi HRIS selesai.' });
    }

    if (action === 'TOGGLE_ACTIVE' && userId) {
      const u = usersStore.find((item) => item.id === userId);
      if (u) {
        u.active = !u.active;
        appendSiemLog({
          actorNip: session.nip,
          actorName: session.name,
          divisionId: session.divisionId,
          eventType: 'USER_STATUS_TOGGLE',
          resource: u.nip,
          decision: 'ALLOW',
          detail: `Akun ${u.name} diubah menjadi ${u.active ? 'Aktif' : 'Nonaktif'}.`,
          ipAddress: req.ip
        });
        return res.json({ success: true, user: u });
      }
    }

    if (action === 'CREATE' && name && nip) {
      const div = HOSPITAL_DIVISIONS.find((d) => d.id === divisionId) || HOSPITAL_DIVISIONS[0];
      const newUser: EmployeeUserRecord = {
        id: 'emp-' + Date.now(),
        nip: String(nip),
        email: `${String(nip).toLowerCase().replace(/[^a-z0-9]/g, '')}@rs-myitaru.id`,
        name: String(name),
        divisionId: div.id,
        divisionName: div.name,
        roleTitle: div.sampleRoles[0] || div.name,
        portalRole: mapPortalRole(div),
        isClinical: div.isClinical,
        isAdminCapable: div.isAdminCapable,
        active: true,
        unitLocation: div.name,
        shiftPattern: div.defaultShift,
        lastHrisSync: new Date().toISOString()
      };
      usersStore.unshift(newUser);
      return res.json({ success: true, user: newUser });
    }

    res.status(400).json({ success: false, message: 'Aksi user tidak valid.' });
  });

  // Segregation-of-duties Change Proposal & Reviewer Approval
  app.post('/api/gateway/admin/propose-change', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const { category, title, targetKey, proposedValue, justification } = req.body || {};
    const proposal: ConfigChangeProposal = {
      id: 'chg-' + Date.now(),
      proposedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      proposedBy: `${session.name} (${session.divisionName})`,
      category: category || 'FEATURE_FLAG',
      title: String(title || 'Usulan Perubahan Konfigurasi'),
      targetKey: String(targetKey || 'offline_attendance'),
      proposedValue,
      justification: String(justification || 'Peningkatan tata kelola ITIL 4 & COBIT 2019'),
      status: 'PENDING_REVIEW'
    };

    configChangeProposals.unshift(proposal);
    appendSiemLog({
      actorNip: session.nip,
      actorName: session.name,
      divisionId: session.divisionId,
      eventType: 'CONFIG_CHANGE_PROPOSED',
      resource: `${proposal.category} :: ${proposal.targetKey}`,
      decision: 'CHALLENGE',
      detail: `Usulan perubahan "${proposal.title}" menunggu Reviewer Keamanan/Kepatuhan.`,
      ipAddress: req.ip
    });

    res.json({ success: true, proposal });
  });

  app.post('/api/gateway/admin/review-change', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const { proposalId, decision, reviewNote } = req.body || {};
    const proposal = configChangeProposals.find((p) => p.id === proposalId);
    if (!proposal) return res.status(404).json({ success: false, message: 'Usulan perubahan tidak ditemukan.' });

    proposal.reviewedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    proposal.reviewedBy = `${session.name} (Reviewer Keamanan/Kepatuhan)`;
    proposal.reviewNote = String(reviewNote || (decision === 'APPROVE' ? 'Memenuhi syarat ISO 27001 & UU PDP' : 'Perlu kajian ulang risiko'));

    if (decision === 'REJECT') {
      proposal.status = 'REJECTED';
      appendSiemLog({
        actorNip: session.nip,
        actorName: session.name,
        divisionId: session.divisionId,
        eventType: 'CONFIG_CHANGE_REJECTED',
        resource: proposal.id,
        decision: 'DENY',
        detail: `${proposal.title} ditolak: ${proposal.reviewNote}`,
        ipAddress: req.ip
      });
      return res.json({ success: true, proposal, changelog: governanceChangelog });
    }

    proposal.status = 'APPROVED';

    // Apply atomically to live policy / flag / announcement
    if (proposal.category === 'FEATURE_FLAG' && featureFlags[proposal.targetKey]) {
      featureFlags[proposal.targetKey].enabled = Boolean(proposal.proposedValue);
    } else if (proposal.category === 'ABAC_POLICY' && proposal.targetKey in abacPolicies) {
      (abacPolicies as unknown as Record<string, boolean>)[proposal.targetKey] = Boolean(proposal.proposedValue);
    } else if (proposal.category === 'PORTAL_CONTENT' && proposal.proposedValue && typeof proposal.proposedValue === 'object') {
      const val = proposal.proposedValue as { title?: string; summary?: string; category?: string };
      portalAnnouncements.unshift({
        id: 'ann-' + Date.now(),
        title: val.title || proposal.title,
        category: val.category || 'Pengumuman Resmi',
        priority: 'Penting',
        publishedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        author: proposal.proposedBy,
        summary: val.summary || proposal.justification
      });
    }

    governanceChangelog.unshift({
      id: 'clog-' + Date.now(),
      appliedAt: proposal.reviewedAt,
      proposalId: proposal.id,
      category: proposal.category,
      title: proposal.title,
      approvedBy: proposal.reviewedBy,
      summary: `${proposal.targetKey} = ${JSON.stringify(proposal.proposedValue)}`
    });

    appendSiemLog({
      actorNip: session.nip,
      actorName: session.name,
      divisionId: session.divisionId,
      eventType: 'CONFIG_CHANGE_APPLIED',
      resource: `${proposal.category} :: ${proposal.targetKey}`,
      decision: 'ALLOW',
      detail: `Disetujui & diterapkan secara atomik oleh ${proposal.reviewedBy}.`,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      proposal,
      featureFlags,
      abacPolicies,
      announcements: portalAnnouncements,
      changelog: governanceChangelog
    });
  });

  app.post('/api/gateway/admin/integrations/test', (req, res) => {
    const session = requireGatewaySession(req, res);
    if (!session) return;

    const { integrationId } = req.body || {};
    const target = integrationHealthStore.find((i) => i.id === integrationId);
    if (!target) return res.status(404).json({ success: false, message: 'Layanan integrasi tidak ditemukan.' });

    target.latencyMs = Math.max(14, Math.round(target.latencyMs * 0.75));
    target.queueDepth = 0;
    target.lastSync = new Date().toISOString().replace('T', ' ').slice(0, 19);

    appendSiemLog({
      actorNip: session.nip,
      actorName: session.name,
      divisionId: session.divisionId,
      eventType: 'INTEGRATION_IDEMPOTENT_TEST',
      resource: target.name,
      decision: 'ALLOW',
      detail: `Uji koneksi & retry queue idempoten berhasil (${target.latencyMs}ms, antrean kosong).`,
      ipAddress: req.ip
    });

    res.json({ success: true, integration: target });
  });

  // =========================================================================
  // 8. PUBLIC LANDING PAGE ANALYTICS (/app-karyawan)
  // =========================================================================
  app.get('/api/gateway/landing-analytics', (_req, res) => {
    res.json({
      success: true,
      analytics: landingAnalyticsStore
    });
  });

  app.post('/api/gateway/landing-analytics', (req, res) => {
    const { device, cta, utmSource, isVisit } = req.body || {};
    const cleanDevice = device === 'iOS' ? 'iOS' : device === 'Android' ? 'Android' : 'Desktop';
    const cleanUtm = String(utmSource || 'direct');

    if (isVisit) {
      landingAnalyticsStore.totalVisits += 1;
      landingAnalyticsStore.byDevice[cleanDevice] += 1;
    }

    if (cta && cta in landingAnalyticsStore.byCta) {
      const k = cta as keyof typeof landingAnalyticsStore.byCta;
      landingAnalyticsStore.byCta[k] += 1;
    }

    if (cleanUtm in landingAnalyticsStore.byUtmSource) {
      const u = cleanUtm as keyof typeof landingAnalyticsStore.byUtmSource;
      landingAnalyticsStore.byUtmSource[u] += 1;
    }

    if (cta) {
      landingAnalyticsStore.recentEvents.unshift({
        timestamp: new Date().toISOString().replace('T', ' ').slice(11, 16),
        device: cleanDevice,
        cta: String(cta),
        utmSource: cleanUtm
      });
      if (landingAnalyticsStore.recentEvents.length > 10) {
        landingAnalyticsStore.recentEvents.pop();
      }
    }

    res.json({
      success: true,
      analytics: landingAnalyticsStore
    });
  });
}
