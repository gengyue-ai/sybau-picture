#!/usr/bin/env node

/**
 * 快速Google OAuth配置脚本
 * 使用用户提供的客户端ID
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 用户提供的Google OAuth客户端ID
const GOOGLE_CLIENT_ID = '42563097606-e6side6jo8k1l42rqh1pqfenfc9rn4u7.apps.googleusercontent.com';

console.log('🔐 快速Google OAuth配置');
console.log('======================');
console.log('');
console.log('📋 使用提供的客户端ID:', GOOGLE_CLIENT_ID);
console.log('');

// 生成NEXTAUTH_SECRET
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('🔑 生成的NEXTAUTH_SECRET:', nextAuthSecret);
console.log('');

// 读取现有的.env.local文件
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// 更新或添加配置
const updates = [
  { key: 'GOOGLE_CLIENT_ID', value: GOOGLE_CLIENT_ID },
  { key: 'NEXTAUTH_URL', value: 'http://localhost:3001' },
  { key: 'NEXTAUTH_SECRET', value: nextAuthSecret }
];

updates.forEach(({ key, value }) => {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  const line = `${key}="${value}"`;

  if (envContent.match(regex)) {
    envContent = envContent.replace(regex, line);
  } else {
    envContent += `\n${line}`;
  }
});

// 写入文件
fs.writeFileSync(envPath, envContent.trim() + '\n');

console.log('✅ 环境变量已更新！');
console.log('');
console.log('⚠️  还需要配置:');
console.log('1. GOOGLE_CLIENT_SECRET - 请从Google Console获取客户端密钥');
console.log('2. 重启开发服务器以应用新配置');
console.log('');
console.log('📋 Google Console重定向URI应设置为:');
console.log('   http://localhost:3001/api/auth/callback/google');
console.log('   http://localhost:3000/api/auth/callback/google');
console.log('');
console.log('🧪 测试步骤:');
console.log('1. 获取客户端密钥并添加到.env.local');
console.log('2. 重启服务器: npm run dev');
console.log('3. 访问: http://localhost:3001/auth/signin');
console.log('4. 测试Google登录');
console.log('');
