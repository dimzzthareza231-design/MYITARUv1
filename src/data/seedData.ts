import { storage } from '../utils/storage';
import {
  generateAllPatientsWithResumes,
  generate50IGDPatients,
  generate50InpatientBeds,
  generate50SurgeryPatients,
  generate50LabAndRadRequests
} from './patientPelayananData';

export interface PoliklinikItem {
  id: string;
  kode: string;
  nama: string;
  kategori: 'Spesialis Utama' | 'Subspesialis' | 'Penunjang & Khusus' | 'Umum & Kegawatdaruratan';
  icon: string;
  warna: string;
  deskripsi: string;
  kapasitas: number;
}

export interface Doctor {
  id: string;
  nip: string;
  sip?: string;
  str?: string;
  nama: string;
  spesialis: string;
  subspesialis?: string;
  poli: string;
  poli_id: string;
  penempatan: string;
  jabatan?: string;
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
  status: string;
}

export interface Nurse {
  id: string;
  nip: string;
  nama: string;
  jabatan: string;
  unit: string;
  shift: string;
  status: string;
}

export const MASTER_POLIKLINIK: PoliklinikItem[] = [
  // 1. Umum & Kegawatdaruratan
  {
    id: 'POL-01',
    kode: 'UMM',
    nama: 'Poli Umum',
    kategori: 'Umum & Kegawatdaruratan',
    icon: '🩺',
    warna: 'from-blue-500 to-cyan-600',
    deskripsi: 'Pelayanan kesehatan umum dasar, skrining penyakit, dan konsultasi kesehatan berkala.',
    kapasitas: 60
  },
  {
    id: 'POL-02',
    kode: 'IGD',
    nama: 'IGD (Gawat Darurat)',
    kategori: 'Umum & Kegawatdaruratan',
    icon: '🚑',
    warna: 'from-red-500 to-rose-600',
    deskripsi: 'Penanganan gawat darurat medis 24 jam dengan triase ATS & ESI.',
    kapasitas: 40
  },

  // 2. Spesialis Utama (Permintaan User)
  {
    id: 'POL-03',
    kode: 'OBG',
    nama: 'Poli Obgyn (Kebidanan & Kandungan)',
    kategori: 'Spesialis Utama',
    icon: '🤰',
    warna: 'from-pink-500 to-rose-600',
    deskripsi: 'Pemeriksaan kehamilan, USG 4D, persalinan, infertilitas, dan kesehatan reproduksi wanita.',
    kapasitas: 35
  },
  {
    id: 'POL-04',
    kode: 'ANK',
    nama: 'Poli Anak (Pediatri)',
    kategori: 'Spesialis Utama',
    icon: '👶',
    warna: 'from-amber-500 to-yellow-600',
    deskripsi: 'Pelayanan tumbuh kembang anak, imunisasi terpadu, dan penanganan penyakit pediatri.',
    kapasitas: 40
  },
  {
    id: 'POL-05',
    kode: 'BDH',
    nama: 'Poli Bedah Umum',
    kategori: 'Spesialis Utama',
    icon: '🔪',
    warna: 'from-indigo-500 to-purple-600',
    deskripsi: 'Konsultasi pra dan pasca operasi bedah digestif, hernia, apendisitis, dan bedah minor.',
    kapasitas: 30
  },
  {
    id: 'POL-06',
    kode: 'JNT',
    nama: 'Poli Jantung & Pembuluh Darah (Kardiologi)',
    kategori: 'Spesialis Utama',
    icon: '❤️',
    warna: 'from-red-600 to-pink-600',
    deskripsi: 'Pemeriksaan EKG, Echocardiography, Treadmill test, penanganan PJK, hipertensi & aritmia.',
    kapasitas: 25
  },
  {
    id: 'POL-07',
    kode: 'SRF',
    nama: 'Poli Saraf (Neurologi)',
    kategori: 'Spesialis Utama',
    icon: '🧠',
    warna: 'from-violet-500 to-purple-600',
    deskripsi: 'Penanganan pasca stroke, migrain, epilepsi, neuropati, tremor, dan gangguan neuromuskular.',
    kapasitas: 25
  },
  {
    id: 'POL-08',
    kode: 'MAT',
    nama: 'Poli Mata (Oftalmologi)',
    kategori: 'Spesialis Utama',
    icon: '👁️',
    warna: 'from-cyan-500 to-blue-600',
    deskripsi: 'Pemeriksaan refraksi, katarak, glaukoma, retinopati, dan bedah laser oftalmologi.',
    kapasitas: 30
  },
  {
    id: 'POL-09',
    kode: 'THT',
    nama: 'Poli THT-KL (Telinga, Hidung, Tenggorokan, Kepala, Leher)',
    kategori: 'Spesialis Utama',
    icon: '👂',
    warna: 'from-teal-500 to-emerald-600',
    deskripsi: 'Endoskopi THT, tes audiometri, sinus, polip hidung, dan gangguan tonsil/laring.',
    kapasitas: 30
  },
  {
    id: 'POL-10',
    kode: 'KLT',
    nama: 'Poli Kulit & Kelamin (Dermatovenerologi)',
    kategori: 'Spesialis Utama',
    icon: '✨',
    warna: 'from-amber-400 to-orange-500',
    deskripsi: 'Penanganan alergi kulit, psoriasis, infeksi kulit, jerawat/akne, dan penyakit menular seksual.',
    kapasitas: 30
  },
  {
    id: 'POL-11',
    kode: 'PRU',
    nama: 'Poli Paru (Pulmonologi)',
    kategori: 'Spesialis Utama',
    icon: '🫁',
    warna: 'from-sky-500 to-cyan-600',
    deskripsi: 'Spirometri, penanganan asma, PPOK, Tuberkulosis (DOTS), dan infeksi saluran pernapasan.',
    kapasitas: 30
  },
  {
    id: 'POL-12',
    kode: 'JWA',
    nama: 'Poli Jiwa / Psikiatri',
    kategori: 'Spesialis Utama',
    icon: '🧘',
    warna: 'from-purple-500 to-indigo-600',
    deskripsi: 'Konseling psikoterapi, penanganan depresi, kecemasan, skizofrenia, bipolar, dan adiksi.',
    kapasitas: 20
  },
  {
    id: 'POL-13',
    kode: 'URL',
    nama: 'Poli Urologi (Sistem Perkemihan & Ginjal)',
    kategori: 'Spesialis Utama',
    icon: '💧',
    warna: 'from-blue-600 to-teal-600',
    deskripsi: 'Batu saluran kemih (ESWL/URS), pembesaran prostat (BPH), infeksi ginjal dan kandung kemih.',
    kapasitas: 25
  },
  {
    id: 'POL-14',
    kode: 'ORT',
    nama: 'Poli Orthopedi (Tulang & Otot)',
    kategori: 'Spesialis Utama',
    icon: '🦴',
    warna: 'from-emerald-500 to-green-600',
    deskripsi: 'Penanganan cedera sendi/otot, fraktur tulang, osteoporosis, artroskopi, dan pergantian sendi.',
    kapasitas: 25
  },
  {
    id: 'POL-15',
    kode: 'GIG',
    nama: 'Poli Gigi Spesialis (Bedah Mulut, Konservasi, Ortodonsia)',
    kategori: 'Spesialis Utama',
    icon: '🦷',
    warna: 'from-teal-500 to-cyan-600',
    deskripsi: 'Pencabutan impaksi (odontektomi), perawatan saluran akar, pasang behel, dan restorasi estetika.',
    kapasitas: 25
  },
  {
    id: 'POL-16',
    kode: 'PDL',
    nama: 'Poli Penyakit Dalam (Internis)',
    kategori: 'Spesialis Utama',
    icon: '🩺',
    warna: 'from-blue-700 to-indigo-700',
    deskripsi: 'Penanganan diabetes melitus, hipertensi, gangguan lambung, hati/hepatitis, dan rematologi.',
    kapasitas: 45
  },

  // 3. Subspesialis (Permintaan User)
  {
    id: 'POL-17',
    kode: 'ONK',
    nama: 'Poli Onkologi & Hematologi (Kanker & Kelainan Darah)',
    kategori: 'Subspesialis',
    icon: '🎗️',
    warna: 'from-fuchsia-600 to-pink-600',
    deskripsi: 'Khusus menangani kanker, protokol kemoterapi, leukemia, limfoma, anemia berat, dan hemofilia.',
    kapasitas: 20
  },
  {
    id: 'POL-18',
    kode: 'GRT',
    nama: 'Poli Geriatri (Perawatan Medis Lansia)',
    kategori: 'Subspesialis',
    icon: '👴',
    warna: 'from-amber-600 to-stone-600',
    deskripsi: 'Perawatan medis komprehensif lansia dengan sindrom geriatri, multimorbiditas, dan polifarmasi.',
    kapasitas: 20
  },
  {
    id: 'POL-19',
    kode: 'EDK',
    nama: 'Poli Endokrin (Gangguan Hormon & Tiroid)',
    kategori: 'Subspesialis',
    icon: '🧬',
    warna: 'from-indigo-600 to-blue-600',
    deskripsi: 'Menangani gangguan hormon, hipertiroid/hipotiroid, nodul tiroid, adrenal, dan hipofisis.',
    kapasitas: 20
  },
  {
    id: 'POL-20',
    kode: 'FTM',
    nama: 'Poli Fetomaternal (Kandungan Risiko Tinggi)',
    kategori: 'Subspesialis',
    icon: '🤰',
    warna: 'from-rose-600 to-purple-600',
    deskripsi: 'Subspesialis kandungan untuk kehamilan berisiko tinggi, skrining kelainan janin, USG Doppler fetomaternal.',
    kapasitas: 15
  },

  // 4. Poliklinik Penunjang & Khusus (Permintaan User)
  {
    id: 'POL-21',
    kode: 'RHB',
    nama: 'Poli Rehabilitasi Medik / Fisioterapi',
    kategori: 'Penunjang & Khusus',
    icon: '🏃',
    warna: 'from-lime-600 to-emerald-600',
    deskripsi: 'Fisioterapi pasca stroke, terapi okupasi, terapi wicara, latihan kardiorespirasi, dan modalitas panas/listrik.',
    kapasitas: 35
  },
  {
    id: 'POL-22',
    kode: 'GZI',
    nama: 'Poli Gizi Klinik',
    kategori: 'Penunjang & Khusus',
    icon: '🥗',
    warna: 'from-green-500 to-teal-600',
    deskripsi: 'Konsultasi dietetik klinis diabetes, obesitas, malnutrisi, gagal ginjal, dan enteral/parenteral feeding.',
    kapasitas: 25
  },
  {
    id: 'POL-23',
    kode: 'NYR',
    nama: 'Poli Nyeri atau Akupunktur',
    kategori: 'Penunjang & Khusus',
    icon: '📍',
    warna: 'from-orange-500 to-red-500',
    deskripsi: 'Manajemen nyeri kronis, blok saraf, trigger point injection, dan akupunktur medik terintegrasi.',
    kapasitas: 20
  },
  {
    id: 'POL-24',
    kode: 'MCU',
    nama: 'Poli MCU (Medical Check-Up)',
    kategori: 'Penunjang & Khusus',
    icon: '📑',
    warna: 'from-teal-600 to-sky-600',
    deskripsi: 'Paket pemeriksaan kesehatan menyeluruh karyawan, calon pengantin, visa, dan general health check.',
    kapasitas: 50
  }
];

