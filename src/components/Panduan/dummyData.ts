export const dummyGuides = [
  // Kategori BPJS
  { id: 'BPJS-001', title: 'Cara Input Data Pasien BPJS', category: 'BPJS', role: ['Staf Registrasi', 'Admin'], level: 'Pemula', status: 'Published', views: 342, prints: 45, rating: 4.5, lastUpdate: '2023-08-01' },
  { id: 'BPJS-002', title: 'Cara Generate SEP', category: 'BPJS', role: ['Staf Registrasi', 'Admin'], level: 'Menengah', status: 'Published', views: 512, prints: 120, rating: 4.8, lastUpdate: '2023-08-02' },
  { id: 'BPJS-003', title: 'Cara Cek Rujukan BPJS', category: 'BPJS', role: ['Staf Registrasi', 'Admin'], level: 'Pemula', status: 'Published', views: 245, prints: 30, rating: 4.2, lastUpdate: '2023-08-03' },
  { id: 'BPJS-004', title: 'Cara Submit Klaim BPJS', category: 'BPJS', role: ['Kasir', 'Admin'], level: 'Lanjut', status: 'Published', views: 189, prints: 15, rating: 4.7, lastUpdate: '2023-08-04' },
  { id: 'BPJS-005', title: 'Panduan Program Rujuk Balik', category: 'BPJS', role: ['Dokter', 'Perawat'], level: 'Menengah', status: 'Published', views: 320, prints: 40, rating: 4.4, lastUpdate: '2023-08-05' },
  
  // Kategori Pendaftaran
  { id: 'PASIEN-001', title: 'Cara Input Pasien Baru', category: 'Pendaftaran', role: ['Staf Registrasi'], level: 'Pemula', status: 'Published', views: 420, prints: 50, rating: 4.6, lastUpdate: '2023-08-01' },
  { id: 'PASIEN-002', title: 'Cara Cari Pasien Existing', category: 'Pendaftaran', role: ['Staf Registrasi'], level: 'Pemula', status: 'Published', views: 350, prints: 10, rating: 4.3, lastUpdate: '2023-08-02' },
  { id: 'PASIEN-003', title: 'Cara Upload Dokumen', category: 'Pendaftaran', role: ['Staf Registrasi'], level: 'Menengah', status: 'Published', views: 210, prints: 5, rating: 4.1, lastUpdate: '2023-08-03' },
  { id: 'PASIEN-004', title: 'Cara Edit Data Pasien', category: 'Pendaftaran', role: ['Staf Registrasi', 'Admin'], level: 'Menengah', status: 'Published', views: 180, prints: 2, rating: 4.5, lastUpdate: '2023-08-04' },
  
  // Kategori Poli
  { id: 'POLI-001', title: 'Cara Pemeriksaan Pasien', category: 'Poli', role: ['Dokter', 'Perawat'], level: 'Pemula', status: 'Published', views: 600, prints: 80, rating: 4.9, lastUpdate: '2023-08-01' },
  { id: 'POLI-002', title: 'Cara Input Diagnosis ICD-10', category: 'Poli', role: ['Dokter'], level: 'Menengah', status: 'Published', views: 450, prints: 20, rating: 4.7, lastUpdate: '2023-08-02' },
  { id: 'POLI-003', title: 'Cara Buat Resep Elektronik', category: 'Poli', role: ['Dokter'], level: 'Menengah', status: 'Published', views: 520, prints: 15, rating: 4.8, lastUpdate: '2023-08-03' },
  { id: 'POLI-004', title: 'Cara Buat Surat Rujukan', category: 'Poli', role: ['Dokter'], level: 'Menengah', status: 'Published', views: 390, prints: 25, rating: 4.6, lastUpdate: '2023-08-04' },
  
  // Kategori IGD
  { id: 'IGD-001', title: 'Cara Triase Pasien', category: 'IGD', role: ['Dokter', 'Perawat'], level: 'Menengah', status: 'Published', views: 280, prints: 30, rating: 4.8, lastUpdate: '2023-08-01' },
  { id: 'IGD-002', title: 'Cara Penanganan Emergency', category: 'IGD', role: ['Dokter', 'Perawat'], level: 'Lanjut', status: 'Published', views: 310, prints: 40, rating: 4.9, lastUpdate: '2023-08-02' },
  { id: 'IGD-003', title: 'Cara Konversi ke Rawat Inap', category: 'IGD', role: ['Admin', 'Perawat'], level: 'Menengah', status: 'Published', views: 190, prints: 10, rating: 4.4, lastUpdate: '2023-08-03' },
  
  // Kategori Farmasi
  { id: 'FARMA-001', title: 'Cara Dispensing Obat', category: 'Farmasi', role: ['Farmasi'], level: 'Pemula', status: 'Published', views: 410, prints: 45, rating: 4.7, lastUpdate: '2023-08-01' },
  { id: 'FARMA-002', title: 'Cara Cek Interaksi Obat', category: 'Farmasi', role: ['Farmasi', 'Dokter'], level: 'Menengah', status: 'Published', views: 360, prints: 20, rating: 4.8, lastUpdate: '2023-08-02' },
  { id: 'FARMA-003', title: 'Cara Stok Opname', category: 'Farmasi', role: ['Farmasi', 'Admin'], level: 'Lanjut', status: 'Published', views: 210, prints: 15, rating: 4.5, lastUpdate: '2023-08-03' },
  
  // Kategori Billing
  { id: 'BILL-001', title: 'Cara Generate Tagihan', category: 'Billing', role: ['Kasir'], level: 'Pemula', status: 'Published', views: 340, prints: 25, rating: 4.6, lastUpdate: '2023-08-01' },
  { id: 'BILL-002', title: 'Cara Validasi Klaim AI', category: 'Billing', role: ['Kasir', 'Admin'], level: 'Lanjut', status: 'Published', views: 180, prints: 5, rating: 4.4, lastUpdate: '2023-08-02' },
  { id: 'BILL-003', title: 'Cara Cetak Invoice', category: 'Billing', role: ['Kasir'], level: 'Pemula', status: 'Published', views: 450, prints: 60, rating: 4.8, lastUpdate: '2023-08-03' },
  
  // Kategori AI
  { id: 'AI-001', title: 'Cara Pakai AI Scribe', category: 'AI', role: ['Dokter'], level: 'Menengah', status: 'Published', views: 560, prints: 10, rating: 4.9, lastUpdate: '2023-08-01' },
  { id: 'AI-002', title: 'Cara Pakai AI Medical Coder', category: 'AI', role: ['Admin', 'Kasir'], level: 'Lanjut', status: 'Published', views: 230, prints: 5, rating: 4.6, lastUpdate: '2023-08-02' },
  { id: 'AI-003', title: 'Cara Pakai AI Clinical Decision Support', category: 'AI', role: ['Dokter'], level: 'Lanjut', status: 'Published', views: 310, prints: 15, rating: 4.8, lastUpdate: '2023-08-03' },
];

