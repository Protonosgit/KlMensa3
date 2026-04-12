//
//
//  Caching stuff
//
//


const PAGE_CACHE = 'pages-v2';
const IMAGE_CACHE = 'images-v2';

// Install
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (![PAGE_CACHE, IMAGE_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Cache always first, fast as f but buggy
  // if (req.mode === 'navigate') {
  //   event.respondWith(
  //     caches.open(PAGE_CACHE).then(async (cache) => {
  //       const cached = await cache.match(req);

  //       const networkFetch = fetch(req)
  //         .then((res) => {
  //           cache.put(req, res.clone());
  //           return res;
  //         })
  //         .catch(() => cached);

  //       return cached || networkFetch;
  //     })
  //   );
  //   return;
  // }

  // Online first, cache only offline
  if (req.mode === 'navigate') {
  event.respondWith(
    caches.open(PAGE_CACHE).then(async (cache) => {
      try {
        const fresh = await fetch(req);

        if (fresh && fresh.status === 200) {
          cache.put(req, fresh.clone());
        }

        return fresh;
      } catch (err) {
        const cached = await cache.match(req);
        return cached;
      }
    })
  );
  return;
}


//  detect image requests
const isImageRequest = (req) => {
  const url = new URL(req.url);

  return (
    req.destination === 'image' ||
    url.pathname.startsWith('/_next/image')
  );
};

  // Handle images Next/external
  if (isImageRequest(req)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(req);

        if (cached) {
          return cached;
        }

        try {
          const res = await fetch(req);

          if (res && res.status === 200) {
            cache.put(req, res.clone());
          }

          return res;
        } catch (err) {
          return cached;
        }
      })
    );
    return;
  }
});

//
//
//  Notification stuff
//
//

self.addEventListener("push", event => {
  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      data: { url: data.url }
    })
  );
});

  self.addEventListener('notificationclick', event => {
    event.notification.close();
  
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(windowClients => {
        for (const client of windowClients) {
          const url = new URL(client.url);
          if (url.origin === location.origin) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  });
  
  // self.addEventListener('notificationclose', event => {
  //   console.log('Notification closed:', event.notification.tag);
  // });