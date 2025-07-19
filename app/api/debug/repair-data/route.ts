import { NextRequest, NextResponse } from 'next/server'
import { prisma, safeQuery } from '@/lib/prisma'

// 强制动态渲染
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: '数据修复API - 请使用POST方法执行修复',
    usage: {
      'POST /api/debug/repair-data': '执行数据修复',
      'POST /api/debug/repair-data?dry-run=true': '模拟修复（不实际执行）'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const dryRun = url.searchParams.get('dry-run') === 'true'

    console.log(`=== 数据修复${dryRun ? '（模拟模式）' : ''}开始 ===`)

    if (!prisma) {
      return NextResponse.json({
        success: false,
        error: 'Database not configured'
      }, { status: 500 })
    }

    const repair = {
      timestamp: new Date().toISOString(),
      dryRun,
      actions: [] as string[],
      created: {
        users: 0,
        linked: 0
      },
      errors: [] as string[]
    }

    try {
      await prisma.$connect()

      // 1. 查找孤立的账户记录
      const orphanedAccounts = await safeQuery(async () => {
        return await prisma.account.findMany({
          include: {
            user: true
          }
        })
      })

      const realOrphans = orphanedAccounts?.filter(account => !account.user) || []
      repair.actions.push(`发现 ${realOrphans.length} 个孤立的账户记录`)

      // 2. 为每个孤立账户创建用户
      for (const account of realOrphans) {
        try {
          if (!dryRun) {
            // 创建用户记录
            const newUser = await prisma.user.create({
              data: {
                email: account.email || `user_${account.providerAccountId}@gmail.com`,
                name: account.name || `User ${account.providerAccountId}`,
                image: account.image,
                emailVerified: new Date(),
                usageCount: 0,
                isNewUser: false // 标记为已存在用户
              }
            })

            // 更新账户关联
            await prisma.account.update({
              where: { id: account.id },
              data: { userId: newUser.id }
            })

            repair.actions.push(`✅ 为账户 ${account.email} 创建了用户记录`)
            repair.created.users++
          } else {
            repair.actions.push(`[模拟] 将为账户 ${account.email} 创建用户记录`)
          }
        } catch (error) {
          const errorMsg = `❌ 为账户 ${account.email} 创建用户失败: ${error instanceof Error ? error.message : 'Unknown error'}`
          repair.errors.push(errorMsg)
          repair.actions.push(errorMsg)
        }
      }

      // 3. 查找孤立的订阅记录
      const orphanedSubscriptions = await safeQuery(async () => {
        return await prisma.subscription.findMany({
          include: {
            user: true,
            plan: true
          }
        })
      })

      const realOrphanedSubs = orphanedSubscriptions?.filter(sub => !sub.user) || []
      repair.actions.push(`发现 ${realOrphanedSubs.length} 个孤立的订阅记录`)

      // 4. 处理孤立的订阅
      if (realOrphanedSubs.length > 0) {
        if (!dryRun) {
          // 尝试删除无法恢复的孤立订阅
          for (const sub of realOrphanedSubs) {
            try {
              await prisma.subscription.delete({
                where: { id: sub.id }
              })
              repair.actions.push(`🗑️ 删除了孤立的订阅记录 ${sub.id}`)
            } catch (error) {
              repair.errors.push(`❌ 删除孤立订阅失败: ${error instanceof Error ? error.message : 'Unknown error'}`)
            }
          }
        } else {
          repair.actions.push(`[模拟] 将删除 ${realOrphanedSubs.length} 个无法恢复的订阅记录`)
        }
      }

      // 5. 验证修复结果
      if (!dryRun && repair.created.users > 0) {
        const finalCheck = await safeQuery(async () => {
          return {
            users: await prisma.user.count(),
            accounts: await prisma.account.count(),
            subscriptions: await prisma.subscription.count()
          }
        })

        repair.actions.push(`🔍 修复后统计: Users: ${finalCheck?.users}, Accounts: ${finalCheck?.accounts}, Subscriptions: ${finalCheck?.subscriptions}`)
      }

    } catch (error) {
      const errorMsg = `❌ 数据修复过程失败: ${error instanceof Error ? error.message : 'Unknown error'}`
      repair.errors.push(errorMsg)
      repair.actions.push(errorMsg)
    } finally {
      try {
        await prisma.$disconnect()
      } catch (disconnectError) {
        console.log('数据库断开连接时出错:', disconnectError)
      }
    }

    console.log(`=== 数据修复${dryRun ? '（模拟模式）' : ''}完成 ===`)
    console.log('修复结果:', JSON.stringify(repair, null, 2))

    return NextResponse.json({
      success: repair.errors.length === 0,
      repair,
      summary: {
        dryRun,
        usersCreated: repair.created.users,
        hasErrors: repair.errors.length > 0,
        totalErrors: repair.errors.length,
        message: dryRun
          ? '这是模拟修复，没有实际修改数据库'
          : repair.errors.length === 0
            ? '数据修复成功完成'
            : '数据修复完成但有错误'
      }
    })

  } catch (error) {
    console.error('数据修复API出错:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: '数据修复失败'
      },
      { status: 500 }
    )
  }
}
