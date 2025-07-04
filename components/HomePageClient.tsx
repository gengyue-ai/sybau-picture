'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Rocket, Star, TrendingUp, Heart, Users, Shield, Clock, Award, Check, Play } from 'lucide-react'

// 静态文本内容
const staticTexts = {
  en: {
    'home.hero.title': 'Create Viral',
    'home.hero.subtitle': 'Sybau Memes',
    'home.hero.tagline': 'in Seconds',
    'home.hero.description': 'Transform any photo into hilarious Sybau Lazer Dim 700 style memes with our AI technology! No design skills required - just upload and watch the magic happen!',
    'home.benefits.free': '100% Free',
    'home.benefits.noRegistration': 'No Registration',
    'home.benefits.hdQuality': 'HD Quality',
    'home.benefits.fastProcessing': '8s Processing',
    'home.cta.tryGenerator': 'Try Picture Generator',
    'home.socialProof': 'Trusted by creators worldwide',
    'home.stats.memes': 'Memes Created',
    'home.stats.rating': 'User Rating',
    'home.stats.countries': 'Countries',
    'home.howitworks.title': 'How Sybau Picture Works',
    'home.howitworks.description': 'Creating viral memes with Sybau Picture is simple, fast, and completely free. Our AI-powered platform transforms your photos into engaging Sybau-style content in three easy steps.',
    'home.howitworks.step1': 'Upload Your Photo',
    'home.howitworks.step1.desc': 'Simply drag and drop or select any image from your device. Sybau Picture supports JPG, PNG, and WebP formats.',
    'home.howitworks.step2': 'AI Processing Magic',
    'home.howitworks.step2.desc': 'Our advanced AI technology analyzes your image and applies the signature Sybau style transformation automatically.',
    'home.howitworks.step3': 'Download Your Meme',
    'home.howitworks.step3.desc': 'Within seconds, download your high-quality Sybau Picture meme ready to share across all social platforms.',
    'home.features.title': 'Why Choose Sybau Picture?',
    'home.features.description': 'Experience the power of AI-driven meme creation with Sybau Picture, the ultimate platform for viral content creation.',
    'home.features.aiPowered.title': 'AI-Powered Technology',
    'home.features.aiPowered.description': 'Advanced artificial intelligence ensures every Sybau Picture creation is perfect and engaging.',
    'home.features.lightning.title': 'Lightning Fast Processing',
    'home.features.lightning.description': 'Generate professional-quality memes in just 8 seconds with Sybau Picture\'s optimized system.',
    'home.features.easy.title': 'Easy to Use Interface',
    'home.features.easy.description': 'No design experience needed - Sybau Picture makes meme creation accessible to everyone.',
    'home.features.secure.title': 'Secure & Private',
    'home.features.secure.desc': 'Your images are processed securely and never stored on our servers. Sybau Picture respects your privacy.',
    'home.features.community.title': 'Global Community',
    'home.features.community.desc': 'Join millions of creators worldwide who trust Sybau Picture for their meme generation needs.',
    'home.features.available.title': '24/7 Available',
    'home.features.available.desc': 'Create memes anytime, anywhere with Sybau Picture. Our platform is always ready when inspiration strikes.',
    'home.usecases.title': 'Perfect for Every Creator',
    'home.usecases.description': 'Whether you\'re a professional marketer or casual content creator, Sybau Picture empowers everyone to create viral memes that capture attention and drive engagement.',
    'home.usecases.social': 'Social Media Managers',
    'home.usecases.social.desc': 'Create engaging content for brands and businesses with Sybau Picture\'s professional-grade results.',
    'home.usecases.content': 'Content Creators',
    'home.usecases.content.desc': 'Stand out on platforms like TikTok, Instagram, and YouTube with unique Sybau Picture creations.',
    'home.usecases.marketing': 'Marketing Teams',
    'home.usecases.marketing.desc': 'Boost campaign performance with eye-catching memes that resonate with your target audience.',
    'home.usecases.individuals': 'Individual Users',
    'home.usecases.individuals.desc': 'Share funny moments with friends and family using Sybau Picture\'s entertaining transformations.',
    'home.community.title': 'Join the Sybau Picture Community',
    'home.community.extended': 'Share your creations, get inspired, and discover new ways to use our platform.',
    'home.community.stats.users': '1.2M+',
    'home.community.stats.users.label': 'Active Users',
    'home.community.stats.creations': '50K+',
    'home.community.stats.creations.label': 'Daily Creations',
    'home.community.stats.satisfaction': '95%',
    'home.community.stats.satisfaction.label': 'Satisfaction Rate',
    'home.cta.title': 'Ready to Go Viral? 🚀',
    'home.cta.description': 'Join millions of creators who are already making viral content with Sybau Picture. Start your meme creation journey today!',
    'home.cta.startCreating': 'Start Creating Now',
    'home.footer.features': 'Sybau Picture supports JPG, PNG, WebP formats • No registration required • 100% free to use',
    'home.footer.secure': 'Secure Processing',
    'home.footer.speed': '8-Second Generation',
    'home.footer.community': 'Global Community'
  },
  zh: {
    'home.hero.title': '创建病毒式',
    'home.hero.subtitle': 'Sybau表情包',
    'home.hero.tagline': '几秒钟搞定',
    'home.hero.description': '使用我们的AI技术将任何照片转换为搞笑的Sybau Lazer Dim 700风格表情包！无需设计技能 - 只需上传，见证奇迹发生！',
    'home.benefits.free': '100%免费',
    'home.benefits.noRegistration': '无需注册',
    'home.benefits.hdQuality': '高清质量',
    'home.benefits.fastProcessing': '8秒处理',
    'home.cta.tryGenerator': '尝试图片生成器',
    'home.socialProof': '全球创作者信赖',
    'home.stats.memes': '表情包已创建',
    'home.stats.rating': '用户评分',
    'home.stats.countries': '个国家',
    'home.howitworks.title': 'Sybau Picture如何工作',
    'home.howitworks.description': '使用Sybau Picture创建病毒式表情包简单、快速且完全免费。我们的AI驱动平台通过三个简单步骤将您的照片转换为引人入胜的Sybau风格内容。',
    'home.howitworks.step1': '上传您的照片',
    'home.howitworks.step1.desc': '只需拖放或从设备中选择任何图像。Sybau Picture支持JPG、PNG和WebP格式。',
    'home.howitworks.step2': 'AI处理魔法',
    'home.howitworks.step2.desc': '我们先进的AI技术分析您的图像并自动应用标志性的Sybau风格转换。',
    'home.howitworks.step3': '下载您的表情包',
    'home.howitworks.step3.desc': '几秒钟内，下载您的高质量Sybau Picture表情包，准备在所有社交平台上分享。',
    'home.features.title': '为什么选择Sybau Picture？',
    'home.features.description': '体验AI驱动的表情包创作的力量，Sybau Picture是病毒式内容创作的终极平台。',
    'home.features.aiPowered.title': 'AI驱动技术',
    'home.features.aiPowered.description': '先进的人工智能确保每个Sybau Picture作品都完美且引人入胜。',
    'home.features.lightning.title': '闪电般快速处理',
    'home.features.lightning.description': '使用Sybau Picture的优化系统，仅需8秒生成专业质量的表情包。',
    'home.features.easy.title': '简单易用界面',
    'home.features.easy.description': '无需设计经验 - Sybau Picture让表情包创作对所有人都触手可及。',
    'home.features.secure.title': '安全私密',
    'home.features.secure.desc': '您的图像被安全处理，永远不会存储在我们的服务器上。Sybau Picture尊重您的隐私。',
    'home.features.community.title': '全球社区',
    'home.features.community.desc': '加入全球数百万信任Sybau Picture满足表情包生成需求的创作者。',
    'home.features.available.title': '24/7可用',
    'home.features.available.desc': '随时随地使用Sybau Picture创建表情包。当灵感来袭时，我们的平台始终准备就绪。',
    'home.usecases.title': '适合每个创作者',
    'home.usecases.description': '无论您是专业营销人员还是休闲内容创作者，Sybau Picture都能让每个人创建吸引注意力并推动参与的病毒式表情包。',
    'home.usecases.social': '社交媒体管理者',
    'home.usecases.social.desc': '使用Sybau Picture的专业级结果为品牌和企业创建引人入胜的内容。',
    'home.usecases.content': '内容创作者',
    'home.usecases.content.desc': '在TikTok、Instagram和YouTube等平台上通过独特的Sybau Picture创作脱颖而出。',
    'home.usecases.marketing': '营销团队',
    'home.usecases.marketing.desc': '通过与目标受众产生共鸣的引人注目的表情包提升活动表现。',
    'home.usecases.individuals': '个人用户',
    'home.usecases.individuals.desc': '使用Sybau Picture的有趣转换与朋友和家人分享有趣时刻。',
    'home.community.title': '加入Sybau Picture社区',
    'home.community.extended': '分享您的创作，获得灵感，发现使用我们平台的新方法。',
    'home.community.stats.users': '120万+',
    'home.community.stats.users.label': '活跃用户',
    'home.community.stats.creations': '5万+',
    'home.community.stats.creations.label': '每日创作',
    'home.community.stats.satisfaction': '95%',
    'home.community.stats.satisfaction.label': '满意度',
    'home.cta.title': '准备好病毒式传播了吗？🚀',
    'home.cta.description': '加入已经使用Sybau Picture制作病毒式内容的数百万创作者。今天就开始您的表情包创作之旅！',
    'home.cta.startCreating': '立即开始创作',
    'home.footer.features': 'Sybau Picture支持JPG、PNG、WebP格式 • 无需注册 • 100%免费使用',
    'home.footer.secure': '安全处理',
    'home.footer.speed': '8秒生成',
    'home.footer.community': '全球社区'
  }
}

