-- Mevcut tablolar (zaten var)
-- metro_lines, chat_rooms, messages, reports

-- Banned users tablosu
CREATE TABLE banned_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL UNIQUE,
  banned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  banned_by TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages tablosuna image_url ve image_path alanları ekle
ALTER TABLE messages ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS image_path TEXT;

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_banned_users_nickname ON banned_users(nickname);
CREATE INDEX IF NOT EXISTS idx_messages_image_url ON messages(image_url);

-- RLS politikaları
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;

-- Banned users için politikalar
CREATE POLICY "Banned users are viewable by everyone" ON banned_users
  FOR SELECT USING (true);

CREATE POLICY "Banned users are insertable by admin" ON banned_users
  FOR INSERT WITH CHECK (true);

-- Storage bucket oluştur (Supabase Studio'da manuel olarak yapılmalı)
-- Bucket adı: metrosohbet-images
-- Public bucket olarak ayarla
-- RLS politikaları:
-- - SELECT: true (herkes okuyabilir)
-- - INSERT: true (herkes yükleyebilir)
-- - UPDATE: false
-- - DELETE: false (sadece admin silebilir)
