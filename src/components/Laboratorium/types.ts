export type StatusLabOrder = 
  | 'Order Masuk'
  | 'Sampling / Pengambilan'
  | 'Diterima di Lab'
  | 'Sedang Dianalisis'
  | 'Menunggu Validasi'
  | 'Selesai & Tervalidasi'
  | 'Batal';

export type PrioritasLab = 'Rutin' | 'Cito / Emergency' | 'Stat';

export type KategoriLab = 
  | 'Hematologi'
  | 'Kimia Klinik'
  | 'Elektrolit & Gas Darah'
  | 'Urinalisis & Feses'
  | 'Imunoserologi & Infeksi'
  | 'Imunoserologi'
  | 'Mikrobiologi'
  | 'Penanda Tumor'
  | 'Toksikologi & Narkoba'
  | 'Koagulasi'
  | string;

export type FlagHasil = 'N' | 'H' | 'L' | 'HH' | 'LL' | 'P' | 'NEG' | 'Normal' | 'Abnormal' | string;

export type TipeWadahSampel = 
  | 'Tabung EDTA (Ungu)'
  | 'Tabung Serum Gel (Kuning)'
  | 'Tabung Plain (Merah)'
  | 'Tabung Citrate (Biru)'
  | 'Tabung Heparin (Hijau)'
  | 'Tabung Fluoride (Abu-abu)'
  | 'Pot Urine Steril'
  | 'Pot Feses'
  | 'Botol Kultur Darah'
  | string;

export interface LabParameterResult {
  id: string;
  test_code: string;
  parameter_name: string;
  hasil: string | number;
  nilai_rujukan: string;
  satuan: string;
  flag: FlagHasil;
  is_critical: boolean;
  metode_pemeriksaan?: string;
  catatan?: string;
}

export interface TestItemOrdered {
  kode: string;
  nama_pemeriksaan: string;
  kategori: KategoriLab;
  biaya: number;
  wadah_sampel: TipeWadahSampel;
  loinc_code: string;
}

export interface LabOrder {
  id: string; // No. Lab: LAB-260826-0001
  no_order_rs: string;
  no_rm: string;
  nama_pasien: string;
  nik: string;
  jenis_kelamin: 'L' | 'P';
  tanggal_lahir: string;
  umur: string;
  ruangan_asal: string;
  jenis_pelayanan: 'Rawat Jalan' | 'Rawat Inap' | 'IGD' | 'MCU';
  penjamin: string;
  dokter_pengirim: string;
  tanggal_order: string;
  waktu_order: string;
  prioritas: PrioritasLab;
  diagnosa_klinis: string;
  catatan_klinis?: string;
  status: StatusLabOrder;
  sampling_info?: {
    waktu_sampling: string;
    petugas_phlebotomist: string;
    lokasi_pengambilan: string;
    kondisi_sampel: 'Baik / Homogen' | 'Hemolisis Ringan' | 'Lipemik' | 'Ikterik' | 'Beku' | string;
    volume_cukup: boolean;
    wadah_tabung: string[];
    barcode_specimen: string;
  };
  waktu_terima_lab?: string;
  analis_pemeriksa?: string;
  petugas_analis?: string;
  alat_analyzer?: string;
  catatan_analis?: string;
  waktu_selesai_analisis?: string;
  dokter_sp_pk?: string;
  waktu_validasi?: string;
  status_validasi?: 'Draft' | 'Final / Tervalidasi' | string;
  qr_verifikasi_code?: string;
  tests_ordered: TestItemOrdered[];
  total_biaya: number;
  parameter_results: LabParameterResult[];
  interpretasi_sp_pk?: string;
  saran_klinis?: string;
  critical_finding?: {
    is_critical: boolean;
    is_reported: boolean;
    reported_at?: string;
    reported_by?: string;
    received_by?: string;
    room?: string;
    method: 'Telepon / SBAR' | 'Direct System Alert' | 'WA Gateway' | string;
    notes?: string;
  };
  ai_pathology_analysis?: {
    clinical_summary: string;
    key_findings: string[];
    differential_considerations: string[];
    recommended_follow_up: string[];
    confidence_score: number;
  } | string;
}

