require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

async function debugSignup() {
  console.log('🔍 调试注册过程...')

  const prisma = new PrismaClient()

  try {
    await prisma.$connect()
    console.log('✅ 数据库连接成功')

    // 1. 检查Plan表
    console.log('\n📋 检查Plan表...')
    try {
      const plans = await prisma.plan.findMany()
      console.log(`✅ 找到 ${plans.length} 个套餐:`)
      plans.forEach(plan => {
        console.log(`   - ${plan.name}: ${plan.displayName}`)
      })

      // 检查是否有免费套餐
      const freePlan = await prisma.plan.findUnique({
        where: { name: 'free' }
      })

      if (freePlan) {
        console.log('✅ 免费套餐存在:', freePlan.displayName)
      } else {
        console.log('❌ 免费套餐不存在，需要创建')

        // 创建免费套餐
        const newFreePlan = await prisma.plan.create({
          data: {
            name: 'free',
            displayName: 'Free',
            description: '免费套餐',
            price: 0,
            yearlyPrice: 0,
            maxImagesPerMonth: 10,
            maxResolution: '512x512',
            hasWatermark: true,
            hasPriorityProcessing: false,
            hasBatchProcessing: false,
            hasAdvancedFeatures: false,
            availableStyles: JSON.stringify(['classic'])
          }
        })
        console.log('✅ 创建免费套餐成功:', newFreePlan.id)
      }

    } catch (error) {
      console.log('❌ Plan表查询失败:', error.message)
    }

    // 2. 测试用户创建
    console.log('\n👤 测试用户创建...')
    try {
      const testEmail = `test${Date.now()}@example.com`

      // 检查用户是否已存在
      const existingUser = await prisma.user.findUnique({
        where: { email: testEmail }
      })

      if (existingUser) {
        console.log('⚠️ 用户已存在')
      } else {
        console.log('✅ 用户不存在，可以创建')

        // 获取免费套餐
        const freePlan = await prisma.plan.findUnique({
          where: { name: 'free' }
        })

        if (freePlan) {
          // 尝试创建用户
          const newUser = await prisma.user.create({
            data: {
              name: 'Test User',
              email: testEmail,
              password: '$2a$12$hash', // 简化的密码hash
              plan_id: freePlan.id
            }
          })
          console.log('✅ 用户创建成功:', newUser.id)

          // 清理测试用户
          await prisma.user.delete({
            where: { id: newUser.id }
          })
          console.log('✅ 测试用户已清理')
        } else {
          console.log('❌ 无法找到免费套餐')
        }
      }

    } catch (error) {
      console.log('❌ 用户创建测试失败:', error.message)
      console.log('   详细错误:', error)
    }

  } catch (error) {
    console.log('❌ 数据库连接失败:', error.message)
  } finally {
    await prisma.$disconnect()
  }

  console.log('\n🎯 调试完成！')
}

debugSignup().catch(console.error)
