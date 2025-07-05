import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// 套餐类型定义
export type PlanType = 'free' | 'standard' | 'pro'

export interface PlanFeatures {
  maxImagesPerMonth: number
  maxResolution: string
  hasWatermark: boolean
  hasPriorityProcessing: boolean
  hasBatchProcessing: boolean
  hasAdvancedFeatures: boolean
  availableStyles: string[]
}

// 默认套餐配置
export const DEFAULT_PLANS: Record<PlanType, PlanFeatures> = {
  free: {
    maxImagesPerMonth: 3,
    maxResolution: '1024x1024',
    hasWatermark: true,
    hasPriorityProcessing: false,
    hasBatchProcessing: false,
    hasAdvancedFeatures: false,
    availableStyles: ['classic']
  },
  standard: {
    maxImagesPerMonth: 50,
    maxResolution: '2048x2048',
    hasWatermark: false,
    hasPriorityProcessing: false,
    hasBatchProcessing: false,
    hasAdvancedFeatures: false,
    availableStyles: ['classic', 'exaggerated', 'minimal', 'professional']
  },
  pro: {
    maxImagesPerMonth: 200,
    maxResolution: '4096x4096',
    hasWatermark: false,
    hasPriorityProcessing: true,
    hasBatchProcessing: true,
    hasAdvancedFeatures: true,
    availableStyles: ['classic', 'exaggerated', 'minimal', 'professional', 'artistic', 'premium']
  }
}

/**
 * 获取当前用户信息和订阅状态
 */
export async function getCurrentUserWithSubscription() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return null
  }

  if (!prisma) {
    throw new Error('Database not configured')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      plan: true,
      subscriptions: {
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      usage: {
        where: {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
        }
      }
    }
  })

  return user
}

/**
 * 获取用户的套餐特性
 */
export async function getUserPlanFeatures(userId?: string): Promise<PlanFeatures> {
  if (!userId) {
    return DEFAULT_PLANS.free
  }

  if (!prisma) {
    return DEFAULT_PLANS.free
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true }
  })

  if (!user?.plan) {
    return DEFAULT_PLANS.free
  }

  return {
    maxImagesPerMonth: user.plan.maxImagesPerMonth,
    maxResolution: user.plan.maxResolution,
    hasWatermark: user.plan.hasWatermark,
    hasPriorityProcessing: user.plan.hasPriorityProcessing,
    hasBatchProcessing: user.plan.hasBatchProcessing,
    hasAdvancedFeatures: user.plan.hasAdvancedFeatures,
    availableStyles: JSON.parse(user.plan.availableStyles || '["classic"]')
  }
}

/**
 * 检查用户是否可以生成图片（未超出限制）
 */
export async function canUserGenerateImage(userId: string): Promise<{
  canGenerate: boolean
  currentUsage: number
  maxUsage: number
  remainingUsage: number
}> {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  if (!prisma) {
    throw new Error('Database not configured')
  }

  // 获取用户套餐
  const features = await getUserPlanFeatures(userId)

  // 获取当月使用情况
  let usage = await prisma.userUsage.findUnique({
    where: {
      userId_month_year: {
        userId,
        month: currentMonth,
        year: currentYear
      }
    }
  })

  // 如果没有使用记录，创建一个
  if (!usage) {
    usage = await prisma.userUsage.create({
      data: {
        userId,
        month: currentMonth,
        year: currentYear,
        imagesGenerated: 0
      }
    })
  }

  const currentUsage = usage.imagesGenerated
  const maxUsage = features.maxImagesPerMonth
  const remainingUsage = Math.max(0, maxUsage - currentUsage)
  const canGenerate = currentUsage < maxUsage

  return {
    canGenerate,
    currentUsage,
    maxUsage,
    remainingUsage
  }
}

/**
 * 记录用户生成图片
 */
export async function recordImageGeneration(userId: string): Promise<void> {
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()

  if (!prisma) {
    throw new Error('Database not configured')
  }

  await prisma.userUsage.upsert({
    where: {
      userId_month_year: {
        userId,
        month: currentMonth,
        year: currentYear
      }
    },
    update: {
      imagesGenerated: {
        increment: 1
      },
      updatedAt: new Date()
    },
    create: {
      userId,
      month: currentMonth,
      year: currentYear,
      imagesGenerated: 1
    }
  })
}

/**
 * 检查用户是否有特定权限
 */
export async function hasPermission(userId: string, permission: keyof PlanFeatures): Promise<boolean> {
  const features = await getUserPlanFeatures(userId)
  return features[permission] as boolean
}

/**
 * 获取用户当前套餐类型
 */
export async function getUserPlanType(userId: string): Promise<PlanType> {
  if (!prisma) {
    return 'free'
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true }
  })

  if (!user?.plan) {
    return 'free'
  }

  return user.plan.name as PlanType
}

/**
 * 升级/更改用户套餐
 */
export async function updateUserPlan(userId: string, planType: PlanType): Promise<void> {
  if (!prisma) {
    throw new Error('Database not configured')
  }

  // 查找套餐
  const plan = await prisma.plan.findUnique({
    where: { name: planType }
  })

  if (!plan) {
    throw new Error(`Plan ${planType} not found`)
  }

  // 更新用户套餐
  await prisma.user.update({
    where: { id: userId },
    data: { planId: plan.id }
  })
}

/**
 * 创建订阅记录
 */
export async function createSubscription({
  userId,
  planType,
  billingCycle,
  stripeSubscriptionId,
  stripeCustomerId,
  stripePriceId
}: {
  userId: string
  planType: PlanType
  billingCycle: 'monthly' | 'yearly'
  stripeSubscriptionId?: string
  stripeCustomerId?: string
  stripePriceId?: string
}) {
  if (!prisma) {
    throw new Error('Database not configured')
  }

  const plan = await prisma.plan.findUnique({
    where: { name: planType }
  })

  if (!plan) {
    throw new Error(`Plan ${planType} not found`)
  }

  const now = new Date()
  const periodEnd = new Date(now)

  if (billingCycle === 'monthly') {
    periodEnd.setMonth(periodEnd.getMonth() + 1)
  } else {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1)
  }

  return await prisma.subscription.create({
    data: {
      userId,
      planId: plan.id,
      status: 'active',
      billingCycle,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      stripeSubscriptionId,
      stripeCustomerId,
      stripePriceId
    }
  })
}
