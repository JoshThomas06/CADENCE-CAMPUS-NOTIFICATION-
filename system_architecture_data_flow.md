# Architecture & Data Flow

## 1. Network Topology
*   **Frontend:** Runs on `localhost:3000`
*   **API Gateway:** Runs on `localhost:4000` (Routes all `/api/*` traffic)
*   **User Service:** Runs on `localhost:4001`
*   **Class Service:** Runs on `localhost:4002`
*   **Exam Service:** Runs on `localhost:4003`
*   **Event Service:** Runs on `localhost:4004`
*   **Notification Service:** Runs on `localhost:4005` (Contains Socket.IO Server)

## 2. Kafka Topics
*   `class-updates`: Emits `{ type: 'CANCELLED' | 'VENUE_CHANGE', classId, metadata }`
*   `exam-updates`: Emits `{ type: 'POSTPONED' | 'VENUE_CHANGE', examId, metadata }`
*   `general-events`: Emits `{ type: 'NEW_EVENT' | 'EMERGENCY', metadata }`

## 3. Database Schema Overview (PostgreSQL)
We will use a single PostgreSQL instance with logical separation (different schemas or prefixes) for microservices, or a shared database for simplicity in this MVP.

*   **Users Table:** `id`, `email`, `password_hash`, `role`
*   **Preferences Table:** `user_id`, `email_enabled`, `push_enabled`
*   **PushSubscriptions Table:** `user_id`, `endpoint`, `p256dh`, `auth` (For Web Push API)
*   **Classes/Exams Tables:** Basic CRUD tables holding schedule data.