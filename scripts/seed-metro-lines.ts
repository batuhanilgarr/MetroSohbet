import { createClient } from '@supabase/supabase-js'
import { metroLines } from '../src/lib/metro-data'

// Environment değişkenlerini manuel olarak ayarla
const supabaseUrl = 'https://bqvxessczvcmxzpelewr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdnhlc3NjenZjbXh6cGVsZXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTU0OTgsImV4cCI6MjA3MDIzMTQ5OH0.u9C2lB2xN8vrPTWUSyK3_462U85BDd_13Km_HLERuA0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seedMetroLines() {
  console.log('Metro hatları ekleniyor...')
  
  for (const line of metroLines) {
    const { data, error } = await supabase
      .from('metro_lines')
      .insert(line)
      .select()
    
    if (error) {
      console.error(`Hata: ${line.name} eklenirken hata oluştu:`, error)
    } else {
      console.log(`✅ ${line.name} başarıyla eklendi`)
    }
  }
  
  console.log('Metro hatları ekleme işlemi tamamlandı!')
}

// Script'i çalıştır
seedMetroLines().catch(console.error)
