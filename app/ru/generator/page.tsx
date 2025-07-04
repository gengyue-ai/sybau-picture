import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Upload, Download, Star, Zap, Clock, Users, CheckCircle, Sparkles, Rocket, Play, Shield, Award, Camera, Paintbrush, Wand2 } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Генератор Изображений - Создать Невероятные ИИ Мемы | Sybau Picture',
  description: 'Используйте наш продвинутый генератор изображений, чтобы превратить любое фото в вирусные мемы Sybau за секунды. Бесплатно, быстро, без регистрации. Испытайте силу нашего генератора изображений с ИИ.',
  keywords: ['генератор изображений', 'ИИ генератор изображений', 'Sybau генератор изображений', 'генератор мемов', 'бесплатный генератор изображений', 'ИИ инструменты', 'редактор изображений'],
}

export default function RUGeneratorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/ru" className="flex items-center text-purple-600 hover:text-purple-700 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться на Главную
            </Link>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Sparkles className="w-3 h-3 mr-1" />
                ИИ Генератор
              </Badge>
              <Link href="/ru/gallery">
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Галерея
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-700 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              ИИ-Генератор Изображений
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
              Мощный ИИ<br />Генератор Изображений
            </h1>

            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Используйте наш передовой ИИ-генератор изображений для превращения любого фото в вирусные мемы Sybau.
              Этот генератор изображений использует продвинутые ИИ-технологии для доставки профессиональных результатов
              без необходимости навыков дизайна. Узнайте, почему миллионы пользователей доверяют нашему
              генератору изображений для своих потребностей в создании контента.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">1,250,000+</div>
                <div className="text-sm text-gray-600">Изображений в Месяц</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-1">250,000+</div>
                <div className="text-sm text-gray-600">Активных Пользователей</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600 mb-1">4.9/5</div>
                <div className="text-sm text-gray-600">Рейтинг Пользователей</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-1">150+</div>
                <div className="text-sm text-gray-600">Поддерживаемых Стран</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform transition-all duration-200">
                <Play className="mr-2 h-5 w-5" />
                Использовать Генератор Сейчас
              </Button>

              <Button variant="outline" size="lg" className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl">
                <Star className="mr-2 h-5 w-5" />
                Посмотреть Примеры
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section - Placeholder */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <Card className="p-8 border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 hover:border-purple-400 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                    Загрузите Ваше Фото
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Загрузите ваше фото в наш продвинутый ИИ-генератор изображений
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Paintbrush className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                    Настройки Стиля
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Настройте параметры вашего генератора изображений
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              Готовы Создавать с Нашим Генератором? 🚀
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              Присоединяйтесь к миллионам создателей, которые уже используют наш генератор изображений для создания вирусного контента.
              Начните свое творческое путешествие сегодня!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform transition-all duration-200">
                <Rocket className="mr-2 h-5 w-5" />
                Начать Создавать Сейчас
              </Button>

              <Button variant="outline" size="lg" className="border-2 border-white bg-white/10 text-white hover:border-white/80 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm">
                <Star className="mr-2 h-5 w-5" />
                Посмотреть Примеры
              </Button>
            </div>

            <div className="text-center text-white/80">
              <p className="mb-4">Генератор Sybau поддерживает JPG, PNG, WebP • Без регистрации • 100% бесплатно</p>
              <div className="flex justify-center items-center space-x-6">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Безопасная Обработка</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Генерация за 8 Секунд</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Глобальное Сообщество</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
