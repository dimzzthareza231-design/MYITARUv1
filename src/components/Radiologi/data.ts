import { RadiologiItem, TarifRadiologiItem, MesinRadiologiStatus } from './types';

export const MESIN_RADIOLOGI_LIST: MesinRadiologiStatus[] = [
  {
    id: 'M-XR-01',
    nama_alat: 'Digital Radiography (DR) Ceiling System',
    modalitas: 'X-Ray',
    ruangan: 'Ruang Rontgen 1 (Utama)',
    merk_tipe: 'Siemens Ysio Max 80kW High Frequency',
    status: 'Operasional / Siap',
    uji_kesesuaian_bapeten: 'Lolos Uji Kategori Prima (Sertifikat No: BAPETEN-2025-XR882)',
    masa_berlaku_izin: '15 Desember 2027',
    total_pasien_hari_ini: 24
  },
  {
    id: 'M-CT-01',
    nama_alat: 'Multislice CT-Scan 128 Slices Dual Energy',
    modalitas: 'CT-Scan',
    ruangan: 'Ruang CT-Scan Gedung Radiologi Lt. 1',
    merk_tipe: 'GE Healthcare Revolution EVO 128',
    status: 'Sedang Scanning',
    pasien_saat_ini: 'Ny. Siti Rahayu (CT-Scan Kepala Non-Kontras)',
    uji_kesesuaian_bapeten: 'Lolos Uji Kategori Prima (Sertifikat No: BAPETEN-2025-CT109)',
    masa_berlaku_izin: '20 Oktober 2027',
    total_pasien_hari_ini: 14
  },
  {
    id: 'M-MRI-01',
    nama_alat: 'Magnetic Resonance Imaging 1.5 Tesla Superconducting',
    modalitas: 'MRI',
    ruangan: 'Ruang MRI Shielded Room',
    merk_tipe: 'Philips Ingenia 1.5T dStream Digital Broadband',
    status: 'Operasional / Siap',
    uji_kesesuaian_bapeten: 'Sertifikasi Kalibrasi Medan Magnet & SAR Aman (2026)',
    masa_berlaku_izin: '05 Januari 2028',
    total_pasien_hari_ini: 8
  },
  {
    id: 'M-USG-01',
    nama_alat: 'Color Doppler Ultrasound 4D Matrix',
    modalitas: 'USG',
    ruangan: 'Ruang USG Diagnostik 1',
    merk_tipe: 'Mindray Resona I9 High Performance',
    status: 'Operasional / Siap',
    uji_kesesuaian_bapeten: 'Kalibrasi Akustik & Elektrik Terverifikasi BPFK',
    masa_berlaku_izin: '18 Maret 2027',
    total_pasien_hari_ini: 19
  },
  {
    id: 'M-PAN-01',
    nama_alat: 'Digital Panoramic 3D CBCT & Cephalometric',
    modalitas: 'Panoramic',
    ruangan: 'Ruang Radiologi Dental & Maxillofacial',
    merk_tipe: 'Vatech PaX-i3D Green Low Dose',
    status: 'Operasional / Siap',
    uji_kesesuaian_bapeten: 'Lolos Uji Paparan Radiasi Minimal BAPETEN (2025)',
    masa_berlaku_izin: '12 November 2027',
    total_pasien_hari_ini: 9
  },
  {
    id: 'M-XR-02',
    nama_alat: 'Mobile Digital X-Ray Cito / Bedside ICU',
    modalitas: 'X-Ray',
    ruangan: 'Mobile Unit (Standby IGD / ICU / Ranap)',
    merk_tipe: 'Shimadzu MobileDaRt Evolution MX8',
    status: 'Operasional / Siap',
    uji_kesesuaian_bapeten: 'Lolos Uji Kesesuaian BAPETEN (2026)',
    masa_berlaku_izin: '30 Juni 2027',
    total_pasien_hari_ini: 11
  }
];

