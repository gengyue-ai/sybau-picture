#!/usr/bin/env node

/**
 * 测试OAuth Providers
 * 验证Google OAuth配置
 */

const http = require('http');

async function testOAuthProviders() {
  console.log('🧪 测试OAuth Providers');
  console.log('====================');
  console.log('');

  try {
    const response = await makeRequest('http://localhost:3001/api/auth/providers');

    if (response.statusCode === 200) {
      console.log('✅ Providers端点正常响应');
      console.log('');

      try {
        const providers = JSON.parse(response.body);
        console.log('📋 配置的认证提供商:');

        Object.keys(providers).forEach(key => {
          const provider = providers[key];
          console.log(`- ${provider.name} (${provider.type})`);
          if (provider.id === 'google') {
            console.log('  ✅ Google OAuth已配置');
          }
        });

        if (providers.google) {
          console.log('');
          console.log('🎉 Google OAuth配置成功！');
          console.log('');
          console.log('🚀 现在可以测试Google登录:');
          console.log('1. 访问: http://localhost:3001/auth/signin');
          console.log('2. 点击Google登录按钮');
          console.log('3. 完成Google认证流程');
        } else {
          console.log('');
          console.log('⚠️  Google OAuth未找到在providers中');
        }

      } catch (parseError) {
        console.log('❌ 解析响应失败:', parseError.message);
        console.log('响应内容:', response.body);
      }

    } else {
      console.log(`❌ Providers端点错误: ${response.statusCode}`);
      console.log('响应内容:', response.body);
    }

  } catch (error) {
    console.log('❌ 连接失败:', error.message);
  }
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

    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error('请求超时'));
    });
  });
}

testOAuthProviders().catch(console.error);
