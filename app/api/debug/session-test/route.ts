import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma, safeQuery } from '@/lib/prisma'

// 强制动态渲染
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Session调试开始 ===')

    // 获取当前session
    const session = await getServerSession(authOptions)

    const diagnosis = {
      timestamp: new Date().toISOString(),
      nextAuthSession: {
        exists: !!session,
        user: session?.user || null,
        expires: session?.expires || null
      },
      database: {
        connected: !!prisma,
        user: null as any,
        avatar: {
          sessionImage: session?.user?.image || 'none',
          dbImage: 'not-checked',
          match: false
        }
      },
      recommendations: [] as string[]
    }

    // 检查数据库用户信息
    if (session?.user?.email && prisma) {
      try {
        const dbUser = await safeQuery(async () => {
          return await prisma!.user.findUnique({
            where: { email: session.user.email },
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
              createdAt: true,
              updatedAt: true,
              stripeCustomerId: true,
              planId: true
            }
          });
        });

        diagnosis.database.user = dbUser
        diagnosis.database.avatar.dbImage = dbUser?.image || 'none'
        diagnosis.database.avatar.match = diagnosis.database.avatar.sessionImage === diagnosis.database.avatar.dbImage

        // 分析头像同步问题
        if (!diagnosis.database.avatar.match) {
          if (diagnosis.database.avatar.sessionImage === 'none') {
            diagnosis.recommendations.push('⚠️ Session中没有头像信息')
          } else if (diagnosis.database.avatar.dbImage === 'none') {
            diagnosis.recommendations.push('⚠️ 数据库中没有保存头像')
          } else {
            diagnosis.recommendations.push('⚠️ Session和数据库头像不匹配')
            diagnosis.recommendations.push(`Session头像: ${diagnosis.database.avatar.sessionImage}`)
            diagnosis.recommendations.push(`数据库头像: ${diagnosis.database.avatar.dbImage}`)
          }
        } else {
          diagnosis.recommendations.push('✅ 头像同步正常')
        }

        // 检查用户创建时间
        if (dbUser?.createdAt && dbUser?.updatedAt) {
          const timeDiff = new Date(dbUser.updatedAt).getTime() - new Date(dbUser.createdAt).getTime()
          if (timeDiff < 60000) { // 1分钟内
            diagnosis.recommendations.push('ℹ️ 用户最近创建或更新，可能需要刷新页面')
          }
        }

      } catch (dbError) {
        diagnosis.recommendations.push(`❌ 数据库查询失败: ${dbError}`)
      }
    }

    // 通用建议
    if (!session) {
      diagnosis.recommendations.push('❌ 用户未登录')
    } else if (!session.user?.email) {
      diagnosis.recommendations.push('❌ Session缺少用户邮箱')
    } else if (!session.user?.image) {
      diagnosis.recommendations.push('⚠️ Session缺少头像信息，可能是Google权限问题')
    }

    return NextResponse.json({
      success: true,
      diagnosis,
      troubleshooting: [
        'NextAuth session可能有缓存延迟',
        '尝试强制刷新页面 (Ctrl+F5)',
        '清除浏览器cookies和localStorage',
        '检查Google OAuth scope是否包含profile信息',
        '查看是否需要更新NextAuth配置'
      ]
    })

  } catch (error) {
    console.error('Session调试失败:', error)
    return NextResponse.json({
      success: false,
      error: 'Session diagnosis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
