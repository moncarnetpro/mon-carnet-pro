/* Bulle d'Éclats – fonctionnement hors ligne */
const PREFIX = "mcp-"; const CACHE = PREFIX + "v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith(PREFIX) && x !== CACHE).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  const lib = (u.hostname === "www.gstatic.com" && u.pathname.startsWith("/firebasejs/")) || u.hostname === "fonts.gstatic.com" || u.hostname === "fonts.googleapis.com";
  if (lib) { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const cl = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); return res; }))); return; }
  if (u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(res => { if (res.ok) { const cl = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); } return res; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
