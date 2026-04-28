import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type To } from 'react-router-dom'
import { cn } from '@shared/lib/utils'

const variants = {
  primary:
    'bg-[#729BC5] text-white shadow-[0_10px_22px_rgba(114,155,197,0.24)] hover:bg-[#5F87B0]',
  secondary:
    'border border-[#DCE9F6] bg-white text-[#729BC5] hover:bg-[#F8FBFD]',
  outline:
    'border border-[#DCE9F6] bg-white text-[#3F5E88] hover:border-[#729BC5] hover:bg-[#F6FAFE]',
  selected:
    'border border-[#729BC5] bg-[#729BC5] text-white hover:bg-[#5F87B0]',
} as const

type Variant = keyof typeof variants

const sizes = {
  md: 'h-12 rounded-xl px-4 text-sm',
  lg: 'h-12 rounded-[14px] px-5 text-[15px]',
  icon: 'size-12 rounded-[14px] px-0',
  chip: 'h-9 rounded-full px-4 text-[14px]',
  option: 'h-11 rounded-[14px] px-5 text-[14px]',
} as const

type Size = keyof typeof sizes

type ButtonProps = {
  children: ReactNode
  to?: To
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({
  children,
  to,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  className,
  ...props
}: ButtonProps) {
  const style = cn(
    'flex items-center justify-center font-bold transition-all disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    fullWidth ? 'w-full' : 'w-auto',
    className
  )

  if (to) {
    return (
      <Link to={to} className={style}>
        {children}
      </Link>
    )
  }

  return (
    <button className={style} {...props}>
      {children}
    </button>
  )
}
