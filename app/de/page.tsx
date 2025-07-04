import { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

export const metadata: Metadata = {
  title: 'Sybau Picture Generator | Erstelle virale Memes in Sekunden',
  description: 'Verwandeln Sie jedes Foto mit unserer KI-Technologie in lustige Sybau Lazer Dim 700-Stil-Memes. Keine Kenntnisse erforderlich - kostenlos testen!',
  alternates: {
    canonical: '/de',
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
    title: 'Sybau Picture Generator | Erstelle virale Memes in Sekunden',
    description: 'Verwandeln Sie jedes Foto mit unserer KI-Technologie in lustige Sybau Lazer Dim 700-Stil-Memes.',
    images: ['/og-image.webp'],
    locale: 'de_DE',
  },
}

export default function GermanHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Sybau Picture Generator",
            "description": "KI-betriebenes Tool zur Erstellung viraler Sybau-Stil-Memes aus jedem Foto",
            "url": "https://sybaupicture.com/de",
            "inLanguage": "de-DE",
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