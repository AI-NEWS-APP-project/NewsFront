import { createBrowserRouter } from 'react-router-dom'

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
    lazy: async () => {
      const { default: OnboardingPage } = await import('@pages/OnboardingPage')
      return { Component: OnboardingPage }
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
    lazy: async () => {
      const { default: DashboardPage } = await import('@pages/DashboardPage')
      return { Component: DashboardPage }
    },
  },
  {
    path: '/keyword',
    lazy: async () => {
      const { default: KeywordPage } = await import('@pages/KeywordPage')
      return { Component: KeywordPage }
    },
  },
  {
    path: '/alarm',
    lazy: async () => {
      const { default: AlarmPage } = await import('@pages/AlarmPage')
      return { Component: AlarmPage }
    },
  },
  {
    path: '/news',
    lazy: async () => {
      const { default: NewsListPage } = await import('@pages/NewsListPage')
      return { Component: NewsListPage }
    },
  },
])
