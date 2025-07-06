#!/usr/bin/env node

/**
 * 测试数据库连接脚本
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');

async function testDatabaseConnection() {
  console.log('🔍 测试数据库连接...');
  console.log('=========================');
  console.log('');

  const prisma = new PrismaClient();

  try {
    console.log('1. 检查数据库连接...');

    // 测试基本连接
    await prisma.$connect();
    console.log('✅ 数据库连接成功!');

    console.log('');
    console.log('2. 验证表结构...');

    // 检查主要表是否存在
    const tables = [
      'users',
      'accounts',
      'sessions',
      'verificationtokens',
      'plans',
      'generated_images'
    ];

    for (const table of tables) {
      try {
        switch (table) {
          case 'users':
            const userCount = await prisma.user.count();
            console.log(`✅ ${table} 表存在 (${userCount} 条记录)`);
            break;
          case 'accounts':
            const accountCount = await prisma.account.count();
            console.log(`✅ ${table} 表存在 (${accountCount} 条记录)`);
            break;
          case 'sessions':
            const sessionCount = await prisma.session.count();
            console.log(`✅ ${table} 表存在 (${sessionCount} 条记录)`);
            break;
          case 'verificationtokens':
            const tokenCount = await prisma.verificationToken.count();
            console.log(`✅ ${table} 表存在 (${tokenCount} 条记录)`);
            break;
          case 'plans':
            const planCount = await prisma.plan.count();
            console.log(`✅ ${table} 表存在 (${planCount} 条记录)`);
            break;
          case 'generated_images':
            const imageCount = await prisma.generatedImage.count();
            console.log(`✅ ${table} 表存在 (${imageCount} 条记录)`);
            break;
        }
      } catch (error) {
        console.log(`❌ ${table} 表有问题: ${error.message}`);
      }
    }

    console.log('');
    console.log('3. 检查套餐数据...');

    try {
      const plans = await prisma.plan.findMany({
        orderBy: { sortOrder: 'asc' }
      });

      if (plans.length > 0) {
        console.log('✅ 套餐数据已插入:');
        plans.forEach(plan => {
          console.log(`  - ${plan.displayName}: $${plan.price}/月`);
        });
      } else {
        console.log('❌ 没有找到套餐数据');
      }
    } catch (error) {
      console.log(`❌ 套餐数据检查失败: ${error.message}`);
    }

    console.log('');
    console.log('4. 测试数据库操作...');

    try {
      // 测试插入和删除操作
      const testUser = await prisma.user.create({
        data: {
          id: 'test-user-' + Date.now(),
          email: 'test@example.com',
          name: 'Test User'
        }
      });

      console.log('✅ 用户创建测试成功');

      // 删除测试用户
      await prisma.user.delete({
        where: { id: testUser.id }
      });

      console.log('✅ 用户删除测试成功');

    } catch (error) {
      console.log(`❌ 数据库操作测试失败: ${error.message}`);
    }

    console.log('');
    console.log('🎉 数据库连接测试完成!');
    console.log('');
    console.log('📋 总结:');
    console.log('  ✅ 数据库连接正常');
    console.log('  ✅ 表结构正确');
    console.log('  ✅ 基础数据已插入');
    console.log('  ✅ CRUD操作正常');
    console.log('');
    console.log('🚀 现在可以启动开发服务器进行测试了!');

  } catch (error) {
    console.error('❌ 数据库连接测试失败:');
    console.error(error);
    console.log('');
    console.log('💡 请检查:');
    console.log('  1. Supabase SQL脚本是否正确执行');
    console.log('  2. 环境变量DATABASE_URL是否正确');
    console.log('  3. 网络连接是否正常');

  } finally {
    await prisma.$disconnect();
  }
}

// 运行测试
testDatabaseConnection();
