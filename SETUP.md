# 🏛️ Cadence Campus Pulse — Local Setup & Launch Guide

> **Event-Driven Campus Notification & Alert Platform**  
> High-throughput, real-time institutional communications built with Apache Kafka, Node.js microservices, and a tactile React PWA frontend.

This step-by-step guide walks you through setting up and launching the platform locally on **any Windows, macOS, or Linux PC** in under 5 minutes.

---

## 📋 Table of Contents
1. [Prerequisites](#-1-prerequisites)
2. [Project Structure Overview](#-2-project-structure-overview)
3. [Step-by-Step Quick Setup](#-3-step-by-step-quick-setup)
4. [Launch Methods](#-4-launch-methods)
   - [Method A: One-Click Quick Launch (Recommended)](#method-a-one-click-quick-launch-recommended)
   - [Method B: Single-Command Full-Stack Orchestrator](#method-b-single-command-full-stack-orchestrator)
   - [Method C: Multi-Terminal Manual Launch](#method-c-multi-terminal-manual-launch)
   - [Method D: Launch with Docker (Kafka & PostgreSQL)](#method-d-launch-with-docker-kafka--postgresql)
5. [Service & Port Architecture Map](#-5-service--port-architecture-map)
6. [Pre-Seeded Test Credentials](#-6-pre-seeded-test-credentials)
7. [Running the Automated Verification Suite](#-7-running-the-automated-verification-suite)
8. [Interactive Features Guide](#-8-interactive-features-guide)
9. [Troubleshooting & FAQs](#-9-troubleshooting--faqs)

---

## ⚙️ 1. Prerequisites

Before starting, ensure you have the following installed on your machine:

| Requirement | Minimum Version | Check Command | Download Link |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0+` (LTS recommended) | `node -v` | [nodejs.org](https://nodejs.org) |
| **npm** | `v9.0.0+` | `npm -v` | Bundled with Node.js |
| **Git** (optional) | `v2.30+` | `git -v` | [git-scm.com](https://git-scm.com) |
| **Docker Desktop** (optional) | `v24.0+` | `docker -v` | [docker.com](https://www.docker.com) |

> [!NOTE]
> **Docker is 100% Optional**: The platform includes an intelligent in-memory fallback broker and mock data store. It runs completely locally with pure Node.js even if Docker is not installed on the system!

---

## 📁 2. Project Structure Overview

```text
fsd-project/
├── frontend/                     # React 18 + Vite + Tailwind + Three.js PWA
│   ├── src/
│   │   ├── components/
│   │   │   ├── HeaderNav.tsx            # Navigation bar, sound toggle & role switcher
│   │   │   ├── Footer.tsx               # Footer metadata & architecture badges
│   │   │   ├── IndoorMapModal.tsx       # Interactive campus blueprint floorplan
│   │   │   ├── ThreeHeroCanvas.tsx      # 3D Three.js Kafka event lattice
│   │   │   ├── MonthlyAlertCalendar.tsx # Monthly calendar with timeline drawer
│   │   │   └── screens/
│   │   │       ├── LandingScreen.tsx         # Collegiate oil painting & 3D mesh
│   │   │       ├── LiveStreamScreen.tsx      # Pinterest fluid alert stream
│   │   │       ├── EventDispatcherScreen.tsx # Broadcast trigger console (Faculty/Admin)
│   │   │       ├── KafkaTelemetryScreen.tsx  # Broker partitions & KRaft monitor (Admin)
│   │   │       ├── SubscribersScreen.tsx     # Device tokens & notification prefs
│   │   │       └── GuideScreen.tsx           # Complete platform how-to & terms guide
│   │   ├── utils/
│   │   │   ├── calendar.ts       # RFC 5545 .ics iCalendar generator
│   │   │   └── sound.ts          # Synthesized Web Audio chime system
│   │   ├── App.tsx               # Root view router & active alert context
│   │   └── main.jsx
├── gateway/                      # Express API Gateway (:4000) & Reverse Proxy
├── services/
│   ├── user-service/             # Auth & JWT tokens (:4001)
│   ├── class-service/            # Course enrollments & schedule (:4002)
│   ├── exam-service/             # Exam seating & room shifts (:4003)
│   ├── event-service/            # Event producer & schema validator (:4004)
│   └── notification-service/     # Socket.IO & VAPID Web Push fanout (:4005)
├── scripts/
│   ├── start-all.js              # Node.js backend orchestrator
│   └── start-everything.js       # Full-stack orchestrator (backend + frontend)
├── tests/
│   └── test_e2e.js               # Automated end-to-end integration test suite
├── docker-compose.yml            # Container definitions for Kafka, ZK & Postgres
├── start-all.bat                 # One-click Windows launch script
├── start-all.sh                  # One-click macOS / Linux launch script
├── package.json                  # Root npm orchestrator configuration
└── SETUP.md                      # This setup guide
```

---

## 🚀 3. Step-by-Step Quick Setup

### Step 3.1: Extract or Open the Project
Open a terminal in the root directory of the project:
```bash
cd "path/to/fsd project"
```

### Step 3.2: Install All Dependencies (Backend + Frontend)
Run the automated setup command from the project root:
```bash
npm run setup
```
*(Or manually: `npm install && npm install --prefix frontend`)*

---

## 🖥️ 4. Launch Methods

Choose the method that best matches your operating system and workflow:

### Method A: One-Click Quick Launch (Recommended)

- **On Windows:**  
  Double-click **`start-all.bat`** in the project root, or run:
  ```powershell
  .\start-all.bat
  ```

- **On macOS / Linux:**  
  Make the launcher executable and run it:
  ```bash
  chmod +x start-all.sh
  ./start-all.sh
  ```

*This automatically verifies dependencies, starts all 5 backend microservices, launches the API Gateway on port 4000, and boots the Vite React frontend on port 3000.*

---

### Method B: Single-Command Full-Stack Orchestrator

Run the Node.js orchestrator from your terminal in the root directory:
```bash
npm run dev:all
```

You will see:
```text
🏛️  CADENCE CAMPUS PULSE - FULL STACK SYSTEM ORCHESTRATOR
📦 Starting Microservices...
   • API Gateway:         http://localhost:4000
   • User & Auth Service: http://localhost:4001
   • Class Service:       http://localhost:4002
   • Exam Service:        http://localhost:4003
   • Event Service:       http://localhost:4004
   • Notification Hub:    http://localhost:4005 (Socket.IO + VAPID)

⚡ Launching Vite React PWA Frontend on http://localhost:3000...
```

Open your browser to: **`http://localhost:3000`**

---

### Method C: Multi-Terminal Manual Launch

If you prefer to run services in separate terminals to inspect live logs:

**Terminal 1 — Backend Services & Gateway:**
```bash
npm run start:all
```

**Terminal 2 — React Frontend:**
```bash
cd frontend
npm run dev
```

*(Alternatively, you can launch each microservice in its own tab using `npm run start:gateway`, `npm run start:users`, `npm run start:classes`, `npm run start:exams`, `npm run start:events`, and `npm run start:notifications`)*.

---

### Method D: Launch with Docker (Kafka & PostgreSQL)

If you have Docker Desktop installed and want true containerized Kafka and Postgres:

1. **Start the containers:**
   ```bash
   docker compose up -d
   ```
   *Spins up PostgreSQL (`:5432`), Zookeeper (`:2181`), and Apache Kafka (`:9092`).*

2. **Launch the application:**
   ```bash
   npm run dev:all
   ```

3. **To stop Docker containers when done:**
   ```bash
   docker compose down
   ```

---

## 🗺️ 5. Service & Port Architecture Map

| Service | Port | Protocol | Description |
| :--- | :--- | :--- | :--- |
| **Frontend PWA** | `:3000` | HTTP / WSS | Vite React application with Three.js 3D lattice |
| **API Gateway** | `:4000` | HTTP | Reverse proxy with rate-limiting & JWT validation |
| **User Service** | `:4001` | HTTP / REST | Student, Faculty, Admin authentication & active directory |
| **Class Service** | `:4002` | HTTP / REST | Lecture schedules, enrollments, relocations |
| **Exam Service** | `:4003` | HTTP / REST | Final & midterm examinations seating & schedules |
| **Event Producer** | `:4004` | HTTP / REST | Ingestion engine validating CloudEvents v1.0.2 payloads |
| **Notification Engine** | `:4005` | WSS / VAPID | Duplex Socket.IO rooms, native Web Push, SMTP relay |
| **Apache Kafka Broker** | `:9092` | TCP | Partitioned event log (`class-updates`, `exam-updates`, etc.) |
| **PostgreSQL** | `:5432` | TCP | Durable persistence store |

---

## 🔑 6. Pre-Seeded Test Credentials & 3-Portal Login

The platform enforces **strict unauthenticated gating**: when you first open `http://localhost:3000`, only the Landing page is accessible. All internal portals (`Live Alerts`, `Calendar & Stats`, `Event Dispatcher`, `Database & CRUD`, `Kafka Telemetry`, `Subscribers`) require logging in.

Click **"Sign In / Register"** in the top navigation bar or any CTA on the Landing screen to access the 3 portals:

| Portal | Role | Sample Email | Password | Access & Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| 🎓 **Student Access Portal** | `Student` | `student@campus.edu` | `student123` | Read live streams, iCal sync, SVG blueprints, life-safety check-in. *(Broadcast triggers and database editing restricted)* |
| 👨‍🏫 **Faculty & Instructor Console** | `Faculty` | `faculty@campus.edu` | `faculty123` | Author and broadcast course alerts, access **Database & CRUD Studio**, mutate classroom locations. |
| 🏛️ **Senate Operations & Admin** | `Admin` | `admin@campus.edu` | `admin123` | **Full Platform Authority**: Emergency Flash sirens, Database & CRUD Studio, raw Kafka partition telemetry, dry-run simulations. |

> [!TIP]
> **1-Click Autofill**: Inside the Login screen (`/auth`), select any of the 3 role tabs and click **"1-Click Fill & Test Login"** to immediately sign into that persona.

---

## 👤 6.1 Profile Avatar, Settings & Real SMTP / SMS Binding

Clicking your **Profile Avatar** in the top-right header opens the **User Profile & Settings Modal**:
1. **My Details & Profile**: Edit your full name, institutional email, mobile number, carrier, and department. Changes persist to the persistent database.
2. **Switch Portal & Role**: Switch between Student, Faculty, and Admin personas with a single click.
3. **Real Outgoing Email / SMS Relay**:
   - By default in development, Nodemailer uses an ephemeral Ethereal preview.
   - Enter your real Gmail address and a 16-character **Google App Password** (generated in Google Account &rarr; Security &rarr; 2-Step Verification &rarr; App Passwords) and click **"Bind Authenticated Real SMTP Relay"**.
   - All dispatches and carrier SMS messages will now land directly in real personal inboxes!

---

## 🔔 6.2 Live Notification Center & Web Push

Clicking the **Bell Icon** in the header opens the **Live Notification Center**:
- **Real-Time Alert Feed**: Filter by All, Unread, or Critical Flash alerts.
- **Native OS Web Push Toggle**: Request browser permission with 1 click to receive native desktop operating system push alerts.
- **Synthesized Audio Chime Tester**: Test urgent siren and routine chime tones instantly.

---

## 🗄️ 6.3 Live Database & CRUD Operations Studio

Accessible via the **"Database & CRUD"** tab in the navigation bar (Faculty & Admin):
1. **Interactive Table Explorer**:
   - `courses` (Course Code, Title, Instructor, Venue, Schedule, Roster Count, Status).
   - `users` (Identity directory with student, faculty, and administrator records).
   - `exams` (Examination schedules and auditorium reservations).
   - `alert_audit_ledger` (Immutable cryptographic record of every broadcast).
2. **Full CRUD Operations**:
   - **Create**: Add new courses and users via modal forms with live validation.
   - **Read**: Live search, filtering by status (`NORMAL`, `RELOCATED`, `CANCELLED`), and latency counters.
   - **Update**: 1-click inline status mutation cycling (`NORMAL` &rarr; `RELOCATED` &rarr; `CANCELLED`) or full field editing.
   - **Delete**: Remove records with confirmation dialogs.
3. **Live SQL Console**:
   - Execute custom SQL or preset queries (`SELECT * FROM courses WHERE status != 'NORMAL';`, `SELECT id, name, role FROM users;`) with real-time row displays and millisecond execution metrics.
4. **Persistent ACID Store**:
   - Mutations persist immediately to disk (`services/shared/data/campus_db_store.json`) and synchronize with PostgreSQL when running.

---

## 📡 6.4 Deep Sender-to-Target Recipient Trajectory in Audit Trail

In the **Event Dispatcher** screen (`/event-dispatcher`):
- The **Audit Trail** table displays the full trajectory from **Sender** (e.g. `Dr. Julian Vance (Faculty)`) &rarr; **Target Recipients** (e.g. `Maya Lin + 198 enrolled students`).
- Clicking **"Inspect"** opens the **Broker Telemetry & Recipient Ledger**:
  - Displays the end-to-end fanout pipeline: `Dispatcher (:4004)` &rarr; `Kafka Broker (:9092)` &rarr; `Tri-Fanout (:4005)` &rarr; `Inboxes & Phones`.
  - Detailed Sender Origin Provenance with cryptographic Ed25519 signature.
  - Comprehensive Target Recipient Breakdown table listing each individual student, institutional email, telco carrier SMS address (e.g. `5552345678@vtext.com`), delivery status, and SHA-256 cryptographic receipt hash.
  - One-click navigation to inspect the record inside the Database & CRUD Studio.

## 🧪 7. Running the Automated Verification Suite

To verify that the microservices, authentication, Kafka event mesh, and Socket.IO delivery layers are operating correctly:

Run the end-to-end integration test:
```bash
npm run test:e2e
```

**Expected Output:**
```text
======================================================
🌟 CADENCE CAMPUS PULSE: END-TO-END PIPELINE VALIDATION
   Full Microservices, Kafka Event Mesh & Multi-Channel Fanout
======================================================

▶ [Step 1] Authenticating Student & Faculty accounts via Gateway (:4000)...
  ✔ Student authenticated: Maya Lin (UID: #0924-ALUM-2025)
  ✔ Faculty authenticated: Dr. Julian Vance
▶ [Step 2] Connecting Student client to Notification Socket.IO Hub (:4005)...
  ✔ Connected to Socket.IO hub with socket ID: ...
▶ [Step 3] Faculty publishing VENUE_CHANGED event to Kafka broker...
  ✔ Published to topic 'class-updates' (Partition 0, Offset: 42918)
▶ [Step 4] Student received live broadcast via Socket.IO room!
  ✔ Verified delivery latency: 1.2ms
  ✔ 0 External Cloud API fees incurred ($0.00 zero-cost architecture)
======================================================
🎉 ALL END-TO-END PIPELINE TESTS PASSED (100% SUCCESS)
======================================================
```

You can also run phase-specific tests:
- `npm run test:database` (Live ACID Database CRUD & SQL preset validation)
- `npm run test:phase1` (Authentication & Gateway validation)
- `npm run test:phase2` (Kafka producers & topic routing)
- `npm run test:phase3` (Multi-channel notification fanout)

---

## 🎨 8. Interactive Features Guide

Every button and view in the user interface is fully interactive with tactile feedback:

1. **Role-Based Access Control & Persona Switcher**:
   - Header dropdown allows instant switching between **Student** (`Maya Lin`), **Faculty** (`Dr. Julian Vance`), and **Admin** (`Dean Sterling`).
   - **Student View**: Focuses on personal course alerts, iCal calendar export, indoor maps, safe check-in, and notification preferences. Broadcast triggers and Kafka internals are restricted.
   - **Faculty View**: Course-level dispatch tools (`Cancel Class`, `Shift Venue`, `Event Mutation Studio`), subscriber roster access, and guide.
   - **Admin View**: Full platform authority including Emergency Flash Siren broadcasts, Kafka KRaft partition monitoring, consumer lag diagnostics, and queue flushes.

2. **Monthly Alert Calendar & Interactive Timeline**:
   - Monthly navigation (Sunday–Saturday calendar grid) with month/year traversal.
   - **Category-Specific Color Assignment**:
     - *Class Updates*: Terracotta Rust (`#C2593F`)
     - *Exam Updates*: Amber Gold (`#D99B26`)
     - *Campus Safety*: Critical Crimson (`#A82A2A`) / Forest (`#2E473B`)
     - *All Categories (Combined)*: Deep Collegiate Slate-Teal (`#003643`)
   - **4-Level Color Intensity Scaling**: Dynamically scales border and fill opacity based on alert frequency (0 alerts = muted stone, 1-2 = subtle tint, 3-5 = medium tint, 6+ = high intensity solid fill).
   - **Interactive Hover & Click Drawer**: Pin any day to reveal its chronological event timeline with exact timestamps, course tags, and event severities.

3. **Platform Guide & Terms Page (`/guide`)**:
   - Accessible via the "Platform Guide & Terms" navigation tab.
   - Features comprehensive explanations: Zero-Cost Architecture ($0.00 SaaS savings), Technical Terms & Kafka Glossary (Brokers, Partitions, High-Water Mark, Consumer Lag), Step-by-Step Push Guides for Faculty, Emergency Protocols for Admins, Student Manual, and an interactive CloudEvents v1.0.2 schema sandbox.

4. **"Add to Calendar" (.ics export)**:
   - Generates an RFC 5545 compliant `.ics` calendar invitation file.
   - Automatically prompts browser download, adds a 15-minute alarm, updates the button state to `Added to iCal ✓`, and plays an alert chime.

5. **"View Indoor Map"**:
   - Opens the interactive **Campus Blueprint & Indoor Map Modal**.
   - Displays real-time waypoints, floor switchers (Floor 1, 2, 3), emergency exits, and ADA accessibility paths without requiring paid external map APIs.

6. **"Share Alert"**:
   - Copies a formatted alert summary and link directly to your system clipboard with visual toast feedback (`Link Copied ✓`).

7. **"I Am Safe" (Student Life-Safety Check-in)**:
   - Registers student safety status during campus emergency alerts and updates button state to `Verified Safe (Checked-in) ✓`.

8. **Quick Broadcast Triggers ("Cancel Class", "Shift Venue", "Flash Siren")**:
   - Injects real-time notifications into the live feed with smooth animations and audio alerts.

9. **3D Event Lattice vs Campus Quad Oil Painting**:
   - Toggle seamlessly between the interactive Three.js 3D particle mesh, the impressionistic collegiate campus painting, or a unified split view.

10. **Audio Chimes**:
    - Toggle institutional audio notifications using the sound icon in the top navigation bar. Uses the browser's native Web Audio API (zero external audio file dependencies).

---

## ❓ 9. Troubleshooting & FAQs

### Q: Port 3000 or 4000 is already in use by another application.
**A:** Vite and Node allow changing ports via environment variables:
- To run frontend on another port: `cd frontend && npx vite --port 3001`
- To run gateway on another port: `PORT=4010 node gateway/src/index.js`

### Q: Why didn't I hear an audio chime when clicking a notification?
**A:** Modern browsers require an initial user interaction (a click anywhere on the page) before allowing audio playback. Make sure the sound icon in the top header is enabled (`Sound ON`).

### Q: On Windows, PowerShell says `cannot be loaded because running scripts is disabled`.
**A:** Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Or simply use the Command Prompt (`cmd.exe`) or double-click `start-all.bat`.

### Q: Can I run this offline without an active internet connection?
**A:** **Yes!** All libraries, 3D visualizations, fonts, audio synthesizers, and microservice fallbacks run entirely locally on `localhost`.

---

*Cadence Campus Pulse • Designed & Engineered for High-Reliability Collegiate Operations.*
