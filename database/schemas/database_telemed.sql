-- 1. telemed_jenis_konsul
CREATE TABLE telemed_jenis_konsul (
    id_jenis VARCHAR(50) PRIMARY KEY,
    nama_jenis VARCHAR(150) NOT NULL,
    durasi_menit INT NOT NULL,
    tarif DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. telemed_janji_temu
CREATE TABLE telemed_janji_temu (
    id_janji VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    id_dokter VARCHAR(50) NOT NULL,
    id_jenis VARCHAR(50) NOT NULL,
    tanggal_janji DATETIME NOT NULL,
    durasi_menit INT,
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No-Show') DEFAULT 'Scheduled',
    catatan_pasien TEXT,
    link_video VARCHAR(255),
    room_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. telemed_session
CREATE TABLE telemed_session (
    id_session VARCHAR(50) PRIMARY KEY,
    id_janji VARCHAR(50) NOT NULL,
    id_pasien VARCHAR(50) NOT NULL,
    id_dokter VARCHAR(50) NOT NULL,
    tanggal_mulai DATETIME NOT NULL,
    tanggal_selesai DATETIME,
    durasi_aktual_menit INT,
    jenis_sesi ENUM('Video', 'Voice', 'Chat') DEFAULT 'Video',
    recording_url VARCHAR(255),
    chat_transcript JSON,
    status ENUM('Active', 'Ended', 'Failed') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. telemed_chat_message
CREATE TABLE telemed_chat_message (
    id_message VARCHAR(50) PRIMARY KEY,
    id_session VARCHAR(50) NOT NULL,
    sender_id VARCHAR(50) NOT NULL,
    sender_type ENUM('Patient', 'Doctor', 'System') NOT NULL,
    message_type ENUM('Text', 'Image', 'File', 'Sticker') DEFAULT 'Text',
    content TEXT NOT NULL,
    file_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. telemed_prescription
CREATE TABLE telemed_prescription (
    id_prescription VARCHAR(50) PRIMARY KEY,
    id_session VARCHAR(50) NOT NULL,
    id_pasien VARCHAR(50) NOT NULL,
    id_dokter VARCHAR(50) NOT NULL,
    tanggal_resep DATETIME NOT NULL,
    items JSON NOT NULL,
    diagnosis VARCHAR(255),
    kode_icd10 VARCHAR(20),
    catatan_tambahan TEXT,
    status ENUM('Draft', 'Signed', 'Dispensed', 'Cancelled') DEFAULT 'Draft',
    tanda_tangan_digital VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. telemed_remote_monitoring
CREATE TABLE telemed_remote_monitoring (
    id_monitoring VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    device_type ENUM('Blood Pressure', 'Glucose', 'Heart Rate', 'SpO2', 'Weight', 'Temperature', 'Wearable') NOT NULL,
    device_id VARCHAR(100),
    reading_value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20),
    recorded_at DATETIME NOT NULL,
    notes TEXT,
    alert_triggered BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. telemed_medical_record
CREATE TABLE telemed_medical_record (
    id_record VARCHAR(50) PRIMARY KEY,
    id_session VARCHAR(50) NOT NULL,
    id_pasien VARCHAR(50) NOT NULL,
    id_dokter VARCHAR(50) NOT NULL,
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    diagnosis VARCHAR(255),
    kode_icd10 VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. telemed_payment
CREATE TABLE telemed_payment (
    id_payment VARCHAR(50) PRIMARY KEY,
    id_janji VARCHAR(50) NOT NULL,
    id_pasien VARCHAR(50) NOT NULL,
    jumlah DECIMAL(15,2) NOT NULL,
    metode_bayar ENUM('Transfer Bank', 'Kartu Kredit', 'E-Wallet', 'Virtual Account'),
    status ENUM('Pending', 'Paid', 'Refunded', 'Failed') DEFAULT 'Pending',
    transaction_id VARCHAR(100),
    paid_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. telemed_rating
CREATE TABLE telemed_rating (
    id_rating VARCHAR(50) PRIMARY KEY,
    id_session VARCHAR(50) NOT NULL,
    id_pasien VARCHAR(50) NOT NULL,
    id_dokter VARCHAR(50) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    komentar TEXT,
    tanggal_rating DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DUMMY DATA
INSERT INTO telemed_jenis_konsul (id_jenis, nama_jenis, durasi_menit, tarif) VALUES
('JK-001', 'Konsultasi Umum (Video)', 15, 100000.00),
('JK-002', 'Konsultasi Spesialis (Video)', 20, 250000.00),
('JK-003', 'Konsultasi Follow-Up (Chat)', 15, 75000.00);

INSERT INTO telemed_janji_temu (id_janji, id_pasien, id_dokter, id_jenis, tanggal_janji, durasi_menit, status, catatan_pasien, link_video, room_id) VALUES
('JT-001', 'P-001', 'DR-001', 'JK-001', '2026-08-03 10:00:00', 15, 'Completed', 'Demam 3 hari', 'https://meet.telemed.com/room-123', 'room-123'),
('JT-002', 'P-002', 'DR-002', 'JK-002', '2026-08-04 14:00:00', 20, 'Scheduled', 'Nyeri dada', 'https://meet.telemed.com/room-456', 'room-456');

INSERT INTO telemed_session (id_session, id_janji, id_pasien, id_dokter, tanggal_mulai, tanggal_selesai, durasi_aktual_menit, jenis_sesi, status) VALUES
('SES-001', 'JT-001', 'P-001', 'DR-001', '2026-08-03 10:00:00', '2026-08-03 10:15:00', 15, 'Video', 'Ended');

INSERT INTO telemed_chat_message (id_message, id_session, sender_id, sender_type, content) VALUES
('MSG-001', 'SES-001', 'P-001', 'Patient', 'Selamat pagi dok'),
('MSG-002', 'SES-001', 'DR-001', 'Doctor', 'Pagi bapak, mari kita mulai videonya');

INSERT INTO telemed_prescription (id_prescription, id_session, id_pasien, id_dokter, tanggal_resep, items, diagnosis, status) VALUES
('PRES-001', 'SES-001', 'P-001', 'DR-001', '2026-08-03 10:15:00', '[{"obat": "Paracetamol 500mg", "dosis": "3x1", "frekuensi": "Setelah makan", "durasi": "3 hari", "catatan": "Bila demam"}]', 'Fever', 'Signed');

INSERT INTO telemed_remote_monitoring (id_monitoring, id_pasien, device_type, device_id, reading_value, unit, recorded_at, alert_triggered) VALUES
('RM-001', 'P-001', 'Heart Rate', 'Watch-01', 85.00, 'bpm', '2026-08-02 08:00:00', FALSE),
('RM-002', 'P-001', 'SpO2', 'Watch-01', 98.00, '%', '2026-08-02 08:00:00', FALSE),
('RM-003', 'P-002', 'Blood Pressure', 'Tensimeter-02', 150.00, 'mmHg', '2026-08-02 09:00:00', TRUE);

INSERT INTO telemed_medical_record (id_record, id_session, id_pasien, id_dokter, subjective, objective, assessment, plan, diagnosis, kode_icd10) VALUES
('MR-001', 'SES-001', 'P-001', 'DR-001', 'Pasien mengeluh demam 3 hari', 'Suhu terpantau via monitoring 38.5C', 'Observasi febris', 'Paracetamol 3x1', 'Fever', 'R50.9');

INSERT INTO telemed_payment (id_payment, id_janji, id_pasien, jumlah, metode_bayar, status, paid_at) VALUES
('PAY-001', 'JT-001', 'P-001', 100000.00, 'E-Wallet', 'Paid', '2026-08-03 09:50:00'),
('PAY-002', 'JT-002', 'P-002', 250000.00, 'Virtual Account', 'Pending', NULL);

INSERT INTO telemed_rating (id_rating, id_session, id_pasien, id_dokter, rating, komentar, tanggal_rating) VALUES
('RAT-001', 'SES-001', 'P-001', 'DR-001', 5, 'Dokter sangat ramah dan jelas penjelasannya', '2026-08-03 10:20:00');
