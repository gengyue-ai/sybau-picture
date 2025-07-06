#!/usr/bin/env node

/**
 * NextAuth API Route Test
 * 测试NextAuth API路由是否正常工作
 */

const http = require('http');

async function testNextAuthAPI() {
  console.log('🧪 NextAuth API 路由测试');
  console.log('=========================');
  console.log('');

  const baseUrl = 'http://localhost:3001';

  const endpoints = [
    '/api/auth/providers',
    '/api/auth/signin',
    '/api/auth/session',
    '/api/auth/csrf'
  ];

  console.log('🔍 测试NextAuth API端点...');
  console.log('');

  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${baseUrl}${endpoint}`);

      if (response.statusCode === 200) {
        console.log(`✅ ${endpoint}: 正常 (${response.statusCode})`);
      } else if (response.statusCode === 405) {
        console.log(`⚠️  ${endpoint}: 方法不允许 (${response.statusCode}) - 端点存在`);
      } else {
        console.log(`❌ ${endpoint}: 错误 (${response.statusCode})`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: 无法连接 - ${error.message}`);
    }
  }

  console.log('');
  console.log('📋 测试结果说明:');
  console.log('- ✅ 正常: API端点工作正常');
  console.log('- ⚠️  方法不允许: 端点存在但需要特定的HTTP方法');
  console.log('- ❌ 错误: API端点有问题或未配置');
  console.log('');
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.abort();
      reject(new Error('请求超时'));
    });
  });
}

testNextAuthAPI().catch(console.error);
