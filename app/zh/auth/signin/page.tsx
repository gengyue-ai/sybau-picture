'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react'

// 中文翻译文本
const t = {
  title: '登录账户',
  subtitle: '欢迎回来！请登录您的账户继续创作',
  pageTitle: '登录',
  emailLabel: '邮箱',
  emailPlaceholder: '请输入您的邮箱地址',
  passwordLabel: '密码',
  passwordPlaceholder: '请输入您的密码',
  signInButton: '登录',
  signingIn: '登录中...',
  googleSignIn: '使用Google账户登录',
  orDivider: '或使用邮箱登录',
  forgotPassword: '忘记密码？',
  noAccount: '还没有账户？',
  signUpLink: '立即注册',
  errors: {
    emailRequired: '请输入邮箱地址',
    emailInvalid: '请输入有效的邮箱地址',
    passwordRequired: '请输入密码',
    signInFailed: '登录失败，请检查您的邮箱和密码',
    googleSignInFailed: '使用Google登录失败'
  }
}

export default function ZhSignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.email) {
      setError(t.errors.emailRequired)
      return false
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError(t.errors.emailInvalid)
      return false
    }

    if (!formData.password) {
      setError(t.errors.passwordRequired)
      return false
    }

    return true
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError(t.errors.signInFailed)
      } else {
        // 强制刷新会话状态
        window.location.href = '/zh'
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError(t.errors.signInFailed)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/zh' })
    } catch (error) {
      console.error('Google sign in error:', error)
      setError(t.errors.googleSignInFailed)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 简洁的头部 - 不包含重复的导航 */}
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/zh" className="flex items-center space-x-2 group hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">返回首页</span>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/auth/signin')}
          >
            English
          </Button>
        </div>

        {/* 主要内容 */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t.title}</CardTitle>
              <CardDescription>
                {t.subtitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google登录 */}
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                )}
                {t.googleSignIn}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t.orDivider}
                  </span>
                </div>
              </div>

              {/* 邮箱登录表单 */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.emailLabel}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.emailPlaceholder}
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t.passwordLabel}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder={t.passwordPlaceholder}
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.signingIn}
                    </>
                  ) : (
                    t.signInButton
                  )}
                </Button>
              </form>

              {/* 忘记密码链接 */}
              <div className="text-center">
                <Link
                  href="/zh/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  {t.forgotPassword}
                </Link>
              </div>

              {/* 注册链接 */}
              <div className="text-center text-sm">
                <span className="text-muted-foreground">{t.noAccount} </span>
                <Link
                  href="/zh/auth/signup"
                  className="font-medium text-primary hover:underline"
                >
                  {t.signUpLink}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
