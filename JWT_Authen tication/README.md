# 🚀 Production-Grade JWT Authentication Template

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.21-informational.svg)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase_Cloud-blue.svg)](https://supabase.com/)

An enterprise-ready, modular, and plug-and-play **JWT Authentication System** built with **Express.js**, **TypeScript**, **Prisma ORM**, **Cloud PostgreSQL (Supabase)**, **Next.js 14**, and **HttpOnly Cookies**.

Designed to be dropped into **any existing project** in less than 5 minutes with zero architectural lock-in.

---

## 📖 Key Documentation
- 🎓 [**JWT Interview Master Guide (`JWT_INTERVIEW_MASTER_GUIDE.md`)**](file:///c:/Users/pc/Desktop/JWT_Auth/JWT_INTERVIEW_MASTER_GUIDE.md) — Complete interview preparation guide, cryptographic deep dive, expiration & refresh token flow, and Top 10 system design Q&As.
- 📘 [**Production Integration Blueprint (`PRODUCTION_INTEGRATION_GUIDE.md`)**](file:///c:/Users/pc/Desktop/JWT_Auth/PRODUCTION_INTEGRATION_GUIDE.md) — 5-minute drop-in guide, Mermaid flow diagrams, and API contracts.
- ⚙️ [**Backend Documentation (`backend/README.md`)**](file:///c:/Users/pc/Desktop/JWT_Auth/backend/README.md) — From-scratch backend setup, rate limiting, and middlewares.
- ⚛️ [**Frontend Documentation (`frontend/README.md`)**](file:///c:/Users/pc/Desktop/JWT_Auth/frontend/README.md) — UI components, `useAuth()` hook, and `<ProtectedRoute>`.
- 🗄️ [**Database & SQL Guide (`database/README.md`)**](file:///c:/Users/pc/Desktop/JWT_Auth/database/README.md) — Cloud PostgreSQL setup, raw schema, and SQL queries.

---

## 📂 Clean Modular Project Structure

```text
jwt-auth/
├── PRODUCTION_INTEGRATION_GUIDE.md  # Master integration blueprint & flowcharts
├── README.md                        # Master repository overview
│
├── backend/                         # Express.js + TypeScript + Prisma + JWT API
│   ├── prisma/
│   │   ├── schema.prisma            # Prisma schema (Single Source of Truth)
│   │   ├── seed.ts                  # Database test user seeder
│   │   └── migrations/              # SQL migration history
│   ├── src/
│   │   ├── config/env.ts            # Centralized environment & CORS origin whitelist
│   │   ├── controllers/             # Auth controller & cookie dispatcher
│   │   ├── middleware/              # Universal Cookie + Bearer JWT & Error handlers
│   │   ├── routes/                  # Auth route endpoints
│   │   ├── schemas/                 # Zod validation schemas
│   │   ├── services/                # Business logic, Bcrypt & JWT signing
│   │   ├── lib/prisma.ts            # Prisma Singleton Client
│   │   ├── app.ts                   # Express app with Helmet, Rate Limiter & CORS
│   │   └── server.ts                # Server startup & graceful shutdown
│   └── README.md                    # Dedicated Backend Setup Guide
│
├── frontend/                        # Next.js 14 App Router + Tailwind CSS UI
│   ├── src/
│   │   ├── app/                     # Pages: /, /login, /register, /dashboard
│   │   ├── components/              # Modular UI Components
│   │   │   ├── ui/                  # Reusable Atomic UI Elements (Input, Button, Alert, Card)
│   │   │   ├── Navbar.tsx           # Navigation Header with user state
│   │   │   └── ProtectedRoute.tsx   # Universal Route Guard
│   │   ├── context/AuthContext.tsx  # Universal useAuth() hook & AuthProvider
│   │   ├── lib/api.ts               # Axios instance (withCredentials: true)
│   │   ├── services/auth.service.ts # Frontend Auth API client
│   │   └── types/auth.ts            # TypeScript interfaces
│   └── README.md                    # Dedicated Frontend Setup Guide
│
└── database/                        # PostgreSQL SQL scripts & Documentation
    ├── init.sql                     # Raw PostgreSQL table creation script
    └── README.md                    # Database & SQL Cheat Sheet
```

---

## ⚡ Quick Start Guide

### 1. Start Backend (Port 5000)
```powershell
cd backend
npm install
npm run dev
```
*Health Check: `http://localhost:5000/api/health`*

### 2. Start Frontend (Port 3000)
```powershell
cd frontend
npm install
npm run dev
```
*Web App: `http://localhost:3000`*
