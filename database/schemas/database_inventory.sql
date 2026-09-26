-- 1. inv_gudang
CREATE TABLE inv_gudang (
    id_gudang VARCHAR(50) PRIMARY KEY,
    kode_gudang VARCHAR(20) UNIQUE NOT NULL,
    nama_gudang VARCHAR(150) NOT NULL,
    lokasi VARCHAR(150),
    jenis ENUM('Gudang Utama', 'Gudang Farmasi', 'Gudang Alkes', 'Gudang BHP', 'Gudang Linen', 'Gudang OK', 'Depo Poli', 'Depo Rawat Inap'),
    penanggung_jawab_id VARCHAR(50),
    kapasitas VARCHAR(100),
    status ENUM('Aktif', 'Nonaktif') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. inv_kategori_item
CREATE TABLE inv_kategori_item (
    id_kategori VARCHAR(50) PRIMARY KEY,
    kode_kategori VARCHAR(20) UNIQUE NOT NULL,
    nama_kategori VARCHAR(100) NOT NULL,
    jenis ENUM('Obat', 'Alkes', 'BHP', 'Linen', 'ATK', 'Alat Tulis', 'Lain-lain'),
    parent_kategori_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. inv_master_item
CREATE TABLE inv_master_item (
    id_item VARCHAR(50) PRIMARY KEY,
    kode_item VARCHAR(50) UNIQUE NOT NULL,
    nama_item VARCHAR(255) NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    id_kategori VARCHAR(50),
    satuan VARCHAR(50),
    merek VARCHAR(100),
    produsen VARCHAR(150),
    negara_asal VARCHAR(100),
    berat_kg DECIMAL(10,2),
    dimensi JSON,
    harga_perolehan DECIMAL(15,2),
    harga_jual DECIMAL(15,2),
    minimum_stock INT,
    maximum_stock INT,
    reorder_point INT,
    requires_batch BOOLEAN DEFAULT TRUE,
    requires_expiry BOOLEAN DEFAULT TRUE,
    is_narkotika BOOLEAN DEFAULT FALSE,
    is_psikotropika BOOLEAN DEFAULT FALSE,
    is_obat_berbahaya BOOLEAN DEFAULT FALSE,
    requires_prescription BOOLEAN DEFAULT FALSE,
    storage_condition ENUM('Room Temperature', 'Cold 2-8°C', 'Frozen', 'Protected from Light'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. inv_batch
CREATE TABLE inv_batch (
    id_batch VARCHAR(50) PRIMARY KEY,
    id_item VARCHAR(50) NOT NULL,
    nomor_batch VARCHAR(100) NOT NULL,
    tanggal_produksi DATE,
    tanggal_kadaluarsa DATE,
    nomor_registrasi_bpom VARCHAR(100),
    harga_perolehan_batch DECIMAL(15,2),
    jumlah_awal INT,
    jumlah_sisa INT,
    status ENUM('Aktif', 'Expired', 'Recalled', 'Destroyed') DEFAULT 'Aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. inv_stock
CREATE TABLE inv_stock (
    id_stock VARCHAR(50) PRIMARY KEY,
    id_item VARCHAR(50) NOT NULL,
    id_gudang VARCHAR(50) NOT NULL,
    id_batch VARCHAR(50),
    jumlah_stok INT DEFAULT 0,
    jumlah_reserved INT DEFAULT 0,
    jumlah_available INT GENERATED ALWAYS AS (jumlah_stok - jumlah_reserved) STORED,
    lokasi_rak VARCHAR(50),
    last_counted_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_stock (id_item, id_gudang, id_batch)
);

-- 6. inv_supplier
CREATE TABLE inv_supplier (
    id_supplier VARCHAR(50) PRIMARY KEY,
    kode_supplier VARCHAR(50) UNIQUE NOT NULL,
    nama_supplier VARCHAR(150) NOT NULL,
    jenis ENUM('Distributor Obat', 'Distributor Alkes', 'Distributor BHP', 'Produsen', 'Lain-lain'),
    alamat TEXT,
    kota VARCHAR(100),
    telepon VARCHAR(50),
    email VARCHAR(100),
    contact_person VARCHAR(100),
    npwp VARCHAR(50),
    no_izin_edar VARCHAR(100),
    rating DECIMAL(3,2),
    status_kerjasama ENUM('Aktif', 'Tidak Aktif', 'Blacklist') DEFAULT 'Aktif',
    tanggal_mulai_kerjasama DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. inv_purchase_request
CREATE TABLE inv_purchase_request (
    id_pr VARCHAR(50) PRIMARY KEY,
    nomor_pr VARCHAR(50) UNIQUE NOT NULL,
    id_departemen VARCHAR(50),
    requested_by VARCHAR(50),
    tanggal_request DATE NOT NULL,
    items JSON,
    alasan TEXT,
    status ENUM('Draft', 'Submitted', 'Approved', 'Rejected', 'PO-Created') DEFAULT 'Draft',
    approved_by VARCHAR(50),
    tanggal_approval DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. inv_purchase_order
CREATE TABLE inv_purchase_order (
    id_po VARCHAR(50) PRIMARY KEY,
    nomor_po VARCHAR(50) UNIQUE NOT NULL,
    id_pr VARCHAR(50),
    id_supplier VARCHAR(50) NOT NULL,
    tanggal_po DATE NOT NULL,
    tanggal_kirim_estimasi DATE,
    items JSON,
    subtotal DECIMAL(15,2),
    ppn DECIMAL(15,2),
    total DECIMAL(15,2),
    status ENUM('Draft', 'Sent', 'Partial-Received', 'Received', 'Cancelled') DEFAULT 'Draft',
    received_by VARCHAR(50),
    tanggal_receive DATETIME,
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 9. inv_receive_note
CREATE TABLE inv_receive_note (
    id_receive VARCHAR(50) PRIMARY KEY,
    id_po VARCHAR(50) NOT NULL,
    nomor_receive VARCHAR(50) UNIQUE NOT NULL,
    tanggal_receive DATETIME NOT NULL,
    items JSON,
    received_by VARCHAR(50),
    inspected_by VARCHAR(50),
    status ENUM('Accepted', 'Partial', 'Rejected') DEFAULT 'Accepted',
    catatan TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. inv_stock_movement
CREATE TABLE inv_stock_movement (
    id_movement VARCHAR(50) PRIMARY KEY,
    id_item VARCHAR(50) NOT NULL,
    id_gudang_asal VARCHAR(50),
    id_gudang_tujuan VARCHAR(50),
    id_batch VARCHAR(50),
    jenis_movement ENUM('Purchase-Receive', 'Sales-Dispense', 'Transfer', 'Adjustment', 'Return', 'Expired', 'Damaged', 'Recall', 'Stock-Opname'),
    jumlah INT NOT NULL,
    referensi VARCHAR(100),
    catatan TEXT,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. inv_stock_opname
CREATE TABLE inv_stock_opname (
    id_opname VARCHAR(50) PRIMARY KEY,
    id_gudang VARCHAR(50) NOT NULL,
    tanggal_opname DATE NOT NULL,
    status ENUM('Planned', 'In-Progress', 'Completed') DEFAULT 'Planned',
    items_counted JSON,
    selisih_total DECIMAL(15,2),
    approved_by VARCHAR(50),
    catatan_opname TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. inv_drug_recall
CREATE TABLE inv_drug_recall (
    id_recall VARCHAR(50) PRIMARY KEY,
    id_item VARCHAR(50) NOT NULL,
    id_batch VARCHAR(50) NOT NULL,
    nomor_recall VARCHAR(100),
    alasan_recall TEXT,
    tingkat_risiko ENUM('Class I-Kritis', 'Class II-Serius', 'Class III-Minor'),
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE,
    jumlah_tertarik INT,
    status ENUM('Active', 'Completed') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. inv_item_usage_report
CREATE TABLE inv_item_usage_report (
    id_report VARCHAR(50) PRIMARY KEY,
    id_item VARCHAR(50) NOT NULL,
    periode VARCHAR(20) NOT NULL,
    total_penggunaan INT DEFAULT 0,
    total_nilai DECIMAL(15,2) DEFAULT 0,
    rata_rata_per_hari DECIMAL(10,2) DEFAULT 0,
    top_consumer VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. inv_alert
CREATE TABLE inv_alert (
    id_alert VARCHAR(50) PRIMARY KEY,
    id_item VARCHAR(50) NOT NULL,
    id_gudang VARCHAR(50),
    jenis_alert ENUM('Low-Stock', 'Out-of-Stock', 'Over-Stock', 'Near-Expiry', 'Expired', 'Recall'),
    severity ENUM('Low', 'Medium', 'High', 'Critical'),
    pesan TEXT,
    status ENUM('Active', 'Acknowledged', 'Resolved') DEFAULT 'Active',
    resolved_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DUMMY DATA
INSERT INTO inv_gudang (id_gudang, kode_gudang, nama_gudang, lokasi, jenis) VALUES
('GDG-001', 'G-FARM', 'Gudang Farmasi Utama', 'Lantai 1, Sayap Kiri', 'Gudang Farmasi'),
('GDG-002', 'G-ALKES', 'Gudang Alat Kesehatan', 'Lantai 1, Sayap Kanan', 'Gudang Alkes'),
('GDG-003', 'D-IGD', 'Depo Farmasi IGD', 'Lantai 1, Area IGD', 'Depo Poli');

INSERT INTO inv_kategori_item (id_kategori, kode_kategori, nama_kategori, jenis) VALUES
('KAT-001', 'OBT-GN', 'Obat Generik', 'Obat'),
('KAT-002', 'OBT-PT', 'Obat Paten', 'Obat'),
('KAT-003', 'ALK-HP', 'Alkes Habis Pakai', 'Alkes');

INSERT INTO inv_master_item (id_item, kode_item, nama_item, id_kategori, satuan, minimum_stock, maximum_stock, reorder_point) VALUES
('ITM-001', 'OBT-001', 'Paracetamol 500mg', 'KAT-001', 'Tablet', 1000, 5000, 1500),
('ITM-002', 'OBT-002', 'Amoxicillin 500mg', 'KAT-001', 'Kapsul', 500, 2000, 800),
('ITM-003', 'ALK-001', 'Spuit 3cc', 'KAT-003', 'Pcs', 1000, 10000, 2000);

INSERT INTO inv_batch (id_batch, id_item, nomor_batch, tanggal_produksi, tanggal_kadaluarsa, jumlah_awal, jumlah_sisa) VALUES
('BTC-001', 'ITM-001', 'B-PCT-2026-01', '2026-01-01', '2028-01-01', 5000, 4500),
('BTC-002', 'ITM-002', 'B-AMX-2026-02', '2026-02-15', '2027-02-15', 2000, 1500);

INSERT INTO inv_stock (id_stock, id_item, id_gudang, id_batch, jumlah_stok) VALUES
('STK-001', 'ITM-001', 'GDG-001', 'BTC-001', 4000),
('STK-002', 'ITM-001', 'GDG-003', 'BTC-001', 500),
('STK-003', 'ITM-002', 'GDG-001', 'BTC-002', 1500);

INSERT INTO inv_supplier (id_supplier, kode_supplier, nama_supplier, jenis) VALUES
('SUP-001', 'S-KF', 'Kimia Farma Trading', 'Distributor Obat'),
('SUP-002', 'S-DX', 'Dexa Medica', 'Distributor Obat');

INSERT INTO inv_alert (id_alert, id_item, id_gudang, jenis_alert, severity, pesan) VALUES
('ALT-001', 'ITM-002', 'GDG-003', 'Low-Stock', 'Medium', 'Stok Amoxicillin 500mg di Depo IGD di bawah minimum (Sisa: 50)');
