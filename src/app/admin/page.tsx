'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/lib/admin-store'

import Link from 'next/link'

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  const { isAdmin, isLoading, error, login, logout, checkAdminStatus, clearAllMessages } = useAdminStore()

  useEffect(() => {
    checkAdminStatus()
    if (isAdmin) {
      setIsLoggedIn(true)
    }
  }, [isAdmin, checkAdminStatus])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Paneli</h1>
              <div className="flex items-center space-x-4">
                <Link 
                  href="/"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Ana Sayfa
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>

            {/* Admin Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Metro Hatları Yönetimi */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Metro Hatları</h3>
                <div className="space-y-2">
                  <Link 
                    href="/admin/lines"
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
                  >
                    Hatları Yönet
                  </Link>
                </div>
              </div>

              {/* Mesaj Yönetimi */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mesaj Yönetimi</h3>
                <div className="space-y-2">
                  <Link 
                    href="/admin/messages"
                    className="block w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
                  >
                    Mesajları Görüntüle
                  </Link>
                  <Link 
                    href="/admin/reports"
                    className="block w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-center"
                  >
                    Raporlanan Mesajlar
                  </Link>
                </div>
              </div>

              {/* Kullanıcı Yönetimi */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanıcı Yönetimi</h3>
                <div className="space-y-2">
                  <Link 
                    href="/admin/users"
                    className="block w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-center"
                  >
                    Kullanıcıları Yönet
                  </Link>
                </div>
              </div>

              {/* İstatistikler */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">İstatistikler</h3>
                <div className="space-y-2">
                  <Link 
                    href="/admin/stats"
                    className="block w-full px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-center"
                  >
                    İstatistikleri Görüntüle
                  </Link>
                </div>
              </div>

              {/* Sistem Ayarları */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Ayarları</h3>
                <div className="space-y-2">
                  <Link 
                    href="/admin/settings"
                    className="block w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-center"
                  >
                    Ayarları Düzenle
                  </Link>
                </div>
              </div>

              {/* Rate Limit Yönetimi */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Limit Yönetimi</h3>
                <div className="space-y-2">
                  <Link 
                    href="/admin/rate-limits"
                    className="block w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-center"
                  >
                    Rate Limit&apos;leri Yönet
                  </Link>
                </div>
              </div>

              {/* Hatlar Arası Duyurular */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hatlar Arası Duyurular</h3>
                <div className="space-y-2">
                  <Link 
                    href="/admin/announcements"
                    className="block w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-center"
                  >
                    Duyuruları Yönet
                  </Link>
                </div>
              </div>

              {/* Hızlı İşlemler */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h3>
                <div className="space-y-2">
                  <button 
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
                    onClick={async () => {
                      if (confirm('Tüm odalardaki tüm mesajlar silinecek. Emin misiniz?')) {
                        try {
                          await clearAllMessages()
                          alert('Tüm mesajlar silindi')
                        } catch (error) {
                          alert('Silme başarısız: ' + error)
                        }
                      }
                    }}
                  >
                    Tüm Mesajları Temizle
                  </button>
                  <button className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    Engellenen Kullanıcıları Görüntüle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Girişi</h1>
            <p className="text-gray-600 mt-2">MetroSohbet Admin Paneli</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-posta
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@metrosohbet.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
