"use client"
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          <div className="mb-4">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-700 text-2xl">404</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sayfa bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir.</p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow">
              Ana sayfaya dön
            </Link>
            <button onClick={() => window.history.back()} className="px-5 py-2.5 rounded-xl border hover:bg-gray-50">
              Geri git
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


