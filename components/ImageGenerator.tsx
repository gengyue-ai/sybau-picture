'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Download, Wand2, Sparkles, Loader2, AlertCircle, CheckCircle, X, Type, Image as ImageIcon, LogIn, Crown, Star, Lock, User, RotateCcw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface ImageGeneratorProps {
  texts: {
    uploadTitle: string
    uploadDescription: string
    uploadPlaceholder: string
    settingsTitle: string
    settingsDescription: string
    styleLabel: string
    styleOption: string
    styleDescription: string
    promptLabel: string
    promptPlaceholder: string
    generateButton: string
    downloadButton: string
    generating: string
    success: string
    error: string
    maxFileSize: string
    supportedFormats: string
    dragAndDrop: string
    clickToBrowse: string
    intensityLabel?: string
    modeLabel?: string
    classicMode?: string
    exaggeratedMode?: string
    professionalMode?: string
    creativeMode?: string
    classicDescription?: string
    exaggeratedDescription?: string
    professionalDescription?: string
    creativeDescription?: string
    textToImageMode?: string
    imageToImageMode?: string
    textPromptLabel?: string
    textPromptPlaceholder?: string
    // 新增的翻译文本
    creationPreparation?: string
    creationPreparationDesc?: string
    creationMode?: string
    textCreation?: string
    imageCreation?: string
    sybaustyle?: string
    textDescription?: string
    imageUpload?: string
    detailedDescription?: string
    detailedDescriptionHelp?: string
    loading?: string
    // 右侧结果展示区域翻译文本
    creationResult?: string
    creationResultDesc?: string
    aiCreating?: string
    pleaseWait?: string
    downloadImage?: string
    recreate?: string
    creationComplete?: string
    readyToCreate?: string
    readyToCreateDesc?: string
    waitingForCommand?: string
    // 上传区域翻译文本
    dragImageHere?: string
    orClickToSelect?: string
    supportFormats?: string
    optionalStyleChange?: string
    loginToStart?: string
    startAiCreation?: string
    aiCreatingNow?: string
  }
}

