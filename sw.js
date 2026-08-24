const CACHE_NAME = "fitplan-v40";
const RUNTIME_CACHE = "fitplan-runtime-v40";

const APP_SHELL = [
  "./",
  "./index.html",
  "./stitch-ui.css",
  "./supabase-client.js",
  "./legacy-cloud-migration.js",
  "./stitch-ui.js",
  "./manifest.webmanifest",
  "./logo-mark.svg",
  "./icon-192-v2.png",
  "./icon-512-v2.png",
  "./icon-maskable-512-v2.png",
  "./apple-touch-icon-v2.png",
  "./favicon-32-v2.png",
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
  "./assets/exercises/sled-hack-squat.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(
      APP_SHELL.map((asset) => new Request(asset, { cache: "reload" }))
    ))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys
        .filter((key) => ![CACHE_NAME, RUNTIME_CACHE].includes(key))
        .map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isNavigation = request.mode === "navigate";
  const isImage = request.destination === "image";
  const isSameOrigin = url.origin === self.location.origin;

  if (isNavigation) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  if (isSameOrigin || isImage) {
    event.respondWith(
      caches.match(request, { ignoreSearch: isSameOrigin }).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || (response.status !== 200 && response.type !== "opaque")) return response;
          const copy = response.clone();
          caches.open(isSameOrigin ? CACHE_NAME : RUNTIME_CACHE)
            .then((cache) => cache.put(request, copy));
          return response;
        });
      })
    );
  }
});
