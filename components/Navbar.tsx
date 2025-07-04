'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, Sparkles, Home, Image, BookOpen, Info, Palette, Globe, ChevronDown, Rocket, Star, Heart } from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useTranslation } from '@/hooks/useTranslation'
import { generateLocalizedLink } from '@/lib/i18n'

const NAVIGATION_ITEMS = [
  {
    name: 'nav.generator',
    href: '/generator',
    icon: Palette,
    description: 'AI Generator',
    fallback: 'Generator'
  },
  {
    name: 'nav.gallery',
    href: '/gallery',
    icon: Image,
    description: 'Art Gallery',
    fallback: 'Gallery'
  },
  {
    name: 'nav.blog',
    href: '/blog',
    icon: BookOpen,
    description: 'Blog Posts',
    fallback: 'Blog'
  },
  {
    name: 'nav.about',
    href: '/about',
    icon: Info,
    description: 'About Us',
    fallback: 'About'
  }
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)
  const pathname = usePathname()
  const { t, isLoading } = useTranslation('/')

  // 静态文本备用选项，确保即使翻译失败也能显示
  const staticTexts = {
    'nav.home': 'Home',
    'nav.generator': 'Generator',
    'nav.gallery': 'Gallery',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.tryFree': 'Try Free',
    'nav.language': 'Language',
    'nav.createNow': 'Create Now',
    'nav.create': 'Create',
    'nav.stats': 'Platform Stats',
    'nav.creations': 'Creations',
    'nav.rating': 'Rating',
    'nav.startCreating': 'Start Creating',
    'nav.followUs': 'Follow Us',
    'nav.helpCenter': 'Help Center'
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 设置最大loading时间为100ms，防止永久loading
  useEffect(() => {
    if (!isLoading) {
      setHasLoadedOnce(true)
    }

    const maxLoadingTimer = setTimeout(() => {
      setHasLoadedOnce(true)
    }, 100) // 100ms后强制结束loading

    return () => clearTimeout(maxLoadingTimer)
  }, [isLoading])

  // 在组件挂载时立即设置为已加载，避免loading状态
  useEffect(() => {
    setHasLoadedOnce(true)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname.startsWith('/zh') || pathname.startsWith('/es') ||
             pathname.startsWith('/ja') || pathname.startsWith('/ko') || pathname.startsWith('/fr') ||
             pathname.startsWith('/de') || pathname.startsWith('/pt') || pathname.startsWith('/ru') ||
             pathname.startsWith('/ar')
    }
    return pathname.startsWith(href)
  }

  // 创建一个安全的翻译函数，总是返回有效的文本
  const getText = (key: string, fallback?: string) => {
    try {
      // 总是尝试获取翻译，如果失败则使用静态文本或fallback
      const translation = t(key, fallback || staticTexts[key as keyof typeof staticTexts])

      // 检查翻译结果是否包含乱码或无效字符
      if (translation && typeof translation === 'string' && translation.length > 0) {
        // 简单的乱码检测：检查是否包含过多的特殊字符
        const specialCharCount = (translation.match(/[^\w\s\u4e00-\u9fff\u0100-\u017f\u00c0-\u00ff]/g) || []).length
        if (specialCharCount / translation.length < 0.3) {
          return translation
        }
      }

      // 如果翻译失败或包含乱码，使用fallback或静态文本
      return fallback || staticTexts[key as keyof typeof staticTexts] || key
    } catch (error) {
      console.warn(`Translation error for key "${key}":`, error)
      return fallback || staticTexts[key as keyof typeof staticTexts] || key
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={generateLocalizedLink('/', pathname)} className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group- transition-all duration-200 group-">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Sybau Picture
              </h1>
              <p className="text-xs text-gray-500 leading-none">AI Meme Generator</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              const localizedHref = generateLocalizedLink(item.href, pathname)

              return (
                <Link key={item.href} href={localizedHref}>
                  <Button
                    variant="ghost"
                    className={`relative px-6 py-3 h-auto flex items-center space-x-3 transition-all duration-200 rounded-xl ${
                      active
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="font-semibold text-lg">{getText(item.name, item.fallback)}</span>
                    {active && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                    )}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <div className="hidden md:block">
              <LanguageSwitcher variant="ghost" size="sm" />
            </div>



            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between py-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-800">Sybau Picture</h2>
                        <p className="text-xs text-gray-500">AI Meme Generator</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="flex-1 py-6">
                    <div className="space-y-2">
                      {NAVIGATION_ITEMS.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)
                        const localizedHref = generateLocalizedLink(item.href, pathname)

                        return (
                          <Link
                            key={item.href}
                            href={localizedHref}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                              active
                                ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}>
                              <Icon className="w-5 h-5" />
                              <div>
                                <div className="font-medium">{getText(item.name, item.fallback)}</div>
                                <div className="text-xs text-gray-500">{item.description}</div>
                              </div>
                              {active && (
                                <Star className="w-4 h-4 text-purple-600 ml-auto" />
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>

                    {/* Mobile Language Switcher */}
                    <div className="mt-6 px-4">
                      <div className="text-sm font-medium text-gray-700 mb-3">{getText('nav.language')}</div>
                      <LanguageSwitcher variant="outline" size="sm" />
                    </div>

                    {/* Mobile Stats */}
                    <div className="mt-6 px-4">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                        <div className="text-sm font-medium text-gray-700 mb-3">{getText('nav.stats')}</div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">125万+</div>
                            <div className="text-xs text-gray-500">{getText('nav.creations')}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-pink-600">4.9⭐</div>
                            <div className="text-xs text-gray-500">{getText('nav.rating')}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Footer */}
                  <div className="border-t border-gray-200 pt-4">
                    <Link href={generateLocalizedLink('/generator', pathname)} onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl shadow-lg">
                        <Rocket className="w-4 h-4 mr-2" />
                        {getText('nav.startCreating')}
                      </Button>
                    </Link>

                    <div className="flex items-center justify-center space-x-6 mt-4 text-gray-500">
                      <a href="#" className="flex items-center space-x-1 text-sm transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>{getText('nav.followUs')}</span>
                      </a>
                      <a href="#" className="flex items-center space-x-1 text-sm transition-colors">
                        <Globe className="w-4 h-4" />
                        <span>{getText('nav.helpCenter')}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600"></div>
      )}
    </nav>
  )
}
