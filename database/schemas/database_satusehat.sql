-- 1. satusehat_config
CREATE TABLE satusehat_config (
    id_config VARCHAR(50) PRIMARY KEY,
    environment ENUM('Production', 'Staging') DEFAULT 'Staging',
    base_url VARCHAR(255) NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    client_secret VARCHAR(255) NOT NULL,
    organization_id VARCHAR(100),
    location_id VARCHAR(100),
    token_endpoint VARCHAR(255),
    fhir_endpoint VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    last_sync DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. satusehat_patient_mapping
CREATE TABLE satusehat_patient_mapping (
    id_mapping VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    satusehat_patient_id VARCHAR(100),
    nik VARCHAR(20) NOT NULL,
    sync_status ENUM('Not-Synced', 'Synced', 'Failed', 'Updated') DEFAULT 'Not-Synced',
    last_sync_at DATETIME,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. satusehat_encounter
CREATE TABLE satusehat_encounter (
    id_encounter VARCHAR(50) PRIMARY KEY,
    id_kunjungan VARCHAR(50) NOT NULL,
    satusehat_encounter_id VARCHAR(100),
    satusehat_patient_id VARCHAR(100),
    encounter_class ENUM('ambulatory', 'emergency', 'inpatient', 'virtual') NOT NULL,
    status ENUM('planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled') NOT NULL,
    period_start DATETIME NOT NULL,
    period_end DATETIME,
    location_id VARCHAR(100),
    service_type VARCHAR(100),
    sync_status ENUM('Not-Synced', 'Synced', 'Failed') DEFAULT 'Not-Synced',
    last_sync_at DATETIME,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. satusehat_condition
CREATE TABLE satusehat_condition (
    id_condition VARCHAR(50) PRIMARY KEY,
    id_encounter VARCHAR(50) NOT NULL,
    satusehat_condition_id VARCHAR(100),
    code_system ENUM('ICD-10', 'SNOMED-CT') NOT NULL,
    code_value VARCHAR(50) NOT NULL,
    display_name VARCHAR(255),
    clinical_status ENUM('active', 'recurrence', 'relapse', 'inactive', 'remission', 'resolved'),
    verification_status ENUM('unconfirmed', 'provisional', 'differential', 'confirmed', 'refuted'),
    onset_date DATE,
    recorded_date DATETIME,
    sync_status ENUM('Not-Synced', 'Synced', 'Failed') DEFAULT 'Not-Synced',
    last_sync_at DATETIME,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. satusehat_observation
CREATE TABLE satusehat_observation (
    id_observation VARCHAR(50) PRIMARY KEY,
    id_encounter VARCHAR(50) NOT NULL,
    satusehat_observation_id VARCHAR(100),
    category ENUM('vital-signs', 'laboratory', 'imaging', 'social-history') NOT NULL,
    code_loinc VARCHAR(50),
    code_display VARCHAR(255),
    value_quantity DECIMAL(10,2),
    value_unit VARCHAR(50),
    value_string TEXT,
    effective_datetime DATETIME,
    status ENUM('registered', 'preliminary', 'final', 'amended', 'cancelled'),
    interpretation TEXT,
    sync_status ENUM('Not-Synced', 'Synced', 'Failed') DEFAULT 'Not-Synced',
    last_sync_at DATETIME,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. satusehat_medication_statement
CREATE TABLE satusehat_medication_statement (
    id_medication VARCHAR(50) PRIMARY KEY,
    id_encounter VARCHAR(50) NOT NULL,
    satusehat_medication_id VARCHAR(100),
    kode_kfa VARCHAR(50),
    nama_obat VARCHAR(255),
    dosis VARCHAR(100),
    rute VARCHAR(100),
    frekuensi VARCHAR(100),
    period_start DATETIME,
    period_end DATETIME,
    status ENUM('active', 'completed', 'stopped', 'on-hold'),
    prescribed_by VARCHAR(50),
    sync_status ENUM('Not-Synced', 'Synced', 'Failed') DEFAULT 'Not-Synced',
    last_sync_at DATETIME,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. satusehat_immunization
CREATE TABLE satusehat_immunization (
    id_immunization VARCHAR(50) PRIMARY KEY,
    id_pasien VARCHAR(50) NOT NULL,
    satusehat_immunization_id VARCHAR(100),
    vaccine_code VARCHAR(50),
    vaccine_name VARCHAR(255),
    occurrence_datetime DATETIME,
    dose_number INT,
    lot_number VARCHAR(100),
    manufacturer VARCHAR(255),
    expiration_date DATE,
    site VARCHAR(100),
    route VARCHAR(100),
    status ENUM('completed', 'entered-in-error', 'not-done'),
    reported_origin ENUM('Provider', 'Patient', 'Registry'),
    sync_status ENUM('Not-Synced', 'Synced', 'Failed') DEFAULT 'Not-Synced',
    last_sync_at DATETIME,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. satusehat_practitioner_mapping
CREATE TABLE satusehat_practitioner_mapping (
    id_mapping VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    satusehat_practitioner_id VARCHAR(100),
    str_number VARCHAR(100),
    sip_number VARCHAR(100),
    specialization VARCHAR(100),
    sync_status ENUM('Not-Synced', 'Synced', 'Failed') DEFAULT 'Not-Synced',
    last_sync_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. satusehat_organization_mapping
CREATE TABLE satusehat_organization_mapping (
    id_mapping VARCHAR(50) PRIMARY KEY,
    nama_unit VARCHAR(255),
    satusehat_location_id VARCHAR(100),
    unit_type ENUM('Poli', 'IGD', 'Rawat Inap', 'Lab', 'Radiologi', 'Farmasi', 'OK'),
    sync_status ENUM('Not-Synced', 'Synced', 'Failed') DEFAULT 'Not-Synced',
    last_sync_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. satusehat_sync_log
CREATE TABLE satusehat_sync_log (
    id_log VARCHAR(50) PRIMARY KEY,
    resource_type ENUM('Patient', 'Encounter', 'Condition', 'Observation', 'Medication', 'Immunization') NOT NULL,
    resource_id VARCHAR(50),
    action ENUM('Create', 'Update', 'Read', 'Delete'),
    satusehat_id VARCHAR(100),
    request_payload JSON,
    response_payload JSON,
    http_status INT,
    success BOOLEAN,
    error_message TEXT,
    duration_ms INT,
    triggered_by VARCHAR(50),
    triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    retry_count INT DEFAULT 0
);

-- DUMMY DATA INSERTION

INSERT INTO satusehat_config (id_config, environment, base_url, client_id, client_secret, organization_id, location_id) VALUES 
('CFG-001', 'Staging', 'https://api-satusehat-stg.dto.kemkes.go.id', 'client-stg-12345', 'secret-stg-abcdef', 'ORG-100123', 'LOC-500456');

INSERT INTO satusehat_patient_mapping (id_mapping, id_pasien, satusehat_patient_id, nik, sync_status) VALUES
('PM-001', 'P1', 'P-10001', '3171234567890001', 'Synced'),
('PM-002', 'P2', 'P-10002', '3171234567890002', 'Synced'),
('PM-003', 'P3', NULL, '3171234567890003', 'Failed');

INSERT INTO satusehat_encounter (id_encounter, id_kunjungan, satusehat_encounter_id, satusehat_patient_id, encounter_class, status, period_start, location_id, sync_status) VALUES
('ENC-001', 'K-001', 'E-20001', 'P-10001', 'ambulatory', 'finished', '2026-08-01 08:30:00', 'LOC-500456', 'Synced'),
('ENC-002', 'K-002', NULL, 'P-10002', 'emergency', 'in-progress', '2026-08-02 09:15:00', 'LOC-500456', 'Not-Synced');

INSERT INTO satusehat_condition (id_condition, id_encounter, satusehat_condition_id, code_system, code_value, display_name, clinical_status, verification_status, sync_status) VALUES
('COND-001', 'ENC-001', 'C-30001', 'ICD-10', 'A09', 'Infectious gastroenteritis', 'active', 'confirmed', 'Synced'),
('COND-002', 'ENC-002', NULL, 'ICD-10', 'A90', 'Dengue fever', 'active', 'provisional', 'Not-Synced');

INSERT INTO satusehat_observation (id_observation, id_encounter, category, code_loinc, code_display, value_quantity, value_unit, status, sync_status) VALUES
('OBS-001', 'ENC-001', 'vital-signs', '8480-6', 'Systolic blood pressure', 120, 'mmHg', 'final', 'Synced'),
('OBS-002', 'ENC-001', 'vital-signs', '8462-4', 'Diastolic blood pressure', 80, 'mmHg', 'final', 'Synced');

INSERT INTO satusehat_medication_statement (id_medication, id_encounter, kode_kfa, nama_obat, dosis, rute, frekuensi, status, sync_status) VALUES
('MED-001', 'ENC-001', 'KFA-939023', 'Paracetamol 500mg', '500 mg', 'Oral', '3x1', 'active', 'Synced');

INSERT INTO satusehat_immunization (id_immunization, id_pasien, vaccine_code, vaccine_name, occurrence_datetime, dose_number, status, sync_status) VALUES
('IMM-001', 'P1', 'KFA-849021', 'COVID-19 Sinovac', '2021-08-15 10:00:00', 1, 'completed', 'Synced');

INSERT INTO satusehat_sync_log (id_log, resource_type, resource_id, action, satusehat_id, http_status, success, error_message, duration_ms) VALUES
('LOG-001', 'Patient', 'P1', 'Create', 'P-10001', 201, TRUE, NULL, 450),
('LOG-002', 'Patient', 'P3', 'Create', NULL, 400, FALSE, 'Invalid NIK format', 320),
('LOG-003', 'Encounter', 'ENC-001', 'Create', 'E-20001', 201, TRUE, NULL, 510);
