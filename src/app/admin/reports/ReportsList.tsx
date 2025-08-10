'use client'

import { useEffect, useState } from 'react'
import { useAdminStore } from '@/lib/admin-store'
import { Report } from '@/lib/supabase'

type ReportRow = Report

interface MessageRow {
  id: string
  room_id: string
  nickname: string
  content: string
  created_at: string
}

export default function ReportsList() {
  const { isAdmin, deleteMessage, banUser } = useAdminStore()
  const [rows, setRows] = useState<Array<{ report: ReportRow; message?: MessageRow }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'reviewing' | 'closed'>('all')

  useEffect(() => {
    if (!isAdmin) return
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

  const load = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/reports/list')
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Yüklenemedi')
      setRows(j.rows || [])
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Yüklenemedi'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const updateReportStatus = async (reportId: string, status: Report['status'], adminNotes?: string) => {
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status, 
          admin_notes: adminNotes || null,
          assigned_admin: 'Admin' // TODO: Get actual admin username
        })
      })

      if (response.ok) {
        await load() // Reload the list
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Durum güncellenirken hata oluştu')
      }
    } catch {
      setError('Durum güncellenirken hata oluştu')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'reviewing': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Yeni'
      case 'reviewing': return 'İnceleniyor'
      case 'closed': return 'Kapandı'
      default: return status
    }
  }

  const filteredRows = statusFilter === 'all' 
    ? rows 
    : rows.filter(({ report }) => report.status === statusFilter)

  if (!isAdmin) return <div>Yetkisiz erişim</div>

  return (
    <div className="space-y-6">
      {/* Status Filter */}
      <div className="flex space-x-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            statusFilter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Tümü ({rows.length})
        </button>
        <button
          onClick={() => setStatusFilter('new')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            statusFilter === 'new' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Yeni ({rows.filter(r => r.report.status === 'new').length})
        </button>
        <button
          onClick={() => setStatusFilter('reviewing')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            statusFilter === 'reviewing' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          İnceleniyor ({rows.filter(r => r.report.status === 'reviewing').length})
        </button>
        <button
          onClick={() => setStatusFilter('closed')}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            statusFilter === 'closed' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Kapandı ({rows.filter(r => r.report.status === 'closed').length})
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          {error && (
            <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>
          )}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Yükleniyor...</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sebep</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mesaj</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRows.map(({ report, message }) => (
                  <tr key={report.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.created_at).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{report.reason}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {message ? `${message.nickname}: ${message.content}` : 'Mesaj bulunamadı'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {message && (
                        <div className="flex flex-col space-y-2">
                          {/* Status Update Buttons */}
                          <div className="flex space-x-1">
                            {report.status === 'new' && (
                              <button
                                onClick={() => updateReportStatus(report.id, 'reviewing')}
                                className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs hover:bg-yellow-200"
                                title="İncelemeye Al"
                              >
                                🔍 İncele
                              </button>
                            )}
                            {report.status === 'reviewing' && (
                              <button
                                onClick={() => updateReportStatus(report.id, 'closed')}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                                title="Kapat"
                              >
                                ✅ Kapat
                              </button>
                            )}
                            {report.status === 'closed' && (
                              <button
                                onClick={() => updateReportStatus(report.id, 'new')}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                                title="Yeniden Aç"
                              >
                                🔄 Yeniden Aç
                              </button>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex space-x-1">
                            <button
                              onClick={async () => { await deleteMessage(message.id); await load() }}
                              className="text-red-600 hover:text-red-800 text-xs"
                              title="Mesajı Sil"
                            >
                              🗑️ Sil
                            </button>
                            <button
                              onClick={async () => { await fetch('/api/admin/messages/soft-delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: message.id }) }); await load() }}
                              className="text-gray-600 hover:text-gray-800 text-xs"
                              title="Soft Delete"
                            >
                              💤 Gizle
                            </button>
                            <button
                              onClick={async () => { await banUser(message.nickname); alert('Kullanıcı engellendi') }}
                              className="text-orange-600 hover:text-orange-800 text-xs"
                              title="Kullanıcıyı Engelle"
                            >
                              ⛔ Engelle
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}


