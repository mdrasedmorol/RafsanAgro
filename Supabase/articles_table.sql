-- ====================================================
-- RAFSAN AGRO - ARTICLE / BLOG TABLE SETUP SCRIPT
-- Copy and paste this script into the Supabase SQL Editor
-- (Dashboard -> SQL Editor -> New Query -> Run)
-- ====================================================

-- 1. Create ArticleStatus Enum
DO $$ BEGIN
    CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create Article Table
CREATE TABLE IF NOT EXISTS "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "videoUrl" TEXT,
    "documents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "author" TEXT,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- Unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS "Article_slug_key" ON "Article"("slug");

-- Indices for performance
CREATE INDEX IF NOT EXISTS "Article_status_idx" ON "Article"("status");
CREATE INDEX IF NOT EXISTS "Article_category_idx" ON "Article"("category");
CREATE INDEX IF NOT EXISTS "Article_createdAt_idx" ON "Article"("createdAt" DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE "Article" ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published articles
CREATE POLICY "Public read published articles" ON "Article"
    FOR SELECT USING (status = 'PUBLISHED');

-- Allow service role full access
CREATE POLICY "Service role full access on articles" ON "Article"
    FOR ALL USING (true);

