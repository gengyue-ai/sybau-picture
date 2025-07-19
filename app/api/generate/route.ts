import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma, safeQuery } from '@/lib/prisma'
import { appConfig, isDevelopment, isMockMode } from '@/lib/env-manager'
import { mockImageGeneration, MockDatabase } from '@/lib/mock-services'

// 配置 Fal AI 客户端的函数
async function configureFalClient() {
  const fal = await import('@fal-ai/serverless-client')
  const falKey = process.env.FAL_KEY

  if (!falKey) {
    throw new Error('FAL_KEY environment variable is required')
  }

  console.log('Using Fal API Key:', falKey.substring(0, 10) + '...')

  fal.config({
    credentials: falKey
  })

  return { fal, falKey }
}

// 简化的用户权限检查函数
async function checkUserPermission(userEmail: string) {
  if (!prisma) {
    throw new Error('Database not configured')
  }

  // 1. 获取用户基本信息
  const user = await safeQuery(async () => {
    return await prisma!.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        email: true,
        name: true,
        planId: true
      }
    });
  });

  if (!user) {
    throw new Error('User not found in database')
  }

  // 2. 获取用户套餐信息
  const userPlan = user.planId ? await safeQuery(async () => {
    return await prisma!.plan.findUnique({
      where: { id: user.planId! },
      select: {
        maxImagesPerMonth: true,
        hasWatermark: true
      }
    });
  }) : null;

  // 3. 获取本月使用情况
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const userUsage = await safeQuery(async () => {
    return await prisma!.userUsage.findUnique({
      where: {
        userId_month_year: {
          userId: user.id,
          month: currentMonth,
          year: currentYear
        }
      },
      select: {
        imagesGenerated: true
      }
    });
  });

  // 4. 计算权限
  const maxImages = userPlan?.maxImagesPerMonth || 1; // 默认免费用户1次
  const currentUsage = userUsage?.imagesGenerated || 0;
  const canGenerate = currentUsage < maxImages;

  console.log(`用户权限检查: ${user.email}, 使用情况: ${currentUsage}/${maxImages}, 可生成: ${canGenerate}`);

  return {
    user,
    canGenerate,
    currentUsage,
    maxUsage: maxImages,
    remainingUsage: Math.max(0, maxImages - currentUsage),
    hasWatermark: userPlan?.hasWatermark || false
  };
}

