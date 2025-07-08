import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// 服务端Stripe实例
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required')
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil',
  typescript: true
})

// 客户端Stripe实例
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')
}

// Stripe价格ID配置
export const STRIPE_PRICE_IDS = {
  standard: {
    monthly: process.env.STRIPE_PRICE_STANDARD_MONTHLY || 'price_1OxPRJJKQCJGaOjQ8XGbwGYB',
    yearly: process.env.STRIPE_PRICE_STANDARD_YEARLY || 'price_1OxPRJJKQCJGaOjQ8XGbwGYC'
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_1OxPRJJKQCJGaOjQ8XGbwGYD',
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_1OxPRJJKQCJGaOjQ8XGbwGYE'
  }
}

// 创建Stripe客户
export async function createStripeCustomer(email: string, name?: string) {
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      source: 'sybau-picture'
    }
  })
}

// 创建Stripe结算会话
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  userId
}: {
  customerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
  userId: string
}) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      source: 'sybau-picture'
    },
    allow_promotion_codes: true
  })
}

// 创建Stripe Portal会话（用于管理订阅）
export async function createPortalSession(customerId: string, returnUrl: string) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl
  })
}

// 取消订阅
export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true
  })
}

// 恢复订阅
export async function resumeSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false
  })
}

// 获取订阅详情
export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId)
}

// 获取价格详情
export async function getPrice(priceId: string) {
  return await stripe.prices.retrieve(priceId)
}

// 获取产品详情
export async function getProduct(productId: string) {
  return await stripe.products.retrieve(productId)
}

// 验证Webhook签名
export function constructEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
) {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}
