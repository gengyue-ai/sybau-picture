'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export default function TestAuthPage() {
  const [result, setResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const testBasicClick = () => {
    console.log('🔵 基本点击测试被触发')
    setResult('✅ 基本点击测试成功！JavaScript事件处理正常。时间: ' + new Date().toLocaleTimeString())
  }

  const testGoogleSignIn = async () => {
    console.log('🟡 Google登录测试被触发')
    setIsLoading(true)
    setResult('🔄 开始Google登录测试...')

    try {
      console.log('准备调用 signIn...')
      const result = await signIn('google', {
        callbackUrl: '/debug/test-auth',
        redirect: false
      })

      console.log('signIn结果:', result)
      setResult(`✅ Google登录结果: ${JSON.stringify(result)}`)
    } catch (error) {
      console.error('❌ Google登录错误:', error)
      setResult(`❌ Google登录错误: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testSignUpAPI = async () => {
    console.log('🟢 注册API测试被触发')
    setIsLoading(true)
    setResult('🔄 开始注册API测试...')

    try {
      const testEmail = `test${Date.now()}@example.com`
      console.log('发送注册请求:', { email: testEmail })

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: testEmail,
          password: 'testpassword123'
        })
      })

      const data = await response.json()
      console.log('注册API响应:', data)

      if (response.ok) {
        setResult(`✅ 注册API成功: ${JSON.stringify(data)}`)
      } else {
        setResult(`❌ 注册API失败: ${JSON.stringify(data)}`)
      }
    } catch (error) {
      console.error('❌ 注册API错误:', error)
      setResult(`❌ 注册API错误: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 页面加载时输出调试信息
  React.useEffect(() => {
    console.log('🚀 TestAuthPage已加载')
    console.log('📝 当前环境:', typeof window !== 'undefined' ? '客户端' : '服务端')
    console.log('🔧 NextAuth signIn函数:', typeof signIn)
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>认证功能测试 🧪</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={testBasicClick}
            className="w-full"
            variant="outline"
          >
            🔵 测试基本点击
          </Button>

          <Button
            onClick={testGoogleSignIn}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? '🔄 测试中...' : '🟡 测试Google登录'}
          </Button>

          <Button
            onClick={testSignUpAPI}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? '🔄 测试中...' : '🟢 测试注册API'}
          </Button>

          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">测试结果:</h3>
            <div className="text-sm whitespace-pre-wrap">
              {result || '暂无结果 - 请点击上面的按钮进行测试'}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-800">调试信息:</h3>
            <div className="text-xs text-blue-600">
              <div>页面加载时间: {new Date().toLocaleTimeString()}</div>
              <div>JavaScript状态: 正常</div>
              <div>NextAuth状态: {typeof signIn === 'function' ? '✅ 已加载' : '❌ 未加载'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
