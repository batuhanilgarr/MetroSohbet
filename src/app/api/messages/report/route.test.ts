import { POST } from './route'

jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn(() => ({
      from: (t: string) => ({
        insert: async () => ({ error: null }),
      }),
    })),
  }
})

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service_key'
})

describe('/api/messages/report POST', () => {
  it('inserts report', async () => {
    const req = new Request('http://localhost/api/messages/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message_id: '1', reason: 'spam' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const j = await res.json()
    expect(j).toEqual({ success: true })
  })
})


