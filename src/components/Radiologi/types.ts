export type ModalitasType = 'X-Ray' | 'CT-Scan' | 'MRI' | 'USG' | 'Panoramic' | 'Mammografi' | 'Fluoroskopi';

export type StatusPemeriksaan = 
  | 'Menunggu Antrian' 
  | 'Persiapan & Screening'
  | 'Sedang Pemeriksaan' 
  | 'Menunggu Ekspertise' 
  | 'Selesai & Tervalidasi'
  | 'Dibatalkan';

export type PrioritasType = 'Cito / Emergency' | 'Rutin / Elektif';

export interface RadiologiItem {
  id: string; // e.g. RAD-2026-08-001
  no_order: string;
  no_rm: string;
  nama_pasien: string;
  nik?: string;
  umur: number;
  jenis_kelamin: 'L' | 'P';
  penjamin: string;
  
  // Asal Permintaan
  unit_asal: string; // IGD, Poli Paru, Poli Penyakit Dalam, Bangsal Aster, ICU, etc.
  dokter_pengirim: string;
  indikasi_klinis: string;
  diagnosa_kerja: string;
  prioritas: PrioritasType;
  
  // Detail Pemeriksaan
  modalitas: ModalitasType;
  nama_pemeriksaan: string;
  posisi_proyeksi: string; // AP / PA / Lateral / Oblique / Axial / Sagittal / Coronal
  kode_icd9: string;
  ruang_pemeriksaan: string; // Ruang X-Ray 1, CT-Scan 128 Slices, MRI 1.5 Tesla, Ruang USG 2, dll.
  
  // Waktu & Alur
  tanggal_order: string;
  waktu_order: string;
  tanggal_pemeriksaan?: string;
  waktu_mulai_scan?: string;
  waktu_selesai_scan?: string;
  status: StatusPemeriksaan;
  
  // Screening Keamanan
  screening: {
    alergi_kontras: boolean;
    penggunaan_kontras: boolean;
    jenis_kontras?: string;
    dosis_kontras_ml?: number;
    kreatinin_serum?: number; // mg/dL
    egfr?: number; // mL/min/1.73m2
    implan_logam_pacemaker?: boolean;
    status_hamil?: boolean;
    puasa_persiapan?: boolean;
    catatan_screening?: string;
  };
  
  // Petugas
  radiografer?: string;
  dokter_radiolog?: string;
  
  // Data PACS / Studi Citra
  study_instance_uid?: string;
  series_count?: number;
  image_count?: number;
  sample_image_url?: string;
  study_type_key?: 'thorax' | 'brain_ct' | 'lumbar_mri' | 'usg_abdomen' | 'genu_xray' | 'dental_pano';
  
  // Ekspertise & Hasil
  laporan_ekspertise?: {
    teknik_pemeriksaan: string;
    deskripsi_temuan: string;
    kesimpulan_kesan: string;
    saran_tindakan: string;
    critical_finding: boolean;
    tanggal_ekspertise: string;
    waktu_ekspertise: string;
    status_validasi: 'Draft' | 'Final / Tervalidasi';
    qr_verifikasi_code: string;
    ai_suggestion?: {
      summary: string;
      confidence: number;
      findings_detected: string[];
    };
  };
  
  // Dosis Radiasi
  dosis_radiasi?: {
    kvp?: number;
    ma?: number;
    mas?: number;
    dap_cgy_cm2?: number;
    ctdivol_mgy?: number;
    dlp_mgy_cm?: number;
  };
}

export interface TarifRadiologiItem {
  id: string | number;
  kode_tarif: string;
  nama_tindakan: string;
  modalitas: ModalitasType;
  kode_icd9: string;
  kategori: 'Sederhana' | 'Sedang' | 'Canggih' | 'Khusus dengan Kontras';
  jasa_radiolog: number;
  jasa_radiografer: number;
  sewa_alat: number;
  bmhp_film_media: number;
  kontras_injektor?: number;
  total_tarif: number;
  plafon_bpjs_inacbg: number;
  estimasi_waktu_menit: number;
  persiapan_khusus?: string;
}

export interface MesinRadiologiStatus {
  id: string;
  nama_alat: string;
  modalitas: ModalitasType;
  ruangan: string;
  merk_tipe: string;
  status: 'Operasional / Siap' | 'Sedang Scanning' | 'Kalibrasi / Maintenance' | 'Off / Standby';
  pasien_saat_ini?: string;
  uji_kesesuaian_bapeten: string;
  masa_berlaku_izin: string;
  total_pasien_hari_ini: number;
}