const FIRST_NAMES = [
  'Andi', 'Budi', 'Citra', 'Doni', 'Eka', 'Fajar', 'Gita', 'Hendra', 'Indah', 'Joko',
  'Kartika', 'Lukman', 'Maya', 'Nugroho', 'Olivia', 'Pratama', 'Rina', 'Siti', 'Taufik', 'Utami',
  'Vina', 'Wahyu', 'Yuliana', 'Zulfikar', 'Bambang', 'Dian', 'Fachri', 'Hany', 'Irawan', 'Kurniawan'
];

const LAST_NAMES = [
  'Pratama', 'Wijaya', 'Kusuma', 'Santoso', 'Putri', 'Hidayat', 'Savitri', 'Gunawan', 'Permata', 'Susanto',
  'Wulandari', 'Hakim', 'Lestari', 'Saputra', 'Siregar', 'Alamsyah', 'Setiawan', 'Aminah', 'Ramadhan', 'Nugraha',
  'Mahendra', 'Purnomo', 'Syahputra', 'Firmansyah', 'Sudrajat', 'Suharto', 'Yudhistira', 'Anwar', 'Chandra', 'Darsono'
];

const STREETS = ['Jl. Sudirman', 'Jl. Thamrin', 'Jl. Gatot Subroto', 'Jl. Melawai', 'Jl. Kemang', 'Jl. Kebon Jeruk', 'Jl. Menteng', 'Jl. Kuningan', 'Jl. Senayan', 'Jl. Asia Afrika'];

