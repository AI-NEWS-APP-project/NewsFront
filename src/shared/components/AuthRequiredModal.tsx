import { Link, type To } from 'react-router-dom'
import Button from '@shared/components/Button'

interface AuthRequiredModalProps {
  loginTo: To
  signupTo: To
}

export default function AuthRequiredModal({
  loginTo,
  signupTo,
}: AuthRequiredModalProps) {
  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-[#102033]/35 px-5 backdrop-blur-[3px]"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-required-title"
        className="w-full max-w-100 rounded-3xl border border-[#D9E5F3] bg-white px-7 py-8 text-center shadow-[0_18px_48px_rgba(36,58,87,0.22)]"
      >
        <div className="m-5 text-[36px] font-extrabold tracking-tight text-[#7899C5]">
          BRIEFY
        </div>
        <div className="mx-auto mb-7 max-w-78 text-[15px] leading-6 text-[#5A6A85]">
          BRIEFY의 맞춤 뉴스와 알림을 이용하려면 로그인하거나 회원가입해 주세요.
        </div>
        <div className="space-y-3">
          <Button to={loginTo} className="h-12 rounded-xl text-[16px]">
            로그인
          </Button>
          <Button
            to={signupTo}
            variant="secondary"
            className="h-12 rounded-xl text-[16px]"
          >
            회원가입
          </Button>
        </div>
        <Link
          to="/"
          className="mt-5 inline-flex text-[14px] font-semibold text-[#7899C5] hover:text-[#6688B3]"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
