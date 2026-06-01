import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  NOTIFICATION_PAGE_SIZE,
  useDeleteNotificationMutation,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
  useNotifications,
  useUnreadNotificationCount,
} from '@features/alarm/model/useNotifications'
import type {
  NotificationItem,
  NotificationPage,
} from '@features/alarm/api/notifications'
import { resolvePushRoute } from '@features/alarm/model/pushPayload'

function getNotificationItems(
  isAuthenticated: boolean,
  page?: NotificationPage
) {
  if (!isAuthenticated) {
    return []
  }

  return page?.content ?? []
}

function getUnreadCount(
  isAuthenticated: boolean,
  unreadCount: number | undefined,
  notifications: NotificationItem[]
) {
  if (!isAuthenticated) {
    return 0
  }

  if (unreadCount !== undefined) {
    return unreadCount
  }

  return notifications.filter(notification => !notification.readAt).length
}

function getNotificationErrorMessage({
  isAuthenticated,
  isQueryError,
  isMarkAllError,
}: {
  isAuthenticated: boolean
  isQueryError: boolean
  isMarkAllError: boolean
}) {
  if (!isAuthenticated) {
    return ''
  }

  if (isQueryError) {
    return '알림을 불러오지 못했습니다.'
  }

  if (isMarkAllError) {
    return '전체 읽음 처리에 실패했습니다.'
  }

  return ''
}

interface UseHeaderNotificationsParams {
  isAuthenticated: boolean
  onNotificationOpenChange: (open: boolean) => void
  userId?: number | string
}

export function useHeaderNotifications({
  isAuthenticated,
  onNotificationOpenChange,
  userId,
}: UseHeaderNotificationsParams) {
  const navigate = useNavigate()
  const notificationsQuery = useNotifications({
    enabled: isAuthenticated,
    userId,
    page: 0,
    size: NOTIFICATION_PAGE_SIZE,
  })
  const unreadNotificationCountQuery = useUnreadNotificationCount({
    enabled: isAuthenticated,
    userId,
  })
  const markNotificationAsReadMutation = useMarkNotificationAsReadMutation({
    userId,
    page: 0,
    size: NOTIFICATION_PAGE_SIZE,
  })
  const markAllNotificationsAsReadMutation =
    useMarkAllNotificationsAsReadMutation({
      userId,
      page: 0,
      size: NOTIFICATION_PAGE_SIZE,
    })
  const deleteNotificationMutation = useDeleteNotificationMutation({
    userId,
    page: 0,
    size: NOTIFICATION_PAGE_SIZE,
  })

  const notificationPage = notificationsQuery.data
  const notifications = getNotificationItems(isAuthenticated, notificationPage)
  const unreadCount = getUnreadCount(
    isAuthenticated,
    unreadNotificationCountQuery.data?.unreadCount,
    notifications
  )
  const isLoading =
    isAuthenticated &&
    (notificationsQuery.isPending ||
      (notificationsQuery.isFetching && !notificationPage))
  const errorMessage = getNotificationErrorMessage({
    isAuthenticated,
    isQueryError: notificationsQuery.isError,
    isMarkAllError: markAllNotificationsAsReadMutation.isError,
  })
  const isMarkingAllRead = markAllNotificationsAsReadMutation.isPending
  const canMarkAllRead = unreadCount > 0 && !isMarkingAllRead

  const readAndOpenNotification = useCallback(
    async (notification: NotificationItem) => {
      if (!notification.readAt) {
        try {
          await markNotificationAsReadMutation.mutateAsync(notification.id)
        } catch (error) {
          console.error('알림 읽음 처리 실패:', error)
          return
        }
      }

      onNotificationOpenChange(false)
      navigate(resolvePushRoute({ route: notification.route ?? undefined }))
    },
    [markNotificationAsReadMutation, navigate, onNotificationOpenChange]
  )

  const markAllRead = useCallback(async () => {
    if (!canMarkAllRead) {
      return
    }

    try {
      await markAllNotificationsAsReadMutation.mutateAsync()
    } catch (error) {
      console.error('전체 알림 읽음 처리 실패:', error)
    }
  }, [canMarkAllRead, markAllNotificationsAsReadMutation])

  const deleteNotification = useCallback(
    async (notificationId: number | string) => {
      if (deleteNotificationMutation.isPending) {
        return
      }

      try {
        await deleteNotificationMutation.mutateAsync(notificationId)
      } catch (error) {
        console.error('알림 삭제 실패:', error)
      }
    },
    [deleteNotificationMutation]
  )

  return {
    canMarkAllRead,
    deleteNotification,
    errorMessage,
    isDeletingNotification: deleteNotificationMutation.isPending,
    isLoading,
    isMarkingAllRead,
    markAllRead,
    notifications,
    readAndOpenNotification,
    refetchNotifications: notificationsQuery.refetch,
    unreadCount,
  }
}
