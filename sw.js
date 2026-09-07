const CACHE = "realtypixelworks-interactions-v8";
const CORE = ["./","index.html","services.html","portfolio.html","contact.html","thank-you.html","assets/css/style.css","assets/js/script.js"];
self.addEventListener("install", (event) => { event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", (event) => { event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (event) => { if (event.request.method !== "GET") return; event.respondWith(caches.open(CACHE).then(async (cache) => { try { const fresh = await fetch(event.request); if (fresh && fresh.ok) cache.put(event.request, fresh.clone()); return fresh; } catch (error) { const cached = await cache.match(event.request); if (cached) return cached; throw error; } })); });
