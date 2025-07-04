'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { HelpCircle, Search, MessageCircle, Mail, Phone, FileText } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function SupportPage() {
  const faqs = [
    {
      question: 'How do I generate my first image?',
      answer: 'Simply go to the Generator page, upload your image, describe what you want, and click Generate!'
    },
    {
      question: 'Why is my image generation taking so long?',
      answer: 'Generation typically takes 10-30 seconds. High traffic periods may cause delays. Try again in a few minutes.'
    },
    {
      question: 'Can I use generated images commercially?',
      answer: 'Yes! All images generated through Sybau Picture can be used for commercial purposes.'
    },
    {
      question: 'How many images can I generate per day?',
      answer: 'Free users get 10 generations per day. Premium users have unlimited generations.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Need help with Sybau Picture? Find answers to common questions or contact our support team directly.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center transition-shadow">
              <CardContent className="p-6">
                <Search className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Search FAQ</h3>
                <p className="text-gray-600 mb-4">Find instant answers to common questions</p>
                <Button variant="outline" className="w-full">Browse FAQ</Button>
              </CardContent>
            </Card>
            <Card className="text-center transition-shadow">
              <CardContent className="p-6">
                <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Chat with our support team instantly</p>
                <Button variant="outline" className="w-full">Start Chat</Button>
              </CardContent>
            </Card>
            <Card className="text-center transition-shadow">
              <CardContent className="p-6">
                <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">Send us a detailed message</p>
                <Button variant="outline" className="w-full">Send Email</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="w-6 h-6 mr-2 text-orange-600" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
