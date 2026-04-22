import { Link } from 'react-router-dom'
import type { NewsItem } from '@features/news/model/types'

export default function NewsListItem({ news }: { news: NewsItem }) {
  return (
    <Link to={`/news/${news.id}`} className="group block">
      <article className="flex items-start gap-4 rounded-2xl border border-[#DCE8F4] bg-white px-5 py-4 text-left transition-all hover:border-[#9DB3CB] hover:shadow-md">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[#6B9AC4] px-2.5 py-1 text-[10px] font-bold text-white">
              {news.keyword}
            </span>
            <span className="text-xs text-[#7A8FA6]">{news.time}</span>
          </div>

          <div className="mb-2 line-clamp-2 text-base font-bold text-[#1E293B] transition-colors group-hover:text-[#6B9AC4] sm:text-lg">
            {news.title}
          </div>

          <p className="text-xs text-[#7A8FA6]">{news.date}</p>
        </div>
      </article>
    </Link>
  )
}
