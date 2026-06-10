export const newsKeys = {
  all: ['news'] as const,
  keywordNews: () => [...newsKeys.all, 'keyword-news'] as const,
  keywordNewsList: (
    selectedKeywordId: number | string,
    keywordIds: number[],
    size: number
  ) => [...newsKeys.keywordNews(), 'list', selectedKeywordId, keywordIds, size],
  dashboardKeywordNewsGroups: (keywordIds: number[], size: number) =>
    [...newsKeys.keywordNews(), 'dashboard-groups', keywordIds, size] as const,
  keywordNewsDetail: (id: number | string) =>
    [...newsKeys.keywordNews(), 'detail', id] as const,
  dailyBriefings: () => [...newsKeys.all, 'daily-briefings'] as const,
  latestDailyBriefing: () => [...newsKeys.dailyBriefings(), 'latest'] as const,
  dailyBriefingDetail: (id: number | string) =>
    [...newsKeys.dailyBriefings(), 'detail', id] as const,
}
