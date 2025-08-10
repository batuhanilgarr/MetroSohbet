# MetroSohbet - TODO Listesi 📋

## 🚀 v0.1 - MVP (Minimum Viable Product)

### ✅ Tamamlanan
- [x] Proje kurulumu ve README.md
- [x] TODO listesi oluşturma
- [x] Next.js 14 projesi oluştur
- [x] TypeScript konfigürasyonu
- [x] Tailwind CSS kurulumu
- [x] Shadcn/ui kurulumu (Radix UI bileşenleri)
- [x] Zustand state management kurulumu
- [x] ESLint ve Prettier konfigürasyonu

### 🔄 Devam Eden
- [x] Supabase projesi oluşturma
- [x] Environment değişkenlerini ayarlama
- [x] Veritabanı şeması kurulumu

### 📝 Yapılacak

#### 1. Supabase Kurulumu
- [x] Supabase hesabı oluştur
- [x] Yeni proje oluştur
- [x] Environment değişkenlerini ayarla
- [x] Supabase client konfigürasyonu oluştur
- [x] Veritabanı tablolarını oluştur:
  - [x] `metro_lines` tablosu
  - [x] `chat_rooms` tablosu
  - [x] `messages` tablosu
  - [x] `reports` tablosu
  - [x] `cross_line_announcements` tablosu
- [x] RLS (Row Level Security) politikalarını ayarla
- [x] Realtime özelliğini aktifleştir

#### 2. Temel UI Bileşenleri
- [x] Layout component'i oluştur
- [x] Header component'i
- [x] Metro hatları listesi component'i
- [x] Chat odası component'i
- [x] Mesaj gönderme formu
- [x] Mesaj listesi component'i
- [x] Loading states
- [x] Error handling

#### 3. Ana Sayfalar
- [x] Ana sayfa (hat seçimi)
- [x] Chat odası sayfası
- [x] 404 sayfası
- [x] Error sayfası

#### 4. Fonksiyonalite
- [x] Metro hatları listesini çekme
- [x] Hat seçimi ve oda girişi
- [x] Anonim mesaj gönderme
- [x] Gerçek zamanlı mesaj alma
- [x] Nickname desteği
- [x] Mesaj gönderme/alma
- [x] Loading states
- [x] Error handling
- [x] Kurallı nickname (3–20, harf/rakam/_), yasaklı liste, ban kontrolü
- [x] Pasif hatlarda mesaj engelleme (server API)
- [x] WhatsApp benzeri hizalama (benim mesajım sağda)
- [x] Otomatik scroll (son mesaja in)
 - [x] Küfür filtresi (içerik bazlı)
 - [x] Mesaj raporlama sistemi
- [x] Responsive tasarım
- [x] Enter ile gönder / Shift+Enter yeni satır
- [x] Optimistic UI

#### 5. PWA Özellikleri
 - [x] manifest.json oluştur
 - [x] Service worker kurulumu (offline cache + offline.html)
 - [x] "Ana ekrana ekle" özelliği (custom prompt)
 - [x] Offline çalışma desteği

#### 6. Test ve Optimizasyon
 - [x] Temel testler yaz (Jest)
 - [x] E2E testler (Playwright)
 - [x] Performance optimizasyonu (lazy/sizes/decoding, dynamic import)
 - [x] SEO optimizasyonu (preconnect, theme-color)
 - [x] Accessibility kontrolü (modal buton aria-label)

## 🎯 v0.2 - Temel Özellikler

### 📊 Kalabalık Seviyesi Sistemi
- [ ] Kalabalık seviyesi anketi UI
- [ ] Anket sonuçlarını gösterme
- [ ] Gerçek zamanlı güncelleme
- [ ] Grafik gösterimi

### 🎨 Paylaşılabilir Kart Sistemi
- [ ] Mesaj kartı tasarımı
- [ ] Sosyal medya paylaşım butonları
- [ ] WhatsApp/Telegram paylaşım
- [ ] Kart önizleme

### ❓ Günlük Soru Özelliği
- [ ] Günlük soru sistemi
- [ ] Cevap toplama
- [ ] Sonuçları gösterme
- [ ] Soru arşivi

### 🏆 Kullanıcı Rozetleri
- [ ] Rozet sistemi tasarımı
- [ ] Aktivite bazlı rozetler
- [ ] Rozet gösterimi
- [ ] Leaderboard

### 🔍 Mesaj Arama
- [ ] Arama input'u
- [ ] Gerçek zamanlı arama
- [ ] Arama sonuçları
- [ ] Filtreleme seçenekleri

## 🚀 v0.3 - Gelişmiş Özellikler

### 📍 İstasyon Bazlı Mikro Odalar
- [x] İstasyon seçimi
- [x] Mikro oda sistemi
- [x] İstasyon bazlı mesajlar
- [x] Geçiş yapma
- [x] StationSelector bileşeni
- [x] Chat store güncellemeleri
- [x] Metro veri yapısı genişletme
- [x] Mesaj görünümü iyileştirmeleri

