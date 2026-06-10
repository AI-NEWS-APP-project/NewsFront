import type { UserKeywordOption } from '@features/news/model/types'

export type KeywordResponseItem =
  | string
  | {
      id?: number
      keywordId?: number
      name?: string
      keyword?: string
      keywordName?: string
    }

export function normalizeKeywords(items?: KeywordResponseItem[]) {
  if (!Array.isArray(items)) {
    return []
  }

  return items
    .map(item => {
      if (typeof item === 'string') {
        return null
      }

      const id = item.id ?? item.keywordId
      const name = item.name || item.keywordName || item.keyword

      if (typeof id !== 'number' || !name) {
        return null
      }

      return {
        id,
        name,
      }
    })
    .filter((keyword): keyword is UserKeywordOption => keyword !== null)
}