export const DAFTAR_TARIF_RADIOLOGI: TarifRadiologiItem[] = [
  {
    id: 'TRF-XR-01',
    kode_tarif: 'RAD-XR-001',
    nama_tindakan: 'Foto Thorax PA / AP (Dewasa / Anak)',
    modalitas: 'X-Ray',
    kode_icd9: '87.44',
    kategori: 'Sederhana',
    jasa_radiolog: 65000,
    jasa_radiografer: 35000,
    sewa_alat: 80000,
    bmhp_film_media: 30000,
    kontras_injektor: 0,
    total_tarif: 210000,
    plafon_bpjs_inacbg: 225000,
    estimasi_waktu_menit: 10,
    persiapan_khusus: 'Melepas kalung, kancing logam, dan benda logam di dada.'
  },
  {
    id: 'TRF-XR-02',
    kode_tarif: 'RAD-XR-002',
    nama_tindakan: 'Foto Thorax Lateral / Top Lordotik',
    modalitas: 'X-Ray',
    kode_icd9: '87.44',
    kategori: 'Sederhana',
    jasa_radiolog: 70000,
    jasa_radiografer: 40000,
    sewa_alat: 85000,
    bmhp_film_media: 35000,
    kontras_injektor: 0,
    total_tarif: 230000,
    plafon_bpjs_inacbg: 240000,
    estimasi_waktu_menit: 15,
    persiapan_khusus: 'Melepas pakaian berlogam.'
  },
  {
    id: 'TRF-XR-03',
    kode_tarif: 'RAD-XR-003',
    nama_tindakan: 'Foto Extremitas Bawah (Genu / Femur / Cruris / Pedis)',
    modalitas: 'X-Ray',
    kode_icd9: '88.27',
    kategori: 'Sederhana',
    jasa_radiolog: 75000,
    jasa_radiografer: 45000,
    sewa_alat: 90000,
    bmhp_film_media: 40000,
    kontras_injektor: 0,
    total_tarif: 250000,
    plafon_bpjs_inacbg: 260000,
    estimasi_waktu_menit: 15
  },
  {
    id: 'TRF-XR-04',
    kode_tarif: 'RAD-XR-004',
    nama_tindakan: 'Foto Vertebra Lumbosakral AP / Lateral 2 Posisi',
    modalitas: 'X-Ray',
    kode_icd9: '87.24',
    kategori: 'Sedang',
    jasa_radiolog: 90000,
    jasa_radiografer: 50000,
    sewa_alat: 110000,
    bmhp_film_media: 45000,
    kontras_injektor: 0,
    total_tarif: 295000,
    plafon_bpjs_inacbg: 310000,
    estimasi_waktu_menit: 20
  },
  {
    id: 'TRF-CT-01',
    kode_tarif: 'RAD-CT-001',
    nama_tindakan: 'CT-Scan Kepala / Brain Non-Kontras 128 Slices',
    modalitas: 'CT-Scan',
    kode_icd9: '87.03',
    kategori: 'Canggih',
    jasa_radiolog: 250000,
    jasa_radiografer: 120000,
    sewa_alat: 650000,
    bmhp_film_media: 80000,
    kontras_injektor: 0,
    total_tarif: 1100000,
    plafon_bpjs_inacbg: 1250000,
    estimasi_waktu_menit: 15,
    persiapan_khusus: 'Melepas gigi palsu, anting, jepit rambut logam.'
  },
  {
    id: 'TRF-CT-02',
    kode_tarif: 'RAD-CT-002',
    nama_tindakan: 'CT-Scan Kepala dengan Kontras IV (Angiografi / Tumor)',
    modalitas: 'CT-Scan',
    kode_icd9: '87.03',
    kategori: 'Khusus dengan Kontras',
    jasa_radiolog: 350000,
    jasa_radiografer: 150000,
    sewa_alat: 850000,
    bmhp_film_media: 100000,
    kontras_injektor: 650000,
    total_tarif: 2100000,
    plafon_bpjs_inacbg: 2350000,
    estimasi_waktu_menit: 30,
    persiapan_khusus: 'Puasa 4-6 jam sebelum tindakan, cek Kreatinin & eGFR wajib normal.'
  },
  {
    id: 'TRF-CT-03',
    kode_tarif: 'RAD-CT-003',
    nama_tindakan: 'CT-Scan Abdomen 3 Fase (Triple Phase) dengan Kontras',
    modalitas: 'CT-Scan',
    kode_icd9: '88.01',
    kategori: 'Khusus dengan Kontras',
    jasa_radiolog: 450000,
    jasa_radiografer: 200000,
    sewa_alat: 1100000,
    bmhp_film_media: 120000,
    kontras_injektor: 880000,
    total_tarif: 2750000,
    plafon_bpjs_inacbg: 2900000,
    estimasi_waktu_menit: 45,
    persiapan_khusus: 'Puasa 6 jam, minum kontras oral 2 jam sebelum scan, pasang IV Line 18G/20G.'
  },
  {
    id: 'TRF-CT-04',
    kode_tarif: 'RAD-CT-004',
    nama_tindakan: 'CT-Scan Thorax HRCT (High Resolution CT)',
    modalitas: 'CT-Scan',
    kode_icd9: '87.41',
    kategori: 'Canggih',
    jasa_radiolog: 300000,
    jasa_radiografer: 140000,
    sewa_alat: 750000,
    bmhp_film_media: 90000,
    kontras_injektor: 0,
    total_tarif: 1280000,
    plafon_bpjs_inacbg: 1400000,
    estimasi_waktu_menit: 20
  },
  {
    id: 'TRF-MRI-01',
    kode_tarif: 'RAD-MRI-001',
    nama_tindakan: 'MRI Lumbal / Lumbosakral T1/T2/STIR (HNP Protocol)',
    modalitas: 'MRI',
    kode_icd9: '88.93',
    kategori: 'Canggih',
    jasa_radiolog: 450000,
    jasa_radiografer: 200000,
    sewa_alat: 1400000,
    bmhp_film_media: 150000,
    kontras_injektor: 0,
    total_tarif: 2200000,
    plafon_bpjs_inacbg: 2450000,
    estimasi_waktu_menit: 40,
    persiapan_khusus: 'Screening implan feromagnetik, pacemaker, klip aneurisma otak.'
  },
  {
    id: 'TRF-MRI-02',
    kode_tarif: 'RAD-MRI-002',
    nama_tindakan: 'MRI Brain / Kepala Lengkap + MRA (Tanpa Kontras)',
    modalitas: 'MRI',
    kode_icd9: '88.91',
    kategori: 'Canggih',
    jasa_radiolog: 500000,
    jasa_radiografer: 220000,
    sewa_alat: 1500000,
    bmhp_film_media: 150000,
    kontras_injektor: 0,
    total_tarif: 2370000,
    plafon_bpjs_inacbg: 2600000,
    estimasi_waktu_menit: 45
  },
  {
    id: 'TRF-USG-01',
    kode_tarif: 'RAD-USG-001',
    nama_tindakan: 'USG Abdomen Upper-Lower Whole (Hepatobilier, Ginjal, Buli)',
    modalitas: 'USG',
    kode_icd9: '88.76',
    kategori: 'Sedang',
    jasa_radiolog: 150000,
    jasa_radiografer: 40000,
    sewa_alat: 160000,
    bmhp_film_media: 40000,
    kontras_injektor: 0,
    total_tarif: 390000,
    plafon_bpjs_inacbg: 420000,
    estimasi_waktu_menit: 20,
    persiapan_khusus: 'Puasa 6 jam (untuk evaluasi kandung empedu) & menahan kencing (agar buli terisi penuh).'
  },
  {
    id: 'TRF-USG-02',
    kode_tarif: 'RAD-USG-002',
    nama_tindakan: 'USG Mammae Bilateral (Payudara Kanan & Kiri)',
    modalitas: 'USG',
    kode_icd9: '88.73',
    kategori: 'Sedang',
    jasa_radiolog: 160000,
    jasa_radiografer: 45000,
    sewa_alat: 170000,
    bmhp_film_media: 45000,
    kontras_injektor: 0,
    total_tarif: 420000,
    plafon_bpjs_inacbg: 450000,
    estimasi_waktu_menit: 25
  },
  {
    id: 'TRF-PAN-01',
    kode_tarif: 'RAD-PAN-001',
    nama_tindakan: 'Foto Panoramic Dental Digital (OPG / OPG Cephalo)',
    modalitas: 'Panoramic',
    kode_icd9: '87.12',
    kategori: 'Sederhana',
    jasa_radiolog: 80000,
    jasa_radiografer: 40000,
    sewa_alat: 110000,
    bmhp_film_media: 40000,
    kontras_injektor: 0,
    total_tarif: 270000,
    plafon_bpjs_inacbg: 290000,
    estimasi_waktu_menit: 10
  }
];

