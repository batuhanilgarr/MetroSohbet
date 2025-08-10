import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })

    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

    // Get reports with status filtering
    const { data: reports, error } = await admin
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    const messageIds = Array.from(new Set((reports || []).map((r) => r.message_id)))
    const messagesMap: Record<string, { id: string; content: string; nickname: string; created_at: string }> = {}
    if (messageIds.length) {
      const { data: messages } = await admin
        .from('messages')
        .select('id, room_id, nickname, content, created_at')
        .in('id', messageIds)
      for (const m of messages || []) messagesMap[m.id] = m
    }

    const rows = (reports || []).map((r) => ({ report: r, message: messagesMap[r.message_id] }))
    return NextResponse.json({ rows })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}


