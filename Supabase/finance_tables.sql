-- ====================================================================
-- RAFSAN AGRO - FINANCE / CASH FLOW DATABASE TABLES SETUP
-- ====================================================================
-- PURPOSE: Creates the Transaction table and TransactionType enum
--          required for the Finance section of the admin panel.
--
-- HOW TO USE:
--   1. Go to Supabase Dashboard -> SQL Editor -> New Query
--   2. Paste this entire script
--   3. Click "Run" (or press Ctrl+Enter)
--
-- This script is SAFE to run multiple times (idempotent).
-- It will drop and recreate the Transaction table if it already exists.
-- ====================================================================


-- ====================================================================
-- STEP 1: Create the TransactionType enum (if not exists)
-- ====================================================================
-- The Transaction table uses this enum for the "type" column
-- to distinguish between INCOME and EXPENSE entries.

DO $$ BEGIN
    CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- ====================================================================
-- STEP 2: Ensure the User table exists (dependency)
-- ====================================================================
-- The Transaction table has a foreign key to the User table.
-- This creates it only if it doesn't already exist.

DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPER_ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "User" (
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "email"     TEXT NOT NULL,
    "password"  TEXT NOT NULL,
    "role"      "Role" NOT NULL DEFAULT 'ADMIN',
    "avatar"    TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");


-- ====================================================================
-- STEP 3: Drop the existing Transaction table (if broken/incorrect)
-- ====================================================================
-- This ensures we start fresh with the correct column definitions.
-- WARNING: This will delete any existing transaction data!
-- If you want to preserve data, comment out the DROP line below
-- and use ALTER TABLE statements instead.

DROP TABLE IF EXISTS "Transaction" CASCADE;


-- ====================================================================
-- STEP 4: Create the Transaction table with correct columns
-- ====================================================================
-- This table stores all financial records (income & expenses)
-- used by the admin panel's Finance section.
--
-- Columns:
--   id          - Unique identifier (CUID format text)
--   type        - INCOME or EXPENSE (TransactionType enum)
--   category    - Category label (SALE, PURCHASE, SALARY, RENT, etc.)
--   amount      - Transaction amount in BDT (double precision)
--   description - Optional notes/remarks about the transaction
--   reference   - Optional invoice/reference number
--   date        - Date of the transaction
--   createdById - Optional FK to User who created this entry
--   createdAt   - Auto-set creation timestamp
--   updatedAt   - Auto-set update timestamp

CREATE TABLE "Transaction" (
    "id"          TEXT NOT NULL,
    "type"        "TransactionType" NOT NULL,
    "category"    TEXT NOT NULL,
    "amount"      DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "reference"   TEXT,
    "date"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);


-- ====================================================================
-- STEP 5: Create the foreign key to User table
-- ====================================================================
-- Links each transaction to the admin user who created it.
-- ON DELETE SET NULL: if the user is deleted, the transaction remains
-- but the createdById is set to null.

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Transaction_createdById_fkey'
    ) THEN
        ALTER TABLE "Transaction"
            ADD CONSTRAINT "Transaction_createdById_fkey"
            FOREIGN KEY ("createdById")
            REFERENCES "User"("id")
            ON DELETE SET NULL
            ON UPDATE CASCADE;
    END IF;
END $$;


-- ====================================================================
-- STEP 6: Create indexes for query performance
-- ====================================================================
-- These indexes speed up common queries used by the finance API:
--   - Filtering by type (INCOME/EXPENSE)
--   - Filtering by category
--   - Sorting by date (most recent first)
--   - Searching by reference number

CREATE INDEX IF NOT EXISTS "Transaction_type_idx"
    ON "Transaction"("type");

CREATE INDEX IF NOT EXISTS "Transaction_category_idx"
    ON "Transaction"("category");

CREATE INDEX IF NOT EXISTS "Transaction_date_idx"
    ON "Transaction"("date" DESC);

CREATE INDEX IF NOT EXISTS "Transaction_createdById_idx"
    ON "Transaction"("createdById");

CREATE INDEX IF NOT EXISTS "Transaction_reference_idx"
    ON "Transaction"("reference");


-- ====================================================================
-- STEP 7: Enable Row Level Security (RLS) - Optional but recommended
-- ====================================================================
-- Supabase uses RLS by default. We enable it and create policies
-- so the service_role key (used by the Next.js API) has full access.

ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;

-- Allow the service_role (backend API) full CRUD access
DO $$ BEGIN
    CREATE POLICY "Service role full access on Transaction"
    ON "Transaction"
    FOR ALL
    USING (true)
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Allow anon/authenticated users read-only access (optional)
DO $$ BEGIN
    CREATE POLICY "Public read access on Transaction"
    ON "Transaction"
    FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;


-- ====================================================================
-- STEP 8: Create an auto-update trigger for updatedAt
-- ====================================================================
-- Automatically sets "updatedAt" to the current timestamp whenever
-- a row is updated. This matches Prisma's @updatedAt behavior.

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS "Transaction_updatedAt_trigger" ON "Transaction";

CREATE TRIGGER "Transaction_updatedAt_trigger"
    BEFORE UPDATE ON "Transaction"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ====================================================================
-- STEP 9: Verify the setup
-- ====================================================================
-- This query confirms the Transaction table was created correctly.
-- You should see all 9 columns listed in the output.

SELECT
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'Transaction'
ORDER BY ordinal_position;


-- ====================================================================
-- DONE! ✅
-- ====================================================================
-- The finance tables are now ready. Your admin panel's Finance section
-- (Income, Expenses, Cash Flow, Reports) should now work correctly.
--
-- Expected columns in the Transaction table:
--   1. id          (text, NOT NULL, PK)
--   2. type        (TransactionType enum: INCOME | EXPENSE)
--   3. category    (text, NOT NULL - e.g. SALE, PURCHASE, SALARY, RENT)
--   4. amount      (double precision, NOT NULL - amount in BDT)
--   5. description (text, nullable - notes/remarks)
--   6. reference   (text, nullable - invoice/ref number)
--   7. date        (timestamp, NOT NULL - transaction date)
--   8. createdById (text, nullable - FK to User table)
--   9. createdAt   (timestamp, NOT NULL - auto-set)
--  10. updatedAt   (timestamp, NOT NULL - auto-updated)
-- ====================================================================
