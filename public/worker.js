//
// Caching stuff
//

const PAGE_CACHE = 'pages';
const IMAGE_CACHE = 'images';
const META_CACHE = 'cache-metadata';

const PAGE_META_KEY = 'page-last-update';

const UPDATE_CUTOFF_HOUR = 10;
const UPDATE_CUTOFF_MINUTE = 30;

const getTodayKey = (date = new Date()) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const getMinutesSinceMidnight = (date = new Date()) => {
  return date.getHours() * 60 + date.getMinutes();
};

const isBeforeCutoff = (date = new Date()) => {
  return (
    getMinutesSinceMidnight(date) <
    UPDATE_CUTOFF_HOUR * 60 + UPDATE_CUTOFF_MINUTE
  );
};

const isSameDay = (storedDate, today) => storedDate === today;

const getPageCacheMeta = async () => {
  const cache = await caches.open(META_CACHE);
  const response = await cache.match(PAGE_META_KEY);

  if (!response) return null;

  try {
    return await response.json();
  } catch {
    return null;
  }
};

const setPageCacheMeta = async (
  date = getTodayKey(),
  updatedAt = new Date().toISOString()
) => {
  const cache = await caches.open(META_CACHE);

  await cache.put(
    PAGE_META_KEY,
    new Response(
      JSON.stringify({
        date,
        updatedAt,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  );
};

const isImageRequest = (req) => {
  const url = new URL(req.url);

  return (
    req.destination === 'image' ||
    url.pathname.startsWith('/_next/image')
  );
};

const shouldUseNetworkFirst = async (cached) => {
  const now = new Date();
  const today = getTodayKey(now);

  const meta = await getPageCacheMeta();

  const hasSameDayMeta =
    meta?.date && isSameDay(meta.date, today);

  const lastUpdatedAt = meta?.updatedAt
    ? new Date(meta.updatedAt)
    : null;

  const nowAfterCutoff = !isBeforeCutoff(now);

  const lastUpdateBeforeCutoff = lastUpdatedAt
    ? isBeforeCutoff(lastUpdatedAt)
    : false;

    const isMetaValid = meta?.updatedAt
  ? (Date.now() - new Date(meta.updatedAt).getTime()) < MAX_AGE_MS
  : false;

  return !cached || !isMetaValid;
};

const fetchAndStore = async (
  req,
  cache,
  updateMetadata = false
) => {
  try {
    const fresh = await fetch(req);

    if (fresh && fresh.ok) {
      await cache.put(req, fresh.clone());

      // freshmark
      if (updateMetadata) {
        await setPageCacheMeta(
          getTodayKey(),
          new Date().toISOString()
        );
      }
    }

    return fresh;
  } catch {
    return null;
  }
};

const handleCachedRequest = async (
  event,
  req,
  cacheName,
  updateMetadata = false
) => {

  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  console.log("checking3")

  
  const networkFirst = await shouldUseNetworkFirst(cached);

  // old cache networtk firrst
  if (networkFirst) {
    console.log('network first');
    const fresh = await fetchAndStore(
      req,
      cache,
      updateMetadata
    );

    if (fresh) {
      console.log('fresh');
      return fresh;
    }
    console.log('offline');

    // Network failed use cache
    return (
      cached ||
      new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable',
      })
    );
  }

  // same day valid swr
  if (cached) {
    console.log('swr');
    event.waitUntil(
      fetchAndStore(
        req,
        cache,
        updateMetadata
      )
    );

    return cached;
  }

  const fresh = await fetchAndStore(
    req,
    cache,
    updateMetadata
  );

  return (
    fresh ||
    new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
    })
  );
};

const handleImageRequest = async (req) => {
  const cache = await caches.open(IMAGE_CACHE);

  const cached = await cache.match(req);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(req);

    if (response.ok) {
      await cache.put(req, response.clone());
    }

    return response;
  } catch {
    return new Response('Offline', {
      status: 503,
      statusText: 'Service Unavailable',
    });
  }
};

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (
            ![
              PAGE_CACHE,
              IMAGE_CACHE,
              META_CACHE,
            ].includes(key)
          ) {
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
    event.respondWith(
      handleCachedRequest(
        event,
        req,
        PAGE_CACHE,
        true
      )
    );
    return;
  }

  if (isImageRequest(req)) {
    event.respondWith(
      handleImageRequest(req)
    );
    return;
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