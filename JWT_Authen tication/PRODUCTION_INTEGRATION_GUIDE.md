# 🚀 Production Turn-Key JWT Authentication Blueprint

> **Universal, Enterprise-Ready Authentication System**: A plug-and-play template engineered with **Express.js**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, **Next.js 14**, and **HttpOnly Cookies**. 
> 
> Designed to be copied into **ANY project** with minimal configuration in less than 5 minutes. g

---

## 📑 Table of Contents
1. [Architecture & Request Flows](#1-architecture--request-flows)
2. [5-Minute Drop-In Integration Guide](#2-5-minute-drop-in-integration-guide)
   - [A. Plug into any Backend (Express/Node.js)](#a-plug-into-any-backend-expressnodejs)
   - [B. Plug into any Frontend (Next.js/React)](#b-plug-into-any-frontend-nextjsreact)
   - [C. Plug into any Database (PostgreSQL/Prisma/Supabase/Neon)](#c-plug-into-any-database-postgresqlprismasupabaseneon)
3. [Complete API Endpoints & Payload Contracts](#3-complete-api-endpoints--payload-contracts)
4. [Universal Compatibility (Web Cookies + Mobile Bearer Token)](#4-universal-compatibility-web-cookies--mobile-bearer-token)
5. [Security & Production Hardening Checklist](#5-security--production-hardening-checklist)
6. [Deployment Recipes (Docker, Vercel, Railway, Render)](#6-deployment-recipes-docker-vercel-railway-render)

---

## 1. Architecture & Request Flows

### 🔐 Full System Architecture Diagram

```mermaid
graph TD
    subgraph Client_Tier ["Client Tier (Web / Mobile / SPA)"]
        UI["Next.js / React / Mobile App"]
        Ctx["AuthContext / useAuth()"]
        Axios["Axios Client (withCredentials: true)"]
        UI --> Ctx --> Axios
    end

    subgraph Security_Gate ["Security & Middleware Gate"]
        Helmet["Helmet (HTTP Security Headers)"]
        CORS["Dynamic CORS Whitelist"]
        Limiter["Rate Limiter (Brute-Force Shield)"]
        AuthMid["authenticateJWT Middleware"]
    end

    subgraph Backend_App ["Express Backend Application"]
        Router["/api/auth Routes"]
        Zod["Zod Validation Layer"]
        Ctrl["Auth Controller"]
        Serv["Auth Service (Bcrypt + JWT)"]
    end

    subgraph Data_Tier ["PostgreSQL Database Tier"]
        Prisma["Prisma ORM Client"]
        PG[("PostgreSQL Database\n(Table: users)")]
    end

    Axios --> Helmet --> CORS --> Limiter --> Router
    Router --> AuthMid
    Router --> Zod --> Ctrl --> Serv --> Prisma --> PG
```

---

### 🔄 End-to-End Authentication Flows

#### Flow A: User Registration
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as Next.js Frontend
    participant Backend as Express API
    participant DB as PostgreSQL (via Prisma)

    User->>Frontend: Fill name, email, password & Submit
    Frontend->>Frontend: Client-side Zod validation
    Frontend->>Backend: POST /api/auth/register { name, email, password }
    Backend->>Backend: Server-side Zod Schema parse
    Backend->>DB: Check if email already exists
    alt Email already registered
        Backend-->>Frontend: 409 Conflict ("Email is already registered")
    else Email is unique
        Backend->>Backend: Hash password with Bcrypt (10 salt rounds)
        Backend->>DB: INSERT into "users" table
        DB-->>Backend: Created User record { id, name, email, createdAt }
        Backend-->>Frontend: 201 Created { success: true, user }
        Frontend-->>User: Redirect to /login with success notification
    end
```

#### Flow B: User Login & Cookie Transmission
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser as Browser Cookie Jar
    participant Frontend as Next.js Frontend
    participant Backend as Express API
    participant DB as PostgreSQL

    User->>Frontend: Enter credentials & Submit
    Frontend->>Backend: POST /api/auth/login { email, password }
    Backend->>Backend: Zod validate payload
    Backend->>DB: SELECT * FROM "users" WHERE email = ?
    alt User not found or password mismatch
        Backend-->>Frontend: 401 Unauthorized ("Invalid email or password")
    else Credentials valid
        Backend->>Backend: bcrypt.compare(password, hash) == true
        Backend->>Backend: Generate JWT signed with JWT_SECRET (1h expiry)
        Backend->>Browser: Set-Cookie: accessToken=eyJ...; HttpOnly; Secure; SameSite=Lax
        Backend-->>Frontend: 200 OK { success: true, token, user }
        Frontend->>Frontend: Update AuthContext state (isAuthenticated = true)
        Frontend-->>User: Redirect to /dashboard
    end
```

#### Flow C: Protected Route Access (`/api/auth/me`)
```mermaid
sequenceDiagram
    autonumber
    participant Frontend as Next.js Protected Page
    participant Browser as Browser Cookie Jar
    participant Mid as authenticateJWT Middleware
    participant Backend as Auth Controller
    participant DB as PostgreSQL

    Frontend->>Browser: Request /api/auth/me (withCredentials: true)
    Browser->>Mid: Forward GET /api/auth/me + Cookie: accessToken=eyJ...
    alt Token Missing or Invalid/Expired
        Mid-->>Frontend: 401 Unauthorized ("No token provided" or "Expired token")
        Frontend->>Frontend: Clear user state & Redirect to /login
    else Token Signature Valid
        Mid->>Mid: jwt.verify(token, JWT_SECRET) -> extract userId
        Mid->>Backend: Attach req.user = { userId } -> next()
        Backend->>DB: SELECT id, name, email, createdAt FROM "users" WHERE id = userId
        DB-->>Backend: User details
        Backend-->>Frontend: 200 OK { success: true, user }
        Frontend-->>Frontend: Render protected view & user dashboard
    end
```

#### Flow D: User Logout
```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as Next.js App
    participant Browser as Browser Cookie Jar
    participant Backend as Express API

    User->>Frontend: Click "Logout"
    Frontend->>Backend: POST /api/auth/logout (withCredentials: true)
    Backend->>Browser: Set-Cookie: accessToken=; Max-Age=0; HttpOnly
    Backend-->>Frontend: 200 OK { success: true, message: "Logged out successfully" }
    Frontend->>Frontend: Set user = null in AuthContext
    Frontend-->>User: Redirect to /login
```

---

## 2. 5-Minute Drop-In Integration Guide

Use the following step-by-step instructions to drop this auth system into any existing repository:

### A. Plug into any Backend (Express/Node.js)

1. **Install required packages:**
   ```powershell
   npm install express cors helmet cookie-parser express-rate-limit jsonwebtoken bcrypt zod dotenv @prisma/client
   npm install -D typescript @types/express @types/cors @types/cookie-parser @types/jsonwebtoken @types/bcrypt prisma tsx
   ```

2. **Copy the 6 core backend modules into your `src/` directory:**
   - [`src/config/env.ts`](file:///c:/Users/pc/Desktop/JWT_Auth/backend/src/config/env.ts) ➔ Environment variables & origins
   - [`src/schemas/auth.schema.ts`](file:///c:/Users/pc/Desktop/JWT_Auth/backend/src/schemas/auth.schema.ts) ➔ Zod input validation schemas
   - [`src/services/auth.service.ts`](file:///c:/Users/pc/Desktop/JWT_Auth/backend/src/services/auth.service.ts) ➔ Hashing, token generation & DB queries
   - [`src/middleware/auth.middleware.ts`](file:///c:/Users/pc/Desktop/JWT_Auth/backend/src/middleware/auth.middleware.ts) ➔ Universal Cookie + Bearer guard
   - [`src/controllers/auth.controller.ts`](file:///c:/Users/pc/Desktop/JWT_Auth/backend/src/controllers/auth.controller.ts) ➔ Request handlers & cookie sender
   - [`src/routes/auth.routes.ts`](file:///c:/Users/pc/Desktop/JWT_Auth/backend/src/routes/auth.routes.ts) ➔ Route registrations

3. **Mount in your `app.ts`:**
   ```typescript
   import authRoutes from './routes/auth.routes';
   import { authenticateJWT } from './middleware/auth.middleware';

   // Public Auth Endpoints
   app.use('/api/auth', authRoutes);

   // Protect any other existing business route with 1 line:
   app.use('/api/orders', authenticateJWT, ordersRouter);
   app.use('/api/profile', authenticateJWT, profileRouter);
   ```

---

### B. Plug into any Frontend (Next.js/React)

1. **Install dependencies:**
   ```powershell
   npm install axios lucide-react react-hook-form zod @hookform/resolvers
   ```

2. **Copy the 4 core frontend modules into your `src/` directory:**
   - [`src/lib/api.ts`](file:///c:/Users/pc/Desktop/JWT_Auth/frontend/src/lib/api.ts) ➔ Axios client with `withCredentials: true`
   - [`src/types/auth.ts`](file:///c:/Users/pc/Desktop/JWT_Auth/frontend/src/types/auth.ts) ➔ TypeScript User & Credentials interfaces
   - [`src/services/auth.service.ts`](file:///c:/Users/pc/Desktop/JWT_Auth/frontend/src/services/auth.service.ts) ➔ API calling service
   - [`src/context/AuthContext.tsx`](file:///c:/Users/pc/Desktop/JWT_Auth/frontend/src/context/AuthContext.tsx) ➔ Universal `useAuth()` hook & provider
   - [`src/components/ProtectedRoute.tsx`](file:///c:/Users/pc/Desktop/JWT_Auth/frontend/src/components/ProtectedRoute.tsx) ➔ Route protector

3. **Wrap your Root Layout (`app/layout.tsx` or `_app.tsx`):**
   ```tsx
   import { AuthProvider } from '@/context/AuthContext';

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html>
         <body>
           <AuthProvider>
             {children}
           </AuthProvider>
         </body>
       </html>
     );
   }
   ```

4. **Use in any page or component:**
   ```tsx
   'use client';
   import { useAuth } from '@/context/AuthContext';
   import { ProtectedRoute } from '@/components/ProtectedRoute';

   export default function SettingsPage() {
     const { user, logout } = useAuth();

     return (
       <ProtectedRoute>
         <div>
           <h1>Logged in as: {user?.name} ({user?.email})</h1>
           <button onClick={logout}>Sign Out</button>
         </div>
       </ProtectedRoute>
     );
   }
   ```

---

### C. Plug into any Database (PostgreSQL/Prisma/Supabase/Neon)

1. **Copy the User Model into your `prisma/schema.prisma`:**
   ```prisma
   model User {
     id           String   @id @default(uuid())
     name         String
     email        String   @unique
     passwordHash String
     createdAt    DateTime @default(now())
     updatedAt    DateTime @updatedAt

     @@map("users")
   }
   ```

2. **Run migration & generate client:**
   ```powershell
   npx prisma migrate dev --name add_auth_users
   npx prisma generate
   ```

3. **(Optional) Seed a test admin account:**
   ```powershell
   npm run db:seed
   ```
   *Creates `admin@example.com` with password `Password123!`.*

---

## 3. Complete API Endpoints & Payload Contracts

| Method | Endpoint | Access | Rate-Limited | Description |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | No | Live server & DB ping health probe |
| **POST** | `/api/auth/register` | Public | Yes (20/15m) | Register a new user |
| **POST** | `/api/auth/login` | Public | Yes (20/15m) | Authenticate user & issue HttpOnly cookie |
| **GET** | `/api/auth/me` | Protected | No | Fetch authenticated user profile |
| **POST** | `/api/auth/logout` | Protected/Public | No | Invalidate and clear session cookie |

### Request & Response Examples:

#### 1. Register (`POST /api/auth/register`)
- **Body:**
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex@example.com",
    "password": "Password123!"
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "user": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "name": "Alex Mercer",
      "email": "alex@example.com"
    }
  }
  ```

#### 2. Login (`POST /api/auth/login`)
- **Body:**
  ```json
  {
    "email": "alex@example.com",
    "password": "Password123!"
  }
  ```
- **Response Headers:**
  `Set-Cookie: accessToken=eyJhbGciOiJIUzI1Ni...; HttpOnly; SameSite=Lax; Path=/; Max-Age=3600`
- **Response Body (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "name": "Alex Mercer",
      "email": "alex@example.com"
    }
  }
  ```

#### 3. Health Probe (`GET /api/health`)
- **Response (`200 OK`):**
  ```json
  {
    "success": true,
    "status": "healthy",
    "timestamp": "2026-10-02T16:00:00.000Z",
    "uptime": 1420.55,
    "environment": "production",
    "database": "connected"
  }
  ```

---

## 4. Universal Compatibility (Web Cookies + Mobile Bearer Token)

The `authenticateJWT` middleware natively supports **both** communication mechanisms out of the box:

```text
┌────────────────────────────────────────┐
│ Incoming HTTP Request                  │
└──────────────────┬─────────────────────┘
                   ▼
  Is there a Cookie (accessToken/token)?
        │                      │
       YES                     NO
        │                      │
        ▼                      ▼
  Use Cookie Value       Is Authorization: Bearer <token> present?
        │                      │               │
        │                     YES              NO
        │                      │               │
        ▼                      ▼               ▼
  Verify JWT via       Verify JWT via      Return 401
  JWT_SECRET           JWT_SECRET          "Token required"
```

This means:
1. **Web Browsers**: Automatically and securely use **HttpOnly Cookies** (protected from JavaScript XSS attacks).
2. **Mobile Apps (React Native, Flutter, Swift, Kotlin)**: Can send `Authorization: Bearer <token>` in headers.
3. **API Clients (Postman, curl, backend microservices)**: Can authenticate with standard `Bearer <token>`.

---

## 5. Security & Production Hardening Checklist

| Layer | Feature | Why It Matters in Production |
| :--- | :--- | :--- |
| **Cookies** | `HttpOnly: true` | Prevents malicious XSS scripts from reading the JWT. |
| **Cookies** | `Secure: true` (in prod) | Ensures tokens are transmitted strictly over encrypted HTTPS connections. |
| **Cookies** | `SameSite: 'Lax'` | Shields against Cross-Site Request Forgery (CSRF) attacks. |
| **Headers** | `Helmet` | Injects HTTP security headers (HSTS, clickjacking prevention, sniffing protection). |
| **Brute Force** | `express-rate-limit` | Caps login & registration attempts per IP to stop credential-stuffing bots. |
| **Passwords** | `Bcrypt (Salt 10)` | One-way salted cryptographic hashing; plain passwords are never stored or logged. |
| **Validation** | `Zod` (Dual-layer) | Prevents SQL/NoSQL injection, unexpected payload shapes, and invalid emails. |
| **Lifespan** | `1 Hour Expiry` | Minimizes attack window if a device is left unattended. |
| **Lifecycle** | Graceful Shutdown | Intercepts `SIGINT`/`SIGTERM` to close database connections cleanly before exit. |

---

## 6. Deployment Recipes (Docker, Vercel, Railway, Render)

### Docker Deployment
Start a production PostgreSQL database with one command:
```powershell
docker-compose up -d
```

### Environment Variables Template for Production
```env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
JWT_SECRET="generate-a-strong-32-character-secret"
JWT_EXPIRES_IN="1h"
COOKIE_NAME="accessToken"
FRONTEND_URL="https://your-frontend-domain.com,https://staging.your-domain.com"
AUTH_RATE_LIMIT_MAX=20
```

### Frontend Environment Template
```env
NEXT_PUBLIC_API_URL="https://your-backend-api-domain.com/api"
```

---

🎉 **You now have a production-tested, plug-and-play authentication system ready for immediate deployment in any modern application!**
