-- Migration script to add workflow status management to existing reports table
-- Run this script on your existing database

-- Add new columns to reports table
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_assigned_admin ON reports(assigned_admin);

-- Update existing reports to have 'new' status
UPDATE reports SET status = 'new' WHERE status IS NULL;

-- Create or replace function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for reports table
DROP TRIGGER IF EXISTS update_reports_updated_at ON reports;
CREATE TRIGGER update_reports_updated_at 
    BEFORE UPDATE ON reports 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update RLS policies
DROP POLICY IF EXISTS "Reports are viewable by admins" ON reports;
DROP POLICY IF EXISTS "Reports are manageable by admins" ON reports;

CREATE POLICY "Reports are viewable by admins" ON reports
  FOR SELECT USING (true);

CREATE POLICY "Reports are manageable by admins" ON reports
  FOR ALL USING (true);

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'reports' 
ORDER BY ordinal_position;
