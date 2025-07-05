import { NextRequest, NextResponse } from 'next/server'
import { constructEvent } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { updateUserPlan, createSubscription, PlanType } from '@/lib/subscription'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      )
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // 验证webhook签名
    const event = constructEvent(body, signature, webhookSecret)

    console.log('📧 Received Stripe webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log('🔄 Unhandled event type:', event.type)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Stripe webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// 处理结算完成事件
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('✅ Checkout completed for session:', session.id)

  const userId = session.metadata?.userId
  if (!userId) {
    console.error('❌ No user ID in session metadata')
    return
  }

  const subscriptionId = session.subscription as string
  if (!subscriptionId) {
    console.error('❌ No subscription ID in session')
    return
  }

  console.log(`🔄 Processing checkout completion for user ${userId}`)
}

// 处理订阅创建事件
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('📊 Subscription created:', subscription.id)

  if (!prisma) {
    console.error('❌ Database not configured')
    return
  }

  const customerId = subscription.customer as string
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId }
  })

  if (!user) {
    console.error('❌ User not found for customer:', customerId)
    return
  }

  // 获取价格信息来确定套餐类型
  const priceId = subscription.items.data[0]?.price.id
  let planType: PlanType = 'free'
  let billingCycle: 'monthly' | 'yearly' = 'monthly'

  // 根据价格ID确定套餐类型
  if (priceId === process.env.STRIPE_PRICE_STANDARD_MONTHLY) {
    planType = 'standard'
    billingCycle = 'monthly'
  } else if (priceId === process.env.STRIPE_PRICE_STANDARD_YEARLY) {
    planType = 'standard'
    billingCycle = 'yearly'
  } else if (priceId === process.env.STRIPE_PRICE_PRO_MONTHLY) {
    planType = 'pro'
    billingCycle = 'monthly'
  } else if (priceId === process.env.STRIPE_PRICE_PRO_YEARLY) {
    planType = 'pro'
    billingCycle = 'yearly'
  }

  try {
    // 更新用户套餐
    await updateUserPlan(user.id, planType)

    // 创建订阅记录
    await createSubscription({
      userId: user.id,
      planType,
      billingCycle,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: customerId,
      stripePriceId: priceId
    })

    console.log(`✅ Subscription created for user ${user.email} - Plan: ${planType}`)

  } catch (error) {
    console.error('❌ Error creating subscription:', error)
  }
}

// 处理订阅更新事件
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('🔄 Subscription updated:', subscription.id)

  if (!prisma) {
    console.error('❌ Database not configured')
    return
  }

  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id }
  })

  if (!dbSubscription) {
    console.error('❌ Subscription not found in database:', subscription.id)
    return
  }

  // 更新订阅状态
  const stripeSubscription = subscription as any
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart: stripeSubscription.current_period_start ? new Date(stripeSubscription.current_period_start * 1000) : undefined,
      currentPeriodEnd: stripeSubscription.current_period_end ? new Date(stripeSubscription.current_period_end * 1000) : undefined,
      canceledAt: stripeSubscription.canceled_at ? new Date(stripeSubscription.canceled_at * 1000) : null
    }
  })

  // 如果订阅被取消，将用户降级到免费套餐
  if (subscription.status === 'canceled' || subscription.status === 'incomplete_expired') {
    await updateUserPlan(dbSubscription.userId, 'free')
  }

  console.log(`✅ Subscription updated for ID: ${subscription.id}`)
}

// 处理订阅删除事件
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('🗑️ Subscription deleted:', subscription.id)

  if (!prisma) {
    console.error('❌ Database not configured')
    return
  }

  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id }
  })

  if (!dbSubscription) {
    console.error('❌ Subscription not found in database:', subscription.id)
    return
  }

  // 更新订阅状态为已取消
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: 'canceled',
      canceledAt: new Date()
    }
  })

  // 将用户降级到免费套餐
  await updateUserPlan(dbSubscription.userId, 'free')

  console.log(`✅ Subscription deleted and user downgraded to free plan`)
}

// 处理发票支付成功事件
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('💰 Invoice payment succeeded:', invoice.id)

  const stripeInvoice = invoice as any
  const subscriptionId = stripeInvoice.subscription as string
  if (!subscriptionId) {
    return
  }

  if (!prisma) {
    console.error('❌ Database not configured')
    return
  }

  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId }
  })

  if (!dbSubscription) {
    console.error('❌ Subscription not found for invoice:', invoice.id)
    return
  }

  // 更新订阅状态为活跃
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: 'active',
      currentPeriodStart: stripeInvoice.period_start ? new Date(stripeInvoice.period_start * 1000) : undefined,
      currentPeriodEnd: stripeInvoice.period_end ? new Date(stripeInvoice.period_end * 1000) : undefined
    }
  })

  console.log(`✅ Invoice payment processed for subscription: ${subscriptionId}`)
}

// 处理发票支付失败事件
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('❌ Invoice payment failed:', invoice.id)

  const stripeInvoice = invoice as any
  const subscriptionId = stripeInvoice.subscription as string
  if (!subscriptionId) {
    return
  }

  if (!prisma) {
    console.error('❌ Database not configured')
    return
  }

  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscriptionId }
  })

  if (!dbSubscription) {
    console.error('❌ Subscription not found for invoice:', invoice.id)
    return
  }

  // 更新订阅状态为过期
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: 'past_due'
    }
  })

  console.log(`❌ Payment failed for subscription: ${subscriptionId}`)
}
