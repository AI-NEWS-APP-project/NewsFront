import { useAuthStore } from '@features/auth/model/useAuthStore'
import Header from '@widgets/header/ui/Header'
import DashboardDailyBriefingWidget from '@widgets/dashboard-daily-briefing/ui/DashboardDailyBriefingWidget'
import DashboardKeywordNewsWidget from '@widgets/dashboard-keyword-news/ui/DashboardKeywordNewsWidget'
import Footer from '@shared/components/Footer'

function DashboardPage() {
  const user = useAuthStore(state => state.user)

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

        <DashboardDailyBriefingWidget />
        <DashboardKeywordNewsWidget />
      </main>
      <Footer />
    </div>
  )
}

export default DashboardPage
