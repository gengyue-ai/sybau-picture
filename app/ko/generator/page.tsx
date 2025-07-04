import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Upload, Download, Share2, Heart, Star, Zap, Clock, Target, TrendingUp, Award, Users, CheckCircle, Sparkles, Rocket, Play, Shield, Award as AwardIcon, Camera, Paintbrush, Wand2 } from 'lucide-react'
import { Metadata } from 'next'
import ImageGeneratorFixed from '@/components/ImageGeneratorFixed'

export const metadata: Metadata = {
  title: '이미지 생성기 - 놀라운 AI 생성 밈 만들기 | Sybau Picture',
  description: '고급 이미지 생성기를 사용하여 몇 초 만에 모든 사진을 바이러스 Sybau 밈으로 변환하세요. 무료, 빠름, 가입 불필요. AI 기반 이미지 생성기의 힘을 경험해보세요.',
  keywords: ['이미지 생성기', 'AI 이미지 생성기', 'Sybau 이미지 생성기', '밈 생성기', '무료 이미지 생성기', 'AI 도구', '이미지 에디터'],
}

const stats = [
  { number: '1,250,000+', label: '이미지 생성기 생성 수' },
  { number: '250,000+', label: '이미지 생성기 사용자' },
  { number: '4.9/5', label: '이미지 생성기 평가' },
  { number: '150+', label: '이미지 생성기 서비스 국가' }
]

export default function KOGeneratorPage() {
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
            <span className="text-xl font-bold">Sybau 이미지 생성기</span>
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
              AI 이미지 생성기
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
              강력한 AI 이미지 생성기
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              저희의 혁신적인 이미지 생성기를 사용하여 몇 초 만에 모든 사진을 바이러스 Sybau 밈으로 변환하세요. 이 이미지 생성기는 최첨단 AI 기술을 채택하여 최고의 이미지 생성 경험을 제공합니다.
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
              지금 시작하기
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-200 text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              자세히 보기
            </Button>
          </div>
        </div>

        {/* 이미지 생성기 기능 영역 */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">이미지 생성기 사용 시작하기</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              사진을 업로드하거나 프롬프트를 입력하여 AI가 독특한 Sybau 스타일 밈을 만들어드립니다
            </p>
          </div>

          <ImageGeneratorFixed
            texts={{
              uploadTitle: "이미지 업로드",
              uploadDescription: "AI 이미지 생성기에 사진을 업로드하세요",
              uploadPlaceholder: "이미지 파일 선택",
              settingsTitle: "이미지 생성기 설정",
              settingsDescription: "이미지 생성기 매개변수를 사용자 정의하세요",
              styleLabel: "스타일 선택",
              styleOption: "클래식 Sybau",
              styleDescription: "정통 Sybau 스타일 이미지 생성기",
              promptLabel: "프롬프트 (선택사항)",
              promptPlaceholder: "원하는 이미지 효과를 설명하세요...",
              generateButton: "AI로 이미지 생성",
              downloadButton: "이미지 다운로드",
              generating: "생성 중...",
              success: "생성 성공!",
              error: "생성 실패",
              maxFileSize: "최대 5MB",
              supportedFormats: "JPG, PNG, WEBP 지원",
              dragAndDrop: "여기에 이미지를 드래그",
              clickToBrowse: "또는 클릭하여 파일 선택"
            }}
          />
        </div>

        {/* Final CTA */}
        <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-8 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">이미지 생성기를 사용할 준비가 되셨나요?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            수백만 명의 사용자와 함께 최첨단 AI 이미지 생성기를 경험하세요. 지금 바로 바이러스 밈 제작을 시작하세요!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              지금 시작하기
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              자세히 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
