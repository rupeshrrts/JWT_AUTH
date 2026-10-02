# 🗄️ Master Database & SQL Reference Guide (`database/`)

This directory contains database schemas, connection setups, and an exhaustive reference of **every SQL query and command** used in this JWT Authentication architecture.

---

## ⚡ Quick Setup: Database from Scratch

### Step 1: Create Free Cloud Database (Supabase)
1. Go to [Supabase.com](https://supabase.com) and create a project (`jwt-auth`).
2. Copy your Connection String (URI).

### Step 2: Configure Environment
Add to `backend/.env`:
```env
DATABASE_URL="postgresql://postgres.qicslyipupsriqkfcwfb:Rupesh%407033@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require"
```

### Step 3: Deploy Schema & Seed
```powershell
cd backend
npx prisma db push
npm run db:seed
```

---

## 📑 SQL Operations Directory
1. [DDL: Table Creation & Schema Alterations](#1-ddl-table-creation--schema-alterations)
2. [Indexing & Query Optimization](#2-indexing--query-optimization)
3. [DML: User Registration & Insertion (CREATE)](#3-dml-user-registration--insertion-create)
4. [DQL: Querying & Authentication Checks (READ)](#4-dql-querying--authentication-checks-read)
5. [DML: Profile & Password Updates (UPDATE)](#5-dml-profile--password-updates-update)
6. [DML: User Deletion & Data Cleanup (DELETE)](#6-dml-user-deletion--data-cleanup-delete)
7. [Analytics, Health & Diagnostic Queries](#7-analytics-health--diagnostic-queries)

---

## 1. DDL: Table Creation & Schema Alterations

### A. Create the Master `users` Table
```sql
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
```

### B. Add Optional Production Columns
```sql
-- Add user role column (e.g., 'USER', 'ADMIN')
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'USER';

-- Add email verification status
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "isEmailVerified" BOOLEAN DEFAULT FALSE;

-- Add avatar URL column
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;
```

---

## 2. Indexing & Query Optimization

### A. Unique Email Index (Mandatory)
Prevents race conditions and duplicate account registrations:
```sql
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
```

### B. Registration Timestamp Index
Speeds up sorting users by newest first in admin dashboards:
```sql
CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users"("createdAt" DESC);
```

---

## 3. DML: User Registration & Insertion (CREATE)

### A. Insert Single User (Equivalent to `POST /api/auth/register`)
```sql
INSERT INTO "users" ("id", "name", "email", "passwordHash", "createdAt", "updatedAt")
VALUES (
    gen_random_uuid()::text,
    'Alex Mercer',
    'alex@example.com',
    '$2b$10$ms4hLFLG5M/OLHDd7x3KqOz6n40Y1sM4gY8v3Fk6r9n7s0a',
    NOW(),
    NOW()
);
```

### B. Safe Batch Insert (Idempotent with `ON CONFLICT`)
```sql
INSERT INTO "users" ("id", "name", "email", "passwordHash", "createdAt", "updatedAt")
VALUES 
    (gen_random_uuid()::text, 'Production Admin', 'admin@example.com', '$2b$10$ms4hLFLG5M/OLHDd7x3KqOz6n40Y1sM4gY8v3Fk6r9n7s0a', NOW(), NOW()),
    (gen_random_uuid()::text, 'Rupesh Kumar', 'rupesh@example.com', '$2b$10$ms4hLFLG5M/OLHDd7x3KqOz6n40Y1sM4gY8v3Fk6r9n7s0a', NOW(), NOW())
ON CONFLICT ("email") DO NOTHING;
```

---

## 4. DQL: Querying & Authentication Checks (READ)

### A. Find User by Email (Used in `POST /api/auth/login`)
Fetches the password hash to verify credentials via `bcrypt.compare()`:
```sql
SELECT "id", "name", "email", "passwordHash"
FROM "users"
WHERE "email" = 'admin@example.com'
LIMIT 1;
```

### B. Fetch User Profile by ID (Used in `GET /api/auth/me`)
Excludes sensitive `passwordHash` for privacy:
```sql
SELECT "id", "name", "email", "createdAt", "updatedAt"
FROM "users"
WHERE "id" = 'dde24fc3-e03d-4e97-aaa6-6a5cb86510a8';
```

### C. List All Registered Users (Newest First)
```sql
SELECT "id", "name", "email", "createdAt"
FROM "users"
ORDER BY "createdAt" DESC;
```

### D. Paginated Query (Page 1: 10 Users)
```sql
SELECT "id", "name", "email", "createdAt"
FROM "users"
ORDER BY "createdAt" DESC
LIMIT 10 OFFSET 0;
```

### E. Search User by Name or Email Substring
```sql
SELECT "id", "name", "email", "createdAt"
FROM "users"
WHERE "name" ILIKE '%rupesh%' OR "email" ILIKE '%rupesh%'
ORDER BY "createdAt" DESC;
```

---

## 5. DML: Profile & Password Updates (UPDATE)

### A. Update User Full Name
```sql
UPDATE "users"
SET "name" = 'Rupesh Sharma', "updatedAt" = NOW()
WHERE "email" = 'rupesh@example.com';
```

### B. Reset / Change Password Hash
```sql
UPDATE "users"
SET "passwordHash" = '$2b$10$newCalculatedBcryptHashHere1234567890', "updatedAt" = NOW()
WHERE "email" = 'admin@example.com';
```

---

## 6. DML: User Deletion & Data Cleanup (DELETE)

### A. Delete User by ID (Account Closure)
```sql
DELETE FROM "users"
WHERE "id" = 'dde24fc3-e03d-4e97-aaa6-6a5cb86510a8';
```

### B. Delete User by Email
```sql
DELETE FROM "users"
WHERE "email" = 'test@example.com';
```

### C. Clear All Test Users (Development Reset)
```sql
TRUNCATE TABLE "users" RESTART IDENTITY;
```

---

## 7. Analytics, Health & Diagnostic Queries

### A. Total Registered Users Count
```sql
SELECT COUNT(*) AS total_registered_users FROM "users";
```

### B. Registration Growth Statistics (Users Registered in Last 7 Days)
```sql
SELECT COUNT(*) AS new_users_last_7_days
FROM "users"
WHERE "createdAt" >= NOW() - INTERVAL '7 days';
```

### C. Check PostgreSQL Server Health & Database Ping
```sql
SELECT 1 AS database_alive, NOW() AS current_server_time, version();
```

### D. Check Table Disk Size & Index Storage on Cloud
```sql
SELECT 
    table_name,
    pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) AS total_size,
    pg_size_pretty(pg_relation_size(quote_ident(table_name))) AS table_size,
    pg_size_pretty(pg_indexes_size(quote_ident(table_name))) AS index_size
FROM information_schema.tables
WHERE table_schema = 'public' AND table_name = 'users';
```

---

💡 **Tip:** You can paste and run any of the above queries directly in the [Supabase SQL Editor](https://supabase.com/dashboard/project/qicslyipupsriqkfcwfb/sql/new).
