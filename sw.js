const CACHE_NAME = 'python-info-v1';
const urlsToCache = [
    './',
    './index.html',
    './css/styles.css',
    './js/config.js',
    './js/api.js',
    './js/ui.js',
    './js/main.js',
    './manifest.json',
    './assets/icons/icon-192x192.png',
    './assets/icons/icon-512x512.png',
    './assets/icons/no-poster.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Cache abierto');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => self.clients.claim())
    );
});

// Interceptar peticiones (estrategia: cache first, luego network)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si está en cache, devolverlo
                if (response) {
                    return response;
                }

                // Si no está en cache, ir a la red
                return fetch(event.request)
                    .then(response => {
                        // Clonar la respuesta para guardarla en cache
                        const responseToCache = response.clone();

                        // Guardar en cache solo si es una petición GET exitosa
                        if (event.request.method === 'GET' && response.status === 200) {
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                        }

                        return response;
                    })
                    .catch(() => {
                        // Si falla la red y no está en cache, mostrar mensaje de error
                        return new Response('Error de conexión', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});