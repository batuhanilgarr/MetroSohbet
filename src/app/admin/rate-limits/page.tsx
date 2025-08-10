'use client'

import { useState, useEffect } from 'react'


interface RateLimitInfo {
  type: 'ip' | 'nickname'
  value: string
  action: string
  count: number
  limit: number
  remaining: number
  resetTime: number
  firstRequest: number
  lastRequest: number
  isBlocked: boolean
}

interface RateLimitStats {
  allLimits: RateLimitInfo[]
  blockedList: {
    ips: string[]
    nicknames: string[]
  }
  totalEntries: number
}

export default function RateLimitsPage() {
  const [stats, setStats] = useState<RateLimitStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [action, setAction] = useState<'block' | 'unblock' | 'reset'>('block')
  const [type, setType] = useState<'ip' | 'nickname'>('ip')
  const [value, setValue] = useState('')
  const [duration, setDuration] = useState(60) // dakika
  const [message, setMessage] = useState('')


  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 10000) // Her 10 saniyede bir güncelle
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/rate-limits')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch {
      console.error('Error fetching stats')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    if (!value.trim()) {
      setMessage('Lütfen bir değer girin')
      return
    }

    try {
      const response = await fetch('/api/admin/rate-limits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          type,
          value: value.trim(),
          duration: action === 'block' ? duration * 60 * 1000 : undefined
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(data.message)
        setValue('')
        fetchStats()
      } else {
        const error = await response.json()
        setMessage(error.error || 'Bir hata oluştu')
      }
    } catch {
      setMessage('Bir hata oluştu')
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('tr-TR')
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.ceil(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.ceil(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.ceil(minutes / 60)
    return `${hours}h`
  }

  if (loading) {
    return <div className="p-6">Yükleniyor...</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Rate Limit Yönetimi</h1>
        <p className="text-gray-600">
          Toplam {stats?.totalEntries || 0} rate limit kaydı bulunuyor
        </p>
      </div>

      {/* Action Panel */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-2">İşlem</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value as 'block' | 'unblock' | 'reset')}
              className="w-full p-2 border rounded"
            >
              <option value="block">Blokla</option>
              <option value="unblock">Unblock</option>
              <option value="reset">Sıfırla</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tip</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'ip' | 'nickname')}
              className="w-full p-2 border rounded"
            >
              <option value="ip">IP Adresi</option>
              <option value="nickname">Nickname</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Değer</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'ip' ? '192.168.1.1' : 'nickname'}
              className="w-full p-2 border rounded"
            />
          </div>
          {action === 'block' && (
            <div>
              <label className="block text-sm font-medium mb-2">Süre (dk)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="1"
                max="1440"
                className="w-full p-2 border rounded"
              />
            </div>
          )}
          <div>
            <button
              onClick={handleAction}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              {action === 'block' ? 'Blokla' : action === 'unblock' ? 'Unblock' : 'Sıfırla'}
            </button>
          </div>
        </div>
        {message && (
          <div className="mt-4 p-3 bg-blue-100 text-blue-800 rounded">
            {message}
          </div>
        )}
      </div>

      {/* Blocked List */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Bloklanmış Kullanıcılar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Bloklanmış IP&apos;ler ({stats?.blockedList.ips.length || 0})</h3>
            <div className="space-y-2">
              {stats?.blockedList.ips.map((ip) => (
                <div key={ip} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="font-mono">{ip}</span>
                  <button
                    onClick={() => {
                      setAction('unblock')
                      setType('ip')
                      setValue(ip)
                      handleAction()
                    }}
                    className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Unblock
                  </button>
                </div>
              ))}
              {(!stats?.blockedList.ips || stats.blockedList.ips.length === 0) && (
                <p className="text-gray-500">Bloklanmış IP bulunmuyor</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Bloklanmış Nickname&apos;ler ({stats?.blockedList.nicknames.length || 0})</h3>
            <div className="space-y-2">
              {stats?.blockedList.nicknames.map((nickname) => (
                <div key={nickname} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span>{nickname}</span>
                  <button
                    onClick={() => {
                      setAction('unblock')
                      setType('nickname')
                      setValue(nickname)
                      handleAction()
                    }}
                    className="text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Unblock
                  </button>
                </div>
              ))}
              {(!stats?.blockedList.nicknames || stats.blockedList.nicknames.length === 0) && (
                <p className="text-gray-500">Bloklanmış nickname bulunmuyor</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Active Rate Limits */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Aktif Rate Limit&apos;ler</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Tip</th>
                <th className="text-left p-2">Değer</th>
                <th className="text-left p-2">İşlem</th>
                <th className="text-left p-2">Kullanım</th>
                <th className="text-left p-2">Limit</th>
                <th className="text-left p-2">İlk İstek</th>
                <th className="text-left p-2">Son İstek</th>
                <th className="text-left p-2">Sıfırlanma</th>
                <th className="text-left p-2">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {stats?.allLimits.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.type === 'ip' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.type === 'ip' ? 'IP' : 'Nickname'}
                    </span>
                  </td>
                  <td className="p-2 font-mono text-sm">{item.value}</td>
                  <td className="p-2 text-sm">{item.action}</td>
                  <td className="p-2">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${
                        item.count >= item.limit ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {item.count}/{item.limit}
                      </span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.count >= item.limit ? 'bg-red-600' : 'bg-green-600'
                          }`}
                          style={{ width: `${Math.min((item.count / item.limit) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-sm">{item.limit}</td>
                  <td className="p-2 text-sm">{formatTime(item.firstRequest)}</td>
                  <td className="p-2 text-sm">{formatTime(item.lastRequest)}</td>
                  <td className="p-2 text-sm">
                    {formatDuration(item.resetTime - Date.now())}
                  </td>
                  <td className="p-2">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setAction('reset')
                          setType(item.type)
                          setValue(item.value)
                          handleAction()
                        }}
                        className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700"
                      >
                        Sıfırla
                      </button>
                      {!item.isBlocked ? (
                        <button
                          onClick={() => {
                            setAction('block')
                            setType(item.type)
                            setValue(item.value)
                            handleAction()
                          }}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Blokla
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setAction('unblock')
                            setType(item.type)
                            setValue(item.value)
                            handleAction()
                          }}
                          className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          Unblock
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!stats?.allLimits || stats.allLimits.length === 0) && (
            <p className="text-center text-gray-500 py-8">Aktif rate limit bulunmuyor</p>
          )}
        </div>
      </div>
    </div>
  )
}
