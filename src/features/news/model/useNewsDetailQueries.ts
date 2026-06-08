import { useQuery } from '@tanstack/react-query'
import {
  getDailyBriefingDetail,
  getLatestDailyBriefing,
} from '@features/news/api/dailyBriefings'
import { getKeywordNewsDetailItem } from '@features/news/api/keywordNews'
import { newsKeys } from '@features/news/model/newsQueryKeys'

interface UseNewsDetailQueryParams {
  id?: number | string
}

export function useLatestDailyBriefingQuery() {
  return useQuery({
    queryKey: newsKeys.latestDailyBriefing(),
    queryFn: async () => getLatestDailyBriefing(),
  })
}

export function useKeywordNewsDetailQuery({ id }: UseNewsDetailQueryParams) {
  return useQuery({
    queryKey: newsKeys.keywordNewsDetail(id ?? 'missing'),
    queryFn: async () => {
      if (!id) {
        throw new Error('뉴스 상세 ID가 올바르지 않습니다.')
      }

      const result = await getKeywordNewsDetailItem(id)

      if (result.success === false || !result.data) {
        throw new Error(
          result.message || '뉴스 상세 정보를 불러오지 못했습니다.'
        )
      }

      return result.data
    },
    enabled: id !== undefined,
  })
}

export function useDailyBriefingDetailQuery({ id }: UseNewsDetailQueryParams) {
  return useQuery({
    queryKey: newsKeys.dailyBriefingDetail(id ?? 'missing'),
    queryFn: async () => {
      if (!id) {
        throw new Error('브리핑 ID가 올바르지 않습니다.')
      }

      const result = await getDailyBriefingDetail(id)

      if (!result) {
        throw new Error('일일 브리핑 상세를 불러오지 못했습니다.')
      }

      return result
    },
    enabled: id !== undefined,
  })
}
