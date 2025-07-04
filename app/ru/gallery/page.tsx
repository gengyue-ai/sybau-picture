import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Search, TrendingUp, Heart, Download, Share2, Eye, Star, Sparkles, Zap, Award, Clock, Rocket, Shield, Users, Check } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Галерея Sybau - Изучайте удивительные мемы, созданные ИИ',
  description: 'Откройте для себя тысячи веселых мемов Sybau, созданных нашим сообществом с использованием передовых технологий ИИ.',
  keywords: ['Галерея Sybau', 'мемы ИИ', 'мемы Sybau', 'галерея мемов', 'контент, созданный ИИ'],
}

// Статические данные для демонстрации
const mockImages = [
  {
    id: '1',
    processedImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
    style: 'classic',
    intensity: 3,
    createdAt: '2024-01-15',
    user: { name: 'Создатель1', image: '' },
    stats: { views: 1234, likes: 89, downloads: 45 }
  },
  {
    id: '2',
    processedImage: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=500&fit=crop',
    style: 'exaggerated',
    intensity: 5,
    createdAt: '2024-01-14',
    user: { name: 'Создатель2', image: '' },
    stats: { views: 2345, likes: 156, downloads: 78 }
  },
  {
    id: '3',
    processedImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&h=500&fit=crop',
    style: 'minimal',
    intensity: 2,
    createdAt: '2024-01-13',
    user: { name: 'Создатель3', image: '' },
    stats: { views: 3456, likes: 234, downloads: 123 }
  },
  {
    id: '4',
    processedImage: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=500&fit=crop',
    style: 'viral',
    intensity: 4,
    createdAt: '2024-01-12',
    user: { name: 'Создатель4', image: '' },
    stats: { views: 4567, likes: 345, downloads: 189 }
  },
  {
    id: '5',
    processedImage: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=500&h=500&fit=crop',
    style: 'trending',
    intensity: 3,
    createdAt: '2024-01-11',
    user: { name: 'Создатель5', image: '' },
    stats: { views: 5678, likes: 456, downloads: 234 }
  },
  {
    id: '6',
    processedImage: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=500&h=500&fit=crop',
    style: 'featured',
    intensity: 5,
    createdAt: '2024-01-10',
    user: { name: 'Создатель6', image: '' },
    stats: { views: 6789, likes: 567, downloads: 345 }
  }
]

const staticTexts = {
  title: 'Галерея Sybau',
  subtitle: 'Изучайте удивительные мемы Sybau, созданные ИИ',
  description: 'Откройте для себя тысячи веселых мемов Sybau, созданных нашим сообществом с использованием передовых технологий ИИ. Каждое творение Sybau представляет уникальный стиль и юмор, который делает этот формат вирусным.',
  searchPlaceholder: 'Поиск стилей Sybau, категорий или ключевых слов...',
  backToHome: 'Вернуться на главную',
  allCategories: 'Все стили Sybau',
  likes: 'лайков',
  views: 'просмотров',
  downloads: 'скачиваний',
  createdBy: 'Создано',
  ctaTitle: 'Готовы создать свои собственные мемы Sybau?',
  ctaDescription: 'Присоединяйтесь к нашему сообществу создателей Sybau и создавайте вирусный контент с помощью технологий ИИ',
  startCreating: 'Начать создание Sybau',
  viewTutorials: 'Посмотреть учебники Sybau',
  aboutSybau: 'О стиле Sybau',
  stylesTitle: 'Популярные стили Sybau',
  communityTitle: 'Сообщество Sybau',
  tipsTitle: 'Советы по созданию Sybau'
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

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

export default function RUGalleryPage() {
  // Статические данные сообщества
  const stats = {
    totalSybauMemes: 45000,
    activeSybauCreators: 12000,
    dailySybauCreations: 850,
    sybauViralRate: 89
  }

  const categories = [
    { id: 'all', name: 'Все стили Sybau', icon: Star, description: 'Все стили Sybau' },
    { id: 'classic', name: 'Классический Sybau', icon: Heart, description: 'Традиционные выражения Sybau' },
    { id: 'exaggerated', name: 'Преувеличенный Sybau', icon: Award, description: 'Интенсивные эффекты Sybau' },
    { id: 'minimal', name: 'Минимальный Sybau', icon: Clock, description: 'Тонкие трансформации Sybau' },
    { id: 'viral', name: 'Вирусный Sybau', icon: Star, description: 'Самые популярные мемы Sybau' },
    { id: 'trending', name: 'Трендовый Sybau', icon: Sparkles, description: 'Последние тренды Sybau' },
    { id: 'featured', name: 'Избранный Sybau', icon: TrendingUp, description: 'Лучшие творения Sybau' },
    { id: 'community', name: 'Сообщество Sybau', icon: Zap, description: 'Пользовательский Sybau' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Секция героя */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <Badge className="bg-white/20 text-white px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Официальная галерея Sybau
            </Badge>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            {getText('title')}
          </h1>
          <h2 className="text-xl lg:text-2xl text-white/90 mb-6">
            {getText('subtitle')}
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
            {getText('description')} Просмотрите нашу обширную коллекцию шедевров Sybau и вдохновитесь для создания вашего следующего вирусного творения.
          </p>

          <div className="max-w-xl mx-auto relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={getText('searchPlaceholder')}
              className="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur-sm border-white/20 focus:border-white/40 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-purple-400 text-white px-4 py-2">
              <Eye className="w-4 h-4 mr-2" />
              {formatNumber(stats.totalSybauMemes)}+ мемов Sybau
            </Badge>
            <Badge className="bg-pink-400 text-white px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              {formatNumber(stats.activeSybauCreators)}+ создателей
            </Badge>
            <Badge className="bg-cyan-400 text-white px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              {stats.sybauViralRate}% вирусности
            </Badge>
          </div>

          <div>
            <Link href="/ru">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {getText('backToHome')}
              </Button>
            </Link>
            <Link href="/ru/generator">
              <Button className="bg-white text-purple-600 font-semibold">
                <Sparkles className="w-4 h-4 mr-2" />
                {getText('startCreating')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Секция категорий */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            {getText('stylesTitle')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <div key={category.id} className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl transition-all duration-200 cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mx-auto mb-3">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-600">{category.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Секция галереи */}
      <section className="py-12 bg-gradient-to-br from-purple-50 via-white to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockImages.map((image) => (
              <Card key={image.id} className="group overflow-hidden transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={image.processedImage}
                    alt={`Мем Sybau в стиле ${image.style}`}
                    className="w-full h-full object-cover group- transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/20 text-white backdrop-blur-sm">
                      {image.style}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-full transition-transform duration-300">
                    <div className="flex items-center justify-between text-white text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {formatNumber(image.stats.views)}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {formatNumber(image.stats.likes)}
                        </div>
                        <div className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          {formatNumber(image.stats.downloads)}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="bg-white/20 border-white/20 text-white ">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {image.user.name[0]}
                      </div>
                      <span className="text-sm text-gray-600">{getText('createdBy')} {image.user.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{image.createdAt}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span>{formatNumber(image.stats.views)} {getText('views')}</span>
                      <span>{formatNumber(image.stats.likes)} {getText('likes')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < image.intensity ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Секция призыва к действию */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {getText('ctaTitle')}
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            {getText('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ru/generator">
              <Button size="lg" className="bg-white text-purple-600 font-semibold px-8 py-3">
                <Rocket className="w-5 h-5 mr-2" />
                {getText('startCreating')}
              </Button>
            </Link>
            <Link href="/ru/blog">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white px-8 py-3">
                <Shield className="w-5 h-5 mr-2" />
                {getText('viewTutorials')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
