import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createCheckoutSession, createStripeCustomer, STRIPE_PRICE_IDS } from '@/lib/stripe'
import { prisma, safeQuery } from '@/lib/prisma'
import { getEnvironmentConfig } from '@/lib/env-manager'

// 用户创建辅助函数
async function createUserWithRetry(userEmail: string, userName: string, userImage: string | null) {
  try {
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
      });
    });

    if (!freePlan) {
      console.error('❌ 未找到免费计划');
      throw new Error('Free plan not found in database');
    }

    console.log('✅ 找到免费计划:', freePlan.id);

    // 创建用户
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
        select: {
          id: true,
          email: true,
          name: true,
          stripeCustomerId: true,
          planId: true
        }
      });
    });

    return newUser;
  } catch (error) {
    console.error('用户创建过程出错:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== 创建支付会话 ===');

    // 检查用户认证
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      console.log('用户未登录');
      return NextResponse.json(
        { error: 'Authentication required', message: '请先登录您的账户' },
        { status: 401 }
      )
    }

    const userEmail = session.user.email;
    const userName = session.user.name || userEmail.split('@')[0];
    const userImage = session.user.image;
    console.log('支付请求用户:', userEmail);

    const body = await request.json()
    const { planType, billingCycle } = body

    // 验证输入
    if (!planType || !billingCycle) {
      return NextResponse.json(
        { error: 'Missing parameters', message: '缺少必要的套餐类型或计费周期参数' },
        { status: 400 }
      )
    }

    if (!['standard', 'pro'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type', message: '无效的套餐类型，仅支持 standard 或 pro' },
        { status: 400 }
      )
    }

    if (!['monthly', 'yearly'].includes(billingCycle)) {
      return NextResponse.json(
        { error: 'Invalid billing cycle', message: '无效的计费周期，仅支持 monthly 或 yearly' },
        { status: 400 }
      )
    }

    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured', message: '数据库连接失败，请稍后重试' },
        { status: 500 }
      )
    }

    // 第一次尝试获取用户信息
    let user = await safeQuery(async () => {
      return await prisma!.user.findUnique({
        where: { email: userEmail },
        select: {
          id: true,
          email: true,
          name: true,
          stripeCustomerId: true,
          planId: true
        }
      });
    });

    // 如果用户不存在，创建用户
    if (!user) {
      console.log('数据库中未找到用户，正在创建用户:', userEmail);

      try {
        user = await createUserWithRetry(userEmail, userName, userImage);
        console.log('✅ 用户创建成功:', user?.id);
      } catch (createError) {
        console.error('❌ 用户创建失败:', createError);
        return NextResponse.json(
          {
            error: 'Failed to create user',
            message: '创建用户失败，请稍后重试。如果问题持续存在，请联系客服。',
            details: createError instanceof Error ? createError.message : 'Unknown error',
            troubleshooting: [
              '请尝试刷新页面后重试',
              '确保您已正确登录Google账户',
              '如果问题持续，请联系技术支持'
            ]
          },
          { status: 500 }
        )
      }
    }

    if (!user) {
      console.log('用户创建或获取失败');
      return NextResponse.json(
        {
          error: 'User creation failed',
          message: '用户账户处理失败，请重新登录后重试',
          troubleshooting: [
            '请退出登录后重新登录',
            '清除浏览器缓存后重试',
            '使用无痕模式重试'
          ]
        },
        { status: 500 }
      )
    }

    console.log('找到用户:', user.id, user.planId);

    // 检查用户是否已经有活跃订阅（允许从免费套餐升级）
    const activeSubscription = await safeQuery(async () => {
      return await prisma!.subscription.findFirst({
        where: {
          userId: user.id,
          status: 'active'
        },
        include: {
          plan: true
        }
      });
    });

    // 允许从免费套餐升级，但不允许重复订阅付费套餐
    if (activeSubscription && activeSubscription.plan.name !== 'free') {
      console.log('用户已有付费订阅:', activeSubscription.plan.name);
      return NextResponse.json(
        {
          error: 'Already subscribed',
          message: '您已经订阅了付费套餐，请在账单门户中管理您的订阅',
          currentPlan: activeSubscription.plan.name
        },
        { status: 400 }
      )
    }

    // 获取价格ID
    const priceId = STRIPE_PRICE_IDS[planType as keyof typeof STRIPE_PRICE_IDS]?.[billingCycle as keyof typeof STRIPE_PRICE_IDS.standard]

    console.log('支付请求详情:', { planType, billingCycle, priceId });

    if (!priceId) {
      console.log('未找到价格ID:', planType, billingCycle);
      console.log('可用价格ID:', STRIPE_PRICE_IDS);
      return NextResponse.json(
        {
          error: 'Price not found',
          message: `未找到 ${planType} ${billingCycle} 套餐的价格配置`,
          availablePlans: Object.keys(STRIPE_PRICE_IDS)
        },
        { status: 404 }
      )
    }

    // 创建或获取Stripe客户
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      console.log('为用户创建Stripe客户:', userEmail);
      try {
        const customer = await createStripeCustomer(userEmail, user.name || undefined)
        stripeCustomerId = customer.id

        // 更新用户的Stripe客户ID
        await safeQuery(async () => {
          await prisma!.user.update({
            where: { id: user.id },
            data: { stripeCustomerId }
          });
        });
      } catch (stripeError) {
        console.error('❌ 创建Stripe客户失败:', stripeError);
        return NextResponse.json(
          {
            error: 'Failed to create Stripe customer',
            message: '支付系统初始化失败，请稍后重试',
            details: stripeError instanceof Error ? stripeError.message : 'Unknown error'
          },
          { status: 500 }
        )
      }
    }

    // 创建结算会话
    console.log('为用户创建支付会话:', userEmail);
    try {
      // 使用环境管理器获取基础URL
      const envConfig = getEnvironmentConfig();
      
      const checkoutSession = await createCheckoutSession({
        customerId: stripeCustomerId,
        priceId,
        successUrl: `${envConfig.baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${envConfig.baseUrl}/pricing`,
        userId: user.id
      })

      console.log('支付会话创建成功:', checkoutSession.id);

      return NextResponse.json({
        success: true,
        sessionId: checkoutSession.id,
        url: checkoutSession.url,
        message: '支付会话创建成功，正在跳转到支付页面...'
      })
    } catch (checkoutError) {
      console.error('❌ 创建支付会话失败:', checkoutError);
      return NextResponse.json(
        {
          error: 'Failed to create checkout session',
          message: '创建支付会话失败，请稍后重试',
          details: checkoutError instanceof Error ? checkoutError.message : 'Unknown error'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('创建支付会话失败:', error)
    return NextResponse.json(
      {
        error: 'Payment session creation failed',
        message: '支付处理过程中出现错误，请稍后重试',
        details: error instanceof Error ? error.message : 'Unknown error',
        troubleshooting: [
          '请检查网络连接',
          '尝试刷新页面后重试',
          '如果问题持续，请联系客服'
        ]
      },
      { status: 500 }
    )
  }
}
