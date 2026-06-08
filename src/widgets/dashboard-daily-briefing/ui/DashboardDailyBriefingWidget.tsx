import { Link } from 'react-router-dom'
import { NewsSummaryIcon } from '@shared/assets/icons'
import { formatRelativeTime } from '@features/news/lib/date'
import { useDashboardDailyBriefing } from '@widgets/dashboard-daily-briefing/model/useDashboardDailyBriefing'

function DashboardDailyBriefingWidget() {
  const { dailyBriefing, errorMessage, isLoading } = useDashboardDailyBriefing()

  return (
    <section className="mb-14">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3D5A80]/10 text-[#3D5A80]">
          <NewsSummaryIcon className="size-5" />
        </div>
        <div className="text-2xl font-bold text-[#1E293B]">
          오늘의 AI 요약 뉴스
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-[#E8F1F8] bg-white p-6 text-sm text-[#64748B]">
          오늘의 AI 요약 뉴스를 불러오는 중입니다.
        </div>
      ) : errorMessage ? (
        <div className="rounded-xl border border-[#F1D5D5] bg-white p-6 text-sm text-[#B45353]">
          {errorMessage}
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
  )
}

export default DashboardDailyBriefingWidget
