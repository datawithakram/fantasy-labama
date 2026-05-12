self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Fantasy Labama', body: 'New update available!' };
  
  const options = {
    body: data.body,
    icon: '/icon-192x192.png', // تأكد من وجود أيقونة بهذا الاسم في public
    badge: '/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
