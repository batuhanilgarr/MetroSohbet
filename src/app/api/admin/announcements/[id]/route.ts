import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { adminAuth } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// PUT: Update an announcement
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const { title, content, announcement_type, priority, starts_at, expires_at, is_active } = await request.json()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    const admin = createClient(supabaseUrl, serviceKey, { 
      auth: { autoRefreshToken: false, persistSession: false } 
    })

    const updateData: Record<string, unknown> = {}
    if (title !== undefined) updateData.title = title.toString().slice(0, 200)
    if (content !== undefined) updateData.content = content.toString().slice(0, 2000)
    if (announcement_type !== undefined) updateData.announcement_type = announcement_type
    if (priority !== undefined) updateData.priority = priority
    if (starts_at !== undefined) updateData.starts_at = starts_at
    if (expires_at !== undefined) updateData.expires_at = expires_at
    if (is_active !== undefined) updateData.is_active = is_active

    const { data, error } = await admin
      .from('cross_line_announcements')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, announcement: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Delete an announcement
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('DELETE /api/admin/announcements/[id] called')
    
    // Check admin authorization from request headers
    const authHeader = request.headers.get('authorization')
    console.log('Auth header:', authHeader ? 'present' : 'missing')
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      console.log('Auth header validation failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const credentials = Buffer.from(authHeader.replace('Basic ', ''), 'base64').toString()
    const [email, password] = credentials.split(':')
    console.log('Credentials parsed:', { email, hasPassword: !!password })
    
    // Validate admin credentials
    if (email !== 'admin@metrosohbet.com' || password !== 'admin123456') {
      console.log('Credential validation failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Admin auth successful')
    const { id } = await params
    console.log('Deleting announcement ID:', id)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) {
      console.log('Missing environment variables')
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    const admin = createClient(supabaseUrl, serviceKey, { 
      auth: { autoRefreshToken: false, persistSession: false } 
    })

    const { error } = await admin
      .from('cross_line_announcements')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('Announcement deleted successfully')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH: Toggle announcement status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const { action } = await request.json()

    if (action !== 'toggle') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    const admin = createClient(supabaseUrl, serviceKey, { 
      auth: { autoRefreshToken: false, persistSession: false } 
    })

    // First get current status
    const { data: current } = await admin
      .from('cross_line_announcements')
      .select('is_active')
      .eq('id', id)
      .single()

    if (!current) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
    }

    // Toggle the status
    const { data, error } = await admin
      .from('cross_line_announcements')
      .update({ is_active: !current.is_active })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, announcement: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
