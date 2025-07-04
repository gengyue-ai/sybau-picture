'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Heart, Share2, Calendar, Clock, User } from 'lucide-react'
import { useState } from 'react'

// 日语博客文章数据
const blogPosts = [
  {
    slug: 'sybau-guy-inspirational-story',
    title: 'Sybau Guyの感動的な物語：絶望から勝利へ',
    excerpt: 'Sybau Guyの素晴らしい旅と、彼の勇気がデジタル環境を永遠に変えた方法を発見してください。',
    content: `
# Sybau Guyの感動的な物語：絶望から勝利へ

## 謙虚な始まり

3月の雨の火曜日、Sybau Guyはグラフィックデザイナーとしての最後の仕事を失いました。空っぽのポケットと心の中の夢を持って、彼はデジタルコンテンツの作り方を永遠に変える旅に出ました。

「銀行口座に文字通り50ドルしかありませんでした」とSybau Guyは振り返ります。「でも、お金では買えないものがありました - デジタル創造性の未来へのビジョンです。」

## 革命の誕生

小さなワンルームアパートで、Sybau GuyはAI技術の実験を始めました。夜ごと、彼はプログラミングし、テストし、後にSybau Lazer Dim 700として知られるようになるものを完成させました。

---

**自分自身の成功ストーリーを作る準備はできていますか？** [Sybau Pictureを無料でお試しください](/generator)
    `,
    author: 'Sybauチーム',
    date: '2024-03-15',
    readTime: '5分',
    image: '/blog/sybau-guy-story.jpg',
    category: 'インスピレーション'
  },
  {
    slug: 'ai-vs-traditional-editing',
    title: 'AI対従来編集：究極の対決',
    excerpt: 'AI駆動のミーム作成と従来の編集方法の詳細な比較。',
    content: `
# AI対従来編集：究極の対決

デジタル創造性の風景は地殻変動を経験しています。一方では、何十年もの改良を経てきた従来の編集ツールがあります。他方では、コンテンツ作成を革命的に変えることを約束するAI駆動のソリューションがあります。

---

**ミーム作成の未来を体験する準備はできていますか？** [Sybau Pictureを無料でお試しください](/generator)
    `,
    author: '技術分析チーム',
    date: '2024-03-10',
    readTime: '7分',
    image: '/blog/ai-vs-traditional.jpg',
    category: '技術'
  },
  {
    slug: 'sarah-transformation',
    title: 'サラの変身：50フォロワーから50万フォロワーへ',
    excerpt: '東京の教師がSybau Pictureでソーシャルメディアの夢を実現した方法。',
    content: `
# サラの変身：50フォロワーから50万フォロワーへ

## 予想外のソーシャルメディア現象

サラ田中は34歳の東京の小学校教師で、大きな夢と非常に小さなInstagramアカウントを持っていました。

---

**自分自身の変身の準備はできていますか？** [今日Sybau Pictureで始めてください](/generator)
    `,
    author: '成功ストーリーチーム',
    date: '2024-03-05',
    readTime: '8分',
    image: '/blog/sarah-transformation.jpg',
    category: '成功事例'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/ja/blog"
          className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          ブログに戻る
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

          <div className="prose prose-lg max-w-none mb-8">
            <div
              className="prose-headings:text-gray-900 prose-a:text-purple-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{
                __html: post.content.replace(/\n/g, '<br />').replace(/#{1,6} /g, match => {
                  const level = match.trim().length
                  return `<h${level} class="text-2xl font-bold mt-8 mb-4">`
                }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              }}
            />
          </div>

          <div className="text-center mt-16 p-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white">
            <h2 className="text-2xl font-bold mb-4">
              あなた自身のバイラルミームを作る準備はできていますか？
            </h2>
            <Link
              href="/ja/generator"
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-full font-semibold transition-colors"
            >
              今すぐ無料で試す
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
