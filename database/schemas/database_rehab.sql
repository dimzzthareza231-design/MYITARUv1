-- 1. rehab_jenis_terapi
CREATE TABLE rehab_jenis_terapi (
    id_jenis VARCHAR(50) PRIMARY KEY,
    kode_jenis VARCHAR(20) UNIQUE NOT NULL,
    nama_jenis VARCHAR(150) NOT NULL,
    kategori ENUM('Fisioterapi', 'Okupasi Terapi', 'Terapi Wicara', 'Akupunktur', 'Rehabilitasi Jantung', 'Rehabilitasi Neurologi'),
    tarif_dasar DECIMAL(15,2),
    durasi_menit INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. rehab_assessment
CREATE TABLE rehab_assessment (
    id_assessment VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    id_kunjungan VARCHAR(50) NOT NULL,
    tanggal_assessment DATETIME NOT NULL,
    jenis_terapi VARCHAR(50),
    keluhan_utama TEXT,
    riwayat_sakit TEXT,
    pemeriksaan_fisik TEXT,
    pengukuran JSON,
    diagnosis_fungsi VARCHAR(255),
    goal_terapi TEXT,
    rencana_terapi TEXT,
    therapist VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. rehab_care_plan
CREATE TABLE rehab_care_plan (
    id_care_plan VARCHAR(50) PRIMARY KEY,
    id_assessment VARCHAR(50) NOT NULL,
    goal_jangka_pendek TEXT,
    goal_jangka_panjang TEXT,
    intervensi JSON,
    jumlah_sesi_rencana INT,
    tanggal_mulai DATE,
    tanggal_target_selesai DATE,
    status ENUM('Active', 'Completed', 'On-Hold') DEFAULT 'Active',
    therapist VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. rehab_session
CREATE TABLE rehab_session (
    id_session VARCHAR(50) PRIMARY KEY,
    id_care_plan VARCHAR(50) NOT NULL,
    id_pasien VARCHAR(50) NOT NULL,
    id_kunjungan VARCHAR(50),
    tanggal_session DATETIME NOT NULL,
    sesi_ke INT,
    durasi_menit INT,
    modalitas JSON,
    exercise JSON,
    subjective TEXT,
    objective TEXT,
    assessment TEXT,
    plan TEXT,
    tanda_vital_pre JSON,
    tanda_vital_post JSON,
    nyeri_pre INT,
    nyeri_post INT,
    therapist VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. rehab_outcome_measurement
CREATE TABLE rehab_outcome_measurement (
    id_outcome VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    tanggal_ukur DATE NOT NULL,
    instrumen ENUM('Barthel Index', 'FIM', '6MWT', 'TUG', 'Berg Balance', 'VAS', 'ROM', 'Manual Muscle Test'),
    skor DECIMAL(10,2),
    interpretasi TEXT,
    perubahan_dari_sebelum DECIMAL(10,2),
    diukur_oleh VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. rehab_alat
CREATE TABLE rehab_alat (
    id_alat VARCHAR(50) PRIMARY KEY,
    kode_alat VARCHAR(20) UNIQUE NOT NULL,
    nama_alat VARCHAR(150) NOT NULL,
    kategori ENUM('Electrotherapy', 'Ultrasound', 'Exercise Equipment', 'Assistive Device', 'Lain-lain'),
    kondisi ENUM('Baik', 'Rusak', 'Maintenance') DEFAULT 'Baik',
    lokasi VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. rehab_home_program
CREATE TABLE rehab_home_program (
    id_program VARCHAR(50) PRIMARY KEY,
    id_care_plan VARCHAR(50) NOT NULL,
    id_pasien VARCHAR(50) NOT NULL,
    tanggal_diberikan DATE NOT NULL,
    exercise_list JSON,
    durasi_program_minggu INT,
    instruksi_khusus TEXT,
    follow_up_date DATE,
    diberikan_oleh VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. rehab_progress_note
CREATE TABLE rehab_progress_note (
    id_note VARCHAR(50) PRIMARY KEY,
    id_care_plan VARCHAR(50) NOT NULL,
    tanggal DATETIME NOT NULL,
    subjectif TEXT,
    objektif TEXT,
    assessment TEXT,
    plan TEXT,
    therapist VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- DUMMY DATA
INSERT INTO rehab_jenis_terapi (id_jenis, kode_jenis, nama_jenis, kategori, tarif_dasar, durasi_menit) VALUES
('RJT-001', 'FT-01', 'Fisioterapi Musculoskeletal', 'Fisioterapi', 150000.00, 45),
('RJT-002', 'OT-01', 'Okupasi Terapi Anak', 'Okupasi Terapi', 200000.00, 60),
('RJT-003', 'TW-01', 'Terapi Wicara Dewasa', 'Terapi Wicara', 175000.00, 45);

INSERT INTO rehab_assessment (id_assessment, id_pasien, id_kunjungan, tanggal_assessment, jenis_terapi, keluhan_utama, riwayat_sakit, pemeriksaan_fisik, pengukuran, diagnosis_fungsi, goal_terapi, rencana_terapi, therapist) VALUES
('RAS-001', 'P1', 'K-01', '2026-08-01 09:00:00', 'RJT-001', 'Nyeri lutut kanan saat berjalan', 'Osteoarthritis', 'Bengkak lutut kanan (+), krepitasi (+)', '{"ROM": "Terbatas", "kekuatan_otot": 4, "skala_nyeri": 6}', 'Gangguan mobilitas b/d nyeri sendi', 'Mengurangi nyeri, meningkatkan ROM', 'US, TENS, Strengthening exercise', 'T-001');

INSERT INTO rehab_care_plan (id_care_plan, id_assessment, goal_jangka_pendek, goal_jangka_panjang, intervensi, jumlah_sesi_rencana, tanggal_mulai, tanggal_target_selesai, status, therapist) VALUES
('RCP-001', 'RAS-001', 'Nyeri berkurang VAS 3, ROM 0-110 deg', 'Kembali jalan tanpa alat bantu', '[{"jenis": "US", "frekuensi": "2x/minggu", "durasi": "10 menit", "target": "Lutut Kanan"}]', 8, '2026-08-01', '2026-08-30', 'Active', 'T-001');

INSERT INTO rehab_session (id_session, id_care_plan, id_pasien, id_kunjungan, tanggal_session, sesi_ke, durasi_menit, modalitas, exercise, subjective, objective, assessment, plan, tanda_vital_pre, tanda_vital_post, nyeri_pre, nyeri_post, therapist) VALUES
('Klinik-001', 'RCP-001', 'P1', 'K-01', '2026-08-01 09:30:00', 1, 45, '[{"nama": "US", "durasi": 10, "parameter": "1 MHz, 1.0 W/cm2"}]', '[{"nama": "SLR", "repetisi": 10, "set": 3}]', 'Masih nyeri lutut', 'Bengkak sedikit berkurang', 'Toleransi terapi baik', 'Lanjutkan sesuai plan', '{"TD": "120/80", "HR": 80}', '{"TD": "120/80", "HR": 82}', 6, 4, 'T-001');

INSERT INTO rehab_outcome_measurement (id_outcome, id_pasien, tanggal_ukur, instrumen, skor, interpretasi, perubahan_dari_sebelum, diukur_oleh) VALUES
('ROM-001', 'P1', '2026-08-01', 'VAS', 6.00, 'Nyeri Sedang', 0.00, 'T-001');

INSERT INTO rehab_alat (id_alat, kode_alat, nama_alat, kategori, kondisi, lokasi) VALUES
('ALT-001', 'US-01', 'Ultrasound Enraf Nonius', 'Ultrasound', 'Baik', 'Ruang FT 1');

INSERT INTO rehab_home_program (id_program, id_care_plan, id_pasien, tanggal_diberikan, exercise_list, durasi_program_minggu, instruksi_khusus, follow_up_date, diberikan_oleh) VALUES
('RHP-001', 'RCP-001', 'P1', '2026-08-01', '[{"nama": "Isometrik Quadriceps", "gambar_url": "", "repetisi": 10, "set": 3, "durasi": "5 detik", "catatan": "Jangan menahan napas"}]', 4, 'Lakukan tiap pagi', '2026-08-08', 'T-001');

INSERT INTO rehab_progress_note (id_note, id_care_plan, tanggal, subjectif, objektif, assessment, plan, therapist) VALUES
('RPN-001', 'RCP-001', '2026-08-01 10:15:00', 'Pasien merasa baikan setelah diterapi', 'ROM pasif lutut 0-100 deg', 'Ada kemajuan dalam penurunan nyeri', 'Lanjutkan TENS dan US sesi berikutnya', 'T-001');
