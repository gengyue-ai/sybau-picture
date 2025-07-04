import { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

export const metadata: Metadata = {
  title: 'Sybau图片生成器 | 秒速制作病毒式表情包',
  description: '使用我们的AI技术将任何照片转换成搞笑的Sybau Lazer Dim 700风格表情包。无需技能 - 免费试用！',
  alternates: {
    canonical: '/zh',
    languages: {
      'en': '/',
      'zh': '/zh',
      'es': '/es',
      'ja': '/ja',
      'ko': '/ko',
      'fr': '/fr',
      'de': '/de',
      'pt': '/pt',
      'ru': '/ru',
      'ar': '/ar',
    },
  },
  openGraph: {
    title: 'Sybau图片生成器 | 秒速制作病毒式表情包',
    description: '使用我们的AI技术将任何照片转换成搞笑的Sybau Lazer Dim 700风格表情包。',
    images: ['/og-image.webp'],
    locale: 'zh_CN',
  },
}

export default function ChineseHomePage() {
  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Sybau图片生成器",
            "description": "AI驱动的工具，将任何照片转换为病毒式Sybau风格表情包",
            "url": "https://sybaupicture.com/zh",
            "inLanguage": "zh-CN",
            "applicationCategory": "PhotoEditingApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "CNY"
            },
            "creator": {
              "@type": "Organization",
              "name": "Sybau Picture"
            }
          })
        }}
      />
      
      <HomePageClient />
    </>
  )
} 