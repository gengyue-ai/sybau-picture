'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Users,
  Clock,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Zap,
  Upload,
  Download,
  Settings,
  Shield
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ZHHelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const categories = [
    { id: 'all', name: '全部', icon: BookOpen },
    { id: 'getting-started', name: '快速开始', icon: Zap },
    { id: 'features', name: '功能介绍', icon: Settings },
    { id: 'upload', name: '上传问题', icon: Upload },
    { id: 'generation', name: '生成问题', icon: Download },
    { id: 'account', name: '账户管理', icon: Users },
    { id: 'technical', name: '技术支持', icon: Shield }
  ]

  const faqData = [
    {
      id: 'how-to-start',
      category: 'getting-started',
      question: '如何开始使用Sybau Picture？',
      answer: '1. 访问我们的生成器页面 2. 上传您的图片或输入文字描述 3. 选择Sybau Lazer Dim 700风格 4. 点击生成按钮，等待8秒即可获得您的专属表情包！'
    },
    {
      id: 'supported-formats',
      category: 'upload',
      question: '支持哪些图片格式？',
      answer: '我们支持 JPG、PNG、WebP 格式的图片。建议图片尺寸不超过10MB，分辨率在500x500到2000x2000像素之间效果最佳。'
    },
    {
      id: 'generation-time',
      category: 'generation',
      question: '生成一张图片需要多长时间？',
      answer: '我们的AI引擎通常在8秒内完成图片生成。高峰期可能需要10-15秒。如果超过30秒仍未完成，请刷新页面重试。'
    },
    {
      id: 'free-usage',
      category: 'account',
      question: '免费用户有什么限制？',
      answer: '免费用户每天可以生成10张图片，单次上传图片大小限制为5MB。注册用户可享受更高的生成限额和优先队列。'
    },
    {
      id: 'style-options',
      category: 'features',
      question: '有哪些风格可以选择？',
      answer: '我们专注于Sybau Lazer Dim 700风格，包含：经典模式、夸张模式、创意模式和专业模式。每种模式都有独特的视觉效果。'
    },
    {
      id: 'download-quality',
      category: 'generation',
      question: '生成的图片质量如何？',
      answer: '我们生成的图片为高清质量，默认输出1024x1024像素。付费用户可选择更高分辨率，最高支持2048x2048像素。'
    },
    {
      id: 'commercial-use',
      category: 'account',
      question: '可以商业使用生成的图片吗？',
      answer: '是的！您拥有生成图片的完整使用权，可以用于个人和商业目的。但请确保上传的原始图片没有版权问题。'
    },
    {
      id: 'api-access',
      category: 'technical',
      question: '是否提供API接口？',
      answer: '我们为开发者提供RESTful API。您可以在开发者页面申请API密钥，查看详细的接口文档和使用示例。'
    }
  ]

  const supportOptions = [
    {
      icon: MessageCircle,
      title: '在线客服',
      description: '即时聊天支持',
      available: '24/7 在线',
      action: '开始聊天'
    },
    {
      icon: HelpCircle,
      title: '常见问题',
      description: '快速找到答案',
      available: '随时查看',
      action: '浏览FAQ'
    },
    {
      icon: BookOpen,
      title: '使用教程',
      description: '详细操作指南',
      available: '视频+图文',
      action: '查看教程'
    }
  ]

  const quickLinks = [
    { title: '快速开始指南', href: '/help/getting-started' },
    { title: '风格使用指南', href: '/help/styles' },
    { title: '最佳实践', href: '/help/best-practices' },
    { title: 'API文档', href: '/help/api' },
    { title: '社区规则', href: '/help/community' },
    { title: '隐私政策', href: '/privacy' },
    { title: '服务条款', href: '/terms' }
  ]

  // 过滤FAQ
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/zh" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">返回首页</span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">帮助中心</span>
          </div>

          <Link href="/zh/generator">
            <Button>试用生成器</Button>
          </Link>
        </div>
      </header>

      <div className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4">帮助与支持</Badge>
          <h1 className="text-4xl font-bold mb-6">
            我们能为您做什么？
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            找到常见问题的答案，学习如何使用我们的功能，或联系我们的支持团队。
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="搜索帮助文章..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  问题分类
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>快速链接</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center text-sm hover:text-primary transition-colors py-1"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    {link.title}
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>仍需帮助？</CardTitle>
                <CardContent className="p-0">
                  <p className="text-sm text-muted-foreground">
                    我们的支持团队随时为您服务
                  </p>
                </CardContent>
              </CardHeader>
              <CardContent>
                <Link href="/zh/contact">
                  <Button className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    联系客服
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Support Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {supportOptions.map((option, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <option.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardContent className="p-0">
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </CardContent>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mb-3">
                      <Clock className="h-3 w-3" />
                      <span>{option.available}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  常见问题解答
                </CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    找到最常见问题的答案 ({filteredFAQs.length} 个结果)
                  </p>
                </CardContent>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="border rounded-lg p-4">
                    <button
                      className="flex items-center justify-between w-full text-left"
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    >
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="mt-3 text-gray-600">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Additional Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  更多资源
                </CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">
                    探索更多方式来充分利用Sybau Picture
                  </p>
                </CardContent>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold">学习资源</h3>
                    <div className="space-y-2">
                      <Link href="/zh/blog" className="block text-sm hover:text-primary transition-colors">
                        • 博客和教程
                      </Link>
                      <Link href="/help/video-guides" className="block text-sm hover:text-primary transition-colors">
                        • 视频指南
                      </Link>
                      <Link href="/help/webinars" className="block text-sm hover:text-primary transition-colors">
                        • 在线讲座
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">社区</h3>
                    <div className="space-y-2">
                      <Link href="/zh/community" className="block text-sm hover:text-primary transition-colors">
                        • 社区论坛
                      </Link>
                      <Link href="/discord" className="block text-sm hover:text-primary transition-colors">
                        • Discord服务器
                      </Link>
                      <Link href="/zh/gallery" className="block text-sm hover:text-primary transition-colors">
                        • 用户作品集
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="border-t my-6" />

                <div className="text-center">
                  <h3 className="font-semibold mb-2">找不到您要的答案？</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    我们的支持团队7x24小时为您服务
                  </p>
                  <Link href="/zh/community">
                    <Button>
                      <Users className="mr-2 h-4 w-4" />
                      加入社区
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
