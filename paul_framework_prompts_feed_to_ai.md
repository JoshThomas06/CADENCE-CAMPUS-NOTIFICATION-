# PAUL Framework Execution Prompts

*Instructions: Feed these prompts one by one to your AI assistant. Wait for it to complete the tasks, verify the Acceptance Criteria, and execute the 'UNIFY' step before feeding the next phase.*

---

## Prompt 1: Phase 1 - Gateway & Users
```markdown
# /paul:plan Phase 1 - Foundation & API Gateway

## Objective
Establish the local Node.js environment, API Gateway, and User Service. Define the event-driven boundaries and ensure the gateway successfully routes authenticated requests to the User Service.

## Acceptance Criteria
*   **AC-1:** API Gateway (port 4000) successfully proxies `/api/users` to the User Service (port 4001).
*   **AC-2:** Gateway implements JWT authentication middleware, rejecting requests without tokens (401 Unauthorized).
*   **AC-3:** User Service connects to the PostgreSQL database defined in docker-compose and initializes User and Subscription models (Prisma or Sequelize).

## Tasks
1. Initialize the Gateway project. Install `express`, `http-proxy-middleware`, `jsonwebtoken`.
2. Initialize the User Service. Install `express`, `pg`, and an ORM. Set up the DB connection.
3. Create routes for user registration, login (JWT generation), and saving Web Push subscription objects.

## Loop Action
Execute UNIFY to reconcile planned vs actual state. Log decisions in STATE.md and prepare for Phase 2.
```

---

## Prompt 2: Phase 2 - Domain Services
```markdown
# /paul:plan Phase 2 - Domain Services & Kafka Producers

## Objective
Create the Class, Exam, and Event microservices. Integrate `kafkajs` so these services act as producers, emitting events when states change.

## Acceptance Criteria
*   **AC-1:** Class Service (port 4002) exposes a PUT endpoint to cancel a class.
*   **AC-2:** Exam Service (port 4003) exposes a PUT endpoint to change an exam venue.
*   **AC-3:** When these endpoints are hit, they successfully publish a message to the local Kafka broker (`localhost:9092`) on topics `class-updates` or `exam-updates`.

## Tasks
1. Scaffolding for Class, Exam, and Event services (Express servers).
2. Install `kafkajs` in these services. Configure Kafka Producers.
3. Write the controllers for status updates. Ensure the database is updated FIRST, and then the Kafka event `{ type, id, metadata }` is published.

## Loop Action
Execute UNIFY. Confirm producers are connected to Kafka. Prepare for Phase 3.
```

---

## Prompt 3: Phase 3 - Notification Engine
```markdown
# /paul:plan Phase 3 - Notification Engine (The Consumer)

## Objective
Build the Notification Service. This service will NOT have REST endpoints. Instead, it runs a Kafka Consumer, a Socket.IO server, and Web Push/Nodemailer logic. STRICT RULE: No paid APIs.

## Acceptance Criteria
*   **AC-1:** Notification Service connects to Kafka and listens to `class-updates`, `exam-updates`, and `general-events`.
*   **AC-2:** When a message is consumed, it checks user preferences (mock this query if needed for now).
*   **AC-3:** It emits a Socket.IO event to connected clients.
*   **AC-4:** It uses `web-push` (VAPID keys) to send a payload.
*   **AC-5:** It uses `nodemailer` to print an email to the console (or use a test SMTP).

## Tasks
1. Initialize Notification Service (port 4005). Install `kafkajs`, `socket.io`, `web-push`, `nodemailer`.
2. Generate VAPID keys using `web-push generate-vapid-keys`.
3. Set up the Kafka Consumer group `notification-group`.
4. Inside the `eachMessage` handler, parse the event and trigger the three output channels (Socket, Push, Email).

## Loop Action
Execute UNIFY. Validate that emitting a message in Phase 2 results in console logs/socket emits in Phase 3.
```

---

## Prompt 4: Phase 4 - React Frontend
```markdown
# /paul:plan Phase 4 - Real-Time React Frontend

## Objective
Build a React PWA that connects to the API Gateway, maintains a Socket.IO connection, and registers a Service Worker for push notifications.

## Acceptance Criteria
*   **AC-1:** React app successfully registers a service worker (`sw.js`).
*   **AC-2:** UI provides a button to "Enable Notifications" which triggers browser permission and sends the PushSubscription object to the User Service.
*   **AC-3:** React connects to `localhost:4005` via `socket.io-client` and displays a toast/alert when a real-time event is received.
*   **AC-4:** Service worker listens to the `push` event and displays a system notification when the app is in the background.

## Tasks
1. `npx create-react-app frontend` (or Vite).
2. Write `sw.js` to handle `self.addEventListener('push', ...)` and `showNotification`.
3. Implement `socket.io-client` in the main App component.
4. Create a basic dashboard UI simulating Student/Faculty views to trigger and receive the events.

## Loop Action
Execute UNIFY. The end-to-end flow is now complete.
```