const CACHE_NAME = "todo-cache-v0.0.1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./images/checkmark-circle-02-stroke-sharp.svg",
  "./images/checkmark-circle-filled.png",
  "./images/edit.png",
  "./images/delete.png",
  "./manifest.json",
];

// opening/installing cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching files...");
        cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((err) => console.log(`Failed caching files: ${err}`))
  );
});

// cache-first approach as data will not change from the API
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// Cleaning stale caches
self.addEventListener("active", (event) => {
  event.waitUntil(
    caches.keys().forEach((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cache) => caches.delete(cache))
      );
    })
  );
});
