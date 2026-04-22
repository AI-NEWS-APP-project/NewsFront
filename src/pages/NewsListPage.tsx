import { useMemo, useState } from 'react'
import NewsCard from '@features/news/newsCard'
import NewsListItem from '@features/news/newsListItem'
import { MOCK_NEWS_LIST, NEWS_KEYWORDS } from '@features/news/mock/newsMock'
import { GridIcon, ListIcon } from '@shared/assets/icons'
import Header from '@shared/components/header'
import Footer from '@shared/components/Footer'

type ViewMode = 'grid' | 'list'

function NewsListPage() {
  const [selectedKeyword, setSelectedKeyword] =
    useState<(typeof NEWS_KEYWORDS)[number]>('전체')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  const filteredNews = useMemo(
    () =>
      selectedKeyword === '전체'
        ? MOCK_NEWS_LIST
        : MOCK_NEWS_LIST.filter(news => news.keyword === selectedKeyword),
    [selectedKeyword]
  )

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
          {NEWS_KEYWORDS.map(keyword => (
            <button
              key={keyword}
              type="button"
              onClick={() => setSelectedKeyword(keyword)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all ${
                selectedKeyword === keyword
                  ? 'border-[#7899bc] bg-[#7899bc] text-white shadow-md'
                  : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#9DB3CB] hover:bg-[#F8FAFC]'
              }`}
            >
              {keyword}
            </button>
          ))}
        </div>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredNews.map(news => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNews.map(news => (
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
