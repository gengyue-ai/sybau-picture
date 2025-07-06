#!/usr/bin/env node

/**
 * Stripe配置检查和修复脚本
 * 专门检查Stripe配置问题并提供修复建议
 */

const fs = require('fs');
const path = require('path');

// 加载环境变量
try {
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  console.log('⚠️  未找到环境变量文件');
}

function checkStripeConfig() {
  console.log('🔍 Stripe配置检查');
  console.log('==================');
  console.log('');

  const issues = [];
  const warnings = [];

  // 1. 检查基础环境变量
  console.log('📋 检查基础环境变量...');

  const requiredEnvs = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];

  requiredEnvs.forEach(envVar => {
    if (!process.env[envVar]) {
      issues.push(`❌ ${envVar} 未配置`);
    } else {
      console.log(`✅ ${envVar} 已配置`);
    }
  });

  // 2. 检查密钥格式
  console.log('\n🔑 检查密钥格式...');

  if (process.env.STRIPE_SECRET_KEY) {
    if (process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
      warnings.push('⚠️  使用测试环境密钥 (sk_test_)');
    } else if (process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
      console.log('✅ 使用生产环境密钥 (sk_live_)');
    } else {
      issues.push('❌ STRIPE_SECRET_KEY 格式不正确');
    }
  }

  if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_test_')) {
      warnings.push('⚠️  使用测试环境公钥 (pk_test_)');
    } else if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.startsWith('pk_live_')) {
      console.log('✅ 使用生产环境公钥 (pk_live_)');
    } else {
      issues.push('❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 格式不正确');
    }
  }

  if (process.env.STRIPE_WEBHOOK_SECRET) {
    if (process.env.STRIPE_WEBHOOK_SECRET.startsWith('whsec_')) {
      console.log('✅ Webhook Secret 格式正确');
    } else {
      issues.push('❌ STRIPE_WEBHOOK_SECRET 格式不正确 (应该以 whsec_ 开头)');
    }
  }

  // 3. 检查价格ID
  console.log('\n💰 检查价格ID...');

  const priceIds = [
    'STRIPE_PRICE_STANDARD_MONTHLY',
    'STRIPE_PRICE_STANDARD_YEARLY',
    'STRIPE_PRICE_PRO_MONTHLY',
    'STRIPE_PRICE_PRO_YEARLY'
  ];

  priceIds.forEach(priceId => {
    if (!process.env[priceId]) {
      issues.push(`❌ ${priceId} 未配置`);
    } else if (process.env[priceId].startsWith('price_')) {
      console.log(`✅ ${priceId} 格式正确`);
    } else {
      issues.push(`❌ ${priceId} 格式不正确`);
    }
  });

  // 4. 检查API连接
  console.log('\n🔗 检查API连接...');

  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      console.log('✅ Stripe SDK 初始化成功');
    } catch (error) {
      issues.push(`❌ Stripe SDK 初始化失败: ${error.message}`);
    }
  }

  // 5. 检查Webhook端点
  console.log('\n🔔 检查Webhook配置...');

  const webhookPath = path.join(process.cwd(), 'app/api/webhook/stripe/route.ts');
  if (fs.existsSync(webhookPath)) {
    console.log('✅ Webhook端点文件存在');
  } else {
    issues.push('❌ Webhook端点文件不存在: app/api/webhook/stripe/route.ts');
  }

  // 显示结果
  console.log('\n📊 检查结果');
  console.log('=============');

  if (issues.length === 0) {
    console.log('🎉 所有Stripe配置检查通过！');
  } else {
    console.log('❌ 发现以下问题：');
    issues.forEach(issue => console.log(`   ${issue}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  警告：');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }

  return { issues, warnings };
}

function generateFixGuide(issues) {
  console.log('\n🔧 修复指南');
  console.log('============');

  if (issues.some(issue => issue.includes('STRIPE_SECRET_KEY'))) {
    console.log('\n📋 修复 STRIPE_SECRET_KEY：');
    console.log('1. 访问 https://dashboard.stripe.com/');
    console.log('2. 进入 "开发者" -> "API 密钥"');
    console.log('3. 复制 "秘密密钥" (sk_live_... 或 sk_test_...)');
    console.log('4. 更新 .env.local 文件中的 STRIPE_SECRET_KEY');
  }

  if (issues.some(issue => issue.includes('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'))) {
    console.log('\n📋 修复 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY：');
    console.log('1. 在同一页面复制 "可发布密钥" (pk_live_... 或 pk_test_...)');
    console.log('2. 更新 .env.local 文件中的 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  }

  if (issues.some(issue => issue.includes('STRIPE_WEBHOOK_SECRET'))) {
    console.log('\n📋 修复 STRIPE_WEBHOOK_SECRET：');
    console.log('1. 在Stripe Dashboard中进入 "开发者" -> "Webhooks"');
    console.log('2. 点击 "添加端点"');
    console.log('3. 输入端点URL: https://your-domain.com/api/webhook/stripe');
    console.log('4. 选择事件类型：');
    console.log('   - checkout.session.completed');
    console.log('   - customer.subscription.created');
    console.log('   - customer.subscription.updated');
    console.log('   - customer.subscription.deleted');
    console.log('   - invoice.payment_succeeded');
    console.log('   - invoice.payment_failed');
    console.log('5. 创建后复制 "签名密钥" (whsec_...)');
    console.log('6. 更新 .env.local 文件中的 STRIPE_WEBHOOK_SECRET');
  }

  if (issues.some(issue => issue.includes('STRIPE_PRICE_'))) {
    console.log('\n📋 修复价格ID：');
    console.log('1. 在Stripe Dashboard中进入 "产品"');
    console.log('2. 创建以下产品：');
    console.log('   - Standard Plan: $9/月, $90/年');
    console.log('   - Pro Plan: $19/月, $190/年');
    console.log('3. 复制每个价格的ID (price_...)');
    console.log('4. 更新 .env.local 文件中的对应价格ID');
  }

  if (issues.some(issue => issue.includes('Webhook端点文件'))) {
    console.log('\n📋 创建Webhook端点：');
    console.log('1. 运行: mkdir -p app/api/webhook/stripe');
    console.log('2. 创建文件: app/api/webhook/stripe/route.ts');
    console.log('3. 参考项目中的Webhook处理代码');
  }
}

function main() {
  const { issues, warnings } = checkStripeConfig();

  if (issues.length > 0) {
    generateFixGuide(issues);
    console.log('\n🚀 修复完成后，请重新运行此脚本验证配置');
  } else {
    console.log('\n🎯 Stripe配置完整，可以进行部署！');
    console.log('\n📋 部署检查清单：');
    console.log('- [x] Stripe密钥配置正确');
    console.log('- [x] 价格ID配置完整');
    console.log('- [x] Webhook端点存在');
    console.log('- [ ] 在生产环境中更新Webhook URL');
    console.log('- [ ] 确保使用生产环境密钥');
  }

  if (warnings.length > 0) {
    console.log('\n💡 建议：');
    console.log('- 部署到生产环境时，请使用生产环境密钥 (sk_live_, pk_live_)');
    console.log('- 测试环境密钥只能用于开发和测试');
  }
}

main();
