-- ========================================================================
-- STUDENT SKILL & PLACEMENT PORTAL — SUPABASE POSTGRESQL SCHEMA
-- Full Schema with Tables, Constraints, Indexes, Foreign Keys, & Sample Data
-- ========================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('STUDENT', 'COMPANY', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. STUDENT PROFILES TABLE
CREATE TABLE IF NOT EXISTS student_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(50),
    college VARCHAR(255),
    department VARCHAR(255),
    year VARCHAR(50),
    cgpa NUMERIC(4,2),
    location VARCHAR(255),
    about TEXT,
    resume_url VARCHAR(500),
    profile_photo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SKILLS TABLE
CREATE TABLE IF NOT EXISTS skills (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- 4. STUDENT SKILLS (JUNCTION TABLE)
CREATE TABLE IF NOT EXISTS student_skills (
    id BIGSERIAL PRIMARY KEY,
    student_profile_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    skill_level VARCHAR(50) NOT NULL CHECK (skill_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT')),
    UNIQUE (student_profile_id, skill_id)
);

-- 5. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. JOBS TABLE
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT,
    location VARCHAR(255) NOT NULL,
    job_type VARCHAR(50) NOT NULL,
    salary VARCHAR(100) NOT NULL,
    eligibility VARCHAR(255) NOT NULL,
    minimum_cgpa NUMERIC(4,2) NOT NULL,
    application_deadline DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. JOB SKILLS (JUNCTION TABLE)
CREATE TABLE IF NOT EXISTS job_skills (
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (job_id, skill_id)
);

-- 8. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    student_profile_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'APPLIED' CHECK (status IN ('APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED')),
    note TEXT,
    resume_url VARCHAR(500),
    cover_letter TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_profile_id, job_id)
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    job_title VARCHAR(255),
    company_name VARCHAR(255),
    application_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS support_tickets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    reply TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. SUPPORT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS support_messages (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL CHECK (sender_type IN ('STUDENT', 'ADMIN', 'COMPANY')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================================
-- PERFORMANCE INDEXES
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(application_deadline);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_profile_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);

-- ========================================================================
-- SEED DATA FOR DEMO & TESTING
-- Default passwords are BCrypt hash of "password123":
-- $2a$10$7R86g6B8hQe7YFj5pLw9U.Vz1V0m2k8d7/Z1v6i3g6/F2P.gD/o6O
-- ========================================================================

-- Insert Sample Users
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'Pradeep Kumar', 'student@placement.edu', '$2a$10$7R86g6B8hQe7YFj5pLw9U.Vz1V0m2k8d7/Z1v6i3g6/F2P.gD/o6O', 'STUDENT'),
(2, 'Sarah Jenkins', 'recruiter@abctech.com', '$2a$10$7R86g6B8hQe7YFj5pLw9U.Vz1V0m2k8d7/Z1v6i3g6/F2P.gD/o6O', 'COMPANY'),
(3, 'Placement Officer', 'admin@placement.edu', '$2a$10$7R86g6B8hQe7YFj5pLw9U.Vz1V0m2k8d7/Z1v6i3g6/F2P.gD/o6O', 'ADMIN'),
(4, 'Arun Venkatesh', 'arun.v@college.edu', '$2a$10$7R86g6B8hQe7YFj5pLw9U.Vz1V0m2k8d7/Z1v6i3g6/F2P.gD/o6O', 'STUDENT'),
(5, 'Sneha Rao', 'sneha.rao@college.edu', '$2a$10$7R86g6B8hQe7YFj5pLw9U.Vz1V0m2k8d7/Z1v6i3g6/F2P.gD/o6O', 'STUDENT')
ON CONFLICT (email) DO NOTHING;

-- Insert Student Profiles
INSERT INTO student_profiles (id, user_id, phone, college, department, year, cgpa, location, about, resume_url, profile_photo_url) VALUES
(1, 1, '+91 98765 43210', 'College of Engineering & Technology', 'Computer Science & Engineering', '4th Year', 8.75, 'Chennai, India', 'Aspiring full-stack engineer passionate about cloud architectures, Spring Boot microservices, and React.', 'https://example.com/resumes/pradeep_kumar_resume.pdf', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
(2, 4, '+91 98123 45678', 'College of Engineering & Technology', 'Computer Science & Engineering', '4th Year', 8.50, 'Chennai, India', 'Backend enthusiast skilled in Java, Spring Data JPA, and high-performance database indexing.', 'https://example.com/resumes/arun_v_resume.pdf', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
(3, 5, '+91 98345 67890', 'College of Engineering & Technology', 'Computer Science & Engineering', '3rd Year', 8.90, 'Chennai, India', 'UI/UX focused frontend engineer specialized in React, modern Tailwind styling, and accessibility.', 'https://example.com/resumes/sneha_rao_resume.pdf', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (user_id) DO NOTHING;

-- Insert Skills
INSERT INTO skills (id, name) VALUES
(1, 'Java'),
(2, 'Spring Boot'),
(3, 'React.js'),
(4, 'Tailwind CSS'),
(5, 'PostgreSQL'),
(6, 'Python'),
(7, 'Docker'),
(8, 'Git')
ON CONFLICT (name) DO NOTHING;

-- Insert Student Skills
INSERT INTO student_skills (student_profile_id, skill_id, skill_level) VALUES
(1, 1, 'ADVANCED'),
(1, 2, 'ADVANCED'),
(1, 3, 'INTERMEDIATE'),
(1, 5, 'INTERMEDIATE'),
(2, 1, 'ADVANCED'),
(2, 2, 'ADVANCED'),
(2, 7, 'INTERMEDIATE'),
(3, 3, 'ADVANCED'),
(3, 4, 'ADVANCED'),
(3, 8, 'INTERMEDIATE')
ON CONFLICT DO NOTHING;

-- Insert Companies
INSERT INTO companies (id, name, location, description, logo_url) VALUES
(1, 'ABC Technologies', 'Chennai & Bengaluru', 'Global software products and enterprise consulting firm driving digital transformation.', 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=120&auto=format&fit=crop&q=80'),
(2, 'XYZ Solutions', 'Bengaluru, India', 'Next-generation web applications, cloud native systems, and design systems powerhouse.', 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80'),
(3, 'CloudScale Labs', 'Hyderabad, India', 'High-throughput microservices and distributed cloud infrastructure solutions.', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80')
ON CONFLICT (name) DO NOTHING;

-- Insert Jobs
INSERT INTO jobs (id, company_id, title, description, responsibilities, location, job_type, salary, eligibility, minimum_cgpa, application_deadline) VALUES
(1, 1, 'Full Stack Java Developer', 'We are looking for enthusiastic Full Stack Java Developers to build scalable enterprise web solutions with Spring Boot and React.', '• Design and develop performant RESTful APIs in Spring Boot\n• Integrate responsive React frontends with state management\n• Collaborate in Agile sprints and write comprehensive unit tests', 'Chennai (Hybrid)', 'Full-Time', '₹7.5 - 10.0 LPA', 'B.E / B.Tech CSE, IT, ECE (2026 Batch)', 7.50, CURRENT_DATE + INTERVAL '25 days'),
(2, 2, 'Frontend Developer Intern', 'Join our UI engineering team to build sleek, accessible, modern user interfaces using React, Tailwind CSS, and Vite.', '• Implement responsive components from Figma designs\n• Optimize client-side bundle size and rendering performance\n• Write clean, maintainable modular code', 'Bengaluru (On-site)', 'Internship', '₹30,000 / month', 'B.E / B.Tech all streams with strong JavaScript skills', 7.00, CURRENT_DATE + INTERVAL '18 days'),
(3, 3, 'Backend Cloud Engineer', 'Build hyper-scale distributed microservices running on Docker containers and PostgreSQL backends.', '• Architect high-throughput backend services\n• Manage database transactions, partitioning, and schema tuning\n• Implement resilient security and authentication filters', 'Hyderabad (Remote)', 'Full-Time', '₹12.0 - 15.0 LPA', 'B.E / B.Tech CSE, IT (CGPA >= 8.0)', 8.00, CURRENT_DATE + INTERVAL '30 days')
ON CONFLICT DO NOTHING;

-- Insert Job Skills
INSERT INTO job_skills (job_id, skill_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 5),
(2, 3), (2, 4), (2, 8),
(3, 1), (3, 2), (3, 5), (3, 7)
ON CONFLICT DO NOTHING;

-- Insert Applications
INSERT INTO applications (id, student_profile_id, job_id, status, note, resume_url, cover_letter) VALUES
(1, 1, 1, 'SHORTLISTED', 'Screened by technical team. Profile meets all skill prerequisites.', 'https://example.com/resumes/pradeep_kumar_resume.pdf', 'I have hands-on experience building full stack systems with Spring Boot 3 and React. Excited for the opportunity!'),
(2, 1, 2, 'APPLIED', 'Application received and awaiting screening.', 'https://example.com/resumes/pradeep_kumar_resume.pdf', 'Excited to apply modern React and Tailwind CSS techniques to build seamless interfaces.'),
(3, 2, 1, 'INTERVIEW_SCHEDULED', 'Technical round 1 scheduled for next Monday 10:30 AM via Google Meet.', 'https://example.com/resumes/arun_v_resume.pdf', 'Passionate about Java Enterprise architecture and database query tuning.')
ON CONFLICT DO NOTHING;

-- Insert Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, job_title, company_name, application_id) VALUES
(1, 1, 'Congratulations! Shortlisted', 'Congratulations! You have been shortlisted for Full Stack Java Developer at ABC Technologies.', 'SHORTLISTED', false, 'Full Stack Java Developer', 'ABC Technologies', 1),
(2, 1, 'Application Submitted', 'Your application for Frontend Developer Intern at XYZ Solutions was submitted successfully.', 'APPLIED', true, 'Frontend Developer Intern', 'XYZ Solutions', 2),
(3, 1, 'Welcome to Placement Portal', 'Welcome Pradeep! Complete your profile and add your technical skills to boost placement matching.', 'SYSTEM', true, 'Portal Onboarding', 'Placement Cell', NULL)
ON CONFLICT DO NOTHING;

-- Insert Support Tickets
INSERT INTO support_tickets (id, user_id, subject, category, priority, status, description, reply) VALUES
(1, 1, 'Query regarding interview round format', 'Application Problem', 'Medium', 'RESOLVED', 'Could you please clarify whether the first interview round for ABC Technologies will be a live coding round or technical MCQs?', 'Round 1 consists of 45 minutes live problem solving in Java data structures followed by system design questions.'),
(2, 1, 'Uploaded resume link update', 'Resume Problem', 'Low', 'OPEN', 'I recently earned an AWS Cloud Practitioner certification and uploaded an updated resume. Please verify that recruiters view the new version.', NULL)
ON CONFLICT DO NOTHING;

-- Reset Sequences to ensure next inserts don't collide
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('student_profiles_id_seq', (SELECT MAX(id) FROM student_profiles));
SELECT setval('skills_id_seq', (SELECT MAX(id) FROM skills));
SELECT setval('companies_id_seq', (SELECT MAX(id) FROM companies));
SELECT setval('jobs_id_seq', (SELECT MAX(id) FROM jobs));
SELECT setval('applications_id_seq', (SELECT MAX(id) FROM applications));
SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));
SELECT setval('support_tickets_id_seq', (SELECT MAX(id) FROM support_tickets));
