-- ─────────────────────────────────────────────────────────────
-- SUPABASE SCHEMA INITIALIZATION
-- Run this script in the Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────

-- 1. Create Core Content Tables

-- Pages (Home, About)
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL, -- 'home', 'about'
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  seo_og_image TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Events
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  image_url TEXT,
  registration_link TEXT,
  status TEXT DEFAULT 'upcoming', -- upcoming, ongoing, past
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Workshops
CREATE TABLE workshops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  date TEXT,
  duration TEXT,
  category TEXT DEFAULT 'General',
  image_url TEXT,
  registration_link TEXT,
  status TEXT DEFAULT 'active', -- active, archived
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Gallery
CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  caption TEXT,
  album TEXT DEFAULT 'General',
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Volunteers
CREATE TABLE volunteers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  department TEXT,
  email TEXT,
  phone TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active', -- active, pending, inactive
  joined_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Testimonials
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  status TEXT DEFAULT 'pending', -- approved, pending, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Global Settings (Contact, Social)
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);


-- 2. Setup Storage Bucket for Media

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- 3. Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Public read access for pages" ON pages FOR SELECT USING (true);
CREATE POLICY "Public read access for events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read access for workshops" ON workshops FOR SELECT USING (true);
CREATE POLICY "Public read access for gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read access for volunteers" ON volunteers FOR SELECT USING (true);
CREATE POLICY "Public read access for testimonials" ON testimonials FOR SELECT USING (status = 'approved');
CREATE POLICY "Public read access for settings" ON settings FOR SELECT USING (true);

-- Authenticated Admin full access (Assuming simple auth model for admins)
CREATE POLICY "Admin full access to pages" ON pages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to events" ON events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to workshops" ON workshops FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to gallery" ON gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to volunteers" ON volunteers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access to settings" ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Storage Policies
CREATE POLICY "Public media read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Admin media write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Admin media update" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Admin media delete" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
