#!/usr/bin/env node

/**
 * Stripe Configuration Test Script
 * 测试Stripe配置是否正确
 */

// 尝试加载环境变量，如果文件不存在则忽略错误
try {
  require('dotenv').config({ path: '.env.local' });
} catch (error) {
  // 环境变量文件不存在，稍后会提示用户
}
const Stripe = require('stripe');

async function testStripeConfig() {
  console.log('🔍 Sybau Picture - Stripe配置测试');
  console.log('==================================');
  console.log('');

  // 检查环境变量
  console.log('📋 检查环境变量...');

  const requiredEnvVars = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];

  const priceEnvVars = [
    'STRIPE_PRICE_STANDARD_MONTHLY',
    'STRIPE_PRICE_STANDARD_YEARLY',
    'STRIPE_PRICE_PRO_MONTHLY',
    'STRIPE_PRICE_PRO_YEARLY'
  ];

  let allEnvVarsSet = true;

  // 检查必需的环境变量
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.log(`❌ ${envVar} 未设置`);
      allEnvVarsSet = false;
    } else {
      console.log(`✅ ${envVar} 已设置`);
    }
  }

  // 检查价格ID环境变量
  for (const envVar of priceEnvVars) {
    if (!process.env[envVar]) {
      console.log(`⚠️  ${envVar} 未设置`);
    } else {
      console.log(`✅ ${envVar} 已设置`);
    }
  }

  if (!allEnvVarsSet) {
    console.log('\n❌ 请设置所有必需的环境变量后再次运行测试');
    console.log('\n📋 设置步骤：');
    console.log('1. 运行配置助手: npm run stripe:setup');
    console.log('2. 或手动创建 .env.local 文件并填入Stripe配置');
    console.log('3. 参考文档: STRIPE_QUICKSTART.md');
    console.log('\n🎯 测试模式：如果您想查看集成状态，请继续...');

    const fs = require('fs');
    if (!fs.existsSync('.env.local')) {
      console.log('\n⚠️  未找到 .env.local 文件');
      console.log('请先运行 npm run stripe:setup 创建配置文件');
    }

    process.exit(1);
  }

  console.log('\n🔗 测试Stripe API连接...');

  try {
    // 初始化Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // 测试API连接
    console.log('正在测试API连接...');

    // 获取账户信息
    const account = await stripe.accounts.retrieve();
    console.log(`✅ Stripe API连接成功`);
    console.log(`📧 账户邮箱: ${account.email}`);
    console.log(`🌍 账户国家: ${account.country}`);
    console.log(`💰 账户货币: ${account.default_currency.toUpperCase()}`);
    console.log(`🏪 账户类型: ${account.type}`);

    // 测试价格获取
    console.log('\n💰 测试价格配置...');

    const priceTests = [
      { name: 'Standard月付', envVar: 'STRIPE_PRICE_STANDARD_MONTHLY' },
      { name: 'Standard年付', envVar: 'STRIPE_PRICE_STANDARD_YEARLY' },
      { name: 'Pro月付', envVar: 'STRIPE_PRICE_PRO_MONTHLY' },
      { name: 'Pro年付', envVar: 'STRIPE_PRICE_PRO_YEARLY' }
    ];

    for (const test of priceTests) {
      const priceId = process.env[test.envVar];
      if (priceId) {
        try {
          const price = await stripe.prices.retrieve(priceId);
          const product = await stripe.products.retrieve(price.product);
          console.log(`✅ ${test.name}: $${(price.unit_amount / 100).toFixed(2)} ${price.currency.toUpperCase()} (${product.name})`);
        } catch (error) {
          console.log(`❌ ${test.name}: 价格ID无效 (${priceId})`);
        }
      } else {
        console.log(`⚠️  ${test.name}: 未配置价格ID`);
      }
    }

    // 测试webhook配置
    console.log('\n🔗 测试Webhook配置...');

    try {
      const webhooks = await stripe.webhookEndpoints.list();

      if (webhooks.data.length === 0) {
        console.log('⚠️  未找到webhook端点，请在Stripe Dashboard中配置');
      } else {
        console.log(`✅ 找到 ${webhooks.data.length} 个webhook端点:`);

        for (const webhook of webhooks.data) {
          console.log(`   📍 ${webhook.url}`);
          console.log(`   📊 事件: ${webhook.enabled_events.join(', ')}`);
          console.log(`   ⚡ 状态: ${webhook.status}`);
        }
      }
    } catch (error) {
      console.log(`⚠️  无法检查webhook配置: ${error.message}`);
    }

    console.log('\n🎯 测试建议:');
    console.log('1. 使用测试卡号进行支付测试:');
    console.log('   - 成功支付: 4242 4242 4242 4242');
    console.log('   - 失败支付: 4000 0000 0000 0002');
    console.log('   - 需要验证: 4000 0027 6000 3184');
    console.log('');
    console.log('2. 监控webhook事件:');
    console.log('   - 使用 "npm run stripe:test" 监听本地webhook');
    console.log('   - 在Stripe Dashboard中查看事件日志');
    console.log('');
    console.log('3. 检查支付流程:');
    console.log('   - 访问 /pricing 页面测试支付');
    console.log('   - 确认支付成功页面正确显示');
    console.log('   - 验证用户订阅状态更新');

    console.log('\n🎉 Stripe配置测试完成！');

  } catch (error) {
    console.error('\n❌ Stripe配置测试失败:');
    console.error(`错误: ${error.message}`);

    if (error.code === 'api_key_invalid') {
      console.error('');
      console.error('💡 可能的解决方案:');
      console.error('1. 检查STRIPE_SECRET_KEY是否正确');
      console.error('2. 确认使用的是正确的API密钥（测试或生产）');
      console.error('3. 检查密钥是否有正确的权限');
    }

    process.exit(1);
  }
}

// 运行测试
testStripeConfig().catch(console.error);
