-- ============================================================================
-- 🗄️ PostgreSQL Master SQL Script for JWT Authentication
-- Database: postgres (Supabase Cloud / PostgreSQL 16+)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABLE CREATION (DDL)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- ----------------------------------------------------------------------------
-- 2. INDEXING (Enforces uniqueness and optimizes lookup speed)
-- ----------------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users"("createdAt" DESC);

-- ----------------------------------------------------------------------------
-- 3. SEED INITIAL DEMO USERS (DML)
-- Password for all accounts is: Password123!
-- ----------------------------------------------------------------------------
INSERT INTO "users" ("id", "name", "email", "passwordHash", "createdAt", "updatedAt")
VALUES 
    (
        'dde24fc3-e03d-4e97-aaa6-6a5cb86510a8', 
        'Production Admin', 
        'admin@example.com', 
        '$2b$10$ms4hLFLG5M/OLHDd7x3KqOz6n40Y1sM4gY8v3Fk6r9n7s0a', 
        NOW(), 
        NOW()
    ),
    (
        'e58a712c-39b1-4d92-9cb7-7f8e32901a11', 
        'Rupesh Kumar', 
        'rupesh@example.com', 
        '$2b$10$ms4hLFLG5M/OLHDd7x3KqOz6n40Y1sM4gY8v3Fk6r9n7s0a', 
        NOW(), 
        NOW()
    )
ON CONFLICT ("email") DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. VERIFICATION QUERY
-- ----------------------------------------------------------------------------
SELECT id, name, email, "createdAt" FROM "users" ORDER BY "createdAt" DESC;
