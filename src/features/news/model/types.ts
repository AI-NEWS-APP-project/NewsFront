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
