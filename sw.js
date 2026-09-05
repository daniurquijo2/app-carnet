// Service worker — Test DGT PWA
const VERSION = 'v3';
const SHELL_CACHE = 'dgt-shell-' + VERSION;
const IMG_CACHE = 'dgt-img-' + VERSION;

// Recursos esenciales para que la app arranque offline
const SHELL_ASSETS = [
  './',
  './index.html',
  './preguntas.js',
  './manifest.json',
  './logo-icono.svg',
  './logo-icono-192.png',
  './logo-icono-512.png',
  './logo-completo.svg'
];

// Instalación: precachea el app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activación: borra cachés de versiones antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== IMG_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isImage = /\/imagenes\//.test(url.pathname) ||
                  /\.(jpg|jpeg|png|svg|webp|gif)$/i.test(url.pathname);

  // Imágenes: cache-first y guarda bajo demanda (la carpeta es enorme)
  if (isImage) {
    event.respondWith(
      caches.open(IMG_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req).then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // App shell y resto: cache-first con respaldo a red
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && url.origin === self.location.origin) {
          const copy = res.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
