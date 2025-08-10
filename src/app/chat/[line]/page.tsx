'use client'

import { metroLines } from '@/lib/metro-data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState, use, useRef } from 'react'
import dynamic from 'next/dynamic'
const ImageModal = dynamic(() => import('./ImageModal'))
const LinkEmbed = dynamic(() => import('./LinkEmbed'))
const StationTagPicker = dynamic(() => import('./StationTagPicker'))
import StationSelector from './StationSelector'
const NicknameInput = dynamic(() => import('./NicknameInput'))
import { useChatStore, getRoomIdForLine, getRoomIdForLineAndStation } from '@/lib/chat-store'
import { imageUpload } from '@/lib/image-upload'
import { useAdminStore } from '@/lib/admin-store'
import { useRateLimit, RateLimitProgressBar, RateLimitError } from '@/lib/use-rate-limit'
import CrossLineAnnouncements from '@/components/CrossLineAnnouncements'

interface ChatPageProps {
  params: Promise<{
    line: string
  }>
}

export default function ChatPage({ params }: ChatPageProps) {
  const { line: lineName } = use(params)
  const line = metroLines.find(l => l.name === lineName)
  const [message, setMessage] = useState('')
  const [localNickname, setLocalNickname] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [stationLabel, setStationLabel] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [showNicknameModal, setShowNicknameModal] = useState<boolean>(false)
  
  const {
    messages,
    isLoading,
    error,
    nickname,
    typingNicknames,
    onlineUsersCount,
    onlineSessionsCount,
    sendMessage,
    loadMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    setNickname: setStoreNickname,
    setCurrentLine,
    setCurrentStation,
    initPresence,
    setTyping
  } = useChatStore()

  const { isAdmin, deleteMessage, banUser, clearAllMessages, checkAdminStatus } = useAdminStore()
  
  // Rate limit hook'u
  const rateLimit = useRateLimit('MESSAGE_SEND', localNickname || nickname || 'Anonim', async () => {
    // Bu sadece rate limit kontrolü için, gerçek mesaj gönderme handleSendMessage'da yapılıyor
    return new Response(JSON.stringify({ ok: true }), { status: 200 })
  })
  
  if (!line) {
    notFound()
  }

  // Chat odası ID'si - istasyon seçilmişse istasyon bazlı, yoksa hat bazlı
  const roomId = stationLabel 
    ? getRoomIdForLineAndStation(line.name, stationLabel)
    : getRoomIdForLine(line.name)

  // Pasif hat kontrolü (istemcide görüntüleme guard)
  // Not: En sağlam kontrol DB'den hat durumu okuyup server side guard koymaktır.

  useEffect(() => {
    // Admin status'u kontrol et
    checkAdminStatus()
    
    // Hat ve istasyon bilgisini store'a set et
    setCurrentLine(line.name)
    setCurrentStation(stationLabel)
    
    // Mesajları yükle ve realtime subscription başlat
    loadMessages(roomId)
    subscribeToMessages(roomId)
    initPresence(roomId, (localNickname || nickname || 'Anonim').trim())

    // Cleanup
    return () => {
      unsubscribeFromMessages()
    }
  }, [roomId, line.name, stationLabel, loadMessages, subscribeToMessages, unsubscribeFromMessages, checkAdminStatus, setCurrentLine, setCurrentStation])

  // İstasyon değiştiğinde oda değiştir
  useEffect(() => {
    if (stationLabel) {
      const newRoomId = getRoomIdForLineAndStation(line.name, stationLabel)
      // Önceki odadan çık
      unsubscribeFromMessages()
      // Yeni odaya gir
      loadMessages(newRoomId)
      subscribeToMessages(newRoomId)
      initPresence(newRoomId, (localNickname || nickname || 'Anonim').trim())
    } else {
      const newRoomId = getRoomIdForLine(line.name)
      // Önceki odadan çık
      unsubscribeFromMessages()
      // Yeni odaya gir
      loadMessages(newRoomId)
      subscribeToMessages(newRoomId)
      initPresence(newRoomId, (localNickname || nickname || 'Anonim').trim())
    }
  }, [stationLabel, line.name, loadMessages, subscribeToMessages, unsubscribeFromMessages, initPresence, localNickname, nickname])

  // ESC tuşu ile modal kapatma
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedImage(null)
      }
    }

    if (selectedImage) {
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [selectedImage])

  // İlk girişte nickname modal aç/kapat
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('nickname') || '' : ''
    const valid = /^[A-Za-z0-9_]{3,20}$/.test(saved)
    if (valid) {
      setLocalNickname(saved)
      setStoreNickname(saved)
      setShowNicknameModal(false)
    } else {
      setShowNicknameModal(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Yeni mesajlarda otomatik aşağı kaydır
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    const nick = (localNickname || '').trim()
    if (!/^[A-Za-z0-9_]{3,20}$/.test(nick)) {
      setShowNicknameModal(true)
      return
    }
    let contentToSend = message
    if (stationLabel) {
      contentToSend = `📍 [${stationLabel}] ${contentToSend}`
    }
    await sendMessage(contentToSend)
    setMessage('')
  }

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    
    try {
      // Resmi boyutlandır
      const resizedImage = await imageUpload.resizeImage(file)
      
      // Resmi yükle
      const result = await imageUpload.uploadImage(resizedImage)
      
      if (result.error) {
        alert(result.error)
        return
      }

      // Resim mesajı gönder
      await sendMessage(`[Resim] ${result.url}`)
      
    } catch (error) {
      alert('Resim yüklenemedi')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleAdminAction = async (action: 'delete' | 'ban', messageId: string, nickname?: string) => {
    if (!isAdmin) return

    if (action === 'delete') {
      if (confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
        await deleteMessage(messageId)
        // Mesajları yenile
        loadMessages(roomId)
      }
    } else if (action === 'ban' && nickname) {
      if (confirm(`${nickname} kullanıcısını engellemek istediğinizden emin misiniz?`)) {
        await banUser(nickname)
        alert('Kullanıcı engellendi')
      }
    }
  }

  const handleReportMessage = async (messageId: string) => {
    const reason = prompt('Rapor nedeni seçin: spam, küfür, taciz, diğer') || 'diğer'
    try {
      // client-side report limit per user
      if (typeof window !== 'undefined') {
        const key = `reported:${messageId}`
        if (localStorage.getItem(key)) {
          alert('Bu mesajı zaten raporladınız')
          return
        }
      }
      const res = await fetch('/api/messages/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message_id: messageId, reason, reporter_nickname: (localNickname || nickname || 'Anonim').trim() })
      })
      if (res.ok) {
        if (typeof window !== 'undefined') {
          const key = `reported:${messageId}`
          localStorage.setItem(key, '1')
        }
        alert('Mesaj raporlandı')
      } else {
        const j = await res.json().catch(() => ({}))
        alert('Raporlama başarısız: ' + (j.error || 'Hata'))
      }
    } catch (e) {
      alert('Raporlama başarısız')
    }
  }

  const handleSelfDelete = async (messageId: string) => {
    try {
      const res = await fetch('/api/messages/self-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: messageId, nickname: (localNickname || nickname || 'Anonim').trim() })
      })
      if (res.ok) {
        await loadMessages(roomId)
      } else {
        const j = await res.json().catch(() => ({}))
        alert('Silme başarısız: ' + (j.error || 'Hata'))
      }
    } catch (e) {
      alert('Silme başarısız')
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 rounded-full shadow-md"
                  style={{ backgroundColor: line.color }}
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {line.name} - {line.display_name}
                  </h1>
                  <p className="text-sm text-gray-500">Metro Sohbet Odası</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Aktif
                </span>
              </div>
              {isAdmin && (
                <button
                  onClick={async () => {
                    if (confirm('Tüm mesajları silmek istediğinizden emin misiniz?')) {
                      try {
                        await clearAllMessages(roomId)
                        await loadMessages(roomId)
                        alert('Tüm mesajlar başarıyla silindi')
                      } catch (error) {
                        alert('Mesajlar silinirken hata oluştu')
                      }
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                  Tüm Mesajları Temizle
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Cross-Line Announcements */}
          <CrossLineAnnouncements />

          {/* Station Selector */}
          <div className="hidden bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 mb-6 relative z-40">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">🚇 Metro Hattı & İstasyon Seçimi</h3>
              <p className="text-sm text-gray-600">
                Hangi metro hattında ve istasyonda olduğunuzu seçin. İstasyon seçimi yaparak o istasyondaki kullanıcılarla sohbet edebilirsiniz.
              </p>
            </div>
            <StationSelector
              currentLine={line.name}
              currentStation={stationLabel}
              onStationChange={setStationLabel}
              onLineChange={(newLine: string) => {
                // Hat değiştiğinde sayfayı yönlendir
                window.location.href = `/chat/${newLine}`
              }}
            />
          </div>

          {/* Chat Messages Area */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 min-h-[600px] mb-6">
            {/* Current Room Info */}
            {stationLabel && (
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">📍</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">
                        {stationLabel} İstasyonu - {line.name} Hattı
                      </h4>
                      <p className="text-sm text-green-600">
                        Bu istasyonda bulunan kullanıcılarla sohbet ediyorsunuz
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStationLabel(null)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  >
                    ❌ İstasyon Kaldır
                  </button>
                </div>
              </div>
            )}
            <div ref={messagesContainerRef} className="p-6 h-[600px] overflow-y-auto">
              {isLoading && messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p>Mesajlar yükleniyor...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="mb-4">
                    <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium">Henüz mesaj yok</p>
                  <p className="text-sm">İlk mesajı sen gönder!</p>
                </div>
              ) : (
                <div className="space-y-4">
                   {messages
                     .sort((a, b) => (a.is_pinned === b.is_pinned ? 0 : a.is_pinned ? -1 : 1))
                     .map((msg) => {
                    const currentNickname = (nickname?.trim() || 'Anonim')
                    const isMine = currentNickname === msg.nickname
                    return (
                      <div key={msg.id} className={`group rounded-lg p-2 transition-colors ${isMine ? 'flex justify-end' : ''}`}>
                        <div className={`flex items-start space-x-3 ${isMine ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className="flex-shrink-0">
                            {!isMine && (
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                <span className="text-sm font-bold text-white">
                                  {msg.nickname.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className={`flex items-center mb-2 ${isMine ? 'justify-end space-x-reverse space-x-2' : 'space-x-2'}`}>
                              {!isMine && (
                                <Link href={`/dm/${encodeURIComponent(msg.nickname)}`} className="text-sm font-semibold text-gray-900 hover:underline" title="DM gönder">
                                  {msg.nickname}
                                </Link>
                              )}
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {formatTime(msg.created_at)}
                              </span>
                               {msg.is_pinned && (
                                 <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full">Sabit</span>
                               )}
                              {isAdmin && (
                                <div className={`flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${isMine ? 'order-first' : ''}`}>
                                  <button
                                    onClick={() => handleAdminAction('delete', msg.id)}
                                    className="text-xs bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 p-2 rounded-full transition-colors"
                                    title="Mesajı Sil"
                                  >
                                    🗑️
                                  </button>
                                   <button
                                     onClick={async () => {
                                       await fetch('/api/admin/messages/pin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: msg.id, pin: !msg.is_pinned }) })
                                       await loadMessages(roomId)
                                     }}
                                     className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-600 hover:text-orange-800 p-2 rounded-full transition-colors"
                                     title={msg.is_pinned ? 'Sabit Kaldır' : 'Sabile' }
                                   >
                                     📌
                                   </button>
                                  <button
                                    onClick={() => handleAdminAction('ban', msg.id, msg.nickname)}
                                    className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-600 hover:text-orange-800 p-2 rounded-full transition-colors"
                                    title="Kullanıcıyı Engelle"
                                  >
                                    ⛔
                                  </button>
                                </div>
                              )}
                              {!isAdmin && (
                                <div className={`flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${isMine ? 'order-first' : ''}`}>
                                  {isMine ? (
                                    <button
                                      onClick={() => handleSelfDelete(msg.id)}
                                      className="text-xs bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 p-2 rounded-full transition-colors"
                                      title="Mesajımı Sil"
                                    >
                                      🗑️
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleReportMessage(msg.id)}
                                      className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 hover:text-yellow-800 p-2 rounded-full transition-colors"
                                      title="Raporla"
                                    >
                                      ⚠️
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className={`mt-1 ${isMine ? 'flex justify-end' : ''}`}>
                              {msg.content.startsWith('[Resim]') ? (
                                <div className="relative group">
                                  <img 
                                    src={msg.content.replace('[Resim] ', '')} 
                                    alt="Chat resmi"
                                    loading="lazy"
                                    decoding="async"
                                    referrerPolicy="no-referrer"
                                      sizes="(max-width: 768px) 70vw, 320px"
                                    className={`max-w-xs rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 ${isMine ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                    onClick={() => setSelectedImage(msg.content.replace('[Resim] ', ''))}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    📷
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className={`px-4 py-3 shadow-sm border border-gray-100 max-w-md ${isMine ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-gray-800 rounded-2xl rounded-tl-sm'}`}>
                                    {/* İstasyon bilgisi varsa göster */}
                                    {msg.content.startsWith('📍 [') && (
                                      <div className={`mb-2 text-xs ${isMine ? 'text-blue-100' : 'text-blue-600'} font-medium`}>
                                        📍 {msg.content.match(/📍 \[([^\]]+)\]/)?.[1]}
                                      </div>
                                    )}
                                    <p className={`text-sm leading-relaxed ${isMine ? 'text-white' : 'text-gray-800'}`}>
                                      {msg.content.startsWith('📍 [') 
                                        ? msg.content.replace(/📍 \[[^\]]+\] /, '') 
                                        : msg.content
                                      }
                                    </p>
                                  </div>
                                  <LinkEmbed content={msg.content} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex flex-col space-y-4">
              {/* Rate Limit Bilgileri */}
              {rateLimit.remaining > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <RateLimitProgressBar
                    remaining={rateLimit.remaining}
                    limit={10} // MESSAGE_SEND limit
                    progress={rateLimit.progress}
                    timeUntilReset={rateLimit.timeUntilReset}
                  />
                </div>
              )}
              
              {/* Rate Limit Error */}
              <RateLimitError 
                error={rateLimit.error} 
                timeUntilReset={rateLimit.timeUntilReset} 
              />
              
              {/* Message Input */}
              <div className="flex flex-col md:flex-row md:items-end gap-3 md:space-x-3">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mesajınız
                  </label>
                  <div className="relative">
                    <textarea
                      placeholder="Mesajınızı yazın..."
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value)
                        setTyping(!!e.target.value)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          if (message.trim() && !isUploading) {
                            // form submit
                            e.currentTarget.form?.requestSubmit()
                          }
                        }
                      }}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    />
                    <div className="absolute bottom-3 right-3 flex space-x-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
                        title="Resim Ekle"
                      >
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <span className="text-lg">📷</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!message.trim() || isUploading || rateLimit.isLimited}
                  className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium"
                >
                  {rateLimit.isLimited ? 'Rate Limit Aşıldı' : 'Gönder'}
                </button>
                <div className="md:ml-2 md:block hidden">
                  <StationTagPicker value={stationLabel} onChange={setStationLabel} lineName={line.name} />
                </div>
              </div>
              <div className="md:hidden">
                <StationTagPicker value={stationLabel} onChange={setStationLabel} lineName={line.name} />
              </div>
            </div>
          </form>
          {/* Presence bar */}
          <div className="mt-2 text-xs text-gray-500">
            <span>Çevrimiçi: {onlineSessionsCount ?? onlineUsersCount}</span>
            {typingNicknames.filter(n => n !== (localNickname || nickname)).length > 0 && (
              <span className="ml-4">
                {typingNicknames.filter(n => n !== (localNickname || nickname)).slice(0, 2).join(', ')} {typingNicknames.length > 2 ? 've diğerleri' : ''} yazıyor...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} />}

      {/* Nickname Modal */}
      {showNicknameModal && (
        <NicknameInput
          value={localNickname}
          onChange={setLocalNickname}
          onSubmit={(nickname) => {
            setStoreNickname(nickname)
            if (typeof window !== 'undefined') {
              localStorage.setItem('nickname', nickname)
            }
            setShowNicknameModal(false)
          }}
          onCancel={() => setShowNicknameModal(false)}
          initialValue={localNickname}
        />
      )}
    </div>
  )
}
