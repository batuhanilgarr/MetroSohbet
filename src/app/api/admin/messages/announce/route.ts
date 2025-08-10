import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    // Check admin authorization from request headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const credentials = Buffer.from(authHeader.replace('Basic ', ''), 'base64').toString()
    const [email, password] = credentials.split(':')
    
    // Validate admin credentials
    if (email !== 'admin@metrosohbet.com' || password !== 'admin123456') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { room_id, content, nickname } = await request.json()
    if (!room_id || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

    // Ensure room exists
    await admin.from('chat_rooms').upsert({ id: room_id, name: 'Metro Chat Room', description: 'Chat room', is_active: true }, { onConflict: 'id' })

    const { error } = await admin.from('messages').insert({
      room_id,
      nickname: (nickname || 'DUYURU').toString().slice(0, 20),
      content: content.toString().slice(0, 1000),
      message_type: 'announcement',
      is_anonymous: false,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}


