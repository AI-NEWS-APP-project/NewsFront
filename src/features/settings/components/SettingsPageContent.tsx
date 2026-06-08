import { useState } from 'react'
import {
  disableStoredFcmToken,
  enableFcmToken,
} from '@features/alarm/lib/fcmTokenLifecycle'
import { getNotificationPermission } from '@features/alarm/lib/fcmMessaging'
import { getStoredFcmToken } from '@features/alarm/model/fcmTokenStorage'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import KeywordChip from '@features/onboarding/components/KeywordChip'
import KeywordOptionButton from '@features/onboarding/components/KeywordOptionButton'
import OnboardingNotificationStep from '@features/onboarding/components/OnboardingNotificationStep'
import {
  getNotificationSettings,
  saveNotificationSettings,
} from '@features/onboarding/model/notificationSettings'
import OnboardingSectionBox from '@features/onboarding/components/OnboardingSectionBox'
import {
  usePopularKeywordsQuery,
  useUserKeywordsQuery,
} from '@features/keyword/model/useKeywordQueries'
import {
  useCreateKeywordMutation,
  useDeleteKeywordMutation,
} from '@features/keyword/model/useKeywordMutations'
import type { UserKeywordOption } from '@features/news/model/types'
import type {
  SummaryTime,
  SummaryTimes,
} from '@features/onboarding/model/useOnboardingState'
import { PlusIcon } from '@shared/assets/icons'
import Button from '@shared/components/Button'
import Footer from '@shared/components/Footer'
import Input from '@shared/components/Input'
import Header from '@widgets/header/ui/Header'
import SettingsPanelWidget, {
  type SettingsTab,
} from '@widgets/settings-panel/ui/SettingsPanelWidget'

interface SettingsPageContentProps {
  activeTab: SettingsTab
}

type UserKeywordItem = UserKeywordOption

