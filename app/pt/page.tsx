import { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

export const metadata: Metadata = {
  title: 'Gerador Sybau Picture | Crie Memes Virais em Segundos',
  description: 'Transforme qualquer foto em memes engraçados estilo Sybau Lazer Dim 700 com nossa tecnologia IA. Nenhuma habilidade necessária - experimente grátis!',
  alternates: {
    canonical: '/pt',
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
    title: 'Gerador Sybau Picture | Crie Memes Virais em Segundos',
    description: 'Transforme qualquer foto em memes engraçados estilo Sybau Lazer Dim 700 com nossa tecnologia IA.',
    images: ['/og-image.webp'],
    locale: 'pt_BR',
  },
}

export default function PortugueseHomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Gerador Sybau Picture",
            "description": "Ferramenta alimentada por IA para criar memes virais estilo Sybau a partir de qualquer foto",
            "url": "https://sybaupicture.com/pt",
            "inLanguage": "pt-BR",
            "applicationCategory": "PhotoEditingApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "BRL"
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