import { useEffect, useState } from 'react'
import { getPopularKeywords } from '@features/keyword/api/keywords'
import {
  getNotificationSettings,
  saveNotificationSettings,
} from '@features/onboarding/model/notificationSettings'

const FALLBACK_SUGGESTED_KEYWORDS = [
  'AI',
  '경제',
  'IT',
  '스타트업',
  '부동산',
  '주식',
  '건강',
  '환경',
  '교육',
  '문화',
  '과학',
  '정치',
] as const

export type OnboardingStep = 1 | 2
export type SummaryTime = 'morning' | 'evening'
export type SummaryTimes = SummaryTime[]

export function useOnboardingState() {
  const storedNotificationSettings = getNotificationSettings()
  const [step, setStep] = useState<OnboardingStep>(1)
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([
    ...FALLBACK_SUGGESTED_KEYWORDS,
  ])
  const [customKeyword, setCustomKeyword] = useState('')
  const [keywordError, setKeywordError] = useState('')
  const [notifications, setNotifications] = useState({
    realtime: storedNotificationSettings.realtime,
    dailySummary: storedNotificationSettings.dailySummary,
  })
  const [summaryTimes, setSummaryTimes] = useState<SummaryTimes>(
    storedNotificationSettings.summaryTimes
  )

  useEffect(() => {
    const fetchPopularKeywords = async () => {
      try {
        const result = await getPopularKeywords<string[]>()

        if (result.success === false) {
          throw new Error(
            result.message || '추천 키워드를 불러오지 못했습니다.'
          )
        }

        if (Array.isArray(result.data) && result.data.length > 0) {
          setSuggestedKeywords(result.data)
        }
      } catch (error) {
        console.error('추천 키워드 조회 실패:', error)
      }
    }

    void fetchPopularKeywords()
  }, [])

  useEffect(() => {
    saveNotificationSettings({
      realtime: notifications.realtime,
      dailySummary: notifications.dailySummary,
      summaryTimes,
    })
  }, [notifications, summaryTimes])

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(item => item !== keyword)
        : [...prev, keyword]
    )
    setKeywordError('')
  }

  const handleAddCustomKeyword = () => {
    const nextKeyword = customKeyword.trim()

    if (!nextKeyword) {
      return
    }

    if (selectedKeywords.includes(nextKeyword)) {
      setCustomKeyword('')
      return
    }

    setSelectedKeywords(prev => [...prev, nextKeyword])
    setCustomKeyword('')
    setKeywordError('')
  }

  const goToNextStep = () => {
    if (selectedKeywords.length === 0) {
      setKeywordError('최소 1개 이상의 키워드를 선택해 주세요.')
      return false
    }

    setStep(2)
    return true
  }

  const toggleSummaryTime = (time: SummaryTime) => {
    setSummaryTimes(prev =>
      prev.includes(time) ? prev.filter(item => item !== time) : [...prev, time]
    )
  }

  return {
    step,
    setStep,
    selectedKeywords,
    customKeyword,
    setCustomKeyword,
    keywordError,
    notifications,
    setNotifications,
    summaryTimes,
    setSummaryTimes,
    suggestedKeywords,
    handleKeywordToggle,
    handleAddCustomKeyword,
    goToNextStep,
    toggleSummaryTime,
  }
}
