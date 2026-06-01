import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { KeywordClusterIcon, NewsSummaryIcon } from '@shared/assets/icons'
import { getKeywordNewsByKeywordId } from '@features/news/api/keywordNews'
import { getLatestDailyBriefing } from '@features/news/api/dailyBriefings'
import type {
  DailyBriefingSummary,
  KeywordNewsGroup,
  KeywordNewsHistoryItem,
  KeywordNewsPageResponse,
  UserKeywordOption,
} from '@features/news/model/types'
import { getKeywords } from '@features/keyword/api/keywords'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import NewsKeyword from '@features/news/newsKeyword'
import Header from '@widgets/header/ui/Header'
import Footer from '@shared/components/Footer'

type KeywordResponseItem =
  | string
  | {
      id?: number
      keywordId?: number
      name?: string
      keyword?: string
      keywordName?: string
    }

function formatRelativeTime(createdAt: string) {
  const createdDate = new Date(createdAt)

  if (Number.isNaN(createdDate.getTime())) {
    return ''
  }

  const diffMs = Date.now() - createdDate.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) {
    return '방금 전'
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`
  }

  if (diffHours < 24) {
    return `${diffHours}시간 전`
  }

  return `${diffDays}일 전`
}

function formatDate(createdAt: string) {
  const createdDate = new Date(createdAt)

  if (Number.isNaN(createdDate.getTime())) {
    return createdAt
  }

  const year = createdDate.getFullYear()
  const month = String(createdDate.getMonth() + 1).padStart(2, '0')
  const day = String(createdDate.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}

function normalizeKeywords(items?: KeywordResponseItem[]) {
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
    .filter((keyword): keyword is UserKeywordOption => keyword !== null)
}

function mapHistoryItemsToGroups(
  keywords: UserKeywordOption[],
  groupedItems: Array<{
    keyword: UserKeywordOption
    items: KeywordNewsHistoryItem[]
  }>
): KeywordNewsGroup[] {
  return keywords.map(keyword => {
    const matchedItems =
      groupedItems.find(item => item.keyword.id === keyword.id)?.items ?? []

    return {
      keyword: keyword.name,
      count: matchedItems.reduce(
        (total, item) => total + (item.clusterNewsCount ?? 1),
        0
      ),
      news: matchedItems.slice(0, 3).map(item => ({
        id: item.id,
        title: item.summaryText,
        date: formatDate(item.createdAt),
      })),
    }
  })
}

function extractKeywordNewsItems(
  data?: KeywordNewsHistoryItem[] | KeywordNewsPageResponse
) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.content)) {
    return data.content
  }

  return []
}

function DashboardPage() {
  const user = useAuthStore(state => state.user)
  const [dailyBriefing, setDailyBriefing] =
    useState<DailyBriefingSummary | null>(null)
  const [keywordGroups, setKeywordGroups] = useState<KeywordNewsGroup[]>([])
  const [isLoadingAiSummaryNews, setIsLoadingAiSummaryNews] = useState(true)
  const [aiSummaryNewsError, setAiSummaryNewsError] = useState('')
  const [isLoadingKeywordNews, setIsLoadingKeywordNews] = useState(true)
  const [keywordNewsError, setKeywordNewsError] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 2
  const totalPages = Math.max(1, Math.ceil(keywordGroups.length / itemsPerPage))

  const currentItems = keywordGroups.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  useEffect(() => {
    const fetchDailyBriefing = async () => {
      setIsLoadingAiSummaryNews(true)
      setAiSummaryNewsError('')

      try {
        const result = await getLatestDailyBriefing()
        setDailyBriefing(result)
      } catch (error) {
        console.error('일일 브리핑 조회 실패:', error)
        setAiSummaryNewsError(
          error instanceof Error
            ? error.message
            : '오늘의 AI 요약 뉴스를 불러오지 못했습니다.'
        )
      } finally {
        setIsLoadingAiSummaryNews(false)
      }
    }

    void fetchDailyBriefing()
  }, [])

  useEffect(() => {
    const fetchKeywordNewsGroups = async () => {
      if (!user) {
        setIsLoadingKeywordNews(false)
        setKeywordNewsError('사용자 정보를 찾을 수 없습니다.')
        return
      }

      setIsLoadingKeywordNews(true)
      setKeywordNewsError('')

      try {
        const keywordsResult = await getKeywords<KeywordResponseItem[]>()

        if (keywordsResult.success === false) {
          throw new Error(
            keywordsResult.message || '사용자 키워드를 불러오지 못했습니다.'
          )
        }

        const normalizedKeywords = normalizeKeywords(keywordsResult.data)

        const newsResults = await Promise.all(
          normalizedKeywords.map(async keyword => {
            const result = await getKeywordNewsByKeywordId({
              keywordId: keyword.id,
              page: 0,
              size: 3,
            })

            if (result.success === false) {
              throw new Error(
                result.message ||
                  `${keyword.name} 키워드 기반 뉴스를 불러오지 못했습니다.`
              )
            }

            return {
              keyword,
              items: extractKeywordNewsItems(
                result.data as
                  | KeywordNewsHistoryItem[]
                  | KeywordNewsPageResponse
              ),
            }
          })
        )

        setKeywordGroups(
          mapHistoryItemsToGroups(normalizedKeywords, newsResults)
        )
      } catch (error) {
        console.error('대시보드 키워드 뉴스 조회 실패:', error)
        setKeywordNewsError(
          error instanceof Error
            ? error.message
            : '키워드 기반 뉴스를 불러오지 못했습니다.'
        )
      } finally {
        setIsLoadingKeywordNews(false)
      }
    }

    void fetchKeywordNewsGroups()
  }, [user])

  useEffect(() => {
    if (currentPage > totalPages - 1) {
      setCurrentPage(Math.max(totalPages - 1, 0))
    }
  }, [currentPage, totalPages])

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <main className="mx-auto max-w-7xl px-8 pt-20 pb-12">
        <div className="mb-12 text-left">
          <div className="mb-2 text-4xl font-bold text-[#1E293B]">
            안녕하세요 {user?.name ?? '사용자'}님👋
          </div>
          <p className="text-base text-[#64748B]">
            오늘의 주요 뉴스를 확인해보세요
          </p>
        </div>

        <section className="mb-14">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D5A80]/10 text-[#3D5A80]">
              <NewsSummaryIcon className="size-5" />
            </div>
            <div className="text-2xl font-bold text-[#1E293B]">
              오늘의 AI 요약 뉴스
            </div>
          </div>

          {isLoadingAiSummaryNews ? (
            <div className="rounded-xl border border-[#E8F1F8] bg-white p-6 text-sm text-[#64748B]">
              오늘의 AI 요약 뉴스를 불러오는 중입니다.
            </div>
          ) : aiSummaryNewsError ? (
            <div className="rounded-xl border border-[#F1D5D5] bg-white p-6 text-sm text-[#B45353]">
              {aiSummaryNewsError}
            </div>
          ) : !dailyBriefing ? (
            <div className="rounded-xl border border-[#E8F1F8] bg-white p-6 text-sm text-[#64748B]">
              표시할 오늘의 AI 요약 뉴스가 없습니다.
            </div>
          ) : (
            <Link
              to={`/news/daily-briefings/${dailyBriefing.id}`}
              className="group block rounded-xl border border-[#E8F1F8] bg-white p-6 text-left shadow-sm transition-all hover:border-[#6B9AC4]/50 hover:shadow-md"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#6B9AC4] px-2.5 py-1 text-[11px] font-bold text-white">
                  일일 브리핑
                </span>
                <span className="rounded-md bg-[#E8F1F8] px-2.5 py-1 text-[11px] font-bold text-[#6B9AC4]">
                  {dailyBriefing.newsCount}개 뉴스
                </span>
                <span className="text-xs font-medium text-[#3D5A80]/60">
                  {formatRelativeTime(dailyBriefing.generatedAt)}
                </span>
              </div>
              <div className="mb-3 text-xl font-bold text-[#1E293B] transition-colors group-hover:text-[#6B9AC4]">
                {dailyBriefing.title}
              </div>
              <p className="line-clamp-3 text-sm leading-6 text-[#475569]">
                {dailyBriefing.summary}
              </p>
              <div className="mt-5 border-t border-[#E8F1F8] pt-3 text-xs font-semibold text-[#6B9AC4]">
                상세 뉴스 보기
              </div>
            </Link>
          )}
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D5A80]/10 text-[#3D5A80]">
                <KeywordClusterIcon className="size-5" />
              </div>
              <div className="text-2xl font-bold text-[#1E293B]">
                키워드 뉴스
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                aria-label="이전 키워드 뉴스"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                  currentPage === 0
                    ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                    : 'border border-[#D9E6F2] bg-white text-[#6B9AC4] hover:border-[#6B9AC4] hover:bg-[#F8FBFD]'
                }`}
              >
                <span className="text-lg leading-none">{'<'}</span>
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentPage(idx)}
                    aria-label={`${idx + 1}페이지로 이동`}
                    className={`rounded-full transition-all ${
                      currentPage === idx
                        ? 'h-2 w-6 bg-[#6B9AC4]'
                        : 'size-2 bg-[#D9E6F2] hover:bg-[#6B9AC4]/50'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                aria-label="다음 키워드 뉴스"
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                  currentPage === totalPages - 1
                    ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                    : 'border border-[#D9E6F2] bg-white text-[#6B9AC4] hover:border-[#6B9AC4] hover:bg-[#F8FBFD]'
                }`}
              >
                <span className="text-lg leading-none">{'>'}</span>
              </button>
            </div>
          </div>

          {isLoadingKeywordNews ? (
            <div className="rounded-xl border border-[#E8F1F8] bg-white p-6 text-sm text-[#64748B]">
              키워드 뉴스를 불러오는 중입니다.
            </div>
          ) : keywordNewsError ? (
            <div className="rounded-xl border border-[#F1D5D5] bg-white p-6 text-sm text-[#B45353]">
              {keywordNewsError}
            </div>
          ) : currentItems.length === 0 ? (
            <div className="rounded-xl border border-[#E8F1F8] bg-white p-6 text-sm text-[#64748B]">
              표시할 키워드 뉴스가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {currentItems.map(group => (
                <NewsKeyword key={group.keyword} group={group} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default DashboardPage
