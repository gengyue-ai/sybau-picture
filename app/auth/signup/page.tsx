'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Mail, Lock, User, Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// 翻译文本对象
const texts = {
  zh: {
    title: '注册账户',
    subtitle: '加入成千上万的创作者，用AI制作病毒式模因图',
    pageTitle: '注册账户',
    nameLabel: '姓名',
    namePlaceholder: '请输入您的姓名',
    emailLabel: '邮箱',
    emailPlaceholder: '请输入您的邮箱地址',
    passwordLabel: '密码',
    passwordPlaceholder: '请输入密码（至少8位）',
    confirmPasswordLabel: '确认密码',
    confirmPasswordPlaceholder: '请再次输入密码',
    agreeTerms: '我同意',
    termsLink: '服务条款',
    privacyLink: '隐私政策',
    signUpButton: '注册账户',
    signingUp: '注册中...',
    googleSignUp: '使用Google账户注册',
    orDivider: '或使用邮箱注册',
    alreadyHaveAccount: '已有账户？',
    signInLink: '立即登录',
    passwordStrength: {
      weak: '弱',
      medium: '中等',
      strong: '强'
    },
    errors: {
      nameRequired: '请输入姓名',
      emailRequired: '请输入邮箱地址',
      emailInvalid: '请输入有效的邮箱地址',
      passwordTooShort: '密码至少需要8位字符',
      passwordMismatch: '两次输入的密码不一致',
      agreeTermsRequired: '请同意服务条款和隐私政策',
      signUpFailed: '注册失败，请重试',
      googleSignUpFailed: '使用Google注册失败'
    }
  },
  en: {
    title: 'Create your account',
    subtitle: 'Join thousands of creators making viral memes with AI',
    pageTitle: 'Sign Up',
    nameLabel: 'Name',
    namePlaceholder: 'Enter your full name',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email address',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password (min 8 characters)',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Confirm your password',
    agreeTerms: 'I agree to the',
    termsLink: 'Terms of Service',
    privacyLink: 'Privacy Policy',
    signUpButton: 'Create Account',
    signingUp: 'Creating account...',
    googleSignUp: 'Continue with Google',
    orDivider: 'Or continue with email',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign in',
    passwordStrength: {
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong'
    },
    errors: {
      nameRequired: 'Name is required',
      emailRequired: 'Email is required',
      emailInvalid: 'Please enter a valid email address',
      passwordTooShort: 'Password must be at least 8 characters long',
      passwordMismatch: 'Passwords do not match',
      agreeTermsRequired: 'Please agree to the Terms of Service and Privacy Policy',
      signUpFailed: 'Something went wrong',
      googleSignUpFailed: 'Failed to sign up with Google'
    }
  }
}

// 获取当前语言
function getCurrentLanguage(pathname: string): 'zh' | 'en' {
  if (pathname.startsWith('/zh')) return 'zh'
  return 'en'
}

export default function SignUpPage() {
  const pathname = usePathname()
  const language = getCurrentLanguage(pathname)
  const t = texts[language]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const router = useRouter()

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // 计算密码强度
    if (field === 'password') {
      let strength = 0
      if (value.length >= 8) strength++
      if (/[A-Z]/.test(value)) strength++
      if (/[a-z]/.test(value)) strength++
      if (/[0-9]/.test(value)) strength++
      if (/[^A-Za-z0-9]/.test(value)) strength++
      setPasswordStrength(strength)
    }
  }

    const validateForm = () => {
    if (!formData.name.trim()) {
      setError(t.errors.nameRequired)
      return false
    }

    if (!formData.email) {
      setError(t.errors.emailRequired)
      return false
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError(t.errors.emailInvalid)
      return false
    }

    if (formData.password.length < 8) {
      setError(t.errors.passwordTooShort)
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.errors.passwordMismatch)
      return false
    }

    if (!agreeToTerms) {
      setError(t.errors.agreeTermsRequired)
      return false
    }

    return true
  }

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setIsLoading(true)

    try {
      // 创建账户
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
      }

      // 自动登录
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Account created but failed to sign in. Please try signing in manually.')
      } else {
        router.push('/generator')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : t.errors.signUpFailed)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/generator' })
    } catch (error) {
      setError(t.errors.googleSignUpFailed)
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500'
    if (passwordStrength <= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return t.passwordStrength.weak
    if (passwordStrength <= 3) return t.passwordStrength.medium
    return t.passwordStrength.strong
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group hover:opacity-80 transition-opacity">
            <div className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4 text-gray-500" />
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Sybau Picture</span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              {t.pageTitle}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newPath = language === 'zh' ? '/auth/signup' : '/zh/auth/signup'
                router.push(newPath)
              }}
            >
              {language === 'zh' ? 'English' : '中文'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t.title}</CardTitle>
            <CardDescription>
              {t.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Google Sign Up */}
            <Button
              variant="outline"
              className="w-full h-12"
              onClick={handleGoogleSignUp}
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
{t.googleSignUp}
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

            {/* Email Sign Up Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.nameLabel}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{language === 'zh' ? '密码强度:' : 'Password strength:'}</span>
                      <span className={cn(
                        "font-medium",
                        passwordStrength <= 2 ? "text-red-500" :
                        passwordStrength <= 3 ? "text-yellow-500" : "text-green-500"
                      )}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-300",
                          getPasswordStrengthColor()
                        )}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.confirmPasswordLabel}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t.confirmPasswordPlaceholder}
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    className="pl-10"
                    required
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <div className="text-sm leading-5">
                  <Label htmlFor="terms" className="cursor-pointer">
                    {t.agreeTerms}{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      {t.termsLink}
                    </Link>{' '}
                    {language === 'zh' ? '和' : 'and'}{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      {t.privacyLink}
                    </Link>
                  </Label>
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
                disabled={isLoading || !agreeToTerms}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.signingUp}
                  </>
                ) : (
                  t.signUpButton
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">{t.alreadyHaveAccount} </span>
              <Link
                href={language === 'zh' ? '/zh/auth/signin' : '/auth/signin'}
                className="font-medium text-primary hover:underline"
              >
                {t.signInLink}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
