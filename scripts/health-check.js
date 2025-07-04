#!/usr/bin/env node

/**
 * Sybau Picture - 基础设施健康检查
 * 检查所有关键服务的连接状态
 */

const fs = require('fs')
const path = require('path')

// 手动加载环境变量
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, value] = line.split('=')
        if (key && value) {
          process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, '')
        }
      }
    })
  }
}

loadEnvFile()

console.log('🏥 Sybau Picture - 基础设施健康检查')
console.log('=' .repeat(50))

// 检查环境变量
function checkEnvVars() {
  console.log('\n🔍 检查环境变量...')
  
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'FAL_KEY'
  ]
  
  const optionalVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'UPLOADTHING_SECRET',
    'UPLOADTHING_TOKEN'
  ]
  
  let hasErrors = false
  
  // 检查必需变量
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`  ✅ ${varName}: 已设置`)
    } else {
      console.log(`  ❌ ${varName}: 未设置 (必需)`)
      hasErrors = true
    }
  })
  
  // 检查可选变量
  optionalVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`  ✅ ${varName}: 已设置`)
    } else {
      console.log(`  ⚠️  ${varName}: 未设置 (可选)`)
    }
  })
  
  return !hasErrors
}

// 检查文件
function checkFiles() {
  console.log('\n📁 检查关键文件...')
  
  const criticalFiles = [
    'package.json',
    'next.config.js',
    'prisma/schema.prisma',
    'lib/prisma.ts',
    'lib/auth.ts'
  ]
  
  const envFile = '.env.local'
  
  let hasErrors = false
  
  criticalFiles.forEach(file => {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      console.log(`  ✅ ${file}: 存在`)
    } else {
      console.log(`  ❌ ${file}: 不存在`)
      hasErrors = true
    }
  })
  
  if (fs.existsSync(path.join(process.cwd(), envFile))) {
    console.log(`  ✅ ${envFile}: 存在`)
  } else {
    console.log(`  ❌ ${envFile}: 不存在 - 运行 'npm run setup' 创建`)
    hasErrors = true
  }
  
  return !hasErrors
}

// 主函数
async function main() {
  const envCheck = checkEnvVars()
  const fileCheck = checkFiles()
  
  console.log('\n' + '=' .repeat(50))
  
  if (envCheck && fileCheck) {
    console.log('🎉 基础检查通过！')
    console.log('✅ 您可以继续配置数据库和外部服务')
    console.log('📖 查看 DEPLOYMENT.md 获取详细配置说明')
  } else {
    console.log('⚠️  发现一些问题，请根据上述信息进行修复。')
    console.log('📖 查看 DEPLOYMENT.md 获取详细配置说明')
  }
  
  console.log('\n🚀 快速修复命令:')
  console.log('   npm run setup        # 创建环境文件')
  console.log('   npm run db:push      # 推送数据库架构')
  console.log('   npm run db:seed      # 填充示例数据')
  console.log('   npm run dev          # 启动开发服务器')
}

// 运行健康检查
main().catch(console.error) 