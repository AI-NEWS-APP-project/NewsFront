import { useState } from 'react'
import { KeywordClusterIcon, NewsSummaryIcon } from '@shared/assets/icons'
import { MOCK_AI_NEWS, MOCK_KEYWORD_NEWS } from '@features/news/mock/newsMock'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import NewsCard from '@features/news/newsCard'
import NewsKeyword from '@features/news/newsKeyword'
import Header from '@shared/components/header'
import Footer from '@shared/components/Footer'

function DashboardPage() {
  const user = useAuthStore(state => state.user)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 2
  const totalPages = Math.ceil(MOCK_KEYWORD_NEWS.length / itemsPerPage)

  const currentItems = MOCK_KEYWORD_NEWS.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage,
  )

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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MOCK_AI_NEWS.map(news => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D5A80]/10 text-[#3D5A80]">
                <KeywordClusterIcon className="size-5" />
              </div>
              <div className="text-2xl font-bold text-[#1E293B]">키워드 뉴스</div>
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

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {currentItems.map(group => (
              <NewsKeyword key={group.keyword} group={group} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default DashboardPage
