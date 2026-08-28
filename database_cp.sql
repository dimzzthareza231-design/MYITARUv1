-- 1. cp_pathway
CREATE TABLE cp_pathway (
    id_pathway VARCHAR(50) PRIMARY KEY,
    kode_pathway VARCHAR(20) UNIQUE NOT NULL,
    nama_pathway VARCHAR(150) NOT NULL,
    diagnosis_utama VARCHAR(150),
    kode_icd10 VARCHAR(20),
    kategori ENUM('Medis', 'Bedah', 'Obstetri', 'Pediatri', 'Lain-lain'),
    expected_los_days INT,
    versi VARCHAR(10),
    status ENUM('Draft', 'Active', 'Archived') DEFAULT 'Draft',
    dibuat_oleh VARCHAR(50),
    tanggal_efektif DATE,
    tanggal_review DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. cp_pathway_day
CREATE TABLE cp_pathway_day (
    id_day VARCHAR(50) PRIMARY KEY,
    id_pathway VARCHAR(50) NOT NULL,
    hari_ke INT NOT NULL,
    kategori ENUM('Assessment', 'Diagnostic', 'Therapeutic', 'Medication', 'Nutrition', 'Activity', 'Education', 'Discharge Planning'),
    aktivitas TEXT,
    pic ENUM('Dokter', 'Perawat', 'Gizi', 'Farmasi', 'Lab', 'Radiologi', 'Rehab', 'Lain-lain'),
    expected_output TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. cp_patient_pathway
CREATE TABLE cp_patient_pathway (
    id_patient_pathway VARCHAR(50) PRIMARY KEY,
    id_pathway VARCHAR(50) NOT NULL,
    id_pasien VARCHAR(50) NOT NULL,
    id_kunjungan VARCHAR(50) NOT NULL,
    tanggal_masuk DATE NOT NULL,
    tanggal_target_keluar DATE NOT NULL,
    tanggal_keluar_aktual DATE,
    hari_ke_saat_ini INT DEFAULT 1,
    status ENUM('On-Track', 'Variance', 'Completed', 'Discontinued') DEFAULT 'On-Track',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. cp_variance
CREATE TABLE cp_variance (
    id_variance VARCHAR(50) PRIMARY KEY,
    id_patient_pathway VARCHAR(50) NOT NULL,
    hari_ke INT NOT NULL,
    tanggal DATE NOT NULL,
    kategori_variance ENUM('Patient', 'Staff', 'System'),
    jenis_variance ENUM('Delay', 'Complication', 'Non-Compliance', 'System Issue', 'Lain-lain'),
    deskripsi TEXT,
    dampak TEXT,
    tindakan_koreksi TEXT,
    reported_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. cp_outcome
CREATE TABLE cp_outcome (
    id_outcome VARCHAR(50) PRIMARY KEY,
    id_patient_pathway VARCHAR(50) NOT NULL,
    los_aktual INT,
    los_target INT,
    complication BOOLEAN DEFAULT FALSE,
    readmission_30hari BOOLEAN DEFAULT FALSE,
    mortality BOOLEAN DEFAULT FALSE,
    patient_satisfaction INT,
    biaya_aktual DECIMAL(15,2),
    biaya_target DECIMAL(15,2),
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. cp_audit
CREATE TABLE cp_audit (
    id_audit VARCHAR(50) PRIMARY KEY,
    id_pathway VARCHAR(50) NOT NULL,
    periode VARCHAR(20),
    total_pasien INT,
    on_track_count INT,
    variance_count INT,
    average_los DECIMAL(5,2),
    compliance_rate DECIMAL(5,2),
    auditor_id VARCHAR(50),
    tanggal_audit DATE,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DUMMY DATA
INSERT INTO cp_pathway (id_pathway, kode_pathway, nama_pathway, diagnosis_utama, kode_icd10, kategori, expected_los_days, versi, status, tanggal_efektif) VALUES
('CP-001', 'CP-PNEUM', 'Clinical Pathway Pneumonia', 'Pneumonia', 'J18.9', 'Medis', 5, '1.0', 'Active', '2026-01-01'),
('CP-002', 'CP-APP', 'Clinical Pathway Appendicitis Akut (Laparoskopi)', 'Appendicitis Akut', 'K35.8', 'Bedah', 3, '2.0', 'Active', '2026-03-15');

INSERT INTO cp_pathway_day (id_day, id_pathway, hari_ke, kategori, aktivitas, pic, expected_output) VALUES
('CPD-001', 'CP-001', 1, 'Assessment', 'Pemeriksaan fisik lengkap & TTV tiap 4 jam', 'Perawat', 'Kondisi hemodinamik stabil termonitor'),
('CPD-002', 'CP-001', 1, 'Diagnostic', 'Ro Thorax AP/PA, Darah Rutin, Elektrolit', 'Radiologi', 'Hasil Ro dan Lab keluar dalam 2 jam'),
('CPD-003', 'CP-001', 1, 'Medication', 'Antibiotik empiris IV dosis pertama', 'Perawat', 'Antibiotik masuk dlm 4 jam pertama'),
('CPD-004', 'CP-002', 1, 'Assessment', 'Evaluasi post op, TTV tiap 2 jam', 'Perawat', 'Pasien sadar baik, nyeri terkontrol');

INSERT INTO cp_patient_pathway (id_patient_pathway, id_pathway, id_pasien, id_kunjungan, tanggal_masuk, tanggal_target_keluar, hari_ke_saat_ini, status) VALUES
('CPP-001', 'CP-001', 'P-001', 'K-001', '2026-08-01', '2026-08-06', 2, 'Variance'),
('CPP-002', 'CP-002', 'P-002', 'K-002', '2026-08-02', '2026-08-05', 1, 'On-Track');

INSERT INTO cp_variance (id_variance, id_patient_pathway, hari_ke, tanggal, kategori_variance, jenis_variance, deskripsi, dampak, tindakan_koreksi, reported_by) VALUES
('CV-001', 'CPP-001', 2, '2026-08-02', 'Patient', 'Complication', 'SpO2 turun <90% dengan udara bebas', 'Perlu O2 tambahan, LOS mungkin mundur', 'Pasang O2 nasal kanul 3 lpm', 'DR-01');

INSERT INTO cp_outcome (id_outcome, id_patient_pathway, los_aktual, los_target, complication, biaya_aktual, biaya_target) VALUES
('CO-001', 'CPP-002', 3, 3, FALSE, 12500000.00, 13000000.00);

INSERT INTO cp_audit (id_audit, id_pathway, periode, total_pasien, on_track_count, variance_count, average_los, compliance_rate, tanggal_audit) VALUES
('CA-001', 'CP-001', '2026-Q2', 45, 30, 15, 5.5, 66.67, '2026-07-15');