function SettingsKeywordTab() {
  const user = useAuthStore(state => state.user)
  const [customKeyword, setCustomKeyword] = useState('')
  const [keywordError, setKeywordError] = useState('')
  const [actionError, setActionError] = useState('')
  const userKeywordsQuery = useUserKeywordsQuery({
    enabled: Boolean(user),
    userId: user?.id,
  })
  const popularKeywordsQuery = usePopularKeywordsQuery()
  const createKeywordMutation = useCreateKeywordMutation()
  const deleteKeywordMutation = useDeleteKeywordMutation()
  const selectedKeywords = userKeywordsQuery.data ?? []
  const popularKeywords = popularKeywordsQuery.data ?? []
  const isLoading =
    userKeywordsQuery.isLoading || popularKeywordsQuery.isLoading
  const isSubmitting = createKeywordMutation.isPending
  const queryError = userKeywordsQuery.error ?? popularKeywordsQuery.error
  const visibleActionError =
    actionError ||
    (!user
      ? '사용자 정보를 찾을 수 없습니다.'
      : queryError instanceof Error
        ? queryError.message
        : '')

  const handleRemoveKeyword = async (keyword: UserKeywordItem) => {
    if (!user) {
      setActionError('사용자 정보를 찾을 수 없습니다.')
      return
    }

    setActionError('')

    try {
      await deleteKeywordMutation.mutateAsync(keyword.id)
    } catch (error) {
      console.error('키워드 삭제 실패:', error)
      setActionError(
        error instanceof Error
          ? error.message
          : '키워드 삭제 중 문제가 발생했습니다.'
      )
    }
  }

  const handleAddKeyword = async (keyword: string) => {
    if (!user) {
      setActionError('사용자 정보를 찾을 수 없습니다.')
      return
    }

    const nextKeyword = keyword.trim()

    if (!nextKeyword) {
      return
    }

    if (
      selectedKeywords.some(
        selectedKeyword =>
          selectedKeyword.name.toLowerCase() === nextKeyword.toLowerCase()
      )
    ) {
      setCustomKeyword('')
      return
    }

    setKeywordError('')
    setActionError('')

    try {
      await createKeywordMutation.mutateAsync(nextKeyword)
      setCustomKeyword('')
    } catch (error) {
      console.error('키워드 추가 실패:', error)
      setKeywordError(
        error instanceof Error
          ? error.message
          : '키워드 추가 중 문제가 발생했습니다.'
      )
    }
  }

  return (
    <div className="mx-auto max-w-148 space-y-3">
      <OnboardingSectionBox
        title="키워드 직접 추가"
        description=" *조사 및 띄어쓰기는 사용할 수 없어요 - 단어 형태로 입력해주세요"
      >
        <div className="flex items-stretch gap-2.5">
          <Input
            type="text"
            value={customKeyword}
            onChange={event => setCustomKeyword(event.target.value)}
            onKeyDown={event => {
              if (event.key !== 'Enter') {
                return
              }

              if (event.nativeEvent.isComposing || event.keyCode === 229) {
                return
              }

              event.preventDefault()
              void handleAddKeyword(customKeyword)
            }}
            placeholder="예: 인공지능, 스타트업, 주식..."
            error={keywordError || undefined}
            wrapperClassName="flex-1"
            inputClassName="h-10 rounded-xl bg-white px-3.5 text-[13px] text-[#33475E] placeholder:text-[#9AA9BC]"
          />
          <Button
            type="button"
            onClick={() => void handleAddKeyword(customKeyword)}
            variant="primary"
            size="icon"
            fullWidth={false}
            className="size-10 shrink-0 rounded-xl"
            disabled={isSubmitting}
            aria-label="키워드 추가"
          >
            <PlusIcon className="size-4.5" />
          </Button>
        </div>
      </OnboardingSectionBox>

      {visibleActionError ? (
        <div className="text-sm text-[#C65B5B]">{visibleActionError}</div>
      ) : null}

      {isLoading ? (
        <OnboardingSectionBox title="현재 구독 중인 키워드">
          <div className="text-sm text-[#64748B]">
            키워드 정보를 불러오는 중입니다.
          </div>
        </OnboardingSectionBox>
      ) : selectedKeywords.length > 0 ? (
        <OnboardingSectionBox
          title={`현재 구독 중인 키워드 (${selectedKeywords.length})`}
        >
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map(keyword => (
              <KeywordChip
                key={keyword.id}
                keyword={keyword.name}
                removable
                onRemove={() => void handleRemoveKeyword(keyword)}
              />
            ))}
          </div>
        </OnboardingSectionBox>
      ) : (
        <OnboardingSectionBox title="현재 구독 중인 키워드 (0)">
          <div className="text-sm text-[#64748B]">
            아직 등록된 키워드가 없습니다.
          </div>
        </OnboardingSectionBox>
      )}

      <OnboardingSectionBox title="추천 키워드">
        <div className="flex flex-wrap gap-2">
          {popularKeywords
            .filter(
              keyword =>
                !selectedKeywords.some(
                  selectedKeyword =>
                    selectedKeyword.name.toLowerCase() === keyword.toLowerCase()
                )
            )
            .map(keyword => (
              <KeywordOptionButton
                key={keyword}
                keyword={keyword}
                onClick={() => void handleAddKeyword(keyword)}
              />
            ))}
          {!isLoading && popularKeywords.length === 0 ? (
            <div className="text-sm text-[#64748B]">
              표시할 인기 키워드가 없습니다.
            </div>
          ) : null}
        </div>
      </OnboardingSectionBox>
    </div>
  )
}

