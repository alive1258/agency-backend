<p align="center">
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  </a>
</p>

<h1 align="center">Backend API – NestJS</h1>

<p align="center">
  A scalable, secure, and production-ready REST API built with <a href="https://nestjs.com" target="_blank">NestJS</a>.
</p>

<p align="center">
  <img src="https://img.shields.io/bun/v/@nestjs/core.svg" alt="NestJS Version" />
  <img src="https://img.shields.io/bun/l/@nestjs/core.svg" alt="License" />
  <img src="https://img.shields.io/node/v/node.svg" alt="Node Version" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue" alt="TypeScript" />
</p>

---

## 🚀 Overview

This project is a **modern backend API** built using **NestJS**, following **industry best practices**:

* Modular architecture
* Clean DTO & validation layer
* Centralized response formatting
* Pagination & filtering support
* Soft deletes
* Authentication-ready
* Production-grade error handling

Designed for **scalability**, **maintainability**, and **real-world usage**.

---

## 🧱 Tech Stack

* **Framework:** NestJS
* **Language:** TypeScript
* **Database:** PostgreSQL / MySQL (via TypeORM)
* **ORM:** TypeORM
* **Validation:** class-validator
* **Documentation:** Swagger (OpenAPI)
* **Auth:** JWT (Access & Refresh Tokens)
* **API Style:** REST + HATEOAS
* **Pagination:** Custom DataQueryService
* **Environment:** Node.js

---

## 📂 Project Structure

```
src/
├── auth/                 # Authentication & authorization
├── categories/           # Category module (CRUD)
├── common/
│   ├── interceptors/     # Global response interceptor
│   ├── decorators/       # Custom decorators
│   ├── data-query/       # Pagination, filtering, search
│   └── response-dto/     # Standard API response contracts
├── config/               # Environment & app configuration
├── database/             # TypeORM config & migrations
├── main.ts               # App bootstrap
└── app.module.ts
```

---

## ⚙️ Environment Setup

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=app_db

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

---

## 📦 Installation

```bash
bun install
```

---

## ▶️ Running the App

```bash
# Development
bun run start:dev

# Production
bun run build
bun run start:prod
```

---

## 🧪 Testing

```bash
# Unit tests
bun run test

# E2E tests
bun run test:e2e

# Coverage
bun run test:cov
```

---

## 📘 API Documentation (Swagger)

Once the server is running, access Swagger UI at:

```
http://localhost:3000/api/docs
```

---

## 📡 API Response Standard

All APIs follow a **consistent response format**:

### ✅ Success (Single Resource)

```json
{
  "apiVersion": "0.1.1",
  "success": true,
  "message": "Item retrieved successfully",
  "status": 200,
  "data": {},
  "links": {
    "get": "/categories/:id",
    "update": "/categories/:id",
    "delete": "/categories/:id"
  }
}
```

### ✅ Success (Paginated)

```json
{
  "apiVersion": "0.1.1",
  "success": true,
  "message": "Operation Successful",
  "status": 200,
  "meta": {
    "total": 24,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  },
  "links": {
    "first": "?page=1&limit=10",
    "last": "?page=3&limit=10",
    "current": "?page=1&limit=10",
    "next": "?page=2&limit=10",
    "previous": ""
  },
  "data": []
}
```

### ❌ No Content (DELETE – Industry Standard)

```http
HTTP/1.1 204 No Content
```

---

## 🔐 Authentication

* JWT-based authentication
* Access token stored in **HTTP-only cookies**
* Refresh token rotation supported
* Logout clears cookies securely

---

## 🧹 Best Practices Followed

* DTO-based validation
* Soft delete instead of hard delete
* Proper HTTP status codes
* Centralized interceptor for responses
* Clean separation of concerns
* Reusable pagination & filtering logic

---

## 🚢 Deployment

NestJS is platform-agnostic and can be deployed to:

* AWS
* DigitalOcean
* Railway
* Render
* Docker
* Kubernetes

Build for production:

```bash
bun run build
```

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👤 Author
Zamirul Kabir
**Your Name**
Software Engineer
NestJS | TypeScript | REST APIs

---

## 🤝 Contribution

Contributions, issues, and feature requests are welcome.
Please follow clean code and commit conventions.

---

## ⭐ Support

If you find this project helpful, consider giving it a ⭐ on GitHub.
