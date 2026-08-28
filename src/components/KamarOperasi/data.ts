import { PasienOperasiItem, PaketOperasiItem, ObatBMHPOperasiItem, RuangOKStatus } from './types';

const NAMA_DEPAN = [
  'Ahmad', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fajar', 'Gita', 'Hendra', 'Indah', 'Joko',
  'Kartika', 'Lukman', 'Mega', 'Nugroho', 'Oki', 'Putri', 'Rian', 'Siti', 'Tri', 'Utami',
  'Vina', 'Wahyu', 'Yoga', 'Zulfa', 'Anisa', 'Bayu', 'Cahyono', 'Dian', 'Endang', 'Farhan',
  'Gunawan', 'Hani', 'Irfan', 'Juli', 'Kusuma', 'Lestari', 'Maulana', 'Nurul', 'Prasetyo', 'Ratna'
];

const NAMA_BELAKANG = [
  'Pratama', 'Kusuma', 'Lestari', 'Santoso', 'Wijaya', 'Saputra', 'Hidayat', 'Wulandari',
  'Nugroho', 'Rahayu', 'Setiawan', 'Permata', 'Utami', 'Firmansyah', 'Anggraeni', 'Syahputra',
  'Purnama', 'Handayani', 'Susanto', 'Astuti', 'Gunawan', 'Hartono', 'Puspitasari', 'Mahendra'
];

export const RUANG_OK_LIST: RuangOKStatus[] = [
  {
    id: 'OK-01',
    nama: 'Kamar OK 1 - Mayor Laparoskopi',
    spesialisasi: 'Bedah Digestif & Laparoskopi Lanjutan',
    status: 'Sedang Digunakan',
    pasien_saat_ini: 'Siti Rahayu (RM-0008)',
    tindakan_saat_ini: 'Laparoskopi Kolesistektomi',
    operator_saat_ini: 'dr. Bambang Alamsyah, Sp.B, Subsp.BD(K)',
    estimasi_selesai: '11:45 WIB'
  },
  {
    id: 'OK-02',
    nama: 'Kamar OK 2 - Orthopedi & Trauma',
    spesialisasi: 'Bedah Tulang, Artroskopi & Rekonstruksi',
    status: 'Sedang Digunakan',
    pasien_saat_ini: 'Budi Santoso (RM-0012)',
    tindakan_saat_ini: 'ORIF Fraktur Femur Dextra',
    operator_saat_ini: 'dr. Wahyu Nugroho, Sp.OT(K)',
    estimasi_selesai: '12:30 WIB'
  },
  {
    id: 'OK-03',
    nama: 'Kamar OK 3 - Urologi & Endourologi',
    spesialisasi: 'TURP, URS, PCNL & Bedah Saluran Kemih',
    status: 'Tersedia',
    pasien_saat_ini: '-',
    tindakan_saat_ini: '-',
    operator_saat_ini: '-',
    estimasi_selesai: '-'
  },
  {
    id: 'OK-04',
    nama: 'Kamar OK 4 - Emergency & Obstetri',
    spesialisasi: 'Seksio Sesarea ERACS & Cito Emergency',
    status: 'Sedang Digunakan',
    pasien_saat_ini: 'Dewi Anggraeni (RM-0019)',
    tindakan_saat_ini: 'Seksio Sesarea Cito ERACS',
    operator_saat_ini: 'dr. Citra Lestari, Sp.OG',
    estimasi_selesai: '10:50 WIB'
  },
  {
    id: 'OK-05',
    nama: 'Kamar OK 5 - Bedah Mata Mikro',
    spesialisasi: 'Fakoemulsifikasi Katarak & Vitrektomi',
    status: 'Sedang Sterilisasi',
    pasien_saat_ini: '-',
    tindakan_saat_ini: '-',
    operator_saat_ini: '-',
    estimasi_selesai: '10:30 WIB'
  }
];

