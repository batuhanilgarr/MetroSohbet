'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null)
  const [nickname, setNickname] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
      const saved = typeof window !== 'undefined' ? localStorage.getItem('nickname') || '' : ''
      setNickname(saved)
    })
  }, [])

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^\w{3,20}$/.test(nickname)) return alert('Geçerli bir kullanıcı adı girin')
    localStorage.setItem('nickname', nickname)
    alert('Profil kaydedildi')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border p-8">
          <h1 className="text-2xl font-bold mb-4">Profil</h1>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
              <input value={email ?? ''} disabled className="w-full px-3 py-2 border rounded-md bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kullanıcı adı</label>
              <input value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder="ornek_kullanici" />
            </div>
            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Kaydet</button>
          </form>
          <div className="mt-6">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">Ana sayfaya dön</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


