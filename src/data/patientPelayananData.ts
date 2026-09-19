// ═══════════════════════════════════════════════════════════════════════════
// MYITARU SIMRS — DATA PASIEN & RESUME MEDIS LENGKAP MODUL PELAYANAN
// ═══════════════════════════════════════════════════════════════════════════

export interface ClinicalResume {
  id: string;
  no_resume: string;
  pasien_id: string;
  nama_pasien: string;
  no_rm: string;
  nik: string;
  umur: number;
  jenis_kelamin: 'L' | 'P';
  penjamin: string;
  layanan: 'Rawat Jalan' | 'IGD' | 'Rawat Inap' | 'Kamar Operasi' | 'Laboratorium' | 'Radiologi';
  unit_pelayanan: string;
  dokter_dpjp: string;
  spesialisasi_dpjp: string;
  tgl_masuk: string;
  tgl_keluar: string;
  lama_rawat?: string;
  keluhan_utama: string;
  riwayat_penyakit_sekarang: string;
  riwayat_penyakit_dahulu: string;
  riwayat_alergi: string;
  tanda_vital: {
    td: string;
    nadi: string;
    suhu: string;
    rr: string;
    spo2: string;
    bb: string;
    tb: string;
    imt?: string;
  };
  pemeriksaan_fisik: string;
  pemeriksaan_penunjang: {
    lab?: string;
    radiologi?: string;
    ekg?: string;
  };
  diagnosis_primer: {
    kode_icd10: string;
    nama: string;
  };
  diagnosis_sekunder: Array<{
    kode_icd10: string;
    nama: string;
  }>;
  tindakan_prosedur: Array<{
    kode_icd9: string;
    nama: string;
  }>;
  terapi_farmakologi: Array<{
    nama_obat: string;
    dosis: string;
    frekuensi: string;
    rute: string;
  }>;
  obat_pulang: Array<{
    nama_obat: string;
    dosis: string;
    frekuensi: string;
    aturan_pakai: string;
    jumlah: string;
  }>;
  kondisi_pulang: 'Sembuh' | 'Perbaikan' | 'Alih Rawat / Rujuk' | 'Pulang Atas Permintaan Sendiri (PAPS)' | 'Meninggal';
  instruksi_edukasi: string;
  jadwal_kontrol: string;
  tte_status: 'Tersertifikasi BSrE' | 'Menunggu Validasi';
  tte_timestamp: string;
}

export interface PatientFullRecord {
  id: string;
  no_rm: string;
  nik: string;
  nama: string;
  nama_pasien: string;
  jenis_kelamin: 'L' | 'P';
  tanggal_lahir: string;
  tgl_lahir: string;
  umur: number;
  penjamin: string;
  no_hp: string;
  telepon: string;
  alamat: string;
  golongan_darah: 'A' | 'B' | 'AB' | 'O';
  pekerjaan: string;
  agama: string;
  poli_tujuan: string;
  status: string;
  problem_list: Array<{
    id: number;
    nama: string;
    kode_icd10: string;
    tanggal_onset: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
    status: 'Active' | 'Resolved';
  }>;
  medications: Array<{
    id: number;
    name: string;
    dose: string;
    frequency: string;
    startDate: string;
    status: 'Active' | 'Completed';
  }>;
  allergies: Array<{
    id: number;
    allergen: string;
    reaction: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
    tanggal_diketahui: string;
    verified_by: string;
  }>;
  vitals: Array<{
    id: number;
    date: string;
    bp: string;
    hr: string;
    temp: string;
    rr: string;
    spo2: string;
    tb: string;
    bb: string;
  }>;
  immunizations: Array<{
    id: number;
    vaksin: string;
    tanggal: string;
    faskes: string;
    batch: string;
  }>;
  soap: {
    s: string;
    o: string;
    a: string;
    p: string;
  };
  keluhan_utama?: string;
  tipe_pelayanan?: string;
  resume_medis: ClinicalResume;
}

