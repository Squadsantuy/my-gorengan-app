const CACHE_NAME = 'mygorengan-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/penjual.html',
  '/js/app.js',
  '/manifest.json'
];

// Install Service Worker & Cache File
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Fetch Assets dari Cache jika Offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
