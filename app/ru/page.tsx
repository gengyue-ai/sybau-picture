import { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

export const metadata: Metadata = {
  title: 'Генератор Sybau Picture | Создавайте вирусные мемы за секунды',
  description: 'Превратите любое фото в забавные мемы в стиле Sybau Lazer Dim 700 с помощью нашей ИИ-технологии. Навыки не требуются - попробуйте бесплатно!',
  alternates: {
    canonical: '/ru',
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
    title: 'Генератор Sybau Picture | Создавайте вирусные мемы за секунды',
    description: 'Превратите любое фото в забавные мемы в стиле Sybau Lazer Dim 700 с помощью нашей ИИ-технологии.',
    images: ['/og-image.webp'],
    locale: 'ru_RU',
  },
}

export default function RussianHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Генератор Sybau Picture",
            "description": "Инструмент на основе ИИ для создания вирусных мемов в стиле Sybau из любого фото",
            "url": "https://sybaupicture.com/ru",
            "inLanguage": "ru-RU",
            "applicationCategory": "PhotoEditingApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "RUB"
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