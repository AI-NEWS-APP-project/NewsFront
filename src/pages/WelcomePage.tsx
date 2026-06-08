// import { getLatestKeywordNewsSummaries } from '@features/news/api/keywordNews'
import { useEffect, useState } from 'react'
import { SparklesIcon, TrendingUpIcon, ZapIcon } from '@shared/assets/icons'
import Button from '@shared/components/Button'
import FeatureBox from '@shared/components/FeatureBox'
import Footer from '@shared/components/Footer'
import Header from '@shared/components/header'

const HERO_STATS = {
  recommendedKeyword: '주식',
  newsCount: 320,
} as const

const FEATURES = [
  {
    title: 'AI 요약',
    description: '긴 기사를 핵심만 압축',
    icon: SparklesIcon,
    iconClassName: 'bg-[#6B9AC4]',
  },
  {
    title: '실시간 알림',
    description: '중요한 뉴스를 즉시 전달',
    icon: ZapIcon,
    iconClassName: 'bg-[#8FADC7]',
  },
  {
    title: '맞춤 큐레이션',
    description: '관심 키워드로 필터링',
    icon: TrendingUpIcon,
    iconClassName: 'bg-[#3D5A80]',
  },
] as const
// type NewsSummary = {
//   title: string
// }

function useCountUp(targetValue: number, duration = 1200) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (targetValue <= 0) {
      return
    }

    const startTime = performance.now()
    let animationFrameId = 0

    const updateValue = (currentTime: number) => {
      const elapsedTime = currentTime - startTime
      const progress = Math.min(elapsedTime / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 5)

      setValue(Math.round(targetValue * easedProgress))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateValue)
      }
    }

    animationFrameId = requestAnimationFrame(updateValue)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [duration, targetValue])

  return targetValue <= 0 ? 0 : value
}

