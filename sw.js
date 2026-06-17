const CACHE_NAME = "python-info-v2";
const CACHE_OFFLINE = "python-offline-v2";

const STATIC_ASSETS = [
    "./",
    "./index.html",
    "./css/styles.css",
    "./js/config.js",
    "./js/api.js",
    "./js/ui.js",
    "./js/main.js",
    "./assets/icons/icon-192x192.png",
    "./assets/icons/icon-512x512.png",
    "./assets/icons/no-poster.png"
];

// Instalación
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log("[SW] Cache abierto");
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activación
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== CACHE_OFFLINE) {
                        console.log("[SW] Eliminando cache antiguo:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - NO interceptar la API
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // ⚠️ NO interceptar peticiones a OMDb API
    if (url.hostname === "www.omdbapi.com" || url.hostname === "omdbapi.com") {
        // Dejar pasar la solicitud sin intervención del SW
        return;
    }

    // Para assets estáticos: Cache First
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});