// 핀모아 서비스 워커 — 앱셸 캐시 (간단한 오프라인 지원)
const CACHE = 'pinmoa-v1';
const ASSETS = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  // 내비게이션 요청은 네트워크 우선, 실패 시 캐시된 셸
  if (request.mode === 'navigate') {
    e.respondWith(fetch(request).catch(() => caches.match('/index.html')));
    return;
  }
  // 그 외엔 캐시 우선
  e.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});
