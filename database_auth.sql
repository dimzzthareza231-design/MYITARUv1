-- 1. auth_user
CREATE TABLE auth_user (
    id_user VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    id_pegawai VARCHAR(50),
    id_pasien VARCHAR(50),
    role ENUM('Super Admin', 'Admin', 'Dokter', 'Perawat', 'Staf Registrasi', 'Kasir', 'Farmasi', 'Lab', 'Radiologi', 'Manager', 'Auditor', 'Patient') NOT NULL,
    departemen VARCHAR(100),
    status ENUM('Active', 'Inactive', 'Suspended', 'Locked') DEFAULT 'Active',
    email_verified_at DATETIME,
    phone_verified_at DATETIME,
    last_login_at DATETIME,
    last_login_ip VARCHAR(50),
    failed_login_attempts INT DEFAULT 0,
    locked_until DATETIME,
    must_change_password BOOLEAN DEFAULT FALSE,
    password_changed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. auth_role
CREATE TABLE auth_role (
    id_role VARCHAR(50) PRIMARY KEY,
    kode_role VARCHAR(50) UNIQUE NOT NULL,
    nama_role VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. auth_permission
CREATE TABLE auth_permission (
    id_permission VARCHAR(50) PRIMARY KEY,
    kode_permission VARCHAR(100) UNIQUE NOT NULL,
    nama_permission VARCHAR(150) NOT NULL,
    modul VARCHAR(50) NOT NULL,
    aksi ENUM('Create', 'Read', 'Update', 'Delete', 'Export', 'Import', 'Approve', 'Reject') NOT NULL,
    deskripsi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. auth_role_permission
CREATE TABLE auth_role_permission (
    id_mapping VARCHAR(50) PRIMARY KEY,
    id_role VARCHAR(50) NOT NULL,
    id_permission VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_role_permission (id_role, id_permission)
);

-- 5. auth_user_role
CREATE TABLE auth_user_role (
    id_assignment VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    id_role VARCHAR(50) NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE,
    assigned_by VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. auth_session
CREATE TABLE auth_session (
    id_session VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSON,
    ip_address VARCHAR(50),
    location VARCHAR(150),
    started_at DATETIME NOT NULL,
    last_activity_at DATETIME NOT NULL,
    expires_at DATETIME NOT NULL,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. auth_2fa
CREATE TABLE auth_2fa (
    id_2fa VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    method ENUM('SMS', 'Email', 'Authenticator App', 'Backup Code') NOT NULL,
    secret_key VARCHAR(255) NOT NULL,
    is_enabled BOOLEAN DEFAULT FALSE,
    verified_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. auth_otp
CREATE TABLE auth_otp (
    id_otp VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    purpose ENUM('Login', 'Reset Password', 'Verify Email', 'Verify Phone', '2FA') NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. auth_password_history
CREATE TABLE auth_password_history (
    id_history VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. auth_login_log
CREATE TABLE auth_login_log (
    id_log VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50),
    username_attempted VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    user_agent VARCHAR(255),
    location VARCHAR(150),
    status ENUM('Success', 'Failed-Wrong Password', 'Failed-User Not Found', 'Failed-Account Locked', 'Failed-2FA Failed', 'Logout') NOT NULL,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DUMMY DATA

-- Users
INSERT INTO auth_user (id_user, username, email, password_hash, full_name, role, status, email_verified_at) VALUES
('USR-001', 'admin_super', 'admin@myitaru.com', 'hash123', 'Super Admin System', 'Super Admin', 'Active', '2026-08-01 10:00:00'),
('USR-002', 'dr_sarah', 'sarah@myitaru.com', 'hash123', 'dr. Sarah Wijaya', 'Dokter', 'Active', '2026-08-01 10:00:00'),
('USR-003', 'budi_perawat', 'budi.p@myitaru.com', 'hash123', 'Budi Santoso', 'Perawat', 'Active', '2026-08-01 10:00:00'),
('USR-004', 'ani_kasir', 'ani.k@myitaru.com', 'hash123', 'Ani Lestari', 'Kasir', 'Active', '2026-08-01 10:00:00'),
('USR-005', 'hacker_boy', 'hacker@anonymous.com', 'hash_wrong', 'Unknown', 'Patient', 'Locked', NULL);

-- Roles
INSERT INTO auth_role (id_role, kode_role, nama_role, deskripsi, is_system_role) VALUES
('ROLE-001', 'SYS_ADMIN', 'System Administrator', 'Full access to all modules', TRUE),
('ROLE-002', 'CLINICAL_DOC', 'Doctor', 'Access to EMR, Prescriptions', FALSE),
('ROLE-003', 'CASHIER', 'Cashier', 'Access to Billing and Payments', FALSE);

-- Permissions
INSERT INTO auth_permission (id_permission, kode_permission, nama_permission, modul, aksi, deskripsi) VALUES
('PERM-001', 'USR_CREATE', 'Create User', 'User Management', 'Create', 'Can create new users'),
('PERM-002', 'EMR_READ', 'Read EMR', 'Medical Records', 'Read', 'Can read patient medical records'),
('PERM-003', 'EMR_UPDATE', 'Update EMR', 'Medical Records', 'Update', 'Can update medical records'),
('PERM-004', 'BILL_APPROVE', 'Approve Billing', 'Billing', 'Approve', 'Can approve invoices');

-- Role Permissions
INSERT INTO auth_role_permission (id_mapping, id_role, id_permission) VALUES
('MAP-001', 'ROLE-001', 'PERM-001'),
('MAP-002', 'ROLE-002', 'PERM-002'),
('MAP-003', 'ROLE-002', 'PERM-003'),
('MAP-004', 'ROLE-003', 'PERM-004');

-- User Roles
INSERT INTO auth_user_role (id_assignment, id_user, id_role, tanggal_mulai, assigned_by) VALUES
('ASG-001', 'USR-001', 'ROLE-001', '2026-01-01', 'USR-001'),
('ASG-002', 'USR-002', 'ROLE-002', '2026-01-01', 'USR-001'),
('ASG-003', 'USR-004', 'ROLE-003', '2026-01-01', 'USR-001');

-- Sessions
INSERT INTO auth_session (id_session, id_user, session_token, device_info, ip_address, started_at, last_activity_at, expires_at) VALUES
('SESS-001', 'USR-001', 'token_abc123', '{"browser": "Chrome", "os": "Windows 11"}', '192.168.1.100', '2026-08-02 08:00:00', '2026-08-02 12:00:00', '2026-08-03 08:00:00');

-- 2FA
INSERT INTO auth_2fa (id_2fa, id_user, method, secret_key, is_enabled, verified_at) VALUES
('2FA-001', 'USR-001', 'Authenticator App', 'secret_key_123', TRUE, '2026-08-01 10:15:00');

-- OTP
INSERT INTO auth_otp (id_otp, id_user, otp_code, purpose, expires_at, used_at, is_used) VALUES
('OTP-001', 'USR-002', '123456', 'Login', '2026-08-02 08:05:00', '2026-08-02 08:02:00', TRUE);

-- Login Logs
INSERT INTO auth_login_log (id_log, id_user, username_attempted, ip_address, status, created_at) VALUES
('LOG-001', 'USR-001', 'admin_super', '192.168.1.100', 'Success', '2026-08-02 08:00:00'),
('LOG-002', 'USR-005', 'hacker_boy', '10.0.0.5', 'Failed-Wrong Password', '2026-08-02 09:00:00'),
('LOG-003', 'USR-005', 'hacker_boy', '10.0.0.5', 'Failed-Account Locked', '2026-08-02 09:05:00');

