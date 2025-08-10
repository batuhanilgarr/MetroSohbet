'use client'

import { useEffect, useState } from 'react'

export default function GateInner() {
  const [nick, setNick] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('nickname') || '' : ''
    setNick(saved)
    setReady(true)
  }, [])

  if (!ready) return null
  if (nick && /^\w{3,20}$/.test(nick)) return null

  return (
    <div className="max-w-2xl mx-auto mb-8 bg-white rounded-xl shadow border p-4">
      <h2 className="text-lg font-semibold mb-2">Kullanıcı adı belirleyin</h2>
      <p className="text-sm text-gray-600 mb-3">3-20 karakter, harf/rakam/alt çizgi (_)</p>
      <form onSubmit={async (e) => {
        e.preventDefault()
        const form = e.currentTarget as HTMLFormElement
        const input = form.elements.namedItem('nickname') as HTMLInputElement
        const v = (input.value || '').trim()
        if (!/^\w{3,20}$/.test(v)) return alert('Geçerli bir kullanıcı adı girin')
        try {
          const res = await fetch('/api/nickname/check', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nickname: v }) })
          const j = await res.json()
          if (!j.ok) {
            const map: Record<string, string> = { format: 'Format geçersiz', prohibited: 'Uygunsuz içerik', banned: 'Bu isim engellenmiş', server: 'Sunucu hatası', unknown: 'Hata' }
            return alert(map[j.reason] || 'Kullanıcı adı uygun değil')
          }
        } catch {}
        localStorage.setItem('nickname', v)
        setNick(v)
      }} className="flex space-x-3">
        <input name="nickname" defaultValue={nick} className="flex-1 px-3 py-2 border rounded-md" placeholder="ornek_kullanici" />
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Kaydet</button>
      </form>
    </div>
  )
}


