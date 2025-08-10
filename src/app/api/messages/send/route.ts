import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { censorContent } from '@/lib/text-filters'
import { checkRateLimit } from '@/lib/rate-limiter'

export const dynamic = 'force-dynamic'

const NICKNAME_REGEX = /^[A-Za-z0-9_]{3,20}$/
const PROHIBITED = [
  'admin', 'moderator', 'mod', 'support', 'official',
  'root', 'owner', 'sys', 'system', 'staff',
  'küfür', 'salak', 'aptal', 'orospu', 'amk', 'siktir', 'piç'
]


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { line, roomId, nickname, content } = body as {
      line?: string
      roomId?: string
      nickname?: string
      content?: string
    }

    if (!line || !roomId || !nickname || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const trimmedNickname = nickname.trim()
    const trimmedContent = content.trim()
    if (!trimmedContent) {
      return NextResponse.json({ error: 'Content is empty' }, { status: 400 })
    }
    if (!NICKNAME_REGEX.test(trimmedNickname)) {
      return NextResponse.json({ error: 'Invalid nickname' }, { status: 400 })
    }
    if (PROHIBITED.some((p) => trimmedNickname.toLowerCase().includes(p))) {
      return NextResponse.json({ error: 'Nickname not allowed' }, { status: 400 })
    }

    // Rate limiting kontrolü
    const rateLimitCheck = checkRateLimit(request, trimmedNickname, 'MESSAGE_SEND')
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({ 
        error: rateLimitCheck.error,
        rateLimit: {
          remaining: rateLimitCheck.remaining,
          resetTime: rateLimitCheck.resetTime,
          details: rateLimitCheck.details
        }
      }, { status: 429 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Check line active
    const { data: lineData, error: lineErr } = await admin
      .from('metro_lines')
      .select('is_active')
      .eq('name', line)
      .maybeSingle()
    if (lineErr) {
      return NextResponse.json({ error: lineErr.message }, { status: 400 })
    }
    if (!lineData || lineData.is_active === false) {
      return NextResponse.json({ error: 'Line is passive' }, { status: 403 })
    }

    // Check banned user
    const { data: banned } = await admin
      .from('banned_users')
      .select('id')
      .eq('nickname', trimmedNickname)
      .limit(1)
    if (banned && banned.length > 0) {
      return NextResponse.json({ error: 'Nickname is banned' }, { status: 403 })
    }

    // Optional: uniqueness in last 2h can be enforced client-side; server can skip

    // Ensure chat room exists
    await admin
      .from('chat_rooms')
      .upsert({ id: roomId, name: 'Metro Chat Room', description: 'Chat room', is_active: true }, { onConflict: 'id' })

    // İçeriği sansürle
    const safeContent = censorContent(trimmedContent)

    const { error: insertErr } = await admin
      .from('messages')
      .insert({
        room_id: roomId,
        nickname: trimmedNickname,
        content: safeContent,
        message_type: 'chat',
        is_anonymous: false
      })

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true,
      rateLimit: {
        remaining: rateLimitCheck.remaining,
        resetTime: rateLimitCheck.resetTime
      }
    })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}