// 1. DATA PASIEN LENGKAP DENGAN RESUME MEDIS & PROFIL KLINIS 100+ PASIEN
export const PASIEN = generateAllPatientsWithResumes();

// 2. DATA DOKTER LENGKAP DENGAN SELURUH PELAYANAN Klinik & JADWAL REALISTIS
export const SEMUA_DOKTER: Doctor[] = MASTER_POLIKLINIK.flatMap((poli, idx) => {
  // Create 2 specialized doctors per poliklinik with realistic hospital shift patterns
  return [1, 2].map(docNum => {
    const docIdx = idx * 2 + docNum;
    const fName = FIRST_NAMES[docIdx % FIRST_NAMES.length];
    const lName = LAST_NAMES[(docIdx * 3) % LAST_NAMES.length];
    
    let specCode = '';
    let subsp = '';
    let penempatan = 'Poli';
    let peran = 'Dokter Spesialis DPJP';
    let roomNumber = `R. ${100 + idx * 2 + docNum}`;
    let quota = 30;
    let days = '';
    let hours = '';
    let shiftName = '';
    let statusJaga = 'Sedang Berpraktik';

    if (poli.kode === 'UMM') {
      specCode = 'Dokter Umum Layanan Primer';
      days = docNum === 1 ? 'Senin - Jumat' : 'Senin - Sabtu';
      hours = docNum === 1 ? '08:00 - 12:30 WIB' : '13:00 - 17:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Sesi Berikutnya';
      quota = 45;
      roomNumber = 'R. 101 Poli Umum';
    } else if (poli.kode === 'IGD') {
      specCode = docNum === 1 ? 'Sp.EM (Spesialis Emergensi Medik)' : 'Dokter Umum ACLS/ATLS Senior';
      penempatan = 'IGD, Triase, Resusitasi';
      peran = docNum === 1 ? 'Kepala Jaga & Konsulen IGD' : 'Dokter Jaga Resusitasi IGD';
      days = 'Setiap Hari (24 Jam 3 Shift Rotasi)';
      hours = docNum === 1 ? '07:00 - 14:00 WIB' : '14:00 - 21:00 WIB';
      shiftName = docNum === 1 ? 'Shift Pagi (07:00 - 14:00)' : 'Shift Siang (14:00 - 21:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Sesi Berikutnya';
      quota = 50;
      roomNumber = 'Ruang Resusitasi IGD';
    } else if (poli.kode === 'OBG') {
      specCode = 'Sp.OG (Obstetri & Ginekologi)';
      subsp = docNum === 1 ? 'Fetomaternal & USG 4D' : 'Onkologi Ginekologi & Fertilitas';
      penempatan = 'Poli, Rawat Inap, Operasi (VK PONEK)';
      days = docNum === 1 ? 'Senin, Rabu, Jumat' : 'Selasa, Kamis, Sabtu';
      hours = docNum === 1 ? '08:00 - 12:30 WIB' : '13:00 - 17:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Sesi Berikutnya';
      quota = 30;
      roomNumber = 'R. 201 Poli Kandungan';
    } else if (poli.kode === 'ANK') {
      specCode = 'Sp.A (Pediatri & Tumbuh Kembang)';
      subsp = docNum === 1 ? 'Pediatri Sosial & Imunisasi' : 'Infeksi Tropik Anak';
      penempatan = 'Poli, Rawat Inap (Bangsal Sakura), Perina';
      days = docNum === 1 ? 'Senin - Jumat' : 'Senin - Kamis';
      hours = docNum === 1 ? '08:00 - 12:30 WIB' : '13:00 - 17:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Sesi Berikutnya';
      quota = 35;
      roomNumber = 'R. 203 Poli Anak Ramah';
    } else if (poli.kode === 'BDH') {
      specCode = 'Sp.B (Bedah Umum & Digestif)';
      penempatan = 'Poli, Operasi (OK Sentral), Rawat Inap';
      peran = 'Operator Bedah & DPJP';
      days = docNum === 1 ? 'Senin, Rabu, Jumat' : 'Selasa, Kamis, Sabtu';
      hours = docNum === 1 ? '08:00 - 12:30 WIB (Poli) & Cito OK' : '13:00 - 17:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Tindakan OK';
      quota = 25;
      roomNumber = 'R. 108 Poli Bedah';
    } else if (poli.kode === 'JNT') {
      specCode = 'Sp.JP, FIHA (Kardiologi & Vaskular)';
      subsp = 'Intervensi Kardiovaskular & Echocardiography';
      penempatan = 'Poli, ICU/ICCU, Rawat Inap';
      days = docNum === 1 ? 'Senin, Rabu, Jumat' : 'Selasa, Kamis, Sabtu';
      hours = docNum === 1 ? '08:00 - 12:30 WIB' : '13:00 - 17:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Sesi Berikutnya';
      quota = 25;
      roomNumber = 'R. 205 Poli Jantung (Echo)';
    } else if (poli.kode === 'SRF') {
      specCode = 'Sp.N (Saraf / Neurologi)';
      subsp = 'Neurovaskular (Stroke) & EEG';
      penempatan = 'Poli, Unit Stroke, Rawat Inap';
      days = docNum === 1 ? 'Senin, Rabu, Jumat' : 'Selasa, Kamis, Sabtu';
      hours = docNum === 1 ? '08:00 - 12:30 WIB' : '13:00 - 17:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Sesi Berikutnya';
      quota = 25;
      roomNumber = 'R. 207 Poli Saraf';
    } else if (poli.kode === 'MAT') {
      specCode = 'Sp.M (Mata / Oftalmologi)';
      subsp = 'Katarak, Bedah Refraktif & Glaukoma';
      penempatan = 'Poli, Kamar Operasi Mata';
      days = docNum === 1 ? 'Senin - Kamis' : 'Rabu - Sabtu';
      hours = docNum === 1 ? '08:00 - 12:30 WIB' : '13:00 - 17:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Sesi Berikutnya';
      quota = 30;
      roomNumber = 'R. 105 Poli Mata';
    } else if (poli.kode === 'THT') {
      specCode = 'Sp.THT-BKL (Telinga Hidung Tenggorok)';
      penempatan = 'Poli, Kamar Operasi';
      days = docNum === 1 ? 'Senin, Rabu, Jumat' : 'Selasa, Kamis, Sabtu';
      hours = docNum === 1 ? '08:00 - 12:30 WIB' : '13:00 - 17:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Sesi Berikutnya';
      quota = 30;
      roomNumber = 'R. 106 Poli THT-KL';
    } else if (poli.kode === 'KLT') {
      specCode = 'Sp.DVE (Dermatologi & Venereologi)';
      penempatan = 'Poli';
      days = docNum === 1 ? 'Senin, Rabu, Jumat' : 'Selasa, Kamis, Sabtu';
      hours = docNum === 1 ? '08:00 - 12:30 WIB' : '13:00 - 17:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Sesi Berikutnya';
      quota = 30;
      roomNumber = 'R. 209 Poli Kulit & Kelamin';
    } else if (poli.kode === 'PRU') {
      specCode = 'Sp.P, FAPSR (Pulmonologi & Paru)';
      penempatan = 'Poli, TB DOTS, Rawat Inap';
      days = docNum === 1 ? 'Senin, Rabu, Jumat' : 'Selasa, Kamis, Sabtu';
      hours = docNum === 1 ? '08:00 - 12:30 WIB' : '13:00 - 17:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Sesi Berikutnya';
      quota = 30;
      roomNumber = 'R. 111 Poli Paru';
    } else if (poli.kode === 'JWA') {
      specCode = 'Sp.KJ (Psikiatri / Kesehatan Jiwa)';
      penempatan = 'Poli, Konseling';
      days = docNum === 1 ? 'Senin - Kamis' : 'Selasa - Jumat';
      hours = docNum === 1 ? '09:00 - 13:30 WIB' : '14:00 - 18:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Sesi Berikutnya';
      quota = 20;
      roomNumber = 'R. 301 Ruang Konseling Jiwa';
    } else if (poli.kode === 'URL') {
      specCode = 'Sp.U (Urologi & Ginjal Saluran Kemih)';
      penempatan = 'Poli, ESWL, Operasi';
      days = docNum === 1 ? 'Senin, Rabu, Jumat' : 'Selasa, Kamis, Sabtu';
      hours = docNum === 1 ? '08:00 - 12:30 WIB' : '13:00 - 17:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Sesi Berikutnya';
      quota = 25;
      roomNumber = 'R. 114 Poli Urologi';
    } else if (poli.kode === 'ORT') {
      specCode = 'Sp.OT (Orthopedi & Traumatologi)';
      subsp = 'Sendi, Tulang & Rekonstruksi';
      penempatan = 'Poli, Kamar Operasi (OK 2), Rawat Inap';
      days = docNum === 1 ? 'Senin - Kamis' : 'Rabu - Sabtu';
      hours = docNum === 1 ? '08:00 - 12:30 WIB' : '13:00 - 17:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Tindakan OK';
      quota = 25;
      roomNumber = 'R. 112 Poli Orthopedi';
    } else if (poli.kode === 'GIG') {
      specCode = docNum === 1 ? 'Sp.BM (Bedah Mulut & Maksilofasial)' : 'Sp.KG (Konservasi Gigi & Estetika)';
      penempatan = 'Poli Gigi Spesialis';
      days = docNum === 1 ? 'Senin - Jumat' : 'Selasa - Sabtu';
      hours = docNum === 1 ? '08:00 - 13:00 WIB' : '13:00 - 18:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Sesi Berikutnya';
      quota = 20;
      roomNumber = 'Dental Center Unit 1-2';
    } else if (poli.kode === 'PDL') {
      specCode = 'Sp.PD, FINASIM (Penyakit Dalam)';
      subsp = docNum === 1 ? 'Gastroenterohepatologi & Endoskopi' : 'Ginjal Hipertensi & Diabetes';
      penempatan = 'Poli, Rawat Inap (DPJP), Endoskopi';
      days = docNum === 1 ? 'Senin - Kamis' : 'Senin - Jumat';
      hours = docNum === 1 ? '08:00 - 12:30 WIB (Poli) & Visite Pagi' : '13:00 - 17:00 WIB';
      shiftName = docNum === 1 ? 'Sesi 1 Pagi (08:00 - 12:30)' : 'Sesi 2 Siang (13:00 - 17:00)';
      statusJaga = docNum === 1 ? 'Sedang Berpraktik' : 'Visite Bangsal';
      quota = 40;
      roomNumber = 'R. 102 Poli Penyakit Dalam';
    } else if (poli.kode === 'ONK') {
      specCode = 'Sp.PD-KHOM (Hematologi & Onkologi Medik)';
      penempatan = 'Poli Kanker, Kemoterapi Center';
      days = docNum === 1 ? 'Senin, Rabu, Jumat' : 'Selasa, Kamis, Sabtu';
      hours = '08:30 - 13:00 WIB';
      shiftName = 'Sesi 1 Pagi (08:00 - 12:30)';
      statusJaga = 'Sedang Berpraktik';
      quota = 20;
      roomNumber = 'R. 305 Pusat Onkologi';
    } else if (poli.kode === 'GRT') {
      specCode = 'Sp.PD-KGer (Geriatri & Multimorbiditas)';
      penempatan = 'Poli Geriatri';
      days = 'Selasa, Kamis, Sabtu';
      hours = '08:00 - 12:30 WIB';
      shiftName = 'Sesi 1 Pagi (08:00 - 12:30)';
      statusJaga = 'Sedang Berpraktik';
      quota = 20;
      roomNumber = 'R. 115 Klinik Geriatri';
    } else if (poli.kode === 'EDK') {
      specCode = 'Sp.PD-KEMD (Endokrin, Metabolik & Diabetes)';
      penempatan = 'Poli Endokrin';
      days = 'Senin, Rabu, Jumat';
      hours = '08:00 - 12:30 WIB';
      shiftName = 'Sesi 1 Pagi (08:00 - 12:30)';
      statusJaga = 'Sedang Berpraktik';
      quota = 25;
      roomNumber = 'R. 210 Poli Endokrin';
    } else if (poli.kode === 'FTM') {
      specCode = 'Sp.OG-Subsp.KFM (Fetomaternal Risiko Tinggi)';
      penempatan = 'Poli Fetomaternal, USG Doppler';
      days = 'Senin, Rabu, Kamis';
      hours = '08:30 - 13:00 WIB';
      shiftName = 'Sesi 1 Pagi (08:00 - 12:30)';
      statusJaga = 'Sedang Berpraktik';
      quota = 15;
      roomNumber = 'Fetomaternal Center Lt. 2';
    } else if (poli.kode === 'RHB') {
      specCode = 'Sp.KFR (Kedokteran Fisik & Rehabilitasi)';
      penempatan = 'Poli Rehab Medik, Fisioterapi';
      days = 'Senin - Jumat';
      hours = '08:00 - 14:00 WIB';
      shiftName = 'Sesi 1 Pagi (08:00 - 12:30)';
      statusJaga = 'Sedang Berpraktik';
      quota = 35;
      roomNumber = 'Gedung Rehab Medik Lt. 1';
    } else if (poli.kode === 'GZI') {
      specCode = 'Sp.GK (Gizi Klinik & Nutrisi Pasien)';
      penempatan = 'Poli Gizi, Konsultasi Diet';
      days = 'Senin - Kamis';
      hours = '08:30 - 13:30 WIB';
      shiftName = 'Sesi 1 Pagi (08:00 - 12:30)';
      statusJaga = 'Sedang Berpraktik';
      quota = 25;
      roomNumber = 'R. 117 Poli Gizi';
    } else if (poli.kode === 'NYR') {
      specCode = 'Sp.An-TI, FIPM (Manajemen Nyeri Intervensi)';
      penempatan = 'Pain Clinic, Anestesi, ICU';
      days = 'Selasa, Kamis, Sabtu';
      hours = '08:00 - 13:00 WIB';
      shiftName = 'Sesi 1 Pagi (08:00 - 12:30)';
      statusJaga = 'Sedang Berpraktik';
      quota = 20;
      roomNumber = 'Pain Center Lt. 2 (R. 215)';
    } else if (poli.kode === 'MCU') {
      specCode = 'Sp.Ok (Kedokteran Okupasi & Medical Check Up)';
      penempatan = 'Pusat MCU Terpadu';
      days = 'Senin - Sabtu';
      hours = '07:30 - 14:30 WIB';
      shiftName = 'Sesi 1 Pagi (08:00 - 12:30)';
      statusJaga = 'Sedang Berpraktik';
      quota = 50;
      roomNumber = 'Gedung MCU Utama Lt. 1';
    } else {
      specCode = 'Dokter Spesialis';
      days = 'Senin - Jumat';
      hours = '08:00 - 14:00 WIB';
      shiftName = 'Pagi';
      statusJaga = 'Sedang Berpraktik';
    }

    const doctorName = poli.kode === 'GIG' 
      ? `drg. ${fName} ${lName}, ${specCode}`
      : `dr. ${fName} ${lName}, ${specCode}`;

    const served = statusJaga === 'Sedang Berpraktik' ? Math.floor(quota * 0.45) : (statusJaga === 'Tindakan OK' ? 3 : 0);

    return {
      id: `DOC-${poli.kode}-${docNum}`,
      nip: `198${(docIdx % 9) + 1}0${((docIdx * 3) % 12) + 1}1520100${docIdx}`,
      sip: `SIP/${String(100 + docIdx)}/${poli.kode}/2024`,
      str: `STR-310118${docIdx}00${docIdx}`,
      nama: doctorName,
      jabatan: peran,
      spesialis: specCode,
      subspesialis: subsp,
      poli: poli.nama,
      poli_id: poli.id,
      penempatan: penempatan,
      jadwal: `${days} (${hours})`,
      hari: days,
      jam: hours,
      shift: shiftName,
      ruangan: roomNumber,
      kuota: quota,
      pasien_terlayani: served,
      status_jaga: statusJaga,
      kontak: `0812-3456-7${String(100 + docIdx).padStart(3, '0')}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}@myitaru.klinik`,
      status: 'Aktif'
    };
  });
});

