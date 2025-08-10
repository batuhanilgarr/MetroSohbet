'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/lib/admin-store'
import { supabase } from '@/lib/supabase'

interface Message {
  id: string
  room_id: string
  nickname: string
  content: string
  created_at: string
  image_url?: string
}

export default function MessagesList() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAdmin, deleteMessage, banUser } = useAdminStore()

  useEffect(() => {
    if (!isAdmin) return
    loadMessages()
  }, [isAdmin])

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      if (error) setError(error.message)
      else setMessages(data || [])
    } catch {
      setError('Mesajlar yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (timestamp: string) => new Date(timestamp).toLocaleString('tr-TR')

  if (!isAdmin) return <div>Yetkisiz erişim</div>

  if (isLoading) return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p>Mesajlar yükleniyor...</p>
    </div>
  )

  if (error) return <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesaj</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oda</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages.map((message) => (
              <tr key={message.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{message.nickname}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {message.content.startsWith('[Resim]') ? <span className="text-blue-600">📷 Resim</span> : message.content}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{message.room_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{formatTime(message.created_at)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button onClick={async () => { await deleteMessage(message.id); await loadMessages() }} className="text-red-600 hover:text-red-800 text-sm" title="Mesajı Sil">🗑️ Sil</button>
                    <button onClick={async () => { await banUser(message.nickname) }} className="text-orange-600 hover:text-orange-800 text-sm" title="Kullanıcıyı Engelle">⛔ Engelle</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


