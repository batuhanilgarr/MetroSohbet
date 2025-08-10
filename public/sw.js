const CACHE_NAME = 'metrosohbet-v3'
const APP_SHELL = ['/', '/manifest.json', '/offline.html']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  // Sadece aynı origin (site asset'leri) için cache; Supabase vb. dış origin'i yakalama
  if (url.origin !== self.location.origin) return
  // İsteğe bağlı: API isteklerini de es geç
  if (url.pathname.startsWith('/api/')) return

  // Navigasyon isteklerinde offline fallback göster
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const clone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone))
          return res
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME)
          const offline = await cache.match('/offline.html')
          return offline || Response.error()
        })
    )
    return
  }

  // Diğer GET istekleri cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchPromise = fetch(req)
        .then((res) => {
          const resClone = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone))
          return res
        })
        .catch(() => cached)
      return cached || fetchPromise
    })
  )
})