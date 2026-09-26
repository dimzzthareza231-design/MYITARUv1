-- 1. safety_incident
CREATE TABLE safety_incident (
    id_incident VARCHAR(50) PRIMARY KEY,
    nomor_incident VARCHAR(50) UNIQUE NOT NULL,
    id_pasien VARCHAR(50),
    id_kunjungan VARCHAR(50),
    tanggal_kejadian DATETIME NOT NULL,
    tanggal_pelaporan DATETIME DEFAULT CURRENT_TIMESTAMP,
    jenis_kejadian ENUM('KTD-Kecelakaan', 'KTD-Kesalahan Medis', 'KTD-Infeksi', 'KTD-Obat', 'KTD-Identitas', 'KTD-Prosedur', 'KTD-Jatuh', 'KTD-Lain', 'KNC-Near Miss', 'KTC-Tidak Cedera', 'Sentinel Event'),
    kategori ENUM('Clinical', 'Non-Clinical', 'Environmental', 'Security'),
    lokasi_kejadian VARCHAR(150),
    deskripsi_kejadian TEXT,
    dampak_ke_pasien ENUM('Tidak Ada', 'Ringan', 'Sedang', 'Berat', 'Meninggal'),
    tindakan_segera TEXT,
    pelapor_id VARCHAR(50),
    nama_pelapor VARCHAR(100),
    anonim BOOLEAN DEFAULT FALSE,
    status ENUM('Reported', 'Under Investigation', 'Closed') DEFAULT 'Reported',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. safety_investigation
CREATE TABLE safety_investigation (
    id_investigation VARCHAR(50) PRIMARY KEY,
    id_incident VARCHAR(50) NOT NULL,
    investigator_id VARCHAR(50),
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE,
    fakta_kejadian TEXT,
    pihak_terlibat JSON,
    wawancara JSON,
    dokumen_pendukung JSON,
    temuan TEXT,
    status ENUM('In Progress', 'Completed') DEFAULT 'In Progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. safety_rca
CREATE TABLE safety_rca (
    id_rca VARCHAR(50) PRIMARY KEY,
    id_incident VARCHAR(50) NOT NULL,
    tanggal_rca DATE NOT NULL,
    tim_rca JSON,
    metode ENUM('Fishbone', '5-Why', 'Fault Tree', 'Timeline'),
    akar_masalah JSON,
    faktor_kontribusi JSON,
    rekomendasi JSON,
    action_plan JSON,
    status ENUM('Draft', 'In Progress', 'Completed') DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. safety_action_plan
CREATE TABLE safety_action_plan (
    id_action VARCHAR(50) PRIMARY KEY,
    id_rca VARCHAR(50),
    id_incident VARCHAR(50),
    deskripsi_action TEXT NOT NULL,
    pic_id VARCHAR(50),
    deadline DATE NOT NULL,
    status ENUM('Planned', 'In Progress', 'Completed', 'Overdue') DEFAULT 'Planned',
    tanggal_selesai DATE,
    bukti_implementasi VARCHAR(255),
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. safety_risk_register
CREATE TABLE safety_risk_register (
    id_risk VARCHAR(50) PRIMARY KEY,
    kode_risk VARCHAR(50) UNIQUE NOT NULL,
    deskripsi_risk TEXT NOT NULL,
    kategori ENUM('Clinical', 'Non-Clinical', 'Financial', 'Strategic', 'Compliance', 'Environmental'),
    likelihood ENUM('1-Rare', '2-Unlikely', '3-Possible', '4-Likely', '5-Almost Certain'),
    impact ENUM('1-Insignificant', '2-Minor', '3-Moderate', '4-Major', '5-Catastrophic'),
    risk_score INT,
    level_risk ENUM('Low', 'Medium', 'High', 'Extreme'),
    mitigation_strategy TEXT,
    risk_owner_id VARCHAR(50),
    tanggal_review DATE,
    status ENUM('Active', 'Mitigated', 'Accepted', 'Avoided') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. safety_psi
CREATE TABLE safety_psi (
    id_psi VARCHAR(50) PRIMARY KEY,
    periode VARCHAR(20) NOT NULL,
    indikator ENUM('Fall Rate', 'Pressure Ulcer Rate', 'HAI Rate', 'Medication Error Rate', 'Restraint Rate', 'Code Blue Rate', 'Sentinel Event Count', 'Hand Hygiene Compliance', 'Patient ID Compliance', 'Surgical Safety Checklist Compliance'),
    nilai DECIMAL(10,2),
    target DECIMAL(10,2),
    unit_pengukur VARCHAR(50),
    data_source TEXT,
    status ENUM('On Track', 'At Risk', 'Off Track'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. safety_patient_safety_goal
CREATE TABLE safety_patient_safety_goal (
    id_goal VARCHAR(50) PRIMARY KEY,
    kode_goal VARCHAR(20) NOT NULL,
    nama_goal VARCHAR(150) NOT NULL,
    deskripsi TEXT,
    standar_ep JSON,
    compliance_rate DECIMAL(5,2),
    tanggal_audit DATE,
    auditor_id VARCHAR(50),
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. safety_audit_checklist
CREATE TABLE safety_audit_checklist (
    id_audit VARCHAR(50) PRIMARY KEY,
    id_goal VARCHAR(50) NOT NULL,
    tanggal_audit DATE NOT NULL,
    auditor_id VARCHAR(50),
    unit_diaudit VARCHAR(100),
    checklist JSON,
    total_compliant INT,
    total_items INT,
    compliance_percentage DECIMAL(5,2),
    temuan TEXT,
    rekomendasi TEXT,
    status ENUM('Draft', 'Submitted', 'Reviewed') DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. safety_safety_rounds
CREATE TABLE safety_safety_rounds (
    id_round VARCHAR(50) PRIMARY KEY,
    tanggal_round DATETIME NOT NULL,
    pemimpin_round VARCHAR(50),
    peserta JSON,
    area_dikunjungi JSON,
    temuan JSON,
    tindakan_segera TEXT,
    follow_up_date DATE,
    status ENUM('Planned', 'Completed') DEFAULT 'Planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. safety_education
CREATE TABLE safety_education (
    id_education VARCHAR(50) PRIMARY KEY,
    judul VARCHAR(150) NOT NULL,
    kategori ENUM('Induction', 'Annual Refresh', 'Specific Topic', 'Incident Learning'),
    target_audience JSON,
    materi TEXT,
    tanggal DATE,
    trainer_id VARCHAR(50),
    peserta_count INT,
    evaluasi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- DUMMY DATA
INSERT INTO safety_incident (id_incident, nomor_incident, id_pasien, id_kunjungan, tanggal_kejadian, jenis_kejadian, kategori, lokasi_kejadian, deskripsi_kejadian, dampak_ke_pasien, tindakan_segera, pelapor_id, nama_pelapor, status) VALUES
('INC-260801', 'SI-2026-08-001', 'P1', 'K-01', '2026-08-01 10:00:00', 'KTD-Jatuh', 'Clinical', 'Ruang Rawat Melati', 'Pasien jatuh saat menuju kamar mandi tanpa pendampingan.', 'Ringan', 'Dilakukan pemeriksaan tanda vital dan fisik. Tidak ada luka serius. Edukasi keluarga.', 'NS-001', 'Suster Rina', 'Reported');

INSERT INTO safety_investigation (id_investigation, id_incident, investigator_id, tanggal_mulai, fakta_kejadian, pihak_terlibat, wawancara, dokumen_pendukung, temuan, status) VALUES
('INV-001', 'INC-260801', 'QM-01', '2026-08-01', 'Pasien bangun dari tempat tidur tanpa memanggil perawat. Lantai tidak licin.', '["NS-001", "Keluarga Pasien"]', '[{"orang": "Suster Rina", "waktu": "10:30", "hasil": "Bell pasien tidak ditekan."}]', '["Foto lokasi kejadian", "Rekam medis pasien"]', 'Pasien tidak memahami cara memanggil perawat atau merasa bisa sendiri.', 'Completed');

INSERT INTO safety_rca (id_rca, id_incident, tanggal_rca, tim_rca, metode, akar_masalah, faktor_kontribusi, rekomendasi, action_plan, status) VALUES
('RCA-001', 'INC-260801', '2026-08-02', '["QM-01", "NS-Kepala"]', '5-Why', '["Edukasi penggunaan bel panggil kurang efektif"]', '{"human": "Pasien merasa mandiri", "environment": "Cahaya redup", "equipment": "Bel fungsi", "process": "Edukasi tidak didokumentasi dengan baik", "external": "Tidak ada"}', '["Tingkatkan edukasi resiko jatuh", "Pasang tanda risiko jatuh di bed"]', '[{"action": "Re-edukasi pasien dan keluarga", "PIC": "NS-001", "deadline": "2026-08-02", "status": "Completed"}]', 'Completed');

INSERT INTO safety_action_plan (id_action, id_rca, id_incident, deskripsi_action, pic_id, deadline, status, catatan) VALUES
('AP-001', 'RCA-001', 'INC-260801', 'Re-edukasi pasien dan keluarga terkait risiko jatuh', 'NS-001', '2026-08-02', 'Completed', 'Sudah dilakukan dan didokumentasikan di RM');

INSERT INTO safety_risk_register (id_risk, kode_risk, deskripsi_risk, kategori, likelihood, impact, risk_score, level_risk, mitigation_strategy, risk_owner_id, status) VALUES
('RSK-001', 'R-CLN-01', 'Risiko kesalahan pemberian obat High Alert', 'Clinical', '2-Unlikely', '4-Major', 8, 'Medium', 'Double check system, pelabelan khusus', 'PHAR-01', 'Active');

INSERT INTO safety_psi (id_psi, periode, indikator, nilai, target, unit_pengukur, data_source, status) VALUES
('PSI-001', '2026-Q3', 'Fall Rate', 1.5, 0.0, 'Per 1000 hari rawat', 'Insiden report bulanan', 'Off Track');

INSERT INTO safety_patient_safety_goal (id_goal, kode_goal, nama_goal, deskripsi, compliance_rate, tanggal_audit) VALUES
('PSG-001', 'IPSG-1', 'Identifikasi Pasien dengan Benar', 'Pastikan identifikasi menggunakan 2 identifier', 98.5, '2026-07-30');

INSERT INTO safety_audit_checklist (id_audit, id_goal, tanggal_audit, auditor_id, unit_diaudit, checklist, total_compliant, total_items, compliance_percentage, status) VALUES
('AUD-001', 'PSG-001', '2026-07-30', 'QM-01', 'Rawat Inap Melati', '[{"item": "Gelang identitas terpasang", "compliant": true}, {"item": "Perawat mengkonfirmasi 2 identifier sblm tindakan", "compliant": true}]', 10, 10, 100.00, 'Submitted');

INSERT INTO safety_safety_rounds (id_round, tanggal_round, pemimpin_round, peserta, area_dikunjungi, temuan, tindakan_segera, status) VALUES
('RND-001', '2026-08-01 14:00:00', 'DIR-01', '["QM-01", "NS-Kepala"]', '["IGD", "Farmasi"]', '[{"area": "IGD", "temuan": "Kabel EKG menjuntai", "risiko": "Tersandung", "rekomendasi": "Rapikan kabel"}]', 'Kabel dirapikan langsung', 'Completed');

INSERT INTO safety_education (id_education, judul, kategori, target_audience, materi, tanggal, trainer_id, peserta_count) VALUES
('EDU-001', 'Induction Safety Training', 'Induction', '["Perawat Baru", "Dokter Baru"]', 'Pengenalan IPSG dan sistem pelaporan insiden', '2026-08-01', 'QM-01', 25);
