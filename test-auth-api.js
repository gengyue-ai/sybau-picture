// 测试认证API端点
async function testAuthAPIs() {
  console.log('🔄 测试认证API...')

  const baseUrl = 'http://localhost:3001'

  // 1. 测试NextAuth providers端点
  try {
    console.log('\n1️⃣ 测试 /api/auth/providers')
    const response = await fetch(`${baseUrl}/api/auth/providers`)
    if (response.ok) {
      const providers = await response.json()
      console.log('✅ Providers API成功:', Object.keys(providers))
    } else {
      console.log('❌ Providers API失败:', response.status)
    }
  } catch (error) {
    console.log('❌ Providers API错误:', error.message)
  }

  // 2. 测试注册API
  try {
    console.log('\n2️⃣ 测试 /api/auth/signup')
    const testUser = {
      name: 'Test User ' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123'
    }

    const response = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✅ 注册API成功:', result.message)
      console.log('   用户ID:', result.user.id)
    } else {
      console.log('❌ 注册API失败:', result.error)
    }
  } catch (error) {
    console.log('❌ 注册API错误:', error.message)
  }

  // 3. 测试NextAuth CSRF令牌
  try {
    console.log('\n3️⃣ 测试 /api/auth/csrf')
    const response = await fetch(`${baseUrl}/api/auth/csrf`)
    if (response.ok) {
      const csrf = await response.json()
      console.log('✅ CSRF token获取成功')
    } else {
      console.log('❌ CSRF token失败:', response.status)
    }
  } catch (error) {
    console.log('❌ CSRF token错误:', error.message)
  }

  console.log('\n🎯 API测试完成！')
  console.log('\n📝 请访问以下页面测试前端功能:')
  console.log('   测试页面: http://localhost:3001/debug/test-auth')
  console.log('   登录页面: http://localhost:3001/auth/signin')
}

// 运行测试
testAuthAPIs().catch(console.error)
