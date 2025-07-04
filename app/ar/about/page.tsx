import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft, 
  Sparkles, 
  Users, 
  Globe, 
  Shield, 
  Heart,
  Target,
  Zap,
  Lightbulb,
  Rocket,
  Star
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | Sybau Picture - AI Meme Generator',
  description: 'Learn about Sybau Picture mission, vision and values. We are committed to making professional-quality meme creation accessible to everyone through AI technology.',
  alternates: {
    canonical: `https://sybau-picture.com/ar/about`,
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
    title: 'About Sybau Picture - AI العربية Meme Generator',
    description: 'Discover the story behind the world\'s leading AI meme generation platform.',
    url: `https://sybau-picture.com/ar/about`,
    siteName: 'Sybau Picture',
    locale: 'ar',
    type: 'website',
  }
}

export default function ARAboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10" />
        <div className="relative container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <Link 
              href="/ar" 
              className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة إلى الصفحة الرئيسية
            </Link>
            
            <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              حول Sybau Picture
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              تمكين الإبداع من خلال الذكاء الاصطناعي
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              نحن في مهمة لجعل إنشاء الميمات عالي الجودة متاحًا للجميع في كل مكان من خلال تقنية الذكاء الاصطناعي المتقدمة.
            </p>
            
            <div className="mt-8">
              <Link href="/ar/generator">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-300">
                  <Rocket className="w-5 h-5 mr-2" />
                  جرب المولد
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
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">125�?</div>
            <div className="text-gray-600">الميمات المُنشأة</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-pink-600 mb-2">50�?</div>
            <div className="text-gray-600">المستخدمون النشطون</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">180+</div>
            <div className="text-gray-600">البلدان المخدومة</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">99.9%</div>
            <div className="text-gray-600">مدة التشغيل</div>
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
                <CardTitle className="text-2xl font-bold">مهمتنا</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  كسر الحواجز بين الخيال والإبداع. نؤمن أن كل شخص لديه القدرة على إنشاء محتوى يلقى صدى ويسلي ويربط الناس عبر الثقافات.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">رؤيتنا</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  عالم لا يعرف الإبداع فيه حدودًا. نتصور مستقبلاً يعزز فيه الذكاء الاصطناعي الإبداع البشري بدلاً من استبداله.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">قيمنا</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              المبادئ التي توجه كل قرار نتخذه وكل ميزة نطورها.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">الابتكار أولاً</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm">
                  ندفع بحدود تقنية الذكاء الاصطناعي لجعل الإبداع متاحًا للجميع.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">مجتمع موجه</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm">
                  مستخدمونا في قلب كل ما نفعله. نبني للمبدعين، من قبل المبدعين.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">محافظة على الخصوصية</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm">
                  بياناتك ملكك. نؤمن بالشفافية وسيطرة المستخدم على المعلومات الشخصية.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg font-bold">شامل عالمياً</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 text-sm">
                  الميمات تتجاوز الحدود. نبني منصة تحتفي بجميع الثقافات واللغات.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            جاهز لبدء الإبداع؟
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            انضم إلى ملايين المبدعين الذين يحولون أفكارهم إلى محتوى فيروسي باستخدام Sybau Picture.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ar/generator">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full text-lg shadow-lg transition-all duration-300">
                <Rocket className="w-5 h-5 mr-2" />
                ابدأ الإنشاء الآن
              </Button>
            </Link>
            <Link href="/ar/gallery">
              <Button variant="outline" className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-3 rounded-full text-lg">
                <Star className="w-5 h-5 mr-2" />
                عرض المعرض
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

