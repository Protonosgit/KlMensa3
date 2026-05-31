//
// Caching stuff
//

const PAGE_CACHE = 'pages';
const IMAGE_CACHE = 'images';
const META_CACHE = 'cache-metadata';
const META_KEY = 'last-update-date';

const getTodayKey = () => {
  const now = new Date();
  return `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}-${now.getUTCDate()}`;
};

const isSameDay = (storedDate, today) => storedDate === today;

const getCacheDate = async () => {
  const cache = await caches.open(META_CACHE);
  const metaResponse = await cache.match(META_KEY);
  if (!metaResponse) return null;

  try {
    const json = await metaResponse.json();
    return json.date || null;
  } catch {
    return null;
  }
};

const setCacheDate = async (date = getTodayKey()) => {
  const cache = await caches.open(META_CACHE);
  const payload = JSON.stringify({ date });
  await cache.put(
    META_KEY,
    new Response(payload, {
      headers: { 'Content-Type': 'application/json' },
    })
  );
};

const purgePageAndImageCaches = async () => {
  await Promise.all(
    [PAGE_CACHE, IMAGE_CACHE].map(async (cacheName) => {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      await Promise.all(requests.map((request) => cache.delete(request)));
    })
  );
};

const isImageRequest = (req) => {
  const url = new URL(req.url);
  return req.destination === 'image' || url.pathname.startsWith('/_next/image');
};

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (![PAGE_CACHE, IMAGE_CACHE, META_CACHE].includes(key)) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (req.method !== 'GET') {
    return;
  }

  if (req.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(req));
    return;
  }

  if (isImageRequest(req)) {
    event.respondWith(handleImageRequest(req));
    return;
  }
});

const handleNavigationRequest = async (req) => {
  const cache = await caches.open(PAGE_CACHE);
  const cached = await cache.match(req);
  const today = getTodayKey();
  const lastUpdate = await getCacheDate();
  const stale = !lastUpdate || !isSameDay(lastUpdate, today);

  if (stale) {
    try {
      const fresh = await fetch(req);

      if (fresh && fresh.ok) {
        await purgePageAndImageCaches();
        await cache.put(req, fresh.clone());
        await setCacheDate(today);
      }

      return fresh;
    } catch {
      return cached || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
  }

  try {
    const fresh = await fetch(req);

    if (fresh && fresh.ok) {
      await cache.put(req, fresh.clone());
      await setCacheDate(today);
    }

    return fresh;
  } catch {
    return cached || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
};

const handleImageRequest = async (req) => {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(req);
  const today = getTodayKey();
  const lastUpdate = await getCacheDate();
  const stale = !lastUpdate || !isSameDay(lastUpdate, today);

  if (stale) {
    try {
      const fresh = await fetch(req);

      if (fresh && fresh.ok) {
        await purgePageAndImageCaches();
        await cache.put(req, fresh.clone());
        await setCacheDate(today);
      }

      return fresh;
    } catch {
      return cached || Response.error();
    }
  }

  if (cached) {
    return cached;
  }

  try {
    const fresh = await fetch(req);

    if (fresh && fresh.ok) {
      await cache.put(req, fresh.clone());
      await setCacheDate(today);
    }

    return fresh;
  } catch {
    return Response.error();
  }
};

//
// Notification stuff
//

self.addEventListener('push', (event) => {
  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      data: { url: data.url },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
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