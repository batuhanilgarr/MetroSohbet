import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { id, nickname } = await request.json()
    if (!id || !nickname) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

    // Sadece aynı nickname’e ait mesajı sil
    const { error } = await admin.from('messages').delete().match({ id, nickname })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}