export default function HomePageClient() {
  const router = useRouter()
  const pathname = usePathname()
  const [stats, setStats] = useState({ memes: 125000, rating: 4.9, countries: 180 })

  const getCurrentLanguage = () => {
    const segments = pathname.split('/').filter(Boolean)
    const supportedLanguages = ['zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt', 'ru', 'ar']

    if (segments.length === 0) return 'en'
    if (supportedLanguages.includes(segments[0])) return segments[0]
    return 'en'
  }

  const currentLang = getCurrentLanguage()

  const getText = (key: string, fallback: string) => {
    return (staticTexts as any)[currentLang]?.[key] || (staticTexts.en as any)[key] || fallback
  }

  const getLocalizedPath = (path: string) => {
    if (currentLang === 'en') {
      return path
    }
    return `/${currentLang}${path}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-300/10 to-cyan-400/10"></div>

        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-5xl mx-auto">
            {/* Animated Icon */}
            <div className="mb-8">
              <div className="text-6xl mb-4">🎭</div>
              <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Meme Generator
              </Badge>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent leading-tight">
              {getText('home.hero.title', 'Create Viral')} <span className="text-gray-800">{getText('home.hero.subtitle', 'Sybau Memes')}</span><br />
              <span className="text-4xl lg:text-5xl">{getText('home.hero.tagline', 'in Seconds')}</span>
            </h1>

            {/* Description */}
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              {getText('home.hero.description', 'Transform any photo into hilarious Sybau Lazer Dim 700 style memes with our AI technology! No design skills required - just upload and watch the magic happen!')}
            </p>

            {/* Benefits Row */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { icon: <Star className="w-5 h-5" />, text: getText('home.benefits.free', '100% Free') },
                { icon: <Rocket className="w-5 h-5" />, text: getText('home.benefits.noRegistration', 'No Registration') },
                { icon: <Heart className="w-5 h-5" />, text: getText('home.benefits.hdQuality', 'HD Quality') },
                { icon: <TrendingUp className="w-5 h-5" />, text: getText('home.benefits.fastProcessing', '8s Processing') }
              ].map((benefit, index) => (
                <Badge key={index} variant="outline" className="bg-white/80 backdrop-blur-sm border-purple-200 text-purple-700 px-4 py-2 text-sm font-medium">
                  {benefit.icon}
                  <span className="ml-2">{benefit.text}</span>
                </Badge>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex justify-center mb-12">
              <Button
                size="lg"
                className="bg-white text-purple-600 px-12 py-6 text-2xl font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => router.push(currentLang === 'en' ? '/generator' : `/${currentLang}/generator`)}
              >
                <Rocket className="mr-3 h-8 w-8" />
                {getText('home.cta.tryGenerator', 'Try Picture Generator')}
              </Button>
            </div>

            {/* Social Proof */}
            <div className="text-center">
              <p className="text-gray-500 mb-6">{getText('home.socialProof', 'Trusted by creators worldwide')}</p>
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.memes.toLocaleString()}+</div>
                  <div className="text-sm text-gray-500">{getText('home.stats.memes', 'Memes Created')}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-pink-600 flex items-center">
                    {stats.rating.toFixed(1)}
                    <Star className="w-6 h-6 ml-1 fill-current" />
                  </div>
                  <div className="text-sm text-gray-500">{getText('home.stats.rating', 'User Rating')}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-cyan-600">{stats.countries}+</div>
                  <div className="text-sm text-gray-500">{getText('home.stats.countries', 'Countries')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
              {getText('home.howitworks.title', 'How Sybau Picture Works')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {getText('home.howitworks.description', 'Creating viral memes with Sybau Picture is simple, fast, and completely free. Our AI-powered platform transforms your photos into engaging Sybau-style content in three easy steps.')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                title: getText('home.howitworks.step1', 'Upload Your Photo'),
                description: getText('home.howitworks.step1.desc', 'Simply drag and drop or select any image from your device. Sybau Picture supports JPG, PNG, and WebP formats.'),
                icon: <Users className="w-8 h-8" />
              },
              {
                step: '2',
                title: getText('home.howitworks.step2', 'AI Processing Magic'),
                description: getText('home.howitworks.step2.desc', 'Our advanced AI technology analyzes your image and applies the signature Sybau style transformation automatically.'),
                icon: <Sparkles className="w-8 h-8" />
              },
              {
                step: '3',
                title: getText('home.howitworks.step3', 'Download Your Meme'),
                description: getText('home.howitworks.step3.desc', 'Within seconds, download your high-quality Sybau Picture meme ready to share across all social platforms.'),
                icon: <Award className="w-8 h-8" />
              }
            ].map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-16 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 transform -translate-x-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
              {getText('home.features.title', 'Why Choose Sybau Picture?')}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              {getText('home.features.description', 'Experience the power of AI-driven meme creation with Sybau Picture, the ultimate platform for viral content creation.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: getText('home.features.aiPowered.title', 'AI-Powered Technology'),
                description: getText('home.features.aiPowered.description', 'Advanced artificial intelligence ensures every Sybau Picture creation is perfect and engaging.'),
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: <Rocket className="w-8 h-8" />,
                title: getText('home.features.lightning.title', 'Lightning Fast Processing'),
                description: getText('home.features.lightning.description', 'Generate professional-quality memes in just 8 seconds with Sybau Picture\'s optimized system.'),
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: getText('home.features.easy.title', 'Easy to Use Interface'),
                description: getText('home.features.easy.description', 'No design experience needed - Sybau Picture makes meme creation accessible to everyone.'),
                color: 'from-pink-500 to-red-500'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: getText('home.features.secure.title', 'Secure & Private'),
                description: getText('home.features.secure.desc', 'Your images are processed securely and never stored on our servers. Sybau Picture respects your privacy.'),
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: getText('home.features.community.title', 'Global Community'),
                description: getText('home.features.community.desc', 'Join millions of creators worldwide who trust Sybau Picture for their meme generation needs.'),
                color: 'from-blue-500 to-indigo-500'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: getText('home.features.available.title', '24/7 Available'),
                description: getText('home.features.available.desc', 'Create memes anytime, anywhere with Sybau Picture. Our platform is always ready when inspiration strikes.'),
                color: 'from-cyan-500 to-teal-500'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mx-auto mb-4 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
              {getText('home.usecases.title', 'Perfect for Every Creator')}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              {getText('home.usecases.description', 'Whether you\'re a professional marketer or casual content creator, Sybau Picture empowers everyone to create viral memes that capture attention and drive engagement.')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: getText('home.usecases.social', 'Social Media Managers'),
                description: getText('home.usecases.social.desc', 'Create engaging content for brands and businesses with Sybau Picture\'s professional-grade results.'),
                icon: <TrendingUp className="w-6 h-6" />
              },
              {
                title: getText('home.usecases.content', 'Content Creators'),
                description: getText('home.usecases.content.desc', 'Stand out on platforms like TikTok, Instagram, and YouTube with unique Sybau Picture creations.'),
                icon: <Star className="w-6 h-6" />
              },
              {
                title: getText('home.usecases.marketing', 'Marketing Teams'),
                description: getText('home.usecases.marketing.desc', 'Boost campaign performance with eye-catching memes that resonate with your target audience.'),
                icon: <Award className="w-6 h-6" />
              },
              {
                title: getText('home.usecases.individuals', 'Individual Users'),
                description: getText('home.usecases.individuals.desc', 'Share funny moments with friends and family using Sybau Picture\'s entertaining transformations.'),
                icon: <Heart className="w-6 h-6" />
              }
            ].map((usecase, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white mr-3">
                    {usecase.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{usecase.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{usecase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
              {getText('home.community.title', 'Join the Sybau Picture Community')}
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              {getText('home.community.extended', 'Share your creations, get inspired, and discover new ways to use our platform.')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">{getText('home.community.stats.users', '1.2M+')}</div>
              <div className="text-gray-600">{getText('home.community.stats.users.label', 'Active Users')}</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-pink-100 to-red-100 rounded-2xl">
              <div className="text-3xl font-bold text-pink-600 mb-2">{getText('home.community.stats.creations', '50K+')}</div>
              <div className="text-gray-600">{getText('home.community.stats.creations.label', 'Daily Creations')}</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl">
              <div className="text-3xl font-bold text-cyan-600 mb-2">{getText('home.community.stats.satisfaction', '95%')}</div>
              <div className="text-gray-600">{getText('home.community.stats.satisfaction.label', 'Satisfaction Rate')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              {getText('home.cta.title', 'Ready to Go Viral? 🚀')}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              {getText('home.cta.description', 'Join millions of creators who are already making viral content with Sybau Picture. Start your meme creation journey today!')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-bold rounded-xl shadow-xl"
                onClick={() => router.push(currentLang === 'en' ? '/generator' : `/${currentLang}/generator`)}
              >
                <Rocket className="mr-2 h-6 w-6" />
                {getText('home.cta.startCreating', 'Start Creating Now')}
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-center text-white/80">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>{getText('home.footer.secure', 'Secure Processing')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{getText('home.footer.speed', '8-Second Generation')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{getText('home.footer.community', 'Global Community')}</span>
              </div>
            </div>

            <p className="text-sm text-white/60 mt-8">
              {getText('home.footer.features', 'Sybau Picture supports JPG, PNG, WebP formats • No registration required • 100% free to use')}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
