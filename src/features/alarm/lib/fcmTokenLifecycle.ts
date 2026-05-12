import {
  disableFcmToken,
  registerFcmToken,
} from '@features/alarm/api/fcmTokens'
import { requestFcmToken } from '@features/alarm/lib/fcmMessaging'
import {
  clearStoredFcmToken,
  getStoredFcmToken,
  saveStoredFcmToken,
} from '@features/alarm/model/fcmTokenStorage'

export async function enableFcmToken() {
  const token = await requestFcmToken()

  if (!token) {
    return null
  }

  const result = await registerFcmToken({ token })

  if (result.success === false) {
    throw new Error(result.message || '알림 token 등록에 실패했습니다.')
  }

  saveStoredFcmToken(token)
  return token
}

export async function disableStoredFcmToken() {
  const token = getStoredFcmToken()

  if (!token) {
    return
  }

  const result = await disableFcmToken({ token })

  if (result.success === false) {
    throw new Error(result.message || '알림 token 비활성화에 실패했습니다.')
  }

  clearStoredFcmToken()
}
