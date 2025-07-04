'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Search, HelpCircle, MessageCircle, Mail, Phone, Clock, BookOpen, Zap, Shield, Settings, CreditCard, Image as ImageIcon, Users, ChevronDown, ChevronRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How does the AI meme generator work?',
    answer: 'Our AI uses advanced machine learning models trained specifically on the Sybau Lazer Dim 700 style. Simply upload your image, select your preferred style and intensity, and our AI will transform it into a viral-worthy meme in seconds.',
    category: 'getting-started'
  },
  {
    id: '2',
    question: 'What image formats are supported?',
    answer: 'We support all major image formats including JPG, PNG, GIF, and WebP. For best results, we recommend uploading high-quality images with good lighting and clear subjects.',
    category: 'getting-started'
  },
  {
    id: '3',
    question: 'Is there a limit to how many memes I can create?',
    answer: 'Free users can create up to 10 memes per day. Premium subscribers enjoy unlimited generations plus priority processing and exclusive style options.',
    category: 'pricing'
  },
  {
    id: '4',
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription anytime from your account settings. Go to Settings > Billing > Cancel Subscription. Your premium features will remain active until the end of your billing period.',
    category: 'pricing'
  },
  {
    id: '5',
    question: 'Can I use generated memes commercially?',
    answer: 'Yes! All memes generated with Sybau Picture can be used for commercial purposes. You retain full rights to your creations. However, please ensure your original uploaded images don\'t infringe on copyrights.',
    category: 'usage'
  },
  {
    id: '6',
    question: 'My meme generation failed. What should I do?',
    answer: 'If generation fails, try: 1) Check your internet connection, 2) Ensure your image meets our guidelines (under 10MB, appropriate content), 3) Try a different image or lower intensity setting. If issues persist, contact support.',
    category: 'troubleshooting'
  },
  {
    id: '7',
    question: 'How do I download my generated memes?',
    answer: 'After your meme is generated, click the download button to save it to your device. Premium users can download in multiple resolutions including HD and 4K.',
    category: 'getting-started'
  },
  {
    id: '8',
    question: 'Is my data safe and private?',
    answer: 'Absolutely. We use enterprise-grade encryption and don\'t store your uploaded images permanently. Generated memes are only saved if you choose to add them to your gallery. Read our Privacy Policy for full details.',
    category: 'privacy'
  }
]

const categories = [
  { id: 'all', name: 'All Topics', icon: BookOpen },
  { id: 'getting-started', name: 'Getting Started', icon: Zap },
  { id: 'pricing', name: 'Pricing & Billing', icon: CreditCard },
  { id: 'usage', name: 'Usage & Rights', icon: ImageIcon },
  { id: 'troubleshooting', name: 'Troubleshooting', icon: Settings },
  { id: 'privacy', name: 'Privacy & Security', icon: Shield }
]

const supportOptions = [
  {
    title: 'Live Chat',
    description: 'Get instant help from our support team',
    icon: MessageCircle,
    action: 'Start Chat',
    available: 'Available 24/7'
  },
  {
    title: 'Email Support',
    description: 'Send us a detailed message',
    icon: Mail,
    action: 'Send Email',
    available: 'Response within 2 hours'
  },
  {
    title: 'Video Call',
    description: 'Schedule a personalized session',
    icon: Phone,
    action: 'Book Call',
    available: 'Business hours only'
  }
]

const quickLinks = [
  { title: 'Getting Started Guide', href: '/help/getting-started' },
  { title: 'Style Guide', href: '/help/styles' },
  { title: 'Best Practices', href: '/help/best-practices' },
  { title: 'API Documentation', href: '/help/api' },
  { title: 'Community Guidelines', href: '/help/community' },
  { title: 'Privacy Policy', href: '/privacy' },
  { title: 'Terms of Service', href: '/terms' }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  // 过滤FAQ
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">Help Center</span>
          </div>

          <Link href="/generator">
            <Button>Try Generator</Button>
          </Link>
        </div>
      </header>

      <div className="container py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="mb-4">Help & Support</Badge>
          <h1 className="text-4xl font-bold mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Find answers to common questions, learn how to use our features, 
            or get in touch with our support team.
          </p>
          
          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5" />
                  Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center text-sm transition-colors py-1"
                  >
                    <ExternalLink className="mr-2 h-3 w-3" />
                    {link.title}
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Still need help?</CardTitle>
                <CardDescription>
                  Our support team is here to assist you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Support Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {supportOptions.map((option, index) => (
                <Card key={index} className=" transition-shadow cursor-pointer">
                  <CardHeader className="text-center">
                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <option.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground mb-3">
                      <Clock className="h-3 w-3" />
                      <span>{option.available}</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Frequently Asked Questions
                </h2>
                <Badge variant="outline">
                  {filteredFAQs.length} questions
                </Badge>
              </div>

              {filteredFAQs.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <HelpCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <CardTitle className="mb-2">No results found</CardTitle>
                    <CardDescription>
                      Try adjusting your search or browse by category
                    </CardDescription>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <Card key={faq.id} className="overflow-hidden">
                      <CardHeader 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-medium">
                            {faq.question}
                          </CardTitle>
                          {expandedFAQ === faq.id ? (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                      
                      {expandedFAQ === faq.id && (
                        <>
                          <Separator />
                          <CardContent className="pt-6">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </CardContent>
                        </>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Additional Resources
                </CardTitle>
                <CardDescription>
                  Explore more ways to get the most out of Sybau Picture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold">Learning Resources</h3>
                    <div className="space-y-2">
                      <Link href="/blog" className="block text-sm transition-colors">
                        • Blog & Tutorials
                      </Link>
                      <Link href="/help/video-guides" className="block text-sm transition-colors">
                        • Video Guides
                      </Link>
                      <Link href="/help/webinars" className="block text-sm transition-colors">
                        • Live Webinars
                      </Link>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold">Community</h3>
                    <div className="space-y-2">
                      <Link href="/community" className="block text-sm transition-colors">
                        • Community Forum
                      </Link>
                      <Link href="/discord" className="block text-sm transition-colors">
                        • Discord Server
                      </Link>
                      <Link href="/gallery" className="block text-sm transition-colors">
                        • User Gallery
                      </Link>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Can't find what you're looking for?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Our support team is available 24/7 to help you succeed
                  </p>
                  <Button>
                    <Users className="mr-2 h-4 w-4" />
                    Join Community
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 