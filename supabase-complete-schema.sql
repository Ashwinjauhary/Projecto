-- ============================================================================
-- COMPLETE SUPABASE SCHEMA FOR PREMIUM PORTFOLIO APP
-- ============================================================================
-- This schema includes:
-- 1. Database tables with all constraints
-- 2. Indexes for performance optimization
-- 3. Row Level Security (RLS) policies
-- 4. Storage bucket creation
-- 5. Storage policies
-- 6. Triggers for automatic timestamp updates
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 1: Enable Required Extensions
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- STEP 2: Create Tables
-- ----------------------------------------------------------------------------

-- Projects table: Stores all portfolio projects (GitHub synced + custom)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  repo_name TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  github_url TEXT NOT NULL,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  language TEXT,
  topics TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Media table: Stores images and videos for projects
CREATE TABLE IF NOT EXISTS project_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- STEP 3: Create Indexes for Performance
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_projects_visible ON projects(visible);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(order_index);
CREATE INDEX IF NOT EXISTS idx_projects_repo_name ON projects(repo_name);
CREATE INDEX IF NOT EXISTS idx_project_media_project_id ON project_media(project_id);
CREATE INDEX IF NOT EXISTS idx_project_media_order ON project_media(order_index);

-- ----------------------------------------------------------------------------
-- STEP 4: Create Trigger Function for Auto-updating Timestamps
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to projects table
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- STEP 5: Enable Row Level Security (RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- STEP 6: Drop Existing Policies (for clean re-run)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public read visible projects" ON projects;
DROP POLICY IF EXISTS "Admin read all projects" ON projects;
DROP POLICY IF EXISTS "Public read all media" ON project_media;
DROP POLICY IF EXISTS "Admin insert projects" ON projects;
DROP POLICY IF EXISTS "Admin update projects" ON projects;
DROP POLICY IF EXISTS "Admin delete projects" ON projects;
DROP POLICY IF EXISTS "Admin insert media" ON project_media;
DROP POLICY IF EXISTS "Admin update media" ON project_media;
DROP POLICY IF EXISTS "Admin delete media" ON project_media;

-- ----------------------------------------------------------------------------
-- STEP 7: Create RLS Policies for Projects Table
-- ----------------------------------------------------------------------------

-- Public users can read only visible projects
CREATE POLICY "Public read visible projects" 
  ON projects 
  FOR SELECT 
  USING (visible = true);

-- Authenticated admins can read all projects (including hidden)
CREATE POLICY "Admin read all projects" 
  ON projects 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Authenticated admins can insert new projects
CREATE POLICY "Admin insert projects" 
  ON projects 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated admins can update projects
CREATE POLICY "Admin update projects" 
  ON projects 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Authenticated admins can delete projects
CREATE POLICY "Admin delete projects" 
  ON projects 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- ----------------------------------------------------------------------------
-- STEP 8: Create RLS Policies for Project Media Table
-- ----------------------------------------------------------------------------

-- Public users can read all media (visibility filtered by parent project in app)
CREATE POLICY "Public read all media" 
  ON project_media 
  FOR SELECT 
  USING (true);

-- Authenticated admins can insert media
CREATE POLICY "Admin insert media" 
  ON project_media 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- Authenticated admins can update media
CREATE POLICY "Admin update media" 
  ON project_media 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Authenticated admins can delete media
CREATE POLICY "Admin delete media" 
  ON project_media 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================
-- NOTE: Run these commands in the Supabase SQL Editor or Dashboard
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 9: Create Storage Bucket for Project Media
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-media',
  'project-media',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- STEP 10: Create Storage Policies
-- ----------------------------------------------------------------------------

-- Drop existing storage policies (for clean re-run)
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access" ON storage.objects;

-- Public users can read/download files from project-media bucket
CREATE POLICY "Public read access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-media');

-- Authenticated admins can upload files to project-media bucket
CREATE POLICY "Admin upload access"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-media' 
    AND auth.role() = 'authenticated'
  );

-- Authenticated admins can update files in project-media bucket
CREATE POLICY "Admin update access"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'project-media' 
    AND auth.role() = 'authenticated'
  );

-- Authenticated admins can delete files from project-media bucket
CREATE POLICY "Admin delete access"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'project-media' 
    AND auth.role() = 'authenticated'
  );

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these to verify your setup
-- ============================================================================

-- Check if tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check policies
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Check storage bucket
-- SELECT * FROM storage.buckets WHERE id = 'project-media';

-- ============================================================================
-- SAMPLE DATA (OPTIONAL - for testing)
-- ============================================================================

-- Insert a sample project
-- INSERT INTO projects (repo_name, title, description, github_url, featured, visible, stars, forks, language, topics)
-- VALUES (
--   'sample-project',
--   'My Awesome Project',
--   'A sample project for testing',
--   'https://github.com/username/sample-project',
--   true,
--   true,
--   42,
--   7,
--   'TypeScript',
--   ARRAY['react', 'nextjs', 'typescript']
-- );

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. Make sure to run this entire script in your Supabase SQL Editor
-- 2. After running, verify all tables, policies, and storage are created
-- 3. Create your first admin user via Supabase Auth Dashboard
-- 4. Update your .env.local with the correct Supabase credentials
-- ============================================================================
