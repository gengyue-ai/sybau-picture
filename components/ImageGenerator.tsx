'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Upload, Download, Wand2, Sparkles, Loader2, AlertCircle, CheckCircle, X, Type, Image as ImageIcon } from 'lucide-react'

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
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 清理预览URL以防止内存泄漏
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const modes = [
    {
      id: 'classic',
      name: texts.classicMode || 'Classic Sybau',
      description: texts.classicDescription || 'Traditional Sybau style with balanced aesthetics',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'exaggerated',
      name: texts.exaggeratedMode || 'Expressive Sybau',
      description: texts.exaggeratedDescription || 'Bold expressions that capture Gen Z energy',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'professional',
      name: texts.professionalMode || 'Professional Sybau',
      description: texts.professionalDescription || 'Refined Sybau style for professional use',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'creative',
      name: texts.creativeMode || 'Creative Sybau',
      description: texts.creativeDescription || 'Artistic interpretation with unique creativity',
      color: 'from-green-500 to-emerald-500'
    }
  ]

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

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
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
          {/* Mode Selection */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-3">
              {texts.modeLabel || 'Style Mode'}
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {modes.map((mode) => (
                <Button
                  key={mode.id}
                  variant={selectedMode === mode.id ? "default" : "outline"}
                  className={`p-4 h-auto border-2 transition-all ${
                    selectedMode === mode.id
                      ? `bg-gradient-to-r ${mode.color} text-white border-transparent shadow-lg`
                      : 'border-cyan-200 bg-white text-gray-700'
                  }`}
                  onClick={() => setSelectedMode(mode.id)}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium">{mode.name}</div>
                    <div className={`text-xs ${selectedMode === mode.id ? 'text-white/80' : 'text-gray-500'}`}>
                      {mode.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Intensity Slider */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              {texts.intensityLabel || 'Intensity Level'} ({intensity}/5)
            </Label>
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
                <span>Subtle</span>
                <span>Medium</span>
                <span>Strong</span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !canGenerate}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 text-lg font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {texts.generating}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                {texts.generateButton}
              </>
            )}
          </Button>

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
                    <Badge className={`bg-gradient-to-r ${modes.find(m => m.id === selectedMode)?.color} text-white`}>
                      {modes.find(m => m.id === selectedMode)?.name}
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
