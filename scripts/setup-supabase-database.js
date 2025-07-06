#!/usr/bin/env node

/**
 * Supabase数据库配置脚本
 * 配置环境变量并准备数据库迁移
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function setupSupabaseDatabase() {
  console.log('🚀 配置Supabase数据库...');
  console.log('================================');
  console.log('');

  // 正确的Supabase连接字符串
  const supabaseUrl = 'postgresql://postgres.niqywjbgqkfvuqhngbxm:Funinhand1122@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

  // 读取现有的环境变量
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ 找到现有的 .env.local 文件');
  } else {
    console.log('📝 创建新的 .env.local 文件');
  }

  // 更新或添加数据库URL
  const lines = envContent.split('\n');
  let databaseUrlFound = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('DATABASE_URL=')) {
      lines[i] = `DATABASE_URL="${supabaseUrl}"`;
      databaseUrlFound = true;
      console.log('✅ 更新 DATABASE_URL');
      break;
    }
  }

  if (!databaseUrlFound) {
    lines.push(`DATABASE_URL="${supabaseUrl}"`);
    console.log('✅ 添加 DATABASE_URL');
  }

  // 写入更新后的环境变量
  fs.writeFileSync(envPath, lines.join('\n'));

  console.log('');
  console.log('📋 数据库配置完成！');
  console.log('');

  // 显示下一步操作
  console.log('🔄 准备数据库迁移...');
  console.log('');
  console.log('执行以下命令来初始化数据库：');
  console.log('');
  console.log('1. 生成Prisma客户端:');
  console.log('   npx prisma generate');
  console.log('');
  console.log('2. 创建数据库表:');
  console.log('   npx prisma db push');
  console.log('');
  console.log('3. 运行数据库种子数据:');
  console.log('   npx prisma db seed');
  console.log('');

  return true;
}

// 运行配置
try {
  setupSupabaseDatabase();
  console.log('🎉 Supabase数据库配置成功！');
} catch (error) {
  console.error('❌ 配置失败:', error.message);
  process.exit(1);
}
