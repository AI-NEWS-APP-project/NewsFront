import { KeywordClusterIcon } from '@shared/assets/icons'
import NewsKeyword from '@features/news/newsKeyword'
import { useDashboardKeywordNews } from '@widgets/dashboard-keyword-news/model/useDashboardKeywordNews'

function DashboardKeywordNewsWidget() {
  const {
    activePage,
    currentItems,
    errorMessage,
    goToNextPage,
    goToPrevPage,
    isLoading,
    setCurrentPage,
    totalPages,
  } = useDashboardKeywordNews()

  return (
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
            disabled={activePage === 0}
            aria-label="이전 키워드 뉴스"
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
              activePage === 0
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
                  activePage === idx
                    ? 'h-2 w-6 bg-[#6B9AC4]'
                    : 'size-2 bg-[#D9E6F2] hover:bg-[#6B9AC4]/50'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goToNextPage}
            disabled={activePage === totalPages - 1}
            aria-label="다음 키워드 뉴스"
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
              activePage === totalPages - 1
                ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                : 'border border-[#D9E6F2] bg-white text-[#6B9AC4] hover:border-[#6B9AC4] hover:bg-[#F8FBFD]'
            }`}
          >
            <span className="text-lg leading-none">{'>'}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-[#E8F1F8] bg-white p-6 text-sm text-[#64748B]">
          키워드 뉴스를 불러오는 중입니다.
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-[#F1D5D5] bg-white p-6 text-sm text-[#B45353]">
          {errorMessage}
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
  )
}

export default DashboardKeywordNewsWidget
