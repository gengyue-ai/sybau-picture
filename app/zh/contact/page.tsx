'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, Clock, Send, MessageCircle, MapPin, Globe } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ZHContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 模拟表单提交
    await new Promise(resolve => setTimeout(resolve, 1000))

    alert('消息已发送！我们会尽快回复您。')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setIsSubmitting(false)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: '邮箱联系',
      description: '发送邮件给我们',
      content: 'support@sybaupicture.com',
      action: '发送邮件'
    },
    {
      icon: MessageCircle,
      title: '在线客服',
      description: '实时聊天支持',
      content: '24/7 在线客服',
      action: '开始聊天'
    },
    {
      icon: Clock,
      title: '支持时间',
      description: '我们的工作时间',
      content: '周一至周五 9:00-18:00 (CST)',
      action: '查看详情'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">联系我们</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            有任何问题或建议？我们的团队随时为您提供帮助。
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {contactMethods.map((method, index) => {
              const Icon = method.icon
              return (
                <Card key={index} className=" transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-gray-600 mb-3">{method.description}</p>
                    <p className="text-sm font-medium text-gray-800 mb-4">{method.content}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  发送消息
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">姓名 *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="请输入您的姓名"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">邮箱 *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="请输入您的邮箱"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">主题 *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="请简要描述您的问题"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">详细描述 *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="请详细描述您的问题或建议..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '发送中...' : '发送消息'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Company Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    公司信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sybau Picture</h3>
                    <p className="text-gray-600">
                      全球首个专注于Sybau Lazer Dim 700风格的AI表情包生成平台
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium">邮箱地址</p>
                        <p className="text-gray-600">support@sybaupicture.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Globe className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium">网站</p>
                        <p className="text-gray-600">www.sybaupicture.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium">服务时间</p>
                        <p className="text-gray-600">周一至周五 9:00-18:00 (北京时间)</p>
                        <p className="text-gray-600 text-sm">技术支持：24/7 在线</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle>常见问题</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">多久能收到回复？</h4>
                      <p className="text-sm text-gray-600">我们通常在24小时内回复邮件，紧急问题会在2-4小时内处理。</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">支持哪些语言？</h4>
                      <p className="text-sm text-gray-600">我们支持中文、英文等10种语言的客户服务。</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">如何获得技术支持？</h4>
                      <p className="text-sm text-gray-600">您可以通过邮件、在线客服或帮助中心获取技术支持。</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
