const CACHE_NAME = "python-info-v1";
const CACHE_OFFLINE = "python-offline-v1";

// ✅ Rutas CORREGIDAS - apuntan a assets/icons/
const STATIC_ASSETS = [
    "/",
    "/index.html",
    "/css/styles.css",
    "/js/config.js",
    "/js/api.js",
    "/js/ui.js",
    "/js/main.js",
    "/assets/icons/icon-192x192.png",
    "/assets/icons/icon-512x512.png"
];

// Estrategias de caché
const CacheStrategies = {
    async cacheFirst(request) {
        const cached = await caches.match(request);
        if (cached) return cached;

        try {
            const networkResponse = await fetch(request);
            if (networkResponse && networkResponse.status === 200) {
                const cache = await caches.open(CACHE_NAME);
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        } catch {
            if (request.mode === "navigate") {
                return caches.match("/index.html");
            }
            return new Response("Sin conexión", { status: 503 });
        }
    },

    async networkFirst(request) {
        try {
            const networkResponse = await fetch(request);
            if (networkResponse && networkResponse.status === 200) {
                const cache = await caches.open(CACHE_OFFLINE);
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        } catch {
            const cached = await caches.match(request);
            if (cached) return cached;
            return new Response(JSON.stringify({ 
                Response: "False", 
                Error: "Sin conexión a Internet" 
            }), {
                headers: { "Content-Type": "application/json" }
            });
        }
    }
};

// Eventos del Service Worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[SW] Precacheando assets...");
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((k) => k !== CACHE_NAME && k !== CACHE_OFFLINE)
                    .map((k) => {
                        console.log("[SW] Eliminando caché viejo:", k);
                        return caches.delete(k);
                    })
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // API OMDb → Network First
    if (url.hostname === "www.omdbapi.com") {
        event.respondWith(CacheStrategies.networkFirst(event.request));
        return;
    }

    // Assets estáticos → Cache First
    event.respondWith(CacheStrategies.cacheFirst(event.request));
});