#!/usr/bin/env node

/**
 * 检查OAuth配置脚本
 */

const fs = require('fs');
const path = require('path');

function checkOAuthConfig() {
  console.log('🔍 检查OAuth配置...');
  console.log('========================');
  console.log('');

  // 检查环境变量文件
  const envPath = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local 文件不存在');
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');

  console.log('📋 环境变量检查:');
  console.log('');

  // 检查必需的OAuth环境变量
  const requiredVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ];

  let allPresent = true;

  requiredVars.forEach(varName => {
    const found = lines.find(line => line.startsWith(`${varName}=`));
    if (found) {
      const value = found.split('=')[1];
      if (varName === 'GOOGLE_CLIENT_SECRET' || varName === 'NEXTAUTH_SECRET') {
        console.log(`✅ ${varName}: ${value.substring(0, 10)}...`);
      } else {
        console.log(`✅ ${varName}: ${value}`);
      }
    } else {
      console.log(`❌ ${varName}: 未设置`);
      allPresent = false;
    }
  });

  console.log('');

  if (allPresent) {
    console.log('✅ 所有OAuth环境变量都已设置');
  } else {
    console.log('❌ 缺少必需的OAuth环境变量');
  }

  console.log('');
  console.log('🔧 Google OAuth配置检查:');

  // 检查Google Client ID格式
  const clientIdLine = lines.find(line => line.startsWith('GOOGLE_CLIENT_ID='));
  if (clientIdLine) {
    const clientId = clientIdLine.split('=')[1];
    if (clientId && clientId.endsWith('.apps.googleusercontent.com')) {
      console.log('✅ Google Client ID 格式正确');
    } else {
      console.log('❌ Google Client ID 格式不正确');
    }
  }

  // 检查NEXTAUTH_URL
  const nextAuthUrlLine = lines.find(line => line.startsWith('NEXTAUTH_URL='));
  if (nextAuthUrlLine) {
    const url = nextAuthUrlLine.split('=')[1];
    if (url === 'http://localhost:3001') {
      console.log('✅ NEXTAUTH_URL 端口配置正确');
    } else {
      console.log(`⚠️ NEXTAUTH_URL: ${url} (检查端口是否为3001)`);
    }
  }

  console.log('');
  console.log('📋 故障排除建议:');
  console.log('');

  if (!allPresent) {
    console.log('1. 缺少环境变量 - 需要添加到 .env.local');
  } else {
    console.log('1. ✅ 环境变量配置完整');
  }

  console.log('2. 检查浏览器控制台 (F12) 是否有错误');
  console.log('3. 验证Google Console重定向URI是否为:');
  console.log('   http://localhost:3001/api/auth/callback/google');
  console.log('4. 确认服务器重启后环境变量生效');
}

checkOAuthConfig();
