import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.DEV
    ? '/api'
    : import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // 401 에러 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // TODO: Refresh Token 로직 구현
      // const refreshToken = localStorage.getItem('refreshToken')
      // if (refreshToken) {
      //   try {
      //     const response = await axios.post('/auth/refresh', {
      //       refreshToken,
      //     })
      //     const { accessToken } = response.data
      //     localStorage.setItem('accessToken', accessToken)
      //     originalRequest.headers.Authorization = `Bearer ${accessToken}`
      //     return axiosInstance(originalRequest)
      //   } catch (refreshError) {
      //     // Refresh token 만료
      //     localStorage.removeItem('accessToken')
      //     localStorage.removeItem('refreshToken')
      //     window.location.href = '/login'
      //     return Promise.reject(refreshError)
      //   }
      // }

      // Refresh token 로직 미구현 시 로그인 페이지로 이동
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
