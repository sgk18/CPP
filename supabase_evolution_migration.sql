-- ─────────────────────────────────────────────────────────────
-- SUPABASE SCHEMA EVOLUTION MIGRATION
-- Run this script in the Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────

-- 1. Create activity_logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Evolve pages Table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE pages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft';
ALTER TABLE pages ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 4. Create page_sections Table
CREATE TABLE IF NOT EXISTS page_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  data_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Evolve events Table
ALTER TABLE events ADD COLUMN IF NOT EXISTS venue TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_path TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS medium_url TEXT;

-- 6. Evolve gallery Table
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS image_url TEXT;
-- Safely copy data from legacy url column if it exists
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='gallery' AND column_name='url') THEN
    UPDATE gallery SET image_url = url WHERE image_url IS NULL;
  END IF;
END $$;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE gallery ADD COLUMN IF NOT EXISTS medium_url TEXT;

-- 7. Evolve volunteers Table (Team Members - Legacy)
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS github TEXT;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS class TEXT;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS is_coordinator BOOLEAN DEFAULT false;
ALTER TABLE volunteers ADD COLUMN IF NOT EXISTS image_path TEXT;

-- 8. Create team_members Table (Prisma-aligned)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  image_url TEXT,
  thumbnail_url TEXT,
  medium_url TEXT,
  linkedin TEXT,
  github TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 9. RLS Policies Configuration for New/Evolved Tables
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Drop if exist and recreate Select policies
DROP POLICY IF EXISTS "Public read access for activity_logs" ON activity_logs;
CREATE POLICY "Public read access for activity_logs" ON activity_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for announcements" ON announcements;
CREATE POLICY "Public read access for announcements" ON announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for page_sections" ON page_sections;
CREATE POLICY "Public read access for page_sections" ON page_sections FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read access for team_members" ON team_members;
CREATE POLICY "Public read access for team_members" ON team_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin full access to team_members" ON team_members;
CREATE POLICY "Admin full access to team_members" ON team_members FOR ALL USING (auth.role() = 'authenticated');
