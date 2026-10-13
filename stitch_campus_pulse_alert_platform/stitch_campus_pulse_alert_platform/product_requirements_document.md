# Product Requirements Document (PRD)

## 1. Goal
Build a cost-free, self-hosted, event-driven notification system for university campuses to keep students and faculty updated in real-time regarding schedule changes and emergencies.

## 2. User Roles
*   **Admin:** Can create, update, and delete any campus event, class, or exam. Manages user roles.
*   **Faculty:** Can update status for their assigned classes and exams (e.g., mark as cancelled or change venue).
*   **Student:** Read-only access to schedules. Can subscribe to specific classes or general campus updates.

## 3. Core Features & Flows
### 3.1 Authentication & User Management
*   Users authenticate via JWT through the API Gateway.
*   Users can configure notification preferences (Toggle: Email, Web Push, In-App).

### 3.2 Domain Management (Classes, Exams, Events)
*   CRUD operations for Classes, Exams, and Events.
*   Whenever a state changes (e.g., "Class Math101 is Cancelled"), the respective service does NOT send a notification. Instead, it publishes an event to a Kafka topic.

### 3.3 Notification Engine
*   **In-App (Real-Time):** If the user is online, Socket.IO pushes the notification instantly to the React frontend.
*   **Background (Web Push):** If offline, a Service Worker receives a Web Push payload using standard VAPID keys.
*   **Email/SMS:** Nodemailer sends an email. SMS is simulated or routed through free Email-to-SMS carrier gateways.

## 4. Non-Functional Requirements
*   **No Paid APIs:** Strict prohibition on Twilio, SendGrid, Firebase, or AWS SNS.
*   **Decoupled:** The Class service should not know the Notification service exists. They communicate strictly via Kafka.