// 记录用户图片生成
async function recordUserGeneration(userId: string) {
  if (!prisma) return;

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  await safeQuery(async () => {
    return await prisma!.userUsage.upsert({
      where: {
        userId_month_year: {
          userId,
          month: currentMonth,
          year: currentYear
        }
      },
      update: {
        imagesGenerated: {
          increment: 1
        },
        updatedAt: new Date()
      },
      create: {
        userId,
        month: currentMonth,
        year: currentYear,
        imagesGenerated: 1
      }
    });
  });
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

    // 简化的权限检查
    const permission = await checkUserPermission(session.user.email)

    if (!permission.canGenerate) {
      return NextResponse.json({
        success: false,
        error: `Monthly limit exceeded. You have used ${permission.currentUsage}/${permission.maxUsage} images this month.`,
        code: 'QUOTA_EXCEEDED',
        usage: {
          currentUsage: permission.currentUsage,
          maxUsage: permission.maxUsage,
          remainingUsage: permission.remainingUsage,
          canGenerate: false
        }
      }, { status: 429 })
    }

    console.log(`User ${permission.user.email} can generate image. Usage: ${permission.currentUsage}/${permission.maxUsage}`)

    const contentType = request.headers.get('content-type')
    console.log('Content-Type:', contentType)

    let prompt = ''
    let imageUrl = ''
    let mode = 'text-to-image'

    if (contentType?.includes('multipart/form-data')) {
      // 处理文件上传
      const formData = await request.formData()
      const file = formData.get('file') as File
      const promptText = formData.get('prompt') as string
      mode = formData.get('mode') as string || 'text-to-image'

      console.log('Mode:', mode)
      console.log('File uploaded:', file?.name, file?.size)
      console.log('Prompt text:', promptText)

      if (mode === 'image-to-image') {
        if (!file) {
          throw new Error('File is required for image-to-image mode')
        }
        // 将文件转换为 base64 URL
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')
        imageUrl = `data:${file.type};base64,${base64}`
        console.log('Image converted to base64, length:', base64.length)
        prompt = promptText || 'Transform this image into a Sybau style meme'
      } else {
        // text-to-image mode
        prompt = promptText || 'Create a Sybau style image'
        if (!prompt.trim()) {
          throw new Error('Prompt is required for text-to-image mode')
        }
      }
    } else {
      // 处理 JSON 请求
      const body = await request.json()
      prompt = body.prompt || 'Create a Sybau style image'
      imageUrl = body.image_url || ''
      mode = body.mode || 'text-to-image'
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
        prompt: `Based on the original image, keep the exact same person, pose, and background. Only enhance and exaggerate the facial expressions and gestures to make them more funny and humorous in Sybau style. Add subtle glowing eyes effect, slightly distorted facial features for comedic effect, maintain original composition and lighting`,
        num_inference_steps: 12,
        guidance_scale: 8.0
      }
    }

    console.log('Using model:', model)
    console.log('Input parameters:', JSON.stringify({...input, image_url: imageUrl ? '[base64 data]' : undefined}, null, 2))

    let apiResult: { images?: Array<{ url: string }> }

    // 根据配置选择真实API或模拟
    if (isMockMode) {
      console.log('🎭 使用模拟AI服务...')
      const mockResult = await mockImageGeneration(prompt, imageUrl)
      apiResult = {
        images: [{ url: mockResult.imageUrl }]
      }
      console.log('Mock AI result:', mockResult)
    } else {
      console.log('🚀 调用真实Fal AI API...')
      const result = await fal.subscribe(model, {
        input,
        logs: true,
        onQueueUpdate: (update) => {
          console.log('Queue update:', update)
        }
      })

      console.log('Fal AI API result:', JSON.stringify(result, null, 2))
      apiResult = result as { images?: Array<{ url: string }> }
    }

    if (apiResult.images && apiResult.images.length > 0) {
      console.log('✅ Image generated successfully!')

      // 记录用户使用情况
      await recordUserGeneration(permission.user.id)
      console.log(`Recorded image generation for user ${permission.user.email}`)

      // 保存生成的图片到数据库（如果数据库可用）
      if (appConfig.database.url && prisma) {
        try {
          await safeQuery(async () => {
            return await prisma!.generatedImage.create({
              data: {
                userId: permission.user.id,
                originalUrl: imageUrl || apiResult.images![0].url, // 原图或生成图
                processedUrl: apiResult.images![0].url, // 处理后的图片
                thumbnailUrl: apiResult.images![0].url, // 缩略图URL相同
                style: 'classic', // 默认风格
                intensity: 2, // 默认强度
                metadata: JSON.stringify({
                  mode: mode,
                  prompt: prompt,
                  model: model,
                  apiProvider: isMockMode ? 'mock-ai' : 'fal-ai',
                  hasInputImage: !!imageUrl,
                  mockGenerated: isMockMode
                })
              }
            });
          });
          console.log('✅ 图片已保存到数据库')
        } catch (dbError) {
          console.error('❌ 保存图片到数据库失败:', dbError)
          // 不影响主要流程，继续返回结果
        }
      }

      return NextResponse.json({
        success: true,
        imageUrl: apiResult.images[0].url,
        prompt: prompt,
        model: model,
        hasWatermark: permission.hasWatermark,
        usage: {
          current: permission.currentUsage + 1,
          max: permission.maxUsage,
          remaining: permission.remainingUsage - 1
        }
      })
    } else {
      throw new Error('No images generated from API')
    }

  } catch (error: any) {
    console.error('Image generation failed:', error)

    // 区分不同类型的错误
    if (error.message?.includes('Authentication required')) {
      return NextResponse.json({
        success: false,
        error: 'Please sign in to generate images',
        code: 'UNAUTHORIZED'
      }, { status: 401 })
    }

    if (error.message?.includes('User not found')) {
      return NextResponse.json({
        success: false,
        error: 'User account not found. Please try signing in again.',
        code: 'USER_NOT_FOUND'
      }, { status: 404 })
    }

    if (error.message?.includes('Monthly limit exceeded')) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: 'QUOTA_EXCEEDED'
      }, { status: 429 })
    }

    return NextResponse.json({
      success: false,
      error: isDevelopment ? error.message : 'Image generation failed. Please try again.',
      code: 'GENERATION_FAILED'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Image generation endpoint. Use POST method.',
    supportedMethods: ['POST'],
    requirements: {
      authentication: 'Required - Google OAuth',
      contentType: 'application/json or multipart/form-data',
      fields: {
        prompt: 'string (required)',
        mode: 'text-to-image or image-to-image',
        file: 'File (required for image-to-image mode)'
      }
    }
  })
}
