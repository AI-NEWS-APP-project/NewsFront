import { useLatestDailyBriefingQuery } from '@features/news/model/useNewsDetailQueries'

export function useDashboardDailyBriefing() {
  const dailyBriefingQuery = useLatestDailyBriefingQuery()
  const errorMessage =
    dailyBriefingQuery.error instanceof Error
      ? dailyBriefingQuery.error.message
      : ''

  return {
    dailyBriefing: dailyBriefingQuery.data ?? null,
    errorMessage,
    isLoading: dailyBriefingQuery.isLoading,
  }
}
