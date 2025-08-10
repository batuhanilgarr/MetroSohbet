import { POST } from './route'

let mockLineActive = true
let mockBannedCount = 0
let lastInserted: { line: string; roomId: string; nickname: string; content: string } | null = null

jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(() => ({
      from: (table: string) => {
        if (table === 'metro_lines') {
          return {
            select: () => ({
              eq: () => ({ maybeSingle: async () => ({ data: { is_active: mockLineActive }, error: null }) }),
            }),
          }
        }
        if (table === 'banned_users') {
          return {
            select: () => ({ eq: () => ({ limit: () => Promise.resolve({ data: new Array(mockBannedCount).fill({ id: 'b' }), error: null }) }) }),
          }
        }
        if (table === 'chat_rooms') {
          return {
            upsert: () => ({ onConflict: () => ({ select: () => ({ data: [{}], error: null }) }) }),
          }
        }
        if (table === 'messages') {
          return {
            insert: async (payload: { line: string; roomId: string; nickname: string; content: string }) => { lastInserted = payload; return { error: null } },
          }
        }
        return {}
      },
    })),
  }
})

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_key'
  mockLineActive = true
  mockBannedCount = 0
  lastInserted = null
})

describe('/api/messages/send POST', () => {
  it('inserts message when line active and user not banned', async () => {
    const req = new Request('http://localhost/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: 'M1', roomId: 'room', nickname: 'kullanici_1', content: 'merhaba' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const j = await res.json()
    expect(j).toEqual({ success: true })
  })

  it('censors profanities before insert', async () => {
    const req = new Request('http://localhost/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: 'M1', roomId: 'room', nickname: 'nick_1', content: 'bu amk test' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    expect(lastInserted).toBeTruthy()
    expect(lastInserted!.content).toContain('***')
  })

  it('returns 403 when line is passive', async () => {
    mockLineActive = false
    const req = new Request('http://localhost/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: 'M1', roomId: 'room', nickname: 'nick_1', content: 'hi' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  it('returns 403 when user is banned', async () => {
    mockBannedCount = 1
    const req = new Request('http://localhost/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ line: 'M1', roomId: 'room', nickname: 'nick_1', content: 'hi' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })
})


