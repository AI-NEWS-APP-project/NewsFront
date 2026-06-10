import { GridIcon, ListIcon } from '@shared/assets/icons'
import NewsCard from '@features/news/newsCard'
import NewsListItem from '@features/news/newsListItem'
import { useNewsFeed } from '@widgets/news-feed/model/useNewsFeed'

function NewsFeedWidget() {
  const {
    errorMessage,
    isLoading,
    newsItems,
    selectedKeywordId,
    selectedKeywordName,
    setSelectedKeywordId,
    setViewMode,
    userKeywords,
    viewMode,
  } = useNewsFeed()

  return (
    <>
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

      {isLoading ? (
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
    </>
  )
}

export default NewsFeedWidget
