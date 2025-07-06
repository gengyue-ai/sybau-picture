#!/usr/bin/env node

/**
 * Prisma诊断脚本
 */

// 直接检查环境变量
console.log('🔍 Prisma诊断检查...');
console.log('========================');
console.log('');

console.log('📋 环境变量状态:');
const dbUrl = process.env.DATABASE_URL;
console.log(`DATABASE_URL: ${dbUrl ? dbUrl.substring(0, 30) + '...' : '未设置'}`);
console.log('');

console.log('🔧 Prisma配置检查:');

// 复制 lib/prisma.ts 中的检查逻辑
const isDatabaseConfigured = () => {
  const dbUrl = process.env.DATABASE_URL
  return dbUrl && dbUrl !== 'postgresql://postgres:password@localhost:5432/sybau_picture'
}

const isConfigured = isDatabaseConfigured();
console.log(`数据库配置状态: ${isConfigured ? '✅ 已配置' : '❌ 未配置'}`);

if (!isConfigured) {
  console.log('');
  console.log('❌ 问题诊断:');
  if (!process.env.DATABASE_URL) {
    console.log('  - DATABASE_URL 环境变量未设置');
  } else if (process.env.DATABASE_URL === 'postgresql://postgres:password@localhost:5432/sybau_picture') {
    console.log('  - DATABASE_URL 使用默认值，需要更新为实际连接字符串');
  }
  console.log('');
  console.log('🚨 结果: NextAuth无法保存用户到数据库!');
} else {
  console.log('✅ 数据库配置正确');
}

console.log('');
console.log('📋 当前环境检查:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || '未设置'}`);
console.log(`PWD: ${process.cwd()}`);

// 尝试加载 Prisma 客户端
console.log('');
console.log('🧪 测试Prisma客户端加载:');

try {
  const { prisma } = require('../lib/prisma');
  if (prisma) {
    console.log('✅ Prisma客户端已初始化');
  } else {
    console.log('❌ Prisma客户端为null - 这就是问题所在!');
  }
} catch (error) {
  console.log('❌ Prisma客户端加载失败:', error.message);
}
