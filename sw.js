self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const title = event.data.title;
    const options = {
      body: event.data.body,
      icon: 'chara-focus.png',
      badge: 'chara-focus.png',
      vibrate: [300, 100, 300, 100, 300],
      tag: 'ugoko-notification',
      renotify: true,
      requireInteraction: true,
      data: {
        url: self.registration.scope
      }
    };
    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({ action: 'NOTIFICATION_CLICKED' });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});
