import { NextRequest, NextResponse } from 'next/server'
import { prisma, safeQuery } from '@/lib/prisma'

// 强制动态渲染
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('=== 数据库状态检查开始 ===')

    const status = {
      timestamp: new Date().toISOString(),
      database: {
        connected: false,
        error: null as string | null,
        url: process.env.DATABASE_URL ? '已配置' : '未配置',
        urlType: process.env.DATABASE_URL ? (
          process.env.DATABASE_URL.includes('localhost') ? 'localhost' :
          process.env.DATABASE_URL.includes('supabase') ? 'supabase' :
          process.env.DATABASE_URL.includes('postgres') ? 'postgres' : '其他'
        ) : '未知'
      },
      tables: {
        users: 0,
        plans: 0,
        subscriptions: 0,
        accounts: 0,
        sessions: 0
      },
      environment: process.env.NODE_ENV || 'unknown',
      recommendations: [] as string[]
    }

    // 检查数据库配置
    if (!process.env.DATABASE_URL) {
      status.database.error = '未配置DATABASE_URL环境变量'
      status.recommendations.push('❌ 请配置DATABASE_URL环境变量')
      return NextResponse.json(status)
    }

    // 检查prisma连接
    if (!prisma) {
      status.database.error = 'Prisma客户端未初始化'
      status.recommendations.push('❌ Prisma客户端未正确初始化')
      return NextResponse.json(status)
    }

    try {
      // 测试数据库连接
      await prisma.$connect()
      status.database.connected = true
      console.log('✅ 数据库连接成功')

      // 检查各表的记录数
      const tableChecks = [
        { name: 'users', query: () => prisma.user.count() },
        { name: 'plans', query: () => prisma.plan.count() },
        { name: 'subscriptions', query: () => prisma.subscription.count() },
        { name: 'accounts', query: () => prisma.account.count() },
        { name: 'sessions', query: () => prisma.session.count() }
      ]

      for (const check of tableChecks) {
        try {
          const count = await safeQuery(check.query)
          status.tables[check.name as keyof typeof status.tables] = count || 0
          console.log(`✅ ${check.name}表: ${count}条记录`)
        } catch (error) {
          console.log(`❌ ${check.name}表检查失败:`, error)
          status.recommendations.push(`❌ ${check.name}表访问失败`)
        }
      }

      // 生成建议
      if (status.tables.plans === 0) {
        status.recommendations.push('⚠️ Plans表为空，需要初始化套餐数据')
      }

      if (status.tables.users === 0) {
        status.recommendations.push('💡 Users表为空，这是正常的如果还没有用户注册')
      }

      if (status.recommendations.length === 0) {
        status.recommendations.push('✅ 数据库状态良好')
      }

    } catch (error) {
      status.database.error = error instanceof Error ? error.message : 'Unknown error'
      status.recommendations.push('❌ 数据库连接失败，请检查连接配置')
      console.log('❌ 数据库连接失败:', error)
    } finally {
      try {
        await prisma.$disconnect()
      } catch (disconnectError) {
        console.log('数据库断开连接时出错:', disconnectError)
      }
    }

    console.log('=== 数据库状态检查完成 ===')
    console.log('状态结果:', JSON.stringify(status, null, 2))

    return NextResponse.json(status)

  } catch (error) {
    console.error('数据库状态检查API出错:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: '数据库状态检查失败',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
