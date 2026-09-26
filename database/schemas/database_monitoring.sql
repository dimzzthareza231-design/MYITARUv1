-- 1. monitor_health_check
CREATE TABLE monitor_health_check (
    id_check VARCHAR(50) PRIMARY KEY,
    nama_service VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    interval_detik INT NOT NULL,
    timeout_detik INT NOT NULL,
    status ENUM('Healthy', 'Degraded', 'Down') NOT NULL,
    last_check_at DATETIME NOT NULL,
    response_time_ms INT,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. monitor_performance_log
CREATE TABLE monitor_performance_log (
    id_log VARCHAR(50) PRIMARY KEY,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    response_time_ms INT NOT NULL,
    status_code INT NOT NULL,
    memory_usage_mb DECIMAL(10,2),
    cpu_usage_percent DECIMAL(5,2),
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. monitor_error_log
CREATE TABLE monitor_error_log (
    id_error VARCHAR(50) PRIMARY KEY,
    level ENUM('Debug', 'Info', 'Warning', 'Error', 'Critical', 'Fatal') NOT NULL,
    message TEXT NOT NULL,
    stack_trace TEXT,
    file VARCHAR(255),
    line INT,
    user_id VARCHAR(50),
    request_url VARCHAR(255),
    request_method VARCHAR(10),
    request_payload JSON,
    ip_address VARCHAR(50),
    user_agent VARCHAR(255),
    timestamp DATETIME NOT NULL,
    resolved_at DATETIME,
    resolved_by VARCHAR(50),
    status ENUM('Open', 'Investigating', 'Resolved', 'Won''t Fix') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. monitor_audit_log
CREATE TABLE monitor_audit_log (
    id_audit VARCHAR(50) PRIMARY KEY,
    id_user VARCHAR(50) NOT NULL,
    action ENUM('Create', 'Read', 'Update', 'Delete', 'Login', 'Logout', 'Export', 'Import', 'Approve', 'Reject', 'Print') NOT NULL,
    module VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(50),
    user_agent VARCHAR(255),
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. monitor_alert_rule
CREATE TABLE monitor_alert_rule (
    id_rule VARCHAR(50) PRIMARY KEY,
    nama_rule VARCHAR(255) NOT NULL,
    kondisi JSON NOT NULL,
    severity ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    channel ENUM('Email', 'SMS', 'WhatsApp', 'Slack', 'PagerDuty') NOT NULL,
    recipient JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. monitor_alert_log
CREATE TABLE monitor_alert_log (
    id_alert VARCHAR(50) PRIMARY KEY,
    id_rule VARCHAR(50) NOT NULL,
    triggered_at DATETIME NOT NULL,
    message TEXT NOT NULL,
    severity ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    status ENUM('Triggered', 'Acknowledged', 'Resolved') DEFAULT 'Triggered',
    acknowledged_at DATETIME,
    acknowledged_by VARCHAR(50),
    resolved_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. monitor_slow_query
CREATE TABLE monitor_slow_query (
    id_query VARCHAR(50) PRIMARY KEY,
    query_text TEXT NOT NULL,
    duration_ms INT NOT NULL,
    rows_examined INT,
    rows_returned INT,
    database_name VARCHAR(100),
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DUMMY DATA

-- Health Checks
INSERT INTO monitor_health_check (id_check, nama_service, endpoint, interval_detik, timeout_detik, status, last_check_at, response_time_ms) VALUES
('CHK-001', 'Main API Server', 'https://api.myitaru.com/health', 60, 5, 'Healthy', '2026-08-02 12:15:00', 45),
('CHK-002', 'Database Primary', 'db-prod-01:5432', 60, 5, 'Healthy', '2026-08-02 12:15:00', 12),
('CHK-003', 'Payment Gateway API', 'https://payment.provider.com/ping', 300, 10, 'Degraded', '2026-08-02 12:10:00', 2500);

-- Performance Log
INSERT INTO monitor_performance_log (id_log, endpoint, method, response_time_ms, status_code, memory_usage_mb, cpu_usage_percent, timestamp) VALUES
('PERF-001', '/api/v1/emr/patients', 'GET', 120, 200, 512.5, 45.2, '2026-08-02 12:10:00'),
('PERF-002', '/api/v1/billing/invoice', 'POST', 850, 201, 530.0, 60.5, '2026-08-02 12:11:00');

-- Error Log
INSERT INTO monitor_error_log (id_error, level, message, file, line, request_url, request_method, timestamp, status) VALUES
('ERR-001', 'Error', 'Null reference exception in BillingService', 'BillingService.ts', 145, '/api/v1/billing/process', 'POST', '2026-08-02 11:30:00', 'Open'),
('ERR-002', 'Warning', 'Rate limit exceeded for user', 'RateLimiter.ts', 42, '/api/v1/auth/login', 'POST', '2026-08-02 11:45:00', 'Resolved');

-- Audit Log
INSERT INTO monitor_audit_log (id_audit, id_user, action, module, entity_type, entity_id, ip_address, timestamp) VALUES
('AUD-001', 'USR-002', 'Update', 'Medical Records', 'PatientEMR', 'EMR-9921', '192.168.1.100', '2026-08-02 10:00:00'),
('AUD-002', 'USR-001', 'Login', 'Auth', 'UserSession', 'SESS-8812', '10.0.0.5', '2026-08-02 08:00:00');

-- Alert Rules
INSERT INTO monitor_alert_rule (id_rule, nama_rule, kondisi, severity, channel, recipient) VALUES
('RUL-001', 'High Error Rate', '{"metric": "error_rate_5m", "operator": ">", "threshold": 5}', 'High', 'Slack', '["#alerts-prod"]'),
('RUL-002', 'Slow API Response', '{"metric": "p95_response_time", "operator": ">", "threshold": 1000}', 'Medium', 'Email', '["devops@myitaru.com"]');

-- Alert Log
INSERT INTO monitor_alert_log (id_alert, id_rule, triggered_at, message, severity, status) VALUES
('ALR-001', 'RUL-002', '2026-08-02 12:00:00', 'p95 response time is 1200ms (> 1000ms)', 'Medium', 'Triggered');

-- Slow Query
INSERT INTO monitor_slow_query (id_query, query_text, duration_ms, rows_examined, rows_returned, database_name, timestamp) VALUES
('SQ-001', 'SELECT * FROM medical_records WHERE notes LIKE ''%fever%''', 3500, 150000, 25, 'db_myitaru', '2026-08-02 11:55:00');

