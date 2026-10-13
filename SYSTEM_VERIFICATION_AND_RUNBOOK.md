# Cadence Campus Pulse: System Verification Runbook & Architecture State

## Overview
**Cadence Campus Pulse** is an end-to-end, event-driven university notification platform designed around microservices, Apache Kafka, Socket.IO, Web Push API (VAPID), and Nodemailer. 

All four implementation phases of the PAUL Framework have been built, dry-run tested, and verified with 100% acceptance criteria pass rates.

---

## 1. Network Topology & Ports

| Daemon / Service | Port | Role & Protocols | Health URL |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `4000` | Express, JWT Middleware, Reverse Proxy, CORS | `http://localhost:4000/health` |
| **User & Auth Service** | `4001` | Auth (JWT + bcrypt), Preferences, Push Subscriptions | `http://localhost:4001/health` |
| **Class Service** | `4002` | Class schedules, cancellations; produces `class-updates` | `http://localhost:4002/health` |
| **Exam Service** | `4003` | Exam schedules, venue shifts; produces `exam-updates` | `http://localhost:4003/health` |
| **Event Service** | `4004` | Campus events & emergencies; produces `general-events`| `http://localhost:4004/health` |
| **Notification Engine** | `4005` | Kafka Consumer (`notification-group`), Socket.IO, Web Push, Nodemailer | `http://localhost:4005/health` |
| **React PWA Frontend** | `3000` | Vite + React PWA, Service Worker (`sw.js`), 3D Canvas | `http://localhost:3000` |
| **Apache Kafka** | `9092` | Message Broker (Topics: `class-updates`, `exam-updates`, `general-events`) | N/A |
| **PostgreSQL** | `5432` | Relational Storage (`campus_db`) | N/A |

---

## 2. Test Suites & Dry Runs

Run each automated test suite directly from the project root:

### Phase 1 Verification: Gateway & Users
```bash
npm run test:phase1
```
- **AC-1:** API Gateway proxies `/api/users` to User Service.
- **AC-2:** Gateway rejects unauthenticated requests with HTTP 401 Unauthorized.
- **AC-3:** User and Subscription models handle registration, login (JWT), and Web Push subscription registration.

### Phase 2 Verification: Domain Services & Kafka Producers
```bash
npm run test:phase2
```
- **AC-1:** Class Service PUT endpoint `/api/classes/:id/status` cancels classes.
- **AC-2:** Exam Service PUT endpoint `/api/exams/:id/venue` shifts venues.
- **AC-3:** Endpoints publish strongly typed CloudEvents to Kafka topics `class-updates` and `exam-updates`.

### Phase 3 Verification: Notification Engine Consumer & Fanout
```bash
npm run test:phase3
```
- **AC-1:** Consumer group `notification-group` subscribes to all 3 Kafka topics.
- **AC-2:** Consumer queries user preferences and targets active delivery channels.
- **AC-3:** Socket.IO server pushes live `campus_alert` payloads to connected clients.
- **AC-4:** Native Web Push VAPID keys validated via `/api/notifications/vapid-public-key`.
- **AC-5:** Nodemailer email dispatch verified with zero paid APIs.

### End-to-End Pipeline Dry Run
```bash
npm run test:e2e
```
Executes the complete unified workflow: User Auth $\rightarrow$ Web Push Token Registration $\rightarrow$ Socket.IO Handshake $\rightarrow$ Class Cancellation $\rightarrow$ Exam Shift $\rightarrow$ Emergency Flash Broadcast $\rightarrow$ Multi-Channel Delivery Audit.

---

## 3. How to Launch the Full Platform

### Option A: Standard Startup (Zero-Docker Resilient Fallback)
```bash
# 1. Start all backend microservices and API Gateway
npm run start:all

# 2. In a separate terminal, launch the React PWA Frontend
cd frontend
npm run dev
```
Open `http://localhost:3000` in your browser.

### Option B: Docker Containerized Environment
```bash
# Start Dockerized PostgreSQL, Zookeeper, and Apache Kafka
docker compose up -d

# Start backend services
npm run start:all

# Start frontend
cd frontend
npm run dev
```

---

## 4. Pre-Seeded Demonstration Accounts

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@campus.edu` | `admin123` | Broadcast emergencies, inspect partitions, manage users |
| **Faculty** | `faculty@campus.edu` | `faculty123` | Cancel assigned classes (CS401), move exam venues |
| **Student** | `student@campus.edu` | `student123` | View alert feed, toggle delivery channels, register push |

---

## 5. Artifacts & Interactive Prototypes

- [**`master_architecture_and_execution_plan.md`**](file:///C:/Users/joshv/.gemini/antigravity/brain/5dbc671f-2c00-4fd7-a334-7775fcc96649/master_architecture_and_execution_plan.md): Complete architectural blueprint and event schemas.
- [**`cadence_campus_pulse_visual_design_system.md`**](file:///C:/Users/joshv/.gemini/antigravity/brain/5dbc671f-2c00-4fd7-a334-7775fcc96649/cadence_campus_pulse_visual_design_system.md): Visual design specifications and token library.
- [**`cadence_campus_pulse_ui.html`**](file:///C:/Users/joshv/.gemini/antigravity/brain/5dbc671f-2c00-4fd7-a334-7775fcc96649/cadence_campus_pulse_ui.html): High-fidelity standalone interactive prototype with 3D Canvas, Pinterest-style cards, and 52-week GitHub heatmap.
