import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Search, TrendingUp, Heart, Download, Share2, Eye, Star, Sparkles, Zap, Award, Clock, Rocket, Shield, Users, Check } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sybau 갤러리 - 놀라운 AI 밈 작품들을 탐색하세요',
  description: '우리 커뮤니티가 첨단 AI 기술을 사용하여 만든 수천 개의 재미있는 Sybau 밈을 발견하세요. 풍부한 Sybau 걸작 컬렉션을 탐색해보세요.',
  keywords: ['Sybau갤러리', 'Sybau', 'AI밈', 'Sybau밈', '밈갤러리', 'AI생성콘텐츠'],
}

// 데모용 정적 모크 데이터
const mockImages = [
  {
    id: '1',
    title: 'Sybau 클래식 스마일',
    description: 'Sybau AI 기술로 만든 완벽한 밈',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    likes: 1245,
    downloads: 892,
    views: 15420,
    category: 'classic',
    tags: ['Sybau', '재미있는', '클래식'],
    creator: 'Sybau사용자123'
  },
  {
    id: '2',
    title: 'Sybau 놀란 표정',
    description: 'Sybau 스타일의 놀란 표정, 완벽한 바이럴 콘텐츠',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616c5e2671b?w=400&h=400&fit=crop',
    likes: 2156,
    downloads: 1543,
    views: 28930,
    category: 'trending',
    tags: ['Sybau', '놀람', '바이럴'],
    creator: 'Sybau마스터'
  },
  {
    id: '3',
    title: 'Sybau 프로페셔널 스타일',
    description: '비즈니스 용도에 완벽한 전문적인 Sybau 밈',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    likes: 876,
    downloads: 654,
    views: 12340,
    category: 'professional',
    tags: ['Sybau', '비즈니스', '전문적'],
    creator: 'Sybau전문가'
  },
  {
    id: '4',
    title: 'Sybau 행복한 시간',
    description: '기쁨이 가득한 Sybau 밈',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    likes: 1987,
    downloads: 1234,
    views: 23450,
    category: 'fun',
    tags: ['Sybau', '행복', '재미'],
    creator: 'Sybau크리에이터'
  },
  {
    id: '5',
    title: 'Sybau 사고 모드',
    description: 'Sybau의 깊은 사고 밈',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    likes: 1543,
    downloads: 987,
    views: 18760,
    category: 'creative',
    tags: ['Sybau', '사고', '깊은'],
    creator: 'Sybau철학자'
  },
  {
    id: '6',
    title: 'Sybau 스포츠 스타일',
    description: 'Sybau 스포츠 테마 밈',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    likes: 2345,
    downloads: 1876,
    views: 32100,
    category: 'sports',
    tags: ['Sybau', '스포츠', '에너지'],
    creator: 'Sybau운동선수'
  }
]

const categories = [
  { id: 'all', name: '모든 Sybau 작품', count: 125000 },
  { id: 'trending', name: '인기 Sybau', count: 15000 },
  { id: 'classic', name: '클래식 Sybau', count: 25000 },
  { id: 'fun', name: '재미있는 Sybau', count: 18000 },
  { id: 'professional', name: '전문적 Sybau', count: 12000 },
  { id: 'creative', name: '창의적 Sybau', count: 20000 },
  { id: 'sports', name: '스포츠 Sybau', count: 8000 }
]

const stats = [
  { number: '1,250,000+', label: 'Sybau 작품 총수' },
  { number: '250,000+', label: 'Sybau 크리에이터' },
  { number: '50M+', label: 'Sybau 조회수' },
  { number: '4.9/5', label: 'Sybau 사용자 평점' }
]

const features = [
  {
    icon: Star,
    title: '고품질 Sybau 작품',
    description: '우리의 Sybau 갤러리는 최고 품질의 AI 생성 밈을 특징으로 하며, 각 작품은 신중하게 큐레이션됩니다.'
  },
  {
    icon: Users,
    title: 'Sybau 커뮤니티',
    description: 'Sybau 갤러리는 최고의 Sybau 스타일 밈을 공유하는 글로벌 크리에이터 커뮤니티에 의해 구동됩니다.'
  },
  {
    icon: TrendingUp,
    title: 'Sybau 트렌드',
    description: '우리 갤러리에서 최신 트렌드와 바이럴 Sybau 밈을 발견하고 최신 정보를 얻으세요.'
  }
]

export default function KOGalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/ko" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">홈으로 돌아가기</span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">Sybau 갤러리</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/ko/generator">
              <Button>밈 만들기</Button>
            </Link>
            <Link href="/ko/about">
              <Button variant="outline">소개</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Sybau 밈 갤러리
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Sybau 세계를 탐험하세요
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            궁극의 Sybau 밈 갤러리에 오신 것을 환영합니다! 여기서 우리의 글로벌 커뮤니티가 첨단 AI 기술을 사용하여 만든 수천 개의 놀라운 Sybau 작품을 발견할 수 있습니다. 각 Sybau 밈은 AI와 인간 창의성의 완벽한 조합을 보여주는 독특한 예술 작품입니다. 풍부한 Sybau 컬렉션을 탐색하고, 감정을 표현하기에 완벽한 밈을 찾거나, 자신만의 Sybau 걸작을 만들기 위한 영감을 얻으세요.
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
                placeholder="Sybau 밈 검색..."
                className="pl-10 py-3 text-lg border-2 border-purple-200 focus:border-purple-400 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Sybau 카테고리</h2>
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
            <h2 className="text-3xl font-bold mb-4">왜 우리의 Sybau 갤러리를 선택해야 할까요?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              우리의 Sybau 갤러리는 최고의 AI 기술과 커뮤니티 큐레이션 콘텐츠를 결합하여 최고의 밈 탐색 경험을 제공합니다.
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
            <h2 className="text-3xl font-bold mb-4">주목받는 Sybau 걸작들</h2>
            <p className="text-lg text-gray-600">우리 커뮤니티에서 가장 인기 있는 Sybau 작품들을 발견하세요</p>
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
                    <span>작성자 {image.creator}</span>
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
              <h2 className="text-3xl font-bold mb-4">Sybau 커뮤니티에 참여하세요</h2>
              <p className="text-xl text-gray-700 mb-8">
                글로벌 Sybau 크리에이터 커뮤니티의 일원이 되어보세요. 작품을 공유하고, 새로운 트렌드를 발견하고, 전 세계의 다른 Sybau 아티스트들과 연결하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/ko/generator">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
                    <Rocket className="w-5 h-5 mr-2" />
                    첫 Sybau 만들기
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-xl">
                  <Users className="w-5 h-5 mr-2" />
                  커뮤니티 탐색
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">완벽한 Sybau 만들기 팁</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              최고의 Sybau 크리에이터들로부터 배우고 이 전문적인 팁들로 기술을 향상시키세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">완벽한 타이밍</h3>
              </div>
              <p className="text-gray-600 mb-4">
                최고의 Sybau 밈은 완벽한 순간을 포착합니다. 메시지를 가장 잘 전달하는 표정을 찾기 위해 다양한 표정을 실험해보세요.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 선명하고 잘 조명된 이미지 사용</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 독특한 표정에 집중</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 다양한 각도 시도</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">최고 품질</h3>
              </div>
              <p className="text-gray-600 mb-4">
                품질은 성공하는 Sybau 밈의 핵심입니다. 갤러리에서 눈에 띄는 콘텐츠를 만들기 위해 이 기준들을 따르세요.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 최소 해상도 400x400px</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 흐린 이미지 피하기</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 진정한 Sybau 스타일 유지</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
