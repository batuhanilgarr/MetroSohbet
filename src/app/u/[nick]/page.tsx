'use client'

import { use } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface ProfilePageProps { params: Promise<{ nick: string }> }

export default function UserProfilePage({ params }: ProfilePageProps) {
  const { nick } = use(params)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">@{nick}</h1>
            <Link href={`/dm/${encodeURIComponent(nick)}`} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">DM Gönder</Link>
          </div>
          <p className="text-sm text-gray-600 mb-6">Kullanıcının son mesajları</p>
          <RecentMessages nick={nick} />
        </div>
      </div>
    </div>
  )
}

function RecentMessages({ nick }: { nick: string }) {
  // basit server component fetch
  // not: this component runs on server by default
  // we fetch last 20 messages by nickname
  // using supabase server client isn't available here; use REST
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  const url = `${base}/rest/v1/messages?select=content,created_at,room_id&nickname=eq.${encodeURIComponent(nick)}&order=created_at.desc&limit=20`

  const data = use(fetch(url, { headers: { apikey: anon, Authorization: `Bearer ${anon}` }, cache: 'no-store' }).then(res => res.json())) as Array<{ content: string; created_at: string; room_id: string }>
  if (!data || data.length === 0) return <p className="text-sm text-gray-500">Henüz mesaj yok.</p>
  return (
    <ul className="space-y-3">
      {data.map((m, idx) => (
        <li key={idx} className="p-3 border rounded-lg bg-gray-50">
          <div className="text-xs text-gray-500 mb-1">{new Date(m.created_at).toLocaleString('tr-TR')}</div>
          <div className="text-sm text-gray-800 whitespace-pre-wrap">{m.content}</div>
        </li>
      ))}
    </ul>
  )
}


