import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getClientIP } from '@/lib/rate-limiter'

export const dynamic = 'force-dynamic'

const NICKNAME_REGEX = /^[A-Za-z0-9_]{3,20}$/
const PROHIBITED = [
  'admin', 'moderator', 'mod', 'support', 'official',
  'root', 'owner', 'sys', 'system', 'staff',
  'küfür', 'salak', 'aptal', 'orospu', 'amk', 'siktir', 'piç'
]

export async function POST(request: Request) {
  try {
    const { nickname } = await request.json()
    const v = String(nickname || '').trim()
    
    // Boş nickname kontrolü
    if (!v) {
      return NextResponse.json({ 
        ok: false, 
        reason: 'empty',
        message: 'Nickname boş olamaz'
      })
    }
    
    // Format kontrolü
    if (!NICKNAME_REGEX.test(v)) {
      return NextResponse.json({ 
        ok: false, 
        reason: 'format',
        message: '3-20 karakter, sadece harf, rakam ve alt çizgi (_) kullanılabilir'
      })
    }
    
    // Yasaklı kelime kontrolü
    if (PROHIBITED.some((p) => v.toLowerCase().includes(p))) {
      return NextResponse.json({ 
        ok: false, 
        reason: 'prohibited',
        message: 'Bu nickname uygun değil, lütfen başka bir tane seçin'
      })
    }

    // Rate limiting kontrolü (IP bazlı, çünkü nickname henüz belirlenmemiş)
    const ip = getClientIP(request)
    const rateLimitCheck = checkRateLimit(request, ip, 'NICKNAME_CHANGE')
    if (!rateLimitCheck.allowed) {
      return NextResponse.json({ 
        ok: false, 
        reason: 'rate_limit',
        message: rateLimitCheck.error,
        rateLimit: {
          remaining: rateLimitCheck.remaining,
          resetTime: rateLimitCheck.resetTime
        }
      }, { status: 429 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ 
        ok: false, 
        reason: 'server',
        message: 'Sunucu hatası'
      }, { status: 500 })
    }
    const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

    // Yasaklı kullanıcı kontrolü
    const { data: banned } = await admin.from('banned_users').select('id').eq('nickname', v).limit(1)
    if (banned && banned.length > 0) {
      return NextResponse.json({ 
        ok: false, 
        reason: 'banned',
        message: 'Bu kullanıcı adı engellenmiş'
      })
    }

    // Rezerve edilmiş nickname kontrolü (gelecekte eklenebilir)
    // const { data: reserved } = await admin.from('reserved_nicknames').select('id').eq('nickname', v).limit(1)
    // if (reserved && reserved.length > 0) {
    //   return NextResponse.json({ 
    //     ok: false, 
    //     reason: 'reserved',
    //     message: 'Bu nickname rezerve edilmiş'
    //   })
    // }

    // Kullanımda olan nickname kontrolü (opsiyonel - aynı nickname ile birden fazla kullanıcı olabilir)
    // const { data: existing } = await admin.from('messages').select('nickname').eq('nickname', v).limit(1)
    // if (existing && existing.length > 0) {
    //   return NextResponse.json({ 
    //     ok: false, 
    //     reason: 'taken',
    //     message: 'Bu nickname zaten kullanımda'
    //   })
    // }

    return NextResponse.json({ 
      ok: true, 
      message: 'Bu nickname kullanılabilir!',
      suggestions: generateSuggestions(v),
      rateLimit: {
        remaining: rateLimitCheck.remaining,
        resetTime: rateLimitCheck.resetTime
      }
    })
  } catch {
    return NextResponse.json({ 
      ok: false, 
      reason: 'unknown',
      message: 'Bilinmeyen hata'
    }, { status: 500 })
  }
}

// Nickname önerileri oluştur
function generateSuggestions(nickname: string): string[] {
  const suggestions: string[] = []
  
  // Mevcut nickname'e sayı ekle
  for (let i = 1; i <= 3; i++) {
    suggestions.push(`${nickname}${i}`)
  }
  
  // Alt çizgi ile varyantlar
  if (!nickname.includes('_')) {
    suggestions.push(`${nickname}_`)
    suggestions.push(`_${nickname}`)
  }
  
  // Kısaltma önerileri
  if (nickname.length > 5) {
    suggestions.push(nickname.substring(0, 5))
    suggestions.push(nickname.substring(0, 3))
  }
  
  return suggestions.slice(0, 5) // En fazla 5 öneri
}



