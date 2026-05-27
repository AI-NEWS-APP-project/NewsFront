import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import ForegroundPushListener from '@features/alarm/components/ForegroundPushListener'
import { queryClient } from '@shared/lib/queryClient'

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ForegroundPushListener />
      {children}
    </QueryClientProvider>
  )
}
