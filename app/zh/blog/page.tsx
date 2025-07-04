'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Search, Calendar, Clock, User, ArrowRight, TrendingUp, BookOpen, Tag, Loader2, Eye, Star, Rocket, Heart, Sparkles, Target, Zap, Award, Users, Shield, Check, Play, Lightbulb } from 'lucide-react'
import { formatDate } from '@/lib/utils'

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

export default function ZHBlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)

  // 社区统计
  const [stats] = useState({
    totalSybauPictureGuides: 150,
    sybauPictureCreators: 8500,
    successfulSybauPictureCampaigns: 2300,
    averageViralRate: 78
  })

  // 静态文本（中文）
  const staticTexts = {
    title: 'Sybau图片学习中心',
    description: '通过我们全面的指南、教程和成功故事，掌握Sybau图片创作的艺术。学习如何创建能够在全球吸引观众的病毒式Sybau图片内容。',
    searchPlaceholder: '搜索Sybau图片教程、指南、成功故事...',
    allCategory: '所有Sybau图片内容',
    backToHome: '返回首页',
    featuredStories: '精选Sybau图片故事',
    latestArticles: '最新Sybau图片文章',
    readArticle: '阅读Sybau图片指南',
    readFullStory: '阅读完整Sybau图片故事',
    minutesRead: '分钟阅读',
    views: '浏览',
    articles: '文章',
    noArticlesFound: '未找到Sybau图片文章',
    tryDifferentSearch: '尝试不同的搜索词或浏览所有Sybau图片内容。',
    ctaTitle: '准备掌握Sybau图片创作了吗？',
    ctaDescription: '加入数千名使用Sybau图片技术改变内容策略并获得病毒式成功的创作者行列。',
    startCreating: '开始创作Sybau图片',
    viewMoreCases: '查看更多Sybau图片案例',
    aboutTitle: '关于Sybau图片掌握',
    tutorialsTitle: 'Sybau图片教程',
    successTitle: 'Sybau图片成功故事',
    tipsTitle: 'Sybau图片专业技巧'
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
          console.error('获取Sybau图片博客文章失败:', data.error)
        }
      } catch (error) {
        console.error('获取Sybau图片内容时出错:', error)
      } finally {
        setPostsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  const getCategories = () => {
    const categories = [
      { name: getText('allCategory'), key: 'all', count: blogPosts.length, description: '所有Sybau图片内容' }
    ]

    const categoryMap = new Map()
    blogPosts.forEach(post => {
      const category = post.category || 'other'
      if (!categoryMap.has(category)) {
        categoryMap.set(category, 0)
      }
      categoryMap.set(category, categoryMap.get(category) + 1)
    })

    // 添加Sybau图片特定分类
    const sybauPictureCategories = [
      { name: 'Sybau图片教程', key: 'tutorials', description: '逐步Sybau图片指南' },
      { name: 'Sybau图片成功故事', key: 'success', description: '创作者使用Sybau图片的真实成功案例' },
      { name: 'Sybau图片技巧', key: 'tips', description: '专业Sybau图片创作技巧' },
      { name: 'Sybau图片趋势', key: 'trends', description: '最新Sybau图片趋势和更新' },
      { name: 'Sybau图片社区', key: 'community', description: '社区故事和特色内容' }
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
    return new Date(dateString).toLocaleDateString('zh-CN', {
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

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* 英雄部分 */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <Badge className="bg-white/20 text-white px-4 py-2 text-sm font-medium">
              <BookOpen className="w-4 h-4 mr-2" />
              官方Sybau图片学习中心
            </Badge>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            {getText('title')}
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            {getText('description')} 我们的Sybau图片学习中心包含您成为病毒式内容创作者所需的一切。
          </p>

          {/* 统计数据 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.totalSybauPictureGuides}+</div>
              <div className="text-sm text-white/80">Sybau图片指南</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.sybauPictureCreators.toLocaleString()}+</div>
              <div className="text-sm text-white/80">Sybau图片创作者</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.successfulSybauPictureCampaigns.toLocaleString()}+</div>
              <div className="text-sm text-white/80">成功的Sybau图片活动</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.averageViralRate}%</div>
              <div className="text-sm text-white/80">平均病毒传播率</div>
            </div>
          </div>

          {/* 搜索栏 */}
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

          {/* 行动号召按钮 */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/zh/generator">
              <Button size="lg" className="bg-white text-purple-600 /90 px-8 py-3 text-lg font-semibold">
                <Rocket className="w-5 h-5 mr-2" />
                {getText('startCreating')}
              </Button>
            </Link>
            <Link href="/zh/gallery">
              <Button size="lg" variant="outline" className="border-white text-white /10 px-8 py-3 text-lg font-semibold">
                <Eye className="w-5 h-5 mr-2" />
                {getText('viewMoreCases')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-12">
        {/* 导航 */}
        <div className="mb-8">
          <Link href="/zh" className="inline-flex items-center text-gray-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {getText('backToHome')}
          </Link>
        </div>

        {/* 分类筛选 */}
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

        {/* 精选文章 */}
        {getFeaturedPosts().length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {getText('featuredStories')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFeaturedPosts().slice(0, 3).map((post) => (
                <Card key={post.id} className="overflow-hidden transition-shadow duration-300">
                  <div className="aspect-video bg-gradient-to-br from-purple-400 to-cyan-400 relative">
                    <Badge className="absolute top-4 left-4 bg-white/20 text-white">
                      精选
                    </Badge>
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
                      <Link href={`/zh/blog/${post.slug}`}>
                        <Button variant="outline" size="sm">
                          {getText('readArticle')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* 最新文章 */}
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
                      <Badge className="absolute top-4 left-4 bg-white/20 text-white">
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
                      <Link href={`/zh/blog/${post.slug}`}>
                        <Button variant="outline" size="sm">
                          {getText('readArticle')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* 行动号召部分 */}
        <section className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-8 text-center text-white mt-16">
          <h2 className="text-3xl font-bold mb-4">
            {getText('ctaTitle')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {getText('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/zh/generator">
              <Button size="lg" className="bg-white text-purple-600 /90 px-8 py-3 text-lg font-semibold">
                <Rocket className="w-5 h-5 mr-2" />
                {getText('startCreating')}
              </Button>
            </Link>
            <Link href="/zh/gallery">
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
