'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  MessageSquare,
  Star,
  TrendingUp,
  Award,
  Heart,
  Image,
  Calendar,
  Trophy,
  Sparkles,
  Share2,
  Globe
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ZHCommunityPage() {
  const communityFeatures = [
    {
      icon: Users,
      title: '全球创作者',
      description: '与来自50多个国家的创作者交流分享',
      stats: '25,000+ 活跃用户'
    },
    {
      icon: Image,
      title: '作品展示',
      description: '分享您的AI生成作品，获得社区反馈',
      stats: '150,000+ 创作作品'
    },
    {
      icon: Award,
      title: '每月挑战',
      description: '参与主题挑战赛，赢取精美奖品',
      stats: '每月3个主题'
    },
    {
      icon: MessageSquare,
      title: '讨论交流',
      description: '在论坛中讨论创作技巧和经验',
      stats: '24/7 活跃讨论'
    }
  ]

  const popularChannels = [
    {
      name: '🎨 创作展示',
      description: '分享您的最新AI作品',
      members: '12.5K',
      recent: '3分钟前'
    },
    {
      name: '💡 创意灵感',
      description: '寻找和分享创意想法',
      members: '8.2K',
      recent: '5分钟前'
    },
    {
      name: '🛠️ 技巧教程',
      description: '学习和分享使用技巧',
      members: '9.8K',
      recent: '8分钟前'
    },
    {
      name: '🏆 挑战赛',
      description: '参与社区挑战活动',
      members: '6.3K',
      recent: '12分钟前'
    },
    {
      name: '🎭 风格探讨',
      description: 'Sybau风格深度讨论',
      members: '4.7K',
      recent: '15分钟前'
    },
    {
      name: '🤝 新手帮助',
      description: '新用户问答和指导',
      members: '7.1K',
      recent: '18分钟前'
    }
  ]

  const achievements = [
    {
      icon: Star,
      title: '创作新星',
      description: '发布首个作品',
      rarity: '常见'
    },
    {
      icon: Heart,
      title: '人气创作者',
      description: '获得100个赞',
      rarity: '稀有'
    },
    {
      icon: Trophy,
      title: '挑战冠军',
      description: '赢得月度挑战',
      rarity: '史诗'
    },
    {
      icon: Sparkles,
      title: 'AI大师',
      description: '创作1000个作品',
      rarity: '传说'
    }
  ]

  const upcomingEvents = [
    {
      title: '新年创意挑战赛',
      date: '2025年1月1日',
      type: '挑战赛',
      prize: '¥5000奖金池'
    },
    {
      title: 'AI创作技巧讲座',
      date: '2025年1月8日',
      type: '直播',
      prize: '免费参与'
    },
    {
      title: '社区作品展',
      date: '2025年1月15日',
      type: '展览',
      prize: '精美周边'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">加入我们的社区</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            与全球创作者连接，分享您的作品，发现令人惊叹的AI生成内容。
            在这里，每个人都是艺术家，每个想法都可能成为下一个病毒式传播的杰作。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
              <MessageSquare className="w-5 h-5 mr-2" />
              立即加入社区
            </Button>
            <Button size="lg" variant="outline">
              <Globe className="w-5 h-5 mr-2" />
              浏览作品集
            </Button>
          </div>
        </div>

        {/* Community Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {communityFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                  <Badge variant="secondary" className="text-xs">{feature.stats}</Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Popular Channels */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  热门频道
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {popularChannels.map((channel, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{channel.name}</h3>
                        <Badge variant="outline" className="text-xs">{channel.members}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{channel.description}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        最新消息：{channel.recent}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  即将举行的活动
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>📅 {event.date}</span>
                          <Badge variant="outline" className="text-xs">{event.type}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-purple-600">{event.prize}</div>
                        <Button size="sm" variant="outline" className="mt-2">
                          了解详情
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  社区数据
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">总用户数</span>
                  <span className="font-bold text-purple-600">25,487</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">今日活跃</span>
                  <span className="font-bold text-green-600">3,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">作品总数</span>
                  <span className="font-bold text-blue-600">152,341</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">本月新增</span>
                  <span className="font-bold text-orange-600">12,543</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  成就系统
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon
                    return (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <Icon className="w-6 h-6 text-purple-600" />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{achievement.title}</h4>
                          <p className="text-xs text-gray-600">{achievement.description}</p>
                        </div>
                        <Badge
                          variant={achievement.rarity === '传说' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {achievement.rarity}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  查看全部成就
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  分享作品
                </Button>
                <Button className="w-full" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  发起讨论
                </Button>
                <Button className="w-full" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  寻找伙伴
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            准备好展示您的创意了吗？
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            加入我们充满活力的创作者社区，与同道中人交流，让您的AI作品被更多人看到和喜爱。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Sparkles className="w-5 h-5 mr-2" />
              开始创作
            </Button>
            <Button size="lg" variant="outline">
              <Users className="w-5 h-5 mr-2" />
              浏览社区
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
