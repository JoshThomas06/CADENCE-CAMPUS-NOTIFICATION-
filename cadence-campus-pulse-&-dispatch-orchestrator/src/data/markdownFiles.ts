export interface MarkdownFile {
  id: string;
  filename: string;
  title: string;
  description: string;
  screenType: string;
  badge: string;
  content: string;
}

export const MARKDOWN_FILES: MarkdownFile[] = [
  {
    id: 'design-system',
    filename: '00-design-system.md',
    title: 'Academic Signal & Event Dispatch Design Tokens',
    description: 'Universal design tokens, collegiate palette, typography hierarchy, and UI guidelines.',
    screenType: 'Design System',
    badge: 'Design Spec',
    content: `---
name: Academic Signal & Event Dispatch
colors:
  surface: '#f2fbff'
  surface-dim: '#cddde3'
  surface-bright: '#f2fbff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e7f6fd'
  surface-container: '#e1f0f7'
  surface-container-high: '#dbebf1'
  surface-container-highest: '#d6e5eb'
  on-surface: '#0f1e22'
  on-surface-variant: '#41484b'
  inverse-surface: '#253337'
  inverse-on-surface: '#e4f3fa'
  outline: '#71787c'
  outline-variant: '#c0c8cb'
  surface-tint: '#366574'
  primary: '#003643'
  on-primary: '#ffffff'
  primary-container: '#1b4d5c'
  on-primary-container: '#8ebdce'
  inverse-primary: '#9fcee0'
  secondary: '#a04028'
  on-secondary: '#ffffff'
  secondary-container: '#fe8769'
  on-secondary-container: '#74200a'
  tertiary: '#442c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#614100'
  on-tertiary-container: '#eaaa35'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#baeafc'
  primary-fixed-dim: '#9fcee0'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#1a4d5c'
  secondary-fixed: '#ffdad2'
  secondary-fixed-dim: '#ffb4a2'
  on-secondary-fixed: '#3c0700'
  on-secondary-fixed-variant: '#802913'
  tertiary-fixed: '#ffdeae'
  tertiary-fixed-dim: '#fdba45'
  on-tertiary-fixed: '#281900'
  on-tertiary-fixed-variant: '#604100'
  background: '#f2fbff'
  on-background: '#0f1e22'
  surface-variant: '#d6e5eb'
  slate-teal-deep: '#0E2D36'
  slate-teal-surface: '#F0F5F6'
  parchment-base: '#FBF9F4'
  parchment-card: '#FFFFFF'
  vintage-terracotta: '#C2593F'
  terracotta-soft: '#F9ECE8'
  antique-gold: '#D99B26'
  gold-subtle: '#FBF4E7'
  forest-stone: '#2E473B'
  critical-crimson: '#A82A2A'
  critical-tint: '#FDF0F0'
  border-subtle: '#DCE5E7'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 3.5rem
    fontWeight: '600'
    lineHeight: 4rem
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
  headline-md:
    fontFamily: Playfair Display
    fontSize: 1.5rem
    fontWeight: '500'
    lineHeight: 2rem
  title-lg:
    fontFamily: Playfair Display
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
  title-md:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.6rem
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.4rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.15rem
  label-md:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.2rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
  code-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

# Cadence Campus Pulse — Design Tokens & Architecture Specification

## 1. Brand & Aesthetic Vision
This design system synthesizes the storied prestige of collegiate heritage with high-throughput event streaming technology. Crafted for campus dispatchers, department chairs, faculty, and students, the visual language balances calm intellectual gravity with urgent, life-safety clarity.

The aesthetic marries **Editorial Traditionalism** with **Modern Glassmorphic Utility**. Inspired by collegiate oil paintings—where deep shaded limestone architecture meets warm foliage and dappled amber light—the system uses deep slate teal foundations punctuated by sharp terracotta and luminous sunlit gold.

![Collegiate Atmosphere Painting](https://lh3.googleusercontent.com/aida-public/AB6AXuAvMeMWzAGu5yOIjmn4vtRGiE27bAyXXzlYngb21ijQUB6Dyi1le1ZrQvrHjegZsd4_ZtdvSG5-5RERvhMV5_cObofzrWOcfdCxyUpTNHbhf43AlE5QMC7gQ9-kBBBiYCiDwLR_EAja0bvwfhN6E8KTIfgsuFSv6QXKG8r9bPqpkiJ6-T1qvPMF-CwMNuM11te-ramiFIsl695-a9khvyVxWl_tpuUJ4QZfmHiePiWgA8d1nMqmIjRmgw)

### Key Attributes
- **Authoritative & Scholarly:** Grounded in collegiate structure, classical typographic rhythm, and balanced proportions.
- **Mission-Critical Clarity:** Microservices events, alert dispatches, and audit logs are presented with crisp tabular precision.
- **Atmospheric Depth:** Layered translucent glass panels, luminous status indicators, and warm parchment container surfaces build spatial depth without visual noise.

## 2. Palette Architecture
- **Primary (\`#1B4D5C\` / \`#003643\`):** Collegiate Slate Teal. Serves as bedrock navigation and primary surfaces.
- **Secondary (\`#C2593F\`):** Vintage Terracotta / Warm Rust. Utilized for priority alerts (\`HIGH\`, \`VENUE_CHANGED\`, \`CANCELLED\`).
- **Tertiary (\`#D99B26\`):** Antique Amber Gold. Signifies transitional states, pending dispatches, academic notices.
- **Neutral Deep (\`#0E2D36\`):** Slate Teal Deep. Foundation hero banners and footer bars.
- **Critical Crimson (\`#A82A2A\`):** Life safety directives and gale alerts.
- **Parchment Base (\`#FBF9F4\`):** Matte, glare-free collegiate canvas.
`
  },
  {
    id: 'live-stream',
    filename: '01-live-stream-alerts.md',
    title: 'Screen 01: Live Stream & Alerts Console',
    description: 'Hero with 3D canvas, quick trigger actions, multi-channel throughput, active broadcast feed, and GitHub heatmap.',
    screenType: 'Screen 01',
    badge: 'Operations Hub',
    content: `# Screen 01: Campus Pulse & Dispatch Orchestrator
**Route:** \`/live-stream-alerts\`  
**Cluster Node:** Node #04 Active (\`ARCH-OCT-2026-DISPATCH-V2\`)  
**Latency Target:** 1.4ms (p99) • Zero Paid External APIs

---

## Screen Overview
The central real-time operations dashboard for faculty and campus safety dispatchers. Features an atmospheric 3D Three.js event core visualization, simulated quick-broadcast trigger buttons, a 6-node microservices telemetry ribbon, real-time client throughput ribbons, and an interactive feed of live collegiate dispatches paired with a 52-week Kafka telemetry activity heatmap.

![Collegiate Art Vignette](https://lh3.googleusercontent.com/aida-public/AB6AXuAvMeMWzAGu5yOIjmn4vtRGiE27bAyXXzlYngb21ijQUB6Dyi1le1ZrQvrHjegZsd4_ZtdvSG5-5RERvhMV5_cObofzrWOcfdCxyUpTNHbhf43AlE5QMC7gQ9-kBBBiYCiDwLR_EAja0bvwfhN6E8KTIfgsuFSv6QXKG8r9bPqpkiJ6-T1qvPMF-CwMNuM11te-ramiFIsl695-a9khvyVxWl_tpuUJ4QZfmHiePiWgA8d1nMqmIjRmgw)

---

## Visual Structure & Wireframe Hierarchy

\`\`\`
+------------------------------------------------------------------------------------------------+
| [Ω CADENCE Campus Pulse]   [KAFKA: CONNECTED (3 TOPICS) | SOCKET.IO: 1,420 CLIENTS]   [Role: Faculty] |
+------------------------------------------------------------------------------------------------+
| HERO: [3D WebGL Mesh] Cluster Node #04 Active • Latency Target: 1.4ms (p99)                      |
| "Campus Pulse & Dispatch Orchestrator"                                                         |
| [Quick Broadcast Trigger Console]: [Cancel Class] [Shift Venue] [Flash Alert]                  |
| Microservice Ribbon: User :4001 | Class :4002 | Exam :4003 | Event :4004 | Engine :4005 | Broker |
+------------------------------------------------------------------------------------------------+
| MULTI-CHANNEL STRIP:                                                                           |
| [1,420 Sockets (100% ONLINE)]  |  [3,890 WebPush (VAPID READY)]  |  [4,102 Inboxes ($0 COST)]  |
+---------------------------------------------------------------+--------------------------------+
| LEFT RAIL: Live Pulse & Active Broadcast Stream               | RIGHT RAIL: Telemetry Heatmap  |
| - URGENT: CS401 Distributed Systems Exam Reschedule           | - 52-Week Broker Matrix        |
| - HIGH: ARCH310 Classical Architecture Studio Venue Change    | - Filter Chips & Metric Bento  |
| - CRITICAL: Inclement Weather Flash Warning (Gale North Quad) | - Kafka Topic Partitions Table |
| - NORMAL: Guest Lecture Dr. Aris Thorne on Event Brokers      |   (class, exam, general)       |
+---------------------------------------------------------------+--------------------------------+
\`\`\`

---

## Microservices Telemetry Ribbon Specs
1. **User Service (\`:4001\`):** Heartbeat 240ms • Health: Green
2. **Class Service (\`:4002\`):** Synced (84 courses) • Health: Green
3. **Exam Service (\`:4003\`):** Locked & Primed • Health: Green
4. **Event Service (\`:4004\`):** 12 active quads • Health: Green
5. **Notification Engine (\`:4005\`):** 3,892 VAPID queued • Status: Primed
6. **Kafka Broker (\`:9092\`):** 3 Topics • 0 Consumer Lag

---

## Active Broadcast Stream Elements
- **CS401 Distributed Systems Final Exam:** Postponed to Friday, Oct 18 • 10:00 AM in Great Hall West (Topic: \`exam-updates\`, 184/190 notified).
- **ARCH310 Classical Architecture Studio:** Relocated from Quad North Garden to Tudor Hall 3B Drafting Suite (Topic: \`class-updates\`, Room 3B easels allocated).
- **Severe Weather Flash Warning:** High branches falling along Dean's Walk. Immediate indoor shelter protocol active in Mason Science Hall (Topic: \`all-subscribers\`, SLA 1.1s).
- **Guest Lecture (Dr. Aris Thorne):** Keynote in Turing Amphitheater on Zero-Cost distributed push topologies (Topic: \`general-events\`, 42 seats left).

---

## 52-Week Kafka Dispatch Heatmap
- Total Dispatches (2026): **4,892**
- Delivery Success Rate: **99.98%**
- Average Broker Latency: **1.4ms**
- External API Cost: **$0.00**
`
  },
  {
    id: 'kafka-telemetry',
    filename: '02-kafka-topics-telemetry.md',
    title: 'Screen 02: Kafka Topics & Telemetry Core',
    description: 'Partition watermarks, consumer group lag, CloudEvents v1.0.2 schema inspector, and carrier relay metrics.',
    screenType: 'Screen 02',
    badge: 'Broker Telemetry',
    content: `# Screen 02: Institutional Event Streaming & Multi-Channel Zero-Cost Dispatch
**Route:** \`/kafka-topics-telemetry\`  
**Cluster ID:** \`lk-inst-oxford-01\` • Broker v3.6.0 (KRaft / ZK Bridge)  
**Cloud SaaS Deficit:** $0.00 / billing cycle (Saved vs Twilio & SendGrid: $450/mo)

---

## Screen Overview
In-depth broker telemetry and schema validation terminal. Monitors topic partitions across \`campus.stream.class-updates\`, \`campus.stream.exam-updates\`, and \`campus.stream.general-events\`, audits consumer group sync state, and provides a real-time CloudEvents v1.0.2 JSON schema inspector.

![South Quad & St. Jude Cloisters](https://lh3.googleusercontent.com/aida-public/AB6AXuAvMeMWzAGu5yOIjmn4vtRGiE27bAyXXzlYngb21ijQUB6Dyi1le1ZrQvrHjegZsd4_ZtdvSG5-5RERvhMV5_cObofzrWOcfdCxyUpTNHbhf43AlE5QMC7gQ9-kBBBiYCiDwLR_EAja0bvwfhN6E8KTIfgsuFSv6QXKG8r9bPqpkiJ6-T1qvPMF-CwMNuM11te-ramiFIsl695-a9khvyVxWl_tpuUJ4QZfmHiePiWgA8d1nMqmIjRmgw)

---

## Delivery Channel Performance
| Channel | Target Mechanism | Active Count | Key Performance Indicator |
| :--- | :--- | :--- | :--- |
| **Socket.IO In-App** | \`campus-pulse.ws.internal\` | 1,420 Clients | 0.4ms latency • 12.4k msgs/min |
| **Web Push VAPID** | RFC 8291 / RFC 8292 PWA | 3,890 Endpoints | 2.1ms encryption • 99.8% Success |
| **Nodemailer SMTP** | Postfix Campus Edge #2 | 4,102 Inboxes | 1,094 Carrier SMS • $0.00 Cost |

---

## Kafka Topic Partitions & Watermarks

### 1. \`campus.stream.class-updates\` (3 Partitions, Cleanup: Compact)
- **Partition #0:** High-Water Mark: 6,124 | Consumer Lag: 0 msgs (Leader #1)
- **Partition #1:** High-Water Mark: 6,201 | Consumer Lag: 0 msgs (Leader #1)
- **Partition #2:** High-Water Mark: 6,165 | Consumer Lag: 0 msgs (Leader #1)
- **Total Offsets:** 18,490 msgs

### 2. \`campus.stream.exam-updates\` (2 Partitions, Critical Priority)
- **Partition #0 (STEM & Eng):** High-Water Mark: 4,456 | Consumer Lag: 0 msgs
- **Partition #1 (Humanities & Law):** High-Water Mark: 4,456 | Consumer Lag: 0 msgs
- **Total Offsets:** 8,912 msgs

### 3. \`campus.stream.general-events\` (4 Partitions, Retention: 7d)
- **Partitions #0-#3:** High-Water Mark ~8,545 each | Total Offsets: 34,180 msgs

---

## Consumer Group Topologies
- **\`notification-group\`:** Assigned \`class-updates [0,1,2]\`, \`exam [0,1]\` via \`RoundRobin\` (SYNCHRONIZED)
- **\`audit-logging-worker\`:** Assigned \`general [0..3]\`, \`exam [0..1]\` via \`RangeAssignor\` (SYNCHRONIZED)
- **\`metrics-collector\`:** Assigned All 9 Partitions via \`CooperativeSticky\` (SYNCHRONIZED)

---

## CloudEvents v1.0.2 Schema Example
\`\`\`json
{
  "specversion": "1.0",
  "id": "evt_98471-a083ef",
  "source": "urn:campus:dispatch:exam-office",
  "type": "edu.campus.exam.relocation",
  "traceparent": "00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01",
  "time": "2025-10-14T10:42:18.421Z",
  "datacontenttype": "application/json",
  "data": {
    "courseCode": "CS 401",
    "title": "Operating Systems & Distributed Concurrency",
    "previousVenue": "Turing Amphitheater",
    "assignedVenue": "Babbage Hall C, Wing West",
    "priority": "CRITICAL",
    "channels": [
      "socket.io:room:cs401",
      "vapid:tag:urgent-venue",
      "smtp:cs401-enrolled@campus.edu"
    ],
    "estimatedRecipients": 184,
    "zeroCostDispatch": true
  }
}
\`\`\`
`
  },
  {
    id: 'event-dispatcher',
    filename: '03-event-dispatcher.md',
    title: 'Screen 03: Event Dispatcher & Broadcast Trigger Console',
    description: 'Decoupled mutation studio, fanout blast radius estimator, pipeline stage trace, and audit logs.',
    screenType: 'Screen 03',
    badge: 'Broadcast Studio',
    content: `# Screen 03: Event Dispatcher & Broadcast Trigger Console
**Route:** \`/event-dispatcher\`  
**Signatory:** Dr. Julian Vance (Faculty / CS Dept)  
**Standard:** Academic Senate Protocol v4.2 • CloudEvents v1.0.2

---

## Screen Overview
The administrative control surface for authoring and broadcasting emergency announcements, schedule mutations, and room changes across the collegiate network. Includes audience blast radius computation, markdown body composition, priority escalation triggers, a 4-stage pipeline visualizer, and an immutable dispatch audit log.

![Low Library & North Lawn Quadrant](https://lh3.googleusercontent.com/aida-public/AB6AXuDOA8Q33Edkv3WMhv9wgYVJhJWXWgWI7PHTeSLatEQd-m6W400QGnspWcXEzmIN66UzwozE4q0JAzVuewVxNJWOaP62CidpavRNvNmphBaX4vhuZPZmjhTKY3EnALnJNVgldLxTck9W0Uy2Zhfdc-0L-uyPt05Brfh3DAZ24ggdA3WvsDd3VmHsW6xCDlog4MY3atplbHcj7jvxjvEppF5x9MMaQ5VGpg98-5RZehFQf6bBNy4uuviwag)

---

## Workflow Presets
1. **Faculty Quick Action:** Single-click venue updates for enrolled courses (e.g. HVAC repairs).
2. **Chair Bulk Reschedule:** Department-wide examination realignment (e.g. Midterm conflicts).
3. **Campus Safety Flash:** University-wide civil protection directives (e.g. Severe Gale / Lightning warnings).

---

## Fanout Blast Radius Calculator
- **CS401 Distributed Systems:** 184 students • 12 faculty • 3 TAs (199 total active subs)
- **ARCH310 Classical Architecture:** 92 students • 4 faculty • 2 TAs (98 total active subs)
- **ENG202 Fluid Dynamics:** 310 students • 8 faculty • 6 TAs (324 total active subs)
- **All Campus Residents:** 14,850 students • 1,200 faculty • 450 staff (16,500 total active subs)

---

## Live Microservice Event Pipeline Trace
\`\`\`
[1. Event Producer] -----> [2. Kafka Broker] -----> [3. Notification Engine] -----> [4. Tri-Fanout Delivery]
      Port :4004                 Port :9092                     Port :4005                  Socket.IO + VAPID + SMTP
  Express Validation         Durable Commit Log            Preference Filtering            199/199 ACK in 1.2ms
     (p99: 0.3ms)            (0 Lag • In-Sync)                 (p99: 0.8ms)                    (Zero Drop)
\`\`\`

---

## Active Audit Log Entries
- **evt-77f4-90a1:** \`class-updates // VENUE_CHANGED\` -> CS401 Distributed Systems (Delivered: 199/199, Latency: 1.2ms)
- **evt-331b-4100:** \`exam-updates // EXAM_POSTPONED\` -> ARCH310 Architecture (Delivered: 98/98, Latency: 0.9ms)
- **evt-192a-bb09:** \`class-updates // CLASS_CANCELLED\` -> ENG202 Fluid Dynamics (Delivered: 324/324, Latency: 1.4ms)
`
  },
  {
    id: 'subscribers',
    filename: '04-subscribers-preferences.md',
    title: 'Screen 04: Dispatch Subscriptions & Telemetry Relay',
    description: 'Hardware token registrations, granular course alert filters, and individual receipt audit trail.',
    screenType: 'Screen 04',
    badge: 'Subscriber Preferences',
    content: `# Screen 04: Dispatch Subscriptions & Telemetry Relay
**Route:** \`/subscribers-preferences\`  
**Subscriber Profile:** Node #884 (\`Maya Lin\` • Senior CS & Studio Arts Joint Major)  
**Security Tier:** Tier-1 Guaranteed • 3 Relays Active • ECDSA SHA-256

---

## Screen Overview
The client-side preference and hardware token registry. Allows students and faculty to bind PWA service worker endpoints, iOS web push tokens, carrier email-to-SMS gates, and manage fine-grained filtering down to specific course cancellation types.

![Cloisters Library Collegiate Atmosphere](https://lh3.googleusercontent.com/aida-public/AB6AXuCBgdjRbdiJ7AMR0hk6FO0w1afWHXqYlJUPLc-WSGkaS_egN3SQUN1OETbpK7EqwvJZnKRN3HhxfQmMnVonIRlvy_c0MNJjBmEKyRZuQd-5e-2MePk77-WbLNm90Ia5XKWUfRCa70s7ppC9h4d_x35oFxWkEoKj5Q4hoKpjJ4CG8HZLvcRUoBLFuexa0imQAisZ-YnhGOHSVnCE5x2TEd9Vu1-ATjIRMCs3iVHx_IEiesxwbskkHutsuQ)

---

## Registered Dispatch Hardware & Tokens
1. **Chrome PWA Desktop ServiceWorker:**  
   VAPID Endpoint: \`89f4...3ca1\` • Last Ping: 32s ago • **Connected**
2. **Mobile iOS Web Push (Safari PWA):**  
   Device: iPhone 15 Pro • Token: \`4b12...ec99\` • **Listening**
3. **Institutional Exchange Relay:**  
   \`elin@campus.edu\` • DKIM/DMARC Senate Authenticated • **Verified**

---

## Multi-Channel Delivery Channels
- **In-App Floating Toasts:** Real-time latency <14ms over Socket.IO duplex connection.
- **OS-Level Web Push:** Background wake enabled with ECDSA secp256r1 keys.
- **Nodemailer Dispatch:** HTML responsive digest delivered on daily schedule (6:00 PM).
- **Carrier SMS Bridge:** Free cellular relay via \`6175550192@txt.att.net\` (Zero Twilio tolls).

---

## Course-Specific Filter Streams
- **CS401: Distributed Systems:** Cancellations (ON), Venue Shifts (ON), Exam Updates (ON)
- **ARCH310: Classical Architecture:** Cancellations (ON), Studio Relocations (ON), Optional Workshops (OFF)
- **MATH205: Linear Algebra:** Critical Schedule Shifts (ON), Problem Set Memos (OFF)

---

## Campus-Wide Safety Protocols
- **Severe Weather & Safety:** MANDATORY (Cannot be muted per Senate By-Law 4.2)
- **Distinguished Lectures & Symposia:** Enabled
- **Dining & Commons Closures:** Disabled
- **Library Pod Bookings:** Enabled
`
  },
  {
    id: 'landing-page',
    filename: '05-landing-page.md',
    title: 'Screen 05: Cadence Sovereign Event Backbone Landing',
    description: 'Public architectural overview, interactive 3D WebGL core, live incident cards, and deployment commands.',
    screenType: 'Screen 05',
    badge: 'Public Landing',
    content: `# Screen 05: The Sovereign Event Backbone for Campus Life & Safety
**Project:** Cadence Campus Pulse  
**License:** Academic Senate Protocol v4.2 • Open Source Self-Hosted Fabric  
**Core Slogan:** 0-Latency Self-Hosted Collegiate Fabric • Zero External Cloud Fees

---

## Screen Overview
The comprehensive architectural presentation and public documentation portal for Cadence. Highlights the zero-cost multi-channel relay grid, CloudEvents v1.0.2 conformance, 3D WebGL cluster orchestration, live incident telemetry feeds, and Docker Compose deployment instructions.

![North Lawn Sunlit Courtyard](https://lh3.googleusercontent.com/aida-public/AB6AXuCyeJA4zYFuqVUwMEhPIvZAjiPwzVcwoDWMLFn4O8n2REdYvssZRT3vMNOYUtTzlgE7ltX_QdpRnJq9YTK6e9mCHMBXbdBNRPBi-ydq_Iq7Nhe7p-F7o_Auezd2IDDuKRHYD0z-81NfvM6C5sznk_8N5x_8UJf6RfGSqSJzj_Pxdpd4leruSnfFV1xZLWaXPWTchpQQt2WGfWjbr1jCgLilMiKD3PVdU3rVp5SdYVzQq4onvqXXj_Ck2mIyceBymogXyBQ)

---

## Key Value Propositions
1. **Zero External Cloud Costs:** Bypasses Twilio and SendGrid, saving upwards of $14,000 annually per collegiate institution.
2. **Sub-1.4 Millisecond Latency:** P99 delivery benchmarks across local Kafka brokers, Socket.IO rooms, and VAPID workers.
3. **Decoupled Sovereign Resilience:** Operates completely offline within campus intranet when external internet uplinks fail.

---

## Multi-Channel Relay Grid Architecture
\`\`\`
                    +------------------------------------+
                    |  Institutional Event Producers      |
                    |  (Registrar, Facilities, Safety)   |
                    +-----------------+------------------+
                                      | CloudEvents v1.0.2
                                      v
                    +-----------------+------------------+
                    |  Kafka Cluster Broker (:9092)       |
                    |  KRaft Architecture • 3 Partitions |
                    +-----------------+------------------+
                                      |
         +----------------------------+----------------------------+
         |                                                         |
         v                                                         v
+--------+---------------+   +------------------------+   +--------+---------------+
| Socket.IO Relay        |   | Web Push VAPID Worker  |   | Postfix SMTP Gateway   |
| Room Broadcasts (<1ms) |   | RFC 8291 / W3C Push    |   | Free Carrier Email-SMS |
+------------------------+   +------------------------+   +------------------------+
\`\`\`

---

## Quickstart Deployment Command
\`\`\`bash
git clone https://git.cadence-campus.edu/core.git && cd core && docker compose up -d
\`\`\`
`
  },
  {
    id: 'readme',
    filename: 'README.md',
    title: 'Cadence Architecture & Markdown Index',
    description: 'Master index of all screens, system boundaries, and downloadable assets.',
    screenType: 'Master Index',
    badge: 'Documentation',
    content: `# Cadence Campus Pulse — Complete Screen Suite & Markdown Artifacts

Welcome to the **Cadence Campus Pulse & Dispatch Orchestrator** documentation and screen repository.

## Downloadable Screen Files
1. **[\`00-design-system.md\`](./00-design-system.md):** Academic Signal & Event Dispatch Design Tokens
2. **[\`01-live-stream-alerts.md\`](./01-live-stream-alerts.md):** Live Stream & Active Broadcast Stream
3. **[\`02-kafka-topics-telemetry.md\`](./02-kafka-topics-telemetry.md):** Kafka Topics & Broker Telemetry
4. **[\`03-event-dispatcher.md\`](./03-event-dispatcher.md):** Event Dispatcher & Mutation Studio Console
5. **[\`04-subscribers-preferences.md\`](./04-subscribers-preferences.md):** Dispatch Subscriptions & Telemetry Relay
6. **[\`05-landing-page.md\`](./05-landing-page.md):** The Sovereign Event Backbone Landing Page

---

## Hosted Artwork Assets
- **Collegiate Oil Painting Study:** \`https://lh3.googleusercontent.com/aida-public/AB6AXuAvMeMWzAGu5yOIjmn4vtRGiE27bAyXXzlYngb21ijQUB6Dyi1le1ZrQvrHjegZsd4_ZtdvSG5-5RERvhMV5_cObofzrWOcfdCxyUpTNHbhf43AlE5QMC7gQ9-kBBBiYCiDwLR_EAja0bvwfhN6E8KTIfgsuFSv6QXKG8r9bPqpkiJ6-T1qvPMF-CwMNuM11te-ramiFIsl695-a9khvyVxWl_tpuUJ4QZfmHiePiWgA8d1nMqmIjRmgw\`
- **Low Library & North Lawn:** \`https://lh3.googleusercontent.com/aida-public/AB6AXuDOA8Q33Edkv3WMhv9wgYVJhJWXWgWI7PHTeSLatEQd-m6W400QGnspWcXEzmIN66UzwozE4q0JAzVuewVxNJWOaP62CidpavRNvNmphBaX4vhuZPZmjhTKY3EnALnJNVgldLxTck9W0Uy2Zhfdc-0L-uyPt05Brfh3DAZ24ggdA3WvsDd3VmHsW6xCDlog4MY3atplbHcj7jvxjvEppF5x9MMaQ5VGpg98-5RZehFQf6bBNy4uuviwag\`
- **Gothic Cloisters:** \`https://lh3.googleusercontent.com/aida-public/AB6AXuCBgdjRbdiJ7AMR0hk6FO0w1afWHXqYlJUPLc-WSGkaS_egN3SQUN1OETbpK7EqwvJZnKRN3HhxfQmMnVonIRlvy_c0MNJjBmEKyRZuQd-5e-2MePk77-WbLNm90Ia5XKWUfRCa70s7ppC9h4d_x35oFxWkEoKj5Q4hoKpjJ4CG8HZLvcRUoBLFuexa0imQAisZ-YnhGOHSVnCE5x2TEd9Vu1-ATjIRMCs3iVHx_IEiesxwbskkHutsuQ\`
- **Courtyard Elm Tree:** \`https://lh3.googleusercontent.com/aida-public/AB6AXuCyeJA4zYFuqVUwMEhPIvZAjiPwzVcwoDWMLFn4O8n2REdYvssZRT3vMNOYUtTzlgE7ltX_QdpRnJq9YTK6e9mCHMBXbdBNRPBi-ydq_Iq7Nhe7p-F7o_Auezd2IDDuKRHYD0z-81NfvM6C5sznk_8N5x_8UJf6RfGSqSJzj_Pxdpd4leruSnfFV1xZLWaXPWTchpQQt2WGfWjbr1jCgLilMiKD3PVdU3rVp5SdYVzQq4onvqXXj_Ck2mIyceBymogXyBQ\`
`
  }
];
