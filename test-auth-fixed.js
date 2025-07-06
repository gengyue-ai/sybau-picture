const { PrismaClient } = require('@prisma/client')

async function testAuthComponents() {
  console.log('🔍 开始测试认证组件...')

  // 测试环境变量
  console.log('\n📋 检查环境变量:')
  const requiredEnvs = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ]

  for (const env of requiredEnvs) {
    const value = process.env[env]
    if (value) {
      console.log(`✅ ${env}: ${env.includes('SECRET') || env.includes('PASSWORD') ? '***hidden***' : value.substring(0, 30)}...`)
    } else {
      console.log(`❌ ${env}: 未设置`)
    }
  }

  // 测试数据库连接
  console.log('\n🗄️ 测试数据库连接:')
  let prisma
  try {
    prisma = new PrismaClient()
    await prisma.$connect()
    console.log('✅ 数据库连接成功')

    // 检查用户表结构
    console.log('\n📊 检查数据库表结构:')
    try {
      const result = await prisma.$queryRaw`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `
      console.log('✅ 用户表字段:', result.map(r => `${r.column_name}(${r.data_type})`).join(', '))
    } catch (error) {
      console.log('❌ 无法获取表结构:', error.message)
    }

    // 测试查询
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ 用户表查询成功，当前用户数: ${userCount}`)
    } catch (error) {
      console.log('❌ 用户表查询失败:', error.message)
    }

  } catch (error) {
    console.log('❌ 数据库连接失败:', error.message)
  } finally {
    if (prisma) {
      await prisma.$disconnect()
    }
  }

  // 测试API端点
  console.log('\n🌐 测试API端点:')
  try {
    const response = await fetch('http://localhost:3001/api/auth/providers')
    if (response.ok) {
      const providers = await response.json()
      console.log('✅ NextAuth providers API正常:', Object.keys(providers))
    } else {
      console.log('❌ NextAuth providers API失败:', response.status)
    }
  } catch (error) {
    console.log('❌ 无法连接到开发服务器:', error.message)
    console.log('   请确保运行了 npm run dev')
  }

  console.log('\n🎯 测试完成！')
}

// 加载环境变量
require('dotenv').config({ path: '.env.local' })

testAuthComponents().catch(console.error)
