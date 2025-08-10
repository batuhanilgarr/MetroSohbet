import { useState, useEffect } from 'react'

export type CookieConsent = 'all' | 'necessary' | 'custom' | null

export interface CookieSettings {
  analytics: boolean
  functional: boolean
}

export function useCookies() {
  const [consent, setConsent] = useState<CookieConsent>(null)
  const [settings, setSettings] = useState<CookieSettings>({
    analytics: false,
    functional: false
  })

  useEffect(() => {
    // Local storage'dan cookie ayarlarını yükle
    const storedConsent = localStorage.getItem('cookie-consent') as CookieConsent
    const analytics = localStorage.getItem('cookie-analytics') === 'true'
    const functional = localStorage.getItem('cookie-functional') === 'true'
    
    setConsent(storedConsent)
    setSettings({ analytics, functional })
  }, [])

  const updateConsent = (newConsent: CookieConsent, newSettings?: CookieSettings) => {
    setConsent(newConsent)
    
    if (newSettings) {
      setSettings(newSettings)
      localStorage.setItem('cookie-analytics', newSettings.analytics.toString())
      localStorage.setItem('cookie-functional', newSettings.functional.toString())
    }
    
    localStorage.setItem('cookie-consent', newConsent || '')
  }

  const hasConsent = (type: keyof CookieSettings): boolean => {
    if (consent === 'all') return true
    if (consent === 'necessary') return false
    if (consent === 'custom') return settings[type]
    return false
  }

  const clearConsent = () => {
    localStorage.removeItem('cookie-consent')
    localStorage.removeItem('cookie-analytics')
    localStorage.removeItem('cookie-functional')
    setConsent(null)
    setSettings({ analytics: false, functional: false })
  }

  return {
    consent,
    settings,
    updateConsent,
    hasConsent,
    clearConsent
  }
}

// Cookie utility functions
export const cookieUtils = {
  setCookie: (name: string, value: string, days: number = 365) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  },

  getCookie: (name: string): string | null => {
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  },

  deleteCookie: (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  },

  // GDPR uyumlu cookie set etme
  setCookieWithConsent: (name: string, value: string, days: number, type: keyof CookieSettings) => {
    const consent = localStorage.getItem('cookie-consent')
    const typeConsent = localStorage.getItem(`cookie-${type}`)
    
    if (consent === 'all' || (consent === 'custom' && typeConsent === 'true')) {
      cookieUtils.setCookie(name, value, days)
      return true
    }
    return false
  }
}
