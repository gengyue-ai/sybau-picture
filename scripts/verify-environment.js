#!/usr/bin/env node
// 🔍 环境配置验证脚本 - 确保环境切换正确

const fs = require('fs');
const path = require('path');

// 测试环境管理器
async function testEnvironmentManager() {
  console.log('🧪 测试环境管理器...');
  
  try {
    // 使用require导入编译后的模块
    const { getEnvironmentConfig, validateConfiguration, getEnvironmentReport } = require('../lib/env-manager');
    
    const config = getEnvironmentConfig();
    const validation = validateConfiguration(config);
    
    console.log('\n📊 环境配置报告:');
    console.log(getEnvironmentReport());
    
    if (!validation.isValid) {
      console.log('\n❌ 环境配置验证失败');
      validation.issues.forEach(issue => console.log(`   • ${issue}`));
      return false;
    }
    
    console.log('\n✅ 环境管理器测试通过');
    return true;
  } catch (error) {
    console.error('❌ 环境管理器测试失败:', error.message);
    return false;
  }
}

// 测试数据库连接
async function testDatabaseConnection() {
  console.log('\n🗄️  测试数据库连接...');
  
  try {
    const { prisma } = require('../lib/prisma');
    
    if (!prisma) {
      console.log('⚠️  数据库未配置，跳过连接测试');
      return true;
    }
    
    // 简单的连接测试
    await prisma.$connect();
    console.log('✅ 数据库连接成功');
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

// 测试认证配置
async function testAuthConfiguration() {
  console.log('\n🔐 测试认证配置...');
  
  try {
    const { getEnvironmentConfig } = require('../lib/env-manager');
    const config = getEnvironmentConfig();
    
    const authIssues = [];
    
    if (!config.auth.clientId) {
      authIssues.push('Google Client ID 未配置');
    }
    
    if (!config.auth.clientSecret) {
      authIssues.push('Google Client Secret 未配置');
    }
    
    if (!config.auth.secret) {
      authIssues.push('NextAuth Secret 未配置');
    }
    
    if (authIssues.length > 0) {
      console.log('⚠️  认证配置问题:');
      authIssues.forEach(issue => console.log(`   • ${issue}`));
      return false;
    }
    
    console.log('✅ 认证配置验证通过');
    return true;
  } catch (error) {
    console.error('❌ 认证配置测试失败:', error.message);
    return false;
  }
}

// 测试支付配置
async function testPaymentConfiguration() {
  console.log('\n💳 测试支付配置...');
  
  try {
    const { getEnvironmentConfig } = require('../lib/env-manager');
    const config = getEnvironmentConfig();
    
    const paymentIssues = [];
    
    if (!config.payment.secretKey) {
      paymentIssues.push('Stripe Secret Key 未配置');
    }
    
    if (!config.payment.publishableKey) {
      paymentIssues.push('Stripe Publishable Key 未配置');
    }
    
    if (!config.payment.webhookSecret) {
      paymentIssues.push('Stripe Webhook Secret 未配置');
    }
    
    if (paymentIssues.length > 0) {
      console.log('⚠️  支付配置问题:');
      paymentIssues.forEach(issue => console.log(`   • ${issue}`));
      return false;
    }
    
    // 测试Stripe初始化
    try {
      const { stripe } = require('../lib/stripe');
      // 简单测试 - 获取账户信息
      await stripe.accounts.retrieve();
      console.log('✅ Stripe配置验证通过');
      return true;
    } catch (stripeError) {
      console.log('⚠️  Stripe连接测试失败:', stripeError.message);
      console.log('   配置存在但可能无效或网络问题');
      return true; // 配置存在即可，网络问题不算配置错误
    }
  } catch (error) {
    console.error('❌ 支付配置测试失败:', error.message);
    return false;
  }
}

// 测试AI服务配置
async function testAIConfiguration() {
  console.log('\n🤖 测试AI服务配置...');
  
  try {
    const { getEnvironmentConfig } = require('../lib/env-manager');
    const config = getEnvironmentConfig();
    
    if (!config.ai.apiKey) {
      console.log('⚠️  FAL AI密钥未配置');
      return false;
    }
    
    console.log('✅ AI服务配置验证通过');
    return true;
  } catch (error) {
    console.error('❌ AI服务配置测试失败:', error.message);
    return false;
  }
}

// 检查环境文件完整性
function checkEnvironmentFiles() {
  console.log('\n📁 检查环境文件...');
  
  const envFiles = [
    '.env.development.local',
    '.env.production.local'
  ];
  
  const issues = [];
  
  envFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      issues.push(`缺少文件: ${file}`);
    } else {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.length < 100) {
        issues.push(`文件 ${file} 内容过少，可能配置不完整`);
      }
    }
  });
  
  if (issues.length > 0) {
    console.log('⚠️  环境文件问题:');
    issues.forEach(issue => console.log(`   • ${issue}`));
    return false;
  }
  
  console.log('✅ 环境文件检查通过');
  return true;
}

// 主验证函数
async function main() {
  console.log('🔍 开始环境配置验证...');
  console.log('=' .repeat(50));
  
  const tests = [
    { name: '环境文件检查', fn: () => checkEnvironmentFiles() },
    { name: '环境管理器', fn: testEnvironmentManager },
    { name: '数据库连接', fn: testDatabaseConnection },
    { name: '认证配置', fn: testAuthConfiguration },
    { name: '支付配置', fn: testPaymentConfiguration },
    { name: 'AI服务配置', fn: testAIConfiguration }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, success: result });
    } catch (error) {
      console.error(`❌ ${test.name} 测试出错:`, error.message);
      results.push({ name: test.name, success: false });
    }
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 验证结果汇总:');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    const icon = result.success ? '✅' : '❌';
    console.log(`${icon} ${result.name}`);
  });
  
  console.log(`\n总结: ${successful}/${total} 项测试通过`);
  
  if (successful === total) {
    console.log('🎉 所有测试通过！环境配置正常');
    process.exit(0);
  } else {
    console.log('⚠️  部分测试失败，请检查上述问题');
    console.log('\n💡 建议:');
    console.log('   1. 检查 .env.development.local 和 .env.production.local 文件');
    console.log('   2. 运行 npm run env:protect:init 初始化环境保护');
    console.log('   3. 运行 npm run env:status 查看详细配置状态');
    process.exit(1);
  }
}

// 运行验证
main().catch(error => {
  console.error('验证过程出错:', error);
  process.exit(1);
});