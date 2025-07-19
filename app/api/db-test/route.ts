import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma, safeQuery } from '@/lib/prisma'

// 强制动态渲染，因为使用了session
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('=== 数据库诊断开始 ===')

    const diagnostics = {
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: null as string | null
      },
      tables: {
        users: { exists: false, count: 0 },
        plans: { exists: false, count: 0 },
        subscriptions: { exists: false, count: 0 },
        accounts: { exists: false, count: 0 },
        sessions: { exists: false, count: 0 }
      },
      auth: {
        sessionExists: false,
        userEmail: null as string | null
      },
      config: {
        databaseUrl: !!process.env.DATABASE_URL,
        nextAuthUrl: !!process.env.NEXTAUTH_URL,
        nextAuthSecret: !!process.env.NEXTAUTH_SECRET
      }
    }

    // 检查认证状态
    try {
      const session = await getServerSession(authOptions)
      diagnostics.auth.sessionExists = !!session
      diagnostics.auth.userEmail = session?.user?.email || null
      console.log('认证检查:', diagnostics.auth)
    } catch (authError) {
      console.log('认证检查失败:', authError)
    }

    // 检查数据库连接
    if (!prisma) {
      diagnostics.database.error = 'Prisma client not initialized'
      console.log('❌ Prisma客户端未初始化')
      return NextResponse.json(diagnostics)
    }

    try {
      // 测试数据库连接
      await prisma.$connect()
      diagnostics.database.connected = true
      console.log('✅ 数据库连接成功')

      // 检查各个表的存在性和数据
      console.log('🔍 检查表结构和数据...')

      // 检查用户表
      try {
        const userCount = await safeQuery(async () => {
          return await prisma!.user.count()
        })
        diagnostics.tables.users.exists = true
        diagnostics.tables.users.count = userCount || 0
        console.log(`✅ Users表: 存在，${userCount} 条记录`)
      } catch (userError) {
        console.log('❌ Users表检查失败:', userError)
        diagnostics.tables.users.exists = false
      }

      // 检查套餐表
      try {
        const planCount = await safeQuery(async () => {
          return await prisma!.plan.count()
        })
        diagnostics.tables.plans.exists = true
        diagnostics.tables.plans.count = planCount || 0
        console.log(`✅ Plans表: 存在，${planCount} 条记录`)

        // 如果Plans表存在，尝试获取免费计划
        if (planCount && planCount > 0) {
          const freePlan = await safeQuery(async () => {
            return await prisma!.plan.findFirst({
              where: {
                OR: [
                  { id: 'plan_free' },
                  { name: 'free' },
                  { name: 'Free' },
                  { name: 'FREE' }
                ]
              }
            })
          })
          console.log('免费计划查询结果:', freePlan)
        }
      } catch (planError) {
        console.log('❌ Plans表检查失败:', planError)
        diagnostics.tables.plans.exists = false
      }

      // 检查订阅表
      try {
        const subscriptionCount = await safeQuery(async () => {
          return await prisma!.subscription.count()
        })
        diagnostics.tables.subscriptions.exists = true
        diagnostics.tables.subscriptions.count = subscriptionCount || 0
        console.log(`✅ Subscriptions表: 存在，${subscriptionCount} 条记录`)
      } catch (subError) {
        console.log('❌ Subscriptions表检查失败:', subError)
        diagnostics.tables.subscriptions.exists = false
      }

      // 检查账户表（NextAuth）
      try {
        const accountCount = await safeQuery(async () => {
          return await prisma!.account.count()
        })
        diagnostics.tables.accounts.exists = true
        diagnostics.tables.accounts.count = accountCount || 0
        console.log(`✅ Accounts表: 存在，${accountCount} 条记录`)
      } catch (accError) {
        console.log('❌ Accounts表检查失败:', accError)
        diagnostics.tables.accounts.exists = false
      }

      // 检查会话表（NextAuth）
      try {
        const sessionCount = await safeQuery(async () => {
          return await prisma!.session.count()
        })
        diagnostics.tables.sessions.exists = true
        diagnostics.tables.sessions.count = sessionCount || 0
        console.log(`✅ Sessions表: 存在，${sessionCount} 条记录`)
      } catch (sessError) {
        console.log('❌ Sessions表检查失败:', sessError)
        diagnostics.tables.sessions.exists = false
      }

    } catch (dbError) {
      diagnostics.database.connected = false
      diagnostics.database.error = dbError instanceof Error ? dbError.message : 'Unknown database error'
      console.log('❌ 数据库连接失败:', dbError)
    } finally {
      try {
        await prisma.$disconnect()
      } catch (disconnectError) {
        console.log('数据库断开连接时出错:', disconnectError)
      }
    }

    console.log('=== 数据库诊断完成 ===')
    console.log('诊断结果:', JSON.stringify(diagnostics, null, 2))

    return NextResponse.json({
      success: true,
      diagnostics,
      summary: {
        databaseConnected: diagnostics.database.connected,
        tablesOk: Object.values(diagnostics.tables).every(table => table.exists),
        hasUsers: diagnostics.tables.users.count > 0,
        hasPlans: diagnostics.tables.plans.count > 0,
        userAuthenticated: diagnostics.auth.sessionExists
      },
      recommendations: generateRecommendations(diagnostics)
    })

  } catch (error) {
    console.error('数据库诊断过程出错:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: '数据库诊断过程中出现错误'
      },
      { status: 500 }
    )
  }
}

function generateRecommendations(diagnostics: any): string[] {
  const recommendations: string[] = []

  if (!diagnostics.database.connected) {
    recommendations.push('🔴 数据库连接失败 - 检查DATABASE_URL环境变量')
  }

  if (!diagnostics.tables.plans.exists || diagnostics.tables.plans.count === 0) {
    recommendations.push('🟡 Plans表缺失或无数据 - 需要运行数据库初始化/种子数据')
  }

  if (!diagnostics.tables.users.exists) {
    recommendations.push('🟡 Users表不存在 - 需要运行Prisma migrate')
  }

  if (!diagnostics.config.databaseUrl) {
    recommendations.push('🔴 DATABASE_URL环境变量未配置')
  }

  if (!diagnostics.config.nextAuthSecret) {
    recommendations.push('🟡 NEXTAUTH_SECRET环境变量未配置')
  }

  if (diagnostics.auth.sessionExists && diagnostics.tables.users.count === 0) {
    recommendations.push('🟡 用户已认证但数据库中无用户记录 - 需要修复用户同步问题')
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ 数据库状态良好')
  }

  return recommendations
}
