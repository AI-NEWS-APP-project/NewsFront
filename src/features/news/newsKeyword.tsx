import { Link } from 'react-router-dom'

export default function NewsKeyword({
  group,
}: {
  group: {
    keyword: string
    count: number
    news: { id: number; title: string; date: string }[]
  }
}) {
  return (
    <div className="rounded-xl border border-sky-700/20 bg-white p-5 text-left hover:shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-lg font-bold">#{group.keyword}</h3>
        <span className="rounded bg-[#E8F1F8] px-2 text-xs text-[#6B9AC4]">
          {group.count}개
        </span>
      </div>

      <div className="mb-4 space-y-2">
        {group.news.map((item: { id: number; title: string; date: string }) => (
          <Link key={item.id} to={`/news/${item.id}`}>
            <div className="rounded-lg border border-sky-700/10 bg-[#F8FBFD] p-3 text-left hover:bg-[#E8F1F8]">
              <p className="line-clamp-2 text-xs font-medium">{item.title}</p>
              <p className="text-[10px] text-[#3D5A80]/60">{item.date}</p>
            </div>
          </Link>
        ))}
      </div>

      <Link to={`/news?keyword=${group.keyword}`}>
        <button className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#6B9AC4] text-xs font-semibold text-white">
          전체 보기
          <div className="size-3" />
        </button>
      </Link>
    </div>
  )
}
