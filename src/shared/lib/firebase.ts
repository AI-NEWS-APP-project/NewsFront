import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

let firebaseApp: FirebaseApp | null = null

function hasFirebaseConfig() {
  const configured = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  )

  if (!configured) {
    console.warn('[FCM] Firebase config is incomplete.', {
      hasApiKey: Boolean(firebaseConfig.apiKey),
      hasAuthDomain: Boolean(firebaseConfig.authDomain),
      hasProjectId: Boolean(firebaseConfig.projectId),
      hasMessagingSenderId: Boolean(firebaseConfig.messagingSenderId),
      hasAppId: Boolean(firebaseConfig.appId),
    })
  }

  return configured
}

export function getFirebaseApp() {
  if (!hasFirebaseConfig()) {
    return null
  }

  if (!firebaseApp) {
    console.info('[FCM] Initializing Firebase app.', {
      projectId: firebaseConfig.projectId,
      messagingSenderId: firebaseConfig.messagingSenderId,
    })
    firebaseApp = initializeApp(firebaseConfig)
  }

  return firebaseApp
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  const app = getFirebaseApp()

  if (!app) {
    return null
  }

  const supported = await isSupported()

  if (!supported) {
    console.warn('[FCM] Firebase messaging is not supported in this browser.')
    return null
  }

  console.info('[FCM] Firebase messaging is supported.')
  return getMessaging(app)
}

export function getFirebaseServiceWorkerUrl() {
  const params = new URLSearchParams({
    apiKey: firebaseConfig.apiKey ?? '',
    authDomain: firebaseConfig.authDomain ?? '',
    projectId: firebaseConfig.projectId ?? '',
    storageBucket: firebaseConfig.storageBucket ?? '',
    messagingSenderId: firebaseConfig.messagingSenderId ?? '',
    appId: firebaseConfig.appId ?? '',
  })

  return `/firebase-messaging-sw.js?${params.toString()}`
}
