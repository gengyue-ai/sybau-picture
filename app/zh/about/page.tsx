import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Target, Lightbulb, Rocket, Heart, Star, Users, Zap, Shield, Clock, Award } from 'lucide-react'
import Link from 'next/link'

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
    avatar: 'A',
    name: 'Alex Chen',
    role: 'CEO & 创始人',
    bio: 'AI领域的远见者，致力于让创意技术惠及每个人。'
  },
  {
    avatar: 'S',
    name: 'Sarah Kim',
    role: '首席技术官',
    bio: '机器学习专家，专注于构建下一代AI创意工具。'
  },
  {
    avatar: 'M',
    name: 'Mike Johnson',
    role: '产品总监',
    bio: '用户体验专家，确保我们的工具直观易用。'
  },
  {
    avatar: 'L',
    name: 'Lisa Zhang',
    role: '设计主管',
    bio: '创意设计师，为我们的平台带来美学和功能的完美融合。'
  }
]

const milestones = [
  {
    year: '2023',
    title: '公司成立',
    description: '怀着让创意民主化的愿景开始了我们的旅程。'
  },
  {
    year: '2024',
    title: 'AI引擎发布',
    description: '推出了我们的第一个AI图像生成引擎。'
  },
  {
    year: '2024',
    title: '用户里程碑',
    description: '达到10万活跃用户，生成了100万张图像。'
  },
  {
    year: '2024',
    title: '全球扩展',
    description: '将服务扩展到50多个国家，支持多种语言。'
  }
]

const stats = [
  { number: "100万+", label: '表情包创作' },
  { number: "25万+", label: '活跃用户' },
  { number: "50+", label: '服务国家' },
  { number: "99.9%", label: '在线时间' }
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
            我们致力于通过专业级AI图像生成技术的普及，让每个人、每个地方都能轻松创作表情包。加入数百万创作者，将您的创意转化为病毒式内容。
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
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="h-20 w-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">{member.avatar}</span>
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="secondary" className="mx-auto">{member.role}</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {member.bio}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
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
