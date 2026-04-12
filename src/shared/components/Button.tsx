import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, type To } from 'react-router-dom'
import { cn } from '@shared/lib/utils'

const variants = {
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-white border text-gray-700',
} as const

type Variant = keyof typeof variants

type ButtonProps = {
  children: ReactNode
  to?: To
  variant?: Variant
  className?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({
  children,
  to,
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  const style = cn(
    'flex h-12 w-full items-center justify-center rounded-xl font-bold',
    variants[variant],
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
