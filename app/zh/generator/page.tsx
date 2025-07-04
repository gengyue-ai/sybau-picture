import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Star, Sparkles, Rocket, Camera, Users } from 'lucide-react'
import { Metadata } from 'next'
import ImageGeneratorFixed from '@/components/ImageGeneratorFixed'

export const metadata: Metadata = {
  title: '图片生成器 - 创建令人惊叹的AI生成表情包 | Sybau Picture',
  description: '使用我们先进的图片生成器，几秒钟内将任何照片转换为病毒式Sybau表情包。免费、快速、无需注册。体验AI驱动的图片生成器的力量。',
  keywords: ['图片生成器', 'AI图片生成器', 'Sybau图片生成器', '表情包生成器', '免费图片生成器', 'AI工具', '图片编辑器'],
}

const stats = [
  { number: '1,250,000+', label: '图片生成器创建次数' },
  { number: '250,000+', label: '图片生成器用户' },
  { number: '4.9/5', label: '图片生成器评分' },
  { number: '150+', label: '图片生成器服务国家' }
]

export default function ZHGeneratorPage() {
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
            <span className="text-xl font-bold">Sybau 图片生成器</span>
          </div>

          <div></div>
        </div>
      </header>

      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AI图片生成器
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
              强大的AI图片生成器
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              使用我们革命性的图片生成器，几秒钟内将任何照片转换为病毒式Sybau表情包。这个图片生成器采用最先进的AI技术，为您提供最佳的图片生成体验。
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              立即开始
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-200 text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              了解更多
            </Button>
          </div>
        </div>

        {/* 图片生成器功能区域 */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">开始使用图片生成器</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              上传您的照片或输入提示词，让AI为您创建独特的Sybau风格表情包
            </p>
          </div>

          <ImageGeneratorFixed
            texts={{
              uploadTitle: "上传图片",
              uploadDescription: "将您的照片上传到我们的AI图片生成器",
              uploadPlaceholder: "选择图片文件",
              settingsTitle: "图片生成器设置",
              settingsDescription: "自定义您的图片生成器参数",
              styleLabel: "风格选择",
              styleOption: "经典 Sybau",
              styleDescription: "正宗的 Sybau 风格图片生成器",
              promptLabel: "提示词（可选）",
              promptPlaceholder: "描述您想要的图片效果...",
              generateButton: "AI生成图片",
              downloadButton: "下载图片",
              generating: "正在生成...",
              success: "生成成功！",
              error: "生成失败",
              maxFileSize: "最大 5MB",
              supportedFormats: "支持 JPG, PNG, WEBP",
              dragAndDrop: "拖拽图片到此处",
              clickToBrowse: "或点击选择文件",
              intensityLabel: "强度等级",
              modeLabel: "Sybau风格模式",
              classicMode: "经典Sybau",
              exaggeratedMode: "夸张Sybau",
              professionalMode: "专业Sybau",
              creativeMode: "创意Sybau",
              classicDescription: "传统Sybau风格，平衡的幽默感",
              exaggeratedDescription: "夸张表情，最大化冲击力",
              professionalDescription: "适合商务使用的微妙Sybau风格",
              creativeDescription: "独特创意的艺术诠释"
            }}
          />
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-8 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">准备开始使用图片生成器了吗？</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            加入数百万用户，体验最先进的AI图片生成器。立即开始创建您的病毒式表情包！
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              立即开始
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              了解更多
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
