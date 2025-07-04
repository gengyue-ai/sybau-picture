import { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

export const metadata: Metadata = {
  title: 'Sybau Picture Generator | Create Viral Memes in Seconds',
  description: 'Turn any photo into hilarious Sybau Lazer Dim 700 style memes with our AI technology. No skills required - try it free!',
  openGraph: {
    title: 'Sybau Picture Generator | Create Viral Memes in Seconds',
    description: 'Turn any photo into hilarious Sybau Lazer Dim 700 style memes with our AI technology.',
    images: ['/og-image.webp'],
  },
}

export default function HomePage() {
  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Sybau Picture Generator",
            "description": "AI-powered tool to create viral Sybau-style memes from any photo",
            "url": "https://sybaupicture.com",
            "applicationCategory": "PhotoEditingApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
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