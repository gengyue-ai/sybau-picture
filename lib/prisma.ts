import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined
}

// 检查是否在服务器端运行
const isServerSide = typeof window === 'undefined'

// 检查DATABASE_URL是否有效
const isDatabaseConfigured = () => {
  // 在客户端直接返回false
  if (!isServerSide) return false

  let dbUrl = process.env.DATABASE_URL
  if (!dbUrl) return false

  // 清理换行符和空白字符
  dbUrl = dbUrl.trim().replace(/[\r\n]/g, '')

  // 检查是否是有效的数据库URL
  return dbUrl !== '' &&
         !dbUrl.includes('your-database-url') &&
         (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://'))
}

// 创建Prisma客户端工厂函数
function createPrismaClient() {
  try {
    // 在客户端不初始化Prisma客户端
    if (!isServerSide) {
      return null
    }

    if (!isDatabaseConfigured()) {
      console.warn('⚠️  数据库未配置，请检查 DATABASE_URL 环境变量')
      return null
    }

    // 清理数据库URL中的换行符
    const cleanDbUrl = process.env.DATABASE_URL?.trim().replace(/[\r\n]/g, '')

    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: cleanDbUrl,
        },
      },

    })
  } catch (error) {
    console.error('❌ Prisma客户端初始化失败:', error)
    return null
  }
}

// 使用单例模式，但在serverless环境中为每个实例创建新客户端
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// 只在开发环境中缓存到global
if (process.env.NODE_ENV !== 'production' && isServerSide) {
  globalForPrisma.prisma = prisma
}

// 数据库连接健康检查（仅服务器端）
export async function checkDatabaseConnection() {
  try {
    // 在客户端不执行数据库检查
    if (!isServerSide) {
      return false
    }

    if (!prisma) {
      console.warn('⚠️  数据库客户端未初始化')
      return false
    }

    await prisma.$queryRaw`SELECT 1`
    console.log('✅ 数据库连接正常')
    return true
  } catch (error) {
    console.error('❌ 数据库连接失败:', error)
    return false
  }
}

// 创建安全的数据库操作函数，包含重试逻辑
export async function safeQuery<T>(operation: () => Promise<T>, retries = 2): Promise<T | null> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await operation()
    } catch (error: any) {
      console.error(`数据库操作失败 (尝试 ${i + 1}/${retries + 1}):`, error.message)

      // 如果是prepared statement冲突，等待一小段时间后重试
      if (error.message?.includes('prepared statement') && i < retries) {
        await new Promise(resolve => setTimeout(resolve, 100 + i * 50))
        continue
      }

      if (i === retries) {
        console.error('数据库操作最终失败:', error)
        return null
      }
    }
  }
  return null
}

// 优雅关闭数据库连接（仅服务器端）
if (isServerSide) {
  process.on('beforeExit', async () => {
    if (prisma) {
      await prisma.$disconnect()
    }
  })
}
