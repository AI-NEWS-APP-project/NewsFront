import axios, { AxiosError } from 'axios'
import axiosInstance from '@shared/lib/axiosInstance'

interface SignupRequest {
  email: string
  password: string
}

interface SignupResponse {
  success?: boolean
  message?: string
}

export const signup = async (
  requestBody: SignupRequest
): Promise<SignupResponse> => {
  const response = await axiosInstance.post<SignupResponse>(
    '/auth/signup',
    requestBody
  )

  return response.data
}

export const getSignupErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>
    return (
      axiosError.response?.data?.message ??
      '회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.'
    )
  }

  return '회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.'
}
