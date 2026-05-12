importScripts(
  'https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js'
)

console.info('[FCM SW] Service worker script loaded.', {
  href: self.location.href,
})

const params = new URL(self.location.href).searchParams

firebase.initializeApp({
  apiKey: params.get('apiKey'),
  authDomain: params.get('authDomain'),
  projectId: params.get('projectId'),
  storageBucket: params.get('storageBucket'),
  messagingSenderId: params.get('messagingSenderId'),
  appId: params.get('appId'),
})

const messaging = firebase.messaging()

self.addEventListener('install', event => {
  console.info('[FCM SW] install event.')
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  console.info('[FCM SW] activate event.')
  event.waitUntil(self.clients.claim())
})

self.addEventListener('push', event => {
  let payload = null

  try {
    payload = event.data ? event.data.json() : null
  } catch (error) {
    payload = {
      parseError: String(error),
    }
  }

  console.info('[FCM SW] raw push event received.', {
    hasData: Boolean(event.data),
    payload,
  })
})

messaging.onBackgroundMessage(payload => {
  console.info('[FCM SW] background message received.', payload)

  const title = payload.notification?.title || 'BRIEFY'
  const options = {
    body: payload.notification?.body,
    data: payload.data,
  }

  console.info('[FCM SW] showing background notification.', {
    title,
    options,
  })

  return self.registration.showNotification(title, options)
})

self.addEventListener('notificationclick', event => {
  console.info('[FCM SW] notification click.', {
    data: event.notification.data,
  })

  event.notification.close()

  const route = event.notification.data?.route || '/'
  const targetUrl = new URL(route, self.location.origin).href

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.navigate(targetUrl)
            return client.focus()
          }
        }

        return clients.openWindow(targetUrl)
      })
  )
})
