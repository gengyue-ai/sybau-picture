'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, Clock, User, Heart, Share2, BookOpen, ArrowRight, Loader2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  publishedAt: string
  viewCount: number
  keywords: string[] | string
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">文章未找到</h1>
          <p className="text-gray-600 mb-6">抱歉，您查找的文章不存在。</p>
          <Link href="/zh/blog">
            <Button className="bg-purple-600 text-white hover:bg-purple-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回博客
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
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
      alert('链接已复制到剪贴板')
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
        <Link href="/zh/blog">
          <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回博客
          </Button>
        </Link>
      </div>

      {/* Article header */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header image */}
            <div className="relative h-64 bg-gradient-to-r from-purple-600 to-cyan-600">
              <Image
                src={post.imageUrl || defaultImageUrl}
                alt={post.title}
                fill
                className="object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>

            {/* Article meta and title */}
            <div className="p-8">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {(typeof post.keywords === 'string' 
                  ? post.keywords.split(', ') 
                  : Array.isArray(post.keywords) 
                    ? post.keywords 
                    : []
                ).map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                    {keyword}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime || 5} 分钟阅读</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{post.author || 'Sybau Team'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{post.viewCount} 次浏览</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 mb-8">
                <Button
                  onClick={handleLike}
                  variant={isLiked ? "default" : "outline"}
                  className={`${isLiked ? 'bg-red-500 hover:bg-red-600 text-white' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  喜欢 ({likes})
                </Button>
                <Button onClick={handleShare} variant="outline" className="border-gray-300 hover:bg-gray-50">
                  <Share2 className="w-4 h-4 mr-2" />
                  分享
                </Button>
              </div>

              {/* Article content */}
              <div className="prose prose-lg max-w-none">
                {renderContent(post.content)}
              </div>

              {/* CTA section */}
              <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl border border-purple-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  准备创造自己的成功故事吗？
                </h3>
                <p className="text-gray-600 mb-4">
                  立即试用 Sybau Picture，开始您的创作之旅！
                </p>
                <Link href="/zh/generator">
                  <Button className="bg-purple-600 text-white hover:bg-purple-700">
                    免费试用 →
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Related posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">相关文章</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.slice(0, 2).map((relatedPost) => (
                  <Link 
                    key={relatedPost.id}
                    href={`/zh/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 group- group-">
                      <div className="relative h-40 bg-gradient-to-r from-purple-400 to-cyan-400">
                        <Image
                          src={relatedPost.imageUrl || defaultImageUrl}
                          alt={relatedPost.title}
                          fill
                          className="object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group- transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-4">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{formatDate(relatedPost.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