// 3. DATA PERAWAT LENGKAP & SINKRON
export const SEMUA_PERAWAT: Nurse[] = MASTER_POLIKLINIK.flatMap((poli, idx) => {
  return [1, 2].map(nNum => {
    const nIdx = idx * 2 + nNum;
    const fName = FIRST_NAMES[(nIdx * 2) % FIRST_NAMES.length];
    const lName = LAST_NAMES[(nIdx * 5) % LAST_NAMES.length];
    const isBidan = poli.kode === 'OBG' || poli.kode === 'FTM';

    return {
      id: `NUR-${nIdx}`,
      nip: `NIP-${String(2000 + nIdx)}`,
      nama: `${isBidan ? 'Bdn.' : 'Ns.'} ${fName} ${lName}, S.Tr.Kep`,
      jabatan: isBidan ? 'Bidan Pelaksana' : (nNum === 1 ? 'Penanggung Jawab Poli (PJ)' : 'Perawat Pelaksana'),
      unit: poli.nama,
      shift: nNum === 1 ? 'Pagi (07:00 - 14:00)' : 'Siang (14:00 - 21:00)',
      status: 'Aktif'
    };
  });
});

export function dokterByPenempatan(penempatan: 'Poli' | 'IGD' | 'Operasi' | 'Rawat Inap' | string): Doctor[] {
  return SEMUA_DOKTER.filter(d => d.penempatan.includes(penempatan));
}

