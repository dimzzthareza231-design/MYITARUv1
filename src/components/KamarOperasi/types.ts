export interface PasienOperasiItem {
  id: number | string;
  nomor: string; // OP-2026-001
  no_rm: string;
  pasien: string;
  nama_pasien: string;
  nik?: string;
  umur: number;
  jenis_kelamin: 'L' | 'P';
  penjamin: string;
  sifat_operasi: 'Elektif' | 'Cito / Emergency';
  
  // Diagnosa & Tindakan
  diagnosa_pra_bedah: string;
  diagnosa_pasca_bedah?: string;
  tindakan: string;
  jenis?: string;
  kode_icd9: string;
  indikasi_operasi?: string;
  
  // Tim Bedah
  dokter: string;
  operator: string;
  spesialisasi_operator?: string;
  anastesi: string;
  tipe_anastesi: string;
  asisten_operator?: string;
  perawat_instrumen?: string;
  perawat_sirkuler?: string;
  penata_anestesi?: string;
  
  // Ruang & Jadwal
  ruang_ok: string;
  durasi: string;
  tanggal: string;
  waktu_mulai?: string;
  waktu_selesai?: string;
  
  // Status Alur Operasi
  status: 'Terjadwal' | 'Persiapan Pre-Op' | 'Sedang Operasi' | 'PACU / Recovery' | 'Selesai - Rawat Inap' | 'Dibatalkan';
  
  // Kondisi Medis & Pre-Op
  golongan_darah?: string;
  persiapan_darah?: string;
  puasa?: string;
  tanda_vital?: {
    td: string;
    nadi: string;
    suhu: string;
    rr: string;
    spo2: string;
    skala_nyeri?: number;
  };
  riwayat_alergi?: string;
  informed_consent?: 'Sudah Lengkap & TTD' | 'Belum TTD';
  
  // WHO Safety Checklist
  checklist_who?: {
    sign_in: {
      selesai: boolean;
      identitas_terkonfirmasi: boolean;
      lokasi_diberi_tanda: boolean;
      mesin_anestesi_lengkap: boolean;
      pulse_oximeter_terpasang: boolean;
      riwayat_alergi_diketahui: boolean;
      risiko_aspirasi_jalan_napas: boolean;
      risiko_perdarahan_terantisipasi: boolean;
      waktu?: string;
    };
    time_out: {
      selesai: boolean;
      seluruh_tim_memperkenalkan_diri: boolean;
      konfirmasi_pasien_prosedur_lokasi: boolean;
      antibiotik_profilaksis_60menit: boolean;
      antisipasi_kritis_operator: boolean;
      antisipasi_kritis_anestesi: boolean;
      sterilitas_alat_terkonfirmasi: boolean;
      imaging_ditampilkan: boolean;
      waktu?: string;
    };
    sign_out: {
      selesai: boolean;
      nama_tindakan_dicatat: boolean;
      jumlah_kasa_jarum_alat_lengkap: boolean;
      label_spesimen_pa_terverifikasi: boolean;
      masalah_peralatan_nihil: boolean;
      instruksi_pemulihan_pacu_lengkap: boolean;
      waktu?: string;
    };
  };
  
  // Laporan Operasi
  laporan_operasi?: {
    temuan_intra_operasi?: string;
    tahapan_prosedur?: string;
    perdarahan_cc?: number;
    jaringan_pa?: 'Ya (Dikirim ke Lab PA)' | 'Tidak Ada Jaringan';
    nama_spesimen_pa?: string;
    komplikasi?: string;
    implan_terpasang?: string;
    drain_terpasang?: string;
    instruksi_pasca_bedah?: string;
    aldrete_score?: {
      aktivitas: number;
      respirasi: number;
      sirkulasi: number;
      kesadaran: number;
      warna_kulit: number;
      total: number;
    };
  };
}

export interface PaketOperasiItem {
  id: number | string;
  kode_paket?: string;
  nama_paket: string;
  kategori?: 'Bedah Khusus' | 'Bedah Mayor' | 'Bedah Sedang' | 'Bedah Minor' | 'Bedah Cito / Darurat';
  spesialisasi: string;
  kode_icd9?: string;
  jenis?: string;
  kelas?: string;
  estimasi_durasi: string;
  estimasi_biaya?: string;
  biaya_nominal?: number;
  jasa_operator: number;
  jasa_anastesi?: number;
  jasa_anestesi?: number;
  sewa_ok: number;
  bmhp_est?: number;
  bmhp_standar?: number;
  jasa_perawat_ok?: number;
  kamar_perawatan?: number;
  total_tarif?: number;
  tarif_ina_cbgs?: number;
  status?: 'Tersedia' | 'Nonaktif';
  status_aktif?: boolean;
  deskripsi?: string;
  keterangan?: string;
  termasuk_items?: string[];
  komponen?: string[];
}

export interface ObatBMHPOperasiItem {
  id: number | string;
  kode: string;
  nama: string;
  kategori: string;
  satuan: string;
  stok?: number;
  stok_tersedia?: number;
  minimum_stok?: number;
  stok_minimum?: number;
  harga?: number;
  harga_satuan?: number;
  batch_no?: string;
  no_batch?: string;
  expired_date: string;
  status_steril?: string;
  status_kadaluarsa?: string;
  lokasi?: string;
  lokasi_rak?: string;
  keterangan?: string;
}

export interface RuangOKStatus {
  id: number | string;
  nama: string;
  spesialisasi: string;
  status: 'Tersedia' | 'Sedang Digunakan' | 'Sedang Sterilisasi' | 'Maintenance';
  pasien_saat_ini?: string;
  tindakan_saat_ini?: string;
  operator_saat_ini?: string;
  estimasi_selesai?: string;
}
