#!/usr/bin/env node

/**
 * 环境切换脚本 - 快速在开发/生产环境之间切换
 * 使用方法：
 * - npm run env:dev     # 切换到开发环境
 * - npm run env:prod    # 切换到生产环境
 * - npm run env:mock    # 切换到完全模拟模式
 * - npm run env:status  # 查看当前环境状态
 */

const fs = require('fs')
const path = require('path')

const ENV_FILE = '.env.local'
const ENV_BACKUP = '.env.backup'

// 预定义的环境配置
const environments = {
  development: {
    NODE_ENV: 'development',
    NEXTAUTH_URL: 'http://localhost:3001',
    NEXTAUTH_SECRET: 'dev-secret-key-12345678901234567890',
    // 开发环境可选配置（如果不提供将使用模拟）
    // GOOGLE_CLIENT_ID: '留空使用模拟',
    // GOOGLE_CLIENT_SECRET: '留空使用模拟',
    // FAL_KEY: '留空使用模拟',
    // DATABASE_URL: '留空禁用数据库',
    // STRIPE_SECRET_KEY: '留空禁用支付',
    // NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: '留空禁用支付',
  },

  production: {
    NODE_ENV: 'production',
    NEXTAUTH_URL: 'https://www.sybaupicture.com',
    NEXTAUTH_SECRET: '${PRODUCTION_SECRET}', // 需要手动设置
    GOOGLE_CLIENT_ID: '${PRODUCTION_GOOGLE_CLIENT_ID}',
    GOOGLE_CLIENT_SECRET: '${PRODUCTION_GOOGLE_CLIENT_SECRET}',
    FAL_KEY: '${PRODUCTION_FAL_KEY}',
    DATABASE_URL: '${PRODUCTION_DATABASE_URL}',
    STRIPE_SECRET_KEY: '${PRODUCTION_STRIPE_SECRET_KEY}',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: '${PRODUCTION_STRIPE_PUBLISHABLE_KEY}',
  },

  mock: {
    NODE_ENV: 'development',
    NEXTAUTH_URL: 'http://localhost:3001',
    NEXTAUTH_SECRET: 'mock-secret-key-for-testing',
    // 完全模拟模式 - 所有服务都使用模拟
  }
}

// 获取命令行参数
const args = process.argv.slice(2)
const command = args[0]

function readEnvFile() {
  try {
    if (fs.existsSync(ENV_FILE)) {
      const content = fs.readFileSync(ENV_FILE, 'utf8')
      const env = {}
      content.split('\n').forEach(line => {
        const [key, ...value] = line.split('=')
        if (key && value.length > 0) {
          env[key] = value.join('=')
        }
      })
      return env
    }
    return {}
  } catch (error) {
    console.error('读取环境文件失败:', error.message)
    return {}
  }
}

function writeEnvFile(envVars) {
  try {
    const content = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n') + '\n'

    fs.writeFileSync(ENV_FILE, content, 'utf8')
    return true
  } catch (error) {
    console.error('写入环境文件失败:', error.message)
    return false
  }
}

function backupCurrentEnv() {
  try {
    if (fs.existsSync(ENV_FILE)) {
      fs.copyFileSync(ENV_FILE, ENV_BACKUP)
      console.log('✅ 当前环境已备份到', ENV_BACKUP)
    }
  } catch (error) {
    console.warn('⚠️  备份环境文件失败:', error.message)
  }
}

function restoreBackup() {
  try {
    if (fs.existsSync(ENV_BACKUP)) {
      fs.copyFileSync(ENV_BACKUP, ENV_FILE)
      console.log('✅ 环境已从备份恢复')
      return true
    } else {
      console.log('❌ 没有找到备份文件')
      return false
    }
  } catch (error) {
    console.error('❌ 恢复备份失败:', error.message)
    return false
  }
}

