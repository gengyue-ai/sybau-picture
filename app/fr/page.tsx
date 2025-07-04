import { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

export const metadata: Metadata = {
  title: 'Sybau Picture Generator | Créez des mèmes viraux en secondes',
  description: 'Transformez n\'importe quelle photo en mèmes hilarants de style Sybau Lazer Dim 700 avec notre technologie IA. Aucune compétence requise - essayez gratuitement !',
  alternates: {
    canonical: '/fr',
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
    title: 'Sybau Picture Generator | Créez des mèmes viraux en secondes',
    description: 'Transformez n\'importe quelle photo en mèmes hilarants de style Sybau Lazer Dim 700 avec notre technologie IA.',
    images: ['/og-image.webp'],
    locale: 'fr_FR',
  },
}

export default function FrenchHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Générateur Sybau Picture",
            "description": "Outil alimenté par IA pour créer des mèmes viraux de style Sybau à partir de n'importe quelle photo",
            "url": "https://sybaupicture.com/fr",
            "inLanguage": "fr-FR",
            "applicationCategory": "PhotoEditingApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
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