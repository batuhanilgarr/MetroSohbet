-- Migration script to create cross_line_announcements table
-- Run this script on your existing database

-- Create cross_line_announcements table
CREATE TABLE IF NOT EXISTS cross_line_announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  announcement_type TEXT NOT NULL CHECK (announcement_type IN ('info', 'warning', 'error', 'shutdown', 'maintenance')),
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  is_active BOOLEAN DEFAULT true,
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cross_line_announcements_active ON cross_line_announcements(is_active, starts_at, expires_at);
CREATE INDEX IF NOT EXISTS idx_cross_line_announcements_type ON cross_line_announcements(announcement_type);
CREATE INDEX IF NOT EXISTS idx_cross_line_announcements_priority ON cross_line_announcements(priority);

-- Enable RLS
ALTER TABLE cross_line_announcements ENABLE ROW LEVEL SECURITY;

-- RLS policies
DROP POLICY IF EXISTS "Cross-line announcements are viewable by everyone" ON cross_line_announcements;
DROP POLICY IF EXISTS "Cross-line announcements are manageable by admins" ON cross_line_announcements;

-- Everyone can read active announcements
CREATE POLICY "Cross-line announcements are viewable by everyone" ON cross_line_announcements
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Only admins can create/update/delete announcements
CREATE POLICY "Cross-line announcements are manageable by admins" ON cross_line_announcements
  FOR ALL USING (true);

-- Create or replace function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for cross_line_announcements table
DROP TRIGGER IF EXISTS update_cross_line_announcements_updated_at ON cross_line_announcements;
CREATE TRIGGER update_cross_line_announcements_updated_at 
    BEFORE UPDATE ON cross_line_announcements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'cross_line_announcements' 
ORDER BY ordinal_position;

-- Insert a sample announcement for testing
INSERT INTO cross_line_announcements (title, content, announcement_type, priority, created_by) 
VALUES (
  'Hoş Geldiniz! 🚇',
  'MetroSohbet uygulamasına hoş geldiniz. Bu platform İstanbul metro hatlarında seyahat eden yolcuların birbirleriyle iletişim kurmasını sağlar.',
  'info',
  1,
  'Admin'
) ON CONFLICT DO NOTHING;
