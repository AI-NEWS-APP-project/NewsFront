import { useState } from 'react'

const SUGGESTED_KEYWORDS = [
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
  const [step, setStep] = useState<OnboardingStep>(1)
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([])
  const [customKeyword, setCustomKeyword] = useState('')
  const [keywordError, setKeywordError] = useState('')
  const [notifications, setNotifications] = useState({
    realtime: true,
    dailySummary: true,
  })
  const [summaryTimes, setSummaryTimes] = useState<SummaryTimes>(['morning'])

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
    suggestedKeywords: SUGGESTED_KEYWORDS,
    handleKeywordToggle,
    handleAddCustomKeyword,
    goToNextStep,
    toggleSummaryTime,
  }
}