export const dummyCategories = [
  { name: 'BPJS', code: 'BPJS', icon: 'HeartPulse', color: 'blue', count: 5 },
  { name: 'Pendaftaran', code: 'PASIEN', icon: 'UserPlus', color: 'green', count: 4 },
  { name: 'Poli', code: 'POLI', icon: 'Stethoscope', color: 'indigo', count: 4 },
  { name: 'IGD', code: 'IGD', icon: 'Activity', color: 'red', count: 3 },
  { name: 'Farmasi', code: 'FARMA', icon: 'FlaskConical', color: 'yellow', count: 3 },
  { name: 'Billing', code: 'BILL', icon: 'CreditCard', color: 'purple', count: 3 },
  { name: 'AI', code: 'AI', icon: 'Bot', color: 'teal', count: 3 },
];

export const dummyFeedback = [
  { id: 'FB-001', guide: 'Cara Input Data Pasien BPJS', user: 'Dr. Budi', rating: 5, comment: 'Sangat jelas dan membantu', category: 'Membantu', date: '2023-08-05' },
  { id: 'FB-002', guide: 'Cara Generate SEP', user: 'Suster Siti', rating: 3, comment: 'Agak bingung di bagian rujukan', category: 'Membingungkan', date: '2023-08-06' },
  { id: 'FB-003', guide: 'Cara Buat Surat Rujukan', user: 'Dr. Andi', rating: 4, comment: 'Langkah-langkah sudah bagus, mohon tambahkan contoh', category: 'Saran', date: '2023-08-07' },
];

export const dummyDistribution = [
  { id: 'DIST-001', guide: 'Cara Penanganan Emergency', location: ['IGD'], roles: ['Dokter', 'Perawat'], copies: 5, date: '2023-08-01' },
  { id: 'DIST-002', guide: 'Cara Dispensing Obat', location: ['Farmasi Utama'], roles: ['Farmasi'], copies: 3, date: '2023-08-02' },
];
