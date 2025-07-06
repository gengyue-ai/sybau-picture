#!/usr/bin/env node

/**
 * Vercel 部署准备脚本
 * 检查并修复所有配置问题
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// 创建输入接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('🚀 Sybau Picture - Vercel 部署准备');
  console.log('=====================================');
  console.log('');

  // 检查当前配置状态
  console.log('📋 检查当前配置状态...');

  const envPath = path.join(process.cwd(), '.env.local');
  let currentConfig = {};

  if (fs.existsSync(envPath)) {
    try {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const lines = envContent.split('\n');

      lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          currentConfig[key] = value.replace(/"/g, '');
        }
      });

      console.log('✅ 找到现有配置文件');
    } catch (error) {
      console.log('⚠️  读取配置文件失败:', error.message);
    }
  } else {
    console.log('⚠️  未找到 .env.local 文件');
  }

  // 检查关键问题
  console.log('\n🔍 检查关键配置问题...');

  const issues = [];

  // 1. 检查数据库配置
  if (currentConfig.DATABASE_URL && currentConfig.DATABASE_URL.includes('file:')) {
    issues.push({
      type: 'database',
      message: '数据库配置使用SQLite，Vercel需要PostgreSQL',
      fix: 'need_postgresql'
    });
  }

  // 2. 检查Stripe Webhook Secret格式
  if (currentConfig.STRIPE_WEBHOOK_SECRET && !currentConfig.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
    issues.push({
      type: 'stripe_webhook',
      message: 'Stripe Webhook Secret格式不正确',
      fix: 'need_correct_webhook_secret'
    });
  }

  // 3. 检查域名配置
  if (currentConfig.NEXT_PUBLIC_APP_URL && !currentConfig.NEXT_PUBLIC_APP_URL.startsWith('http')) {
    issues.push({
      type: 'domain',
      message: '应用域名配置不正确',
      fix: 'need_proper_domain'
    });
  }

  // 4. 检查FAL API密钥
  if (!currentConfig.FAL_API_KEY || currentConfig.FAL_API_KEY === '') {
    issues.push({
      type: 'fal_api',
      message: 'FAL AI API密钥未配置',
      fix: 'need_fal_key'
    });
  }

  // 显示问题
  if (issues.length > 0) {
    console.log('\n❌ 发现以下问题需要解决:');
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.message}`);
    });
  } else {
    console.log('\n✅ 配置检查通过！');
  }

  console.log('\n🔧 开始修复配置...');

  // 收集新的配置
  const newConfig = { ...currentConfig };

  // 1. 数据库配置
  console.log('\n📊 数据库配置 (Vercel需要PostgreSQL)');
  console.log('推荐选项:');
  console.log('1. Neon (免费层, 推荐): https://neon.tech/');
  console.log('2. Supabase (免费层): https://supabase.com/');
  console.log('3. PlanetScale (免费层): https://planetscale.com/');
  console.log('');

  newConfig.DATABASE_URL = await askQuestion('PostgreSQL数据库URL (postgresql://...): ');

  // 2. 域名配置
  console.log('\n🌐 域名配置');
  const domain = await askQuestion('部署域名 (https://your-app.vercel.app): ');
  newConfig.NEXTAUTH_URL = domain;
  newConfig.NEXT_PUBLIC_APP_URL = domain;
  newConfig.NEXT_PUBLIC_BASE_URL = domain;

  // 3. Stripe配置检查
  console.log('\n💳 Stripe配置检查');
  if (issues.find(i => i.type === 'stripe_webhook')) {
    console.log('当前Stripe Webhook Secret格式不正确');
    console.log('请在Stripe Dashboard中创建webhook并获取正确的密钥');
    console.log('格式应该是: whsec_xxxxxxxx');
    newConfig.STRIPE_WEBHOOK_SECRET = await askQuestion('正确的Stripe Webhook Secret: ');
  }

  // 检查Stripe价格ID
  const stripeKeys = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_PRICE_STANDARD_MONTHLY',
    'STRIPE_PRICE_STANDARD_YEARLY',
    'STRIPE_PRICE_PRO_MONTHLY',
    'STRIPE_PRICE_PRO_YEARLY'
  ];

  let stripeConfigured = true;
  for (const key of stripeKeys) {
    if (!newConfig[key] || newConfig[key] === '') {
      stripeConfigured = false;
      console.log(`❌ ${key} 未配置`);
    }
  }

  if (stripeConfigured) {
    console.log('✅ Stripe配置完整');
  } else {
    console.log('⚠️  Stripe配置不完整，请运行 npm run stripe:setup 完成配置');
  }

  // 4. FAL API密钥
  if (!newConfig.FAL_API_KEY || newConfig.FAL_API_KEY === '') {
    console.log('\n🤖 FAL AI API密钥配置');
    console.log('请访问 https://fal.ai/ 获取API密钥');
    newConfig.FAL_API_KEY = await askQuestion('FAL AI API密钥: ');
  }

  // 5. NextAuth Secret
  if (!newConfig.NEXTAUTH_SECRET || newConfig.NEXTAUTH_SECRET === '') {
    console.log('\n🔐 生成NextAuth Secret');
    const crypto = require('crypto');
    newConfig.NEXTAUTH_SECRET = crypto.randomBytes(32).toString('base64');
    console.log('✅ 已生成NextAuth Secret');
  }

  // 生成新的环境变量文件
  const envContent = `# Sybau Picture - 部署配置
# 生成时间: ${new Date().toISOString()}

# 数据库配置 (PostgreSQL for Vercel)
DATABASE_URL="${newConfig.DATABASE_URL}"

# NextAuth配置
NEXTAUTH_URL="${newConfig.NEXTAUTH_URL}"
NEXTAUTH_SECRET="${newConfig.NEXTAUTH_SECRET}"

# Google OAuth配置
GOOGLE_CLIENT_ID="${newConfig.GOOGLE_CLIENT_ID || ''}"
GOOGLE_CLIENT_SECRET="${newConfig.GOOGLE_CLIENT_SECRET || ''}"

# Stripe配置
STRIPE_SECRET_KEY="${newConfig.STRIPE_SECRET_KEY || ''}"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${newConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}"
STRIPE_WEBHOOK_SECRET="${newConfig.STRIPE_WEBHOOK_SECRET || ''}"

# Stripe价格ID
STRIPE_PRICE_STANDARD_MONTHLY="${newConfig.STRIPE_PRICE_STANDARD_MONTHLY || ''}"
STRIPE_PRICE_STANDARD_YEARLY="${newConfig.STRIPE_PRICE_STANDARD_YEARLY || ''}"
STRIPE_PRICE_PRO_MONTHLY="${newConfig.STRIPE_PRICE_PRO_MONTHLY || ''}"
STRIPE_PRICE_PRO_YEARLY="${newConfig.STRIPE_PRICE_PRO_YEARLY || ''}"

# 应用基础配置
NEXT_PUBLIC_APP_URL="${newConfig.NEXT_PUBLIC_APP_URL}"
NEXT_PUBLIC_BASE_URL="${newConfig.NEXT_PUBLIC_BASE_URL}"

# FAL AI配置
FAL_API_KEY="${newConfig.FAL_API_KEY}"
`;

  // 备份并写入新配置
  if (fs.existsSync(envPath)) {
    const backupPath = path.join(process.cwd(), '.env.local.backup');
    fs.copyFileSync(envPath, backupPath);
    console.log('\n✅ 现有配置已备份为 .env.local.backup');
  }

  fs.writeFileSync(envPath, envContent);
  console.log('✅ 新配置已写入 .env.local');

  // 创建Vercel环境变量文件
  const vercelEnvPath = path.join(process.cwd(), '.env.vercel');
  fs.writeFileSync(vercelEnvPath, envContent);
  console.log('✅ 已创建 .env.vercel 文件用于Vercel部署');

  // 生成部署指南
  const deploymentGuide = `# 🚀 Vercel 部署指南

## 📋 部署前检查清单

### ✅ 已完成
- [x] 环境变量配置
- [x] 数据库配置 (PostgreSQL)
- [x] 域名配置
- [x] Stripe配置检查
- [x] FAL AI配置

### 🔄 待完成
- [ ] 在Vercel中配置环境变量
- [ ] 数据库Schema推送
- [ ] 域名DNS配置
- [ ] Stripe Webhook配置

## 🚀 部署步骤

### 1. 连接GitHub仓库
\`\`\`bash
# 确保代码已推送到GitHub
git add .
git commit -m "feat: 完成Vercel部署配置"
git push origin main
\`\`\`

### 2. 在Vercel中导入项目
1. 访问 https://vercel.com/
2. 点击 "New Project"
3. 导入您的GitHub仓库
4. 选择框架: Next.js

### 3. 配置环境变量
复制以下环境变量到Vercel项目设置:

\`\`\`env
DATABASE_URL=${newConfig.DATABASE_URL}
NEXTAUTH_URL=${newConfig.NEXTAUTH_URL}
NEXTAUTH_SECRET=${newConfig.NEXTAUTH_SECRET}
GOOGLE_CLIENT_ID=${newConfig.GOOGLE_CLIENT_ID || ''}
GOOGLE_CLIENT_SECRET=${newConfig.GOOGLE_CLIENT_SECRET || ''}
STRIPE_SECRET_KEY=${newConfig.STRIPE_SECRET_KEY || ''}
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${newConfig.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
STRIPE_WEBHOOK_SECRET=${newConfig.STRIPE_WEBHOOK_SECRET || ''}
STRIPE_PRICE_STANDARD_MONTHLY=${newConfig.STRIPE_PRICE_STANDARD_MONTHLY || ''}
STRIPE_PRICE_STANDARD_YEARLY=${newConfig.STRIPE_PRICE_STANDARD_YEARLY || ''}
STRIPE_PRICE_PRO_MONTHLY=${newConfig.STRIPE_PRICE_PRO_MONTHLY || ''}
STRIPE_PRICE_PRO_YEARLY=${newConfig.STRIPE_PRICE_PRO_YEARLY || ''}
NEXT_PUBLIC_APP_URL=${newConfig.NEXT_PUBLIC_APP_URL}
NEXT_PUBLIC_BASE_URL=${newConfig.NEXT_PUBLIC_BASE_URL}
FAL_API_KEY=${newConfig.FAL_API_KEY}
\`\`\`

### 4. 部署后配置

#### 推送数据库Schema
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

#### 配置Stripe Webhook
1. 在Stripe Dashboard中更新webhook URL
2. 新的URL: ${newConfig.NEXTAUTH_URL}/api/webhook/stripe
3. 确保选择了正确的事件类型

#### 配置Google OAuth
1. 在Google Cloud Console中更新重定向URI
2. 新的URI: ${newConfig.NEXTAUTH_URL}/api/auth/callback/google

### 5. 验证部署
- [ ] 网站可以正常访问
- [ ] 用户认证功能正常
- [ ] AI图片生成功能正常
- [ ] Stripe支付功能正常
- [ ] 多语言切换正常

## 🔧 常见问题解决

### 数据库连接问题
- 确保DATABASE_URL格式正确
- 检查数据库服务商的连接池配置

### Stripe支付问题
- 确保webhook URL正确配置
- 检查生产环境密钥是否正确

### 认证问题
- 确保NEXTAUTH_URL与部署域名一致
- 检查Google OAuth重定向URI配置

---

🎉 **部署完成后，您的Sybau Picture应用将在全球范围内提供服务！**
`;

  fs.writeFileSync(path.join(process.cwd(), 'VERCEL_DEPLOYMENT_GUIDE.md'), deploymentGuide);
  console.log('✅ 已生成部署指南: VERCEL_DEPLOYMENT_GUIDE.md');

  // 显示总结
  console.log('\n🎯 部署准备完成！');
  console.log('====================');
  console.log('✅ 环境变量配置已更新');
  console.log('✅ 数据库配置已切换为PostgreSQL');
  console.log('✅ 域名配置已更新');
  console.log('✅ 部署指南已生成');
  console.log('');
  console.log('📋 下一步操作：');
  console.log('1. 检查并完成数据库设置');
  console.log('2. 在Vercel中配置环境变量');
  console.log('3. 推送代码到GitHub');
  console.log('4. 在Vercel中部署项目');
  console.log('5. 配置Stripe webhook和Google OAuth');
  console.log('');
  console.log('📖 详细步骤请参考: VERCEL_DEPLOYMENT_GUIDE.md');

  rl.close();
}

main().catch(console.error);
