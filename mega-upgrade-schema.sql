-- ============================================================================
-- MEGA UPGRADE SCHEMA: ANALYTICS, CONTACTS & CONFIG
-- ============================================================================

-- 1. Update Projects Table for Analytics
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;

-- 2. Create Contacts Table for Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Site Config Table for Status & Links
CREATE TABLE IF NOT EXISTS site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for contact_messages
DROP POLICY IF EXISTS "Public can insert messages" ON contact_messages;
CREATE POLICY "Public can insert messages" 
  ON contact_messages FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin can read messages" ON contact_messages;
CREATE POLICY "Admin can read messages" 
  ON contact_messages FOR SELECT 
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can update messages" ON contact_messages;
CREATE POLICY "Admin can update messages" 
  ON contact_messages FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- 6. RLS Policies for site_config
DROP POLICY IF EXISTS "Public can read config" ON site_config;
CREATE POLICY "Public can read config" 
  ON site_config FOR SELECT 
  USING (true);

DROP POLICY IF EXISTS "Admin can manage config" ON site_config;
CREATE POLICY "Admin can manage config" 
  ON site_config FOR ALL 
  USING (auth.role() = 'authenticated');

-- 7. Default Config Seeds
INSERT INTO site_config (key, value)
VALUES 
  ('live_status', '{"status": "Available for Work", "color": "green"}'),
  ('social_links', '{"github": "", "linkedin": "", "twitter": "", "instagram": ""}')
ON CONFLICT (key) DO NOTHING;

-- 8. Increment RPCs for Atomic Updates
CREATE OR REPLACE FUNCTION increment_view_count(project_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE projects 
    SET view_count = view_count + 1 
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_click_count(project_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE projects 
    SET click_count = click_count + 1 
    WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
