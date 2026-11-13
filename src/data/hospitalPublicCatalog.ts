import { MASTER_POLIKLINIK, SEMUA_DOKTER, Doctor, PoliklinikItem } from './seedData';

export interface CenterOfExcellence {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  poliKode: string;
  highlightMetric: string;
  services: string[];
  description: string;
}

export interface MCUPackage {
  id: string;
  name: string;
  tier: string;
  price: number;
  duration: string;
  fastingRequired: boolean;
  highlights: string[];
  recommendedFor: string;
}

export interface HospitalBranch {
  id: string;
  name: string;
  city: string;
  address: string;
  emergencyPhone: string;
  appointmentPhone: string;
  bedsCount: number;
  accreditation: string;
  hours: string;
}

export interface HealthArticle {
  id: string;
  category: string;
  title: string;
  readMinutes: number;
  author: string;
  date: string;
  summary: string;
  body: string[];
}

export interface PatientStory {
  id: string;
  patientInitials: string;
  unit: string;
  quote: string;
  outcome: string;
}

export const CENTERS_OF_EXCELLENCE: CenterOfExcellence[] = [
  {
    id: 'coe-cardiac',
    slug: 'jantung',
    title: 'Heart & Vascular Center',
    subtitle: 'Kardiologi Intervensi & Bedah Jantung',
    poliKode: 'JNT',
    highlightMetric: 'Cath Lab 24/7',
    services: ['Primary PCI Akut < 90 Menit', 'Echocardiography 4D', 'CT Angiografi Koroner', 'Rehabilitasi Jantung'],
    description: 'Penanganan komprehensif penyakit jantung koroner, aritmia, dan gagal jantung oleh tim kardiolog intervensi berpengalaman.'
  },
  {
    id: 'coe-neuro',
    slug: 'saraf',
    title: 'Brain, Spine & Stroke Center',
    subtitle: 'Neurologi Akut & Bedah Saraf Minimal Invasif',
    poliKode: 'SRF',
    highlightMetric: 'Code Stroke Ready',
    services: ['Trombolisis Stroke Golden Period', 'MRI 3 Tesla & CT Perfusion', 'Bedah Mikro Tulang Belakang', 'Klinik Nyeri & Epilepsi'],
    description: 'Unit respons cepat stroke dan gangguan saraf pusat terintegrasi diagnostik pencitraan resolusi tinggi dan rehabilitasi dini.'
  },
  {
    id: 'coe-oncology',
    slug: 'onkologi',
    title: 'Integrated Oncology Center',
    subtitle: 'Diagnostik Presisi, Kemoterapi & Terapi Target',
    poliKode: 'PDL',
    highlightMetric: 'Tumor Board Multidisiplin',
    services: ['Skrining Kanker Dini', 'Kemoterapi Rawat Jalan Nyaman', 'Bedah Onkologi Terpadu', 'Perawatan Paliatif Holistik'],
    description: 'Pendampingan pasien kanker berbasis rencana terapi personal dari tim bedah onkologi, hematologi, dan gizi klinis.'
  },
  {
    id: 'coe-women',
    slug: 'ibu-anak',
    title: 'Mother & Child Sanctuary',
    subtitle: 'Kebidanan, Fetomaternal & Pediatri Terpadu',
    poliKode: 'OBG',
    highlightMetric: 'NICU Level III',
    services: ['Persalinan ERACS Minimal Nyeri', 'USG 4D Fetomaternal', 'Klinik Tumbuh Kembang Anak', 'Vaksinasi Anak & Dewasa'],
    description: 'Layanan kehamilan risiko tinggi hingga pemantauan tumbuh kembang anak dengan ruang bersalin privat yang menenangkan.'
  },
  {
    id: 'coe-ortho',
    slug: 'orthopedi',
    title: 'Orthopedic & Sports Injury',
    subtitle: 'Rekonstruksi Sendi, Lutut & Cedera Olahraga',
    poliKode: 'ORT',
    highlightMetric: 'Arthroscopy Suite',
    services: ['Total Knee & Hip Replacement', 'Rekonstruksi ACL Minimal Invasif', 'Terapi Sel & Injeksi Sendi', 'Fisioterapi Pascacedera'],
    description: 'Pemulihan mobilitas tulang dan sendi dengan teknik bedah lubang kunci serta program fisioterapi terukur.'
  },
  {
    id: 'coe-diag',
    slug: 'diagnostik',
    title: 'Diagnostic Lab & Radiology',
    subtitle: 'Patologi Klinik, MRI, CT-Scan 128 Slices',
    poliKode: 'MCU',
    highlightMetric: 'Hasil Online di App',
    services: ['Laboratorium Otomatis 24 Jam', 'CT-Scan Cardiac & Kepala', 'PACS Radiologi Digital', 'Pengambilan Sampel Homecare'],
    description: 'Pemeriksaan laboratorium dan radiologi presisi tinggi yang terhubung langsung ke Aplikasi Mobile Pasien.'
  }
];

