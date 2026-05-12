import type { ReactNode } from 'react'
import ForegroundPushListener from '@features/alarm/components/ForegroundPushListener'

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <>
      <ForegroundPushListener />
      {children}
    </>
  )
}
