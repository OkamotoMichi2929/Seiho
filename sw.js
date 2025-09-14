const CACHE = 'actuarial-qa-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './data.json',
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  e.respondWith(
    caches.match(request).then(res => 
      res || fetch(request).then(net => {
        const clone = net.clone();
        caches.open(CACHE).then(c => c.put(request, clone));
        return net;
      }).catch(() => res) // オフライン時はキャッシュにフォールバック
    )
  );
});
