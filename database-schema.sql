-- Metro hatları tablosu
CREATE TABLE metro_lines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  color TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat odaları tablosu
CREATE TABLE chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  line_id UUID REFERENCES metro_lines(id),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mesajlar tablosu
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id),
  nickname TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'chat' CHECK (message_type IN ('chat', 'announcement', 'lost_item', 'crowd_level')),
  is_anonymous BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Raporlar tablosu
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES messages(id),
  reason TEXT NOT NULL,
  reporter_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_chat_rooms_line_id ON chat_rooms(line_id);

-- RLS (Row Level Security) politikaları
ALTER TABLE metro_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

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

-- Realtime özelliğini aktifleştir
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
