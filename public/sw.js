/**
 * FitPlan Service Worker
 *
 * Strategy:
 * - JS / CSS / HTML → network-first (always validate with server, offline fallback only)
 * - Images (GIFs, WebP, SVG, icons) → cache-first (immutable assets)
 * - Navigation → network-first with offline fallback to index.html
 *
 * This ensures users always get the latest app code without needing to clear cache.
 */

const CACHE_VERSION = "fitplan-v51";
const IMAGE_CACHE   = "fitplan-images-v1";

// Only truly immutable assets go in the image cache
const PRECACHE_IMAGES = [
  "./assets/exercises/10286.gif",
  "./assets/exercises/10472.gif",
  "./assets/exercises/14457.gif",
  "./assets/exercises/29539.gif",
  "./assets/exercises/33854.gif",
  "./assets/exercises/4888.gif",
  "./assets/exercises/5356.gif",
  "./assets/exercises/5606.gif",
  "./assets/exercises/5923.gif",
  "./assets/exercises/6614.gif",
  "./assets/exercises/7552.gif",
  "./assets/exercises/lever-seated-crunch.gif",
  "./assets/exercises/sled-hack-squat.webp",
  "./logo-mark.svg",
  "./icon-192-v2.png",
  "./icon-512-v2.png",
  "./icon-maskable-512-v2.png",
  "./apple-touch-icon-v2.png",
  "./favicon-32-v2.png"
];

// ── Install: precache images only ────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(IMAGE_CACHE).then((cache) =>
      cache.addAll(PRECACHE_IMAGES.map((url) => new Request(url, { cache: "reload" })))
    )
  );
  // Activate immediately — don't wait for old tabs to close
  self.skipWaiting();
});

// ── Activate: clean up old caches ────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  const KEEP = [CACHE_VERSION, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k)))
    )
  );
  // Take control of all open clients immediately
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // External requests (CDN fonts, Supabase, ExerciseDB) — pass through
  if (!isSameOrigin) {
    // Cache opaque responses for external images only
    if (request.destination === "image") {
      event.respondWith(
        caches.open(IMAGE_CACHE).then((cache) =>
          cache.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
              if (response && response.type === "opaque") {
                cache.put(request, response.clone());
              }
              return response;
            }).catch(() => cached || new Response("", { status: 408 }));
          })
        )
      );
    }
    return;
  }

  const isImage = request.destination === "image" ||
    /\.(gif|webp|png|jpg|jpeg|svg|ico)(\?|$)/i.test(url.pathname);

  // Images → cache-first (they never change for a given filename)
  if (isImage) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        })
      )
    );
    return;
  }

  // JS, CSS, HTML, JSON → network-first with short offline fallback
  // The server returns 304 Not Modified in <50ms if nothing changed,
  // so this is fast and guarantees users always get the latest code.
  event.respondWith(
    fetch(request, { cache: "no-store" })
      .then((response) => {
        // Cache a copy for offline use only if response is valid
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        // Offline fallback: serve from cache if available
        caches.match(request).then((cached) => {
          if (cached) return cached;
          // For navigation requests, return the app shell
          if (request.mode === "navigate") {
            return caches.match("./index.html");
          }
          return new Response("", { status: 408, statusText: "Offline" });
        })
      )
  );
});
