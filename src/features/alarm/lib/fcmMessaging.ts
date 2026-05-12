import { getToken, onMessage } from 'firebase/messaging'
import type { MessagePayload, Unsubscribe } from 'firebase/messaging'
import {
  getFirebaseMessaging,
  getFirebaseServiceWorkerUrl,
} from '@shared/lib/firebase'

function waitForServiceWorkerActive(
  registration: ServiceWorkerRegistration
): Promise<ServiceWorkerRegistration> {
  if (registration.active) {
    console.info('[FCM] Service worker is already active.', {
      scope: registration.scope,
      scriptURL: registration.active.scriptURL,
      state: registration.active.state,
    })
    return Promise.resolve(registration)
  }

  const worker = registration.installing ?? registration.waiting

  if (!worker) {
    console.info('[FCM] Waiting for navigator.serviceWorker.ready.', {
      scope: registration.scope,
    })
    return navigator.serviceWorker.ready
  }

  console.info('[FCM] Waiting for service worker activation.', {
    scope: registration.scope,
    state: worker.state,
  })

  return new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error('Service worker activation timed out.'))
    }, 10000)

    worker.addEventListener('statechange', () => {
      console.info('[FCM] Service worker state changed.', {
        scope: registration.scope,
        state: worker.state,
      })

      if (worker.state === 'activated') {
        window.clearTimeout(timeoutId)
        resolve(registration)
      }
    })
  })
}

async function getMessagingServiceWorkerRegistration() {
  if (!('serviceWorker' in navigator)) {
    console.warn('[FCM] navigator.serviceWorker is not available.')
    return null
  }

  const serviceWorkerUrl = getFirebaseServiceWorkerUrl()
  console.info('[FCM] Registering service worker.', {
    url: serviceWorkerUrl,
    scope: '/',
  })

  const registration = await navigator.serviceWorker.register(
    serviceWorkerUrl,
    {
      scope: '/',
    }
  )

  console.info('[FCM] Service worker registered.', {
    scope: registration.scope,
    active: registration.active?.state,
    installing: registration.installing?.state,
    waiting: registration.waiting?.state,
  })

  return waitForServiceWorkerActive(registration)
}

export async function requestFcmToken() {
  if (!('Notification' in window)) {
    console.warn('[FCM] Notification API is not available.')
    return null
  }

  console.info('[FCM] Requesting notification permission.', {
    currentPermission: Notification.permission,
  })

  const permission = await Notification.requestPermission()

  console.info('[FCM] Notification permission result.', { permission })

  if (permission !== 'granted') {
    return null
  }

  const messaging = await getFirebaseMessaging()

  if (!messaging) {
    return null
  }

  const serviceWorkerRegistration =
    await getMessagingServiceWorkerRegistration()

  if (!serviceWorkerRegistration) {
    return null
  }

  console.info('[FCM] Requesting FCM registration token.', {
    serviceWorkerScope: serviceWorkerRegistration.scope,
    serviceWorkerState: serviceWorkerRegistration.active?.state,
    hasVapidKey: Boolean(import.meta.env.VITE_FIREBASE_VAPID_KEY),
  })

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration,
  })

  console.info('[FCM] FCM registration token result.', {
    hasToken: Boolean(token),
    tokenPrefix: token ? token.slice(0, 16) : null,
  })

  return token
}

export async function listenForegroundMessage(
  onPush: (payload: MessagePayload) => void
): Promise<Unsubscribe> {
  const messaging = await getFirebaseMessaging()

  if (!messaging) {
    console.warn('[FCM] Foreground listener skipped: messaging unavailable.')
    return () => {}
  }

  console.info('[FCM] Foreground message listener attached.')
  return onMessage(messaging, onPush)
}

export function getNotificationPermission() {
  if (!('Notification' in window)) {
    return 'unsupported'
  }

  return Notification.permission
}
