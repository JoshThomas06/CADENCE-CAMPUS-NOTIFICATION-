# Event-Driven Campus Notification Platform

## Overview
A scalable, microservices-based web application designed to broadcast real-time campus alerts (class cancellations, venue changes, exam schedules, and general events). 

## Architecture & Tech Stack (100% Free / Self-Hosted)
*   **Frontend:** React.js (PWA enabled for Service Workers).
*   **API Gateway:** Node.js + Express + HTTP Proxy Middleware.
*   **Microservices:** Node.js + Express (User, Class, Exam, Event, Notification).
*   **Message Broker:** Apache Kafka (Dockerized).
*   **Database:** PostgreSQL (Dockerized).
*   **Real-time Communication:** Socket.IO / WebSockets.
*   **Push Notifications:** Web Push API (VAPID keys) replacing Firebase FCM.
*   **Email:** Nodemailer (SMTP/Gmail App Passwords).
*   **SMS:** Email-to-SMS gateways (e.g., `number@txt.att.net`) or simulated logs.

## Setup Instructions
1. Run `docker-compose up -d` to start PostgreSQL, Zookeeper, and Kafka.
2. Initialize the API Gateway and Microservices individually (see `ARCHITECTURE.md`).
3. Feed the prompts in `PAUL_PROMPTS.md` into your AI assistant chronologically.