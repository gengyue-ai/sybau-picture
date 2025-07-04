import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined
}

// 检查DATABASE_URL是否有效
const isDatabaseConfigured = () => {
  const dbUrl = process.env.DATABASE_URL
  return dbUrl && dbUrl !== 'postgresql://postgres:password@localhost:5432/sybau_picture'
}

// 创建Prisma客户端，如果数据库未配置则返回null
export const prisma = globalForPrisma.prisma ?? (() => {
  try {
    if (!isDatabaseConfigured()) {
      console.warn('⚠️  数据库未配置，请检查 DATABASE_URL 环境变量')
      return null
    }
    
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })
  } catch (error) {
    console.error('❌ Prisma客户端初始化失败:', error)
    return null
  }
})()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// 数据库连接健康检查
export async function checkDatabaseConnection() {
  try {
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

// 优雅关闭数据库连接
process.on('beforeExit', async () => {
  if (prisma) {
    await prisma.$disconnect()
  }
}) 