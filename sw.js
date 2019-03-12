var cacheName = '4'
var filesToCache = ['/', '/index', '/index.html', '/index.js', '/favicon.ico']

self.addEventListener('install', e => {
  console.log('[ServiceWorker] Install')
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('[ServiceWorker] Caching app shell')
      return cache.addAll(filesToCache)
    })
  )
})
self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activate')
  e.waitUntil(
    caches
      .keys()
      .then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== cacheName) {
              console.log('[ServiceWorker] Removing old cache', key)
              return caches.delete(key)
            }
          })
        )
      })
      .catch(e => {
        console.error(e)
      })
  )
  return self.clients.claim()
})

self.addEventListener('fetch', e => {
  console.log('[ServiceWorker] Fetch', e.request.url)
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request)
    })
  )
})
