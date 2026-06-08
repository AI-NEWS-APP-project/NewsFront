import { useQuery } from '@tanstack/react-query'
import { getKeywords, getPopularKeywords } from '@features/keyword/api/keywords'
import {
  normalizeKeywords,
  type KeywordResponseItem,
} from '@features/keyword/lib/normalizeKeywords'
import { keywordKeys } from '@features/keyword/model/keywordQueryKeys'

interface UseUserKeywordsQueryParams {
  enabled: boolean
  userId?: number | string
}

export function useUserKeywordsQuery({
  enabled,
  userId,
}: UseUserKeywordsQueryParams) {
  return useQuery({
    queryKey: keywordKeys.list(userId ?? 'anonymous'),
    queryFn: async () => {
      const result = await getKeywords<KeywordResponseItem[]>()

      if (result.success === false) {
        throw new Error(result.message || '현재 키워드를 불러오지 못했습니다.')
      }

      return normalizeKeywords(result.data)
    },
    enabled: enabled && userId !== undefined,
  })
}

export function usePopularKeywordsQuery() {
  return useQuery({
    queryKey: keywordKeys.popular(),
    queryFn: async () => {
      const result = await getPopularKeywords<string[]>()

      if (result.success === false) {
        throw new Error(result.message || '추천 키워드를 불러오지 못했습니다.')
      }

      return Array.isArray(result.data) ? result.data : []
    },
  })
}
