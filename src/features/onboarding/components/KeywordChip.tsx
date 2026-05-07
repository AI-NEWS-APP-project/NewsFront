import { CheckIcon, CloseIcon } from '@shared/assets/icons'

interface KeywordChipProps {
  keyword: string
  removable?: boolean
  onRemove?: () => void
}

export default function KeywordChip({
  keyword,
  removable = false,
  onRemove,
}: KeywordChipProps) {
  return (
    <div className="inline-flex h-7 items-center gap-1 rounded-full bg-[#729BC5] px-2.5 text-[12px] font-semibold text-white">
      <CheckIcon className="size-3" />
      <span>{keyword}</span>
      {removable ? (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-0.5 text-white/90 transition-colors hover:bg-white/15"
          aria-label={`${keyword} 제거`}
        >
          <CloseIcon className="size-2.5" />
        </button>
      ) : null}
    </div>
  )
}
