import axiosInstance from '@shared/lib/axiosInstance'
import type { User } from '@features/auth/model/useAuthStore'

export type SocialProvider = 'google' | 'kakao'

interface SocialLoginRequest {
  socialToken: string
  fcmToken?: string | null
}

interface SocialLoginResponseData {
  accessToken: string
  refreshToken: string
  user: User
}

export interface SocialLoginResponse {
  success: boolean
  message?: string
  data: SocialLoginResponseData
}

export const loginWithSocial = async (
  provider: SocialProvider,
  socialToken: string,
  fcmToken?: string | null
): Promise<SocialLoginResponse> => {
  const requestBody: SocialLoginRequest = {
    socialToken,
    fcmToken,
  }

  const response = await axiosInstance.post<SocialLoginResponse>(
    `/auth/social/${provider}`,
    requestBody
  )

  return response.data
}
