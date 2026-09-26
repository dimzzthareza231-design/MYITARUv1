-- 1. cssd_alat
CREATE TABLE cssd_alat (
    id_alat VARCHAR(50) PRIMARY KEY,
    kode_alat VARCHAR(20) UNIQUE NOT NULL,
    nama_alat VARCHAR(150) NOT NULL,
    kategori ENUM('Instrument Bedah', 'Alat Endoscopy', 'Alat OK', 'Alat Poli', 'Lain-lain'),
    set_instrument VARCHAR(100),
    material ENUM('Stainless Steel', 'Plastic', 'Rubber', 'Mixed'),
    siklus_hidup_max INT,
    jumlah_siklus_saat_ini INT DEFAULT 0,
    status ENUM('Aktif', 'Rusak', 'Retired') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. cssd_pack
CREATE TABLE cssd_pack (
    id_pack VARCHAR(50) PRIMARY KEY,
    kode_pack VARCHAR(20) UNIQUE NOT NULL,
    nama_pack VARCHAR(150) NOT NULL,
    daftar_alat JSON,
    jumlah_piece INT,
    untuk_ruangan JSON,
    berat_gram INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. cssd_siklus
CREATE TABLE cssd_siklus (
    id_siklus VARCHAR(50) PRIMARY KEY,
    id_pack VARCHAR(50) NOT NULL,
    nomor_siklus VARCHAR(50) UNIQUE NOT NULL,
    tanggal_mulai DATETIME NOT NULL,
    tahap ENUM('Decontamination', 'Assembly', 'Sterilization', 'Storage', 'Distribution'),
    status ENUM('In-Process', 'Completed', 'Failed') DEFAULT 'In-Process',
    operator VARCHAR(50),
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. cssd_sterilizer
CREATE TABLE cssd_sterilizer (
    id_sterilizer VARCHAR(50) PRIMARY KEY,
    kode_sterilizer VARCHAR(20) UNIQUE NOT NULL,
    nama_sterilizer VARCHAR(100) NOT NULL,
    jenis ENUM('Autoclave', 'Plasma', 'ETO', 'Dry Heat'),
    kapasitas VARCHAR(50),
    status ENUM('Aktif', 'Maintenance', 'Nonaktif') DEFAULT 'Aktif',
    tanggal_kalibrasi_terakhir DATE,
    tanggal_kalibrasi_berikutnya DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. cssd_sterilization_run
CREATE TABLE cssd_sterilization_run (
    id_run VARCHAR(50) PRIMARY KEY,
    id_sterilizer VARCHAR(50) NOT NULL,
    id_siklus VARCHAR(50) NOT NULL,
    tanggal_run DATETIME NOT NULL,
    jenis_siklus ENUM('Pre-vacuum', 'Gravity', 'Flash', 'Plasma'),
    suhu_celsius DECIMAL(5,2),
    tekanan DECIMAL(5,2),
    durasi_menit INT,
    parameter JSON,
    indikator_kimia ENUM('Pass', 'Fail'),
    indikator_biologis ENUM('Pass', 'Fail', 'Pending'),
    batch_number VARCHAR(50),
    operator VARCHAR(50),
    status ENUM('Running', 'Completed', 'Failed') DEFAULT 'Running',
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. cssd_distribution
CREATE TABLE cssd_distribution (
    id_distribution VARCHAR(50) PRIMARY KEY,
    id_pack VARCHAR(50) NOT NULL,
    id_siklus VARCHAR(50) NOT NULL,
    ruangan_tujuan VARCHAR(100) NOT NULL,
    tanggal_distribusi DATETIME NOT NULL,
    diterima_oleh VARCHAR(100),
    kondisi_diterima ENUM('Baik', 'Rusak', 'Basah', 'Segel Rusak'),
    catatan TEXT,
    distributor VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. cssd_incident
CREATE TABLE cssd_incident (
    id_incident VARCHAR(50) PRIMARY KEY,
    id_siklus VARCHAR(50),
    id_pack VARCHAR(50),
    jenis_incident ENUM('Sterilization Failure', 'Wet Pack', 'Torn Wrap', 'Missing Instrument', 'Chemical Indicator Fail', 'Biological Indicator Fail'),
    deskripsi TEXT,
    tanggal_kejadian DATETIME NOT NULL,
    tindakan_koreksi TEXT,
    status ENUM('Open', 'Investigating', 'Closed') DEFAULT 'Open',
    reported_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- DUMMY DATA INSERTION
INSERT INTO cssd_alat (id_alat, kode_alat, nama_alat, kategori, set_instrument, material, siklus_hidup_max) VALUES
('ALT-001', 'AL-001', 'Scalpel Handle', 'Instrument Bedah', 'Set Minor', 'Stainless Steel', 500),
('ALT-002', 'AL-002', 'Mosquito Forceps', 'Instrument Bedah', 'Set Minor', 'Stainless Steel', 500);

INSERT INTO cssd_pack (id_pack, kode_pack, nama_pack, daftar_alat, jumlah_piece, untuk_ruangan, berat_gram) VALUES
('PCK-001', 'PK-001', 'Set Minor Surgery', '["ALT-001", "ALT-002"]', 2, '["OK", "IGD"]', 250);

INSERT INTO cssd_siklus (id_siklus, id_pack, nomor_siklus, tanggal_mulai, tahap, status, operator) VALUES
('SIK-001', 'PCK-001', 'CYC-260801-001', '2026-08-01 08:00:00', 'Storage', 'Completed', 'OP-01');

INSERT INTO cssd_sterilizer (id_sterilizer, kode_sterilizer, nama_sterilizer, jenis, kapasitas, tanggal_kalibrasi_terakhir, tanggal_kalibrasi_berikutnya) VALUES
('STR-001', 'ST-01', 'Autoclave 1', 'Autoclave', '500L', '2026-01-01', '2027-01-01');

INSERT INTO cssd_sterilization_run (id_run, id_sterilizer, id_siklus, tanggal_run, jenis_siklus, suhu_celsius, tekanan, durasi_menit, indikator_kimia, indikator_biologis, batch_number, operator, status) VALUES
('RUN-001', 'STR-001', 'SIK-001', '2026-08-01 10:00:00', 'Pre-vacuum', 134.0, 2.1, 45, 'Pass', 'Pass', 'B-260801', 'OP-01', 'Completed');

INSERT INTO cssd_distribution (id_distribution, id_pack, id_siklus, ruangan_tujuan, tanggal_distribusi, diterima_oleh, kondisi_diterima, distributor) VALUES
('DST-001', 'PCK-001', 'SIK-001', 'OK 1', '2026-08-01 13:00:00', 'Perawat OK', 'Baik', 'OP-02');

INSERT INTO cssd_incident (id_incident, id_siklus, id_pack, jenis_incident, deskripsi, tanggal_kejadian, status, reported_by) VALUES
('INC-001', 'SIK-001', 'PCK-001', 'Wet Pack', 'Ditemukan embun di dalam pack setelah sterilizer', '2026-08-01 11:00:00', 'Closed', 'OP-01');
