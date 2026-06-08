import { useState } from 'react'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import { useUserKeywordsQuery } from '@features/keyword/model/useKeywordQueries'
import { useDashboardKeywordNewsGroupsQuery } from '@features/news/model/useKeywordNewsQueries'

export function useDashboardKeywordNews() {
  const user = useAuthStore(state => state.user)
  const [currentPage, setCurrentPage] = useState(0)
  const userKeywordsQuery = useUserKeywordsQuery({
    enabled: Boolean(user),
    userId: user?.id,
  })
  const userKeywords = userKeywordsQuery.data ?? []
  const keywordGroupsQuery = useDashboardKeywordNewsGroupsQuery({
    enabled: Boolean(user) && userKeywords.length > 0,
    keywords: userKeywords,
    size: 3,
  })
  const keywordGroups = keywordGroupsQuery.data ?? []
  const isLoading = userKeywordsQuery.isLoading || keywordGroupsQuery.isLoading
  const queryError = userKeywordsQuery.error ?? keywordGroupsQuery.error
  const errorMessage = !user
    ? '사용자 정보를 찾을 수 없습니다.'
    : queryError instanceof Error
      ? queryError.message
      : ''
  const itemsPerPage = 2
  const totalPages = Math.max(1, Math.ceil(keywordGroups.length / itemsPerPage))
  const activePage = Math.min(currentPage, totalPages - 1)
  const currentItems = keywordGroups.slice(
    activePage * itemsPerPage,
    (activePage + 1) * itemsPerPage
  )

  const goToPrevPage = () => {
    if (activePage > 0) {
      setCurrentPage(activePage - 1)
    }
  }

  const goToNextPage = () => {
    if (activePage < totalPages - 1) {
      setCurrentPage(activePage + 1)
    }
  }

  return {
    activePage,
    currentItems,
    errorMessage,
    goToNextPage,
    goToPrevPage,
    isLoading,
    setCurrentPage,
    totalPages,
  }
}
