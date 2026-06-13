

/*

Caching stuff

*/

const CONFIG = {
  CACHE_VERSION: 'v1', // update to invalidate
  FRESH_CUTOFF_HOUR: 11,
  FRESH_CUTOFF_MINUTE: 15,
};

const MAIN_CACHE = `main-cache-${CONFIG.CACHE_VERSION}`;
const IMAGE_CACHE = `image-cache-${CONFIG.CACHE_VERSION}`;
const CURRENT_CACHES = [MAIN_CACHE, IMAGE_CACHE];

const TIMESTAMP_HEADER = 'x-sw-cached-on';

const IMAGE_PATH_PREFIX = '/_next/image';
const EXCLUDED_PREFIXES = ['/api'];


self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(MAIN_CACHE);
        // precache root document
        await cache.add('/');
      } catch (err) {}
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => !CURRENT_CACHES.includes(name))
          .map((name) => caches.delete(name))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const bucket = getBucket(request);

  if (bucket === 'image') {
    event.respondWith(imageCacheFirst(request));
    return;
  }

  // if (bucket === 'main') {
  //   event.respondWith(mainStrategy(event, request));
  // }

});


function getBucket(request) {
  if (request.method !== 'GET') return null;

  const url = new URL(request.url);

  // Same origin
  if (url.origin !== self.location.origin) return null;

  // Exclusions
  if (EXCLUDED_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
    return null;
  }

  // nextjs img
  if (url.pathname.startsWith(IMAGE_PATH_PREFIX) || request.destination === 'image') {
    return 'image';
  }

  // only root
  if (request.mode === 'navigate') {
    return url.pathname === '/' ? 'main' : null;
  }

  // assets only from root
  if (request.referrer) {
    try {
      const referrerUrl = new URL(request.referrer);
      if (referrerUrl.origin === self.location.origin && referrerUrl.pathname !== '/') {
        return null;
      }
    } catch (err) {}
  }

  return 'main';
}


async function imageCacheFirst(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

// time check
async function mainStrategy(event, request) {
  const cache = await caches.open(MAIN_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    const cachedDate = getCacheTimestamp(cached);
    const age = cachedDate ? classifyCacheAge(cachedDate) : 'stale-day';

    switch (age) {
      case 'fresh-morning':
        return cached;

      case 'fresh-afternoon':
        // stale-while-revalidate.
        event.waitUntil(
          fetchAndCache(request, cache).catch(() => {})
        );
        return cached;

      case 'stale-day':
      default:
        try {
          return await fetchAndCache(request, cache);
        } catch (err) {
          return cached;
        }
    }
  }

  // no cache
  return fetchAndCache(request, cache);
}


async function fetchAndCache(request, cache) {
  const response = await fetch(request);
  if (response && response.ok) {
    await putWithTimestamp(cache, request, response.clone());
  }
  return response;
}

async function putWithTimestamp(cache, request, response) {
  try {
    const body = await response.blob();
    const headers = new Headers(response.headers);
    headers.set(TIMESTAMP_HEADER, new Date().toISOString());

    const stamped = new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    await cache.put(request, stamped);
  } catch (err) {
    // cache without timestamp
    try {
      await cache.put(request, response);
    } catch (_) {}
  }
}

function getCacheTimestamp(response) {
  const header = response.headers.get(TIMESTAMP_HEADER);
  if (!header) return null;
  const date = new Date(header);
  return Number.isNaN(date.getTime()) ? null : date;
}

function classifyCacheAge(cachedDate) {
  const now = new Date();

  const isSameDay =
    cachedDate.getFullYear() === now.getFullYear() &&
    cachedDate.getMonth() === now.getMonth() &&
    cachedDate.getDate() === now.getDate();

  if (!isSameDay) return 'stale-day';

  const cutoff = new Date(cachedDate);
  cutoff.setHours(CONFIG.FRESH_CUTOFF_HOUR, CONFIG.FRESH_CUTOFF_MINUTE, 0, 0);

  return cachedDate < cutoff ? 'fresh-morning' : 'fresh-afternoon';
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_PAGE_CACHE') {
    event.waitUntil(
      Promise.all(CURRENT_CACHES.map((name) => caches.delete(name)))
    );
  }
});


/*

Notification stuff

*/

self.addEventListener(
  'push',
  (event) => {
    const data =
      event.data?.json?.() ?? {};

    event.waitUntil(
      self.registration.showNotification(
        data.title,
        {
          body: data.body,
          icon: data.icon,
          data: {
            url: data.url,
          },
        }
      )
    );
  }
);

self.addEventListener(
  'notificationclick',
  (event) => {
    event.notification.close();

    event.waitUntil(
      clients
        .matchAll({
          type: 'window',
        })
        .then((windowClients) => {
          for (const client of windowClients) {
            const url = new URL(
              client.url
            );

            if (
              url.origin ===
              location.origin
            ) {
              return client.focus();
            }
          }

          if (clients.openWindow) {
            return clients.openWindow(
              '/'
            );
          }
        })
    );
  }
);