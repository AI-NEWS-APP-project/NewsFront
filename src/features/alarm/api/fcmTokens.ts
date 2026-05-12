import axiosInstance from '@shared/lib/axiosInstance'
import type { ApiResponse } from '@features/keyword/api/keywords'

interface FcmTokenParams {
  token: string
}

interface TestPushParams {
  userId: number | string
  title: string
  body: string
}

export async function registerFcmToken(
  params: FcmTokenParams
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.post<ApiResponse<null>>(
    '/notifications/fcm-token',
    { token: params.token }
  )

  return response.data
}

export async function disableFcmToken(
  params: FcmTokenParams
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.delete<ApiResponse<null>>(
    '/notifications/fcm-token',
    {
      data: { token: params.token },
    }
  )

  return response.data
}

export async function sendTestPush(
  params: TestPushParams
): Promise<ApiResponse<null>> {
  const response = await axiosInstance.post<ApiResponse<null>>(
    '/notifications/test-push',
    params
  )

  return response.data
}
