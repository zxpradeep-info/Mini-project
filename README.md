# Student Skill & Placement Portal 🎓💼

> A full-stack, enterprise-grade **Student Skill & Placement Management Web Application** designed for college campus recruitment, built with **React.js**, **Tailwind CSS**, **Spring Boot 3**, **Spring Security (JWT)**, and **Supabase PostgreSQL**.

---

## 🌟 Executive Summary

The **Student Skill & Placement Portal** bridges the gap between graduating engineering students, placement officers, and corporate recruiters. It automates resume profile management, multi-criteria skill matching, job postings, application pipelines, and real-time candidate notifications.

Designed following modern clean-white UI principles (subtle drop shadows, `#2563eb` modern accents, crisp typography) and enterprise REST API micro-architecture standards.

---

## 🚀 Key Features

### 👨‍🎓 For Students
- **Modern Clean-White Dashboard**: Placement metrics, application status breakdown, and recommended jobs based on registered skills.
- **Dynamic Profile Management**: Real-time profile completeness indicator, academic CGPA tracking, social links, resume URL preview, and photo upload.
- **Interactive Skill Matrix**: Add, level (Beginner/Intermediate/Advanced/Expert), and delete technical proficiencies with visual badges.
- **Opportunity Hub**: Search by role/technology, multi-filter by employment type (Full-time / Internship) and CGPA eligibility cutoffs.
- **One-Click Application Flow**: Comprehensive review modal with pre-filled cover letter and resume verification before submission.
- **Application Pipeline Tracker**: Color-coded badges (`Applied`, `Under Review`, `Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected`) with notes from recruiters.
- **Notification Engine**: Instant unread alerts when recruiter updates application status or posts interview dates.
- **Help Desk & Support System**: FAQ accordion and ticket submission system with resolution replies from placement officers.

