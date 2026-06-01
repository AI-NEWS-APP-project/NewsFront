import type { AxiosRequestConfig } from 'axios'
import axiosInstance from '@shared/lib/axiosInstance'
import type { ApiResponse } from '@features/keyword/api/keywords'

export interface NotificationItem {
  id: number
  keywordNewsId?: number | null
  title?: string | null
  body?: string | null
  route?: string | null
  sentAt?: string | null
  readAt?: string | null
}

export interface NotificationPage {
  totalPages: number
  totalElements: number
  size: number
  content: NotificationItem[]
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
}

export interface UnreadNotificationCount {
  unreadCount: number
}

interface GetNotificationsParams {
  page?: number
  size?: number
}

export async function getNotifications(
  params: GetNotificationsParams = {},
  config?: AxiosRequestConfig
): Promise<ApiResponse<NotificationPage>> {
  const response = await axiosInstance.get<ApiResponse<NotificationPage>>(
    '/notifications',
    {
      ...config,
      params: {
        ...config?.params,
        page: params.page ?? 0,
        size: params.size ?? 20,
      },
    }
  )

  return response.data
}

export async function getUnreadNotificationCount(): Promise<
  ApiResponse<UnreadNotificationCount>
> {
  const response = await axiosInstance.get<
    ApiResponse<UnreadNotificationCount>
  >('/notifications/unread-count')

  return response.data
}

export async function markNotificationAsRead(
  notificationId: number | string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.patch<ApiResponse<null>>(
    `/notifications/${notificationId}/read`
  )

  return response.data
}

export async function deleteNotification(
  notificationId: number | string
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    `/notifications/${notificationId}`
  )

  return response.data
}

export async function markAllNotificationsAsRead(): Promise<ApiResponse<null>> {
  const response = await axiosInstance.patch<ApiResponse<null>>(
    '/notifications/read-all'
  )

  return response.data
}
