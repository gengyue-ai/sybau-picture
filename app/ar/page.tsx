import { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

export const metadata: Metadata = {
  title: 'مولد صور سيباو | إنشاء ميمز فايرالية في ثوانٍ',
  description: 'حول أي صورة إلى ميمز مضحكة بأسلوب Sybau Lazer Dim 700 باستخدام تقنية الذكاء الاصطناعي. لا تحتاج مهارات - جرب مجاناً!',
  alternates: {
    canonical: '/ar',
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
    title: 'مولد صور سيباو | إنشاء ميمز فايرالية في ثوانٍ',
    description: 'حول أي صورة إلى ميمز مضحكة بأسلوب Sybau Lazer Dim 700 باستخدام تقنية الذكاء الاصطناعي.',
    images: ['/og-image.webp'],
    locale: 'ar_SA',
  },
}

export default function ArabicHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "مولد صور سيباو",
            "description": "أداة مدعومة بالذكاء الاصطناعي لإنشاء ميمز فايرالية بأسلوب سيباو من أي صورة",
            "url": "https://sybaupicture.com/ar",
            "inLanguage": "ar-SA",
            "applicationCategory": "PhotoEditingApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "SAR"
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