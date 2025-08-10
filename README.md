# MetroSohbet 🚇

Metrodayken metrodakilerle konuş. İstanbul metro hatlarına özel anonim sohbet platformu.

## 📱 Proje Hakkında

MetroSohbet, İstanbul'da metro kullanan insanların aynı hatta bulunan diğer yolcularla anonim olarak sohbet edebileceği, bilgi paylaşabileceği ve topluluk oluşturabileceği bir web uygulamasıdır.

### 🎯 Temel Özellikler

- **Hat Bazlı Odalar**: Her metro hattı için ayrı sohbet odaları
- **Kurallı Nickname**: 3–20 karakter, harf/rakam/alt çizgi; yasaklı liste ve ban kontrolü
- **Gerçek Zamanlı Chat**: Supabase Realtime ile anlık mesajlaşma
- **Özel Mesajlaşma (DM)**: Kullanıcılar arasında birebir sohbet (/dm, /dm/[peer])
- **Kullanıcı Profilleri**: Nick profili ve son mesajlar (/u/[nick], /profile)
- **Gerçek Zamanlı Presence**: Çevrimiçi kullanıcı sayısı ve "yazıyor…" göstergesi
- **Kalabalık Seviyesi**: Hat bazlı kalabalık anketleri
- **Bilgi Paylaşımı**: Kayıp eşya, duyuru, güvenlik uyarıları
- **Mobil Uyumlu**: PWA (Progressive Web App) desteği, mobilde altta sabit mesaj yazma alanı (sticky composer)
- **Cross-Line Announcements**: Hatlar arası sistem duyuruları (kapatma, arıza, bakım bilgileri)
- **Rapor Workflow Sistemi**: Gelişmiş moderasyon ve durum takibi

### 🚀 Teknoloji Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Realtime, Storage)
- **Deployment**: Vercel (ücretsiz plan)
- **State Management**: Zustand
- **UI Components**: Shadcn/ui

## 📋 Geliştirme Aşamaları

### v0.1 - MVP (Minimum Viable Product)
- [x] Proje kurulumu ve README
- [x] Next.js projesi oluştur
- [x] TypeScript, Tailwind CSS, Zustand kurulumu
- [x] Shadcn/ui bileşenleri kurulumu
- [x] Supabase kurulumu
- [x] Metro hatları listesi
- [x] Hat seçimi ve oda girişi
- [x] Anonim mesajlaşma sistemi
- [x] Gerçek zamanlı chat
- [x] Nickname desteği
- [x] Loading states ve error handling
- [x] Basit küfür filtresi (server-side sansür)
- [x] Mesaj raporlama sistemi (client + admin listesi)
- [x] Responsive tasarım

### v0.2 - Temel Özellikler
- [ ] Kalabalık seviyesi anketi
- [ ] Paylaşılabilir kart sistemi
- [ ] Günlük soru özelliği
- [ ] Kullanıcı rozetleri
- [ ] Mesaj arama

### v0.3 - Gelişmiş Özellikler
- [x] İstasyon bazlı mikro odalar
- [x] Fotoğraf paylaşımı
- [x] Direkt mesajlaşma
- [x] Gelişmiş moderasyon paneli
- [x] Analytics dashboard
- [x] Cross-Line Announcements sistemi
- [x] Rapor Workflow sistemi (durum: yeni/incele/kapandı)

### v1.0 - Mobil Uygulama
- [ ] Flutter ile mobil uygulama
- [ ] Push bildirimleri
- [ ] Konum bazlı otomatik hat tespiti
- [ ] Offline mesaj desteği

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Supabase hesabı

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone https://github.com/yourusername/metrosohbet.git
cd metrosohbet
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Environment değişkenlerini ayarlayın** (service role gerekli)
```bash
# .env.local dosyası oluşturun
touch .env.local
```

