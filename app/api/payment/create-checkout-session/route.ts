import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createCheckoutSession, createStripeCustomer, STRIPE_PRICE_IDS } from '@/lib/stripe'
import { getCurrentUserWithSubscription } from '@/lib/subscription'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { planType, billingCycle } = body

    // 验证输入
    if (!planType || !billingCycle) {
      return NextResponse.json(
        { error: 'Plan type and billing cycle are required' },
        { status: 400 }
      )
    }

    if (!['standard', 'pro'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    if (!['monthly', 'yearly'].includes(billingCycle)) {
      return NextResponse.json(
        { error: 'Invalid billing cycle' },
        { status: 400 }
      )
    }

    // 获取用户信息
    const user = await getCurrentUserWithSubscription()
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // 检查用户是否已经有活跃订阅（允许升级）
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'active'
      },
      include: {
        plan: true
      }
    })

    // 允许从免费套餐升级
    if (activeSubscription && activeSubscription.plan.name !== 'free') {
      return NextResponse.json(
        { error: 'User already has a paid subscription. Please manage your subscription from the billing portal.' },
        { status: 400 }
      )
    }

    // 获取价格ID
    const priceId = STRIPE_PRICE_IDS[planType as keyof typeof STRIPE_PRICE_IDS]?.[billingCycle as keyof typeof STRIPE_PRICE_IDS.standard]

    console.log('Payment request:', { planType, billingCycle, priceId })
    console.log('Available price IDs:', STRIPE_PRICE_IDS)

    if (!priceId) {
      return NextResponse.json(
        { error: `Price not found for ${planType} ${billingCycle}` },
        { status: 404 }
      )
    }

    // 创建或获取Stripe客户
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      const customer = await createStripeCustomer(user.email, user.name || undefined)
      stripeCustomerId = customer.id

      // 更新用户的Stripe客户ID
      if (prisma) {
        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId }
        })
      }
    }

    // 创建结算会话
    console.log('Creating checkout session for user:', user.email)
    const checkoutSession = await createCheckoutSession({
      customerId: stripeCustomerId,
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/pricing`,
      userId: user.id
    })
    console.log('Checkout session created:', checkoutSession.id)

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
