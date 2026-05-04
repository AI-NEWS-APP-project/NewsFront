import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createKeyword,
  deleteKeywordById,
  getKeywords,
  getPopularKeywords,
} from '@features/keyword/api/keywords'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import KeywordChip from '@features/onboarding/components/KeywordChip'
import KeywordOptionButton from '@features/onboarding/components/KeywordOptionButton'
import OnboardingNotificationStep from '@features/onboarding/components/OnboardingNotificationStep'
import {
  getNotificationSettings,
  saveNotificationSettings,
} from '@features/onboarding/model/notificationSettings'
import OnboardingSectionBox from '@features/onboarding/components/OnboardingSectionBox'
import type {
  SummaryTime,
  SummaryTimes,
} from '@features/onboarding/model/useOnboardingState'
import { PlusIcon } from '@shared/assets/icons'
import Button from '@shared/components/Button'
import Footer from '@shared/components/Footer'
import Input from '@shared/components/Input'
import Header from '@shared/components/header'

type SettingsTab = 'keyword' | 'alarm'

interface SettingsPageContentProps {
  activeTab: SettingsTab
}

type KeywordResponseItem =
  | string
  | {
      id?: number
      keywordId?: number
      name?: string
      keyword?: string
      keywordName?: string
    }

interface UserKeywordItem {
  id: number
  name: string
}

function normalizeUserKeywords(items?: KeywordResponseItem[]) {
  if (!Array.isArray(items)) {
    return []
  }

  return items
    .map(item => {
      if (typeof item === 'string') {
        return null
      }

      const id = item.id ?? item.keywordId
      const name = item.name || item.keywordName || item.keyword

      if (typeof id !== 'number' || !name) {
        return null
      }

      return {
        id,
        name,
      }
    })
    .filter((keyword): keyword is UserKeywordItem => keyword !== null)
}

