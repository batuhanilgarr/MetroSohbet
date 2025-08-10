import { create } from 'zustand'
import { supabase } from './supabase'
import { adminAuth } from './admin-auth'
import type { Message } from './supabase'

interface AdminState {
  isAdmin: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  deleteMessage: (messageId: string) => Promise<void>
  banUser: (nickname: string) => Promise<void>
  clearAllMessages: (roomId?: string) => Promise<void>
  checkAdminStatus: () => void
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAdmin: false,
  isLoading: false,
  error: null,

  // Admin API çağrıları için yardımcı fonksiyon
  getAuthHeaders: () => {
    const adminUser = localStorage.getItem('adminUser')
    if (!adminUser) return null
    
    try {
      const { email } = JSON.parse(adminUser)
      const password = 'admin123456' // Gerçek uygulamada bu güvenli olmaz
      const credentials = btoa(`${email}:${password}`)
      return {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      }
    } catch {
      return null
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null })

    try {
      const { data, error } = await adminAuth.signIn(email, password)
      
      if (error) {
        set({ error: error.message, isAdmin: false })
      } else {
        set({ isAdmin: true, error: null })
      }
    } catch (error) {
      set({ error: 'Giriş yapılamadı', isAdmin: false })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    adminAuth.signOut()
    set({ isAdmin: false, error: null })
  },

  deleteMessage: async (messageId: string) => {
    if (!get().isAdmin) {
      set({ error: 'Admin yetkisi gerekli' })
      return
    }

    set({ isLoading: true, error: null })

    try {
      const headers = get().getAuthHeaders()
      if (!headers) {
        set({ error: 'Admin oturumu bulunamadı. Lütfen tekrar giriş yapın.' })
        return
      }
      
      const res = await fetch('/api/admin/messages/delete', {
        method: 'POST',
        headers,
        body: JSON.stringify({ id: messageId })
      })

      const json = await res.json()
      if (!res.ok) {
        set({ error: json.error || 'Mesaj silinemedi' })
      } else {
        set({ error: null })
      }
    } catch (error) {
      set({ error: 'Mesaj silinemedi' })
    } finally {
      set({ isLoading: false })
    }
  },

  banUser: async (nickname: string) => {
    if (!get().isAdmin) {
      set({ error: 'Admin yetkisi gerekli' })
      return
    }

    set({ isLoading: true, error: null })

    try {
      const headers = get().getAuthHeaders()
      if (!headers) {
        set({ error: 'Admin oturumu bulunamadı. Lütfen tekrar giriş yapın.' })
        return
      }
      
      const res = await fetch('/api/admin/users/ban', {
        method: 'POST',
        headers,
        body: JSON.stringify({ nickname })
      })
      const json = await res.json()
      if (!res.ok) {
        set({ error: json.error || 'Kullanıcı engellenemedi' })
      } else {
        set({ error: null })
      }
    } catch (error) {
      set({ error: 'Kullanıcı engellenemedi' })
    } finally {
      set({ isLoading: false })
    }
  },

  clearAllMessages: async (roomId?: string) => {
    if (!get().isAdmin) {
      set({ error: 'Admin yetkisi gerekli' })
      return
    }

    set({ isLoading: true, error: null })

    try {
      const headers = get().getAuthHeaders()
      if (!headers) {
        set({ error: 'Admin oturumu bulunamadı. Lütfen tekrar giriş yapın.' })
        return
      }
      
      const res = await fetch('/api/admin/messages/clear', {
        method: 'POST',
        headers,
        body: JSON.stringify({ roomId })
      })
      const json = await res.json()
      if (!res.ok) {
        set({ error: json.error || 'Mesajlar silinemedi' })
      } else {
        set({ error: null })
      }
    } catch (error) {
      set({ error: 'Mesajlar silinemedi' })
    } finally {
      set({ isLoading: false })
    }
  },

  checkAdminStatus: () => {
    const isAdmin = adminAuth.isAdmin()
    set({ isAdmin })
  }
}))
