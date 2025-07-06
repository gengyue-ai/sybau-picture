'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export default function TestBasicPage() {
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
        callbackUrl: '/debug/test-basic',
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

  // 内联样式
  const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer'
  }

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  }

  const containerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  }

  const resultStyle = {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '5px',
    borderLeft: '4px solid #007bff'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '20px' }}>
      <div style={containerStyle}>
        <h1>🧪 基础React测试页面</h1>
        <p>这是一个不使用UI组件库的React页面</p>

        <button
          onClick={testBasicClick}
          style={buttonStyle}
        >
          🔵 基本点击测试
        </button>

        <button
          onClick={testGoogleSignIn}
          style={isLoading ? disabledButtonStyle : buttonStyle}
          disabled={isLoading}
        >
          {isLoading ? '🔄 测试中...' : '🟡 测试Google登录'}
        </button>

        <button
          onClick={testSignUpAPI}
          style={isLoading ? disabledButtonStyle : buttonStyle}
          disabled={isLoading}
        >
          {isLoading ? '🔄 测试中...' : '🟢 测试注册API'}
        </button>

        <div style={resultStyle}>
          <h3>测试结果:</h3>
          <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
            {result || '暂无结果 - 请点击上面的按钮进行测试'}
          </div>
        </div>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
          <h3>调试信息:</h3>
          <div style={{ fontSize: '12px' }}>
            <div>页面加载时间: {new Date().toLocaleTimeString()}</div>
            <div>JavaScript状态: 正常</div>
            <div>NextAuth状态: {typeof signIn === 'function' ? '✅ 已加载' : '❌ 未加载'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
