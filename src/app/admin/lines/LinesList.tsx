'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface MetroLine {
  id: string
  name: string
  display_name: string
  color: string
  is_active: boolean
  created_at: string
}

export default function LinesList() {
  const [lines, setLines] = useState<MetroLine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadLines()
  }, [])

  async function loadLines() {
    try {
      const { data, error } = await supabase
        .from('metro_lines')
        .select('*')
        .order('name', { ascending: true })
      if (error) setError(error.message)
      else setLines(data || [])
    } catch {
      setError('Metro hatları yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleToggleLine(lineId: string, currentStatus: boolean) {
    try {
      const res = await fetch('/api/admin/lines/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: lineId, is_active: !currentStatus })
      })
      const json = await res.json()
      if (!res.ok) {
        alert('Durum güncellenemedi: ' + (json.error || 'Bilinmeyen hata'))
      } else {
        await loadLines()
        alert(`Hat ${!currentStatus ? 'aktifleştirildi' : 'devre dışı bırakıldı'}`)
      }
    } catch {
      alert('Durum güncellenemedi')
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Metro hatları yükleniyor...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {error && (
        <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renk</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {lines.map((line) => (
              <tr key={line.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{line.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{line.display_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: line.color }} />
                    <span className="text-sm text-gray-500">{line.color}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${line.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {line.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleLine(line.id, line.is_active)}
                    className={`text-sm px-3 py-1 rounded-md transition-colors ${line.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                  >
                    {line.is_active ? 'Devre Dışı Bırak' : 'Aktifleştir'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


