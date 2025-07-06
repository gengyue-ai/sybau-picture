// OAuth配置检查脚本
require('dotenv').config({ path: '.env.local' })

function checkOAuthConfig() {
  console.log('🔍 检查OAuth配置...\n')

  // 检查环境变量
  const requiredVars = [
    'NEXTAUTH_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_SECRET'
  ]

  console.log('📋 环境变量检查:')
  requiredVars.forEach(varName => {
    const value = process.env[varName]
    const status = value ? '✅' : '❌'
    const display = value ? (varName.includes('SECRET') ? '***已设置***' : value) : '未设置'
    console.log(`${status} ${varName}: ${display}`)
  })

  console.log('\n🔗 生成的回调URL:')
  const nextAuthUrl = process.env.NEXTAUTH_URL
  if (nextAuthUrl) {
    const callbackUrl = `${nextAuthUrl}/api/auth/callback/google`
    console.log(`✅ ${callbackUrl}`)

    console.log('\n📝 Google Cloud Console应该配置的重定向URI:')
    console.log(`1. ${callbackUrl}`)
    console.log(`2. ${callbackUrl.replace('sybaupicture.com', 'www.sybaupicture.com')}`)
    console.log(`3. http://localhost:3001/api/auth/callback/google`)
  } else {
    console.log('❌ NEXTAUTH_URL未设置，无法生成回调URL')
  }

  console.log('\n🎯 可能的问题:')
  console.log('1. Google Cloud Console中的重定向URI与上述URL不匹配')
  console.log('2. Google应用未发布到生产环境')
  console.log('3. 客户端ID/密钥已失效或被删除')
  console.log('4. DNS解析问题（sybaupicture.com未正确指向Vercel）')

  console.log('\n🚀 解决步骤:')
  console.log('1. 访问 https://console.cloud.google.com/apis/credentials')
  console.log('2. 检查OAuth 2.0客户端ID中的重定向URI')
  console.log('3. 确保包含上述所有回调URL')
  console.log('4. 发布应用到生产环境')
}

checkOAuthConfig()
