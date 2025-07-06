#!/usr/bin/env node

/**
 * 检查构建状态和页面错误
 */

const http = require('http');
const https = require('https');

function checkPage(url, pageName) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https:') ? https : http;

    const req = protocol.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const result = {
          page: pageName,
          status: res.statusCode,
          success: res.statusCode === 200,
          hasError: data.includes('Application error') || data.includes('Error:') || data.includes('404'),
          size: data.length
        };
        resolve(result);
      });
    });

    req.on('error', (err) => {
      resolve({
        page: pageName,
        status: 'Error',
        success: false,
        hasError: true,
        error: err.message
      });
    });

    req.setTimeout(10000, () => {
      req.abort();
      resolve({
        page: pageName,
        status: 'Timeout',
        success: false,
        hasError: true,
        error: 'Request timeout'
      });
    });
  });
}

async function checkBuildStatus() {
  console.log('🔍 检查构建状态和页面错误...');
  console.log('================================');
  console.log('');

  const pages = [
    { url: 'http://localhost:3001', name: 'Home' },
    { url: 'http://localhost:3001/pricing', name: 'Pricing' },
    { url: 'http://localhost:3001/gallery', name: 'Gallery' },
    { url: 'http://localhost:3001/auth/signin', name: 'Sign In' },
    { url: 'http://localhost:3001/api/auth/session', name: 'Auth Session API' }
  ];

  console.log('📋 检查页面状态...');
  console.log('');

  const results = [];

  for (const page of pages) {
    process.stdout.write(`  检查 ${page.name}... `);
    const result = await checkPage(page.url, page.name);
    results.push(result);

    if (result.success) {
      console.log(`✅ ${result.status}`);
    } else {
      console.log(`❌ ${result.status} ${result.error || ''}`);
    }
  }

  console.log('');
  console.log('📊 结果总结：');
  console.log('=============');
  console.log('');

  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => r.hasError).length;

  console.log(`✅ 成功页面: ${successCount}/${results.length}`);
  console.log(`❌ 错误页面: ${errorCount}/${results.length}`);
  console.log('');

  if (errorCount > 0) {
    console.log('❌ 发现错误的页面：');
    results.filter(r => r.hasError).forEach(r => {
      console.log(`  - ${r.page}: ${r.error || r.status}`);
    });
    console.log('');
  }

  // 检查特定的构建错误
  console.log('🔧 检查常见构建问题...');
  console.log('');

  // 检查环境变量
  const envVars = [
    'DATABASE_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'FAL_KEY'
  ];

  console.log('📋 环境变量检查：');
  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`  ❌ ${varName}: 未设置`);
    }
  });

  console.log('');

  if (successCount === results.length) {
    console.log('🎉 所有页面构建正常！');
    console.log('');
    console.log('🚀 现在可以开始测试：');
    console.log('  1. 访问: http://localhost:3001/pricing');
    console.log('  2. 测试Google登录');
    console.log('  3. 测试支付流程');
  } else {
    console.log('⚠️  发现页面构建问题，请检查上述错误详情');
  }

  console.log('');
}

// 运行检查
checkBuildStatus().catch(console.error);