export const TEMPLATE_EKSPERTISE_LIST = [
  {
    nama: 'Foto Thorax Normal (Cor & Pulmo DBN)',
    modalitas: 'X-Ray',
    teknik: 'Proyeksi PA (Postero-Anterior), inspirasi cukup, kondisi sinar simetris.',
    temuan: `Cor: CTR < 50%, bentuk dan ukuran dalam batas normal. Aorta tidak elongasi / kalsifikasi.
Pulmo: Corakan bronkovaskular dalam batas normal, tidak tampak infiltrat, konsolidasi, nodul, maupun kavitas.
Sinus kostofrenikus kanan dan kiri lancip.
Diafragma kanan dan kiri licin dan simetris.
Sistem tulang dinding toraks dan jaringan lunak intak.`,
    kesimpulan: 'Cor dan Pulmo dalam batas normal (Normal Chest Radiograph).',
    saran: 'Pemeriksaan radiologi ulangan sesuai indikasi klinis.'
  },
  {
    nama: 'Foto Thorax Pneumonia / Infiltrat Paru',
    modalitas: 'X-Ray',
    teknik: 'Proyeksi PA (Postero-Anterior) erect.',
    temuan: `Cor: CTR < 50%, ukuran dan konfigurasi normal.
Pulmo: Tampak infiltrat alveolar kasar dan patchy opacity berawan pada lapangan bawah paru dextra (lobus inferior kanan), disertai air bronchogram positif. Tidak tampak efusi pleura nyata.
Sinus kostofrenikus kanan dan kiri lancip.
Diafragma licin. Tulang-tulang dinding dada intak.`,
    kesimpulan: 'Gambaran Pneumonia Lobus Inferior Paru Dextra (Right Lower Lobe Pneumonia).',
    saran: 'Korelasikan klinis tanda infeksi dan evaluasi foto toraks kontrol setelah terapi adekuat.'
  },
  {
    nama: 'Foto Thorax Tuberkulosis Paru Aktif',
    modalitas: 'X-Ray',
    teknik: 'Proyeksi PA erect dengan proyeksi tambahan top lordotik bila diperlukan.',
    temuan: `Cor: CTR < 50%, konfigurasi normal.
Pulmo: Tampak infiltrat retikulonodular dan bercak fibroinfiltrat heterogen pada apeks dan zona atas paru bilateral (dominan dextra), disertai gambaran kavitas berdinding tipis pada zona atas dextra. Tidak tampak kalsifikasi nyata.
Sinus kostofrenikus lancip. Tulang dinding dada intak.`,
    kesimpulan: 'Gambaran TB Paru Aktif Lesi Luas (Active Pulmonary Tuberculosis bilateral dengan Kavitas Apeks Dextra).',
    saran: 'Pemeriksaan bakteriologis sputum BTA / Tes Cepat Molekuler (TCM GeneXpert).'
  },
  {
    nama: 'CT-Scan Kepala Normal (Non-Kontras)',
    modalitas: 'CT-Scan',
    teknik: 'CT Scan Kepala potongan aksial tanpa kontras IV, slice thickness 2.5 mm pada basis dan 5 mm pada konveksitas.',
    temuan: `Tidak tampak lesi hipodens (iskemik) maupun hiperdens (perdarahan) fokal pada parenkim serebri, serebelum, maupun batang otak.
Sistem ventrikel lateralis, III, dan IV dalam batas normal, bentuk simetris, tidak melebar.
Sisterna basalis dan sisterna sylvii terbuka normal.
Sulki dan girus kortikalis dalam batas normal sesuai usia.
Tidak tampak tanda herniasi intrakranial maupun midline shift.
Tulang kranium intak, tidak tampak diskontinuitas fraktur.`,
    kesimpulan: 'CT-Scan Kepala Non-Kontras dalam batas normal. Tidak tampak perdarahan intrakranial maupun tanda stroke infark akut.',
    saran: 'Evaluasi klinis neurologis serial.'
  },
  {
    nama: 'CT-Scan Kepala Stroke Perdarahan Intraserebral (ICH)',
    modalitas: 'CT-Scan',
    teknik: 'CT Scan Kepala Polos Aksial, rekonstruksi bone window & brain window.',
    temuan: `Tampak lesi hiperdens fokal (densitas 60-75 HU) berbatas tegas pada region ganglia basalis dextra dengan estimasi volume perdarahan ± 18 cc.
Tampak perifocal edema hipodens di sekitar lesi perdarahan.
Menyebabkan penekanan pada ventrikel lateral dextra dan pergeseran garis tengah (midline shift) ke arah sinistra sejauh 4.2 mm.
Tulang calvaria intak.`,
    kesimpulan: 'Perdarahan Intraserebral Akut (Acute Intracerebral Hemorrhage / ICH) pada Ganglia Basalis Dextra dengan perifocal edema dan midline shift 4.2 mm.',
    saran: 'Konsultasi cito Spesialis Bedah Saraf / Spesialis Neurologi dan rawat intensif (ICU/Stroke Unit).'
  },
  {
    nama: 'USG Abdomen Normal',
    modalitas: 'USG',
    teknik: 'Eksplorasi ultrasonografi abdomen menyeluruh dengan transduser kurvilinier 3.5 MHz.',
    temuan: `Hepar: Ukuran dan bentuk normal, ekogenisitas parenkim homogen, tepi tajam, tidak tampak nodul/massa padat maupun kistik. Vena porta dan vena hepatika tidak melebar.
Kandung Empedu (Gallbladder): Dinding tidak menebal (<3 mm), lumen anekoik bersih, tidak tampak bayangan akustik batu (calculi) maupun sludge. Duktus biliaris intra/ekstrahepatal tidak melebar.
Pankreas & Lien: Ukuran normal, parenkim homogen.
Ginjal Kanan & Kiri: Ukuran normal (Panjang RK: 10.4 cm, LK: 10.7 cm), batas korteks-medula tegas, sinus ginjal normal, tidak tampak batu maupun hidronefrosis (pelviokalises tidak melebar).
Buli-buli: Dinding reguler, lumen anekoik bebas echointensitas.`,
    kesimpulan: 'Pemeriksaan USG Abdomen atas dan bawah dalam batas normal (Normal Abdominal Sonography).',
    saran: 'Korelasikan dengan parameter biokimiawi klinis.'
  },
  {
    nama: 'MRI Lumbosakral HNP L4-L5',
    modalitas: 'MRI',
    teknik: 'MRI Columna Vertebra Lumbosakral potongan sagital dan aksial T1WI, T2WI, dan T2 STIR.',
    temuan: `Lordosis lumbalis melurus (spasme paravertebral).
Korpus vertebra: Alignment baik, tidak tampak fraktur kompresi maupun lesi osteodestruktif.
Diskus Intervertebralis: Tampak desikasi dan penurunan sinyal T2 pada diskus L4-L5 dan L5-S1.
Pada level L4-L5: Tampak herniasi diskus tipe protrusio posterolateral sinistra yang menekan thecal sac dan mempersempit resesus lateralis serta foramen neural sinistra, menyentuh radiks saraf L5 sinistra.
Conus medullaris berakhir normal pada level L1-L2.`,
    kesimpulan: 'Hernia Nukleus Pulposus (HNP) Protrusio Diskus L4-L5 Posterolateral Sinistra yang menyebabkan radikulopati lumbal sinistra.',
    saran: 'Konsultasi Spesialis Bedah Saraf / Orthopedi Spine untuk manajemen dekompresi / konservatif.'
  }
];

