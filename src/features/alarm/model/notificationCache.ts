import type {
  NotificationItem,
  NotificationPage,
  UnreadNotificationCount,
} from '@features/alarm/api/notifications'

export function isSameNotification(
  notification: NotificationItem,
  notificationId: number | string
) {
  return String(notification.id) === String(notificationId)
}

export function decrementUnreadCount(
  count: UnreadNotificationCount | undefined
) {
  if (!count) {
    return count
  }

  return {
    unreadCount: Math.max(count.unreadCount - 1, 0),
  }
}

export function setNotificationRead(
  page: NotificationPage | undefined,
  notificationId: number | string,
  readAt: string
) {
  if (!page) {
    return page
  }

  return {
    ...page,
    content: page.content.map(notification =>
      isSameNotification(notification, notificationId)
        ? { ...notification, readAt }
        : notification
    ),
  }
}

export function setAllNotificationsRead(
  page: NotificationPage | undefined,
  readAt: string
) {
  if (!page) {
    return page
  }

  return {
    ...page,
    content: page.content.map(notification => ({ ...notification, readAt })),
  }
}

export function removeNotification(
  page: NotificationPage | undefined,
  notificationId: number | string
) {
  if (!page) {
    return page
  }

  const content = page.content.filter(
    notification => !isSameNotification(notification, notificationId)
  )

  return {
    ...page,
    totalElements: Math.max(page.totalElements - 1, 0),
    numberOfElements: Math.max(page.numberOfElements - 1, 0),
    empty: content.length === 0,
    content,
  }
}
