import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma, safeQuery } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('=== 用户修复API ===')

    // 检查用户认证
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.log('用户未登录')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userEmail = session.user.email
    const userName = session.user.name || userEmail.split('@')[0]
    const userImage = session.user.image

    console.log('正在修复用户:', userEmail)

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // 检查用户是否已存在
    const existingUser = await safeQuery(async () => {
      return await prisma!.user.findUnique({
        where: { email: userEmail },
        include: {
          plan: true,
          usage: true
        }
      })
    })

    if (existingUser) {
      console.log('✅ 用户已存在:', existingUser.id)
      return NextResponse.json({
        success: true,
        message: 'User already exists',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          planId: existingUser.planId
        }
      })
    }

    // 查找免费计划
    const freePlan = await safeQuery(async () => {
      return await prisma!.plan.findFirst({
        where: {
          OR: [
            { id: 'plan_free' },
            { name: 'free' },
            { name: 'Free Plan' }
          ]
        }
      })
    })

    if (!freePlan) {
      console.error('❌ 未找到免费计划')
      return NextResponse.json(
        { error: 'Free plan not found' },
        { status: 500 }
      )
    }

    console.log('✅ 找到免费计划:', freePlan.id)

    // 创建新用户
    const newUser = await safeQuery(async () => {
      return await prisma!.user.create({
        data: {
          email: userEmail,
          name: userName,
          image: userImage,
          password: null, // OAuth用户没有密码
          planId: freePlan.id,
          usage: {
            create: {
              imagesGenerated: 0,
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
              lastResetAt: new Date()
            }
          }
        },
        include: {
          plan: true,
          usage: true
        }
      })
    })

    if (!newUser) {
      console.error('❌ 用户创建失败')
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    console.log('✅ 用户创建成功:', newUser.id)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        planId: newUser.planId,
        plan: newUser.plan
      }
    })

  } catch (error) {
    console.error('用户修复失败:', error)
    return NextResponse.json(
      {
        error: 'Failed to fix user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
