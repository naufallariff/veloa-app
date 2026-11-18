/* public/sw.js */
const CACHE_VERSION = 'veloa-v1.1.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const CONTENT_CACHE = `${CACHE_VERSION}-content`;

const CORE_ASSETS = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/icons/veloa-icon.svg',
];

const PRECACHE_BATCH_SIZE = 6;

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then(async (cache) => {
            await Promise.allSettled(
                CORE_ASSETS.map(async (assetUrl) => {
                    const response = await fetch(assetUrl, { cache: 'reload' });
                    if (response.ok) {
                        await cache.put(assetUrl, response);
                    }
                }),
            );
        }),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key !== STATIC_CACHE && key !== CONTENT_CACHE)
                        .map((oldKey) => caches.delete(oldKey)),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

async function precacheInBatches(urls) {
    const cache = await caches.open(CONTENT_CACHE);
    let completed = 0;

    for (let i = 0; i < urls.length; i += PRECACHE_BATCH_SIZE) {
        const batch = urls.slice(i, i + PRECACHE_BATCH_SIZE);
        await Promise.allSettled(
            batch.map(async (url) => {
                try {
                    const response = await fetch(url, { cache: 'reload' });
                    if (response.ok) {
                        await cache.put(url, response);
                    }
                } catch {
                    // Abaikan URL yang gagal saat jaringan tidak stabil
                } finally {
                    completed += 1;
                }
            }),
        );

        const clients = await self.clients.matchAll();
        for (const client of clients) {
            client.postMessage({
                type: 'PRECACHE_PROGRESS',
                completed,
                total: urls.length,
            });
        }
    }

    const clients = await self.clients.matchAll();
    for (const client of clients) {
        client.postMessage({ type: 'PRECACHE_COMPLETE', count: completed });
    }
}

self.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    if (data.type === 'SKIP_WAITING') {
        self.skipWaiting();
        return;
    }

    if (data.type === 'PRECACHE_URLS' && Array.isArray(data.urls)) {
        event.waitUntil(precacheInBatches(data.urls));
    }
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    // 1. Navigasi Halaman (SPA Fallback ke index.html saat offline)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(STATIC_CACHE).then((cache) => cache.put('/index.html', copy));
                    }
                    return response;
                })
                .catch(async () => {
                    const cached = await caches.match('/index.html');
                    return (
                        cached ||
                        new Response('Aplikasi sedang offline. Silakan periksa koneksi internet Anda.', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
                        })
                    );
                }),
        );
        return;
    }

    // 2. Aset Statis Ter-hash (/assets/*) -> Cache-First
    if (url.pathname.startsWith('/assets/')) {
        event.respondWith(
            caches.match(request).then(
                (cached) =>
                    cached ||
                    fetch(request).then((response) => {
                        if (response.ok) {
                            const copy = response.clone();
                            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
                        }
                        return response;
                    }),
            ),
        );
        return;
    }

    // 3. Data Kurikulum / JSON / Aset Lainnya -> Stale-While-Revalidate + Safe Offline Response
    event.respondWith(
        caches.match(request).then((cached) => {
            const networkFetch = fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CONTENT_CACHE).then((cache) => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(() => {
                    if (cached) return cached;
                    return new Response(
                        JSON.stringify({
                            error: 'OFFLINE_UNAVAILABLE',
                            message: 'Materi ini belum tersimpan di penyimpanan offline.',
                        }),
                        {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: { 'Content-Type': 'application/json; charset=utf-8' },
                        },
                    );
                });

            return cached || networkFetch;
        }),
    );
});