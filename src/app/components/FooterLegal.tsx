'use client'

import { useState } from 'react'
import { useCookies } from '@/lib/use-cookies'

type ModalKey = 'kvkk' | 'privacy' | 'terms' | 'cookies' | null

export default function FooterLegal() {
  const [open, setOpen] = useState<ModalKey>(null)
  const { consent, settings, updateConsent, clearConsent } = useCookies()

  const titleMap: Record<Exclude<ModalKey, null>, string> = {
    kvkk: 'KVKK Aydınlatma Metni',
    privacy: 'Gizlilik Politikası',
    terms: 'Kullanım Şartları',
    cookies: 'Çerez (Cookie) Politikası'
  }

  const contentMap: Record<Exclude<ModalKey, null>, React.ReactElement> = {
    kvkk: (
      <div className="space-y-4 text-sm leading-6 text-gray-700">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Veri Sorumlusu</h4>
          <p>Kişisel verilerinizin işlenmesinden sorumlu olan veri sorumlusu: MetroSohbet platformu yönetimi</p>
          <p className="mt-2 text-xs">İletişim: <span className="text-blue-600">kvkk@metrosohbet.com</span></p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">İşlenen Kişisel Veriler</h4>
          <div className="space-y-2">
            <div className="p-2 bg-gray-50 rounded border">
              <p className="text-xs"><strong>Kimlik Bilgileri:</strong> Takma ad (nickname), profil bilgileri</p>
            </div>
            <div className="p-2 bg-gray-50 rounded border">
              <p className="text-xs"><strong>İletişim Verileri:</strong> Mesaj içerikleri, sohbet geçmişi, oda bilgileri</p>
            </div>
            <div className="p-2 bg-gray-50 rounded border">
              <p className="text-xs"><strong>Teknik Veriler:</strong> IP adresi, tarayıcı bilgileri, cihaz bilgileri</p>
            </div>
            <div className="p-2 bg-gray-50 rounded border">
              <p className="text-xs"><strong>Kullanım Verileri:</strong> Giriş/çıkış zamanları, kullanım istatistikleri</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Veri İşleme Amaçları</h4>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Hizmet sunumu ve kullanıcı deneyimi iyileştirme</li>
            <li>Güvenlik ve moderasyon faaliyetleri</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Hizmet kalitesi ve performans analizi</li>
            <li>Kullanıcı desteği ve iletişim</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Hukuki Dayanak</h4>
          <div className="space-y-2">
            <div className="p-2 bg-blue-50 rounded border">
              <p className="text-xs"><strong>Hizmet Sunumu:</strong> KVKK m.5/2-c (Sözleşmenin kurulması veya ifası)</p>
            </div>
            <div className="p-2 bg-green-50 rounded border">
              <p className="text-xs"><strong>Güvenlik:</strong> KVKK m.5/2-f (Meşru menfaat)</p>
            </div>
            <div className="p-2 bg-yellow-50 rounded border">
              <p className="text-xs"><strong>Yasal Yükümlülük:</strong> KVKK m.5/2-ç (Yasal yükümlülük)</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Veri Paylaşımı</h4>
          <p>Kişisel verileriniz, aşağıdaki durumlar dışında üçüncü kişilerle paylaşılmaz:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
            <li>Hizmet sağlayıcıları (Supabase, Vercel) ile sözleşmeye dayalı paylaşım</li>
            <li>Yasal zorunluluk halinde yetkili makamlarla paylaşım</li>
            <li>Açık rızanız bulunan durumlarda paylaşım</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Veri Saklama Süreleri</h4>
          <div className="space-y-2">
            <p className="text-xs"><strong>Oturum verileri:</strong> Tarayıcı kapanana kadar</p>
            <p className="text-xs"><strong>Mesaj içerikleri:</strong> Hesap silinene kadar (maksimum 5 yıl)</p>
            <p className="text-xs"><strong>Kullanım logları:</strong> 2 yıl</p>
            <p className="text-xs"><strong>Çerez verileri:</strong> Çerez türüne göre 1 saat - 2 yıl</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">KVKK Kapsamındaki Haklarınız</h4>
          <p>KVKK m.11 uyarınca aşağıdaki haklara sahipsiniz:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <div className="p-2 bg-gray-50 rounded text-xs">✓ Verilerinize erişim</div>
            <div className="p-2 bg-gray-50 rounded text-xs">✓ Verilerinizi düzeltme</div>
            <div className="p-2 bg-gray-50 rounded text-xs">✓ Verilerinizi silme</div>
            <div className="p-2 bg-gray-50 rounded text-xs">✓ İşlemeyi kısıtlama</div>
            <div className="p-2 bg-gray-50 rounded text-xs">✓ Veri taşınabilirliği</div>
            <div className="p-2 bg-gray-50 rounded text-xs">✓ İtiraz etme</div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Hak Kullanımı</h4>
          <p>Haklarınızı kullanmak için aşağıdaki yollarla başvurabilirsiniz:</p>
          <div className="mt-2 space-y-2">
            <p className="text-xs"><strong>E-posta:</strong> kvkk@metrosohbet.com</p>
            <p className="text-xs"><strong>Başvuru süresi:</strong> En geç 30 gün içinde yanıt verilir</p>
            <p className="text-xs"><strong>Gerekli belgeler:</strong> Kimlik doğrulama bilgileri</p>
          </div>
        </div>
      </div>
    ),
    privacy: (
      <div className="space-y-4 text-sm leading-6 text-gray-700">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Gizlilik Taahhüdümüz</h4>
          <p>MetroSohbet olarak, kullanıcılarımızın gizliliğini korumayı en önemli önceliklerimizden biri olarak görüyoruz. Bu politika, kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Toplanan Veri Türleri</h4>
          <div className="space-y-2">
            <div className="p-2 bg-blue-50 rounded border">
              <p className="text-xs"><strong>Kullanıcı Tarafından Sağlanan Veriler:</strong></p>
              <ul className="list-disc list-inside mt-1 text-xs">
                <li>Takma ad (nickname)</li>
                <li>Mesaj içerikleri</li>
                <li>Profil tercihleri</li>
              </ul>
            </div>
            <div className="p-2 bg-green-50 rounded border">
              <p className="text-xs"><strong>Otomatik Olarak Toplanan Veriler:</strong></p>
              <ul className="list-disc list-inside mt-1 text-xs">
                <li>IP adresi ve konum bilgileri</li>
                <li>Tarayıcı ve cihaz bilgileri</li>
                <li>Kullanım istatistikleri ve logları</li>
                <li>Çerez verileri</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Veri Kullanım Amaçları</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 rounded text-xs">
              <strong>Hizmet Sunumu:</strong> Sohbet odaları, gerçek zamanlı iletişim
            </div>
            <div className="p-2 bg-gray-50 rounded text-xs">
              <strong>Güvenlik:</strong> Spam koruması, moderasyon, hız sınırı
            </div>
            <div className="p-2 bg-gray-50 rounded text-xs">
              <strong>Performans:</strong> Site optimizasyonu, hata tespiti
            </div>
            <div className="p-2 bg-gray-50 rounded text-xs">
              <strong>Analiz:</strong> Kullanım istatistikleri, iyileştirmeler
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Veri Koruma Önlemleri</h4>
          <div className="space-y-2">
            <div className="p-2 bg-green-50 rounded border">
              <p className="text-xs"><strong>Teknik Önlemler:</strong></p>
              <ul className="list-disc list-inside mt-1 text-xs">
                <li>SSL/TLS şifreleme</li>
                <li>Güvenli veritabanı erişimi</li>
                <li>Düzenli güvenlik güncellemeleri</li>
                <li>Firewall ve DDoS koruması</li>
              </ul>
            </div>
            <div className="p-2 bg-blue-50 rounded border">
              <p className="text-xs"><strong>Organizasyonel Önlemler:</strong></p>
              <ul className="list-disc list-inside mt-1 text-xs">
                <li>Erişim kontrolü ve yetkilendirme</li>
                <li>Personel gizlilik eğitimi</li>
                <li>Veri işleme politikaları</li>
                <li>Düzenli denetimler</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Veri Paylaşımı</h4>
          <p>Kişisel verileriniz, aşağıdaki durumlar dışında üçüncü kişilerle paylaşılmaz:</p>
          <div className="mt-2 space-y-2">
            <div className="p-2 bg-gray-50 rounded border">
              <p className="text-xs"><strong>Hizmet Sağlayıcıları:</strong> Supabase (veritabanı), Vercel (hosting)</p>
              <p className="text-xs text-gray-600">Bu paylaşımlar sözleşmeye dayalı ve veri koruma standartlarına uygun yapılır.</p>
            </div>
            <div className="p-2 bg-gray-50 rounded border">
              <p className="text-xs"><strong>Yasal Zorunluluk:</strong> Mahkeme kararı, yasal düzenleme</p>
              <p className="text-xs text-gray-600">Sadece yasal olarak zorunlu olduğunda ve minimum gerekli veri paylaşılır.</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Veri Saklama ve Silme</h4>
          <div className="space-y-2">
            <p className="text-xs"><strong>Mesaj verileri:</strong> Hesap silinene kadar saklanır</p>
            <p className="text-xs"><strong>Log verileri:</strong> 2 yıl sonra otomatik silinir</p>
            <p className="text-xs"><strong>Çerez verileri:</strong> Çerez türüne göre 1 saat - 2 yıl</p>
            <p className="text-xs"><strong>Hesap silme:</strong> Tüm veriler 30 gün içinde kalıcı olarak silinir</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Çocukların Gizliliği</h4>
          <p>MetroSohbet, 13 yaş altı kullanıcılardan bilerek kişisel veri toplamaz. 13 yaş altı kullanıcı tespit edilirse, ilgili veriler derhal silinir.</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Gizlilik Politikası Güncellemeleri</h4>
          <p>Bu politika, yasal gereklilikler veya hizmet değişiklikleri nedeniyle güncellenebilir. Önemli değişiklikler kullanıcılara bildirilecektir.</p>
          <p className="mt-2 text-xs">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">İletişim</h4>
          <p>Gizlilik politikası hakkında sorularınız için:</p>
          <div className="mt-2 space-y-1 text-xs">
            <p><strong>E-posta:</strong> privacy@metrosohbet.com</p>
            <p><strong>KVKK Başvuruları:</strong> kvkk@metrosohbet.com</p>
            <p><strong>Genel İletişim:</strong> info@metrosohbet.com</p>
          </div>
        </div>
      </div>
    ),
    terms: (
      <div className="space-y-4 text-sm leading-6 text-gray-700">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Hizmet Kullanım Koşulları</h4>
          <p>MetroSohbet platformunu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. Bu şartlara uymayan kullanıcıların erişimi kısıtlanabilir veya kalıcı olarak engellenebilir.</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Kullanım Kuralları</h4>
          <div className="space-y-2">
            <div className="p-2 bg-red-50 rounded border border-red-200">
              <p className="text-xs text-red-800"><strong>Yasaklı İçerikler:</strong></p>
              <ul className="list-disc list-inside mt-1 text-xs text-red-700">
                <li>Yasa dışı içerik ve faaliyetler</li>
                <li>Nefret söylemi ve ayrımcılık</li>
                <li>Taciz, tehdit ve saldırgan davranışlar</li>
                <li>Spam ve reklam içerikleri</li>
                <li>Telif haklı materyaller</li>
                <li>Kişisel bilgi paylaşımı</li>
              </ul>
            </div>
            <div className="p-2 bg-green-50 rounded border border-green-200">
              <p className="text-xs text-green-800"><strong>Önerilen Davranışlar:</strong></p>
              <ul className="list-disc list-inside mt-1 text-xs text-green-700">
                <li>Saygılı ve kibar iletişim</li>
                <li>Topluluk kurallarına uyum</li>
                <li>Yapıcı tartışma ve paylaşım</li>
                <li>Diğer kullanıcıların haklarına saygı</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Hesap Yönetimi</h4>
          <div className="space-y-2">
            <p className="text-xs"><strong>Hesap Oluşturma:</strong> Takma ad ile anonim hesap oluşturabilirsiniz</p>
            <p className="text-xs"><strong>Hesap Güvenliği:</strong> Hesabınızın güvenliğinden siz sorumlusunuz</p>
            <p className="text-xs"><strong>Hesap Silme:</strong> Hesabınızı istediğiniz zaman silebilirsiniz</p>
            <p className="text-xs"><strong>Çoklu Hesap:</strong> Aynı anda birden fazla hesap kullanımı yasaktır</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">İçerik Sorumluluğu</h4>
          <div className="space-y-2">
            <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-xs text-yellow-800"><strong>Kullanıcı Sorumluluğu:</strong></p>
              <ul className="list-disc list-inside mt-1 text-xs text-yellow-700">
                <li>Paylaştığınız içeriklerden siz sorumlusunuz</li>
                <li>Telif haklarına saygı göstermelisiniz</li>
                <li>Kişilik haklarını ihlal etmemelisiniz</li>
                <li>Yanıltıcı bilgi paylaşmamalısınız</li>
              </ul>
            </div>
            <div className="p-2 bg-blue-50 rounded border border-blue-200">
              <p className="text-xs text-blue-800"><strong>Platform Sorumluluğu:</strong></p>
              <ul className="list-disc list-inside mt-1 text-xs text-blue-700">
                <li>İçerik moderasyonu ve filtreleme</li>
                <li>Güvenlik önlemleri ve koruma</li>
                <li>Hizmet sürekliliği ve performans</li>
                <li>Kullanıcı desteği ve iletişim</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Hizmet Garantileri</h4>
          <div className="space-y-2">
            <div className="p-2 bg-gray-50 rounded border">
              <p className="text-xs"><strong>Hizmet &quot;Olduğu Gibi&quot; Sunulur:</strong></p>
              <ul className="list-disc list-inside mt-1 text-xs">
                <li>Kesintisiz çalışma garanti edilmez</li>
                <li>Hata ve eksiklikler olabilir</li>
                <li>Güvenlik açıkları riski mevcuttur</li>
                <li>Veri kaybı riski bulunur</li>
              </ul>
            </div>
            <div className="p-2 bg-green-50 rounded border border-green-200">
              <p className="text-xs text-green-800"><strong>Platform Taahhütleri:</strong></p>
              <ul className="list-disc list-inside mt-1 text-xs text-green-700">
                <li>Maksimum hizmet sürekliliği</li>
                <li>Düzenli güvenlik güncellemeleri</li>
                <li>Veri yedekleme ve koruma</li>
                <li>7/24 teknik destek</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Yasal Uyumluluk</h4>
          <div className="space-y-2">
            <p className="text-xs"><strong>Türk Hukuku:</strong> Bu platform Türk mevzuatına uygun olarak işletilir</p>
            <p className="text-xs"><strong>Uluslararası Hukuk:</strong> GDPR ve diğer uluslararası standartlara uyum</p>
            <p className="text-xs"><strong>Yasal İşbirliği:</strong> Gerektiğinde yetkili makamlarla işbirliği</p>
            <p className="text-xs"><strong>Uyuşmazlık Çözümü:</strong> Türk mahkemeleri yetkili</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">İhlal ve Yaptırımlar</h4>
          <div className="space-y-2">
            <div className="p-2 bg-red-50 rounded border border-red-200">
              <p className="text-xs text-red-800"><strong>Uyarı Sistemi:</strong></p>
              <ul className="list-disc list-inside mt-1 text-xs text-red-700">
                <li>1. İhlal: Uyarı</li>
                <li>2. İhlal: Geçici erişim kısıtlaması (1-7 gün)</li>
                <li>3. İhlal: Uzun süreli erişim kısıtlaması (1-30 gün)</li>
                <li>4. İhlal: Kalıcı hesap engelleme</li>
              </ul>
            </div>
            <p className="text-xs">Ciddi ihlallerde doğrudan kalıcı engelleme uygulanabilir.</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Değişiklikler ve Güncellemeler</h4>
          <p>Bu kullanım şartları, yasal gereklilikler veya hizmet değişiklikleri nedeniyle güncellenebilir. Önemli değişiklikler kullanıcılara bildirilecektir.</p>
          <p className="mt-2 text-xs">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">İletişim ve Destek</h4>
          <p>Kullanım şartları hakkında sorularınız için:</p>
          <div className="mt-2 space-y-1 text-xs">
            <p><strong>Genel İletişim:</strong> info@metrosohbet.com</p>
            <p><strong>Teknik Destek:</strong> support@metrosohbet.com</p>
            <p><strong>Yasal İşler:</strong> legal@metrosohbet.com</p>
          </div>
        </div>
      </div>
    ),
    cookies: (
      <div className="space-y-4 text-sm leading-6 text-gray-700">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Çerez Nedir?</h4>
          <p>Çerezler, web sitesi tarafından tarayıcınıza gönderilen ve cihazınızda saklanan küçük metin dosyalarıdır. Bu dosyalar, web sitesinin sizi tanımasını ve deneyiminizi iyileştirmesini sağlar.</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Çerez Türleri ve Kullanım Amaçları</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Çerez Adı</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Amaç</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Süre</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Zorunlu</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b">Yasal Dayanak</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-3 py-2 text-xs text-gray-900">session_id</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Kullanıcı oturumunu takip etme, güvenlik</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Tarayıcı kapanana kadar</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Evet</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Hizmet sunumu</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-xs text-gray-900">csrf_token</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Güvenlik token&apos;ı, CSRF koruması</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Tarayıcı kapanana kadar</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Evet</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Güvenlik</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-xs text-gray-900">user_preferences</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Kullanıcı tercihlerini saklama</td>
                  <td className="px-3 py-2 text-xs text-gray-700">1 yıl</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Hayır</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Rıza</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-xs text-gray-900">theme_preference</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Tema tercihi (açık/koyu)</td>
                  <td className="px-3 py-2 text-xs text-gray-700">1 yıl</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Hayır</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Rıza</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-xs text-gray-900">language</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Dil tercihi</td>
                  <td className="px-3 py-2 text-xs text-gray-700">1 yıl</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Hayır</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Rıza</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-xs text-gray-900">analytics_id</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Site kullanım analizi, performans</td>
                  <td className="px-3 py-2 text-xs text-gray-700">2 yıl</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Hayır</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Rıza</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-xs text-gray-900">rate_limit</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Hız sınırı takibi</td>
                  <td className="px-3 py-2 text-xs text-gray-700">1 saat</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Evet</td>
                  <td className="px-3 py-2 text-xs text-gray-700">Güvenlik</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Çerez Kategorileri</h4>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h5 className="font-medium text-blue-900 mb-1">Zorunlu Çerezler</h5>
              <p className="text-blue-800 text-xs">Bu çerezler web sitesinin temel işlevlerini yerine getirmek için gereklidir ve devre dışı bırakılamaz. Güvenlik, oturum yönetimi ve temel işlevsellik için kullanılır.</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <h5 className="font-medium text-green-900 mb-1">İşlevsel Çerezler</h5>
              <p className="text-green-800 text-xs">Bu çerezler kullanıcı deneyimini iyileştirmek için kullanılır. Dil tercihi, tema seçimi gibi ayarları hatırlar.</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <h5 className="font-medium text-yellow-900 mb-1">Analitik Çerezler</h5>
              <p className="text-yellow-800 text-xs">Site performansını ve kullanım istatistiklerini anlamak için kullanılır. Kullanıcı davranışlarını takip eder.</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Çerez Yönetimi</h4>
          <p>Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Ancak bu durumda bazı özellikler düzgün çalışmayabilir.</p>
          <div className="mt-3 space-y-2">
            <p className="text-xs"><strong>Chrome:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler ve diğer site verileri</p>
            <p className="text-xs"><strong>Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler ve site verileri</p>
            <p className="text-xs"><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler ve site verileri</p>
            <p className="text-xs"><strong>Edge:</strong> Ayarlar → Çerezler ve site izinleri</p>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Üçüncü Taraf Çerezler</h4>
          <p>MetroSohbet, hizmet kalitesini artırmak için aşağıdaki üçüncü taraf hizmetleri kullanabilir:</p>
          <div className="mt-3 space-y-2">
            <div className="p-2 bg-gray-50 rounded border">
              <p className="text-xs"><strong>Supabase:</strong> Veritabanı, kimlik doğrulama ve gerçek zamanlı iletişim hizmetleri</p>
              <p className="text-xs text-gray-600">Çerez kullanımı: Oturum yönetimi ve güvenlik</p>
            </div>
            <div className="p-2 bg-gray-50 rounded border">
              <p className="text-xs"><strong>Vercel:</strong> Hosting, CDN ve performans optimizasyonu</p>
              <p className="text-xs text-gray-600">Çerez kullanımı: Yük dengeleme ve önbellekleme</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Yasal Haklarınız</h4>
          <p>KVKK ve GDPR kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
            <li>Çerez kullanımına rıza verme veya reddetme</li>
            <li>Çerez ayarlarını değiştirme</li>
            <li>Çerezleri silme veya engelleme</li>
            <li>Veri işleme hakkında bilgi alma</li>
            <li>Veri taşınabilirliği talep etme</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Çerez Ayarlarınız</h4>
          <div className="space-y-3 mb-4">
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Mevcut Ayarlarınız:</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {consent === 'all' ? 'Tümü Kabul Edildi' : 
                   consent === 'necessary' ? 'Sadece Gerekli' : 
                   consent === 'custom' ? 'Özel Ayarlar' : 'Henüz Belirlenmedi'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between">
                  <span>Analitik Çerezler:</span>
                  <span className={settings.analytics ? 'text-green-600' : 'text-red-600'}>
                    {settings.analytics ? '✓ Aktif' : '✗ Pasif'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>İşlevsel Çerezler:</span>
                  <span className={settings.functional ? 'text-green-600' : 'text-red-600'}>
                    {settings.functional ? '✓ Aktif' : '✗ Pasif'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => updateConsent('all', { analytics: true, functional: true })}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Tümünü Aktif Et
              </button>
              <button
                onClick={() => updateConsent('necessary', { analytics: false, functional: false })}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Sadece Gerekli
              </button>
              <button
                onClick={clearConsent}
                className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Ayarları Sıfırla
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Güncellemeler ve İletişim</h4>
          <p>Bu çerez politikası, yasal gereklilikler veya hizmet değişiklikleri nedeniyle güncellenebilir. Önemli değişiklikler kullanıcılara bildirilecektir.</p>
          <p className="mt-2 text-xs">Çerez politikası hakkında sorularınız için: <span className="text-blue-600">privacy@metrosohbet.com</span></p>
        </div>
      </div>
    )
  }

  function Modal({ kind }: { kind: Exclude<ModalKey, null> }) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-6 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        onClick={() => setOpen(null)}
      >
        <div
          className="w-full sm:max-w-4xl bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-5 py-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
              {kind === 'cookies' && '🍪'}
              {kind === 'kvkk' && '📋'}
              {kind === 'privacy' && '🔒'}
              {kind === 'terms' && '📜'}
              {titleMap[kind]}
            </h3>
            <button
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
              aria-label="Kapat"
              onClick={() => setOpen(null)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-5 py-4 flex-1 overflow-y-auto">
            {contentMap[kind]}
          </div>
          <div className="px-5 py-3 border-t flex justify-end bg-gray-50">
            <button
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              onClick={() => setOpen(null)}
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <footer className="mt-16 border-t text-xs text-gray-500">
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between">
        <p>© {new Date().getFullYear()} MetroSohbet</p>
        <div className="flex items-center space-x-4">
          <button onClick={() => setOpen('kvkk')} className="hover:text-gray-700 underline-offset-2 hover:underline transition-colors">KVKK Aydınlatma Metni</button>
          <button onClick={() => setOpen('privacy')} className="hover:text-gray-700 underline-offset-2 hover:underline transition-colors">Gizlilik Politikası</button>
          <button onClick={() => setOpen('terms')} className="hover:text-gray-700 underline-offset-2 hover:underline transition-colors">Kullanım Şartları</button>
          <button onClick={() => setOpen('cookies')} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors font-medium">🍪 Çerez Politikası</button>
        </div>
      </div>
      {open && <Modal kind={open} />}
    </footer>
  )
}


