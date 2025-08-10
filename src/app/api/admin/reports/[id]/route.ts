import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { adminAuth } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// PATCH: Update report status
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
    const { status, admin_notes, assigned_admin } = await request.json()

    if (!status || !['new', 'reviewing', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    const admin = createClient(supabaseUrl, serviceKey, { 
      auth: { autoRefreshToken: false, persistSession: false } 
    })

    const updateData: Record<string, unknown> = {
      status,
      admin_notes: admin_notes || null,
      assigned_admin: assigned_admin || null
    }

    // Set timestamps based on status
    if (status === 'reviewing') {
      updateData.reviewed_at = new Date().toISOString()
    } else if (status === 'closed') {
      updateData.closed_at = new Date().toISOString()
    }

    const { data, error } = await admin
      .from('reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, report: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