function SettingsAlarmTab() {
  const user = useAuthStore(state => state.user)
  const storedNotificationSettings = getNotificationSettings()
  const [notifications, setNotifications] = useState({
    realtime:
      Boolean(getStoredFcmToken()) && storedNotificationSettings.realtime,
    dailySummary: storedNotificationSettings.dailySummary,
  })
  const [summaryTimes, setSummaryTimes] = useState<SummaryTimes>(
    storedNotificationSettings.summaryTimes
  )
  const [isUpdatingPush, setIsUpdatingPush] = useState(false)
  const [pushMessage, setPushMessage] = useState('')

  const handleSummaryTimeToggle = (time: SummaryTime) => {
    setSummaryTimes(prev => {
      const nextSummaryTimes = prev.includes(time)
        ? prev.filter(item => item !== time)
        : [...prev, time]

      saveNotificationSettings({
        realtime: notifications.realtime,
        dailySummary: notifications.dailySummary,
        summaryTimes: nextSummaryTimes,
      })

      return nextSummaryTimes
    })
  }

  const handleRealtimeToggle = async () => {
    if (!user) {
      setPushMessage('사용자 정보를 찾을 수 없습니다.')
      return
    }

    if (isUpdatingPush) {
      return
    }

    const nextRealtime = !notifications.realtime
    setIsUpdatingPush(true)
    setPushMessage('')

    try {
      if (nextRealtime) {
        const token = await enableFcmToken()

        if (!token) {
          const permission = getNotificationPermission()
          setPushMessage(
            permission === 'denied'
              ? '브라우저에서 알림 권한이 차단되어 있습니다.'
              : '현재 브라우저에서는 웹 푸시 알림을 사용할 수 없습니다.'
          )
          return
        }
      } else {
        await disableStoredFcmToken()
      }

      const nextNotifications = {
        ...notifications,
        realtime: nextRealtime,
      }

      setNotifications(nextNotifications)
      saveNotificationSettings({
        realtime: nextNotifications.realtime,
        dailySummary: nextNotifications.dailySummary,
        summaryTimes,
      })
      setPushMessage(
        nextRealtime
          ? '실시간 푸시 알림이 켜졌습니다.'
          : '실시간 푸시 알림이 꺼졌습니다.'
      )
    } catch (error) {
      console.error('실시간 푸시 알림 설정 실패:', error)
      setPushMessage(
        error instanceof Error
          ? error.message
          : '실시간 푸시 알림 설정 중 문제가 발생했습니다.'
      )
    } finally {
      setIsUpdatingPush(false)
    }
  }

  const handleDailySummaryToggle = () => {
    setNotifications(prev => {
      const nextNotifications = {
        ...prev,
        dailySummary: !prev.dailySummary,
      }

      saveNotificationSettings({
        realtime: nextNotifications.realtime,
        dailySummary: nextNotifications.dailySummary,
        summaryTimes,
      })

      return nextNotifications
    })
  }

  return (
    <div className="mx-auto max-w-148 space-y-3">
      <OnboardingNotificationStep
        notifications={notifications}
        onRealtimeToggle={() => void handleRealtimeToggle()}
        onDailySummaryToggle={handleDailySummaryToggle}
        summaryTimes={summaryTimes}
        onSummaryTimeToggle={handleSummaryTimeToggle}
      />
      {pushMessage ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
            pushMessage.includes('켰습니다') ||
            pushMessage.includes('꺼졌습니다')
              ? 'border-[#DCE9F6] bg-white text-[#4A678C]'
              : 'border-[#F1D5D5] bg-white text-[#B45353]'
          }`}
        >
          {pushMessage}
        </div>
      ) : null}
      {isUpdatingPush ? (
        <div className="text-sm text-[#64748B]">
          실시간 푸시 알림 설정을 저장하는 중입니다.
        </div>
      ) : null}
    </div>
  )
}

function SettingsPageContent({ activeTab }: SettingsPageContentProps) {
  return (
    <div className="min-h-screen bg-[#F8FBFD]">
      <Header />

      <main className="flex min-h-[calc(100vh-14rem)] items-center px-4 py-5 sm:px-6 lg:px-8">
        <SettingsPanelWidget
          activeTab={activeTab}
          keywordContent={<SettingsKeywordTab />}
          alarmContent={<SettingsAlarmTab />}
        />
      </main>

      <Footer />
    </div>
  )
}

export default SettingsPageContent