export default function ImageGenerator({ texts }: ImageGeneratorProps) {
  const { data: session, status } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState('')
  const [textPrompt, setTextPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedMode, setSelectedMode] = useState('classic')
  const [intensity, setIntensity] = useState(3)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [generationMode, setGenerationMode] = useState<'text-to-image' | 'image-to-image'>('text-to-image')
  const [userPlan, setUserPlan] = useState<{name: string, hasWatermark: boolean} | null>(null)
  const [usage, setUsage] = useState<{current: number, max: number, remaining: number} | null>(null)
  const [forceRender, setForceRender] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 获取用户套餐信息
  useEffect(() => {
    const fetchUserPlan = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/subscription')
          if (response.ok) {
            const data = await response.json()
            setUserPlan(data.user.plan)
            setUsage(data.usage)
          }
        } catch (error) {
          console.error('Failed to fetch user plan:', error)
        }
      }
    }
    fetchUserPlan()
  }, [session])

  // 持久化文件状态，避免登录后丢失
  useEffect(() => {
    if (status === 'authenticated' && file && !previewUrl) {
      // 重新创建预览URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }, [status, file, previewUrl])

  // 在登录状态变化时保持文件状态
  useEffect(() => {
    // 当从未认证变为已认证时，保持当前的文件状态
    if (status === 'authenticated' && previewUrl && file) {
      console.log('用户登录完成，保持文件状态:', file.name)
    }
  }, [status, file, previewUrl])

  // 防止无限加载的超时机制
  useEffect(() => {
    const timer = setTimeout(() => {
      if (status === 'loading') {
        console.log('Session loading timeout, forcing render')
        setForceRender(true)
      }
    }, 1000) // 缩短到1秒超时

    return () => clearTimeout(timer)
  }, [status])

  // 检查是否为开发模式
  const isDevelopmentMode = () => {
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    }
    return false
  }

  // 三种创作模式
  const allModes = [
    {
      id: 'classic',
      name: texts.classicMode || 'Classic Sybau',
      description: texts.classicDescription || 'Traditional Sybau style with balanced aesthetics',
      color: 'from-purple-500 to-pink-500',
      requiredPlan: 'free',
      icon: Sparkles
    },
    {
      id: 'exaggerated',
      name: texts.exaggeratedMode || 'Expressive Sybau',
      description: texts.exaggeratedDescription || 'Bold expressions that capture Gen Z energy',
      color: 'from-red-500 to-orange-500',
      requiredPlan: 'standard',
      icon: Star
    },
    {
      id: 'professional',
      name: texts.professionalMode || 'Professional Sybau',
      description: texts.professionalDescription || 'Refined Sybau style for professional use',
      color: 'from-blue-500 to-cyan-500',
      requiredPlan: 'standard',
      icon: Star
    }
  ]

  // 根据用户套餐过滤可用模式
  const getAvailableModes = () => {
    if (!userPlan) return allModes.filter(mode => mode.requiredPlan === 'free')
    const planHierarchy = { 'free': 0, 'standard': 1, 'pro': 2 }
    const userPlanLevel = planHierarchy[userPlan.name as keyof typeof planHierarchy] || 0
    return allModes.filter(mode => {
      const requiredLevel = planHierarchy[mode.requiredPlan as keyof typeof planHierarchy]
      return userPlanLevel >= requiredLevel
    })
  }

  const availableModes = getAvailableModes()
  const lockedModes = allModes.filter(mode => !availableModes.includes(mode))

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please select a JPG, PNG, or WebP image')
      return
    }
    setFile(selectedFile)
    setError(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) handleFileSelect(droppedFile)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) handleFileSelect(selectedFile)
  }

  const handleModeSwitch = (mode: 'text-to-image' | 'image-to-image') => {
    setGenerationMode(mode)
    setError(null)
    if (mode === 'text-to-image') {
      setFile(null)
      setPrompt('')
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }
    } else {
      setTextPrompt('')
    }
  }

  const handleGenerate = async () => {
    if (!session) {
      setError('请先登录使用Google账户开始创作')
      return
    }

    if (!usage || usage.remaining <= 0) {
      setError('Generation limit reached. Please upgrade your plan to continue.')
      return
    }

    if (generationMode === 'text-to-image') {
      if (!textPrompt.trim()) {
        setError('Please enter a text prompt')
        return
      }
    } else {
      if (!file) {
        setError('Please select an image file')
        return
      }
    }

    setIsGenerating(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('mode', generationMode)

      if (generationMode === 'text-to-image') {
        formData.append('prompt', textPrompt)
      } else {
        formData.append('file', file!)
        formData.append('prompt', prompt)
      }

      formData.append('style', selectedMode)
      formData.append('intensity', intensity.toString())

      console.log('Sending request to /api/generate')
      console.log('Form data:', {
        mode: generationMode,
        prompt: generationMode === 'text-to-image' ? textPrompt : prompt,
        hasFile: generationMode === 'image-to-image' ? !!file : false,
        style: selectedMode,
        intensity: intensity.toString()
      })

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok) {
        setGeneratedImage(data.imageUrl)
        setError(null)
        const usageResponse = await fetch('/api/subscription')
        if (usageResponse.ok) {
          const usageData = await usageResponse.json()
          setUsage(usageData.usage)
        }
      } else {
        console.error('API Error:', data)
        setError(data.error || data.details || 'Failed to generate image')
      }
    } catch (error) {
      console.error('Generation error:', error)
      setError('Generation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `sybau-generated-${Date.now()}.png`
      link.click()
    }
  }

  const resetGenerator = () => {
    setFile(null)
    setPrompt('')
    setTextPrompt('')
    setGeneratedImage(null)
    setError(null)
    setSelectedMode('classic')
    setIntensity(3)
    setGenerationMode('text-to-image')
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  // 加载状态 - 带超时保护和开发模式检查
  if (status === 'loading' && !forceRender && !isDevelopmentMode()) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span className="text-lg text-gray-600">{texts.loading || 'Loading...'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 左侧：创作准备区 */}
      <Card className="p-4 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/50 border border-purple-200/60 backdrop-blur-sm shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="text-center pb-3">
          <div className="relative mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
          </div>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
            {texts.creationPreparation || '🎨 Creation Setup'}
          </CardTitle>
          <CardDescription className="text-xs text-gray-600">
            {texts.creationPreparationDesc || 'Choose your creation method, set the style, and start your AI creative journey'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* 创作模式选择 */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center">
              <Type className="w-3 h-3 mr-1" />
              {texts.creationMode || 'Creation Mode'}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={generationMode === 'text-to-image' ? "default" : "outline"}
                className={`p-2 h-auto border transition-all rounded-lg ${
                  generationMode === 'text-to-image'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-md'
                    : 'border-purple-200 bg-white/80 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                }`}
                onClick={() => handleModeSwitch('text-to-image')}
              >
                <div className="flex items-center space-x-2">
                  <Type className="w-3 h-3" />
                  <span className="text-xs font-medium">{texts.textCreation || 'Text Creation'}</span>
                </div>
              </Button>
              <Button
                variant={generationMode === 'image-to-image' ? "default" : "outline"}
                className={`p-2 h-auto border transition-all rounded-lg ${
                  generationMode === 'image-to-image'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-md'
                    : 'border-purple-200 bg-white/80 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                }`}
                onClick={() => handleModeSwitch('image-to-image')}
              >
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-3 h-3" />
                  <span className="text-xs font-medium">{texts.imageCreation || 'Image Creation'}</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Sybau风格选择 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center">
                <Crown className="w-3 h-3 mr-1" />
                {texts.sybaustyle || 'Sybau Style'}
              </Label>
              {userPlan && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200">
                  {userPlan.name.toUpperCase()}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {availableModes.map((mode) => {
                const IconComponent = mode.icon
                return (
                  <Button
                    key={mode.id}
                    variant={selectedMode === mode.id ? "default" : "outline"}
                    className={`p-2 h-auto text-center border transition-all rounded-lg ${
                      selectedMode === mode.id
                        ? `bg-gradient-to-r ${mode.color} text-white border-transparent shadow-md`
                        : 'border-purple-200 bg-white/80 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                        selectedMode === mode.id ? 'bg-white/20' : 'bg-purple-100'
                      }`}>
                        <IconComponent className={`w-3 h-3 ${
                          selectedMode === mode.id ? 'text-white' : 'text-purple-600'
                        }`} />
                      </div>
                      <span className="text-xs font-medium leading-tight">{mode.name.replace('Sybau', '').trim()}</span>
                    </div>
                  </Button>
                )
              })}
              {/* 锁定的模式 */}
              {!session && lockedModes.map((mode) => {
                const IconComponent = mode.icon
                return (
                  <Button
                    key={mode.id}
                    variant="outline"
                    disabled
                    className="p-2 h-auto text-center border border-purple-200 bg-gray-50 text-gray-400 rounded-lg opacity-60"
                  >
                    <div className="flex flex-col items-center space-y-1 relative">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center bg-gray-100">
                        <IconComponent className="w-3 h-3 text-gray-400" />
                      </div>
                      <span className="text-xs font-medium leading-tight">{mode.name.replace('Sybau', '').trim()}</span>
                      <Lock className="w-2 h-2 absolute top-0 right-0 text-gray-400" />
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* 输入区域 */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center">
              <Upload className="w-3 h-3 mr-1" />
              {generationMode === 'text-to-image' ? (texts.textDescription || 'Text Description') : (texts.imageUpload || 'Image Upload')}
            </Label>

            {generationMode === 'text-to-image' ? (
              <div className="space-y-1">
                <Textarea
                  id="textPrompt"
                  placeholder={texts.detailedDescription || "Describe the image you want to create, including style, colors, mood and details..."}
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  className="w-full min-h-[60px] resize-none border-purple-200 rounded-lg focus:border-purple-400 focus:ring-purple-400 text-sm"
                  rows={2}
                />
                <p className="text-xs text-gray-500 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {texts.detailedDescriptionHelp || 'Detailed descriptions help AI generate better creations'}
                </p>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-xl p-4 text-center bg-white/60 backdrop-blur-sm transition-all cursor-pointer group ${
                  isDragging ? 'border-purple-400 bg-purple-50 scale-105' : 'border-purple-200 hover:border-purple-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {file && previewUrl ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-24 object-cover rounded-lg shadow-md"
                      />
                      <div className="absolute top-1 right-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            resetGenerator()
                          }}
                          className="h-6 w-6 p-0 bg-white/90 backdrop-blur-sm border-gray-300 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 py-4">
                    <div className="relative">
                      <Upload className="h-8 w-8 text-purple-400 mx-auto group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">{texts.dragImageHere}</p>
                      <p className="text-xs text-gray-500">{texts.orClickToSelect}</p>
                      <p className="text-xs text-gray-400 flex items-center justify-center">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        {texts.supportFormats}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 图片模式的风格增强输入 */}
            {generationMode === 'image-to-image' && (
              <div className="space-y-1">
                <Input
                  id="prompt"
                  type="text"
                  placeholder={texts.optionalStyleChange}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full border-purple-200 rounded-lg focus:border-purple-400 text-sm h-8"
                />
              </div>
            )}
          </div>



          {/* 错误提示 */}
          {error && !error.includes('请先登录') && (
            <div className="p-3 rounded-xl border-2 bg-red-50 border-red-200">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* 生成按钮 */}
          <div className="pt-2">
            {!session ? (
              <Link href="/auth/signin" className="block">
                <Button className="w-full h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-sm">
                  <div className="flex items-center space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>🚀 {texts.loginToStart}</span>
                  </div>
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={
                  isGenerating ||
                  (generationMode === 'text-to-image' && !textPrompt.trim()) ||
                  (generationMode === 'image-to-image' && !file)
                }
                className="w-full h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{texts.aiCreatingNow}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>🚀 {texts.startAiCreation}</span>
                  </div>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 右侧：结果展示区 */}
      <Card className="p-6 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 border border-purple-200/60 backdrop-blur-sm shadow-xl rounded-2xl">
        <CardHeader className="text-center pb-4">
          <div className="relative mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-pink-700 to-purple-600 bg-clip-text text-transparent">
            ✨ {texts.creationResult}
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            {texts.creationResultDesc}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-semibold text-gray-700">{texts.aiCreating}</p>
                <p className="text-sm text-gray-500">{texts.pleaseWait}</p>
                <div className="w-48 bg-purple-100 rounded-full h-2 mx-auto">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          ) : generatedImage ? (
            <div className="space-y-4">
              <div className="relative group">
                <img
                  src={generatedImage}
                  alt="AI Generated"
                  className="w-full h-auto rounded-2xl shadow-2xl group-hover:shadow-3xl transition-shadow duration-300 border border-purple-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-11"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {texts.downloadImage}
                </Button>
                <Button
                  onClick={resetGenerator}
                  variant="outline"
                  className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50 rounded-xl h-11"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {texts.recreate}
                </Button>
              </div>
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">🎉 {texts.creationComplete}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-purple-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-semibold text-gray-700">{texts.readyToCreate}</p>
                <p className="text-sm text-gray-500">{texts.readyToCreateDesc}</p>
              </div>
              <div className="w-full max-w-xs">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-full p-1">
                  <div className="bg-white rounded-full py-2 px-4 text-center">
                    <span className="text-sm font-medium text-gray-600">{texts.waitingForCommand}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
