import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Search, TrendingUp, Heart, Download, Share2, Eye, Star, Sparkles, Zap, Award, Clock, Rocket, Shield, Users, Check } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Galería Sybau - Explora Increíbles Creaciones de Memes AI',
  description: 'Descubre miles de divertidos memes Sybau creados por nuestra comunidad usando tecnología AI avanzada. Explora nuestra extensa colección de obras maestras Sybau.',
  keywords: ['Galería Sybau', 'Sybau', 'memes AI', 'memes Sybau', 'galería de memes', 'contenido generado por AI'],
}

// Datos estáticos simulados para demostración
const mockImages = [
  {
    id: '1',
    title: 'Sybau Sonrisa Clásica',
    description: 'Meme perfecto creado con tecnología AI Sybau',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    likes: 1245,
    downloads: 892,
    views: 15420,
    category: 'classic',
    tags: ['Sybau', 'divertido', 'clásico'],
    creator: 'Usuario Sybau123'
  },
  {
    id: '2',
    title: 'Sybau Expresión Sorprendida',
    description: 'Expresión sorprendida estilo Sybau, contenido viral perfecto',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616c5e2671b?w=400&h=400&fit=crop',
    likes: 2156,
    downloads: 1543,
    views: 28930,
    category: 'trending',
    tags: ['Sybau', 'sorpresa', 'viral'],
    creator: 'Maestro Sybau'
  },
  {
    id: '3',
    title: 'Sybau Estilo Profesional',
    description: 'Meme Sybau profesional, perfecto para uso empresarial',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    likes: 876,
    downloads: 654,
    views: 12340,
    category: 'professional',
    tags: ['Sybau', 'negocios', 'profesional'],
    creator: 'Experto Sybau'
  },
  {
    id: '4',
    title: 'Sybau Tiempo Feliz',
    description: 'Meme Sybau lleno de alegría',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    likes: 1987,
    downloads: 1234,
    views: 23450,
    category: 'fun',
    tags: ['Sybau', 'felicidad', 'diversión'],
    creator: 'Creador Sybau'
  },
  {
    id: '5',
    title: 'Sybau Modo Pensativo',
    description: 'Meme Sybau de pensamiento profundo',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    likes: 1543,
    downloads: 987,
    views: 18760,
    category: 'creative',
    tags: ['Sybau', 'pensamiento', 'profundo'],
    creator: 'Filósofo Sybau'
  },
  {
    id: '6',
    title: 'Sybau Estilo Deportivo',
    description: 'Meme Sybau temático deportivo',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    likes: 2345,
    downloads: 1876,
    views: 32100,
    category: 'sports',
    tags: ['Sybau', 'deportes', 'energía'],
    creator: 'Atleta Sybau'
  }
]

const categories = [
  { id: 'all', name: 'Todas las Obras Sybau', count: 125000 },
  { id: 'trending', name: 'Sybau Tendencia', count: 15000 },
  { id: 'classic', name: 'Sybau Clásico', count: 25000 },
  { id: 'fun', name: 'Sybau Divertido', count: 18000 },
  { id: 'professional', name: 'Sybau Profesional', count: 12000 },
  { id: 'creative', name: 'Sybau Creativo', count: 20000 },
  { id: 'sports', name: 'Sybau Deportivo', count: 8000 }
]

const stats = [
  { number: '1,250,000+', label: 'Total de Obras Sybau' },
  { number: '250,000+', label: 'Creadores Sybau' },
  { number: '50M+', label: 'Visualizaciones Sybau' },
  { number: '4.9/5', label: 'Calificación Usuarios Sybau' }
]

const features = [
  {
    icon: Star,
    title: 'Obras Sybau de Alta Calidad',
    description: 'Nuestra galería Sybau presenta memes AI de la más alta calidad, cada obra cuidadosamente curada.'
  },
  {
    icon: Users,
    title: 'Comunidad Sybau',
    description: 'La galería Sybau está impulsada por una comunidad global de creadores compartiendo los mejores memes estilo Sybau.'
  },
  {
    icon: TrendingUp,
    title: 'Tendencias Sybau',
    description: 'Descubre las últimas tendencias y memes virales Sybau en nuestra galería, mantente al día.'
  }
]

export default function ESGalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/es" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Volver al Inicio</span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">Galería Sybau</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/es/generator">
              <Button>Crear Meme</Button>
            </Link>
            <Link href="/es/about">
              <Button variant="outline">Acerca de</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Galería de Memes Sybau
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Explora el Mundo Sybau
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            ¡Bienvenido a la galería definitiva de memes Sybau! Aquí puedes descubrir miles de increíbles obras Sybau creadas por nuestra comunidad global usando tecnología AI avanzada. Cada meme Sybau es una obra de arte única que muestra la perfecta combinación de AI y creatividad humana. Explora nuestra rica colección Sybau, encuentra el meme perfecto para expresar tus emociones, u obtén inspiración para crear tu propia obra maestra Sybau.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar memes Sybau..."
                className="pl-10 py-3 text-lg border-2 border-purple-200 focus:border-purple-400 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Categorías Sybau</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className="px-4 py-2 cursor-pointer hover:bg-purple-50 border-purple-200"
              >
                {category.name} ({category.count.toLocaleString()})
              </Badge>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">¿Por Qué Elegir Nuestra Galería Sybau?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestra galería Sybau combina la mejor tecnología AI con contenido curado por la comunidad para ofrecerte la mejor experiencia de exploración de memes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className=" transition-shadow duration-200 text-center">
                <CardContent className="p-6">
                  <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Obras Maestras Sybau Destacadas</h2>
            <p className="text-lg text-gray-600">Descubre las creaciones Sybau más populares de nuestra comunidad</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockImages.map((image) => (
              <Card key={image.id} className="overflow-hidden transition-all duration-300 transform">
                <div className="relative">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge className="bg-purple-500 text-white">
                      <Eye className="w-3 h-3 mr-1" />
                      {image.views.toLocaleString()}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{image.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {image.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>por {image.creator}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{image.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{image.downloads}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-purple-100 to-cyan-100 rounded-3xl p-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Únete a la Comunidad Sybau</h2>
              <p className="text-xl text-gray-700 mb-8">
                Forma parte de una comunidad global de creadores Sybau. Comparte tus creaciones, descubre nuevas tendencias y conecta con otros artistas Sybau de todo el mundo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/es/generator">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
                    <Rocket className="w-5 h-5 mr-2" />
                    Crear Tu Primer Sybau
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-xl">
                  <Users className="w-5 h-5 mr-2" />
                  Explorar Comunidad
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Consejos para Crear Sybau Perfectos</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Aprende de los mejores creadores Sybau y mejora tus habilidades con estos consejos profesionales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Timing Perfecto</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Los mejores memes Sybau capturan el momento perfecto. Experimenta con diferentes expresiones faciales para encontrar la que mejor transmita tu mensaje.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Usa imágenes claras y bien iluminadas</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Enfócate en expresiones faciales distintivas</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Prueba diferentes ángulos</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">Calidad Superior</h3>
              </div>
              <p className="text-gray-600 mb-4">
                La calidad es clave en los memes Sybau exitosos. Sigue estos estándares para crear contenido que destaque en nuestra galería.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Resolución mínima 400x400 px</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Evita imágenes borrosas</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> Mantén el estilo Sybau auténtico</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
