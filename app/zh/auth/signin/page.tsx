'use client'

import { redirect } from 'next/navigation'
import SignInPage from '@/app/auth/signin/page'

// 中文登录页面重定向到通用登录组件
export default function ZhSignInPage() {
  return <SignInPage />
}
