-- Mevcut RLS politikalarını sil
DROP POLICY IF EXISTS "Metro lines are viewable by everyone" ON metro_lines;
DROP POLICY IF EXISTS "Chat rooms are viewable by everyone" ON chat_rooms;
DROP POLICY IF EXISTS "Messages are viewable by everyone" ON messages;
DROP POLICY IF EXISTS "Messages are insertable by everyone" ON messages;
DROP POLICY IF EXISTS "Reports are insertable by everyone" ON reports;

-- Yeni RLS politikalarını oluştur
-- Metro hatları için politikalar (herkes okuyabilir ve yazabilir)
CREATE POLICY "Metro lines are viewable by everyone" ON metro_lines
  FOR SELECT USING (true);

CREATE POLICY "Metro lines are insertable by everyone" ON metro_lines
  FOR INSERT WITH CHECK (true);

-- Chat odaları için politikalar (herkes okuyabilir ve yazabilir)
CREATE POLICY "Chat rooms are viewable by everyone" ON chat_rooms
  FOR SELECT USING (true);

CREATE POLICY "Chat rooms are insertable by everyone" ON chat_rooms
  FOR INSERT WITH CHECK (true);

-- Mesajlar için politikalar (herkes okuyabilir ve yazabilir)
CREATE POLICY "Messages are viewable by everyone" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Messages are insertable by everyone" ON messages
  FOR INSERT WITH CHECK (true);

-- Raporlar için politikalar (herkes raporlayabilir)
CREATE POLICY "Reports are insertable by everyone" ON reports
  FOR INSERT WITH CHECK (true);
