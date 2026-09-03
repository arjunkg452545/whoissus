const CACHE_NAME = 'who-is-sus-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Network first with offline fallback
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
