import { NextRequest, NextResponse } from 'next/server'
import * as fal from '@fal-ai/serverless-client'

// 配置 Fal AI 客户端
const falKey = process.env.FAL_KEY || '71163de2-482a-46e5-821c-ccef71f7caae:2cec66a501188bdb77c78e85191693ba'
console.log('Using Fal API Key:', falKey.substring(0, 10) + '...')

fal.config({
  credentials: falKey
})

export async function POST(request: NextRequest) {
  try {
    console.log('=== Starting image generation ===')
    const contentType = request.headers.get('content-type')
    console.log('Content-Type:', contentType)

    let prompt = ''
    let imageUrl = ''

    if (contentType?.includes('multipart/form-data')) {
      // 处理文件上传
      const formData = await request.formData()
      const file = formData.get('file') as File
      const promptText = formData.get('prompt') as string

      console.log('File uploaded:', file?.name, file?.size)

      if (file) {
        // 将文件转换为 base64 URL
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')
        imageUrl = `data:${file.type};base64,${base64}`
        console.log('Image converted to base64, length:', base64.length)
      }

      prompt = promptText || 'Transform this image into a Sybau Lazer Dim 700 style meme'
    } else {
      // 处理 JSON 请求
      const body = await request.json()
      prompt = body.prompt || 'Create a Sybau Lazer Dim 700 style image'
      imageUrl = body.image_url || ''
    }

    console.log('Prompt:', prompt)
    console.log('Has image:', !!imageUrl)

    // 选择合适的模型
    let model = 'fal-ai/flux/schnell'
    let input: any = {
      prompt: prompt,
      num_inference_steps: 4,
      guidance_scale: 3.5,
      num_images: 1,
      enable_safety_checker: true
    }

    // 如果有图片URL，使用图片到图片的模型
    if (imageUrl) {
      model = 'fal-ai/flux/dev'
      input = {
        ...input,
        image_url: imageUrl,
        strength: 0.25,
        prompt: `Based on the original image, keep the exact same person, pose, and background. Only enhance and exaggerate the facial expressions and gestures to make them more funny and humorous in Sybau Lazer Dim 700 style. Add subtle glowing eyes effect, slightly distorted facial features for comedic effect, maintain original composition and lighting`,
        num_inference_steps: 12,
        guidance_scale: 8.0
      }
    }

    console.log('Using model:', model)
    console.log('Input parameters:', JSON.stringify({...input, image_url: imageUrl ? '[base64 data]' : undefined}, null, 2))

    // 调用 Fal AI API
    console.log('Calling Fal AI API...')
    const result = await fal.subscribe(model, {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        console.log('Queue update:', update)
      }
    })

    console.log('Fal AI API result:', JSON.stringify(result, null, 2))

    // 类型断言，确保result有正确的结构
    const apiResult = result as { images?: Array<{ url: string }> }

    if (apiResult.images && apiResult.images.length > 0) {
      console.log('✅ Image generated successfully!')
      return NextResponse.json({
        success: true,
        imageUrl: apiResult.images[0].url,
        prompt: prompt,
        model: model
      })
    } else {
      console.log('❌ No images in result:', result)
      throw new Error('No images generated - API returned empty result')
    }

  } catch (error) {
    console.error('❌ Error generating image:', error)

    // 返回详细的错误信息
    let errorMessage = 'Failed to generate image'
    let errorCode = 'GENERATION_ERROR'

    if (error instanceof Error) {
      errorMessage = error.message
      console.error('Error details:', error.stack)

      if (error.message.includes('rate limit')) {
        errorCode = 'RATE_LIMIT_EXCEEDED'
        errorMessage = 'Rate limit exceeded. Please try again later.'
      } else if (error.message.includes('authentication')) {
        errorCode = 'AUTHENTICATION_ERROR'
        errorMessage = 'Authentication failed. Please check API credentials.'
      } else if (error.message.includes('network')) {
        errorCode = 'NETWORK_ERROR'
        errorMessage = 'Network error. Please check your connection.'
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      code: errorCode,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Sybau Picture Generator API',
    version: '1.0.0',
    models: [
      'fal-ai/flux/schnell',
      'fal-ai/flux/dev',
      'fal-ai/fast-sdxl'
    ],
    apiKeyConfigured: !!falKey
  })
}
