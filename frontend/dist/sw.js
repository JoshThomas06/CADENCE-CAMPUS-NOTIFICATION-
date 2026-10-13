// Cadence Campus Pulse - Native Web Push Service Worker (PWA)
// Implements AC-4: Native background push listener & notification display

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installed Cadence Campus Pulse SW');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activated Cadence Campus Pulse SW');
  event.waitUntil(clients.claim());
});

// AC-4: Listen to standard VAPID Web Push events
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push event received from VAPID server');

  let data = {
    title: 'Cadence Campus Alert',
    body: 'A new campus notification has been broadcast.',
    eventId: 'evt_push_' + Date.now(),
    priority: 'HIGH'
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/campus_painting.jpg',
    badge: '/campus_painting.jpg',
    vibrate: [200, 100, 200],
    data: {
      eventId: data.eventId,
      priority: data.priority,
      timestamp: Date.now()
    },
    actions: [
      { action: 'view', title: 'View Details' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});
