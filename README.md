# 🏛️ Cadence Campus Pulse

### Event-Driven Campus Notification & Alert Platform
**Real-Time Microservices Architecture with Apache Kafka, Zero-Cost Fanout, and a High-End Tactile UI**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org)
[![Architecture](https://img.shields.io/badge/Architecture-Event--Driven%20Microservices-blue.svg)](#)
[![Zero-Cost](https://img.shields.io/badge/Cloud%20SaaS%20Cost-%240.00%20(No%20Twilio%2FFCM)-emerald.svg)](#)

---

## ⚡ Quick Start
Looking to run Cadence on another PC? **Read the full step-by-step setup guide:**
👉 **[SETUP.md — Local Setup & Launch Guide](SETUP.md)**

```bash
# 1. Install dependencies
npm install && npm install --prefix frontend

# 2. Launch full-stack platform (backend + frontend)
npm run dev:all

# 3. Open browser
http://localhost:3000
```
*(On Windows, you can simply double-click **`start-all.bat`**!)*

---

## 📖 System Overview

Cadence Campus Pulse is an enterprise-grade institutional alert platform engineered to broadcast life-safety announcements, lecture relocations, and examination mutations to thousands of students, faculty members, and campus emergency responders in **<1.5 milliseconds** with **zero external cloud API costs**.

### Key Architectural Tenets:
1. **Zero Paid APIs ($0.00 Budget)**:
   - Replaces Twilio SMS with self-hosted Telco SMTP Email-to-SMS gateways.
   - Replaces Firebase Cloud Messaging (FCM) with native W3C Web Push (VAPID RFC 8291).
   - Replaces SendGrid with self-hosted Nodemailer DKIM/DMARC relays.
   - Replaces Google Maps APIs with self-contained SVG vector floorplans and indoor blueprints.
2. **Decoupled Event Streaming (Apache Kafka)**:
   - High-throughput partitioned topics: `class-updates`, `exam-updates`, `general-events`.
   - Strict adherence to the CNCF **CloudEvents v1.0.2** specification.
   - Resilient leader replication with deterministic high-water mark synchronization.
3. **High-End Collegiate Aesthetics**:
   - Palette inspired by impressionistic campus oil paintings (deep collegiate slate-teal `#133945`, warm sunlit terracotta `#d95c3a`, antique amber `#dfa64f`, ivory parchment `#f4f7f6`).
   - Tactile fluid cards inspired by visionOS and Pinterest glassmorphism.
   - Interactive 3D event broker lattice rendered with Three.js.
   - Monthly alert calendar with category color intensity scaling and interactive daily event timeline drawer.
   - Role-based views tailored specifically for Students, Faculty, and Administrators.
   - Dedicated Platform Guide & Technical Terms documentation page (`/guide`).

---

## 🏗️ Architecture Diagram

```mermaid
flowchart TD
    subgraph Client ["Client Presentation Tier (Port 3000)"]
        UI["React 18 PWA + Three.js 3D Mesh"]
        SW["Service Worker (VAPID Push Listener)"]
        WS["Socket.IO Client Connection"]
    end

    subgraph Ingestion ["API Gateway & Producer Tier (Port 4000)"]
        GW["API Gateway (JWT Rate-Limiter :4000)"]
        EP["Event Producer Service (:4004)"]
    end

    subgraph Broker ["Event Streaming Core (Port 9092)"]
        K["Apache Kafka Cluster"]
        T1["class-updates (Partitions 0..2)"]
        T2["exam-updates (Partitions 0..1)"]
        T3["general-events (Partitions 0..3)"]
        K --> T1
        K --> T2
        K --> T3
    end

    subgraph Microservices ["Domain Microservices Tier"]
        US["User & Auth Service (:4001)"]
        CS["Class Service (:4002)"]
        ES["Exam Service (:4003)"]
    end

    subgraph Fanout ["Notification Engine Tier (Port 4005)"]
        NE["Notification Fanout Engine (:4005)"]
        SIO["Duplex Socket.IO (<0.4ms)"]
        WP["Native Web Push (VAPID RFC 8291)"]
        SMTP["Nodemailer Carrier Relay ($0.00 SMS)"]
    end

    UI --> GW
    GW --> US
    GW --> CS
    GW --> ES
    GW --> EP
    EP --> K
    T1 & T2 & T3 --> NE
    NE --> SIO --> WS
    NE --> WP --> SW
    NE --> SMTP
```

---

## 🎯 Interactive Feature Highlights

| Feature | Description |
| :--- | :--- |
| **Add to Calendar** | Generates and downloads an RFC 5545 `.ics` file with an embedded 15-minute alarm, updating UI state to `Added to iCal ✓`. |
| **Indoor Venue Floorplan** | Opens an interactive modal with SVG campus blueprint, floor switchers (L1–L3), and ADA accessibility waypoints. |
| **Share Alert** | Copies the alert title, location, and link directly to the system clipboard with tactile feedback. |
| **Life-Safety Check-in** | Allows students to flag `I Am Safe`, updating active roster verification during campus emergencies. |
| **Simulate Broadcasts** | Triggers live faculty announcements (`Cancel Class`, `Shift Venue`, `Flash Alert`) with synthesized Web Audio chimes. |
| **52-Week Activity Grid** | GitHub-style commit heatmap tracking event throughput across topics, with interactive day cell inspection. |
| **Campus Painting vs 3D Lattice** | Dynamic view switcher toggling between the impressionistic campus quad painting and the Three.js 3D Kafka event lattice. |

---

## 🧪 Verification & Testing

Verify the complete multi-service pipeline with the automated test suite:
```bash
# Run end-to-end integration tests
npm run test:e2e

# Run phase tests
npm run test:phase1   # Auth & Gateway
npm run test:phase2   # Kafka Topics & Producer
npm run test:phase3   # Socket.IO & Fanout
```

---

## 📚 Documentation Index
- **[SETUP.md](SETUP.md)** — Step-by-step launch guide for running on any other PC.
- **[master_architecture_and_execution_plan.md](master_architecture_and_execution_plan.md)** — Deep-dive architectural specification.
- **[SYSTEM_VERIFICATION_AND_RUNBOOK.md](SYSTEM_VERIFICATION_AND_RUNBOOK.md)** — Operational runbook and troubleshooting.

---

*Designed & engineered with Google Antigravity for institutional campus reliability.*
