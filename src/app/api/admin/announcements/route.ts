import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// Basit admin check - gerçek uygulamada JWT token kullanılmalı
const isAdmin = (request: Request) => {
  // Authorization header'dan admin bilgilerini kontrol et
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return false
  
  try {
    // Basic auth format: "Basic base64(email:password)"
    const base64Credentials = authHeader.split(' ')[1]
    if (!base64Credentials) return false
    
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [email, password] = credentials.split(':')
    
    return email === 'admin@metrosohbet.com' && password === 'admin123456'
  } catch {
    return false
  }
}

// GET: Fetch all cross-line announcements
export async function GET(request: Request) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    const admin = createClient(supabaseUrl, serviceKey, { 
      auth: { autoRefreshToken: false, persistSession: false } 
    })

    const { data, error } = await admin
      .from('cross_line_announcements')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('GET announcements error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ announcements: data })
  } catch (error) {
    console.error('GET announcements exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create a new cross-line announcement
export async function POST(request: Request) {
  try {
    console.log('POST /api/admin/announcements called')
    
    if (!isAdmin(request)) {
      console.log('Admin auth failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Request body:', body)
    
    const { title, content, announcement_type, priority, starts_at, expires_at } = body
    
    if (!title || !content || !announcement_type) {
      console.log('Missing required fields:', { title: !!title, content: !!content, announcement_type: !!announcement_type })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    
    console.log('Environment check:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!serviceKey,
      url: supabaseUrl?.substring(0, 20) + '...'
    })
    
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    const admin = createClient(supabaseUrl, serviceKey, { 
      auth: { autoRefreshToken: false, persistSession: false } 
    })

    const insertData = {
      title: title.toString().slice(0, 200),
      content: content.toString().slice(0, 2000),
      announcement_type,
      priority: priority || 1,
      starts_at: starts_at || new Date().toISOString(),
      expires_at: expires_at || null,
      created_by: 'Admin'
    }
    
    console.log('Inserting data:', insertData)

    const { data, error } = await admin
      .from('cross_line_announcements')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('Successfully created announcement:', data)
    return NextResponse.json({ success: true, announcement: data })
  } catch (error) {
    console.error('POST announcements exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
