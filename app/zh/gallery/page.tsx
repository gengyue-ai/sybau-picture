'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Search, TrendingUp, Heart, Download, Share2, Eye, Star, Sparkles, Zap, Award, Clock, Rocket, Shield, Users, Check } from 'lucide-react'

// 静态模拟数据用于展示
const mockImages = [
  {
    id: '1',
    title: 'Sybau经典笑脸',
    description: '使用Sybau AI技术创建的完美表情包',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    likes: 1245,
    downloads: 892,
    views: 15420,
    category: 'classic',
    tags: ['Sybau', '搞笑', '经典'],
    creator: 'Sybau用户123'
  },
  {
    id: '2',
    title: 'Sybau惊讶表情',
    description: 'Sybau风格的惊讶表情，完美的病毒式内容',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616c5e2671b?w=400&h=400&fit=crop',
    likes: 2156,
    downloads: 1543,
    views: 28930,
    category: 'trending',
    tags: ['Sybau', '惊讶', '病毒式'],
    creator: 'Sybau大师'
  },
  {
    id: '3',
    title: 'Sybau商务风格',
    description: '专业的Sybau表情包，适合商务使用',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    likes: 876,
    downloads: 654,
    views: 12340,
    category: 'professional',
    tags: ['Sybau', '商务', '专业'],
    creator: 'Sybau专家'
  },
  {
    id: '4',
    title: 'Sybau快乐时光',
    description: '充满快乐的Sybau表情包',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    likes: 1987,
    downloads: 1234,
    views: 23450,
    category: 'fun',
    tags: ['Sybau', '快乐', '有趣'],
    creator: 'Sybau创作者'
  },
  {
    id: '5',
    title: 'Sybau思考模式',
    description: 'Sybau深度思考表情包',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    likes: 1543,
    downloads: 987,
    views: 18760,
    category: 'creative',
    tags: ['Sybau', '思考', '深度'],
    creator: 'Sybau哲学家'
  },
  {
    id: '6',
    title: 'Sybau运动风格',
    description: 'Sybau运动主题表情包',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    likes: 2345,
    downloads: 1876,
    views: 32100,
    category: 'sports',
    tags: ['Sybau', '运动', '活力'],
    creator: 'Sybau运动员'
  }
]

const categories = [
  { id: 'all', name: '全部Sybau作品', count: 125000 },
  { id: 'trending', name: '热门Sybau', count: 15000 },
  { id: 'classic', name: '经典Sybau', count: 25000 },
  { id: 'fun', name: '有趣Sybau', count: 18000 },
  { id: 'professional', name: '专业Sybau', count: 12000 },
  { id: 'creative', name: '创意Sybau', count: 20000 },
  { id: 'sports', name: '运动Sybau', count: 8000 }
]

const stats = [
  { number: '1,250,000+', label: 'Sybau作品总数' },
  { number: '250,000+', label: 'Sybau创作者' },
  { number: '50M+', label: 'Sybau浏览量' },
  { number: '4.9/5', label: 'Sybau用户评分' }
]

export default function ZHGalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/zh" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">返回首页</span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">Sybau画廊</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/zh/generator">
              <Button>创建表情包</Button>
            </Link>
            <Link href="/zh/about">
              <Button variant="outline">关于我们</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Sybau表情包画廊
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
            探索Sybau世界
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            欢迎来到Sybau表情包的终极画廊！在这里，您可以发现数千个由我们全球社区使用先进AI技术创建的令人惊叹的Sybau作品。每个Sybau表情包都是独特的艺术品，展现了AI与人类创意的完美结合。
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
                placeholder="搜索Sybau表情包..."
                className="pl-10 py-3 text-lg border-2 border-purple-200 focus:border-purple-400 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Sybau分类</h2>
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

        {/* Gallery Grid */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Sybau杰作展示</h2>
            <p className="text-lg text-gray-600">发现我们社区最受欢迎的Sybau表情包创作</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockImages.map((image) => (
              <Card key={image.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
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
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                      <span className="text-sm font-medium">作者：{image.creator}</span>
                      <div className="flex items-center space-x-3 text-sm">
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {image.likes}
                        </span>
                        <span className="flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          {image.downloads}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{image.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{image.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {image.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = image.imageUrl;
                          link.download = `sybau-${image.category}-${image.id}.jpg`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        下载
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: image.title,
                              text: image.description,
                              url: window.location.href
                            });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                            alert('链接已复制到剪贴板');
                          }
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        分享
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-8 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">准备创建您的Sybau杰作了吗？</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            加入我们的Sybau社区，使用最先进的AI技术创建令人惊叹的表情包。让您的创意在Sybau画廊中闪耀！
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/zh/generator">
              <Button
                size="lg"
                className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
              >
                <Rocket className="mr-2 h-5 w-5" />
                开始创作Sybau
              </Button>
            </Link>
            <Link href="/zh/about">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Users className="w-5 h-5 mr-2" />
                了解更多
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
