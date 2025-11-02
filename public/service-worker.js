self.addEventListener('push', event => {
    const options = {
      body: event.data.text(),
      icon: '/logo.png',
      badge: '/logo.png',
      tag: 'push-message',
      vibrate: [100, 50, 100],
      actions: [
        { action: 'open', title: 'Open'},
        { action: 'close', title: 'Close' }
      ]
    };
  
    event.waitUntil(
      self.registration.showNotification('KL-Mensa', options)
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
  
  self.addEventListener('notificationclose', event => {
    // console.log('Notification closed:', event.notification.tag);
  });