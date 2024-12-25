const CACHE_NAME = "shortener-cache-v1";

const urlsToCache = [
    "/",               // Mengacu ke index.html di root
    "/index.css",      // Jika file ini digunakan
    "/logo-google.png",
    "/logo.png",
    "/vite.svg",
  ];

// Install event: cache semua file penting
self.addEventListener("install", (event) => {
  console.log("Service Worker: Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.error("Failed to cache:", err);
      });
    })
  );
});

// Fetch event: gunakan cache jika ada, jika tidak ambil dari network
self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).catch(() => caches.match("/index.html"));
      })
    );
  });  

// Activate event: hapus cache lama jika ada versi baru
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});