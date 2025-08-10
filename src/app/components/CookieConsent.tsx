'use client'

import { useState, useEffect } from 'react'
import { useCookies } from '@/lib/use-cookies'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const { consent, settings, updateConsent } = useCookies()

  useEffect(() => {
    // Cookie consent durumunu kontrol et
    if (!consent) {
      setShowBanner(true)
    }
  }, [consent])

  const acceptAll = () => {
    updateConsent('all', { analytics: true, functional: true })
    setShowBanner(false)
  }

  const acceptNecessary = () => {
    updateConsent('necessary', { analytics: false, functional: false })
    setShowBanner(false)
  }

  const saveSettings = () => {
    const analytics = document.getElementById('analytics') as HTMLInputElement
    const functional = document.getElementById('functional') as HTMLInputElement
    
    updateConsent('custom', { 
      analytics: analytics.checked, 
      functional: functional.checked 
    })
    
    setShowBanner(false)
    setShowSettings(false)
  }

  if (!showBanner) return null

  return (
          <div className="hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🍪</span>
                <h3 className="font-semibold text-gray-900">Çerez Kullanımı</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                MetroSohbet, deneyiminizi iyileştirmek için çerezler kullanır. 
                Zorunlu çerezler her zaman etkindir. Diğer çerezler için rızanızı verebilirsiniz.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline text-center lg:text-left"
              >
                Ayarlar
              </button>
              <button
                onClick={acceptNecessary}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Sadece Gerekli
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Tümünü Kabul Et
              </button>
            </div>
          </div>
        </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                🍪 Çerez Ayarları
              </h3>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900">Zorunlu Çerezler</h4>
                      <p className="text-sm text-green-700">Güvenlik ve temel işlevsellik için gerekli</p>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      Her zaman aktif
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">İşlevsel Çerezler</h4>
                      <p className="text-sm text-blue-700">Dil, tema gibi tercihleri hatırlar</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="functional"
                        defaultChecked={settings.functional}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-900">Analitik Çerezler</h4>
                      <p className="text-sm text-yellow-700">Site performansını anlamamıza yardımcı olur</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="analytics"
                        defaultChecked={settings.analytics}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Çerez ayarlarınızı daha sonra footer'daki "🍪 Çerez Politikası" linkinden değiştirebilirsiniz.
                </p>
              </div>
            </div>
            
            <div className="px-6 py-3 border-t flex justify-end gap-2 bg-gray-50">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={saveSettings}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
