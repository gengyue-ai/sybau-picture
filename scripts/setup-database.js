#!/usr/bin/env node

/**
 * Sybau Picture - 数据库设置脚本
 * 帮助快速配置数据库和基础设施
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🎨 Sybau Picture - 基础设施设置向导')
console.log('=' .repeat(50))

// 检查是否已有 .env.local 文件
const envPath = path.join(process.cwd(), '.env.local')
const hasEnvFile = fs.existsSync(envPath)

if (!hasEnvFile) {
  console.log('📝 创建 .env.local 文件...')
  
  const envTemplate = `# Sybau Picture 环境变量配置
# 复制此文件为 .env.local 并填入真实值

# 数据库配置 (必需)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# NextAuth 配置 (必需)
NEXTAUTH_SECRET="${generateSecret()}"
NEXTAUTH_URL="http://localhost:3000"

# Fal AI 配置 (必需 - 从 fal.md 文件读取)
FAL_KEY="your-fal-ai-api-key-here"

# Google OAuth (可选)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# 文件上传 (推荐)
UPLOADTHING_SECRET=""
UPLOADTHING_TOKEN=""

# Redis 缓存 (可选 - 用于速率限制)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# 监控和分析 (可选)
SENTRY_DSN=""
POSTHOG_KEY=""

# 邮件服务 (可选)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASSWORD=""
FROM_EMAIL="noreply@sybaupicture.com"
`

  fs.writeFileSync(envPath, envTemplate)
  console.log('✅ 已创建 .env.local 文件')
} else {
  console.log('ℹ️  .env.local 文件已存在')
}

console.log('\n🗄️ 数据库配置选项:')
console.log('1. Supabase (推荐 - 免费且功能完整)')
console.log('2. Vercel Postgres (简单集成)')
console.log('3. Neon.tech (性能优异)')
console.log('4. 本地 PostgreSQL')

console.log('\n📋 配置步骤:')
console.log('1. 访问 https://supabase.com 创建免费账户')
console.log('2. 创建新项目')
console.log('3. 在 Settings > Database 获取连接字符串')
console.log('4. 将连接字符串填入 .env.local 的 DATABASE_URL')
console.log('5. 运行: npm run db:setup')

console.log('\n🔐 认证配置:')
console.log('1. 访问 https://console.developers.google.com')
console.log('2. 创建新项目并启用 Google+ API')
console.log('3. 创建 OAuth 2.0 客户端ID')
console.log('4. 将客户端ID和密钥填入 .env.local')

console.log('\n📁 文件上传配置:')
console.log('1. 访问 https://uploadthing.com 创建账户')
console.log('2. 创建新应用')
console.log('3. 获取 Secret 和 Token')
console.log('4. 将配置填入 .env.local')

console.log('\n🚀 完成后运行:')
console.log('   npm run setup')
console.log('   npm run dev')

function generateSecret() {
  return require('crypto').randomBytes(32).toString('hex')
}

console.log('\n✨ 设置向导完成！请按照上述步骤配置环境变量。') 