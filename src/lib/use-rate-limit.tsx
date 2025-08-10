import { useState, useEffect } from 'react'

interface RateLimitInfo {
  remaining: number
  resetTime: number
  details?: Record<string, unknown>
}

interface UseRateLimitReturn {
  isLimited: boolean
  remaining: number
  resetTime: number
  timeUntilReset: number
  progress: number
  error?: string
  details?: Record<string, unknown>
}

export function useRateLimit(
  action: string,
  nickname: string,
  checkFunction: () => Promise<Response>
): UseRateLimitReturn {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>({
    remaining: 0,
    resetTime: 0
  })
  const [error, setError] = useState<string>()
  const [isLimited, setIsLimited] = useState(false)

  const checkRateLimit = async () => {
    try {
      const response = await checkFunction()
      const data = await response.json()

      if (response.status === 429) {
        // Rate limit aşıldı
        setRateLimitInfo({
          remaining: data.rateLimit?.remaining || 0,
          resetTime: data.rateLimit?.resetTime || 0,
          details: data.rateLimit?.details
        })
        setError(data.error)
        setIsLimited(true)
      } else if (response.ok) {
        // Başarılı, rate limit bilgilerini güncelle
        if (data.rateLimit) {
          setRateLimitInfo({
            remaining: data.rateLimit.remaining,
            resetTime: data.rateLimit.resetTime,
            details: data.rateLimit.details
          })
        }
        setError(undefined)
        setIsLimited(false)
      }
    } catch (err) {
      console.error('Rate limit check failed:', err)
    }
  }

  // İlk yüklemede rate limit kontrolü
  useEffect(() => {
    checkRateLimit()
  }, [action, nickname])

  // Reset time'a göre countdown
  const [timeUntilReset, setTimeUntilReset] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (rateLimitInfo.resetTime > 0) {
      const updateCountdown = () => {
        const now = Date.now()
        const timeLeft = Math.max(0, rateLimitInfo.resetTime - now)
        setTimeUntilReset(timeLeft)

        // Progress bar için
        const totalTime = rateLimitInfo.resetTime - (rateLimitInfo.resetTime - 60000) // 1 dakika window
        const elapsed = totalTime - timeLeft
        setProgress(Math.min(100, Math.max(0, (elapsed / totalTime) * 100)))

        if (timeLeft <= 0) {
          // Reset time geçti, rate limit'i tekrar kontrol et
          checkRateLimit()
        }
      }

      updateCountdown()
      const interval = setInterval(updateCountdown, 1000)
      return () => clearInterval(interval)
    }
  }, [rateLimitInfo.resetTime, checkRateLimit])

  return {
    isLimited,
    remaining: rateLimitInfo.remaining,
    resetTime: rateLimitInfo.resetTime,
    timeUntilReset,
    progress,
    error,
    details: rateLimitInfo.details
  }
}

// Rate limit progress bar component
export function RateLimitProgressBar({ 
  remaining, 
  limit, 
  timeUntilReset 
}: { 
  remaining: number
  limit: number
  progress?: number
  timeUntilReset: number 
}) {
  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.ceil(seconds / 60)
    return `${minutes}m ${seconds % 60}s`
  }

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Rate Limit: {remaining}/{limit}</span>
        <span>{formatTime(timeUntilReset)}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            remaining >= limit ? 'bg-red-500' : remaining > limit * 0.8 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${Math.min((remaining / limit) * 100, 100)}%` }}
        />
      </div>
    </div>
  )
}

// Rate limit error component
export function RateLimitError({ error, timeUntilReset }: { error?: string; timeUntilReset: number }) {
  if (!error) return null

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000)
    if (seconds < 60) return `${seconds} saniye`
    const minutes = Math.ceil(seconds / 60)
    return `${minutes} dakika ${seconds % 60} saniye`
  }

  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
      <p className="text-sm text-red-600">
        {error}
        {timeUntilReset > 0 && (
          <span className="block mt-1">
            {formatTime(timeUntilReset)} sonra tekrar deneyebilirsiniz.
          </span>
        )}
      </p>
    </div>
  )
}
