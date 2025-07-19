import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// 强制动态渲染
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: '支付模拟测试API',
    usage: {
      'POST /api/debug/payment-simulate': '模拟支付请求',
      'parameters': {
        'planType': 'standard | pro',
        'billingCycle': 'monthly | yearly'
      }
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== 支付模拟测试开始 ===')

    // 获取当前session
    const session = await getServerSession(authOptions)

    const result = {
      timestamp: new Date().toISOString(),
      session: {
        exists: !!session,
        user: session?.user ? {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image
        } : null
      },
      test: {
        step: 'init',
        error: null as any,
        details: null as any
      }
    }

    // 检查session
    if (!session?.user?.email) {
      result.test.error = '用户未登录或session无效'
      return NextResponse.json({
        success: false,
        result,
        recommendation: '请先登录Google账户'
      }, { status: 401 })
    }

    // 获取请求参数
    const body = await request.json()
    const { planType = 'standard', billingCycle = 'monthly' } = body

    result.test.step = 'calling-payment-api'

    // 直接调用支付API
    const paymentResponse = await fetch(`${process.env.NEXTAUTH_URL || 'https://sybaupicture.vercel.app'}/api/payment/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || ''
      },
      body: JSON.stringify({
        planType,
        billingCycle
      })
    })

    result.test.step = 'payment-api-response'

    const paymentData = await paymentResponse.text()
    let parsedPaymentData

    try {
      parsedPaymentData = JSON.parse(paymentData)
    } catch (parseError) {
      parsedPaymentData = { rawResponse: paymentData }
    }

    result.test.details = {
      status: paymentResponse.status,
      statusText: paymentResponse.statusText,
      headers: Object.fromEntries(paymentResponse.headers.entries()),
      data: parsedPaymentData
    }

    if (!paymentResponse.ok) {
      result.test.error = `支付API调用失败: ${paymentResponse.status} ${paymentResponse.statusText}`

      return NextResponse.json({
        success: false,
        result,
        recommendation: '支付API返回错误',
        troubleshooting: [
          '检查用户是否正确创建',
          '验证Stripe配置',
          '检查Plan数据',
          '查看详细错误信息'
        ]
      }, { status: 500 })
    }

    result.test.step = 'success'

    return NextResponse.json({
      success: true,
      result,
      message: '支付模拟测试成功',
      checkoutUrl: parsedPaymentData.url
    })

  } catch (error) {
    console.error('支付模拟测试失败:', error)
    return NextResponse.json({
      success: false,
      error: 'Payment simulation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
