import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Lightbulb, Rocket, Heart, Star, Users, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    "number": "1M+",
    "label": "생성된 밈"
  },
  {
    "number": "25K+",
    "label": "활성 사용자"
  },
  {
    "number": "50+",
    "label": "서비스 국가"
  },
  {
    "number": "99.9%",
    "label": "가동 시간"
  }
]

export default function KOAboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4">회사 소개</Badge>
          <h1 className="text-4xl font-bold mb-6">
            AI로 창의성 강화하기
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            우리는 전문적인 AI 이미지 생성을 모든 곳, 모든 사람이 접근할 수 있도록 하여 밈 제작을 민주화하는 것을 사명으로 합니다. 이미 아이디어를 바이럴 콘텐츠로 변환하고 있는 수백만 명의 크리에이터들과 함께하세요.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Breaking down barriers between imagination and creation. We believe everyone has the potential to create content that resonates, entertains, and connects people across cultures.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                A world where creativity knows no bounds. We envision a future where AI amplifies human creativity rather than replacing it.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">창작을 시작할 준비가 되셨나요?</h2>
              <p className="text-xl mb-8 text-purple-100">
                Sybau Picture로 이미 바이럴 콘텐츠를 만들고 있는 수천 명의 크리에이터들과 함께하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/ko/generator">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    <Rocket className="h-5 w-5 mr-2" />
                    창작 시작하기
                  </Button>
                </Link>
                <Link href="/ko/gallery">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white">
                    <Heart className="w-5 h-5 mr-2" />
                    예시 보기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}