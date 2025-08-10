"use client"
import { useEffect } from 'react'
import { useAdminStore } from '@/lib/admin-store'
import Link from 'next/link'
import SettingsForm from './SettingsForm'

export default function AdminSettingsPage() {
  const { isAdmin, checkAdminStatus } = useAdminStore()
  useEffect(() => { checkAdminStatus() }, [checkAdminStatus])
  if (!isAdmin) return <div>Yetkisiz erişim</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sistem Ayarları</h1>
            <div className="flex items-center space-x-4">
              <Link 
                href="/admin"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Admin Paneli
              </Link>
            </div>
          </div>

          <SettingsForm />
        </div>
      </div>
    </div>
  )
}
