-- 1. ok_ruangan
CREATE TABLE ok_ruangan (
    id_ruangan VARCHAR(50) PRIMARY KEY,
    kode_ruangan VARCHAR(20) UNIQUE NOT NULL,
    nama_ruangan VARCHAR(100) NOT NULL,
    lantai INT,
    kapasitas_operasi_sehari INT,
    fasilitas JSON,
    status VARCHAR(20) DEFAULT 'Aktif',
    jadwal_operasional JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. ok_jenis_operasi
CREATE TABLE ok_jenis_operasi (
    id_jenis VARCHAR(50) PRIMARY KEY,
    kode_icd9cm VARCHAR(20),
    nama_operasi VARCHAR(150) NOT NULL,
    kategori ENUM('Mayor', 'Minor', 'Elektif', 'Emergency'),
    durasi_estimasi_menit INT,
    tingkat_risiko ENUM('Rendah', 'Sedang', 'Tinggi'),
    tarif_dasar DECIMAL(15,2),
    butuh_ok_khusus BOOLEAN DEFAULT FALSE,
    peralatan_khusus JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. ok_jadwal_operasi
CREATE TABLE ok_jadwal_operasi (
    id_jadwal VARCHAR(50) PRIMARY KEY,
    id_kunjungan VARCHAR(50),
    id_pasien VARCHAR(50),
    id_dokter_operator VARCHAR(50),
    id_ruangan VARCHAR(50),
    id_jenis_operasi VARCHAR(50),
    tanggal_operasi DATE,
    jam_mulai TIME,
    jam_selesai_estimasi TIME,
    durasi_aktual_menit INT,
    status_jadwal ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled'),
    jenis_operasi ENUM('Elektif', 'Emergency', 'UGD'),
    prioritas INT,
    catatan_pre_op TEXT,
    status_puasa BOOLEAN,
    status_lab_pre_op BOOLEAN,
    status_ecg_pre_op BOOLEAN,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. ok_tim_operasi
CREATE TABLE ok_tim_operasi (
    id_tim VARCHAR(50) PRIMARY KEY,
    id_jadwal VARCHAR(50),
    id_user VARCHAR(50),
    peran ENUM('Operator Utama', 'Asisten Operator 1', 'Asisten Operator 2', 'Dokter Anestesi', 'Perawat Anestesi', 'Perawat Instrumen', 'Perawat Sirkuler', 'Teknisi OK'),
    jam_masuk TIME,
    jam_keluar TIME,
    tanda_tangan_digital VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. ok_peralatan
CREATE TABLE ok_peralatan (
    id_alat VARCHAR(50) PRIMARY KEY,
    kode_alat VARCHAR(50) UNIQUE NOT NULL,
    nama_alat VARCHAR(150),
    kategori ENUM('Instrumental', 'Mesin', 'Alat Habis Pakai'),
    nomor_seri VARCHAR(50),
    kondisi ENUM('Baik', 'Rusak', 'Maintenance'),
    status_steril ENUM('Steril', 'Non-Steril', 'Dalam Proses'),
    tanggal_steril_terakhir DATETIME,
    tanggal_kadaluarsa_steril DATETIME,
    lokasi_penyimpanan VARCHAR(100),
    harga_perolehan DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. ok_set_instrument
CREATE TABLE ok_set_instrument (
    id_set VARCHAR(50) PRIMARY KEY,
    nama_set VARCHAR(150),
    kode_set VARCHAR(50) UNIQUE NOT NULL,
    daftar_alat JSON,
    jumlah_piece INT,
    untuk_jenis_operasi JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. ok_persetujuan_operasi
CREATE TABLE ok_persetujuan_operasi (
    id_persetujuan VARCHAR(50) PRIMARY KEY,
    id_jadwal VARCHAR(50),
    id_pasien VARCHAR(50),
    jenis_persetujuan ENUM('Persetujuan Tindakan Operasi', 'Persetujuan Anestesi', 'Persetujuan Transfusi', 'Penolakan Operasi'),
    isi_persetujuan TEXT,
    nama_penandatangan VARCHAR(100),
    hubungan_penandatangan VARCHAR(50),
    no_identitas VARCHAR(50),
    tanda_tangan_url VARCHAR(255),
    saksi_nama VARCHAR(100),
    saksi_id VARCHAR(50),
    tanggal_tanda_tangan DATETIME,
    status ENUM('Draft', 'Signed', 'Revoked'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. ok_catatan_pre_op
CREATE TABLE ok_catatan_pre_op (
    id_catatan VARCHAR(50) PRIMARY KEY,
    id_jadwal VARCHAR(50),
    id_dokter VARCHAR(50),
    diagnosis_pre_op VARCHAR(255),
    diagnosis_icd10 VARCHAR(20),
    rencana_operasi TEXT,
    rencana_anestesi ENUM('General', 'Regional', 'Lokal', 'Sedasi'),
    risiko_operasi TEXT,
    alergi_terkonfirmasi BOOLEAN,
    hasil_lab_pre_op JSON,
    hasil_ecg_pre_op JSON,
    hasil_rontgen_pre_op JSON,
    tanda_vital_pre_op JSON,
    catatan_khusus TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. ok_catatan_anestesi
CREATE TABLE ok_catatan_anestesi (
    id_anestesi VARCHAR(50) PRIMARY KEY,
    id_jadwal VARCHAR(50),
    id_dokter_anestesi VARCHAR(50),
    jenis_anestesi ENUM('General', 'Spinal', 'Epidural', 'Blok Regional', 'Lokal', 'Sedasi'),
    obat_induksi JSON,
    obat_maintenance JSON,
    obat_relaksan JSON,
    intubasi BOOLEAN,
    ukuran_et VARCHAR(20),
    posisi_pasien VARCHAR(50),
    tanda_vital_per_5_menit JSON,
    cairan_infus_ml INT,
    transfusi_darah BOOLEAN,
    jumlah_darah_ml INT,
    komplikasi_anestesi TEXT,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. ok_catatan_operasi
CREATE TABLE ok_catatan_operasi (
    id_catatan VARCHAR(50) PRIMARY KEY,
    id_jadwal VARCHAR(50),
    id_operator VARCHAR(50),
    diagnosis_pre_op VARCHAR(255),
    diagnosis_post_op VARCHAR(255),
    tindakan_sebenarnya TEXT,
    temuan_operasi TEXT,
    teknik_operasi TEXT,
    insisi VARCHAR(100),
    durasi_operasi_menit INT,
    estimated_blood_loss_ml INT,
    spesimen_terkirim JSON,
    drain_terpasang VARCHAR(100),
    jahitan VARCHAR(100),
    kondisi_pasien_post_op VARCHAR(255),
    rencana_post_op TEXT,
    komplikasi_intra_op TEXT,
    tanda_tangan_operator VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. ok_count_sheet
CREATE TABLE ok_count_sheet (
    id_count VARCHAR(50) PRIMARY KEY,
    id_jadwal VARCHAR(50),
    waktu_count ENUM('Pre-Incision', 'Before Closure', 'Before Skin Closure', 'Skin Closure Completed'),
    perawat_instrumen_id VARCHAR(50),
    perawat_sirkuler_id VARCHAR(50),
    jumlah_instrument INT,
    jumlah_kassa INT,
    jumlah_jarum INT,
    jumlah_alat_lain INT,
    status_count ENUM('Correct', 'Incorrect', 'Missing'),
    catatan_discrepancy TEXT,
    tanda_tangan_1 VARCHAR(255),
    tanda_tangan_2 VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. ok_billing_item
CREATE TABLE ok_billing_item (
    id_billing VARCHAR(50) PRIMARY KEY,
    id_jadwal VARCHAR(50),
    id_kunjungan VARCHAR(50),
    jenis_biaya ENUM('Jasa Operator', 'Jasa Anestesi', 'Jasa Asisten', 'Sewa OK', 'Alat Habis Pakai', 'Obat OK', 'Darah', 'Lain-lain'),
    kode_item VARCHAR(50),
    nama_item VARCHAR(150),
    jumlah INT,
    harga_satuan DECIMAL(15,2),
    total DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DUMMY DATA INSERTION
INSERT INTO ok_ruangan (id_ruangan, kode_ruangan, nama_ruangan, lantai, kapasitas_operasi_sehari) VALUES 
('OK-01', 'OK1', 'Kamar Operasi 1 (Mayor)', 3, 4),
('OK-02', 'OK2', 'Kamar Operasi 2 (Minor)', 3, 6),
('OK-03', 'OK3', 'Kamar Operasi 3 (IGD)', 1, 10);

INSERT INTO ok_jenis_operasi (id_jenis, kode_icd9cm, nama_operasi, kategori, durasi_estimasi_menit, tingkat_risiko, tarif_dasar) VALUES
('OP-01', '47.09', 'Appendiktomi', 'Mayor', 60, 'Sedang', 5000000.00),
('OP-02', '51.22', 'Kolesistektomi', 'Mayor', 90, 'Sedang', 7500000.00),
('OP-03', '53.00', 'Repair Hernia', 'Mayor', 60, 'Sedang', 6000000.00),
('OP-04', '74.1', 'Sectio Caesarea', 'Mayor', 60, 'Sedang', 8000000.00);

-- Insert 15 dummy jadwal... (skipping full insert for brevity, provided a few)
INSERT INTO ok_jadwal_operasi (id_jadwal, id_kunjungan, id_pasien, id_dokter_operator, id_ruangan, id_jenis_operasi, tanggal_operasi, jam_mulai, status_jadwal, jenis_operasi) VALUES
('JDW-01', 'K-001', 'P1', 'D1', 'OK-01', 'OP-01', CURDATE(), '08:00:00', 'Scheduled', 'Elektif'),
('JDW-02', 'K-002', 'P2', 'D2', 'OK-02', 'OP-02', CURDATE(), '10:00:00', 'In Progress', 'Elektif'),
('JDW-03', 'K-003', 'P3', 'D3', 'OK-03', 'OP-04', CURDATE(), '13:00:00', 'Scheduled', 'Emergency');
