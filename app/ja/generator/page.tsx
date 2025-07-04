import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Sparkles, Rocket, Users } from 'lucide-react'
import { Metadata } from 'next'
import ImageGenerator from '@/components/ImageGenerator'

export const metadata: Metadata = {
  title: '画像生成器 - 驚くべきAI生成ミームを作成 | Sybau Picture',
  description: '高度な画像生成器を使用して、数秒であらゆる写真をバイラルなSybauミームに変換します。無料、高速、登録不要。AI駆動の画像生成器の力を体験してください。',
  keywords: ['画像生成器', 'AI画像生成器', 'Sybau画像生成器', 'ミーム生成器', '無料画像生成器', 'AIツール', '画像エディター'],
}

const stats = [
  { number: '1,250,000+', label: '画像生成器作成数' },
  { number: '250,000+', label: '画像生成器ユーザー' },
  { number: '4.9/5', label: '画像生成器評価' },
  { number: '150+', label: '画像生成器提供国' }
]

export default function JAGeneratorPage() {
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
            <span className="text-xl font-bold">Sybau 画像生成器</span>
          </div>

          <div></div>
        </div>
      </header>

      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AI画像生成器
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
              強力なAI画像生成器
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              私たちの革命的な画像生成器を使用して、数秒であらゆる写真をバイラルなSybauミームに変換します。この画像生成器は最先端のAI技術を採用し、最高の画像生成体験を提供します。
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              今すぐ開始
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-200 text-purple-600 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Users className="w-5 h-5 mr-2" />
              詳細を見る
            </Button>
          </div>
        </div>

        {/* 画像生成器功能区域 */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">画像生成器を使い始める</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              写真をアップロードするか、プロンプトを入力して、AIが独特なSybauスタイルのミームを作成します
            </p>
          </div>

          <ImageGenerator
            texts={{
              uploadTitle: "画像をアップロード",
              uploadDescription: "写真をAI画像生成器にアップロード",
              uploadPlaceholder: "画像ファイルを選択",
              settingsTitle: "画像生成器設定",
              settingsDescription: "画像生成器パラメータをカスタマイズ",
              styleLabel: "スタイル",
              styleOption: "クラシック",
              styleDescription: "Sybauクラシックスタイル",
              promptLabel: "プロンプト",
              promptPlaceholder: "AIに画像生成内容を説明...",
              generateButton: "AI画像生成",
              downloadButton: "画像をダウンロード",
              generating: "AI画像生成中...",
              success: "画像生成完了！",
              error: "エラーが発生しました",
              maxFileSize: "最大5MB",
              supportedFormats: "JPG、PNG、WebP対応",
              dragAndDrop: "ドラッグ&ドロップ",
              clickToBrowse: "クリックして選択"
            }}
          />
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 rounded-2xl bg-white shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">AI駆動技術</h3>
            <p className="text-gray-600">最先端の人工知能により、完璧で魅力的な画像生成を実現</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
              <Rocket className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">超高速処理</h3>
            <p className="text-gray-600">最適化されたシステムで8秒以内にプロ品質の画像を生成</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-4">簡単操作</h3>
            <p className="text-gray-600">デザイン経験不要 - 誰でも簡単に魅力的な画像を作成可能</p>
          </div>
        </div>

        {/* About Sybau */}
        <div className="text-center bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Sybau Pictureについて</h2>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-6">
            Sybau Pictureは、AI技術を活用してバイラルなミームを作成する革新的なプラットフォームです。
            私たちの画像生成器は、どんな写真も面白くて魅力的なSybau Lazer Dim 700スタイルのコンテンツに変換します。
          </p>
          <p className="text-gray-600 max-w-3xl mx-auto">
            デザインスキルは不要です。写真をアップロードして、AIが魔法をかけるのを見てください！
            数秒で、ソーシャルメディアで共有できる高品質なミームが完成します。
          </p>
        </div>
      </div>
    </div>
  )
}
