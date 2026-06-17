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

const CacheStrategies = {
    async cacheFirst(request) {
        const cached = await caches.match(request);
        if (cached) {
            console.log("[SW] Cache HIT:", request.url);
            return cached;
        }

        try {
            const networkResponse = await fetch(request);
            if (networkResponse && networkResponse.status === 200) {
                const cache = await caches.open(CACHE_NAME);
                cache.put(request, networkResponse.clone());
                console.log("[SW] Cache MISS - guardado:", request.url);
            }
            return networkResponse;
        } catch (error) {
            console.log("[SW] Error fetch:", error.message);
            if (request.mode === "navigate") {
                return caches.match("./index.html");
            }
            return new Response("Sin conexión", { status: 503 });
        }
    }
};

async function precacheAssets() {
    const cache = await caches.open(CACHE_NAME);
    const errors = [];
    
    for (const url of STATIC_ASSETS) {
        try {
            await cache.add(url);
            console.log("[SW] Precacheado:", url);
        } catch (error) {
            console.error("[SW] Error precacheando:", url, error);
            errors.push(url);
        }
    }
    
    if (errors.length > 0) {
        console.warn("[SW] Assets con errores:", errors);
    }
    
    return cache;
}

self.addEventListener("install", (event) => {
    console.log("[SW] Instalando...");
    event.waitUntil(
        precacheAssets().then(() => {
            console.log("[SW] Instalación completa");
            return self.skipWaiting();
        })
    );
});

self.addEventListener("activate", (event) => {
    console.log("[SW] Activando...");
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((k) => k !== CACHE_NAME && k !== CACHE_OFFLINE)
                    .map((k) => {
                        console.log("[SW] Eliminando caché viejo:", k);
                        return caches.delete(k);
                    })
            );
        }).then(() => {
            console.log("[SW] Activación completa");
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // API OMDb -> pasar directamente sin SW
    if (url.hostname === "www.omdbapi.com" || url.hostname === "omdbapi.com") {
        return;
    }

    // Assets estáticos -> Cache First
    event.respondWith(CacheStrategies.cacheFirst(event.request));
});