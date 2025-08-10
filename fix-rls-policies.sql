-- Mevcut RLS politikalarını sil
DROP POLICY IF EXISTS "Chat rooms are viewable by everyone" ON chat_rooms;
DROP POLICY IF EXISTS "Chat rooms are insertable by everyone" ON chat_rooms;
DROP POLICY IF EXISTS "Messages are viewable by everyone" ON messages;
DROP POLICY IF EXISTS "Messages are insertable by everyone" ON messages;
DROP POLICY IF EXISTS "Reports are insertable by everyone" ON reports;

-- Chat odaları için yeni politikalar (herkes okuyabilir ve yazabilir)
CREATE POLICY "Chat rooms are viewable by everyone" ON chat_rooms
  FOR SELECT USING (true);

CREATE POLICY "Chat rooms are insertable by everyone" ON chat_rooms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Chat rooms are updatable by everyone" ON chat_rooms
  FOR UPDATE USING (true);

-- Mesajlar için politikalar (herkes okuyabilir ve yazabilir)
CREATE POLICY "Messages are viewable by everyone" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Messages are insertable by everyone" ON messages
  FOR INSERT WITH CHECK (true);

-- Raporlar için politikalar (herkes raporlayabilir)
CREATE POLICY "Reports are insertable by everyone" ON reports
  FOR INSERT WITH CHECK (true);