### 📷 Fotoğraf Paylaşımı
- [x] Fotoğraf yükleme
- [x] Görüntü optimizasyonu
- [x] Fotoğraf galerisi
- [x] Güvenlik kontrolleri
- [x] Supabase Storage entegrasyonu
- [x] Presence (yazıyor… ve çevrimiçi sayaç)

### 💬 Direkt Mesajlaşma
 - [x] Kullanıcı profilleri
 - [x] DM sistemi (inbox, thread, realtime)
- [ ] Bildirim sistemi
- [ ] Gizlilik ayarları

### 🛡️ Gelişmiş Moderasyon
- [x] Admin paneli
- [x] Mesaj onaylama
- [x] Kullanıcı banlama
- [x] Moderasyon logları
- [x] Admin giriş sistemi
- [x] Mesaj silme
- [x] Kullanıcı engelleme
- [x] İstatistikler dashboard'u
- [x] Global mesaj temizleme (tüm odalar)
- [x] Mesaj raporlama
- [x] Kullanıcının kendi mesajını silmesi
- [x] Soft delete / restore
- [x] Rapor nedenleri seçenekli
- [x] **Rapor Workflow Sistemi**: Durum takibi (yeni/incele/kapandı)
- [x] **Admin Notları**: Raporlara admin notları ekleme
- [x] **Atama Sistemi**: Raporları admin'lere atama
- [x] **Durum Filtreleme**: Raporları durumlarına göre filtreleme
- [x] **Admin API Authentication**: Server-side Basic Authentication tüm admin API'leri için
- [x] **API Security**: Client-side localStorage bağımlılığı kaldırıldı

### 📢 Cross-Line Announcements
- [x] **Sistem Duyuruları**: Hatlar arası duyuru sistemi
- [x] **Duyuru Türleri**: info, warning, error, shutdown, maintenance
- [x] **Öncelik Sistemi**: 1-5 arası öncelik seviyeleri
- [x] **Zaman Yönetimi**: Başlangıç ve bitiş tarihleri
- [x] **Admin Yönetimi**: Duyuru oluşturma, düzenleme, silme
- [x] **Kullanıcı Görünümü**: Aktif duyuruları gösterme
- [x] **Responsive Tasarım**: Mobil ve desktop uyumlu

### 📈 Analytics Dashboard
## 🔎 SEO & PWA
- [x] robots.txt & sitemap.xml
- [x] manifest.json & service worker (offline cache)
- [x] Dinamik metadata (hat sayfaları)
- [x] Kullanıcı metrikleri
- [x] Mesaj istatistikleri
- [x] Popüler saatler
- [x] Hat bazlı analizler

## 📱 v1.0 - Mobil Uygulama

### 📱 Flutter Uygulaması
- [ ] Flutter projesi kurulumu
- [ ] UI/UX tasarımı
- [ ] API entegrasyonu
- [ ] State management

### 🔔 Push Bildirimleri
- [ ] Firebase Cloud Messaging
- [ ] Bildirim ayarları
- [ ] Özelleştirilmiş bildirimler
- [ ] Bildirim geçmişi

### 📍 Konum Bazlı Tespit
- [ ] GPS entegrasyonu
- [ ] Metro hat tespiti
- [ ] Otomatik oda girişi
- [ ] Konum izinleri

### 💾 Offline Desteği
- [ ] Offline mesaj saklama
- [ ] Senkronizasyon
- [ ] Offline mod göstergesi
- [ ] Veri yönetimi

## 🎨 UI/UX İyileştirmeleri

### 🎨 Tasarım Sistemi
- [ ] Design tokens
- [ ] Component library
- [ ] Icon set
- [ ] Typography scale

### 🌙 Dark Mode
- [ ] Dark mode toggle
- [ ] Tema değişimi
- [ ] Sistem teması desteği
- [ ] Renk paleti

### ♿ Accessibility
- [ ] Screen reader desteği
- [ ] Keyboard navigation
- [ ] High contrast mode
- [ ] Font size ayarları

## 🔧 Teknik İyileştirmeler

### ⚡ Performance
- [ ] Code splitting
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Bundle size optimizasyonu

### 🔒 Güvenlik
- [ ] Rate limiting
- [ ] Input validation
- [ ] XSS koruması
- [ ] CSRF koruması

### 🧪 Testing
- [ ] Unit testler
- [ ] Integration testler
- [ ] E2E testler
- [ ] Performance testleri

## 📊 Analytics ve Monitoring

### 📈 Kullanıcı Metrikleri
- [ ] Google Analytics entegrasyonu
- [ ] Custom event tracking
- [ ] User journey analizi
- [ ] Conversion tracking

