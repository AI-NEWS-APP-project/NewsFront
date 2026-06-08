import { useState } from 'react'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import { useUserKeywordsQuery } from '@features/keyword/model/useKeywordQueries'
import { useKeywordNewsItemsQuery } from '@features/news/model/useKeywordNewsQueries'

export type NewsFeedViewMode = 'grid' | 'list'

export function useNewsFeed() {
  const user = useAuthStore(state => state.user)
  const [selectedKeywordId, setSelectedKeywordId] = useState<number | 'all'>(
    'all'
  )
  const [viewMode, setViewMode] = useState<NewsFeedViewMode>('grid')
  const userKeywordsQuery = useUserKeywordsQuery({
    enabled: Boolean(user),
    userId: user?.id,
  })
  const userKeywords = userKeywordsQuery.data ?? []
  const keywordNewsQuery = useKeywordNewsItemsQuery({
    enabled: Boolean(user) && userKeywords.length > 0,
    keywords: userKeywords,
    selectedKeywordId,
    size: 6,
  })
  const newsItems = keywordNewsQuery.data ?? []
  const isLoading = userKeywordsQuery.isLoading || keywordNewsQuery.isLoading
  const queryError = userKeywordsQuery.error ?? keywordNewsQuery.error
  const errorMessage = !user
    ? '사용자 정보를 찾을 수 없습니다.'
    : queryError instanceof Error
      ? queryError.message
      : ''
  const selectedKeywordName =
    selectedKeywordId === 'all'
      ? '전체'
      : (userKeywords.find(keyword => keyword.id === selectedKeywordId)?.name ??
        '')

  return {
    errorMessage,
    isLoading,
    newsItems,
    selectedKeywordId,
    selectedKeywordName,
    setSelectedKeywordId,
    setViewMode,
    userKeywords,
    viewMode,
  }
}
