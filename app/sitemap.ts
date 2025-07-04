import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const SITE_URL = 'https://sybaupicture.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = []

  // 静态页面
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/generator`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ]

  sitemap.push(...staticPages)

  try {
    // 博客文章
    if (prisma) {
      const blogPosts = await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { publishedAt: 'desc' },
    })

    const blogSitemap = blogPosts.map((post: any) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    sitemap.push(...blogSitemap)
    }

    // 多语言页面
    const languages = ['zh', 'es', 'ja', 'ko', 'fr', 'de', 'pt', 'ru', 'ar'] // 排除en，因为英语使用根目录
    
    for (const lang of languages) {
      // 主页多语言版本
      sitemap.push({
        url: `${SITE_URL}/${lang}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
      
      // 生成器多语言版本
      sitemap.push({
        url: `${SITE_URL}/${lang}/generator`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      })
      
      // 画廊多语言版本
      sitemap.push({
        url: `${SITE_URL}/${lang}/gallery`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      })
      
      // 博客多语言版本
      sitemap.push({
        url: `${SITE_URL}/${lang}/blog`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
      
      // 关于页面多语言版本
      sitemap.push({
        url: `${SITE_URL}/${lang}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    }

  } catch (error) {
    console.error('Error generating sitemap:', error)
  }

  return sitemap
} 