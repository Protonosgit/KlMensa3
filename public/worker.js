//
// Caching stuff
//

const PAGE_CACHE = 'pages-v1';
const ASSET_CACHE = 'assets-v1';
const IMAGE_CACHE = 'images-v1';

const CUTOFF_HOUR = 11;
const CUTOFF_MINUTE = 15;

const getDayKey = (date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const isBeforeCutoff = (date) =>
  date.getHours() * 60 + date.getMinutes() <
  CUTOFF_HOUR * 60 + CUTOFF_MINUTE;

const isImageRequest = (req) => {
  const url = new URL(req.url);

  return (
    req.destination === 'image' ||
    url.pathname.startsWith('/_next/image')
  );
};

const cacheResponse = async (cache, req, response) => {
  const headers = new Headers(response.headers);

  headers.set(
    'sw-cached-at',
    new Date().toISOString()
  );

  const cachedResponse = new Response(
    await response.clone().blob(),
    {
      status: response.status,
      statusText: response.statusText,
      headers,
    }
  );

  await cache.put(req, cachedResponse);
};

const fetchAndCache = async (req, cache) => {
  const response = await fetch(req);

  if (response.ok) {
    await cacheResponse(
      cache,
      req,
      response.clone()
    );
  }

  return response;
};

const shouldUseNetworkFirstForDocument = async (
  cached
) => {
  if (!cached) {
    return true;
  }

  const cachedAt =
    cached.headers.get('sw-cached-at');

  if (!cachedAt) {
    return true;
  }

  const cachedDate = new Date(cachedAt);
  const now = new Date();

  const cacheDay = getDayKey(cachedDate);
  const today = getDayKey(now);

  // Cache from a previous day
  if (cacheDay !== today) {
    return true;
  }

  // Today's cache was created before 11:15
  if (isBeforeCutoff(cachedDate)) {
    return true;
  }

  // Today's cache was created after 11:15
  return false;
};

const offlineResponse = () =>
  new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable',
  });

const handleDocument = async (
  event,
  req
) => {
  const cache = await caches.open(
    PAGE_CACHE
  );

  const cached = await cache.match(req);

  const networkFirst =
    await shouldUseNetworkFirstForDocument(
      cached
    );

  if (networkFirst) {
    try {
      return await fetchAndCache(
        req,
        cache
      );
    } catch {
      return cached || offlineResponse();
    }
  }

  // Stale-while-revalidate
  if (cached) {
    event.waitUntil(
      fetchAndCache(req, cache).catch(
        () => {}
      )
    );

    return cached;
  }

  try {
    return await fetchAndCache(
      req,
      cache
    );
  } catch {
    return offlineResponse();
  }
};

const handleImage = async (req) => {
  const cache = await caches.open(
    IMAGE_CACHE
  );

  const cached = await cache.match(req);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(req);

    if (response.ok) {
      await cache.put(
        req,
        response.clone()
      );
    }

    return response;
  } catch {
    return offlineResponse();
  }
};

const handleAsset = async (
  event,
  req
) => {
  const cache = await caches.open(
    ASSET_CACHE
  );

  const cached = await cache.match(req);

  if (cached) {
    event.waitUntil(
      fetchAndCache(req, cache).catch(
        () => {}
      )
    );

    return cached;
  }

  try {
    return await fetchAndCache(
      req,
      cache
    );
  } catch {
    return offlineResponse();
  }
};

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener(
  'activate',
  (event) => {
    const allowedCaches = [
      PAGE_CACHE,
      ASSET_CACHE,
      IMAGE_CACHE,
    ];

    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (
              !allowedCaches.includes(key)
            ) {
              return caches.delete(key);
            }

            return Promise.resolve();
          })
        )
      )
    );

    self.clients.claim();
  }
);

self.addEventListener(
  'fetch',
  (event) => {
    const req = event.request;

    if (req.method !== 'GET') {
      return;
    }

    if (req.mode === 'navigate') {
      event.respondWith(
        handleDocument(event, req)
      );
      return;
    }

    if (isImageRequest(req)) {
      event.respondWith(
        handleImage(req)
      );
      return;
    }

    event.respondWith(
      handleAsset(event, req)
    );
  }
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_PAGE_CACHE') {
    event.waitUntil(
      caches.delete(PAGE_CACHE).then(() => {
        event.ports[0]?.postMessage({ success: true, message: 'Page cache cleared' });
      }).catch((error) => {
        event.ports[0]?.postMessage({ success: false, message: 'Failed to clear cache', error });
      })
    );
  }
});

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
    clients.matchAll({ type: 'window' }).then(
      (windowClients) => {
        for (const client of windowClients) {
          const url = new URL(client.url);

          if (url.origin === location.origin) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      }
    )
  );
});