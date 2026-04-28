import axios, { AxiosError } from 'axios'
import axiosInstance from '@shared/lib/axiosInstance'
import type { User } from '@features/auth/model/useAuthStore'

interface LoginRequest {
  email: string
  password: string
  fcmToken: string
}

interface LogoutRequest {
  refreshToken: string
}

interface AuthResponseData {
  accessToken: string
  refreshToken: string
  user: User
}

interface AuthResponse {
  success?: boolean
  message?: string
  data: AuthResponseData
}

export const login = async (
  requestBody: LoginRequest
): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    '/auth/login',
    requestBody
  )

  return response.data
}

export const logout = async (refreshToken: string) => {
  const requestBody: LogoutRequest = { refreshToken }
  await axiosInstance.post('/auth/logout', requestBody)
}

export const getAuthErrorMessage = (
  error: unknown,
  fallbackMessage: string
) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>
    return axiosError.response?.data?.message ?? fallbackMessage
  }

  return fallbackMessage
}
