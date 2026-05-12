import type { AxiosRequestConfig } from 'axios'
import axiosInstance from '@shared/lib/axiosInstance'
import type { ApiResponse } from '@features/keyword/api/keywords'
import type {
  KeywordNewsDetail,
  KeywordNewsHistoryItem,
  LatestKeywordNewsSummary,
} from '@features/news/model/types'

interface GetKeywordNewsByKeywordIdParams {
  keywordId: number | string
  page?: number
  size?: number
}

export const getKeywordNewsHistory = async <T = unknown>(
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.get<ApiResponse<T>>(
    '/news/keyword-news',
    config
  )

  return response.data
}

export const getKeywordNewsDetail = async <T = unknown>(
  id: number | string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.get<ApiResponse<T>>(
    `/news/keyword-news/${id}`,
    config
  )

  return response.data
}

export const getKeywordNewsDetailItem = async (
  id: number | string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<KeywordNewsDetail>> => {
  const response = await axiosInstance.get<ApiResponse<KeywordNewsDetail>>(
    `/news/keyword-news/${id}`,
    config
  )

  return response.data
}

export const getLatestKeywordNews = async <T = unknown>(
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await axiosInstance.get<ApiResponse<T>>(
    '/news/keyword-news/latest',
    config
  )

  return response.data
}

export const getLatestKeywordNewsSummaries = async (
  config?: AxiosRequestConfig
): Promise<ApiResponse<LatestKeywordNewsSummary[]>> => {
  const response = await axiosInstance.get<
    ApiResponse<LatestKeywordNewsSummary[]>
  >('/news/keyword-news/latest', config)

  return response.data
}

export const getKeywordNewsHistoryItems = async (
  config?: AxiosRequestConfig
): Promise<ApiResponse<KeywordNewsHistoryItem[]>> => {
  const response = await axiosInstance.get<
    ApiResponse<KeywordNewsHistoryItem[]>
  >('/news/keyword-news', config)

  return response.data
}

export const getKeywordNewsByKeywordId = async (
  params: GetKeywordNewsByKeywordIdParams,
  config?: AxiosRequestConfig
): Promise<ApiResponse<KeywordNewsHistoryItem[]>> => {
  const response = await axiosInstance.get<
    ApiResponse<KeywordNewsHistoryItem[]>
  >('/news/keyword-news', {
    ...config,
    params: {
      ...config?.params,
      keywordId: params.keywordId,
      page: params.page ?? 0,
      size: params.size ?? 6,
    },
  })

  return response.data
}
