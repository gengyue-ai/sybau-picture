'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Heart, Share2, Calendar, Clock, User } from 'lucide-react'
import { useState } from 'react'

// 亘賷丕賳丕鬲 賲賯丕賱丕鬲 丕賱賲丿賵賳丞 丕賱毓乇亘賷丞
const blogPosts = [
  {
    slug: 'sybau-guy-inspirational-story',
    title: '賯氐丞 Sybau Guy 丕賱賲賱賴賲丞: 賲賳 丕賱賷兀爻 廿賱賶 丕賱賳氐乇',
    excerpt: '丕賰鬲卮賮 乇丨賱丞 Sybau Guy 丕賱賲匕賴賱丞 賵賰賷賮 睾賷乇鬲 卮噩丕毓鬲賴 丕賱賲卮賴丿 丕賱乇賯賲賷 廿賱賶 丕賱兀亘丿.',
    content: `
# 賯氐丞 Sybau Guy 丕賱賲賱賴賲丞: 賲賳 丕賱賷兀爻 廿賱賶 丕賱賳氐乇

## 丕賱亘丿丕賷丕鬲 丕賱賲鬲賵丕囟毓丞

賮賷 賷賵賲 孬賱丕孬丕亍 賲丕胤乇 賲賳 卮賴乇 賲丕乇爻貙 賮賯丿 Sybau Guy 丌禺乇 賵馗賷賮丞 賱賴 賰賲氐賲賲 噩乇丕賮賷賰. 賲毓 噩賷賵亘 賮丕乇睾丞 賵丨賱賲 賮賷 賯賱亘賴貙 卮乇毓 賮賷 乇丨賱丞 爻鬲睾賷乇 廿賳卮丕亍 丕賱賲丨鬲賵賶 丕賱乇賯賲賷 廿賱賶 丕賱兀亘丿.

"賱賲 賷賰賳 賱丿賷 丨乇賮賷丕賸 爻賵賶 50 丿賵賱丕乇 賮賷 丨爻丕亘賷 丕賱賲氐乇賮賷" 賷鬲匕賰乇 Sybau Guy. "賱賰賳 賰丕賳 賱丿賷 卮賷亍 賱丕 賷賲賰賳 卮乇丕丐賴 亘丕賱賲丕賱 - 乇丐賷丞 賱賲爻鬲賯亘賱 丕賱廿亘丿丕毓 丕賱乇賯賲賷."

## 賵賱丕丿丞 丕賱孬賵乇丞

賮賷 卮賯鬲賴 丕賱氐睾賷乇丞 丕賱賲賰賵賳丞 賲賳 睾乇賮丞 賵丕丨丿丞貙 亘丿兀 Sybau Guy 亘鬲噩乇亘丞 鬲賯賳賷丕鬲 丕賱匕賰丕亍 丕賱丕氐胤賳丕毓賷. 賱賷賱丞 亘毓丿 賱賷賱丞貙 賰丕賳 賷亘乇賲噩 賵賷禺鬲亘乇 賵賷賰賲賱 賲丕 爻賷購毓乇賮 賱丕丨賯丕賸 亘丕爻賲 Sybau Lazer Dim 700.

---

**賴賱 兀賳鬲 賲爻鬲毓丿 賱廿賳卮丕亍 賯氐丞 賳噩丕丨 禺丕氐丞 亘賰責** [噩乇亘 Sybau Picture 賲噩丕賳丕賸](/generator)
    `,
    author: '賮乇賷賯 Sybau',
    date: '2024-03-15',
    readTime: '5 丿賯丕卅賯',
    image: '/blog/sybau-guy-story.jpg',
    category: '廿賱賴丕賲'
  },
  {
    slug: 'ai-vs-traditional-editing',
    title: '丕賱匕賰丕亍 丕賱丕氐胤賳丕毓賷 賲賯丕亘賱 丕賱鬲丨乇賷乇 丕賱鬲賯賱賷丿賷: 丕賱賲賵丕噩賴丞 丕賱賳賴丕卅賷丞',
    excerpt: '賲賯丕乇賳丞 卮丕賲賱丞 亘賷賳 廿賳卮丕亍 丕賱賲賷賲夭 亘丕賱匕賰丕亍 丕賱丕氐胤賳丕毓賷 賵胤乇賯 丕賱鬲丨乇賷乇 丕賱鬲賯賱賷丿賷丞.',
    content: `
# 丕賱匕賰丕亍 丕賱丕氐胤賳丕毓賷 賲賯丕亘賱 丕賱鬲丨乇賷乇 丕賱鬲賯賱賷丿賷: 丕賱賲賵丕噩賴丞 丕賱賳賴丕卅賷丞

賷卮賴丿 賲卮賴丿 丕賱廿亘丿丕毓 丕賱乇賯賲賷 鬲丨賵賱丕賸 鬲賰鬲賵賳賷丕賸. 賲賳 噩賴丞貙 賱丿賷賳丕 兀丿賵丕鬲 丕賱鬲丨乇賷乇 丕賱鬲賯賱賷丿賷丞 丕賱鬲賷 鬲賲 氐賯賱賴丕 毓賱賶 賲丿賶 毓賯賵丿. 賲賳 丕賱噩賴丞 丕賱兀禺乇賶貙 賱丿賷賳丕 丨賱賵賱 賲丿賮賵毓丞 亘丕賱匕賰丕亍 丕賱丕氐胤賳丕毓賷 鬲毓丿 亘孬賵乇丞 賮賷 廿賳卮丕亍 丕賱賲丨鬲賵賶.

---

**賴賱 兀賳鬲 賲爻鬲毓丿 賱鬲噩乇亘丞 賲爻鬲賯亘賱 廿賳卮丕亍 丕賱賲賷賲夭責** [噩乇亘 Sybau Picture 賲噩丕賳丕賸](/generator)
    `,
    author: '賮乇賷賯 丕賱鬲丨賱賷賱 丕賱鬲賯賳賷',
    date: '2024-03-10',
    readTime: '7 丿賯丕卅賯',
    image: '/blog/ai-vs-traditional.jpg',
    category: '鬲賯賳賷丞'
  },
  {
    slug: 'sarah-transformation',
    title: '鬲丨賵賱 爻丕乇丞: 賲賳 50 賲鬲丕亘毓 廿賱賶 500 兀賱賮',
    excerpt: '賰賷賮 丨賯賯鬲 賲毓賱賲丞 賲賳 胤賵賰賷賵 丨賱賲 賵爻丕卅賱 丕賱鬲賵丕氐賱 丕賱丕噩鬲賲丕毓賷 亘丕爻鬲禺丿丕賲 Sybau Picture.',
    content: `
# 鬲丨賵賱 爻丕乇丞: 賲賳 50 賲鬲丕亘毓 廿賱賶 500 兀賱賮

## 馗丕賴乇丞 賵爻丕卅賱 丕賱鬲賵丕氐賱 丕賱丕噩鬲賲丕毓賷 睾賷乇 丕賱賲鬲賵賯毓丞

爻丕乇丞 鬲丕賳丕賰丕貙 賲毓賱賲丞 賮賷 丕賱賲乇丨賱丞 丕賱丕亘鬲丿丕卅賷丞 鬲亘賱睾 賲賳 丕賱毓賲乇 34 毓丕賲丕賸 賲賳 胤賵賰賷賵貙 賰丕賳鬲 鬲賲賱賰 兀丨賱丕賲丕賸 賰亘賷乇丞 賵丨爻丕亘 廿賳爻鬲睾乇丕賲 氐睾賷乇 噩丿丕賸.

---

**賴賱 兀賳鬲 賲爻鬲毓丿 賱鬲丨賵賱賰 丕賱禺丕氐責** [丕亘丿兀 賲毓 Sybau Picture 丕賱賷賵賲](/generator)
    `,
    author: '賮乇賷賯 賯氐氐 丕賱賳噩丕丨',
    date: '2024-03-05',
    readTime: '8 丿賯丕卅賯',
    image: '/blog/sarah-transformation.jpg',
    category: '賯氐氐 賳噩丕丨'
  }
]

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)

  const post = blogPosts.find(p => p.slug === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/ar/blog"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform scale-x-[-1]" />
          丕賱毓賵丿丞 廿賱賶 丕賱賲丿賵賳丞
        </Link>

        <article className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium mb-4">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div className="relative w-full h-64 md:h-96 mb-8 rounded-2xl overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-lg max-w-none mb-8 text-right">
            <div
              className="prose-headings:text-gray-900 prose-a:text-purple-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{
                __html: post.content.replace(/\n/g, '<br />').replace(/#{1,6} /g, match => {
                  const level = match.trim().length
                  return `<h${level} class="text-2xl font-bold mt-8 mb-4 text-right">`
                }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }}
            />
          </div>

          <div className="text-center mt-16 p-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white">
            <h2 className="text-2xl font-bold mb-4">
              賴賱 兀賳鬲 賲爻鬲毓丿 賱廿賳卮丕亍 丕賱賲賷賲夭 丕賱賮賷乇賵爻賷丞 丕賱禺丕氐丞 亘賰責
            </h2>
            <Link
              href="/ar/generator"
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-full font-semibold transition-colors"
            >
              噩乇亘 丕賱丌賳 賲噩丕賳丕賸
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