export const DAFTAR_PAKET_OPERASI: PaketOperasiItem[] = [
  {
    id: 'PKT-01',
    nama_paket: 'Paket Laparoskopi Kolesistektomi (Minimal Invasif)',
    spesialisasi: 'Bedah Digestif',
    jenis: 'Bedah Mayor Minimal Invasif',
    kelas: 'Kelas 1 / VIP',
    estimasi_durasi: '120 Menit',
    estimasi_biaya: 'Rp 24.500.000',
    biaya_nominal: 24500000,
    jasa_operator: 9500000,
    jasa_anestesi: 3500000,
    sewa_ok: 4500000,
    bmhp_est: 4500000,
    kamar_perawatan: 2500000,
    status: 'Tersedia',
    deskripsi: 'Pengangkatan kantung empedu dengan teknik laparoskopi 4 trokar, masa pemulihan cepat (1-2 hari).',
    komponen: [
      'Jasa Dokter Spesialis Bedah Digestif & Asisten',
      'Jasa Dokter Spesialis Anestesiologi',
      'Sewa Kamar Operasi + Set Laparoskopi HD Stryker',
      'BMHP: Trokar Disposable, Clip Titanium Hem-o-lok, Endobag',
      'Kamar Rawat Inap 2 Hari + Visite DPJP'
    ]
  },
  {
    id: 'PKT-02',
    nama_paket: 'Paket Seksio Sesarea Cito & ERACS Modern',
    spesialisasi: 'Obstetri & Ginekologi',
    jenis: 'Bedah Mayor Obstetri',
    kelas: 'Kelas 1 / VIP',
    estimasi_durasi: '60 Menit',
    estimasi_biaya: 'Rp 19.800.000',
    biaya_nominal: 19800000,
    jasa_operator: 7500000,
    jasa_anestesi: 3000000,
    sewa_ok: 4000000,
    bmhp_est: 3300000,
    kamar_perawatan: 2000000,
    status: 'Tersedia',
    deskripsi: 'Persalinan sesar dengan protokol ERACS (Enhanced Recovery After Surgery) untuk mobilisasi dini 2 jam pasca operasi.',
    komponen: [
      'Jasa Dokter Spesialis Kebidanan & Kandungan',
      'Jasa Dokter Spesialis Anak (Resusitasi Bayi Baru Lahir)',
      'Jasa Dokter Spesialis Anestesiologi (Spinal Anestesi)',
      'BMHP Sesar & Benang Subkutikular Monocryl',
      'Rawat Gabung Ibu & Bayi 2 Hari'
    ]
  },
  {
    id: 'PKT-03',
    nama_paket: 'Paket ORIF Fraktur Tulang Panjang (Locking Plate & Screw)',
    spesialisasi: 'Orthopedi & Traumatologi',
    jenis: 'Bedah Mayor Orthopedi',
    kelas: 'Kelas 1 / Kelas 2',
    estimasi_durasi: '150 Menit',
    estimasi_biaya: 'Rp 27.500.000',
    biaya_nominal: 27500000,
    jasa_operator: 10500000,
    jasa_anestesi: 3500000,
    sewa_ok: 5000000,
    bmhp_est: 6000000,
    kamar_perawatan: 2500000,
    status: 'Tersedia',
    deskripsi: 'Reduksi terbuka dan fiksasi interna pada patah tulang ekstremitas menggunakan plat locking titanium bersertifikasi CE.',
    komponen: [
      'Jasa Dokter Spesialis Orthopedi & Traumatologi',
      'Jasa Dokter Spesialis Anestesiologi',
      'Sewa C-Arm Fluoroskopi Real-Time & Set Bedah Tulang',
      'BMHP: Implan Plat & Baut Titanium, Bone Wax, Drapes',
      'Rawat Inap 3 Hari + Fisioterapi Pasca Bedah'
    ]
  },
  {
    id: 'PKT-04',
    nama_paket: 'Paket Fakoemulsifikasi Katarak + Lensa Foldable IOL',
    spesialisasi: 'Mata (Oftalmologi)',
    jenis: 'Bedah Mikro One-Day Care',
    kelas: 'One Day Care / Poliklinik',
    estimasi_durasi: '30 Menit',
    estimasi_biaya: 'Rp 9.800.000',
    biaya_nominal: 9800000,
    jasa_operator: 4500000,
    jasa_anestesi: 1200000,
    sewa_ok: 2100000,
    bmhp_est: 2000000,
    kamar_perawatan: 0,
    status: 'Tersedia',
    deskripsi: 'Operasi katarak modern tanpa jahitan dengan gelombang ultrasonik fako dan pemasangan lensa tanam lipat intraokular.',
    komponen: [
      'Jasa Dokter Spesialis Mata Konsultan Bedah Katarak',
      'Sewa Mikroskop Bedah Zeiss & Mesin Phaco Alcon Centurion',
      'Implan Lensa Lipat Foldable Hydrophobic IOL UV-Blocking',
      'Viskoelastik Steril & Tip Phaco Disposable',
      'Obat Tetes Mata Antibiotik & Steroid Post-Op'
    ]
  },
  {
    id: 'PKT-05',
    nama_paket: 'Paket TURP (Transurethral Resection of the Prostate)',
    spesialisasi: 'Urologi',
    jenis: 'Bedah Endourologi',
    kelas: 'Kelas 1 / Kelas 2',
    estimasi_durasi: '90 Menit',
    estimasi_biaya: 'Rp 17.500.000',
    biaya_nominal: 17500000,
    jasa_operator: 7000000,
    jasa_anestesi: 2500000,
    sewa_ok: 3500000,
    bmhp_est: 2500000,
    kamar_perawatan: 2000000,
    status: 'Tersedia',
    deskripsi: 'Reseksi jaringan prostat yang membesar melalui saluran kencing tanpa sayatan luar dengan resectoscope bipolar.',
    komponen: [
      'Jasa Dokter Spesialis Urologi',
      'Jasa Dokter Spesialis Anestesiologi (Spinal)',
      'Sewa Set Resectoscope Olympus & Generator Bipolar',
      'BMHP: Bipolar Cutting Loop, Kateter 3-Way Silikon 24Fr, Irigasi NaCl 3000ml',
      'Rawat Inap 2 Hari + Spooling Bladder'
    ]
  },
  {
    id: 'PKT-06',
    nama_paket: 'Paket Apendektomi Laparoskopi Akut',
    spesialisasi: 'Bedah Umum / Digestif',
    jenis: 'Bedah Sedang / Cito',
    kelas: 'Kelas 1 / Kelas 2',
    estimasi_durasi: '75 Menit',
    estimasi_biaya: 'Rp 16.000.000',
    biaya_nominal: 16000000,
    jasa_operator: 6500000,
    jasa_anestesi: 2500000,
    sewa_ok: 3500000,
    bmhp_est: 2000000,
    kamar_perawatan: 1500000,
    status: 'Tersedia',
    deskripsi: 'Pengangkatan usus buntu yang meradang akut dengan teknik laparoskopi 3 sayatan mikro (5-10 mm).',
    komponen: [
      'Jasa Dokter Spesialis Bedah Umum',
      'Jasa Dokter Spesialis Anestesiologi (GA)',
      'Sewa Kamar OK & Set Laparoskopi Kamera',
      'BMHP: Endoloop PDS II, Trokar Laparoskopi, Kantong Spesimen',
      'Rawat Inap 2 Hari'
    ]
  },
  {
    id: 'PKT-07',
    nama_paket: 'Paket Tonsilektomi & Adenoidektomi Bipolar',
    spesialisasi: 'THT-KL',
    jenis: 'Bedah Sedang THT',
    kelas: 'Kelas 1 / Kelas 2',
    estimasi_durasi: '45 Menit',
    estimasi_biaya: 'Rp 11.500.000',
    biaya_nominal: 11500000,
    jasa_operator: 4800000,
    jasa_anestesi: 2200000,
    sewa_ok: 2500000,
    bmhp_est: 1000000,
    kamar_perawatan: 1000000,
    status: 'Tersedia',
    deskripsi: 'Pengangkatan amandel kronis hipertrofi dengan teknik elektrokauter bipolar minimal pendarahan.',
    komponen: [
      'Jasa Dokter Spesialis THT-KL',
      'Jasa Dokter Spesialis Anestesiologi (Intubasi Oral RAE)',
      'Sewa Set Mouth Gag Davis Boyle & Bipolar Forceps',
      'BMHP Kassa Bergaris X-Ray & Adrenalin Tampon',
      'Rawat Inap 1 Hari'
    ]
  },
  {
    id: 'PKT-08',
    nama_paket: 'Paket Hernioraphy Mesh Plug (Hernia Inguinalis)',
    spesialisasi: 'Bedah Umum',
    jenis: 'Bedah Sedang',
    kelas: 'Kelas 1 / Kelas 2',
    estimasi_durasi: '60 Menit',
    estimasi_biaya: 'Rp 13.800.000',
    biaya_nominal: 13800000,
    jasa_operator: 5500000,
    jasa_anestesi: 2300000,
    sewa_ok: 2800000,
    bmhp_est: 2000000,
    kamar_perawatan: 1200000,
    status: 'Tersedia',
    deskripsi: 'Operasi perbaikan dinding perut hernia dengan pemasangan mesh polypropylene prolene bebas tegangan (Lichtenstein technique).',
    komponen: [
      'Jasa Dokter Spesialis Bedah Umum',
      'Jasa Dokter Spesialis Anestesiologi (Spinal/Epidural)',
      'Sewa Ruang Operasi & Instrument Set Hernia',
      'BMHP: Prolene Mesh 7.5 x 15 cm Ethicon, Benang Prolene 2-0',
      'Rawat Inap 1-2 Hari'
    ]
  }
];

