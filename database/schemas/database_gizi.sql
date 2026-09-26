-- 1. gizi_assessment
CREATE TABLE gizi_assessment (
    id_assessment VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    id_kunjungan VARCHAR(50) NOT NULL,
    tanggal_assessment DATETIME NOT NULL,
    jenis_screening ENUM('SGA', 'MNA', 'MUST', 'NRS-2002', 'STUNT'),
    tinggi_badan_cm DECIMAL(5,2),
    berat_badan_kg DECIMAL(5,2),
    bmi DECIMAL(5,2) GENERATED ALWAYS AS (berat_badan_kg / ((tinggi_badan_cm/100) * (tinggi_badan_cm/100))) STORED,
    lingkar_lengan_cm DECIMAL(5,2),
    lingkar_perut_cm DECIMAL(5,2),
    skor_screening DECIMAL(5,2),
    status_gizi ENUM('Gizi Baik', 'Gizi Kurang', 'Gizi Buruk', 'Obesitas', 'Overweight'),
    risiko_gizi ENUM('Rendah', 'Sedang', 'Tinggi'),
    alergi_makanan JSON,
    preferensi_makanan JSON,
    keluhan_gi TEXT,
    catatan TEXT,
    dinutrisi VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. gizi_diet_prescription
CREATE TABLE gizi_diet_prescription (
    id_prescription VARCHAR(50) PRIMARY KEY,
    id_assessment VARCHAR(50) NOT NULL,
    id_pasien VARCHAR(50) NOT NULL,
    id_kunjungan VARCHAR(50) NOT NULL,
    jenis_diet ENUM('Diet Biasa', 'Diet Lunak', 'Diet Cair', 'Diet Rendah Garam', 'Diet Rendah Lemak', 'Diet Diabetes', 'Diet Rendah Purin', 'Diet Tinggi Protein', 'Diet Rendah Protein', 'Diet Bebas Gluten', 'Diet Halal', 'Vegetarian', 'Vegan'),
    kalori_harian_kkal INT,
    protein_gram DECIMAL(6,2),
    lemak_gram DECIMAL(6,2),
    karbohidrat_gram DECIMAL(6,2),
    serat_gram DECIMAL(6,2),
    natrium_mg DECIMAL(8,2),
    cairan_ml INT,
    frekuensi_makan VARCHAR(100),
    pantangan TEXT,
    suplement JSON,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE,
    status ENUM('Active', 'Completed', 'Cancelled') DEFAULT 'Active',
    dinutrisi VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. gizi_menu_template
CREATE TABLE gizi_menu_template (
    id_menu VARCHAR(50) PRIMARY KEY,
    kode_menu VARCHAR(20) UNIQUE NOT NULL,
    nama_menu VARCHAR(100) NOT NULL,
    jenis_diet JSON,
    waktu_makan ENUM('Pagi', 'Selingan Pagi', 'Siang', 'Selingan Sore', 'Malam'),
    kalori_kkal INT,
    protein_gram DECIMAL(6,2),
    lemak_gram DECIMAL(6,2),
    karbohidrat_gram DECIMAL(6,2),
    deskripsi TEXT,
    foto_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. gizi_intake_monitoring
CREATE TABLE gizi_intake_monitoring (
    id_intake VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    id_kunjungan VARCHAR(50) NOT NULL,
    tanggal DATE NOT NULL,
    waktu_makan ENUM('Pagi', 'Selingan Pagi', 'Siang', 'Selingan Sore', 'Malam'),
    menu_diberikan VARCHAR(255),
    porsi_dihabiskan_persen INT,
    kalori_aktual_kkal INT,
    catatan TEXT,
    dicatat_oleh VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. gizi_education
CREATE TABLE gizi_education (
    id_education VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    id_kunjungan VARCHAR(50),
    topik VARCHAR(150),
    materi TEXT,
    metode ENUM('Konseling Individual', 'Kelompok', 'Leaflet', 'Video', 'Demo Masak'),
    tanggal_edukasi DATETIME NOT NULL,
    pemahaman_pasien ENUM('Baik', 'Cukup', 'Kurang'),
    pertanyaan_pasien TEXT,
    diedukasi_oleh VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. gizi_anthropometry
CREATE TABLE gizi_anthropometry (
    id_anthro VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    tanggal_ukur DATE NOT NULL,
    berat_badan_kg DECIMAL(5,2),
    tinggi_badan_cm DECIMAL(5,2),
    bmi DECIMAL(5,2) GENERATED ALWAYS AS (berat_badan_kg / ((tinggi_badan_cm/100) * (tinggi_badan_cm/100))) STORED,
    lingkar_lengan_cm DECIMAL(5,2),
    lingkar_pinggang_cm DECIMAL(5,2),
    lingkar_pinggul_cm DECIMAL(5,2),
    persentase_lemak DECIMAL(5,2),
    perubahan_berat_kg DECIMAL(5,2),
    dicatat_oleh VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. gizi_order_to_kitchen
CREATE TABLE gizi_order_to_kitchen (
    id_order VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    id_kunjungan VARCHAR(50) NOT NULL,
    tanggal_order DATETIME NOT NULL,
    waktu_makan ENUM('Pagi', 'Siang', 'Malam', 'Selingan'),
    jenis_diet VARCHAR(100),
    menu JSON,
    catatan_khusus TEXT,
    status ENUM('Ordered', 'Preparing', 'Served', 'Cancelled') DEFAULT 'Ordered',
    waktu_saji DATETIME,
    delivered_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. gizi_supplement_tracking
CREATE TABLE gizi_supplement_tracking (
    id_track VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    id_kunjungan VARCHAR(50) NOT NULL,
    nama_supplement VARCHAR(150) NOT NULL,
    dosis VARCHAR(50),
    frekuensi VARCHAR(50),
    tanggal_mulai DATE NOT NULL,
    tanggal_berhenti DATE,
    kepatuhan ENUM('Baik', 'Sedang', 'Buruk'),
    efek_samping TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DUMMY DATA
INSERT INTO gizi_assessment (id_assessment, id_pasien, id_kunjungan, tanggal_assessment, jenis_screening, tinggi_badan_cm, berat_badan_kg, lingkar_lengan_cm, lingkar_perut_cm, skor_screening, status_gizi, risiko_gizi, alergi_makanan, preferensi_makanan, keluhan_gi, catatan, dinutrisi) VALUES
('GA-001', 'P1', 'K-01', '2026-08-01 09:00:00', 'MUST', 165.0, 55.0, 24.5, 80.0, 2.0, 'Gizi Baik', 'Sedang', '["Seafood"]', '["Ayam"]', 'Mual', 'Perlu observasi', 'U-NUT-01');

INSERT INTO gizi_diet_prescription (id_prescription, id_assessment, id_pasien, id_kunjungan, jenis_diet, kalori_harian_kkal, protein_gram, lemak_gram, karbohidrat_gram, serat_gram, natrium_mg, cairan_ml, frekuensi_makan, pantangan, tanggal_mulai, status) VALUES
('GDP-001', 'GA-001', 'P1', 'K-01', 'Diet Rendah Garam', 1800, 60.0, 40.0, 250.0, 25.0, 1500.0, 1500, '3x makan utama + 2x selingan', 'Garam berlebih, makanan kaleng', '2026-08-01', 'Active');

INSERT INTO gizi_menu_template (id_menu, kode_menu, nama_menu, jenis_diet, waktu_makan, kalori_kkal, protein_gram, lemak_gram, karbohidrat_gram, deskripsi) VALUES
('MNU-001', 'M-PG-01', 'Nasi Tim Ayam Jamur', '["Diet Biasa", "Diet Rendah Garam"]', 'Pagi', 450, 15.0, 12.0, 60.0, 'Nasi tim dengan dada ayam rebus dan jamur merang');

INSERT INTO gizi_intake_monitoring (id_intake, id_pasien, id_kunjungan, tanggal, waktu_makan, menu_diberikan, porsi_dihabiskan_persen, kalori_aktual_kkal, catatan) VALUES
('GIM-001', 'P1', 'K-01', '2026-08-01', 'Pagi', 'Nasi Tim Ayam Jamur', 75, 337, 'Pasien merasa kenyang');

INSERT INTO gizi_education (id_education, id_pasien, id_kunjungan, topik, materi, metode, tanggal_edukasi, pemahaman_pasien) VALUES
('GED-001', 'P1', 'K-01', 'Edukasi Diet Hipertensi', 'Pentingnya membatasi asupan natrium dan menghindari makanan olahan.', 'Konseling Individual', '2026-08-01 10:30:00', 'Baik');

INSERT INTO gizi_anthropometry (id_anthro, id_pasien, tanggal_ukur, berat_badan_kg, tinggi_badan_cm) VALUES
('GAN-001', 'P1', '2026-08-01', 55.0, 165.0);

INSERT INTO gizi_order_to_kitchen (id_order, id_pasien, id_kunjungan, tanggal_order, waktu_makan, jenis_diet, menu, catatan_khusus, status) VALUES
('GOK-001', 'P1', 'K-01', '2026-08-01 06:00:00', 'Pagi', 'Diet Rendah Garam', '["Nasi Tim Ayam Jamur"]', 'Tanpa MSG', 'Served');

INSERT INTO gizi_supplement_tracking (id_track, id_pasien, id_kunjungan, nama_supplement, dosis, frekuensi, tanggal_mulai, kepatuhan) VALUES
('GST-001', 'P1', 'K-01', 'Vitamin B Complex', '1 tablet', '1x1', '2026-08-01', 'Baik');
