/**
 * 模拟服务 - 为开发环境提供各种API的模拟实现
 * 当真实的API配置不可用时，提供功能模拟
 */

import { isMockMode } from './env-manager'

// 由于isMockMode现在是布尔值而不是函数，我们需要创建一个函数版本
function checkMockMode(): boolean {
  return isMockMode;
}

// 模拟用户数据
export const mockUsers = [
  {
    id: 'dev-user-1',
    email: 'test@example.com',
    name: 'Test User',
    image: 'https://ui-avatars.com/api/?name=Test+User&background=667eea&color=fff',
    subscription: 'free',
    monthlyUsage: 0,
    maxUsage: 1,
  },
  {
    id: 'dev-user-2',
    email: 'premium@example.com',
    name: 'Premium User',
    image: 'https://ui-avatars.com/api/?name=Premium+User&background=f093fb&color=fff',
    subscription: 'standard',
    monthlyUsage: 15,
    maxUsage: 50,
  }
]

// 模拟AI图片生成
export async function mockImageGeneration(prompt: string, imageUrl?: string) {
  if (!checkMockMode()) {
    throw new Error('Mock services only available in mock mode')
  }

  console.log('🎭 模拟AI图片生成...')
  console.log('- 输入提示:', prompt)
  console.log('- 有图片输入:', !!imageUrl)

  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 返回模拟的图片URL
  const mockImages = [
    'https://picsum.photos/512/512?random=1',
    'https://picsum.photos/512/512?random=2',
    'https://picsum.photos/512/512?random=3',
    'https://picsum.photos/512/512?random=4',
    'https://picsum.photos/512/512?random=5',
  ]

  const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)]

  return {
    success: true,
    imageUrl: randomImage,
    prompt: prompt,
    model: 'mock-ai-model',
    metadata: {
      mode: imageUrl ? 'image-to-image' : 'text-to-image',
      mockGenerated: true,
      timestamp: new Date().toISOString(),
    }
  }
}

