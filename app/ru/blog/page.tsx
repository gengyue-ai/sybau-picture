import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Blog | Sybau Picture',
  description: 'Русский blog posts and tutorials about AI meme creation.',
}

export default function RUBlogPage() {
  // 重定向到全局博客页面
  redirect('/blog')
}
