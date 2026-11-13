import crypto from 'crypto';
import type express from 'express';
import { MASTER_POLIKLINIK, SEMUA_DOKTER } from '../data/seedData';
import {
  generateAllPatientsWithResumes,
  generate50LabAndRadRequests,
  type PatientFullRecord,
  type ClinicalResume
} from '../data/patientPelayananData';

export interface ServerPatientRecord {
  id: string;
  no_rm: string;
  nik: string;
  nama: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  alamat: string;
  no_hp: string;
  golongan_darah: string;
  penjamin: string;
  no_bpjs?: string;
  status: 'Rawat Jalan' | 'Rawat Inap' | 'IGD' | 'Selesai';
  alergi?: string[];
  riwayat_penyakit?: string[];
  created_at: string;
}

export interface ServerAppointmentRecord {
  id: string;
  pasien_id: string;
  pasien_nama: string;
  no_rm: string;
  poli: string;
  dokter: string;
  tanggal: string;
  jam_praktek: string;
  nomor_antrian: string;
  status: 'Menunggu' | 'Panggil' | 'Diperiksa' | 'Selesai' | 'Dibatalkan';
  tipe: 'Rawat Jalan' | 'IGD' | 'Konsultasi';
  created_at: string;
}

export interface ServerBedRecord {
  id: string;
  bangsal: string;
  ruangan: string;
  nomor_bed: string;
  kelas: string;
  status: string;
  pasien_nama?: string;
  no_rm?: string;
  tanggal_masuk?: string;
  tarif_per_hari: number;
}

interface PatientSession {
  token: string;
  no_rm: string;
  authMethod: 'rm_dob' | 'google';
  email?: string;
  verifiedAt: string;
}

export interface PatientDossierPayload {
  patient: {
    id: string;
    no_rm: string;
    nama: string;
    nik_masked: string;
    tanggal_lahir: string;
    jenis_kelamin: 'L' | 'P';
    golongan_darah: string;
    penjamin: string;
    no_bpjs?: string;
    no_hp: string;
    alamat: string;
    status: string;
  };
  authMethod: 'rm_dob' | 'google';
  linkedEmail?: string;
  activeQueues: Array<{
    id: string;
    poli: string;
    dokter: string;
    tanggal: string;
    jam_praktek: string;
    nomor_antrian: string;
    status: string;
    tipe: string;
    estimasi_menit: number;
    poli_sedang_dipanggil: string;
  }>;
  allergies: Array<{ allergen: string; reaction: string; severity: string }>;
  vitalsLatest: {
    date: string;
    bp: string;
    hr: string;
    temp: string;
    rr: string;
    spo2: string;
    bb: string;
    tb: string;
  } | null;
  clinicalResume: ClinicalResume | null;
  problemList: Array<{ nama: string; kode_icd10: string; severity: string; status: string }>;
  medications: Array<{ name: string; dose: string; frequency: string; status: string }>;
  labRadResults: Array<{
    id: string;
    jenis: string;
    pemeriksaan: string;
    tanggal: string;
    dokter: string;
    status: string;
    hasil: string;
    loinc?: string;
  }>;
  billing: {
    invoiceNumber: string;
    penjamin: string;
    status: 'Ditanggung BPJS' | 'Lunas' | 'Menunggu Pembayaran';
    totalBiaya: number;
    ditanggungPenjamin: number;
    sisaTagihan: number;
    items: Array<{ nama: string; kategori: string; nominal: number }>;
  };
  inpatientStay: {
    bangsal: string;
    ruangan: string;
    nomor_bed: string;
    kelas: string;
    tanggal_masuk?: string;
  } | null;
}

function normalizeRm(val: string): string {
  return String(val || '').trim().toUpperCase();
}

function normalizeDob(val: string): string {
  return String(val || '').trim().slice(0, 10);
}

function maskNik(nik: string): string {
  if (!nik || nik.length < 8) return '3171••••••••0001';
  return `${nik.slice(0, 6)}••••••${nik.slice(-4)}`;
}

