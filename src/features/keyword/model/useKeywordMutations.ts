import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createKeyword,
  deleteKeywordById,
} from '@features/keyword/api/keywords'
import { keywordKeys } from '@features/keyword/model/keywordQueryKeys'

export function useCreateKeywordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (keyword: string) => {
      const result = await createKeyword({ keyword })

      if (result.success === false) {
        throw new Error(result.message || '키워드 추가 중 문제가 발생했습니다.')
      }

      return result
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: keywordKeys.lists() })
    },
  })
}

export function useDeleteKeywordMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (keywordId: number | string) => {
      const result = await deleteKeywordById({ keywordId })

      if (result.success === false) {
        throw new Error(result.message || '키워드 삭제 중 문제가 발생했습니다.')
      }

      return result
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: keywordKeys.lists() })
    },
  })
}
