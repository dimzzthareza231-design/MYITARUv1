export interface HospitalInfo {
  name: string;
  subname?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  accreditation?: string;
  licenseNumber?: string;
  kodeRs?: string;
  kodePpk?: string;
  directorName?: string;
  directorNip?: string;
  hospitalType?: string;
  ownership?: string;
  emergencyHotline?: string;
  faxNumber?: string;
}

export const DEFAULT_HOSPITAL_INFO: HospitalInfo = {
  name: 'TARUMANAGARA HOSPITAL',
  subname: 'RUMAH SAKIT UMUM PENDIDIKAN TARUMANAGARA',
  address: 'Jl. TB Simatupang, & Jl. Raya Cilandak KKO No.1, RT.1/RW.5, Ragunan, Ps. Minggu, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12550',
  city: 'Jakarta Selatan',
  phone: '(021) 56958723',
  email: 'marketing@institut.tarumanagara.ac.id',
  website: 'itaru.ac.id',
  accreditation: 'TERAKREDITASI PARIPURNA (KARS KEMENKES RI)',
  licenseNumber: 'No. Izin Operasional: 445/1029/DINKES/2024',
  kodeRs: '3171890',
  kodePpk: '0115R001',
  directorName: 'dr. H. Hendra, MARS, Sp.PK',
  directorNip: '197508122002121001',
  hospitalType: 'Rumah Sakit Umum (Kelas B Pendidikan)',
  ownership: 'Yayasan Tarumanagara',
  emergencyHotline: '(021) 56958999 (IGD 24 Jam)',
  faxNumber: '(021) 56958724'
};

export type DocumentType = 
  | 'resume_medis'
  | 'surat_keterangan_sakit'
  | 'surat_keterangan_sehat'
  | 'surat_rujukan'
  | 'hasil_laboratorium'
  | 'hasil_radiologi'
  | 'kuitansi_billing'
  | 'resep_obat'
  | 'profil_sdm'
  | 'laporan_insiden'
  | 'kartu_pasien'
  | 'sep_bpjs'
  | 'dokumen_umum';

export interface PatientSubjectData {
  nama: string;
  no_rm?: string;
  nip?: string;
  nik?: string;
  tempat_lahir?: string;
  tgl_lahir?: string;
  umur?: string | number;
  jenis_kelamin?: 'L' | 'P' | 'Laki-laki' | 'Perempuan' | string;
  golongan_darah?: string;
  status_pernikahan?: string;
  agama?: string;
  pendidikan?: string;
  pekerjaan?: string;
  alamat?: string;
  alamat_ktp?: string;
  alamat_domisili?: string;
  telepon?: string;
  no_hp?: string;
  kontak_darurat?: {
    nama: string;
    hubungan: string;
    telepon: string;
  } | string;
  penjamin?: string;
  no_kartu_bpjs?: string;
  no_sep?: string;
  unit_pelayanan?: string;
  poli?: string;
  dokter_dpjp?: string;
  dokter_pengirim?: string;
  tgl_periksa?: string;
  tgl_masuk?: string;
  tgl_keluar?: string;
  jam_masuk?: string;
  jam_keluar?: string;
  tipe_kunjungan?: string;
  ruangan?: string;
  kelas_rawat?: string;
  no_bed?: string;
  jabatan?: string;
  divisi?: string;
}

export interface TableItemRow {
  no?: number | string;
  nama: string;
  sediaan?: string;
  dosis_aturan?: string;
  rute?: string;
  durasi?: string;
  jumlah?: string | number;
  indikasi?: string;
  keterangan?: string;
  hasil?: string;
  nilai_rujukan?: string;
  satuan?: string;
  flag?: 'Normal' | 'High' | 'Low' | 'Abnormal' | 'Critical';
  metode?: string;
  tarif?: number;
  subtotal?: number;
}

export interface SignerInfo {
  nama: string;
  gelar?: string;
  jabatan?: string;
  sip_nip?: string;
  kota?: string;
  tanggal?: string;
  digitalValidationCode?: string;
  qrData?: string;
}

export interface AllergyItem {
  tipe: string; // Obat, Makanan, Udara, Lingkungan
  alergen: string;
  reaksi: string;
  derajat?: 'Ringan' | 'Sedang' | 'Berat / Anafilaktik';
}

export interface PhysicalExamSystemic {
  kepalaLeher?: string;
  mata?: string;
  tht?: string;
  thoraxCor?: string;
  thoraxPulmo?: string;
  abdomen?: string;
  ekstremitas?: string;
  neurologis?: string;
  statusLokalis?: string;
  statusDermatologis?: string;
}

export interface HospitalDocumentModel {
  id?: string;
  type: DocumentType;
  nomorDokumen: string;
  judulDokumen: string;
  subJudul?: string;
  hospitalInfo?: HospitalInfo;
  subject: PatientSubjectData;
  
  // Riwayat & Peringatan Medis
  riwayatAlergi?: AllergyItem[] | string;
  riwayatPenyakitDahulu?: string;
  riwayatPenyakitKeluarga?: string;
  riwayatPengobatanRutin?: string;

  // Anamnesis Terstruktur (Subjektif)
  anamnesis?: string;
  keluhanUtama?: string;
  riwayatPenyakitSekarang?: string;
  tinjauanSistem?: string;

  // Pemeriksaan Fisik Terstruktur (Objektif)
  pemeriksaanFisik?: {
    tandaVital?: {
      tekananDarah?: string;
      nadi?: string;
      suhu?: string;
      rr?: string;
      spo2?: string;
      bb?: string;
      tb?: string;
      imt?: string;
      kategoriImt?: string;
      lingkarPerut?: string;
      kesadaran?: string;
      gcs?: string;
      skalaNyeri?: string;
      lokasiNyeri?: string;
    };
    catatanFisik?: string;
    pemeriksaanSistemik?: PhysicalExamSystemic;
  };

  // Pemeriksaan Penunjang (Laboratorium, Radiologi, EKG)
  hasilPemeriksaanLab?: TableItemRow[];
  hasilRadiologi?: Array<{
    jenis: string;
    tanggal?: string;
    ekspertise: string;
    kesimpulan: string;
    dokterRadiologi?: string;
  }>;
  hasilEkg?: string;

  // Diagnosis (Assessment)
  diagnosisUtama?: {
    kode?: string;
    nama: string;
    deskripsi?: string;
  };
  diagnosisSekunder?: Array<{
    kode?: string;
    nama: string;
  }>;
  diagnosisBanding?: string[];

  // Tata Laksana & Terapi (Plan)
  tindakanMedis?: Array<{
    kode?: string;
    nama: string;
    keterangan?: string;
  }>;
  terapiObat?: TableItemRow[];
  terapiNonFarmakologi?: string;
  dietNutrisi?: string;

  // Edukasi, Evaluasi & Prognosis
  edukasiInstruksi?: string;
  rencanaKontrol?: string;
  prognosis?: {
    vitam?: string;
    functionam?: string;
    sanationam?: string;
  };
  kondisiPulang?: string;
  catatanKhusus?: string;

  itemBilling?: TableItemRow[];
  keteranganTambahan?: Record<string, any>;
  signer: SignerInfo;
  rawRecord?: Record<string, any>;
}