function switchEnvironment(envName) {
  if (!environments[envName]) {
    console.error(`❌ 不支持的环境: ${envName}`)
    console.log('支持的环境:', Object.keys(environments).join(', '))
    process.exit(1)
  }

  console.log(`🔄 切换到 ${envName} 环境...`)

  // 备份当前环境
  backupCurrentEnv()

  // 读取当前环境变量（保留用户自定义的变量）
  const currentEnv = readEnvFile()

  // 合并新环境配置
  const newEnv = {
    ...currentEnv, // 保留现有配置
    ...environments[envName] // 覆盖环境特定配置
  }

  // 写入新环境
  if (writeEnvFile(newEnv)) {
    console.log(`✅ 已切换到 ${envName} 环境`)

    // 显示关键配置
    console.log('\n📋 环境配置:')
    console.log(`- NODE_ENV: ${newEnv.NODE_ENV}`)
    console.log(`- NEXTAUTH_URL: ${newEnv.NEXTAUTH_URL}`)
    console.log(`- Google OAuth: ${newEnv.GOOGLE_CLIENT_ID ? '已配置' : '使用模拟'}`)
    console.log(`- AI服务: ${newEnv.FAL_KEY ? '已配置' : '使用模拟'}`)
    console.log(`- 数据库: ${newEnv.DATABASE_URL ? '已配置' : '禁用'}`)
    console.log(`- 支付: ${newEnv.STRIPE_SECRET_KEY ? '已配置' : '禁用'}`)

    if (envName === 'production') {
      console.log('\n⚠️  生产环境注意事项:')
      console.log('- 确保所有 ${PRODUCTION_*} 变量都已设置真实值')
      console.log('- 检查域名和SSL证书配置')
      console.log('- 确认数据库和API密钥有效')
    }

    if (envName === 'development' || envName === 'mock') {
      console.log('\n💡 开发环境提示:')
      console.log('- 未配置的服务将使用模拟模式')
      console.log('- 要启用真实服务，请设置相应的环境变量')
      console.log('- 运行 npm run env:status 查看详细状态')
    }

    console.log('\n🚀 请重启开发服务器以应用新配置:')
    console.log('   npm run dev')

  } else {
    console.error('❌ 环境切换失败')
    process.exit(1)
  }
}

function showStatus() {
  const currentEnv = readEnvFile()

  console.log('🔍 当前环境状态')
  console.log('━'.repeat(50))

  // 检测环境类型
  const nodeEnv = currentEnv.NODE_ENV || 'development'
  const isLocal = currentEnv.NEXTAUTH_URL?.includes('localhost')

  console.log(`🌍 环境类型: ${nodeEnv}${isLocal ? ' (本地)' : ' (远程)'}`)
  console.log(`🔗 Base URL: ${currentEnv.NEXTAUTH_URL || 'http://localhost:3001'}`)
  console.log()

  // 服务配置状态
  const services = [
    {
      name: 'Google OAuth',
      configured: !!(currentEnv.GOOGLE_CLIENT_ID && currentEnv.GOOGLE_CLIENT_SECRET),
      required: nodeEnv === 'production'
    },
    {
      name: 'AI服务 (Fal)',
      configured: !!currentEnv.FAL_KEY,
      required: nodeEnv === 'production'
    },
    {
      name: '数据库',
      configured: !!currentEnv.DATABASE_URL,
      required: false
    },
    {
      name: '支付 (Stripe)',
      configured: !!(currentEnv.STRIPE_SECRET_KEY && currentEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
      required: nodeEnv === 'production'
    }
  ]

  console.log('📋 服务配置状态:')
  services.forEach(service => {
    const status = service.configured
      ? '✅ 已配置'
      : (service.required ? '❌ 缺失 (必需)' : '🔶 模拟模式')
    console.log(`  ${service.name.padEnd(15)}: ${status}`)
  })

  // 模拟模式检测
  const mockServices = services.filter(s => !s.configured && !s.required)
  if (mockServices.length > 0) {
    console.log('\n🎭 模拟模式服务:')
    mockServices.forEach(service => {
      console.log(`  - ${service.name}`)
    })
  }

  // 缺失的必需配置
  const missingRequired = services.filter(s => s.required && !s.configured)
  if (missingRequired.length > 0) {
    console.log('\n⚠️  缺失的必需配置:')
    missingRequired.forEach(service => {
      console.log(`  - ${service.name}`)
    })
  }

  console.log('\n💡 环境切换命令:')
  console.log('  npm run env:dev   # 开发环境')
  console.log('  npm run env:prod  # 生产环境')
  console.log('  npm run env:mock  # 完全模拟模式')
}

function showHelp() {
  console.log('🔧 环境切换工具')
  console.log('━'.repeat(50))
  console.log('用法: npm run env:<command>')
  console.log()
  console.log('命令:')
  console.log('  dev     切换到开发环境')
  console.log('  prod    切换到生产环境')
  console.log('  mock    切换到完全模拟模式')
  console.log('  status  显示当前环境状态')
  console.log('  restore 恢复备份的环境配置')
  console.log('  help    显示此帮助信息')
  console.log()
  console.log('示例:')
  console.log('  npm run env:dev      # 切换到开发环境')
  console.log('  npm run env:status   # 查看当前状态')
}

// 主逻辑
switch (command) {
  case 'dev':
  case 'development':
    switchEnvironment('development')
    break

  case 'prod':
  case 'production':
    switchEnvironment('production')
    break

  case 'mock':
    switchEnvironment('mock')
    break

  case 'status':
    showStatus()
    break

  case 'restore':
    restoreBackup()
    break

  case 'help':
  case '--help':
  case '-h':
    showHelp()
    break

  default:
    console.error(`❌ 未知命令: ${command}`)
    showHelp()
    process.exit(1)
}
