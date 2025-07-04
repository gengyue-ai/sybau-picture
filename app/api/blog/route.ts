import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAllBlogPosts } from '@/lib/blog-data'

export async function GET(_request: NextRequest) {
  try {
    // 如果数据库不可用，使用mock数据
    if (!prisma) {
      console.warn('⚠️  数据库不可用，使用mock博客数据')
      const posts = getAllBlogPosts()
      
      return NextResponse.json({
        success: true,
        posts: posts
      })
    }

    // 尝试使用数据库
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        published: true
      },
      orderBy: {
        publishedAt: 'desc'
      }
    })

    // 将keywords字符串转换为数组
    const formattedPosts = blogPosts.map(post => ({
      ...post,
      keywords: post.keywords ? post.keywords.split(', ') : [],
      publishedAt: post.publishedAt?.toISOString() || null
    }))

    return NextResponse.json({
      success: true,
      posts: formattedPosts
    })
  } catch (error) {
    console.error('Error fetching blog posts, using mock data:', error)
    
    // 如果数据库出错，回退到mock数据
    const posts = getAllBlogPosts()
    
    return NextResponse.json({
      success: true,
      posts: posts
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured - cannot create posts' },
        { status: 503 }
      )
    }

    // 这里可以添加管理员认证
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const body = await request.json()
    const { title, excerpt, content, slug, keywords, published = false } = body

    // 验证必填字段
    if (!title || !excerpt || !content || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 检查slug是否已存在
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      )
    }

    // 创建博客文章
    const post = await prisma.blogPost.create({
      data: {
        title,
        excerpt,
        content,
        slug,
        keywords: keywords || [],
        published,
        publishedAt: published ? new Date() : null,
        viewCount: 0
      }
    })

    return NextResponse.json({
      message: 'Blog post created successfully',
      post: {
        ...post,
        publishedAt: post.publishedAt?.toISOString() || null,
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 