const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

function updateEnvFile(updates) {
  const envPath = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local 文件不存在');
    return;
  }

  let content = fs.readFileSync(envPath, 'utf8');

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (content.match(regex)) {
      content = content.replace(regex, `${key}="${value}"`);
    } else {
      content += `\n${key}="${value}"`;
    }
  }

  fs.writeFileSync(envPath, content);
}

async function promptForInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('🚀 Sybau Picture 快速设置向导');
  console.log('================================');

  // 自动生成 NEXTAUTH_SECRET
  const secret = generateSecret();
  console.log(`✅ 已生成 NEXTAUTH_SECRET: ${secret.substring(0, 10)}...`);

  // 获取用户输入
  const googleClientId = await promptForInput('请输入 Google Client ID (留空跳过): ');
  const googleClientSecret = await promptForInput('请输入 Google Client Secret (留空跳过): ');
  const databaseUrl = await promptForInput('请输入 Database URL (留空跳过): ');

  // 准备更新
  const updates = {
    'NEXTAUTH_SECRET': secret,
    'NEXTAUTH_URL': 'http://localhost:3000',
    'NEXT_PUBLIC_APP_URL': 'http://localhost:3000',
    'NEXT_PUBLIC_BASE_URL': 'http://localhost:3000'
  };

  if (googleClientId) {
    updates['GOOGLE_CLIENT_ID'] = googleClientId;
  }

  if (googleClientSecret) {
    updates['GOOGLE_CLIENT_SECRET'] = googleClientSecret;
  }

  if (databaseUrl) {
    updates['DATABASE_URL'] = databaseUrl;
  }

  // 更新环境变量文件
  updateEnvFile(updates);

  console.log('\n✅ 配置已更新！');
  console.log('\n📋 当前配置状态：');
  console.log(`✅ NEXTAUTH_SECRET: 已自动生成`);
  console.log(`✅ NEXTAUTH_URL: http://localhost:3000`);
  console.log(`${googleClientId ? '✅' : '❌'} GOOGLE_CLIENT_ID: ${googleClientId || '未设置'}`);
  console.log(`${googleClientSecret ? '✅' : '❌'} GOOGLE_CLIENT_SECRET: ${googleClientSecret || '未设置'}`);
  console.log(`${databaseUrl ? '✅' : '❌'} DATABASE_URL: ${databaseUrl || '未设置'}`);

  console.log('\n🎯 下一步：');
  if (!googleClientId || !googleClientSecret) {
    console.log('1. 按照 Google_OAuth_配置指南.md 设置 Google OAuth');
  }
  if (!databaseUrl) {
    console.log('2. 配置数据库连接');
  }
  console.log('3. 重启开发服务器: npm run dev');
  console.log('4. 运行测试: node scripts/test-oauth-config.js');

  rl.close();
}

main().catch(console.error);
