'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X, Star, Sparkles, Zap, Crown, Shield, Users, Rocket, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'

const getPricingPlans = (isAnnual: boolean) => [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    originalPrice: null,
    yearlyPrice: null,
    period: 'forever',
    description: 'Perfect for trying Sybau AI',
    badge: null,
    features: [
      'Free trial experience',
      'Basic Sybau styles',
      'Standard quality (1024x1024)',
      'Community gallery access'
    ],
    limitations: [
      'Basic usage quota',
      'Watermarked images'
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'outline' as const,
    popular: false,
    icon: Star
  },
  {
    id: 'standard',
    name: 'Standard',
    price: isAnnual ? '$6' : '$9',
    originalPrice: isAnnual ? '$9' : null,
    yearlyPrice: isAnnual ? '$72 per year' : null,
    period: isAnnual ? 'per month' : 'per month',
    description: 'Great for regular creators',
    badge: null,
    features: [
      '60 images per month',
      'All Sybau styles',
      'High quality (up to 2048x2048)',
      'No watermarks',
      'Download in multiple formats'
    ],
    limitations: [
      'Monthly usage limit'
    ],
    buttonText: 'Choose Standard',
    buttonVariant: 'default' as const,
    popular: false,
    icon: Zap
  },
  {
    id: 'pro',
    name: 'PRO',
    price: isAnnual ? '$12' : '$19',
    originalPrice: isAnnual ? '$19' : null,
    yearlyPrice: isAnnual ? '$144 per year' : null,
    period: isAnnual ? 'per month' : 'per month',
    description: 'For professional creators',
    badge: 'MOST POPULAR',
    features: [
      '180 images per month',
      'All premium Sybau styles',
      'Ultra-high quality (up to 4096x4096)',
      'No watermarks',
      'Priority processing',
      'Advanced AI features'
    ],
    limitations: [],
    buttonText: 'Go PRO',
    buttonVariant: 'default' as const,
    popular: true,
    icon: Crown
  }
]

const faqs = [
  {
    question: 'How does the image limit work?',
    answer: 'Each plan includes a specific number of images you can generate. Free users get a basic trial quota, Standard users get 60 per month, and PRO users get 180 per month.'
  },
  {
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle.'
  },
  {
    question: 'What happens if I exceed my image limit?',
    answer: 'If you reach your monthly limit, you can upgrade your plan to continue creating amazing content. Free users can upgrade to unlock more features and higher quotas.'
  },
  {
    question: 'Are there any hidden fees?',
    answer: 'No, our pricing is completely transparent. The price you see is what you pay, with no hidden fees or charges.'
  },
  {
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access to your plan features until the end of your billing period.'
  }
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const pricingPlans = getPricingPlans(isAnnual)
  const router = useRouter()
  const { data: session, status } = useSession()

  const handlePlanClick = async (planId: string) => {
    if (planId === 'free') {
      // 免费版直接跳转到主页使用生成器
      router.push('/')
      return
    }

    // 检查用户是否已登录
    if (status === 'loading') {
      return
    }

    if (!session) {
      // 未登录用户跳转到登录页面
      router.push('/auth/signin?callbackUrl=/pricing')
      return
    }

    // 开始支付流程
    setLoadingPlan(planId)

    try {
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType: planId,
          billingCycle: isAnnual ? 'yearly' : 'monthly'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        // 重定向到Stripe结算页面
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "支付失败",
        description: error instanceof Error ? error.message : "创建支付会话失败，请稍后再试",
        variant: "destructive"
      })
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      <div className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Unlock Sybau AI's Full Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your creative needs. Generate amazing Sybau images with our AI-powered platform.
          </p>

          {/* Billing Toggle - Fixed overlap issue */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white rounded-full p-1 shadow-lg border relative">
              <div className="flex items-center relative">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    !isAnnual
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    isAnnual
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Annual
                </button>
              </div>
              {/* Move the badge outside the button */}
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-green-500 text-white text-xs px-2 py-1 shadow-lg">
                  Save up to 37%
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon
            return (
              <Card key={plan.id} className={`relative overflow-hidden ${plan.popular ? 'ring-2 ring-purple-500 shadow-lg scale-105' : ''}`}>
                {plan.badge && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-sm font-medium">
                    {plan.badge}
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.price}
                    <span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                  </div>
                  {plan.originalPrice && (
                    <div className="text-sm text-gray-500 line-through mb-2">
                      {plan.originalPrice}/{plan.period}
                    </div>
                  )}
                  {plan.yearlyPrice && isAnnual && (
                    <div className="text-sm text-gray-600 mb-2">
                      {plan.yearlyPrice}
                    </div>
                  )}
                  <p className="text-gray-600">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <Button
                    className={`w-full mb-6 ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : ''}`}
                    variant={plan.buttonVariant}
                    size="lg"
                    onClick={() => handlePlanClick(plan.id)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.buttonText
                    )}
                  </Button>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">What's included:</h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {plan.limitations.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-500 mb-2">Limitations:</h4>
                        <ul className="space-y-2">
                          {plan.limitations.map((limitation, idx) => (
                            <li key={idx} className="flex items-start">
                              <X className="w-4 h-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-500">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Compare All Plans</h2>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Free</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Standard</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">Professional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Monthly Images</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">Basic quota</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">60</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">180</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Max Resolution</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">1024x1024</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">2048x2048</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">4096x4096</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Watermarks</td>
                    <td className="px-6 py-4 text-center"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">All Sybau Styles</td>
                    <td className="px-6 py-4 text-center"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Priority Processing</td>
                    <td className="px-6 py-4 text-center"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><X className="w-4 h-4 text-red-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-4 h-4 text-green-500 mx-auto" /></td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Creating?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of creators who use Sybau AI to bring their ideas to life.
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" onClick={() => router.push('/')}>
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  )
}
