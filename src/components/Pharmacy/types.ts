export type PrescriptionStatus = 
  | 'Menunggu Telaah'
  | 'Dalam Penyiapan'
  | 'Menunggu Penyerahan'
  | 'Selesai Terlayani'
  | 'Ditolak / Klarifikasi DPJP';

export type ServiceType = 'Rawat Jalan' | 'Rawat Inap' | 'IGD' | 'Kamar Operasi' | 'Hemodialisa';

export type InsuranceType = 'BPJS Kesehatan' | 'Umum / Pribadi' | 'Asuransi Swasta' | 'Perusahaan';

export type DrugCategory = 
  | 'Tablet / Kapsul'
  | 'Sirup / Suspensi'
  | 'Injeksi / Ampul / Vial'
  | 'Infus / Cairan Elektrolit'
  | 'Salep / Krim / Gel'
  | 'Tetes Mata / Telinga / Hidung'
  | 'Inhaler / Nebulizer'
  | 'Suppositoria / Enema'
  | 'Alkes & BMHP';

export type DrugClassification = 
  | 'Obat Bebas'
  | 'Obat Bebas Terbatas'
  | 'Obat Keras'
  | 'Psikotropika'
  | 'Narkotika'
  | 'Prekursor Farmasi'
  | 'Obat-Obat Tertentu (OOT)';

export type SpecialFlag = 'Standar' | 'High Alert' | 'LASA / NORUM' | 'Sitotoksika / B3' | 'Suhu Dingin (2-8°C)';

export interface BatchItem {
  no_batch: string;
  tanggal_expired: string;
  sisa_stok: number;
  asal_pbf: string;
  no_faktur: string;
  suhu_simpan?: string;
  status_karantina?: boolean;
}

export interface MedicationStock {
  id: string;
  kode_kfa: string;
  kode_bpjs_fornas?: string;
  nama_obat: string;
  nama_generik: string;
  bentuk_sediaan: string;
  kekuatan: string;
  satuan_terkecil: string;
  satuan_kemasan: string;
  rasio_kemasan: number;
  kategori: DrugCategory;
  golongan: DrugClassification;
  sifat_khusus: SpecialFlag;
  lokasi_depo: {
    depo_ralan: number;
    depo_ranap: number;
    gudang_utama: number;
    depo_igd: number;
    depo_ok: number;
  };
  stok_total: number;
  stok_minimum: number;
  stok_maksimum: number;
  harga_beli: number;
  harga_jual_umum: number;
  harga_jual_bpjs: number;
  batches: BatchItem[];
  status: 'Tersedia' | 'Stok Kritis' | 'Habis' | 'Mendekati Expired (< 3 Bln)' | 'Expired';
  pabrik_produsen: string;
  distributor_utama: string;
  restriksi_fornas?: string;
  catatan_klinis?: string;
}

export interface RacikanBahan {
  kode_obat: string;
  nama_obat: string;
  kekuatan: string;
  dosis_per_bungkus: string;
  jumlah_tablet_dibutuhkan: number;
  satuan: string;
  harga_satuan: number;
}

export interface RacikanDetail {
  nama_racikan: string;
  bentuk_racikan: 'Pulveres (Puyer)' | 'Kapsul' | 'Salep Campuran' | 'Sirup Kering';
  jumlah_kemasan: number;
  satuan_kemasan: string;
  signa: string;
  aturan_pakai: string;
  waktu_minum: string;
  petunjuk_khusus: string;
  komposisi: RacikanBahan[];
}

export interface PrescriptionItem {
  id: string;
  kode_obat: string;
  nama_obat: string;
  nama_generik?: string;
  bentuk_sediaan: string;
  kekuatan: string;
  dosis: string;
  frekuensi: string;
  aturan_pakai: string;
  waktu_minum?: string;
  jumlah: number;
  satuan: string;
  signa: string;
  rute_pemberian: string;
  catatan_khusus?: string;
  tipe_item: 'Non-Racikan' | 'Racikan';
  racikan_detail?: RacikanDetail;
  harga_satuan: number;
  total_harga: number;
  no_batch_terpakai?: string;
  is_high_alert?: boolean;
  is_lasa?: boolean;
}

export interface TelaahResep {
  administratif: {
    keabsahan_resep: boolean;
    identitas_pasien: boolean;
    identitas_dokter: boolean;
    paraf_dokter: boolean;
    tanggal_resep: boolean;
    ruangan_poli: boolean;
    catatan?: string;
  };
  farmasetik: {
    bentuk_sediaan: boolean;
    dosis_kekuatan: boolean;
    stabilitas_inkompatibilitas: boolean;
    aturan_pakai_rute: boolean;
    jumlah_obat: boolean;
    catatan?: string;
  };
  klinis: {
    ketepatan_indikasi: boolean;
    duplikasi_terapi: boolean;
    alergi_reaksi_silang: boolean;
    interaksi_obat: boolean;
    kontraindikasi: boolean;
    penyesuaian_dosis_organ: boolean;
    catatan?: string;
  };
  status_telaah: 'Lolos Telaah' | 'Perlu Klarifikasi DPJP' | 'Belum Ditelaah';
  apoteker_penelaah: string;
  waktu_telaah: string;
}