`.env.local` dosyasını düzenleyin:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://bqvxessczvcmxzpelewr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdnhlc3NjenZjbXh6cGVsZXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTU0OTgsImV4cCI6MjA3MDIzMTQ5OH0.u9C2lB2xN8vrPTWUSyK3_462U85BDd_13Km_HLERuA0
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Supabase Storage Bucket Oluşturun**
Supabase Studio'da Storage bölümüne gidin ve `metrosohbet-images` adında bir bucket oluşturun:

1. Supabase Dashboard → Storage
2. "New bucket" butonuna tıklayın
3. Bucket adı: `metrosohbet-images`
4. Public bucket seçeneğini işaretleyin
5. "Create bucket" butonuna tıklayın

**Bucket Ayarları:**
- **Ad**: `metrosohbet-images`
- **Public**: ✅ (Herkes erişebilir)
- **Dosya boyutu limiti**: 5MB
- **İzin verilen dosya türleri**: image/jpeg, image/png, image/gif, image/webp

5. **Veritabanı şemasını oluşturun** (RLS politikalarıyla birlikte)
- Supabase Studio'da SQL Editor'ı açın
- Aşağıdaki SQL komutlarını çalıştırın:

```sql
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
  message_type TEXT DEFAULT 'chat',
  is_anonymous BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Raporlar tablosu (workflow durumu ile)
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  reporter_nickname TEXT,
  reporter_ip TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'closed')),
  admin_notes TEXT,
  assigned_admin TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cross-line announcements tablosu
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
```

