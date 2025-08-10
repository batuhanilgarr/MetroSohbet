'use client'

import { useState } from 'react'
import { useAdminStore } from '@/lib/admin-store'

export default function SettingsForm() {
  const [settings, setSettings] = useState({
    maxMessageLength: 500,
    maxImageSize: 5,
    allowImages: true,
    allowAnonymous: true,
    autoModeration: false
  })

  const { isAdmin } = useAdminStore()
  if (!isAdmin) return <div>Yetkisiz erişim</div>

  const handleSettingChange = (key: string, value: string | number | boolean) => setSettings((s) => ({ ...s, [key]: value }))
  const handleSaveSettings = () => alert('Ayarlar kaydedildi!')

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mesaj Ayarları</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Mesaj Uzunluğu</label>
              <input type="number" value={settings.maxMessageLength} onChange={(e) => handleSettingChange('maxMessageLength', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" min={100} max={1000} />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="allowAnonymous" checked={settings.allowAnonymous} onChange={(e) => handleSettingChange('allowAnonymous', e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="allowAnonymous" className="ml-2 block text-sm text-gray-900">Anonim kullanıma izin ver</label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resim Ayarları</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="allowImages" checked={settings.allowImages} onChange={(e) => handleSettingChange('allowImages', e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="allowImages" className="ml-2 block text-sm text-gray-900">Resim paylaşımına izin ver</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Resim Boyutu (MB)</label>
              <input type="number" value={settings.maxImageSize} onChange={(e) => handleSettingChange('maxImageSize', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" min={1} max={10} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Moderasyon Ayarları</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input type="checkbox" id="autoModeration" checked={settings.autoModeration} onChange={(e) => handleSettingChange('autoModeration', e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="autoModeration" className="ml-2 block text-sm text-gray-900">Otomatik moderasyon aktif</label>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button onClick={handleSaveSettings} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">Ayarları Kaydet</button>
        </div>
      </div>
    </div>
  )
}


