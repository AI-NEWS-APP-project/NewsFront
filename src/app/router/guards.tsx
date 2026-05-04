import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { hasCompletedOnboarding } from '@features/onboarding/model/onboardingStatus'
import { useAuthStore } from '@features/auth/model/useAuthStore'

function useOnboardingRedirectPath() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const user = useAuthStore(state => state.user)

  if (!isAuthenticated || !user) {
    return null
  }

  const onboardingCompleted = hasCompletedOnboarding(user.id)

  return onboardingCompleted ? '/dashboard' : '/onboarding'
}

export function RequireCompletedOnboarding({
  children,
}: {
  children: ReactNode
}) {
  const redirectPath = useOnboardingRedirectPath()

  if (redirectPath === '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

export function OnboardingRoute({ children }: { children: ReactNode }) {
  const redirectPath = useOnboardingRedirectPath()

  if (redirectPath) {
    if (redirectPath === '/dashboard') {
      return <Navigate to="/dashboard" replace />
    }

    return children
  }

  return children
}
