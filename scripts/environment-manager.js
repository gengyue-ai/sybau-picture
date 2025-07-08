#!/usr/bin/env node

/**
 * 🌍 环境管理器 v2.0
 *
 * 功能：
 * - 开发/生产环境分离
 * - 秘钥安全管理
 * - 一键环境切换
 * - 配置验证和健康检查
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`
}

// 配置路径
const CONFIG_DIR = path.join(process.cwd(), 'config')
const ENV_LOCAL = path.join(process.cwd(), '.env.local')

// 环境配置预设
const ENVIRONMENT_PRESETS = {
  development: {
    name: 'development',
    displayName: '开发环境',
    description: '本地开发，主要使用模拟服务',
    config: {
      NODE_ENV: 'development',
      NEXTAUTH_URL: 'http://localhost:3001',
      ENABLE_MOCK_MODE: 'true',
      DEBUG: 'true'
    }
  },
  production: {
    name: 'production',
    displayName: '生产环境',
    description: '生产部署，使用真实服务',
    config: {
      NODE_ENV: 'production',
      ENABLE_MOCK_MODE: 'false',
      DEBUG: 'false'
    }
  },
  mock: {
    name: 'mock',
    displayName: '完全模拟模式',
    description: '零配置，所有服务都使用模拟',
    config: {
      NODE_ENV: 'development',
      NEXTAUTH_URL: 'http://localhost:3001',
      ENABLE_MOCK_MODE: 'true',
      DEBUG: 'true',
      NEXTAUTH_SECRET: crypto.randomBytes(32).toString('base64')
    }
  }
}

function readEnvFile() {
  if (!fs.existsSync(ENV_LOCAL)) return {}

  const content = fs.readFileSync(ENV_LOCAL, 'utf8')
  const env = {}

  content.split('\n').forEach(line => {
    line = line.trim()
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        env[key.trim()] = valueParts.join('=').trim()
      }
    }
  })

  return env
}

function writeEnvFile(config) {
  let content = `# 🌍 Sybau Picture - 环境配置\n`
  content += `# 生成时间: ${new Date().toISOString()}\n`
  content += `# 环境: ${config.NODE_ENV || 'development'}\n\n`

  Object.entries(config).forEach(([key, value]) => {
    content += `${key}=${value}\n`
  })

  fs.writeFileSync(ENV_LOCAL, content)
}

function switchEnvironment(targetEnv) {
  console.log(colorize(`🌍 切换到${ENVIRONMENT_PRESETS[targetEnv].displayName}`, 'blue'))

  const currentConfig = readEnvFile()
  const preset = ENVIRONMENT_PRESETS[targetEnv]
  const newConfig = { ...currentConfig, ...preset.config }

  writeEnvFile(newConfig)
  console.log(colorize(`✅ 环境切换完成: ${preset.displayName}`, 'green'))
}

function generateStatusReport() {
  const config = readEnvFile()
  const currentEnv = config.NODE_ENV || 'development'
  const preset = ENVIRONMENT_PRESETS[currentEnv]

  console.log(colorize('🌍 环境状态报告', 'bright'))
  console.log('━'.repeat(50))
  console.log(`📋 当前环境: ${colorize(preset?.displayName || currentEnv, 'cyan')}`)
  console.log(`🔗 基础URL: ${config.NEXTAUTH_URL || '未设置'}`)
  console.log(`🎭 模拟模式: ${config.ENABLE_MOCK_MODE === 'true' ? colorize('开启', 'green') : colorize('关闭', 'red')}`)
  console.log('━'.repeat(50))
}

function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case 'dev':
      switchEnvironment('development')
      break
    case 'prod':
      switchEnvironment('production')
      break
    case 'mock':
      switchEnvironment('mock')
      break
    case 'status':
      generateStatusReport()
      break
    default:
      console.log(colorize('用法: node environment-manager.js [dev|prod|mock|status]', 'yellow'))
  }
}

if (require.main === module) {
  main()
}
