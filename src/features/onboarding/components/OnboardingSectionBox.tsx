import type { ReactNode } from 'react'

interface OnboardingSectionBoxProps {
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}

export default function OnboardingSectionBox({
  title,
  description,
  action,
  children,
}: OnboardingSectionBoxProps) {
  return (
    <article className="rounded-2xl border border-[#DCE9F6] bg-[#F9FBFE] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="text-left">
          <div className="text-[15px] font-extrabold text-[#33475E] sm:text-[16px]">
            {title}
          </div>
          {description && (
            <div className="mt-1 text-[13px] text-[#7F97B7] sm:text-[14px]">
              {description}
            </div>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children && <div className="mt-5">{children}</div>}
    </article>
  )
}
