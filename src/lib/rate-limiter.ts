interface RateLimitEntry {
  count: number
  resetTime: number
  firstRequest: number
  lastRequest: number
}

interface RateLimitInfo {
  type: 'ip' | 'nickname'
  value: string
  action: string
  count: number
  limit: number
  remaining: number
  resetTime: number
  firstRequest: number
  lastRequest: number
  isBlocked: boolean
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout
  private blockedIPs = new Set<string>()
  private blockedNicknames = new Set<string>()

  constructor() {
    // Her 5 dakikada bir expired entry'leri temizle
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key)
      }
    }
  }

  private getKey(type: 'ip' | 'nickname', value: string, action: string): string {
    return `${type}:${value}:${action}`
  }

  isAllowed(type: 'ip' | 'nickname', value: string, action: string, limit: number, windowMs: number): boolean {
    const key = this.getKey(type, value, action)
    const now = Date.now()
    const entry = this.store.get(key)

    // Blocked list kontrolü
    if (type === 'ip' && this.blockedIPs.has(value)) {
      return false
    }
    if (type === 'nickname' && this.blockedNicknames.has(value)) {
      return false
    }

    if (!entry || now > entry.resetTime) {
      // Yeni window başlat
      this.store.set(key, {
        count: 1,
        resetTime: now + windowMs,
        firstRequest: now,
        lastRequest: now
      })
      return true
    }

    if (entry.count >= limit) {
      // Limit aşıldı, son request zamanını güncelle
      entry.lastRequest = now
      return false
    }

    // Count'u artır ve son request zamanını güncelle
    entry.count++
    entry.lastRequest = now
    return true
  }

  getRemaining(type: 'ip' | 'nickname', value: string, action: string): { remaining: number; resetTime: number; count: number } {
    const key = this.getKey(type, value, action)
    const entry = this.store.get(key)
    
    if (!entry) {
      return { remaining: 0, resetTime: 0, count: 0 }
    }

    return {
      remaining: entry.count,
      resetTime: entry.resetTime,
      count: entry.count
    }
  }

  reset(type: 'ip' | 'nickname', value: string, action: string): void {
    const key = this.getKey(type, value, action)
    this.store.delete(key)
  }

  // Tüm store'u temizle
  resetAll(): void {
    this.store.clear()
  }

  // Admin panel için tüm rate limit bilgilerini getir
  getAllRateLimits(): RateLimitInfo[] {
    const results: RateLimitInfo[] = []
    
    for (const [key, entry] of this.store.entries()) {
      const [type, value, action] = key.split(':')
      const limits = RATE_LIMITS[action as keyof typeof RATE_LIMITS]
      
      if (limits && (type === 'ip' || type === 'nickname')) {
        const limitConfig = limits[type.toUpperCase() as 'IP' | 'NICKNAME']
        results.push({
          type: type as 'ip' | 'nickname',
          value,
          action,
          count: entry.count,
          limit: limitConfig.limit,
          remaining: Math.max(0, limitConfig.limit - entry.count),
          resetTime: entry.resetTime,
          firstRequest: entry.firstRequest,
          lastRequest: entry.lastRequest,
          isBlocked: (type === 'ip' && this.blockedIPs.has(value)) || 
                     (type === 'nickname' && this.blockedNicknames.has(value))
        })
      }
    }
    
    return results
  }

  // IP veya nickname'i geçici olarak blokla
  block(type: 'ip' | 'nickname', value: string, durationMs: number = 60 * 60 * 1000): void {
    if (type === 'ip') {
      this.blockedIPs.add(value)
      setTimeout(() => this.blockedIPs.delete(value), durationMs)
    } else {
      this.blockedNicknames.add(value)
      setTimeout(() => this.blockedNicknames.delete(value), durationMs)
    }
  }

  // IP veya nickname'i unblock et
  unblock(type: 'ip' | 'nickname', value: string): void {
    if (type === 'ip') {
      this.blockedIPs.delete(value)
    } else {
      this.blockedNicknames.delete(value)
    }
  }

  // Blocked list'leri getir
  getBlockedList(): { ips: string[]; nicknames: string[] } {
    return {
      ips: Array.from(this.blockedIPs),
      nicknames: Array.from(this.blockedNicknames)
    }
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter()

// Rate limit constants
export const RATE_LIMITS = {
  MESSAGE_SEND: {
    IP: { limit: 10, windowMs: 60 * 1000 }, // IP başına dakikada 10 mesaj
    NICKNAME: { limit: 5, windowMs: 60 * 1000 } // Nickname başına dakikada 5 mesaj
  },
  REPORT: {
    IP: { limit: 3, windowMs: 60 * 1000 }, // IP başına dakikada 3 report
    NICKNAME: { limit: 2, windowMs: 60 * 1000 } // Nickname başına dakikada 2 report
  },
  IMAGE_UPLOAD: {
    IP: { limit: 5, windowMs: 60 * 1000 }, // IP başına dakikada 5 resim
    NICKNAME: { limit: 3, windowMs: 60 * 1000 } // Nickname başına dakikada 3 resim
  },
  NICKNAME_CHANGE: {
    IP: { limit: 3, windowMs: 5 * 60 * 1000 }, // IP başına 5 dakikada 3 değişiklik
    NICKNAME: { limit: 1, windowMs: 5 * 60 * 1000 } // Nickname başına 5 dakikada 1 değişiklik
  },
  LOGIN_ATTEMPT: {
    IP: { limit: 5, windowMs: 15 * 60 * 1000 }, // IP başına 15 dakikada 5 login denemesi
    NICKNAME: { limit: 3, windowMs: 15 * 60 * 1000 } // Nickname başına 15 dakikada 3 login denemesi
  },
  DM_SEND: {
    IP: { limit: 20, windowMs: 60 * 1000 }, // IP başına dakikada 20 DM
    NICKNAME: { limit: 10, windowMs: 60 * 1000 } // Nickname başına dakikada 10 DM
  }
}

// Helper function to get client IP
export function getClientIP(req: Request): string {
  // Cloudflare, Vercel, etc. headers
  const cfConnectingIP = req.headers.get('cf-connecting-ip')
  const xForwardedFor = req.headers.get('x-forwarded-for')
  const xRealIP = req.headers.get('x-real-ip')
  
  if (cfConnectingIP) return cfConnectingIP
  if (xRealIP) return xRealIP
  if (xForwardedFor) return xForwardedFor.split(',')[0].trim()
  
  return 'unknown'
}

// Rate limit middleware
export function checkRateLimit(
  req: Request,
  nickname: string,
  action: keyof typeof RATE_LIMITS
): { allowed: boolean; remaining: number; resetTime: number; error?: string; details?: Record<string, unknown> } {
  const ip = getClientIP(req)
  const limits = RATE_LIMITS[action]
  
  // IP bazlı kontrol
  const ipAllowed = rateLimiter.isAllowed('ip', ip, action, limits.IP.limit, limits.IP.windowMs)
  if (!ipAllowed) {
    const ipInfo = rateLimiter.getRemaining('ip', ip, action)
    return {
      allowed: false,
      remaining: limits.IP.limit - ipInfo.count,
      resetTime: ipInfo.resetTime,
      error: `IP adresiniz için rate limit aşıldı. ${Math.ceil((ipInfo.resetTime - Date.now()) / 1000)} saniye sonra tekrar deneyin.`,
      details: {
        type: 'ip',
        value: ip,
        action,
        count: ipInfo.count,
        limit: limits.IP.limit
      }
    }
  }
  
  // Nickname bazlı kontrol
  const nicknameAllowed = rateLimiter.isAllowed('nickname', nickname, action, limits.NICKNAME.limit, limits.NICKNAME.windowMs)
  if (!nicknameAllowed) {
    const nicknameInfo = rateLimiter.getRemaining('nickname', nickname, action)
    return {
      allowed: false,
      remaining: limits.NICKNAME.limit - nicknameInfo.count,
      resetTime: nicknameInfo.resetTime,
      error: `Nickname için rate limit aşıldı. ${Math.ceil((nicknameInfo.resetTime - Date.now()) / 1000)} saniye sonra tekrar deneyin.`,
      details: {
        type: 'nickname',
        value: nickname,
        action,
        count: nicknameInfo.count,
        limit: limits.NICKNAME.limit
      }
    }
  }
  
  // Her iki limit de geçildi
  const ipInfo = rateLimiter.getRemaining('ip', ip, action)
  const nicknameInfo = rateLimiter.getRemaining('nickname', nickname, action)
  
  return {
    allowed: true,
    remaining: Math.min(limits.IP.limit - ipInfo.count, limits.NICKNAME.limit - nicknameInfo.count),
    resetTime: Math.min(ipInfo.resetTime, nicknameInfo.resetTime),
    details: {
      ip: { count: ipInfo.count, limit: limits.IP.limit, remaining: limits.IP.limit - ipInfo.count },
      nickname: { count: nicknameInfo.count, limit: limits.NICKNAME.limit, remaining: limits.NICKNAME.limit - nicknameInfo.count }
    }
  }
}

// Admin panel için rate limit yönetimi
export function getRateLimitStats() {
  return {
    allLimits: rateLimiter.getAllRateLimits(),
    blockedList: rateLimiter.getBlockedList(),
    totalEntries: rateLimiter['store'].size
  }
}

export function blockUser(type: 'ip' | 'nickname', value: string, durationMs: number = 60 * 60 * 1000) {
  rateLimiter.block(type, value, durationMs)
}

export function unblockUser(type: 'ip' | 'nickname', value: string) {
  rateLimiter.unblock(type, value)
}

export function resetRateLimit(type: 'ip' | 'nickname', value: string, action: string) {
  rateLimiter.reset(type, value, action)
}
