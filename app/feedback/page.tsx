'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MessageSquare, ThumbsUp, ThumbsDown, Bug, Lightbulb, Send } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState({
    type: 'suggestion',
    title: '',
    description: '',
    email: ''
  })

  const feedbackTypes = [
    { id: 'suggestion', label: 'Suggestion', icon: Lightbulb, color: 'text-yellow-600' },
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-600' },
    { id: 'compliment', label: 'Compliment', icon: ThumbsUp, color: 'text-green-600' },
    { id: 'complaint', label: 'Complaint', icon: ThumbsDown, color: 'text-orange-600' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Share Your Feedback</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your feedback helps us improve Sybau Picture. Whether it's a bug report, feature request, or just general thoughts, we'd love to hear from you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-6 h-6 mr-2 text-purple-600" />
                Send Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div>
                  <Label className="text-base font-medium">What type of feedback is this?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    {feedbackTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFeedback({...feedback, type: type.id})}
                          className={'p-4 border-2 rounded-lg text-center transition-colors ' + 
                            (feedback.type === type.id 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                            )}
                        >
                          <Icon className={'w-8 h-8 mx-auto mb-2 ' + type.color} />
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={feedback.title}
                    onChange={(e) => setFeedback({...feedback, title: e.target.value})}
                    placeholder="Brief description of your feedback"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Details</Label>
                  <textarea
                    id="description"
                    rows={6}
                    value={feedback.description}
                    onChange={(e) => setFeedback({...feedback, description: e.target.value})}
                    placeholder="Please provide as much detail as possible..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={feedback.email}
                    onChange={(e) => setFeedback({...feedback, email: e.target.value})}
                    placeholder="your.email@example.com (for follow-up)"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
