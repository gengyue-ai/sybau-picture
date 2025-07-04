'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Lightbulb, Rocket, Heart, Star, Users, Zap, Shield, Clock, Award } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const values = [
  {
    icon: Star,
    title: '创新',
    description: '推动AI技术边界，创造前所未有的创意工具。'
  },
  {
    icon: Users,
    title: '包容',
    description: '让每个人都能享受创意表达的乐趣，无论技术水平如何。'
  },
  {
    icon: Zap,
    title: '质量',
    description: '追求卓越，提供最高质量的AI生成内容。'
  },
  {
    icon: Shield,
    title: '可靠',
    description: '构建用户可以信赖的稳定、安全的平台。'
  }
]

const teamMembers = [
  {
    name: 'Alex Chen',
    role: 'CEO & 创始人',
    bio: '连续创业者，拥有5年AI/ML经验。曾在Microsoft Azure AI团队担任产品负责人。2025年创立Sybau Picture，致力于让创意内容生成民主化。',
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    avatarFallback: "AC"
  },
  {
    name: 'Sarah Kim',
    role: 'CTO & 联合创始人',
    bio: 'AI研究科学家，斯坦福大学博士。前OpenAI和Google Brain ML工程师。专攻计算机视觉和生成式AI模型。',
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    avatarFallback: "SK"
  },
  {
    name: 'David Rodriguez',
    role: '产品设计总监',
    bio: '创意技术专家和UX设计师。曾任职于Figma和Adobe。致力于通过直观设计让AI工具惠及每个人。',
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    avatarFallback: "DR"
  },
  {
    name: 'Lisa Zhang',
    role: '首席AI工程师',
    bio: '计算机视觉专家，深度学习背景。前Meta AI研究科学家。专注于提升生成式AI性能和安全性。',
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    avatarFallback: "LZ"
  }
]

const milestones = [
  {
    year: '2025年1月',
    title: '公司成立',
    description: 'Alex Chen和Sarah Kim创立Sybau Picture，获得200万美元种子轮融资。使命：通过AI让创意内容民主化。'
  },
  {
    year: '2025年3月',
    title: 'MVP发布',
    description: '发布核心Sybau Lazer Dim 700风格生成的测试版本。首批1000用户创作超过1万张图像。'
  },
  {
    year: '2025年6月',
    title: '公测上线',
    description: '开放公测版本，增强AI模型功能。用户突破1万人，生成超过10万张病毒式传播图像。'
  },
  {
    year: '2025年9月',
    title: '全球扩张',
    description: '推出10种语言的多语言支持。服务扩展至全球50多个国家的创作者。'
  }
]

const stats = [
  { number: "15万+", label: '表情包创作' },
  { number: "2.5万+", label: '活跃用户' },
  { number: "50+", label: '服务国家' },
  { number: "99.5%", label: '在线时间' }
]

export default function ZHAboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4">关于我们</Badge>
          <h1 className="text-4xl font-bold mb-6">
            通过AI赋能创意
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Sybau Picture是2025年成立的AI初创公司，致力于让专业级图像生成技术普及到每个人。我们的团队来自顶尖科技公司，专注于Sybau Lazer Dim 700风格的AI图像生成，帮助创作者轻松制作病毒式内容。
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
              <CardTitle>我们的使命</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                打破想象与创作之间的壁垒。我们相信每个人都有创造共鸣、娱乐和跨文化连接内容的潜力。我们的AI技术是您的创意与病毒式表情包之间的桥梁。
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>我们的愿景</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                一个创意无界的世界。我们憧憬一个AI放大而非替代人类创造力的未来，任何人都能通过引人注目的视觉内容表达独特观点，技术成为全球文化交流的催化剂。
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">我们的价值观</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              指导我们每一个决策和每一个功能开发的原则。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">认识我们的团队</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              让Sybau Picture成为现实的创意思维和技术专家。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => {
              const MemberAvatar = () => {
                const [imageError, setImageError] = useState(false);

                return (
                  <div className="h-20 w-20 rounded-full mx-auto mb-4 overflow-hidden">
                    {!imageError ? (
                      <Image
                        src={member.avatar}
                        alt={`${member.name} - ${member.role}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{member.avatarFallback}</span>
                      </div>
                    )}
                  </div>
                );
              };

              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <MemberAvatar />
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <Badge variant="secondary" className="mx-auto">{member.role}</Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {member.bio}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">我们的历程</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              从简单的想法到改变创意表达的全球平台。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <Card key={index}>
                <CardHeader>
                  <Badge className="w-fit">{milestone.year}</Badge>
                  <CardTitle className="text-lg">{milestone.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {milestone.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">准备开始创作了吗？</h2>
              <p className="text-xl mb-8 text-purple-100">
                加入数千名正在使用Sybau Picture制作病毒式内容的创作者。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/zh/generator">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    <Rocket className="h-5 w-5 mr-2" />
                    开始创作
                  </Button>
                </Link>
                <Link href="/zh/gallery">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white">
                    <Heart className="w-5 h-5 mr-2" />
                    查看图库示例
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
