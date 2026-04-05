import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@shared/lib/utils'

// 1. 스타일 변수를 컴포넌트 외부 상단에 배치
const AUTH_VARIANTS = {
  primary:
    'bg-[#7899C5] text-white shadow-md shadow-[#7899C5]/20 hover:bg-[#6688B3] active:scale-[0.98]',
  secondary: 'border border-gray-200 bg-white text-[#5A6A85] hover:bg-gray-50',
} as const

// 2. 키값을 추출하여 타입 정의
type AuthVariantType = keyof typeof AUTH_VARIANTS

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: AuthVariantType // 위에서 정의한 타입 사용
}

export default function Button({
  children,
  className,
  type = 'button',
  variant = 'primary', // 기본값 설정
  ...props
}: AuthButtonProps) {
  // 3. 선택된 variant에 해당하는 스타일 가져오기
  const variantStyle = AUTH_VARIANTS[variant]

  return (
    <button
      type={type}
      className={cn(
        'flex h-13 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-bold transition-all',
        variantStyle,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