function SettingsKeywordTab() {
  const user = useAuthStore(state => state.user)
  const [selectedKeywords, setSelectedKeywords] = useState<UserKeywordItem[]>(
    []
  )
  const [popularKeywords, setPopularKeywords] = useState<string[]>([])
  const [customKeyword, setCustomKeyword] = useState('')
  const [keywordError, setKeywordError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    const fetchKeywordData = async () => {
      if (!user) {
        setIsLoading(false)
        setActionError('사용자 정보를 찾을 수 없습니다.')
        return
      }
      setIsLoading(true)
      setActionError('')

      try {
        const [keywordsResult, popularResult] = await Promise.all([
          getKeywords<KeywordResponseItem[]>({ userId: user.id }),
          getPopularKeywords<string[]>(),
        ])

        if (keywordsResult.success === false) {
          throw new Error(
            keywordsResult.message || '현재 키워드를 불러오지 못했습니다.'
          )
        }

        if (popularResult.success === false) {
          throw new Error(
            popularResult.message || '인기 키워드를 불러오지 못했습니다.'
          )
        }

        setSelectedKeywords(normalizeUserKeywords(keywordsResult.data))
        setPopularKeywords(popularResult.data ?? [])
      } catch (error) {
        console.error('설정 키워드 조회 실패:', error)
        setActionError(
          error instanceof Error
            ? error.message
            : '키워드 정보를 불러오지 못했습니다.'
        )
      } finally {
        setIsLoading(false)
      }
    }
    void fetchKeywordData()
  }, [user])

  const handleRemoveKeyword = async (keyword: UserKeywordItem) => {
    if (!user) {
      setActionError('사용자 정보를 찾을 수 없습니다.')
      return
    }

    setActionError('')

    try {
      const result = await deleteKeywordById({
        userId: user.id,
        keywordId: keyword.id,
      })

      if (result.success === false) {
        throw new Error(result.message || '키워드 삭제 중 문제가 발생했습니다.')
      }

      setSelectedKeywords(prev => prev.filter(item => item.id !== keyword.id))
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

    setIsSubmitting(true)
    setKeywordError('')
    setActionError('')

    try {
      const result = await createKeyword({
        userId: user.id,
        keyword: nextKeyword,
      })
      if (result.success === false) {
        throw new Error(result.message || '키워드 추가 중 문제가 발생했습니다.')
      }

      const refreshedKeywords = await getKeywords<KeywordResponseItem[]>({
        userId: user.id,
      })

      if (refreshedKeywords.success === false) {
        throw new Error(
          refreshedKeywords.message || '추가된 키워드를 불러오지 못했습니다.'
        )
      }
      setSelectedKeywords(normalizeUserKeywords(refreshedKeywords.data))
      setCustomKeyword('')
    } catch (error) {
      console.error('키워드 추가 실패:', error)
      setKeywordError(
        error instanceof Error
          ? error.message
          : '키워드 추가 중 문제가 발생했습니다.'
      )
    } finally {
      setIsSubmitting(false)
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
              if (event.key === 'Enter') {
                event.preventDefault()
                void handleAddKeyword(customKeyword)
              }
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

      {actionError ? (
        <div className="text-sm text-[#C65B5B]">{actionError}</div>
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
  const storedNotificationSettings = getNotificationSettings()
  const [notifications, setNotifications] = useState({
    realtime: storedNotificationSettings.realtime,
    dailySummary: storedNotificationSettings.dailySummary,
  })
  const [summaryTimes, setSummaryTimes] = useState<SummaryTimes>(
    storedNotificationSettings.summaryTimes
  )

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

  const handleRealtimeToggle = () => {
    setNotifications(prev => {
      const nextNotifications = {
        ...prev,
        realtime: !prev.realtime,
      }

      saveNotificationSettings({
        realtime: nextNotifications.realtime,
        dailySummary: nextNotifications.dailySummary,
        summaryTimes,
      })

      return nextNotifications
    })
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
    <OnboardingNotificationStep
      notifications={notifications}
      onRealtimeToggle={handleRealtimeToggle}
      onDailySummaryToggle={handleDailySummaryToggle}
      summaryTimes={summaryTimes}
      onSummaryTimeToggle={handleSummaryTimeToggle}
    />
  )
}

function SettingsPageContent({ activeTab }: SettingsPageContentProps) {
  return (
    <div className="min-h-screen bg-[#F8FBFD]">
      <Header />

      <main className="flex min-h-[calc(100vh-14rem)] items-center px-4 py-5 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-205 rounded-[20px] border border-[#DDEAF7] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(120,153,197,0.12)] sm:px-5 sm:py-5 lg:px-6 lg:py-6">
          <div className="mb-5 text-center sm:mb-6">
            <div className="inline-flex h-7 items-center rounded-full bg-[#E8F1F9] px-3 text-[12px] font-bold text-[#6A95C1]">
              설정
            </div>
            <div className="mt-3 text-[19px] font-extrabold tracking-tight text-[#33475E] sm:text-[24px]">
              {activeTab === 'keyword' ? '관심 키워드 설정' : '알림 설정'}
            </div>
            <div className="mt-1.5 text-[12px] text-[#7F97B7] sm:text-[13px]">
              {activeTab === 'keyword'
                ? '구독할 키워드를 추가하거나 정리해보세요'
                : '알림 받을 방식을 선택해주세요'}
            </div>
          </div>

          <div className="mx-auto mb-5 grid max-w-147 gap-2.5 md:grid-cols-2">
            <Link
              to="/setting/keyword"
              className={`flex h-10 items-center justify-center rounded-xl border text-[14px] font-bold transition-all ${
                activeTab === 'keyword'
                  ? 'border-[#729BC5] bg-[#729BC5] text-white shadow-[0_10px_22px_rgba(114,155,197,0.24)]'
                  : 'border-[#DCE9F6] bg-white text-[#729BC5] hover:bg-[#F8FBFD]'
              }`}
            >
              키워드 관리
            </Link>
            <Link
              to="/setting/alarm"
              className={`flex h-10 items-center justify-center rounded-xl border text-[14px] font-bold transition-all ${
                activeTab === 'alarm'
                  ? 'border-[#729BC5] bg-[#729BC5] text-white shadow-[0_10px_22px_rgba(114,155,197,0.24)]'
                  : 'border-[#DCE9F6] bg-white text-[#729BC5] hover:bg-[#F8FBFD]'
              }`}
            >
              알림 설정
            </Link>
          </div>

          {activeTab === 'keyword' ? (
            <SettingsKeywordTab />
          ) : (
            <SettingsAlarmTab />
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default SettingsPageContent