export interface AIDrugInteractionAlert {
  obat_1: string;
  obat_2: string;
  level: 'Mayor / Bahaya' | 'Moderat / Perhatian' | 'Minor / Ringan';
  deskripsi: string;
  rekomendasi: string;
}

export interface AIClinicalScreening {
  status_keamanan: 'Aman' | 'Peringatan Moderat' | 'Bahaya / Kontraindikasi';
  interaksi_terdeteksi: AIDrugInteractionAlert[];
  peringatan_alergi: string[];
  penyesuaian_dosis_gfr?: string;
  rekomendasi_fornas?: string[];
  ringkasan_ai?: string;
}

export interface DispensingInfo {
  petugas_peracik?: string;
  petugas_etiket?: string;
  petugas_double_check?: string;
  waktu_mulai_racik?: string;
  waktu_selesai_racik?: string;
  jenis_etiket_dicetak: Array<'Putih (Oral)' | 'Biru (Luar)' | 'Label Infus' | 'Etiket UDD'>;
  nomor_troli_ranap?: string;
  catatan_dispensing?: string;
}

export interface PenyerahanPIOInfo {
  petugas_penyerah: string;
  nama_penerima: string;
  hubungan_penerima: 'Pasien Sendiri' | 'Suami/Istri' | 'Orang Tua' | 'Anak' | 'Keluarga Lain' | 'Perawat Ruangan';
  no_hp_penerima?: string;
  verifikasi_5_benar: {
    benar_pasien: boolean;
    benar_obat: boolean;
    benar_dosis: boolean;
    benar_waktu: boolean;
    benar_rute: boolean;
  };
  konseling_diberikan: boolean;
  materi_konseling: string[];
  catatan_pio?: string;
  waktu_penyerahan: string;
  tanda_tangan_penerima?: string;
}

export interface PrescriptionOrder {
  id: string;
  no_resep: string;
  tanggal_resep: string;
  waktu_resep: string;
  kunjungan_id: string;
  no_rm: string;
  nama_pasien: string;
  umur: string;
  jenis_kelamin: 'L' | 'P';
  berat_badan_kg?: number;
  tinggi_badan_cm?: number;
  riwayat_alergi: string[];
  gfr_crcl?: number;
  kondisi_khusus?: string[]; // e.g. Hamil Trimester 1, Gangguan Ginjal CKD, Lansia
  dokter_penulis: string;
  sip_dokter: string;
  poli_ruangan: string;
  jenis_layanan: ServiceType;
  penjamin: InsuranceType;
  no_kartu_bpjs?: string;
  no_sep?: string;
  diagnosis_primer: string;
  kode_icd10: string;
  tipe_resep: 'Non-Racikan' | 'Racikan' | 'Kombinasi' | 'UDD (Unit Dose)';
  status: PrescriptionStatus;
  items: PrescriptionItem[];
  telaah_resep: TelaahResep;
  ai_clinical_check: AIClinicalScreening;
  dispensing: DispensingInfo;
  penyerahan_pio?: PenyerahanPIOInfo;
  total_biaya_obat: number;
  jasa_embalase: number;
  total_tagihan: number;
  iterasi?: string; // e.g. "Iter 1x", "Ne Iter"
  catatan_dokter?: string;
}

// UDD RANAP
export interface UDDScheduleItem {
  kode_obat: string;
  nama_obat: string;
  dosis: string;
  rute: string;
  keterangan: string;
  status_diberikan: 'Menunggu' | 'Diberikan' | 'Ditunda' | 'Ditolak Pasien';
  jam_pemberian_aktual?: string;
  perawat_pelaksana?: string;
}

export interface UDDSchedule {
  id: string;
  no_resep_ranap: string;
  no_rm: string;
  nama_pasien: string;
  kamar_bed: string;
  bangsal: string;
  tanggal: string;
  dpjp: string;
  pagi_07: UDDScheduleItem[];
  siang_12: UDDScheduleItem[];
  sore_18: UDDScheduleItem[];
  malam_22: UDDScheduleItem[];
  status_troli: 'Belum Disiapkan' | 'Troli Terisi & Diverifikasi' | 'Terkirim ke Bangsal' | 'Telah Diterima Perawat';
  petugas_farmasi_penyiap: string;
  perawat_penerima_bangsal?: string;
  catatan_khusus?: string;
}

// REKONSILIASI OBAT
export interface ReconciliationItem {
  nama_obat: string;
  dosis_frekuensi: string;
  aturan_minum: string;
  sumber_obat: 'Dari Rumah' | 'Puskesmas / Faskes Luar' | 'Klinik';
  status_kelanjutan: 'Lanjut Sesuai Dosis' | 'Stop / Ditunda' | 'Ganti Dosis / Substitusi DPJP';
  alasan_perubahan?: string;
}

