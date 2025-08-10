import Link from 'next/link'
import { supabase, type MetroLine } from '@/lib/supabase'
import { use, cache } from 'react'
import NicknameGate from '@/app/nickname-gate'

export const revalidate = 60

function getSavedNickname(): string {
  if (typeof window === 'undefined') return ''
  try { return localStorage.getItem('nickname') || '' } catch { return '' }
}

const getLines = cache(async (): Promise<Pick<MetroLine, 'name' | 'display_name' | 'color' | 'is_active'>[]> => {
  try {
    const { data } = await supabase.from('metro_lines').select('name,display_name,color,is_active').order('name')
    return data || []
  } catch {
    return []
  }
})

export default function Home() {
  // Server Component; fetch active lines
  const lines = use(getLines())
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MetroSohbet 🚇
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Metrodayken metrodakilerle konuş. İstanbul metro hatlarına özel anonim sohbet platformu.
          </p>
        </header>

        {/* Nickname Prompt */}
        <NicknameGate />

        {/* Metro Lines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {lines.map((line) => (
            <Link
              key={line.name}
              href={line.is_active ? `/chat/${line.name}` : '#'}
              className={`group block ${line.is_active ? '' : 'pointer-events-none opacity-60'}`}
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: line.color }}
                      />
                      <h3 className="text-xl font-semibold text-gray-900">
                        {line.name}
                      </h3>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{line.display_name}</p>
                  <div className="mt-4 flex items-center text-xs text-gray-500">
                    {line.is_active ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">Aktif</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-800">Pasif</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-500">
          <p className="text-sm">
            MetroSohbet - Metrodayken metrodakilerle konuş 🚇💬
          </p>
          <div className="mt-4">
            <Link 
              href="/admin"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Admin Paneli
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

// Client component imported above
