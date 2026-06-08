import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { hasCompletedOnboarding } from '@features/onboarding/model/onboardingStatus'
import { useAuthStore } from '@features/auth/model/useAuthStore'
import AuthRequiredModal from '@shared/components/AuthRequiredModal'
import Header from '@widgets/header/ui/Header'

function buildAuthPath(
  targetPath: '/login' | '/signup',
  pathname: string,
  search: string
) {
  const currentPath = `${pathname}${search}`

  if (!currentPath || currentPath === '/') {
    return targetPath
  }

  const searchParams = new URLSearchParams({
    redirect: currentPath,
  })

  return `${targetPath}?${searchParams.toString()}`
}

function AuthRequiredRoutePrompt() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#F8FBFD] font-sans">
      <Header />
      <main className="min-h-[calc(100svh-70px)]" aria-hidden="true" />
      <AuthRequiredModal
        loginTo={buildAuthPath('/login', location.pathname, location.search)}
        signupTo={buildAuthPath('/signup', location.pathname, location.search)}
      />
    </div>
  )
}

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
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const user = useAuthStore(state => state.user)
  const redirectPath = useOnboardingRedirectPath()

  if (!isAuthenticated || !user) {
    return <AuthRequiredRoutePrompt />
  }

  if (redirectPath === '/onboarding') {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

export function OnboardingRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const user = useAuthStore(state => state.user)
  const redirectPath = useOnboardingRedirectPath()

  if (!isAuthenticated || !user) {
    return <AuthRequiredRoutePrompt />
  }

  if (redirectPath) {
    if (redirectPath === '/dashboard') {
      return <Navigate to="/dashboard" replace />
    }

    return children
  }

  return children
}