interface MedicalCaseDefinition {
  poli: string;
  layanan: 'Rawat Jalan' | 'IGD' | 'Rawat Inap' | 'Kamar Operasi' | 'Laboratorium' | 'Radiologi';
  dpjp: string;
  spesialisasi: string;
  keluhan: string;
  rps: string;
  rpd: string;
  alergi: string;
  genderRequired?: 'L' | 'P';
  minAge?: number;
  maxAge?: number;
  bbDefault?: number;
  tbDefault?: number;
  icd10_p: { kode_icd10: string; nama: string };
  icd10_s: Array<{ kode_icd10: string; nama: string }>;
  icd9: Array<{ kode_icd9: string; nama: string }>;
  fisik: string;
  lab: string;
  radiologi: string;
  terapi: Array<{ nama_obat: string; dosis: string; frekuensi: string; rute: string }>;
  obat_pulang?: Array<{ nama_obat: string; dosis: string; frekuensi: string; aturan_pakai: string; jumlah: string }>;
  kondisi: 'Sembuh' | 'Perbaikan' | 'Alih Rawat / Rujuk' | 'Pulang Atas Permintaan Sendiri (PAPS)' | 'Meninggal';
  instruksi?: string;
  edukasi?: string;
  kontrol?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MASTER KAMUS DIAGNOSIS & TINDAKAN KLINIS SPESIALISTIK RS LENGKAP
// ═══════════════════════════════════════════════════════════════════════════
const MEDICAL_CASES: MedicalCaseDefinition[] = [
  {
    poli: 'Poli Penyakit Dalam (Internis)',
    layanan: 'Rawat Jalan',
    dpjp: 'dr. Hendra Pratama, Sp.PD',
    spesialisasi: 'Sp.PD (Penyakit Dalam)',
    keluhan: 'Lemas, sering haus (polidipsia), sering kencing malam hari (poliuria), dan kesemutan di kedua kaki.',
    rps: 'Pasien mengeluh badan lemas sejak 3 minggu terakhir disertai sering haus dan penurunan berat badan 4 kg tanpa diet. Riwayat kadar gula darah sewaktu 280 mg/dL.',
    rpd: 'Hipertensi terkontrol 5 tahun, dislipidemia.',
    alergi: 'Aspirin (Bronkospasme ringan)',
    minAge: 40,
    maxAge: 70,
    icd10_p: { kode_icd10: 'E11.9', nama: 'Type 2 diabetes mellitus without complications' },
    icd10_s: [{ kode_icd10: 'I10', nama: 'Essential (primary) hypertension' }, { kode_icd10: 'E78.5', nama: 'Hyperlipidemia, unspecified' }],
    icd9: [{ kode_icd9: '89.52', nama: 'Electrocardiogram' }, { kode_icd9: '90.59', nama: 'Microscopic examination of blood' }],
    fisik: 'KU sedang, compos mentis. Mata: CA -/-, SI -/-. Cor/Pulmo: S1-S2 reguler, wheezing -/-. Abdomen: supel, BU (+) normal. Ekstremitas: akral hangat, CRT < 2s, sensibilitas protektif menurun pada kedua pedis.',
    lab: 'GDP: 184 mg/dL, GD2PP: 245 mg/dL, HbA1c: 8.9%, Kolesterol Total: 230 mg/dL, Trigliserida: 210 mg/dL, Kreatinin: 1.0 mg/dL',
    radiologi: 'Foto Thorax: Cor dan pulmo dalam batas normal.',
    terapi: [
      { nama_obat: 'Metformin HCl 500 mg', dosis: '500 mg', frekuensi: '3x1 tablet', rute: 'Oral (Sesudah Makan)' },
      { nama_obat: 'Glimepiride 2 mg', dosis: '2 mg', frekuensi: '1x1 tablet', rute: 'Oral (Sebelum Sarapan)' },
      { nama_obat: 'Amlodipine 10 mg', dosis: '10 mg', frekuensi: '1x1 tablet', rute: 'Oral (Malam)' },
      { nama_obat: 'Atorvastatin 20 mg', dosis: '20 mg', frekuensi: '1x1 tablet', rute: 'Oral (Malam)' }
    ],
    kondisi: 'Perbaikan',
    edukasi: 'Diet diabetes melitus 1700 kkal/hari, kurangi konsumsi karbohidrat sederhana, olahraga aerobik ringan 30 menit 3x/minggu, dan periksa kaki berkala.',
    kontrol: '2 minggu kemudian di Poli Penyakit Dalam'
  },
  {
    poli: 'Poli Jantung & Pembuluh Darah (Kardiologi)',
    layanan: 'Rawat Jalan',
    dpjp: 'dr. Joko Santoso, Sp.JP, FIHA',
    spesialisasi: 'Sp.JP (Kardiologi & Vaskular)',
    keluhan: 'Nyeri dada kiri seperti tertindih beban berat menjalar ke punggung saat berjalan menanjak, membaik saat istirahat.',
    rps: 'Nyeri dada substernal dirasakan sejak 2 bulan terakhir, frekuensi 2-3 kali seminggu, durasi 5-10 menit, disertai keringat dingin.',
    rpd: 'Hipertensi derajat 2, riwayat perokok aktif 20 tahun.',
    alergi: 'Tidak ada alergi obat',
    minAge: 45,
    maxAge: 75,
    icd10_p: { kode_icd10: 'I20.9', nama: 'Angina pectoris, unspecified (Chronic Stable Angina)' },
    icd10_s: [{ kode_icd10: 'I10', nama: 'Essential (primary) hypertension' }, { kode_icd10: 'Z72.0', nama: 'Tobacco use' }],
    icd9: [{ kode_icd9: '89.52', nama: 'Electrocardiogram 12-lead' }, { kode_icd9: '88.72', nama: 'Diagnostic ultrasound of heart (Echocardiography)' }],
    fisik: 'TD: 145/90 mmHg, Nadi: 76x/m reguler, Suhu: 36.5C, RR: 18x/m, SpO2: 99%. Jantung: Apex cordis teraba ICS V linea midclavicularis sinistra, S1-S2 normal, murmur (-), gallop (-).',
    lab: 'Troponin I Kuantitatif: <0.01 ng/mL (Negatif), CK-MB: 18 U/L, Lipid Profile: LDL 165 mg/dL, HDL 38 mg/dL.',
    radiologi: 'Echocardiography: LVEF 56%, hipokinetik ringan segmen inferior basal.',
    terapi: [
      { nama_obat: 'ISDN (Isosorbide Dinitrate) 5 mg', dosis: '5 mg', frekuensi: '3x1 tablet', rute: 'Sublingual / Oral' },
      { nama_obat: 'Bisoprolol 2.5 mg', dosis: '2.5 mg', frekuensi: '1x1 tablet', rute: 'Oral (Pagi)' },
      { nama_obat: 'Aspilet (Asam Asetilsalisilat) 80 mg', dosis: '80 mg', frekuensi: '1x1 tablet', rute: 'Oral (Siang)' },
      { nama_obat: 'Rosuvastatin 20 mg', dosis: '20 mg', frekuensi: '1x1 tablet', rute: 'Oral (Malam)' }
    ],
    kondisi: 'Perbaikan',
    edukasi: 'Hindari aktivitas fisik berlebih mendadak, simpan ISDN sublingual jika serangan nyeri dada, berhenti merokok mutlak.',
    kontrol: '1 bulan kemudian di Poli Jantung'
  },
  {
    poli: 'Poli Obgyn (Kebidanan & Kandungan)',
    layanan: 'Rawat Jalan',
    dpjp: 'dr. Citra Lestari, Sp.OG, Subsp.Obginsos',
    spesialisasi: 'Sp.OG (Obstetri & Ginekologi)',
    keluhan: 'Kontrol kehamilan trimester 3, kencang-kencang palsu sesekali, gerakan janin aktif.',
    rps: 'G2P1A0 gravida 34-35 minggu datang untuk ANC terpadu ke-5. Mual muntah (-), keluar darah/air ketuban (-).',
    rpd: 'Riwayat persalinan pertama spontan cukup bulan 3200 gram.',
    alergi: 'Penisilin (Urtikaria kemerahan)',
    genderRequired: 'P',
    minAge: 21,
    maxAge: 38,
    icd10_p: { kode_icd10: 'Z34.8', nama: 'Encounter for supervision of other normal pregnancy' },
    icd10_s: [{ kode_icd10: 'O99.0', nama: 'Anemia complicating pregnancy, childbirth' }],
    icd9: [{ kode_icd9: '88.78', nama: 'Diagnostic ultrasound of gravid uterus (USG 4D Fetomaternal)' }],
    fisik: 'TD: 115/75 mmHg, Nadi: 82x/m, Suhu: 36.6C, RR: 18x/m. TFU 30 cm, Punggung Kiri, Presentasi Kepala, DJJ: 142x/m reguler, His (-).',
    lab: 'Hb: 10.8 g/dL (Anemia ringan), Leukosit: 8.500, Trombosit: 240.000, Gol. Darah: B Rh (+), Proteinuria: Negatif, HBsAg: Non-Reaktif, HIV/Sifilis: Non-Reaktif.',
    radiologi: 'USG Obstetri: Janin tunggal hidup intrauterin, presentasi kepala, BPD: 86mm, AC: 305mm, FL: 67mm, TBJ: 2400g, Plasenta di fundus uteri grade II, AFI normal (14 cm).',
    terapi: [
      { nama_obat: 'Ferrous Fumarate + Asam Folat (Tablet Tambah Darah)', dosis: '1 tab', frekuensi: '1x1 tablet', rute: 'Oral' },
      { nama_obat: 'Kalsium Laktat (Calcifar) 500 mg', dosis: '500 mg', frekuensi: '2x1 tablet', rute: 'Oral' },
      { nama_obat: 'DHA Maternal 200 mg', dosis: '200 mg', frekuensi: '1x1 kapsul', rute: 'Oral' }
    ],
    kondisi: 'Sembuh',
    edukasi: 'Edukasi tanda bahaya kehamilan trimester 3 (perdarahan, rembes ketuban, his teratur, nyeri kepala hebat, pandangan kabur), hitung tendangan janin (Kick Count).',
    kontrol: '2 minggu kemudian di Poli Kandungan'
  },
  {
    poli: 'Poli Fetomaternal',
    layanan: 'Rawat Jalan',
    dpjp: 'dr. Citra Lestari, Sp.OG, Subsp.KFM',
    spesialisasi: 'Sp.OG-Subsp.KFM (Fetomaternal Risiko Tinggi)',
    keluhan: 'Rujukan dari Puskesmas dengan tensi tinggi pada kehamilan 32 minggu dan bengkak kedua tungkai.',
    rps: 'G1P0A0 usia kehamilan 32 minggu dengan riwayat tekanan darah 150/95 mmHg saat ANC di FKTP. Sakit kepala ringan (+), pandangan kabur (-), nyeri ulu hati (-).',
    rpd: 'Tidak ada riwayat hipertensi sebelum hamil.',
    alergi: 'Tidak ada riwayat alergi',
    genderRequired: 'P',
    minAge: 22,
    maxAge: 38,
    icd10_p: { kode_icd10: 'O14.0', nama: 'Mild to moderate pre-eclampsia' },
    icd10_s: [{ kode_icd10: 'Z35.8', nama: 'Supervision of other high-risk pregnancies' }],
    icd9: [{ kode_icd9: '88.78', nama: 'Doppler Ultrasound of uterine and umbilical arteries' }],
    fisik: 'TD: 148/94 mmHg, Nadi: 84x/m, Suhu: 36.5C. TFU 28 cm, DJJ 146x/m. Edema pretibial (+/+) pitting derajat 1. Refleks patella normal (+/+).',
    lab: 'Proteinuria: +1 kuantitatif (0.4 g/24jam), Trombosit: 210.000, SGOT: 28, SGPT: 22, Asam Urat: 5.6.',
    radiologi: 'Doppler USG: Arteri umbilikalis S/D ratio 2.8 (normal), janin sesuai masa kehamilan 32 minggu.',
    terapi: [
      { nama_obat: 'Metildopa 250 mg', dosis: '250 mg', frekuensi: '3x1 tablet', rute: 'Oral' },
      { nama_obat: 'Kalsium Karbonat 500 mg', dosis: '500 mg', frekuensi: '2x1 tablet', rute: 'Oral' },
      { nama_obat: 'Asam Folat 1 mg', dosis: '1 mg', frekuensi: '1x1 tablet', rute: 'Oral' }
    ],
    kondisi: 'Perbaikan',
    edukasi: 'Tirah baring miring ke kiri, monitor tekanan darah harian, waspada tanda preeklampsia berat (nyeri kepala, kabur, nyeri epigastrium).',
    kontrol: '1 minggu kemudian di Poli Fetomaternal'
  },
  {
    poli: 'Poli Anak (Pediatri)',
    layanan: 'Rawat Jalan',
    dpjp: 'dr. Eka Putri, Sp.A, M.Kes',
    spesialisasi: 'Sp.A (Dokter Spesialis Anak)',
    keluhan: 'Demam 3 hari naik turun, batuk berdahak, pilek lendir encer, nafsu makan dan minum menurun.',
    rps: 'Anak demam sejak 3 hari lalu, suhu tertinggi 38.8C. Batuk grok-grok terutama malam hari. Muntah 1 kali saat batuk keras.',
    rpd: 'Riwayat alergi dingin/rhinitis pada ayah. Imunisasi dasar lengkap.',
    alergi: 'Sulfa (Ruam kulit)',
    minAge: 2,
    maxAge: 10,
    bbDefault: 16,
    tbDefault: 104,
    icd10_p: { kode_icd10: 'J06.9', nama: 'Acute upper respiratory infection, unspecified' },
    icd10_s: [{ kode_icd10: 'R50.9', nama: 'Fever, unspecified' }],
    icd9: [{ kode_icd9: '93.94', nama: 'Respiratory medication administered by nebulizer' }],
    fisik: 'BB: 16 kg, TB: 104 cm. Suhu: 38.2C, Nadi: 108x/m, RR: 24x/m, SpO2: 98%. Faring hiperemis (+), Tonsil T1-T1 tidak hiperemis. Pulmo: vesicular breath sounds, ronkhi basah halus minimal di kedua lapangan paru, wheezing (-).',
    lab: 'Darah Rutin: Hb: 12.1 g/dL, Leukosit: 8.200/uL, Trombosit: 285.000/uL, Hematokrit: 36%.',
    radiologi: 'Tidak diperlukan radiologi pada episode saat ini.',
    terapi: [
      { nama_obat: 'Paracetamol Sirup 120mg/5ml', dosis: '1.5 cth (7.5 ml)', frekuensi: '3-4x1 (jika demam >38C)', rute: 'Oral' },
      { nama_obat: 'Ambroxol Sirup 15mg/5ml', dosis: '1/2 cth (2.5 ml)', frekuensi: '3x1 cth', rute: 'Oral' },
      { nama_obat: 'Cetirizine Sirup 5mg/5ml', dosis: '1/2 cth (2.5 ml)', frekuensi: '1x1 cth (Malam)', rute: 'Oral' },
      { nama_obat: 'Vitamin C & Zinc Drops', dosis: '1 ml', frekuensi: '1x1 hari', rute: 'Oral' }
    ],
    kondisi: 'Perbaikan',
    edukasi: 'Berikan cairan hangat lebih sering, kompres hangat bila demam, hindari es dan makanan berminyak, segera ke IGD jika ada tarikan dinding dada (sesak) atau kejang.',
    kontrol: '3 hari jika demam menetap'
  },
  {
    poli: 'Poli Saraf (Neurologi)',
    layanan: 'Rawat Jalan',
    dpjp: 'dr. Fajar Hidayat, Sp.N, Subsp.NN(K)',
    spesialisasi: 'Sp.N (Spesialis Saraf)',
    keluhan: 'Nyeri kepala sebelah kanan berdenyut (migrain), silau melihat cahaya (fotofobia), mual sejak tadi malam.',
    rps: 'Nyeri kepala berdenyut unilateral intensitas sedang-berat VAS 7/10 dirasakan sejak 14 jam lalu setelah begadang lembur kerja. Tidak ada kelemahan anggota gerak.',
    rpd: 'Riwayat episode serupa 2-3 bulan sekali.',
    alergi: 'Tidak ada alergi',
    minAge: 20,
    maxAge: 55,
    icd10_p: { kode_icd10: 'G43.0', nama: 'Migraine without aura, intractable' },
    icd10_s: [{ kode_icd10: 'G47.0', nama: 'Insomnia, unspecified' }],
    icd9: [{ kode_icd9: '89.14', nama: 'Electroencephalogram (EEG) / Neuro-evaluation' }],
    fisik: 'GCS E4V5M6 (15), TD: 125/80 mmHg, Nadi: 80x/m, Suhu: 36.4C. Pemeriksaan Saraf Kranial (N. I-XII): kesan simetris dan normal. Tanda Rangsang Meningeal: Kaku Kuduk (-), Laseque/Kernig (-). Motorik: 5/5/5/5, Sensorik: normal, Refleks Fisiologis: +2/+2, Refleks Patologis: -/-.',
    lab: 'Darah Lengkap & Elektrolit dalam batas normal.',
    radiologi: 'CT-Scan Kepala Non-Kontras (arsip): Tidak tampak perdarahan intrakranial maupun infark akut.',
    terapi: [
      { nama_obat: 'Sumatriptan Succinate 50 mg', dosis: '50 mg', frekuensi: '1x1 tablet (saat onset migrain akut)', rute: 'Oral' },
      { nama_obat: 'Paracetamol 500 mg + Kafein 50 mg', dosis: '1 tab', frekuensi: '3x1 tablet', rute: 'Oral' },
      { nama_obat: 'Flunarizine 5 mg (Profilaksis)', dosis: '5 mg', frekuensi: '1x1 tablet (Malam)', rute: 'Oral' },
      { nama_obat: 'Domperidone 10 mg', dosis: '10 mg', frekuensi: '3x1 tablet (Sebelum Makan)', rute: 'Oral' }
    ],
    kondisi: 'Perbaikan',
    edukasi: 'Tidur cukup 7-8 jam per hari, kenali dan hindari pemicu migrain (keju, cokelat, kafein berlebih, stres, sinar silau), istirahat di ruangan redup dan tenang.',
    kontrol: '1 bulan kemudian di Poli Saraf'
  },
  {
    poli: 'Poli Paru (Pulmonologi)',
    layanan: 'Rawat Jalan',
    dpjp: 'dr. Lukman Hakim, Sp.P, FAPSR',
    spesialisasi: 'Sp.P (Pulmonologi & Kedokteran Respirasi)',
    keluhan: 'Batuk berdahak sudah 3 minggu, kadang bercak darah samar, demam sumeng-sumeng sore hari, keringat malam.',
    rps: 'Pasien batuk produktif warna putih kekuningan selama 21 hari, nafsu makan turun drastis, berat badan turun 5 kg dalam 1 bulan.',
    rpd: 'Riwayat kontak dengan kerabat serumah yang menjalani pengobatan OAT 6 bulan.',
    alergi: 'Tidak ada alergi obat',
    minAge: 25,
    maxAge: 65,
    icd10_p: { kode_icd10: 'A15.0', nama: 'Tuberculosis of lung, confirmed by sputum microscopy' },
    icd10_s: [{ kode_icd10: 'R63.4', nama: 'Abnormal weight loss' }],
    icd9: [{ kode_icd9: '87.44', nama: 'Routine chest x-ray' }, { kode_icd9: '90.41', nama: 'Microscopic examination of sputum' }],
    fisik: 'KU kurus, IMT 17.2 kg/m2. TD: 110/70 mmHg, Nadi: 86x/m, Suhu: 37.4C, RR: 20x/m, SpO2: 97%. Pulmo: Suara napas bronkial di apeks paru kanan, ronkhi basah kasar di apeks hemithoraks dextra.',
    lab: 'Tes Cepat Molekuler (TCM GeneXpert Sputum): MTB DETECTED, Rifampicin Resistance NOT DETECTED (Sensitif Rifampisin). SGOT: 24, SGPT: 28, Asam Urat: 5.2.',
    radiologi: 'Foto Thorax PA: Tampak infiltrat dan kavitas berdinding tipis pada lapangan atas paru kanan (Apeks Dextra), cor normal.',
    terapi: [
      { nama_obat: 'OAT Kategori 1 FDC (Rifampisin 150mg + INH 75mg + Pirazinamid 400mg + Etambutol 275mg)', dosis: '3 tablet 4FDC', frekuensi: '1x sehari (Pagi perut kosong)', rute: 'Oral' },
      { nama_obat: 'Vitamin B6 (Pyridoxine) 10 mg', dosis: '10 mg', frekuensi: '1x1 tablet', rute: 'Oral' },
      { nama_obat: 'Curcuma Tablet 200 mg', dosis: '200 mg', frekuensi: '3x1 tablet', rute: 'Oral' }
    ],
    kondisi: 'Perbaikan',
    edukasi: 'Wajib minum obat teratur setiap hari selama 6 bulan tanpa putus, gunakan masker bedah di rumah, etika batuk yang benar, jemur kasur/buka jendela untuk sirkulasi sinar UV matahari, anggota keluarga serumah wajib skrining.',
    kontrol: '2 minggu kemudian untuk evaluasi efek samping OAT di Poli Paru DOTS'
  },
  {
    poli: 'Poli Orthopedi (Tulang & Sendi)',
    layanan: 'Rawat Jalan',
    dpjp: 'dr. Wahyu Nugroho, Sp.OT(K)',
    spesialisasi: 'Sp.OT (Orthopedi & Traumatologi)',
    keluhan: 'Nyeri kedua lutut terutama saat berdiri dari duduk dan menuruni tangga, bunyi gemeretak (krepitasi).',
    rps: 'Nyeri lutut dirasakan makin memberat sejak 6 bulan terakhir. Kekakuan pagi hari < 30 menit. Pasien kesulitan jongkok dan sholat.',
    rpd: 'Obesitas grade 1, riwayat cedera ligamen lutut 10 tahun lalu.',
    alergi: 'Tidak ada alergi',
    minAge: 48,
    maxAge: 75,
    icd10_p: { kode_icd10: 'M17.0', nama: 'Bilateral primary osteoarthritis of knee (Grade 3 Kellgren-Lawrence)' },
    icd10_s: [{ kode_icd10: 'E66.0', nama: 'Obesity due to excess calories' }],
    icd9: [{ kode_icd9: '88.27', nama: 'Other x-ray of lower limb (Foto Genu AP/Lat Bilateral)' }, { kode_icd9: '81.92', nama: 'Injection of therapeutic substance into joint or ligament' }],
    fisik: 'BB: 78 kg, TB: 155 cm, IMT: 32.4 kg/m2. Status Lokalis Regio Genu Bilateral: Deformitas genu varum ringan, edema (-), nyeri tekan joint line medial (+/+), krepitasi kasar (+/+), ROM fleksi terbatas 110 derajat karena nyeri.',
    lab: 'Asam Urat: 4.8 mg/dL, LED: 18 mm/jam, RF (Rheumatoid Factor): Negatif.',
    radiologi: 'X-Ray Genu Bilateral Weight Bearing: Penyempitan celah sendi kompartemen medial bilateral nyata, osteofit marginalis femur & tibia, sklerosis subkondral (Kellgren-Lawrence Grade III).',
    terapi: [
      { nama_obat: 'Celecoxib 200 mg', dosis: '200 mg', frekuensi: '1x1 kapsul (Sesudah Makan)', rute: 'Oral' },
      { nama_obat: 'Glucosamine Sulfate + Chondroitin', dosis: '1 sachet', frekuensi: '1x1 sachet', rute: 'Oral' },
      { nama_obat: 'Injeksi Intra-artikuler Asam Hialuronat 2ml', dosis: '2 ml per sendi', frekuensi: 'Protokol 1x seminggu x 3 sesi', rute: 'Intra-articular Genu Bilateral' },
      { nama_obat: 'Knee Brace Support Elastic', dosis: '1 pasang', frekuensi: 'Digunakan saat berjalan', rute: 'Topikal / Alat' }
    ],
    kondisi: 'Perbaikan',
    edukasi: 'Program penurunan berat badan bertahap, fisioterapi penguatan otot paha (quadriceps strengthening exercise), hindari naik-turun tangga berlebih dan hindari posisi jongkok lama.',
    kontrol: '1 minggu kemudian untuk injeksi HA sesi ke-2 di Poli Orthopedi'
  },
  {
    poli: 'Poli Mata (Oftalmologi)',
    layanan: 'Rawat Jalan',
    dpjp: 'dr. Gita Permata, Sp.M',
    spesialisasi: 'Sp.M (Spesialis Mata)',
    keluhan: 'Penglihatan mata kanan perlahan makin kabur seperti melihat asap atau berkabut, silau saat melihat lampu malam hari.',
    rps: 'Mata kanan kabur sejak 8 bulan lalu, makin lama makin gelap. Mata merah (-), nyeri (-), gatal (-).',
    rpd: 'Hipertensi terkontrol, riwayat kacamata baca (+2.50D).',
    alergi: 'Tidak ada alergi',
    minAge: 52,
    maxAge: 78,
    icd10_p: { kode_icd10: 'H25.1', nama: 'Senile nuclear cataract, right eye (Katarak Senilis Matur OD)' },
    icd10_s: [{ kode_icd10: 'H52.4', nama: 'Presbyopia' }],
    icd9: [{ kode_icd9: '95.02', nama: 'Comprehensive ophthalmological examination (Slit Lamp, Tonometri, Keratometri)' }, { kode_icd9: '13.41', nama: 'Phacoemulsification and aspiration of cataract' }],
    fisik: 'Visus OD: 1/60 (pinhole tetap), Visus OS: 6/18. TIO OD: 15 mmHg, TIO OS: 14 mmHg (Schiotz). Lensa OD: Keruh menyeluruh warna kecoklatan, shadow test (-).',
    lab: 'Gula Darah Sewaktu: 112 mg/dL, BT/CT: Normal, HBsAg: Non-reaktif.',
    radiologi: 'Biometri Mata OD: Power IOL +21.5 D (Metode SRK/T).',
    terapi: [
      { nama_obat: 'C-Catarlac Eye Drops', dosis: '1 tetes', frekuensi: '4x1 tetes OD', rute: 'Tetes Mata' },
      { nama_obat: 'Artificial Tears Eye Drops', dosis: '1 tetes', frekuensi: '4x1 tetes ODS', rute: 'Tetes Mata' }
    ],
    kondisi: 'Perbaikan',
    edukasi: 'Direncanakan operasi katarak modern Phacoemulsification + Implan Lensa Lipat Intraokular (Foldable IOL) OD rawat jalan.',
    kontrol: 'Jadwal Operasi Phacoemulsifikasi di Kamar Bedah Mata'
  },
  {
    poli: 'Poli Bedah Umum',
    layanan: 'Rawat Jalan',
    dpjp: 'dr. Bambang Alamsyah, Sp.B',
    spesialisasi: 'Sp.B (Bedah Umum)',
    keluhan: 'Benjolan di lipat paha kanan yang keluar masuk saat berdiri atau batuk dan mengecil saat berbaring.',
    rps: 'Benjolan di inguinal dextra disadari sejak 5 bulan lalu. Kadang terasa pegal saat mengangkat beban berat. Mual (-), muntah (-), BAB normal.',
    rpd: 'Pekerjaan kuli bangunan / angkat beban.',
    alergi: 'Tidak ada alergi',
    genderRequired: 'L',
    minAge: 35,
    maxAge: 68,
    icd10_p: { kode_icd10: 'K40.9', nama: 'Unilateral inguinal hernia, without obstruction or gangrene' },
    icd10_s: [{ kode_icd10: 'Z96.6', nama: 'Presence of other orthopedic joint implants' }],
    icd9: [{ kode_icd9: '53.05', nama: 'Repair of other direct inguinal hernia with graft or prosthesis' }],
    fisik: 'Status Lokalis Regio Inguinalis Dextra: Tampak massa lonjong berukuran 4x3 cm saat valsava maneuver, bising usus (+), impuls batuk (+), massa dapat dimasukkan kembali (reponibel).',
    lab: 'Darah Lengkap: Hb 14.2 g/dL, Leukosit 6.900/uL, Trombosit 260.000/uL, Masa Pembekuan (CT): 5 menit.',
    radiologi: 'USG Inguinoskrotal: Defek fascia anulus inguinalis internus dextra diameter 1.8 cm berisi omentum dan usus.',
    terapi: [
      { nama_obat: 'Asam Mefenamat 500 mg', dosis: '500 mg', frekuensi: '3x1 tablet (prn)', rute: 'Oral' },
      { nama_obat: 'Laktulosa Sirup', dosis: '15 ml', frekuensi: '1x1 malam', rute: 'Oral' }
    ],
    kondisi: 'Perbaikan',
    edukasi: 'Direncanakan tindakan elektif Herniorrhaphy Mesh Plug Repair. Hindari mengangkat beban berat dan batuk keras.',
    kontrol: 'Jadwal Operasi Bedah Elektif di Ruang Operasi (OK 2)'
  },
  {
    poli: 'Poli Urologi',
    layanan: 'Rawat Jalan',
    dpjp: 'dr. Dimas Kurniawan, Sp.U',
    spesialisasi: 'Sp.U (Urologi & Andrologi)',
    keluhan: 'Pancaran kencing melemah, harus mengejan (straining), buang air kecil tidak lampias, sering terbangun kencing malam hari 4-5 kali.',
    rps: 'Keluhan LUTS dialami sejak 1 tahun terakhir memberat 3 bulan ini. Tidak ada kencing berdarah maupun nyeri pinggang.',
    rpd: 'Riwayat hipertensi terkontrol.',
    alergi: 'Tidak ada alergi obat',
    genderRequired: 'L',
    minAge: 55,
    maxAge: 78,
    icd10_p: { kode_icd10: 'N40.1', nama: 'Benign prostatic hyperplasia with lower urinary tract symptoms' },
    icd10_s: [{ kode_icd10: 'R39.1', nama: 'Other difficulties with micturition (Hesitancy)' }],
    icd9: [{ kode_icd9: '60.29', nama: 'Other transurethral prostatectomy' }, { kode_icd9: '88.75', nama: 'Diagnostic ultrasound of urinary system' }],
    fisik: 'Suprapubik: distensi buli minimal. Colok Dubur (DRE): Prostat teraba membesar grade II (volume est 35-40 gram), konsistensi kenyal elastis, sulkus medianus dangkal, nodul (-), nyeri tekan (-).',
    lab: 'PSA Serum: 2.1 ng/mL (Normal <4.0 ng/mL), Ureum: 28 mg/dL, Kreatinin: 1.0 mg/dL, Urinalisis: Eritrosit 0-1/LPB.',
    radiologi: 'USG Saluran Kemih: Volume prostat 38 cc, PVR (Post-Void Residual Urine) 75 mL.',
    terapi: [
      { nama_obat: 'Tamsulosin HCl 0.4 mg', dosis: '0.4 mg', frekuensi: '1x1 kapsul (Malam hari)', rute: 'Oral' },
      { nama_obat: 'Finasteride 5 mg', dosis: '5 mg', frekuensi: '1x1 tablet', rute: 'Oral' }
    ],
    kondisi: 'Perbaikan',
    edukasi: 'Batasi konsumsi kopi dan alkohol, kurangi asupan air 2 jam sebelum tidur, jangan menahan kencing.',
    kontrol: '1 bulan kemudian di Poli Urologi'
  },
  {
    poli: 'Poli Onkologi',
    layanan: 'Rawat Jalan',
    dpjp: 'dr. Bambang Alamsyah, Sp.B, Subsp.Onk(K)',
    spesialisasi: 'Sp.B(K)Onk (Bedah Onkologi)',
    keluhan: 'Kontrol rutin evaluasi karsinoma mammae sinistra pasca kemoterapi siklus ke-6.',
    rps: 'Pasien post MRM mammae sinistra 8 bulan lalu dan telah menuntaskan regimen kemoterapi adjuvant AC-T. Saat ini tidak ada keluhan sesak napas maupun nyeri tulang.',
    rpd: 'Carcinoma Mammae Sinistra T2N1M0 Stage IIB.',
    alergi: 'Ciprofloxacin (Mual muntah berat)',
    genderRequired: 'P',
    minAge: 38,
    maxAge: 68,
    icd10_p: { kode_icd10: 'C50.9', nama: 'Malignant neoplasm of breast, unspecified' },
    icd10_s: [{ kode_icd10: 'Z85.3', nama: 'Personal history of malignant neoplasm of breast' }],
    icd9: [{ kode_icd9: '87.44', nama: 'Chest x-ray routine' }, { kode_icd9: '88.76', nama: 'Ultrasound of abdomen' }],
    fisik: 'KU baik, compos mentis. Status Lokalis Regio Mammae Sinistra: Parut bekas operasi tenang, massa residif (-), pembesaran KGB supraklavikula & aksila dextra (-).',
    lab: 'Tumor Marker CA 15-3: 14.2 U/mL (Normal <30 U/mL), SGOT: 21, SGPT: 24, Hb: 12.4 g/dL.',
    radiologi: 'USG Mammae Dextra & Abdomen: Tidak tampak lesi mencurigakan malignansi maupun nodul metastasis hepar.',
    terapi: [
      { nama_obat: 'Tamoxifen 20 mg', dosis: '20 mg', frekuensi: '1x1 tablet', rute: 'Oral' },
      { nama_obat: 'Kalsium + Vitamin D3', dosis: '1 tablet', frekuensi: '1x1 tablet', rute: 'Oral' }
    ],
    kondisi: 'Perbaikan',
    edukasi: 'Konsumsi terapi hormonal Tamoxifen secara disiplin harian, periksa payudara kanan sendiri (SADARI) tiap bulan.',
    kontrol: '3 bulan kemudian di Poli Onkologi'
  },
  {
    poli: 'Poli Geriatri',
    layanan: 'Rawat Jalan',
    dpjp: 'dr. Hendra Pratama, Sp.PD-KGer',
    spesialisasi: 'Sp.PD-KGer (Geriatri & Multimorbiditas)',
    keluhan: 'Lemas menyeluruh, nafsu makan menurun, penurunan berat badan, serta sering hampir terjatuh saat berjalan.',
    rps: 'Pasien lansia 72 tahun dibawa keluarga karena mobilitas lambat, kesulitan bangun dari kursi, dan penurunan massa otot.',
    rpd: 'Hipertensi 15 tahun, Osteoarthritis genu bilateral.',
    alergi: 'Tidak ada alergi',
    minAge: 65,
    maxAge: 85,
    icd10_p: { kode_icd10: 'R54', nama: 'Age-related physical debility (Frailty & Sarcopenia)' },
    icd10_s: [{ kode_icd10: 'M81.0', nama: 'Age-related osteoporosis without current pathological fracture' }, { kode_icd10: 'I10', nama: 'Essential hypertension' }],
    icd9: [{ kode_icd9: '89.04', nama: 'Comprehensive geriatric assessment (CGA)' }],
    fisik: 'KU tampak kurus dan renta, skor Barthel ADL: 85 (ketergantungan ringan), TUG Test (Timed Up and Go): 18 detik (>12 detik risiko jatuh tinggi). Massa otot quadriceps menurun.',
    lab: 'Albumin: 3.4 g/dL (Sedikit rendah), Vitamin D 25-OH: 16 ng/mL (Defisiensi), Hb: 11.2 g/dL.',
    radiologi: 'DEXA Bone Mineral Density: T-Score L1-L4 -2.8 (Osteoporosis).',
    terapi: [
      { nama_obat: 'Kolekalsiferol (Vitamin D3) 5000 IU', dosis: '5000 IU', frekuensi: '1x1 kapsul (Pagi)', rute: 'Oral' },
      { nama_obat: 'Kalsium Karbonat 500 mg', dosis: '500 mg', frekuensi: '2x1 tablet', rute: 'Oral' },
      { nama_obat: 'Suplemen Asam Amino Esensial & Protein Whey', dosis: '1 scoop', frekuensi: '2x sehari', rute: 'Oral' }
    ],
    kondisi: 'Perbaikan',
    edukasi: 'Pencegahan jatuh di rumah (pasang handrail di kamar mandi, singkirkan karpet licin, penerangan cukup), latihan keseimbangan dan resistensi ringan.',
    kontrol: '1 bulan kemudian di Poli Geriatri'
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// GENERATOR 100+ PASIEN DENGAN KESESUAIAN GENDER & KLINIS LENGKAP
// ═══════════════════════════════════════════════════════════════════════════
const MALE_FIRST_NAMES = [
  'Ahmad', 'Budi', 'Dimas', 'Eko', 'Gunawan', 'Hendra', 'Indra', 'Joko', 'Lukman', 'Maulana',
  'Nugroho', 'Pratama', 'Rahmat', 'Taufik', 'Wahyu', 'Yogi', 'Zainal', 'Agus', 'Bayu', 'Chandra',
  'Farhan', 'Haris', 'Kurniawan', 'Bambang', 'Fachri', 'Irawan', 'Darmawan', 'Surya', 'Tirta', 'Zulkifli'
];

const FEMALE_FIRST_NAMES = [
  'Citra', 'Dewi', 'Endang', 'Fani', 'Gita', 'Hany', 'Ika', 'Indah', 'Juita', 'Kartika',
  'Lestari', 'Maya', 'Mega', 'Nurul', 'Oki', 'Putri', 'Rina', 'Rini', 'Siti', 'Utami',
  'Vina', 'Wulan', 'Yulia', 'Dian', 'Ayu', 'Ratna', 'Sari', 'Tri', 'Anisa', 'Nadia'
];

const NAMA_BELAKANG = [
  'Pratama', 'Santoso', 'Wijaya', 'Kusuma', 'Hidayat', 'Saputra', 'Lestari', 'Setiawan', 'Permata', 'Siregar',
  'Wulandari', 'Hakim', 'Alamsyah', 'Ramadhan', 'Nugraha', 'Mahendra', 'Purnomo', 'Syahputra', 'Firmansyah', 'Sudrajat',
  'Suharto', 'Yudhistira', 'Anwar', 'Chandra', 'Darsono', 'Gunawan', 'Handayani', 'Iskandar', 'Jayadi', 'Kamil',
  'Latief', 'Mulyadi', 'Nasution', 'Oktavian', 'Pambudi', 'Qolbi', 'Riyadi', 'Subekti', 'Tanoto', 'Utomo'
];

const KOTA_ALAMAT = [
  'Jl. Sudirman No.', 'Jl. Thamrin No.', 'Jl. Gatot Subroto No.', 'Jl. Melawai No.', 'Jl. Kemang Raya No.',
  'Jl. Rasuna Said No.', 'Jl. Asia Afrika No.', 'Jl. Senopati No.', 'Jl. Cikini Raya No.', 'Jl. Diponegoro No.'
];

export function generateAllPatientsWithResumes(): PatientFullRecord[] {
  const result: PatientFullRecord[] = [];

  for (let i = 1; i <= 250; i++) {
    const caseTemplate = MEDICAL_CASES[(i - 1) % MEDICAL_CASES.length];
    
    // Strict gender matching based on clinical indication
    let jk: 'L' | 'P';
    if (caseTemplate.genderRequired) {
      jk = caseTemplate.genderRequired;
    } else {
      jk = i % 2 === 1 ? 'L' : 'P';
    }

    const fName = jk === 'L' 
      ? MALE_FIRST_NAMES[(i - 1) % MALE_FIRST_NAMES.length] 
      : FEMALE_FIRST_NAMES[(i - 1) % FEMALE_FIRST_NAMES.length];
    const lName = NAMA_BELAKANG[((i * 3) + 7) % NAMA_BELAKANG.length];
    const namaLengkap = `${fName} ${lName}`;

    // Age calculation according to clinical specialty bounds
    let age: number;
    if (caseTemplate.minAge !== undefined && caseTemplate.maxAge !== undefined) {
      const span = caseTemplate.maxAge - caseTemplate.minAge;
      age = caseTemplate.minAge + ((i * 3) % (span + 1));
    } else {
      age = 22 + ((i * 7) % 50);
    }

    const birthYear = 2026 - age;
    const birthMonth = String(((i * 3) % 12) + 1).padStart(2, '0');
    const birthDay = String(((i * 5) % 28) + 1).padStart(2, '0');
    const tglLahir = `${birthYear}-${birthMonth}-${birthDay}`;
    const golDarah: ('A' | 'B' | 'AB' | 'O') = ['A', 'B', 'AB', 'O'][i % 4] as any;
    const penjaminList = [
      'BPJS Kesehatan (PBI)',
      'BPJS Kesehatan (Non-PBI)',
      'Umum / Pribadi',
      'Asuransi Mandiri Inhealth',
      'Asuransi Allianz Care',
      'PT Pertamina (Persero)'
    ];
    const penjamin = penjaminList[i % penjaminList.length];

    const noRm = `RM-${String(i).padStart(4, '0')}`;
    const noResume = `RES-2026-${String(i).padStart(4, '0')}`;
    const nik = `3171${String(100000000000 + (i * 12345678)).substring(0, 12)}`;
    const phone = `0812${String(10000000 + (i * 87654)).substring(0, 8)}`;
    const alamat = `${KOTA_ALAMAT[i % KOTA_ALAMAT.length]} ${i * 4}, Jakarta Pusat`;

    // Vital signs calculation adapted to age and condition
    let tdSys = 110 + ((i * 3) % 35);
    let tdDia = 70 + ((i * 2) % 20);
    if (age < 12) {
      tdSys = 95 + (age * 2);
      tdDia = 60 + Math.floor(age * 1.5);
    }

    const hr = age < 12 ? (95 + (i % 20)) : (72 + (i % 22));
    const temp = (36.4 + ((i % 8) * 0.1)).toFixed(1);
    const rr = age < 12 ? 22 : (16 + (i % 5));
    const spo2 = 97 + (i % 3);

    let bb: string;
    let tb: string;
    if (caseTemplate.bbDefault && caseTemplate.tbDefault) {
      bb = String(caseTemplate.bbDefault);
      tb = String(caseTemplate.tbDefault);
    } else if (age < 12) {
      bb = (12 + (i % 14)).toFixed(1);
      tb = (85 + (i % 30)).toFixed(0);
    } else {
      bb = (52 + (i % 36)).toFixed(0);
      tb = (153 + (i % 23)).toFixed(0);
    }

    const heightInM = parseFloat(tb) / 100;
    const imtVal = (parseFloat(bb) / (heightInM * heightInM)).toFixed(1);

    // Realistic profession assignment
    let pekerjaan: string;
    if (age < 7) {
      pekerjaan = 'Balita / Belum Bekerja';
    } else if (age < 18) {
      pekerjaan = 'Pelajar';
    } else if (age < 23) {
      pekerjaan = 'Mahasiswa';
    } else if (age >= 65) {
      pekerjaan = 'Pensiunan';
    } else if (jk === 'P') {
      pekerjaan = ['Ibu Rumah Tangga', 'Karyawan Swasta', 'PNS / Guru', 'Wiraswasta', 'Apoteker'][i % 5];
    } else {
      pekerjaan = ['Karyawan Swasta', 'PNS / ASN', 'Wiraswasta', 'Insinyur / Teknisi', 'Guru / Dosen'][i % 5];
    }

    const resume: ClinicalResume = {
      id: `RES-${i}`,
      no_resume: noResume,
      pasien_id: String(i),
      nama_pasien: namaLengkap,
      no_rm: noRm,
      nik: nik,
      umur: age,
      jenis_kelamin: jk,
      penjamin: penjamin,
      layanan: caseTemplate.layanan,
      unit_pelayanan: caseTemplate.poli,
      dokter_dpjp: caseTemplate.dpjp,
      spesialisasi_dpjp: caseTemplate.spesialisasi,
      tgl_masuk: '2026-08-20',
      tgl_keluar: '2026-08-24',
      lama_rawat: caseTemplate.layanan === 'Rawat Inap' ? '4 Hari' : '1 Hari (Rawat Jalan)',
      keluhan_utama: caseTemplate.keluhan,
      riwayat_penyakit_sekarang: caseTemplate.rps,
      riwayat_penyakit_dahulu: caseTemplate.rpd,
      riwayat_alergi: caseTemplate.alergi,
      tanda_vital: {
        td: `${tdSys}/${tdDia} mmHg`,
        nadi: `${hr} x/menit`,
        suhu: `${temp} °C`,
        rr: `${rr} x/menit`,
        spo2: `${spo2} %`,
        bb: `${bb} kg`,
        tb: `${tb} cm`,
        imt: `${imtVal} kg/m²`
      },
      pemeriksaan_fisik: caseTemplate.fisik,
      pemeriksaan_penunjang: {
        lab: caseTemplate.lab,
        radiologi: caseTemplate.radiologi
      },
      diagnosis_primer: caseTemplate.icd10_p,
      diagnosis_sekunder: caseTemplate.icd10_s,
      tindakan_prosedur: caseTemplate.icd9,
      terapi_farmakologi: caseTemplate.terapi,
      obat_pulang: caseTemplate.terapi.map(t => ({
        nama_obat: t.nama_obat,
        dosis: t.dosis,
        frekuensi: t.frekuensi,
        aturan_pakai: t.rute,
        jumlah: '30 Tablet'
      })),
      kondisi_pulang: caseTemplate.kondisi,
      instruksi_edukasi: caseTemplate.edukasi || caseTemplate.instruksi || 'Patuhi anjuran diet, istirahat cukup, dan minum obat teratur.',
      jadwal_kontrol: caseTemplate.kontrol || '1 Minggu kemudian ke Poli Terkait',
      tte_status: 'Tersertifikasi BSrE',
      tte_timestamp: '2026-08-24 11:30:00 WIB'
    };

    result.push({
      id: String(i),
      no_rm: noRm,
      nik: nik,
      nama: namaLengkap,
      nama_pasien: namaLengkap,
      jenis_kelamin: jk,
      tanggal_lahir: tglLahir,
      tgl_lahir: tglLahir,
      umur: age,
      penjamin: penjamin,
      no_hp: phone,
      telepon: phone,
      alamat: alamat,
      golongan_darah: golDarah,
      pekerjaan: pekerjaan,
      agama: ['Islam', 'Kristen Protestan', 'Katolik', 'Hindu', 'Buddha'][i % 5],
      poli_tujuan: caseTemplate.poli,
      status: 'Aktif',
      problem_list: [
        {
          id: 1,
          nama: caseTemplate.icd10_p.nama,
          kode_icd10: caseTemplate.icd10_p.kode_icd10,
          tanggal_onset: '2026-01-10',
          severity: 'Moderate',
          status: 'Active'
        },
        ...caseTemplate.icd10_s.map((s, sIdx) => ({
          id: sIdx + 2,
          nama: s.nama,
          kode_icd10: s.kode_icd10,
          tanggal_onset: '2025-06-15',
          severity: 'Mild' as const,
          status: 'Active' as const
        }))
      ],
      medications: caseTemplate.terapi.map((t, tIdx) => ({
        id: tIdx + 1,
        name: t.nama_obat,
        dose: `${t.dosis} (${t.rute})`,
        frequency: t.frekuensi,
        startDate: '2026-08-20',
        status: 'Active'
      })),
      allergies: caseTemplate.alergi !== 'Tidak ada alergi' && caseTemplate.alergi !== 'Tidak ada alergi obat' && caseTemplate.alergi !== 'Tidak ada riwayat alergi' ? [
        {
          id: 1,
          allergen: caseTemplate.alergi.split(' (')[0],
          reaction: caseTemplate.alergi.split(' (')[1]?.replace(')', '') || 'Reaksi hipersensitivitas',
          severity: 'Severe',
          tanggal_diketahui: '2022-04-12',
          verified_by: caseTemplate.dpjp
        }
      ] : [],
      vitals: [
        {
          id: 1,
          date: '24 Agu 2026 09:00',
          bp: `${tdSys}/${tdDia}`,
          hr: String(hr),
          temp: String(temp),
          rr: String(rr),
          spo2: String(spo2),
          tb: tb,
          bb: bb
        },
        {
          id: 2,
          date: '10 Jul 2026 10:15',
          bp: `${tdSys - 5}/${tdDia - 3}`,
          hr: String(hr - 2),
          temp: '36.5',
          rr: '18',
          spo2: '99',
          tb: tb,
          bb: bb
        }
      ],
      immunizations: [
        { id: 1, vaksin: 'Hepatitis B Recombinant', tanggal: '2024-02-10', faskes: 'MYITARU SIMK', batch: 'HB-9981' },
        { id: 2, vaksin: 'Influenza Quadrivalent', tanggal: '2025-11-05', faskes: 'MYITARU SIMK', batch: 'INF-4432' },
        { id: 3, vaksin: 'COVID-19 Booster 2 (InaVac)', tanggal: '2023-08-14', faskes: 'Puskesmas Gambir', batch: 'COV-8821' }
      ],
      soap: {
        s: `S: ${caseTemplate.keluhan}. ${caseTemplate.rps}. Riwayat: ${caseTemplate.rpd}. Alergi: ${caseTemplate.alergi}.`,
        o: `O: Keadaan Umum: Compos Mentis. TD: ${tdSys}/${tdDia} mmHg, Nadi: ${hr} x/m, Suhu: ${temp} C, RR: ${rr} x/m, SpO2: ${spo2}%. Pemeriksaan Fisik: ${caseTemplate.fisik}. Lab: ${caseTemplate.lab}.`,
        a: `A: Diagnosis Primer: ${caseTemplate.icd10_p.nama} (${caseTemplate.icd10_p.kode_icd10}). Diagnosis Sekunder: ${caseTemplate.icd10_s.map(s => `${s.nama} (${s.kode_icd10})`).join(', ')}.`,
        p: `P: Terapi: ${caseTemplate.terapi.map(t => `${t.nama_obat} ${t.dosis} ${t.frekuensi}`).join(', ')}. Prosedur: ${caseTemplate.icd9.map(x => x.nama).join(', ')}. Edukasi: ${caseTemplate.edukasi || caseTemplate.instruksi || 'Patuhi terapi dan anjuran dokter'}. Kontrol: ${caseTemplate.kontrol || '1 Minggu kemudian'}.`
      },
      resume_medis: resume
    });
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA 50+ PASIEN IGD LENGKAP DENGAN RESUME GAWAT DARURAT
// ═══════════════════════════════════════════════════════════════════════════
export function generate50IGDPatients() {
  const KONDISI_IGD = [
    { triage: 'Merah', diagnosa: 'STEMI Anteroseptal Akut (I21.0)', kondisi: 'Nyeri dada khas infark substernal > 30 mnt, keringat dingin, EKG ST Elevasi V1-V4', tindakan: 'Loading Aspilet 320mg + Clopidogrel 300mg, O2 4 L/m, Pasang IV Line ganda, Hubungi Ruang Catheterization Lab Cito', status: 'Resusitasi' },
    { triage: 'Merah', diagnosa: 'Status Asmatikus Berat (J45.9)', kondisi: 'Sesak napas berat tidak dapat bicara kalimat penuh, wheezing ekspirasi & inspirasi, SpO2 88%', tindakan: 'Nebulisasi Salbutamol 5mg + Ipratropium 0.5mg tiap 20 mnt, Injeksi Metilprednisolon 62.5mg IV, O2 NRM 10 L/m', status: 'Resusitasi' },
    { triage: 'Merah', diagnosa: 'Cedera Kepala Berat GCS 7 (S06.9)', kondisi: 'KLL penurunan kesadaran, pupil anisokor, muntah proyektil, jejas temporoparietal sinistra', tindakan: 'Proteksi Cervical Collar, Intubasi ETT no 7.5, Infus Mannitol 20% 200ml cepat, CT Scan Kepala Cito', status: 'Resusitasi' },
    { triage: 'Merah', diagnosa: 'Syok Anafilaksis Pasca Injeksi (T78.2)', kondisi: 'Urtikaria luas, edema bibir dan laring, TD 60/40 mmHg, stridor inspirasi, sianosis perifer', tindakan: 'Injeksi Epinefrin/Adrenalin 0.5 mg IM paha lateral, Loading RL 1000 ml cepat, Diphenhydramine 50mg IV, Dexamethasone 10mg IV', status: 'Resusitasi' },
    { triage: 'Merah', diagnosa: 'Syok Hipovolemik ec Perdarahan Saluran Cerna Atas (K92.2)', kondisi: 'Hematemesis melena masif, akral dingin basah, nadi 130x/m teraba lemah, TD 75/50 mmHg', tindakan: 'Pasang NGT bilas lambung es, Loading Koloid/Kristaloid 2 Jalur 16G, Injeksi Omeprazole 80mg Bolus IV dilanjutkan Drip, Transfusi PRC Cito', status: 'Resusitasi' },
    { triage: 'Kuning', diagnosa: 'Fraktur Tertutup Femur 1/3 Tengah Dextra (S72.3)', kondisi: 'Nyeri hebat paha kanan, deformitas pemendekan tungkai, pulsasi arteri dorsalis pedis teraba kuat', tindakan: 'Fiksasi Pembidaian (Spalk Thomas Splint), Injeksi Ketorolac 30mg IV + Tramadol 50mg IV, Foto Rontgen Femur AP/Lat', status: 'Observasi' },
    { triage: 'Kuning', diagnosa: 'Kolik Renal Akut ec Suspek Batu Ureter (N23)', kondisi: 'Nyeri pinggang menjalar ke selangkangan hilang timbul hebat (VAS 8/10), mual, hematuria mikroskopis', tindakan: 'Injeksi Ketorolac 30mg IV + Hyoscine-N-butylbromide 20mg IV, Infus NaCl 0.9% 500ml/8jam, USG Abdomen/Urologi', status: 'Observasi' },
    { triage: 'Kuning', diagnosa: 'Apendisitis Akut Non-Perforasi (K35.8)', kondisi: 'Nyeri perut kanan bawah (McBurney sign positif), demam 38.2C, leukositosis 14.500', tindakan: 'Puasa, Infus Asering 20 tpm, Injeksi Ceftriaxone 1g IV skin test, Konsul Dokter Spesialis Bedah Umum untuk Apendektomi', status: 'Observasi' },
    { triage: 'Kuning', diagnosa: 'Krisis Hipertensi / Hipertensi Urgensi (I10)', kondisi: 'TD 210/120 mmHg, nyeri tengkuk hebat, pandangan kabur, tidak ada defisit neurologis fokal', tindakan: 'Pemberian Captopril 25mg Sublingual, Observasi TD tiap 15 menit, Injeksi Furosemide 20mg IV jika overload cairan', status: 'Observasi' },
    { triage: 'Kuning', diagnosa: 'Dengue Hemorrhagic Fever Grade II (A91)', kondisi: 'Demam hari ke-4, epitaksis (mimisan), uji bendung tourniquet positif, Trombosit 68.000, Ht 46%', tindakan: 'Loading Cairan RL 7 ml/kgBB/jam, monitoring ketat tanda vital & balans cairan, cek darah lengkap ulang per 6 jam', status: 'Observasi' },
    { triage: 'Hijau', diagnosa: 'Vulnus Laceratum Regio Antebrachii (S51.8)', kondisi: 'Luka robek terbuka 5 cm akibat pecahan kaca, perdarahan aktif minimal, tepi luka rata', tindakan: 'Aseptik-antiseptik, anastesi lokal Lidocain 2%, wound toilet, penjahitan luka (hecting) 6 simpul, ATS 1500 IU IM', status: 'Tindakan' },
    { triage: 'Hijau', diagnosa: 'Gastroenteritis Akut Dehidrasi Ringan (A09)', kondisi: 'BAB cair 4 kali sehari, muntah 1 kali, mata tidak cowong, turgor kulit kembali cepat', tindakan: 'Oralit 200ml tiap BAB, Zinc 20mg 1x1, Attapulgite 2 tab, Paracetamol 500mg jika demam, edukasi hidrasi', status: 'Stabil/Pulang' },
    { triage: 'Hijau', diagnosa: 'Dispepsia Fungsional Akut (K30)', kondisi: 'Nyeri ulu hati seperti perih terbakar setelah konsumsi makanan pedas, kembung, mual', tindakan: 'Injeksi Ranitidine 50mg IV / Antasida sirup 1 C, Sucralfate sirup 3x1 C sebelum makan', status: 'Stabil/Pulang' }
  ];

  return Array.from({ length: 55 }, (_, idx) => {
    const i = idx + 1;
    const isFemale = idx % 2 === 0;
    const fName = isFemale ? FEMALE_FIRST_NAMES[idx % FEMALE_FIRST_NAMES.length] : MALE_FIRST_NAMES[idx % MALE_FIRST_NAMES.length];
    const lName = NAMA_BELAKANG[((idx * 4) + 3) % NAMA_BELAKANG.length];
    const item = KONDISI_IGD[idx % KONDISI_IGD.length];
    const hour = String(6 + (idx % 16)).padStart(2, '0');
    const minute = String((idx * 13) % 60).padStart(2, '0');
    const tdSys = item.triage === 'Merah' ? 80 + (idx % 20) : (item.triage === 'Kuning' ? 130 + (idx % 50) : 120);
    const tdDia = item.triage === 'Merah' ? 50 + (idx % 15) : 80;
    const hr = item.triage === 'Merah' ? 115 + (idx % 20) : 80 + (idx % 15);
    const suhu = (36.5 + ((idx % 25) * 0.1)).toFixed(1);
    const rr = item.triage === 'Merah' ? 26 + (idx % 6) : 18 + (idx % 4);
    const age = 15 + (idx % 60);

    return {
      id: i,
      nomor: `IGD-2026-${String(i).padStart(3, '0')}`,
      no_rm: `RM-${String(i).padStart(4, '0')}`,
      name: `${fName} ${lName}`,
      nama_pasien: `${fName} ${lName}`,
      age: age,
      umur: `${age} Thn`,
      triage: item.triage,
      condition: item.kondisi,
      kondisi: item.kondisi,
      diagnosa: item.diagnosa,
      tindakan: item.tindakan,
      time: `${hour}:${minute}`,
      waktu: `Hari ini, ${hour}:${minute} WIB`,
      tanggal: '2026-08-24',
      status: item.status,
      tensi: `${tdSys}/${tdDia}`,
      td: `${tdSys}/${tdDia}`,
      nadi: `${hr}`,
      suhu: `${suhu}`,
      rr: `${rr}`,
      spo2: item.triage === 'Merah' ? '91%' : '98%',
      dokter_jaga: idx % 2 === 0 ? 'dr. Budi Santoso, Sp.EM' : 'dr. Ahmad Dahlan, Sp.B',
      penjamin: idx % 2 === 0 ? 'BPJS Kesehatan' : 'Umum',
      vitals: [
        { time: `${hour}:${minute}`, hr: hr, bp: tdSys }
      ]
    };
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA 50+ RAWAT INAP (BEDS & ADMISI & DISCHARGE SUMMARY)
// ═══════════════════════════════════════════════════════════════════════════
export function generate50InpatientBeds() {
  const ROOMS = [
    { room: 'Mawar', class: 'Kelas 1', totalBeds: 8, prefix: 'R-1' },
    { room: 'Melati', class: 'VIP', totalBeds: 6, prefix: 'R-2' },
    { room: 'Tulip', class: 'Kelas 3', totalBeds: 12, prefix: 'R-3' },
    { room: 'Dahlia', class: 'Kelas 2', totalBeds: 10, prefix: 'R-4' },
    { room: 'Anggrek', class: 'Kelas 1', totalBeds: 8, prefix: 'R-5' },
    { room: 'Cendana', class: 'Isolasi Infeksius', totalBeds: 4, prefix: 'R-6' },
    { room: 'Bougenville (HCU)', class: 'HCU / Intermediet', totalBeds: 6, prefix: 'R-7' }
  ];

  const DIAGNOSA_RANAP = [
    { dx: 'DHF Grade II dengan Trombositopenia (A91)', dpjp: 'dr. Hendra Pratama, Sp.PD', genderReq: undefined },
    { dx: 'Pneumonia Komuniti Berat (J18.9)', dpjp: 'dr. Lukman Hakim, Sp.P', genderReq: undefined },
    { dx: 'Stroke Iskemik Akut Trombotik (I63.9)', dpjp: 'dr. Fajar Hidayat, Sp.N', genderReq: undefined },
    { dx: 'Post-Op Laparoskopi Kolesistektomi H+2 (K80.2)', dpjp: 'dr. Bambang Alamsyah, Sp.B', genderReq: undefined },
    { dx: 'Post-Op ORIF Fraktur Femur Dextra H+3 (S72.3)', dpjp: 'dr. Wahyu Nugroho, Sp.OT', genderReq: undefined },
    { dx: 'Gagal Jantung Kongestif NYHA FC III (I50.9)', dpjp: 'dr. Joko Santoso, Sp.JP', genderReq: undefined },
    { dx: 'DM Tipe 2 dengan Ulkus Diabetikum Pedis Sinistra Wagner 3 (E11.7)', dpjp: 'dr. Hendra Pratama, Sp.PD', genderReq: undefined },
    { dx: 'Gastroenteritis Akut dengan Dehidrasi Sedang (A09)', dpjp: 'dr. Hendra Pratama, Sp.PD', genderReq: undefined },
    { dx: 'Penyakit Ginjal Kronik Stage 5 on HD Reguler (N18.5)', dpjp: 'dr. Hendra Pratama, Sp.PD', genderReq: undefined },
    { dx: 'Sepsis ec Infeksi Saluran Kemih Komplikata (A41.9)', dpjp: 'dr. Hendra Pratama, Sp.PD', genderReq: undefined },
    { dx: 'Post-Op Seksio Sesarea Hari ke-2 + Bayi Sehat (O82)', dpjp: 'dr. Citra Lestari, Sp.OG', genderReq: 'P' as const },
    { dx: 'Tuberkulosis Paru Kasus Baru dengan Efusi Pleura (A15.6)', dpjp: 'dr. Lukman Hakim, Sp.P', genderReq: undefined }
  ];

  const bedsList: any[] = [];
  let bedCounter = 1;

  ROOMS.forEach(r => {
    for (let b = 1; b <= r.totalBeds; b++) {
      const isOccupied = bedCounter % 5 !== 0; // 80% occupied
      const isCleaning = bedCounter % 5 === 0 && bedCounter % 2 === 0;
      const diagItem = DIAGNOSA_RANAP[bedCounter % DIAGNOSA_RANAP.length];
      const isFemale = diagItem.genderReq === 'P' || (diagItem.genderReq === undefined && bedCounter % 2 === 0);
      const fName = isFemale 
        ? FEMALE_FIRST_NAMES[bedCounter % FEMALE_FIRST_NAMES.length] 
        : MALE_FIRST_NAMES[bedCounter % MALE_FIRST_NAMES.length];
      const lName = NAMA_BELAKANG[(bedCounter * 2) % NAMA_BELAKANG.length];
      const pName = `${fName} ${lName}`;
      const dx = diagItem.dx;
      const dpjp = diagItem.dpjp;
      const admitDay = 20 + (bedCounter % 4);

      bedsList.push({
        id: `${r.prefix}${String(b).padStart(2, '0')}`,
        kode_bed: `${r.room}-${b}`,
        room: r.room,
        ruangan: `${r.room} (Bed ${b})`,
        class: r.class,
        kelas: r.class,
        status: isCleaning ? 'Dibersihkan' : (isOccupied ? 'Terisi' : 'Kosong'),
        patient: isOccupied ? pName : '-',
        nama_pasien: isOccupied ? pName : '-',
        no_rm: isOccupied ? `RM-${String(bedCounter + 10).padStart(4, '0')}` : '-',
        diagnosa: isOccupied ? dx : '-',
        keterangan: isOccupied ? `DPJP: ${dpjp}` : (isCleaning ? 'Sedang desinfeksi dan penggantian linen' : 'Siap huni'),
        tanggal: `2026-08-${admitDay}`,
        tgl_masuk: `2026-08-${admitDay}`,
        dpjp: dpjp,
        penjamin: bedCounter % 2 === 0 ? 'BPJS Kesehatan' : 'Asuransi Mandiri Inhealth'
      });
      bedCounter++;
    }
  });

  return bedsList;
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA 50+ JADWAL & PASIEN KAMAR OPERASI
// ═══════════════════════════════════════════════════════════════════════════
export function generate50SurgeryPatients() {
  const SURGERIES = [
    { tindakan: 'Laparoskopi Kolesistektomi (Eksisi Kantung Empedu)', icd9: '51.23', operator: 'dr. Bambang Alamsyah, Sp.B, Subsp.BD(K)', anastesi: 'dr. Indra Gunawan, Sp.An-TI', tipe_anastesi: 'General Anesthesia (GA)', ok: 'OK 1 - Mayor Laparoskopi', durasi: '120 Menit', genderReq: undefined },
    { tindakan: 'Seksio Sesarea Cito (Persalinan Bedah Sesar)', icd9: '74.1', operator: 'dr. Citra Lestari, Sp.OG', anastesi: 'dr. Rahmat Setiawan, Sp.An', tipe_anastesi: 'Regional Spinal Anesthesia', ok: 'OK 4 - Emergency & Obstetri', durasi: '60 Menit', genderReq: 'P' as const },
    { tindakan: 'ORIF Fraktur Femur Dextra dengan Locking Plate', icd9: '79.35', operator: 'dr. Wahyu Nugroho, Sp.OT(K)', anastesi: 'dr. Indra Gunawan, Sp.An-TI', tipe_anastesi: 'Regional Spinal / Epidural', ok: 'OK 2 - Orthopedi & Trauma', durasi: '150 Menit', genderReq: undefined },
    { tindakan: 'TURP (Transurethral Resection of the Prostate)', icd9: '60.29', operator: 'dr. Dimas Kurniawan, Sp.U', anastesi: 'dr. Rahmat Setiawan, Sp.An', tipe_anastesi: 'Regional Spinal Anesthesia', ok: 'OK 3 - Urologi & Endourologi', durasi: '90 Menit', genderReq: 'L' as const },
    { tindakan: 'Fakoemulsifikasi + Implan Lensa Lipat OD (Katarak)', icd9: '13.41', operator: 'dr. Gita Permata, Sp.M', anastesi: 'dr. Hany Lestari, Sp.An', tipe_anastesi: 'Topikal + Blok Peribulbar', ok: 'OK 5 - Bedah Mata Mikro', durasi: '30 Menit', genderReq: undefined },
    { tindakan: 'Apendektomi Laparoskopi Akut', icd9: '47.01', operator: 'dr. Bambang Alamsyah, Sp.B', anastesi: 'dr. Indra Gunawan, Sp.An-TI', tipe_anastesi: 'General Anesthesia (GA)', ok: 'OK 1 - Mayor Laparoskopi', durasi: '75 Menit', genderReq: undefined },
    { tindakan: 'Tonsilektomi & Adenoidektomi Bilateral', icd9: '28.3', operator: 'dr. Irawan Hakim, Sp.THT-BKL', anastesi: 'dr. Hany Lestari, Sp.An', tipe_anastesi: 'General Anesthesia (GA)', ok: 'OK 3 - THT & Bedah Mulut', durasi: '45 Menit', genderReq: undefined },
    { tindakan: 'Mastektomi Radikal Modifikasi (MRM) Dextra', icd9: '85.43', operator: 'dr. Bambang Alamsyah, Sp.B, Subsp.Onk(K)', anastesi: 'dr. Rahmat Setiawan, Sp.An', tipe_anastesi: 'General Anesthesia (GA)', ok: 'OK 2 - Bedah Onkologi', durasi: '180 Menit', genderReq: 'P' as const },
    { tindakan: 'Tiroidektomi Subtotalis ec Struma Nodusa Non-Toksik', icd9: '06.39', operator: 'dr. Bambang Alamsyah, Sp.B', anastesi: 'dr. Indra Gunawan, Sp.An-TI', tipe_anastesi: 'General Anesthesia (GA)', ok: 'OK 1 - Mayor Laparoskopi', durasi: '120 Menit', genderReq: undefined },
    { tindakan: 'Hernioraphy Mesh Plug Inguinalis Lateralis Dextra', icd9: '53.05', operator: 'dr. Bambang Alamsyah, Sp.B', anastesi: 'dr. Rahmat Setiawan, Sp.An', tipe_anastesi: 'Regional Spinal Anesthesia', ok: 'OK 2 - Bedah Umum', durasi: '60 Menit', genderReq: 'L' as const },
    { tindakan: 'Artroskopi Rekonstruksi ACL Genu Sinistra', icd9: '81.45', operator: 'dr. Wahyu Nugroho, Sp.OT(K)', anastesi: 'dr. Indra Gunawan, Sp.An-TI', tipe_anastesi: 'General Anesthesia / Spinal', ok: 'OK 2 - Orthopedi & Sports', durasi: '120 Menit', genderReq: undefined },
    { tindakan: 'Odontektomi M3 Impaksi Gigi Rahang Bawah Bilateral', icd9: '23.19', operator: 'drg. Fachri Alif, Sp.BM', anastesi: 'dr. Hany Lestari, Sp.An', tipe_anastesi: 'General Anesthesia (GA)', ok: 'OK 3 - Bedah Mulut', durasi: '45 Menit', genderReq: undefined }
  ];

  return Array.from({ length: 52 }, (_, idx) => {
    const i = idx + 1;
    const op = SURGERIES[idx % SURGERIES.length];
    const isFemale = op.genderReq === 'P' || (op.genderReq === undefined && idx % 2 === 0);
    const fName = isFemale
      ? FEMALE_FIRST_NAMES[(idx * 2) % FEMALE_FIRST_NAMES.length]
      : MALE_FIRST_NAMES[(idx * 2) % MALE_FIRST_NAMES.length];
    const lName = NAMA_BELAKANG[((idx * 3) + 5) % NAMA_BELAKANG.length];
    const pName = `${fName} ${lName}`;
    const hour = String(7 + (idx % 12)).padStart(2, '0');
    const day = 20 + (idx % 5);
    const statuses = ['Terjadwal', 'Sedang Operasi', 'Selesai - Recovery PACU', 'Selesai - Rawat Inap'];
    const status = statuses[idx % statuses.length];

    return {
      id: i,
      nomor: `OP-2026-${String(i).padStart(3, '0')}`,
      no_rm: `RM-${String(i + 5).padStart(4, '0')}`,
      pasien: pName,
      nama_pasien: pName,
      jenis: op.tindakan,
      tindakan: op.tindakan,
      kode_icd9: op.icd9,
      dokter: op.operator,
      operator: op.operator,
      anastesi: op.anastesi,
      tipe_anastesi: op.tipe_anastesi,
      ruang_ok: op.ok,
      durasi: op.durasi,
      tanggal: `2026-08-${day} ${hour}:00 WIB`,
      status: status,
      checklist_who: 'Lengkap (Sign In, Time Out, Sign Out Terverifikasi)',
      penjamin: idx % 3 === 0 ? 'Umum / Mandiri' : 'BPJS Kesehatan'
    };
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// DATA 50+ PEMERIKSAAN LAB & RADIOLOGI LENGKAP
// ═══════════════════════════════════════════════════════════════════════════
export function generate50LabAndRadRequests() {
  const LAB_TESTS = [
    { test: 'Darah Lengkap 5-Diff + LED', loinc: '58410-2', results: 'Hb: 13.8 g/dL (N: 13-17), Leukosit: 7.800 /uL (N: 4.500-11.000), Trombosit: 265.000 /uL (N: 150.000-450.000), Hematokrit: 41.5%, LED: 12 mm/jam (N: <15). Kesan: Normal.' },
    { test: 'Profil Lipid Lengkap (Kolesterol, HDL, LDL, TG)', loinc: '24331-1', results: 'Kolesterol Total: 228 mg/dL (Tinggi, N: <200), HDL: 42 mg/dL (N: >40), LDL: 154 mg/dL (Optimal: <100), Trigliserida: 190 mg/dL (N: <150). Kesan: Dislipidemia Campuran.' },
    { test: 'Hemoglobin A1c (HbA1c) HPLC', loinc: '4548-4', results: 'HbA1c: 8.4 % (Target DM: <7.0%). Kesan: Kontrol glikemik belum optimal, estimasi rata-rata glukosa 194 mg/dL.' },
    { test: 'Fungsi Ginjal (Ureum, Kreatinin, eGFR)', loinc: '24362-6', results: 'Ureum: 32 mg/dL (N: 15-45), Kreatinin Serum: 0.95 mg/dL (N: 0.7-1.2), eGFR (CKD-EPI): 94 mL/min/1.73m2. Kesan: Fungsi ginjal baik.' },
    { test: 'Fungsi Hati (SGOT/AST, SGPT/ALT, Albumin)', loinc: '24325-3', results: 'SGOT: 24 U/L (N: <35), SGPT: 29 U/L (N: <45), Albumin: 4.3 g/dL (N: 3.5-5.2), Bilirubin Total: 0.7 mg/dL. Kesan: Fungsi hati normal.' },
    { test: 'Elektrolit Serum (Natrium, Kalium, Klorida)', loinc: '24326-1', results: 'Natrium (Na): 139 mEq/L (N: 135-147), Kalium (K): 4.1 mEq/L (N: 3.5-5.1), Klorida (Cl): 102 mEq/L (N: 96-106). Kesan: Normonatremia, Normokalemia.' },
    { test: 'Koagulasi Darah (PT, APTT, INR)', loinc: '34714-6', results: 'PT: 12.1 detik (Kontrol: 12.0), APTT: 31.4 detik (Kontrol: 32.0), INR: 1.02 (N: 0.8-1.2). Kesan: Hemostasis normal pra-operasi.' },
    { test: 'Troponin I Kuantitatif & CK-MB Cito', loinc: '42757-5', results: 'Troponin I: < 0.01 ng/mL (N: <0.04 ng/mL, Negatif Infark), CK-MB: 15 U/L (N: <24 U/L). Kesan: Non-Cardiac Necrosis.' },
    { test: 'Serologi Dengue (Dengue NS1 Antigen & IgM/IgG)', loinc: '51590-8', results: 'Dengue NS1 Ag: POSITIF (+), Dengue IgM: Positif, Dengue IgG: Negatif. Kesan: Infeksi Dengue Primer Fase Akut Hari ke-3.' },
    { test: 'Urinalisis Lengkap Otomatis', loinc: '24356-8', results: 'Warna: Kuning Jernih, pH: 6.0, BJ: 1.015, Protein: Negatif, Glukosa: Negatif, Leukosit esterase: Negatif, Eritrosit sedimen: 0-1 /LPB, Bakteri: Negatif.' }
  ];

  const RAD_TESTS = [
    { test: 'Foto Thorax PA (Rontgen Dada Dewasa)', results: 'Cor: CTR < 50%, bentuk dan ukuran normal. Pulmo: Corakan bronkovaskular dalam batas normal, tidak tampak infiltrat/kavitas maupun efusi pleura. Sinus kostofrenikus lancip, diafragma licin. Kesan: Cor dan Pulmo dalam batas normal.' },
    { test: 'USG Abdomen Whole (Hepatobilier, Pankreas, Ginjal)', results: 'Hepar: Bentuk dan ukuran normal, parenkim homogen, tepi tajam. Vena porta dan duktus biliaris tidak melebar. Vesika Felea: Dinding tidak menebal, tidak tampak batu. Lien & Pankreas: Normal. Ren Dextra & Sinistra: Ukuran normal, diferensiasi korteks medula tegas, tidak tampak batu/hidronefrosis. Buli-buli terisi baik. Kesan: Abdomen normal sonografi.' },
    { test: 'CT-Scan Kepala Non-Kontras 128 Slices', results: 'Tidak tampak lesi hipodens maupun hiperdens fokal pada parenkim serebri, serebelum, maupun batang otak. Sistem ventrikel dan sisterna dalam batas normal. Sulki dan girus normal. Tidak tampak midline shift. Tulang kranium intak. Kesan: Tidak tampak perdarahan intrakranial maupun infark akut serebri.' },
    { test: 'MRI Lumbosakral T1/T2 & STIR', results: 'Tampak degenerasi diskus L4-L5 dan L5-S1 dengan penyempitan celah intervertebralis. Pada level L4-L5 tampak protrusio diskus posterolateral sinistra yang menekan thecal sac dan radiks saraf L5 sinistra. Kesan: HNP L4-L5 posterolateral sinistra grade 2.' },
    { test: 'Foto Genu Bilateral Weight-Bearing AP/Lat', results: 'Tampak penyempitan celah sendi kompartemen medial genu bilateral, disertai osteofit pada kondilus femoralis medialis dan eminesia interkondiloidea. Kesan: Osteoarthritis Genu Bilateral Grade II-III Kellgren-Lawrence.' }
  ];

  const combined: any[] = [];

  // Generate 30 Lab records
  for (let i = 1; i <= 30; i++) {
    const isFemale = i % 2 === 0;
    const fName = isFemale ? FEMALE_FIRST_NAMES[(i * 3) % FEMALE_FIRST_NAMES.length] : MALE_FIRST_NAMES[(i * 3) % MALE_FIRST_NAMES.length];
    const lName = NAMA_BELAKANG[(i * 5) % NAMA_BELAKANG.length];
    const pName = `${fName} ${lName}`;
    const t = LAB_TESTS[(i - 1) % LAB_TESTS.length];
    const statuses = ['Tervalidasi', 'Selesai', 'Menunggu Validasi'];
    const st = statuses[i % statuses.length];

    combined.push({
      id: `LAB-2608-${String(i).padStart(3, '0')}`,
      no_permintaan: `LAB-2608-${String(i).padStart(3, '0')}`,
      patient: pName,
      nama_pasien: pName,
      no_rm: `RM-${String(i).padStart(4, '0')}`,
      doctor: ['dr. Hendra Pratama, Sp.PD', 'dr. Budi Santoso, Sp.EM', 'dr. Citra Lestari, Sp.OG', 'dr. Eka Putri, Sp.A'][i % 4],
      dokter: ['dr. Hendra Pratama, Sp.PD', 'dr. Budi Santoso, Sp.EM', 'dr. Citra Lestari, Sp.OG', 'dr. Eka Putri, Sp.A'][i % 4],
      test: t.test,
      pemeriksaan: t.test,
      loinc: t.loinc,
      jenis: 'Lab',
      type: 'Lab',
      date: '2026-08-24',
      tanggal: '2026-08-24',
      status: st,
      results: t.results,
      hasil: t.results,
      analis: 'Analis Kesehatan Lab Terpadu'
    });
  }

  // Generate 25 Radiology records
  for (let i = 1; i <= 25; i++) {
    const isFemale = i % 2 !== 0;
    const fName = isFemale ? FEMALE_FIRST_NAMES[((i + 15) * 3) % FEMALE_FIRST_NAMES.length] : MALE_FIRST_NAMES[((i + 15) * 3) % MALE_FIRST_NAMES.length];
    const lName = NAMA_BELAKANG[((i + 15) * 5) % NAMA_BELAKANG.length];
    const pName = `${fName} ${lName}`;
    const t = RAD_TESTS[(i - 1) % RAD_TESTS.length];
    const statuses = ['Tervalidasi', 'Selesai', 'Menunggu Validasi'];
    const st = statuses[i % statuses.length];

    combined.push({
      id: `RAD-2608-${String(i).padStart(3, '0')}`,
      no_permintaan: `RAD-2608-${String(i).padStart(3, '0')}`,
      patient: pName,
      nama_pasien: pName,
      no_rm: `RM-${String(i + 30).padStart(4, '0')}`,
      doctor: ['dr. Lukman Hakim, Sp.P', 'dr. Wahyu Nugroho, Sp.OT', 'dr. Fajar Hidayat, Sp.N', 'dr. Bambang Alamsyah, Sp.B'][i % 4],
      dokter: ['dr. Lukman Hakim, Sp.P', 'dr. Wahyu Nugroho, Sp.OT', 'dr. Fajar Hidayat, Sp.N', 'dr. Bambang Alamsyah, Sp.B'][i % 4],
      test: t.test,
      pemeriksaan: t.test,
      jenis: 'Radiologi',
      type: 'Radiologi',
      date: '2026-08-24',
      tanggal: '2026-08-24',
      status: st,
      results: t.results,
      hasil: t.results,
      radiografer: 'Radiografer Senior RIS/PACS'
    });
  }

  return combined;
}
