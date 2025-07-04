'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users, Target, Lightbulb, Heart, Zap, Globe, Shield, Star, Trophy, Rocket, Brain, CheckCircle, Sparkles, TrendingUp, Clock, Award, Play } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { generateLocalizedLink } from '@/lib/i18n'

// Metadata moved to layout.tsx or separate metadata file

const teamMembers = [
  {
    name: "Alex Chen",
    role: "CEO & Founder",
    bio: "Serial entrepreneur with 5+ years in AI/ML. Previously led product teams at Microsoft Azure AI. Founded Sybau Picture in 2025 with a vision to democratize creative content generation.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    avatarFallback: "AC"
  },
  {
    name: "Sarah Kim",
    role: "CTO & Co-founder",
    bio: "AI research scientist with PhD from Stanford. Former ML engineer at OpenAI and Google Brain. Expert in computer vision and generative AI models.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    avatarFallback: "SK"
  },
  {
    name: "David Rodriguez",
    role: "Head of Product Design",
    bio: "Creative technologist and UX designer. Previously at Figma and Adobe. Passionate about making AI tools accessible to everyone through intuitive design.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    avatarFallback: "DR"
  },
  {
    name: "Lisa Zhang",
    role: "Lead AI Engineer",
    bio: "Computer vision specialist with background in deep learning. Former research scientist at Meta AI. Focused on advancing generative AI performance and safety.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face&auto=format&q=80",
    avatarFallback: "LZ"
  }
]

const values = [
  {
    icon: Brain,
    title: 'AI Picture Generator Innovation',
    description: 'We pioneer breakthrough AI Picture Generator technology that makes professional content creation accessible to everyone worldwide.'
  },
  {
    icon: Heart,
    title: 'AI Picture Generator Community',
    description: 'Our AI Picture Generator platform is built by creators, for creators. Every feature serves our global creative community.'
  },
  {
    icon: Shield,
    title: 'Secure AI Picture Generator',
    description: 'Your data privacy is paramount. Our AI Picture Generator technology ensures complete user control and data protection.'
  },
  {
    icon: Globe,
    title: 'Global AI Picture Generator',
    description: 'Our AI Picture Generator transcends cultural boundaries, supporting diverse creative expressions from every corner of the world.'
  }
]

const milestones = [
  {
    year: "Jan 2025",
    title: "Company Founded",
    description: "Sybau Picture founded by Alex Chen and Sarah Kim with $2M seed funding. Mission: democratize creative content through AI."
  },
  {
    year: "Mar 2025",
    title: "MVP Launch",
    description: "Released beta version with core Sybau Lazer Dim 700 style generation. First 1,000 users create over 10,000 images."
  },
  {
    year: "Jun 2025",
    title: "Public Beta",
    description: "Opened public beta with enhanced AI models. Reached 10,000+ users generating 100,000+ viral memes."
  },
  {
    year: "Sep 2025",
    title: "Global Expansion",
    description: "Launched multilingual support for 10 languages. Expanded to serve creators in 50+ countries worldwide."
  }
]

const stats = [
  { number: "150K+", label: 'Memes Created' },
  { number: "25K+", label: 'Active Users' },
  { number: "50+", label: 'Countries Served' },
  { number: "99.5%", label: 'Uptime' }
]

const features = [
  {
    icon: Sparkles,
    title: 'Advanced AI Picture Generator Technology',
    description: 'Our state-of-the-art AI Picture Generator uses cutting-edge neural networks and machine learning algorithms to transform any image into professional-quality memes instantly.',
  },
  {
    icon: Clock,
    title: 'Lightning-Fast AI Picture Generator',
    description: 'Experience the fastest AI Picture Generator in the market. Generate stunning visuals in seconds, not minutes, with our optimized AI Picture Generator infrastructure.',
  },
  {
    icon: TrendingUp,
    title: 'Viral-Ready AI Picture Generator',
    description: 'Our AI Picture Generator is trained on millions of viral memes to ensure your content has maximum engagement potential across all social platforms.',
  }
]

