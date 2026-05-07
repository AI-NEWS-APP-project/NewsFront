import type { AxiosRequestConfig } from 'axios'
import axiosInstance from '@shared/lib/axiosInstance'

export interface ApiResponse<T = unknown> {
  success?: boolean
  message?: string
  data?: T
}

interface CreateKeywordsBulkParams {
  userId: number | string
  keywords: string[]
}

interface GetKeywordsParams {
  userId: number | string
}

interface CreateKeywordParams {
  userId: number | string
  keyword: string
}

interface DeleteKeywordByIdParams {
  userId: number | string
  keywordId: number | string
}

export const getKeywords = async <T = unknown>(
  params: GetKeywordsParams,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.get<ApiResponse<T>>('/keywords', {
    ...config,
    params: {
      ...config?.params,
      userId: params.userId,
    },
  })

  return response.data
}

// export const createKeyword = async <T = unknown>(
//   params: CreateKeywordParams
// ): Promise<ApiResponse<T>> => {
//   const response = await axiosInstance.post<ApiResponse<T>>(
//     '/keywords',
//     params.keyword,
//     {
//       params: {
//         userId: params.userId,
//       },
//     }
//   )

//   return response.data
// }
export const createKeyword = async <T = unknown>(
  params: CreateKeywordParams
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.post<ApiResponse<T>>('/keywords', '', {
    params: {
      userId: params.userId,
      keyword: params.keyword,
    },
  })

  return response.data
}

// export const deleteKeywords = async <T = unknown>(
//   requestBody?: unknown
// ): Promise<ApiResponse<T>> => {
//   const response = await axiosInstance.delete<ApiResponse<T>>('/keywords', {
//     data: requestBody,
//   })

//   return response.data
// }

export const createKeywordsBulk = async <T = unknown>(
  params: CreateKeywordsBulkParams
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.post<ApiResponse<T>>(
    '/keywords/bulk',
    params.keywords,
    {
      params: {
        userId: params.userId,
      },
    }
  )

  return response.data
}

export const getPopularKeywords = async <T = unknown>(
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.get<ApiResponse<T>>(
    '/keywords/popular',
    config
  )

  return response.data
}

export const deleteKeywordById = async <T = unknown>(
  params: DeleteKeywordByIdParams
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.delete<ApiResponse<T>>(
    `/keywords/${params.keywordId}`,
    {
      params: {
        userId: params.userId,
      },
    }
  )

  return response.data
}
