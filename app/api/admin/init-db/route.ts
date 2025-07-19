import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma, safeQuery } from '@/lib/prisma'

// 强制动态渲染，因为使用了session
export const dynamic = 'force-dynamic'

async function initializeDatabase() {
  try {
    console.log('=== 数据库初始化开始 ===')

    if (!prisma) {
      return {
        success: false,
        error: 'Database not configured',
        message: '数据库连接失败'
      }
    }

    const initResults = {
      plans: { created: 0, updated: 0, total: 0 },
      success: true,
      errors: [] as string[]
    }

    try {
      // 确保数据库连接
      await prisma.$connect()
      console.log('✅ 数据库连接成功')

      // 初始化Plans表数据
      console.log('🔄 初始化Plans表数据...')

      const planData = [
        {
          id: 'plan_free',
          name: 'free',
          displayName: 'Free',
          description: 'Perfect for getting started',
          price: 0,
          yearlyPrice: 0,
          currency: 'USD',
          maxImagesPerMonth: 1,
          maxResolution: '1024x1024',
          hasWatermark: true,
          hasPriorityProcessing: false,
          hasBatchProcessing: false,
          hasAdvancedFeatures: false,
          availableStyles: JSON.stringify(['classic']),
          isActive: true
        },
                 {
           id: 'plan_standard',
           name: 'standard',
           displayName: 'Standard',
           description: 'Best for regular creators',
           price: 9,  // 月付：$9/月
           yearlyPrice: 72,  // 年付：$72/年（优惠后相当于$6/月）
           currency: 'USD',
          maxImagesPerMonth: 60,
          maxResolution: '2048x2048',
          hasWatermark: false,
          hasPriorityProcessing: true,
          hasBatchProcessing: false,
          hasAdvancedFeatures: true,
          availableStyles: JSON.stringify(['classic', 'exaggerated', 'professional']),
          isActive: true
        },
                 {
           id: 'plan_pro',
           name: 'pro',
           displayName: 'PRO',
           description: 'For businesses and power users',
           price: 19,  // 月付：$19/月
           yearlyPrice: 144,  // 年付：$144/年（优惠后相当于$12/月）
           currency: 'USD',
          maxImagesPerMonth: 180,
          maxResolution: '4096x4096',
          hasWatermark: false,
          hasPriorityProcessing: true,
          hasBatchProcessing: true,
          hasAdvancedFeatures: true,
          availableStyles: JSON.stringify(['classic', 'exaggerated', 'professional', 'premium']),
          isActive: true
        }
      ]

      for (const plan of planData) {
        try {
          const result = await safeQuery(async () => {
            return await prisma!.plan.upsert({
              where: { id: plan.id },
              update: {
                name: plan.name,
                displayName: plan.displayName,
                description: plan.description,
                price: plan.price,
                yearlyPrice: plan.yearlyPrice,
                currency: plan.currency,
                maxImagesPerMonth: plan.maxImagesPerMonth,
                maxResolution: plan.maxResolution,
                hasWatermark: plan.hasWatermark,
                hasPriorityProcessing: plan.hasPriorityProcessing,
                hasBatchProcessing: plan.hasBatchProcessing,
                hasAdvancedFeatures: plan.hasAdvancedFeatures,
                availableStyles: plan.availableStyles,
                isActive: plan.isActive,
                updatedAt: new Date()
              },
              create: plan
            })
          })

          if (result) {
            console.log(`✅ 套餐 ${plan.name} 处理完成`)
            // 简单检查是否为新创建（这里简化处理）
            initResults.plans.total++
          }
        } catch (planError) {
          const error = `创建套餐 ${plan.name} 失败: ${planError instanceof Error ? planError.message : 'Unknown error'}`
          console.log(`❌ ${error}`)
          initResults.errors.push(error)
        }
      }

      // 验证Plans表数据
      const planCount = await safeQuery(async () => {
        return await prisma!.plan.count()
      })

      initResults.plans.total = planCount || 0
      console.log(`✅ Plans表初始化完成，共有 ${planCount} 个套餐`)

      // 检查免费计划是否存在
      const freePlan = await safeQuery(async () => {
        return await prisma!.plan.findFirst({
          where: {
            OR: [
              { id: 'plan_free' },
              { name: 'free' }
            ]
          }
        })
      })

      if (!freePlan) {
        const error = '免费计划创建失败或不存在'
        initResults.errors.push(error)
        initResults.success = false
      } else {
        console.log('✅ 免费计划验证成功:', freePlan.id)
      }

    } catch (error) {
      const errorMsg = `数据库初始化过程出错: ${error instanceof Error ? error.message : 'Unknown error'}`
      console.log(`❌ ${errorMsg}`)
      initResults.errors.push(errorMsg)
      initResults.success = false
    } finally {
      try {
        await prisma.$disconnect()
      } catch (disconnectError) {
        console.log('数据库断开连接时出错:', disconnectError)
      }
    }

    console.log('=== 数据库初始化完成 ===')
    console.log('初始化结果:', JSON.stringify(initResults, null, 2))

    return {
      success: initResults.success,
      message: initResults.success ? '数据库初始化成功' : '数据库初始化部分失败',
      results: initResults,
      recommendations: initResults.success ?
        ['✅ 数据库已准备就绪，可以正常使用'] :
        ['🔴 请检查错误日志并重试', '🔴 可能需要手动修复数据库问题']
    }

  } catch (error) {
    console.error('数据库初始化API出错:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: '数据库初始化失败'
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // 检查用户认证（可选，浏览器访问时记录但不阻止）
    const session = await getServerSession(authOptions)
    console.log('GET请求用户:', session?.user?.email || '未认证')

    const result = await initializeDatabase()

    if (!result.success && result.error === 'Database not configured') {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET数据库初始化API出错:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'GET数据库初始化失败'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // 检查用户认证（POST请求可能需要更严格的认证）
    const session = await getServerSession(authOptions)
    console.log('POST请求用户:', session?.user?.email || '未认证')

    const result = await initializeDatabase()

    if (!result.success && result.error === 'Database not configured') {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('POST数据库初始化API出错:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'POST数据库初始化失败'
      },
      { status: 500 }
    )
  }
}
