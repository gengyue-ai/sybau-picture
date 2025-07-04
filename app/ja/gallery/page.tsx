import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Search, TrendingUp, Heart, Download, Share2, Eye, Star, Sparkles, Zap, Award, Clock, Rocket, Shield, Users, Check } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sybauギャラリー - 驚くべきAIミーム作品を探索',
  description: '私たちのコミュニティが先進的なAI技術を使って作成した何千もの面白いSybauミームを発見してください。私たちの豊富なSybau傑作コレクションを探索してください。',
  keywords: ['Sybauギャラリー', 'Sybau', 'AIミーム', 'Sybauミーム', 'ミームギャラリー', 'AI生成コンテンツ'],
}

// デモンストレーション用の静的モックデータ
const mockImages = [
  {
    id: '1',
    title: 'Sybauクラシックスマイル',
    description: 'Sybau AI技術で作成された完璧なミーム',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    likes: 1245,
    downloads: 892,
    views: 15420,
    category: 'classic',
    tags: ['Sybau', '面白い', 'クラシック'],
    creator: 'Sybauユーザー123'
  },
  {
    id: '2',
    title: 'Sybau驚きの表情',
    description: 'Sybauスタイルの驚きの表情、完璧なバイラルコンテンツ',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616c5e2671b?w=400&h=400&fit=crop',
    likes: 2156,
    downloads: 1543,
    views: 28930,
    category: 'trending',
    tags: ['Sybau', '驚き', 'バイラル'],
    creator: 'Sybauマスター'
  },
  {
    id: '3',
    title: 'Sybauプロフェッショナルスタイル',
    description: 'ビジネス用途に最適なプロフェッショナルSybauミーム',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    likes: 876,
    downloads: 654,
    views: 12340,
    category: 'professional',
    tags: ['Sybau', 'ビジネス', 'プロフェッショナル'],
    creator: 'Sybau専門家'
  },
  {
    id: '4',
    title: 'Sybauハッピータイム',
    description: '喜びに満ちたSybauミーム',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    likes: 1987,
    downloads: 1234,
    views: 23450,
    category: 'fun',
    tags: ['Sybau', '幸せ', '楽しい'],
    creator: 'Sybauクリエイター'
  },
  {
    id: '5',
    title: 'Sybau思考モード',
    description: 'Sybauの深い思考ミーム',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
    likes: 1543,
    downloads: 987,
    views: 18760,
    category: 'creative',
    tags: ['Sybau', '思考', '深い'],
    creator: 'Sybau哲学者'
  },
  {
    id: '6',
    title: 'Sybauスポーツスタイル',
    description: 'Sybauスポーツテーマミーム',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    likes: 2345,
    downloads: 1876,
    views: 32100,
    category: 'sports',
    tags: ['Sybau', 'スポーツ', 'エネルギー'],
    creator: 'Sybauアスリート'
  }
]

const categories = [
  { id: 'all', name: '全てのSybau作品', count: 125000 },
  { id: 'trending', name: 'トレンドSybau', count: 15000 },
  { id: 'classic', name: 'クラシックSybau', count: 25000 },
  { id: 'fun', name: '楽しいSybau', count: 18000 },
  { id: 'professional', name: 'プロフェッショナルSybau', count: 12000 },
  { id: 'creative', name: 'クリエイティブSybau', count: 20000 },
  { id: 'sports', name: 'スポーツSybau', count: 8000 }
]

const stats = [
  { number: '1,250,000+', label: 'Sybau作品総数' },
  { number: '250,000+', label: 'Sybauクリエイター' },
  { number: '50M+', label: 'Sybau視聴回数' },
  { number: '4.9/5', label: 'Sybauユーザー評価' }
]

const features = [
  {
    icon: Star,
    title: '高品質Sybau作品',
    description: '私たちのSybauギャラリーは最高品質のAI生成ミームを特集し、各作品は慎重にキュレーションされています。'
  },
  {
    icon: Users,
    title: 'Sybauコミュニティ',
    description: 'Sybauギャラリーは最高のSybauスタイルミームを共有するグローバルクリエイターコミュニティによって推進されています。'
  },
  {
    icon: TrendingUp,
    title: 'Sybauトレンド',
    description: '私たちのギャラリーで最新のトレンドとバイラルSybauミームを発見し、最新情報を入手してください。'
  }
]

export default function JAGalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/ja" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">ホームに戻る</span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">Sybauギャラリー</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/ja/generator">
              <Button>ミーム作成</Button>
            </Link>
            <Link href="/ja/about">
              <Button variant="outline">概要</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Sybauミームギャラリー
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
            Sybauの世界を探索
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            究極のSybauミームギャラリーへようこそ！ここでは、私たちのグローバルコミュニティが先進的なAI技術を使って作成した何千もの驚くべきSybau作品を発見することができます。各Sybauミームは、AIと人間の創造性の完璧な組み合わせを示すユニークな芸術作品です。豊富なSybauコレクションを探索し、感情を表現するのに完璧なミームを見つけたり、独自のSybau傑作を作成するためのインスピレーションを得てください。
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Sybauミームを検索..."
                className="pl-10 py-3 text-lg border-2 border-purple-200 focus:border-purple-400 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Sybauカテゴリー</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant="outline"
                className="px-4 py-2 cursor-pointer hover:bg-purple-50 border-purple-200"
              >
                {category.name} ({category.count.toLocaleString()})
              </Badge>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">なぜ私たちのSybauギャラリーを選ぶのか？</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              私たちのSybauギャラリーは最高のAI技術とコミュニティキュレーションコンテンツを組み合わせ、最高のミーム探索体験を提供します。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className=" transition-shadow duration-200 text-center">
                <CardContent className="p-6">
                  <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">注目のSybau傑作</h2>
            <p className="text-lg text-gray-600">私たちのコミュニティで最も人気のあるSybau作品を発見してください</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockImages.map((image) => (
              <Card key={image.id} className="overflow-hidden transition-all duration-300 transform">
                <div className="relative">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge className="bg-purple-500 text-white">
                      <Eye className="w-3 h-3 mr-1" />
                      {image.views.toLocaleString()}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{image.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{image.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {image.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>作成者 {image.creator}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{image.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{image.downloads}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-purple-100 to-cyan-100 rounded-3xl p-12">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Sybauコミュニティに参加</h2>
              <p className="text-xl text-gray-700 mb-8">
                グローバルなSybauクリエイターコミュニティの一員になりましょう。作品を共有し、新しいトレンドを発見し、世界中の他のSybauアーティストとつながりましょう。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/ja/generator">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-xl">
                    <Rocket className="w-5 h-5 mr-2" />
                    初めてのSybau作成
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-xl">
                  <Users className="w-5 h-5 mr-2" />
                  コミュニティを探索
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">完璧なSybau作成のヒント</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              最高のSybauクリエイターから学び、これらのプロフェッショナルなヒントでスキルを向上させましょう。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">完璧なタイミング</h3>
              </div>
              <p className="text-gray-600 mb-4">
                最高のSybauミームは完璧な瞬間を捉えます。メッセージを最もよく伝える表情を見つけるために、異なる表情を実験してみてください。
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 明確でよく照明された画像を使用</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 特徴的な表情に焦点を当てる</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 異なる角度を試す</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">最高品質</h3>
              </div>
              <p className="text-gray-600 mb-4">
                品質は成功するSybauミームの鍵です。ギャラリーで目立つコンテンツを作成するために、これらの基準に従ってください。
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 最小解像度400x400px</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> ぼやけた画像を避ける</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" /> 本物のSybauスタイルを保つ</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