export interface LabCatalogTest {
  kode: string;
  loinc_code: string;
  nama_pemeriksaan: string;
  kategori: KategoriLab;
  spesimen: string;
  wadah: TipeWadahSampel;
  volume_min?: string;
  volume_minimal?: string;
  metode: string;
  hari_kerja?: string;
  waktu_selesai_menit?: number;
  tat_rutin?: string;
  tat_cito?: string;
  tarif_umum: number;
  tarif_bpjs: number;
  puasa_info?: string;
  persiapan_pasien?: string;
  nilai_rujukan_dewasa_l?: string;
  nilai_rujukan_dewasa_p?: string;
  nilai_rujukan_anak?: string;
  satuan?: string;
  default_parameters?: {
    param_code: string;
    param_name: string;
    satuan: string;
    ref_male: string;
    ref_female: string;
    ref_child: string;
    metode: string;
    critical_low?: number;
    critical_high?: number;
  }[];
  parameter_detail?: {
    nama: string;
    satuan: string;
    nilai_rujukan: string;
    nilai_kritis?: string;
  }[];
}

export interface AnalyzerMachine {
  id: string;
  nama_alat: string;
  merk: string;
  modalitas: string;
  serial_number: string;
  ruangan: string;
  model?: string;
  tipe?: string;
  status: 'Operasional / Siap' | 'Sedang Running Sample' | 'Perlu Kalibrasi' | 'Maintenance' | 'Online / Running' | 'Standby / Siap' | string;
  koneksi_lis: 'Connected (HL7/ASTM)' | 'Connecting' | 'Offline' | string;
  status_qc_hari_ini?: 'Passed (Westgard In-Control)' | 'Warning (1-2s)' | 'Failed (Out-of-Control)' | string;
  qc_status?: 'Passed' | 'Warning' | 'Failed' | string;
  total_sampel_hari_ini?: number;
  suhu_reagen_chiller?: string;
  lot_reagen_aktif?: string;
  exp_reagen?: string;
  last_maintenance?: string;
  last_qc?: string;
  reagen_persen?: number;
  waste_persen?: number;
}

export interface LeveyJenningsPoint {
  run?: number;
  date: string;
  value: number;
  mean: number;
  sd?: number;
  sd1_plus?: number;
  sd2_plus?: number;
  sd3_plus?: number;
  sd1_minus?: number;
  sd2_minus?: number;
  sd3_minus?: number;
  rule_violation?: string;
  status?: 'In-Control' | 'Warning' | 'Failed' | string;
  status_westgard?: 'In-Control' | '1-2s Warning' | '1-3s Violation' | '2-2s Violation' | 'R-4s Violation' | '10x Shift' | string;
}

export interface BloodBankStock {
  id: string;
  no_kantong: string;
  golongan_darah: 'A' | 'B' | 'AB' | 'O' | string;
  rhesus: '+' | '-' | string;
  jenis_komponen?: 'Packed Red Cells (PRC)' | 'Whole Blood (WB)' | 'Thrombocyte Concentrate (TC)' | 'Fresh Frozen Plasma (FFP)' | 'Cryoprecipitate' | string;
  komponen?: string;
  volume_ml?: number;
  tanggal_sadap?: string;
  tanggal_exp?: string;
  tanggal_expired?: string;
  asal_darah?: 'PMI Kota Bandung' | 'PMI Prov. Jabar' | 'BDRS Internal Donor' | string;
  asal_pmi?: string;
  status: 'Tersedia' | 'Crossmatched (Reservasi)' | 'Ditransfusikan' | 'Kedaluwarsa / Rusak' | string;
  suhu_penyimpanan?: string;
  lokasi_chiller?: string;
  lokasi_simpan?: string;
}

export interface CrossmatchOrder {
  id: string;
  no_permintaan_bdrs?: string;
  no_rm: string;
  nama_pasien?: string;
  pasien_nama?: string;
  ruangan: string;
  golongan_darah_pasien?: 'A' | 'B' | 'AB' | 'O' | string;
  golongan_darah?: 'A' | 'B' | 'AB' | 'O' | string;
  rhesus_pasien?: '+' | '-' | string;
  rhesus?: '+' | '-' | string;
  komponen: string;
  jumlah_kantong: number;
  diagnosa?: string;
  indikasi?: string;
  hb_terkini?: number;
  target_hb?: number;
  reaksi_mayor?: string;
  reaksi_minor?: string;
  hasil_mayor?: string;
  hasil_minor?: string;
  autokontrol?: string;
  hasil_autokontrol?: string;
  kesimpulan?: string;
  status_hasil?: string;
  status?: string;
  petugas_bdrs?: string;
  petugas_uji?: string;
  tanggal_uji?: string;
  waktu_order?: string;
  no_kantong_darah?: string;
}