export const DAFTAR_OBAT_BMHP_OPERASI: ObatBMHPOperasiItem[] = [
  {
    id: 'OB-01',
    kode: 'ANE-001',
    nama: 'Propofol MCT/LCT 1% Emulsi 20 ml (Fresofol)',
    kategori: 'Obat Anestesi',
    satuan: 'Ampul 20 ml',
    stok: 85,
    minimum_stok: 30,
    harga: 95000,
    no_batch: 'BT-2026-PF09',
    expired_date: '2027-09-15',
    status_steril: 'Siap Pakai',
    lokasi: 'Trolley Anestesi OK 1-5'
  },
  {
    id: 'OB-02',
    kode: 'ANE-002',
    nama: 'Sevoflurane Inhalation Liquid 250 ml (Sevorane)',
    kategori: 'Obat Anestesi',
    satuan: 'Botol 250 ml',
    stok: 14,
    minimum_stok: 5,
    harga: 1650000,
    no_batch: 'BT-2026-SV04',
    expired_date: '2028-02-20',
    status_steril: 'Siap Pakai',
    lokasi: 'Vaporizer Mesin Anestesi'
  },
  {
    id: 'OB-03',
    kode: 'ANE-003',
    nama: 'Bupivacaine HCl Heavy 0.5% + Dekstrosa 8% 4 ml',
    kategori: 'Obat Anestesi',
    satuan: 'Ampul 4 ml',
    stok: 62,
    minimum_stok: 25,
    harga: 85000,
    no_batch: 'BT-2026-BP88',
    expired_date: '2027-11-30',
    status_steril: 'Siap Pakai',
    lokasi: 'Trolley Spinal Anestesi'
  },
  {
    id: 'OB-04',
    kode: 'ANE-004',
    nama: 'Fentanyl Sitrat Injeksi 0.05 mg/ml (2 ml)',
    kategori: 'Obat Anestesi',
    satuan: 'Ampul 2 ml',
    stok: 40,
    minimum_stok: 15,
    harga: 48000,
    no_batch: 'BT-2026-FN21',
    expired_date: '2027-08-10',
    status_steril: 'Siap Pakai',
    lokasi: 'Lemari Narkotika OK (Double Lock)'
  },
  {
    id: 'OB-05',
    kode: 'ANE-005',
    nama: 'Rocuronium Bromide Injeksi 50 mg/5 ml (Esmeron)',
    kategori: 'Obat Anestesi',
    satuan: 'Vial 5 ml',
    stok: 35,
    minimum_stok: 12,
    harga: 145000,
    no_batch: 'BT-2026-RC55',
    expired_date: '2027-06-18',
    status_steril: 'Siap Pakai',
    lokasi: 'Kulkas Obat Anestesi 2-8°C'
  },
  {
    id: 'OB-06',
    kode: 'ANE-006',
    nama: 'Cefazolin Sodium Serbuk Injeksi 1 Gram (Profilaksis)',
    kategori: 'Obat Anestesi',
    satuan: 'Vial 1 g',
    stok: 120,
    minimum_stok: 40,
    harga: 32000,
    no_batch: 'BT-2026-CF12',
    expired_date: '2028-04-15',
    status_steril: 'Siap Pakai',
    lokasi: 'Lemari Antibiotik Profilaksis OK'
  },
  {
    id: 'OB-07',
    kode: 'SUT-001',
    nama: 'Benang Bedah Vicryl 2-0 Taper Point 75 cm (Ethicon)',
    kategori: 'Benang Bedah (Suture)',
    satuan: 'Sachet Steril',
    stok: 145,
    minimum_stok: 50,
    harga: 88000,
    no_batch: 'BT-2026-VC20',
    expired_date: '2029-01-10',
    status_steril: 'Steril Terverifikasi',
    lokasi: 'Rak Benang Bedah Lemari A'
  },
  {
    id: 'OB-08',
    kode: 'SUT-002',
    nama: 'Benang Bedah Monocryl 3-0 Cutting 45 cm (Ethicon)',
    kategori: 'Benang Bedah (Suture)',
    satuan: 'Sachet Steril',
    stok: 110,
    minimum_stok: 40,
    harga: 115000,
    no_batch: 'BT-2026-MC33',
    expired_date: '2029-03-25',
    status_steril: 'Steril Terverifikasi',
    lokasi: 'Rak Benang Bedah Lemari A'
  },
  {
    id: 'OB-09',
    kode: 'SUT-003',
    nama: 'Benang Bedah Prolene 4-0 Precision Cosmetic (Ethicon)',
    kategori: 'Benang Bedah (Suture)',
    satuan: 'Sachet Steril',
    stok: 75,
    minimum_stok: 30,
    harga: 92000,
    no_batch: 'BT-2026-PR40',
    expired_date: '2029-05-14',
    status_steril: 'Steril Terverifikasi',
    lokasi: 'Rak Benang Bedah Lemari A'
  },
  {
    id: 'OB-10',
    kode: 'IMP-001',
    nama: 'Prolene Hernia Mesh 7.5 cm x 15 cm Polypropylene',
    kategori: 'Implan & Mesh',
    satuan: 'Pcs Steril',
    stok: 28,
    minimum_stok: 10,
    harga: 850000,
    no_batch: 'BT-2026-MS75',
    expired_date: '2028-10-20',
    status_steril: 'Steril Terverifikasi',
    lokasi: 'Rak Implan & Mesh Steril'
  },
  {
    id: 'OB-11',
    kode: 'BMP-001',
    nama: 'Kassa Laparatomi Bergaris X-Ray 30 x 30 cm (Isi 5)',
    kategori: 'BMHP Steril',
    satuan: 'Pack (5 Lembar)',
    stok: 220,
    minimum_stok: 80,
    harga: 65000,
    no_batch: 'BT-2026-XR30',
    expired_date: '2028-12-31',
    status_steril: 'Steril Terverifikasi',
    lokasi: 'Gudang Linen & Kassa OK'
  },
  {
    id: 'OB-12',
    kode: 'BMP-002',
    nama: 'Bisturi / Pisau Bedah No. 10, 11, 15 Stainless',
    kategori: 'BMHP Steril',
    satuan: 'Kotak (100 Pcs)',
    stok: 42,
    minimum_stok: 15,
    harga: 120000,
    no_batch: 'BT-2026-SC11',
    expired_date: '2029-07-01',
    status_steril: 'Steril Terverifikasi',
    lokasi: 'Laci Scalpel Blade OK'
  },
  {
    id: 'OB-13',
    kode: 'BMP-003',
    nama: 'Sarung Tangan Bedah Steril Powder-Free (Ukuran 6.5, 7, 7.5, 8)',
    kategori: 'BMHP Steril',
    satuan: 'Pasang Steril',
    stok: 450,
    minimum_stok: 150,
    harga: 18000,
    no_batch: 'BT-2026-GL70',
    expired_date: '2028-08-30',
    status_steril: 'Steril Terverifikasi',
    lokasi: 'Rak Sarung Tangan Steril'
  },
  {
    id: 'OB-14',
    kode: 'ANT-001',
    nama: 'Povidone Iodine 10% Larutan Antiseptik 1000 ml',
    kategori: 'Antiseptik & Cairan',
    satuan: 'Botol 1 Liter',
    stok: 38,
    minimum_stok: 15,
    harga: 75000,
    no_batch: 'BT-2026-PI10',
    expired_date: '2027-12-10',
    status_steril: 'Siap Pakai',
    lokasi: 'Wastafel Scrubbing & Trolley Persiapan'
  },
  {
    id: 'OB-15',
    kode: 'ANT-002',
    nama: 'Chlorhexidine Gluconate 4% Scrub Handwash 500 ml',
    kategori: 'Antiseptik & Cairan',
    satuan: 'Botol Pump 500 ml',
    stok: 45,
    minimum_stok: 20,
    harga: 68000,
    no_batch: 'BT-2026-CH04',
    expired_date: '2028-03-12',
    status_steril: 'Siap Pakai',
    lokasi: 'Wastafel Scrubbing Kamar Bedah'
  }
];

