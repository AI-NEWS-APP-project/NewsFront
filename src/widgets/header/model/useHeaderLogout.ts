import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { disableStoredFcmToken } from '@features/alarm/lib/fcmTokenLifecycle'
import { getAuthErrorMessage, logout } from '@features/auth/api/auth'
import { useAuthStore } from '@features/auth/model/useAuthStore'

interface LogoutSessionParams {
  hasUser: boolean
  refreshToken: string | null
}

async function logoutSession({ hasUser, refreshToken }: LogoutSessionParams) {
  if (hasUser) {
    try {
      await disableStoredFcmToken()
    } catch (error) {
      console.error('FCM token 비활성화 실패:', error)
    }
  }

  if (!refreshToken) {
    return
  }

  await logout(refreshToken)
}

export function useHeaderLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore(state => state.user)
  const clearAuth = useAuthStore(state => state.clearAuth)

  const logoutMutation = useMutation({
    mutationFn: logoutSession,
    onError: error => {
      console.error(
        getAuthErrorMessage(error, '로그아웃 요청 중 문제가 발생했습니다.')
      )
    },
    onSettled: () => {
      clearAuth()
      queryClient.clear()
      navigate('/login')
    },
  })

  const handleLogout = () => {
    if (logoutMutation.isPending) {
      return
    }

    logoutMutation.mutate({
      hasUser: Boolean(user),
      refreshToken: localStorage.getItem('refreshToken'),
    })
  }

  return {
    handleLogout,
    isLoggingOut: logoutMutation.isPending,
  }
}
