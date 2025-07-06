import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import {
  getCurrentUserWithSubscription,
  canUserGenerateImage,
  recordImageGeneration,
  getUserPlanFeatures
} from '@/lib/subscription'

// 配置 Fal AI 客户端的函数
async function configureFalClient() {
  const fal = await import('@fal-ai/serverless-client')
  const falKey = process.env.FAL_KEY || '71163de2-482a-46e5-821c-ccef71f7caae:2cec66a501188bdb77c78e85191693ba'
  console.log('Using Fal API Key:', falKey.substring(0, 10) + '...')

  fal.config({
    credentials: falKey
  })

  return { fal, falKey }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Starting image generation ===')

    // 配置 Fal AI 客户端
    const { fal } = await configureFalClient()

    // 检查用户认证
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required. Please sign in to generate images.',
        code: 'UNAUTHORIZED'
      }, { status: 401 })
    }

    // 获取用户信息
    const user = await getCurrentUserWithSubscription()
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      }, { status: 404 })
    }

    // 检查用户是否可以生成图片
    const usageCheck = await canUserGenerateImage(user.id)
    if (!usageCheck.canGenerate) {
      return NextResponse.json({
        success: false,
        error: `Monthly limit exceeded. You have used ${usageCheck.currentUsage}/${usageCheck.maxUsage} images this month.`,
        code: 'QUOTA_EXCEEDED',
        usage: usageCheck
      }, { status: 429 })
    }

    console.log(`User ${user.email} can generate image. Usage: ${usageCheck.currentUsage}/${usageCheck.maxUsage}`)

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

      // 记录用户使用情况
      await recordImageGeneration(user.id)
      console.log(`Recorded image generation for user ${user.email}`)

      // 获取用户套餐特性以确定是否应该有水印
      const planFeatures = await getUserPlanFeatures(user.id)

      return NextResponse.json({
        success: true,
        imageUrl: apiResult.images[0].url,
        prompt: prompt,
        model: model,
        hasWatermark: planFeatures.hasWatermark,
        usage: {
          current: usageCheck.currentUsage + 1,
          max: usageCheck.maxUsage,
          remaining: usageCheck.remainingUsage - 1
        }
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
  const { falKey } = await configureFalClient()

  return NextResponse.json({
    status: 'OK',
    message: 'Fal AI Generate API is running',
    keyConfigured: !!falKey
  })
}
