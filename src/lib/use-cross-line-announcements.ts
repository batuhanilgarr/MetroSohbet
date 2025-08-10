import { useState, useEffect } from 'react'
import { CrossLineAnnouncement } from '@/lib/supabase'

export function useCrossLineAnnouncements() {
  const [announcements, setAnnouncements] = useState<CrossLineAnnouncement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/announcements')
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements || [])
      } else {
        setError('Duyurular yüklenirken hata oluştu')
      }
    } catch {
      setError('Duyurular yüklenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnnouncements()
    
    // Refresh announcements every 5 minutes
    const interval = setInterval(loadAnnouncements, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const getActiveAnnouncements = () => {
    const now = new Date()
    return announcements.filter(announcement => {
      if (!announcement.is_active) return false
      if (new Date(announcement.starts_at) > now) return false
      if (announcement.expires_at && new Date(announcement.expires_at) <= now) return false
      return true
    }).sort((a, b) => {
      // Sort by priority (highest first), then by creation date (newest first)
      if (b.priority !== a.priority) {
        return b.priority - a.priority
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }

  const getAnnouncementsByType = (type: CrossLineAnnouncement['announcement_type']) => {
    return getActiveAnnouncements().filter(a => a.announcement_type === type)
  }

  const hasCriticalAnnouncements = () => {
    return getActiveAnnouncements().some(a => a.priority >= 4)
  }

  return {
    announcements,
    activeAnnouncements: getActiveAnnouncements(),
    isLoading,
    error,
    loadAnnouncements,
    getAnnouncementsByType,
    hasCriticalAnnouncements
  }
}
