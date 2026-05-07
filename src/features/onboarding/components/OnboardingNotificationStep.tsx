import OnboardingSectionBox from '@features/onboarding/components/OnboardingSectionBox'
import ToggleSwitch from '@features/onboarding/components/ToggleSwitch'
import type {
  SummaryTime,
  SummaryTimes,
} from '@features/onboarding/model/useOnboardingState'
import Button from '@shared/components/Button'

interface OnboardingNotificationStepProps {
  notifications: {
    realtime: boolean
    dailySummary: boolean
  }
  onRealtimeToggle: () => void
  onDailySummaryToggle: () => void
  summaryTimes: SummaryTimes
  onSummaryTimeToggle: (time: SummaryTime) => void
}

export default function OnboardingNotificationStep({
  notifications,
  onRealtimeToggle,
  onDailySummaryToggle,
  summaryTimes,
  onSummaryTimeToggle,
}: OnboardingNotificationStepProps) {
  return (
    <div className="mx-auto max-w-148 space-y-3">
      <OnboardingSectionBox
        title="톡알림"
        description="중요한 뉴스를 즉시 알려드립니다"
        action={
          <ToggleSwitch
            checked={notifications.realtime}
            onToggle={onRealtimeToggle}
            ariaLabel="톡알림 설정"
          />
        }
      >
        <div />
      </OnboardingSectionBox>

      <OnboardingSectionBox
        title="하루 뉴스 요약"
        description="매일 정해진 시간에 요약 제공"
        action={
          <ToggleSwitch
            checked={notifications.dailySummary}
            onToggle={onDailySummaryToggle}
            ariaLabel="하루 뉴스 요약 설정"
          />
        }
      >
        {notifications.dailySummary ? (
          <div className="border-t border-[#DCE9F6] pt-3">
            <div className="mb-2.5 text-[18px] font-extrabold text-[#33475E]">
              알림 시간
            </div>
            <div className="grid gap-2.5 md:grid-cols-2">
              <Button
                type="button"
                onClick={() => onSummaryTimeToggle('morning')}
                variant={
                  summaryTimes.includes('morning') ? 'selected' : 'outline'
                }
                size="option"
                className="h-10 rounded-xl text-[13px]"
              >
                08:00
              </Button>
              <Button
                type="button"
                onClick={() => onSummaryTimeToggle('evening')}
                variant={
                  summaryTimes.includes('evening') ? 'selected' : 'outline'
                }
                size="option"
                className="h-10 rounded-xl text-[13px]"
              >
                20:00
              </Button>
            </div>
          </div>
        ) : null}
      </OnboardingSectionBox>
    </div>
  )
}
