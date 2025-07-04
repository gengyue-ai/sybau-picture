import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Sparkles, Users, Globe, Shield, Heart, TrendingUp, Star, Award, Target, Zap, Palette, Bot, Globe2, Lock, Lightbulb, Coffee, Code, MessageCircle, Github, Twitter, Mail, Rocket, CheckCircle, BarChart3, Clock, UserCheck, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sybau Pictureについて | AIミーム生成器',
  description: 'Sybau Pictureのミッション、ビジョン、価値観について学びましょう。AI技術を通じて誰でもプロ品質のミーム作成を可能にすることをお約束します。',
  alternates: {
    canonical: `https://sybau-picture.com/ja/about`,
    languages: {
      'en': 'https://sybau-picture.com/en/about',
      'zh': 'https://sybau-picture.com/zh/about',
      'es': 'https://sybau-picture.com/es/about',
      'ja': 'https://sybau-picture.com/ja/about',
      'ko': 'https://sybau-picture.com/ko/about',
      'fr': 'https://sybau-picture.com/fr/about',
      'de': 'https://sybau-picture.com/de/about',
      'pt': 'https://sybau-picture.com/pt/about',
      'ru': 'https://sybau-picture.com/ru/about',
      'ar': 'https://sybau-picture.com/ar/about'
    }
  },
  openGraph: {
    title: 'Sybau Pictureについて - AI日本語ミーム生成器',
    description: '世界をリードするAIミーム生成プラットフォームの背景にあるストーリーを発見してください。',
    url: `https://sybau-picture.com/ja/about`,
    siteName: 'Sybau Picture',
    locale: 'ja',
    type: 'website',
  }
}

export default function JAAboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
        <div className="relative container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              href="/ja"
              className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              ホームに戻る
            </Link>

            <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              Sybau Pictureについて
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AIで創造性を向上させる
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              私たちは、プロ品質のAI画像生成を世界中の誰もがアクセスできるようにすることで、ミーム作成を民主化することをミッションとしています。
            </p>

            <div className="mt-8">
              <Link href="/ja/generator">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-300">
                  <Rocket className="w-5 h-5 mr-2" />
                  生成器を試す
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">125万+</div>
            <div className="text-gray-600">作成されたミーム</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">50万+</div>
            <div className="text-gray-600">アクティブユーザー</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">180+</div>
            <div className="text-gray-600">サービス提供国</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-gray-600">稼働時間</div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">私たちのミッション</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  想像力と創造の間の障壁を取り除くこと。誰もが文化を超えて人々に響き、楽しませ、つながるコンテンツを作成する可能性を持っていると信じています。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">私たちのビジョン</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  創造性に限界がない世界。AIが人間の創造性を置き換えるのではなく、増幅する未来を思い描いています。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">私たちの価値観</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              私たちが行うすべての決定と構築するすべての機能を導く原則。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">革新第一</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm">
                  誰もが創造性にアクセスできるようにAI技術の境界を押し広げています。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">コミュニティ主導</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm">
                  ユーザーは私たちが行うすべての中心です。クリエイターのため、クリエイターによって構築しています。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">プライバシー重視</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm">
                  あなたのデータはあなたのものです。個人情報の透明性とユーザー制御を信じています。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">グローバル包括</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm">
                  ミームは境界を越えます。すべての文化と言語を祝うプラットフォームを構築しています。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">私たちのチーム</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sybau Pictureの背後にいる情熱的な個人たち
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">AI開発チーム</CardTitle>
                <CardDescription>機械学習エンジニア</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  最先端のAI技術を開発し、誰もが使いやすいツールに変換しています。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">デザインチーム</CardTitle>
                <CardDescription>UX/UIデザイナー</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  美しく直感的なユーザーエクスペリエンスを作成し、創造的なプロセスを楽しくしています。
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg text-center">
              <CardHeader>
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">コミュニティチーム</CardTitle>
                <CardDescription>コミュニティマネージャー</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  グローバルなクリエイターコミュニティを支援し、インスピレーションを提供しています。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              創造の旅を始めましょう 🚀
            </h2>
            <p className="text-xl mb-8 opacity-90">
              今すぐSybau Pictureで独自のバイラルコンテンツの作成を開始し、世界に創造性を示しましょう！
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ja/generator">
                <Button className="bg-white text-purple-600 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transform transition-all duration-200">
                  <Zap className="w-5 h-5 mr-2" />
                  今すぐ作成開始
                </Button>
              </Link>
              <Link href="/ja/gallery">
                <Button className="border-2 border-white text-white px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-200">
                  <Star className="w-5 h-5 mr-2" />
                  ギャラリーを見る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
