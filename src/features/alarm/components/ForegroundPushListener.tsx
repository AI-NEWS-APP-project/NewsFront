import { useEffect } from 'react'
import { router } from '@app/router'
import { listenForegroundMessage } from '@features/alarm/lib/fcmMessaging'
import {
  resolvePushRoute,
  type PushMessageData,
} from '@features/alarm/model/pushPayload'

export default function ForegroundPushListener() {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    let isMounted = true

    console.info('[FCM] ForegroundPushListener mounted.')

    void listenForegroundMessage(payload => {
      const route = resolvePushRoute(payload.data as PushMessageData)
      const title = payload.notification?.title || 'BRIEFY'
      const body = payload.notification?.body

      console.info('[FCM] Foreground message received.', {
        notification: payload.notification,
        data: payload.data,
        route,
        permission:
          'Notification' in window ? Notification.permission : 'unsupported',
      })

      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body,
          data: { route },
        })

        console.info('[FCM] Foreground browser notification shown.', {
          title,
          route,
        })

        notification.onclick = () => {
          console.info('[FCM] Foreground notification clicked.', { route })
          window.focus()
          void router.navigate(route)
          notification.close()
        }

        return
      }

      void router.navigate(route)
    }).then(nextUnsubscribe => {
      if (isMounted) {
        unsubscribe = nextUnsubscribe
        console.info('[FCM] Foreground message listener ready.')
        return
      }

      nextUnsubscribe()
    })

    return () => {
      isMounted = false
      unsubscribe?.()
      console.info('[FCM] ForegroundPushListener unmounted.')
    }
  }, [])

  return null
}
