import { Link, useParams } from 'react-router-dom'
import SourceArticleList from '@features/news/components/SourceArticleList'
import { formatDate } from '@features/news/lib/date'
import { useKeywordNewsDetailQuery } from '@features/news/model/useNewsDetailQueries'
import { NewsSummaryIcon } from '@shared/assets/icons'
import Button from '@shared/components/Button'
import Footer from '@shared/components/Footer'
import Header from '@widgets/header/ui/Header'

function ArrowLeftGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 transition-transform group-hover:-translate-x-1"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
      <path d="M9 12h10" />
    </svg>
  )
}

function CalendarGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5"
      aria-hidden="true"
    >
      <rect x="4" y="5" width="16" height="15" rx="2.5" />
      <path d="M8 3.5v3" />
      <path d="M16 3.5v3" />
      <path d="M4 9.5h16" />
    </svg>
  )
}

export default function NewsDetailPage() {
  const { id } = useParams()
  const {
    data: newsDetail,
    isLoading,
    error,
  } = useKeywordNewsDetailQuery({ id })
  const errorMessage =
    error instanceof Error
      ? error.message
      : '뉴스 상세 정보를 불러오지 못했습니다.'

  return (
    <div className="min-h-screen bg-[#F8FBFD]">
      <Header />

      <main className="mx-auto max-w-3xl px-5 pt-24 pb-12 text-left">
        <Link
          to="/news"
          className="group mb-6 inline-flex items-center gap-2 text-[#3D5A80] transition-colors hover:text-[#6B9AC4]"
        >
          <ArrowLeftGlyph />
          <span className="text-sm font-medium">목록으로</span>
        </Link>

        {isLoading ? (
          <section className="rounded-2xl border border-[#E8F1F8] bg-white p-6 text-sm text-[#64748B] shadow-md sm:p-7">
            뉴스 상세 정보를 불러오는 중입니다.
          </section>
        ) : errorMessage || !newsDetail ? (
          <section className="rounded-2xl border border-[#F1D5D5] bg-white p-6 text-sm text-[#B45353] shadow-md sm:p-7">
            {errorMessage || '뉴스 상세 정보를 찾을 수 없습니다.'}
          </section>
        ) : (
          <section className="rounded-2xl border border-[#E8F1F8] bg-white p-6 shadow-md sm:p-7">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="flex h-6 items-center justify-center rounded-md bg-[#6B9AC4] px-2.5 text-[11px] font-bold text-white">
                {newsDetail.keywordName}
              </span>
              <span className="flex h-6 items-center justify-center rounded-md bg-[#E8F1F8] px-2.5 text-[11px] font-bold text-[#6B9AC4]">
                {newsDetail.clusterNewsCount}개
              </span>
            </div>

            <div className="mb-4 text-[24px] leading-tight font-bold text-[#2C3E50] sm:text-[28px]">
              {newsDetail.summaryText}
            </div>

            <div className="mb-5 flex flex-wrap items-center gap-4 border-b border-[#E8F1F8] pb-5 text-[#3D5A80]/70">
              <div className="flex items-center gap-1.5">
                <CalendarGlyph />
                <span className="text-xs font-medium">
                  {formatDate(newsDetail.createdAt)}
                </span>
              </div>
              <div className="text-xs font-medium">
                {newsDetail.keywordName}
              </div>
            </div>

            <section className="mb-7 text-left">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-lg bg-[#6B9AC4] text-white">
                  <NewsSummaryIcon className="size-3.5" />
                </div>
                <div className="text-base font-bold text-[#2C3E50]">
                  AI 요약
                </div>
              </div>
              <div className="rounded-xl border border-[#E8F1F8] bg-[#F8FBFD] p-5">
                <div className="text-sm leading-7 whitespace-pre-line text-[#2C3E50]">
                  {newsDetail.summaryText}
                </div>
              </div>
            </section>

            <section className="border-t border-[#E8F1F8] pt-5 text-left">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="text-base font-bold text-[#2C3E50]">
                  원문 기사
                </div>
                <span className="text-xs text-[#3D5A80]/70">
                  {newsDetail.links.length}개
                </span>
              </div>
              {newsDetail.links.length > 0 ? (
                <div className="max-h-80 overflow-y-auto pr-1">
                  <SourceArticleList
                    articles={newsDetail.links.map((link, index) => ({
                      id: index + 1,
                      title: link.title,
                      url: link.url,
                    }))}
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-[#F8FBFD] px-4 py-6 text-sm text-[#64748B]">
                  연결된 원문 기사가 없습니다.
                </div>
              )}
            </section>
          </section>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button to="/news" type="button" variant="secondary" size="lg">
            뉴스 목록
          </Button>
          <Button to="/dashboard" type="button" variant="primary" size="lg">
            대시보드
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
