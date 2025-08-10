import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bqvxessczvcmxzpelewr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdnhlc3NjenZjbXh6cGVsZXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTU0OTgsImV4cCI6MjA3MDIzMTQ5OH0.u9C2lB2xN8vrPTWUSyK3_462U85BDd_13Km_HLERuA0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createStorageBucket() {
  try {
    console.log('Storage bucket oluşturuluyor...')
    
    // Storage bucket'ı oluştur
    const { data, error } = await supabase.storage.createBucket('metrosohbet-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    })

    if (error) {
      console.error('Bucket oluşturma hatası:', error)
    } else {
      console.log('✅ Storage bucket başarıyla oluşturuldu!')
      console.log('Bucket adı: metrosohbet-images')
      console.log('Public: true')
      console.log('İzin verilen dosya türleri: JPEG, PNG, GIF, WebP')
      console.log('Maksimum dosya boyutu: 5MB')
    }
  } catch (error) {
    console.error('Beklenmeyen hata:', error)
  }
}

createStorageBucket().catch(console.error)
