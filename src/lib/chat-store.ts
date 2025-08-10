import { create } from 'zustand'
import { supabase } from './supabase'
import type { Message } from './supabase'

interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  nickname: string
  currentRoom: string | null
  currentLine: string | null
  currentStation: string | null
  typingNicknames: string[]
  onlineUsersCount: number
  onlineSessionsCount?: number
  onlineNicknames?: string[]
  presenceChannel?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  myNickname?: string
  
  // Actions
  setNickname: (nickname: string) => void
  setCurrentRoom: (roomId: string) => void
  setCurrentLine: (lineName: string) => void
  setCurrentStation: (stationName: string | null) => void
  sendMessage: (content: string) => Promise<void>
  loadMessages: (roomId: string) => Promise<void>
  subscribeToMessages: (roomId: string) => void
  unsubscribeFromMessages: () => void
  initPresence: (roomId: string, nickname: string) => void
  setTyping: (isTyping: boolean) => void
}

// UUID oluşturma fonksiyonu - Hat + İstasyon kombinasyonu için
function generateRoomId(lineName: string, stationName?: string): string {
  if (!stationName) {
    // Sadece hat için oda ID'si
    const roomIds: { [key: string]: string } = {
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
    
    return roomIds[lineName] || '550e8400-e29b-41d4-a716-446655440000'
  } else {
    // Hat + İstasyon kombinasyonu için oda ID'si
    const baseId = generateRoomId(lineName)
    const stationHash = stationName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return `${baseId}-${stationHash.toString(16).padStart(8, '0')}`
  }
}

function getLineNameForRoomId(roomId: string): string {
  const mapping: { [key: string]: string } = {
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
  for (const [name, id] of Object.entries(mapping)) {
    if (id === roomId) return name
  }
  return ''
}

// Basit yasaklı ifade listesi (örnek)
const PROHIBITED_NICK_PARTS = [
  'admin', 'moderator', 'mod', 'support', 'official',
  'root', 'owner', 'sys', 'system', 'staff',
  'küfür', 'salak', 'aptal', 'orospu', 'amk', 'siktir', 'piç'
]

function isNicknameFormatValid(nickname: string): boolean {
  return /^[A-Za-z0-9_]{3,20}$/.test(nickname)
}

function isNicknameInBlocklist(nickname: string): boolean {
  const n = nickname.toLowerCase()
  return PROHIBITED_NICK_PARTS.some((bad) => n.includes(bad))
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  nickname: '',
  currentRoom: null,
  currentLine: null,
  currentStation: null,
  typingNicknames: [],
  onlineUsersCount: 0,

  setNickname: (nickname: string) => {
    set({ nickname })
  },

  setCurrentRoom: (roomId: string) => {
    set({ currentRoom: roomId })
  },

  setCurrentLine: (lineName: string) => {
    set({ currentLine: lineName })
  },

  setCurrentStation: (stationName: string | null) => {
    set({ currentStation: stationName })
  },

  sendMessage: async (content: string) => {
    const { currentRoom, nickname } = get()
    
    if (!currentRoom) {
      set({ error: 'Oda seçilmedi' })
      return
    }

    if (!content.trim()) {
      set({ error: 'Mesaj boş olamaz' })
      return
    }

    const trimmedNickname = (nickname || '').trim()
    if (!isNicknameFormatValid(trimmedNickname)) {
      set({ error: 'Geçersiz nickname. 3-20 karakter, sadece harf/rakam/alt çizgi.' })
      return
    }
    if (isNicknameInBlocklist(trimmedNickname)) {
      set({ error: 'Bu nickname uygun değil, lütfen başka bir tane seçin.' })
      return
    }

    set({ isLoading: true, error: null })

    try {
      // Yasaklı kullanıcı kontrolü
      const { data: banned, error: bannedErr } = await supabase
        .from('banned_users')
        .select('id')
        .eq('nickname', trimmedNickname)
        .limit(1)

      if (bannedErr) {
        console.error('Banned check error:', bannedErr)
      }
      if (banned && banned.length > 0) {
        set({ isLoading: false, error: 'Bu kullanıcı adı engellenmiş.' })
        return
      }

      // Nickname benzersizlik kontrolü kaldırıldı: Kullanıcı aynı nickname ile devam edebilir

      // Önce chat room'u oluştur (eğer yoksa)
      const { data: roomData, error: roomError } = await supabase
        .from('chat_rooms')
        .upsert({
          id: currentRoom,
          name: `Metro Chat Room`,
          description: `Chat room for metro line`,
          is_active: true
        }, { onConflict: 'id' })
        .select()

      if (roomError) {
        console.error('Room creation error:', roomError)
        // Room oluşturma hatası olsa bile mesaj göndermeyi dene
      }

      // Optimistic UI: geçici mesaj ekle
      const tempId = `temp-${Date.now()}`
      const tempMsg: Message = {
        id: tempId,
        room_id: currentRoom,
        nickname: trimmedNickname,
        content: content.trim(),
        message_type: 'chat',
        is_anonymous: false,
        created_at: new Date().toISOString()
      } as Message
      set((state) => ({ messages: [...state.messages, tempMsg] }))

      // Mesajı server API üzerinden gönder (aktif hat/banned kontrolü server'da)
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ line: getLineNameForRoomId(currentRoom), roomId: currentRoom, nickname: trimmedNickname, content: content.trim() })
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: 'Mesaj gönderilemedi' }))
        // Optimistic mesajı geri al
        set((state) => ({ messages: state.messages.filter((m) => m.id !== tempId) }))
        set({ error: json.error || 'Mesaj gönderilemedi' })
      } else {
        set({ error: null })
      }

      // success state handled above; realtime will deliver the message
    } catch (error) {
      console.error('Send message error:', error)
      set({ error: 'Mesaj gönderilemedi' })
    } finally {
      set({ isLoading: false })
    }
  },

  loadMessages: async (roomId: string) => {
    set({ isLoading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100)

      if (error) {
        console.error('Load messages error:', error)
        set({ error: error.message })
      } else {
        set({ messages: data || [], error: null })
      }
    } catch (error) {
      console.error('Load messages error:', error)
      set({ error: 'Mesajlar yüklenemedi' })
    } finally {
      set({ isLoading: false })
    }
  },

  subscribeToMessages: (roomId: string) => {
    const subscription = supabase
      .channel(`messages:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const newMessage = payload.new as Message
          set((state) => {
            const withoutTemps = state.messages.filter(
              (m) => !(m.id.startsWith('temp') && m.nickname === newMessage.nickname && m.content === newMessage.content)
            )
            return { messages: [...withoutTemps, newMessage] }
          })
        }
      )
      .subscribe()

    // Store subscription reference for cleanup
    set({ currentRoom: roomId })
  },

  unsubscribeFromMessages: () => {
    const { currentRoom } = get()
    if (currentRoom) {
      supabase.channel(`messages:${currentRoom}`).unsubscribe()
      set({ currentRoom: null })
    }
  },

  initPresence: (roomId: string, nickname: string) => {
    // Presence channel
    const key = (nickname || 'Anonim').trim()
    const ch = supabase.channel(`presence:${roomId}`, { config: { presence: { key } } })
    ch.on('presence', { event: 'sync' }, () => {
      const state = ch.presenceState() as Record<string, Array<{ typing?: boolean }>>
      const uniqueUsers = Object.keys(state).filter((u) => u)
      const sessions = uniqueUsers.reduce((sum, u) => sum + ((state[u] && state[u].length) || 0), 0)
      const typing = uniqueUsers.filter((u) => (state[u] || []).some((m) => m.typing))
      set({ onlineUsersCount: uniqueUsers.length, onlineSessionsCount: sessions, onlineNicknames: uniqueUsers, typingNicknames: typing, myNickname: key })
    })
    ch.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await ch.track({ typing: false })
      }
    })
    set({ presenceChannel: ch })
  },

  setTyping: (isTyping: boolean) => {
    const ch = get().presenceChannel
    if (ch) {
      ch.track({ typing: isTyping })
    }
  }
}))

// Metro hattı için room ID oluşturma fonksiyonu
export function getRoomIdForLine(lineName: string): string {
  return generateRoomId(lineName)
}

// Metro hattı + İstasyon için room ID oluşturma fonksiyonu
export function getRoomIdForLineAndStation(lineName: string, stationName: string): string {
  return generateRoomId(lineName, stationName)
}

// Room ID'den hat ve istasyon bilgisini çıkarma
export async function getLineAndStationFromRoomId(roomId: string): Promise<{ lineName: string; stationName: string | null }> {
  // Önce sadece hat için kontrol et
  const lineMapping: { [key: string]: string } = {
    '550e8400-e29b-41d4-a716-446655440001': 'M1',
    '550e8400-e29b-41d4-a716-446655440002': 'M2',
    '550e8400-e29b-41d4-a716-446655440003': 'M3',
    '550e8400-e29b-41d4-a716-446655440004': 'M4',
    '550e8400-e29b-41d4-a716-446655440005': 'M5',
    '550e8400-e29b-41d4-a716-446655440006': 'M6',
    '550e8400-e29b-41d4-a716-446655440007': 'M7',
    '550e8400-e29b-41d4-a716-446655440008': 'M8',
    '550e8400-e29b-41d4-a716-446655440009': 'M9',
    '550e8400-e29b-41d4-a716-446655440010': 'M10',
    '550e8400-e29b-41d4-a716-446655440011': 'M11',
    '550e8400-e29b-41d4-a716-446655440012': 'Marmaray'
  }

  // Eğer istasyon bazlı oda ise (hash ile)
  if (roomId.includes('-')) {
    const [baseId, stationHash] = roomId.split('-')
    const lineName = lineMapping[baseId]
    if (lineName) {
      try {
        // Station hash'ten istasyon adını bulmak için metro-data'dan istasyonları kontrol et
        const { metroLines } = await import('./metro-data')
        const line = metroLines.find((l: { name: string; stations: string[] }) => l.name === lineName)
        if (line) {
          // Hash'i hesaplayarak istasyonu bul
          for (const station of line.stations) {
            const hash = station.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0)
            if (hash.toString(16).padStart(8, '0') === stationHash) {
              return { lineName, stationName: station }
            }
          }
        }
      } catch (error) {
        console.error('Error loading metro data:', error)
      }
    }
  }

  // Sadece hat için oda
  const lineName = lineMapping[roomId]
  return { lineName: lineName || '', stationName: null }
}
