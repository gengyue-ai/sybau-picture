#!/usr/bin/env node

/**
 * 完成Google OAuth配置
 * 添加客户端密钥
 */

const fs = require('fs');
const path = require('path');

// 用户提供的Google OAuth客户端密钥
const GOOGLE_CLIENT_SECRET = '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';

console.log('🔐 完成Google OAuth配置');
console.log('=====================');
console.log('');
console.log('🔑 添加客户端密钥...');

// 读取现有的.env.local文件
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// 添加客户端密钥
const regex = new RegExp(`^GOOGLE_CLIENT_SECRET=.*$`, 'm');
const line = `GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET}"`;

if (envContent.match(regex)) {
  envContent = envContent.replace(regex, line);
} else {
  envContent += `\n${line}`;
}

// 写入文件
fs.writeFileSync(envPath, envContent.trim() + '\n');

console.log('✅ 客户端密钥已添加！');
console.log('');
console.log('🔧 配置完成检查:');

// 验证配置
require('dotenv').config({ path: '.env.local' });

const configs = [
  { name: 'GOOGLE_CLIENT_ID', value: process.env.GOOGLE_CLIENT_ID },
  { name: 'GOOGLE_CLIENT_SECRET', value: process.env.GOOGLE_CLIENT_SECRET },
  { name: 'NEXTAUTH_URL', value: process.env.NEXTAUTH_URL },
  { name: 'NEXTAUTH_SECRET', value: process.env.NEXTAUTH_SECRET }
];

configs.forEach(({ name, value }) => {
  if (value) {
    console.log(`✅ ${name}: 已设置`);
  } else {
    console.log(`❌ ${name}: 未设置`);
  }
});

console.log('');
console.log('🎉 Google OAuth配置完成！');
console.log('');
console.log('🚀 下一步操作:');
console.log('1. 重启开发服务器: npm run dev');
console.log('2. 测试API路由: npm run auth:test');
console.log('3. 访问登录页面: http://localhost:3001/auth/signin');
console.log('4. 点击Google登录按钮进行测试');
console.log('');
console.log('📋 Google Console重定向URI确认:');
console.log('   http://localhost:3001/api/auth/callback/google');
console.log('   http://localhost:3000/api/auth/callback/google');
console.log('');
