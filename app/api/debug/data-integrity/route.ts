import { NextRequest, NextResponse } from 'next/server'
import { prisma, safeQuery } from '@/lib/prisma'

// 强制动态渲染
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('=== 数据完整性检查开始 ===')

    if (!prisma) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured'
      }, { status: 500 })
    }

    const integrity = {
      timestamp: new Date().toISOString(),
      issues: [] as string[],
      details: {
        users: { count: 0, samples: [] as any[] },
        accounts: { count: 0, samples: [] as any[], orphaned: [] as any[] },
        subscriptions: { count: 0, samples: [] as any[], orphaned: [] as any[] },
        plans: { count: 0, samples: [] as any[] }
      },
      recommendations: [] as string[]
    }

    try {
      await prisma.$connect()

      // 检查Users表
      const users = await safeQuery(async () => {
        return await prisma.user.findMany({
          take: 5,
          include: {
            accounts: true,
            subscriptions: true
          }
        })
      })
      integrity.details.users.count = users?.length || 0
      integrity.details.users.samples = users || []

      // 检查Accounts表
      const accounts = await safeQuery(async () => {
        return await prisma.account.findMany({
          take: 10,
          include: {
            user: true
          }
        })
      })
      integrity.details.accounts.count = accounts?.length || 0
      integrity.details.accounts.samples = accounts || []

      // 找出孤立的Accounts（没有对应User的）
      if (accounts) {
        integrity.details.accounts.orphaned = accounts.filter(account => !account.user)
      }

      // 检查Subscriptions表
      const subscriptions = await safeQuery(async () => {
        return await prisma.subscription.findMany({
          take: 10,
          include: {
            user: true,
            plan: true
          }
        })
      })
      integrity.details.subscriptions.count = subscriptions?.length || 0
      integrity.details.subscriptions.samples = subscriptions || []

      // 找出孤立的Subscriptions（没有对应User的）
      if (subscriptions) {
        integrity.details.subscriptions.orphaned = subscriptions.filter(sub => !sub.user)
      }

      // 检查Plans表
      const plans = await safeQuery(async () => {
        return await prisma.plan.findMany()
      })
      integrity.details.plans.count = plans?.length || 0
      integrity.details.plans.samples = plans || []

      // 分析问题
      if (integrity.details.users.count === 0 && integrity.details.accounts.count > 0) {
        integrity.issues.push('🚨 有Google账户记录但没有用户记录 - 登录过程可能失败')
      }

      if (integrity.details.users.count === 0 && integrity.details.subscriptions.count > 0) {
        integrity.issues.push('🚨 有订阅记录但没有用户记录 - 数据严重不一致')
      }

      if (integrity.details.accounts.orphaned.length > 0) {
        integrity.issues.push(`🚨 发现${integrity.details.accounts.orphaned.length}个孤立的账户记录`)
      }

      if (integrity.details.subscriptions.orphaned.length > 0) {
        integrity.issues.push(`🚨 发现${integrity.details.subscriptions.orphaned.length}个孤立的订阅记录`)
      }

      // 生成修复建议
      if (integrity.issues.length > 0) {
        integrity.recommendations.push('🔧 需要重建User记录以匹配现有的账户和订阅')
        integrity.recommendations.push('🔧 可以从Google账户信息重建用户')
        integrity.recommendations.push('🔧 需要重新关联孤立的记录')
      } else if (integrity.details.users.count === 0) {
        integrity.recommendations.push('💡 这是全新的系统，等待首次用户注册')
      } else {
        integrity.recommendations.push('✅ 数据完整性良好')
      }

    } catch (error) {
      integrity.issues.push(`❌ 数据库查询失败: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      try {
        await prisma.$disconnect()
      } catch (disconnectError) {
        console.log('数据库断开连接时出错:', disconnectError)
      }
    }

    console.log('=== 数据完整性检查完成 ===')
    console.log('完整性结果:', JSON.stringify(integrity, null, 2))

    return NextResponse.json({
      success: true,
      integrity,
      summary: {
        hasIssues: integrity.issues.length > 0,
        totalIssues: integrity.issues.length,
        needsRepair: integrity.details.accounts.orphaned.length > 0 ||
                     integrity.details.subscriptions.orphaned.length > 0
      }
    })

  } catch (error) {
    console.error('数据完整性检查API出错:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: '数据完整性检查失败'
      },
      { status: 500 }
    )
  }
}
