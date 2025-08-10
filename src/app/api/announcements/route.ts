import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

// GET: Fetch active cross-line announcements for clients
export async function GET() {
  try {
    console.log('GET /api/announcements called')
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    
    console.log('Environment check:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!anonKey,
      url: supabaseUrl?.substring(0, 20) + '...'
    })
    
    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, anonKey)

    const now = new Date().toISOString()
    console.log('Current time:', now)

    // Filter for active announcements only
    console.log('Filtering for active announcements...')
    
    const { data, error } = await supabase
      .from('cross_line_announcements')
      .select('*')
      .eq('is_active', true)
      .lte('starts_at', now)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database query error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('Filtered announcements result:', data?.length || 0)
    if (data && data.length > 0) {
      console.log('First active announcement:', data[0])
    }
    
    return NextResponse.json({ announcements: data || [] })
  } catch (error) {
    console.error('GET announcements exception:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
