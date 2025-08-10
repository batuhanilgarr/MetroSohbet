import { createClient } from '@supabase/supabase-js'

// Environment değişkenlerini manuel olarak ayarla
const supabaseUrl = 'https://bqvxessczvcmxzpelewr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdnhlc3NjenZjbXh6cGVsZXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTU0OTgsImV4cCI6MjA3MDIzMTQ5OH0.u9C2lB2xN8vrPTWUSyK3_462U85BDd_13Km_HLERuA0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createM8Room() {
  console.log('M8 chat room oluşturuluyor...')
  
  const { data, error } = await supabase
    .from('chat_rooms')
    .upsert({
      id: '550e8400-e29b-41d4-a716-446655440008',
      name: 'M8 Chat Room',
      description: 'Chat room for M8 metro line',
      is_active: true
    }, { onConflict: 'id' })
    .select()
  
  if (error) {
    console.error('M8 chat room oluşturulurken hata oluştu:', error)
  } else {
    console.log('✅ M8 chat room başarıyla oluşturuldu')
  }
}

// Script'i çalıştır
createM8Room().catch(console.error)
