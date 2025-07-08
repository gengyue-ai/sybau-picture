'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Menu, X, User, LogOut, Settings, CreditCard, History, Sparkles, UserCircle } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

const texts = {
  en: {
    home: 'Home',
    gallery: 'Gallery',
    pricing: 'Pricing',
    help: 'Help',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    profile: 'Profile',
    settings: 'Settings',
    billing: 'Billing',
    history: 'History',
    support: 'Support',
    menu: 'Menu',
    close: 'Close',
    account: 'Account',
    signingOut: 'Signing out...',
    freeUser: 'Free User',
    proUser: 'Pro User',
    premiumUser: 'Premium User'
  },
  zh: {
    home: '首页',
    gallery: '画廊',
    pricing: '定价',
    help: '帮助',
    signIn: '登录',
    signOut: '登出',
    profile: '个人资料',
    settings: '设置',
    billing: '账单',
    history: '历史记录',
    support: '支持',
    menu: '菜单',
    close: '关闭',
    account: '账户',
    signingOut: '登出中...',
    freeUser: '免费用户',
    proUser: '专业用户',
    premiumUser: '高级用户'
  }
}

// 获取用户名首字母
const getUserInitials = (name: string | null | undefined, email: string): string => {
  if (name && name.trim()) {
    return name.trim().split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }
  return email.charAt(0).toUpperCase()
}

// 获取用户计划标签
const getPlanBadge = (planName: string | null | undefined, language: 'en' | 'zh') => {
  const t = texts[language]
  switch (planName?.toLowerCase()) {
    case 'pro':
      return { label: t.proUser, variant: 'default' as const }
    case 'premium':
      return { label: t.premiumUser, variant: 'default' as const }
    default:
      return { label: t.freeUser, variant: 'secondary' as const }
  }
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const currentLang = pathname.startsWith('/zh') ? 'zh' : 'en'
  const t = texts[currentLang]

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut({
        redirect: false,
        callbackUrl: '/'
      })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('登出错误:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  const handleLanguageToggle = () => {
    console.log('语言切换被点击，当前路径:', pathname)
    const newLang = currentLang === 'zh' ? 'en' : 'zh'

    // 更精确的路径处理
    let currentPath = pathname
    if (currentPath.startsWith('/zh/')) {
      currentPath = currentPath.substring(3) // 移除 '/zh'
    } else if (currentPath === '/zh') {
      currentPath = '/'
    }

    // 生成新路径
    let newPath
    if (newLang === 'zh') {
      newPath = currentPath === '/' ? '/zh' : `/zh${currentPath}`
    } else {
      newPath = currentPath === '/' ? '/' : currentPath
    }

    console.log('新语言:', newLang, '新路径:', newPath)
    router.push(newPath)
  }

  const getNavLink = (path: string) => {
    return currentLang === 'zh' ? `/zh${path}` : path
  }

  const navItems = [
    { href: getNavLink('/'), label: t.home },
    { href: getNavLink('/gallery'), label: t.gallery },
    { href: getNavLink('/pricing'), label: t.pricing },
    { href: getNavLink('/help'), label: t.help },
  ]

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={getNavLink('/')} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Sybau Picture</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLanguageToggle}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {currentLang === 'zh' ? 'EN' : '中文'}
            </Button>

            {/* User Authentication */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border-0 hover:bg-transparent">
                    <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || session.user.email || 'User'}
                          className="h-full w-full object-cover"
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                          {getUserInitials(session.user.name, session.user.email || '')}
                        </div>
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72" align="end" forceMount>
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-200">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || session.user.email || 'User'}
                          className="h-full w-full object-cover"
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <div className="h-full w-full rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-lg">
                          {getUserInitials(session.user.name, session.user.email || '')}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {session.user.name || session.user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session.user.email}
                      </p>
                      <div className="mt-1">
                        <Badge
                          variant={getPlanBadge((session.user as any)?.planName, currentLang).variant}
                          className="text-xs"
                        >
                          {getPlanBadge((session.user as any)?.planName, currentLang).label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuSeparator />

                  {/* Account Actions */}
                  <DropdownMenuItem asChild>
                    <Link href={getNavLink('/profile')} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      {t.profile}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={getNavLink('/history')} className="flex items-center">
                      <History className="mr-2 h-4 w-4" />
                      {t.history}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={getNavLink('/pricing')} className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      {t.billing}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href={getNavLink('/support')} className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      {t.support}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Sign Out */}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isSigningOut ? t.signingOut : t.signOut}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  console.log('登录按钮被点击')
                  // 直接跳转到Google OAuth登录
                  window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(getNavLink('/'))}`
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 flex items-center space-x-2"
              >
                <UserCircle className="h-4 w-4" />
                <span>{t.signIn}</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Auth */}
              {!session?.user && (
                <div className="border-t pt-2 mt-2">
                  <button
                    className="w-full px-3 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-md transition-colors font-medium text-center"
                    onClick={() => {
                      console.log('移动端登录按钮被点击')
                      setIsMenuOpen(false)
                      // 直接跳转到Google OAuth登录
                      window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(getNavLink('/'))}`
                    }}
                  >
                    {t.signIn}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
