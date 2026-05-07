import type { ComponentType, SVGProps } from 'react'

interface FeatureBoxProps {
  title: string
  description: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  iconClassName: string
}

function FeatureBox({
  title,
  description,
  icon: Icon,
  iconClassName,
}: FeatureBoxProps) {
  return (
    <div className="flex flex-col items-start rounded-xl border border-[#E8F1F8] bg-[#F8FBFD] p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`mb-4 flex size-11 items-center justify-center rounded-lg ${iconClassName}`}
      >
        <Icon className="size-5 text-white" />
      </div>
      <p className="mb-2 text-lg font-bold text-[#2C3E50]">{title}</p>
      <p className="text-sm text-[#3D5A80]/70">{description}</p>
    </div>
  )
}

export default FeatureBox
