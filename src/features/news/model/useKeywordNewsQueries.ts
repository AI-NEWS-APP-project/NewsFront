import { useQuery } from '@tanstack/react-query'
import { getKeywordNewsByKeywordId } from '@features/news/api/keywordNews'
import {
  extractKeywordNewsItems,
  mapHistoryItemToNewsItem,
  mapHistoryItemsToGroups,
} from '@features/news/lib/keywordNews'
import type {
  KeywordNewsGroup,
  KeywordNewsHistoryItem,
  KeywordNewsPageResponse,
  NewsItem,
  UserKeywordOption,
} from '@features/news/model/types'
import { newsKeys } from '@features/news/model/newsQueryKeys'

interface UseKeywordNewsItemsQueryParams {
  enabled: boolean
  keywords: UserKeywordOption[]
  selectedKeywordId: number | 'all'
  size?: number
}

export function useKeywordNewsItemsQuery({
  enabled,
  keywords,
  selectedKeywordId,
  size = 6,
}: UseKeywordNewsItemsQueryParams) {
  const keywordIds = keywords.map(keyword => keyword.id)

  return useQuery({
    queryKey: newsKeys.keywordNewsList(selectedKeywordId, keywordIds, size),
    queryFn: async (): Promise<NewsItem[]> => {
      if (selectedKeywordId === 'all') {
        if (keywords.length === 0) {
          return []
        }

        const results = await Promise.all(
          keywords.map(keyword =>
            getKeywordNewsByKeywordId({
              keywordId: keyword.id,
              page: 0,
              size,
            })
          )
        )

        const failedResult = results.find(result => result.success === false)

        if (failedResult?.success === false) {
          throw new Error(
            failedResult.message || '전체 키워드 뉴스를 불러오지 못했습니다.'
          )
        }

        return results.flatMap(result =>
          extractKeywordNewsItems(
            result.data as KeywordNewsHistoryItem[] | KeywordNewsPageResponse
          ).map(mapHistoryItemToNewsItem)
        )
      }

      const result = await getKeywordNewsByKeywordId({
        keywordId: selectedKeywordId,
        page: 0,
        size,
      })

      if (result.success === false) {
        throw new Error(
          result.message || '선택한 키워드 뉴스를 불러오지 못했습니다.'
        )
      }

      return extractKeywordNewsItems(
        result.data as KeywordNewsHistoryItem[] | KeywordNewsPageResponse
      ).map(mapHistoryItemToNewsItem)
    },
    enabled,
  })
}

interface UseDashboardKeywordNewsGroupsQueryParams {
  enabled: boolean
  keywords: UserKeywordOption[]
  size?: number
}

export function useDashboardKeywordNewsGroupsQuery({
  enabled,
  keywords,
  size = 3,
}: UseDashboardKeywordNewsGroupsQueryParams) {
  const keywordIds = keywords.map(keyword => keyword.id)

  return useQuery({
    queryKey: newsKeys.dashboardKeywordNewsGroups(keywordIds, size),
    queryFn: async (): Promise<KeywordNewsGroup[]> => {
      const newsResults = await Promise.all(
        keywords.map(async keyword => {
          const result = await getKeywordNewsByKeywordId({
            keywordId: keyword.id,
            page: 0,
            size,
          })

          if (result.success === false) {
            throw new Error(
              result.message ||
                `${keyword.name} 키워드 기반 뉴스를 불러오지 못했습니다.`
            )
          }

          return {
            keyword,
            items: extractKeywordNewsItems(
              result.data as KeywordNewsHistoryItem[] | KeywordNewsPageResponse
            ),
          }
        })
      )

      return mapHistoryItemsToGroups(keywords, newsResults)
    },
    enabled,
  })
}
