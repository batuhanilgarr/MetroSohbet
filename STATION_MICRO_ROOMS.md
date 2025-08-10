# 🚇 İstasyon Bazlı Mikro Odalar

Bu özellik, MetroSohbet uygulamasında kullanıcıların belirli metro istasyonlarında bulunan diğer kullanıcılarla sohbet etmesini sağlar.

## ✨ Özellikler

### 1. 🎯 İstasyon Seçimi
- Kullanıcılar hangi metro hattında olduklarını seçebilir
- Her hat için o hattın tüm istasyonları listelenir
- İstasyon seçimi opsiyoneldir (sadece hat bazlı sohbet de mümkün)

### 2. 🏠 Mikro Oda Sistemi
- Her istasyon için ayrı sohbet odaları
- İstasyon bazlı mesajlar otomatik olarak filtrelenir
- Kullanıcılar istasyonlar arası kolayca geçiş yapabilir

### 3. 📍 İstasyon Bazlı Mesajlar
- İstasyon seçildiğinde mesajlar otomatik olarak etiketlenir
- Mesaj formatı: `📍 [İstasyon Adı] Mesaj içeriği`
- İstasyon bilgisi mesajda ayrı olarak gösterilir

### 4. 🔄 Geçiş Yapma
- Hat değiştirme: Farklı metro hattına geçiş
- İstasyon değiştirme: Aynı hat içinde farklı istasyona geçiş
- İstasyon kaldırma: Genel hat sohbetine dönüş

## 🏗️ Teknik Detaylar

### Oda ID Sistemi
```typescript
// Hat bazlı oda
getRoomIdForLine('M1') // 550e8400-e29b-41d4-a716-446655440001

// İstasyon bazlı oda
getRoomIdForLineAndStation('M1', 'Yenikapı') // 550e8400-e29b-41d4-a716-446655440001-12345678
```

### Veri Yapısı
```typescript
interface MetroLine {
  name: string
  display_name: string
  color: string
  is_active: boolean
  stations: string[] // Yeni eklenen alan
}
```

### Store Güncellemeleri
```typescript
interface ChatState {
  // ... mevcut alanlar
  currentLine: string | null
  currentStation: string | null
  
  // ... mevcut actions
  setCurrentLine: (lineName: string) => void
  setCurrentStation: (stationName: string | null) => void
}
```

## 🎨 Kullanıcı Arayüzü

### StationSelector Bileşeni
- Hat seçici dropdown
- İstasyon seçici dropdown
- Mevcut seçim bilgisi
- İstasyon kaldırma butonu

### Mesaj Görünümü
- İstasyon bilgisi mesaj üstünde ayrı gösterilir
- İstasyon etiketi mesaj içeriğinden ayrılır
- Görsel olarak ayırt edilebilir tasarım

## 📱 Kullanım Senaryoları

### Senaryo 1: Genel Hat Sohbeti
1. Kullanıcı M1 hattına girer
2. İstasyon seçmez
3. M1 hattındaki tüm kullanıcılarla sohbet eder

### Senaryo 2: İstasyon Bazlı Sohbet
1. Kullanıcı M1 hattına girer
2. "Yenikapı" istasyonunu seçer
3. Sadece Yenikapı istasyonundaki kullanıcılarla sohbet eder

### Senaryo 3: İstasyon Değiştirme
1. Kullanıcı "Yenikapı" istasyonunda sohbet ediyor
2. "Aksaray" istasyonunu seçer
3. Aksaray istasyonundaki kullanıcılarla sohbet etmeye başlar

## 🔧 Kurulum ve Gereksinimler

### Gerekli Dosyalar
- `src/lib/metro-data.ts` - Metro hatları ve istasyonları
- `src/lib/chat-store.ts` - Chat store güncellemeleri
- `src/app/chat/[line]/StationSelector.tsx` - İstasyon seçici bileşeni
- `src/app/chat/[line]/page.tsx` - Chat sayfası güncellemeleri

### Bağımlılıklar
- Zustand (state management)
- Supabase (realtime database)
- Next.js (React framework)

## 🚀 Gelecek Geliştirmeler

### Planlanan Özellikler
- [ ] İstasyon bazlı kullanıcı sayısı gösterimi
- [ ] Popüler istasyonlar listesi
- [ ] İstasyon bazlı moderasyon araçları
- [ ] İstasyon bazlı bildirimler
- [ ] İstasyon bazlı istatistikler

### Teknik İyileştirmeler
- [ ] İstasyon bazlı cache sistemi
- [ ] Offline istasyon verisi
- [ ] İstasyon bazlı rate limiting
- [ ] İstasyon bazlı arama

## 📊 Performans

### Optimizasyonlar
- İstasyon verileri client-side cache'lenir
- Oda değişimlerinde minimal re-render
- Lazy loading ile bileşen yükleme
- Debounced istasyon değişimi

### Monitoring
- İstasyon bazlı kullanıcı sayısı
- Oda değişim sıklığı
- İstasyon popülerliği
- Sistem performans metrikleri

## 🐛 Bilinen Sorunlar

### Mevcut Limitler
- İstasyon değişimi sırasında geçici mesaj kaybı
- Çok sık istasyon değişimi performans etkisi
- Mobil cihazlarda dropdown boyut sorunları

### Çözüm Önerileri
- Mesaj cache sistemi
- Rate limiting istasyon değişimi
- Responsive dropdown tasarımı

## 📝 Test Senaryoları

### Unit Tests
- [ ] İstasyon veri yapısı
- [ ] Oda ID oluşturma
- [ ] Store güncellemeleri

### Integration Tests
- [ ] İstasyon seçimi
- [ ] Oda değişimi
- [ ] Mesaj filtreleme

### E2E Tests
- [ ] Tam istasyon seçim akışı
- [ ] Hat değiştirme
- [ ] İstasyon bazlı sohbet

## 🤝 Katkıda Bulunma

Bu özelliği geliştirmek için:

1. Issue açın
2. Feature branch oluşturun
3. Kod yazın ve test edin
4. Pull request gönderin

## 📞 Destek

Sorularınız için:
- GitHub Issues
- Discord kanalı
- Email: support@metrosohbet.com

---

**Not:** Bu özellik geliştirme aşamasındadır ve değişikliklere tabi olabilir.