6. **Geliştirme sunucusunu başlatın** (API route'ları için yeniden başlatma gerekebilir)
```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacak.

## 📊 Veritabanı Şeması

### Tablolar

#### `metro_lines`
```sql
id: uuid (primary key)
name: text (M1, M2, M4, vb.)
display_name: text (M1 - Yenikapı-Havaalanı)
color: text (#FF0000)
is_active: boolean
created_at: timestamp
```

#### `chat_rooms`
```sql
id: uuid (primary key)
line_id: uuid (foreign key to metro_lines)
name: text (oda adı)
description: text
is_active: boolean
created_at: timestamp
```

#### `messages`
```sql
id: uuid (primary key)
room_id: uuid (foreign key to chat_rooms)
nickname: text
content: text
message_type: text (chat, announcement, lost_item, crowd_level)
is_anonymous: boolean
created_at: timestamp
```

#### `reports` (Workflow Durumu ile)
```sql
id: uuid (primary key)
message_id: uuid (foreign key to messages, CASCADE delete)
reason: text
reporter_nickname: text
reporter_ip: text
status: text (new, reviewing, closed)
admin_notes: text
assigned_admin: text
reviewed_at: timestamp
closed_at: timestamp
created_at: timestamp
updated_at: timestamp
```

#### `cross_line_announcements`
```sql
id: uuid (primary key)
title: text
content: text
announcement_type: text (info, warning, error, shutdown, maintenance)
priority: integer (1-5)
is_active: boolean
starts_at: timestamp
expires_at: timestamp
created_by: text
created_at: timestamp
updated_at: timestamp
```

## 🎨 UI/UX Tasarım

### Renk Paleti
- **Ana Renk**: Metro mavisi (#0066CC)
- **İkincil**: Turuncu (#FF6600)
- **Arka Plan**: Beyaz (#FFFFFF)
- **Metin**: Koyu gri (#333333)

### Metro Hatları Renkleri
- M1: Kırmızı (#FF0000)
- M2: Yeşil (#00FF00)
- M3: Mavi (#0066CC)
- M4: Turuncu (#FF6600)
- Marmaray: Sarı (#FFFF00)

## 📱 PWA Özellikleri

- **Ana Ekrana Ekleme**: Kullanıcılar uygulamayı ana ekrana ekleyebilir (custom prompt)
- **Offline Çalışma**: Temel özellikler internet olmadan da çalışır (offline.html fallback)
- **Push Bildirimleri**: Yeni mesajlar için bildirim (gelecek versiyon)
- **App-like Deneyim**: Native uygulama gibi görünüm ve davranış

## 🚀 Deployment

### Vercel ile Deployment

1. **Vercel hesabı oluşturun**
2. **GitHub repo'yu bağlayın**
3. **Environment değişkenlerini ayarlayın**
4. **Deploy edin**

```bash
npm run build
```

### Environment Değişkenleri (Production)

```env
NEXT_PUBLIC_SUPABASE_URL=https://bqvxessczvcmxzpelewr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdnhlc3NjenZjbXh6cGVsZXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTU0OTgsImV4cCI6MjA3MDIzMTQ5OH0.u9C2lB2xN8vrPTWUSyK3_462U85BDd_13Km_HLERuA0
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=https://metrosohbet.vercel.app
```

### Veritabanı Kurulumu ve RLS

1. **Supabase Studio'da SQL Editor'ı açın**
2. **`database-schema-v3.sql` dosyasındaki komutları çalıştırın**
3. **Metro hatları verisini ekleyin**: `npm run seed`
4. **Chat room'ları oluşturun**: `npm run create-rooms`
5. **Rapor workflow sistemi için**: `migrate-reports-workflow.sql` çalıştırın
6. (Opsiyonel) RLS güncelleme: `fix-rls-policies.sql`

### Admin API'leri (Server)
**Authentication**: Tüm admin API'leri Basic Authentication kullanır (`admin@metrosohbet.com:admin123456`)

- `/api/admin/lines/toggle` (POST): Hat aktif/pasif
- `/api/admin/messages/delete` (POST): Mesaj sil
- `/api/admin/messages/clear` (POST): Tüm mesajları sil (global)
- `/api/admin/users/ban` (POST): Kullanıcı engelle
- `/api/admin/reports/list` (GET): Raporlanan mesajları listele
- `/api/admin/reports/[id]` (PATCH): Rapor durumu güncelle
- `/api/admin/messages/soft-delete` (POST): Mesajı gizle/geri yükle
- `/api/admin/announcements` (GET/POST): Cross-line duyuruları yönet
- `/api/admin/announcements/[id]` (PUT/DELETE/PATCH): Duyuru düzenle/sil/toggle
- `/api/admin/rate-limits` (GET/POST): Rate limit istatistikleri ve kullanıcı engelleme
- `/api/admin/messages/announce` (POST): Chat odalarına duyuru gönder
- `/api/admin/messages/pin` (POST): Mesaj pin/unpin

### Mesaj Gönderimi (Server)
- `/api/messages/send` (POST): Aktif hat, ban ve nickname kurallarını server'da doğrular. Pasif hatta 403 döner.

### Diğer API'ler
- `/api/messages/report` (POST): Mesaj raporlama
- `/api/messages/self-delete` (POST): Kullanıcının kendi mesajını silmesi
- `/api/link/preview?url=...` (GET): Link OG meta önizleme
- `/api/announcements` (GET): Aktif cross-line duyuruları (sadece `is_active=true`, `starts_at<=now`, `expires_at>now` olanlar)

### PWA / SEO
- robots.txt ve sitemap.xml (hat sayfaları dahil)
- manifest.json ve service worker (offline cache + offline fallback)
- Dinamik SEO: Hat sayfaları için generateMetadata (title/description/canonical)

### Testler
- Unit/Integration: Jest + ts-jest (`npm run test`)
- E2E: Playwright (`npm run test:e2e`)

### Geliştirme İpuçları
- Supabase REST istekleri için `rel="preconnect"` ekli
- Mobil performans: resimler `loading="lazy"`, `sizes` ve `decoding="async"` ile servis edilir

## 📈 Analytics ve Monitoring

### Kullanıcı Metrikleri
- Günlük aktif kullanıcı (DAU)
- Mesaj sayısı
- Oda başına kullanıcı sayısı
- Kullanıcı tutunma oranı (D1, D7)

### Teknik Metrikler
- Sayfa yükleme süresi
- API response time
- Error rate
- Uptime

## 🔒 Güvenlik

### Kullanıcı Gizliliği
- Anonim kullanım (e-posta zorunlu değil)
- IP adresi loglanmaz
- Mesajlar şifrelenmez (public chat)

### İçerik Moderasyonu
- Otomatik küfür filtresi
- Kullanıcı raporlama sistemi
- Admin paneli ile manuel moderasyon
- Rate limiting
- Rapor workflow sistemi (durum takibi)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Proje Sahibi**: MetroSohbet Team
- **GitHub**: [Proje Repository]
- **Demo**: [Canlı Demo Linki]

## 🙏 Teşekkürler

- Supabase ekibine açık kaynak backend çözümü için
- Vercel ekibine ücretsiz hosting için
- Next.js ekibine harika framework için
- İstanbul Büyükşehir Belediyesi metro hatları için

## 🎉 Başarıyla Tamamlanan Özellikler

- ✅ **Gerçek Zamanlı Chat**: Supabase Realtime ile anlık mesajlaşma
- ✅ **Metro Hatları**: İstanbul'un tüm metro hatları
- ✅ **Anonim Kullanım**: Nickname opsiyonel
- ✅ **Responsive Tasarım**: Mobil uyumlu
- ✅ **Modern UI**: Tailwind CSS ile güzel tasarım
- ✅ **TypeScript**: Tip güvenliği
- ✅ **Next.js 15**: En son teknolojiler
- ✅ **Fotoğraf Paylaşımı**: Supabase Storage ile resim yükleme
- ✅ **Admin Paneli**: Kapsamlı moderasyon sistemi
- ✅ **Kullanıcı Engelleme**: Admin tarafından kullanıcı engelleme
- ✅ **Mesaj Silme**: Admin tarafından mesaj silme
- ✅ **İstatistikler**: Sistem istatistikleri dashboard'u
- ✅ **Mesaj Raporlama**: Kullanıcılar mesajları raporlayabilir, admin raporları görür
- ✅ **Kullanıcı Mesajını Sil**: Kullanıcı kendi mesajını kaldırabilir
- ✅ **Presence**: Çevrimiçi sayaç ve "yazıyor…" bilgisi
- ✅ **Link Önizleme**: OG meta ile kart
- ✅ **Enter ile Gönder + Shift+Enter satır**
- ✅ **Optimistic UI**: Mesaj anında görünür, hata olursa geri alınır
- ✅ **Pasif Hat Guard**: Server-side yönlendirme, pasif hatta gönderim engeli
- ✅ **Pasif Hat Formu**: Pasif hatlarda bilgilendirme/abonelik talebi sayfası
- ✅ **DM Sistemi (MVP)**: Inbox ve sohbet sayfaları, realtime
- ✅ **Profil Sayfaları**: /profile ve /u/[nick]
- ✅ **Chat'ten DM**: Sohbette kullanıcı adına tıklayarak DM'e git
- ✅ **Temel SEO/PWA**: robots, sitemap, manifest, dinamik metadata
- ✅ **Pasif Hat Formu**: Pasif hatlarda bilgilendirme/abonelik talebi
- ✅ **Soft Delete/Restore**: Admin mesajı gizleyebilir/geri yükleyebilir
- ✅ **Footer Yasal Metinleri**: KVKK / Gizlilik / Şartlar modal olarak
- ✅ **Sticky Composer (Mobil)**: Sohbet ve DM'de altta sabit composer
- ✅ **Offline Fallback**: `offline.html`, navigasyonda fallback
- ✅ **Add to Home Prompt**: beforeinstallprompt ile kullanıcıya teklif
- ✅ **404 & Global Error**: Özel sayfalar
- ✅ **Test Altyapısı**: Jest + Playwright; admin/chat/dm smoke E2E
- ✅ **Cross-Line Announcements**: Hatlar arası sistem duyuruları (kapatma, arıza, bakım)
- ✅ **Rapor Workflow Sistemi**: Gelişmiş moderasyon ve durum takibi (yeni/incele/kapandı)
- ✅ **Admin API Authentication**: Tüm admin API'leri için server-side Basic Authentication
- ✅ **Announcement Filtering**: Pasif duyurular otomatik olarak gizlenir (server-side filtering)

---

**MetroSohbet** - Metrodayken metrodakilerle konuş 🚇💬
