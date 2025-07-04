'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Code, Github, Book, Key, Zap, Terminal } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function DevelopersPage() {
  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/generate',
      description: 'Generate AI memes from uploaded images',
      params: ['image', 'prompt', 'style']
    },
    {
      method: 'GET',
      endpoint: '/api/gallery',
      description: 'Retrieve gallery of generated images',
      params: ['limit', 'offset', 'user_id']
    },
    {
      method: 'GET',
      endpoint: '/api/user/history',
      description: 'Get user generation history',
      params: ['user_id', 'limit']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Developer Resources</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Build amazing applications with Sybau Picture's API. Access our powerful AI meme generation capabilities in your own projects.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <Key className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">API Access</h3>
                <p className="text-gray-600 mb-4">RESTful API with comprehensive documentation</p>
                <Button className="w-full">Get API Key</Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Github className="w-12 h-12 text-gray-800 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">SDKs & Libraries</h3>
                <p className="text-gray-600 mb-4">Official SDKs for popular programming languages</p>
                <Button variant="outline" className="w-full">View on GitHub</Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Book className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
                <p className="text-gray-600 mb-4">Comprehensive guides and API reference</p>
                <Button variant="outline" className="w-full">Read Docs</Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Terminal className="w-6 h-6 mr-2 text-purple-600" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm">
                  <div className="mb-2"># Install the SDK</div>
                  <div className="mb-4">npm install sybau-picture-sdk</div>
                  <div className="mb-2"># Generate your first meme</div>
                  <div>const sybau = new SybauPicture(apiKey)</div>
                  <div>const result = await sybau.generate(image, prompt)</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-6 h-6 mr-2 text-yellow-600" />
                  API Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiEndpoints.map((api, index) => (
                    <div key={index} className="border-l-4 border-purple-500 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={'px-2 py-1 text-xs font-bold rounded ' + 
                          (api.method === 'POST' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700')
                        }>
                          {api.method}
                        </span>
                        <code className="text-sm font-mono">{api.endpoint}</code>
                      </div>
                      <p className="text-gray-600 text-sm">{api.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
