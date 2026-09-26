-- 1. api_client
CREATE TABLE api_client (
    id_client VARCHAR(50) PRIMARY KEY,
    nama_client VARCHAR(100) NOT NULL,
    deskripsi TEXT,
    api_key VARCHAR(100) UNIQUE NOT NULL,
    api_secret VARCHAR(255) NOT NULL,
    owner_email VARCHAR(100) NOT NULL,
    status ENUM('Active', 'Inactive', 'Revoked') NOT NULL DEFAULT 'Active',
    rate_limit_per_minute INT DEFAULT 60,
    rate_limit_per_day INT DEFAULT 10000,
    ip_whitelist JSON,
    expires_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. api_endpoint
CREATE TABLE api_endpoint (
    id_endpoint VARCHAR(50) PRIMARY KEY,
    path VARCHAR(255) NOT NULL,
    method ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH') NOT NULL,
    versi VARCHAR(20) DEFAULT 'v1',
    deskripsi TEXT,
    kategori VARCHAR(100),
    requires_auth BOOLEAN DEFAULT TRUE,
    requires_permission VARCHAR(100),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. api_request_log
CREATE TABLE api_request_log (
    id_log VARCHAR(50) PRIMARY KEY,
    id_client VARCHAR(50),
    id_endpoint VARCHAR(50),
    request_url VARCHAR(255) NOT NULL,
    request_method VARCHAR(10) NOT NULL,
    request_headers JSON,
    request_body JSON,
    response_status INT NOT NULL,
    response_body JSON,
    response_time_ms INT NOT NULL,
    ip_address VARCHAR(50),
    user_agent VARCHAR(255),
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. api_rate_limit_log
CREATE TABLE api_rate_limit_log (
    id_log VARCHAR(50) PRIMARY KEY,
    id_client VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL,
    requests_count INT NOT NULL,
    limit_exceeded BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. api_webhook
CREATE TABLE api_webhook (
    id_webhook VARCHAR(50) PRIMARY KEY,
    id_client VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    callback_url VARCHAR(255) NOT NULL,
    secret VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. api_webhook_delivery
CREATE TABLE api_webhook_delivery (
    id_delivery VARCHAR(50) PRIMARY KEY,
    id_webhook VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSON NOT NULL,
    response_status INT,
    response_body TEXT,
    delivered_at DATETIME,
    retry_count INT DEFAULT 0,
    status ENUM('Pending', 'Delivered', 'Failed') NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. api_documentation
CREATE TABLE api_documentation (
    id_doc VARCHAR(50) PRIMARY KEY,
    id_endpoint VARCHAR(50) NOT NULL,
    judul VARCHAR(255) NOT NULL,
    deskripsi TEXT,
    request_example JSON,
    response_example JSON,
    error_codes JSON,
    changelog TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- DUMMY DATA
INSERT INTO api_client (id_client, nama_client, deskripsi, api_key, api_secret, owner_email, status, ip_whitelist) VALUES 
('CLI-001', 'Mobile App V1', 'Official Mobile App', 'ak_live_123456789', 'sk_live_abcdef123456', 'dev@myitaru.com', 'Active', '["192.168.1.0/24"]'),
('CLI-002', 'Partner Portal', 'Third-party integration', 'ak_live_987654321', 'sk_live_654321fedcba', 'partner@example.com', 'Active', '[]');

INSERT INTO api_endpoint (id_endpoint, path, method, versi, deskripsi, kategori) VALUES 
('EP-001', '/api/v1/patients', 'GET', 'v1', 'Get list of patients', 'Patient'),
('EP-002', '/api/v1/appointments', 'POST', 'v1', 'Create new appointment', 'Appointment');

INSERT INTO api_request_log (id_log, id_client, id_endpoint, request_url, request_method, response_status, response_time_ms, ip_address, timestamp) VALUES 
('REQ-001', 'CLI-001', 'EP-001', '/api/v1/patients', 'GET', 200, 45, '10.0.0.1', '2026-08-02 10:00:00'),
('REQ-002', 'CLI-002', 'EP-002', '/api/v1/appointments', 'POST', 201, 120, '10.0.0.2', '2026-08-02 10:05:00');

INSERT INTO api_rate_limit_log (id_log, id_client, timestamp, requests_count, limit_exceeded) VALUES 
('RL-001', 'CLI-001', '2026-08-02 10:00:00', 50, FALSE),
('RL-002', 'CLI-002', '2026-08-02 11:00:00', 10005, TRUE);

INSERT INTO api_webhook (id_webhook, id_client, event_type, callback_url, secret, is_active) VALUES 
('WH-001', 'CLI-002', 'appointment.scheduled', 'https://partner.example.com/webhooks/appointments', 'whsec_123456', TRUE);

INSERT INTO api_webhook_delivery (id_delivery, id_webhook, event_type, payload, response_status, delivered_at, status) VALUES 
('WHD-001', 'WH-001', 'appointment.scheduled', '{"id": "APT-123", "status": "Scheduled"}', 200, '2026-08-02 10:05:05', 'Delivered');

INSERT INTO api_documentation (id_doc, id_endpoint, judul, deskripsi, response_example) VALUES 
('DOC-001', 'EP-001', 'Get Patients List', 'Returns a paginated list of patients', '{"data": [{"id": "PAT-123", "name": "John Doe"}], "meta": {"total": 1}}');
