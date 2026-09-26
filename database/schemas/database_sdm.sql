-- 1. sdm_departemen
CREATE TABLE sdm_departemen (
    id_departemen VARCHAR(50) PRIMARY KEY,
    kode_departemen VARCHAR(20) UNIQUE NOT NULL,
    nama_departemen VARCHAR(150) NOT NULL,
    kepala_departemen_id VARCHAR(50),
    parent_departemen_id VARCHAR(50),
    jenis ENUM('Medis', 'Keperawatan', 'Penunjang', 'Administratif', 'Manajemen'),
    lokasi VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. sdm_jabatan
CREATE TABLE sdm_jabatan (
    id_jabatan VARCHAR(50) PRIMARY KEY,
    kode_jabatan VARCHAR(20) UNIQUE NOT NULL,
    nama_jabatan VARCHAR(150) NOT NULL,
    level ENUM('Staff', 'Supervisor', 'Manager', 'Head', 'Director'),
    min_pendidikan VARCHAR(100),
    min_sertifikasi VARCHAR(255),
    deskripsi_tugas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. sdm_kredensial
CREATE TABLE sdm_kredensial (
    id_kredensial VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    jenis_kredensial ENUM('STR', 'SIP', 'Sertifikat Sp', 'Sertifikat Profesi', 'Surat Izin Praktik', 'ACLS', 'ATLS', 'PPGD', 'Lain-lain'),
    nomor_kredensial VARCHAR(100),
    tanggal_terbit DATE,
    tanggal_kadaluarsa DATE,
    file_url VARCHAR(255),
    status ENUM('Valid', 'Expired', 'In-Process', 'Revoked'),
    issued_by VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. sdm_jadwal_shift
CREATE TABLE sdm_jadwal_shift (
    id_shift VARCHAR(50) PRIMARY KEY,
    kode_shift VARCHAR(20) UNIQUE NOT NULL,
    nama_shift VARCHAR(50) NOT NULL,
    jam_mulai TIME,
    jam_selesai TIME,
    durasi_jam DECIMAL(5,2),
    jenis ENUM('Regular', 'On-Call', 'Lembur'),
    is_overnight BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. sdm_roster
CREATE TABLE sdm_roster (
    id_roster VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    id_shift VARCHAR(50) NOT NULL,
    tanggal DATE NOT NULL,
    id_departemen VARCHAR(50),
    id_unit VARCHAR(50),
    status ENUM('Scheduled', 'Completed', 'Absent', 'Leave', 'Sick', 'On-Call'),
    catatan TEXT,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. sdm_kehadiran
CREATE TABLE sdm_kehadiran (
    id_kehadiran VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    tanggal DATE NOT NULL,
    jam_masuk TIME,
    jam_keluar TIME,
    metode_absen ENUM('Fingerprint', 'Facial Recognition', 'RFID', 'Manual', 'Mobile-GPS'),
    lokasi_absen VARCHAR(150),
    status ENUM('Hadir', 'Telat', 'Izin', 'Sakit', 'Cuti', 'Alpha'),
    jam_telat_menit INT DEFAULT 0,
    lembur_jam DECIMAL(5,2) DEFAULT 0,
    foto_selfie VARCHAR(255),
    gps_latitude DECIMAL(10,8),
    gps_longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. sdm_cuti
CREATE TABLE sdm_cuti (
    id_cuti VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    jenis_cuti ENUM('Tahunan', 'Sakit', 'Melahirkan', 'Besar', 'Khusus', 'Tanpa Bayaran'),
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    jumlah_hari INT,
    alasan TEXT,
    file_pendukung VARCHAR(255),
    status ENUM('Pending', 'Approved', 'Rejected', 'Cancelled') DEFAULT 'Pending',
    approved_by VARCHAR(50),
    tanggal_approval DATETIME,
    catatan_approval TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. sdm_training
CREATE TABLE sdm_training (
    id_training VARCHAR(50) PRIMARY KEY,
    kode_training VARCHAR(20) UNIQUE NOT NULL,
    nama_training VARCHAR(200) NOT NULL,
    kategori ENUM('Clinical', 'Non-Clinical', 'Compliance', 'Safety', 'Leadership'),
    durasi_jam INT,
    wajib_diikuti BOOLEAN DEFAULT FALSE,
    skor_minimum_lulus INT,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. sdm_training_record
CREATE TABLE sdm_training_record (
    id_record VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    id_training VARCHAR(50) NOT NULL,
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    status ENUM('Scheduled', 'In-Progress', 'Completed', 'Failed'),
    skor INT,
    sertifikat_url VARCHAR(255),
    trainer VARCHAR(150),
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. sdm_performance_review
CREATE TABLE sdm_performance_review (
    id_review VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    periode VARCHAR(20),
    reviewer_id VARCHAR(50),
    tanggal_review DATE,
    kpi_score DECIMAL(5,2),
    competency_score DECIMAL(5,2),
    attendance_score DECIMAL(5,2),
    training_score DECIMAL(5,2),
    overall_score DECIMAL(5,2),
    strengths TEXT,
    areas_for_improvement TEXT,
    goals_next_period TEXT,
    status ENUM('Draft', 'Submitted', 'Acknowledged') DEFAULT 'Draft',
    tanda_tangan_user VARCHAR(255),
    tanda_tangan_reviewer VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. sdm_on_call
CREATE TABLE sdm_on_call (
    id_oncall VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    tanggal_mulai DATETIME NOT NULL,
    tanggal_selesai DATETIME NOT NULL,
    departemen VARCHAR(100),
    kontak_darurat VARCHAR(50),
    status ENUM('Scheduled', 'Active', 'Completed', 'Cancelled'),
    kompensasi DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. sdm_lembur
CREATE TABLE sdm_lembur (
    id_lembur VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    tanggal DATE NOT NULL,
    jam_mulai TIME,
    jam_selesai TIME,
    durasi_jam DECIMAL(5,2),
    alasan TEXT,
    status ENUM('Pending', 'Approved', 'Rejected', 'Completed') DEFAULT 'Pending',
    approved_by VARCHAR(50),
    kompensasi DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DUMMY DATA
INSERT INTO sdm_departemen (id_departemen, kode_departemen, nama_departemen, jenis) VALUES
('DEP-001', 'MED', 'Pelayanan Medis', 'Medis'),
('DEP-002', 'KEP', 'Keperawatan', 'Keperawatan'),
('DEP-003', 'IGD', 'Instalasi Gawat Darurat', 'Medis');

INSERT INTO sdm_jabatan (id_jabatan, kode_jabatan, nama_jabatan, level) VALUES
('JAB-001', 'DR-UMUM', 'Dokter Umum', 'Staff'),
('JAB-002', 'DR-SP', 'Dokter Spesialis', 'Supervisor'),
('JAB-003', 'PRW-PEL', 'Perawat Pelaksana', 'Staff');

INSERT INTO sdm_kredensial (id_kredensial, id_user, jenis_kredensial, nomor_kredensial, tanggal_terbit, tanggal_kadaluarsa, status) VALUES
('KRD-001', 'D1', 'STR', 'STR-317-001', '2022-01-01', '2027-01-01', 'Valid'),
('KRD-002', 'D2', 'SIP', 'SIP-112-990', '2023-05-10', '2026-09-01', 'Valid'),
('KRD-003', 'P1', 'STR', 'STR-PRW-881', '2021-08-20', '2026-08-20', 'Valid');

INSERT INTO sdm_jadwal_shift (id_shift, kode_shift, nama_shift, jam_mulai, jam_selesai, durasi_jam, is_overnight) VALUES
('SHF-001', 'PAGI', 'Shift Pagi', '07:00:00', '15:00:00', 8.00, FALSE),
('SHF-002', 'SIANG', 'Shift Siang', '14:00:00', '22:00:00', 8.00, FALSE),
('SHF-003', 'MALAM', 'Shift Malam', '21:00:00', '07:00:00', 10.00, TRUE);

INSERT INTO sdm_roster (id_roster, id_user, id_shift, tanggal, status) VALUES
('RST-001', 'D1', 'SHF-001', '2026-08-01', 'Scheduled'),
('RST-002', 'P1', 'SHF-002', '2026-08-01', 'Scheduled');

INSERT INTO sdm_kehadiran (id_kehadiran, id_user, tanggal, jam_masuk, jam_keluar, metode_absen, status) VALUES
('KHD-001', 'D1', '2026-08-01', '06:55:00', '15:10:00', 'Fingerprint', 'Hadir'),
('KHD-002', 'P1', '2026-08-01', '14:10:00', '22:05:00', 'Fingerprint', 'Telat');
