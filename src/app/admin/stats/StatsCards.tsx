'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Stats {
  totalMessages: number
  totalUsers: number
  totalBannedUsers: number
  activeLines: number
  todayMessages: number
}

export default function StatsCards() {
  const [stats, setStats] = useState<Stats>({ totalMessages: 0, totalUsers: 0, totalBannedUsers: 0, activeLines: 0, todayMessages: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    try {
      const { count: totalMessages } = await supabase.from('messages').select('*', { count: 'exact', head: true })
      const { data: users } = await supabase.from('messages').select('nickname').not('nickname', 'eq', 'Anonim')
      const uniqueUsers = new Set(users?.map(u => u.nickname) || []).size
      const { count: totalBannedUsers } = await supabase.from('banned_users').select('*', { count: 'exact', head: true })
      const { count: activeLines } = await supabase.from('metro_lines').select('*', { count: 'exact', head: true }).eq('is_active', true)
      const today = new Date(); today.setHours(0,0,0,0)
      const { count: todayMessages } = await supabase.from('messages').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString())
      setStats({ totalMessages: totalMessages || 0, totalUsers: uniqueUsers, totalBannedUsers: totalBannedUsers || 0, activeLines: activeLines || 0, todayMessages: todayMessages || 0 })
    } catch {
      setError('İstatistikler yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p>İstatistikler yükleniyor...</p>
    </div>
  )
  if (error) return <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md"><p className="text-sm text-red-600">{error}</p></div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { label: 'Toplam Mesaj', value: stats.totalMessages, color: 'blue', icon: '💬' },
        { label: 'Bugünkü Mesaj', value: stats.todayMessages, color: 'green', icon: '📅' },
        { label: 'Toplam Kullanıcı', value: stats.totalUsers, color: 'purple', icon: '👥' },
        { label: 'Engellenen Kullanıcı', value: stats.totalBannedUsers, color: 'red', icon: '⛔' },
        { label: 'Aktif Hat', value: stats.activeLines, color: 'orange', icon: '🚇' },
      ].map((c) => (
        <div key={c.label} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 bg-${c.color}-100 rounded-full flex items-center justify-center`}>
                <span className={`text-${c.color}-600 text-lg`}>{c.icon}</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{c.label}</p>
              <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


