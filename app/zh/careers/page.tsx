'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  Heart,
  Lightbulb,
  Rocket,
  Star,
  Briefcase,
  GraduationCap,
  Globe,
  Code,
  Palette,
  BarChart3,
  Headphones
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ZHCareersPage() {
  const openPositions = [
    {
      id: 1,
      title: 'AI研究工程师',
      department: '研发团队',
      location: '远程办公',
      type: '全职',
      salary: '¥30K-50K',
      icon: Code,
      requirements: ['机器学习博士或硕士学位', '3年以上深度学习经验', 'PyTorch/TensorFlow精通', '计算机视觉背景优先'],
      description: '负责设计和开发下一代AI图像生成模型，优化Sybau Lazer Dim 700风格的生成算法。'
    },
    {
      id: 2,
      title: '前端开发工程师',
      department: '产品团队',
      location: '远程办公',
      type: '全职',
      salary: '¥25K-40K',
      icon: Palette,
      requirements: ['5年以上React/Next.js经验', 'TypeScript熟练', 'UI/UX设计敏感度', '性能优化经验'],
      description: '构建美观、流畅的用户界面，确保最佳的用户体验和交互设计。'
    },
    {
      id: 3,
      title: '产品经理',
      department: '产品团队',
      location: '远程办公',
      type: '全职',
      salary: '¥35K-55K',
      icon: BarChart3,
      requirements: ['3年以上AI产品经验', '数据驱动决策能力', '用户研究背景', '敏捷开发经验'],
      description: '定义产品策略和路线图，与工程团队协作，推动AI创意工具的创新发展。'
    },
    {
      id: 4,
      title: '社区运营专员',
      department: '运营团队',
      location: '远程办公',
      type: '全职',
      salary: '¥15K-25K',
      icon: Headphones,
      requirements: ['2年以上社区运营经验', '优秀的沟通能力', '社交媒体营销经验', '创意内容制作'],
      description: '管理全球社区，策划活动，与创作者互动，推广品牌和产品。'
    }
  ]

  const companyValues = [
    {
      icon: Lightbulb,
      title: '创新驱动',
      description: '我们相信创新是推动世界前进的动力，鼓励每个人提出新想法。'
    },
    {
      icon: Users,
      title: '团队协作',
      description: '多元化团队合作，每个声音都很重要，共同创造卓越成果。'
    },
    {
      icon: Heart,
      title: '用户至上',
      description: '始终以用户需求为中心，创造真正有价值的产品和体验。'
    },
    {
      icon: Rocket,
      title: '快速成长',
      description: '在快节奏的初创环境中，每个人都有机会快速学习和成长。'
    }
  ]

  const benefits = [
    {
      category: '薪酬福利',
      items: [
        '竞争力薪资 + 股权激励',
        '年终奖金和绩效奖励',
        '五险一金 + 补充医疗保险',
        '年度健康体检'
      ]
    },
    {
      category: '工作环境',
      items: [
        '100% 远程办公',
        '弹性工作时间',
        '最新 MacBook Pro + 配件',
        '每月团建和聚餐'
      ]
    },
    {
      category: '成长发展',
      items: [
        '技术大会和培训支持',
        '在线课程学习预算',
        '导师制度和职业发展',
        '开源项目贡献机会'
      ]
    },
    {
      category: '生活平衡',
      items: [
        '带薪年假 + 病假',
        '生日假和特殊假期',
        '健身房会员补贴',
        '家庭关怀计划'
      ]
    }
  ]

  const teamStats = [
    { number: '12', label: '团队成员' },
    { number: '6', label: '国家分布' },
    { number: '5', label: '平均工作年限' },
    { number: '95%', label: '员工满意度' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Briefcase className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">加入Sybau Picture</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            我们是一家充满活力的AI初创公司，正在革命性地改变创意内容的制作方式。
            加入我们，一起构建下一代AI创意工具，让全世界的创作者都能受益。
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            {teamStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
            <GraduationCap className="w-5 h-5 mr-2" />
            查看职位
          </Button>
        </div>

        {/* Company Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">我们的价值观</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <Icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            开放职位
            <Badge className="ml-3 bg-green-100 text-green-800">{openPositions.length} 个职位</Badge>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {openPositions.map((position) => {
              const Icon = position.icon
              return (
                <Card key={position.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <Icon className="w-8 h-8 text-purple-600 mr-3" />
                        <div>
                          <CardTitle className="text-lg">{position.title}</CardTitle>
                          <p className="text-sm text-gray-600">{position.department}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{position.type}</Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {position.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {position.salary}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 mb-4">{position.description}</p>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">职位要求：</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {position.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button className="w-full">
                      申请职位
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">员工福利</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-center">{benefit.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {benefit.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-sm">
                        <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Join Us */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">为什么选择Sybau Picture？</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <Rocket className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">快速成长</h3>
                <p className="text-gray-600 text-sm">
                  作为2025年成立的初创公司，您将参与从0到1的产品构建过程，获得宝贵的创业经验。
                </p>
              </div>
              <div>
                <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">全球影响</h3>
                <p className="text-gray-600 text-sm">
                  您的工作将影响全球50多个国家的25,000多名创作者，让创意惠及全世界。
                </p>
              </div>
              <div>
                <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">有意义的工作</h3>
                <p className="text-gray-600 text-sm">
                  参与构建真正改变人们创作方式的产品，让AI技术更加民主化和普及。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">申请流程</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: '在线申请', description: '提交简历和作品集' },
              { step: '2', title: '电话面试', description: '30分钟初步沟通' },
              { step: '3', title: '技术面试', description: '深入技术讨论' },
              { step: '4', title: '最终面试', description: '团队文化匹配' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">准备好加入我们了吗？</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            如果您对AI技术充满热情，想要在创意领域做出影响，我们很期待您的加入！
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Briefcase className="w-5 h-5 mr-2" />
              查看所有职位
            </Button>
            <Button size="lg" variant="outline">
              <Users className="w-5 h-5 mr-2" />
              了解团队文化
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
