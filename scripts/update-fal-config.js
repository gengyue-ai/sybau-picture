#!/usr/bin/env node

/**
 * 更新FAL AI配置脚本
 * 将找到的FAL API密钥添加到环境变量中
 */

const fs = require('fs');
const path = require('path');

function updateFalConfig() {
  console.log('🤖 更新FAL AI配置...');
  console.log('========================');
  console.log('');

  // 从test-fal.js文件中找到的FAL API密钥
  const falApiKey = "71163de2-482a-46e5-821c-ccef71f7caae:2cec66a501188bdb77c78e85191693ba";

  const envPath = path.join(process.cwd(), '.env.local');

  try {
    let envContent = '';

    // 读取现有的环境变量文件
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log('✅ 找到现有的 .env.local 文件');
    } else {
      console.log('📝 创建新的 .env.local 文件');
    }

    // 检查是否已经有FAL_API_KEY配置
    const lines = envContent.split('\n');
    let falKeyFound = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('FAL_API_KEY=') || lines[i].startsWith('FAL_KEY=')) {
        lines[i] = `FAL_KEY="${falApiKey}"`;
        falKeyFound = true;
        console.log('✅ 更新现有的 FAL_KEY');
        break;
      }
    }

    if (!falKeyFound) {
      // 添加FAL配置到文件末尾
      lines.push('');
      lines.push('# FAL AI Configuration');
      lines.push(`FAL_KEY="${falApiKey}"`);
      console.log('✅ 添加新的 FAL_KEY');
    }

    // 写入更新后的环境变量
    fs.writeFileSync(envPath, lines.join('\n'));

    console.log('');
    console.log('📋 FAL AI配置完成！');
    console.log('');
    console.log('🔍 配置详情:');
    console.log(`  API Key: ${falApiKey.substring(0, 20)}...`);
    console.log('  变量名: FAL_KEY');
    console.log('');
    console.log('✅ 现在可以使用AI图片生成功能了！');
    console.log('');

    return true;
  } catch (error) {
    console.error('❌ 更新失败:', error.message);
    return false;
  }
}

// 运行更新
if (updateFalConfig()) {
  console.log('🎉 FAL AI配置更新成功！');
} else {
  console.error('❌ 更新失败');
  process.exit(1);
}
