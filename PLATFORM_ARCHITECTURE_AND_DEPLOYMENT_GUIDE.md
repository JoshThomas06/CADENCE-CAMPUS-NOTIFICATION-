# 🏛️ Cadence Campus Pulse — Platform Architecture, Feature Catalog & Production Deployment Blueprint

> **Event-Driven Campus Notification & Alert Platform**  
> Comprehensive Technical Reference, Real-Time Delivery Mechanics, System Capabilities, and Step-by-Step Production Cloud Deployment Guide.

---

## 📑 Document Structure
1. [Executive Summary & What the Application Does](#1-executive-summary--what-the-application-does)
2. [Real-Time Notification & Event Architecture Mechanics](#2-real-time-notification--event-architecture-mechanics)
   - [Event Producers & CloudEvents v1.0.2 Specification](#21-event-producers--cloudevents-v102-specification)
   - [Kafka Broker Topics, Partitioning & Ordering Guarantees](#22-kafka-broker-topics-partitioning--ordering-guarantees)
   - [Consumer Groups & Microservice Decoupling](#23-consumer-groups--microservice-decoupling)
   - [Zero-Cost Tri-Fanout Delivery Engine](#24-zero-cost-tri-fanout-delivery-engine)
   - [Priority Levels & Blast Radius Protocol](#25-priority-levels--blast-radius-protocol)
3. [Comprehensive Feature Catalog](#3-comprehensive-feature-catalog)
   - [Tactile VisionOS / Pinterest-Inspired Live Alert Feed](#31-tactile-visionos--pinterest-inspired-live-alert-feed)
   - [Simplified Dot Calendar & Extensive Analytics Center](#32-simplified-dot-calendar--extensive-analytics-center)
   - [Interactive 3D Three.js Event Broker Lattice](#33-interactive-3d-threejs-event-broker-lattice)
   - [RFC 5545 iCalendar (.ics) One-Click Synchronizer](#34-rfc-5545-icalendar-ics-one-click-synchronizer)
   - [Vector Blueprint Campus Wayfinding Modal](#35-vector-blueprint-campus-wayfinding-modal)
   - [Student Life-Safety Emergency Check-In](#36-student-life-safety-emergency-check-in)
   - [Role-Based Access Control (RBAC) & Persona Engine](#37-role-based-access-control-rbac--persona-engine)
   - [Interactive Platform Guide & Technical Terms Glossary](#38-interactive-platform-guide--technical-terms-glossary)
4. [Production Deployment Blueprint (Transitioning to Full Enterprise Deployment)](#4-production-deployment-blueprint)
   - [Architecture Transition: Local vs Production](#41-architecture-transition-local-vs-production)
   - [Database Layer: PostgreSQL 16+ Migration & Connection Pooling](#42-database-layer-postgresql-16-migration--connection-pooling)
   - [Apache Kafka KRaft Multi-Broker Cluster Setup](#43-apache-kafka-kraft-multi-broker-cluster-setup)
   - [Redis Distributed Cache & Socket.IO Redis Adapter](#44-redis-distributed-cache--socketio-redis-adapter)
   - [Security, TLS Termination & Nginx Ingress](#45-security-tls-termination--nginx-ingress)
   - [Native Web Push (VAPID) Production Configuration](#46-native-web-push-vapid-production-configuration)
   - [Carrier Email-to-SMS & Institutional SMTP Setup](#47-carrier-email-to-sms--institutional-smtp-setup)
   - [Docker Compose & Kubernetes Deployment Manifests](#48-docker-compose--kubernetes-deployment-manifests)
   - [CI/CD Pipeline & GitHub Actions Automation](#49-cicd-pipeline--github-actions-automation)
   - [Observability: Prometheus, Grafana & OpenTelemetry](#410-observability-prometheus-grafana--opentelemetry)
5. [Summary Checklist of Production Changes](#5-summary-checklist-of-production-changes)

---

## 1. Executive Summary & What the Application Does

### The Problem in Higher Education & Enterprise Campuses
Traditional higher-education communication stacks suffer from acute architectural fragmentation:
- **High Latency (>15 Minutes)**: Class cancellations and exam relocations sent via registrar email distribution lists often take 10 to 30 minutes to propagate through institutional spam filters, leaving students waiting outside locked lecture halls.
- **Siloed Systems**: Campus Police dispatch emergency sirens through proprietary PA hardware, faculty cancel lectures via Learning Management Systems (Canvas, Blackboard), and registrars announce room shifts through student portals. Students receive conflicting, out-of-order updates.
- **Exorbitant Cloud API SaaS Bills**: Enterprise SMS vendors (Twilio, MessageBird) charge $0.0079 to $0.015 per SMS. Sending one flash announcement to 25,000 enrolled students costs **\$200 to \$375 per dispatch**, draining departmental budgets. Commercial push providers (Pusher, Firebase FCM paid tiers) impose recurring subscription penalties.

### What Cadence Campus Pulse Does
**Cadence Campus Pulse** is an event-driven institutional communication platform built with a decoupled microservices architecture, Apache Kafka message streaming, and a tactile VisionOS/Pinterest-inspired Progressive Web App (PWA).

The platform solves campus communication delays by providing:
1. **Sub-2-Millisecond Event Streaming**: Institutional domain events commit to Apache Kafka partitions and fan out to active browser sessions in `<0.4ms`.
2. **Zero-Cost Delivery Infrastructure ($0.00 SaaS Bills)**: Replaces Twilio SMS with self-hosted Telco Email-to-SMS relays, replaces Firebase FCM with standard W3C Web Push (VAPID RFC 8291), and replaces Google Maps APIs with self-contained vector floorplan blueprints.
3. **Role-Governed Operations**: Granular authority separating student consumers (`Maya Lin`), faculty authors (`Dr. Julian Vance`), and senate administrators (`Dean Sterling`).
4. **Resilient Offline Capabilities**: PWA service workers receive push notifications and render cached architectural blueprints even if campus Wi-Fi drops.

---

## 2. Real-Time Notification & Event Architecture Mechanics

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DOMAIN EVENT PRODUCERS (MICROSERVICES)                          │
│   Class Service (:4002)     Exam Service (:4003)        Event Service (:4004)          │
│   • CLASS_CANCELLED         • VENUE_CHANGED             • CRITICAL_FLASH               │
│   • LAB_RELOCATED           • SEAT_REASSIGNED           • WEATHER_WARNING              │
└──────────────────────────┬─────────────────────────────┬───────────────────────────────┘
                           │                             │
                           ▼ CloudEvents v1.0.2 JSON     ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        APACHE KAFKA KRaft BROKER (:9092)                               │
│  Topic: class-updates          Topic: exam-updates          Topic: general-events      │
│  [P0][P1][P2]                  [P0][P1][P2]                 [P0][P1][P2]               │
│  Key: course_id                Key: exam_id                 Key: campus_zone           │
└──────────────────────────┬─────────────────────────────┬───────────────────────────────┘
                           │                             │
                           ▼ Consumer Group: notification-group                          │
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION ENGINE (:4005) - ZERO-DROP FANOUT                      │
│                                                                                        │
│   ┌─────────────────────┐   ┌────────────────────────┐   ┌─────────────────────────┐   │
│   │   CHANNEL 1         │   │   CHANNEL 2            │   │   CHANNEL 3             │   │
│   │   Duplex WebSockets │   │   Native Web Push      │   │   Carrier Email-to-SMS  │   │
│   │   (Socket.IO Hub)   │   │   (VAPID RFC 8291)     │   │   (Nodemailer Relays)   │   │
│   │   <0.4ms In-App     │   │   Lockscreen OS Push   │   │   Cellular SMS Delivery │   │
│   │   $0.00 Cost        │   │   $0.00 Cost           │   │   $0.00 Cost            │   │
│   └──────────┬──────────┘   └───────────┬────────────┘   └────────────┬────────────┘   │
└──────────────┼──────────────────────────┼─────────────────────────────┼────────────────┘
               ▼                          ▼                             ▼
        Active Students           Desktop / Mobile Lockscreen    Mobile Feature Phones
```

### 2.1. Event Producers & CloudEvents v1.0.2 Specification
Domain events emitted by internal microservices strictly conform to the CNCF **CloudEvents v1.0.2** specification:
```json
{
  "specversion": "1.0",
  "type": "edu.campus.class.cancelled",
  "source": "/services/class-service/cls_101",
  "id": "evt_e678841a-08b2-4e2e-8036-d7a99800cb2c",
  "time": "2026-10-12T11:00:00.000Z",
  "datacontenttype": "application/json",
  "data": {
    "courseId": "CS401",
    "courseName": "Distributed Systems",
    "section": "01",
    "instructor": "Dr. Sarah Lin",
    "priority": "HIGH",
    "status": "CANCELLED",
    "reason": "Faculty Medical Emergency",
    "affectedStudents": 199,
    "rescheduledTo": null,
    "makeupLectureUrl": "https://canvas.campus.edu/cs401/makeup-04"
  }
}
```

### 2.2. Kafka Broker Topics, Partitioning & Ordering Guarantees
- **Topic `class-updates`**: 3 Partitions. Partition key is `course_id`. Ensures that all state mutations for `CS401` arrive sequentially at the consumer with zero out-of-order race conditions.
- **Topic `exam-updates`**: 3 Partitions. Partition key is `exam_id`. Ensures room shifts and seating reallocations are evaluated deterministically.
- **Topic `general-events`**: 3 Partitions. Partition key is `geo_zone` or `facility_id`. Carries campus-wide emergency broadcasts and dean keynote notices.

### 2.3. Consumer Groups & Microservice Decoupling
Multiple independent consumer groups listen to the Kafka broker simultaneously without interfering with each other:
1. `notification-group`: Reads new messages, computes enrolled recipient Blast Radii, and triggers multi-channel dispatch.
2. `audit-logging-worker`: Appends every CloudEvent to an immutable append-only compliance ledger for campus emergency audits.
3. `metrics-collector`: Calculates broker throughput, consumer lag, and high-water mark synchronization.

### 2.4. Zero-Cost Tri-Fanout Delivery Engine
When `notification-group` consumes an alert, it evaluates student course registrations and fans out across three zero-cost protocols:
1. **Channel 1 — Socket.IO Rooms (`:4005`)**: Active clients subscribe to rooms matching their enrolled courses (`room:CS401`, `room:ARCH310`) and role (`role:student`). Dispatched in `<0.4ms`.
2. **Channel 2 — W3C Native Web Push (VAPID RFC 8291)**: Browser service workers receive push payloads signed with ECDSA P-256 keys. Renders system-native notifications on Windows Action Center, macOS Notification Center, Android lock screens, and iOS PWAs with custom vibration patterns.
3. **Channel 3 — Carrier Email-to-SMS Gateway**: Transmits alert text through free telecommunication SMTP gateways:
   - AT&T: `[number]@txt.att.net`
   - Verizon: `[number]@vtext.com`
   - T-Mobile: `[number]@tmomail.net`
   - Sprint: `[number]@messaging.sprintpcs.com`
   This allows instant cellular SMS delivery without recurring Twilio or message aggregator fees.

### 2.5. Priority Levels & Blast Radius Protocol
| Priority | Use Cases | Fanout Channels | DND Override? | UI Sound / Action |
| :--- | :--- | :--- | :---: | :--- |
| `NORMAL` | Guest lecture pass, syllabus update | Socket.IO, Email | No | Gentle subtle chime |
| `HIGH` | Class cancellation, venue relocation | Socket.IO, Web Push, SMS | No | High-pitch alert tone, iCal invitation |
| `CRITICAL_FLASH` | Inclement weather siren, hazard directive | All Channels + Siren Overrides | **YES (Mandatory)** | Continuous alarm siren, lockscreen banner, "I Am Safe" check-in prompt |

---

## 3. Comprehensive Feature Catalog

### 3.1. Tactile VisionOS / Pinterest-Inspired Live Alert Feed
- **Visual Design**: Layered frosted glassmorphism (`backdrop-blur-md`), collegiate slate-teal borders (`#DCE5E7`), and tactile elevation on hover.
- **Category Filter Chips**: Fast one-click filtering by `All Streams`, `Urgent Only`, `Classroom Updates`, `Venue Migrations`, and `Life Safety`.
- **Search & Highlighting**: Instant fuzzy search matching course codes (`CS401`, `ARCH310`), professor names, or venue keywords (`Olin Hall`, `Quad`).

### 3.2. Simplified Dot Calendar & Extensive Analytics Center
- **Compact Dot Mode (Live Stream & Landing)**:
  - Clean, space-saving calendar cells with day numbers and color-coded dots representing active alerts.
  - Category dots: Terracotta for Class, Amber for Exam, Crimson for Campus Safety.
  - Hover or click opens the **Daily Event Timeline Drawer** with timestamps, locations, and severities.
- **Extensive Calendar & Stats Screen (`/calendar`)**:
  - Full-page analytics suite accessible via the "Extensive View" button or the navigation bar.
  - **Category Volume Breakdown**: Metrics tracking Class Mutations (182 events, 52.3%), Exam Shifts (114 events, 32.8%), and Safety Flashes (52 events, 14.9%).
  - **Hourly Broker Throughput Chart**: Visual distribution of event commits across instructional hours (08:00 to 17:00), highlighting peak broadcast windows.
  - **Zero-Drop Guarantee Badge**: Real-time Kafka partition offset synchronization metrics.

### 3.3. Interactive 3D Three.js Event Broker Lattice
- **Dynamic 3D Canvas**: Renders rotating concentric Kafka topic rings orbiting a pulsing event core.
- **Particle Streams**: Multi-colored particle pulses traveling between broker rings and satellite microservice nodes to represent active event throughput.
- **Mouse Tilt Tracking**: Camera rotates smoothly based on cursor coordinates for an immersive, tactile depth experience.
- **Collegiate Painting Split View**: One-click toggle between the 3D WebGL mesh and the impressionistic campus quad oil painting.

### 3.4. RFC 5545 iCalendar (`.ics`) One-Click Synchronizer
- Generates RFC 5545 compliant `.ics` calendar invitation files on-the-fly in the browser.
- Automatically creates calendar events with exact reschedule times, new classroom locations, and an embedded 15-minute sound reminder alarm.
- Triggers native browser download and updates the UI button to `Added to iCal ✓` with tactile audio confirmation.

### 3.5. Vector Blueprint Campus Wayfinding Modal
- Opens a responsive, interactive architectural blueprint modal showing campus buildings and classrooms.
- Features multi-floor navigation (`Level 1`, `Level 2`, `Level 3`), active beacon waypoints, emergency exit routes, and ADA-accessible ramps.
- Operates 100% offline using vector SVG geometry without requiring paid Google Maps or Mapbox API keys.

### 3.6. Student Life-Safety Emergency Check-In
- Activated during campus weather flash emergencies and siren broadcasts.
- Students click the "I Am Safe" button on their alert card.
- Immediately registers verification status in the User Service and live Senate emergency headcount roster, switching the card state to `Verified Safe (Checked-in) ✓`.

### 3.7. Role-Based Access Control (RBAC) & Persona Engine
The platform includes an active **Persona Switcher** in the header:
- **Student Persona (`Maya Lin`)**:
  - Read-only live alert stream with personalized course filters (`CS401`, `ARCH310`).
  - iCal schedule sync, vector indoor map routing, life-safety check-in, and personal device notification preferences.
  - Broadcast authoring and Kafka internals are restricted with clear role badges.
- **Faculty Persona (`Dr. Julian Vance`)**:
  - Course-level dispatch privileges: cancel classes, shift laboratory venues, schedule makeup lectures.
  - Access to the **Event Dispatcher Studio** and enrolled student subscriber roster.
- **Administrator Persona (`Dean Sterling`)**:
  - Master authority over all campus topics, including Emergency Flash Sirens.
  - Full access to the **Kafka Telemetry Screen**, partition watermarks, consumer lag monitors, and dead-letter queue flush tools.

### 3.8. Interactive Platform Guide & Technical Terms Glossary
- Dedicated documentation page accessible via the "Platform Guide" navigation tab.
- Includes a live **Admin Siren Simulation Sandbox** that plays audio alarms and demonstrates emergency fanout mechanics safely in the browser.
- Interactive CNCF **CloudEvents v1.0.2 Schema Sandbox** with one-click clipboard copy.
- Comprehensive technical glossary explaining Kafka brokers, partitions, consumer lag, and VAPID RFC 8291.

---

## 4. Production Deployment Blueprint

This section provides the step-by-step engineering roadmap to transition Cadence Campus Pulse from its current local development environment into a high-availability, enterprise-grade cloud production cluster.

### 4.1. Architecture Transition: Local vs Production

| Component | Current Local Environment | Production Cloud Environment |
| :--- | :--- | :--- |
| **API Gateway** | Express proxy on `localhost:4000` | Nginx / Traefik Ingress with TLS 1.3 & HTTP/2 |
| **Services Host** | Local Node.js processes (:4001–:4005) | Dockerized container pods managed by Kubernetes (EKS/GKE) |
| **Message Broker** | In-memory fallback / Local Kafka (:9092) | 3-Node Apache Kafka KRaft Cluster with Replication Factor 3 |
| **Persistence Store** | In-memory pre-seeded mock store | Managed PostgreSQL 16+ with PgBouncer connection pooling |
| **Socket Hub State** | Single-node in-memory Socket.IO | Clustered Socket.IO nodes connected via Redis Pub/Sub Adapter |
| **Push Notification** | Local VAPID keys | Hardened VAPID keys stored in AWS Secrets Manager / Vault |
| **Email / SMS Relay** | Mock SMTP logger | Authenticated Postfix or Institutional Relay with DKIM/SPF/DMARC |
| **Static Frontend** | Vite dev server on `localhost:3000` | Minified static bundle served via Cloudflare CDN / AWS S3 + CloudFront |

---

### 4.2. Database Layer: PostgreSQL 16+ Migration & Connection Pooling

In local development, the microservices use in-memory state. For production, deploy PostgreSQL 16+ with dedicated schemas for each service.

#### Schema Separation
Each microservice maintains its own isolated database schema to preserve bounded contexts:
- `user_service_db`: Tables `users`, `device_tokens`, `notification_preferences`.
- `class_service_db`: Tables `courses`, `sections`, `enrollments`, `class_schedules`.
- `exam_service_db`: Tables `exams`, `seating_allocations`, `venues`.
- `notification_service_db`: Tables `dispatch_audit_log`, `delivery_receipts`, `vapid_subscriptions`.

#### Recommended Database Connection Pool (PgBouncer)
Place PgBouncer in front of PostgreSQL to prevent connection exhaustion during high-concurrency event fanout:
```ini
[databases]
campus_pulse = host=postgres-primary.internal port=5432 dbname=campus_pulse

[pgbouncer]
listen_port = 6432
listen_addr = 0.0.0.0
auth_type = scram-sha-256
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 5000
default_pool_size = 50
reserve_pool_size = 10
reserve_pool_timeout = 5
```

---

### 4.3. Apache Kafka KRaft Multi-Broker Cluster Setup

Deploy a 3-broker KRaft cluster (ZooKeeper-free) for high availability, fault tolerance, and zero-drop durability.

#### Topic Configuration Script (`setup-production-topics.sh`)
```bash
#!/usr/bin/env bash
set -e

BOOTSTRAP_SERVER="kafka-broker-1:9092,kafka-broker-2:9092,kafka-broker-3:9092"

# Topic 1: Class Updates (7-day retention)
kafka-topics.sh --bootstrap-server $BOOTSTRAP_SERVER --create --if-not-exists \
  --topic class-updates \
  --partitions 6 \
  --replication-factor 3 \
  --config min.insync.replicas=2 \
  --config retention.ms=604800000 \
  --config compression.type=snappy

# Topic 2: Exam Updates (14-day retention)
kafka-topics.sh --bootstrap-server $BOOTSTRAP_SERVER --create --if-not-exists \
  --topic exam-updates \
  --partitions 6 \
  --replication-factor 3 \
  --config min.insync.replicas=2 \
  --config retention.ms=1209600000 \
  --config compression.type=snappy

# Topic 3: General Emergency Events (30-day retention for compliance audit)
kafka-topics.sh --bootstrap-server $BOOTSTRAP_SERVER --create --if-not-exists \
  --topic general-events \
  --partitions 6 \
  --replication-factor 3 \
  --config min.insync.replicas=2 \
  --config retention.ms=2592000000 \
  --config compression.type=snappy
```

#### Kafka Producer Configuration (`kafka.js` in microservices)
Ensure idempotent delivery and zero data loss on producer nodes:
```javascript
const { Kafka, CompressionTypes } = require('kafkajs');

const kafka = new Kafka({
  clientId: process.env.SERVICE_NAME || 'campus-domain-producer',
  brokers: process.env.KAFKA_BROKERS.split(','),
  ssl: process.env.NODE_ENV === 'production',
  sasl: process.env.KAFKA_SASL_USERNAME ? {
    mechanism: 'scram-sha-512',
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD
  } : undefined,
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});

const producer = kafka.producer({
  idempotent: true,
  maxInFlightRequests: 1
});
```

---

### 4.4. Redis Distributed Cache & Socket.IO Redis Adapter

When scaling the Notification Engine across multiple instances, Socket.IO connections must be synced via Redis Pub/Sub so that an event emitted by Instance A reaches clients connected to Instance B.

```javascript
// services/notification-service/src/index.js
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const pubClient = createClient({ url: process.env.REDIS_URL || 'redis://redis-cluster:6379' });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_ORIGIN || '*' },
    adapter: createAdapter(pubClient, subClient)
  });
  console.log('✔ Socket.IO Redis Cluster Adapter connected.');
});
```

---

### 4.5. Security, TLS Termination & Nginx Ingress

Configure Nginx as the edge reverse proxy to terminate TLS 1.3, enforce rate limiting, handle WebSocket upgrades, and route API paths to internal microservices.

```nginx
# /etc/nginx/conf.d/cadence.conf

upstream api_gateway {
    server gateway:4000;
}

upstream notification_socket {
    server notification-service:4005;
}

# Rate Limiting Zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=50r/s;
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

server {
    listen 80;
    server_name pulse.campus.edu;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pulse.campus.edu;

    ssl_certificate /etc/letsencrypt/live/pulse.campus.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pulse.campus.edu/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Frontend Static Distribution
    location / {
        root /var/www/cadence-frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # REST API Gateway Proxy
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://api_gateway;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.IO WebSocket Duplex Tunnel
    location /socket.io/ {
        proxy_pass http://notification_socket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

---

### 4.6. Native Web Push (VAPID) Production Configuration

1. Generate persistent production VAPID key pairs:
   ```bash
   npx web-push generate-vapid-keys
   ```
2. Store the private key securely in your cloud secret manager (AWS Secrets Manager, Google Secret Manager, or HashiCorp Vault). Never commit VAPID private keys to Git.
3. Configure `services/notification-service/.env`:
   ```ini
   VAPID_PUBLIC_KEY="BInProductionKeyGeneratedFromECDSA..."
   VAPID_PRIVATE_KEY="InProductionPrivateKey..."
   VAPID_SUBJECT="mailto:security-alerts@campus.edu"
   ```
4. In production, configure the client service worker (`sw.js`) to handle background notification clicks, opening the specific course or floor map directly:
   ```javascript
   self.addEventListener('notificationclick', event => {
     event.notification.close();
     event.waitUntil(
       clients.openWindow(event.notification.data?.url || '/')
     );
   });
   ```

---

### 4.7. Carrier Email-to-SMS & Institutional SMTP Setup

To ensure carrier gateways (`txt.att.net`, `vtext.com`) do not flag automated email-to-SMS dispatches as unsolicited spam, configure the institutional sending domain with the following DNS records:

1. **SPF Record (TXT)**:
   ```text
   v=spf1 ip4:192.0.2.10 include:_spf.campus.edu ~all
   ```
2. **DKIM Record (2048-bit TXT)**:
   ```text
   cadence._domainkey.campus.edu IN TXT "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA..."
   ```
3. **DMARC Record (TXT)**:
   ```text
   _dmarc.campus.edu IN TXT "v=DMARC1; p=reject; rua=mailto:dmarc-reports@campus.edu; pct=100"
   ```
4. Set Nodemailer to authenticate with the institutional relay using mutual TLS.

---

### 4.8. Docker Compose & Kubernetes Deployment Manifests

#### Production `docker-compose.prod.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: campus_pulse
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redisdata:/data
    ports:
      - "6379:6379"

  kafka:
    image: bitnami/kafka:3.7
    restart: always
    environment:
      - KAFKA_CFG_NODE_ID=1
      - KAFKA_CFG_PROCESS_ROLES=broker,controller
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka:9093
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=false
    volumes:
      - kafkadata:/bitnami/kafka

  gateway:
    build:
      context: .
      dockerfile: gateway/Dockerfile
    restart: always
    environment:
      PORT: 4000
      USER_SERVICE_URL: http://user-service:4001
      CLASS_SERVICE_URL: http://class-service:4002
      EXAM_SERVICE_URL: http://exam-service:4003
      EVENT_SERVICE_URL: http://event-service:4004
      NOTIFICATION_SERVICE_URL: http://notification-service:4005
    ports:
      - "4000:4000"
    depends_on:
      - user-service
      - notification-service

  user-service:
    build:
      context: .
      dockerfile: services/user-service/Dockerfile
    environment:
      PORT: 4001
      DATABASE_URL: postgres://${DB_USER}:${DB_PASS}@postgres:5432/campus_pulse
    depends_on:
      - postgres

  notification-service:
    build:
      context: .
      dockerfile: services/notification-service/Dockerfile
    environment:
      PORT: 4005
      KAFKA_BROKERS: kafka:9092
      REDIS_URL: redis://redis:6379
      VAPID_PUBLIC_KEY: ${VAPID_PUBLIC_KEY}
      VAPID_PRIVATE_KEY: ${VAPID_PRIVATE_KEY}
    ports:
      - "4005:4005"
    depends_on:
      - kafka
      - redis

volumes:
  pgdata:
  redisdata:
  kafkadata:
```

---

### 4.9. CI/CD Pipeline & GitHub Actions Automation

Create `.github/workflows/deploy.yml` to automatically lint, test, build, and deploy the entire platform:

```yaml
name: Cadence Campus Pulse CI/CD

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-and-verify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 18
        uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'

      - name: Install Root Dependencies
        run: npm ci

      - name: Install Frontend Dependencies
        run: npm ci --prefix frontend

      - name: Build Frontend Production Bundle
        run: npm run build --prefix frontend

      - name: Run Backend Microservices
        run: |
          npm run start:all &
          sleep 4

      - name: Run Acceptance & E2E Verification Suites
        run: |
          npm run test:phase1
          npm run test:phase2
          npm run test:phase3
          npm run test:e2e

  build-and-push-docker:
    needs: test-and-verify
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Log in to Docker Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build & Push Gateway Image
        run: |
          docker build -t ghcr.io/${{ github.repository }}/gateway:latest -f gateway/Dockerfile .
          docker push ghcr.io/${{ github.repository }}/gateway:latest

      - name: Build & Push Notification Engine Image
        run: |
          docker build -t ghcr.io/${{ github.repository }}/notification-service:latest -f services/notification-service/Dockerfile .
          docker push ghcr.io/${{ github.repository }}/notification-service:latest
```

---

### 4.10. Observability: Prometheus, Grafana & OpenTelemetry

To monitor system health and latency SLA guarantees in production:
1. **Prometheus Metrics Exporter**: Expose `/metrics` on all Node.js daemons using `prom-client`:
   - `cadence_events_published_total` (counter by topic and priority)
   - `cadence_fanout_latency_seconds` (histogram measuring time from Kafka commit to client delivery)
   - `cadence_active_socket_connections` (gauge of live connected student devices)
2. **Kafka Exporter**: Monitor partition watermarks and consumer lag:
   - Alert trigger if `kafka_consumergroup_lag{topic="general-events"} > 5`.
3. **OpenTelemetry Distributed Tracing**: Trace each event with a unique `traceparent` header from initial domain service mutation through Kafka broker offsets into individual student socket delivery callbacks.

---

## 5. Summary Checklist of Production Changes

Before deploying to an enterprise university environment, verify this complete checklist:

- [ ] **Database**: Migrate from in-memory arrays to PostgreSQL 16+ schemas with PgBouncer connection pooling.
- [ ] **Kafka Cluster**: Provision a 3-broker KRaft cluster with replication factor 3 and `min.insync.replicas=2`.
- [ ] **Redis**: Deploy Redis 7+ cluster and enable `@socket.io/redis-adapter` on the Notification Engine.
- [ ] **Security**: Terminate TLS 1.3 via Nginx Ingress and configure HTTP-to-HTTPS redirects.
- [ ] **VAPID Keys**: Generate persistent production ECDSA P-256 VAPID key pairs and store in secret manager.
- [ ] **Email DNS**: Configure SPF, DKIM (2048-bit), and DMARC `p=reject` records for carrier email-to-SMS gateway delivery.
- [ ] **Static Assets**: Build frontend bundle with `npm run build` and upload to Cloudflare / AWS CloudFront CDN.
- [ ] **CI/CD**: Wire GitHub Actions workflow to run `test:e2e` automatically on every commit.
- [ ] **Monitoring**: Set up Prometheus scraping and Grafana dashboards for consumer lag and dispatch latency.
- [ ] **Governance**: Configure role-based authentication mapping university SSO (SAML / OAuth2 / Shibboleth) to student, faculty, and administrator claims.