export const SURGICAL_PROCEDURES_MASTER = [
  {
    tindakan: 'Laparoskopi Kolesistektomi (Eksisi Kantung Empedu)',
    icd9: '51.23',
    diagnosa: 'Kolesistitis Kronik dengan Kolelitiasis (K80.20)',
    spesialis: 'Bedah Digestif',
    operator: 'dr. Bambang Alamsyah, Sp.B, Subsp.BD(K)',
    anastesi: 'dr. Indra Gunawan, Sp.An-TI',
    tipe_anastesi: 'General Anesthesia (GA)',
    ok: 'Kamar OK 1 - Mayor Laparoskopi',
    durasi: '120 Menit'
  },
  {
    tindakan: 'Seksio Sesarea Cito ERACS (Persalinan Bedah Sesar)',
    icd9: '74.1',
    diagnosa: 'G2P1A0 Gravida Aterm dengan CPD & Gawat Janin (O33.9)',
    spesialis: 'Obstetri & Ginekologi',
    operator: 'dr. Citra Lestari, Sp.OG',
    anastesi: 'dr. Rahmat Setiawan, Sp.An',
    tipe_anastesi: 'Regional Spinal Anesthesia',
    ok: 'Kamar OK 4 - Emergency & Obstetri',
    durasi: '60 Menit'
  },
  {
    tindakan: 'ORIF Fraktur Femur Dextra dengan Locking Plate',
    icd9: '79.35',
    diagnosa: 'Closed Fracture Diaphysis Femur Dextra (S72.301A)',
    spesialis: 'Orthopedi & Traumatologi',
    operator: 'dr. Wahyu Nugroho, Sp.OT(K)',
    anastesi: 'dr. Indra Gunawan, Sp.An-TI',
    tipe_anastesi: 'Regional Spinal / Epidural',
    ok: 'Kamar OK 2 - Orthopedi & Trauma',
    durasi: '150 Menit'
  },
  {
    tindakan: 'TURP (Transurethral Resection of the Prostate)',
    icd9: '60.29',
    diagnosa: 'Benign Prostatic Hyperplasia (BPH) dengan Retensi Urin (N40.1)',
    spesialis: 'Urologi',
    operator: 'dr. Dimas Kurniawan, Sp.U',
    anastesi: 'dr. Rahmat Setiawan, Sp.An',
    tipe_anastesi: 'Regional Spinal Anesthesia',
    ok: 'Kamar OK 3 - Urologi & Endourologi',
    durasi: '90 Menit'
  },
  {
    tindakan: 'Fakoemulsifikasi + Implan Lensa Lipat OD (Katarak Senilis)',
    icd9: '13.41',
    diagnosa: 'Katarak Senilis Matur Oculi Dextra (H25.9)',
    spesialis: 'Mata (Oftalmologi)',
    operator: 'dr. Gita Permata, Sp.M',
    anastesi: 'dr. Hany Lestari, Sp.An',
    tipe_anastesi: 'Topikal + Blok Peribulbar',
    ok: 'Kamar OK 5 - Bedah Mata Mikro',
    durasi: '30 Menit'
  },
  {
    tindakan: 'Apendektomi Laparoskopi Akut',
    icd9: '47.01',
    diagnosa: 'Apendisitis Akut Tanpa Perforasi (K35.80)',
    spesialis: 'Bedah Umum',
    operator: 'dr. Bambang Alamsyah, Sp.B',
    anastesi: 'dr. Indra Gunawan, Sp.An-TI',
    tipe_anastesi: 'General Anesthesia (GA)',
    ok: 'Kamar OK 1 - Mayor Laparoskopi',
    durasi: '75 Menit'
  },
  {
    tindakan: 'Tonsilektomi & Adenoidektomi Bipolar',
    icd9: '28.3',
    diagnosa: 'Tonsilitis Kronik Hipertrofi Grade T3-T3 (J35.0)',
    spesialis: 'THT-KL',
    operator: 'dr. Irawan Hakim, Sp.THT-BKL',
    anastesi: 'dr. Hany Lestari, Sp.An',
    tipe_anastesi: 'General Anesthesia (GA)',
    ok: 'Kamar OK 3 - THT & Bedah Mulut',
    durasi: '45 Menit'
  },
  {
    tindakan: 'Mastektomi Radikal Modifikasi (MRM) Dextra',
    icd9: '85.43',
    diagnosa: 'Carcinoma Mammae Dextra Stadium IIB (C50.911)',
    spesialis: 'Bedah Onkologi',
    operator: 'dr. Bambang Alamsyah, Sp.B, Subsp.Onk(K)',
    anastesi: 'dr. Rahmat Setiawan, Sp.An',
    tipe_anastesi: 'General Anesthesia (GA)',
    ok: 'Kamar OK 2 - Bedah Onkologi',
    durasi: '180 Menit'
  },
  {
    tindakan: 'Tiroidektomi Subtotalis ec Struma Nodusa',
    icd9: '06.39',
    diagnosa: 'Struma Nodusa Non-Toksik Lobe Dextra (E04.1)',
    spesialis: 'Bedah Umum',
    operator: 'dr. Bambang Alamsyah, Sp.B',
    anastesi: 'dr. Indra Gunawan, Sp.An-TI',
    tipe_anastesi: 'General Anesthesia (GA)',
    ok: 'Kamar OK 1 - Mayor Laparoskopi',
    durasi: '120 Menit'
  },
  {
    tindakan: 'Hernioraphy Mesh Plug Inguinalis Lateralis Dextra',
    icd9: '53.05',
    diagnosa: 'Hernia Inguinalis Lateralis Reponibilis Dextra (K40.90)',
    spesialis: 'Bedah Umum',
    operator: 'dr. Bambang Alamsyah, Sp.B',
    anastesi: 'dr. Rahmat Setiawan, Sp.An',
    tipe_anastesi: 'Regional Spinal Anesthesia',
    ok: 'Kamar OK 2 - Bedah Umum',
    durasi: '60 Menit'
  },
  {
    tindakan: 'Artroskopi Rekonstruksi ACL Genu Sinistra',
    icd9: '81.45',
    diagnosa: 'Ruptur Totalis Anterior Cruciate Ligament (ACL) Sinistra (S83.512A)',
    spesialis: 'Orthopedi & Sports Injury',
    operator: 'dr. Wahyu Nugroho, Sp.OT(K)',
    anastesi: 'dr. Indra Gunawan, Sp.An-TI',
    tipe_anastesi: 'General Anesthesia / Spinal',
    ok: 'Kamar OK 2 - Orthopedi & Sports',
    durasi: '120 Menit'
  },
  {
    tindakan: 'Odontektomi M3 Impaksi Gigi Rahang Bawah Bilateral',
    icd9: '23.19',
    diagnosa: 'Impaksi Molar Tiga Mandibula Bilateral Kelas II Posisi B (K01.1)',
    spesialis: 'Bedah Mulut & Maksilofasial',
    operator: 'drg. Fachri Alif, Sp.BM',
    anastesi: 'dr. Hany Lestari, Sp.An',
    tipe_anastesi: 'General Anesthesia (GA)',
    ok: 'Kamar OK 3 - Bedah Mulut',
    durasi: '45 Menit'
  }
];

