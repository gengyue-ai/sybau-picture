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
import { usePathname } from 'next/navigation'
import { generateLocalizedLink } from '@/lib/i18n'

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

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const pathname = usePathname()

  // Community stats
  const [stats] = useState({
    totalSybauPictureGuides: 150,
    sybauPictureCreators: 8500,
    successfulSybauPictureCampaigns: 2300,
    averageViralRate: 78
  })

  // Static texts with Sybau Picture keyword optimization
  const staticTexts = {
    title: 'Sybau Picture Learning Hub',
    description: 'Master the art of Sybau Picture creation with our comprehensive guides, tutorials, and success stories. Learn how to create viral Sybau Picture content that captivates audiences worldwide.',
    searchPlaceholder: 'Search Sybau Picture tutorials, guides, success stories...',
    allCategory: 'All Sybau Picture Content',
    backToHome: 'Back to Home',
    featuredStories: 'Featured Sybau Picture Stories',
    latestArticles: 'Latest Sybau Picture Articles',
    readArticle: 'Read Sybau Picture Guide',
    readFullStory: 'Read Full Sybau Picture Story',
    minutesRead: 'min read',
    views: 'views',
    articles: 'articles',
    noArticlesFound: 'No Sybau Picture articles found',
    tryDifferentSearch: 'Try a different search term or browse all Sybau Picture content.',
    ctaTitle: 'Ready to Master Sybau Picture Creation?',
    ctaDescription: 'Join thousands of creators who have transformed their content strategy with Sybau Picture techniques and achieved viral success.',
    startCreating: 'Start Creating Sybau Picture',
    viewMoreCases: 'View More Sybau Picture Cases',
    aboutTitle: 'About Sybau Picture Mastery',
    tutorialsTitle: 'Sybau Picture Tutorials',
    successTitle: 'Sybau Picture Success Stories',
    tipsTitle: 'Pro Sybau Picture Tips'
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
          console.error('Failed to fetch Sybau Picture blog posts:', data.error)
        }
      } catch (error) {
        console.error('Error fetching Sybau Picture content:', error)
      } finally {
        setPostsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  const getCategories = () => {
    const categories = [
      { name: getText('allCategory'), key: 'all', count: blogPosts.length, description: 'All Sybau Picture content' }
    ]

    const categoryMap = new Map()
    blogPosts.forEach(post => {
      const category = post.category || 'other'
      if (!categoryMap.has(category)) {
        categoryMap.set(category, 0)
      }
      categoryMap.set(category, categoryMap.get(category) + 1)
    })

    // Add Sybau Picture specific categories
    const sybauPictureCategories = [
      { name: 'Sybau Picture Tutorials', key: 'tutorials', description: 'Step-by-step Sybau Picture guides' },
      { name: 'Sybau Picture Success Stories', key: 'success', description: 'Real creator success with Sybau Picture' },
      { name: 'Sybau Picture Tips', key: 'tips', description: 'Expert Sybau Picture creation tips' },
      { name: 'Sybau Picture Trends', key: 'trends', description: 'Latest Sybau Picture trends and updates' },
      { name: 'Sybau Picture Community', key: 'community', description: 'Community stories and features' }
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
    return new Date(dateString).toLocaleDateString('en-US', {
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
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <Badge className="bg-white/20 text-white px-4 py-2 text-sm font-medium">
              <BookOpen className="w-4 h-4 mr-2" />
              Official Sybau Picture Learning Center
            </Badge>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            {getText('title')}
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            {getText('description')} Our Sybau Picture learning hub contains everything you need to become a viral content creator.
          </p>

          <div className="max-w-xl mx-auto relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={getText('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg bg-white/95 backdrop-blur-sm border-white/20 focus:border-white/40 rounded-xl"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge className="bg-purple-400 text-white px-4 py-2">
              <BookOpen className="w-4 h-4 mr-2" />
              {stats.totalSybauPictureGuides}+ Sybau Picture Guides
            </Badge>
            <Badge className="bg-pink-400 text-white px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              {stats.sybauPictureCreators}+ Learners
            </Badge>
            <Badge className="bg-cyan-400 text-white px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              {stats.successfulSybauPictureCampaigns}+ Success Stories
            </Badge>
          </div>

          <div>
            <Link href={generateLocalizedLink('/', pathname)}>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {getText('backToHome')}
              </Button>
            </Link>
            <Link href={generateLocalizedLink('/generator', pathname)}>
              <Button className="bg-white text-purple-600">
                <Rocket className="w-4 h-4 mr-2" />
                Try Sybau Picture Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Sybau Picture Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">
              {getText('aboutTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Sybau Picture is revolutionizing content creation by making viral meme generation accessible to everyone. Our comprehensive learning resources help creators master the art of Sybau Picture creation, from basic techniques to advanced viral strategies. Whether you're new to Sybau Picture or looking to refine your skills, our curated content provides the knowledge and inspiration you need to succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Sybau Picture Fundamentals</h3>
                <p className="text-gray-600">Learn the core principles of Sybau Picture creation, understanding what makes content viral and how to apply these techniques effectively.</p>
              </CardContent>
            </Card>

            <Card className="transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Viral Sybau Picture Strategies</h3>
                <p className="text-gray-600">Discover proven strategies for making your Sybau Picture content go viral, including timing, platforms, and engagement techniques.</p>
              </CardContent>
            </Card>

            <Card className="transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Sybau Picture Community</h3>
                <p className="text-gray-600">Connect with fellow Sybau Picture creators, share experiences, and learn from the community's collective knowledge and success stories.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-white/50 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Explore Sybau Picture Content</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Browse our comprehensive collection of Sybau Picture resources, organized by category to help you find exactly what you need for your creative journey.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {getCategories().map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.key)}
                className={`rounded-full transition-all ${
                  selectedCategory === category.key
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : ''
                }`}
                title={category.description}
              >
                {category.name}
                <Badge variant="secondary" className="ml-2 bg-white/20">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {getFeaturedPosts().length > 0 && (
        <section className="py-16 bg-gradient-to-br from-purple-100 to-pink-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
                {getText('featuredStories')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Handpicked Sybau Picture success stories and tutorials that have helped thousands of creators achieve viral status.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {getFeaturedPosts().slice(0, 3).map((post) => (
                <Card key={post.id} className=" transition-all duration-300 ">
                  <div className="relative h-48 bg-gradient-to-br from-purple-400 to-pink-400">
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Star className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm font-medium">Featured Sybau Picture Content</p>
                      </div>
                    </div>
                    <Badge className="absolute top-4 left-4 bg-yellow-500 text-black">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        Sybau Picture {post.category || 'Guide'}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime || calculateReadTime(post.content || post.excerpt)} {getText('minutesRead')}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDateLocal(post.publishedAt)}
                      </div>
                      {post.viewCount && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="w-4 h-4 mr-1" />
                          {formatViewCount(post.viewCount)} {getText('views')}
                        </div>
                      )}
                    </div>

                    <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      {getText('readFullStory')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
              {getText('latestArticles')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay updated with the latest Sybau Picture techniques, trends, and success stories from our community of creators.
            </p>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">{getText('noArticlesFound')}</h3>
              <p className="text-gray-500 mb-6">{getText('tryDifferentSearch')}</p>
              <Button onClick={() => {
                setSelectedCategory('all')
                setSearchTerm('')
              }}>
                View All Sybau Picture Content
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className=" transition-all duration-300 ">
                  <div className="relative h-40 bg-gradient-to-br from-cyan-400 to-blue-400">
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <div className="text-white text-center">
                        <BookOpen className="w-6 h-6 mx-auto mb-2" />
                        <p className="text-xs font-medium">Sybau Picture Article</p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {post.category || 'Sybau Picture'}
                      </Badge>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime || calculateReadTime(post.content || post.excerpt)} {getText('minutesRead')}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDateLocal(post.publishedAt)}
                      </div>
                      {post.viewCount && (
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {formatViewCount(post.viewCount)}
                        </div>
                      )}
                    </div>

                    <Button variant="outline" className="w-full text-sm">
                      {getText('readArticle')}
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Success Stories Stats */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">
              Sybau Picture Success Metrics
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Our Sybau Picture community continues to achieve remarkable results. These metrics showcase the power of learning and applying Sybau Picture techniques effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalSybauPictureGuides}</div>
              <div className="text-gray-600">Sybau Picture Guides</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl">
              <div className="text-3xl font-bold text-pink-600 mb-2">{stats.sybauPictureCreators.toLocaleString()}</div>
              <div className="text-gray-600">Active Learners</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl">
              <div className="text-3xl font-bold text-cyan-600 mb-2">{stats.successfulSybauPictureCampaigns.toLocaleString()}</div>
              <div className="text-gray-600">Success Stories</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.averageViralRate}%</div>
              <div className="text-gray-600">Average Viral Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">
              {getText('tipsTitle')}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Essential Sybau Picture creation tips from our most successful creators. These proven strategies will help you create compelling Sybau Picture content that engages audiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-white to-purple-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
                  Mastering Sybau Picture Aesthetics
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    Study successful Sybau Picture examples to understand effective visual patterns
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    Choose high-quality source images for optimal Sybau Picture transformation
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    Experiment with different Sybau Picture styles to find your unique voice
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    Practice regularly to develop your Sybau Picture creation intuition
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-cyan-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Rocket className="w-6 h-6 mr-2 text-cyan-600" />
                  Viral Sybau Picture Distribution
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    Time your Sybau Picture posts for maximum audience engagement
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    Use relevant hashtags to increase your Sybau Picture content discoverability
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    Engage with the Sybau Picture community to build your network
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    Cross-platform promotion amplifies your Sybau Picture reach
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              {getText('ctaTitle')}
            </h2>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
              {getText('ctaDescription')} Start your Sybau Picture journey today and unlock the power of viral content creation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href={generateLocalizedLink('/generator', pathname)}>
                <Button
                  size="lg"
                  className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  {getText('startCreating')}
                </Button>
              </Link>
              <Link href={generateLocalizedLink('/gallery', pathname)}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  <Star className="mr-2 h-5 w-5" />
                  {getText('viewMoreCases')}
                </Button>
              </Link>
            </div>

            <div className="text-center text-white/80">
              <p className="mb-4">Learn • Create • Share • Succeed with Sybau Picture</p>
              <div className="flex justify-center items-center space-x-6 flex-wrap">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Free Sybau Picture Tutorials</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Active Sybau Picture Community</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  <span>Proven Sybau Picture Success</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
