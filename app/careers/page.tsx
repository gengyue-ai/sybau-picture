'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, MapPin, Clock, Briefcase, Heart, Rocket } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function CareersPage() {
  const jobs = [
    {
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Join our AI team to develop cutting-edge meme generation technology.',
      skills: ['Python', 'PyTorch', 'Computer Vision', 'Deep Learning']
    },
    {
      title: 'Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Build beautiful, responsive user interfaces for our platform.',
      skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS']
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      description: 'Design intuitive user experiences for our AI generation tools.',
      skills: ['Figma', 'UI/UX Design', 'Prototyping', 'User Research']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help us build the future of AI-powered creative tools. We're looking for passionate individuals to join our mission.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Remote First</h3>
                <p className="text-gray-600">Work from anywhere in the world</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Great Benefits</h3>
                <p className="text-gray-600">Health, dental, and equity packages</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Rocket className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Growth Focused</h3>
                <p className="text-gray-600">Learn and grow with cutting-edge AI</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Open Positions</h2>
            {jobs.map((job, index) => (
              <Card key={index} className=" transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <Badge variant="secondary">{job.department}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <Button className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
