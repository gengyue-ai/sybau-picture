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

export default function KOBlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)

  // 통계 데이터
  const [stats] = useState({
    totalSybauPictureGuides: 150,
    sybauPictureCreators: 8500,
    successfulSybauPictureCampaigns: 2300,
    averageViralRate: 78
  })

  // 한국어 정적 텍스트
  const staticTexts = {
    title: 'Sybau 이미지 학습 센터',
    description: '포괄적인 가이드, 튜토리얼, 성공 사례를 통해 Sybau 이미지 제작 기술을 습득하세요. 전 세계 관객을 매혹시키는 바이럴 Sybau 이미지 콘텐츠 제작법을 배워보세요.',
    searchPlaceholder: 'Sybau 이미지 튜토리얼, 가이드, 성공 사례를 검색...',
    allCategory: '모든 Sybau 이미지 콘텐츠',
    backToHome: '홈으로 돌아가기',
    featuredStories: '주요 Sybau 이미지 스토리',
    latestArticles: '최신 Sybau 이미지 아티클',
    readArticle: 'Sybau 이미지 가이드 읽기',
    minutesRead: '분 읽기',
    views: '조회',
    noArticlesFound: 'Sybau 이미지 아티클을 찾을 수 없습니다',
    tryDifferentSearch: '다른 검색어를 시도하거나 모든 Sybau 이미지 콘텐츠를 둘러보세요.',
    ctaTitle: 'Sybau 이미지 제작을 마스터할 준비가 되셨나요?',
    ctaDescription: 'Sybau 이미지 기술로 콘텐츠 전략을 변화시키고 바이럴 성공을 거둔 수천 명의 크리에이터 대열에 합류하세요.',
    startCreating: 'Sybau 이미지 제작 시작',
    viewMoreCases: '더 많은 Sybau 이미지 사례 보기'
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
          console.error('Sybau 이미지 블로그 포스트 가져오기 실패:', data.error)
        }
      } catch (error) {
        console.error('Sybau 이미지 콘텐츠 가져오기 오류:', error)
      } finally {
        setPostsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  const getCategories = () => {
    const categories = [
      { name: getText('allCategory'), key: 'all', count: blogPosts.length, description: '모든 Sybau 이미지 콘텐츠' }
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
      { name: 'Sybau 이미지 튜토리얼', key: 'tutorials', description: '단계별 Sybau 이미지 가이드' },
      { name: 'Sybau 이미지 성공 사례', key: 'success', description: 'Sybau 이미지를 사용한 크리에이터의 실제 성공 사례' },
      { name: 'Sybau 이미지 팁', key: 'tips', description: '전문가의 Sybau 이미지 제작 팁' },
      { name: 'Sybau 이미지 트렌드', key: 'trends', description: '최신 Sybau 이미지 트렌드와 업데이트' },
      { name: 'Sybau 이미지 커뮤니티', key: 'community', description: '커뮤니티 스토리와 특집' }
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
    return new Date(dateString).toLocaleDateString('ko-KR', {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* 히어로 섹션 */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <Badge className="bg-white/20 text-white px-4 py-2 text-sm font-medium">
              <BookOpen className="w-4 h-4 mr-2" />
              공식 Sybau 이미지 학습 센터
            </Badge>
          </div>

          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            {getText('title')}
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            {getText('description')} 저희 Sybau 이미지 학습 센터에는 바이럴 콘텐츠 크리에이터가 되기 위해 필요한 모든 것이 포함되어 있습니다.
          </p>

          {/* 통계 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.totalSybauPictureGuides}+</div>
              <div className="text-sm text-white/80">Sybau 이미지 가이드</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.sybauPictureCreators.toLocaleString()}+</div>
              <div className="text-sm text-white/80">Sybau 이미지 크리에이터</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.successfulSybauPictureCampaigns.toLocaleString()}+</div>
              <div className="text-sm text-white/80">성공한 Sybau 이미지 캠페인</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{stats.averageViralRate}%</div>
              <div className="text-sm text-white/80">평균 바이럴 비율</div>
            </div>
          </div>

          {/* 검색 바 */}
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

          {/* CTA */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/ko/generator">
              <Button size="lg" className="bg-white text-purple-600 /90 px-8 py-3 text-lg font-semibold">
                <Rocket className="w-5 h-5 mr-2" />
                {getText('startCreating')}
              </Button>
            </Link>
            <Link href="/ko/gallery">
              <Button size="lg" variant="outline" className="border-white text-white /10 px-8 py-3 text-lg font-semibold">
                <Eye className="w-5 h-5 mr-2" />
                {getText('viewMoreCases')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/ko" className="inline-flex items-center text-gray-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {getText('backToHome')}
          </Link>
        </div>

        {/* 카테고리 필터 */}
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

        {/* 아티클 리스트 */}
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
                      <Link href={`/ko/blog/${post.slug}`}>
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

        {/* CTA */}
        <section className="bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl p-8 text-center text-white mt-16">
          <h2 className="text-3xl font-bold mb-4">
            {getText('ctaTitle')}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {getText('ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/ko/generator">
              <Button size="lg" className="bg-white text-purple-600 /90 px-8 py-3 text-lg font-semibold">
                <Rocket className="w-5 h-5 mr-2" />
                {getText('startCreating')}
              </Button>
            </Link>
            <Link href="/ko/gallery">
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
