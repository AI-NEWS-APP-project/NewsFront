import type { NotificationItem as NotificationItemType } from '@features/alarm/api/notifications'
import { TrashIcon } from '@shared/assets/icons'
import { formatNotificationTime } from '@widgets/header/lib/formatNotificationTime'

interface NotificationItemProps {
  disabledDelete: boolean
  notification: NotificationItemType
  onClick: (notification: NotificationItemType) => void
  onDelete: (notificationId: number | string) => void
}

export function NotificationItem({
  disabledDelete,
  notification,
  onClick,
  onDelete,
}: NotificationItemProps) {
  const isUnread = !notification.readAt

  return (
    <div
      className={`w-full rounded-lg border p-4 text-left transition-colors hover:bg-[#F6FAFE] ${
        isUnread ? 'border-[#D9E5F3] bg-[#F7FBFF]' : 'border-gray-100 bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1.5 size-2 rounded-full ${
            isUnread ? 'bg-[#7899C5]' : 'bg-gray-200'
          }`}
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={() => onClick(notification)}
          className="min-w-0 flex-1 text-left"
        >
          <span className="block truncate text-sm font-bold text-[#2C3E50]">
            {notification.title || 'BRIEFY 알림'}
          </span>
          {notification.body ? (
            <span className="mt-1 line-clamp-2 block text-sm leading-5 text-[#5A6A85]">
              {notification.body}
            </span>
          ) : null}
          {notification.sentAt ? (
            <span className="mt-2 block text-xs font-medium text-gray-400">
              {formatNotificationTime(notification.sentAt)}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => onDelete(notification.id)}
          disabled={disabledDelete}
          aria-label="알림 삭제"
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-white hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <TrashIcon className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
