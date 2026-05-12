import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import type { AuthResponse } from '@features/auth/api/auth'

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const apiBaseURL = import.meta.env.DEV
  ? '/api/v1'
  : import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

const axiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const refreshClient = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise: Promise<string> | null = null

function isAuthEndpoint(url?: string) {
  if (!url) {
    return false
  }

  return url.includes('/auth/')
}

function redirectToLogin() {
  if (window.location.pathname === '/login') {
    return
  }

  const redirectPath = `${window.location.pathname}${window.location.search}`
  const searchParams = new URLSearchParams()

  if (redirectPath && redirectPath !== '/') {
    searchParams.set('redirect', redirectPath)
  }
  searchParams.set('reason', 'session-expired')

  window.location.href = searchParams.size
    ? `/login?${searchParams.toString()}`
    : '/login'
}

function expireSession() {
  useAuthStore.getState().clearAuth()
  redirectToLogin()
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken')

  if (!refreshToken) {
    throw new Error('Refresh token이 없습니다.')
  }

  const response = await refreshClient.post<AuthResponse>('/auth/refresh', {
    refreshToken,
  })

  if (response.data.success === false || !response.data.data?.accessToken) {
    throw new Error(response.data.message || '토큰 재발급에 실패했습니다.')
  }

  const {
    accessToken,
    refreshToken: nextRefreshToken,
    user,
  } = response.data.data

  const authStore = useAuthStore.getState()

  if (user) {
    authStore.setAuth(user, accessToken, nextRefreshToken)
  } else {
    authStore.updateTokens(accessToken, nextRefreshToken)
  }

  return accessToken
}

/**
 * request 인터셉터
 */

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * response 인터셉터
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }

      const accessToken = await refreshPromise
      originalRequest.headers.Authorization = `Bearer ${accessToken}`

      return axiosInstance(originalRequest)
    } catch (refreshError) {
      expireSession()
      return Promise.reject(refreshError)
    }
  }
)

export default axiosInstance
