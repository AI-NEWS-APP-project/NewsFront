import type {
  KeywordNewsGroup,
  KeywordNewsHistoryItem,
  KeywordNewsPageResponse,
  NewsItem,
  UserKeywordOption,
} from '@features/news/model/types'
import { formatDate, formatRelativeTime } from '@features/news/lib/date'

export function extractKeywordNewsItems(
  data?: KeywordNewsHistoryItem[] | KeywordNewsPageResponse
) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.content)) {
    return data.content
  }

  return []
}

export function mapHistoryItemToNewsItem(
  item: KeywordNewsHistoryItem
): NewsItem {
  return {
    id: item.id,
    keyword: item.keywordName,
    title: item.summaryText,
    time: formatRelativeTime(item.createdAt),
    date: formatDate(item.createdAt),
  }
}

export function mapHistoryItemsToGroups(
  keywords: UserKeywordOption[],
  groupedItems: Array<{
    keyword: UserKeywordOption
    items: KeywordNewsHistoryItem[]
  }>
): KeywordNewsGroup[] {
  return keywords.map(keyword => {
    const matchedItems =
      groupedItems.find(item => item.keyword.id === keyword.id)?.items ?? []

    return {
      keyword: keyword.name,
      count: matchedItems.reduce(
        (total, item) => total + (item.clusterNewsCount ?? 1),
        0
      ),
      news: matchedItems.slice(0, 3).map(item => ({
        id: item.id,
        title: item.summaryText,
        date: formatDate(item.createdAt),
      })),
    }
  })
}
