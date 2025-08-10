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

    const body = await request.json()
    const { roomId } = body as { roomId?: string }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server is not configured' }, { status: 500 })
    }

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    let error
    if (roomId) {
      const res = await admin.from('messages').delete().eq('room_id', roomId)
      error = res.error || null
    } else {
      // Global silme: önce tüm reports kayıtlarını sil, sonra tüm messages
      const rep = await admin.from('reports').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (rep.error) {
        return NextResponse.json({ error: rep.error.message }, { status: 400 })
      }
      const all = await admin.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      error = all.error || null
    }
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}


