const FCM_TOKEN_STORAGE_KEY = 'briefy-fcm-token'

export function getStoredFcmToken() {
  return localStorage.getItem(FCM_TOKEN_STORAGE_KEY)
}

export function saveStoredFcmToken(token: string) {
  localStorage.setItem(FCM_TOKEN_STORAGE_KEY, token)
}

export function clearStoredFcmToken() {
  localStorage.removeItem(FCM_TOKEN_STORAGE_KEY)
}
