import { useQuery } from '@tanstack/react-query'
import {
  getNotifications,
  getUnreadNotificationCount,
} from '@features/alarm/api/notifications'
import { notificationKeys } from '@features/alarm/model/notificationQueryKeys'
import {
  requireNotificationPage,
  requireUnreadNotificationCount,
} from '@features/alarm/model/notificationRequests'

export const NOTIFICATION_PAGE_SIZE = 20

export interface UseNotificationsParams {
  enabled: boolean
  page?: number
  size?: number
  userId?: number | string
}

export function useNotifications({
  enabled,
  page = 0,
  size = NOTIFICATION_PAGE_SIZE,
  userId,
}: UseNotificationsParams) {
  return useQuery({
    queryKey: notificationKeys.list(userId ?? 'anonymous', page, size),
    queryFn: async () => {
      const result = await getNotifications({ page, size })
      return requireNotificationPage(result)
    },
    enabled: enabled && userId !== undefined,
  })
}

export function useUnreadNotificationCount({
  enabled,
  userId,
}: Pick<UseNotificationsParams, 'enabled' | 'userId'>) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(userId ?? 'anonymous'),
    queryFn: async () => {
      const result = await getUnreadNotificationCount()
      return requireUnreadNotificationCount(result)
    },
    enabled: enabled && userId !== undefined,
  })
}
