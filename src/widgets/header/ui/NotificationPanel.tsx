import type { NotificationItem as NotificationItemType } from '@features/alarm/api/notifications'
import Button from '@shared/components/Button'
import { NotificationItem } from '@widgets/header/ui/NotificationItem'

interface NotificationPanelProps {
  canMarkAllRead: boolean
  errorMessage: string
  isDeletingNotification: boolean
  isLoading: boolean
  isMarkingAllRead: boolean
  isOpen: boolean
  notifications: NotificationItemType[]
  onClose: () => void
  onDeleteNotification: (notificationId: number | string) => void
  onMarkAllRead: () => void
  onNotificationClick: (notification: NotificationItemType) => void
  onRetry: () => void
  unreadCount: number
}

export function NotificationPanel({
  canMarkAllRead,
  errorMessage,
  isDeletingNotification,
  isLoading,
  isMarkingAllRead,
  isOpen,
  notifications,
  onClose,
  onDeleteNotification,
  onMarkAllRead,
  onNotificationClick,
  onRetry,
  unreadCount,
}: NotificationPanelProps) {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/10 backdrop-blur-[2px]"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-70 h-full w-95 border-l border-gray-100 bg-white shadow-2xl transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <div>
              <div className="text-lg font-bold text-[#2C3E50]">알림</div>
              <div className="mt-1 text-xs font-medium text-[#7899C5]">
                읽지 않은 알림 {unreadCount}개
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 hover:bg-gray-100"
              aria-label="알림 패널 닫기"
            >
              <span className="block size-5 text-gray-400">x</span>
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm font-medium text-gray-400">
                알림을 불러오는 중입니다.
              </div>
            ) : errorMessage ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="text-sm font-semibold text-[#2C3E50]">
                  {errorMessage}
                </div>
                <Button
                  type="button"
                  onClick={onRetry}
                  variant="secondary"
                  className="h-10 w-auto rounded-xl px-4 text-sm"
                >
                  다시 시도
                </Button>
              </div>
            ) : notifications.length ? (
              <div className="space-y-2">
                {notifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    disabledDelete={isDeletingNotification}
                    notification={notification}
                    onClick={onNotificationClick}
                    onDelete={onDeleteNotification}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-medium text-gray-400">
                도착한 알림이 없습니다.
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 p-4">
            <Button
              type="button"
              onClick={onMarkAllRead}
              disabled={!canMarkAllRead}
              className="h-11 w-full rounded-xl border border-[#7899C5] bg-white text-sm font-bold text-[#7899C5] transition-colors hover:bg-[#F4F8FB]"
            >
              {isMarkingAllRead ? '처리 중...' : '모두 읽음으로 표시'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
