'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { User, Calendar, CreditCard, Image, Settings, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserProfile {
  name: string
  email: string
  image: string
  plan: {
    name: string
    hasWatermark: boolean
  }
  usage: {
    current: number
    max: number
    remaining: number
  }
  createdAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [fixing, setFixing] = useState(false)
  const [fixAttempted, setFixAttempted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchProfile()
    }
  }, [status, router])

  const fixUser = async () => {
    if (fixing || fixAttempted) return

    setFixing(true)
    setFixAttempted(true)

    try {
      console.log('🔧 正在修复用户数据...')
      const response = await fetch('/api/admin/fix-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      console.log('修复结果:', result)

      if (result.success) {
        console.log('✅ 用户修复成功，重新获取资料...')
        // 等待一秒让数据库更新
        await new Promise(resolve => setTimeout(resolve, 1000))
        await fetchProfile()
      } else {
        console.error('❌ 用户修复失败:', result.error)
      }
    } catch (error) {
      console.error('修复过程出错:', error)
    } finally {
      setFixing(false)
    }
  }

  const fetchProfile = async () => {
    try {
      console.log('📡 正在获取用户资料...')
      const response = await fetch('/api/subscription')

      if (response.ok) {
        const data = await response.json()
        console.log('✅ 用户资料获取成功:', data)
        setProfile({
          name: data.user.name || session?.user?.name || '',
          email: data.user.email || session?.user?.email || '',
          image: data.user.image || session?.user?.image || '',
          plan: data.user.plan,
          usage: data.usage,
          createdAt: data.user.createdAt || new Date().toISOString()
        })
      } else if (response.status === 404) {
        console.log('⚠️ 用户不存在，尝试自动修复...')
        // 用户不存在，自动尝试修复
        if (!fixAttempted) {
          await fixUser()
        }
      } else {
        console.error('❌ 获取用户资料失败:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('获取用户资料时出错:', error)
      // 网络错误时也尝试修复
      if (!fixAttempted) {
        await fixUser()
      }
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {fixing ? '正在修复用户数据...' : '加载用户资料...'}
          </p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">用户资料加载失败</h3>
            <p className="text-gray-600 mb-4">
              {fixAttempted ?
                '尝试修复后仍无法加载用户资料，请稍后重试。' :
                '无法加载用户资料，正在尝试修复...'}
            </p>
            <div className="space-y-3">
              {!fixAttempted && (
                <Button
                  className="w-full"
                  onClick={fixUser}
                  disabled={fixing}
                >
                  {fixing ? '正在修复...' : '🔧 修复用户数据'}
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                🔄 刷新页面
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/')}
              >
                返回首页
              </Button>
            </div>

            {/* 调试信息 */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left text-sm">
              <h4 className="font-semibold mb-2">调试信息:</h4>
              <p>登录状态: {status}</p>
              <p>用户邮箱: {session?.user?.email}</p>
              <p>修复尝试: {fixAttempted ? '是' : '否'}</p>
              <p>修复中: {fixing ? '是' : '否'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const usagePercentage = (profile.usage.current / profile.usage.max) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
            个人资料
          </h1>
          <p className="text-gray-600 mt-2">管理您的账户信息和订阅状态</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：个人信息 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 头像和基本信息 */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 relative">
                  {profile.image ? (
                    <img
                      src={profile.image}
                      alt="头像"
                      className="w-full h-full rounded-full object-cover border-4 border-purple-200"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{profile.name}</h2>
                <p className="text-gray-600 flex items-center justify-center mt-2">
                  <Mail className="w-4 h-4 mr-2" />
                  {profile.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center justify-center mt-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  加入时间: {new Date(profile.createdAt).toLocaleDateString('zh-CN')}
                </p>
              </CardContent>
            </Card>

            {/* 快速操作 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  快速操作
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Image className="w-4 h-4 mr-2" />
                    开始创作
                  </Button>
                </Link>
                <Link href="/history" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Image className="w-4 h-4 mr-2" />
                    创作历史
                  </Button>
                </Link>
                <Link href="/pricing" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="w-4 h-4 mr-2" />
                    升级套餐
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：订阅信息和使用统计 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 订阅套餐 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <CreditCard className="w-6 h-6 mr-2" />
                  当前套餐
                </CardTitle>
                <CardDescription>
                  您的订阅状态和权益信息
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 text-sm font-medium ${
                        profile.plan.name === 'pro'
                          ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-300'
                          : profile.plan.name === 'standard'
                          ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-300'
                          : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300'
                      }`}
                    >
                      {profile.plan.name.toUpperCase()} 套餐
                    </Badge>
                  </div>
                  <Link href="/pricing">
                    <Button size="sm" variant="outline">
                      升级套餐
                    </Button>
                  </Link>
                </div>

                {/* 套餐特性 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">每月配额</h4>
                    <p className="text-2xl font-bold text-purple-600">{profile.usage.max}</p>
                    <p className="text-sm text-purple-600">张图片</p>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4">
                    <h4 className="font-medium text-pink-800 mb-2">图片质量</h4>
                    <p className="text-lg font-bold text-pink-600">
                      {profile.plan.hasWatermark ? '标准画质' : '高清无水印'}
                    </p>
                    <p className="text-sm text-pink-600">
                      {profile.plan.hasWatermark ? '带水印' : '专业品质'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 使用统计 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Image className="w-6 h-6 mr-2" />
                  本月使用情况
                </CardTitle>
                <CardDescription>
                  查看您本月的图片生成使用量
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      已使用: {profile.usage.current} / {profile.usage.max}
                    </span>
                    <span className="text-sm text-gray-500">
                      剩余: {profile.usage.remaining}
                    </span>
                  </div>

                  <Progress
                    value={usagePercentage}
                    className="w-full h-3"
                  />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-lg font-bold text-green-600">{profile.usage.current}</p>
                      <p className="text-xs text-green-600">已生成</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-lg font-bold text-blue-600">{profile.usage.remaining}</p>
                      <p className="text-xs text-blue-600">剩余</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-lg font-bold text-purple-600">{Math.round(usagePercentage)}%</p>
                      <p className="text-xs text-purple-600">使用率</p>
                    </div>
                  </div>

                  {usagePercentage >= 80 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-orange-800 text-sm font-medium">
                        ⚠️ 您的月度配额即将用完，考虑升级套餐以获得更多生成次数
                      </p>
                      <Link href="/pricing" className="inline-block mt-2">
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                          立即升级
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 账户管理 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">账户管理</CardTitle>
                <CardDescription>
                  管理您的账户设置和数据
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">登录方式</h4>
                    <p className="text-sm text-gray-600">Google账户登录</p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    已验证
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">数据同步</h4>
                    <p className="text-sm text-gray-600">创作历史和偏好设置</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    已同步
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
