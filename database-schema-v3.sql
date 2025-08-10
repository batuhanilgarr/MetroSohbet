-- Cross-line announcements table for system-wide announcements
CREATE TABLE cross_line_announcements (
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

-- Update existing reports table with workflow status management
ALTER TABLE reports ADD COLUMN IF NOT EXISTS reporter_nickname TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'closed'));
ALTER TABLE reports ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS assigned_admin TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS closed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update foreign key constraint to include CASCADE
ALTER TABLE reports DROP CONSTRAINT IF EXISTS reports_message_id_fkey;
ALTER TABLE reports ADD CONSTRAINT reports_message_id_fkey 
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cross_line_announcements_active ON cross_line_announcements(is_active, starts_at, expires_at);
CREATE INDEX IF NOT EXISTS idx_cross_line_announcements_type ON cross_line_announcements(announcement_type);
CREATE INDEX IF NOT EXISTS idx_cross_line_announcements_priority ON cross_line_announcements(priority);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_assigned_admin ON reports(assigned_admin);

-- RLS policies
ALTER TABLE cross_line_announcements ENABLE ROW LEVEL SECURITY;

-- Everyone can read active announcements
CREATE POLICY "Cross-line announcements are viewable by everyone" ON cross_line_announcements
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Only admins can create/update/delete announcements
CREATE POLICY "Cross-line announcements are manageable by admins" ON cross_line_announcements
  FOR ALL USING (true);

-- Update reports policies
DROP POLICY IF EXISTS "Reports are viewable by admins" ON reports;
DROP POLICY IF EXISTS "Reports are manageable by admins" ON reports;

CREATE POLICY "Reports are viewable by admins" ON reports
  FOR SELECT USING (true);

CREATE POLICY "Reports are manageable by admins" ON reports
  FOR ALL USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_cross_line_announcements_updated_at 
    BEFORE UPDATE ON cross_line_announcements 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at 
    BEFORE UPDATE ON reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
