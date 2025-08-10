import { createClient } from '@supabase/supabase-js'

// Environment değişkenlerini manuel olarak ayarla
const supabaseUrl = 'https://bqvxessczvcmxzpelewr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdnhlc3NjenZjbXh6cGVsZXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NTU0OTgsImV4cCI6MjA3MDIzMTQ5OH0.u9C2lB2xN8vrPTWUSyK3_462U85BDd_13Km_HLERuA0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Metro hatları için room ID'leri
const roomIds = {
  'M1': '550e8400-e29b-41d4-a716-446655440001',
  'M2': '550e8400-e29b-41d4-a716-446655440002',
  'M3': '550e8400-e29b-41d4-a716-446655440003',
  'M4': '550e8400-e29b-41d4-a716-446655440004',
  'M5': '550e8400-e29b-41d4-a716-446655440005',
  'M6': '550e8400-e29b-41d4-a716-446655440006',
  'M7': '550e8400-e29b-41d4-a716-446655440007',
  'M8': '550e8400-e29b-41d4-a716-446655440008',
  'M9': '550e8400-e29b-41d4-a716-446655440009',
  'M10': '550e8400-e29b-41d4-a716-446655440010',
  'M11': '550e8400-e29b-41d4-a716-446655440011',
  'Marmaray': '550e8400-e29b-41d4-a716-446655440012'
}

async function createChatRooms() {
  console.log('Chat room\'lar oluşturuluyor...')
  
  for (const [lineName, roomId] of Object.entries(roomIds)) {
    const { data, error } = await supabase
      .from('chat_rooms')
      .upsert({
        id: roomId,
        name: `${lineName} Chat Room`,
        description: `Chat room for ${lineName} metro line`,
        is_active: true
      }, { onConflict: 'id' })
      .select()
    
    if (error) {
      console.error(`Hata: ${lineName} chat room oluşturulurken hata oluştu:`, error)
    } else {
      console.log(`✅ ${lineName} chat room başarıyla oluşturuldu`)
    }
  }
  
  console.log('Chat room oluşturma işlemi tamamlandı!')
}

// Script'i çalıştır
createChatRooms().catch(console.error)
