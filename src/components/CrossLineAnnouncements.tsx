'use client'

import { useState, useEffect } from 'react'
import { CrossLineAnnouncement } from '@/lib/supabase'

export default function CrossLineAnnouncements() {
  const [announcements, setAnnouncements] = useState<CrossLineAnnouncement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAnnouncements()
    
    // Refresh announcements every 5 minutes
    const interval = setInterval(loadAnnouncements, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true)
      console.log('Loading announcements...')
      const response = await fetch('/api/announcements')
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Announcements data:', data)
        setAnnouncements(data.announcements || [])
      } else {
        console.error('Response not ok:', response.status, response.statusText)
        setError('Duyurular yüklenirken hata oluştu')
      }
    } catch (error) {
      console.error('Error loading announcements:', error)
      setError('Duyurular yüklenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'error': return 'bg-red-50 border-red-200 text-red-800'
      case 'shutdown': return 'bg-red-50 border-red-200 text-red-800'
      case 'maintenance': return 'bg-orange-50 border-orange-200 text-orange-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return 'ℹ️'
      case 'warning': return '⚠️'
      case 'error': return '❌'
      case 'shutdown': return '🛑'
      case 'maintenance': return '🔧'
      default: return '📢'
    }
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'border-l-4 border-l-red-500'
    if (priority >= 3) return 'border-l-4 border-l-orange-500'
    return 'border-l-4 border-l-blue-500'
  }

  if (isLoading) {
    return (
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-6 w-6"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={loadAnnouncements}
          className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
        >
          Tekrar Dene
        </button>
      </div>
    )
  }

  if (announcements.length === 0) {
    return null
  }

  return (
    <div className="mb-6 space-y-4">
      {announcements.map((announcement) => (
        <div
          key={announcement.id}
          className={`p-4 rounded-lg border ${getTypeColor(announcement.announcement_type)} ${getPriorityColor(announcement.priority)}`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 text-lg">
              {getTypeIcon(announcement.announcement_type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-sm font-semibold">
                  {announcement.title}
                </h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  announcement.priority >= 4 ? 'bg-red-100 text-red-800' : 
                  announcement.priority >= 3 ? 'bg-orange-100 text-orange-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  Öncelik: {announcement.priority}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">
                {announcement.content}
              </p>
              <div className="mt-2 text-xs opacity-75">
                {announcement.expires_at && (
                  <span>
                    Bitiş: {new Date(announcement.expires_at).toLocaleString('tr-TR')} •{' '}
                  </span>
                )}
                <span>
                  {new Date(announcement.created_at).toLocaleString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
