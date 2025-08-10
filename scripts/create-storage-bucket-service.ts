import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bqvxessczvcmxzpelewr.supabase.co'
// Service role key kullanın (anon key değil)
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdnhlc3NjenZjbXh6cGVsZXdyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDY1NTQ5OCwiZXhwIjoyMDcwMjMxNDk4fQ.eg9nTzvQF552LObGYhiCg1yHN3MTjkhfF9NVhATG5ME' // Buraya service role key'inizi yazın

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

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