### 🔍 Error Monitoring
- [ ] Sentry entegrasyonu
- [ ] Error logging
- [ ] Performance monitoring
- [ ] Uptime monitoring

## 🚀 Deployment ve DevOps

### 🌐 Production Deployment
- [ ] Vercel deployment
- [ ] Environment variables
- [ ] Domain ayarları
- [ ] SSL sertifikası

### 🔄 CI/CD Pipeline
- [ ] GitHub Actions
- [ ] Automated testing
- [ ] Automated deployment
- [ ] Rollback stratejisi

## 📱 Marketing ve Yayılım

### 📱 Sosyal Medya
- [ ] Twitter/X hesabı
- [ ] Instagram hesabı
- [ ] LinkedIn sayfası
- [ ] YouTube kanalı

### 📝 Content Marketing
- [ ] Blog yazıları
- [ ] Teknik makaleler
- [ ] Kullanıcı hikayeleri
- [ ] Case study'ler

### 🤝 Community Building
- [ ] Discord sunucusu
- [ ] Telegram grubu
- [ ] Reddit community
- [ ] Meetup organizasyonu

## 📋 Günlük Görevler

### Bugün (İlk Gün)
- [x] Next.js projesi oluştur
- [x] Supabase hesabı aç
- [x] Environment değişkenlerini ayarla
- [x] Supabase client konfigürasyonu oluştur
- [x] İlk component'i yaz
- [x] Gerçek zamanlı chat fonksiyonalitesi
- [x] Veritabanı şeması oluşturuldu
- [x] Metro hatları verisi eklendi
- [x] RLS politikaları ayarlandı
- [x] Chat room'lar oluşturuldu
- [x] Foreign key constraint sorunu çözüldü
- [x] Nickname sorunu düzeltildi
- [x] UUID formatı düzeltildi
- [x] Next.js 15 uyumluluğu sağlandı
- [x] Fotoğraf paylaşımı eklendi
- [x] Admin paneli oluşturuldu
- [x] Kullanıcı engelleme sistemi
- [x] Mesaj silme özelliği
- [x] İstatistikler dashboard'u
- [x] Supabase Storage bucket kurulumu
- [x] **Cross-Line Announcements sistemi tamamlandı**
- [x] **Rapor Workflow sistemi tamamlandı**
- [x] **Admin API Authentication düzeltildi**: 401 Unauthorized hatası çözüldü
- [x] **Server-side filtering eklendi**: Pasif duyurular artık görünmüyor

### Bu Hafta
- [ ] MVP'nin %50'sini tamamla
- [ ] Temel UI bileşenlerini oluştur
- [ ] Supabase entegrasyonunu yap
- [ ] İlk test sürümünü hazırla

### Bu Ay
- [ ] MVP'yi tamamla
- [ ] İlk kullanıcı testlerini yap
- [ ] Feedback topla
- [ ] v0.2 planlamasını yap

## 🎯 Yeni Eklenen Özellikler (v0.3.1)

### 📢 Cross-Line Announcements
- [x] **Veritabanı Şeması**: `cross_line_announcements` tablosu
- [x] **Admin API'leri**: CRUD işlemleri
- [x] **Admin Paneli**: Duyuru yönetimi
- [x] **Kullanıcı Görünümü**: Aktif duyuruları gösterme
- [x] **Duyuru Türleri**: info, warning, error, shutdown, maintenance
- [x] **Öncelik Sistemi**: 1-5 arası öncelik seviyeleri
- [x] **Zaman Yönetimi**: Başlangıç ve bitiş tarihleri
- [x] **Server-Side Filtering**: Pasif duyurular otomatik gizlenir (`is_active`, `starts_at`, `expires_at`)

### 🛡️ Rapor Workflow Sistemi
- [x] **Durum Yönetimi**: new → reviewing → closed
- [x] **Admin Notları**: Raporlara not ekleme
- [x] **Atama Sistemi**: Admin'lere rapor atama
- [x] **Durum Filtreleme**: Duruma göre rapor listeleme
- [x] **Timestamp Takibi**: reviewed_at, closed_at, updated_at
- [x] **Cascade Delete**: Mesaj silindiğinde rapor da silinir
- [x] **Performans İndeksleri**: status, created_at, assigned_admin

### 🔧 Teknik İyileştirmeler
- [x] **Migration Script**: `migrate-reports-workflow.sql`
- [x] **TypeScript Güncellemeleri**: Report interface'i genişletildi
- [x] **API Endpoint'leri**: Yeni PATCH endpoint'i eklendi
- [x] **UI Component'leri**: ReportsList güncellendi
- [x] **Build Test**: TypeScript hataları düzeltildi
- [x] **Admin API Security**: Server-side Basic Authentication implementasyonu
- [x] **Cross-Line Announcements Filtering**: Database-level filtering for active announcements

---

**Not**: Bu TODO listesi sürekli güncellenecek ve proje ilerledikçe yeni görevler eklenecek.
