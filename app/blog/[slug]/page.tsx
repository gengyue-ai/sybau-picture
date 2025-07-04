'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Heart,
  Share2,
  BookOpen,
  ArrowRight,
  Loader2
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  publishedAt: string
  viewCount: number
  keywords: string[]
  published: boolean
  featured?: boolean
  category?: string
  readTime?: number
  author?: string
  imageUrl?: string
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(0)

  // 获取文章数据
  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching blog post with slug:', slug)
        const response = await fetch(`/api/blog/${slug}`)
        console.log('Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Response data:', data)
          
          if (data.post) {
            setPost(data.post)
            setLikes(data.post.viewCount || Math.floor(Math.random() * 500) + 100)
            
            // 获取相关文章
            if (data.relatedPosts) {
              setRelatedPosts(data.relatedPosts)
            }
          } else {
            console.log('No post found in response')
            setPost(null)
          }
        } else {
          console.log('Response not ok:', response.status)
          setPost(null)
        }
      } catch (error) {
        console.error('Error fetching blog post:', error)
        setPost(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchPost()
    }
  }, [slug])

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  // 如果文章不存在，显示404
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-6">Sorry, the article you're looking for doesn't exist.</p>
          <Link href="/blog">
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleLike = () => {
    if (!isLiked) {
      setLikes(likes + 1)
      setIsLiked(true)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        // User cancelled sharing or sharing failed
      }
    } else {
      // Copy link to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard')
    }
  }

  // 默认图片URL
  const defaultImageUrl = 'https://images.unsplash.com/photo-1494790108755-2616c4e1d9a8?w=800&h=400&fit=crop&auto=format'

  // 内容渲染函数
  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      // 处理标题
      if (paragraph.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">
            {paragraph.replace('# ', '')}
          </h1>
        )
      }
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-gray-800 mt-6 mb-3">
            {paragraph.replace('## ', '')}
          </h2>
        )
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold text-gray-700 mt-4 mb-2">
            {paragraph.replace('### ', '')}
          </h3>
        )
      }
      
      // 处理引用
      if (paragraph.startsWith('> ')) {
        return (
          <blockquote key={index} className="border-l-4 border-purple-500 pl-4 my-4 italic text-gray-600 bg-purple-50 py-2">
            {paragraph.replace('> ', '')}
          </blockquote>
        )
      }
      
      // 处理列表项
      if (paragraph.includes('- ') && paragraph.split('\n').some(line => line.trim().startsWith('- '))) {
        const items = paragraph.split('\n').filter(item => item.trim().startsWith('- '))
        return (
          <ul key={index} className="list-disc list-inside my-4 space-y-2">
            {items.map((item, i) => (
              <li key={i} className="text-gray-700">
                {item.replace(/^[\s]*-\s/, '')}
              </li>
            ))}
          </ul>
        )
      }
      
      // 处理编号列表
      if (/^\d+\./.test(paragraph.trim())) {
        const items = paragraph.split('\n').filter(item => /^\d+\./.test(item.trim()))
        if (items.length > 0) {
          return (
            <ol key={index} className="list-decimal list-inside my-4 space-y-2">
              {items.map((item, i) => (
                <li key={i} className="text-gray-700">
                  {item.replace(/^\d+\.\s/, '')}
                </li>
              ))}
            </ol>
          )
        }
      }
      
      // 普通段落
      return (
        <p key={index} className="mb-6 text-gray-700 leading-relaxed">
          {paragraph}
        </p>
      )
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Back button */}
      <div className="container mx-auto px-4 py-6">
        <Link href="/blog">
          <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>
      </div>

      {/* Article header */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Article meta info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge variant="outline" className="border-purple-200 text-purple-700">
              {post.category || 'Article'}
            </Badge>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(post.publishedAt)}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {post.readTime || 5} min read
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <User className="w-4 h-4 mr-1" />
              Sybau Team
            </div>
          </div>

          {/* Article title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Article excerpt */}
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Article cover image */}
          <div className="relative h-64 lg:h-96 mb-8 rounded-2xl overflow-hidden">
            <Image
              src={defaultImageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Interactive buttons */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={handleLike}
              className={`border-red-200 hover:bg-red-50 ${isLiked ? 'bg-red-50 text-red-700' : 'text-red-600'}`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {likes} Likes
            </Button>
            
            <Button variant="outline" onClick={handleShare} className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {renderContent(post.content)}
            </div>
          </div>
        </div>
      </div>

      {/* Related articles recommendation */}
      {relatedPosts.length > 0 && (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-purple-600" />
              Related Articles
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 cursor-pointer">
                    <h4 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center text-purple-600 font-medium">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-4">
            Ready to Create Your Own Viral Memes? 🚀
          </h3>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of creators using Sybau Picture to make amazing content!
          </p>
          <Link href="/generator">
            <Button size="lg" className="bg-white text-purple-600 text-lg px-8 py-3">
              Start Creating Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 