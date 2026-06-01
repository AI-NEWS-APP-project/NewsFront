import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  NotificationPage,
  UnreadNotificationCount,
} from '@features/alarm/api/notifications'
import {
  decrementUnreadCount,
  isSameNotification,
  removeNotification,
  setAllNotificationsRead,
  setNotificationRead,
} from '@features/alarm/model/notificationCache'
import { notificationKeys } from '@features/alarm/model/notificationQueryKeys'
import {
  deleteNotificationOrThrow,
  markAllNotificationsAsReadOrThrow,
  markNotificationAsReadOrThrow,
} from '@features/alarm/model/notificationRequests'
import {
  NOTIFICATION_PAGE_SIZE,
  type UseNotificationsParams,
} from '@features/alarm/model/useNotificationQueries'

export function useMarkNotificationAsReadMutation({
  page = 0,
  size = NOTIFICATION_PAGE_SIZE,
  userId,
}: Omit<UseNotificationsParams, 'enabled'>) {
  const queryClient = useQueryClient()
  const queryKey =
    userId === undefined ? undefined : notificationKeys.list(userId, page, size)
  const unreadCountQueryKey =
    userId === undefined ? undefined : notificationKeys.unreadCount(userId)

  return useMutation({
    mutationFn: markNotificationAsReadOrThrow,
    onMutate: async notificationId => {
      if (!queryKey || !unreadCountQueryKey) {
        return
      }

      await queryClient.cancelQueries({ queryKey })
      await queryClient.cancelQueries({ queryKey: unreadCountQueryKey })
      const previousPage = queryClient.getQueryData<NotificationPage>(queryKey)
      const previousUnreadCount =
        queryClient.getQueryData<UnreadNotificationCount>(unreadCountQueryKey)
      const wasUnread = previousPage?.content.some(
        notification =>
          isSameNotification(notification, notificationId) &&
          !notification.readAt
      )
      const readAt = new Date().toISOString()

      queryClient.setQueryData<NotificationPage>(queryKey, current =>
        setNotificationRead(current, notificationId, readAt)
      )
      if (wasUnread) {
        queryClient.setQueryData<UnreadNotificationCount>(
          unreadCountQueryKey,
          decrementUnreadCount
        )
      }

      return { previousPage, previousUnreadCount }
    },
    onError: (_error, _notificationId, context) => {
      if (queryKey && context?.previousPage) {
        queryClient.setQueryData(queryKey, context.previousPage)
      }
      if (unreadCountQueryKey && context?.previousUnreadCount) {
        queryClient.setQueryData(
          unreadCountQueryKey,
          context.previousUnreadCount
        )
      }
    },
    onSettled: () => {
      if (queryKey) {
        void queryClient.invalidateQueries({ queryKey })
      }
      if (unreadCountQueryKey) {
        void queryClient.invalidateQueries({ queryKey: unreadCountQueryKey })
      }
    },
  })
}

export function useMarkAllNotificationsAsReadMutation({
  page = 0,
  size = NOTIFICATION_PAGE_SIZE,
  userId,
}: Omit<UseNotificationsParams, 'enabled'>) {
  const queryClient = useQueryClient()
  const queryKey =
    userId === undefined ? undefined : notificationKeys.list(userId, page, size)
  const unreadCountQueryKey =
    userId === undefined ? undefined : notificationKeys.unreadCount(userId)

  return useMutation({
    mutationFn: markAllNotificationsAsReadOrThrow,
    onMutate: async () => {
      if (!queryKey || !unreadCountQueryKey) {
        return
      }

      await queryClient.cancelQueries({ queryKey })
      await queryClient.cancelQueries({ queryKey: unreadCountQueryKey })
      const previousPage = queryClient.getQueryData<NotificationPage>(queryKey)
      const previousUnreadCount =
        queryClient.getQueryData<UnreadNotificationCount>(unreadCountQueryKey)
      const readAt = new Date().toISOString()

      queryClient.setQueryData<NotificationPage>(queryKey, current =>
        setAllNotificationsRead(current, readAt)
      )
      queryClient.setQueryData<UnreadNotificationCount>(unreadCountQueryKey, {
        unreadCount: 0,
      })

      return { previousPage, previousUnreadCount }
    },
    onError: (_error, _variables, context) => {
      if (queryKey && context?.previousPage) {
        queryClient.setQueryData(queryKey, context.previousPage)
      }
      if (unreadCountQueryKey && context?.previousUnreadCount) {
        queryClient.setQueryData(
          unreadCountQueryKey,
          context.previousUnreadCount
        )
      }
    },
    onSettled: () => {
      if (queryKey) {
        void queryClient.invalidateQueries({ queryKey })
      }
      if (unreadCountQueryKey) {
        void queryClient.invalidateQueries({ queryKey: unreadCountQueryKey })
      }
    },
  })
}

export function useDeleteNotificationMutation({
  page = 0,
  size = NOTIFICATION_PAGE_SIZE,
  userId,
}: Omit<UseNotificationsParams, 'enabled'>) {
  const queryClient = useQueryClient()
  const queryKey =
    userId === undefined ? undefined : notificationKeys.list(userId, page, size)
  const unreadCountQueryKey =
    userId === undefined ? undefined : notificationKeys.unreadCount(userId)

  return useMutation({
    mutationFn: deleteNotificationOrThrow,
    onMutate: async notificationId => {
      if (!queryKey || !unreadCountQueryKey) {
        return
      }

      await queryClient.cancelQueries({ queryKey })
      await queryClient.cancelQueries({ queryKey: unreadCountQueryKey })
      const previousPage = queryClient.getQueryData<NotificationPage>(queryKey)
      const previousUnreadCount =
        queryClient.getQueryData<UnreadNotificationCount>(unreadCountQueryKey)
      const deletedNotification = previousPage?.content.find(notification =>
        isSameNotification(notification, notificationId)
      )

      queryClient.setQueryData<NotificationPage>(queryKey, current =>
        removeNotification(current, notificationId)
      )
      if (deletedNotification && !deletedNotification.readAt) {
        queryClient.setQueryData<UnreadNotificationCount>(
          unreadCountQueryKey,
          decrementUnreadCount
        )
      }

      return { previousPage, previousUnreadCount }
    },
    onError: (_error, _notificationId, context) => {
      if (queryKey && context?.previousPage) {
        queryClient.setQueryData(queryKey, context.previousPage)
      }
      if (unreadCountQueryKey && context?.previousUnreadCount) {
        queryClient.setQueryData(
          unreadCountQueryKey,
          context.previousUnreadCount
        )
      }
    },
    onSettled: () => {
      if (queryKey) {
        void queryClient.invalidateQueries({ queryKey })
      }
      if (unreadCountQueryKey) {
        void queryClient.invalidateQueries({ queryKey: unreadCountQueryKey })
      }
    },
  })
}
