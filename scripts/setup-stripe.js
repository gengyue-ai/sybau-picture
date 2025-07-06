#!/usr/bin/env node

/**
 * Stripe Setup Helper Script
 * 帮助用户快速设置Stripe配置
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🚀 Sybau Picture - Stripe配置助手');
  console.log('=====================================');
  console.log('');

  console.log('请提供以下Stripe配置信息：');
  console.log('');

  // 收集用户输入
  const config = {};

  config.STRIPE_SECRET_KEY = await askQuestion('Stripe Secret Key (sk_test_... 或 sk_live_...): ');
  config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = await askQuestion('Stripe Publishable Key (pk_test_... 或 pk_live_...): ');
  config.STRIPE_WEBHOOK_SECRET = await askQuestion('Stripe Webhook Secret (whsec_...): ');

  console.log('');
  console.log('请提供价格ID（在Stripe Dashboard中创建产品后获取）：');

  config.STRIPE_PRICE_STANDARD_MONTHLY = await askQuestion('Standard月付价格ID (price_...): ');
  config.STRIPE_PRICE_STANDARD_YEARLY = await askQuestion('Standard年付价格ID (price_...): ');
  config.STRIPE_PRICE_PRO_MONTHLY = await askQuestion('Pro月付价格ID (price_...): ');
  config.STRIPE_PRICE_PRO_YEARLY = await askQuestion('Pro年付价格ID (price_...): ');

  console.log('');
  console.log('应用配置：');

  config.NEXT_PUBLIC_APP_URL = await askQuestion('应用URL (https://your-domain.com): ');
  config.NEXT_PUBLIC_BASE_URL = config.NEXT_PUBLIC_APP_URL;

  config.DATABASE_URL = await askQuestion('数据库URL (postgresql://...): ');
  config.NEXTAUTH_URL = config.NEXT_PUBLIC_APP_URL;
  config.NEXTAUTH_SECRET = await askQuestion('NextAuth Secret (随机字符串): ');
  config.FAL_API_KEY = await askQuestion('FAL AI API Key (可选): ');

  // 生成环境变量文件内容
  const envContent = `# Sybau Picture - 环境变量配置
# 生成时间: ${new Date().toISOString()}

# 数据库配置
DATABASE_URL="${config.DATABASE_URL}"

# NextAuth配置
NEXTAUTH_URL="${config.NEXTAUTH_URL}"
NEXTAUTH_SECRET="${config.NEXTAUTH_SECRET}"

# Stripe配置
STRIPE_SECRET_KEY="${config.STRIPE_SECRET_KEY}"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="${config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}"
STRIPE_WEBHOOK_SECRET="${config.STRIPE_WEBHOOK_SECRET}"

# Stripe价格ID
STRIPE_PRICE_STANDARD_MONTHLY="${config.STRIPE_PRICE_STANDARD_MONTHLY}"
STRIPE_PRICE_STANDARD_YEARLY="${config.STRIPE_PRICE_STANDARD_YEARLY}"
STRIPE_PRICE_PRO_MONTHLY="${config.STRIPE_PRICE_PRO_MONTHLY}"
STRIPE_PRICE_PRO_YEARLY="${config.STRIPE_PRICE_PRO_YEARLY}"

# 应用基础配置
NEXT_PUBLIC_APP_URL="${config.NEXT_PUBLIC_APP_URL}"
NEXT_PUBLIC_BASE_URL="${config.NEXT_PUBLIC_BASE_URL}"

# FAL AI配置
FAL_API_KEY="${config.FAL_API_KEY}"
`;

  // 写入环境变量文件
  const envFilePath = path.join(process.cwd(), '.env.local');

  try {
    // 备份现有的环境变量文件
    if (fs.existsSync(envFilePath)) {
      const backupPath = path.join(process.cwd(), '.env.local.backup');
      fs.copyFileSync(envFilePath, backupPath);
      console.log(`\n✅ 现有的.env.local文件已备份为.env.local.backup`);
    }

    // 写入新的环境变量文件
    fs.writeFileSync(envFilePath, envContent);
    console.log(`\n✅ 环境变量文件已生成: ${envFilePath}`);

    // 验证配置
    console.log('\n🔍 配置验证：');

    // 检查必要的配置
    const requiredKeys = [
      'STRIPE_SECRET_KEY',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_WEBHOOK_SECRET'
    ];

    let allValid = true;

    for (const key of requiredKeys) {
      if (!config[key] || config[key].trim() === '') {
        console.log(`❌ ${key} 未设置或为空`);
        allValid = false;
      } else {
        console.log(`✅ ${key} 已设置`);
      }
    }

    // 验证密钥格式
    if (config.STRIPE_SECRET_KEY && !config.STRIPE_SECRET_KEY.startsWith('sk_')) {
      console.log('⚠️  警告: Stripe Secret Key格式可能不正确 (应该以sk_开头)');
      allValid = false;
    }

    if (config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && !config.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
      console.log('⚠️  警告: Stripe Publishable Key格式可能不正确 (应该以pk_开头)');
      allValid = false;
    }

    if (config.STRIPE_WEBHOOK_SECRET && !config.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
      console.log('⚠️  警告: Stripe Webhook Secret格式可能不正确 (应该以whsec_开头)');
      allValid = false;
    }

    console.log('\n📋 下一步操作：');

    if (allValid) {
      console.log('✅ 1. 配置验证通过');
    } else {
      console.log('❌ 1. 请检查并修正上述配置问题');
    }

    console.log('🔄 2. 推送数据库schema: npx prisma db push');
    console.log('🌱 3. 运行种子数据: npx prisma db seed');
    console.log('🚀 4. 启动开发服务器: npm run dev');
    console.log('📊 5. 在Stripe Dashboard中检查webhook配置');
    console.log('🧪 6. 使用测试卡号进行支付测试');

    console.log('\n🎯 测试卡号：');
    console.log('- 成功支付: 4242 4242 4242 4242');
    console.log('- 失败支付: 4000 0000 0000 0002');
    console.log('- 需要验证: 4000 0027 6000 3184');

    console.log('\n🚀 配置完成！');

  } catch (error) {
    console.error('\n❌ 配置过程中发生错误:', error.message);
    process.exit(1);
  }

  rl.close();
}

// 运行脚本
main().catch(console.error);
