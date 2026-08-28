-- 1. crm_patient_segment
CREATE TABLE crm_patient_segment (
    id_segment VARCHAR(50) PRIMARY KEY,
    nama_segment VARCHAR(100) NOT NULL,
    kriteria JSON,
    warna VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. crm_campaign
CREATE TABLE crm_campaign (
    id_campaign VARCHAR(50) PRIMARY KEY,
    nama_campaign VARCHAR(150) NOT NULL,
    jenis ENUM('Follow-Up', 'Reminder', 'Promo', 'Edukasi', 'Survey', 'Greeting'),
    target_segment JSON,
    channel ENUM('WhatsApp', 'SMS', 'Email', 'Phone', 'Letter'),
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    konten_pesan TEXT,
    status ENUM('Draft', 'Active', 'Completed') DEFAULT 'Draft',
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. crm_message_log
CREATE TABLE crm_message_log (
    id_log VARCHAR(50) PRIMARY KEY,
    id_campaign VARCHAR(50),
    id_pasien VARCHAR(50) NOT NULL,
    channel VARCHAR(20),
    nomor_tujuan VARCHAR(50),
    pesan TEXT,
    status ENUM('Sent', 'Delivered', 'Read', 'Failed', 'Bounced') DEFAULT 'Sent',
    tanggal_kirim DATETIME NOT NULL,
    tanggal_baca DATETIME,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. crm_appointment_reminder
CREATE TABLE crm_appointment_reminder (
    id_reminder VARCHAR(50) PRIMARY KEY,
    id_kunjungan VARCHAR(50) NOT NULL,
    id_pasien VARCHAR(50) NOT NULL,
    tanggal_janji DATETIME NOT NULL,
    reminder_1_sent BOOLEAN DEFAULT FALSE,
    reminder_1_time DATETIME,
    reminder_2_sent BOOLEAN DEFAULT FALSE,
    reminder_2_time DATETIME,
    konfirmasi ENUM('Pending', 'Confirmed', 'Cancelled', 'Rescheduled', 'No-Response') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. crm_follow_up
CREATE TABLE crm_follow_up (
    id_followup VARCHAR(50) PRIMARY KEY,
    id_kunjungan VARCHAR(50) NOT NULL,
    id_pasien VARCHAR(50) NOT NULL,
    jenis_followup ENUM('Post-Op', 'Post-Discharge', 'Chronic Care', 'Medication Adherence'),
    tanggal_rencana DATE NOT NULL,
    tanggal_aktual DATETIME,
    hasil TEXT,
    status ENUM('Planned', 'Completed', 'Cancelled') DEFAULT 'Planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. crm_satisfaction_survey
CREATE TABLE crm_satisfaction_survey (
    id_survey VARCHAR(50) PRIMARY KEY,
    id_kunjungan VARCHAR(50),
    id_pasien VARCHAR(50) NOT NULL,
    jenis_survey ENUM('Post-Visit', 'Inpatient', 'Emergency', 'Overall'),
    tanggal_survey DATETIME NOT NULL,
    rating_overall INT CHECK (rating_overall BETWEEN 1 AND 5),
    rating_dokter INT,
    rating_perawat INT,
    rating_fasilitas INT,
    rating_pelayanan INT,
    komentar TEXT,
    status ENUM('Pending', 'Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. crm_complaint
CREATE TABLE crm_complaint (
    id_complaint VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50),
    id_kunjungan VARCHAR(50),
    tanggal_keluhan DATETIME NOT NULL,
    kategori ENUM('Pelayanan Medis', 'Administrasi', 'Fasilitas', 'Komunikasi', 'Waktu Tunggu', 'Lain-lain'),
    channel_masuk ENUM('Langsung', 'Telepon', 'Email', 'WhatsApp', 'Media Sosial', 'Kotak Saran'),
    deskripsi TEXT NOT NULL,
    prioritas ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Low',
    status ENUM('Received', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Received',
    assigned_to VARCHAR(50),
    tanggal_resolved DATETIME,
    resolusi TEXT,
    kepuasan_pasien INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. crm_loyalty_program
CREATE TABLE crm_loyalty_program (
    id_loyalty VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL UNIQUE,
    total_poin INT DEFAULT 0,
    tier ENUM('Silver', 'Gold', 'Platinum', 'Diamond') DEFAULT 'Silver',
    tanggal_join DATE NOT NULL,
    tanggal_upgrade DATE,
    benefits JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. crm_loyalty_transaction
CREATE TABLE crm_loyalty_transaction (
    id_transaction VARCHAR(50) PRIMARY KEY,
    id_loyalty VARCHAR(50) NOT NULL,
    jenis ENUM('Earn', 'Redeem', 'Expire'),
    poin INT NOT NULL,
    keterangan TEXT,
    tanggal DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. crm_greeting
CREATE TABLE crm_greeting (
    id_greeting VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    jenis ENUM('Birthday', 'Anniversary', 'Holiday', 'Get Well'),
    tanggal_kirim DATE NOT NULL,
    pesan TEXT,
    status ENUM('Scheduled', 'Sent', 'Failed') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- DUMMY DATA
INSERT INTO crm_patient_segment (id_segment, nama_segment, kriteria, warna) VALUES
('SEG-001', 'VIP', '{"tier": ["Platinum", "Diamond"]}', 'purple'),
('SEG-002', 'Ibu Hamil', '{"poli": ["Kandungan"]}', 'pink'),
('SEG-003', 'Kronis (Diabetes/Hipertensi)', '{"icd10": ["E11", "I10"]}', 'blue');

INSERT INTO crm_campaign (id_campaign, nama_campaign, jenis, target_segment, channel, tanggal_mulai, tanggal_selesai, konten_pesan, status, created_by) VALUES
('CMP-001', 'Promo Medical Checkup Kemerdekaan', 'Promo', '["SEG-001"]', 'WhatsApp', '2026-08-01', '2026-08-31', 'Halo [Nama], dapatkan diskon 17% untuk paket MCU Kemerdekaan...', 'Active', 'MKT-01'),
('CMP-002', 'Reminder Senam Hamil', 'Edukasi', '["SEG-002"]', 'WhatsApp', '2026-08-01', '2026-12-31', 'Bunda [Nama], jangan lupa ikuti senam hamil setiap Sabtu...', 'Active', 'MKT-01');

INSERT INTO crm_message_log (id_log, id_campaign, id_pasien, channel, nomor_tujuan, pesan, status, tanggal_kirim) VALUES
('LOG-001', 'CMP-001', 'P-001', 'WhatsApp', '081234567890', 'Halo Bpk Budi, dapatkan diskon 17%...', 'Delivered', '2026-08-01 10:00:00'),
('LOG-002', 'CMP-002', 'P-002', 'WhatsApp', '081298765432', 'Bunda Siti, jangan lupa ikuti senam hamil...', 'Read', '2026-08-01 10:05:00');

INSERT INTO crm_appointment_reminder (id_reminder, id_kunjungan, id_pasien, tanggal_janji, reminder_1_sent, konfirmasi) VALUES
('REM-001', 'K-001', 'P-001', '2026-08-05 09:00:00', TRUE, 'Confirmed'),
('REM-002', 'K-002', 'P-003', '2026-08-06 10:00:00', FALSE, 'Pending');

INSERT INTO crm_follow_up (id_followup, id_kunjungan, id_pasien, jenis_followup, tanggal_rencana, status) VALUES
('FU-001', 'K-010', 'P-005', 'Post-Op', '2026-08-03', 'Planned'),
('FU-002', 'K-011', 'P-006', 'Post-Discharge', '2026-08-01', 'Completed');

INSERT INTO crm_satisfaction_survey (id_survey, id_kunjungan, id_pasien, jenis_survey, tanggal_survey, rating_overall, komentar, status) VALUES
('SRV-001', 'K-020', 'P-007', 'Post-Visit', '2026-08-01 12:00:00', 5, 'Pelayanan dokter sangat baik dan ramah', 'Completed'),
('SRV-002', 'K-021', 'P-008', 'Post-Visit', '2026-08-02 14:00:00', 3, 'Waktu tunggu obat farmasi terlalu lama', 'Completed');

INSERT INTO crm_complaint (id_complaint, id_pasien, id_kunjungan, tanggal_keluhan, kategori, channel_masuk, deskripsi, prioritas, status) VALUES
('CMPL-001', 'P-008', 'K-021', '2026-08-02 14:30:00', 'Waktu Tunggu', 'Langsung', 'Menunggu obat racikan lebih dari 2 jam', 'Medium', 'In Progress'),
('CMPL-002', 'P-010', NULL, '2026-08-01 09:00:00', 'Fasilitas', 'WhatsApp', 'AC di ruang tunggu poli anak kurang dingin', 'Low', 'Resolved');

INSERT INTO crm_loyalty_program (id_loyalty, id_pasien, total_poin, tier, tanggal_join) VALUES
('LYL-001', 'P-001', 1500, 'Gold', '2025-01-01'),
('LYL-002', 'P-002', 500, 'Silver', '2026-05-10');

INSERT INTO crm_loyalty_transaction (id_transaction, id_loyalty, jenis, poin, keterangan, tanggal) VALUES
('TRX-001', 'LYL-001', 'Earn', 100, 'Kunjungan Rawat Jalan', '2026-08-01 10:00:00'),
('TRX-002', 'LYL-001', 'Redeem', 500, 'Voucher Diskon Lab', '2026-08-02 09:00:00');

INSERT INTO crm_greeting (id_greeting, id_pasien, jenis, tanggal_kirim, pesan, status) VALUES
('GRT-001', 'P-001', 'Birthday', '2026-08-15', 'Selamat Ulang Tahun Bpk Budi...', 'Scheduled');
