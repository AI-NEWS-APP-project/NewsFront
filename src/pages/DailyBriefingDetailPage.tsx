import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import SourceArticleList from '@features/news/components/SourceArticleList'
import { getDailyBriefingDetail } from '@features/news/api/dailyBriefings'
import type { DailyBriefingDetail } from '@features/news/model/types'
import { NewsSummaryIcon } from '@shared/assets/icons'
import Button from '@shared/components/Button'
import Footer from '@shared/components/Footer'
import Header from '@shared/components/header'

function formatDateTime(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default function DailyBriefingDetailPage() {
  const { id } = useParams()
  const [briefing, setBriefing] = useState<DailyBriefingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const fetchBriefing = async () => {
      if (!id) {
        setIsLoading(false)
        setErrorMessage('브리핑 ID가 올바르지 않습니다.')
        return
      }

      setIsLoading(true)
      setErrorMessage('')

      try {
        const result = await getDailyBriefingDetail(id)

        if (!result) {
          throw new Error('일일 브리핑 상세를 불러오지 못했습니다.')
        }

        setBriefing(result)
      } catch (error) {
        console.error('일일 브리핑 상세 조회 실패:', error)
        setErrorMessage(
          error instanceof Error
            ? error.message
            : '일일 브리핑 상세를 불러오지 못했습니다.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    void fetchBriefing()
  }, [id])

  return (
    <div className="min-h-screen bg-[#F8FBFD]">
      <Header />

      <main className="mx-auto max-w-3xl px-5 pt-24 pb-12 text-left">
        <Link
          to="/dashboard"
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#3D5A80] transition-colors hover:text-[#6B9AC4]"
        >
          <span aria-hidden="true">{'<'}</span>
          대시보드로
        </Link>

        {isLoading ? (
          <section className="rounded-2xl border border-[#E8F1F8] bg-white p-6 text-sm text-[#64748B] shadow-md sm:p-7">
            일일 브리핑을 불러오는 중입니다.
          </section>
        ) : errorMessage || !briefing ? (
          <section className="rounded-2xl border border-[#F1D5D5] bg-white p-6 text-sm text-[#B45353] shadow-md sm:p-7">
            {errorMessage || '일일 브리핑을 찾을 수 없습니다.'}
          </section>
        ) : (
          <section className="rounded-2xl border border-[#E8F1F8] bg-white p-6 shadow-md sm:p-7">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="flex h-6 items-center justify-center rounded-md bg-[#6B9AC4] px-2.5 text-[11px] font-bold text-white">
                일일 브리핑
              </span>
              <span className="flex h-6 items-center justify-center rounded-md bg-[#E8F1F8] px-2.5 text-[11px] font-bold text-[#6B9AC4]">
                {briefing.newsCount}개 뉴스
              </span>
            </div>

            <h1 className="mb-4 text-[24px] leading-tight font-bold text-[#2C3E50] sm:text-[28px]">
              {briefing.title}
            </h1>

            <div className="mb-5 border-b border-[#E8F1F8] pb-5 text-xs font-medium text-[#3D5A80]/70">
              {formatDateTime(briefing.generatedAt)}
            </div>

            <section className="mb-7">
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
                  {briefing.summary}
                </div>
              </div>
            </section>

            <section className="border-t border-[#E8F1F8] pt-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div className="text-base font-bold text-[#2C3E50]">
                  원문 뉴스
                </div>
                <span className="text-xs text-[#3D5A80]/70">
                  {briefing.news.length}개
                </span>
              </div>
              {briefing.news.length > 0 ? (
                <div className="max-h-96 overflow-y-auto pr-1">
                  <SourceArticleList
                    articles={briefing.news.map(news => ({
                      id: news.id,
                      title: news.title,
                      url: news.url,
                      source: news.source ?? undefined,
                      date: news.publishedAt
                        ? formatDateTime(news.publishedAt)
                        : undefined,
                    }))}
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-[#F8FBFD] px-4 py-6 text-sm text-[#64748B]">
                  연결된 원문 뉴스가 없습니다.
                </div>
              )}
            </section>
          </section>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button to="/dashboard" type="button" variant="secondary" size="lg">
            대시보드
          </Button>
          <Button to="/news" type="button" variant="primary" size="lg">
            뉴스 목록
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