export const MCU_PACKAGES: MCUPackage[] = [
  {
    id: 'mcu-essential',
    name: 'MCU Essential Wellness',
    tier: 'Dasar & Pekerja',
    price: 950000,
    duration: '± 2 Jam',
    fastingRequired: true,
    highlights: [
      'Konsultasi Dokter Pemeriksa',
      'Darah Lengkap & Urine Rutin',
      'Gula Darah Puasa & Profil Kolesterol',
      'Fungsi Hati (SGOT/SGPT) & Ginjal (Ureum/Kreatinin)',
      'Rontgen Thorax PA Digital'
    ],
    recommendedFor: 'Evaluasi tahunan karyawan & dewasa muda'
  },
  {
    id: 'mcu-cardiac',
    name: 'MCU Executive Heart & Metabolic',
    tier: 'Eksekutif Populer',
    price: 2450000,
    duration: '± 3,5 Jam',
    fastingRequired: true,
    highlights: [
      'Konsultasi Dokter Spesialis Penyakit Dalam',
      'EKG 12 Lead & Treadmill Stress Test',
      'HbA1c, Profil Lipid Lengkap & Asam Urat',
      'USG Whole Abdomen (Hati, Empedu, Ginjal)',
      'Laporan Lengkap Digital di Aplikasi Mobile'
    ],
    recommendedFor: 'Usia 30+ tahun dengan gaya hidup aktif & berisiko tinggi'
  },
  {
    id: 'mcu-senior',
    name: 'MCU Comprehensive Senior & Longevity',
    tier: 'Paripurna',
    price: 3850000,
    duration: '± 4,5 Jam',
    fastingRequired: true,
    highlights: [
      'Konsultasi Spesialis Jantung & Penyakit Dalam',
      'Echocardiography & Skrining Tiroid (TSH/FT4)',
      'Panel Tumor Marker (CEA / AFP / PSA atau CA-125)',
      'Spirometri Paru & Audiometri',
      'Sarapan Bergizi & Lounge Eksekutif Privat'
    ],
    recommendedFor: 'Orang tua & evaluasi kesehatan menyeluruh'
  }
];

export const HOSPITAL_BRANCHES: HospitalBranch[] = [
  {
    id: 'MYI-JKT',
    name: 'MYITARU Klinik Pusat (Flagship)',
    city: 'Jakarta Pusat',
    address: 'Jl. Kesehatan Raya No. 88, Menteng, Jakarta Pusat 10310',
    emergencyPhone: '1-500-911',
    appointmentPhone: '(021) 5098-8800',
    bedsCount: 380,
    accreditation: 'KARS Paripurna · SatuSehat Terintegrasi',
    hours: 'IGD & Farmasi 24 Jam · Poliklinik 07:00 – 21:00 WIB'
  },
  {
    id: 'MYI-TNG',
    name: 'MYITARU Klinik Karawaci',
    city: 'Tangerang',
    address: 'Jl. Boulevard Medika Kav. 12, Lippo Village, Tangerang 15811',
    emergencyPhone: '1-500-911',
    appointmentPhone: '(021) 5460-2200',
    bedsCount: 240,
    accreditation: 'KARS Paripurna',
    hours: 'IGD & Laboratorium 24 Jam · Poliklinik 08:00 – 20:00 WIB'
  },
  {
    id: 'MYI-SBY',
    name: 'MYITARU Klinik Surabaya',
    city: 'Surabaya',
    address: 'Jl. Mayjen Sungkono No. 105, Gubeng, Surabaya 60281',
    emergencyPhone: '1-500-911',
    appointmentPhone: '(031) 5020-7700',
    bedsCount: 210,
    accreditation: 'KARS Paripurna',
    hours: 'IGD 24 Jam · Poliklinik 08:00 – 20:00 WIB'
  }
];

