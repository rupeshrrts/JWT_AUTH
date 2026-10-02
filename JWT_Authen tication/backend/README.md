# 🛡️ JWT Authentication Backend (Express + TypeScript + Prisma)

A production-grade, enterprise-ready authentication backend engineered with **Express.js**, **TypeScript**, **Prisma ORM**, **Cloud PostgreSQL (Supabase)**, **JWT**, **Bcrypt**, **Helmet**, and **Rate Limiting**.

---

## 📑 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step-by-Step Installation & Setup](#2-step-by-step-installation--setup)
3. [Environment Configuration (`.env`)](#3-environment-configuration-env)
4. [Database Deployment & Seeding](#4-database-deployment--seeding)
5. [Running the Backend](#5-running-the-backend)
6. [API Endpoints & Contracts](#6-api-endpoints--contracts)
7. [Drop-In Backend Integration into Any Existing Project](#7-drop-in-backend-integration-into-any-existing-project)

---

## 1. Prerequisites
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher
- **PostgreSQL Database**: Free Cloud DB from [Supabase.com](https://supabase.com) or [Neon.tech](https://neon.tech)

---

## 2. Step-by-Step Installation & Setup

Open your terminal in the `backend/` directory:

```powershell
# Step 1: Navigate to backend folder
cd backend

# Step 2: Install all required production & developer dependencies
npm install
```

### Dependencies Installed:
- **Core**: `express`, `cors`, `cookie-parser`, `dotenv`
- **Security & Auth**: `jsonwebtoken`, `bcrypt`, `helmet`, `express-rate-limit`, `zod`
- **Database**: `@prisma/client`, `prisma`, `tsx`, `typescript`

---

## 3. Environment Configuration (`.env`)

Create or update your `.env` file in the `backend/` directory:

```env
# Server Port
PORT=5000

# Environment Mode
NODE_ENV=development

# Cloud PostgreSQL Database Connection String (Supabase / Neon / RDS)
DATABASE_URL="postgresql://postgres.qicslyipupsriqkfcwfb:Rupesh%407033@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require"

# High-entropy JWT Signing Key (Change for production)
JWT_SECRET="super-secret-jwt-key-change-this-in-production-786"

# JWT Expiration Period
JWT_EXPIRES_IN="1h"

# Cookie Name for storing JWT
COOKIE_NAME="accessToken"

# Frontend Origin(s) for CORS Whitelist (supports comma-separated URLs)
FRONTEND_URL="http://localhost:3000"

# Rate Limit: Max requests per 15-minute window for auth routes
AUTH_RATE_LIMIT_MAX=20
```

---

## 4. Database Deployment & Seeding

Deploy the Prisma schema and seed test accounts into your cloud database with these commands:

```powershell
# Step 1: Push the schema model to your cloud PostgreSQL database
npx prisma db push

# Step 2: Generate the typed Prisma Client
npx prisma generate

# Step 3: Seed initial test admin account
npm run db:seed
```

> **Default Seeded Admin Credentials:**
> - **Email**: `admin@example.com`
> - **Password**: `Password123!`

---

## 5. Running the Backend

### Development Mode (with hot-reloading):
```powershell
npm run dev
```
*Server starts on `http://localhost:5000`*

### Production Build & Start:
```powershell
# Compile TypeScript to JavaScript
npm run build

# Start compiled server
npm start
```

### Verify Server Health:
Open your browser to: **`http://localhost:5000/api/health`**
```json
{
  "success": true,
  "status": "healthy",
  "environment": "development",
  "database": "connected"
}
```

---

## 6. API Endpoints & Contracts

| Method | Endpoint | Access | Rate-Limited | Description |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | No | Live server & PostgreSQL health ping |
| **POST** | `/api/auth/register` | Public | Yes (20/15m) | Register a new user |
| **POST** | `/api/auth/login` | Public | Yes (20/15m) | Login, issue HttpOnly cookie & return token |
| **GET** | `/api/auth/me` | Protected | No | Fetch authenticated user profile |
| **POST** | `/api/auth/logout` | Protected/Public | No | Clear authentication cookies |

---

## 7. Drop-In Backend Integration into Any Existing Project

To reuse this authentication system in **any existing Express project**:

1. Copy the following 6 modules into your existing `src/` folder:
   - `src/config/env.ts`
   - `src/schemas/auth.schema.ts`
   - `src/services/auth.service.ts`
   - `src/controllers/auth.controller.ts`
   - `src/middleware/auth.middleware.ts`
   - `src/routes/auth.routes.ts`
2. Mount the routes in your main `app.ts`:
   ```typescript
   import authRoutes from './routes/auth.routes';
   import { authenticateJWT } from './middleware/auth.middleware';

   app.use('/api/auth', authRoutes);

   // Protect any existing route with:
   app.use('/api/private-data', authenticateJWT, privateRouter);
   ```
