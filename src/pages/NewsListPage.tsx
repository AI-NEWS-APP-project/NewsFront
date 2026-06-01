import { useEffect, useState } from 'react'
import { getKeywordNewsByKeywordId } from '@features/news/api/keywordNews'
import type {
  KeywordNewsHistoryItem,
  KeywordNewsPageResponse,
  NewsItem,
  UserKeywordOption,
} from '@features/news/model/types'
import { getKeywords } from '@features/keyword/api/keywords'
import NewsCard from '@features/news/newsCard'
import NewsListItem from '@features/news/newsListItem'
import { GridIcon, ListIcon } from '@shared/assets/icons'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import Header from '@widgets/header/ui/Header'
import Footer from '@shared/components/Footer'

type ViewMode = 'grid' | 'list'
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

function mapHistoryItemToNewsItem(item: KeywordNewsHistoryItem): NewsItem {
  return {
    id: item.id,
    keyword: item.keywordName,
    title: item.summaryText,
    time: formatRelativeTime(item.createdAt),
    date: formatDate(item.createdAt),
  }
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

function NewsListPage() {
  const user = useAuthStore(state => state.user)
  const [userKeywords, setUserKeywords] = useState<UserKeywordOption[]>([])
  const [selectedKeywordId, setSelectedKeywordId] = useState<number | 'all'>(
    'all'
  )
  const [newsItems, setNewsItems] = useState<NewsItem[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(true)
  const [isLoadingNews, setIsLoadingNews] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchKeywords = async () => {
      if (!user) {
        setIsLoadingKeywords(false)
        setErrorMessage('사용자 정보를 찾을 수 없습니다.')
        return
      }

      setIsLoadingKeywords(true)
      setErrorMessage('')

      try {
        const result = await getKeywords<KeywordResponseItem[]>()

        if (result.success === false) {
          throw new Error(
            result.message || '사용자 키워드를 불러오지 못했습니다.'
          )
        }

        const normalizedKeywords = normalizeKeywords(result.data)
        setUserKeywords(normalizedKeywords)
        setSelectedKeywordId('all')
      } catch (error) {
        console.error('사용자 키워드 조회 실패:', error)
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '사용자 키워드를 불러오지 못했습니다.'
        )
      } finally {
        setIsLoadingKeywords(false)
      }
    }

    void fetchKeywords()
  }, [user])

  useEffect(() => {
    const fetchKeywordNews = async () => {
      if (selectedKeywordId !== 'all' && selectedKeywordId === null) {
        setNewsItems([])
        return
      }

      if (selectedKeywordId === 'all' && userKeywords.length === 0) {
        setNewsItems([])
        return
      }

      setIsLoadingNews(true)
      setErrorMessage('')

      try {
        if (selectedKeywordId === 'all') {
          const results = await Promise.all(
            userKeywords.map(keyword =>
              getKeywordNewsByKeywordId({
                keywordId: keyword.id,
                page: 0,
                size: 6,
              })
            )
          )

          const failedResult = results.find(result => result.success === false)

          if (failedResult?.success === false) {
            throw new Error(
              failedResult.message || '전체 키워드 뉴스를 불러오지 못했습니다.'
            )
          }

          setNewsItems(
            results.flatMap(result =>
              extractKeywordNewsItems(
                result.data as
                  | KeywordNewsHistoryItem[]
                  | KeywordNewsPageResponse
              ).map(mapHistoryItemToNewsItem)
            )
          )
        } else {
          const result = await getKeywordNewsByKeywordId({
            keywordId: selectedKeywordId,
            page: 0,
            size: 6,
          })

          if (result.success === false) {
            throw new Error(
              result.message || '선택한 키워드 뉴스를 불러오지 못했습니다.'
            )
          }

          setNewsItems(
            extractKeywordNewsItems(
              result.data as KeywordNewsHistoryItem[] | KeywordNewsPageResponse
            ).map(mapHistoryItemToNewsItem)
          )
        }
      } catch (error) {
        console.error('키워드별 뉴스 조회 실패:', error)
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '선택한 키워드 뉴스를 불러오지 못했습니다.'
        )
      } finally {
        setIsLoadingNews(false)
      }
    }

    void fetchKeywordNews()
  }, [selectedKeywordId, userKeywords])

  const selectedKeywordName =
    selectedKeywordId === 'all'
      ? '전체'
      : (userKeywords.find(keyword => keyword.id === selectedKeywordId)?.name ??
        '')

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="w-full px-8 pt-24 pb-12">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div className="flex flex-1 flex-col items-start gap-2 text-left">
            <p className="text-3xl font-extrabold text-[#1E293B] sm:text-4xl">
              뉴스 피드
            </p>
            <p className="text-lg text-[#64748B]">
              관심 키워드별 최신 뉴스를 한눈에 확인해보세요.
            </p>
          </div>

          <div className="flex rounded-2xl border border-[#DCE8F4] bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#7899bc] text-white'
                  : 'text-[#52667D] hover:bg-[#F1F5F9]'
              }`}
            >
              <GridIcon className="size-4" />
              그리드
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#7899bc] text-white'
                  : 'text-[#52667D] hover:bg-[#F1F5F9]'
              }`}
            >
              <ListIcon className="size-4" />
              리스트
            </button>
          </div>
        </div>
        <div className="mb-10 flex flex-wrap justify-start gap-2 border-b border-[#EEF2F6] pb-8">
          <button
            type="button"
            onClick={() => setSelectedKeywordId('all')}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${
              selectedKeywordId === 'all'
                ? 'border-[#7899bc] bg-[#7899bc] text-white shadow-md'
                : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#9DB3CB] hover:bg-[#F8FAFC]'
            }`}
          >
            전체
          </button>
          {userKeywords.map(keyword => (
            <button
              key={keyword.id}
              type="button"
              onClick={() => setSelectedKeywordId(keyword.id)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${
                selectedKeywordId === keyword.id
                  ? 'border-[#7899bc] bg-[#7899bc] text-white shadow-md'
                  : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#9DB3CB] hover:bg-[#F8FAFC]'
              }`}
            >
              {keyword.name}
            </button>
          ))}
        </div>
        {isLoadingKeywords || isLoadingNews ? (
          <div className="rounded-2xl border border-[#DCE8F4] bg-white px-5 py-8 text-sm text-[#64748B]">
            뉴스를 불러오는 중입니다.
          </div>
        ) : errorMessage ? (
          <div className="rounded-2xl border border-[#F1D5D5] bg-white px-5 py-8 text-sm text-[#B45353]">
            {errorMessage}
          </div>
        ) : userKeywords.length === 0 ? (
          <div className="rounded-2xl border border-[#DCE8F4] bg-white px-5 py-8 text-sm text-[#64748B]">
            등록된 키워드가 없습니다.
          </div>
        ) : newsItems.length === 0 ? (
          <div className="rounded-2xl border border-[#DCE8F4] bg-white px-5 py-8 text-sm text-[#64748B]">
            {selectedKeywordName === '전체'
              ? '전체 키워드에 해당하는 뉴스가 없습니다.'
              : `${selectedKeywordName} 키워드에 해당하는 뉴스가 없습니다.`}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newsItems.map(news => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {newsItems.map(news => (
              <NewsListItem key={news.id} news={news} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
export default NewsListPage
