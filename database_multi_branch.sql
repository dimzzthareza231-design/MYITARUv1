-- 1. branch_facility
CREATE TABLE branch_facility (
    id_facility VARCHAR(50) PRIMARY KEY,
    kode_facility VARCHAR(20) UNIQUE NOT NULL,
    nama_facility VARCHAR(100) NOT NULL,
    alamat TEXT,
    kota VARCHAR(50),
    provinsi VARCHAR(50),
    telepon VARCHAR(20),
    email VARCHAR(100),
    kepala_cabang_id VARCHAR(50),
    tipe ENUM('Pusat', 'Cabang', 'Klinik', 'Puskesmas') NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. branch_config
CREATE TABLE branch_config (
    id_config VARCHAR(50) PRIMARY KEY,
    id_facility VARCHAR(50) NOT NULL,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT,
    config_type ENUM('String', 'Number', 'Boolean', 'JSON') NOT NULL,
    deskripsi TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (id_facility, config_key)
);

-- 3. branch_user_assignment
CREATE TABLE branch_user_assignment (
    id_assignment VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    id_facility VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. branch_patient_registry
CREATE TABLE branch_patient_registry (
    id_registry VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    id_facility VARCHAR(50) NOT NULL,
    no_rm_cabang VARCHAR(20) NOT NULL,
    tanggal_daftar DATE NOT NULL,
    status ENUM('Active', 'Transferred', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (id_pasien, id_facility),
    UNIQUE KEY (id_facility, no_rm_cabang)
);

-- 5. branch_transfer
CREATE TABLE branch_transfer (
    id_transfer VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    id_kunjungan VARCHAR(50),
    facility_asal VARCHAR(50) NOT NULL,
    facility_tujuan VARCHAR(50) NOT NULL,
    tanggal_transfer DATETIME NOT NULL,
    alasan TEXT,
    diagnosis VARCHAR(255),
    dokter_pengirim VARCHAR(50),
    dokter_penerima VARCHAR(50),
    status ENUM('Requested', 'Accepted', 'In Transit', 'Completed', 'Rejected') DEFAULT 'Requested',
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. branch_inventory
CREATE TABLE branch_inventory (
    id_inventory VARCHAR(50) PRIMARY KEY,
    id_facility VARCHAR(50) NOT NULL,
    id_item VARCHAR(50) NOT NULL,
    jumlah_stok INT DEFAULT 0,
    minimum_stock INT DEFAULT 0,
    maximum_stock INT DEFAULT 0,
    last_updated DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (id_facility, id_item)
);

-- 7. branch_consolidated_report
CREATE TABLE branch_consolidated_report (
    id_report VARCHAR(50) PRIMARY KEY,
    jenis_report ENUM('Kunjungan', 'Pendapatan', 'Stok', 'SDM', 'Quality') NOT NULL,
    periode VARCHAR(20) NOT NULL,
    facility_ids JSON,
    data JSON,
    generated_at DATETIME NOT NULL,
    generated_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DUMMY DATA
INSERT INTO branch_facility (id_facility, kode_facility, nama_facility, kota, provinsi, tipe) VALUES 
('FAC-001', 'HQ-JKT', 'RS MyItaru Pusat Jakarta', 'Jakarta Selatan', 'DKI Jakarta', 'Pusat'),
('FAC-002', 'BR-BDG', 'RS MyItaru Cabang Bandung', 'Bandung', 'Jawa Barat', 'Cabang'),
('FAC-003', 'CL-BKS', 'Klinik Utama MyItaru Bekasi', 'Bekasi', 'Jawa Barat', 'Klinik');

INSERT INTO branch_config (id_config, id_facility, config_key, config_value, config_type) VALUES 
('CFG-001', 'FAC-001', 'TIMEZONE', 'Asia/Jakarta', 'String'),
('CFG-002', 'FAC-001', 'MAX_BED_CAPACITY', '500', 'Number'),
('CFG-003', 'FAC-002', 'TIMEZONE', 'Asia/Jakarta', 'String'),
('CFG-004', 'FAC-002', 'MAX_BED_CAPACITY', '200', 'Number');

INSERT INTO branch_user_assignment (id_assignment, id_user, id_facility, is_primary, tanggal_mulai) VALUES 
('UA-001', 'USR-001', 'FAC-001', TRUE, '2025-01-01'),
('UA-002', 'USR-002', 'FAC-002', TRUE, '2025-02-01'),
('UA-003', 'USR-003', 'FAC-001', TRUE, '2025-01-15');

INSERT INTO branch_patient_registry (id_registry, id_pasien, id_facility, no_rm_cabang, tanggal_daftar, status) VALUES 
('PR-001', 'PAT-001', 'FAC-001', 'RM-JKT-0001', '2025-01-10', 'Active'),
('PR-002', 'PAT-002', 'FAC-002', 'RM-BDG-0001', '2025-02-15', 'Active');

INSERT INTO branch_transfer (id_transfer, id_pasien, facility_asal, facility_tujuan, tanggal_transfer, alasan, status) VALUES 
('TRF-001', 'PAT-001', 'FAC-002', 'FAC-001', '2026-08-01 10:00:00', 'Rujukan spesialis jantung', 'Completed'),
('TRF-002', 'PAT-002', 'FAC-003', 'FAC-001', '2026-08-05 09:00:00', 'Fasilitas ICU penuh', 'Requested');

INSERT INTO branch_inventory (id_inventory, id_facility, id_item, jumlah_stok, minimum_stock, maximum_stock, last_updated) VALUES 
('INV-001', 'FAC-001', 'ITEM-001', 5000, 1000, 10000, '2026-08-05 08:00:00'),
('INV-002', 'FAC-002', 'ITEM-001', 2000, 500, 5000, '2026-08-05 08:00:00');

INSERT INTO branch_consolidated_report (id_report, jenis_report, periode, data, generated_at) VALUES 
('RPT-001', 'Kunjungan', '2026-07', '{"total": 12500, "by_branch": {"FAC-001": 8000, "FAC-002": 3500, "FAC-003": 1000}}', '2026-08-01 01:00:00');
