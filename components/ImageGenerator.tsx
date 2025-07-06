'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Download, Wand2, Sparkles, Loader2, AlertCircle, CheckCircle, X, Type, Image as ImageIcon, LogIn, UserPlus, Crown, Star, Lock, User } from 'lucide-react'
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 保存用户输入数据到localStorage
  const saveUserInput = () => {
    const inputData = {
      textPrompt,
      selectedMode,
      intensity,
      generationMode,
      timestamp: Date.now()
    }
    localStorage.setItem('sybau_user_input', JSON.stringify(inputData))
  }

  // 从localStorage恢复用户输入数据
  const restoreUserInput = () => {
    try {
      const savedData = localStorage.getItem('sybau_user_input')
      if (savedData) {
        const inputData = JSON.parse(savedData)
        // 检查数据是否过期（1小时内有效）
        if (Date.now() - inputData.timestamp < 60 * 60 * 1000) {
          setTextPrompt(inputData.textPrompt || '')
          setSelectedMode(inputData.selectedMode || 'classic')
          setIntensity(inputData.intensity || 3)
          setGenerationMode(inputData.generationMode || 'text-to-image')
          // 清除保存的数据
          localStorage.removeItem('sybau_user_input')
        }
      }
    } catch (error) {
      console.error('Failed to restore user input:', error)
    }
  }

  // 在组件加载时恢复用户输入
  useEffect(() => {
    restoreUserInput()
  }, [])

  // 清理预览URL以防止内存泄漏
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

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

  // 根据用户套餐定义可用模式 - 只保留3种基础模式
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
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
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

    // 创建预览URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
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
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleModeSwitch = (mode: 'text-to-image' | 'image-to-image') => {
    setGenerationMode(mode)
    setError(null)
    // 重置相关状态
    if (mode === 'text-to-image') {
      setFile(null)
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } else {
      setTextPrompt('')
    }
  }

  const handleGenerate = async () => {
    // 验证输入
    if (generationMode === 'text-to-image') {
      if (!textPrompt.trim()) {
        setError('Please enter a text prompt to generate an image')
        return
      }
    } else {
      if (!file) {
        setError('Please upload an image for image-to-image generation')
        return
      }
    }

    // 检查用户是否已登录 - 在用户真正要使用功能时才提示
    if (!session) {
      // 保存用户输入数据
      saveUserInput()
      setError('请先登录账户才能使用AI功能')
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const formData = new FormData()

      if (generationMode === 'text-to-image') {
        formData.append('prompt', textPrompt)
        formData.append('generationMode', 'text-to-image')
      } else {
        if (file) {
          formData.append('file', file)
        }
        formData.append('prompt', prompt || 'Apply Sybau style transformation')
        formData.append('generationMode', 'image-to-image')
      }

      formData.append('mode', selectedMode)
      formData.append('intensity', intensity.toString())

      console.log('Sending request to /api/generate with:', {
        generationMode,
        hasFile: !!file,
        textPrompt: generationMode === 'text-to-image' ? textPrompt : '',
        prompt: generationMode === 'image-to-image' ? (prompt || 'Apply Sybau style transformation') : '',
        mode: selectedMode,
        intensity: intensity
      })

      // 添加超时控制
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60秒超时

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('API response:', result)

      if (result.success) {
        setGeneratedImage(result.imageUrl)
      } else {
        setError(result.error || texts.error)
      }
    } catch (err) {
      console.error('Generation error:', err)

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timeout, please try again')
        } else if (err.message.includes('fetch')) {
          setError('Network connection failed, please check your connection and try again')
        } else {
          setError(err.message || texts.error)
        }
      } else {
        setError(texts.error)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = `sybau-creation-${Date.now()}.png`
      link.click()
    }
  }

  const resetGenerator = () => {
    setFile(null)
    setPrompt('')
    setTextPrompt('')
    setGeneratedImage(null)
    setError(null)
    setIsGenerating(false)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const canGenerate = generationMode === 'text-to-image' ? textPrompt.trim() : file

  // 如果正在加载会话，显示加载状态
  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              <span className="text-lg text-gray-600">加载中...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 未登录用户显示登录提示，但仍显示完整界面
  const showLoginPrompt = !session

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      {/* Upload/Input Section */}
      <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            {generationMode === 'text-to-image' ? (
              <Type className="h-12 w-12 text-purple-600" />
            ) : (
              <Upload className="h-12 w-12 text-purple-600" />
            )}
          </div>
          <CardTitle className="text-2xl text-purple-800">{texts.uploadTitle}</CardTitle>
          <CardDescription className="text-gray-600">
            {texts.uploadDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Generation Mode</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={generationMode === 'text-to-image' ? "default" : "outline"}
                className={`p-3 h-auto border-2 transition-all ${
                  generationMode === 'text-to-image'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent'
                    : 'border-purple-200 bg-white text-gray-700'
                }`}
                onClick={() => handleModeSwitch('text-to-image')}
              >
                <div className="flex items-center space-x-2">
                  <Type className="w-4 h-4" />
                  <span className="text-sm font-medium">{texts.textToImageMode || 'Text to Image'}</span>
                </div>
              </Button>
              <Button
                variant={generationMode === 'image-to-image' ? "default" : "outline"}
                className={`p-3 h-auto border-2 transition-all ${
                  generationMode === 'image-to-image'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent'
                    : 'border-purple-200 bg-white text-gray-700'
                }`}
                onClick={() => handleModeSwitch('image-to-image')}
              >
                <div className="flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{texts.imageToImageMode || 'Image to Image'}</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Conditional Input Based on Mode */}
          {generationMode === 'text-to-image' ? (
            /* Text Input for Text-to-Image */
            <div className="space-y-2">
              <Label htmlFor="textPrompt" className="text-sm font-medium text-gray-700">
                {texts.textPromptLabel || 'Text Prompt'}
              </Label>
              <Textarea
                id="textPrompt"
                placeholder={texts.textPromptPlaceholder || 'Describe what you want to create...'}
                value={textPrompt}
                onChange={(e) => setTextPrompt(e.target.value)}
                className="w-full min-h-[120px] resize-none"
                rows={5}
              />
              <p className="text-xs text-gray-500">
                Be specific about what you want to create. Include style, colors, mood, and any details.
              </p>
            </div>
          ) : (
            /* File Upload for Image-to-Image */
            <>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center bg-white/50 transition-colors cursor-pointer ${
                  isDragging ? 'border-purple-400 bg-purple-50' : 'border-purple-200'
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
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg shadow-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            resetGenerator()
                          }}
                          className="bg-white/80 backdrop-blur-sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-700">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-16 w-16 text-purple-400 mx-auto" />
                    <p className="text-lg font-medium text-gray-700">{texts.dragAndDrop}</p>
                    <p className="text-sm text-gray-500">{texts.clickToBrowse}</p>
                    <p className="text-xs text-gray-400">
                      {texts.supportedFormats} • {texts.maxFileSize}
                    </p>
                  </div>
                )}
              </div>

              {/* Style Prompt for Image-to-Image */}
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-sm font-medium text-gray-700">
                  {texts.promptLabel}
                </Label>
                <Input
                  id="prompt"
                  type="text"
                  placeholder={texts.promptPlaceholder}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full"
                />
              </div>
            </>
          )}

          {/* Error Display - 优化的友好提示 */}
          {error && (
            <div className={`p-4 rounded-xl border ${
              error.includes('请先登录')
                ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'
                : 'bg-red-50 border-red-200'
            }`}>
              {error.includes('请先登录') ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">🎨 开始您的创作之旅！</div>
                      <div className="text-sm text-gray-600">
                        您的输入已安全保存，登录后将自动恢复 ✨
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/auth/signin" className="flex-1">
                      <Button size="sm" variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                        🚀 立即登录
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="flex-1">
                      <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg">
                        ✨ 免费注册
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings & Results Section */}
      <Card className="p-8 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-100">
        <CardHeader className="text-center">
          <Wand2 className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
          <CardTitle className="text-2xl text-cyan-800">{texts.settingsTitle}</CardTitle>
          <CardDescription className="text-gray-600">
            {texts.settingsDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Plan and Usage Info - 简化显示 */}
          {session && userPlan && usage && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {userPlan.name === 'pro' ? (
                    <Crown className="w-4 h-4 text-amber-500" />
                  ) : userPlan.name === 'standard' ? (
                    <Star className="w-4 h-4 text-blue-500" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-purple-500" />
                  )}
                  <span className="font-medium text-gray-800 capitalize">{userPlan.name} Plan</span>
                </div>
                <Link href="/pricing" className="text-xs text-purple-600 hover:underline">
                  升级套餐
                </Link>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>本月使用量: {usage.current}/{usage.max}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  usage.remaining > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  剩余 {usage.remaining} 张
                </span>
              </div>
            </div>
          )}

          {/* Mode Selection - 简洁的风格选择 */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              {texts.modeLabel || 'Style Mode'}
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {/* 显示所有模式 */}
              {allModes.map((mode) => {
                const Icon = mode.icon
                const isAvailable = availableModes.includes(mode)
                const isFree = mode.requiredPlan === 'free'
                return (
                  <Button
                    key={mode.id}
                    variant={selectedMode === mode.id ? "default" : "outline"}
                    className={`p-4 h-auto border-2 transition-all ${
                      selectedMode === mode.id
                        ? `bg-gradient-to-r ${mode.color} text-white border-transparent shadow-lg`
                        : 'border-cyan-200 bg-white text-gray-700 hover:border-cyan-300'
                    }`}
                    onClick={() => setSelectedMode(mode.id)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <Icon className="w-5 h-5" />
                      <div className="text-left flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{mode.name}</span>
                          {isFree && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                              免费
                            </span>
                          )}
                        </div>
                        <div className={`text-xs ${selectedMode === mode.id ? 'text-white/80' : 'text-gray-500'}`}>
                          {mode.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Intensity Slider - 移除限制提示 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-gray-700">
                {texts.intensityLabel || 'Intensity Level'} ({intensity}/5)
              </Label>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="5"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((intensity - 1) / 4) * 100}%, #e5e7eb ${((intensity - 1) / 4) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>轻微</span>
                <span>中等</span>
                <span>强烈</span>
                <span>很强</span>
                <span>极强</span>
              </div>
            </div>
          </div>

          {/* Generate Button - 醒目的免费体验按钮 */}
          <div className="space-y-2">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-2xl hover:scale-105 transform relative overflow-hidden"
            >
              {/* 闪烁效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />

              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  {texts.generating}
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 mr-2 animate-bounce" />
                  {session ? texts.generateButton : '🎨 免费体验AI创作'}
                </>
              )}
            </Button>

            {/* 未登录用户的引导提示 */}
            {!session && (
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center space-x-1 text-sm text-purple-600">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">每月1张免费图片</span>
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-500">
                  体验后可升级获得更多功能
                </p>
              </div>
            )}
          </div>

          {/* Generated Image Display */}
          {generatedImage && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                <img
                  src={generatedImage}
                  alt="Generated Sybau creation"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Badge className={`bg-gradient-to-r ${allModes.find(m => m.id === selectedMode)?.color} text-white`}>
                      {allModes.find(m => m.id === selectedMode)?.name}
                    </Badge>
                    <Badge variant="outline">
                      {generationMode === 'text-to-image' ? 'Text→Image' : 'Image→Image'}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">Intensity: {intensity}/5</span>
                </div>
              </div>
              <Button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 text-lg font-semibold rounded-xl transition-all"
              >
                <Download className="w-5 h-5 mr-2" />
                {texts.downloadButton}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
