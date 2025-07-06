import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    console.log('🔍 调试Prisma客户端状态...')

    const result = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
        DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 20) + '...',
      },
      prisma: {
        exists: !!prisma,
        type: typeof prisma,
      },
      tests: {} as any
    }

    if (prisma) {
      try {
        // 测试数据库连接
        await prisma.$queryRaw`SELECT 1 as test`
        result.tests.connection = '✅ 连接成功'

        // 测试表存在
        const userCount = await prisma.user.count()
        result.tests.users_table = `✅ users表存在 (${userCount} 条记录)`

        const accountCount = await prisma.account.count()
        result.tests.accounts_table = `✅ accounts表存在 (${accountCount} 条记录)`

      } catch (error: any) {
        result.tests.database_error = `❌ 数据库错误: ${error.message}`
      }
    } else {
      result.tests.prisma_null = '❌ Prisma客户端为null - NextAuth无法保存用户!'
    }

    return NextResponse.json(result, { status: 200 })

  } catch (error: any) {
    console.error('调试API错误:', error)
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack
      },
      { status: 500 }
    )
  }
}
