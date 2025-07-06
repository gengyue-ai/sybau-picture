#!/usr/bin/env node

/**
 * Google OAuth Setup Helper
 * 帮助用户快速配置Google OAuth认证
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🔐 Sybau Picture - Google OAuth配置助手');
  console.log('========================================');
  console.log('');

  console.log('这个脚本将帮助您配置Google OAuth认证。');
  console.log('');

  console.log('⚠️  在继续之前，请确保您已经：');
  console.log('1. 创建了Google Cloud项目');
  console.log('2. 启用了Google+ API和People API');
  console.log('3. 配置了OAuth consent screen');
  console.log('4. 创建了OAuth客户端凭据');
  console.log('');

  const continueSetup = await askQuestion('是否继续配置? (y/n): ');
  if (continueSetup.toLowerCase() !== 'y') {
    console.log('配置已取消。');
    rl.close();
    return;
  }

  console.log('');
  console.log('📋 请提供以下信息：');
  console.log('');

  // 收集Google OAuth配置
  const googleClientId = await askQuestion('Google Client ID: ');
  const googleClientSecret = await askQuestion('Google Client Secret: ');

  // 生成NEXTAUTH_SECRET
  const nextAuthSecret = crypto.randomBytes(32).toString('base64');
  console.log('');
  console.log('🔑 自动生成的NEXTAUTH_SECRET:', nextAuthSecret);
  console.log('');

  const currentUrl = await askQuestion('当前应用URL (默认: http://localhost:3001): ');
  const nextAuthUrl = currentUrl || 'http://localhost:3001';

  console.log('');
  console.log('📝 正在更新环境变量...');

  // 读取现有的.env.local文件
  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // 更新或添加Google OAuth配置
  const updates = [
    { key: 'GOOGLE_CLIENT_ID', value: googleClientId },
    { key: 'GOOGLE_CLIENT_SECRET', value: googleClientSecret },
    { key: 'NEXTAUTH_URL', value: nextAuthUrl },
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

  console.log('✅ 环境变量配置完成！');
  console.log('');
  console.log('🔧 重要提醒：');
  console.log('1. 请重启开发服务器以应用新配置');
  console.log('2. 确保Google Console中的重定向URI包含：');
  console.log(`   ${nextAuthUrl}/api/auth/callback/google`);
  console.log('');
  console.log('🧪 测试步骤：');
  console.log('1. 重启服务器: npm run dev');
  console.log(`2. 访问: ${nextAuthUrl}/auth/signin`);
  console.log('3. 点击Google登录按钮');
  console.log('4. 完成Google认证流程');
  console.log('');
  console.log('📚 详细配置指南: GOOGLE_OAUTH_SETUP.md');
  console.log('');

  rl.close();
}

main().catch(console.error);
