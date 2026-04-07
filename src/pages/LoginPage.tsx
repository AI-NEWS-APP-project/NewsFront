import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import { verifyRegisteredUser } from '@features/auth/model/localAuth'
import { LockIcon, MailIcon } from '@shared/assets/icons'
import Header from '@shared/components/header'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'

const EMAIL_ICON = <MailIcon className="size-4.5 text-[#5A6A85]" />
const PASSWORD_ICON = <LockIcon className="size-4.5 text-[#5A6A85]" />

function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(state => state.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value)
      setLoginError('')
    },
    []
  )

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value)
      setLoginError('')
    },
    []
  )

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    const registeredUser = verifyRegisteredUser(email, password)

    if (!registeredUser) {
      setLoginError('회원가입한 이메일 또는 비밀번호가 일치하지 않습니다.')
      return
    }

    setLoginError('')
    setAuth(
      {
        id: registeredUser.id,
        email: registeredUser.email,
        name: registeredUser.name,
      },
      `local-access-token-${registeredUser.id}`,
      `local-refresh-token-${registeredUser.id}`
    )

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F8FBFD] font-sans text-[#2C3E50]">
      <Header />

      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-125">
          <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-10 text-center">
              <div className="tr mb-3 text-[24px] font-bold text-[#2C3E50]">
                환영합니다
              </div>
              <div className="text-[15px] leading-relaxed text-[#5A6A85]">
                BRIEFY 함께 스마트한 뉴스 경험을 시작하세요
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="이메일"
                icon={EMAIL_ICON}
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <Input
                label="비밀번호"
                icon={PASSWORD_ICON}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                error={loginError}
                required
              />
              <Button type="submit" className="mt-2 text-[16px]">
                로그인
              </Button>
            </form>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-[13px]">
                <span className="bg-white px-4 font-medium text-[#A0ABC0]">
                  또는
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <Button variant="secondary">Google로 계속하기</Button>
            </div>

            <div className="mt-3 text-center">
              <p className="text-[14px] text-[#5A6A85]">
                계정이 없으신가요?
                <span
                  onClick={() => navigate('/signup')}
                  className="ml-2 font-bold text-[#7899C5] hover:cursor-pointer hover:text-[#6688B3]"
                >
                  회원가입
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
