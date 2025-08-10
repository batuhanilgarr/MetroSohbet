import { rateLimiter, checkRateLimit, RATE_LIMITS } from '../rate-limiter'

// Mock Request object
const createMockRequest = (ip: string = '192.168.1.1') => {
  return {
    headers: {
      get: (name: string) => {
        if (name === 'x-forwarded-for') return ip
        return null
      }
    }
  } as Request
}

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Her test öncesi rate limiter'ı temizle
    rateLimiter['store'].clear()
    rateLimiter['blockedIPs'].clear()
    rateLimiter['blockedNicknames'].clear()
  })

  describe('Basic Rate Limiting', () => {
    it('should allow first request', () => {
      const req = createMockRequest('192.168.1.1')
      const result = checkRateLimit(req, 'testuser', 'MESSAGE_SEND')
      
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBeGreaterThan(0)
    })

    it('should block after limit exceeded', () => {
      const req = createMockRequest('192.168.1.1')
      const nickname = 'testuser'
      
      // IP ve nickname limit'lerinin minimum'unu al
      const ipLimit = RATE_LIMITS.MESSAGE_SEND.IP.limit
      const nicknameLimit = RATE_LIMITS.MESSAGE_SEND.NICKNAME.limit
      const maxRequests = Math.min(ipLimit, nicknameLimit)
      
      // Limit'i aşana kadar istek gönder
      for (let i = 0; i < maxRequests; i++) {
        const result = checkRateLimit(req, nickname, 'MESSAGE_SEND')
        expect(result.allowed).toBe(true)
      }
      
      // Sonraki istek bloklanmalı
      const blockedResult = checkRateLimit(req, nickname, 'MESSAGE_SEND')
      expect(blockedResult.allowed).toBe(false)
      // Nickname limit'i daha düşük olduğu için önce o aşılacak
      expect(blockedResult.error).toContain('Nickname için rate limit aşıldı')
    })

    it('should reset after window expires', async () => {
      const req = createMockRequest('192.168.1.1')
      const nickname = 'testuser'
      
      // İlk istek
      const firstResult = checkRateLimit(req, nickname, 'MESSAGE_SEND')
      expect(firstResult.allowed).toBe(true)
      
      // Window'u manuel olarak expire et
      const key = `ip:192.168.1.1:MESSAGE_SEND`
      const entry = rateLimiter['store'].get(key)
      if (entry) {
        entry.resetTime = Date.now() - 1000 // 1 saniye önce expire
      }
      
      // Yeni istek yapılabilir olmalı
      const newResult = checkRateLimit(req, nickname, 'MESSAGE_SEND')
      expect(newResult.allowed).toBe(true)
    })
  })

  describe('IP vs Nickname Limits', () => {
    it('should enforce both IP and nickname limits', () => {
      const req1 = createMockRequest('192.168.1.1')
      const req2 = createMockRequest('192.168.1.2')
      const nickname = 'testuser'
      
      // IP1'den nickname limit'ini aş
      for (let i = 0; i < RATE_LIMITS.MESSAGE_SEND.NICKNAME.limit; i++) {
        const result = checkRateLimit(req1, nickname, 'MESSAGE_SEND')
        expect(result.allowed).toBe(true)
      }
      
      // IP2'den aynı nickname ile istek yap - bloklanmalı
      const blockedResult = checkRateLimit(req2, nickname, 'MESSAGE_SEND')
      expect(blockedResult.allowed).toBe(false)
      expect(blockedResult.error).toContain('Nickname için rate limit aşıldı')
    })
  })

  describe('Blocking System', () => {
    it('should block IP addresses', () => {
      const ip = '192.168.1.1'
      rateLimiter.block('ip', ip, 1000) // 1 saniye blokla
      
      const req = createMockRequest(ip)
      const result = checkRateLimit(req, 'testuser', 'MESSAGE_SEND')
      expect(result.allowed).toBe(false)
    })

    it('should block nicknames', () => {
      const nickname = 'spammer'
      rateLimiter.block('nickname', nickname, 1000) // 1 saniye blokla
      
      const req = createMockRequest('192.168.1.1')
      const result = checkRateLimit(req, nickname, 'MESSAGE_SEND')
      expect(result.allowed).toBe(false)
    })

    it('should unblock after duration expires', async () => {
      const ip = '192.168.1.1'
      rateLimiter.block('ip', ip, 100) // 100ms blokla
      
      const req = createMockRequest(ip)
      let result = checkRateLimit(req, 'testuser', 'MESSAGE_SEND')
      expect(result.allowed).toBe(false)
      
      // 150ms bekle
      await new Promise(resolve => setTimeout(resolve, 150))
      
      result = checkRateLimit(req, 'testuser', 'MESSAGE_SEND')
      expect(result.allowed).toBe(true)
    })
  })

  describe('Admin Functions', () => {
    it('should get rate limit stats', () => {
      const req = createMockRequest('192.168.1.1')
      checkRateLimit(req, 'testuser', 'MESSAGE_SEND')
      
      const stats = rateLimiter.getAllRateLimits()
      expect(stats.length).toBeGreaterThan(0)
      expect(stats[0]).toHaveProperty('type')
      expect(stats[0]).toHaveProperty('value')
      expect(stats[0]).toHaveProperty('action')
    })

    it('should get blocked list', () => {
      const ip = '192.168.1.1'
      const nickname = 'spammer'
      
      rateLimiter.block('ip', ip, 1000)
      rateLimiter.block('nickname', nickname, 1000)
      
      const blockedList = rateLimiter.getBlockedList()
      expect(blockedList.ips).toContain(ip)
      expect(blockedList.nicknames).toContain(nickname)
    })

    it('should reset rate limits', () => {
      const req = createMockRequest('192.168.1.1')
      const nickname = 'testuser'
      
      checkRateLimit(req, nickname, 'MESSAGE_SEND')
      expect(rateLimiter['store'].size).toBeGreaterThan(0)
      
      rateLimiter.resetAll()
      expect(rateLimiter['store'].size).toBe(0)
    })
  })

  describe('Different Actions', () => {
    it('should have different limits for different actions', () => {
      const req = createMockRequest('192.168.1.1')
      const nickname = 'testuser'
      
      // MESSAGE_SEND limit'i (nickname limit'ini de hesaba kat)
      const messageIpLimit = RATE_LIMITS.MESSAGE_SEND.IP.limit
      const messageNicknameLimit = RATE_LIMITS.MESSAGE_SEND.NICKNAME.limit
      const messageMaxRequests = Math.min(messageIpLimit, messageNicknameLimit)
      
      // REPORT limit'i (nickname limit'ini de hesaba kat)
      const reportIpLimit = RATE_LIMITS.REPORT.IP.limit
      const reportNicknameLimit = RATE_LIMITS.REPORT.NICKNAME.limit
      const reportMaxRequests = Math.min(reportIpLimit, reportNicknameLimit)
      
      expect(messageMaxRequests).not.toBe(reportMaxRequests)
      
      // MESSAGE_SEND için limit'i aşana kadar istek gönder
      for (let i = 0; i < messageMaxRequests; i++) {
        const result = checkRateLimit(req, nickname, 'MESSAGE_SEND')
        expect(result.allowed).toBe(true)
      }
      
      // MESSAGE_SEND bloklanmalı ama REPORT hala yapılabilir olmalı
      const messageBlocked = checkRateLimit(req, nickname, 'MESSAGE_SEND')
      expect(messageBlocked.allowed).toBe(false)
      
      const reportAllowed = checkRateLimit(req, nickname, 'REPORT')
      expect(reportAllowed.allowed).toBe(true)
    })
  })
})
