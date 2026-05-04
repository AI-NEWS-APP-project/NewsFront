import { Link } from 'react-router-dom'
import type { KeywordNewsGroup } from '@features/news/model/types'

export default function NewsKeyword({ group }: { group: KeywordNewsGroup }) {
  return (
    <div className="rounded-xl border border-[#E8F1F8] bg-white p-5 text-left transition-all hover:shadow-md">
      <div className="mb-4 flex items-center gap-2">
        <div className="text-lg font-bold text-[#2C3E50]">#{group.keyword}</div>
        <span className="flex h-6 items-center rounded-md bg-[#E8F1F8] px-2 text-xs font-semibold text-[#6B9AC4]">
          {group.news.length}개
        </span>
      </div>

      <div className="mb-4 space-y-2">
        {group.news.length > 0 ? (
          group.news.map(item => (
            <Link key={item.id} to={`/news/${item.id}`} className="group block">
              <div className="rounded-lg bg-[#F8FBFD] p-3 text-left transition-all hover:bg-[#E8F1F8]">
                <p className="line-clamp-2 text-xs font-medium text-[#2C3E50] transition-colors group-hover:text-[#6B9AC4]">
                  {item.title}
                </p>
                <p className="mt-1 text-[10px] text-[#3D5A80]/60">
                  {item.date}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-lg bg-[#F8FBFD] px-4 py-6 text-center text-sm text-[#64748B]">
            해당 키워드에 맞는 뉴스가 없습니다.
          </div>
        )}
      </div>

      <Link to={`/news?keyword=${group.keyword}`}>
        <button
          type="button"
          className="flex h-9 w-full items-center justify-center gap-1.5 rounded-lg bg-[#6B9AC4] text-xs font-semibold text-white transition-all hover:bg-[#3D5A80]"
        >
          전체 보기
          <span className="text-sm leading-none">{'->'}</span>
        </button>
      </Link>
    </div>
  )
}
