'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/lib/admin-store'
import Link from 'next/link'
import { CrossLineAnnouncement } from '@/lib/supabase'

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<CrossLineAnnouncement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<{
    title: string
    content: string
    announcement_type: CrossLineAnnouncement['announcement_type']
    priority: number
    starts_at: string
    expires_at: string
  }>({
    title: '',
    content: '',
    announcement_type: 'info',
    priority: 1,
    starts_at: new Date().toISOString().slice(0, 16),
    expires_at: ''
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const { isAdmin, checkAdminStatus } = useAdminStore()

  useEffect(() => {
    checkAdminStatus()
    if (isAdmin) {
      loadAnnouncements()
    }
  }, [isAdmin, checkAdminStatus])

  const loadAnnouncements = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/announcements', {
        headers: {
          'Authorization': 'Basic ' + btoa('admin@metrosohbet.com:admin123456')
        }
      })
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements)
      } else {
        setError('Duyurular yüklenirken hata oluştu')
      }
    } catch {
      setError('Duyurular yüklenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId 
        ? `/api/admin/announcements/${editingId}`
        : '/api/admin/announcements'
      
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin@metrosohbet.com:admin123456')
        },
        body: JSON.stringify({
          ...formData,
          expires_at: formData.expires_at || null
        })
      })

      if (response.ok) {
        setShowForm(false)
        setEditingId(null)
        setFormData({
          title: '',
          content: '',
          announcement_type: 'info',
          priority: 1,
          starts_at: new Date().toISOString().slice(0, 16),
          expires_at: ''
        })
        await loadAnnouncements()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Duyuru kaydedilirken hata oluştu')
      }
    } catch {
      setError('Duyuru kaydedilirken hata oluştu')
    }
  }

  const handleEdit = (announcement: CrossLineAnnouncement) => {
    setEditingId(announcement.id)
    setFormData({
      title: announcement.title,
      content: announcement.content,
      announcement_type: announcement.announcement_type,
      priority: announcement.priority,
      starts_at: new Date(announcement.starts_at).toISOString().slice(0, 16),
      expires_at: announcement.expires_at ? new Date(announcement.expires_at).toISOString().slice(0, 16) : ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) return
    
    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin@metrosohbet.com:admin123456')
        }
      })

      if (response.ok) {
        await loadAnnouncements()
      } else {
        setError('Duyuru silinirken hata oluştu')
      }
    } catch {
      setError('Duyuru silinirken hata oluştu')
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin@metrosohbet.com:admin123456')
        },
        body: JSON.stringify({ action: 'toggle' })
      })

      if (response.ok) {
        await loadAnnouncements()
      } else {
        setError('Durum değiştirilirken hata oluştu')
      }
    } catch {
      setError('Durum değiştirilirken hata oluştu')
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'shutdown': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h1>
          <p className="text-gray-600">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Admin Paneline Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hatlar Arası Duyurular</h1>
              <p className="text-gray-600 mt-2">Tüm metro hatlarında görünecek duyuruları yönetin</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Admin Paneli
              </Link>
              <button
                onClick={() => {
                  setShowForm(true)
                  setEditingId(null)
                  setFormData({
                    title: '',
                    content: '',
                    announcement_type: 'info',
                    priority: 1,
                    starts_at: new Date().toISOString().slice(0, 16),
                    expires_at: ''
                  })
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Yeni Duyuru
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-red-600 hover:text-red-800 text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? 'Duyuruyu Düzenle' : 'Yeni Duyuru'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlık *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      maxLength={200}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tip *
                    </label>
                    <select
                      value={formData.announcement_type}
                      onChange={(e) => setFormData({ ...formData, announcement_type: e.target.value as CrossLineAnnouncement['announcement_type'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="info">Bilgi</option>
                      <option value="warning">Uyarı</option>
                      <option value="error">Hata</option>
                      <option value="shutdown">Kapatma</option>
                      <option value="maintenance">Bakım</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Öncelik
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>1 - Düşük</option>
                      <option value={2}>2 - Normal</option>
                      <option value={3}>3 - Yüksek</option>
                      <option value={4}>4 - Kritik</option>
                      <option value={5}>5 - Acil</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlangıç Zamanı
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.starts_at}
                      onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bitiş Zamanı (Opsiyonel)
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    İçerik *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength={2000}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingId ? 'Güncelle' : 'Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Announcements List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Mevcut Duyurular</h3>
            </div>
            
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Duyurular yükleniyor...</p>
              </div>
            ) : announcements.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>Henüz duyuru bulunmamaktadır.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(announcement.announcement_type)}`}>
                            {getTypeIcon(announcement.announcement_type)} {announcement.announcement_type}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            announcement.priority >= 4 ? 'bg-red-100 text-red-800' : 
                            announcement.priority >= 3 ? 'bg-orange-100 text-orange-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            Öncelik: {announcement.priority}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            announcement.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {announcement.is_active ? 'Aktif' : 'Pasif'}
                          </span>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{announcement.title}</h4>
                        <p className="text-gray-700 mb-3 whitespace-pre-wrap">{announcement.content}</p>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>Başlangıç: {new Date(announcement.starts_at).toLocaleString('tr-TR')}</p>
                          {announcement.expires_at && (
                            <p>Bitiş: {new Date(announcement.expires_at).toLocaleString('tr-TR')}</p>
                          )}
                          <p>Oluşturan: {announcement.created_by}</p>
                          <p>Oluşturulma: {new Date(announcement.created_at).toLocaleString('tr-TR')}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => handleEdit(announcement)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleToggleStatus(announcement.id)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            announcement.is_active
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {announcement.is_active ? 'Pasif Yap' : 'Aktif Yap'}
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
