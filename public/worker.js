//
//
//  Caching stuff
//
//


const PAGE_CACHE = 'pages';
const ASSET_CACHE = 'assets';

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
          if (![PAGE_CACHE, ASSET_CACHE].includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// check if image is image
const isImageRequest = (req) => {
  const url = new URL(req.url);

  return (
    req.destination === 'image' ||
    url.pathname.startsWith('/_next/image')
  );
};

self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (req.method !== 'GET') return;

  //html
  if (req.mode === 'navigate') {
    event.respondWith(handleHTML(req));
    return;
  }

  // images
  if (isImageRequest(req)) {
    event.respondWith(handleAssets(req));
    return;
  }

  // css/js
  if (
    req.destination === 'style' ||
    req.destination === 'script'
  ) {
    event.respondWith(handleAssets(req));
    return;
  }
});

// Directly from server when online because SSR might break
async function handleHTML(req) {
  const cache = await caches.open(PAGE_CACHE);

  try {
    const fresh = await fetch(req);

    if (fresh && fresh.status === 200) {
      cache.put(req, fresh.clone());
    }

    return fresh;
  } catch (err) {
    const cached = await cache.match(req);
    return cached || new Response('Offline', { status: 503 });
  }
}

// always stale while revalidate for speeeed
async function handleAssets(req) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(req);

  const networkFetch = fetch(req)
    .then((res) => {
      if (res && res.status === 200) {
        cache.put(req, res.clone());
      }
      return res;
    })
    .catch(() => null);

  return cached || networkFetch;
}

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