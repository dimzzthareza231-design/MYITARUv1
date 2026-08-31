export type Role = 'Super Admin' | 'Admin' | 'Dokter' | 'Perawat' | 'Staf Registrasi' | 'Kasir' | 'Farmasi' | 'Laboratorium' | 'Radiologi';

export interface User {
  id: string;
  name: string;
  nama?: string;
  role: Role;
  avatar?: string;
  spesialisasi?: string;
}

export interface Pasien {
  id: string;
  no_rm: string;
  nik: string;
  nama: string;
  tanggal_lahir?: string;
  tgl_lahir?: string;
  jenis_kelamin: 'L' | 'P' | string;
  alamat?: string;
  telepon?: string;
  no_hp?: string;
  golongan_darah?: string;
  penjamin?: string;
  status?: string;
  keluhan_utama?: string;
  diagnosa_primer?: string;
  alergi?: any;
  tanda_vital?: any;
  resume_medis?: any;
  soap?: any;
}

export interface PasienKeluarga {
  id: string;
  pasien_id: string;
  nama: string;
  hubungan: string;
  telepon: string;
}

export interface MasterPenjamin {
  id: string;
  nama: string;
  tipe: 'BPJS' | 'Asuransi' | 'Umum' | 'Perusahaan';
}

export interface MasterPoli {
  id: string;
  nama: string;
  kode: string;
  kapasitas: number;
  kategori?: 'Spesialis Utama' | 'Subspesialis' | 'Penunjang & Khusus' | 'Umum & Kegawatdaruratan' | string;
  icon?: string;
  deskripsi?: string;
}

export interface MasterDokter {
  id: string;
  nama: string;
  nip?: string;
  sip?: string;
  str?: string;
  spesialisasi: string;
  subspesialis?: string;
  poli_id: string;
  poli_nama?: string;
  penempatan?: string;
  jadwal?: string;
  hari?: string;
  jam?: string;
  shift?: string;
  ruangan?: string;
  kuota?: number;
  pasien_terlayani?: number;
  status_jaga?: string;
  kontak?: string;
  email?: string;
  status?: string;
}

export type Dokter = MasterDokter;

export interface MasterPerawat {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  unit: string;
  shift: string;
  status: string;
}

export interface Kunjungan {
  id: string;
  pasien_id: string;
  tanggal: string;
  poli_id: string;
  dokter_id: string;
  penjamin_id: string;
  status: 'Menunggu' | 'Diperiksa' | 'Panggil' | 'Farmasi' | 'Kasir' | 'Selesai' | 'Batal';
  tipe: 'Rawat Jalan' | 'IGD' | 'Rawat Inap' | string;
  nomor_antrian: string;
  keluhan_utama?: string;
}

export interface BantuanArtikel {
  id: string;
  kategori: string;
  judul: string;
  konten: string;
  tags: string[];
}
