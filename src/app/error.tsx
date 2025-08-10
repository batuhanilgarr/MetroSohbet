'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('Global error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
              <div className="mb-4">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-orange-700 text-2xl">!</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Bir şeyler ters gitti</h1>
              <p className="text-gray-600 mb-6">Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => reset()} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow">
                  Tekrar dene
                </button>
                <Link href="/" className="px-5 py-2.5 rounded-xl border hover:bg-gray-50">Ana sayfaya dön</Link>
              </div>
              {error?.digest && (
                <div className="mt-4 text-[11px] text-gray-400">Hata kodu: {error.digest}</div>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}