export function generateComprehensiveSurgeryPatients(): PasienOperasiItem[] {
  return Array.from({ length: 50 }, (_, idx) => {
    const i = idx + 1;
    const fName = NAMA_DEPAN[(idx * 2) % NAMA_DEPAN.length];
    const lName = NAMA_BELAKANG[((idx * 3) + 5) % NAMA_BELAKANG.length];
    const pName = `${fName} ${lName}`;
    const proc = SURGICAL_PROCEDURES_MASTER[idx % SURGICAL_PROCEDURES_MASTER.length];
    const hour = String(7 + (idx % 11)).padStart(2, '0');
    const day = String(20 + (idx % 6)).padStart(2, '0');
    const isMale = idx % 2 === 0;
    const umur = 22 + (idx * 3) % 55;
    
    // Status distribution
    let status: PasienOperasiItem['status'] = 'Terjadwal';
    if (idx === 0 || idx === 1 || idx === 3) {
      status = 'Sedang Operasi';
    } else if (idx === 2 || idx === 4 || idx === 7) {
      status = 'PACU / Recovery';
    } else if (idx % 4 === 0) {
      status = 'Selesai - Rawat Inap';
    } else if (idx % 6 === 0) {
      status = 'Persiapan Pre-Op';
    } else {
      status = 'Terjadwal';
    }

    const sifat: 'Elektif' | 'Cito / Emergency' = (idx === 1 || idx === 5 || idx === 11 || idx === 18) ? 'Cito / Emergency' : 'Elektif';
    const penjamin = idx % 3 === 0 ? 'Umum / Mandiri' : (idx % 5 === 0 ? 'Asuransi Mandiri Inhealth' : 'BPJS Kesehatan');

    return {
      id: i,
      nomor: `OP-2026-${String(i).padStart(3, '0')}`,
      no_rm: `RM-${String(i + 10).padStart(4, '0')}`,
      pasien: pName,
      nama_pasien: pName,
      nik: `320108${String(1000000000 + i * 89342).substring(0, 10)}`,
      umur: umur,
      jenis_kelamin: isMale ? 'L' : 'P',
      penjamin: penjamin,
      sifat_operasi: sifat,
      
      diagnosa_pra_bedah: proc.diagnosa,
      diagnosa_pasca_bedah: `Post ${proc.tindakan}`,
      tindakan: proc.tindakan,
      jenis: proc.tindakan,
      kode_icd9: proc.icd9,
      indikasi_operasi: `Klinis & hasil penunjang mengonfirmasi indikasi bedah untuk ${proc.diagnosa}`,
      
      dokter: proc.operator,
      operator: proc.operator,
      spesialisasi_operator: proc.spesialis,
      anastesi: proc.anastesi,
      tipe_anastesi: proc.tipe_anastesi,
      asisten_operator: idx % 2 === 0 ? 'dr. Hendra Pratama, Sp.B' : 'Ns. Tri Wahyuni, S.Kep',
      perawat_instrumen: idx % 2 === 0 ? 'Ns. Rina Wulandari, S.Kep' : 'Ns. Siti Fatimah, S.Kep',
      perawat_sirkuler: idx % 2 === 0 ? 'Ns. Ahmad Fauzi, S.Kep' : 'Ns. Dedi Kusuma, S.Kep',
      penata_anestesi: 'Penata Anestesi Wahyudi, S.Tr.Kes',
      
      ruang_ok: proc.ok,
      durasi: proc.durasi,
      tanggal: `2026-08-${day} ${hour}:00 WIB`,
      waktu_mulai: `${hour}:00 WIB`,
      waktu_selesai: `${String(Number(hour) + 2).padStart(2, '0')}:00 WIB`,
      
      status: status,
      golongan_darah: (['A+', 'B+', 'O+', 'AB+'])[idx % 4],
      persiapan_darah: sifat === 'Cito / Emergency' ? '2 Labu PRC Siap Crossmatch' : '1 Labu PRC Siap / On-Call',
      puasa: 'Puasa 8 Jam Terpenuhi',
      informed_consent: 'Sudah Lengkap & TTD',
      
      tanda_vital: {
        td: `${110 + (idx % 20)}/${70 + (idx % 15)} mmHg`,
        nadi: `${72 + (idx % 18)} x/menit`,
        suhu: `36.${5 + (idx % 4)} °C`,
        rr: `${18 + (idx % 4)} x/menit`,
        spo2: `${98 + (idx % 2)}%`,
        skala_nyeri: status === 'PACU / Recovery' ? 3 : 1
      },
      riwayat_alergi: idx % 4 === 0 ? 'Amoxicillin / Penisilin' : 'Tidak Ada Riwayat Alergi Obat',
      
      checklist_who: {
        sign_in: {
          selesai: true,
          identitas_terkonfirmasi: true,
          lokasi_diberi_tanda: true,
          mesin_anestesi_lengkap: true,
          pulse_oximeter_terpasang: true,
          riwayat_alergi_diketahui: true,
          risiko_aspirasi_jalan_napas: false,
          risiko_perdarahan_terantisipasi: true,
          waktu: `${hour}:05 WIB`
        },
        time_out: {
          selesai: status !== 'Terjadwal' && status !== 'Persiapan Pre-Op',
          seluruh_tim_memperkenalkan_diri: true,
          konfirmasi_pasien_prosedur_lokasi: true,
          antibiotik_profilaksis_60menit: true,
          antisipasi_kritis_operator: true,
          antisipasi_kritis_anestesi: true,
          sterilitas_alat_terkonfirmasi: true,
          imaging_ditampilkan: true,
          waktu: `${hour}:20 WIB`
        },
        sign_out: {
          selesai: status === 'PACU / Recovery' || status === 'Selesai - Rawat Inap',
          nama_tindakan_dicatat: true,
          jumlah_kasa_jarum_alat_lengkap: true,
          label_spesimen_pa_terverifikasi: true,
          masalah_peralatan_nihil: true,
          instruksi_pemulihan_pacu_lengkap: true,
          waktu: `${String(Number(hour) + 1).padStart(2, '0')}:50 WIB`
        }
      },
      
      laporan_operasi: {
        temuan_intra_operasi: `Tampak lesi dan kondisi patologis sesuai diagnosa pra-bedah. Dilakukan prosedur ${proc.tindakan} secara asepsis dan lege artis. Lapangan operasi bersih dan hemostasis terjaga baik.`,
        tahapan_prosedur: '1. Desinfeksi lapangan operasi dengan Povidone Iodine 10% & Draping steril.\n2. Insisi dan akses ke rongga/area target bedah.\n3. Eksisi/rekonstruksi/manipulasi jaringan target sesuai standar prosedur operasional.\n4. Kontrol hemostasis cermat, cuci luka dengan cairan NaCl 0.9% hangat.\n5. Penutupan luka operasi lapis demi lapis.',
        perdarahan_cc: sifat === 'Cito / Emergency' ? 250 : 80,
        jaringan_pa: (idx % 2 === 0) ? 'Ya (Dikirim ke Lab PA)' : 'Tidak Ada Jaringan',
        nama_spesimen_pa: (idx % 2 === 0) ? `Jaringan Spesimen ${proc.tindakan}` : '-',
        komplikasi: 'Tidak ada komplikasi mayor selama tindakan berlangsung.',
        implan_terpasang: proc.icd9 === '79.35' ? 'Titanium Locking Plate & 6 Cortical Screws' : (proc.icd9 === '53.05' ? 'Prolene Mesh 7.5x15cm' : '-'),
        drain_terpasang: proc.icd9 === '79.35' || proc.icd9 === '85.43' ? 'Redon Drain No. 14 Fr' : 'Tidak Dipasang Drain',
        instruksi_pasca_bedah: '1. Monitor tanda vital per 15 menit selama di PACU (Ruang Pulih Sadar).\n2. Awasi tanda perdarahan dan rembesan pada verban luka operasi.\n3. Terapi analgesik IV dan cairan rumatan infus sesuai instruksi Anestesi.\n4. Bila Aldrete Score ≥ 9, pasien dapat ditransfer ke Bangsal Rawat Inap.',
        aldrete_score: {
          aktivitas: 2,
          respirasi: 2,
          sirkulasi: 2,
          kesadaran: 2,
          warna_kulit: 2,
          total: 10
        }
      }
    };
  });
}
