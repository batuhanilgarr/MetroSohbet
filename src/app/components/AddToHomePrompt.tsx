'use client'

import { useEffect, useRef, useState } from 'react'

export default function AddToHomePrompt() {
  const deferredRef = useRef<{ prompt: () => void; userChoice: Promise<{ outcome: string }> } | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      const installEvent = e as unknown as { prompt: () => void; userChoice: Promise<{ outcome: string }> }
      deferredRef.current = installEvent
      setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white/95 supports-[backdrop-filter]:bg-white/70 backdrop-blur shadow-lg border rounded-xl p-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-900">Ana ekrana ekle</div>
            <div className="text-xs text-gray-600">Uygulamayı cihazınıza yükleyip hızlı erişim sağlayın.</div>
          </div>
          <button
            className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={async () => {
              const ev = deferredRef.current
              if (!ev) return setVisible(false)
              ev.prompt()
              try { await ev.userChoice } catch {}
              setVisible(false)
              deferredRef.current = null
            }}
          >
            Ekle
          </button>
          <button className="px-3 py-1.5 text-xs rounded-md border hover:bg-gray-50" onClick={() => setVisible(false)}>Kapat</button>
        </div>
      </div>
    </div>
  )
}


