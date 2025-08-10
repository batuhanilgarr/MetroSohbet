'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/lib/admin-store'
import { supabase } from '@/lib/supabase'

interface BannedUser {
  id: string
  nickname: string
  banned_at: string
  banned_by: string
  reason?: string
}

export default function UsersList() {
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAdmin } = useAdminStore()

  useEffect(() => {
    if (!isAdmin) return
    loadBannedUsers()
  }, [isAdmin])

  const loadBannedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('banned_users')
        .select('*')
        .order('banned_at', { ascending: false })
      if (error) setError(error.message)
      else setBannedUsers(data || [])
    } catch {
      setError('Engellenen kullanıcılar yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnbanUser = async (nickname: string) => {
    if (!confirm(`${nickname} kullanıcısının engelini kaldırmak istediğinizden emin misiniz?`)) return
    try {
      const { error } = await supabase.from('banned_users').delete().eq('nickname', nickname)
      if (error) alert('Engel kaldırılamadı: ' + error.message)
      else {
        alert('Kullanıcının engeli kaldırıldı')
        loadBannedUsers()
      }
    } catch {
      alert('Engel kaldırılamadı')
    }
  }

  const formatTime = (timestamp: string) => new Date(timestamp).toLocaleString('tr-TR')

  if (!isAdmin) return <div>Yetkisiz erişim</div>

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Engellenen Kullanıcılar</h2>
        <p className="text-sm text-gray-600 mt-1">Toplam {bannedUsers.length} engellenen kullanıcı</p>
      </div>
      {error && (
        <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>
      )}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Kullanıcılar yükleniyor...</p>
        </div>
      ) : bannedUsers.length === 0 ? (
        <div className="px-6 py-8 text-center text-gray-500">
          <p>Henüz engellenen kullanıcı yok</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engel Tarihi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engelleyen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sebep</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bannedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.nickname}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatTime(user.banned_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.banned_by}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.reason || 'Belirtilmemiş'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleUnbanUser(user.nickname)} className="text-green-600 hover:text-green-800 text-sm" title="Engeli Kaldır">
                      ✅ Engel Kaldır
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}


