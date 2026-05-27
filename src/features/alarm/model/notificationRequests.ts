import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@features/alarm/api/notifications'

export function requireNotificationPage(
  result: Awaited<ReturnType<typeof getNotifications>>
) {
  if (result.success === false || !result.data) {
    throw new Error(result.message || '알림을 불러오지 못했습니다.')
  }

  return result.data
}

export function requireUnreadNotificationCount(
  result: Awaited<ReturnType<typeof getUnreadNotificationCount>>
) {
  if (result.success === false || !result.data) {
    throw new Error(result.message || '미확인 알림 수를 불러오지 못했습니다.')
  }

  return result.data
}

export async function markNotificationAsReadOrThrow(
  notificationId: number | string
) {
  const result = await markNotificationAsRead(notificationId)

  if (result.success === false) {
    throw new Error(result.message || '알림 읽음 처리에 실패했습니다.')
  }

  return result
}

export async function markAllNotificationsAsReadOrThrow() {
  const result = await markAllNotificationsAsRead()

  if (result.success === false) {
    throw new Error(result.message || '전체 알림 읽음 처리에 실패했습니다.')
  }

  return result
}

export async function deleteNotificationOrThrow(
  notificationId: number | string
) {
  const result = await deleteNotification(notificationId)

  if (result.success === false) {
    throw new Error(result.message || '알림 삭제에 실패했습니다.')
  }

  return result
}
