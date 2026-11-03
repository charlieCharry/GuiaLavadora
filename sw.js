/* Guarda la app en el celular para que funcione sin internet.
   Al publicar cambios, sube el número de VERSION para que el celular descargue lo nuevo. */
const VERSION = 'lavado-v4';
const ARCHIVOS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'js/iconos.js',
  'js/datos-manual.js',
  'js/datos-prendas.js',
  'js/motor.js',
  'js/app.js',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Primero la copia guardada (rápido y sin internet); si no está, la red.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request))
  );
});
