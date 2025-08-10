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

    const { id, restore } = await request.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

    const { error } = await admin
      .from('messages')
      .update({ is_deleted: restore ? false : true })
      .eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}