export function registerPatientPortalRoutes(
  app: express.Express,
  deps: {
    patientsStore: ServerPatientRecord[];
    appointmentsStore: ServerAppointmentRecord[];
    bedsStore: ServerBedRecord[];
    createAuditLog?: (entry: {
      user: string;
      role: string;
      action: string;
      module: string;
      ip: string;
      status: 'SUCCESS' | 'FAILED' | 'WARNING';
      details: string;
    }) => void;
  }
) {
  const { patientsStore, appointmentsStore, bedsStore, createAuditLog } = deps;

  // Lazy-seeded rich clinical records + lab/rad dataset
  const fullClinicalPatients: PatientFullRecord[] = generateAllPatientsWithResumes();
  const labRadDataset = generate50LabAndRadRequests();

  // Map email -> no_rm for Google-authenticated patients
  const googlePatientLinks = new Map<string, string>([
    ['dimzzthareza231@gmail.com', 'RM-260101-0001']
  ]);

  // Active verified patient session tokens
  const patientSessions = new Map<string, PatientSession>();

  const doctorServedBoost = new Map<string, number>();

  function findRichPatientByRm(noRmRaw: string): {
    core?: ServerPatientRecord;
    rich?: PatientFullRecord;
  } {
    const targetRm = normalizeRm(noRmRaw);
    const core = patientsStore.find((p) => normalizeRm(p.no_rm) === targetRm);
    const rich = fullClinicalPatients.find((p) => normalizeRm(p.no_rm) === targetRm);
    return { core, rich };
  }

  function matchDob(expectedDob: string, providedDob: string): boolean {
    const a = normalizeDob(expectedDob);
    const b = normalizeDob(providedDob);
    return a.length === 10 && a === b;
  }

  function buildDossier(
    noRmRaw: string,
    authMethod: 'rm_dob' | 'google',
    linkedEmail?: string
  ): PatientDossierPayload | null {
    const targetRm = normalizeRm(noRmRaw);
    const { core, rich } = findRichPatientByRm(targetRm);

    if (!core && !rich) return null;

    const baseName = core?.nama || rich?.nama || 'Pasien MYITARU';
    const baseDob = core?.tanggal_lahir || rich?.tanggal_lahir || '1990-01-01';
    const basePenjamin = core?.penjamin || rich?.penjamin || 'Umum / Mandiri';
    const baseNik = core?.nik || rich?.nik || '3171010101900001';

    // Collect queues for this patient
    const matchedAppointments = appointmentsStore.filter(
      (a) => normalizeRm(a.no_rm) === targetRm
    );

    const today = new Date().toISOString().split('T')[0];

    // If patient is from core or rich and has no active appointment yet, construct realistic active/latest outpatient queue snapshot
    const activeQueues =
      matchedAppointments.length > 0
        ? matchedAppointments.map((apt, idx) => {
            const poliItem = MASTER_POLIKLINIK.find((m) =>
              apt.poli.toLowerCase().includes(m.kode.toLowerCase()) ||
              apt.poli.toLowerCase().includes(m.nama.toLowerCase().replace('poli ', ''))
            );
            const poliCode = poliItem?.kode || 'POL';
            return {
              id: apt.id,
              poli: apt.poli,
              dokter: apt.dokter,
              tanggal: apt.tanggal,
              jam_praktek: apt.jam_praktek,
              nomor_antrian: apt.nomor_antrian,
              status: apt.status,
              tipe: apt.tipe,
              estimasi_menit: apt.status === 'Selesai' ? 0 : apt.status === 'Diperiksa' ? 5 : (idx + 1) * 12,
              poli_sedang_dipanggil: apt.status === 'Diperiksa' ? apt.nomor_antrian : `${poliCode}-001`
            };
          })
        : rich
        ? [
            {
              id: `APT-${rich.no_rm}`,
              poli: rich.poli_tujuan || rich.resume_medis?.unit_pelayanan || 'Poli Penyakit Dalam',
              dokter: rich.resume_medis?.dokter_dpjp || 'dr. Hendra Wijaya, Sp.PD',
              tanggal: today,
              jam_praktek: '08:00 - 13:00 WIB',
              nomor_antrian: `RJ-${rich.no_rm.slice(-3)}`,
              status: 'Menunggu',
              tipe: rich.resume_medis?.layanan || 'Rawat Jalan',
              estimasi_menit: 15,
              poli_sedang_dipanggil: 'RJ-001'
            }
          ]
        : [];

    // Allergies
    const allergies =
      rich?.allergies && rich.allergies.length > 0
        ? rich.allergies.map((a) => ({
            allergen: a.allergen,
            reaction: a.reaction,
            severity: a.severity
          }))
        : (core?.alergi || []).map((al) => ({
            allergen: al,
            reaction: 'Reaksi alergi tercatat di Rekam Medis',
            severity: 'Moderate'
          }));

    // Vitals
    const vitalsLatest =
      rich?.vitals && rich.vitals.length > 0
        ? {
            date: rich.vitals[0].date,
            bp: rich.vitals[0].bp,
            hr: rich.vitals[0].hr,
            temp: rich.vitals[0].temp,
            rr: rich.vitals[0].rr,
            spo2: rich.vitals[0].spo2,
            bb: rich.vitals[0].bb,
            tb: rich.vitals[0].tb
          }
        : core
        ? {
            date: 'Kunjungan Terakhir',
            bp: '120/80',
            hr: '78',
            temp: '36.6',
            rr: '18',
            spo2: '98',
            bb: '64',
            tb: '165'
          }
        : null;

    // Problem list
    const problemList =
      rich?.problem_list && rich.problem_list.length > 0
        ? rich.problem_list.map((pr) => ({
            nama: pr.nama,
            kode_icd10: pr.kode_icd10,
            severity: pr.severity,
            status: pr.status
          }))
        : (core?.riwayat_penyakit || []).map((dx, i) => ({
            nama: dx,
            kode_icd10: i === 0 ? 'I10' : 'K30',
            severity: 'Moderate',
            status: 'Active'
          }));

    // Medications
    const medications =
      rich?.medications && rich.medications.length > 0
        ? rich.medications.map((m) => ({
            name: m.name,
            dose: m.dose,
            frequency: m.frequency,
            status: m.status
          }))
        : core?.no_rm === 'RM-260101-0001'
        ? [
            { name: 'Amlodipine 10 mg Tablet', dose: '10 mg', frequency: '1x1 Malam', status: 'Active' },
            { name: 'Omeprazole 20 mg Kapsul', dose: '20 mg', frequency: '2x1 Sebelum Makan', status: 'Active' }
          ]
        : [
            { name: 'Paracetamol 500 mg', dose: '500 mg', frequency: '3x1 Bila Demam/Nyeri', status: 'Active' }
          ];

    // Lab & Radiology results matching RM or sample linked results
    let labRadResults: PatientDossierPayload['labRadResults'] = labRadDataset
      .filter((item) => normalizeRm(item.no_rm) === targetRm)
      .map((item) => ({
        id: item.id,
        jenis: item.jenis,
        pemeriksaan: item.pemeriksaan,
        tanggal: item.tanggal,
        dokter: item.dokter,
        status: item.status,
        hasil: item.hasil,
        loinc: item.loinc
      }));

    if (labRadResults.length === 0) {
      labRadResults = [
        {
          id: `LAB-${targetRm.slice(-4)}`,
          jenis: 'Lab',
          pemeriksaan: 'Darah Lengkap 5-Diff & Kimia Darah',
          tanggal: today,
          dokter: activeQueues[0]?.dokter || 'dr. Hendra Wijaya, Sp.PD',
          status: 'Tervalidasi',
          hasil: 'Hb: 13.6 g/dL, Leukosit: 7.400 /uL, Trombosit: 258.000 /uL, Glukosa Puasa: 96 mg/dL. Kesan: Dalam batas normal.',
          loinc: '58410-2'
        },
        {
          id: `RAD-${targetRm.slice(-4)}`,
          jenis: 'Radiologi',
          pemeriksaan: 'Foto Thorax PA Digital',
          tanggal: today,
          dokter: 'dr. Lukman Hakim, Sp.P',
          status: 'Tervalidasi',
          hasil: 'Cor dan Pulmo dalam batas normal, tidak tampak infiltrat maupun efusi pleura.',
          loinc: '24627-2'
        }
      ];
    }

    // Billing computation
    const isBpjsOrInsurance =
      basePenjamin.toLowerCase().includes('bpjs') ||
      basePenjamin.toLowerCase().includes('asuransi') ||
      basePenjamin.toLowerCase().includes('pertamina');

    const billItems = [
      { nama: 'Administrasi & Pendaftaran Rekam Medis', kategori: 'Administrasi', nominal: 35000 },
      { nama: `Konsultasi ${activeQueues[0]?.dokter || 'Dokter Spesialis'}`, kategori: 'Jasa Medis', nominal: 250000 },
      { nama: 'Pemeriksaan Laboratorium & Penunjang', kategori: 'Penunjang', nominal: 325000 },
      { nama: 'Resep Obat & Farmasi Rawat Jalan', kategori: 'Farmasi', nominal: 145000 }
    ];
    const totalBiaya = billItems.reduce((acc, item) => acc + item.nominal, 0);
    const ditanggungPenjamin = basePenjamin.toLowerCase().includes('bpjs')
      ? totalBiaya
      : isBpjsOrInsurance
      ? Math.round(totalBiaya * 0.85)
      : 0;
    const sisaTagihan = Math.max(0, totalBiaya - ditanggungPenjamin);
    const billingStatus: 'Ditanggung BPJS' | 'Lunas' | 'Menunggu Pembayaran' = basePenjamin
      .toLowerCase()
      .includes('bpjs')
      ? 'Ditanggung BPJS'
      : sisaTagihan === 0
      ? 'Lunas'
      : 'Menunggu Pembayaran';

    // Check inpatient bed
    const activeBed = bedsStore.find((b) => normalizeRm(b.no_rm || '') === targetRm);

    return {
      patient: {
        id: core?.id || rich?.id || targetRm,
        no_rm: targetRm,
        nama: baseName,
        nik_masked: maskNik(baseNik),
        tanggal_lahir: baseDob,
        jenis_kelamin: core?.jenis_kelamin || rich?.jenis_kelamin || 'L',
        golongan_darah: core?.golongan_darah || rich?.golongan_darah || 'O',
        penjamin: basePenjamin,
        no_bpjs: core?.no_bpjs,
        no_hp: core?.no_hp || rich?.no_hp || '-',
        alamat: core?.alamat || rich?.alamat || '-',
        status: core?.status || rich?.status || 'Rawat Jalan'
      },
      authMethod,
      linkedEmail,
      activeQueues,
      allergies,
      vitalsLatest,
      clinicalResume: rich?.resume_medis || null,
      problemList,
      medications,
      labRadResults,
      billing: {
        invoiceNumber: `INV-${today.replace(/-/g, '')}-${targetRm.slice(-4)}`,
        penjamin: basePenjamin,
        status: billingStatus,
        totalBiaya,
        ditanggungPenjamin,
        sisaTagihan,
        items: billItems
      },
      inpatientStay: activeBed
        ? {
            bangsal: activeBed.bangsal,
            ruangan: activeBed.ruangan,
            nomor_bed: activeBed.nomor_bed,
            kelas: activeBed.kelas,
            tanggal_masuk: activeBed.tanggal_masuk
          }
        : null
    };
  }

  function issueSession(no_rm: string, authMethod: 'rm_dob' | 'google', email?: string): PatientSession {
    const token = 'pat_' + crypto.randomBytes(20).toString('hex');
    const session: PatientSession = {
      token,
      no_rm: normalizeRm(no_rm),
      authMethod,
      email,
      verifiedAt: new Date().toISOString()
    };
    patientSessions.set(token, session);
    return session;
  }

  // 1. Public Hospital Catalog (Doctors, Poliklinik, Live Queue Snapshot, Demo Quick Check Samples)
  app.get('/api/public/hospital-catalog', (req, res) => {
    const doctors = SEMUA_DOKTER.map((doc) => {
      const boost = doctorServedBoost.get(doc.id) || 0;
      const served = (doc.pasien_terlayani || 0) + boost;
      const quota = doc.kuota || 30;
      return {
        ...doc,
        pasien_terlayani: served,
        kuota_tersisa: Math.max(0, quota - served)
      };
    });

    const poliQueues = MASTER_POLIKLINIK.map((pol) => {
      const waiting = appointmentsStore.filter(
        (a) =>
          a.poli.toLowerCase().includes(pol.nama.replace('Poli ', '').toLowerCase()) &&
          a.status === 'Menunggu'
      );
      return {
        id: pol.id,
        kode: pol.kode,
        nama: pol.nama,
        sedangDipanggil: `${pol.kode}-001`,
        totalMenunggu: waiting.length + 2
      };
    });

    const demoPatients = [
      {
        label: 'Ny. Siti Rahmawati (Poli Penyakit Dalam)',
        no_rm: 'RM-260101-0001',
        tanggal_lahir: '1985-04-23'
      },
      {
        label: 'Tn. Budi Santoso (Kardiologi & DM)',
        no_rm: 'RM-260102-0002',
        tanggal_lahir: '1978-08-15'
      }
    ];

    const firstRich = fullClinicalPatients[0];
    if (firstRich) {
      demoPatients.push({
        label: `${firstRich.nama} (Rekam Medis Lengkap)`,
        no_rm: firstRich.no_rm,
        tanggal_lahir: firstRich.tanggal_lahir
      });
    }

    res.json({
      hospitalName: 'MYITARU Klinik',
      emergencyHotline: '1-500-911',
      poliklinik: MASTER_POLIKLINIK,
      doctors,
      poliQueues,
      demoPatients,
      updatedAt: new Date().toISOString()
    });
  });

  // 2. Patient Verification via No. RM + Tanggal Lahir
  app.post('/api/patient/verify', (req, res) => {
    try {
      const { no_rm, tanggal_lahir } = req.body || {};
      if (!no_rm || !tanggal_lahir) {
        return res.status(400).json({
          success: false,
          message: 'Nomor Rekam Medis (No. RM) dan Tanggal Lahir wajib diisi.'
        });
      }

      const targetRm = normalizeRm(no_rm);
      const { core, rich } = findRichPatientByRm(targetRm);

      if (!core && !rich) {
        return res.status(404).json({
          success: false,
          message: `Nomor Rekam Medis ${targetRm} tidak ditemukan dalam sistem kami.`
        });
      }

      const expectedDob = core?.tanggal_lahir || rich?.tanggal_lahir || '';
      if (!matchDob(expectedDob, tanggal_lahir)) {
        createAuditLog?.({
          user: `Patient:${targetRm}`,
          role: 'Pasien Mobile',
          action: 'PATIENT_VERIFY_FAILED',
          module: 'Aplikasi Pasien',
          ip: req.ip || '127.0.0.1',
          status: 'WARNING',
          details: `Percobaan verifikasi No. RM ${targetRm} dengan tanggal lahir tidak cocok.`
        });

        return res.status(401).json({
          success: false,
          message: 'Tanggal lahir tidak sesuai dengan Nomor Rekam Medis tersebut.'
        });
      }

      const session = issueSession(targetRm, 'rm_dob');
      const dossier = buildDossier(targetRm, 'rm_dob');

      createAuditLog?.({
        user: dossier?.patient.nama || targetRm,
        role: 'Pasien Mobile',
        action: 'PATIENT_VERIFY_RM_DOB',
        module: 'Aplikasi Pasien',
        ip: req.ip || '127.0.0.1',
        status: 'SUCCESS',
        details: `Verifikasi pasien berhasil untuk No. RM ${targetRm}.`
      });

      return res.json({
        success: true,
        token: session.token,
        authMethod: 'rm_dob',
        dossier
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err?.message || 'Gagal memverifikasi data pasien.'
      });
    }
  });

  // 3. Google Sign-In Session & Account Linking for Mobile Patient App
  app.post('/api/patient/google-session', (req, res) => {
    try {
      const { email, displayName, linkNoRm, linkTanggalLahir, useDemoSample } = req.body || {};

      if (!email || typeof email !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Email akun Google terautentikasi wajib tersedia.'
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Case A: User wants to bind a specific No. RM + DOB to this Google email
      if (linkNoRm && linkTanggalLahir) {
        const targetRm = normalizeRm(linkNoRm);
        const { core, rich } = findRichPatientByRm(targetRm);
        if (!core && !rich) {
          return res.status(404).json({
            success: false,
            message: `No. RM ${targetRm} tidak ditemukan.`
          });
        }
        const expectedDob = core?.tanggal_lahir || rich?.tanggal_lahir || '';
        if (!matchDob(expectedDob, linkTanggalLahir)) {
          return res.status(401).json({
            success: false,
            message: 'Tanggal lahir tidak sesuai untuk menautkan No. RM ke akun Google ini.'
          });
        }
        googlePatientLinks.set(normalizedEmail, targetRm);
      } else if (useDemoSample && !googlePatientLinks.has(normalizedEmail)) {
        googlePatientLinks.set(normalizedEmail, 'RM-260101-0001');
      }

      const linkedRm = googlePatientLinks.get(normalizedEmail);
      if (!linkedRm) {
        // Also check if someone booked with this exact email earlier or create/offer linking prompt
        return res.json({
          success: true,
          linked: false,
          email: normalizedEmail,
          displayName: displayName || normalizedEmail.split('@')[0],
          message: 'Akun Google terverifikasi. Hubungkan No. RM Anda atau buat profil pasien baru.'
        });
      }

      const session = issueSession(linkedRm, 'google', normalizedEmail);
      const dossier = buildDossier(linkedRm, 'google', normalizedEmail);

      return res.json({
        success: true,
        linked: true,
        token: session.token,
        authMethod: 'google',
        dossier
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err?.message || 'Gagal menghubungkan sesi Google pasien.'
      });
    }
  });

  // 4. Refresh Verified Patient Dossier
  app.get('/api/patient/dossier', (req, res) => {
    const authHeader = req.headers.authorization || '';
    const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const queryToken = String(req.query.token || '').trim();
    const token = bearer || queryToken;

    const session = patientSessions.get(token);
    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Sesi verifikasi pasien tidak valid atau telah berakhir. Silakan verifikasi ulang.'
      });
    }

    const dossier = buildDossier(session.no_rm, session.authMethod, session.email);
    if (!dossier) {
      return res.status(404).json({
        success: false,
        message: 'Data rekam medis pasien tidak ditemukan.'
      });
    }

    return res.json({
      success: true,
      dossier
    });
  });

  // 5. Public & Mobile Patient Online Appointment Booking
  app.post('/api/patient/appointments', (req, res) => {
    try {
      const {
        nama,
        no_rm,
        tanggal_lahir,
        nik,
        no_hp,
        poli_id,
        poli_nama,
        dokter_id,
        dokter_nama,
        tanggal,
        jam_praktek,
        penjamin,
        keluhan,
        google_email
      } = req.body || {};

      if (!poli_nama || !dokter_nama) {
        return res.status(400).json({
          success: false,
          message: 'Poliklinik dan dokter tujuan wajib dipilih.'
        });
      }

      let resolvedRm = no_rm ? normalizeRm(no_rm) : '';
      let resolvedDob = normalizeDob(tanggal_lahir || '1992-05-14');
      let resolvedName = String(nama || '').trim();

      if (resolvedRm) {
        const { core, rich } = findRichPatientByRm(resolvedRm);
        if (core || rich) {
          resolvedName = resolvedName || core?.nama || rich?.nama || 'Pasien Terdaftar';
          resolvedDob = core?.tanggal_lahir || rich?.tanggal_lahir || resolvedDob;
        } else {
          // New patient entry using provided or generated RM
          const newPatient: ServerPatientRecord = {
            id: `p-${Date.now()}`,
            no_rm: resolvedRm,
            nik: String(nik || `3171${Math.floor(100000000000 + Math.random() * 899999999999)}`),
            nama: resolvedName || 'Pasien Baru Online',
            tanggal_lahir: resolvedDob,
            jenis_kelamin: 'L',
            alamat: 'Pendaftaran Online Portal MYITARU',
            no_hp: String(no_hp || '081200000000'),
            golongan_darah: 'O',
            penjamin: String(penjamin || 'Umum / Mandiri'),
            status: 'Rawat Jalan',
            alergi: [],
            riwayat_penyakit: keluhan ? [String(keluhan)] : [],
            created_at: new Date().toISOString()
          };
          patientsStore.unshift(newPatient);
        }
      } else {
        if (!resolvedName || !tanggal_lahir) {
          return res.status(400).json({
            success: false,
            message: 'Untuk pasien baru, Nama Lengkap dan Tanggal Lahir wajib diisi.'
          });
        }
        const now = new Date();
        const yy = String(now.getFullYear()).slice(-2);
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const seq = String(patientsStore.length + 101).padStart(4, '0');
        resolvedRm = `RM-${yy}${mm}${dd}-${seq}`;

        const newPatient: ServerPatientRecord = {
          id: `p-${Date.now()}`,
          no_rm: resolvedRm,
          nik: String(nik || `3171${Math.floor(100000000000 + Math.random() * 899999999999)}`),
          nama: resolvedName,
          tanggal_lahir: resolvedDob,
          jenis_kelamin: 'L',
          alamat: 'Pendaftaran Online Portal MYITARU',
          no_hp: String(no_hp || '081200000000'),
          golongan_darah: 'O',
          penjamin: String(penjamin || 'Umum / Mandiri'),
          status: 'Rawat Jalan',
          alergi: [],
          riwayat_penyakit: keluhan ? [String(keluhan)] : [],
          created_at: new Date().toISOString()
        };
        patientsStore.unshift(newPatient);
      }

      if (google_email && typeof google_email === 'string') {
        googlePatientLinks.set(google_email.trim().toLowerCase(), resolvedRm);
      }

      const poliObj = MASTER_POLIKLINIK.find((p) => p.id === poli_id || p.nama === poli_nama);
      const poliKode = poliObj?.kode || 'RJ';
      const existingForPoli = appointmentsStore.filter((a) =>
        a.nomor_antrian.startsWith(`${poliKode}-`)
      ).length;
      const nomorAntrian = `${poliKode}-${String(existingForPoli + 2).padStart(3, '0')}`;

      const targetDate = tanggal ? normalizeDob(tanggal) : new Date().toISOString().split('T')[0];

      const newApt: ServerAppointmentRecord = {
        id: `apt-${Date.now()}`,
        pasien_id: resolvedRm,
        pasien_nama: resolvedName,
        no_rm: resolvedRm,
        poli: String(poli_nama),
        dokter: String(dokter_nama),
        tanggal: targetDate,
        jam_praktek: String(jam_praktek || '08:00 - 13:00 WIB'),
        nomor_antrian: nomorAntrian,
        status: 'Menunggu',
        tipe: 'Rawat Jalan',
        created_at: new Date().toISOString()
      };
      appointmentsStore.unshift(newApt);

      if (dokter_id) {
        doctorServedBoost.set(dokter_id, (doctorServedBoost.get(dokter_id) || 0) + 1);
      }

      const authMethod: 'rm_dob' | 'google' = google_email ? 'google' : 'rm_dob';
      const session = issueSession(resolvedRm, authMethod, google_email);
      const dossier = buildDossier(resolvedRm, authMethod, google_email);

      createAuditLog?.({
        user: resolvedName,
        role: 'Pasien Portal',
        action: 'ONLINE_APPOINTMENT_BOOKING',
        module: 'Portal & App Pasien',
        ip: req.ip || '127.0.0.1',
        status: 'SUCCESS',
        details: `Booking online ${nomorAntrian} (${poli_nama} · ${dokter_nama}) untuk No. RM ${resolvedRm}.`
      });

      return res.status(201).json({
        success: true,
        message: 'Janji temu berhasil dibuat dan nomor antrean telah diterbitkan.',
        booking: {
          no_rm: resolvedRm,
          tanggal_lahir: resolvedDob,
          nama: resolvedName,
          nomor_antrian: nomorAntrian,
          poli: poli_nama,
          dokter: dokter_nama,
          tanggal: targetDate,
          jam_praktek: newApt.jam_praktek,
          penjamin: penjamin || 'Umum / Mandiri'
        },
        token: session.token,
        dossier
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err?.message || 'Gagal memproses pendaftaran janji temu.'
      });
    }
  });
}
