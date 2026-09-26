-- 1. portal_user_account
CREATE TABLE portal_user_account (
    id_account VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    profile_photo_url VARCHAR(255),
    preferred_language ENUM('ID', 'EN') DEFAULT 'ID',
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. portal_appointment_booking
CREATE TABLE portal_appointment_booking (
    id_booking VARCHAR(50) PRIMARY KEY,
    id_account VARCHAR(50) NOT NULL,
    id_pasien VARCHAR(50) NOT NULL,
    id_poli VARCHAR(50) NOT NULL,
    id_dokter VARCHAR(50),
    tanggal_booking DATETIME NOT NULL,
    jam_pilihan TIME NOT NULL,
    keluhan TEXT,
    jenis_penjamin VARCHAR(100),
    status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. portal_document_access
CREATE TABLE portal_document_access (
    id_access VARCHAR(50) PRIMARY KEY,
    id_account VARCHAR(50) NOT NULL,
    jenis_dokumen ENUM('Rekam Medis', 'Hasil Lab', 'Hasil Radiologi', 'Resep', 'Surat Keterangan', 'Invoice') NOT NULL,
    id_referensi BIGINT,
    tanggal_akses DATETIME NOT NULL,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. portal_payment
CREATE TABLE portal_payment (
    id_payment VARCHAR(50) PRIMARY KEY,
    id_account VARCHAR(50) NOT NULL,
    id_kunjungan VARCHAR(50),
    nomor_tagihan VARCHAR(100) NOT NULL,
    jumlah DECIMAL(15,2) NOT NULL,
    metode ENUM('VA', 'E-Wallet', 'Kartu Kredit', 'QRIS'),
    status ENUM('Pending', 'Paid', 'Expired', 'Failed') DEFAULT 'Pending',
    transaction_id VARCHAR(100),
    paid_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. portal_health_journal
CREATE TABLE portal_health_journal (
    id_journal VARCHAR(50) PRIMARY KEY,
    id_account VARCHAR(50) NOT NULL,
    tanggal DATE NOT NULL,
    gejala TEXT,
    tanda_vital JSON,
    obat_diminum JSON,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. portal_education
CREATE TABLE portal_education (
    id_education VARCHAR(50) PRIMARY KEY,
    judul VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    konten TEXT NOT NULL,
    foto_url VARCHAR(255),
    video_url VARCHAR(255),
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. portal_chat
CREATE TABLE portal_chat (
    id_chat VARCHAR(50) PRIMARY KEY,
    id_account VARCHAR(50) NOT NULL,
    subjek VARCHAR(255) NOT NULL,
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    assigned_to VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. portal_chat_message
CREATE TABLE portal_chat_message (
    id_message VARCHAR(50) PRIMARY KEY,
    id_chat VARCHAR(50) NOT NULL,
    sender_type ENUM('Patient', 'Staff') NOT NULL,
    message TEXT NOT NULL,
    attachment_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DUMMY DATA
INSERT INTO portal_user_account (id_account, id_pasien, username, password_hash, email_verified, phone_verified, preferred_language, last_login, is_active) VALUES
('ACC-001', 'P-001', 'budi_santoso', 'hash123', TRUE, TRUE, 'ID', '2026-08-02 10:00:00', TRUE),
('ACC-002', 'P-002', 'ani_yudhoyono', 'hash456', TRUE, FALSE, 'ID', '2026-08-01 14:00:00', TRUE);

INSERT INTO portal_appointment_booking (id_booking, id_account, id_pasien, id_poli, id_dokter, tanggal_booking, jam_pilihan, keluhan, jenis_penjamin, status) VALUES
('BOOK-001', 'ACC-001', 'P-001', 'POL-001', 'DR-001', '2026-08-05 00:00:00', '09:00:00', 'Demam tinggi', 'BPJS', 'Confirmed'),
('BOOK-002', 'ACC-002', 'P-002', 'POL-002', 'DR-002', '2026-08-06 00:00:00', '14:30:00', 'Nyeri dada', 'Umum', 'Pending');

INSERT INTO portal_document_access (id_access, id_account, jenis_dokumen, id_referensi, tanggal_akses, ip_address) VALUES
('ACC-DOC-001', 'ACC-001', 'Hasil Lab', 12345, '2026-08-01 08:00:00', '192.168.1.1'),
('ACC-DOC-002', 'ACC-001', 'Resep', 12346, '2026-08-01 08:05:00', '192.168.1.1');

INSERT INTO portal_payment (id_payment, id_account, id_kunjungan, nomor_tagihan, jumlah, metode, status, paid_at) VALUES
('PAY-001', 'ACC-001', 'KUNJ-001', 'INV-2026-001', 150000.00, 'QRIS', 'Paid', '2026-08-01 09:00:00'),
('PAY-002', 'ACC-002', 'KUNJ-002', 'INV-2026-002', 300000.00, 'VA', 'Pending', NULL);

INSERT INTO portal_health_journal (id_journal, id_account, tanggal, gejala, tanda_vital, obat_diminum, catatan) VALUES
('JRN-001', 'ACC-001', '2026-08-01', 'Sakit kepala, demam', '{"TD": "120/80", "nadi": 85, "suhu": 38.5, "BB": 70}', '["Paracetamol 500mg"]', 'Istirahat di rumah'),
('JRN-002', 'ACC-002', '2026-08-01', 'Sesak napas', '{"TD": "140/90", "nadi": 90, "suhu": 37.0, "BB": 65}', '["Obat Asma"]', 'Menghindari debu');

INSERT INTO portal_education (id_education, judul, kategori, konten, view_count) VALUES
('EDU-001', 'Pentingnya Vaksinasi Flu', 'Pencegahan', 'Vaksinasi flu sangat penting untuk mencegah...', 150),
('EDU-002', 'Cara Mengelola Hipertensi', 'Penyakit Kronis', 'Hipertensi dapat dikelola dengan diet dan...', 300);

INSERT INTO portal_chat (id_chat, id_account, subjek, status) VALUES
('CHT-001', 'ACC-001', 'Pertanyaan Jadwal Dokter Spesialis Jantung', 'Resolved'),
('CHT-002', 'ACC-002', 'Kendala Pembayaran Online', 'In Progress');

INSERT INTO portal_chat_message (id_message, id_chat, sender_type, message) VALUES
('MSG-001', 'CHT-001', 'Patient', 'Selamat pagi, dokter Budi hari ini praktek jam berapa?'),
('MSG-002', 'CHT-001', 'Staff', 'Selamat pagi, dokter Budi praktek jam 14:00 - 16:00.');
