'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { usePathname } from 'next/navigation'
import { extractLanguageFromPath } from '@/lib/i18n'
import Navbar from '@/components/Navbar'

export default function TestLangPage() {
  const { t, isLoading, currentLanguage, hasTranslations } = useTranslation('/')
  const pathname = usePathname()
  const [debugInfo, setDebugInfo] = useState<any>({})

  useEffect(() => {
    const { language, pathWithoutLang } = extractLanguageFromPath(pathname)
    
    setDebugInfo({
      pathname,
      extractedLanguage: language,
      pathWithoutLang,
      currentLanguage,
      hasTranslations,
      isLoading,
      browserLanguage: typeof window !== 'undefined' ? navigator.language : 'unknown',
      acceptLanguage: typeof window !== 'undefined' && document.cookie ? 
        document.cookie.includes('accept-language') : 'unknown'
    })
  }, [pathname, currentLanguage, hasTranslations, isLoading])

  const testKeys = [
    'nav.about',
    'nav.generator',
    'nav.gallery',
    'nav.blog',
    'nav.home'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            🔧 语言系统诊断页面
          </h1>
          
          {/* 调试信息 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">🔍 系统状态</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>当前路径:</strong> {debugInfo.pathname}
              </div>
              <div>
                <strong>提取的语言:</strong> {debugInfo.extractedLanguage}
              </div>
              <div>
                <strong>当前语言:</strong> {debugInfo.currentLanguage}
              </div>
              <div>
                <strong>浏览器语言:</strong> {debugInfo.browserLanguage}
              </div>
              <div>
                <strong>翻译加载状态:</strong> {isLoading ? '加载中...' : '已完成'}
              </div>
              <div>
                <strong>是否有翻译数据:</strong> {hasTranslations ? '✅ 是' : '❌ 否'}
              </div>
            </div>
          </div>

          {/* 翻译测试 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">🌐 翻译测试</h2>
            <div className="space-y-3">
              {testKeys.map(key => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-mono text-sm text-gray-600">{key}</span>
                  <span className="font-medium">
                    "{t(key, `[${key}]`)}"
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 快速修复建议 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              🛠️ 快速修复建议
            </h2>
            <div className="space-y-3 text-blue-700">
              {!hasTranslations && (
                <div className="bg-yellow-100 border border-yellow-300 rounded p-3">
                  <strong>⚠️ 翻译数据缺失</strong>
                  <p>系统未能加载翻译数据，这可能导致导航栏显示乱码。</p>
                </div>
              )}
              
              <div className="bg-green-100 border border-green-300 rounded p-3">
                <strong>✅ 建议操作</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>检查网络连接是否正常</li>
                  <li>清除浏览器缓存和Cookie</li>
                  <li>刷新页面重新加载翻译数据</li>
                  <li>如果问题持续，切换到英文版本</li>
                </ol>
              </div>

              <div className="flex gap-4 mt-4">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  🏠 返回首页（英文）
                </button>
                <button 
                  onClick={() => window.location.href = '/zh'}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  🇨🇳 切换中文版
                </button>
                <button 
                  onClick={() => {
                    document.cookie = 'force-english=true; path=/; max-age=3600'
                    window.location.href = '/'
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  🔒 强制英文模式
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 