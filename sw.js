// RS Verona 2026 — service worker (offline support for the web app).
// Pages, styles, scripts and PDFs: network first, so updates show up as soon as
// there is a connection; the saved copy is used when offline or the network is
// too slow. Images: saved copy first, refreshed in the background.
// Bump CACHE_VERSION when the PRECACHE list changes.
const CACHE_VERSION = "rsv-2026-v1";
const PRECACHE = [
  "./",
  "index.html",
  "hub.html",
  "rsverona.html",
  "topics.html",
  "me-in-eyp.html",
  "contacts.html",
  "it/index.html",
  "it/rsverona.html",
  "it/topics.html",
  "it/me-in-eyp.html",
  "it/contacts.html",
  "offline.html",
  "manifest.webmanifest",
  "assets/styles.css",
  "assets/script.js",
  "assets/images/rs-verona.svg",
  "assets/images/EYP_ITALY_SHORT.svg",
  "assets/images/icons/icon-192.png",
  "assets/images/m/rooftops.jpg",
];
const PAGE_TIMEOUT = 4000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE.map((url) => new Request(url, { cache: "reload" }))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

const save = async (request, response) => {
  // Only full, same-origin answers can be stored (PDF viewers may ask for ranges).
  if (!response || response.status !== 200 || response.type !== "basic") return;
  const cache = await caches.open(CACHE_VERSION);
  await cache.put(request, response);
};

// The offline page can be shown at any address (e.g. documents/…), so its
// relative links are anchored to the site root with a <base> tag.
const offlinePage = async () => {
  const cached = await caches.match("offline.html");
  if (!cached) return Response.error();
  const html = (await cached.text()).replace("<head>", `<head><base href="${self.registration.scope}">`);
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
};

// Fetch from the network and keep a copy; the copy is tied to the event right away
// so it is saved even when the answer has already come from the cache.
const fetchAndSave = (event) => {
  let saving = Promise.resolve();
  const fromNetwork = fetch(event.request).then((response) => {
    saving = save(event.request, response.clone());
    return response;
  });
  event.waitUntil(fromNetwork.then(() => saving).catch(() => {}));
  return fromNetwork;
};

const networkFirst = async (event, timeout) => {
  const { request } = event;
  const fromNetwork = fetchAndSave(event);
  const fromCache = () => caches.match(request, { ignoreSearch: true });
  try {
    if (!timeout) return await fromNetwork;
    const timer = new Promise((resolve) => { setTimeout(resolve, timeout); });
    const first = await Promise.race([fromNetwork, timer]);
    if (first) return first;
    return (await fromCache()) || (await fromNetwork);
  } catch {
    const cached = await fromCache();
    if (cached) return cached;
    if (request.mode === "navigate") return offlinePage();
    return Response.error();
  }
};

const cacheFirst = async (event) => {
  const cached = await caches.match(event.request);
  const refresh = fetchAndSave(event).catch(() => cached || Response.error());
  return cached || refresh;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (/\.pdf$/i.test(url.pathname)) {
    event.respondWith(networkFirst(event, 0));
  } else if (request.mode === "navigate" || /\.(html|css|js|webmanifest)$/i.test(url.pathname)) {
    event.respondWith(networkFirst(event, request.mode === "navigate" ? PAGE_TIMEOUT : 0));
  } else if (/\.(png|jpe?g|webp|svg|gif|ico)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(event));
  }
});
