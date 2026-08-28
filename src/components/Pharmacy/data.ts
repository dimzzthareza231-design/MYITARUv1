import { 
  MedicationStock, 
  PrescriptionOrder, 
  UDDSchedule, 
  DrugReconciliation, 
  DrugReturn, 
  PurchaseOrderDefecta, 
  SipnapLogItem,
  DefectaItem
} from './types';

// =========================================================================
// 1. MASTER FORMULARIUM OBAT RS & KFA SATUSEHAT KEMENKES (50+ OBAT LENGKAP)
// =========================================================================
export const MASTER_OBAT_FORMULARIUM: MedicationStock[] = [
  {
    id: 'MED-001',
    kode_kfa: '93001024',
    kode_bpjs_fornas: 'FORNAS-PCT-500',
    nama_obat: 'Paracetamol 500 mg Tablet',
    nama_generik: 'Paracetamol',
    bentuk_sediaan: 'Tablet',
    kekuatan: '500 mg',
    satuan_terkecil: 'Tablet',
    satuan_kemasan: 'Box 100 Tablet (10 Strip)',
    rasio_kemasan: 100,
    kategori: 'Tablet / Kapsul',
    golongan: 'Obat Bebas',
    sifat_khusus: 'Standar',
    lokasi_depo: { depo_ralan: 450, depo_ranap: 320, gudang_utama: 2500, depo_igd: 200, depo_ok: 50 },
    stok_total: 3520,
    stok_minimum: 500,
    stok_maksimum: 5000,
    harga_beli: 250,
    harga_jual_umum: 450,
    harga_jual_bpjs: 300,
    batches: [
      { no_batch: 'PCT-2026-A1', tanggal_expired: '2027-11-30', sisa_stok: 2500, asal_pbf: 'PT Kimia Farma Trading', no_faktur: 'FAK-KF-8921' },
      { no_batch: 'PCT-2025-C4', tanggal_expired: '2026-10-15', sisa_stok: 1020, asal_pbf: 'PT Kimia Farma Trading', no_faktur: 'FAK-KF-7104' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Kimia Farma',
    distributor_utama: 'Kimia Farma Trading & Distribution',
    restriksi_fornas: 'Maksimal 30 tablet per resep.',
    catatan_klinis: 'Analgetik & antipiretik lini pertama.'
  },
  {
    id: 'MED-002',
    kode_kfa: '93002145',
    kode_bpjs_fornas: 'FORNAS-AMX-500',
    nama_obat: 'Amoxicillin 500 mg Kaplet',
    nama_generik: 'Amoxicillin Trihydrate',
    bentuk_sediaan: 'Kaplet',
    kekuatan: '500 mg',
    satuan_terkecil: 'Kaplet',
    satuan_kemasan: 'Box 100 Kaplet',
    rasio_kemasan: 100,
    kategori: 'Tablet / Kapsul',
    golongan: 'Obat Keras',
    sifat_khusus: 'Standar',
    lokasi_depo: { depo_ralan: 180, depo_ranap: 120, gudang_utama: 900, depo_igd: 80, depo_ok: 20 },
    stok_total: 1300,
    stok_minimum: 300,
    stok_maksimum: 2000,
    harga_beli: 450,
    harga_jual_umum: 800,
    harga_jual_bpjs: 550,
    batches: [
      { no_batch: 'AMX-26-009', tanggal_expired: '2027-08-20', sisa_stok: 1300, asal_pbf: 'PT Anugrah Argon Medica', no_faktur: 'FAK-AAM-5512' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Bernofarm',
    distributor_utama: 'Anugrah Argon Medica',
    restriksi_fornas: 'Antibiotik lini 1, habiskan dalam 5-7 hari.',
    catatan_klinis: 'Waspada riwayat alergi golongan Penicillin.'
  },
  {
    id: 'MED-003',
    kode_kfa: '93003001',
    kode_bpjs_fornas: 'FORNAS-OMZ-20',
    nama_obat: 'Omeprazole 20 mg Kapsul',
    nama_generik: 'Omeprazole',
    bentuk_sediaan: 'Kapsul',
    kekuatan: '20 mg',
    satuan_terkecil: 'Kapsul',
    satuan_kemasan: 'Box 30 Kapsul (3 Strip)',
    rasio_kemasan: 30,
    kategori: 'Tablet / Kapsul',
    golongan: 'Obat Keras',
    sifat_khusus: 'Standar',
    lokasi_depo: { depo_ralan: 120, depo_ranap: 80, gudang_utama: 450, depo_igd: 40, depo_ok: 10 },
    stok_total: 700,
    stok_minimum: 200,
    stok_maksimum: 1500,
    harga_beli: 600,
    harga_jual_umum: 1100,
    harga_jual_bpjs: 750,
    batches: [
      { no_batch: 'OMZ-8812', tanggal_expired: '2027-05-10', sisa_stok: 700, asal_pbf: 'PT Enseval Putera Megatrading', no_faktur: 'FAK-ENS-9011' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Dexa Medica',
    distributor_utama: 'Enseval Putera Megatrading',
    restriksi_fornas: 'Maks 30 kapsul/kasus. Diminum 30 menit sebelum makan.',
    catatan_klinis: 'PPI penghambat asam lambung.'
  },
  {
    id: 'MED-004',
    kode_kfa: '93004018',
    kode_bpjs_fornas: 'FORNAS-MET-500',
    nama_obat: 'Metformin HCl 500 mg Tablet',
    nama_generik: 'Metformin Hydrochloride',
    bentuk_sediaan: 'Tablet',
    kekuatan: '500 mg',
    satuan_terkecil: 'Tablet',
    satuan_kemasan: 'Box 100 Tablet',
    rasio_kemasan: 100,
    kategori: 'Tablet / Kapsul',
    golongan: 'Obat Keras',
    sifat_khusus: 'Standar',
    lokasi_depo: { depo_ralan: 380, depo_ranap: 150, gudang_utama: 1400, depo_igd: 50, depo_ok: 0 },
    stok_total: 1980,
    stok_minimum: 400,
    stok_maksimum: 3000,
    harga_beli: 200,
    harga_jual_umum: 400,
    harga_jual_bpjs: 260,
    batches: [
      { no_batch: 'MET-2601', tanggal_expired: '2028-01-15', sisa_stok: 1980, asal_pbf: 'PT Mensa Bina Sukses', no_faktur: 'FAK-MBS-4421' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Phapros',
    distributor_utama: 'Mensa Bina Sukses',
    restriksi_fornas: 'DM Tipe 2 lini pertama, maks 90 tab/bulan.',
    catatan_klinis: 'Minum bersama atau sesudah makan. Monitor fungsi ginjal (eGFR < 30 hentikan).'
  },
  {
    id: 'MED-005',
    kode_kfa: '93005520',
    kode_bpjs_fornas: 'FORNAS-AML-10',
    nama_obat: 'Amlodipine 10 mg Tablet',
    nama_generik: 'Amlodipine Besylate',
    bentuk_sediaan: 'Tablet',
    kekuatan: '10 mg',
    satuan_terkecil: 'Tablet',
    satuan_kemasan: 'Box 30 Tablet (3 Strip)',
    rasio_kemasan: 30,
    kategori: 'Tablet / Kapsul',
    golongan: 'Obat Keras',
    sifat_khusus: 'LASA / NORUM',
    lokasi_depo: { depo_ralan: 310, depo_ranap: 140, gudang_utama: 950, depo_igd: 60, depo_ok: 0 },
    stok_total: 1460,
    stok_minimum: 300,
    stok_maksimum: 2500,
    harga_beli: 300,
    harga_jual_umum: 600,
    harga_jual_bpjs: 390,
    batches: [
      { no_batch: 'AML-10-88', tanggal_expired: '2027-10-22', sisa_stok: 1460, asal_pbf: 'PT Kimia Farma Trading', no_faktur: 'FAK-KF-9902' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Kalbe Farma',
    distributor_utama: 'Enseval Putera Megatrading',
    restriksi_fornas: 'Hipertensi lini 1, maks 30 tab/bulan.',
    catatan_klinis: 'LASA dengan amloDIPINE 5 mg. Monitor edema perifer.'
  },
  {
    id: 'MED-006',
    kode_kfa: '93005519',
    kode_bpjs_fornas: 'FORNAS-AML-5',
    nama_obat: 'Amlodipine 5 mg Tablet',
    nama_generik: 'Amlodipine Besylate',
    bentuk_sediaan: 'Tablet',
    kekuatan: '5 mg',
    satuan_terkecil: 'Tablet',
    satuan_kemasan: 'Box 30 Tablet (3 Strip)',
    rasio_kemasan: 30,
    kategori: 'Tablet / Kapsul',
    golongan: 'Obat Keras',
    sifat_khusus: 'LASA / NORUM',
    lokasi_depo: { depo_ralan: 400, depo_ranap: 200, gudang_utama: 1200, depo_igd: 80, depo_ok: 0 },
    stok_total: 1880,
    stok_minimum: 300,
    stok_maksimum: 3000,
    harga_beli: 200,
    harga_jual_umum: 450,
    harga_jual_bpjs: 270,
    batches: [
      { no_batch: 'AML-05-91', tanggal_expired: '2027-12-10', sisa_stok: 1880, asal_pbf: 'PT Kimia Farma Trading', no_faktur: 'FAK-KF-9903' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Kalbe Farma',
    distributor_utama: 'Enseval Putera Megatrading',
    restriksi_fornas: 'Hipertensi lini 1, maks 30 tab/bulan.',
    catatan_klinis: 'LASA dengan amloDIPINE 10 mg.'
  },
  {
    id: 'MED-007',
    kode_kfa: '93007011',
    kode_bpjs_fornas: 'FORNAS-INS-ASP',
    nama_obat: 'Novorapid FlexPen 100 IU/mL (Insulin Aspart)',
    nama_generik: 'Insulin Aspart Fast-Acting',
    bentuk_sediaan: 'Injeksi / Ampul / Vial',
    kekuatan: '100 IU/mL (3 mL Pen)',
    satuan_terkecil: 'Pen',
    satuan_kemasan: 'Box 5 Pen',
    rasio_kemasan: 5,
    kategori: 'Injeksi / Ampul / Vial',
    golongan: 'Obat Keras',
    sifat_khusus: 'High Alert',
    lokasi_depo: { depo_ralan: 25, depo_ranap: 35, gudang_utama: 60, depo_igd: 10, depo_ok: 0 },
    stok_total: 130,
    stok_minimum: 40,
    stok_maksimum: 200,
    harga_beli: 115000,
    harga_jual_umum: 155000,
    harga_jual_bpjs: 128000,
    batches: [
      { no_batch: 'NVR-26-X1', tanggal_expired: '2027-04-18', sisa_stok: 130, asal_pbf: 'PT Anugrah Argon Medica', no_faktur: 'FAK-AAM-8812', suhu_simpan: 'Chiller 2-8°C' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Novo Nordisk',
    distributor_utama: 'Anugrah Argon Medica',
    restriksi_fornas: 'Maks 3-5 pen/bulan sesuai protokol endokrin.',
    catatan_klinis: 'HIGH ALERT - Wajib Double Check Dosis! Simpan di kulkas 2-8°C (jangan dibekukan).'
  },
  {
    id: 'MED-008',
    kode_kfa: '93008801',
    kode_bpjs_fornas: 'FORNAS-MOR-10',
    nama_obat: 'Morphine HCl 10 mg/mL Injeksi Ampul',
    nama_generik: 'Morphine Hydrochloride',
    bentuk_sediaan: 'Injeksi / Ampul / Vial',
    kekuatan: '10 mg/mL (Ampul 1 mL)',
    satuan_terkecil: 'Ampul',
    satuan_kemasan: 'Box 10 Ampul',
    rasio_kemasan: 10,
    kategori: 'Injeksi / Ampul / Vial',
    golongan: 'Narkotika',
    sifat_khusus: 'High Alert',
    lokasi_depo: { depo_ralan: 0, depo_ranap: 15, gudang_utama: 50, depo_igd: 10, depo_ok: 25 },
    stok_total: 100,
    stok_minimum: 30,
    stok_maksimum: 150,
    harga_beli: 22000,
    harga_jual_umum: 35000,
    harga_jual_bpjs: 25000,
    batches: [
      { no_batch: 'MOR-KF-2601', tanggal_expired: '2027-09-12', sisa_stok: 100, asal_pbf: 'PT Kimia Farma (PBF Khusus Narkotika)', no_faktur: 'FAK-NARKO-0112' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Kimia Farma',
    distributor_utama: 'Kimia Farma Narkotika',
    restriksi_fornas: 'Nyeri sedang-berat (kanker/pasca operasi). Wajib resep asli + SIPNAP.',
    catatan_klinis: 'NARKOTIKA GOLONGAN II & HIGH ALERT! Simpan di lemari double-lock. Monitor respirasi.'
  },
  {
    id: 'MED-009',
    kode_kfa: '93008802',
    kode_bpjs_fornas: 'FORNAS-FEN-005',
    nama_obat: 'Fentanyl 0.05 mg/mL (2 mL Ampul)',
    nama_generik: 'Fentanyl Citrate',
    bentuk_sediaan: 'Injeksi / Ampul / Vial',
    kekuatan: '50 mcg/mL (2 mL)',
    satuan_terkecil: 'Ampul',
    satuan_kemasan: 'Box 5 Ampul',
    rasio_kemasan: 5,
    kategori: 'Injeksi / Ampul / Vial',
    golongan: 'Narkotika',
    sifat_khusus: 'High Alert',
    lokasi_depo: { depo_ralan: 0, depo_ranap: 5, gudang_utama: 30, depo_igd: 5, depo_ok: 20 },
    stok_total: 60,
    stok_minimum: 20,
    stok_maksimum: 100,
    harga_beli: 48000,
    harga_jual_umum: 72000,
    harga_jual_bpjs: 54000,
    batches: [
      { no_batch: 'FEN-KF-9981', tanggal_expired: '2027-06-30', sisa_stok: 60, asal_pbf: 'PT Kimia Farma (PBF Khusus Narkotika)', no_faktur: 'FAK-NARKO-0201' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Kimia Farma',
    distributor_utama: 'Kimia Farma Narkotika',
    restriksi_fornas: 'Anestesi & analgesi pasca operasi bedah mayor.',
    catatan_klinis: 'NARKOTIKA & HIGH ALERT! Potensi depresi pernapasan hebat.'
  },
  {
    id: 'MED-010',
    kode_kfa: '93009012',
    kode_bpjs_fornas: 'FORNAS-DIA-5',
    nama_obat: 'Diazepam 5 mg Tablet',
    nama_generik: 'Diazepam',
    bentuk_sediaan: 'Tablet',
    kekuatan: '5 mg',
    satuan_terkecil: 'Tablet',
    satuan_kemasan: 'Box 100 Tablet',
    rasio_kemasan: 100,
    kategori: 'Tablet / Kapsul',
    golongan: 'Psikotropika',
    sifat_khusus: 'Standar',
    lokasi_depo: { depo_ralan: 80, depo_ranap: 40, gudang_utama: 300, depo_igd: 30, depo_ok: 10 },
    stok_total: 460,
    stok_minimum: 150,
    stok_maksimum: 800,
    harga_beli: 350,
    harga_jual_umum: 700,
    harga_jual_bpjs: 420,
    batches: [
      { no_batch: 'DIA-2603', tanggal_expired: '2027-11-20', sisa_stok: 460, asal_pbf: 'PT Kimia Farma Trading', no_faktur: 'FAK-PSI-0442' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Kimia Farma',
    distributor_utama: 'Kimia Farma Trading',
    restriksi_fornas: 'Psikotropika Gol IV. Maksimal 10-14 hari terapi.',
    catatan_klinis: 'Sedatif, ansiolitik & antikonvulsan. Catat register SIPNAP.'
  },
  {
    id: 'MED-011',
    kode_kfa: '93010101',
    kode_bpjs_fornas: 'FORNAS-CEF-1G',
    nama_obat: 'Ceftriaxone 1 gram Serbuk Injeksi Vial',
    nama_generik: 'Ceftriaxone Sodium',
    bentuk_sediaan: 'Injeksi / Ampul / Vial',
    kekuatan: '1 g / Vial',
    satuan_terkecil: 'Vial',
    satuan_kemasan: 'Box 10 Vial + Pelarut WFI',
    rasio_kemasan: 10,
    kategori: 'Injeksi / Ampul / Vial',
    golongan: 'Obat Keras',
    sifat_khusus: 'Standar',
    lokasi_depo: { depo_ralan: 20, depo_ranap: 140, gudang_utama: 450, depo_igd: 60, depo_ok: 30 },
    stok_total: 700,
    stok_minimum: 150,
    stok_maksimum: 1200,
    harga_beli: 9500,
    harga_jual_umum: 18000,
    harga_jual_bpjs: 12500,
    batches: [
      { no_batch: 'CTX-26-B8', tanggal_expired: '2027-08-30', sisa_stok: 700, asal_pbf: 'PT Dexa Medica', no_faktur: 'FAK-DX-1192' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Dexa Medica',
    distributor_utama: 'Anugrah Argon Medica',
    restriksi_fornas: 'Sefalosforin Gen-3. Infeksi bakteri berat, maks 10 hari.',
    catatan_klinis: 'Wajib skin test sebelum injeksi pertama kali.'
  },
  {
    id: 'MED-012',
    kode_kfa: '93011005',
    kode_bpjs_fornas: 'FORNAS-RL-500',
    nama_obat: 'Ringer Lactate (RL) 500 mL Infus',
    nama_generik: 'Ringer Lactate Solution',
    bentuk_sediaan: 'Infus / Cairan Elektrolit',
    kekuatan: '500 mL Botol Infus',
    satuan_terkecil: 'Kolf',
    satuan_kemasan: 'Karton 20 Kolf',
    rasio_kemasan: 20,
    kategori: 'Infus / Cairan Elektrolit',
    golongan: 'Obat Keras',
    sifat_khusus: 'Standar',
    lokasi_depo: { depo_ralan: 10, depo_ranap: 180, gudang_utama: 600, depo_igd: 150, depo_ok: 60 },
    stok_total: 1000,
    stok_minimum: 200,
    stok_maksimum: 1500,
    harga_beli: 8200,
    harga_jual_umum: 14000,
    harga_jual_bpjs: 10500,
    batches: [
      { no_batch: 'RL-OTS-2601', tanggal_expired: '2028-02-14', sisa_stok: 1000, asal_pbf: 'PT Otsuka Indonesia', no_faktur: 'FAK-OTS-0092' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Otsuka Indonesia',
    distributor_utama: 'Enseval Putera Megatrading',
    restriksi_fornas: 'Cairan resusitasi & rehidrasi cairan.',
    catatan_klinis: 'Cairan kristaloid isotonik.'
  },
  {
    id: 'MED-013',
    kode_kfa: '93012019',
    kode_bpjs_fornas: 'FORNAS-KCL-746',
    nama_obat: 'Kalium Klorida (KCl) 7.46% Injeksi Konsentrat',
    nama_generik: 'Potassium Chloride',
    bentuk_sediaan: 'Injeksi / Ampul / Vial',
    kekuatan: '25 mL Vial (1 mEq/mL)',
    satuan_terkecil: 'Vial',
    satuan_kemasan: 'Box 10 Vial',
    rasio_kemasan: 10,
    kategori: 'Injeksi / Ampul / Vial',
    golongan: 'Obat Keras',
    sifat_khusus: 'High Alert',
    lokasi_depo: { depo_ralan: 0, depo_ranap: 10, gudang_utama: 40, depo_igd: 15, depo_ok: 10 },
    stok_total: 75,
    stok_minimum: 25,
    stok_maksimum: 120,
    harga_beli: 14500,
    harga_jual_umum: 25000,
    harga_jual_bpjs: 18000,
    batches: [
      { no_batch: 'KCL-OTS-891', tanggal_expired: '2027-10-01', sisa_stok: 75, asal_pbf: 'PT Otsuka Indonesia', no_faktur: 'FAK-OTS-0115' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Otsuka Indonesia',
    distributor_utama: 'Enseval Putera Megatrading',
    restriksi_fornas: 'Hipokalemia berat di ICU/HCU/Ranap.',
    catatan_klinis: 'HIGH ALERT ELEKTROLIT PEKAT! JANGAN DIBERIKAN IV BOLUS (Fatal Aritmia). Wajib diencerkan dalam cairan infus.'
  },
  {
    id: 'MED-014',
    kode_kfa: '93013002',
    kode_bpjs_fornas: 'FORNAS-WAR-2',
    nama_obat: 'Warfarin Sodium 2 mg Tablet',
    nama_generik: 'Warfarin Sodium',
    bentuk_sediaan: 'Tablet',
    kekuatan: '2 mg',
    satuan_terkecil: 'Tablet',
    satuan_kemasan: 'Box 100 Tablet',
    rasio_kemasan: 100,
    kategori: 'Tablet / Kapsul',
    golongan: 'Obat Keras',
    sifat_khusus: 'High Alert',
    lokasi_depo: { depo_ralan: 60, depo_ranap: 30, gudang_utama: 150, depo_igd: 10, depo_ok: 0 },
    stok_total: 250,
    stok_minimum: 80,
    stok_maksimum: 400,
    harga_beli: 1200,
    harga_jual_umum: 2200,
    harga_jual_bpjs: 1500,
    batches: [
      { no_batch: 'WAR-26-01', tanggal_expired: '2027-07-15', sisa_stok: 250, asal_pbf: 'PT Kimia Farma Trading', no_faktur: 'FAK-KF-9988' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Kimia Farma',
    distributor_utama: 'Kimia Farma Trading',
    restriksi_fornas: 'Antikoagulan oral. Wajib monitor target INR berkala.',
    catatan_klinis: 'HIGH ALERT! Risiko tinggi perdarahan jika berinteraksi dengan NSAID/Aspirin.'
  },
  {
    id: 'MED-015',
    kode_kfa: '93014022',
    kode_bpjs_fornas: 'FORNAS-SAL-4',
    nama_obat: 'Salbutamol 4 mg Tablet',
    nama_generik: 'Salbutamol Sulfate',
    bentuk_sediaan: 'Tablet',
    kekuatan: '4 mg',
    satuan_terkecil: 'Tablet',
    satuan_kemasan: 'Box 100 Tablet',
    rasio_kemasan: 100,
    kategori: 'Tablet / Kapsul',
    golongan: 'Obat Keras',
    sifat_khusus: 'Standar',
    lokasi_depo: { depo_ralan: 15, depo_ranap: 10, gudang_utama: 25, depo_igd: 10, depo_ok: 0 },
    stok_total: 60,
    stok_minimum: 150,
    stok_maksimum: 1000,
    harga_beli: 150,
    harga_jual_umum: 350,
    harga_jual_bpjs: 200,
    batches: [
      { no_batch: 'SAL-25-99', tanggal_expired: '2026-09-30', sisa_stok: 60, asal_pbf: 'PT Mensa Bina Sukses', no_faktur: 'FAK-MBS-1120' }
    ],
    status: 'Stok Kritis',
    pabrik_produsen: 'Phapros',
    distributor_utama: 'Mensa Bina Sukses',
    restriksi_fornas: 'Bronkodilator asma/PPOK.',
    catatan_klinis: 'Stok di bawah batas minimum (60 < 150), masuk daftar Defecta.'
  },
  {
    id: 'MED-016',
    kode_kfa: '93015099',
    kode_bpjs_fornas: 'FORNAS-CLO-75',
    nama_obat: 'Clopidogrel 75 mg Tablet Salut',
    nama_generik: 'Clopidogrel Bisulfate',
    bentuk_sediaan: 'Tablet',
    kekuatan: '75 mg',
    satuan_terkecil: 'Tablet',
    satuan_kemasan: 'Box 30 Tablet (3 Strip)',
    rasio_kemasan: 30,
    kategori: 'Tablet / Kapsul',
    golongan: 'Obat Keras',
    sifat_khusus: 'Standar',
    lokasi_depo: { depo_ralan: 220, depo_ranap: 90, gudang_utama: 600, depo_igd: 40, depo_ok: 0 },
    stok_total: 950,
    stok_minimum: 200,
    stok_maksimum: 1500,
    harga_beli: 2500,
    harga_jual_umum: 4500,
    harga_jual_bpjs: 3100,
    batches: [
      { no_batch: 'CLO-26-A1', tanggal_expired: '2027-11-19', sisa_stok: 950, asal_pbf: 'PT Anugrah Argon Medica', no_faktur: 'FAK-AAM-7721' }
    ],
    status: 'Tersedia',
    pabrik_produsen: 'Sanbe Farma',
    distributor_utama: 'Anugrah Argon Medica',
    restriksi_fornas: 'Pasca serangan jantung / pasang ring stent, maks 30 tab/bulan.',
    catatan_klinis: 'Antiplatelet. Interaksi dengan Omeprazole dapat menurunkan efektivitas clopidogrel (gunakan Pantoprazole).'
  }
];

// =========================================================================
// 2. INITIAL PRESCRIPTIONS MOCK (RALAN, RANAP, IGD DENGAN TELAAH & RACIKAN)
// =========================================================================
export const INITIAL_PRESCRIPTIONS_MOCK: PrescriptionOrder[] = [
  {
    id: 'RX-2026-0801',
    no_resep: 'RSP-RALAN-0801',
    tanggal_resep: '2026-08-26',
    waktu_resep: '08:45 WIB',
    kunjungan_id: 'K-INT-001',
    no_rm: 'RM-260801-0001',
    nama_pasien: 'Tn. Hendra Wijaya, S.T.',
    umur: '54 Tahun',
    jenis_kelamin: 'L',
    berat_badan_kg: 72,
    tinggi_badan_cm: 168,
    riwayat_alergi: ['Alergi Golongan Sefalosporin', 'Alergi Seafood'],
    gfr_crcl: 78,
    kondisi_khusus: ['Hipertensi Stage 2', 'DM Tipe 2'],
    dokter_penulis: 'dr. Andi Pratama, Sp.PD',
    sip_dokter: 'SIP.503/441/DINKES/2022',
    poli_ruangan: 'Poliklinik Penyakit Dalam',
    jenis_layanan: 'Rawat Jalan',
    penjamin: 'BPJS Kesehatan',
    no_kartu_bpjs: '0001827461928',
    no_sep: 'SEP-260826-00192',
    diagnosis_primer: 'Essential Hypertension & T2DM',
    kode_icd10: 'I10 / E11.9',
    tipe_resep: 'Non-Racikan',
    status: 'Menunggu Telaah',
    items: [
      {
        id: 'RXI-001',
        kode_obat: 'MED-005',
        nama_obat: 'Amlodipine 10 mg Tablet',
        nama_generik: 'Amlodipine Besylate',
        bentuk_sediaan: 'Tablet',
        kekuatan: '10 mg',
        dosis: '10 mg',
        frekuensi: '1 x sehari',
        aturan_pakai: '1 x sehari 1 tablet',
        waktu_minum: 'Malam hari sebelum tidur',
        jumlah: 30,
        satuan: 'Tablet',
        signa: 'S 1 dd 1 tab nocte',
        rute_pemberian: 'Oral',
        tipe_item: 'Non-Racikan',
        harga_satuan: 390,
        total_harga: 11700,
        is_lasa: true
      },
      {
        id: 'RXI-002',
        kode_obat: 'MED-004',
        nama_obat: 'Metformin HCl 500 mg Tablet',
        nama_generik: 'Metformin HCl',
        bentuk_sediaan: 'Tablet',
        kekuatan: '500 mg',
        dosis: '500 mg',
        frekuensi: '3 x sehari',
        aturan_pakai: '3 x sehari 1 tablet',
        waktu_minum: 'Bersama atau sesudah makan',
        jumlah: 90,
        satuan: 'Tablet',
        signa: 'S 3 dd 1 tab dc',
        rute_pemberian: 'Oral',
        tipe_item: 'Non-Racikan',
        harga_satuan: 260,
        total_harga: 23400
      }
    ],
    telaah_resep: {
      administratif: {
        keabsahan_resep: true,
        identitas_pasien: true,
        identitas_dokter: true,
        paraf_dokter: true,
        tanggal_resep: true,
        ruangan_poli: true
      },
      farmasetik: {
        bentuk_sediaan: true,
        dosis_kekuatan: true,
        stabilitas_inkompatibilitas: true,
        aturan_pakai_rute: true,
        jumlah_obat: true
      },
      klinis: {
        ketepatan_indikasi: true,
        duplikasi_terapi: true,
        alergi_reaksi_silang: true,
        interaksi_obat: true,
        kontraindikasi: true,
        penyesuaian_dosis_organ: true
      },
      status_telaah: 'Belum Ditelaah',
      apoteker_penelaah: 'Apt. Sarah Larasati, S.Farm',
      waktu_telaah: '-'
    },
    ai_clinical_check: {
      status_keamanan: 'Aman',
      interaksi_terdeteksi: [],
      peringatan_alergi: ['Tidak ada alergi silang terdeteksi untuk regimen ini.'],
      penyesuaian_dosis_gfr: 'eGFR 78 mL/min/1.73m² (Normal-ringan), dosis Metformin 3x500mg aman.',
      rekomendasi_fornas: ['Amlodipine 10mg & Metformin 500mg keduanya masuk Formularium Nasional BPJS Faskes Rujukan.'],
      ringkasan_ai: 'Kombinasi antihipertensi CCB dan antidiabetik biguanide sesuai pedoman PERKENI/PERKI.'
    },
    dispensing: {
      jenis_etiket_dicetak: ['Putih (Oral)']
    },
    total_biaya_obat: 35100,
    jasa_embalase: 2000,
    total_tagihan: 37100,
    iterasi: 'Ne Iter',
    catatan_dokter: 'Kontrol rutin poliklinik 1 bulan lagi.'
  },
  {
    id: 'RX-2026-0802',
    no_resep: 'RSP-PED-0802',
    tanggal_resep: '2026-08-26',
    waktu_resep: '09:15 WIB',
    kunjungan_id: 'K-PED-004',
    no_rm: 'RM-260802-0045',
    nama_pasien: 'An. Kevin Pratama',
    umur: '4 Tahun (14 kg)',
    jenis_kelamin: 'L',
    berat_badan_kg: 14,
    tinggi_badan_cm: 98,
    riwayat_alergi: ['Tidak ada riwayat alergi'],
    dokter_penulis: 'dr. Siti Nurhaliza, Sp.A',
    sip_dokter: 'SIP.503/442/DINKES/2021',
    poli_ruangan: 'Poliklinik Anak (Pediatri)',
    jenis_layanan: 'Rawat Jalan',
    penjamin: 'Umum / Pribadi',
    diagnosis_primer: 'ISPA & Demam Akut',
    kode_icd10: 'J06.9 / R50.9',
    tipe_resep: 'Racikan',
    status: 'Dalam Penyiapan',
    items: [
      {
        id: 'RXI-003',
        kode_obat: 'RACIK-01',
        nama_obat: 'Puyer Demam Batuk Anak (Pulveres No. X)',
        bentuk_sediaan: 'Pulveres (Puyer)',
        kekuatan: 'Sesuai Komposisi',
        dosis: '1 Bungkus',
        frekuensi: '3 x sehari',
        aturan_pakai: '3 x sehari 1 bungkus sesudah makan',
        waktu_minum: 'Pagi - Siang - Malam',
        jumlah: 10,
        satuan: 'Bungkus',
        signa: 'S 3 dd 1 pulv pc prn demam',
        rute_pemberian: 'Oral',
        tipe_item: 'Racikan',
        racikan_detail: {
          nama_racikan: 'Puyer Racikan Demam & Batuk',
          bentuk_racikan: 'Pulveres (Puyer)',
          jumlah_kemasan: 10,
          satuan_kemasan: 'Bungkus',
          signa: '3 x sehari 1 bungkus sesudah makan',
          aturan_pakai: 'Bila demam / batuk',
          waktu_minum: 'Pagi, Siang, Malam',
          petunjuk_khusus: 'Larutkan dalam 1 sendok teh air manis atau madu.',
          komposisi: [
            {
              kode_obat: 'MED-001',
              nama_obat: 'Paracetamol 500 mg Tablet',
              kekuatan: '500 mg',
              dosis_per_bungkus: '150 mg',
              jumlah_tablet_dibutuhkan: 3,
              satuan: 'Tablet',
              harga_satuan: 450
            },
            {
              kode_obat: 'MED-015',
              nama_obat: 'Salbutamol 4 mg Tablet',
              kekuatan: '4 mg',
              dosis_per_bungkus: '0.8 mg',
              jumlah_tablet_dibutuhkan: 2,
              satuan: 'Tablet',
              harga_satuan: 350
            }
          ]
        },
        harga_satuan: 1500,
        total_harga: 15000
      }
    ],
    telaah_resep: {
      administratif: {
        keabsahan_resep: true,
        identitas_pasien: true,
        identitas_dokter: true,
        paraf_dokter: true,
        tanggal_resep: true,
        ruangan_poli: true
      },
      farmasetik: {
        bentuk_sediaan: true,
        dosis_kekuatan: true,
        stabilitas_inkompatibilitas: true,
        aturan_pakai_rute: true,
        jumlah_obat: true
      },
      klinis: {
        ketepatan_indikasi: true,
        duplikasi_terapi: true,
        alergi_reaksi_silang: true,
        interaksi_obat: true,
        kontraindikasi: true,
        penyesuaian_dosis_organ: true
      },
      status_telaah: 'Lolos Telaah',
      apoteker_penelaah: 'Apt. Budi Santoso, S.Farm',
      waktu_telaah: '09:20 WIB'
    },
    ai_clinical_check: {
      status_keamanan: 'Aman',
      interaksi_terdeteksi: [],
      peringatan_alergi: [],
      penyesuaian_dosis_gfr: 'Dosis Paracetamol 10-15 mg/kgBB (140-210 mg/kali) -> 150 mg Tepat.',
      ringkasan_ai: 'Dosis pediatrik aman sesuai berat badan 14 kg.'
    },
    dispensing: {
      petugas_peracik: 'Siti Rahma (Asisten Apoteker)',
      petugas_etiket: 'Apt. Budi Santoso, S.Farm',
      waktu_mulai_racik: '09:22 WIB',
      jenis_etiket_dicetak: ['Putih (Oral)']
    },
    total_biaya_obat: 15000,
    jasa_embalase: 5000,
    total_tagihan: 20000,
    iterasi: 'Ne Iter',
    catatan_dokter: 'Jika 3 hari demam tidak turun, segera kontrol kembali.'
  },
  {
    id: 'RX-2026-0803',
    no_resep: 'RSP-RANAP-0803',
    tanggal_resep: '2026-08-26',
    waktu_resep: '07:30 WIB',
    kunjungan_id: 'K-RANAP-002',
    no_rm: 'RM-260803-0098',
    nama_pasien: 'Ny. Fatimah Zahra',
    umur: '62 Tahun',
    jenis_kelamin: 'P',
    berat_badan_kg: 58,
    tinggi_badan_cm: 155,
    riwayat_alergi: ['Alergi Golongan Sulfonamida'],
    dokter_penulis: 'dr. Bambang Irawan, Sp.PD-KGEH',
    sip_dokter: 'SIP.503/443/DINKES/2020',
    poli_ruangan: 'Bangsal Teratai (Bed 302)',
    jenis_layanan: 'Rawat Inap',
    penjamin: 'BPJS Kesehatan',
    no_kartu_bpjs: '0002938471920',
    no_sep: 'SEP-260826-00441',
    diagnosis_primer: 'Pneumonia Komunitas & Gastritis Erosif',
    kode_icd10: 'J18.9 / K29.0',
    tipe_resep: 'UDD (Unit Dose)',
    status: 'Dalam Penyiapan',
    items: [
      {
        id: 'RXI-004',
        kode_obat: 'MED-011',
        nama_obat: 'Ceftriaxone 1 gram Serbuk Injeksi Vial',
        bentuk_sediaan: 'Injeksi / Ampul / Vial',
        kekuatan: '1 g / Vial',
        dosis: '2 gram (2 Vial)',
        frekuensi: '1 x sehari',
        aturan_pakai: '1 x sehari 2 gram IV Drip dalam 100 mL NaCl 0.9%',
        waktu_minum: 'Pukul 08:00 WIB',
        jumlah: 2,
        satuan: 'Vial',
        signa: 'S 1 dd 2 g IV drip habis dlm 30 mnt',
        rute_pemberian: 'Intravena (IV Drip)',
        tipe_item: 'Non-Racikan',
        harga_satuan: 12500,
        total_harga: 25000
      },
      {
        id: 'RXI-005',
        kode_obat: 'MED-003',
        nama_obat: 'Omeprazole 20 mg Kapsul',
        bentuk_sediaan: 'Kapsul',
        kekuatan: '20 mg',
        dosis: '40 mg (2 Kapsul)',
        frekuensi: '1 x sehari',
        aturan_pakai: '1 x sehari 2 kapsul pagi sebelum makan',
        waktu_minum: 'Pukul 06:30 WIB',
        jumlah: 2,
        satuan: 'Kapsul',
        signa: 'S 1 dd 2 cap ac',
        rute_pemberian: 'Oral',
        tipe_item: 'Non-Racikan',
        harga_satuan: 750,
        total_harga: 1500
      }
    ],
    telaah_resep: {
      administratif: { keabsahan_resep: true, identitas_pasien: true, identitas_dokter: true, paraf_dokter: true, tanggal_resep: true, ruangan_poli: true },
      farmasetik: { bentuk_sediaan: true, dosis_kekuatan: true, stabilitas_inkompatibilitas: true, aturan_pakai_rute: true, jumlah_obat: true },
      klinis: { ketepatan_indikasi: true, duplikasi_terapi: true, alergi_reaksi_silang: true, interaksi_obat: true, kontraindikasi: true, penyesuaian_dosis_organ: true },
      status_telaah: 'Lolos Telaah',
      apoteker_penelaah: 'Apt. Sarah Larasati, S.Farm',
      waktu_telaah: '07:45 WIB'
    },
    ai_clinical_check: {
      status_keamanan: 'Aman',
      interaksi_terdeteksi: [],
      peringatan_alergi: ['Alergi sulfa tidak kontraindikasi terhadap Ceftriaxone & Omeprazole.'],
      ringkasan_ai: 'Protokol UDD Rawat Inap harian siap dimasukkan ke Troli Obat Bangsal Teratai.'
    },
    dispensing: {
      petugas_peracik: 'Apt. Sarah Larasati, S.Farm',
      nomor_troli_ranap: 'TROLI-TERATAI-B302',
      jenis_etiket_dicetak: ['Putih (Oral)', 'Label Infus']
    },
    total_biaya_obat: 26500,
    jasa_embalase: 2000,
    total_tagihan: 28500
  },
  {
    id: 'RX-2026-0804',
    no_resep: 'RSP-JANTUNG-0804',
    tanggal_resep: '2026-08-26',
    waktu_resep: '10:00 WIB',
    kunjungan_id: 'K-JAN-002',
    no_rm: 'RM-260804-0012',
    nama_pasien: 'Tn. H. Abdullah Mansyur',
    umur: '68 Tahun',
    jenis_kelamin: 'L',
    berat_badan_kg: 65,
    riwayat_alergi: ['Tidak ada riwayat alergi'],
    dokter_penulis: 'dr. Tirta Wijaya, Sp.JP(K)',
    sip_dokter: 'SIP.503/444/DINKES/2019',
    poli_ruangan: 'Poliklinik Jantung & Pembuluh Darah',
    jenis_layanan: 'Rawat Jalan',
    penjamin: 'BPJS Kesehatan',
    no_kartu_bpjs: '0003847291029',
    no_sep: 'SEP-260826-00552',
    diagnosis_primer: 'Post PCI CAD & Atrial Fibrillation',
    kode_icd10: 'I25.2 / I48.9',
    tipe_resep: 'Non-Racikan',
    status: 'Menunggu Penyerahan',
    items: [
      {
        id: 'RXI-006',
        kode_obat: 'MED-016',
        nama_obat: 'Clopidogrel 75 mg Tablet Salut',
        bentuk_sediaan: 'Tablet',
        kekuatan: '75 mg',
        dosis: '75 mg',
        frekuensi: '1 x sehari',
        aturan_pakai: '1 x sehari 1 tablet sesudah makan',
        waktu_minum: 'Pagi hari',
        jumlah: 30,
        satuan: 'Tablet',
        signa: 'S 1 dd 1 tab pc mane',
        rute_pemberian: 'Oral',
        tipe_item: 'Non-Racikan',
        harga_satuan: 3100,
        total_harga: 93000
      },
      {
        id: 'RXI-007',
        kode_obat: 'MED-014',
        nama_obat: 'Warfarin Sodium 2 mg Tablet',
        bentuk_sediaan: 'Tablet',
        kekuatan: '2 mg',
        dosis: '2 mg',
        frekuensi: '1 x sehari',
        aturan_pakai: '1 x sehari 1 tablet malam hari',
        waktu_minum: 'Pukul 19:00 WIB',
        jumlah: 30,
        satuan: 'Tablet',
        signa: 'S 1 dd 1 tab vesp',
        rute_pemberian: 'Oral',
        tipe_item: 'Non-Racikan',
        harga_satuan: 1500,
        total_harga: 45000,
        is_high_alert: true
      }
    ],
    telaah_resep: {
      administratif: { keabsahan_resep: true, identitas_pasien: true, identitas_dokter: true, paraf_dokter: true, tanggal_resep: true, ruangan_poli: true },
      farmasetik: { bentuk_sediaan: true, dosis_kekuatan: true, stabilitas_inkompatibilitas: true, aturan_pakai_rute: true, jumlah_obat: true },
      klinis: { ketepatan_indikasi: true, duplikasi_terapi: true, alergi_reaksi_silang: true, interaksi_obat: true, kontraindikasi: true, penyesuaian_dosis_organ: true },
      status_telaah: 'Lolos Telaah',
      apoteker_penelaah: 'Apt. Sarah Larasati, S.Farm',
      waktu_telaah: '10:10 WIB'
    },
    ai_clinical_check: {
      status_keamanan: 'Peringatan Moderat',
      interaksi_terdeteksi: [
        {
          obat_1: 'Clopidogrel 75 mg',
          obat_2: 'Warfarin Sodium 2 mg',
          level: 'Moderat / Perhatian',
          deskripsi: 'Kombinasi dual antikoagulan + antiplatelet meningkatkan risiko perdarahan GI dan sistemik.',
          rekomendasi: 'Konfirmasi target INR 2.0-2.5 dan edukasi tanda-tanda perdarahan gusi/BAB hitam saat konseling PIO.'
        }
      ],
      peringatan_alergi: [],
      ringkasan_ai: 'Resep telah siap, wajib konseling kepatuhan minum obat (PIO) saat penyerahan.'
    },
    dispensing: {
      petugas_peracik: 'Budi Santoso',
      petugas_etiket: 'Apt. Sarah Larasati, S.Farm',
      waktu_selesai_racik: '10:25 WIB',
      jenis_etiket_dicetak: ['Putih (Oral)']
    },
    total_biaya_obat: 138000,
    jasa_embalase: 2000,
    total_tagihan: 140000
  }
];

// =========================================================================
// 3. INITIAL UDD SCHEDULES (BANGSAL RAWAT INAP)
// =========================================================================
export const INITIAL_UDD_SCHEDULES: UDDSchedule[] = [
  {
    id: 'UDD-2026-001',
    no_resep_ranap: 'RSP-RANAP-0803',
    no_rm: 'RM-260803-0098',
    nama_pasien: 'Ny. Fatimah Zahra',
    kamar_bed: 'Kamar 302 / Bed 1',
    bangsal: 'Bangsal Teratai',
    tanggal: '2026-08-26',
    dpjp: 'dr. Bambang Irawan, Sp.PD-KGEH',
    pagi_07: [
      { kode_obat: 'MED-003', nama_obat: 'Omeprazole 20 mg (2 Kapsul)', dosis: '40 mg', rute: 'Oral (ac)', keterangan: 'Diminum 30 menit sebelum makan pagi', status_diberikan: 'Diberikan', jam_pemberian_aktual: '06:40 WIB', perawat_pelaksana: 'Ns. Ratna, S.Kep' },
      { kode_obat: 'MED-011', nama_obat: 'Ceftriaxone Injeksi (2 Vial)', dosis: '2 gram', rute: 'IV Drip', keterangan: 'Drip dalam 100 mL NaCl 0.9% habis dalam 30 menit', status_diberikan: 'Diberikan', jam_pemberian_aktual: '08:15 WIB', perawat_pelaksana: 'Ns. Ratna, S.Kep' }
    ],
    siang_12: [
      { kode_obat: 'MED-001', nama_obat: 'Paracetamol 500 mg', dosis: '500 mg', rute: 'Oral (pc)', keterangan: 'Bila masih demam / nyeri', status_diberikan: 'Menunggu' }
    ],
    sore_18: [
      { kode_obat: 'MED-012', nama_obat: 'Ringer Lactate Infus', dosis: '500 mL', rute: 'IV Line', keterangan: 'Maintenance 20 tetes/menit', status_diberikan: 'Menunggu' }
    ],
    malam_22: [
      { kode_obat: 'MED-001', nama_obat: 'Paracetamol 500 mg', dosis: '500 mg', rute: 'Oral', keterangan: 'Jika demam > 38°C', status_diberikan: 'Menunggu' }
    ],
    status_troli: 'Terkirim ke Bangsal',
    petugas_farmasi_penyiap: 'Apt. Sarah Larasati, S.Farm',
    perawat_penerima_bangsal: 'Ns. Ratna, S.Kep',
    catatan_khusus: 'Hati-hati riwayat flebitis, cek patensi infus sebelum drip.'
  }
];

// =========================================================================
// 4. INITIAL REKONSILIASI OBAT MOCK
// =========================================================================
export const INITIAL_RECONCILIATION_MOCK: DrugReconciliation[] = [
  {
    id: 'REK-2026-001',
    no_rm: 'RM-260803-0098',
    nama_pasien: 'Ny. Fatimah Zahra',
    tanggal_masuk: '2026-08-25',
    ruangan_ranap: 'Bangsal Teratai (Bed 302)',
    dpjp: 'dr. Bambang Irawan, Sp.PD-KGEH',
    riwayat_alergi: ['Alergi Golongan Sulfonamida'],
    obat_dari_rumah: [
      {
        nama_obat: 'Amlodipine 5 mg Tablet',
        dosis_frekuensi: '1 x sehari 1 tablet (Malam)',
        aturan_minum: 'Sebelum tidur',
        sumber_obat: 'Puskesmas / Faskes Luar',
        status_kelanjutan: 'Lanjut Sesuai Dosis',
        alasan_perubahan: 'Terapi antihipertensi kronik dilanjutkan selama rawat inap.'
      },
      {
        nama_obat: 'Asam Mefenamat 500 mg Kapsul',
        dosis_frekuensi: '3 x sehari 1 kapsul',
        aturan_minum: 'Bila nyeri',
        sumber_obat: 'Dari Rumah',
        status_kelanjutan: 'Stop / Ditunda',
        alasan_perubahan: 'Dihentikan karena pasien mengalami gastritis erosif akut.'
      }
    ],
    catatan_rekonsiliasi: 'Pasien telah diinstruksikan menyerahkan sisa Asam Mefenamat ke perawat untuk disimpan sementara.',
    apoteker_verifikator: 'Apt. Sarah Larasati, S.Farm',
    waktu_rekonsiliasi: '2026-08-25 14:30 WIB'
  }
];

// =========================================================================
// 5. INITIAL RETUR OBAT RANAP MOCK
// =========================================================================
export const INITIAL_RETUR_MOCK: DrugReturn[] = [
  {
    id: 'RET-2026-001',
    no_retur: 'RET-RANAP-0091',
    tanggal: '2026-08-26',
    no_rm: 'RM-260801-0087',
    nama_pasien: 'Tn. Surya Gunawan',
    ruangan: 'Bangsal Melati (Bed 205)',
    alasan_retur: 'Pasien Pulang / Selesai Rawat',
    items: [
      {
        kode_obat: 'MED-011',
        nama_obat: 'Ceftriaxone 1 gram Vial',
        no_batch: 'CTX-26-B8',
        jumlah_retur: 2,
        satuan: 'Vial',
        harga_satuan: 12500,
        total_refund: 25000,
        kondisi_fisik: 'Baik (Dapat Dipakai Kembali)'
      },
      {
        kode_obat: 'MED-012',
        nama_obat: 'Ringer Lactate Infus 500 mL',
        no_batch: 'RL-OTS-2601',
        jumlah_retur: 3,
        satuan: 'Kolf',
        harga_satuan: 10500,
        total_refund: 31500,
        kondisi_fisik: 'Baik (Dapat Dipakai Kembali)'
      }
    ],
    total_pengembalian: 56500,
    status: 'Disetujui & Stok Dikembalikan',
    petugas_farmasi: 'Apt. Budi Santoso, S.Farm',
    perawat_pengantar: 'Ns. Dewi Lestari, S.Kep'
  }
];

// =========================================================================
// 6. INITIAL DEFECTA & PO MOCK
// =========================================================================
export const INITIAL_DEFECTA_MOCK: DefectaItem[] = [
  {
    kode_obat: 'MED-015',
    nama_obat: 'Salbutamol 4 mg Tablet',
    stok_tersisa: 60,
    stok_minimum: 150,
    jumlah_reorder_disarankan: 1000,
    satuan: 'Tablet (10 Box)',
    harga_estimasi_satuan: 150,
    subtotal: 150000,
    distributor_rekomendasi: 'PT Mensa Bina Sukses',
    alasan: 'Stok Kritis (< Min)'
  },
  {
    kode_obat: 'MED-008',
    nama_obat: 'Morphine HCl 10 mg/mL Injeksi',
    stok_tersisa: 100,
    stok_minimum: 30,
    jumlah_reorder_disarankan: 50,
    satuan: 'Ampul (5 Box)',
    harga_estimasi_satuan: 22000,
    subtotal: 1100000,
    distributor_rekomendasi: 'PT Kimia Farma (PBF Khusus Narkotika)',
    alasan: 'Konsumsi Tinggi'
  }
];

export const INITIAL_PO_MOCK: PurchaseOrderDefecta[] = [
  {
    id: 'PO-2026-081',
    no_po: 'PO-RS-26-0881',
    tanggal_order: '2026-08-25',
    distributor_pbf: 'PT Mensa Bina Sukses',
    alamat_pbf: 'Jl. Pemuda No. 88, Jakarta Timur',
    telepon_pbf: '(021) 489-1234',
    jenis_sp: 'SP Reguler',
    items: [
      { kode_obat: 'MED-015', nama_obat: 'Salbutamol 4 mg Tablet (Box 100)', jumlah_order: 10, satuan: 'Box', harga_satuan: 15000, subtotal: 150000 },
      { kode_obat: 'MED-004', nama_obat: 'Metformin HCl 500 mg (Box 100)', jumlah_order: 20, satuan: 'Box', harga_satuan: 20000, subtotal: 400000 }
    ],
    total_nilai_po: 550000,
    status: 'Disetujui Ka. Instalasi',
    petugas_pembuat: 'Apt. Budi Santoso, S.Farm',
    apoteker_penanggung_jawab: 'Apt. Dimas Alifia, S.Farm., M.Clin.Pharm',
    sipa_apoteker: 'SIPA.19940826/SIPA-RS/2023'
  }
];

// =========================================================================
// 7. INITIAL SIPNAP REGISTER LOG (NARKOTIKA & PSIKOTROPIKA KEMENKES)
// =========================================================================
export const INITIAL_SIPNAP_LOGS: SipnapLogItem[] = [
  {
    id: 'SIP-2026-001',
    tanggal: '2026-08-24',
    kode_obat: 'MED-008',
    nama_obat: 'Morphine HCl 10 mg/mL Injeksi Ampul',
    golongan: 'Narkotika',
    bentuk_sediaan: 'Ampul Injeksi 1 mL',
    kekuatan: '10 mg/mL',
    satuan: 'Ampul',
    no_batch: 'MOR-KF-2601',
    jenis_transaksi: 'Pengeluaran Resep Pasien',
    no_dokumen: 'RSP-OK-0792',
    nama_pihak_terkait: 'Tn. Ridwan Fauzi',
    no_rm_atau_sipa: 'RM-260800-0112',
    dokter_penulis: 'dr. Indra Gunawan, Sp.An-TI',
    alamat_pasien: 'Jl. Merak No. 14, Jakarta',
    stok_awal: 102,
    jumlah_masuk: 0,
    jumlah_keluar: 2,
    stok_akhir: 100,
    petugas_apoteker: 'Apt. Sarah Larasati, S.Farm'
  },
  {
    id: 'SIP-2026-002',
    tanggal: '2026-08-25',
    kode_obat: 'MED-010',
    nama_obat: 'Diazepam 5 mg Tablet',
    golongan: 'Psikotropika',
    bentuk_sediaan: 'Tablet',
    kekuatan: '5 mg',
    satuan: 'Tablet',
    no_batch: 'DIA-2603',
    jenis_transaksi: 'Pengeluaran Resep Pasien',
    no_dokumen: 'RSP-JIWA-0412',
    nama_pihak_terkait: 'Ny. Maya Salsabila',
    no_rm_atau_sipa: 'RM-260801-0442',
    dokter_penulis: 'dr. Hendra Kusuma, Sp.KJ',
    alamat_pasien: 'Jl. Melati IV No. 9, Jakarta',
    stok_awal: 470,
    jumlah_masuk: 0,
    jumlah_keluar: 10,
    stok_akhir: 460,
    petugas_apoteker: 'Apt. Budi Santoso, S.Farm'
  }
];

export const INITIAL_MEDICATIONS = MASTER_OBAT_FORMULARIUM;
export const INITIAL_PRESCRIPTIONS = INITIAL_PRESCRIPTIONS_MOCK;
export const INITIAL_RECONCILIATIONS = INITIAL_RECONCILIATION_MOCK;
export const INITIAL_RETURNS = INITIAL_RETUR_MOCK;
export const INITIAL_PURCHASE_ORDERS = INITIAL_PO_MOCK;
export const INITIAL_DEFECTA = INITIAL_DEFECTA_MOCK;

export const INITIAL_SIPNAP: import('./types').SIPNAPReport[] = [
  {
    id: 'SIPNAP-01',
    bulan: 'Agustus 2026',
    kode_obat: 'MED-008',
    nama_obat: 'Morphine HCl 10 mg / mL Inj',
    satuan: 'Ampul',
    stok_awal: 20,
    pemasukan_pbf: 0,
    pengeluaran_resep: 2,
    stok_akhir: 18,
    transaksi: [
      {
        tanggal: '2026-08-25',
        no_resep: 'RXP-NARK-001',
        nama_pasien: 'Tn. Ridwan Fauzi',
        no_rm: 'RM-260800-0112',
        dokter_penulis: 'dr. Indra Gunawan, Sp.An-TI',
        jumlah: 2,
        no_batch: 'MOR-KF-2601'
      }
    ]
  },
  {
    id: 'SIPNAP-02',
    bulan: 'Agustus 2026',
    kode_obat: 'MED-010',
    nama_obat: 'Diazepam 5 mg Tablet',
    satuan: 'Tablet',
    stok_awal: 500,
    pemasukan_pbf: 0,
    pengeluaran_resep: 10,
    stok_akhir: 490,
    transaksi: [
      {
        tanggal: '2026-08-25',
        no_resep: 'RXP-PSIKO-002',
        nama_pasien: 'Ny. Maya Salsabila',
        no_rm: 'RM-260801-0442',
        dokter_penulis: 'dr. Hendra Kusuma, Sp.KJ',
        jumlah: 10,
        no_batch: 'DIA-2603'
      }
    ]
  }
];

export const INITIAL_HIGH_ALERT: import('./types').HighAlertItem[] = [
  {
    id: 'HA-01',
    nama_obat: 'KCl 7.46% (Kalium Klorida Konsentrat Injeksi)',
    kategori_risiko: 'Elektrolit Konsentrat',
    lokasi_penyimpanan: 'Lemari Terkunci Farmasi (Dilarang disimpan di bangsal non-ICU)',
    stiker_label: 'HIGH ALERT - PEKAT HARUS DIENCERKAN',
    double_check_protocol: 'Verifikasi konsentrasi, pelarut (NaCl 0.9%), dan kecepatan infus pump oleh 2 perawat/apoteker.'
  },
  {
    id: 'HA-02',
    nama_obat: 'Morphine HCl 10 mg/mL Injeksi',
    kategori_risiko: 'Anestesi & Sedasi',
    lokasi_penyimpanan: 'Lemari Narkotika Kunci Ganda',
    stiker_label: 'HIGH ALERT - NARKOTIKA GOLONGAN II',
    double_check_protocol: 'Pencatatan buku SIPNAP, verifikasi No. RM, dosis titrasi, dan respirasi rate pasien.'
  },
  {
    id: 'HA-03',
    nama_obat: 'Insulin Glargine 100 IU/mL Pen',
    kategori_risiko: 'Agonis Adrenergik',
    lokasi_penyimpanan: 'Chiller Suhu 2 - 8°C (Kulkas Farmasi)',
    stiker_label: 'HIGH ALERT - OBAT DIABETES POTENSI HIPOGLIKEMIA',
    double_check_protocol: 'Pemeriksaan kadar GDS aktual pasien sebelum injeksi subkutan.'
  },
  {
    id: 'HA-04',
    nama_obat: 'Epinephrine (Adrenalin) 1 mg/mL Injeksi',
    kategori_risiko: 'Agonis Adrenergik',
    lokasi_penyimpanan: 'Troli Emergency IGD / ICU / Kamar Operasi (Kunci Disposable)',
    stiker_label: 'HIGH ALERT - OBAT RESUSITASI / SYOK ANAFILAKTIK',
    double_check_protocol: 'Double check dosis pengenceran 1:1.000 vs 1:10.000.'
  }
];
