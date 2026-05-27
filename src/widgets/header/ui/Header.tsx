import { memo, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import { AlarmIcon, UserIcon } from '@shared/assets/icons'
import Button from '@shared/components/Button'
import { useHeaderLogout } from '@widgets/header/model/useHeaderLogout'
import { useHeaderNotifications } from '@widgets/header/model/useHeaderNotifications'
import { NotificationPanel } from '@widgets/header/ui/NotificationPanel'

const Header = memo(function Header() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const user = useAuthStore(state => state.user)
  const userId = user?.id
  const [notificationOpen, setNotificationOpen] = useState(false)
  const { handleLogout, isLoggingOut } = useHeaderLogout()

  const closeNotification = useCallback(() => {
    setNotificationOpen(false)
  }, [])
  const openNotification = useCallback(() => {
    setNotificationOpen(true)
  }, [])

  const {
    canMarkAllRead,
    deleteNotification,
    errorMessage,
    isDeletingNotification,
    isLoading,
    isMarkingAllRead,
    markAllRead,
    notifications,
    readAndOpenNotification,
    refetchNotifications,
    unreadCount,
  } = useHeaderNotifications({
    isAuthenticated,
    onNotificationOpenChange: setNotificationOpen,
    userId,
  })

  useEffect(() => {
    if (notificationOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [notificationOpen])

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
            <button
              type="button"
              onClick={openNotification}
              className="group relative rounded-full p-2 transition-colors hover:bg-gray-50"
              aria-label="알림 열기"
            >
              <AlarmIcon
                className="size-6 text-[#5A6A85] transition-colors group-hover:text-[#7899C5]"
                aria-hidden="true"
              />
              {unreadCount > 0 ? (
                <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full border-2 border-white bg-[#7899C5]">
                  <span className="text-[9px] leading-none font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </span>
              ) : null}
            </button>
            <Link to="/setting/alarm">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#7899C5] shadow-sm transition-all hover:bg-[#6688B3]">
                <UserIcon className="size-5 text-white" aria-hidden="true" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <NotificationPanel
        canMarkAllRead={canMarkAllRead}
        errorMessage={errorMessage}
        isDeletingNotification={isDeletingNotification}
        isLoading={isLoading}
        isMarkingAllRead={isMarkingAllRead}
        isOpen={notificationOpen}
        notifications={notifications}
        onClose={closeNotification}
        onDeleteNotification={deleteNotification}
        onMarkAllRead={markAllRead}
        onNotificationClick={readAndOpenNotification}
        onRetry={() => void refetchNotifications()}
        unreadCount={unreadCount}
      />
      <div className="h-17.5" />
    </>
  )
})

export default Header
