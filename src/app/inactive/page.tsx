'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState, Suspense } from 'react'

function InactivePageContent() {
  const sp = useSearchParams()
  const line = sp.get('line') || 'Hat'
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    alert('Talebiniz alındı. Hat aktif olduğunda size haber vereceğiz.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <div className="bg-white rounded-2xl shadow-xl border p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{line} şu anda pasif</h1>
          <p className="text-gray-600 mb-6">Bu hat için sohbet geçici olarak kapalı. Aktif olduğunda bildirim almak istersen e-posta bırakabilirsin.</p>
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ornek@eposta.com"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Beni haberdar et</button>
          </form>
          <div className="mt-6">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">Ana sayfaya dön</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InactivePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    }>
      <InactivePageContent />
    </Suspense>
  )
}


