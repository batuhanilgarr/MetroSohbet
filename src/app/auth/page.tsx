'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null))
  }, [])

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus(null)
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/auth' } })
    if (error) setStatus(error.message)
    else setStatus('Giriş bağlantısı e-postanıza gönderildi')
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUserEmail(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border p-8">
          <h1 className="text-2xl font-bold mb-4">Hesap</h1>
          {userEmail ? (
            <div>
              <p className="mb-4">Giriş yapıldı: <strong>{userEmail}</strong></p>
              <button onClick={signOut} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Çıkış Yap</button>
            </div>
          ) : (
            <form onSubmit={signIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="w-full px-3 py-2 border rounded-md" placeholder="ornek@eposta.com" />
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Giriş Bağlantısı Gönder</button>
              {status && <p className="text-sm text-gray-600">{status}</p>}
            </form>
          )}
          <div className="mt-6">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">Ana sayfaya dön</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