export default function AboutPage() {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      <div className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            About Our AI Picture Generator Platform
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Revolutionary AI Picture Generator Technology
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Sybau Picture is an AI startup founded in 2025, pioneering the future of creative content generation. Our team of experts from top tech companies has built an advanced AI platform specialized in Sybau Lazer Dim 700 style. We're democratizing professional-quality meme creation, making it accessible to creators worldwide through cutting-edge technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href={generateLocalizedLink('/generator', pathname)}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Rocket className="h-5 w-5 mr-2" />
                Try Our AI Picture Generator
              </Button>
            </Link>
            <Link href={generateLocalizedLink('/gallery', pathname)}>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch AI Picture Generator Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className=" transition-shadow bg-gradient-to-br from-white to-purple-50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* What Makes Our AI Picture Generator Special */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">
              What Makes Our AI Picture Generator Unique
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our AI Picture Generator stands apart from other tools through revolutionary technology, unparalleled performance, and user-centric design. Discover why creators worldwide choose our AI Picture Generator for their content creation needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="transition-all duration-300 bg-gradient-to-br from-white to-purple-50">
                  <CardHeader>
                    <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-center text-gray-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 text-center leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Our AI Picture Generator Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed text-gray-700">
                To revolutionize creative expression by providing the world's most advanced AI Picture Generator technology. We believe our AI Picture Generator should break down barriers between imagination and creation, enabling everyone to produce professional-quality content regardless of their technical background. Our AI Picture Generator serves as the ultimate bridge between creative vision and viral-worthy results.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-800">Our AI Picture Generator Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed text-gray-700">
                A future where our AI Picture Generator technology amplifies human creativity on a global scale. We envision our AI Picture Generator becoming the standard for creative content generation, where artificial intelligence enhances rather than replaces human imagination. Through our AI Picture Generator, we're building a world where every creative idea can instantly become compelling visual content.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">Our AI Picture Generator Values</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              The core principles that drive our AI Picture Generator development and guide every decision we make in advancing AI Picture Generator technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="text-center transition-shadow bg-gradient-to-br from-white to-purple-50">
                  <CardHeader>
                    <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-800">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">Meet Our AI Picture Generator Team</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              The visionary minds and technical experts building the future of AI Picture Generator technology. Our team combines deep AI expertise with creative passion to deliver the ultimate AI Picture Generator experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => {
              const MemberAvatar = () => {
                const [imageError, setImageError] = useState(false);

                return (
                  <div className="h-20 w-20 rounded-full mx-auto mb-4 overflow-hidden">
                    {!imageError ? (
                      <Image
                        src={member.avatar}
                        alt={`${member.name} - ${member.role}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="h-20 w-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{member.avatarFallback}</span>
                      </div>
                    )}
                  </div>
                );
              };

              return (
                <Card key={index} className="text-center transition-all duration-300">
                  <CardHeader>
                    <MemberAvatar />
                    <CardTitle className="text-lg text-gray-800">{member.name}</CardTitle>
                    <Badge variant="secondary" className="mx-auto bg-purple-100 text-purple-700">{member.role}</Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-gray-600">
                      {member.bio}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">Our AI Picture Generator Journey</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              From initial concept to global AI Picture Generator platform. Discover how we've evolved our AI Picture Generator technology to serve creators worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <Card key={index} className=" transition-shadow bg-gradient-to-br from-white to-cyan-50">
                <CardHeader>
                  <Badge className="w-fit bg-gradient-to-r from-purple-500 to-pink-500 text-white">{milestone.year}</Badge>
                  <CardTitle className="text-lg text-gray-800">{milestone.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-gray-600">
                    {milestone.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Behind AI Picture Generator */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-800">
              The Technology Behind Our AI Picture Generator
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Our AI Picture Generator leverages cutting-edge machine learning, neural networks, and computer vision to deliver unparalleled creative results. Explore the advanced technology that powers the world's most sophisticated AI Picture Generator.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Brain className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Neural Network Architecture</h3>
                <p className="text-gray-600">Our AI Picture Generator uses advanced transformer architectures and diffusion models trained on millions of high-quality images for optimal results.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Real-Time Processing</h3>
                <p className="text-gray-600">Experience lightning-fast AI Picture Generator performance with our optimized inference pipeline and distributed computing infrastructure.</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quality Assurance</h3>
                <p className="text-gray-600">Every AI Picture Generator output undergoes rigorous quality checks ensuring consistent, professional-grade results for all users.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <CardContent className="p-12 relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Experience Our AI Picture Generator?</h2>
              <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
                Join millions of creators worldwide who trust our AI Picture Generator for their content creation needs. Start creating viral content with the most advanced AI Picture Generator technology available today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href={generateLocalizedLink('/generator', pathname)}>
                  <Button size="lg" className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl">
                    <Rocket className="h-5 w-5 mr-2" />
                    Launch AI Picture Generator
                  </Button>
                </Link>
                <Link href={generateLocalizedLink('/gallery', pathname)}>
                  <Button size="lg" variant="outline" className="border-2 border-white text-white px-8 py-4 text-lg font-semibold rounded-xl">
                    <Star className="h-5 w-5 mr-2" />
                    View AI Picture Generator Results
                  </Button>
                </Link>
              </div>

              <div className="text-center text-white/80">
                <p className="mb-4">Experience the future of creative content • Free AI Picture Generator • No registration required</p>
                <div className="flex justify-center items-center space-x-6 flex-wrap">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Advanced AI Picture Generator</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Instant AI Picture Generator Results</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    <span>Global AI Picture Generator Access</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
