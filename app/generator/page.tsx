'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Upload, Download, Share2, Settings, Zap, ArrowLeft, Loader2, Check, AlertCircle, X, Sparkles, Clock, Star, Heart, Award, TrendingUp, Shield, Users, Rocket } from 'lucide-react'
import { cn, formatFileSize, isValidImageType } from '@/lib/utils'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RefreshCw } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { generateLocalizedLink } from '@/lib/i18n'

interface GeneratedResult {
  originalUrl: string
  processedUrl: string
  processingTime: number
  style: string
  intensity: number
}

export default function GeneratorPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<GeneratedResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const pathname = usePathname()

  // 样式配置
  const [style, setStyle] = useState<'classic' | 'exaggerated' | 'minimal'>('classic')
  const [intensity, setIntensity] = useState([2])

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 静态文本
  const staticTexts = {
    title: 'AI Picture Generator',
    subtitle: 'Create viral Sybau memes with our advanced picture generator technology',
    uploadArea: 'Upload your photo to our AI picture generator',
    supportedFormats: 'Our picture generator supports JPG, PNG, WEBP (Max 5MB)',
    styleSettings: 'Picture Generator Style Settings',
    classic: 'Classic Sybau',
    exaggerated: 'Exaggerated Effect',
    minimal: 'Minimal Style',
    intensityLabel: 'Picture Generator Intensity',
    generateButton: 'Generate with AI',
    processing: 'Picture Generator Processing...',
    downloadButton: 'Download Your Creation',
    shareButton: 'Share Your Meme',
    resetButton: 'Create Another Meme',
    backToHome: 'Back to Home',
    errorInvalidFile: 'Please upload a valid image file to our picture generator',
    errorFileTooLarge: 'File size must be less than 5MB for optimal picture generator performance',
    processingTime: 'Picture Generator Processing Time',
    uploadTitle: 'Upload Your Photo',
    dragDescription: 'Drop your image here',
    clickToBrowse: 'or click to browse',
    chooseStyle: 'Choose Your Style',
    intensityLevel: 'Intensity Level',
    gallery: 'Gallery',
    howItWorks: 'How Our Picture Generator Works',
    whyChoose: 'Why Choose Our Picture Generator?',
    features: 'Picture Generator Features',
    tips: 'Picture Generator Tips',
    exploreGallery: 'Explore Gallery'
  }

  // 简化的文本获取函数
  const getText = (key: string) => {
    return staticTexts[key as keyof typeof staticTexts] || key
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileUpload = (file: File) => {
    setError(null)

    // 验证文件类型
    if (!isValidImageType(file.type)) {
      setError(getText('errorInvalidFile'))
      return
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(getText('errorFileTooLarge'))
      return
    }

    setUploadedFile(file)

    // 创建预览
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const processImage = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    setError(null)
    setProcessingProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)
      formData.append('style', style)
      formData.append('intensity', intensity.toString())

      // 模拟进度
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 800)

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setProcessingProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Picture generator processing failed')
      }

      const apiResult = await response.json()
      console.log('API Response:', apiResult)

      // 检查API响应是否成功
      if (!apiResult.success) {
        throw new Error(apiResult.error || 'Generation failed')
      }

      // 映射API响应到前端期望的结构
      const result: GeneratedResult = {
        originalUrl: uploadPreview || '',
        processedUrl: apiResult.imageUrl,
        processingTime: Date.now() - Date.now(), // 简化的处理时间
        style: style,
        intensity: intensity[0]
      }

      setResult(result)

      // 清理上传状态
      setTimeout(() => {
        setProcessingProgress(0)
      }, 1000)

    } catch (error) {
      console.error('Picture generator error:', error)
      setError(error instanceof Error ? error.message : 'Something went wrong with the picture generator')
      setProcessingProgress(0)
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadImage = () => {
    if (!result?.processedUrl) return

    const link = document.createElement('a')
    link.href = result.processedUrl
    link.download = `sybau-meme-${Date.now()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const shareImage = async () => {
    if (!result?.processedUrl) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my Sybau meme from the AI picture generator!',
          text: 'Created with Sybau Picture Generator - the best AI picture generator for memes',
          url: result.processedUrl,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(result.processedUrl)
        alert('Picture generator link copied to clipboard!')
      } catch (error) {
        console.log('Error copying to clipboard:', error)
      }
    }
  }

  const resetGenerator = () => {
    setUploadedFile(null)
    setUploadPreview(null)
    setResult(null)
    setError(null)
    setProcessingProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
              {getText('title')}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              {getText('subtitle')} - Transform any photo into hilarious Sybau-style memes instantly with our state-of-the-art AI picture generator.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Badge className="bg-purple-500 text-white px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                8-Second Generation
              </Badge>
              <Badge className="bg-pink-500 text-white px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                HD Quality Output
              </Badge>
              <Badge className="bg-cyan-500 text-white px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                100% Free to Use
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <main className="container py-12">
        <div className="max-w-6xl mx-auto">
          {/* Picture Generator Tool */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Upload Section */}
            <Card className="shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  {getText('uploadTitle')}
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Upload your photo to our advanced AI picture generator
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {!uploadedFile ? (
                  <div
                    className={cn(
                      "border-2 border-dashed border-purple-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer",
                      dragActive && "border-purple-500 bg-purple-50"
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Upload className="h-16 w-16 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-700">{getText('uploadArea')}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {getText('clickToBrowse')}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {getText('supportedFormats')}
                      </p>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleFileInputChange}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {uploadPreview && (
                        <Image
                          src={uploadPreview}
                          alt="Picture generator preview"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{uploadedFile.name}</span>
                      <span>{formatFileSize(uploadedFile.size)}</span>
                    </div>

                    <Button variant="outline" onClick={resetGenerator} className="w-full">
                      Upload Different Image
                    </Button>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Settings Section */}
            <Card className="shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {getText('styleSettings')}
                </CardTitle>
                <CardDescription className="text-cyan-100">
                  Customize your picture generator settings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Style Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block text-gray-700">
                    {getText('chooseStyle')}
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { value: 'classic', label: getText('classic'), desc: 'Authentic Sybau feel with classic picture generator styling' },
                      { value: 'exaggerated', label: getText('exaggerated'), desc: 'Maximum impact with enhanced picture generator effects' },
                      { value: 'minimal', label: getText('minimal'), desc: 'Subtle transformation with minimal picture generator processing' },
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                          style === option.value
                            ? "border-purple-500 bg-purple-50 shadow-md"
                            : "border-gray-200 "
                        )}
                        onClick={() => setStyle(option.value as any)}
                      >
                        <div className="font-medium text-sm text-gray-800">{option.label}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {option.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Intensity Slider */}
                <div>
                  <label className="text-sm font-medium mb-3 block text-gray-700">
                    {getText('intensityLevel')}: {intensity[0]}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="1"
                      value={intensity[0]}
                      onChange={(e) => setIntensity([Number(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${((intensity[0] - 1) / 2) * 100}%, #e5e7eb ${((intensity[0] - 1) / 2) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtle</span>
                      <span>Balanced</span>
                      <span>Intense</span>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={processImage}
                  disabled={!uploadedFile || isProcessing}
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {getText('processing')} ({processingProgress}%)
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      {getText('generateButton')}
                    </>
                  )}
                </Button>

                {/* Processing Progress */}
                {isProcessing && (
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Result Section */}
          {result && (
            <Card className="mb-16 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  Your Picture Generator Creation is Ready!
                </CardTitle>
                <CardDescription className="text-green-100">
                  Generated in {result.processingTime || 8} seconds with our AI picture generator
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Before/After */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-center text-gray-700">Original Image</h3>
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {uploadPreview && (
                        <Image
                          src={uploadPreview}
                          alt="Original image"
                          width={400}
                          height={400}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-center text-gray-700">Picture Generator Result</h3>
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={result.processedUrl}
                        alt="Picture generator result"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button
                    onClick={downloadImage}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {getText('downloadButton')}
                  </Button>
                  <Button
                    onClick={shareImage}
                    variant="outline"
                    className="flex-1 border-purple-200 text-purple-600"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    {getText('shareButton')}
                  </Button>
                  <Button
                    onClick={resetGenerator}
                    variant="outline"
                    className="flex-1 border-gray-200 text-gray-600"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {getText('resetButton')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* How It Works Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
                {getText('howItWorks')}
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Our AI picture generator uses advanced machine learning to transform your photos into viral Sybau-style memes. The picture generator process is simple, fast, and produces professional results every time.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Upload Your Image',
                  description: 'Select any photo and upload it to our picture generator. Our system supports JPG, PNG, and WebP formats for maximum compatibility.',
                  icon: <Upload className="w-8 h-8" />
                },
                {
                  step: '2',
                  title: 'AI Processing',
                  description: 'Our advanced picture generator AI analyzes your image and applies the signature Sybau transformation using cutting-edge algorithms.',
                  icon: <Sparkles className="w-8 h-8" />
                },
                {
                  step: '3',
                  title: 'Download & Share',
                  description: 'Your picture generator creation is ready! Download the high-quality result and share your viral meme across social platforms.',
                  icon: <Download className="w-8 h-8" />
                }
              ].map((step, index) => (
                <Card key={index} className="text-center transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
                {getText('whyChoose')}
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Our picture generator stands out from the competition with advanced AI technology, lightning-fast processing, and professional-quality results that make your content go viral.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Advanced AI Technology',
                  description: 'Our picture generator uses state-of-the-art artificial intelligence to ensure every creation is perfect and engaging.',
                  icon: <Sparkles className="w-8 h-8" />,
                  color: 'from-purple-500 to-purple-600'
                },
                {
                  title: 'Lightning Fast Processing',
                  description: 'Generate professional-quality memes in just 8 seconds with our optimized picture generator system.',
                  icon: <Zap className="w-8 h-8" />,
                  color: 'from-yellow-500 to-orange-500'
                },
                {
                  title: 'HD Quality Output',
                  description: 'Our picture generator produces high-definition results perfect for social media and professional use.',
                  icon: <Award className="w-8 h-8" />,
                  color: 'from-blue-500 to-indigo-500'
                },
                {
                  title: 'Multiple Style Options',
                  description: 'Choose from various picture generator styles to match your creative vision and audience preferences.',
                  icon: <Star className="w-8 h-8" />,
                  color: 'from-pink-500 to-red-500'
                },
                {
                  title: 'Secure & Private',
                  description: 'Your images are processed securely and never stored on our servers. Our picture generator respects your privacy.',
                  icon: <Shield className="w-8 h-8" />,
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  title: 'Free to Use',
                  description: 'Our picture generator is completely free with no hidden costs, watermarks, or subscription requirements.',
                  icon: <Heart className="w-8 h-8" />,
                  color: 'from-cyan-500 to-teal-500'
                }
              ].map((feature, index) => (
                <Card key={index} className=" transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mx-auto mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Tips Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
                {getText('tips')}
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Get the best results from our picture generator with these professional tips and best practices for viral meme creation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
                    Picture Generator Best Practices
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      Use high-resolution images for best picture generator results
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      Clear, well-lit photos work best with our picture generator
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      Experiment with different intensity levels in the picture generator
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      Try various styles to find your perfect picture generator look
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-50 to-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Rocket className="w-6 h-6 mr-2 text-cyan-600" />
                    Viral Content Creation
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      Use trending topics with your picture generator creations
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      Share your picture generator results during peak hours
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      Add relevant hashtags to boost picture generator content reach
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                      Engage with your audience using picture generator memes
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-2xl text-white">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl lg:text-5xl font-bold mb-6">
                Ready to Create Viral Content? 🚀
              </h2>
              <p className="text-xl lg:text-2xl mb-8 text-white/90">
                Join thousands of creators who trust our picture generator for their viral content needs. Start creating amazing Sybau memes today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  size="lg"
                  className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Using Picture Generator
                </Button>
                <Link href={generateLocalizedLink('/gallery', pathname)}>
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 px-8 py-4 text-lg font-semibold"
                  >
                    <Star className="mr-2 h-5 w-5" />
                    {getText('exploreGallery')}
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
