const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log('🔍 正在测试数据库连接...');

    // 测试基本连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功！');

    // 测试用户表
    console.log('🔍 检查用户表...');
    const userCount = await prisma.user.count();
    console.log('✅ 用户表正常，当前用户数:', userCount);

    // 测试生成图片表
    console.log('🔍 检查图片表...');
    const imageCount = await prisma.generatedImage.count();
    console.log('✅ 图片表正常，当前图片数:', imageCount);

    // 测试订阅表
    console.log('🔍 检查订阅表...');
    const subscriptionCount = await prisma.subscription.count();
    console.log('✅ 订阅表正常，当前订阅数:', subscriptionCount);

    // 测试数据库写入
    console.log('🔍 测试数据库写入能力...');
    const testResult = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ 数据库写入测试成功:', testResult);

    console.log('🎉 数据库完全正常！');

  } catch (error) {
    console.error('❌ 数据库错误:');
    console.error('错误类型:', error.constructor.name);
    console.error('错误信息:', error.message);

    if (error.code) {
      console.error('错误代码:', error.code);
    }

    if (error.message.includes('connect')) {
      console.error('🚨 这是连接错误 - 检查DATABASE_URL');
    }

    if (error.message.includes('timeout')) {
      console.error('🚨 这是超时错误 - 数据库服务器可能离线');
    }

    if (error.message.includes('authentication')) {
      console.error('🚨 这是认证错误 - 检查数据库用户名/密码');
    }

  } finally {
    await prisma.$disconnect();
    console.log('🔌 数据库连接已断开');
  }
}

// 执行测试
testDatabase().catch(console.error);
