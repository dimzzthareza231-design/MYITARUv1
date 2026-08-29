export interface Pegawai {
  id: string;
  nik: string;
  namaLengkap: string;   // Sudah termasuk gelar lengkap
  gelar: string;
  jabatan: string;
  departemen: string;
  pendidikan: string;
  noHp: string;
  email: string;
  tanggalMasuk: string;
  status: 'Aktif' | 'Cuti' | 'Non-Aktif';
}

export const DATA_PEGAWAI: Pegawai[] = [
  {
    id: 'PGW-001',
    nik: '3201123456789001',
    namaLengkap: 'Hj. Siti Aminah, S.Kep., Ns., M.Kep.',
    gelar: 'S.Kep., Ns., M.Kep.',
    jabatan: 'Kepala Ruangan Rawat Inap',
    departemen: 'Keperawatan',
    pendidikan: 'S2 Keperawatan',
    noHp: '081234567890',
    email: 'siti.aminah@myitaru.klinik',
    tanggalMasuk: '2015-03-10',
    status: 'Aktif'
  },
  {
    id: 'PGW-002',
    nik: '3201123456789002',
    namaLengkap: 'Budi Hartono, S.Kep., Ns.',
    gelar: 'S.Kep., Ns.',
    jabatan: 'Perawat Pelaksana IGD',
    departemen: 'Keperawatan',
    pendidikan: 'S1 Keperawatan + Profesi Ners',
    noHp: '081234567891',
    email: 'budi.hartono@myitaru.klinik',
    tanggalMasuk: '2018-06-15',
    status: 'Aktif'
  },
  {
    id: 'PGW-003',
    nik: '3201123456789003',
    namaLengkap: 'Dewi Lestari, S.Farm., Apt.',
    gelar: 'S.Farm., Apt.',
    jabatan: 'Apoteker Penanggung Jawab',
    departemen: 'Farmasi',
    pendidikan: 'S1 Farmasi + Profesi Apoteker',
    noHp: '081234567892',
    email: 'dewi.lestari@myitaru.klinik',
    tanggalMasuk: '2017-01-20',
    status: 'Aktif'
  },
  {
    id: 'PGW-004',
    nik: '3201123456789004',
    namaLengkap: 'Rina Marlina, A.Md.Farm.',
    gelar: 'A.Md.Farm.',
    jabatan: 'Asisten Apoteker',
    departemen: 'Farmasi',
    pendidikan: 'D3 Farmasi',
    noHp: '081234567893',
    email: 'rina.marlina@myitaru.klinik',
    tanggalMasuk: '2020-08-01',
    status: 'Aktif'
  },
  {
    id: 'PGW-005',
    nik: '3201123456789005',
    namaLengkap: 'Agus Prasetyo, A.Md.AK.',
    gelar: 'A.Md.AK.',
    jabatan: 'Analis Laboratorium',
    departemen: 'Laboratorium',
    pendidikan: 'D3 Analis Kesehatan',
    noHp: '081234567894',
    email: 'agus.prasetyo@myitaru.klinik',
    tanggalMasuk: '2019-04-12',
    status: 'Aktif'
  },
  {
    id: 'PGW-006',
    nik: '3201123456789006',
    namaLengkap: 'Fitri Handayani, S.Tr.Keb.',
    gelar: 'S.Tr.Keb.',
    jabatan: 'Bidan Pelaksana',
    departemen: 'Kebidanan',
    pendidikan: 'D4 Kebidanan',
    noHp: '081234567895',
    email: 'fitri.handayani@myitaru.klinik',
    tanggalMasuk: '2018-09-05',
    status: 'Aktif'
  },
  {
    id: 'PGW-007',
    nik: '3201123456789007',
    namaLengkap: 'Yuni Astuti, S.Gz.',
    gelar: 'S.Gz.',
    jabatan: 'Ahli Gizi',
    departemen: 'Gizi',
    pendidikan: 'S1 Gizi',
    noHp: '081234567896',
    email: 'yuni.astuti@myitaru.klinik',
    tanggalMasuk: '2019-11-20',
    status: 'Aktif'
  },
  {
    id: 'PGW-008',
    nik: '3201123456789008',
    namaLengkap: 'Hendra Wijaya, S.ST.FT.',
    gelar: 'S.ST.FT.',
    jabatan: 'Fisioterapis',
    departemen: 'Rehabilitasi Medik',
    pendidikan: 'D4 Fisioterapi',
    noHp: '081234567897',
    email: 'hendra.wijaya@myitaru.klinik',
    tanggalMasuk: '2021-02-14',
    status: 'Aktif'
  },
  {
    id: 'PGW-009',
    nik: '3201123456789009',
    namaLengkap: 'Ratna Sari, S.KM., M.M.',
    gelar: 'S.KM., M.M.',
    jabatan: 'Kepala Bagian Administrasi',
    departemen: 'Administrasi & Manajemen',
    pendidikan: 'S2 Manajemen',
    noHp: '081234567898',
    email: 'ratna.sari@myitaru.klinik',
    tanggalMasuk: '2014-07-01',
    status: 'Aktif'
  },
  {
    id: 'PGW-010',
    nik: '3201123456789010',
    namaLengkap: 'Joko Susilo, S.T.',
    gelar: 'S.T.',
    jabatan: 'Teknisi Elektromedik',
    departemen: 'Pemeliharaan Sarana',
    pendidikan: 'S1 Teknik Elektro',
    noHp: '081234567899',
    email: 'joko.susilo@myitaru.klinik',
    tanggalMasuk: '2019-05-30',
    status: 'Aktif'
  },
  {
    id: 'PGW-011',
    nik: '3201123456789011',
    namaLengkap: 'Lia Amelia, S.Kom.',
    gelar: 'S.Kom.',
    jabatan: 'Staf IT / Rekam Medis',
    departemen: 'IT & Rekam Medis',
    pendidikan: 'S1 Sistem Informasi',
    noHp: '081234567800',
    email: 'lia.amelia@myitaru.klinik',
    tanggalMasuk: '2022-01-10',
    status: 'Aktif'
  },
  {
    id: 'PGW-012',
    nik: '3201123456789012',
    namaLengkap: 'Maya Puspita, M.Psi., Psikolog',
    gelar: 'M.Psi., Psikolog',
    jabatan: 'Psikolog Klinis',
    departemen: 'Psikologi',
    pendidikan: 'S2 Psikologi Profesi',
    noHp: '081234567801',
    email: 'maya.puspita@myitaru.klinik',
    tanggalMasuk: '2020-10-18',
    status: 'Cuti'
  }
];
