import { supabase } from './supabase'

// Admin bilgileri (gerçek uygulamada environment variables'da olmalı)
const ADMIN_EMAIL = 'admin@metrosohbet.com'
const ADMIN_PASSWORD = 'admin123456'

export interface AdminUser {
  id: string
  email: string
  role: 'admin'
  created_at: string
}

export const adminAuth = {
  // Admin girişi
  signIn: async (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Admin session'ı oluştur
      const adminUser: AdminUser = {
        id: 'admin-001',
        email: ADMIN_EMAIL,
        role: 'admin',
        created_at: new Date().toISOString()
      }
      
      // Local storage'a kaydet (sadece client-side'da)
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminUser', JSON.stringify(adminUser))
      }
      return { data: { user: adminUser }, error: null }
    } else {
      return { data: null, error: { message: 'Geçersiz admin bilgileri' } }
    }
  },

  // Admin çıkışı
  signOut: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminUser')
    }
    return { error: null }
  },

  // Mevcut admin session'ını kontrol et
  getSession: () => {
    if (typeof window === 'undefined') {
      // Server-side'da session yok
      return { data: null, error: null }
    }
    
    try {
      const adminUser = localStorage.getItem('adminUser')
      if (adminUser) {
        return { data: { user: JSON.parse(adminUser) }, error: null }
      }
    } catch (error) {
      console.error('Error parsing admin session:', error)
    }
    return { data: null, error: null }
  },

  // Admin yetkisi kontrolü
  isAdmin: () => {
    const session = adminAuth.getSession()
    return session.data?.user?.role === 'admin'
  }
}
