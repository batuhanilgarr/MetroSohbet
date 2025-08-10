import { NextResponse } from 'next/server'
import { getRateLimitStats, blockUser, unblockUser, resetRateLimit } from '@/lib/rate-limiter'
import { adminAuth } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// Rate limit istatistiklerini getir
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

    const stats = getRateLimitStats()
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Kullanıcıyı blokla/unblock et
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

    const { action, type, value, duration } = await request.json()
    
    if (!action || !type || !value) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    switch (action) {
      case 'block':
        const blockDuration = duration || 60 * 60 * 1000 // Varsayılan 1 saat
        blockUser(type, value, blockDuration)
        return NextResponse.json({ success: true, message: `${type} ${value} bloklandı` })
      
      case 'unblock':
        unblockUser(type, value)
        return NextResponse.json({ success: true, message: `${type} ${value} unblock edildi` })
      
      case 'reset':
        resetRateLimit(type, value, 'all')
        return NextResponse.json({ success: true, message: `${type} ${value} için rate limit sıfırlandı` })
      
              default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
