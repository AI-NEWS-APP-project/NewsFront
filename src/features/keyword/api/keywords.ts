import type { AxiosRequestConfig } from 'axios'
import axiosInstance from '@shared/lib/axiosInstance'

export interface ApiResponse<T = unknown> {
  success?: boolean
  message?: string
  data?: T
}

interface CreateKeywordsBulkParams {
  keywords: string[]
}

interface CreateKeywordParams {
  keyword: string
}

interface DeleteKeywordByIdParams {
  keywordId: number | string
}

export const getKeywords = async <T = unknown>(
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.get<ApiResponse<T>>('/keywords', config)

  return response.data
}

export const createKeyword = async <T = unknown>(
  params: CreateKeywordParams
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.post<ApiResponse<T>>('/keywords', '', {
    params: {
      keyword: params.keyword,
    },
  })

  return response.data
}

export const createKeywordsBulk = async <T = unknown>(
  params: CreateKeywordsBulkParams
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.post<ApiResponse<T>>(
    '/keywords/bulk',
    params.keywords
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
    `/keywords/${params.keywordId}`
  )

  return response.data
}
