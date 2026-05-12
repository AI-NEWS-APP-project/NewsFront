export interface NewsItem {
  id: number
  keyword: string
  title: string
  time: string
  date: string
}

export interface KeywordNewsItem {
  id: number
  title: string
  date: string
}

export interface KeywordNewsGroup {
  keyword: string
  count: number
  news: KeywordNewsItem[]
}

export interface LatestKeywordNewsSummary {
  id: number
  keywordId: number
  keywordName: string
  summaryText: string
  clusterNewsCount: number
  createdAt: string
}

export interface KeywordNewsHistoryItem {
  id: number
  keywordId?: number
  keywordName: string
  summaryText: string
  clusterNewsCount?: number
  createdAt: string
}

export interface KeywordNewsPageResponse {
  content: KeywordNewsHistoryItem[]
  totalPages?: number
  totalElements?: number
  size?: number
  number?: number
  first?: boolean
  last?: boolean
  empty?: boolean
}

export interface UserKeywordOption {
  id: number
  name: string
}

export interface KeywordNewsDetailLink {
  url: string
  title: string
}

export interface KeywordNewsDetail {
  id: number
  keywordId: number
  keywordName: string
  summaryText: string
  clusterNewsCount: number
  createdAt: string
  links: KeywordNewsDetailLink[]
}

export interface DailyBriefingSummary {
  id: number
  title: string
  summary: string
  newsCount: number
  generatedAt: string
}

export interface DailyBriefingNews {
  id: string
  title: string
  url: string
  source?: string | null
  publishedAt?: string | null
}

export interface DailyBriefingDetail extends DailyBriefingSummary {
  news: DailyBriefingNews[]
}
