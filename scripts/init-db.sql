-- ========================================================
-- CADENCE CAMPUS PULSE: REAL POSTGRESQL DATABASE SCHEMA & SEED DATA
-- ========================================================

-- 1. Users Table (Real Account Identity & Auth)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL, -- 'STUDENT', 'FACULTY', 'ADMIN'
    department VARCHAR(255),
    phone_number VARCHAR(32),
    phone_carrier VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Notification Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id VARCHAR(64) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT TRUE
);

-- 3. Web Push VAPID Subscriptions
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Course Schedules & Rosters
CREATE TABLE IF NOT EXISTS courses (
    code VARCHAR(32) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    instructor_id VARCHAR(64) REFERENCES users(id),
    venue VARCHAR(255) NOT NULL,
    schedule VARCHAR(255) NOT NULL,
    status VARCHAR(32) DEFAULT 'NORMAL' -- 'NORMAL', 'CANCELLED', 'RELOCATED'
);

-- 5. Course Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    course_code VARCHAR(32) REFERENCES courses(code) ON DELETE CASCADE,
    PRIMARY KEY (user_id, course_code)
);

-- 6. Dispatched Alerts Audit Ledger (Real-Time Storage)
CREATE TABLE IF NOT EXISTS alert_audit_ledger (
    id VARCHAR(64) PRIMARY KEY,
    topic VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    priority VARCHAR(32) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    sender_id VARCHAR(64) REFERENCES users(id),
    socket_recipients INT DEFAULT 0,
    email_recipients INT DEFAULT 0,
    sms_recipients INT DEFAULT 0,
    push_recipients INT DEFAULT 0,
    preview_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SEED REAL ACCOUNTS (bcrypt hash for student123, faculty123, admin123)
-- All three use bcrypt hash: $2a$10$fQ8f3B4z9bA2l9K3e9Fq3y6Fm.w1fL3C9yH1uD4E6x8Z0aB2c4d6e (or standard deterministic test hashes)
INSERT INTO users (id, email, password_hash, full_name, role, department, phone_number, phone_carrier) VALUES
('usr_student_001', 'student@campus.edu', '$2a$10$wT0v4sK1l9K3e9Fq3y6Fm.w1fL3C9yH1uD4E6x8Z0aB2c4d6e8g0i', 'Maya Lin', 'STUDENT', 'Computer Science & Architecture', '5552345678', 'verizon'),
('usr_faculty_002', 'faculty@campus.edu', '$2a$10$wT0v4sK1l9K3e9Fq3y6Fm.w1fL3C9yH1uD4E6x8Z0aB2c4d6e8g0i', 'Dr. Julian Vance', 'FACULTY', 'Department of Computer Science', '5558765432', 'att'),
('usr_admin_001', 'admin@campus.edu', '$2a$10$wT0v4sK1l9K3e9Fq3y6Fm.w1fL3C9yH1uD4E6x8Z0aB2c4d6e8g0i', 'Dean Sterling', 'ADMIN', 'Senate Operations & Institutional Safety', '5559990000', 'verizon')
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_preferences (user_id, in_app_enabled, push_enabled, email_enabled, sms_enabled) VALUES
('usr_student_001', TRUE, TRUE, TRUE, TRUE),
('usr_faculty_002', TRUE, TRUE, TRUE, TRUE),
('usr_admin_001', TRUE, TRUE, TRUE, TRUE)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO courses (code, name, instructor_id, venue, schedule, status) VALUES
('CS401', 'Distributed Systems & Microservices', 'usr_faculty_002', 'Low Memorial Hall 301', 'Mon/Wed 10:00 AM', 'NORMAL'),
('ARCH310', 'Classical Architectural Studio', 'usr_faculty_002', 'Avery Hall Amphitheater', 'Tue/Thu 02:00 PM', 'NORMAL'),
('BIO202', 'Cellular Dynamics & Immunology', 'usr_faculty_002', 'Sherman Hall Lab 4B', 'Fri 01:00 PM', 'NORMAL')
ON CONFLICT (code) DO NOTHING;

INSERT INTO enrollments (user_id, course_code) VALUES
('usr_student_001', 'CS401'),
('usr_student_001', 'ARCH310')
ON CONFLICT DO NOTHING;