export function generateRadiologyRecords(): RadiologiItem[] {
  const RECORDS: RadiologiItem[] = [
    {
      id: 'RAD-2026-08-001',
      no_order: 'ORD-RAD-2608-001',
      no_rm: 'RM-2608-0012',
      nama_pasien: 'Tn. Hendra Setiawan',
      nik: '3273011208850001',
      umur: 41,
      jenis_kelamin: 'L',
      penjamin: 'BPJS Kesehatan',
      unit_asal: 'IGD (Emergency Room)',
      dokter_pengirim: 'dr. Budi Santoso, Sp.EM',
      indikasi_klinis: 'Batuk berdahak 3 minggu, sesak napas akut, febris 38.8°C, ronki basah kasar basal paru kanan.',
      diagnosa_kerja: 'Community Acquired Pneumonia (CAP) Berat Cito',
      prioritas: 'Cito / Emergency',
      modalitas: 'X-Ray',
      nama_pemeriksaan: 'Foto Thorax AP/PA Cito Dewasa',
      posisi_proyeksi: 'AP Erect Bedside',
      kode_icd9: '87.44',
      ruang_pemeriksaan: 'Ruang Rontgen 1 (Utama)',
      tanggal_order: '2026-08-26',
      waktu_order: '08:15 WIB',
      tanggal_pemeriksaan: '2026-08-26',
      waktu_mulai_scan: '08:25 WIB',
      waktu_selesai_scan: '08:35 WIB',
      status: 'Selesai & Tervalidasi',
      screening: {
        alergi_kontras: false,
        penggunaan_kontras: false,
        status_hamil: false,
        puasa_persiapan: false,
        catatan_screening: 'Pasien posisi duduk di kursi roda dibantu perawat IGD.'
      },
      radiografer: 'Supriyanto, S.Tr.Rad',
      dokter_radiolog: 'dr. Raditya Perkasa, Sp.Rad (K) TR',
      study_instance_uid: '1.2.840.113619.2.55.3.604688.20260826.1001',
      series_count: 1,
      image_count: 1,
      study_type_key: 'thorax',
      laporan_ekspertise: {
        teknik_pemeriksaan: 'Foto Thorax proyeksi AP posisi duduk tegak (erect).',
        deskripsi_temuan: 'Cor: CTR 48%, bentuk dan ukuran normal. Pulmo: Tampak infiltrat berawan dan konsolidasi inhomogen pada lobus media dan inferior paru dextra disertai air bronchogram. Sinus kostofrenikus kiri lancip, kanan tertutup densitas minimal. Tulang iga utuh.',
        kesimpulan_kesan: 'Pneumonia Lobus Medius & Inferior Dextra disertai reaksi efusi pleura minimal dextra.',
        saran_tindakan: 'Kultur sputum mikrobiologi dan evaluasi foto toraks setelah pemberian antibiotik 5 hari.',
        critical_finding: true,
        tanggal_ekspertise: '2026-08-26',
        waktu_ekspertise: '08:50 WIB',
        status_validasi: 'Final / Tervalidasi',
        qr_verifikasi_code: 'MYITARU-RAD-VERIFIED-20260826-001',
        ai_suggestion: {
          summary: 'Infiltrat paru lobus bawah kanan terdeteksi (Confidence: 94.2%), CTR normal (48%).',
          confidence: 94.2,
          findings_detected: ['Right Lower Lobe Consolidation', 'Air Bronchogram', 'Mild Right Pleural Reaction']
        }
      },
      dosis_radiasi: {
        kvp: 110,
        ma: 250,
        mas: 5.0,
        dap_cgy_cm2: 12.4
      }
    },
    {
      id: 'RAD-2026-08-002',
      no_order: 'ORD-RAD-2608-002',
      no_rm: 'RM-2608-0045',
      nama_pasien: 'Ny. Siti Rahayu',
      nik: '3273015509780003',
      umur: 58,
      jenis_kelamin: 'P',
      penjamin: 'BPJS Kesehatan',
      unit_asal: 'IGD (Emergency Room)',
      dokter_pengirim: 'dr. Fajar Hidayat, Sp.N',
      indikasi_klinis: 'Kelemahan anggota gerak kiri mendadak 2 jam SMRS, bicara pelo, tensi 190/110 mmHg. Onset < 3 jam.',
      diagnosa_kerja: 'Suspect Stroke Iskemik Hiperakut vs ICH Cito Onset 2 Jam',
      prioritas: 'Cito / Emergency',
      modalitas: 'CT-Scan',
      nama_pemeriksaan: 'CT-Scan Kepala / Brain Non-Kontras 128 Slices',
      posisi_proyeksi: 'Axial Brain Reconstructed 2.5mm',
      kode_icd9: '87.03',
      ruang_pemeriksaan: 'Ruang CT-Scan Gedung Radiologi Lt. 1',
      tanggal_order: '2026-08-26',
      waktu_order: '09:00 WIB',
      tanggal_pemeriksaan: '2026-08-26',
      waktu_mulai_scan: '09:12 WIB',
      waktu_selesai_scan: '09:22 WIB',
      status: 'Sedang Pemeriksaan',
      screening: {
        alergi_kontras: false,
        penggunaan_kontras: false,
        kreatinin_serum: 1.05,
        egfr: 82,
        implan_logam_pacemaker: false,
        status_hamil: false,
        catatan_screening: 'Pasien kooperatif, sudah dilepas anting dan gigi tiruan.'
      },
      radiografer: 'Nurhadi, S.Tr.Rad',
      dokter_radiolog: 'dr. Raditya Perkasa, Sp.Rad (K) TR',
      study_instance_uid: '1.2.840.113619.2.55.3.604688.20260826.1002',
      series_count: 3,
      image_count: 24,
      study_type_key: 'brain_ct',
      dosis_radiasi: {
        kvp: 120,
        ma: 320,
        ctdivol_mgy: 45.2,
        dlp_mgy_cm: 680.5
      }
    },
    {
      id: 'RAD-2026-08-003',
      no_order: 'ORD-RAD-2608-003',
      no_rm: 'RM-2608-0089',
      nama_pasien: 'Tn. Ahmad Fauzi',
      nik: '3273010405820002',
      umur: 44,
      jenis_kelamin: 'L',
      penjamin: 'Asuransi Mandiri Inhealth',
      unit_asal: 'Poli Bedah Saraf',
      dokter_pengirim: 'dr. Lukman Hakim, Sp.BS',
      indikasi_klinis: 'Low Back Pain menjalar ke tungkai kiri lateral, parestesia dermatomal L5, reflek patella normal.',
      diagnosa_kerja: 'Ischialgia Sinistra e.c Suspect HNP L4-L5 / L5-S1',
      prioritas: 'Rutin / Elektif',
      modalitas: 'MRI',
      nama_pemeriksaan: 'MRI Lumbosakral T1/T2/STIR (HNP Protocol)',
      posisi_proyeksi: 'Sagittal & Axial L1-S1 T1, T2, STIR',
      kode_icd9: '88.93',
      ruang_pemeriksaan: 'Ruang MRI Shielded Room',
      tanggal_order: '2026-08-26',
      waktu_order: '09:30 WIB',
      tanggal_pemeriksaan: '2026-08-26',
      waktu_mulai_scan: '10:00 WIB',
      waktu_selesai_scan: '10:42 WIB',
      status: 'Menunggu Ekspertise',
      screening: {
        alergi_kontras: false,
        penggunaan_kontras: false,
        implan_logam_pacemaker: false,
        status_hamil: false,
        catatan_screening: 'Screening MRI Checklist lengkap: Bebas feromagnetik, tidak memakai pacemaker/ring jantung.'
      },
      radiografer: 'Deni Kurniawan, S.Tr.Rad',
      dokter_radiolog: 'dr. Maya Anggraini, Sp.Rad',
      study_instance_uid: '1.2.840.113619.2.55.3.604688.20260826.1003',
      series_count: 5,
      image_count: 32,
      study_type_key: 'lumbar_mri'
    },
    {
      id: 'RAD-2026-08-004',
      no_order: 'ORD-RAD-2608-004',
      no_rm: 'RM-2608-0114',
      nama_pasien: 'Ny. Dewi Lestari',
      nik: '3273014101900004',
      umur: 36,
      jenis_kelamin: 'P',
      penjamin: 'Umum / Mandiri',
      unit_asal: 'Poli Penyakit Dalam',
      dokter_pengirim: 'dr. Hendra Pratama, Sp.PD',
      indikasi_klinis: 'Nyeri perut kuadran kanan atas hilang timbul setelah makan berlemak (biliary colic), sklera ikterik minimal.',
      diagnosa_kerja: 'Suspect Cholelithiasis / Kolelitiasis Simptomatik',
      prioritas: 'Rutin / Elektif',
      modalitas: 'USG',
      nama_pemeriksaan: 'USG Abdomen Whole (Hepatobilier & Ginjal)',
      posisi_proyeksi: 'Supine & Left Lateral Decubitus',
      kode_icd9: '88.76',
      ruang_pemeriksaan: 'Ruang USG Diagnostik 1',
      tanggal_order: '2026-08-26',
      waktu_order: '08:45 WIB',
      tanggal_pemeriksaan: '2026-08-26',
      waktu_mulai_scan: '09:05 WIB',
      waktu_selesai_scan: '09:25 WIB',
      status: 'Selesai & Tervalidasi',
      screening: {
        alergi_kontras: false,
        penggunaan_kontras: false,
        puasa_persiapan: true,
        catatan_screening: 'Pasien sudah puasa 6 jam dan menahan urine.'
      },
      radiografer: 'Rina Marlina, Amd.Rad',
      dokter_radiolog: 'dr. Raditya Perkasa, Sp.Rad (K) TR',
      study_instance_uid: '1.2.840.113619.2.55.3.604688.20260826.1004',
      series_count: 2,
      image_count: 8,
      study_type_key: 'usg_abdomen',
      laporan_ekspertise: {
        teknik_pemeriksaan: 'USG Abdomen resolusi tinggi dengan prob kurvilinier 3.5MHz dan linier 7.5MHz.',
        deskripsi_temuan: 'Hepar: Ukuran normal, parenkim homogen, tepi tajam. Kandung Empedu: Dinding sedikit menebal (3.4 mm), tampak multiple acoustic shadow calculi ukuran terbesar 1.2 cm pada lumen vesika fellea. Duktus biliaris intra dan ekstrahepatal tidak melebar. Pankreas, Lien, dan Ginjal bilateral dalam batas normal.',
        kesimpulan_kesan: 'Cholelithiasis Multiple disertai tanda Kolsistitis Kronis Ringan.',
        saran_tindakan: 'Konsultasi Spesialis Bedah Digestif untuk rencana Laparoscopic Cholecystectomy.',
        critical_finding: false,
        tanggal_ekspertise: '2026-08-26',
        waktu_ekspertise: '09:40 WIB',
        status_validasi: 'Final / Tervalidasi',
        qr_verifikasi_code: 'MYITARU-RAD-VERIFIED-20260826-004',
        ai_suggestion: {
          summary: 'Multiple gallbladder stones with acoustic shadowing detected (Confidence: 96.5%).',
          confidence: 96.5,
          findings_detected: ['Gallstones Present (Calculi > 1cm)', 'Mild GB Wall Thickening']
        }
      }
    },
    {
      id: 'RAD-2026-08-005',
      no_order: 'ORD-RAD-2608-005',
      no_rm: 'RM-2608-0177',
      nama_pasien: 'Tn. Joko Widodo',
      nik: '3273011506610001',
      umur: 65,
      jenis_kelamin: 'L',
      penjamin: 'BPJS Kesehatan',
      unit_asal: 'Poli Orthopedi',
      dokter_pengirim: 'dr. Wahyu Nugroho, Sp.OT',
      indikasi_klinis: 'Nyeri lutut kanan dan kiri saat berjalan, krepitasi (+), kaku pagi hari < 30 menit.',
      diagnosa_kerja: 'Osteoarthritis (OA) Genu Bilateral Grade II-III',
      prioritas: 'Rutin / Elektif',
      modalitas: 'X-Ray',
      nama_pemeriksaan: 'Foto Genu Bilateral Weight-Bearing AP/Lateral',
      posisi_proyeksi: 'AP Weight-Bearing (Berdiri) & Lateral Flexi 30°',
      kode_icd9: '88.27',
      ruang_pemeriksaan: 'Ruang Rontgen 1 (Utama)',
      tanggal_order: '2026-08-26',
      waktu_order: '09:15 WIB',
      tanggal_pemeriksaan: '2026-08-26',
      waktu_mulai_scan: '09:35 WIB',
      waktu_selesai_scan: '09:48 WIB',
      status: 'Selesai & Tervalidasi',
      screening: {
        alergi_kontras: false,
        penggunaan_kontras: false,
        status_hamil: false,
        catatan_screening: 'Pasien mampu berdiri tegak dengan bantuan walker pegangan.'
      },
      radiografer: 'Supriyanto, S.Tr.Rad',
      dokter_radiolog: 'dr. Maya Anggraini, Sp.Rad',
      study_instance_uid: '1.2.840.113619.2.55.3.604688.20260826.1005',
      series_count: 2,
      image_count: 4,
      study_type_key: 'genu_xray',
      laporan_ekspertise: {
        teknik_pemeriksaan: 'Foto Genu Bilateral proyeksi AP Weight-Bearing dan Lateral dextra/sinistra.',
        deskripsi_temuan: 'Tampak penyempitan celah sendi kompartemen medial genu bilateral yang asimetris (lebih nyata pada dextra). Tampak pembentukan osteofit marginal pada kondilus femoralis medialis dextra/sinistra dan eminensia interkondiloidea. Tidak tampak fraktur maupun dislokasi patella.',
        kesimpulan_kesan: 'Osteoarthritis Genu Dextra Grade III dan Genu Sinistra Grade II (Kellgren-Lawrence Classification).',
        saran_tindakan: 'Injeksi viskosuplementasi intraartikular / konsultasi rehabilitasi medik.',
        critical_finding: false,
        tanggal_ekspertise: '2026-08-26',
        waktu_ekspertise: '10:05 WIB',
        status_validasi: 'Final / Tervalidasi',
        qr_verifikasi_code: 'MYITARU-RAD-VERIFIED-20260826-005'
      },
      dosis_radiasi: {
        kvp: 65,
        ma: 160,
        mas: 3.2,
        dap_cgy_cm2: 6.8
      }
    },
    {
      id: 'RAD-2026-08-006',
      no_order: 'ORD-RAD-2608-006',
      no_rm: 'RM-2608-0205',
      nama_pasien: 'Nn. Putri Anggraeni',
      nik: '3273016604020005',
      umur: 24,
      jenis_kelamin: 'P',
      penjamin: 'Umum / Mandiri',
      unit_asal: 'Poli Gigi & Mulut (Bedah Mulut)',
      dokter_pengirim: 'drg. Triastuti, Sp.BM',
      indikasi_klinis: 'Nyeri geraham belakang bawah kanan, gusi bengkak dan tertutup operkulum (perikoronitis).',
      diagnosa_kerja: 'Impaksi Molar 3 Bawah Kanan (Mesioangular Impacted M3 48)',
      prioritas: 'Rutin / Elektif',
      modalitas: 'Panoramic',
      nama_pemeriksaan: 'Foto Panoramic Dental Digital (OPG)',
      posisi_proyeksi: 'Rotational Panoramic Jaw Arc',
      kode_icd9: '87.12',
      ruang_pemeriksaan: 'Ruang Radiologi Dental & Maxillofacial',
      tanggal_order: '2026-08-26',
      waktu_order: '10:00 WIB',
      tanggal_pemeriksaan: '2026-08-26',
      waktu_mulai_scan: '10:15 WIB',
      waktu_selesai_scan: '10:25 WIB',
      status: 'Selesai & Tervalidasi',
      screening: {
        alergi_kontras: false,
        penggunaan_kontras: false,
        status_hamil: false,
        catatan_screening: 'Melepas anting, kalung, dan kawat gigi lepasan.'
      },
      radiografer: 'Haryanto, Amd.Rad',
      dokter_radiolog: 'dr. Raditya Perkasa, Sp.Rad (K) TR',
      study_instance_uid: '1.2.840.113619.2.55.3.604688.20260826.1006',
      series_count: 1,
      image_count: 1,
      study_type_key: 'dental_pano',
      laporan_ekspertise: {
        teknik_pemeriksaan: 'Panoramic Radiograph digital resolusi tinggi.',
        deskripsi_temuan: 'Tampak gigi 48 (molar 3 mandibula dextra) impaksi mesioangular kelas II posisi B (Pell & Gregory). Apeks akar gigi 48 mendekati kanalis mandibula. Tidak tampak kista folikular besar.',
        kesimpulan_kesan: 'Impaksi Gigi 48 Mesioangular Kelas II Posisi B.',
        saran_tindakan: 'Odontektomi / ekstraksi bedah gigi 48.',
        critical_finding: false,
        tanggal_ekspertise: '2026-08-26',
        waktu_ekspertise: '10:35 WIB',
        status_validasi: 'Final / Tervalidasi',
        qr_verifikasi_code: 'MYITARU-RAD-VERIFIED-20260826-006'
      },
      dosis_radiasi: {
        kvp: 68,
        ma: 10,
        mas: 12.0,
        dap_cgy_cm2: 4.2
      }
    },
    {
      id: 'RAD-2026-08-007',
      no_order: 'ORD-RAD-2608-007',
      no_rm: 'RM-2608-0240',
      nama_pasien: 'Tn. Bambang Wijaya',
      nik: '3273011112700002',
      umur: 56,
      jenis_kelamin: 'L',
      penjamin: 'BPJS Kesehatan',
      unit_asal: 'Bangsal Rawat Inap Dahlia',
      dokter_pengirim: 'dr. Citra Lestari, Sp.P',
      indikasi_klinis: 'Batuk darah berulang (hemoptisis), riwayat merokok 30 tahun, penurunan berat badan 8 kg.',
      diagnosa_kerja: 'Suspect Massa Paru Maligna Dextra vs TB Paru Lesi Luas',
      prioritas: 'Rutin / Elektif',
      modalitas: 'CT-Scan',
      nama_pemeriksaan: 'CT-Scan Thorax HRCT dengan Kontras IV',
      posisi_proyeksi: 'Axial, Coronal, Sagittal Recon 1.25mm',
      kode_icd9: '87.41',
      ruang_pemeriksaan: 'Ruang CT-Scan Gedung Radiologi Lt. 1',
      tanggal_order: '2026-08-26',
      waktu_order: '10:15 WIB',
      status: 'Persiapan & Screening',
      screening: {
        alergi_kontras: false,
        penggunaan_kontras: true,
        jenis_kontras: 'Iohexol (Omnipaque 350 mgI/ml)',
        dosis_kontras_ml: 65,
        kreatinin_serum: 0.92,
        egfr: 94,
        status_hamil: false,
        puasa_persiapan: true,
        catatan_screening: 'IV Line 18G terpasang di fossa cubiti dextra, flushes lancar. Puasa 4 jam.'
      },
      radiografer: 'Nurhadi, S.Tr.Rad',
      dokter_radiolog: 'dr. Raditya Perkasa, Sp.Rad (K) TR',
      study_instance_uid: '1.2.840.113619.2.55.3.604688.20260826.1007'
    },
    {
      id: 'RAD-2026-08-008',
      no_order: 'ORD-RAD-2608-008',
      no_rm: 'RM-2608-0288',
      nama_pasien: 'An. Farhan Maulana',
      nik: '3273012204180006',
      umur: 8,
      jenis_kelamin: 'L',
      penjamin: 'BPJS Kesehatan',
      unit_asal: 'IGD (Emergency Room)',
      dokter_pengirim: 'dr. Eka Putri, Sp.A',
      indikasi_klinis: 'Jatuh dari sepeda 1 jam lalu, tangan kiri tertumpu (FOOSH), deformitas pergelangan tangan kiri (dinner fork deformity).',
      diagnosa_kerja: 'Fraktur Radius Distal Sinistra (Suspect Colles Fracture)',
      prioritas: 'Cito / Emergency',
      modalitas: 'X-Ray',
      nama_pemeriksaan: 'Foto Wrist Joint / Radius Ulna Sinistra AP/Lateral',
      posisi_proyeksi: 'AP & Lateral Sinistra',
      kode_icd9: '88.23',
      ruang_pemeriksaan: 'Ruang Rontgen 1 (Utama)',
      tanggal_order: '2026-08-26',
      waktu_order: '10:30 WIB',
      status: 'Menunggu Antrian',
      screening: {
        alergi_kontras: false,
        penggunaan_kontras: false,
        status_hamil: false,
        catatan_screening: 'Diberikan apron pelindung gonad pediatrik.'
      },
      radiografer: 'Supriyanto, S.Tr.Rad',
      dokter_radiolog: 'dr. Maya Anggraini, Sp.Rad',
      study_instance_uid: '1.2.840.113619.2.55.3.604688.20260826.1008'
    }
  ];

  // Add 16 more realistic simulated records
  const NAMA_SAMPLE = [
    { n: 'Tn. Fajar Pratama', rm: 'RM-2608-0301', u: 47, jk: 'L' as const, m: 'X-Ray' as const, p: 'Foto Thorax PA', d: 'dr. Lukman Hakim, Sp.P', diag: 'Batuk kronis evaluasi TB' },
    { n: 'Ny. Megawati Kusuma', rm: 'RM-2608-0312', u: 52, jk: 'P' as const, m: 'Mammografi' as const, p: 'Mammografi Digital Bilateral (CC & MLO)', d: 'dr. Bambang Alamsyah, Sp.B', diag: 'Screening Ca Mammae Berkala' },
    { n: 'Tn. Rudi Gunawan', rm: 'RM-2608-0325', u: 39, jk: 'L' as const, m: 'CT-Scan' as const, p: 'CT-Scan Abdomen Non-Kontras', d: 'dr. Hendra Pratama, Sp.PD', diag: 'Kolik Renal Dextra e.c Urolitiasis' },
    { n: 'Ny. Ratna Wulandari', rm: 'RM-2608-0338', u: 29, jk: 'P' as const, m: 'USG' as const, p: 'USG Mammae Bilateral', d: 'dr. Citra Lestari, Sp.OG', diag: 'Fibroadenoma Mammae (FAM) Sinistra' },
    { n: 'Tn. Oki Prasetyo', rm: 'RM-2608-0349', u: 33, jk: 'L' as const, m: 'MRI' as const, p: 'MRI Genu Dextra (ACL / Meniscus)', d: 'dr. Wahyu Nugroho, Sp.OT', diag: 'Ruptur ACL & Meniscus Tear Dextra Post-Trauma' },
    { n: 'Tn. Agus Salim', rm: 'RM-2608-0360', u: 61, jk: 'L' as const, m: 'X-Ray' as const, p: 'Foto BNO / Polos Perut 3 Posisi', d: 'dr. Budi Santoso, Sp.EM', diag: 'Suspect Ileus Obstruktif' },
    { n: 'Ny. Hani Permata', rm: 'RM-2608-0371', u: 45, jk: 'P' as const, m: 'USG' as const, p: 'USG Tiroid / Leher Doppler', d: 'dr. Hendra Pratama, Sp.PD', diag: 'Nodul Tiroid Soliter Dextra' },
    { n: 'Tn. Rizky Hidayat', rm: 'RM-2608-0382', u: 22, jk: 'L' as const, m: 'Panoramic' as const, p: 'Foto Panoramic Dental OPG', d: 'drg. Triastuti, Sp.BM', diag: 'Impaksi Molar 3 Bilateral' }
  ];

  NAMA_SAMPLE.forEach((item, idx) => {
    const isEven = idx % 2 === 0;
    RECORDS.push({
      id: `RAD-2026-08-${String(idx + 9).padStart(3, '0')}`,
      no_order: `ORD-RAD-2608-${String(idx + 9).padStart(3, '0')}`,
      no_rm: item.rm,
      nama_pasien: item.n,
      umur: item.u,
      jenis_kelamin: item.jk,
      penjamin: idx % 3 === 0 ? 'Umum / Mandiri' : 'BPJS Kesehatan',
      unit_asal: isEven ? 'Poli Rawat Jalan' : 'Rawat Inap',
      dokter_pengirim: item.d,
      indikasi_klinis: `Pemeriksaan penunjang diagnostik untuk ${item.diag}`,
      diagnosa_kerja: item.diag,
      prioritas: 'Rutin / Elektif',
      modalitas: item.m,
      nama_pemeriksaan: item.p,
      posisi_proyeksi: 'Standar Prosedur Operasional',
      kode_icd9: '87.44',
      ruang_pemeriksaan: item.m === 'CT-Scan' ? 'Ruang CT-Scan Gedung Radiologi Lt. 1' : item.m === 'MRI' ? 'Ruang MRI Shielded Room' : item.m === 'USG' ? 'Ruang USG Diagnostik 1' : 'Ruang Rontgen 1 (Utama)',
      tanggal_order: '2026-08-25',
      waktu_order: `${String(8 + idx).padStart(2, '0')}:20 WIB`,
      tanggal_pemeriksaan: '2026-08-25',
      waktu_mulai_scan: `${String(8 + idx).padStart(2, '0')}:40 WIB`,
      waktu_selesai_scan: `${String(8 + idx).padStart(2, '0')}:55 WIB`,
      status: isEven ? 'Selesai & Tervalidasi' : 'Menunggu Ekspertise',
      screening: {
        alergi_kontras: false,
        penggunaan_kontras: false,
        status_hamil: false
      },
      radiografer: 'Supriyanto, S.Tr.Rad',
      dokter_radiolog: 'dr. Raditya Perkasa, Sp.Rad (K) TR',
      study_instance_uid: `1.2.840.113619.2.55.3.604688.20260825.${1000 + idx}`,
      series_count: 1,
      image_count: 2,
      study_type_key: item.m === 'X-Ray' ? 'thorax' : item.m === 'CT-Scan' ? 'brain_ct' : item.m === 'USG' ? 'usg_abdomen' : 'dental_pano',
      laporan_ekspertise: isEven ? {
        teknik_pemeriksaan: `Pemeriksaan ${item.p} proyeksi standar.`,
        deskripsi_temuan: `Struktur anatomis teridentifikasi baik. Evaluasi klinis relevan dengan ${item.diag}.`,
        kesimpulan_kesan: `Hasil pemeriksaan mendukung diagnosis kerja ${item.diag}.`,
        saran_tindakan: 'Evaluasi respon terapi medikamentosa.',
        critical_finding: false,
        tanggal_ekspertise: '2026-08-25',
        waktu_ekspertise: `${String(9 + idx).padStart(2, '0')}:15 WIB`,
        status_validasi: 'Final / Tervalidasi',
        qr_verifikasi_code: `MYITARU-RAD-VERIFIED-20260825-${100 + idx}`
      } : undefined
    });
  });

  return RECORDS;
}

export const DATA_RADIOLOGI_INITIAL: RadiologiItem[] = generateRadiologyRecords();
export const DAFTAR_MESIN_RADIOLOGI: MesinRadiologiStatus[] = MESIN_RADIOLOGI_LIST;
