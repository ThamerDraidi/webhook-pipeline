[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![CI](https://github.com/ThamerDraidi/webhook-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/ThamerDraidi/webhook-pipeline/actions/workflows/ci.yml)

# Webhook-Driven Learning Pipeline

## 📑 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Running the App](#running-the-app)
- [API Documentation](#api-documentation)
- [Folder Structure](#folder-structure)
- [Authentication & Authorization](#authentication--authorization)
- [Features](#features)
- [Reliability & Error Handling](#reliability--error-handling)
- [Future Improvements](#future-improvements)
- [Authors](#authors)
- [License](#license)

---

## 🍀 Overview
This is an event-driven backend service that processes incoming webhook events asynchronously using a job queue and worker architecture. The system simulates a simplified automation platform (like Zapier) with a gamified scoring system for users.

---

## 🛠️ Tech Stack

| Layer            | Technology                                   |
|------------------|---------------------------------------------|
| Backend          | Node.js + TypeScript                         |
| Database         | PostgreSQL                                   |
| Queue            | Redis                                        |
| Worker           | Node.js + TypeScript                         |
| Containerization | Docker & Docker Compose                       |

---

### Why We Chose Node.js + TypeScript
- Fits event-driven, I/O-heavy workloads such as webhook processing pipelines.  
- Handles JSON natively and allows faster development.  
- Easy to run with Docker.  
- Provides flexibility when working with queues.  
- Offers a natural and efficient non-blocking, event-driven model compared to Python, where async patterns often require additional configuration.

### Why We Chose PostgreSQL
- Strong support for JSONB, perfect for storing event payloads.  
- High performance in event-driven systems.  
- Excellent integration with Node.js and TypeScript.  
- Easy setup with Docker.  
- Fully open-source and scalable.  
- Compared to MySQL, offers stronger relational data modeling, stricter schema enforcement, advanced constraints, and better handling of complex relationships — ensuring high data integrity and consistency for tracking jobs, users, and pipelines.

### Why We Chose Redis as a Queue
- Extremely fast in-memory data store, ideal for job queues.  
- Supports reliable pub/sub patterns for worker communication.  
- Easy retry and failure handling mechanisms.  
- Lightweight and integrates seamlessly with Node.js.  
- Helps decouple API request handling from background processing, improving system scalability and responsiveness.
  
---

🧠 Architecture Overview

### 🔄 Request Flow
1. **Client Request**  
   External system sends a webhook or API request.  

2. **Routes (`routes/`)**  
   Request is routed to the appropriate controller based on the endpoint.  

3. **Middleware (`middleware/`)**  
   Optional checks like authentication, rate limiting, logging, etc.  

4. **Controllers (`api/`)**  
   Handle HTTP logic and call the relevant service functions.  

5. **Services (`services/`)**  
   Business logic layer executes actions such as score calculation, level update, and achievement tracking.  

6. **Database / Queue (`db/` & `queue.ts`)**  
   - Persistent storage: store jobs, pipelines, users, achievements.  
   - Job queue: manage asynchronous background processing.  

7. **Worker (`worker.ts`)**  
   Background worker processes queued jobs and executes pipeline actions.  

8. **Delivery (`delivery.ts`)**  
   Sends processed results to subscriber endpoints.  

9. **Response**  
   API responds to client or logs job processing status asynchronously.
   
---

🧩 Core Components
1. API Layer (api/)
Handles incoming HTTP requests
Validates input
Calls the appropriate service

Examples:

auth.ts
webhooks.ts
pipelines.ts
jobs.ts

2. Routes Layer (routes/)
Defines API endpoints
Connects routes to controllers

Examples:

auth.routes.ts
webhooks.routes.ts

3. Service Layer (services/)
Contains business logic
Handles data processing
Communicates with DB and queues

5. Middleware (middleware/)
Cross-cutting concerns:
Authentication
Rate limiting
Webhook signature validation

7. Queue System (queue.ts, worker.ts)
Handles async/background jobs
Improves scalability and reliability

9. Actions (actions/)
Defines pipeline steps
Each action performs a specific task

11. Error Handling (error.ts)
Centralized error system using BaseError
Global error handler middleware

---

**Components:**

1. **API Service** – Handles HTTP requests, manages pipelines, pushes jobs to queue.  
2. **Queue (Redis)** – Stores jobs temporarily, manages retries and job state.  
3. **Worker Service** – Processes jobs asynchronously, executes business logic.  
4. **Database (PostgreSQL)** – Stores persistent data (pipelines, jobs, users, achievements, etc.).
   
---

## ⚙️ Prerequisites
- Node.js v18+  
- Docker & Docker Compose  
- PostgreSQL  
- Redis

---
## ⚙️ Setup & Running the App

###1. Setup environment variables (.env)
```env
DATABASE_URL=postgres://user:password@localhost:5432/webhookdb
REDIS_URL=redis://localhost:6379
PORT=3000
2.Run Docker Compose:docker-compose up --build
3.Access API=> Open in browser or use Postman:http://localhost:3000
```
---
## 📄 API Documentation

- **POST** `/webhooks/:pipelineId` – Send event to a pipeline
- **GET** `/jobs/:jobId` – Retrieve job status and history
- **GET** `/pipelines` – List pipelines
- **POST** `/pipelines` – Create a pipeline
- **PUT** `/pipelines/:id` – Update a pipeline
- **DELETE** `/pipelines/:id` – Delete a pipeline

## 🔒 Authentication & Authorization

- **Optional:** JWT-based authentication  
- **Role-based access control:** Control access for pipelines and job monitoring
---

## ✨ Features

- Pipeline management (CRUD)  
- Webhook ingestion & asynchronous processing  
- Job queue system with retries  
- Background worker for processing actions  
- Processing actions: Score, Level, Achievement  
- Subscriber delivery with retry & logging  
- Job monitoring API
  
---

## ⚡ Reliability & Error Handling
- Retry mechanism with exponential backoff  
- Logging of failed jobs  
- Tracking delivery attempts  
- Graceful handling of worker crashes
  
---

## 🔒 Authentication & Security Enhancements

- **JWT-based Authentication**  
  Secures API endpoints by requiring a valid token for access.  
  **Reason:** Ensures only authorized users can manage pipelines, view jobs, or send events.

- **Webhook Signature Verification**  
  Verifies that incoming webhooks are sent from trusted sources.  
  **Reason:** Protects the system from spoofed or malicious requests, ensuring data integrity.

- **Rate Limiting**  
  Limits the number of requests per user or pipeline within a time frame.  
  **Reason:** Prevents abuse, DDoS attacks, and protects backend resources from being overwhelmed.
  
---

## 🎯 Future Improvements

- **Scalable Workers**  
  Currently, only one worker processes jobs, but the design allows running multiple workers on the same queue.  
  **Reason:** Enables handling higher loads of incoming webhooks, improves throughput, and ensures faster job processing without affecting API responsiveness.

- **Pipeline Chaining**  
  Allows one pipeline's output to automatically trigger another pipeline.  
  **Reason:** Improves automation and enables building complex workflows without manual intervention.

- **Metrics & Monitoring**  
  Track system performance, job processing times, failures, and delivery success rates.  
  **Reason:** Helps detect bottlenecks, optimize performance, and ensure reliability.

- **Dashboard UI**  
  Provides a visual interface to monitor pipelines, jobs, users, and metrics in real-time.  
  **Reason:** Makes system monitoring easier, gives a clear overview of all ongoing processes, and helps in quick decision-making without manually checking the database.

©2026 Learning Webhook Pipeline. All rights reserved.

Built with ☯︎ by Thamer Draidi
