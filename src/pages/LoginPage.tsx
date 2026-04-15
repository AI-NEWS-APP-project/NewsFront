import { useCallback, useEffect, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  loginWithSocial,
  type SocialProvider,
} from '@features/auth/api/socialAuth'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import { verifyRegisteredUser } from '@features/auth/model/localAuth'
import { GoogleIcon, KakaoIcon, LockIcon, MailIcon } from '@shared/assets/icons'
import Button from '@shared/components/Button'
import Footer from '@shared/components/Footer'
import Header from '@shared/components/header'
import Input from '@shared/components/Input'

const EMAIL_ICON = <MailIcon className="size-4.5 text-[#5A6A85]" />
const PASSWORD_ICON = <LockIcon className="size-4.5 text-[#5A6A85]" />
const KAKAO_ICON = <KakaoIcon className="size-4.5 text-black" />
const GOOGLE_ICON = <GoogleIcon className="size-4.5" />

function LoginPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const setAuth = useAuthStore(state => state.setAuth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [socialLoginProvider, setSocialLoginProvider] =
    useState<SocialProvider | null>(null)

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

  useEffect(() => {
    const socialLoginError = location.state?.socialLoginError

    if (typeof socialLoginError === 'string' && socialLoginError) {
      setLoginError(socialLoginError)
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location.pathname, location.state, navigate])

  const processSocialLogin = useCallback(
    async (provider: SocialProvider, socialToken: string) => {
      setLoginError('')
      setSocialLoginProvider(provider)

      try {
        const result = await loginWithSocial(provider, socialToken)

        if (!result.success) {
          throw new Error(
            result.message || `${provider} 로그인에 실패했습니다.`
          )
        }

        const { accessToken, refreshToken, user } = result.data
        setAuth(
          {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            globalPushEnabled: user.globalPushEnabled,
            createdAt: user.createdAt,
          },
          accessToken,
          refreshToken
        )
        navigate('/dashboard')
      } catch (error) {
        console.error(`${provider} 로그인 실패:`, error)
        setLoginError('소셜 로그인 처리 중 오류가 발생했습니다.')
      } finally {
        setSocialLoginProvider(null)
      }
    },
    [navigate, setAuth]
  )

  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      void processSocialLogin('google', tokenResponse.access_token)
    },
    onError: () => {
      setSocialLoginProvider(null)
      setLoginError('구글 로그인에 실패했습니다.')
    },
  })

  const handleGoogleLogin = useCallback(() => {
    setLoginError('')
    setSocialLoginProvider('google')
    triggerGoogleLogin()
  }, [triggerGoogleLogin])

  const handleKakaoLogin = () => {
    if (!window.Kakao) return

    setSocialLoginProvider('kakao')

    if (typeof window.Kakao.Auth.login !== 'function') {
      setSocialLoginProvider(null)
      setLoginError(
        '현재 로드된 카카오 SDK에서는 이 로그인 방식을 지원하지 않습니다.'
      )
      return
    }

    window.Kakao.Auth.login({
      success: (authObj: KakaoAuthObject) => {
        processSocialLogin('kakao', authObj.access_token)
      },
      fail: (err: Error | string) => {
        console.error('카카오 로그인 실패:', err)
        setSocialLoginProvider(null)
        setLoginError('카카오 로그인에 실패했습니다.')
      },
    })
  }

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

      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-113.75">
          <div className="rounded-[28px] border border-[#D9E5F3] bg-white px-8 py-9 shadow-[0_14px_34px_rgba(73,98,128,0.16)] sm:px-9">
            <div className="mb-8 text-center">
              <div className="tr mb-2 text-[24px] font-bold text-[#2C3E50]">
                환영합니다
              </div>
              <div className="text-[15px] leading-relaxed text-[#7A92B5]">
                BRIEFY 함께 스마트한 뉴스 경험을 시작하세요
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4.5">
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
              <Button
                type="submit"
                className="mt-4 h-12 rounded-xl text-[16px] shadow-[0_6px_16px_rgba(120,153,197,0.28)]"
              >
                로그인
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5EDF6]" />
              </div>
              <div className="relative flex justify-center text-[13px]">
                <span className="bg-white px-4 font-medium text-[#A0ABC0]">
                  또는
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                onClick={handleKakaoLogin}
                disabled={socialLoginProvider !== null}
                className="h-12 rounded-xl bg-[#FEE500] text-[16px] font-extrabold text-black shadow-none hover:bg-[#F7D900] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {KAKAO_ICON}
                {socialLoginProvider === 'kakao'
                  ? '로그인 중...'
                  : '카카오로 계속하기'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleGoogleLogin}
                disabled={socialLoginProvider !== null}
                className="h-12 rounded-xl border-[#D9E5F3] text-[16px] font-semibold text-[#4A678C] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {GOOGLE_ICON}
                {socialLoginProvider === 'google'
                  ? '로그인 중...'
                  : 'Google로 계속하기'}
              </Button>
            </div>

            <div className="mt-8 text-center">
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
      <Footer />
    </div>
  )
}

export default LoginPage
