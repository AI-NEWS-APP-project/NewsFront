import { useNavigate } from 'react-router-dom'
import OnboardingKeywordStep from '@features/onboarding/components/OnboardingKeywordStep'
import OnboardingNotificationStep from '@features/onboarding/components/OnboardingNotificationStep'
import { useOnboardingState } from '@features/onboarding/model/useOnboardingState'
import Button from '@shared/components/Button'
import Footer from '@shared/components/Footer'
import Header from '@shared/components/header'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const onboarding = useOnboardingState()

  const handleComplete = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F8FBFD]">
      <Header />

      <main className="flex min-h-[calc(100vh-14rem)] items-center px-4 py-5 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-205 rounded-[20px] border border-[#DDEAF7] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(120,153,197,0.12)] sm:px-5 sm:py-5 lg:px-6 lg:py-6">
          <div className="mb-4 flex gap-2.5 sm:mb-5">
            {[1, 2].map(progressStep => (
              <div
                key={progressStep}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E3EDF7]"
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    progressStep <= onboarding.step
                      ? 'w-full bg-[#729BC5]'
                      : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="mb-5 text-center sm:mb-6">
            <div className="inline-flex h-7 items-center rounded-full bg-[#E8F1F9] px-3 text-[12px] font-bold text-[#6A95C1]">
              {onboarding.step}/2 단계
            </div>
            <div className="mt-3 text-[19px] font-extrabold tracking-tight text-[#33475E] sm:text-[24px]">
              {onboarding.step === 1 ? '관심 키워드 설정' : '알림 설정'}
            </div>
            <div className="mt-1.5 text-[12px] text-[#7F97B7] sm:text-[13px]">
              {onboarding.step === 1
                ? '관심있는 뉴스 키워드를 선택해주세요'
                : '알림 받을 방식을 선택해주세요'}
            </div>
          </div>

          {onboarding.step === 1 ? (
            <OnboardingKeywordStep
              customKeyword={onboarding.customKeyword}
              onCustomKeywordChange={onboarding.setCustomKeyword}
              onCustomKeywordSubmit={onboarding.handleAddCustomKeyword}
              keywordError={onboarding.keywordError}
              selectedKeywords={onboarding.selectedKeywords}
              suggestedKeywords={onboarding.suggestedKeywords}
              onKeywordToggle={onboarding.handleKeywordToggle}
            />
          ) : (
            <OnboardingNotificationStep
              notifications={onboarding.notifications}
              onRealtimeToggle={() =>
                onboarding.setNotifications(prev => ({
                  ...prev,
                  realtime: !prev.realtime,
                }))
              }
              onDailySummaryToggle={() =>
                onboarding.setNotifications(prev => ({
                  ...prev,
                  dailySummary: !prev.dailySummary,
                }))
              }
              summaryTimes={onboarding.summaryTimes}
              onSummaryTimeToggle={onboarding.toggleSummaryTime}
            />
          )}

          <div
            className={`mx-auto mt-5 grid max-w-147 gap-2.5 ${
              onboarding.step === 1
                ? 'grid-cols-1'
                : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {onboarding.step === 2 ? (
              <Button
                type="button"
                onClick={() => onboarding.setStep(1)}
                variant="secondary"
                size="lg"
                className="h-10 rounded-xl text-[14px]"
              >
                이전
              </Button>
            ) : null}
            <Button
              type="button"
              onClick={
                onboarding.step === 1 ? onboarding.goToNextStep : handleComplete
              }
              variant="primary"
              size="lg"
              className="h-10 rounded-xl text-[14px]"
            >
              {onboarding.step === 1 ? '다음' : '완료'}
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
