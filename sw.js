/**
 * Från
 * https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers (2021-06-09)
 * https://web.dev/offline-cookbook/
 */
const cacheKey = 'cache-v4';

const cacheArray = [
  '/index.html',
  '/teknik.html',
  '/manifest.json',
  '/favicon.ico',
  '/img/pwaPhones.png',
  '/img/sw.png',
  '/img/icon/icon-72x72.png',
  '/img/icon/icon-96x96.png',
  '/img/icon/icon-128x128.png',
  '/img/icon/icon-144x144.png',
  '/img/icon/icon-152x152.png',
  '/img/icon/icon-180x180.png',
  '/img/icon/icon-192x192.png',
  '/img/icon/icon-32x32.png',
  '/img/icon/icon-512x512.png',
  '/ux/style.css',
  '/ux/script.js'
];

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(cacheKey)
    .then(cache => {
      return cache.addAll(cacheArray);
    })
  );
});

/** Rensar cache */
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => {
    return Promise.all(keys.map((key) => {
      if (key != cacheKey)) {
        return caches.delete(key);
      }
    }));
  }));
});

/** cache-filer först, upddaterar cache från servern */
self.addEventListener('fetch', function (event) {
  if (!(event.request.url.indexOf('http') === 0)) return; 
  event.respondWith(
    caches.open(cacheKey).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        var fetchPromise = fetch(event.request).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    }),
  );
});
/* TESTA https://blog.bitsrc.io/5-service-worker-caching-strategies-for-your-next-pwa-app-58539f156f52
self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open(cacheName)
            .then(function(cache) {
                cache.match(event.request)
                    .then( function(cacheResponse) {
                        fetch(event.request)
                            .then(function(networkResponse) {
                                cache.put(event.request, networkResponse)
                            })
                        return cacheResponse || networkResponse
                    })
            })
    )
}); */



/** Tar enbart cache-filer först
self.addEventListener('fetch', (e) => {
  e.respondWith((async () => {
    const r = await caches.match(e.request);
    console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
    if (r) { return r; }
    const response = await fetch(e.request);
    const cache = await caches.open(cacheKey);
    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
    cache.put(e.request, response.clone());
    return response;
  })());
});*/
