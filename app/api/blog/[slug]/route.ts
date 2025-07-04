import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/blog-data'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // 如果数据库不可用，使用mock数据
    if (!prisma) {
      console.warn('⚠️  数据库不可用，使用mock博客数据')
      
      const post = getBlogPostBySlug(slug)
      
      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }

      // 获取相关文章
      const relatedPosts = getRelatedPosts(post.id, post.keywords, 3)

      return NextResponse.json({
        post: {
          ...post,
          viewCount: post.viewCount + 1 // 模拟增加浏览量
        },
        relatedPosts
      })
    }

    // 尝试使用数据库
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        slug: true,
        keywords: true,
        publishedAt: true,
        viewCount: true,
        published: true,
      }
    })

    if (!post || !post.published) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // 增加浏览量
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    })

    // 获取相关文章（基于关键词）
    const relatedPosts = await prisma.blogPost.findMany({
      where: {
        AND: [
          { published: true },
          { id: { not: post.id } },
          post.keywords ? {
            keywords: {
              contains: post.keywords
            }
          } : {}
        ]
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        publishedAt: true,
      },
      take: 3,
      orderBy: { publishedAt: 'desc' }
    })

    return NextResponse.json({
      post: {
        ...post,
        publishedAt: post.publishedAt?.toISOString() || null,
        viewCount: post.viewCount + 1 // 返回更新后的浏览量
      },
      relatedPosts: relatedPosts.map((p: any) => ({
        ...p,
        publishedAt: p.publishedAt?.toISOString() || null,
      }))
    })

  } catch (error) {
    console.error('Error fetching blog post, using mock data:', error)
    
    // 如果数据库出错，回退到mock数据
    const { slug } = params
    const post = getBlogPostBySlug(slug)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const relatedPosts = getRelatedPosts(post.id, post.keywords, 3)

    return NextResponse.json({
      post: {
        ...post,
        viewCount: post.viewCount + 1
      },
      relatedPosts
    })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured - cannot update posts' },
        { status: 503 }
      )
    }

    // 这里可以添加管理员认证
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { slug } = params
    const body = await request.json()
    const { title, excerpt, content, keywords, published } = body

    // 查找现有文章
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // 更新文章
    const updatedPost = await prisma.blogPost.update({
      where: { slug },
      data: {
        ...(title && { title }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(keywords && { keywords }),
        ...(published !== undefined && { 
          published,
          publishedAt: published ? new Date() : null
        })
      }
    })

    return NextResponse.json({
      message: 'Post updated successfully',
      post: {
        ...updatedPost,
        publishedAt: updatedPost.publishedAt?.toISOString() || null,
      }
    })

  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: 'Database not configured - cannot delete posts' },
        { status: 503 }
      )
    }

    // 这里可以添加管理员认证
    // const session = await getServerSession(authOptions)
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { slug } = params

    // 删除文章
    await prisma.blogPost.delete({
      where: { slug }
    })

    return NextResponse.json({
      message: 'Post deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 