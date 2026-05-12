import type { AxiosRequestConfig } from 'axios'
import axiosInstance from '@shared/lib/axiosInstance'
import type { ApiResponse } from '@features/keyword/api/keywords'
import type {
  DailyBriefingDetail,
  DailyBriefingSummary,
} from '@features/news/model/types'

function unwrapApiData<T>(response: ApiResponse<T> | T): T {
  if (
    response &&
    typeof response === 'object' &&
    'data' in response &&
    ('success' in response || 'message' in response)
  ) {
    return (response as ApiResponse<T>).data as T
  }

  return response as T
}

export async function getLatestDailyBriefing(
  config?: AxiosRequestConfig
): Promise<DailyBriefingSummary | null> {
  const response = await axiosInstance.get<
    ApiResponse<DailyBriefingSummary> | DailyBriefingSummary
  >('/news/daily-briefings', config)

  return unwrapApiData(response.data) ?? null
}

export async function getDailyBriefingDetail(
  id: number | string,
  config?: AxiosRequestConfig
): Promise<DailyBriefingDetail | null> {
  const response = await axiosInstance.get<
    ApiResponse<DailyBriefingDetail> | DailyBriefingDetail
  >(`/news/daily-briefings/${id}`, config)

  return unwrapApiData(response.data) ?? null
}
