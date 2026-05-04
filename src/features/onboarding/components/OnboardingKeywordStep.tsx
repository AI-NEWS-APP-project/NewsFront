import KeywordChip from '@features/onboarding/components/KeywordChip'
import KeywordOptionButton from '@features/onboarding/components/KeywordOptionButton'
import OnboardingSectionBox from '@features/onboarding/components/OnboardingSectionBox'
import { PlusIcon } from '@shared/assets/icons'
import Button from '@shared/components/Button'
import Input from '@shared/components/Input'

interface OnboardingKeywordStepProps {
  customKeyword: string
  onCustomKeywordChange: (value: string) => void
  onCustomKeywordSubmit: () => void
  keywordError: string
  selectedKeywords: string[]
  suggestedKeywords: readonly string[]
  onKeywordToggle: (keyword: string) => void
}

export default function OnboardingKeywordStep({
  customKeyword,
  onCustomKeywordChange,
  onCustomKeywordSubmit,
  keywordError,
  selectedKeywords,
  suggestedKeywords,
  onKeywordToggle,
}: OnboardingKeywordStepProps) {
  return (
    <div className="mx-auto max-w-148 space-y-3">
      <OnboardingSectionBox title="키워드 직접 추가">
        <div className="flex items-stretch gap-2.5">
          <Input
            type="text"
            value={customKeyword}
            onChange={e => onCustomKeywordChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onCustomKeywordSubmit()
              }
            }}
            placeholder="예: 인공지능, 스타트업, 주식..."
            error={keywordError || undefined}
            wrapperClassName="flex-1"
            inputClassName="h-10 rounded-xl bg-white px-3.5 text-[13px] text-[#33475E] placeholder:text-[#9AA9BC]"
          />
          <Button
            type="button"
            onClick={onCustomKeywordSubmit}
            variant="primary"
            size="icon"
            fullWidth={false}
            className="size-10 shrink-0 rounded-xl"
            aria-label="키워드 추가"
          >
            <PlusIcon className="size-4.5" />
          </Button>
        </div>
      </OnboardingSectionBox>

      {selectedKeywords.length > 0 ? (
        <OnboardingSectionBox
          title={`선택된 키워드 (${selectedKeywords.length})`}
        >
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map(keyword => (
              <KeywordChip
                key={keyword}
                keyword={keyword}
                removable
                onRemove={() => onKeywordToggle(keyword)}
              />
            ))}
          </div>
        </OnboardingSectionBox>
      ) : null}

      <OnboardingSectionBox title="추천 키워드">
        <div className="flex flex-wrap gap-2">
          {suggestedKeywords
            .filter(keyword => !selectedKeywords.includes(keyword))
            .map(keyword => (
              <KeywordOptionButton
                key={keyword}
                keyword={keyword}
                onClick={() => onKeywordToggle(keyword)}
              />
            ))}
        </div>
      </OnboardingSectionBox>
    </div>
  )
}
