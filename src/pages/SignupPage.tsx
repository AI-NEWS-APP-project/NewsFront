import type { HTMLInputTypeAttribute, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '@shared/components/header'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'
import {
  useSignupForm,
  type SignupFieldId,
} from '@features/auth/model/useSignupForm'
import { saveRegisteredUser } from '@features/auth/model/localAuth'
import { CheckIcon, LockIcon, MailIcon, UserIcon } from '@shared/assets/icons'

const NAME_ICON = <UserIcon className="size-4.5 text-[#5A6A85]" />
const EMAIL_ICON = <MailIcon className="size-4.5 text-[#5A6A85]" />
const PASSWORD_ICON = <LockIcon className="size-4.5 text-[#5A6A85]" />
const PASSWORD_MATCH_ICON = (
  <CheckIcon className="size-4 text-[#5A6A85] opacity-60" aria-label="비밀번호 일치" />
)

interface SignupFieldConfig {
  id: SignupFieldId
  label: string
  type: HTMLInputTypeAttribute
  placeholder: string
  icon: ReactNode
}

const SIGNUP_FIELDS: SignupFieldConfig[] = [
  {
    id: 'name',
    label: '이름',
    type: 'text',
    placeholder: '홍길동',
    icon: NAME_ICON,
  },
  {
    id: 'email',
    label: '이메일 주소',
    type: 'email',
    placeholder: 'example@email.com',
    icon: EMAIL_ICON,
  },
  {
    id: 'password',
    label: '비밀번호',
    type: 'password',
    placeholder: '8자 이상 입력',
    icon: PASSWORD_ICON,
  },
  {
    id: 'confirmPassword',
    label: '비밀번호 확인',
    type: 'password',
    placeholder: '한 번 더 입력',
    icon: PASSWORD_ICON,
  },
]

function SignupPage() {
  const navigate = useNavigate()
  const { formData, errors, isPasswordMatched, handleChange, handleSubmit } =
    useSignupForm({
      onSubmitSuccess: nextFormData => {
        saveRegisteredUser(nextFormData)
        navigate('/login')
      },
    })

  return (
    <div className="min-h-screen bg-[#F8FBFD] font-sans text-black">
      <Header />
      <main className="flex min-h-screen items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-125">
          <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-10 text-center">
              <div className="mb-3 text-[24px] font-bold text-black">
                회원가입
              </div>
              <div className="text-[15px] leading-relaxed text-[#3D5A80]">
                BRIEFY와 함께 시작하세요
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {SIGNUP_FIELDS.map(field => (
                <Input
                  key={field.id}
                  label={field.label}
                  icon={field.icon}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.id]}
                  onChange={e => handleChange(field.id, e.target.value)}
                  required
                  error={errors[field.id]}
                  {...(field.id === 'confirmPassword' && {
                    endAdornment: isPasswordMatched ? PASSWORD_MATCH_ICON : null,
                  })}
                />
              ))}
              <Button type="submit" className="mt-4 text-[16px]">
                회원가입
              </Button>
            </form>
            <div className="mt-3 text-[14px] text-[#5A6A85]">
              <span>이미 계정이 있으신가요?</span>
              <span
                onClick={() => navigate('/login')}
                className="ml-2 cursor-pointer font-bold text-[#7899C5] hover:cursor-pointer hover:text-[#6688B3]"
              >
                로그인
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignupPage
