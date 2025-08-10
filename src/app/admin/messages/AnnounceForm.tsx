'use client'

import { useState } from 'react'
import { metroLines } from '@/lib/metro-data'
import { getRoomIdForLine } from '@/lib/chat-store'
import { useAdminStore } from '@/lib/admin-store'

export default function AnnounceForm() {
  const [line, setLine] = useState(metroLines[0]?.name || '')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const { isAdmin } = useAdminStore()
  if (!isAdmin) return null

  const send = async () => {
    const content = text.trim()
    if (!line || !content) return
    setBusy(true)
    try {
      const room_id = getRoomIdForLine(line)
      const res = await fetch('/api/admin/messages/announce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id, content, nickname: 'Admin' })
      })
      if (res.ok) {
        setText('')
        try { window.dispatchEvent(new CustomEvent('admin:announceSent')) } catch {}
        alert('Duyuru gönderildi')
      } else {
        const j = await res.json().catch(() => ({}))
        alert('Gönderilemedi: ' + (j.error || 'Hata'))
      }
    } catch {
      alert('Gönderilemedi')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Duyuru Gönder</h2>
      <div className="flex flex-col md:flex-row gap-3 items-stretch">
        <select value={line} onChange={(e) => setLine(e.target.value)} className="md:w-48 px-3 py-2 border rounded-md">
          {metroLines.map((l) => (
            <option key={l.name} value={l.name}>{l.name} - {l.display_name}</option>
          ))}
        </select>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} className="flex-1 px-3 py-2 border rounded-md" placeholder="Duyuru metni" />
        <button onClick={send} disabled={!text.trim() || busy} className="md:w-40 px-4 py-2 bg-orange-600 text-white rounded-md disabled:opacity-50">Gönder</button>
      </div>
    </div>
  )
}