const WelcomePage = () => {
  const animatedNewsCount = useCountUp(HERO_STATS.newsCount)

  // const [latestKeywordNews, setLatestKeywordNews] = useState<NewsSummary[]>([])
  // const [currentIndex, setCurrentIndex] = useState(0)

  // const [isLoadingAiSummaryNews, setIsLoadingAiSummaryNews] = useState(true)
  // const [aiSummaryNewsError, setAiSummaryNewsError] = useState('')

  // useEffect(() => {
  //   if (!latestKeywordNews.length) return

  //   const interval = setInterval(() => {
  //     setCurrentIndex(prev => (prev + 1) % latestKeywordNews.length)
  //   }, 3000) // 3초마다 변경

  //   return () => clearInterval(interval)
  // }, [latestKeywordNews])

  // useEffect(() => {
  //   const fetchLatestKeywordNews = async () => {
  //     try {
  //       const result = await getLatestKeywordNewsSummaries()

  //       if (result.success === false) {
  //         throw new Error(
  //           result.message || '오늘의 AI 요약 뉴스를 불러오지 못했습니다.'
  //         )
  //       }

  //       setLatestKeywordNews(result.data ?? [])
  //     } catch (error) {
  //       console.error('AI 요약 뉴스 조회 실패:', error)
  //       setAiSummaryNewsError(
  //         error instanceof Error
  //           ? error.message
  //           : '오늘의 AI 요약 뉴스를 불러오지 못했습니다.'
  //       )
  //     } finally {
  //       setIsLoadingAiSummaryNews(false)
  //     }
  //   }

  //   void fetchLatestKeywordNews()
  // }, [])
  return (
    <div className="min-h-screen bg-[#F8FBFD] text-[#2C3E50]">
      <Header />

      <main className="h-[calc(100svh-4.375rem)] snap-y snap-mandatory overflow-y-auto">
        <section className="relative flex min-h-[calc(100svh-4.375rem)] snap-start items-center px-6 py-12">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-12 lg:flex-row lg:items-center">
            <div className="max-w-xl flex-1">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E8F1F8] bg-white px-3 py-1.5 shadow-sm">
                <SparklesIcon className="size-3.5 text-[#6B9AC4]" />
                <span className="text-xs font-semibold text-[#6B9AC4]">
                  AI 뉴스 큐레이션
                </span>
              </div>
              <div className="mb-4 text-4xl leading-tight font-bold text-[#2C3E50] sm:text-5xl">
                스마트한 뉴스,
                <br />
                한눈에 요약
              </div>
              <p className="mb-6 text-base leading-relaxed text-[#3D5A80]/80 sm:text-lg">
                AI가 선별한 핵심 뉴스만 빠르게 확인하세요.
              </p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  to="/signup"
                  className="h-11 bg-[#6B9AC4] px-6 text-sm font-semibold shadow-sm hover:bg-[#3D5A80] sm:w-auto"
                >
                  무료로 시작하기
                </Button>
                <Button
                  to="/login"
                  variant="secondary"
                  className="h-11 border-[#E8F1F8] px-6 text-sm font-semibold text-[#6B9AC4] hover:bg-[#E8F1F8] sm:w-auto"
                >
                  로그인
                </Button>
              </div>
            </div>

            <div className="w-full max-w-100 flex-1">
              <div className="relative h-75 overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#6B9AC4_0%,#3D5A80_100%)] p-6 shadow-[0_24px_60px_rgba(61,90,128,0.24)]">
                <div className="relative flex h-full flex-col justify-between">
                  <div className="w-fit rounded-full bg-white/16 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-white/90 uppercase backdrop-blur-sm">
                    Daily Briefing
                  </div>
                  <div className="rounded-2xl bg-white/14 p-4 text-white backdrop-blur-sm">
                    <div className="mb-2 text-xs font-semibold text-white/70">
                      오늘의 핵심 이슈
                    </div>
                    <div className="relative h-7 overflow-hidden">
                      <div
                        // key={currentIndex}
                        className="animate-fadeIn absolute w-full text-lg font-bold"
                      >
                        {/* {latestKeywordNews.length > 0
                          ? latestKeywordNews[currentIndex]?.title
                          : '뉴스를 불러오는 중...'} */}
                        금리 인상 공포에 AI 의심...
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <div className="text-xs font-semibold text-[#6B9AC4]">
                        추천 키워드
                      </div>
                      <div className="mt-2 text-2xl font-bold text-[#2C3E50]">
                        {HERO_STATS.recommendedKeyword}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-[#F3F8FC] px-4 py-3 shadow-sm">
                      <div className="text-xs font-semibold text-[#5A6A85]">
                        뉴스 개수
                      </div>
                      <div className="mt-2 text-2xl font-bold text-[#2C3E50]">
                        {animatedNewsCount.toLocaleString('ko-KR')}개
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[calc(100svh-4.375rem)] snap-start items-center bg-white px-6 py-12">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-10 text-center">
              <div className="mb-2 text-3xl font-bold text-[#2C3E50]">
                왜 NewsAI인가?
              </div>
              <p className="text-sm text-[#3D5A80]/70">
                정보 과부하 시대, 필요한 것만 빠르게
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {FEATURES.map(feature => (
                <FeatureBox
                  key={feature.title}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  iconClassName={feature.iconClassName}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="relative flex min-h-[calc(100svh-4.375rem)] snap-start items-center px-6 py-12">
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
            <div className="rounded-[28px] bg-[#3D5A80] px-6 py-14 sm:px-10">
              <div className="mx-auto max-w-2xl text-center">
                <p className="mb-4 text-3xl font-bold text-white">
                  지금 바로 시작하세요
                </p>
                <p className="mb-6 text-base text-white/80">
                  무료로 시작하고, 스마트한 뉴스 경험을 만나보세요
                </p>
                <Button
                  to="/signup"
                  className="inline-flex h-12 w-auto justify-center rounded-lg bg-[#6B9AC4] px-10 text-center font-bold text-white shadow-lg transition-all hover:bg-[#8FADC7]"
                >
                  무료 회원가입
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
export default WelcomePage