export const HEALTH_ARTICLES: HealthArticle[] = [
  {
    id: 'art-stroke',
    category: 'Neurologi & Gawat Darurat',
    title: 'Kenali Tanda Dini Stroke dengan Metode SeGeRa Ke RS',
    readMinutes: 4,
    author: 'Tim Dokter Spesialis Saraf MYITARU',
    date: 'Update Medis 2026',
    summary: 'Penanganan stroke iskemik dalam 4,5 jam pertama menentukan kualitas pemulihan fungsi gerak dan bicara pasien.',
    body: [
      'Setiap menit saat pembuluh darah otak tersumbat, jutaan sel saraf kehilangan suplai oksigen. Karena itu, keluarga perlu mengenali gejala awal stroke secara cepat tanpa menunda.',
      'Ingat akronim SeGeRa Ke RS: Senyum tidak simetris, Gerak separuh anggota tubuh melemah tiba-tiba, bicaRa pelo atau sulit memahami kata, Kebas/baal separuh tubuh, Rabun mendadak, serta Sakit kepala hebat yang belum pernah dirasakan sebelumnya.',
      'Unit Code Stroke MYITARU Klinik siaga 24 jam dengan CT-Scan cepat di dekat IGD sehingga pasien segera menerima terapi trombolisis bila memenuhi kriteria klinis.'
    ]
  },
  {
    id: 'art-cardiac',
    category: 'Kardiologi',
    title: 'Kapan Nyeri Dada Memerlukan Pemeriksaan EKG dan Troponin Segera?',
    readMinutes: 5,
    author: 'Tim Heart & Vascular Center MYITARU',
    date: 'Update Medis 2026',
    summary: 'Membedakan nyeri dada akibat asam lambung dengan serangan jantung akut yang memerlukan pertolongan segera.',
    body: [
      'Nyeri dada akibat penyakit jantung koroner umumnya terasa seperti ditekan benda berat di tengah atau sisi kiri dada, menjalar ke rahang, punggung, atau lengan kiri, dan disertai keringat dingin maupun sesak napas.',
      'Bila gejala berlangsung lebih dari 15 menit dan tidak membaik dengan istirahat, segera kunjungi IGD 24 Jam untuk pemeriksaan EKG dalam 10 menit dan pemeriksaan enzim jantung Troponin I.',
      'Pasien dengan riwayat hipertensi, diabetes, atau kolesterol tinggi disarankan menjalani Medical Check-Up tahunan termasuk pemeriksaan profil lipid dan EKG berkala.'
    ]
  },
  {
    id: 'art-digital',
    category: 'Panduan Pasien',
    title: 'Cara Memantau Antrean Poli dan Hasil Lab dari Ponsel Tanpa Antre di Loket',
    readMinutes: 3,
    author: 'Layanan Pasien Digital MYITARU',
    date: 'Panduan Praktis',
    summary: 'Gunakan Aplikasi Mobile MYITARU dengan login Google atau Nomor Rekam Medis untuk memantau giliran panggilan poli secara langsung.',
    body: [
      'Pasien tidak perlu menunggu lama di ruang tunggu yang padat. Setelah mendaftar online atau di anjungan pendaftaran, buka halaman Aplikasi Pasien (/mobile) di ponsel Anda.',
      'Masuk cukup menggunakan Akun Google atau masukkan Nomor Rekam Medis (No. RM) beserta Tanggal Lahir untuk verifikasi identitas.',
      'Nomor antrean aktif, estimasi waktu panggilan, hasil laboratorium yang sudah divalidasi analis, serta rincian tagihan atau penjaminan BPJS langsung tersedia dalam satu layar.'
    ]
  }
];

export const PATIENT_STORIES: PatientStory[] = [
  {
    id: 'st-1',
    patientInitials: 'Bpk. Hendra K. · 54 Thn',
    unit: 'Heart Center & Cath Lab',
    quote: 'Penanganan di IGD sangat sigap sejak tiba dengan keluhan nyeri dada. Keluarga saya bisa memantau perkembangan dan jadwal kontrol langsung dari aplikasi ponsel tanpa bingung menanyakan loket.',
    outcome: 'Pemulihan stabil pasca tindakan pasang ring koroner'
  },
  {
    id: 'st-2',
    patientInitials: 'Ibu Larasati M. · 32 Thn',
    unit: 'Mother & Child Center',
    quote: 'Ruang poli kebidanan tenang, dokter menjelaskan hasil USG dengan sangat sabar, dan hasil laboratorium pra-persalinan langsung muncul di HP sore harinya.',
    outcome: 'Persalinan ERACS lancar & kontrol tumbuh kembang rutin'
  },
  {
    id: 'st-3',
    patientInitials: 'Sdr. Bagus P. · 28 Thn',
    unit: 'Orthopedic & Sports Clinic',
    quote: 'Mulai dari booking jadwal dokter spesialis orthopedi sampai melihat nomor antrean saat masih di jalan, alurnya sangat rapi dan tidak membuang waktu.',
    outcome: 'Kembali berolahraga setelah fisioterapi pascarekonstruksi lutut'
  }
];

export function getPublicPoliklinik(): PoliklinikItem[] {
  return MASTER_POLIKLINIK;
}

export function getPublicDoctors(): Doctor[] {
  return SEMUA_DOKTER;
}
