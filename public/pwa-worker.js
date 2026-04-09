const CACHE_NAME = 'pages-v1';

// Install → optional pre-cache
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate → cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Activating');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener('fetch', (event) => {
  console.log('Fetching', event.request.url);
  const req = event.request;

  // Only handle page navigation
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(req);

        const networkFetch = fetch(req)
          .then((res) => {
            // Update cache in background
            cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached); // fallback if offline

        // Return cached immediately if exists
        return cached || networkFetch;
      })
    );
  }
});