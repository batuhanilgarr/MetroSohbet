"use client"
import ReportsList from './ReportsList'
import { useEffect } from 'react'
import { useAdminStore } from '@/lib/admin-store'

interface ReportRow {
  id: string
  message_id: string
  reason: string
  created_at: string
}

interface MessageRow {
  id: string
  room_id: string
  nickname: string
  content: string
  created_at: string
}

export default function AdminReportsPage() {
  const { isAdmin, checkAdminStatus } = useAdminStore()

  useEffect(() => {
    checkAdminStatus()
  }, [checkAdminStatus])

  useEffect(() => {
    // sadece admin kontrolü yeterli; yüklemeyi iç bileşen yapıyor
  }, [isAdmin])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Raporlanan Mesajlar</h1>
            <a href="/admin" className="text-blue-600 hover:text-blue-800">← Admin Paneli</a>
          </div>
          <ReportsList />
        </div>
      </div>
    </div>
  )
}


