'use client'

import { signIn, getProviders, getCsrfToken } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles, Mail, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null)
  const [csrfToken, setCsrfToken] = useState('')
  const [testEmail, setTestEmail] = useState('test@example.com')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isMockMode, setIsMockMode] = useState(false)

  useEffect(() => {
    const getAuthData = async () => {
      const [providersRes, csrfRes] = await Promise.all([
        getProviders(),
        getCsrfToken()
      ])
      setProviders(providersRes)
      setCsrfToken(csrfRes || '')

      // 检查是否有mock-google provider来判断是否为模拟模式
      const hasMockProvider = providersRes && Object.values(providersRes).some((p: any) => p.id === 'mock-google')
      setIsMockMode(!!hasMockProvider)
    }
    getAuthData()
  }, [])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError('')
    try {
      await signIn('google', {
        callbackUrl: '/',
        redirect: true
      })
    } catch (error) {
      console.error('Google登录错误:', error)
      setError('Google登录暂时不可用，请使用测试登录')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMockLogin = async () => {
    if (!testEmail) {
      setError('请输入邮箱地址')
      return
    }

    setIsLoading(true)
    setError('')
    try {
      // 使用NextAuth的模拟认证
      const result = await signIn('mock-google', {
        email: testEmail,
        callbackUrl: '/',
        redirect: true
      })

      if (result?.error) {
        setError('登录失败，请重试')
      }
    } catch (error) {
      console.error('模拟登录错误:', error)
      setError('登录失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Sybau Picture</CardTitle>
          <CardDescription>
            {isMockMode
              ? "模拟模式 - 输入任意邮箱地址即可登录"
              : "Sign in with Google to start creating amazing AI-powered content"
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* 模拟模式显示邮箱输入 */}
          {isMockMode ? (
            <div className="space-y-3">
              <div>
                <Label htmlFor="test-email">邮箱地址</Label>
                <Input
                  id="test-email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="输入任意邮箱地址"
                />
              </div>

              <Button
                onClick={handleMockLogin}
                disabled={isLoading || !testEmail}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                {isLoading ? '登录中...' : '模拟登录'}
              </Button>

              <div className="text-xs text-center text-muted-foreground">
                🎭 当前为模拟模式，无需真实的Google账户
              </div>
            </div>
          ) : (
            /* 生产模式显示Google登录 */
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>
          )}

          {/* 平台特性 */}
          <div className="pt-6 border-t">
            <h3 className="text-sm font-medium mb-3">Platform Features</h3>
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI-Powered Image Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>High-Quality Results</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Easy to Use Interface</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>Secure & Private</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-foreground">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
