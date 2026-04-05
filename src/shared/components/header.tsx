import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import alarmIcon from '@shared/assets/alarm.png'
import userIcon from '@shared/assets/user.png'
import Button from './Button'

export default function Header() {
  const [notificationOpen, setNotificationOpen] = useState(false)

  useEffect(() => {
    if (notificationOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
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
            <div
              onClick={() => setNotificationOpen(true)}
              className="group relative rounded-full p-2 transition-colors hover:bg-gray-50"
            >
              <img
                src={alarmIcon}
                alt="알림"
                className="size-6 text-[#5A6A85] group-hover:text-[#7899C5]"
              />
              <div className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full border-2 border-white bg-[#7899C5]">
                <span className="text-[9px] leading-none font-bold text-white">
                  1
                </span>
              </div>
            </div>
            <Link to="/setting/alarm">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#7899C5] shadow-sm transition-all hover:bg-[#6688B3]">
                <img src={userIcon} className="size-5 text-white" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      {notificationOpen && (
        <div
          className="fixed inset-0 z-60 bg-black/10 backdrop-blur-[2px]"
          onClick={() => setNotificationOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 z-70 h-full w-95 border-l border-gray-100 bg-white shadow-2xl transition-transform duration-300 ease-out ${notificationOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <div className="text-lg font-bold text-[#2C3E50]">알림</div>
            <div
              onClick={() => setNotificationOpen(false)}
              className="rounded-md p-1.5 hover:bg-gray-100"
            >
              <div className="size-5 text-gray-400">x</div>
            </div>
          </div>

          <div className="border-t border-gray-100 p-4">
            <Button className="h-11 w-full rounded-xl border border-[#7899C5] bg-white text-sm font-bold text-[#7899C5] transition-colors hover:bg-[#F4F8FB]">
              모두 읽음으로 표시
            </Button>
          </div>
        </div>
      </div>
      <div className="h-17.5" />
    </>
  )
}
