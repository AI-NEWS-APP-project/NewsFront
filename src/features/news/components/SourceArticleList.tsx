interface SourceArticle {
  id: number | string
  title: string
  url: string
  source?: string
  date?: string
}

function ExternalLinkGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5 shrink-0"
      aria-hidden="true"
    >
      <path d="M14 5h5v5" />
      <path d="M10 14 19 5" />
      <path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
    </svg>
  )
}

interface SourceArticleListProps {
  articles: SourceArticle[]
}

export default function SourceArticleList({
  articles,
}: SourceArticleListProps) {
  return (
    <div className="divide-y divide-[#E8F1F8]">
      {articles.map(article => (
        <a
          key={article.id}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block py-3 first:pt-0 last:pb-0"
        >
          <article className="transition-all">
            <div className="flex items-start justify-between gap-3 text-left">
              <div className="min-w-0 flex-1">
                <div className="mb-1 line-clamp-2 text-sm font-medium text-[#2C3E50] transition-colors group-hover:text-[#6B9AC4]">
                  {article.title}
                </div>
                {article.source || article.date ? (
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#3D5A80]/60">
                    {article.source ? <span>{article.source}</span> : null}
                    {article.source && article.date ? <span>•</span> : null}
                    {article.date ? <span>{article.date}</span> : null}
                  </div>
                ) : null}
              </div>
              <div className="mt-0.5 text-[#9AB4CF] transition-colors group-hover:text-[#6B9AC4]">
                <ExternalLinkGlyph />
              </div>
            </div>
          </article>
        </a>
      ))}
    </div>
  )
}
