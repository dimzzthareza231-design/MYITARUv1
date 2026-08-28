-- 1. backup_schedule
CREATE TABLE backup_schedule (
    id_schedule VARCHAR(50) PRIMARY KEY,
    nama_schedule VARCHAR(255) NOT NULL,
    jenis ENUM('Full', 'Incremental', 'Differential', 'Transaction Log') NOT NULL,
    frekuensi ENUM('Hourly', 'Daily', 'Weekly', 'Monthly') NOT NULL,
    target_database VARCHAR(100) NOT NULL,
    target_tables JSON,
    retention_days INT DEFAULT 30,
    compression BOOLEAN DEFAULT TRUE,
    encryption BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. backup_job
CREATE TABLE backup_job (
    id_job VARCHAR(50) PRIMARY KEY,
    id_schedule VARCHAR(50),
    jenis_backup VARCHAR(50) NOT NULL,
    tanggal_mulai DATETIME NOT NULL,
    tanggal_selesai DATETIME,
    durasi_detik INT,
    ukuran_data_mb DECIMAL(10,2),
    ukuran_backup_mb DECIMAL(10,2),
    lokasi_storage VARCHAR(255),
    file_path VARCHAR(255),
    status ENUM('Running', 'Completed', 'Failed', 'Cancelled') DEFAULT 'Running',
    error_message TEXT,
    checksum VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. backup_storage
CREATE TABLE backup_storage (
    id_storage VARCHAR(50) PRIMARY KEY,
    nama_storage VARCHAR(100) NOT NULL,
    jenis ENUM('Local', 'NAS', 'Cloud-S3', 'Cloud-GCS', 'Cloud-Azure', 'Offsite') NOT NULL,
    path VARCHAR(255) NOT NULL,
    kapasitas_gb DECIMAL(10,2) NOT NULL,
    terpakai_gb DECIMAL(10,2) NOT NULL,
    status ENUM('Active', 'Full', 'Offline') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. dr_plan
CREATE TABLE dr_plan (
    id_plan VARCHAR(50) PRIMARY KEY,
    nama_plan VARCHAR(255) NOT NULL,
    skenario ENUM('Server Failure', 'Data Corruption', 'Natural Disaster', 'Cyber Attack', 'Power Outage') NOT NULL,
    rto_minutes INT NOT NULL,
    rpo_minutes INT NOT NULL,
    prosedur TEXT NOT NULL,
    pic VARCHAR(50) NOT NULL,
    kontak_darurat JSON,
    last_tested DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. dr_drill
CREATE TABLE dr_drill (
    id_drill VARCHAR(50) PRIMARY KEY,
    id_plan VARCHAR(50) NOT NULL,
    tanggal_drill DATETIME NOT NULL,
    skenario VARCHAR(255),
    durasi_aktual_menit INT,
    rto_aktual_menit INT,
    rpo_aktual_menit INT,
    hasil ENUM('Success', 'Partial', 'Failed') NOT NULL,
    temuan TEXT,
    rekomendasi TEXT,
    peserta JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. dr_incident
CREATE TABLE dr_incident (
    id_incident VARCHAR(50) PRIMARY KEY,
    tanggal_kejadian DATETIME NOT NULL,
    jenis_kejadian VARCHAR(255) NOT NULL,
    dampak TEXT NOT NULL,
    tindakan TEXT,
    durasi_downtime_menit INT,
    data_loss_minutes INT,
    status ENUM('Open', 'Investigating', 'Resolved', 'Closed') DEFAULT 'Open',
    pic VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DUMMY DATA

-- backup_schedule
INSERT INTO backup_schedule (id_schedule, nama_schedule, jenis, frekuensi, target_database, target_tables) VALUES
('SCH-001', 'Daily Full Backup', 'Full', 'Daily', 'db_myitaru', '["*"]'),
('SCH-002', 'Hourly Incremental', 'Incremental', 'Hourly', 'db_myitaru', '["*"]');

-- backup_storage
INSERT INTO backup_storage (id_storage, nama_storage, jenis, path, kapasitas_gb, terpakai_gb) VALUES
('STG-001', 'AWS S3 Bucket Main', 'Cloud-S3', 's3://myitaru-backup-prod', 5000.00, 1200.50),
('STG-002', 'Local NAS Storage', 'NAS', '/mnt/nas_backup', 10000.00, 8500.00);

-- backup_job
INSERT INTO backup_job (id_job, id_schedule, jenis_backup, tanggal_mulai, tanggal_selesai, durasi_detik, ukuran_data_mb, ukuran_backup_mb, status) VALUES
('JOB-001', 'SCH-001', 'Full', '2026-08-01 00:00:00', '2026-08-01 00:45:00', 2700, 50000.00, 15000.00, 'Completed'),
('JOB-002', 'SCH-002', 'Incremental', '2026-08-01 12:00:00', '2026-08-01 12:05:00', 300, 500.00, 150.00, 'Completed'),
('JOB-003', 'SCH-001', 'Full', '2026-08-02 00:00:00', NULL, NULL, NULL, NULL, 'Failed');

-- dr_plan
INSERT INTO dr_plan (id_plan, nama_plan, skenario, rto_minutes, rpo_minutes, prosedur, pic) VALUES
('DRP-001', 'Server Hardware Failure Plan', 'Server Failure', 120, 15, '1. Identifikasi hardware failure\n2. Spin up standby server di cloud\n3. Restore last full backup\n4. Apply transaction logs\n5. Update DNS / Load Balancer', 'USR-001'),
('DRP-002', 'Ransomware / Data Corruption Plan', 'Cyber Attack', 240, 60, '1. Isolate infected networks\n2. Identify last clean backup\n3. Format affected drives\n4. Restore from immutable storage', 'USR-001');

-- dr_drill
INSERT INTO dr_drill (id_drill, id_plan, tanggal_drill, skenario, durasi_aktual_menit, rto_aktual_menit, rpo_aktual_menit, hasil, temuan, rekomendasi) VALUES
('DRD-001', 'DRP-001', '2026-06-15 10:00:00', 'Simulated DB server crash', 150, 145, 10, 'Partial', 'Proses restore lebih lama 25 menit dari target RTO karena network bottleneck.', 'Upgrade bandwidth untuk link ke DR site.');

-- dr_incident
INSERT INTO dr_incident (id_incident, tanggal_kejadian, jenis_kejadian, dampak, tindakan, durasi_downtime_menit, status, pic) VALUES
('INC-001', '2025-11-10 14:00:00', 'Power Outage Main DC', 'Sistem utama mati, failover ke DRC', 'Mengaktifkan plan DRP-001, switch over sukses', 45, 'Closed', 'USR-001');