// 模拟Google OAuth认证
export function mockGoogleAuth(email: string) {
  if (!checkMockMode()) {
    throw new Error('Mock services only available in mock mode')
  }

  console.log('🎭 模拟Google OAuth认证...')
  console.log('- 邮箱:', email)

  const mockUser = mockUsers.find(u => u.email === email) || {
    id: 'dev-user-' + Date.now(),
    email: email,
    name: email.split('@')[0],
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=667eea&color=fff`,
    subscription: 'free',
    monthlyUsage: 0,
    maxUsage: 1,
  }

  return {
    user: mockUser,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1小时后过期
  }
}

// 模拟支付处理
export function mockPaymentProcessing(planId: string, userId: string) {
  if (!checkMockMode()) {
    throw new Error('Mock services only available in mock mode')
  }

  console.log('🎭 模拟支付处理...')
  console.log('- 计划ID:', planId)
  console.log('- 用户ID:', userId)

  const plans = {
    'standard': { name: 'Standard', price: 9, features: ['50 images/month', 'High resolution'] },
    'professional': { name: 'Professional', price: 19, features: ['200 images/month', 'Ultra high resolution'] }
  }

  const plan = plans[planId as keyof typeof plans]
  if (!plan) {
    throw new Error('Invalid plan ID')
  }

  return {
    success: true,
    sessionId: 'mock-session-' + Date.now(),
    checkoutUrl: 'https://checkout.stripe.com/mock',
    plan: plan,
    message: '模拟支付 - 在真实环境中这将跳转到Stripe支付页面'
  }
}

// 模拟数据库操作
export class MockDatabase {
  private static data = new Map()

  static async save(collection: string, id: string, data: any) {
    if (!checkMockMode()) {
      throw new Error('Mock services only available in mock mode')
    }

    console.log(`🎭 模拟数据库保存: ${collection}/${id}`)
    const key = `${collection}:${id}`
    this.data.set(key, { ...data, id, createdAt: new Date(), updatedAt: new Date() })
    return { success: true, id }
  }

  static async find(collection: string, query: any = {}) {
    if (!checkMockMode()) {
      throw new Error('Mock services only available in mock mode')
    }

    console.log(`🎭 模拟数据库查询: ${collection}`, query)
    const results: any[] = []
    // 修复迭代器问题
    this.data.forEach((value, key) => {
      if (key.startsWith(`${collection}:`)) {
        results.push(value)
      }
    })
    return results
  }

  static async findById(collection: string, id: string) {
    if (!checkMockMode()) {
      throw new Error('Mock services only available in mock mode')
    }

    const key = `${collection}:${id}`
    return this.data.get(key) || null
  }

  static async update(collection: string, id: string, updates: any) {
    if (!checkMockMode()) {
      throw new Error('Mock services only available in mock mode')
    }

    console.log(`🎭 模拟数据库更新: ${collection}/${id}`)
    const key = `${collection}:${id}`
    const existing = this.data.get(key)
    if (existing) {
      this.data.set(key, { ...existing, ...updates, updatedAt: new Date() })
      return { success: true }
    }
    return { success: false, error: 'Not found' }
  }

  static async delete(collection: string, id: string) {
    if (!checkMockMode()) {
      throw new Error('Mock services only available in mock mode')
    }

    console.log(`🎭 模拟数据库删除: ${collection}/${id}`)
    const key = `${collection}:${id}`
    return this.data.delete(key)
  }

  static clear() {
    this.data.clear()
    console.log('🎭 模拟数据库已清空')
  }

  static getAll() {
    return Object.fromEntries(this.data.entries())
  }
}

// 模拟邮件发送
export function mockEmailSend(to: string, subject: string, content: string) {
  if (!checkMockMode()) {
    throw new Error('Mock services only available in mock mode')
  }

  console.log('🎭 模拟邮件发送...')
  console.log('- 收件人:', to)
  console.log('- 主题:', subject)
  console.log('- 内容长度:', content.length)

  return {
    success: true,
    messageId: 'mock-email-' + Date.now(),
    message: '邮件已模拟发送（真实环境中将使用SMTP服务）'
  }
}

// 模拟文件上传
export async function mockFileUpload(file: File) {
  if (!checkMockMode()) {
    throw new Error('Mock services only available in mock mode')
  }

  console.log('🎭 模拟文件上传...')
  console.log('- 文件名:', file.name)
  console.log('- 文件大小:', file.size)
  console.log('- 文件类型:', file.type)

  // 模拟上传延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 生成模拟URL
  const mockUrl = `https://mock-storage.com/uploads/${Date.now()}-${file.name}`

  return {
    success: true,
    url: mockUrl,
    filename: file.name,
    size: file.size,
    type: file.type
  }
}

// 开发工具：生成模拟数据
export function generateMockData() {
  if (!checkMockMode()) {
    console.warn('generateMockData() should only be used in development')
    return
  }

  console.log('🎭 生成模拟数据...')

  // 生成模拟用户
  mockUsers.forEach((user, index) => {
    MockDatabase.save('users', user.id, user)
  })

  // 生成模拟图片
  for (let i = 1; i <= 10; i++) {
    MockDatabase.save('generated_images', `img-${i}`, {
      userId: mockUsers[Math.floor(Math.random() * mockUsers.length)].id,
      prompt: `Mock prompt ${i}`,
      imageUrl: `https://picsum.photos/512/512?random=${i}`,
      style: ['classic', 'expressive', 'professional'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // 过去一周内
    })
  }

  console.log('✅ 模拟数据生成完成')
}

// 环境切换提醒
export function showEnvironmentReminder() {
  if (checkMockMode()) {
    console.log('\n🎭 当前运行在模拟模式下')
    console.log('━'.repeat(40))
    console.log('📝 模拟功能:')
    console.log('  • Google OAuth → 模拟登录')
    console.log('  • AI 图片生成 → 随机图片')
    console.log('  • 支付处理 → 模拟支付')
    console.log('  • 数据库 → 内存存储')
    console.log('  • 邮件发送 → 控制台输出')
    console.log('\n💡 要启用真实服务，请配置相应的环境变量')
    console.log('━'.repeat(40))
  }
}
