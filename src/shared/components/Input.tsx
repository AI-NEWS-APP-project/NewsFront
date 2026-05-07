import { memo, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@shared/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  icon?: ReactNode
  error?: ReactNode
  endAdornment?: ReactNode
  headerAction?: ReactNode
  wrapperClassName?: string
  inputClassName?: string
}

const Input = memo(function Input({
  label,
  icon,
  error,
  endAdornment,
  headerAction,
  wrapperClassName,
  className,
  inputClassName,
  ...props
}: InputProps) {
  const hasError = !!error

  const inputVariants = cn(
    'h-13 w-full rounded-xl border bg-gray-50/30 text-[15px] transition-all outline-none placeholder:text-gray-400',
    icon ? 'pl-12' : 'px-4',
    endAdornment ? 'pr-12' : 'pr-4',
    hasError
      ? 'border-red-200 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-400/10'
      : 'border-gray-200 focus:border-[#7899C5] focus:ring-4 focus:ring-[#7899C5]/10',
    inputClassName,
    className
  )

  return (
    <div className={cn('space-y-2', wrapperClassName)}>
      {(label || headerAction) && (
        <div className="ml-1 flex items-center justify-between">
          {label && (
            <span className="text-[13px] font-bold text-[#5A6A85]">
              {label}
            </span>
          )}
          {headerAction}
        </div>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-60">
            {icon}
          </div>
        )}

        <input className={inputVariants} {...props} />
        {endAdornment && (
          <div className="absolute top-1/2 right-4 -translate-y-1/2">
            {endAdornment}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 ml-1 text-[12px] font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  )
})

export default Input
