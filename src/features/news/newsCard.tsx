import { Link } from 'react-router-dom'

export interface News {
  id: number
  keyword: string
  title: string
  time: string
  date: string
}
export default function NewsCard({ news }: { news: News }) {
  return (
    <Link to={`/news/${news.id}`}>
      <div className="group flex h-48 flex-col rounded-xl border border-sky-700/20 bg-white p-4 text-left hover:shadow-md">
        <span className="mb-2 inline-block self-start rounded-md bg-[#6B9AC4] px-2 py-1 text-[10px] font-bold text-white">
          {news.keyword}
        </span>
        <div className="mb-2 flex items-center gap-1 text-[10px] text-[#3D5A80]/60">
          <div className="size-3" />
          {news.time}
        </div>
        <div className="mb-2 line-clamp-3 text-sm font-semibold group-hover:text-[#6B9AC4]">
          {news.title}
        </div>
        <p className="mt-auto border-t border-sky-700/20 pt-2 text-[10px] text-[#3D5A80]/60">
          {news.date}
        </p>
      </div>
    </Link>
  )
}
