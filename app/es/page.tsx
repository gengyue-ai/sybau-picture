import { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

export const metadata: Metadata = {
  title: 'Sybau Picture Generator | Crea memes virales en segundos',
  description: 'Transforma cualquier foto en memes divertidos estilo Sybau Lazer Dim 700 con nuestra tecnología IA. ¡Sin habilidades requeridas - prueba gratis!',
  alternates: {
    canonical: '/es',
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
    title: 'Sybau Picture Generator | Crea memes virales en segundos',
    description: 'Transforma cualquier foto en memes divertidos estilo Sybau Lazer Dim 700 con nuestra tecnología IA.',
    images: ['/og-image.webp'],
    locale: 'es_ES',
  },
}

export default function SpanishHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Generador Sybau Picture",
            "description": "Herramienta impulsada por IA para crear memes virales estilo Sybau desde cualquier foto",
            "url": "https://sybaupicture.com/es",
            "inLanguage": "es-ES",
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