import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getClientIP } from '@/lib/rate-limiter'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { message_id, reason, reporter_nickname } = await request.json()
    if (!message_id || !reason || !reporter_nickname) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Rate limiting kontrolü
    const rateLimitCheck = checkRateLimit(request, reporter_nickname, 'REPORT')
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
    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

    const { error } = await admin.from('reports').insert({
      message_id,
      reason,
      reporter_nickname,
      reporter_ip: getClientIP(request),
      status: 'new' // Default status for new reports
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    
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


