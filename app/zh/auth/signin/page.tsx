'use client'

import { useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function SignInPage() {
  const router = useRouter()

  // 检查用户是否已登录
  useEffect(() => {
    async function checkSession() {
      const session = await getSession()
      if (session) {
        router.push('/zh')
      }
    }
    checkSession()
  }, [router])

  const handleGoogleSignIn = async () => {
    try {
      console.log('中文Google登录按钮被点击')
      const result = await signIn('google', {
        callbackUrl: '/zh',
        redirect: true
      })
      console.log('中文Google登录结果:', result)
    } catch (error) {
      console.error('Google登录错误:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-start justify-center pt-16 p-4">
      {/* 语言切换器 */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sybau Picture</h1>
          <p className="text-gray-600">使用 Google 账户登录，开始创建令人惊艳的 AI 内容</p>
        </div>

        {/* 登录卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              欢迎使用 Sybau Picture
            </h2>
            <p className="text-gray-600">
              使用 Google 账户登录，开始创建令人惊艳的 AI 内容
            </p>
          </div>

          {/* Google登录按钮 */}
          <Button
            onClick={handleGoogleSignIn}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
            variant="outline"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            使用 Google 继续
          </Button>

          {/* 功能特点 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-4 text-center">
              平台特色
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                AI 驱动的图像生成
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                高质量结果
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                简单易用的界面
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                安全且私密
              </div>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-6 text-sm text-gray-500">
          通过登录，您同意我们的服务条款和隐私政策
        </div>
      </div>
    </div>
  )
}