export function initSeedData() {
  try {
    // Check if initial master data is already loaded to prevent redundant writes
    const existingPasien = storage.get('hospital_pasien', null);
    if (!existingPasien || !Array.isArray(existingPasien) || existingPasien.length === 0) {
      // 1. Sync Doctors & Nurses
      storage.set('db_dokter', SEMUA_DOKTER);
      storage.set('db_dokter_igd', SEMUA_DOKTER.filter(d => d.penempatan.includes('IGD')));
      storage.set('hospital_dokter', SEMUA_DOKTER);
      storage.set('db_perawat', SEMUA_PERAWAT);
      storage.set('hospital_perawat', SEMUA_PERAWAT);
      storage.set('hospital_poli_master', MASTER_POLIKLINIK);

      // 2. Sync 100+ Patients with Full Medical Resumes & Clinical Profiles
      storage.set('db_pasien', PASIEN);
      storage.set('hospital_pasien', PASIEN);
      
      const resumes = PASIEN.map(p => p.resume_medis).filter(Boolean);
      storage.set('hospital_resumes', resumes);
      storage.set('db_resumes', resumes);

      // 3. Sync 50+ IGD / Emergency Cases
      const igdPatients = generate50IGDPatients();
      storage.set('myitaru_igd_triase', igdPatients);
      storage.set('hospital_emergency_triage', igdPatients);
      storage.set('hospital_igd_Penanganan IGD', igdPatients.map(p => ({
        waktu: p.waktu,
        nama_pasien: p.nama_pasien,
        no_rm: p.no_rm,
        kondisi: p.kondisi,
        tindakan: p.tindakan,
        status: p.status
      })));
      storage.set('hospital_igd_Observasi', igdPatients.map(p => ({
        waktu: p.waktu,
        nama_pasien: p.nama_pasien,
        tensi: p.tensi,
        nadi: p.nadi,
        suhu: p.suhu,
        rr: p.rr,
        spo2: p.spo2,
        dokter_jaga: p.dokter_jaga,
        status: p.status
      })));
      storage.set('hospital_igd_Dokter IGD', igdPatients.map(p => ({
        waktu: p.waktu,
        nama_pasien: p.nama_pasien,
        triage: p.triage,
        diagnosa: p.diagnosa,
        dokter_dpjp: p.dokter_jaga,
        tindakan: p.tindakan,
        status: p.status
      })));

      // 4. Sync 50+ Rawat Inap (Inpatient Beds & Admisi & Visite & Discharge)
      const beds = generate50InpatientBeds();
      storage.set('hospital_beds', beds);
      storage.set('hospital_ranap_Admisi', beds.filter(b => b.status === 'Terisi').map(b => ({
        tanggal: b.tanggal,
        nama_pasien: b.nama_pasien,
        no_rm: b.no_rm,
        ruangan: b.ruangan,
        diagnosa: b.diagnosa,
        penjamin: b.penjamin,
        status: 'Dirawat'
      })));
      storage.set('hospital_ranap_Visite', beds.filter(b => b.status === 'Terisi').map(b => ({
        tanggal: b.tanggal,
        nama_pasien: b.nama_pasien,
        ruangan: b.ruangan,
        dpjp: b.dpjp,
        catatan_visite: `S: Pasien mengeluh nyeri berkurang. O: TD 120/80, Nadi 80x/m, afebris. A: ${b.diagnosa} perbaikan. P: Lanjutkan terapi antibiotik & analgetik oral.`,
        status: 'Selesai Visite'
      })));
      storage.set('hospital_ranap_Asuhan Keperawatan', beds.filter(b => b.status === 'Terisi').map((b, idx) => ({
        tanggal: b.tanggal,
        nama_pasien: b.nama_pasien,
        ruangan: b.ruangan,
        diagnosa_keperawatan: idx % 2 === 0 ? 'Nyeri Akut b.d Agen Pencedera Fisiologis (SDKI D.0077)' : 'Risiko Ketidakseimbangan Cairan (SDKI D.0036)',
        intervensi: idx % 2 === 0 ? 'Manajemen Nyeri (SIKI I.08238): Observasi skala nyeri, ajarkan teknik relaksasi napas dalam' : 'Manajemen Cairan (SIKI I.03098): Monitor intake & output per 8 jam, observasi turgor kulit',
        perawat: idx % 2 === 0 ? 'Ns. Rina Wulandari, S.Kep' : 'Ns. Hendra Saputra, S.Kep',
        status: 'Terlaksana'
      })));
      storage.set('hospital_ranap_Discharge Planning', beds.filter(b => b.status === 'Terisi').map(b => ({
        tanggal: b.tanggal,
        nama_pasien: b.nama_pasien,
        ruangan: b.ruangan,
        resume_pulang: `Pasien telah dirawat dengan diagnosis ${b.diagnosa}. Kondisi saat ini stabil dan siap pulang rawat jalan.`,
        kondisi_keluar: 'Perbaikan',
        jadwal_kontrol: '3 hari pasca pulang di Poli Spesialis Terkait',
        status: 'Siap Discharge'
      })));

      // 5. Sync 50+ Kamar Operasi / Bedah Cases
      const surgeries = generate50SurgeryPatients();
      storage.set('hospital_ok_jadwal', surgeries);
      storage.set('hospital_ok_Pasien Operasi', surgeries);
      storage.set('hospital_ok_Laporan Operasi', surgeries.map(s => ({
        nomor: s.nomor,
        nama_pasien: s.nama_pasien,
        tindakan: s.tindakan,
        kode_icd9: s.kode_icd9,
        operator: s.operator,
        anastesi: s.anastesi,
        tanggal: s.tanggal,
        durasi: s.durasi,
        status: s.status
      })));
      storage.set('hospital_ok_Paket Operasi', [
        { nama_paket: 'Paket Laparoskopi Kolesistektomi', jenis: 'Bedah Digestif Mayor', kelas: 'Kelas 1 / VIP', estimasi_biaya: 'Rp 22.500.000', status: 'Tersedia' },
        { nama_paket: 'Paket Seksio Sesarea Cito & ERACS', jenis: 'Obstetri & Ginekologi', kelas: 'Kelas 1 / VIP', estimasi_biaya: 'Rp 18.000.000', status: 'Tersedia' },
        { nama_paket: 'Paket ORIF Fraktur Ekstremitas', jenis: 'Orthopedi & Traumatologi', kelas: 'Kelas 1 / Kelas 2', estimasi_biaya: 'Rp 25.000.000', status: 'Tersedia' },
        { nama_paket: 'Paket Fakoemulsifikasi Katarak + IOL', jenis: 'Bedah Mata Mikro', kelas: 'One Day Care', estimasi_biaya: 'Rp 9.500.000', status: 'Tersedia' },
        { nama_paket: 'Paket TURP Prostat Endourologi', jenis: 'Urologi', kelas: 'Kelas 1 / Kelas 2', estimasi_biaya: 'Rp 16.500.000', status: 'Tersedia' }
      ]);

      // 6. Sync 55 Lab & Radiology Requests and Results
      const labRad = generate50LabAndRadRequests();
      storage.set('hospital_lab_rad', labRad);
      storage.set('hospital_laboratorium_Permintaan Lab', labRad.filter(x => x.type === 'Lab'));
      storage.set('hospital_laboratorium_Hasil Lab', labRad.filter(x => x.type === 'Lab'));
      storage.set('hospital_laboratorium_Validasi Hasil', labRad.filter(x => x.type === 'Lab' && x.status === 'Tervalidasi'));
      storage.set('hospital_radiologi_Permintaan Radiologi', labRad.filter(x => x.type === 'Radiologi'));
      storage.set('hospital_radiologi_Hasil Radiologi', labRad.filter(x => x.type === 'Radiologi'));
    }
  } catch (e) {
    console.warn('[seedData] Failed to initialize seed data safely', e);
  }
}

initSeedData();
