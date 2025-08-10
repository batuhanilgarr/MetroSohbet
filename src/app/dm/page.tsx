'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface DMRow {
  id: string
  thread_key: string
  from_nick: string
  to_nick: string
  content: string
  created_at: string
}

export default function DMInboxPage() {
  const [nickname, setNickname] = useState('')
  const [threads, setThreads] = useState<Array<{ peer: string; last: DMRow | null }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const nick = typeof window !== 'undefined' ? localStorage.getItem('nickname') || '' : ''
    setNickname(nick)
  }, [])

  useEffect(() => {
    if (!nickname) return
    loadInbox()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nickname])

  async function loadInbox() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('dms')
        .select('*')
        .or(`from_nick.eq.${nickname},to_nick.eq.${nickname}`)
        .order('created_at', { ascending: false })
        .limit(200)

      const map = new Map<string, DMRow>()
      for (const row of (data || []) as DMRow[]) {
        const peer = row.from_nick === nickname ? row.to_nick : row.from_nick
        if (!map.has(peer)) map.set(peer, row)
      }
      setThreads(Array.from(map.entries()).map(([peer, last]) => ({ peer, last })))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl border p-6">
          <h1 className="text-2xl font-bold mb-4">Mesajlar</h1>
          {loading ? (
            <p>Yükleniyor…</p>
          ) : threads.length === 0 ? (
            <p>Henüz DM yok.</p>
          ) : (
            <ul className="divide-y">
              {threads.map((t) => (
                <li key={t.peer} className="py-3">
                  <Link href={`/dm/${encodeURIComponent(t.peer)}`} className="flex items-center justify-between hover:opacity-80">
                    <div>
                      <div className="font-semibold">{t.peer}</div>
                      <div className="text-sm text-gray-500 max-w-md truncate">{t.last?.content}</div>
                    </div>
                    <div className="text-xs text-gray-400">{t.last ? new Date(t.last.created_at).toLocaleString('tr-TR') : ''}</div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}


