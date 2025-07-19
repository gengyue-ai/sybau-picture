import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { STRIPE_PRICE_IDS, stripe } from '@/lib/stripe'
import { prisma, safeQuery } from '@/lib/prisma'
import { getEnvironmentConfig } from '@/lib/env-manager'

// 强制动态渲染
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('=== 支付系统诊断开始 ===')

    const envConfig = getEnvironmentConfig()
    const session = await getServerSession(authOptions)

    const diagnosis = {
      timestamp: new Date().toISOString(),
      environment: envConfig.environment,
      user: {
        authenticated: !!session?.user?.email,
        email: session?.user?.email || 'Not logged in',
        exists: false,
        details: null as any
      },
      database: {
        connected: !!prisma,
        plans: { count: 0, samples: [] as any[] },
        planIds: [] as string[]
      },
      stripe: {
        configured: false,
        secretKeyExists: !!envConfig.payment.secretKey,
        publishableKeyExists: !!envConfig.payment.publishableKey,
        priceIds: STRIPE_PRICE_IDS,
        testConnection: null as any
      },
      recommendations: [] as string[]
    }

    // 检查数据库连接和Plan数据
    if (prisma) {
      try {
        const plans = await safeQuery(async () => {
          return await prisma!.plan.findMany({
            select: {
              id: true,
              name: true,
              price: true,
              interval: true,
              features: true
            }
          });
        });

        diagnosis.database.plans.count = plans?.length || 0
        diagnosis.database.plans.samples = plans?.slice(0, 3) || []
        diagnosis.database.planIds = plans?.map(p => p.id) || []

        // 特别检查免费计划
        const freePlan = await safeQuery(async () => {
          return await prisma!.plan.findFirst({
            where: {
              OR: [
                { id: 'plan_free' },
                { name: 'free' },
                { name: 'Free Plan' }
              ]
            }
          });
        });

        if (freePlan) {
          diagnosis.recommendations.push('✅ 免费计划可正常找到')
        } else {
          diagnosis.recommendations.push('❌ 免费计划查找失败 - 这会导致用户创建失败')
        }

      } catch (dbError) {
        diagnosis.recommendations.push(`❌ 数据库查询失败: ${dbError}`)
      }
    }

    // 检查用户信息
    if (session?.user?.email && prisma) {
      try {
        const user = await safeQuery(async () => {
          return await prisma!.user.findUnique({
            where: { email: session.user.email },
            select: {
              id: true,
              email: true,
              name: true,
              stripeCustomerId: true,
              planId: true,
              plan: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          });
        });

        diagnosis.user.exists = !!user
        diagnosis.user.details = user
      } catch (userError) {
        diagnosis.recommendations.push(`⚠️ 用户查询失败: ${userError}`)
      }
    }

    // 检查Stripe配置
    if (envConfig.payment.secretKey) {
      try {
        // 测试Stripe连接
        await stripe.prices.list({ limit: 1 })
        diagnosis.stripe.configured = true
        diagnosis.stripe.testConnection = '✅ Stripe API连接正常'
      } catch (stripeError) {
        diagnosis.stripe.testConnection = `❌ Stripe连接失败: ${stripeError}`
      }
    }

    // 验证价格ID
    const priceIssues = []
    for (const [planType, cycles] of Object.entries(STRIPE_PRICE_IDS)) {
      for (const [cycle, priceId] of Object.entries(cycles)) {
        if (!priceId || priceId.startsWith('price_1O')) {
          priceIssues.push(`⚠️ ${planType} ${cycle} 使用默认价格ID: ${priceId}`)
        } else {
          priceIssues.push(`✅ ${planType} ${cycle} 价格ID: ${priceId}`)
        }
      }
    }
    diagnosis.recommendations.push(...priceIssues)

    // 综合建议
    if (!diagnosis.database.connected) {
      diagnosis.recommendations.push('❌ 数据库未连接 - 支付功能无法使用')
    }
    if (!diagnosis.stripe.configured) {
      diagnosis.recommendations.push('❌ Stripe未配置 - 支付功能无法使用')
    }
    if (!diagnosis.user.authenticated) {
      diagnosis.recommendations.push('ℹ️ 用户未登录 - 请登录后测试支付功能')
    }
    if (diagnosis.user.authenticated && !diagnosis.user.exists) {
      diagnosis.recommendations.push('⚠️ 登录用户在数据库中不存在 - 支付时会自动创建')
    }

    return NextResponse.json({
      success: true,
      diagnosis,
      summary: {
        canProcessPayments: diagnosis.database.connected && diagnosis.stripe.configured,
        userReady: diagnosis.user.authenticated,
        issuesFound: diagnosis.recommendations.filter(r => r.includes('❌')).length
      }
    })

  } catch (error) {
    console.error('支付系统诊断失败:', error)
    return NextResponse.json({
      success: false,
      error: 'Payment diagnosis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
