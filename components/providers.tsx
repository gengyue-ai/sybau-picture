'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // 5分钟重新获取会话
      refetchOnWindowFocus={true} // 窗口获得焦点时重新获取
    >
      {children}
    </SessionProvider>
  )
}
