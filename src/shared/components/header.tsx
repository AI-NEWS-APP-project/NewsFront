import { memo, useCallback, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationItem,
} from '@features/alarm/api/notifications'
import { getAuthErrorMessage, logout } from '@features/auth/api/auth'
import { disableStoredFcmToken } from '@features/alarm/lib/fcmTokenLifecycle'
import { resolvePushRoute } from '@features/alarm/model/pushPayload'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import { AlarmIcon, UserIcon } from '@shared/assets/icons'
import Button from './Button'

const NOTIFICATION_PAGE_SIZE = 20

function formatNotificationTime(value?: string | null) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const Header = memo(function Header() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const user = useAuthStore(state => state.user)
  const clearAuth = useAuthStore(state => state.clearAuth)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [isNotificationLoading, setIsNotificationLoading] = useState(false)
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)
  const [notificationError, setNotificationError] = useState('')
  const notificationRequestRef = useRef(false)

  const unreadCount = notifications.filter(
    notification => !notification.readAt
  ).length

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([])
      setNotificationError('')
      return
    }

    if (notificationRequestRef.current) {
      return
    }

    notificationRequestRef.current = true
    setIsNotificationLoading(true)
    setNotificationError('')

    try {
      const result = await getNotifications({
        page: 0,
        size: NOTIFICATION_PAGE_SIZE,
      })

      if (result.success === false) {
        throw new Error(result.message || '알림을 불러오지 못했습니다.')
      }

      setNotifications(result.data?.content ?? [])
    } catch (error) {
      console.error('알림 내역 조회 실패:', error)
      setNotificationError('알림을 불러오지 못했습니다.')
    } finally {
      notificationRequestRef.current = false
      setIsNotificationLoading(false)
    }
  }, [isAuthenticated])

  const openNotification = useCallback(() => {
    setNotificationOpen(true)
    void loadNotifications()
  }, [loadNotifications])

  const closeNotification = useCallback(() => {
    setNotificationOpen(false)
  }, [])

  useEffect(() => {
    if (notificationOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [notificationOpen])

  const handleNotificationClick = useCallback(
    async (notification: NotificationItem) => {
      if (!notification.readAt) {
        setNotifications(prev =>
          prev.map(item =>
            item.id === notification.id
              ? { ...item, readAt: new Date().toISOString() }
              : item
          )
        )

        try {
          const result = await markNotificationAsRead(notification.id)

          if (result.success === false) {
            throw new Error(result.message || '알림 읽음 처리에 실패했습니다.')
          }
        } catch (error) {
          console.error('알림 읽음 처리 실패:', error)
          void loadNotifications()
          return
        }
      }

      setNotificationOpen(false)
      navigate(resolvePushRoute({ route: notification.route ?? undefined }))
    },
    [loadNotifications, navigate]
  )

  const handleMarkAllRead = useCallback(async () => {
    if (!unreadCount || isMarkingAllRead) {
      return
    }

    setIsMarkingAllRead(true)
    setNotificationError('')

    try {
      const result = await markAllNotificationsAsRead()

      if (result.success === false) {
        throw new Error(result.message || '전체 알림 읽음 처리에 실패했습니다.')
      }

      const readAt = new Date().toISOString()
      setNotifications(prev => prev.map(item => ({ ...item, readAt })))
    } catch (error) {
      console.error('전체 알림 읽음 처리 실패:', error)
      setNotificationError('전체 읽음 처리에 실패했습니다.')
    } finally {
      setIsMarkingAllRead(false)
    }
  }, [isMarkingAllRead, unreadCount])

  const handleLogout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken')

    setIsLoggingOut(true)

    try {
      if (user) {
        try {
          await disableStoredFcmToken()
        } catch (error) {
          console.error('FCM token 비활성화 실패:', error)
        }
      }

      if (refreshToken) {
        await logout(refreshToken)
      }
    } catch (error) {
      console.error(
        getAuthErrorMessage(error, '로그아웃 요청 중 문제가 발생했습니다.')
      )
    } finally {
      clearAuth()
      setIsLoggingOut(false)
      navigate('/login')
    }
  }, [clearAuth, navigate, user])

  return (
    <>
      <header className="fixed top-0 left-1/2 z-50 h-17.5 w-screen -translate-x-1/2 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8">
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="text-[22px] font-extrabold tracking-tight text-[#7899C5]"
            >
              BRIEFY
            </Link>
            <nav className="flex items-center gap-8">
              <Link
                to="/dashboard"
                className="text-[15px] font-medium text-[#5A6A85] transition-colors hover:text-[#7899C5]"
              >
                대시보드
              </Link>
              <Link
                to="/setting/alarm"
                className="text-[15px] font-medium text-[#5A6A85] transition-colors hover:text-[#7899C5]"
              >
                설정
              </Link>
              <Link
                to="/news"
                className="text-[15px] font-medium text-[#5A6A85] transition-colors hover:text-[#7899C5]"
              >
                뉴스
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="secondary"
                className="h-10 w-auto rounded-xl border border-[#D9E5F3] px-4 text-sm font-semibold text-[#4A678C] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
              </Button>
            ) : null}
            <div
              onClick={openNotification}
              className="group relative rounded-full p-2 transition-colors hover:bg-gray-50"
            >
              <AlarmIcon
                aria-label="알림"
                className="size-6 text-[#5A6A85] transition-colors group-hover:text-[#7899C5]"
              />
              {unreadCount > 0 ? (
                <div className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full border-2 border-white bg-[#7899C5]">
                  <span className="text-[9px] leading-none font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>
              ) : null}
            </div>
            <Link to="/setting/alarm">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#7899C5] shadow-sm transition-all hover:bg-[#6688B3]">
                <UserIcon className="size-5 text-white" aria-hidden="true" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {notificationOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/10 backdrop-blur-[2px]"
          onClick={closeNotification}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-70 h-full w-95 border-l border-gray-100 bg-white shadow-2xl transition-transform duration-300 ease-out ${notificationOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <div>
              <div className="text-lg font-bold text-[#2C3E50]">알림</div>
              <div className="mt-1 text-xs font-medium text-[#7899C5]">
                읽지 않은 알림 {unreadCount}개
              </div>
            </div>
            <div
              onClick={closeNotification}
              className="rounded-md p-1.5 hover:bg-gray-100"
            >
              <div className="size-5 text-gray-400">x</div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            {isNotificationLoading ? (
              <div className="flex h-full items-center justify-center text-sm font-medium text-gray-400">
                알림을 불러오는 중입니다.
              </div>
            ) : notificationError ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="text-sm font-semibold text-[#2C3E50]">
                  {notificationError}
                </div>
                <Button
                  type="button"
                  onClick={loadNotifications}
                  variant="secondary"
                  className="h-10 w-auto rounded-xl px-4 text-sm"
                >
                  다시 시도
                </Button>
              </div>
            ) : notifications.length ? (
              <div className="space-y-2">
                {notifications.map(notification => {
                  const isUnread = !notification.readAt

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => void handleNotificationClick(notification)}
                      className={`w-full rounded-lg border p-4 text-left transition-colors hover:bg-[#F6FAFE] ${
                        isUnread
                          ? 'border-[#D9E5F3] bg-[#F7FBFF]'
                          : 'border-gray-100 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-1.5 size-2 rounded-full ${
                            isUnread ? 'bg-[#7899C5]' : 'bg-gray-200'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="min-w-0 flex-1">
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
                        </span>
                      </div>
                    </button>
                  )
                })}
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
              onClick={handleMarkAllRead}
              disabled={!unreadCount || isMarkingAllRead}
              className="h-11 w-full rounded-xl border border-[#7899C5] bg-white text-sm font-bold text-[#7899C5] transition-colors hover:bg-[#F4F8FB]"
            >
              {isMarkingAllRead ? '처리 중...' : '모두 읽음으로 표시'}
            </Button>
          </div>
        </div>
      </div>
      <div className="h-17.5" />
    </>
  )
})

export default Header
