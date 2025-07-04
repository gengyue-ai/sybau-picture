'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Search, Filter, Heart, Share2, Download, Eye, Calendar, Loader2, Rocket } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { generateLocalizedLink } from '@/lib/i18n'

interface GalleryImage {
  id: string
  title: string
  description: string
  imageUrl: string
  creator: string
  category: string
  createdAt: string
  likes: number
  views: number
  downloads: number
  featured?: boolean
}

export default function DEGalleryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  // Statistiken
  const [stats] = useState({
    totalImages: 12420,
    totalCreators: 8500,
    totalDownloads: 890000,
    averageRating: 4.8
  })

  // Statische Texte auf Deutsch
  const staticTexts = {
    title: 'Sybau Picture Galerie',
    subtitle: 'Entdecke tausende von Sybau Picture Kreationen von talentierten Erstellern weltweit',
    searchPlaceholder: 'Sybau Picture Kreationen nach Kategorie, Stil oder Ersteller suchen...',
    backToHome: 'Zurück zur Startseite',
    allCategories: 'Alle Kategorien',
    noImagesFound: 'Keine Bilder gefunden',
    noImagesDescription: 'Versuche andere Suchbegriffe oder stöbere durch alle Kategorien.',
    viewImage: 'Bild anzeigen',
    downloadImage: 'Bild herunterladen',
    shareImage: 'Teilen',
    byCreator: 'Von',
    stats: {
      totalImages: 'Sybau Picture Bilder',
      totalCreators: 'Aktive Ersteller',
      totalDownloads: 'Gesamt Downloads',
      averageRating: 'Durchschnittsbewertung'
    },
    ctaTitle: 'Erstelle deine eigenen Sybau Pictures',
    ctaDescription: 'Schließe dich tausenden von Erstellern an, die mit Sybau Pictures erfolgreich sind.',
    startCreating: 'Erstellen beginnen',
    exploreBlog: 'Blog erkunden'
  }

  const getText = (key: string): string => {
    const nestedKeys = key.split('.')
    let current: any = staticTexts

    for (const nestedKey of nestedKeys) {
      if (current && typeof current === 'object' && nestedKey in current) {
        current = current[nestedKey]
      } else {
        return key
      }
    }

    return typeof current === 'string' ? current : key
  }

  // Mock-Bilddaten
  const mockImages: GalleryImage[] = [
    {
      id: '1',
      title: 'Tanzende Katze Viral Sybau',
      description: 'Eine lustige Sybau Picture Kreation, die mit über 2M Aufrufen viral ging',
      imageUrl: '/api/placeholder/400/300',
      creator: 'MaxKreativ',
      category: 'Tiere',
      createdAt: '2024-01-15',
      likes: 15420,
      views: 89340,
      downloads: 12450,
      featured: true
    },
    {
      id: '2',
      title: 'Episches Arbeitstreffen',
      description: 'Perfekte Sybau Picture für das Chaos moderner Meetings',
      imageUrl: '/api/placeholder/400/300',
      creator: 'AnnaDesigner',
      category: 'Arbeit',
      createdAt: '2024-01-14',
      likes: 8920,
      views: 45670,
      downloads: 7890,
      featured: true
    },
    {
      id: '3',
      title: 'Studentenleben',
      description: 'Die Realität von Universitätsstudenten in einer Sybau Picture',
      imageUrl: '/api/placeholder/400/300',
      creator: 'TomMemes',
      category: 'Bildung',
      createdAt: '2024-01-13',
      likes: 12340,
      views: 67890,
      downloads: 9876,
      featured: false
    },
    {
      id: '4',
      title: 'Pizza vs Diät',
      description: 'Das ewige Ernährungsdilemma in einer Sybau Picture dargestellt',
      imageUrl: '/api/placeholder/400/300',
      creator: 'LauraHumor',
      category: 'Essen',
      createdAt: '2024-01-12',
      likes: 9870,
      views: 34560,
      downloads: 5670,
      featured: false
    },
    {
      id: '5',
      title: 'Wochenende vs Montag',
      description: 'Der meist gefürchtete Wochenwechsel in einer Sybau Picture',
      imageUrl: '/api/placeholder/400/300',
      creator: 'StefanLustig',
      category: 'Leben',
      createdAt: '2024-01-11',
      likes: 18930,
      views: 92340,
      downloads: 15670,
      featured: true
    },
    {
      id: '6',
      title: 'Entwickler beim Debuggen',
      description: 'Das Leben eines Programmierers in einer Sybau Picture',
      imageUrl: '/api/placeholder/400/300',
      creator: 'TechMike',
      category: 'Technologie',
      createdAt: '2024-01-10',
      likes: 7650,
      views: 23450,
      downloads: 4320,
      featured: false
    }
  ]

  useEffect(() => {
    // Daten laden simulieren
    const timer = setTimeout(() => {
      setGalleryImages(mockImages)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getCategories = () => {
    const categories = [
      { name: getText('allCategories'), key: 'all', count: galleryImages.length }
    ]

    const categoryMap = new Map()
    galleryImages.forEach(image => {
      const category = image.category
      if (!categoryMap.has(category)) {
        categoryMap.set(category, 0)
      }
      categoryMap.set(category, categoryMap.get(category) + 1)
    })

    categoryMap.forEach((count, category) => {
      categories.push({
        name: category,
        key: category.toLowerCase(),
        count
      })
    })

    return categories
  }

  useEffect(() => {
    if (loading) return

    let filtered = galleryImages

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(image =>
        image.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    if (searchTerm) {
      filtered = filtered.filter(image =>
        image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        image.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredImages(filtered)
  }, [searchTerm, selectedCategory, loading, galleryImages])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            {getText('title')}
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            {getText('subtitle')}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{formatNumber(stats.totalImages)}</div>
              <div className="text-sm text-white/80">{staticTexts.stats.totalImages}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{formatNumber(stats.totalCreators)}+</div>
              <div className="text-sm text-white/80">{staticTexts.stats.totalCreators}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{formatNumber(stats.totalDownloads)}</div>
              <div className="text-sm text-white/80">{staticTexts.stats.totalDownloads}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.averageRating}</div>
              <div className="text-sm text-white/80">{staticTexts.stats.averageRating}</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={getText('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/20 focus:border-white/40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/de" className="inline-flex items-center text-gray-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {getText('backToHome')}
          </Link>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            {getCategories().map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.key
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-purple-50 border border-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {getText('noImagesFound')}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {getText('noImagesDescription')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden transition-shadow duration-300 group">
                <div className="relative aspect-video bg-gradient-to-br from-purple-200 to-cyan-200">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-cyan-400/20" />
                  {image.featured && (
                    <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                      Empfohlen
                    </Badge>
                  )}
                  <div className="absolute inset-0 opacity-0 transition-opacity bg-black/50 flex items-center justify-center space-x-2">
                    <Button size="sm" variant="secondary">
                      <Eye className="w-4 h-4 mr-1" />
                      {getText('viewImage')}
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Download className="w-4 h-4 mr-1" />
                      {getText('downloadImage')}
                    </Button>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>{formatDate(image.createdAt)}</span>
                    <Badge variant="outline">{image.category}</Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{image.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {image.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="font-medium">{getText('byCreator')} {image.creator}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {formatNumber(image.likes)}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {formatNumber(image.views)}
                      </div>
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {formatNumber(image.downloads)}
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            {getText('ctaTitle')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {getText('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={generateLocalizedLink('/generator', pathname)}>
              <Button size="lg" className="bg-white text-purple-600 /90 px-8 py-3 text-lg font-semibold">
                <Rocket className="w-5 h-5 mr-2" />
                {getText('startCreating')}
              </Button>
            </Link>
            <Link href={generateLocalizedLink('/blog', pathname)}>
              <Button size="lg" variant="outline" className="border-white text-white /10 px-8 py-3 text-lg font-semibold">
                <Eye className="w-5 h-5 mr-2" />
                {getText('exploreBlog')}
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
