import Header from '@widgets/header/ui/Header'
import NewsFeedWidget from '@widgets/news-feed/ui/NewsFeedWidget'
import Footer from '@shared/components/Footer'

function NewsListPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />

      <main className="w-full px-8 pt-24 pb-12">
        <NewsFeedWidget />
      </main>

      <Footer />
    </div>
  )
}
export default NewsListPage
