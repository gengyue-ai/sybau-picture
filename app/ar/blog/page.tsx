'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, Calendar, Clock, ArrowRight, BookOpen, Loader2, Eye, Star, Rocket } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  viewCount?: number
  keywords: string[]
  featured?: boolean
  category?: string
  readTime?: number
  content?: string
}

export default function ARBlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)

  // الإحصائيات
  const [stats] = useState({
    totalSybauPictureGuides: 150,
    sybauPictureCreators: 8500,
    successfulSybauPictureCampaigns: 2300,
    averageViralRate: 78
  })

  // النصوص الثابتة بالعربية
  const staticTexts = {
    title: 'مركز تعلم صور سايباو',
    description: 'أتقن فن إنشاء صور سايباو من خلال أدلة شاملة وبرامج تعليمية وقصص نجاح. تعلم كيفية إنشاء محتوى صور سايباو الفيروسي الذي يجذب الجمهور العالمي.',
    searchPlaceholder: 'البحث عن دروس صور سايباو، الأدلة، قصص النجاح...',
    allCategory: 'جميع محتويات صور سايباو',
    backToHome: 'العودة للصفحة الرئيسية',
    featuredStories: 'قصص صور سايباو المميزة',
    latestArticles: 'أحدث مقالات صور سايباو',
    readArticle: 'قراءة دليل صور سايباو',
    minutesRead: 'دقائق قراءة',
    views: 'مشاهدات',
    noArticlesFound: 'لم يتم العثور على مقالات صور سايباو',
    tryDifferentSearch: 'جرب مصطلحات بحث مختلفة أو تصفح جميع محتويات صور سايباو.',
    ctaTitle: 'جاهز لإتقان إنشاء صور سايباو؟',
    ctaDescription: 'انضم إلى آلاف المنشئين الذين ثورأوا استراتيجية المحتوى الخاصة بهم باستخدام تقنية صور سايباو وحققوا نجاحًا فيروسيًا.',
    startCreating: 'إنشاء صور سايباو',
    viewMoreCases: 'عرض المزيد من حالات صور سايباو'
  }

  const getText = (key: string) => {
    return staticTexts[key as keyof typeof staticTexts] || key
  }

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog')
        const data = await response.json()

        if (data.success) {
          setBlogPosts(data.posts)
        } else {
          console.error('خطأ في استرجاع مقالات مدونة صور سايباو:', data.error)
        }
      } catch (error) {
        console.error('خطأ في استرجاع محتوى صور سايباو:', error)
      } finally {
        setPostsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  const getCategories = () => {
    const categories = [
      { name: getText('allCategory'), key: 'all', count: blogPosts.length, description: 'جميع محتويات صور سايباو' }
    ]

    const categoryMap = new Map()
    blogPosts.forEach(post => {
      const category = post.category || 'other'
      if (!categoryMap.has(category)) {
        categoryMap.set(category, 0)
      }
      categoryMap.set(category, categoryMap.get(category) + 1)
    })

    const sybauPictureCategories = [
      { name: 'دروس صور سايباو', key: 'tutorials', description: 'أدلة خطوة بخطوة لصور سايباو' },
      { name: 'قصص نجاح صور سايباو', key: 'success', description: 'قصص نجاح حقيقية من منشئي صور سايباو' },
      { name: 'نصائح صور سايباو', key: 'tips', description: 'نصائح احترافية لإنشاء صور سايباو' },
      { name: 'اتجاهات صور سايباو', key: 'trends', description: 'أحدث اتجاهات وتحديثات صور سايباو' },
      { name: 'مجتمع صور سايباو', key: 'community', description: 'قصص المجتمع والمحتوى المميز' }
    ]

    sybauPictureCategories.forEach(cat => {
      categories.push({
        ...cat,
        count: categoryMap.get(cat.name) || 0
      })
    })

    return categories
  }

  useEffect(() => {
    if (postsLoading) return

    let filtered = blogPosts

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => {
        const category = post.category || 'other'
        return category.toLowerCase().replace(/\s+/g, '-') === selectedCategory
      })
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredPosts(filtered)
  }, [searchTerm, selectedCategory, postsLoading, blogPosts])

  const formatDateLocal = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const getFeaturedPosts = () => {
    return blogPosts.filter(post => post.featured)
  }

  if (postsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50" dir="rtl">
      {/* قسم البطل */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <Badge className="bg-white/20 text-white px-4 py-2 text-sm font-medium">
              <BookOpen className="w-4 h-4 mr-2" />
              مركز تعلم صور سايباو الرسمي
            </Badge>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            {getText('title')}
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            {getText('description')} يحتوي مركز تعلم صور سايباو الخاص بنا على كل ما تحتاجه لتصبح منشئ محتوى فيروسي.
          </p>

          {/* الإحصائيات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.totalSybauPictureGuides}+</div>
              <div className="text-sm text-white/80">أدلة صور سايباو</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.sybauPictureCreators.toLocaleString()}+</div>
              <div className="text-sm text-white/80">منشئو صور سايباو</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.successfulSybauPictureCampaigns.toLocaleString()}+</div>
              <div className="text-sm text-white/80">حملات صور سايباو ناجحة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.averageViralRate}%</div>
              <div className="text-sm text-white/80">معدل الانتشار الفيروسي</div>
            </div>
          </div>

          {/* شريط البحث */}
          <div className="max-w-2xl mx-auto mb-8">
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

          {/* دعوة للعمل */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/ar/generator">
              <Button size="lg" className="bg-white text-purple-600 /90 px-8 py-3 text-lg font-semibold">
                <Rocket className="w-5 h-5 mr-2" />
                {getText('startCreating')}
              </Button>
            </Link>
            <Link href="/ar/gallery">
              <Button size="lg" variant="outline" className="border-white text-white /10 px-8 py-3 text-lg font-semibold">
                <Eye className="w-5 h-5 mr-2" />
                {getText('viewMoreCases')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* المحتوى الرئيسي */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/ar" className="inline-flex items-center text-gray-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2 rotate-180" />
            {getText('backToHome')}
          </Link>
        </div>

        {/* مرشحات الفئة */}
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

        {/* قائمة المقالات */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {getText('latestArticles')}
          </h2>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {getText('noArticlesFound')}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {getText('tryDifferentSearch')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden transition-shadow duration-300">
                  <div className="aspect-video bg-gradient-to-br from-purple-400 to-cyan-400 relative">
                    {post.category && (
                      <Badge className="absolute top-4 right-4 bg-white/20 text-white">
                        {post.category}
                      </Badge>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDateLocal(post.publishedAt)}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime || 5} {getText('minutesRead')}
                      </div>
                    </div>
                    <CardTitle className="text-xl transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {formatViewCount(post.viewCount || 0)} {getText('views')}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          4.9
                        </div>
                      </div>
                      <Link href={`/ar/blog/${post.slug}`}>
                        <Button variant="outline" size="sm">
                          {getText('readArticle')}
                          <ArrowRight className="w-4 h-4 ml-2 rotate-180" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* دعوة للعمل */}
        <section className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-8 text-center text-white mt-16">
          <h2 className="text-3xl font-bold mb-4">
            {getText('ctaTitle')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {getText('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/ar/generator">
              <Button size="lg" className="bg-white text-purple-600 /90 px-8 py-3 text-lg font-semibold">
                <Rocket className="w-5 h-5 mr-2" />
                {getText('startCreating')}
              </Button>
            </Link>
            <Link href="/ar/gallery">
              <Button size="lg" variant="outline" className="border-white text-white /10 px-8 py-3 text-lg font-semibold">
                <Eye className="w-5 h-5 mr-2" />
                {getText('viewMoreCases')}
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
