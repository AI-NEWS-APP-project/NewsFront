import { Navigate, createBrowserRouter } from 'react-router-dom'
import { OnboardingRoute, RequireCompletedOnboarding } from '@app/router/guards'

export const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => {
      const { default: WelcomePage } = await import('@pages/WelcomePage')
      return { Component: WelcomePage }
    },
  },
  {
    path: '/onboarding',
    async lazy() {
      const { default: OnboardingPage } = await import('@pages/OnboardingPage')
      return {
        Component: () => (
          <OnboardingRoute>
            <OnboardingPage />
          </OnboardingRoute>
        ),
      }
    },
  },
  {
    path: '/login',
    lazy: async () => {
      const { default: LoginPage } = await import('@pages/LoginPage')
      return { Component: LoginPage }
    },
  },
  {
    path: '/signup',
    lazy: async () => {
      const { default: SignupPage } = await import('@pages/SignupPage')
      return { Component: SignupPage }
    },
  },
  {
    path: '/dashboard',
    async lazy() {
      const { default: DashboardPage } = await import('@pages/DashboardPage')
      return {
        Component: () => (
          <RequireCompletedOnboarding>
            <DashboardPage />
          </RequireCompletedOnboarding>
        ),
      }
    },
  },
  {
    path: '/setting',
    children: [
      {
        index: true,
        element: <Navigate to="/setting/alarm" replace />,
      },
      {
        path: 'keyword',
        lazy: async () => {
          const { default: KeywordPage } = await import('@pages/KeywordPage')
          return {
            Component: () => (
              <RequireCompletedOnboarding>
                <KeywordPage />
              </RequireCompletedOnboarding>
            ),
          }
        },
      },
      {
        path: 'alarm',
        lazy: async () => {
          const { default: AlarmPage } = await import('@pages/AlarmPage')
          return {
            Component: () => (
              <RequireCompletedOnboarding>
                <AlarmPage />
              </RequireCompletedOnboarding>
            ),
          }
        },
      },
    ],
  },
  {
    path: '/news',
    lazy: async () => {
      const { default: NewsListPage } = await import('@pages/NewsListPage')
      return {
        Component: () => (
          <RequireCompletedOnboarding>
            <NewsListPage />
          </RequireCompletedOnboarding>
        ),
      }
    },
  },
  {
    path: '/news/keyword-news/:id',
    lazy: async () => {
      const { default: NewsDetailPage } = await import('@pages/NewsDetailPage')
      return {
        Component: () => (
          <RequireCompletedOnboarding>
            <NewsDetailPage />
          </RequireCompletedOnboarding>
        ),
      }
    },
  },
  {
    path: '/news/daily-briefings/:id',
    lazy: async () => {
      const { default: DailyBriefingDetailPage } =
        await import('@pages/DailyBriefingDetailPage')
      return {
        Component: () => (
          <RequireCompletedOnboarding>
            <DailyBriefingDetailPage />
          </RequireCompletedOnboarding>
        ),
      }
    },
  },
])