### 🏢 For Companies & Placement Admins
- **Recruiter Command Center**: High-level placement statistics, active vacancy counts, and candidate pipeline overview.
- **Job Creation Suite**: Post opportunities with required skills, CGPA cutoff, stipend/salary package, responsibilities, and deadlines.
- **Candidate Dossier & Review**: Filter applicants by job and status, view student CGPA, skills, phone, college, and read cover letters.
- **Status Progression & Automatic Triggers**: Changing a candidate's status (e.g. from *Under Review* to *Shortlisted* or *Interview Scheduled*) automatically generates persistent notifications for the student.
- **Admin Support Desk**: Manage, triage, and reply to student support inquiries with status toggles (`Open`, `In Progress`, `Resolved`, `Closed`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Lucide React Icons, Axios, React Router DOM 6 |
| **Backend** | Java 17, Spring Boot 3.3.4, Spring Web, Spring Data JPA, Spring Security 6 |
| **Authentication** | Stateless JWT (JJWT 0.12.6), BCrypt Password Hashing, Google & Apple OAuth Simulation |
| **Database** | Supabase (Cloud PostgreSQL) with automatic zero-config H2 PostgreSQL Fallback |
| **Tooling & Build** | Apache Maven 3.9+, Node.js 18+, PostCSS, Autoprefixer |

---

## 📁 Project Architecture & Directory Structure

```text
mini project/
├── frontend/                     # React + Vite + Tailwind CSS Application
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # Axios instance with JWT interceptors
│   │   ├── components/
│   │   │   └── common/           # Navbar, Sidebar, Badges, Cards, Layouts
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state & OAuth handler
│   │   │   └── NotificationContext.jsx # Real-time alerts & unread badge
│   │   ├── pages/
│   │   │   ├── auth/             # LoginPage (Google/Apple), RegisterPage
│   │   │   ├── student/          # StudentDashboard, Profile, Skills, Jobs, etc.
│   │   │   ├── company/          # CompanyDashboard, PostJob, Applicants, etc.
│   │   │   └── common/           # SettingsPage
│   │   ├── App.jsx               # Application route definitions
│   │   ├── index.css             # Tailwind base & custom scrollbar styles
│   │   └── main.jsx              # React DOM bootstrap
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                      # Spring Boot 3 Enterprise Backend
│   ├── src/main/java/com/placement/portal/
│   │   ├── config/               # DataInitializer (Pre-seeded Demo Data)
│   │   ├── controller/           # REST Controllers (Auth, Student, Job, App, etc.)
│   │   ├── dto/                  # Data Transfer Objects & Requests
│   │   ├── entity/               # JPA Entities (User, StudentProfile, Job, etc.)
│   │   ├── repository/           # Spring Data JPA Repositories
│   │   ├── security/             # SecurityConfig, JWT Filter, Token Provider
│   │   ├── service/              # Business Logic & Notification Automations
│   │   └── PlacementPortalApplication.java # Spring Boot Entry Point
│   ├── src/main/resources/
│   │   ├── application.properties # H2 fallback & Supabase env configuration
│   │   └── application-supabase.properties
│   └── pom.xml                   # Maven Dependencies & Plugins
│
├── supabase_schema.sql           # Complete SQL script for Supabase Database
├── .env.example                  # Environment variables template
└── README.md                     # Comprehensive project documentation
```

---

## ⚙️ Quick Start Guide

### Prerequisites
1. **Node.js** (v18.0.0 or higher) & **npm**
2. **Java Development Kit (JDK 17)** or higher
3. **Apache Maven 3.8+**
4. *(Optional)* A free **Supabase** account for cloud PostgreSQL

---

### Step 1: Clone or Navigate to Project
```bash
cd "d:/mini project"
```

---

### Step 2: Backend Setup & Execution

#### Option A: Zero-Config In-Memory Mode (Recommended for instant demonstration)
The backend is pre-configured with embedded PostgreSQL-compatible H2 mode with preloaded seed data. You can start it immediately without setting up any external database:

```bash
cd backend
mvn spring-boot:run
```
*The backend starts at `http://localhost:8080` and automatically populates demo users, profiles, jobs, applications, and support tickets.*
*(H2 Console is accessible at `http://localhost:8080/h2-console` with JDBC URL `jdbc:h2:mem:placementdb`)*

#### Option B: Supabase Cloud PostgreSQL Mode
1. Log in to [Supabase](https://supabase.com) and create a new project.
2. In the **SQL Editor**, open and execute [`supabase_schema.sql`](supabase_schema.sql).
3. In **Project Settings -> Database**, find your Connection String (JDBC).
4. Run the backend with your Supabase credentials:
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.datasource.url=jdbc:postgresql://<host>:5432/postgres?sslmode=require --spring.datasource.username=postgres.<ref> --spring.datasource.password=<password> --spring.datasource.driver-class-name=org.postgresql.Driver"
```
Or set them as environment variables (refer to [`.env.example`](.env.example)).

---

### Step 3: Frontend Setup & Execution

```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Login Credentials

The application provides quick one-click demo login buttons on the login page, or you can log in with:

| Role | Email | Password | Features Accessible |
| :--- | :--- | :--- | :--- |
| **Student** | `student@placement.edu` | `password123` | Dashboard, Skills, Profile, Browse Jobs, Apply, Track Status, Notifications, Help Desk |
| **Company Recruiter** | `recruiter@abctech.com` | `password123` | Recruiter Dashboard, Post Job, Manage Jobs, Screen Applicants, Change Status |
| **Placement Admin** | `admin@placement.edu` | `password123` | Student Support Desk, Resolve Inquiries, Audit Job Postings |

> **Social Login Simulation**: Click **"Sign in with Google"** or **"Sign in with Apple"** on the login page to immediately log in with an auto-provisioned student account.

---

## 📡 REST API Documentation

### 1. Authentication (`/api/auth`)
- `POST /api/auth/register` - Create student or recruiter account.
- `POST /api/auth/login` - Authenticate and receive signed JWT.
- `POST /api/auth/google` - OAuth Google login simulation.
- `POST /api/auth/apple` - OAuth Apple login simulation.
- `GET /api/auth/me` - Fetch authenticated user profile.

### 2. Student Management (`/api/students`)
- `GET /api/students/profile` - Retrieve student profile, CGPA, college, and resume.
- `PUT /api/students/profile` - Update student profile fields.
- `GET /api/students/skills` - List all skills with proficiency levels.
- `POST /api/students/skills` - Add or update a technical skill.
- `DELETE /api/students/skills/{id}` - Remove a skill.

### 3. Job Postings (`/api/jobs`)
- `GET /api/jobs` - List all active jobs (supports `?query=` search).
- `GET /api/jobs/{id}` - Get full job details, required skills, and responsibilities.
- `POST /api/jobs` - Post a new vacancy *(Company/Admin)*.
- `DELETE /api/jobs/{id}` - Remove a job posting.

### 4. Applications & Tracking (`/api/applications`)
- `POST /api/applications` - Submit job application with cover letter & resume.
- `GET /api/applications/my` - Fetch applications for current student.
- `GET /api/applications` - Recruiter view of all student applications.
- `PUT /api/applications/{id}/status` - Recruiter updates status (triggers automatic student notification).

### 5. Notifications (`/api/notifications`)
- `GET /api/notifications` - Retrieve all alerts for logged-in user.
- `PUT /api/notifications/{id}/read` - Mark notification as read.

### 6. Support & Help Desk (`/api/support`)
- `POST /api/support/tickets` - Student opens inquiry ticket.
- `GET /api/support/tickets` - Student views submitted tickets.
- `GET /api/support/tickets/all` - Admin views all open inquiries.
- `PUT /api/support/tickets/{id}/status` - Admin responds and updates status.

---

## 🎓 College CSE Mini Project Evaluation Points

1. **Relational Database Integrity**: 11 normalized tables adhering to 3NF, foreign key cascading, unique constraints on user emails and composite keys on student applications.
2. **Stateless Security Architecture**: Spring Security with custom `OncePerRequestFilter` inspecting JWT Bearer headers, BCrypt salted hashing.
3. **Reactive UI State Management**: React Context API powering user sessions and notification badges with zero unnecessary re-renders.
4. **Automated Event-Driven Logic**: Application status changes automatically trigger system notifications without manual student polling.
5. **Modern Engineering Practices**: Component-based modularity, responsive Tailwind flex/grid styling, comprehensive error boundaries, and environment-driven configuration.

---

## 📄 License
This project is open-source under the MIT License for educational and college project purposes.
