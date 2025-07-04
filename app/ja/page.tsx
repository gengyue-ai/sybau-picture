import { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

export const metadata: Metadata = {
  title: 'Sybau Picture Generator | バイラルミームを秒で作成',
  description: 'AIテクノロジーを使用して、あらゆる写真を面白いSybau Lazer Dim 700スタイルのミームに変換します。スキル不要 - 無料でお試しください！',
  alternates: {
    canonical: '/ja',
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
    title: 'Sybau Picture Generator | バイラルミームを秒で作成',
    description: 'AIテクノロジーを使用して、あらゆる写真を面白いSybau Lazer Dim 700スタイルのミームに変換します。',
    images: ['/og-image.webp'],
    locale: 'ja_JP',
  },
}

export default function JapaneseHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Sybau Picture ジェネレーター",
            "description": "AI技術で任意の写真からバイラルSybauスタイルミームを作成するツール",
            "url": "https://sybaupicture.com/ja",
            "inLanguage": "ja-JP",
            "applicationCategory": "PhotoEditingApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "JPY"
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