export interface DrugReconciliation {
  id: string;
  no_rm: string;
  nama_pasien: string;
  tanggal_masuk: string;
  ruangan_ranap: string;
  dpjp: string;
  riwayat_alergi: string[];
  obat_dari_rumah: ReconciliationItem[];
  catatan_rekonsiliasi: string;
  apoteker_verifikator: string;
  waktu_rekonsiliasi: string;
}

// RETUR OBAT RANAP
export interface ReturObatItem {
  kode_obat: string;
  nama_obat: string;
  no_batch: string;
  jumlah_retur: number;
  satuan: string;
  harga_satuan: number;
  total_refund: number;
  kondisi_fisik: 'Baik (Dapat Dipakai Kembali)' | 'Rusak / Segel Terbuka';
}

export interface DrugReturn {
  id: string;
  no_retur: string;
  tanggal: string;
  no_rm: string;
  nama_pasien: string;
  ruangan: string;
  alasan_retur: 'Pasien Pulang / Selesai Rawat' | 'Ganti Terapi Dokter' | 'Pasien Meninggal' | 'Dosis Dibatalkan';
  items: ReturObatItem[];
  total_pengembalian: number;
  status: 'Menunggu Verifikasi' | 'Disetujui & Stok Dikembalikan' | 'Ditolak';
  petugas_farmasi: string;
  perawat_pengantar: string;
}

// DEFECTA & PO
export interface DefectaItem {
  kode_obat: string;
  nama_obat: string;
  stok_tersisa: number;
  stok_minimum: number;
  jumlah_reorder_disarankan: number;
  satuan: string;
  harga_estimasi_satuan: number;
  subtotal: number;
  distributor_rekomendasi: string;
  alasan: 'Stok Kritis (< Min)' | 'Konsumsi Tinggi' | 'Mendekati Habis';
}

export interface PurchaseOrderDefecta {
  id: string;
  no_po: string;
  tanggal_order: string;
  distributor_pbf: string;
  alamat_pbf: string;
  telepon_pbf: string;
  jenis_sp: 'SP Reguler' | 'SP Narkotika (Khusus)' | 'SP Psikotropika' | 'SP Prekursor';
  items: Array<{
    kode_obat: string;
    nama_obat: string;
    jumlah_order: number;
    satuan: string;
    harga_satuan: number;
    subtotal: number;
  }>;
  total_nilai_po: number;
  status: 'Draft SP' | 'Disetujui Ka. Instalasi' | 'Terkirim ke Distributor' | 'Diterima Sebagian' | 'Selesai Diterima';
  petugas_pembuat: string;
  apoteker_penanggung_jawab: string;
  sipa_apoteker: string;
}

// SIPNAP NARKOTIKA & PSIKOTROPIKA
export interface SipnapLogItem {
  id: string;
  tanggal: string;
  kode_obat: string;
  nama_obat: string;
  golongan: 'Narkotika' | 'Psikotropika' | 'Prekursor Farmasi';
  bentuk_sediaan: string;
  kekuatan: string;
  satuan: string;
  no_batch: string;
  jenis_transaksi: 'Penerimaan dari PBF' | 'Pengeluaran Resep Pasien' | 'Retur ke PBF' | 'Pemusnahan Obat Rusak';
  no_dokumen: string; // No Resep / No Faktur
  nama_pihak_terkait: string; // Nama Pasien / Nama PBF
  no_rm_atau_sipa?: string;
  dokter_penulis?: string;
  alamat_pasien?: string;
  stok_awal: number;
  jumlah_masuk: number;
  jumlah_keluar: number;
  stok_akhir: number;
  petugas_apoteker: string;
}

export interface SIPNAPReport {
  id: string;
  bulan: string;
  kode_obat: string;
  nama_obat: string;
  satuan: string;
  stok_awal: number;
  pemasukan_pbf: number;
  pengeluaran_resep: number;
  stok_akhir: number;
  transaksi: Array<{
    tanggal: string;
    no_resep: string;
    nama_pasien: string;
    no_rm: string;
    dokter_penulis: string;
    jumlah: number;
    no_batch: string;
  }>;
}

export interface HighAlertItem {
  id: string;
  nama_obat: string;
  kategori_risiko: 'Elektrolit Konsentrat' | 'Sitostatika / Kemoterapi' | 'Agonis Adrenergik' | 'Anestesi & Sedasi' | 'Antikoagulan';
  lokasi_penyimpanan: string;
  stiker_label: string;
  double_check_protocol: string;
}

// STOCK OPNAME
export interface StockOpnameItem {
  id: string;
  kode_obat: string;
  nama_obat: string;
  lokasi_depo: string;
  stok_sistem: number;
  stok_fisik: number;
  selisih: number;
  keterangan: string;
  petugas_auditor: string;
  tanggal_opname: string;
  status_approval: 'Draft' | 'Tervalidasi & Stok Disesuaikan';
}
