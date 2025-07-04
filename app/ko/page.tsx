import { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

export const metadata: Metadata = {
  title: 'Sybau Picture Generator | 초단위로 바이럴 밈 생성',
  description: 'AI 기술로 모든 사진을 재미있는 Sybau Lazer Dim 700 스타일 밈으로 변환하세요. 기술 불필요 - 무료 체험!',
  alternates: {
    canonical: '/ko',
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
    title: 'Sybau Picture Generator | 초단위로 바이럴 밈 생성',
    description: 'AI 기술로 모든 사진을 재미있는 Sybau Lazer Dim 700 스타일 밈으로 변환하세요.',
    images: ['/og-image.webp'],
    locale: 'ko_KR',
  },
}

export default function KoreanHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Sybau Picture 생성기",
            "description": "AI 기술로 모든 사진에서 바이럴 Sybau 스타일 밈을 만드는 도구",
            "url": "https://sybaupicture.com/ko",
            "inLanguage": "ko-KR",
            "applicationCategory": "PhotoEditingApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "KRW"
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